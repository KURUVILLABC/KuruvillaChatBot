# IndexedDB Knowledge Storage Skill

## Purpose

Design and implement browser-based persistence of knowledge base versions using IndexedDB with Dexie.js, ensuring atomic replacement of versions and offline capability.

## When To Use

Use this Skill when implementing browser-side storage, retrieval, and versioning of knowledge base. Apply whenever you need to:
- Store knowledge base versions in IndexedDB
- Replace old version with new atomically
- Load KB offline
- Manage multiple KB versions

## Preconditions

1. Dexie.js library installed (`npm install dexie`)
2. Knowledge base schema is defined (TypeScript types)
3. Frontend storage service is being implemented
4. Browser supports IndexedDB (all modern browsers)

## Inputs

- Knowledge base object (validated, versioned)
- Previous storage state (if any)
- Storage quota remaining (browser dependent: typically 50MB+)

## Procedure

### Step 1: Define Database Schema

```typescript
import Dexie, { Table } from 'dexie';
import { Knowledge, KnowledgeVersion } from '../types';

export class ProfileAIDB extends Dexie {
  versions!: Table<KnowledgeVersion>;
  metadata!: Table<StorageMetadata>;
  
  constructor() {
    super('ProfileAI_DB');
    this.version(1).stores({
      versions: '&id, version, isActive, publishedAt',
      metadata: '&key',
    });
  }
}

export const db = new ProfileAIDB();
```

### Step 2: Define TypeScript Types

```typescript
interface KnowledgeVersion {
  id: string;                    // UUID
  version: string;               // "1.0.0"
  content: Knowledge;            // Full KB content
  publishedAt: Date;
  isActive: boolean;
  createdAt: Date;
  sourceHash: string;            // For change detection
}

interface StorageMetadata {
  key: string;                   // "lastSync", "currentVersion"
  value: any;
  updatedAt: Date;
}
```

### Step 3: Implement Storage Abstraction

```typescript
class KnowledgeStorage {
  // Read active version
  async getActiveKnowledgeBase(): Promise<Knowledge | null> {
    const version = await db.versions
      .where('isActive')
      .first();
    
    return version?.content || null;
  }
  
  // Get specific version
  async getVersion(versionId: string): Promise<Knowledge | null> {
    const version = await db.versions
      .where('id')
      .equals(versionId)
      .first();
    
    return version?.content || null;
  }
  
  // List all versions
  async listVersions(): Promise<KnowledgeVersion[]> {
    return db.versions
      .orderBy('publishedAt')
      .reverse()
      .toArray();
  }
}
```

### Step 4: Implement Atomic Replacement

This is critical — never partially update the KB.

```typescript
async replaceKnowledgeBase(
  newKB: Knowledge,
  newVersion: string
): Promise<void> {
  return db.transaction('rw', db.versions, db.metadata, async () => {
    // Step 1: Mark old active as inactive
    const oldActive = await db.versions
      .where('isActive')
      .first();
    
    if (oldActive) {
      oldActive.isActive = false;
      await db.versions.put(oldActive);
    }
    
    // Step 2: Insert new version as active
    const newEntry: KnowledgeVersion = {
      id: crypto.randomUUID(),
      version: newVersion,
      content: newKB,
      publishedAt: new Date(),
      isActive: true,
      createdAt: new Date(),
      sourceHash: computeHash(newKB),
    };
    
    await db.versions.add(newEntry);
    
    // Step 3: Update metadata
    await db.metadata.put({
      key: 'currentVersion',
      value: newVersion,
      updatedAt: new Date(),
    });
    
    // If transaction fails, NOTHING is committed
    // Old version remains active
  });
}
```

### Step 5: Implement Offline Loading

```typescript
class AppInitializer {
  async initialize(): Promise<void> {
    try {
      // Try to load from IndexedDB first (offline)
      const kb = await storage.getActiveKnowledgeBase();
      
      if (kb) {
        // We have cached KB, can proceed
        this.useKnowledgeBase(kb);
        
        // Optionally: sync in background
        this.syncInBackground();
      } else {
        // No cached KB
        this.showSyncPrompt();
      }
    } catch (error) {
      logger.error('Storage initialization failed', error);
      this.showErrorMessage();
    }
  }
}
```

### Step 6: Handle Storage Quota

```typescript
async checkStorageHealth(): Promise<void> {
  if (navigator.storage && navigator.storage.estimate) {
    const { usage, quota } = await navigator.storage.estimate();
    const percentUsed = (usage / quota) * 100;
    
    if (percentUsed > 80) {
      logger.warn(`Storage ${percentUsed}% full, cleaning old versions`);
      await this.cleanOldVersions();
    }
  }
}

async cleanOldVersions(keepCount: number = 3): Promise<void> {
  const versions = await storage.listVersions();
  
  if (versions.length > keepCount) {
    const toDelete = versions.slice(keepCount);
    
    for (const version of toDelete) {
      await db.versions.delete(version.id);
    }
    
    logger.info(`Cleaned up ${toDelete.length} old KB versions`);
  }
}
```

### Step 7: Error Recovery

```typescript
async repairStorage(): Promise<void> {
  try {
    // Check consistency
    const active = await db.versions
      .where('isActive')
      .toArray();
    
    if (active.length > 1) {
      // Multiple active — invalid state
      logger.error('Storage corruption: multiple active versions');
      
      // Keep newest, deactivate others
      const sorted = active.sort((a, b) => 
        b.publishedAt.getTime() - a.publishedAt.getTime()
      );
      
      const newest = sorted[0];
      
      for (const version of sorted.slice(1)) {
        version.isActive = false;
        await db.versions.put(version);
      }
    }
    
    if (active.length === 0) {
      logger.error('Storage corruption: no active version');
      // UI should show "sync required"
    }
  } catch (error) {
    logger.error('Repair failed', error);
    // Last resort: clear and start over
    await db.delete();
  }
}
```

## Validation

- Only one version is ever `isActive`
- All versions have valid, unique IDs
- Timestamps are in chronological order
- KB content validates against schema
- Transaction succeeds completely or not at all

## Failure Handling

| Situation | Behavior |
|-----------|----------|
| IndexedDB not available | Use memory cache only, show warning |
| Transaction fails | Rollback automatically, keep previous KB active |
| Corruption detected | Log error, offer to clear and re-sync |
| Quota exceeded | Delete old versions, log warning |
| Invalid new KB | Reject transaction, keep old KB |

## Best Practices

1. **Always use transactions** for multi-step operations
2. **Atomic replacement**: Mark new as active in same transaction
3. **Keep 2-3 versions** for rollback capability
4. **Check quota** periodically
5. **Validate before storing** at backend AND browser
6. **Log all operations** for debugging

## Anti-Patterns

❌ **Don't**: Delete old KB then add new KB (might fail in middle)
✓ **Do**: Add new, mark active, delete old in one transaction

❌ **Don't**: Store entire KB in memory
✓ **Do**: Load from IndexedDB on app start

❌ **Don't**: Assume IndexedDB always available
✓ **Do**: Fall back gracefully

❌ **Don't**: Store secrets in IndexedDB
✓ **Do**: Store only public knowledge base data

❌ **Don't**: Keep unlimited versions
✓ **Do**: Periodically clean old versions

## Expected Output

```typescript
// After successful replacement:
const kb = await storage.getActiveKnowledgeBase();
console.log(kb.version);  // "1.2.0"
console.log(kb.profile.name);  // "John Doe"

// List all versions:
const allVersions = await storage.listVersions();
// [
//   { version: "1.2.0", isActive: true, publishedAt: ... },
//   { version: "1.1.0", isActive: false, publishedAt: ... },
//   { version: "1.0.0", isActive: false, publishedAt: ... },
// ]

// Offline: even without internet, can still chat
const cachedKB = await storage.getActiveKnowledgeBase();  // ✓ Works offline
```

---

**Skill Version**: 1.0  
**Status**: To be implemented (Phase 7)  
**Complexity**: Medium (transactions + error handling)  
**Dependencies**: Dexie.js, TypeScript, modern browser

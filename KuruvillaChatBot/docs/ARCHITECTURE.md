# Architecture - Profile AI Knowledge System & Grounded Chatbot

**Document Version**: 1.0.0  
**Status**: PHASE 0 Design  
**Last Updated**: 2025-01-15

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architectural Principles](#architectural-principles)
3. [Component Architecture](#component-architecture)
4. [Data Flow](#data-flow)
5. [Layer Definitions](#layer-definitions)
6. [Module Boundaries](#module-boundaries)
7. [Design Patterns](#design-patterns)
8. [Error Handling](#error-handling)
9. [State Management](#state-management)
10. [Security Boundaries](#security-boundaries)
11. [Future Extensibility](#future-extensibility)

---

## System Overview

The application is a **modular monolith** consisting of:

```
┌──────────────────────────────────────────────────────────┐
│         Browser (React Frontend)                         │
│  ┌──────────────────────────────────────────────────────┐│
│  │ Chat UI | Profile Display | Sync Status | Admin Panel││
│  └──────────┬───────────────────────────────────────────┘│
│             │ (REST API)                                  │
│             ▼                                             │
│  ┌──────────────────────────────────────────────────────┐│
│  │           IndexedDB Storage Layer                    ││
│  │  (Active KB, Versions, Metadata, Conversations)      ││
│  └──────────────────────────────────────────────────────┘│
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────────┐
        │   Node.js + Fastify      │
        │   Backend API Server     │
        └───┬──────────────┬───┬──┐
            │              │   │  │
            ▼              ▼   ▼  ▼
        ┌──────┐      ┌─────┐  ┌─────┐
        │Cache │   ┌─ │ AI  │  │Other│
        │Layer │   │  │     │  │APIs │
        └──────┘   │  └─────┘  └─────┘
                   │
        ┌──────────┴────────┬────────────┐
        ▼                   ▼            ▼
    LinkedIn API       GitHub API    Manual KB
    (if available)                   (JSON file)
    
        ▼                   ▼            ▼
    ┌───────────────────────────────────────┐
    │  Normalization & Unification Layer    │
    │  (Maps all sources to unified model)  │
    └───────────┬─────────────────────────┘
                ▼
    ┌───────────────────────────────────────┐
    │  Knowledge Engine                     │
    │  ├─ Builder (from sources)           │
    │  ├─ Merger (combine with manual)     │
    │  ├─ Validator (schema + semantics)   │
    │  └─ Versioner (immutable versions)   │
    └───────────┬─────────────────────────┘
                ▼
    ┌───────────────────────────────────────┐
    │  Published Knowledge Base             │
    │  (Validated, versioned JSON)          │
    │  (Stored as file or DB)               │
    └─────────────────────────────────────┘
    
    SYNC FLOW:
    
    Sources → Fetch → Normalize → Build KB →
    Merge with Manual → Validate → Version →
    Publish → Browser IndexedDB
```

---

## Architectural Principles

### 1. **Separation of Concerns**

Each component has a single, well-defined responsibility:

- **Provider Adapters**: Interface with external APIs (LinkedIn, GitHub, AI)
- **Normalization Layer**: Convert external formats to internal model
- **Knowledge Engine**: Generate, validate, merge, and version knowledge
- **Storage Layer**: Persist and retrieve knowledge
- **Retrieval Layer**: Query and fetch knowledge for chatbot
- **Chatbot Layer**: Conversational interface with grounding
- **API Layer**: HTTP endpoints and request routing

### 2. **Dependency Inversion**

Business logic depends on abstractions, not concrete implementations:

```
ChatService (depends on)
    ↓
AIProvider (abstract interface)
    ├─ OpenAIProvider
    ├─ AnthropicProvider
    └─ MockAIProvider

KnowledgeRetriever (abstract)
    ├─ StructuredRetriever
    └─ VectorRetriever (future)
```

This allows swapping implementations without rewriting consumers.

### 3. **Immutable Knowledge Versioning**

Every published knowledge base is immutable:

```json
{
  "version": "1.2.0",
  "generatedAt": "2025-01-15T10:30:00Z",
  "content": { /* knowledge data */ },
  "previousVersion": "1.1.0",
  "isActive": true
}
```

Rollback is possible; corruption recovery is safe.

### 4. **Provenance Tracking**

Every significant fact includes source information:

```json
{
  "fact": "Worked at Company X",
  "source": {
    "type": "linkedin",
    "retrievedAt": "2025-01-15T09:00:00Z",
    "externalId": "company-123"
  }
}
```

Enables auditing, debugging, and future fact verification.

### 5. **Atomic State Transitions**

Knowledge base updates are all-or-nothing:

```
1. Generate new KB
2. Validate completely
3. If valid: mark as active
4. If invalid: keep previous KB
```

Never partially apply changes.

### 6. **Fail-Closed Security**

Errors default to secure behavior:

- Reject invalid data rather than guessing
- Deny access rather than allowing by accident
- Preserve known-good state rather than accepting corrupted state

---

## Component Architecture

### Frontend Components

#### 1. **Chat Interface**
- Message input and send
- Message history display
- Typing indicator
- Error states
- Suggested questions

#### 2. **Profile Display**
- Profile card (name, title, bio)
- Quick facts from knowledge base
- Skills, projects, experience sections

#### 3. **Sync Status**
- Last sync timestamp
- Current KB version
- Source status (LinkedIn, GitHub)
- Manual sync button

#### 4. **Admin Panel**
- Configuration display
- Knowledge base status
- Source connection status
- Manual rebuild trigger
- Additional knowledge editor

### Backend Services

#### 1. **Provider Adapters**

**LinkedInProvider**:
```
fetch() → normalized experience, education, skills
handles: auth, rate limits, errors, tokens
```

**GitHubProvider**:
```
fetch() → normalized profile, repos, languages
handles: rate limits, pagination, caching
```

**AIProvider** (abstraction):
```
chat(messages, systemPrompt) → response
handles: rate limits, retries, JSON parsing
```

#### 2. **Normalization Layer**

**KnowledgeNormalizer**:
```
normalizeLinkedInData(raw) → UnifiedProfile
normalizeGitHubData(raw) → UnifiedProfile
```

Guarantees all external data uses the same internal model.

#### 3. **Knowledge Engine**

**KnowledgeBuilder**:
```
build(linkedIn, github) → Knowledge Base
- Combines multiple sources
- Deduplicates facts
- Adds structure
```

**KnowledgeMerger**:
```
merge(generatedKB, additionalKnowledge) → merged KB
- Preserves manual overrides
- Detects conflicts
- Maintains precedence
```

**KnowledgeValidator**:
```
validate(kb) → { valid: bool, errors: [] }
- Schema validation (Zod)
- Semantic validation
- Provenance validation
- Duplicate detection
```

**KnowledgeVersioner**:
```
version(kb) → VersionedKB
- Increments version
- Computes source hash
- Records timestamp
- Stores previous version
```

#### 4. **Storage Layer**

**Backend**:
```
KnowledgeRepository
├─ save(kb)
├─ get(version)
├─ getActive()
├─ markActive(version)
└─ delete(version)
```

**Frontend (Browser)**:
```
KnowledgeStorage (IndexedDB)
├─ saveVersion(kb)
├─ getActive()
├─ replaceKnowledge(newKB)
├─ offline load capability
└─ atomic transactions
```

#### 5. **Retrieval Layer**

**KnowledgeRetriever** (abstraction):
```
retrieve(query) → [RetrievalResult]
- Initial: StructuredRetriever (section-based)
- Future: VectorRetriever (semantic)
```

#### 6. **Chatbot Layer**

**ChatService**:
```
chat(messages) → response
1. Classify message (greeting vs. question)
2. If greeting: generate conversational response
3. If question: retrieve KB sections
4. Call AI with system prompt + context
5. Validate response for hallucination
6. Return grounded answer
```

---

## Data Flow

### Initialization Flow

```
1. Browser loads
   ↓
2. Load active KB from IndexedDB
   ↓
3. If KB exists: ready for chat
   ↓
4. If no KB: prompt for sync or show empty state
```

### Synchronization Flow

```
1. User initiates sync (or scheduled)
   ↓
2. Backend fetches LinkedIn profile
   ↓
3. Backend fetches GitHub profile
   ↓
4. Backend normalizes both → UnifiedProfile
   ↓
5. Backend loads additional knowledge (manual overrides)
   ↓
6. Backend builds KB from normalized data
   ↓
7. Backend merges KB with additional knowledge
   ↓
8. Backend validates merged KB (schema + semantic)
   ↓
9. If valid: version and store
   ↓
10. If invalid: log error, keep previous version
   ↓
11. Send new KB version to browser
   ↓
12. Browser validates again (security)
   ↓
13. Browser replaces IndexedDB atomically
   ↓
14. UI updates to show new version
```

### Chat Flow

```
1. User sends message
   ↓
2. Classify message (greeting vs. question)
   ↓
3. If greeting:
   - Generate natural response
   - Return immediately
   ↓
4. If question:
   - Retrieve KB sections matching query
   - Construct system prompt + context
   - Call LLM
   - Validate response (no hallucination)
   - Return grounded answer with sources
```

---

## Layer Definitions

### Layer 1: External APIs
- LinkedIn (if available)
- GitHub REST API
- AI Provider (OpenAI/Anthropic)

### Layer 2: Adapters
- LinkedInProvider
- GitHubProvider
- AIProvider (abstraction)

### Layer 3: Normalization
- KnowledgeNormalizer
- UnifiedProfile model
- Provenance attachment

### Layer 4: Knowledge Engine
- Builder
- Merger
- Validator
- Versioner

### Layer 5: Storage
- Backend repository
- Browser IndexedDB
- File-based additional knowledge

### Layer 6: Retrieval
- StructuredKnowledgeRetriever
- RAG-ready interface (future VectorRetriever)

### Layer 7: Application
- ChatService
- RouteHandlers
- UIComponents

### Layer 8: Middleware
- Authentication
- Validation
- Error handling
- Logging
- Rate limiting

---

## Module Boundaries

```
Frontend Modules:
├─ services/api/           (HTTP communication)
├─ services/chatbot/       (Chat logic)
├─ services/knowledge/     (Retrieval, classification)
├─ services/storage/       (IndexedDB)
├─ components/             (UI rendering)
└─ hooks/                  (State + effects)

Backend Modules:
├─ controllers/            (HTTP request handling)
├─ routes/                 (Endpoint definition)
├─ services/               (Business logic)
│  ├─ linkedin/
│  ├─ github/
│  ├─ ai/
│  ├─ knowledge/
│  ├─ sync/
│  ├─ chat/
│  └─ storage/
├─ schemas/                (Zod validation)
├─ middleware/             (Request processing)
├─ config/                 (Configuration)
└─ utils/                  (Helpers)
```

**Boundary Rules**:
- Frontend MUST NOT call external APIs directly
- Frontend MUST NOT store credentials
- Backend MUST validate all external responses
- Business logic MUST NOT depend on concrete providers
- UI MUST NOT contain business workflows

---

## Design Patterns

### 1. **Provider Pattern**
Used for external integrations (LinkedIn, GitHub, AI):

```typescript
interface AIProvider {
  chat(request: ChatRequest): Promise<ChatResponse>;
  isConfigured(): boolean;
}
```

Benefits:
- Swap implementations without changing consumers
- Mock providers for testing
- Vendor independence

### 2. **Repository Pattern**
Used for data access (knowledge storage):

```typescript
interface KnowledgeRepository {
  save(kb: Knowledge): Promise<void>;
  get(version: string): Promise<Knowledge>;
  delete(version: string): Promise<void>;
}
```

Benefits:
- Abstract storage mechanism
- Future: easy switch to PostgreSQL
- Testable with mock repository

### 3. **Service Layer Pattern**
Used for business logic:

```typescript
class ChatService {
  constructor(
    private retriever: KnowledgeRetriever,
    private ai: AIProvider
  ) {}
}
```

Benefits:
- Separation from HTTP layer
- Reusable across endpoints
- Testable in isolation

### 4. **Strategy Pattern**
Used for pluggable algorithms:

```typescript
interface KnowledgeRetriever {
  retrieve(query: string): Promise<Result[]>;
}
// Initial: StructuredRetriever
// Future: VectorRetriever
```

### 5. **Builder Pattern**
Used for complex object construction:

```typescript
class KnowledgeBuilder {
  fromSources(linkedin, github): KnowledgeBase
  withAdditionalKnowledge(manual): KnowledgeBase
  validate(): ValidationResult
}
```

---

## Error Handling

### Error Classification

```
ValidationError
├─ Schema validation failure
├─ Business rule violation
└─ Type mismatch

ProviderError
├─ API failure
├─ Authentication failure
├─ Rate limiting
└─ Network timeout

StorageError
├─ Database failure
├─ IndexedDB quota exceeded
└─ Corruption detected

ChatError
├─ Hallucination detected
├─ Prompt injection attempted
└─ Malformed AI response
```

### Error Handling Strategy

For each error type:
1. **Log** — Record full error server-side
2. **Classify** — Determine if retryable
3. **Recover** — Attempt automatic recovery if safe
4. **Communicate** — Return safe message to user
5. **Preserve** — Keep known-good state intact

Example:
```typescript
try {
  const kb = await validateKnowledge(candidate);
} catch (error) {
  logger.error("KB validation failed", { error, candidate });
  
  if (isRetryable(error)) {
    await retryWithBackoff();
  } else {
    keepPreviousKnowledgeBase();
    notifyUser("Sync failed, keeping previous version");
  }
}
```

---

## State Management

### Backend State
- **Knowledge versions** (immutable, versioned)
- **Sync state** (timestamps, source hashes)
- **Configuration** (environment variables)
- **Cache** (LinkedIn, GitHub, AI responses)

### Frontend State
- **Active KB** (from IndexedDB)
- **UI state** (chat messages, UI visibility)
- **Sync status** (in progress, last synced)
- **User preferences** (optional, theme, etc.)

### Global State Flow

```
Redux/Context (optional for MVP):
├─ Knowledge (active KB)
├─ Chat (messages, typing state)
├─ Sync (status, progress)
└─ UI (themes, visibility)

Local Component State:
├─ Form inputs
├─ Local UI state (modals, dropdowns)
└─ Temporary UI flags
```

---

## Security Boundaries

### Frontend
```
✗ Can NOT:
  - Call external APIs directly
  - Store credentials
  - Access backend secrets
  - Execute arbitrary code

✓ Can:
  - Display data received from backend
  - Perform client-side validation
  - Manage UI state
  - Call backend API
```

### Backend
```
✓ Must:
  - Validate all input
  - Manage credentials securely
  - Enforce authorization
  - Sanitize error messages
  - Validate external responses

✗ Must NOT:
  - Expose credentials to frontend
  - Trust user-supplied data
  - Log sensitive information
  - Return stack traces
```

### Data in Transit
```
✓ HTTPS always
✓ Secrets never in URLs
✓ Signed requests (if needed)
✓ Rate limiting
```

### Data at Rest
```
✓ Secrets in .env (development)
✓ Secrets in secret manager (production)
✓ Knowledge base: content only (no credentials)
✓ IndexedDB: public data only
```

---

## Future Extensibility

### RAG/Vector Search

Current design supports future migration:

```typescript
// Current: StructuredRetriever
class StructuredRetriever implements KnowledgeRetriever { }

// Future: VectorRetriever
class VectorRetriever implements KnowledgeRetriever {
  constructor(private embeddings: EmbeddingModel) {}
}

// Chatbot uses interface, not implementation
class ChatService {
  constructor(private retriever: KnowledgeRetriever) {}
  // Works with both current and future implementations
}
```

### Voice/Speech

Architecture supports adding:
- Speech-to-text input
- Text-to-speech output
- Audio message support

Without rewriting core components.

### Multiple Profiles

Knowledge schema supports:
- Filtering by profile ID
- Multiple profiles in same KB
- Profile-specific retrieval

### Conversation Memory

IndexedDB can store:
- Conversation history
- User preferences
- Conversation context
- Turn-by-turn analysis

### 3D Avatar

UI can integrate:
- Avatar rendering
- Lip-sync with audio
- Gesture support
- Stateful avatar state

Without affecting backend or knowledge engine.

---

## Performance Considerations

### Caching Strategy

```
Browser Memory (React state) → fastest
        ↓
Browser Storage (IndexedDB) → fast
        ↓
Backend Memory (Node cache) → medium
        ↓
External APIs → slow
```

Cache invalidation:
- LinkedIn: hash-based change detection
- GitHub: ETag/rate limit headers
- AI: short TTL (responses change)

### Lazy Loading

- Load KB sections on-demand
- Paginate large lists
- Defer non-critical data
- Compress large responses

### Optimization Points

- Knowledge retrieval: pre-compute common queries
- Chat: stream long responses
- Frontend: code-split components
- Backend: database queries (when PostgreSQL added)

---

## Testing Strategy

### Unit Tests
- Individual services
- Normalization logic
- Validation rules
- Utility functions

### Integration Tests
- Provider → normalization → KB generation
- Knowledge engine (build → merge → validate)
- Storage (save → read → replace)

### E2E Tests
- Open app → load KB → ask question → receive grounded answer
- Admin: configure → sync → publish → verify

### Mock Strategy
- MockLinkedInProvider (realistic test data)
- MockGitHubProvider (realistic test data)
- MockAIProvider (deterministic responses)
- MockStorage (in-memory IndexedDB)

---

## Deployment Architecture

### Frontend
- Static build (Vite)
- Served from CDN or web server
- Environment config at runtime
- IndexedDB local to browser

### Backend
- Node.js application
- Fastify server
- Environment-based configuration
- Database connection (IndexedDB backend or PostgreSQL)

### Configuration
- Development: .env file
- Staging: environment variables
- Production: secret manager + environment variables

---

## Conclusion

This architecture supports:
- ✓ Clean separation of concerns
- ✓ Vendor independence
- ✓ Testability
- ✓ Future extensibility
- ✓ Security
- ✓ Reliability
- ✓ Grounded AI responses
- ✓ Offline capability

The system is designed as a **modular monolith**, not a premature microservices architecture. Individual components can be replaced or enhanced without system-wide refactoring.

---

**Document Version**: 1.0.0  
**Status**: Phase 0 Design  
**Last Updated**: 2025-01-15

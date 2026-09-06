---
name: git-conflict-resolution
description: "Resolve Git merge conflicts safely and efficiently. Use when: handling merge conflicts, resolving overlapping changes, rebasing branches with conflicts, managing complex multi-way merges, or guiding users through conflict resolution decisions."
argument-hint: "Describe the conflict scenario (e.g., 'merge feature into main has conflicts') or leave empty to auto-detect"
user-invocable: true
---

# Git Conflict Resolution

Safely diagnose, analyze, and resolve Git merge conflicts with clear guidance and automated resolution where possible.

## When to Use

- Merge branches with conflicting changes
- Rebase feature branches with conflicts
- Pull remote changes that conflict locally
- Cherry-pick commits causing conflicts
- Handle multi-way merges (multiple branches)
- Guide team members through conflict resolution
- Verify conflict resolution is correct before committing

## Core Principles

- **Safety First**: Always show what will be changed before resolving
- **Transparency**: Explain why conflicts exist and resolution options
- **Automation**: Resolve non-overlapping changes automatically
- **Guidance**: For complex conflicts, present both versions clearly
- **Verification**: Show diff after resolution to confirm correctness

## Conflict Resolution Workflow

### Phase 1: Detection & Assessment

```bash
# 1. Check current status
git status

# 2. Identify conflicted files
# Look for "both modified" or "both added" markers

# 3. Analyze conflict complexity
git diff [conflicted-file]
```

**Assessment Questions:**
- Are conflicts in overlapping lines? (complex) or separate sections? (safe to auto-resolve)
- Are changes logically incompatible or just textually overlapping?
- Which changes are more recent? Which are from the target branch?

### Phase 2: Resolution Strategy

#### For Non-Overlapping Changes (Safe to Auto-Resolve)
```
✓ Different sections of the file modified
✓ No logical incompatibility
✓ Automatic merge markers don't indicate user error
→ ACTION: Combine both changes, remove conflict markers, test
```

#### For Overlapping Changes (Requires Input)
```
⚠ Same lines modified in both branches
⚠ Logical incompatibility detected
⚠ One change invalidates the other
→ ACTION: Present both versions, ask user which to keep or how to combine
```

#### For Configuration/Import Conflicts
```
⚠ package.json / requirements.txt / imports conflicting
→ ACTION: Suggest merging both sets, removing duplicates
```

### Phase 3: Resolution Execution

**Step-by-step resolution:**

1. **Examine the conflict:**
   ```
   <<<<<<< HEAD (current branch)
   [your code]
   =======
   [incoming code]
   >>>>>>> branch-name
   ```

2. **Decide on resolution:**
   - Keep HEAD version
   - Keep incoming version
   - Combine both (manual edit)
   - Custom solution

3. **Edit the file:**
   - Remove conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
   - Keep the code you want
   - Ensure syntax is valid

4. **Stage the resolved file:**
   ```bash
   git add [resolved-file]
   ```

5. **Verify resolution:**
   ```bash
   git diff --cached [resolved-file]
   ```

6. **Complete the merge:**
   ```bash
   git commit -m "Merge [branch]: resolve conflicts in [file]"
   ```

### Phase 4: Verification

```bash
# Verify no merge markers remain
grep -r "<<<<<<" .

# Check commit history
git log --graph --oneline -n 5

# Test the merged code
npm test  # or appropriate test command
```

## Common Conflict Scenarios

### Scenario 1: Both Modified Same File
```
Conflict: Feature branch modified lines 10-20, main modified lines 15-25
Resolution: Non-overlapping? Merge both. Overlapping? Show both versions.
```

### Scenario 2: File Deleted vs Modified
```
Conflict: One branch deleted file, other modified it
Decision: Keep file (accept modification) or delete (accept deletion)?
```

### Scenario 3: Package Dependencies
```
Conflict: Both added different versions of same library
Resolution: Choose highest compatible version or negotiated version
```

### Scenario 4: Configuration Files
```
Conflict: Different settings applied to config.json
Resolution: Merge configs if non-conflicting, discuss if settings are incompatible
```

## Output Format

```
🔧 CONFLICT ANALYSIS
├─ Status: [analyzing/detected/resolvable/complex]
├─ Files affected: [list]
├─ Type: [overlapping/non-overlapping/deletion/configuration]
├─ Assessment: [why conflict exists]
├─ Your changes: [what HEAD contains]
├─ Incoming changes: [what branch contains]
├─ Recommendation: [auto-resolve/manual-review/discuss]
└─ Action: [performed/awaiting-input/error]
```

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| Unmerged paths | Incomplete conflict resolution | Complete all files, re-check status |
| Merge conflict marker remains | Manual edit missed markers | Search for `<<<<<<<` and remove |
| Merge abort needed | Decision to cancel merge | `git merge --abort` or `git rebase --abort` |
| Push rejected after merge | Remote has newer commits | Pull before pushing |

## Tips for Users

- **Before merging**: Fetch latest remote to ensure up-to-date base
- **Small commits**: Smaller commits mean fewer conflicts
- **Review carefully**: Conflicts often indicate important logic differences
- **Test after**: Always test merged code before pushing to shared branch
- **Document decisions**: Leave comments explaining conflict resolution choices
- **Use worktrees**: Review merge in separate worktree without disrupting main work

## Recovery if Resolution Goes Wrong

```bash
# Undo completed merge commit
git revert -m 1 [merge-commit-hash]

# Or reset to before merge started
git reset --hard ORIG_HEAD

# Or abort ongoing merge
git merge --abort
```

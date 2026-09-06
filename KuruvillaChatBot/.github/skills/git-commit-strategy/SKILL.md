---
name: git-commit-strategy
description: "Stage files and create meaningful commits following best practices. Use when: preparing commits, staging changes, creating commit messages, organizing work into logical commits, undoing commits, amending commits, or managing stash for temporary work."
argument-hint: "Describe what you're committing (e.g., 'add user auth feature') or leave empty to see staged changes"
user-invocable: true
---

# Git Commit Strategy

Create clean, meaningful commits that tell the story of your changes and make history easy to navigate and understand.

## When to Use

- Stage files for commit
- Create commits with meaningful messages
- Organize changes into logical units
- Fix or amend previous commits
- Split large changes into smaller commits
- Temporarily save work with stash
- Recover accidentally deleted commits
- Review what you're about to commit

## Core Principles

- **Atomic Commits**: One logical change per commit
- **Clear Messages**: Describe what and why, not just what
- **Review Before Commit**: Always check diff before committing
- **Single Responsibility**: Don't mix features, refactoring, and formatting
- **Revertible**: Each commit should be independently usable
- **Traceable**: Link to issues and include context

## Commit Message Format

### Standard Format
```
{type}({scope}): {subject}

{body}

{footer}
```

### Types
```
feat:     - New feature
fix:      - Bug fix
docs:     - Documentation
style:    - Formatting/style (no logic change)
refactor: - Code refactoring (no feature/fix)
perf:     - Performance improvement
test:     - Test additions/updates
chore:    - Build, deps, maintenance
ci:       - CI/CD changes
```

### Examples

**Good:**
```
feat(auth): add user login with JWT tokens

Implement JWT-based authentication for user login flow.
Includes token refresh mechanism and secure storage.

Fixes #234
```

```
fix(api): handle null values in user endpoint

Prevent null pointer exception when user profile
has missing optional fields. Add default values.

Fixes #189
```

```
docs: add installation instructions to README

Include step-by-step setup for development environment
and dependencies installation guide.
```

**Avoid:**
```
fixed bugs
updated stuff
final changes
wip
quick fix
```

## Staging Workflow

### View Status
```bash
# Check current state
git status

# See changes in detail
git diff              # unstaged changes
git diff --cached    # staged changes
```

### Stage Specific Files

**Stage individual files:**
```bash
git add path/to/file1.js path/to/file2.py

# Stage all changes in a file (including deletions)
git add filename

# Stage only modifications (not new files)
git add -u

# Stage all changes
git add .
```

**Interactive staging:**
```bash
# Choose which changes to stage (hunk by hunk)
git add -p

# Options in interactive mode:
# y = yes, stage this hunk
# n = no, skip this hunk
# s = split into smaller hunks
# e = edit hunk manually
# q = quit
```

### Review Staged Changes
```bash
# See staged changes
git diff --cached

# Compare staged vs working directory
git diff HEAD
```

### Unstage if Needed
```bash
# Unstage specific file
git reset HEAD filename

# Unstage all
git reset HEAD

# Discard working changes (DANGEROUS!)
git checkout -- filename
```

## Creating Commits

### Basic Commit
```bash
# Commit staged changes
git commit -m "feat: add login feature"

# Include body/description
git commit -m "feat: add login feature" -m "Implement JWT authentication with refresh tokens"
```

### Commit Specific Files
```bash
# Commit without staging first
git commit path/to/file1 path/to/file2 -m "fix: update config files"
```

### Interactive Commit
```bash
# Editor opens for detailed message
git commit

# Editor opens with all changes shown for review
git commit -v
```

## Organizing Changes into Commits

### Single Feature, Multiple Files

**Bad approach:**
```
commit all changes at once
→ Hard to understand individual changes
→ Difficult to revert specific functionality
```

**Good approach:**
```
1. Create base components (1 commit)
2. Add business logic (1 commit)
3. Add tests (1 commit)
4. Add documentation (1 commit)
→ Clear progression of feature
→ Easy to review and revert individual parts
```

### Example: User Authentication Feature

```bash
# 1. Create auth models and interfaces
git add src/models/user.ts src/interfaces/auth.ts
git commit -m "feat(auth): add user and authentication types"

# 2. Implement auth logic
git add src/services/authService.ts
git commit -m "feat(auth): implement JWT authentication service"

# 3. Add API endpoints
git add src/routes/auth.ts
git commit -m "feat(auth): add login and logout endpoints"

# 4. Add tests
git add tests/auth.test.ts
git commit -m "test(auth): add authentication tests"

# 5. Update documentation
git add README.md docs/AUTH.md
git commit -m "docs(auth): add authentication guide"
```

## Commit Best Practices

### Commit Frequency
```
✓ Commit after each logical unit
✓ Commit at least once per day
✓ Commit before major changes
✗ Don't commit half-working code
✗ Don't wait days between commits
```

### Commit Size
```
Ideal: 50-100 lines changed per commit
Max: 300 lines (review difficult beyond this)
Min: 1 line (if it's a logical unit)

Mixed: Some commits small, some medium - that's OK
```

### Testing Before Commit
```bash
# 1. Run tests
npm test

# 2. Run linter
npm run lint

# 3. Check build
npm run build

# 4. Review changes
git diff

# 5. Commit
git commit -m "message"
```

## Fixing & Amending Commits

### Amend Last Commit
```bash
# Add forgotten changes to last commit
git add forgotten-file.js
git commit --amend

# Change commit message only
git commit --amend -m "new message"

# NEVER amend pushed commits on shared branches!
```

### Undo Last Commit (Keep Changes)
```bash
# Keep changes in working directory
git reset --soft HEAD~1

# Modify and recommit
git commit -m "corrected message"
```

### Undo Last Commit (Discard Changes)
```bash
# DANGEROUS - deletes all changes
git reset --hard HEAD~1
```

### Fix Old Commits

**For pushed commits on shared branch:**
```bash
# Create new commit that reverts the bad one
git revert abc123def

# This is safe and preserves history
```

**For unpushed commits:**
```bash
# Interactive rebase
git rebase -i HEAD~3

# Mark commit as 'edit', make changes, continue
```

## Stashing Temporary Work

**When to stash:**
- Switching branches with uncommitted changes
- Emergency hotfix needed
- Code not ready to commit yet
- Cleaning up working directory

### Stash Operations

**Save work:**
```bash
# Stash all changes
git stash

# Stash with description
git stash save "work on feature X"

# Stash only staged changes
git stash --staged

# Stash untracked files too
git stash -u
```

**View stashes:**
```bash
# List all stashes
git stash list

# View specific stash
git stash show stash@{0}

# View diff of stash
git stash show -p stash@{0}
```

**Restore work:**
```bash
# Apply most recent stash
git stash pop

# Apply without removing from stash list
git stash apply stash@{0}

# Apply to new branch
git stash branch new-branch-name
```

**Clean up:**
```bash
# Delete specific stash
git stash drop stash@{0}

# Delete all stashes
git stash clear
```

## Common Commit Scenarios

### Scenario 1: Made Changes Before Creating Branch
```bash
# You're on main with uncommitted changes
# Create branch first, then commit
git checkout -b feature/new-work
git add .
git commit -m "feat: new feature"
```

### Scenario 2: Need to Split Large Commit
```bash
# Undo the commit
git reset --soft HEAD~1

# Stage individual files and commit separately
git add file1.js
git commit -m "part 1 message"

git add file2.js
git commit -m "part 2 message"
```

### Scenario 3: Forgot to Stage Before Committing
```bash
# Stage the forgotten changes
git add forgotten-file.js

# Amend previous commit
git commit --amend --no-edit
```

### Scenario 4: Wrong Branch Committed
```bash
# Create correct branch with your commit
git branch feature/correct-branch

# Undo commit from wrong branch
git reset --hard HEAD~1

# Switch to correct branch
git checkout feature/correct-branch
```

## Output Format

```
📝 COMMIT OPERATION
├─ Files changed: [count]
├─ Additions: [+count]
├─ Deletions: [-count]
├─ Message: [commit message]
├─ Type: [feat/fix/docs/etc]
├─ Scope: [scope]
├─ Status: [staged/committed/amended]
└─ Hash: [short commit hash]
```

## Best Practices Summary

1. **Small, focused commits**: One concern per commit
2. **Meaningful messages**: Describe why, not just what
3. **Review before committing**: Always check diff
4. **Commit frequently**: Multiple commits per day is good
5. **Don't mix concerns**: Keep features, refactoring, formatting separate
6. **Test before committing**: Ensure changes work
7. **Link to issues**: Reference related issues
8. **Use types**: Follow team conventions (feat, fix, etc)
9. **Never force-push shared branches**: Revert instead
10. **Document complex logic**: Leave breadcrumbs in history

## Recovery Commands

| Situation | Command | Effect |
|-----------|---------|--------|
| Undo last commit (keep changes) | `git reset --soft HEAD~1` | Changes back to staged |
| Undo last commit (discard changes) | `git reset --hard HEAD~1` | Commit and changes deleted |
| Restore deleted commit | `git reflog` | Find and recover |
| Amend last commit | `git commit --amend` | Edit last commit |
| Revert bad commit | `git revert abc123` | Create new commit that undoes changes |

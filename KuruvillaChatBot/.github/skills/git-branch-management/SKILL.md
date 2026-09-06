---
name: git-branch-management
description: "Create, switch, and manage Git branches efficiently. Use when: creating feature branches, switching between branches, managing branch hierarchy, organizing work with worktrees, deleting old branches, or managing branch naming conventions."
argument-hint: "Describe what you want to do (e.g., 'create feature branch for auth') or leave empty to see current branches"
user-invocable: true
---

# Git Branch Management

Organize and manage Git branches effectively with clear naming conventions, proper hierarchy, and parallel development using worktrees.

## When to Use

- Create feature branches for new work
- Switch between branches safely
- Manage branch hierarchy (main → develop → feature)
- List all branches and their relationships
- Delete branches locally and remotely
- Manage parallel development with worktrees
- Track branch status and merge readiness
- Archive old or abandoned branches

## Core Principles

- **Naming Consistency**: Follow team conventions for branch names
- **Clear Hierarchy**: Main → Develop → Feature/Bugfix branches
- **Safe Switching**: Always commit or stash before switching
- **Remote Tracking**: Keep local and remote in sync
- **Cleanup**: Regular deletion of merged branches

## Branch Naming Conventions

```
GOOD:
  feature/user-authentication
  feature/dashboard-redesign
  bugfix/login-timeout
  hotfix/security-patch
  release/v1.2.0
  docs/api-documentation

AVOID:
  feature1
  my-changes
  temp
  test-branch
  wip (use stash instead)
```

### Naming Format
```
{type}/{description}

Types:
  feature/    - New functionality
  bugfix/     - Bug fixes (non-urgent)
  hotfix/     - Urgent production fixes
  release/    - Release branches (v1.2.0 format)
  docs/       - Documentation updates
  refactor/   - Code refactoring
  test/       - Testing & QA
  chore/      - Maintenance, dependencies
```

## Branch Creation Workflow

### Step 1: Prepare Base Branch
```bash
# Fetch latest from remote
git fetch

# Switch to base branch (usually main or develop)
git checkout main

# Ensure it's up-to-date
git pull origin main
```

### Step 2: Create Feature Branch
```bash
# Create and switch to new branch
git checkout -b feature/descriptive-name

# Verify you're on new branch
git status
git branch
```

### Step 3: Work on Branch
```bash
# Make changes
# Commit regularly with meaningful messages
git commit -m "feat: add feature description"

# Push to remote
git push origin feature/descriptive-name
```

## Branch Switching Workflow

### Safe Switching Checklist
```
BEFORE switching branches:
✓ Commit all changes
✓ Or stash uncommitted work
✓ Check current branch status
✓ Verify no unsaved file edits
```

### Switching Steps
```bash
# Check current status
git status

# If changes exist, commit or stash
git stash save "work in progress"

# Switch branches
git checkout feature/branch-name

# Verify switch
git status
```

## Branch Management Commands

### Viewing Branches
```bash
# List local branches
git branch

# List remote branches
git branch -r

# List all branches (local + remote)
git branch -a

# Show branches with merge status
git branch -v

# Show commit graph
git graph
```

### Creating Branches
```bash
# Create from current branch
git branch new-branch-name

# Create from specific commit
git branch new-branch-name abc123

# Create and switch (shorthand)
git checkout -b feature/name

# Create tracking remote branch
git checkout --track origin/remote-branch
```

### Deleting Branches
```bash
# Delete local branch (safe - prevents unmerged deletion)
git branch -d branch-name

# Force delete local branch
git branch -D branch-name

# Delete remote branch
git push origin --delete branch-name

# Delete multiple branches
git branch -d branch1 branch2 branch3
```

### Renaming Branches
```bash
# Rename current branch
git branch -m new-name

# Rename specific branch
git branch -m old-name new-name

# Rename and update remote
git push origin -u new-name
git push origin --delete old-name
```

## Worktree Management for Parallel Development

Worktrees allow working on multiple branches simultaneously without switching.

### Creating Worktrees
```bash
# Create worktree for existing branch
git worktree add ../review-branch review/pr-123

# Create worktree with new branch
git worktree add ../feature-branch -b feature/new-feature

# List all worktrees
git worktree list
```

### Worktree Use Cases
- Review pull requests without leaving current branch
- Fix urgent bug while working on feature
- Compare multiple branches side-by-side
- Test compatibility across branches

### Cleaning Up Worktrees
```bash
# Remove worktree
git worktree remove worktree-path

# Prune worktrees with missing directories
git worktree prune
```

## Branch Status & Merge Readiness

### Check Branch Status
```bash
# How far ahead/behind from remote
git status

# Show commits not on remote
git log origin/main..HEAD

# Compare branches
git log main..feature/branch
```

### Before Merging
```
Checklist:
✓ Branch is up-to-date with target (git pull origin target)
✓ All tests pass locally
✓ Code review approved
✓ No merge conflicts (git diff target...HEAD)
✓ Documentation updated
✓ Commit history is clean
```

## Common Branch Management Scenarios

### Scenario 1: Sync Feature Branch with Develop
```bash
git fetch
git rebase origin/develop
# or merge if rebase not preferred
git merge origin/develop
```

### Scenario 2: Clean Up Old Branches
```bash
# Show merged branches
git branch --merged

# Delete all merged branches
git branch --merged | grep -v "main\|develop" | xargs git branch -d
```

### Scenario 3: Branch Got Out of Sync
```bash
git fetch origin
git rebase origin/main  # or merge
```

### Scenario 4: Accidentally Committed to Main
```bash
# Create new branch from current commit
git branch feature/oops

# Reset main to before commits
git reset --hard origin/main

# Switch to new branch with your work
git checkout feature/oops
```

## Output Format

```
🌿 BRANCH OPERATION
├─ Current branch: [branch name]
├─ Action: [create/switch/delete/list]
├─ Target: [branch name or list]
├─ Base: [parent branch]
├─ Status: [exists/created/switched/deleted/error]
├─ Ahead: [commits ahead]
├─ Behind: [commits behind]
└─ Next steps: [merge/push/review]
```

## Best Practices

1. **Meaningful names**: Branch name should reflect the work
2. **Single responsibility**: One feature per branch
3. **Short-lived**: Merge within 1-2 weeks to avoid divergence
4. **Regular rebases**: Keep in sync with main branch
5. **Clean history**: Squash commits before merging if needed
6. **Link to issues**: Reference issue numbers in branch/PR
7. **Delete after merge**: Keep repository clean

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Can't delete branch | Branch not merged | Use `git branch -D` or merge first |
| Detached HEAD | Checked out commit instead of branch | `git checkout branch-name` |
| Local ahead of remote | Commits not pushed | `git push origin branch-name` |
| Branch tracking lost | Remote branch deleted | Update tracking: `git branch -u origin/new-branch` |

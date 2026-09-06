---
name: git-remote-sync
description: "Synchronize local and remote repositories safely. Use when: pushing commits, pulling remote changes, fetching updates, handling push/pull rejections, rebasing vs merging, managing tracking branches, or coordinating with team on shared repositories."
argument-hint: "Describe sync action (e.g., 'push to main' or 'pull latest changes') or leave empty to check current sync status"
user-invocable: true
---

# Git Remote Sync Operations

Keep your local repository synchronized with remote repositories safely, handling merge strategies, conflicts, and coordinating with team members.

## When to Use

- Push local commits to remote
- Pull remote changes locally
- Fetch updates without merging
- Handle push/pull rejections
- Sync feature branches with main
- Resolve diverged branches
- Manage tracking branch relationships
- Rebase vs merge decisions
- Coordinate with team members

## Core Principles

- **Always Fetch First**: Know what's on remote before pulling/pushing
- **Rebase vs Merge**: Choose strategy based on team preference
- **Verify Before Push**: Check history before pushing
- **Handle Conflicts**: Resolve before completing sync
- **Protect Shared Branches**: Never force-push to main/develop
- **Keep Synced**: Regular syncing prevents divergence

## Remote Repository Concepts

### Remote Configuration
```bash
# List configured remotes
git remote -v

# Add remote
git remote add origin https://github.com/user/repo.git

# Change remote URL
git remote set-url origin new-url

# Remove remote
git remote remove origin
```

### Tracking Branches
```
Local branch: feature/auth (your working branch)
Tracking branch: origin/feature/auth (remote copy)
Remote branch: feature/auth (what's actually on server)

Local tracking updates via:
- git fetch
- git pull (fetch + merge/rebase)
```

## Fetch vs Pull Explained

### Fetch: Safe Inspection
```bash
git fetch

Effect:
✓ Updates tracking branches (origin/main, origin/feature/X)
✓ Downloads new commits from remote
✓ Does NOT change your local branches
✓ Safe to run anytime
→ Use before deciding to merge/rebase
```

### Pull: Immediate Integration
```bash
git pull

Effect:
✓ Runs git fetch
✓ Automatically merges or rebases local changes
✓ Changes your local branch
⚠ Can result in merge conflicts
→ Decide: merge or rebase first
```

## Push Workflow

### Step 1: Prepare for Push
```bash
# Fetch latest remote state
git fetch

# Check how far ahead we are
git log origin/main..HEAD

# Verify changes are correct
git diff origin/main..HEAD
```

### Step 2: Rebase if Needed
```bash
# If remote has new commits, rebase to avoid merge commit
git rebase origin/main

# Or merge if team prefers
git merge origin/main
```

### Step 3: Push Changes
```bash
# Push to remote
git push origin feature/branch-name

# Set up tracking branch (next time just: git push)
git push -u origin feature/branch-name

# Push all branches
git push --all origin

# Push specific branch and tags
git push origin branch-name --tags
```

### Step 4: Verify Push
```bash
# Confirm commits arrived
git log origin/main -n 3

# Check remote branch status
git branch -vv
```

## Pull Workflow

### Step 1: Check Current State
```bash
# See what's ahead/behind
git status

# View changes in remote
git fetch
git log origin/main..HEAD  # local ahead
git log HEAD..origin/main  # remote ahead
```

### Step 2: Choose Strategy

**Strategy A: Pull with Merge**
```bash
git pull origin main
→ Creates merge commit
→ Preserves all history
→ Non-linear history

When to use: Multiple parallel development streams
```

**Strategy B: Pull with Rebase**
```bash
git pull --rebase origin main
→ Replays your commits on top
→ Linear history
→ Cleaner history

When to use: Feature branches, single-line development
```

### Step 3: Resolve Conflicts if Needed
```bash
# See merge/rebase status
git status

# Resolve conflicts (see git-conflict-resolution skill)

# Continue
git merge --continue  # for merge
git rebase --continue  # for rebase
```

### Step 4: Verify Pull
```bash
# Check we're up-to-date
git log origin/main..HEAD  # should show nothing

# Verify no merge conflicts
git status
```

## Handling Push/Pull Rejections

### Push Rejected: "Updates were rejected"

**Cause:** Remote has commits you don't have

**Solution:**
```bash
# 1. Fetch latest
git fetch

# 2. Rebase (preferred for feature branches)
git rebase origin/main

# 3. Push
git push origin feature/branch

# OR merge if preferred
git merge origin/main
git push origin feature/branch
```

### Pull Rejected: "You have divergent branches"

**Cause:** Branch history has diverged

**Solution:**
```bash
# Option 1: Rebase (cleaner)
git pull --rebase

# Option 2: Merge
git pull

# Configure to always rebase by default
git config pull.rebase true  # for this repo
git config --global pull.rebase true  # for all repos
```

### Force Push Needed: (Proceed with Caution!)

**When it's safe:**
- Branch is only yours (not shared)
- You've rebased and need to update remote
- You have explicit team approval

```bash
# DANGEROUS: only on non-shared branches!
git push --force-with-lease origin feature/branch

# Safer than plain --force (prevents overwriting others' work)
```

**When to NEVER force-push:**
- main, develop, or shared branches
- Without team coordination
- Without backing up your work

## Rebase vs Merge Comparison

### Merge (Preserves History)
```
Pros:
✓ All commits visible in history
✓ Merge commit marks integration point
✓ No rewriting of history

Cons:
✗ Non-linear history
✗ Can be cluttered with merge commits

Use when: Multiple developers working on same branch
```

### Rebase (Linear History)
```
Pros:
✓ Linear, clean history
✓ All commits visible in sequence
✓ Easier to understand progression

Cons:
✗ Rewrites history (don't use on shared branches)
✗ Can be confusing for new developers

Use when: Feature branches, personal development
```

### Example Comparison

```
Merge result:
main ──●──●────────────● (merge commit)
        ╲            ╱
         ●──●──●──●    feature

Rebase result:
main ──●──●──●──●──●──●
       (all commits visible, linear)
```

## Handling Diverged Branches

**Problem:** Branch has diverged, has different history

**Scenarios:**

### Scenario 1: Simple Divergence (Both Have Commits)
```bash
# See divergence
git log --oneline --graph --all

# Solution: Rebase feature onto main
git fetch
git rebase origin/main

# Or merge
git merge origin/main

# Push
git push origin feature/branch
```

### Scenario 2: Remote Deleted Branch
```bash
# See deleted branch still tracked
git branch -r

# Remove deleted branch reference
git remote prune origin

# Or delete specific
git branch -dr origin/old-branch
```

### Scenario 3: Accidental Rebase Creates Divergence
```bash
# Check reflog
git reflog

# Find original commit
# Recover by checking out original

# Or force-push only if sure and on non-shared branch
git push --force-with-lease
```

## Multi-Remote Management

**When you have multiple remotes:**

```bash
# Add multiple remotes
git remote add origin https://github.com/user/repo.git
git remote add upstream https://github.com/original/repo.git

# Fetch from all
git fetch --all

# Pull from specific remote
git pull upstream main

# Push to specific remote
git push origin feature/branch
```

## Synchronization Strategies

### Strategy 1: Daily Sync (Feature Branch)
```
Daily workflow:
1. git fetch
2. git rebase origin/develop
3. Work on code
4. git push origin feature/branch
```

### Strategy 2: Regular Merges (Shared Branch)
```
Every few commits:
1. git merge origin/main
2. Resolve conflicts
3. git push origin branch
```

### Strategy 3: Pre-Release Sync
```
Before PR merge:
1. git fetch
2. git rebase origin/main
3. Run all tests
4. git push --force-with-lease
5. Open PR
```

## Output Format

```
🔄 REMOTE SYNC
├─ Local branch: [branch name]
├─ Remote branch: [remote/branch]
├─ Status: [up-to-date/ahead/behind/diverged]
├─ Ahead: [commits not pushed]
├─ Behind: [commits not pulled]
├─ Strategy: [merge/rebase]
├─ Action: [fetched/pulled/pushed/rebased]
└─ Result: [✓ success/⚠ conflicts/✗ rejected]
```

## Best Practices

1. **Fetch before push/pull**: Always know what's remote
2. **Rebase feature branches**: Keep history clean
3. **Don't force-push shared branches**: Preserve team history
4. **Sync daily**: Prevent divergence
5. **Review before push**: Check what you're pushing
6. **Use tracking branches**: Simplifies push/pull
7. **Document team strategy**: Agree on merge vs rebase
8. **Configure defaults**: Set `pull.rebase`, `push.default`, etc.

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Push rejected | Remote ahead | Fetch, rebase, push |
| Pull has conflicts | Diverged changes | Resolve conflicts, continue |
| Tracking lost | Remote deleted | `git remote prune origin` |
| Wrong remote | Mixed remotes | `git remote -v` verify, push to correct |
| Detached HEAD after pull | Checked out tag/commit | `git checkout branch-name` |

## Configuration Tips

```bash
# Set default pull strategy
git config --global pull.rebase true

# Set default push behavior
git config --global push.default current

# Auto-setup tracking branches
git config --global --add push.autoSetupRemote true

# Always fetch before pull
git config --global fetch.prune true
```

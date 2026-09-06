---
name: git-pull-request-workflow
description: "Create, manage, and merge pull requests efficiently. Use when: opening pull requests, reviewing code changes, requesting reviews, merging PRs, handling PR comments, checking PR status, or managing pull requests across GitHub, GitLab, Bitbucket, and Azure DevOps."
argument-hint: "Describe PR action (e.g., 'create PR from feature/auth to main') or leave empty for current PR status"
user-invocable: true
---

# Git Pull Request Workflow

Create, review, and merge pull requests with clear communication, thorough review, and safe merge practices across all major Git providers.

## When to Use

- Create a new pull request
- Review pull request changes
- Request or handle reviews
- Resolve PR merge conflicts
- Check PR status and reviews
- Merge pull requests safely
- Manage draft pull requests
- Link PRs to issues
- Handle PR comments and suggestions
- Prioritize PR reviews (launchpad)

## Core Principles

- **Clear Communication**: Descriptive titles and comprehensive descriptions
- **Thorough Review**: Understand all changes before approving
- **Conflict Prevention**: Address conflicts early
- **CI/CD Checks**: Never merge with failing checks
- **Safety First**: Verify merge target and policies
- **Team Coordination**: Link to related work and notify reviewers

## Pull Request Creation Workflow

### Step 1: Prepare Branch
```bash
# Ensure branch is up-to-date
git fetch origin
git rebase origin/main

# Or merge if rebase not preferred
git merge origin/main

# Push final version
git push origin feature/branch-name
```

### Step 2: Create Pull Request

**Essential Elements:**

**Title:**
```
Good:
  "feat: add user authentication flow"
  "fix: resolve login timeout issue"
  "docs: update API documentation"
  
Avoid:
  "changes"
  "fix stuff"
  "WIP"
```

**Description Template:**
```markdown
## Description
Brief overview of changes made in this PR.

## Related Issue
Fixes #123 (or "Relates to #123")

## Changes Made
- Change 1
- Change 2
- Change 3

## How to Test
1. Step 1
2. Step 2
3. Expected result: ...

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes

## Screenshots (if applicable)
[Add screenshots for UI changes]
```

### Step 3: Set Up PR

**Configuration:**
```
Source branch: feature/your-branch
Target branch: main (or develop)
Title: [clear, descriptive]
Description: [comprehensive]
Reviewers: [relevant team members]
Labels: [bug/feature/docs/etc]
Linked issues: [#123, #124]
```

### Step 4: Respond to Feedback

```
After review:
✓ Address reviewer comments
✓ Make requested changes
✓ Resolve conversations
✓ Re-request review if significant changes
✓ Push updates to same branch (don't force-push)
```

## Pull Request Review Workflow

### Step 1: Review Changes
```bash
# Examine the PR
- Read description and context
- Review all changed files
- Check diff for logic issues
- Verify tests are included
```

### Step 2: Assess Quality
```
Code Quality:
✓ Follows style guidelines
✓ No unnecessary complexity
✓ Proper error handling
✓ Well-commented where needed

Testing:
✓ Tests are comprehensive
✓ Edge cases covered
✓ Tests pass locally

Documentation:
✓ README updated if needed
✓ Inline comments clear
✓ Breaking changes documented
```

### Step 3: Provide Feedback

**Comment Types:**

```markdown
# Constructive Comments

"Consider using a Set instead of Array for O(1) lookups"
"This pattern is used in utils/helpers.ts - we could reuse it"
"The error message could be more descriptive"

# Approval Comments

"Great implementation! 👍"
"This refactoring improves readability significantly"
"Well-tested, looks good to merge"
```

### Step 4: Approval & Merging

```
Before merging:
✓ All feedback addressed
✓ Approvals received (minimum required)
✓ CI/CD checks passing
✓ No merge conflicts
✓ Merge strategy appropriate (squash/rebase/merge)
```

## PR Merge Strategies

### Strategy 1: Create a Merge Commit
```
When: Multiple related commits should be preserved
Result: Single merge commit, all feature commits preserved
History: Non-linear, clear merge points
```

### Strategy 2: Squash and Merge
```
When: Feature has many small commits
Result: Single commit with combined message
History: Linear, cleaner history
Best for: Feature branches with many "work in progress" commits
```

### Strategy 3: Rebase and Merge
```
When: Want linear history with feature commits visible
Result: Feature commits replayed on main
History: Linear, individual commits visible
Best for: Projects valuing clean, linear history
```

## Merge Conflict Resolution in PR

### Detecting Conflicts
```bash
# PR shows "Conflicts" status
# Click "Resolve conflicts" button in PR UI

# Or locally:
git fetch origin
git merge origin/main  # or target branch
# Conflicts appear
```

### Resolving PR Conflicts

1. **Pull latest target branch**
   ```bash
   git fetch origin
   git merge origin/main
   ```

2. **Resolve conflicts** (see git-conflict-resolution skill)

3. **Commit and push**
   ```bash
   git add .
   git commit -m "Resolve merge conflicts with main"
   git push origin feature/branch-name
   ```

4. **Verify PR updated** automatically

## PR Status Monitoring

### Checking PR Status
```bash
# List PRs assigned to you
git pull_request assigned_to_me

# Get detail on specific PR
git pull_request get_detail [pr-number]

# View comments on PR
git pull_request get_comments [pr-number]
```

### Status Meanings
```
DRAFT: Not ready for review
OPEN: Awaiting reviews
CHANGES_REQUESTED: Address feedback
APPROVED: Ready to merge
MERGED: Successfully integrated
CLOSED: Rejected/cancelled
```

## Draft Pull Requests

**When to Use:**
- Work in progress needing feedback
- Early designs for discussion
- Work not ready to merge

**Usage:**
```
Create PR with "Draft" status
→ Team can view and comment
→ Cannot be merged while draft
→ Convert to ready for review when complete
```

## Managing PR Reviews Efficiently

### Using Launchpad
```
Lists PRs prioritized by:
- Ready to merge
- Has conflicts
- Awaiting review
- Pending changes
```

### Starting a Review
```bash
# Create dedicated worktree for review
git worktree add ../review-pr-123 pr-123

# Review code without affecting main work
# Test the changes
# Approve or request changes
```

## Common PR Scenarios

### Scenario 1: PR Has Conflicts
```
Action:
1. Resolve locally (see conflict resolution skill)
2. Push resolved version
3. PR automatically updates
4. Request re-review if significant changes
```

### Scenario 2: Reviewer Requests Changes
```
Action:
1. Address all comments
2. Commit changes to same branch
3. Push (don't force-push on shared branches)
4. Respond in PR with explanations
5. Re-request review
```

### Scenario 3: PR is Stale
```
Action:
1. Rebase on latest main
2. Push updated branch
3. Note that branch is up-to-date
4. Request fresh reviews if needed
```

### Scenario 4: Need to Update PR Before Merge
```
Action:
1. Don't close current PR
2. Push new commits to same branch
3. PR updates automatically
4. Reviewers see new commits
```

## Output Format

```
📋 PULL REQUEST
├─ Title: [PR title]
├─ Branch: [feature] → [target]
├─ Status: [draft/open/ready/approved/merged/conflict]
├─ Commits: [count]
├─ Changes: [+additions/-deletions]
├─ Reviewers: [list]
├─ CI Status: [passing/failing/pending]
├─ Conflicts: [none/detected/resolved]
└─ Action: [created/updated/merged/closed]
```

## Best Practices

1. **Small PRs**: Easier to review, faster to merge (aim for <500 lines)
2. **Descriptive titles**: Clear what the PR accomplishes
3. **Link issues**: Always reference related issues
4. **Self-review first**: Check your own code before requesting review
5. **Test locally**: Ensure tests pass before creating PR
6. **Respond promptly**: Address feedback quickly to keep momentum
7. **One concern per PR**: Don't mix features with refactoring
8. **Keep history clean**: Squash WIP commits before merge

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Can't merge | CI failing or conflicts | Fix issues, wait for CI, resolve conflicts |
| Branch out of sync | Not rebased with target | Rebase on target branch |
| Merge button missing | Not approved or policies violated | Get approvals, check branch protection rules |
| Can't comment | Already merged or closed | Comments on merged PRs still possible via commits |
| Accidental merge | Wrong button clicked | Revert merge commit if possible |

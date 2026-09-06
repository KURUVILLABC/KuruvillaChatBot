---
name: git-history-analysis
description: "Analyze Git history, diffs, and authorship information. Use when: reviewing commit history, understanding code changes, finding when bugs were introduced, checking who modified code, comparing branches, analyzing commit patterns, or debugging with git log and blame."
argument-hint: "Describe what you want to find (e.g., 'find when auth bug was introduced') or leave empty to see recent history"
user-invocable: true
---

# Git History & Analysis

Effectively analyze Git history to understand code evolution, track authorship, and debug issues by navigating commits, diffs, and change history.

## When to Use

- Review commit history and changes
- Find when a bug was introduced
- Understand who modified specific code
- Compare commits or branches
- Analyze code diff between versions
- Track feature development progression
- Find related commits
- Debug regression issues
- Analyze contribution patterns

## Core Concepts

### Commit Graph
```
Visualization of commits and branch relationships

main    ──●──●──●──●─────●──●─ (HEAD)
          ╲   ╱        ╱
develop   ─●──●────●──●─ (feature merged)

Shows: branch history, merge points, relationships
```

### Diff Types
```
Comparison between:
- Working directory vs staged
- Staged vs last commit
- Commit vs commit
- Branch vs branch
- File vs file
```

### Blame Information
```
For each line: commit hash, author, date, message

Shows who changed what and when
Useful for: understanding context, reaching out to author
```

## Log Viewing Commands

### Basic Log Display
```bash
# Show recent commits
git log

# Show brief one-line format
git log --oneline

# Show last N commits
git log -5

# Show with authors
git log --format=fuller
```

### Visual Graph Display
```bash
# Commit graph (opened in UI)
git graph

# Text-based graph
git log --graph --oneline --all

# Detailed graph
git log --graph --oneline --decorate --all
```

### Filter and Search Logs

**By Date:**
```bash
# Commits in last week
git log --since="1 week ago"

# Commits in specific date range
git log --since="2024-01-01" --until="2024-01-31"

# Last 7 days
git log --since="7 days ago"

# Before/after
git log --before="2024-06-01"
```

**By Author:**
```bash
# Commits by specific author
git log --author="John Doe"

# Commits by multiple authors
git log --author="John\|Jane"

# Show author email too
git log --format="%an <%ae> - %s"
```

**By Commit Message:**
```bash
# Search commit message
git log --grep="feature"

# Case-insensitive search
git log --grep="feature" -i

# Regex search
git log --grep="feat|fix" --format="%h %s"
```

**By File:**
```bash
# Commits affecting file
git log -- src/auth.js

# Commits with stats
git log --stat -- src/auth.js

# Show changes to file
git log -p -- src/auth.js
```

**By Branch/Range:**
```bash
# Commits on feature not on main
git log main..feature

# Commits on main not on feature
git log feature..main

# Common ancestor
git log feature...main --left-right
```

## Detailed Commit Analysis

### View Single Commit
```bash
# Show commit details
git log -1 abc123def

# With full diff
git log -1 -p abc123def

# With stats
git log -1 --stat abc123def

# Oneline format
git log -1 --oneline abc123def
```

### View Changes Across Commits
```bash
# See what changed between two commits
git log -p main..feature
→ Shows all diffs between branches

# Show only filenames changed
git log --name-only main..feature

# Show file change summary
git log --stat main..feature
```

### Author Statistics
```bash
# Shortlog (summary by author)
git log --shortstat

# Contribution count
git log --pretty=format:"%an" | sort | uniq -c | sort -nr

# Most active files
git log --name-only --format="" | sort | uniq -c | sort -nr | head -10
```

## Diff Analysis

### Compare Commits
```bash
# Diff between two commits
git diff abc123..def456

# Diff including renames
git diff -M abc123..def456

# Diff ignoring whitespace
git diff -w abc123..def456

# Context lines
git diff -U10 abc123..def456  # 10 lines context
```

### Compare Branches
```bash
# What's in feature not in main
git diff main..feature

# What's in main not in feature
git diff feature..main

# Full diff between branches
git diff main...feature
```

### Compare With Working Directory
```bash
# Changes not staged
git diff

# Changes staged for commit
git diff --staged

# All changes (staged + unstaged)
git diff HEAD

# Specific file
git diff -- filename
```

### Understand Diff Output
```
--- a/file.js     (original)
+++ b/file.js     (modified)
@@ -10,5 +10,6 @@  (line numbers)

 unchanged line
-removed line
+added line
 unchanged line
```

## Blame Analysis

### Find Line Author
```bash
# Show who changed each line
git blame src/auth.js

# Show specific lines
git blame -L 10,20 src/auth.js
```

### Blame Output
```
abc123de (John Doe 2024-01-15 10:30:00 +0000) const token = getToken();
def45678 (Jane Smith 2024-01-14 15:45:00 +0000) function getToken() {
```

### Understanding Blame Context
```
Hash:      abc123de
Author:    John Doe
Date:      2024-01-15
Time:      10:30:00
Line:      const token = getToken();
```

### Follow Renames in Blame
```bash
# Show blame including file renames
git blame -C src/auth.js

# Show blame including line moves
git blame -C -C src/auth.js
```

## Finding Bugs in History

### Scenario 1: "When was this line added?"
```bash
# Show when line was added
git log -p -S "specific line content" -- filename

# Find which commit
git log --format="%h %an %s" -S "search term" -- filename
```

### Scenario 2: "Which commit broke this?"
```bash
# Binary search for bad commit
git bisect start

# Mark good commit
git bisect good abc123

# Mark bad commit
git bisect bad def456

# Test each suggested commit
git bisect good   # if this commit works
git bisect bad    # if this commit is broken

# Find bad commit
git bisect reset
```

### Scenario 3: "Who deleted this file?"
```bash
# Find deletion commit
git log --diff-filter=D --summary | grep delete | grep filename

# Or search
git log --all --full-history -- filename
```

### Scenario 4: "What changed between versions?"
```bash
# Compare tags
git diff v1.0.0..v2.0.0

# Show changes with context
git log --oneline v1.0.0..v2.0.0

# Generate changelog-like output
git log --format="%h - %s" v1.0.0..v2.0.0
```

## Advanced Analysis Patterns

### Find Related Commits
```bash
# Commits with same message pattern
git log --grep="auth" --format="%h %s"

# Commits touching similar files
git log --name-only -- src/auth.* | grep -A5 "src/"

# Commits by multiple authors
git log --format="%an" -- filename | sort | uniq
```

### Analyze Code Evolution
```bash
# Track file through history
git log --follow -p -- filename

# See how function changed
git log -p -S "function_name" -- filename

# See deletions
git log --diff-filter=D --summary
```

### Contribution Analysis
```bash
# Files touched most often
git log --name-only --pretty=format:"" | sort | uniq -c | sort -rn | head

# Changes per author
git log --format="%an" | sort | uniq -c | sort -rn

# Lines added/removed per author
git log --format="%an" --numstat | awk '{print $3 " " $1 " " $2}' | sort | uniq -c
```

## Common Analysis Scenarios

### Scenario 1: Understand Recent Changes
```bash
# Recent commits
git log --oneline -10

# Show with authors
git log --oneline --author -10

# Show changes
git log -p -5

# Commit graph
git graph
```

### Scenario 2: Find Breaking Change
```bash
# Compare branches
git diff main..feature

# Show commits
git log main..feature

# Detailed review
git log -p main..feature

# Or use bisect
git bisect start
[follow bisect prompts]
```

### Scenario 3: Understand Merge Conflict Context
```bash
# Show history of both sides
git log main..feature
git log feature..main

# See common ancestor
git merge-base main feature

# Show diffs
git diff main...feature
```

### Scenario 4: Review Code Before Merge
```bash
# Show all changes
git diff main..feature

# Files changed
git diff --name-only main..feature

# Stats
git diff --stat main..feature

# Commits
git log main..feature --oneline
```

## Output Format

```
📊 HISTORY ANALYSIS
├─ Commits: [count]
├─ Authors: [list]
├─ Date range: [from..to]
├─ Files affected: [count]
├─ Changes: [+additions/-deletions]
├─ Search query: [if applicable]
└─ Results: [found/not found]
```

## Useful Aliases

```bash
# Create shorthand commands
git config --global alias.graph "log --graph --oneline --all"
git config --global alias.who "log --format='%an <%ae>' -1"
git config --global alias.when "log -1 --format='%ai'"
git config --global alias.changes "log --stat -1"
git config --global alias.recent "log --oneline -10"

# Usage:
git graph
git who
git when
git changes
git recent
```

## Performance Tips

For large repositories:
```bash
# Limit log results
git log -n 50

# Use specific paths
git log -- src/

# Use date range
git log --since="1 month ago"

# Use author filter
git log --author="name"

# Combine filters
git log --since="1 week ago" --author="name" -- src/
```

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Too many results | No filters | Add --since, --author, -n, or --grep |
| Slow search | Large repository | Limit scope with -- path or --since |
| Can't find commit | Wrong search term | Try different keywords or browse log |
| File not in blame | File renamed | Use `git log --follow -- filename` |
| Blame shows merge | Auto-merged conflict | Look at merge commit with `git show abc123` |


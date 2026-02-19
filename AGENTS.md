# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

## Beads Command Best Practices

**CRITICAL: Always use `--quiet` or `-q` flag with `bd` commands**

**Problem**: Without `--quiet`, beads outputs verbose help text that creates massive terminal output (16KB+), causing:
- Large file warnings in tooling
- Slow command execution
- Poor user experience
- Context overflow in AI tools

**Solution**: Always append `--quiet` or `-q` to ALL beads commands:

```bash
# ❌ BAD: Generates 16KB+ output
bd ready --json | jq '.[] | .title'

# ✅ GOOD: Clean, minimal output
bd ready --quiet --json | jq '.[] | .title'
bd ready -q --json | jq '.[] | .title'
```

**Agent Rule**: When constructing ANY `bd` command, ALWAYS include `--quiet` or `-q` flag.

**Examples**:
```bash
# List ready work
bd ready -q --json

# Show task details
bd show <id> -q --json

# List by label
bd list -q --label accessibility --json

# Update task
bd update <id> -q --status in_progress

# Close task  
bd close <id> -q --reason "completed"

# Create task (note: bd create doesn't support -q, outputs ID only)
bd create "Task title" --label foo -p 1
```

**Exception**: `bd create` doesn't support `--quiet` but outputs only the task ID (already minimal).

## Handling Multi-Line Text in Beads Commands

**CRITICAL: This is a general shell command-line principle, NOT Beads-specific**

Avoid multi-line strings in ANY CLI command arguments - they cause terminal quote mode in bash/zsh/sh.

**Problem**: Multi-line text in `--append-notes`, `--description`, or `--reason` causes the terminal to enter quote mode, blocking execution:
- Commands hang waiting for closing quote
- Difficult to escape or recover
- Poor user experience
- Breaks automated workflows

**BAD Examples** (causes quote mode):
```bash
# ❌ BAD: Multi-line note with line breaks
bd update <id> -q --append-notes "Line 1
Line 2
Line 3"

# ❌ BAD: Long detailed description with paragraphs
bd create "Title" --description "Paragraph 1

Paragraph 2

Paragraph 3"
```

**GOOD Solutions**:

### Solution 1: Single-Line Summary (Preferred)
Keep notes concise, use semicolons or dashes for structure:
```bash
# ✅ GOOD: Single line, structured with punctuation
bd update <id> -q --append-notes "Tested: task creation, querying, updates, closing; All workflows validated; Performance <1s"

# ✅ GOOD: Concise summary
bd close <id> -q --reason "Integration test complete - all workflows validated"
```

### Solution 2: Use Echo with Escaped Newlines
For programmatic use when multi-line needed:
```bash
# ✅ GOOD: Echo with \n for newlines (shell will interpret)
bd update <id> -q --append-notes "Phase 1: Setup\nPhase 2: Testing\nPhase 3: Validation"
```

### Solution 3: Break Into Multiple Updates
For complex information, make multiple smaller updates:
```bash
# ✅ GOOD: Multiple targeted updates
bd update <id> -q --append-notes "TESTED: Task creation, querying, updates, closing"
bd update <id> -q --append-notes "VALIDATED: All commands work with -q flag"
bd update <id> -q --append-notes "PERFORMANCE: Query time <1s, sync successful"
```

### Solution 4: Reference External Documentation
Link to detailed docs instead of embedding everything:
```bash
# ✅ GOOD: Summary + reference
bd update <id> -q --append-notes "Phase 2 complete - see docs/phase-2-summary.md for details"
bd close <id> -q --reason "Workflow validated - see commit abc123 for full test results"
```

**Agent Rules**:
1. ALWAYS use single-line text for bd commands
2. Use semicolons, dashes, or bullets for structure within single line
3. Keep notes concise - detailed docs belong in files
4. When detail needed, reference files or commits
5. Multiple small updates > one large multi-line update

**Exception**: If you absolutely need multi-line text, use files (not yet tested with beads).

## Landing the Plane (Session Completion)

**When ending a work session**, complete ALL steps below. Work should be committed locally and ready to push.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **Commit locally and sync beads**:
   ```bash
   git add -A
   git commit -m "descriptive message"
   bd sync
   ```
5. **Recommend push to user** - Provide clear instructions:
   ```bash
   git pull --rebase  # If working with others
   git push
   git status  # Verify "up to date with origin"
   ```
6. **Clean up** - Clear stashes, prune remote branches
7. **Hand off** - Provide context for next session

**AGENT WORKFLOW:**
- ✅ Agent SHOULD commit changes locally (safe, documents work)
- ✅ Agent SHOULD run `bd sync` to persist beads database
- ✅ Agent SHOULD recommend/remind user to push
- ❌ Agent should NOT automatically push without user confirmation
- ✅ Agent CAN ask "Should I push this to remote now?" and wait for response

**RATIONALE:**
- Local commits are safe and preserve work
- User controls when changes go to remote
- Allows user to review git log before pushing
- User may want to squash, amend, or reorganize commits

## Git Hooks (Optional - For Production Workflows)

**When to use**: Multi-developer teams, production workflows, CI/CD integration  
**When to skip**: Personal projects, single-developer workflows (auto-sync is sufficient)

### Install Beads Git Hooks

```bash
bd hooks install
```

**What it does**:
- Installs hooks in `.git/hooks/`: `pre-commit`, `post-checkout`, `post-merge`
- **Immediate export** after commits (no 5-second debounce)
- **Automatic import** after `git pull` (no waiting for next command)
- **Ensures consistency** across multi-developer workflows

**Benefits**:
- ✅ Guaranteed sync on git operations
- ✅ No stale data after `git pull`
- ✅ Team members always see latest beads state
- ✅ Reduces "forgot to sync" errors

**What's Included**:
```bash
# .git/hooks/pre-commit - Export before commit
bd export -o .beads/issues.jsonl
git add .beads/issues.jsonl

# .git/hooks/post-merge - Import after merge/pull
bd import -i .beads/issues.jsonl

# .git/hooks/post-checkout - Import after branch switch
bd import -i .beads/issues.jsonl
```

**Verification**:
```bash
# Check if hooks are installed
ls -la .git/hooks/ | grep -E "(pre-commit|post-merge|post-checkout)"

# Test hook execution
git add .
git commit -m "test" # Should auto-export
git pull # Should auto-import
```

**Alternative to hooks**: Beads has built-in auto-sync that works for most cases:
- Auto-exports after create/update/close (5-second debounce)
- Auto-imports on first command after `git pull`
- Sufficient for single-developer or casual workflows

**Source**: [Official Beads docs/TROUBLESHOOTING.md](https://github.com/steveyegge/beads/blob/main/docs/TROUBLESHOOTING.md#auto-sync-not-working)


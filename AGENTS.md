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


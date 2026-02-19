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


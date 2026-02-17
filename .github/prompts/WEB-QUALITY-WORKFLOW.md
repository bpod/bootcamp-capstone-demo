# Web Quality Workflow with Beads Integration

**Progressive Disclosure Pattern** - Avoid timeouts with staged workflow + persistent task tracking

## 4-Stage Workflow

### Stage 1: Quick Scan → Create Tasks
**Prompt**: `#web-quality-scan`  
**Time**: ~30 seconds  
**Output**: Summary table + beads tasks created

```bash
# What it does
- Scans project intelligently (auto-detects scope)
- Counts issues by category (no deep analysis yet)
- Creates one beads task per finding
- Tracks dependencies between tasks
- Returns summary table

# Example output
| Category | Issues | Severity | Task IDs |
|----------|--------|----------|----------|
| Accessibility | 12 | 🔴 Critical | bootcamp-...-abc to -xyz |
```

**Benefits**:
- ✅ Fast - Completes under 30 seconds
- ✅ No manual selection needed
- ✅ Tasks persist across sessions

---

### Stage 2: Query Tasks → Show Details  
**Prompt**: `#web-quality-query [category]`  
**Time**: <5 seconds  
**Output**: Issue list with file:line references

```bash
# What it does
- Queries beads (no re-scan!)
- Shows task details by category
- Lists blocked/blocking dependencies
- Filters by priority, status, labels

# Example usage
"show accessibility issues"
"show my tasks"
"show critical issues only"
```

**Benefits**:
- ✅ Lightning fast (query, don't re-scan)
- ✅ Shows exactly what remains
- ✅ Dependency visualization

---

### Stage 3: Get Fix Code → Update Task
**Prompt**: `#web-quality-fix <task-id>`  
**Time**: ~10 seconds  
**Output**: Before/after code with explanation

```bash
# What it does
- Reads task details from beads
- Loads relevant files only
- Generates specific fix code
- Explains best practices
- Links to authoritative sources

# Example
#web-quality-fix bootcamp-capstone-demo-abc
→ Shows alt text fix with WCAG reference
```

**Benefits**:
- ✅ Context-specific solutions
- ✅ Authoritative references
- ✅ Ready to copy/paste

---

### Stage 4: Validate → Close Tasks
**Prompt**: `#web-quality-validate`  
**Time**: Varies (depends on validation method)  
**Output**: Before/after metrics + task closures

```bash
# What it does
- Re-runs Lighthouse or manual checks
- Compares with open tasks
- Closes verified fixes
- Updates remaining tasks
- Creates regression tasks if needed

# Metrics tracked
- Lighthouse scores (before/after)
- Core Web Vitals (LCP, INP, CLS)
- Issue counts by category
```

**Benefits**:
- ✅ Verify fixes work
- ✅ Close completed work
- ✅ Historical tracking

---

## Complete Example Workflow

### Session 1: Initial Scan
```bash
User: #web-quality-scan
→ Creates 27 tasks in beads

User: #web-quality-query accessibility
→ Shows 12 accessibility tasks (no re-scan)

User: #web-quality-fix bootcamp-capstone-demo-abc
→ Shows alt text fix code

User applies fix manually

User: bd close bootcamp-capstone-demo-abc --reason "Added alt text"
→ Task removed from ready list
```

### Session 2: Continue Work (Next Day)
```bash
User: #web-quality-query
→ Shows 26 remaining tasks (remembers previous session!)

User: #web-quality-fix bootcamp-capstone-demo-def
→ Shows form label fix code

User applies fix

User: bd close bootcamp-capstone-demo-def
```

### Session 3: Validation
```bash
User: #web-quality-validate
→ Re-runs Lighthouse
→ Compares with open tasks
→ Closes 5 verified fixes
→ Updates 2 partial fixes
→ Creates 1 regression task

Result: 20 tasks remain (down from 27)
```

---

## Cross-Session Persistence

**Problem Solved**: Traditional workflow loses context between sessions

**Before (Without Beads)**:
1. Run Lighthouse → Find 27 issues
2. Fix 5 issues
3. Next day: **Must remember which 5 were fixed** or re-scan
4. Re-scanning wastes time and shows already-fixed issues

**After (With Beads)**:
1. Run `#web-quality-scan` → 27 beads tasks created
2. Fix 5 issues → Close 5 tasks
3. Next day: `bd ready --label web-quality` → **Shows exactly 22 remaining**
4. No re-scan needed, no lost context

---

## Beads Commands Quick Reference

### View Tasks
```bash
# All open web-quality tasks
bd ready --label web-quality --json

# By category
bd ready --label accessibility --json
bd ready --label performance --json

# Show specific task
bd show <task-id> --json
```

### Update Tasks
```bash
# Claim and start work
bd update <task-id> --status in_progress --claim

# Add comment
bd update <task-id> --comment "Partial fix: 3 of 8 images done"

# Change priority
bd update <task-id> --priority 3
```

### Close Tasks
```bash
# Mark complete
bd close <task-id> --reason "Fixed all occurrences"

# Close multiple
bd close <task-id-1> <task-id-2> --reason "Batch fix applied"
```

### Dependencies
```bash
# List dependencies
bd dep list <task-id>

# Add dependency (task-a blocks on task-b)
bd dep add <task-a> <task-b>

# Remove dependency
bd dep remove <task-a> <task-b>
```

---

## Integration with Existing Prompts

### Before Beads Integration
- `#lighthouse-audit` - One-shot scan, no persistence
- `#accessibility-check` - One-shot check, no tracking
- `#performance-check` - One-shot analysis

### After Beads Integration
- Use `#web-quality-scan` for initial analysis
- Use `#web-quality-query` to see what remains
- Use `#web-quality-fix` for specific solutions
- Use `#web-quality-validate` to verify fixes
- **Old prompts still work** for quick one-off checks

---

## Success Metrics

**Phase 1 Goals**:
- ✅ Initial scan completes < 30 seconds
- ✅ Query tasks < 5 seconds (no re-scan)
- ✅ Tasks persist across sessions
- ✅ Zero timeout errors
- ✅ Clear dependency tracking

**Future Enhancements** (Phase 2+):
- Auto-apply fixes (not just show code)
- WebP/AVIF conversion automation
- GitHub Actions integration
- Historical trend charts
- Bundle visualization

---

## Troubleshooting

**Q: Tasks not persisting?**
```bash
# Check beads is initialized
bd version

# Check tasks exist
bd list --label web-quality --json

# Check database
ls -la .beads/beads.db
```

**Q: Can't find task ID?**
```bash
# Search by title
bd search "alt text" --json

# List all tasks
bd list --json
```

**Q: Want to start fresh?**
```bash
# Clear all web-quality tasks
bd delete --label web-quality --yes

# Re-run scan
#web-quality-scan
```

---

## Version History

- **v0.1.0** (2026-02-17): Initial implementation with beads v0.49.6
- Using SQLite backend (no CGO required)
- Upgrade to Dolt planned when CGO-enabled binaries available

---

**Need Help?**
- [Beads CLI Documentation](https://github.com/steveyegge/beads)
- [Implementation Plan](../../../BEADS-IMPLEMENTATION-PLAN.md)
- [Project Overview](../../../docs/project-overview.md)

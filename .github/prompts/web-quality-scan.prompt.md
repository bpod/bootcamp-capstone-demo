---
description: "Stage 1: Quick web quality scan with beads task creation"
agent: web-quality-scanner
tools: ["codebase", "search"]
---

# Web Quality Scan (Stage 1: Progressive Disclosure)

**Goal**: Fast 30-second overview + create beads tasks for tracking

## Workflow

1. **Smart Scope Detection** - Auto-detect what to analyze:
   - Small project (<10 files) → Whole project
   - Medium project (10-50 files) → Current file + imports
   - Large project (>50 files) → Current file only

2. **Quick Scan** - Count issues, don't deep-analyze:
   - Accessibility: Missing alt, labels, contrast, ARIA
   - Performance: Render-blocking, large images, no lazy loading
   - Best Practices: Missing error boundaries, inline styles
   - SEO: Missing meta tags, heading structure

3. **Create Beads Tasks** - One task per finding:

   ```bash
   bd create "Fix: Images without alt text (8 occurrences)" \
     -p 1 -t bug --label web-quality --label accessibility \
     --description "demo-app/index.html lines 45, 67, 78" \
     --json
   ```

4. **Track Dependencies** - Link blocking relationships:
   ```bash
   # Example: LCP improvement blocks on render-blocking fix
   bd dep add <lcp-task-id> <render-blocking-task-id>
   ```

## Output Format

```markdown
# Web Quality Scan Complete ✅

**Scope**: Analyzed N files (scope-mode detected)
**Time**: ~30 seconds
**Tasks Created**: N beads tasks

## Results Summary

| Category       | Issues | Severity    | Top Issue           | Task IDs                 |
| -------------- | ------ | ----------- | ------------------- | ------------------------ |
| Accessibility  | 12     | 🔴 Critical | Images without alt  | bootcamp-...-abc to -xyz |
| Performance    | 8      | 🟠 High     | Render-blocking CSS | bootcamp-...-def         |
| Best Practices | 5      | 🟡 Medium   | Missing boundaries  | bootcamp-...-ghi         |

**Total**: N issues filed as beads tasks

---

## Next Steps

Query beads to explore (no re-scan):

- `bd ready --label accessibility --json` - Show accessibility work
- `bd ready --label performance --json` - Show performance work
- Or use: **#web-quality-query** prompt

Fix specific issues:

- `bd show <task-id> --json` - View task details
- Or use: **#web-quality-fix <task-id>** prompt
```

## References

- [Web Quality Skills](https://github.com/addyosmani/web-quality-skills)
- [Vercel React Best Practices](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)

**Constraint**: Complete scan + task creation in <30 seconds. Summary only, no code examples yet.

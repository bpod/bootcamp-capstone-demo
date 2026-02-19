---
description: "Stage 2: Query existing web quality tasks (no re-scan)"
agent: web-quality-tracker
tools: ["codebase"]
---

# Web Quality Query (Stage 2: Category Details)

**Goal**: Show existing tasks from beads (fast, no re-scan needed)

## Workflow

1. **Query Beads Tasks** - Use beads CLI, don't re-scan:

   ```bash
   # Get all ready web-quality tasks
   bd ready --label web-quality --json

   # Or filter by category
   bd ready --label accessibility --json
   bd ready --label performance --json
   bd ready --label best-practices --json
   ```

2. **Parse JSON** - Extract relevant fields:
   - `id`: Task identifier (e.g., `boot camp-capstone-demo-abc`)
   - `title`: Issue description
   - `priority`: 0-3 (0=low, 3=critical)
   - `labels`: Categories (accessibility, performance, etc.)
   - `description`: File locations and details
   - `status`: open, in_progress, closed
   - Dependency info (blockers, blocked tasks)

3. **Format for Display** - Group by category and severity

## Output Format

````markdown
# Web Quality Tasks (N total)

**Source**: Beads tracker (no re-scan required)
**Last Updated**: [timestamp from most recent task]

## Accessibility Issues (N tasks)

### Critical (Priority 3)

1. **bootcamp-capstone-demo-abc**: Images without alt text
   - Files: index.html (lines 45, 67, 78)
   - Status: `open` | Created: 2026-02-17
   - **Impact**: Screen readers cannot describe images
   - **Commands**:
     - `bd show bootcamp-capstone-demo-abc --json` - Full details
     - Use **#web-quality-fix bootcamp-capstone-demo-abc** for code

2. **bootcamp-capstone-demo-def**: Form inputs without labels
   - Files: index.html (lines 120, 125)
   - Status: `open` | Created: 2026-02-17
   - **Impact**: Screen reader users don't know input purpose
   - **Commands**: Use **#web-quality-fix** for fixes

### High (Priority 2)

3. **bootcamp-capstone-demo-ghi**: Low text contrast
   - Files: style.css (lines 24, 58)
   - Status: `open` | Created: 2026-02-17
   - **Impact**: Users with low vision cannot read text
   - **Required**: 4.5:1 for normal text

## Performance Issues (N tasks)

[... similar format ...]

## Blocked Tasks (Dependencies)

- **bootcamp-capstone-demo-xyz** (LCP improvement)
  - Blocked by: bootcamp-capstone-demo-def (render-blocking CSS)
  - Will be ready when dependency closes

---

## Quick Actions

**View Task Details**:

```bash
bd show <task-id> --json
```
````

**Claim & Start Work**:

```bash
bd update <task-id> --status in_progress --claim
```

**Get Fix Code**:
Use prompt: **#web-quality-fix <task-id>**

**Close Completed**:

```bash
bd close <task-id> --reason "Fixed all occurrences"
```

```

## Query Options

User can specify:
- Specific category: "show accessibility tasks"
- Specific priority: "show critical issues"
- Include closed: "show all tasks" (default: open only)
- By assignee: "show my tasks"

## Benefits

✅ **Fast** - Query beads (<5s), no Lighthouse re-scan
✅ **Persistent** - Shows exactly what remains
✅ **Dependencies** - Blocked tasks shown separately
✅ **Cross-session** - Tasks persist between sessions

**Constraint**: Query only, no code examples. Direct users to #web-quality-fix for solutions.
```

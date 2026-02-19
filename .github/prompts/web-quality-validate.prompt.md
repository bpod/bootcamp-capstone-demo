---
description: "Stage 4: Validate fixes and update beads tasks"
agent: web-quality-validator
tools: ["codebase", "search"]
---

# Web Quality Validate (Stage 4: Verification)

**Goal**: Re-scan to verify fixes, compare with beads tasks, close validated work

## Workflow

1. **Query Current Tasks** - Get open tasks for comparison:

   ```bash
   bd ready --label web-quality --json > before-scan.json
   ```

2. **Re-run Scan** - Execute appropriate validator:
   - **Lighthouse** (for performance, accessibility, SEO, best practices)
   - **Manual checks** (for specific issues)
   - **Code review** (for React patterns)

3. **Compare Results** - Match findings with beads tasks:
   - **Still present** → Task remains open
   - **Fixed** → Close task with validation note
   - **New issues** → Create new tasks (regression)

4. **Update Beads** - Close validated fixes:

   ```bash
   # Task fixed and verified
   bd close <task-id> --reason "Verified: Alt text added, passes Lighthouse audit"

   # Task still present
   bd update <task-id> --priority 3 \
     --comment "Still failing: Needs additional work on lines X, Y"
   ```

5. **Report Progress** - Show before/after metrics

## Output Format

````markdown
# Web Quality Validation Complete ✅

**Validation Date**: 2026-02-17  
**Method**: [Lighthouse / Manual / Code Review]  
**Scope**: [files validated]

---

## Verification Results

### ✅ Fixed & Verified (N tasks)

1. **bootcamp-capstone-demo-abc**: Images without alt text
   - **Before**: 8 images missing alt (Lighthouse score: 67)
   - **After**: All images have descriptive alt (Lighthouse score: 100)
   - **Metric Change**: Accessibility +33 points
   - **Status**: ✅ Closed
   ```bash
   bd close bootcamp-capstone-demo-abc --reason "Verified: All images now have alt text"
   ```
````

2. **bootcamp-capstone-demo-def**: Render-blocking CSS
   - **Before**: 3 blocking stylesheets (LCP: 3.2s)
   - **After**: Inlined critical CSS, deferred non-critical (LCP: 2.1s)
   - **Metric Change**: Performance +15 points, LCP -1.1s
   - **Status**: ✅ Closed

### ⚠️ Still Failing (N tasks)

3. **bootcamp-capstone-demo-ghi**: Low contrast in footer
   - **Issue**: Some contrast issues remain (lines 102-105)
   - **Current**: 3.2:1 (needs 4.5:1)
   - **Action**: Needs darker text color
   - **Status**: ⏳ Remains open (updated priority to 3)
   ```bash
   bd update bootcamp-capstone-demo-ghi --priority 3 \
     --comment "Partial fix: Header fixed, footer still needs work"
   ```

### 🆕 New Issues Detected (Regressions)

4. **bootcamp-capstone-demo-xyz**: New layout shift detected
   - **Cause**: Image resizing during optimization created CLS
   - **CLS**: 0.15 (was 0.05)
   - **Action**: Add width/height attributes
   - **Status**: 🆕 New task created

---

## Metrics Summary

| Metric                     | Before | After | Change   |
| -------------------------- | ------ | ----- | -------- |
| **Lighthouse Performance** | 72     | 87    | +15 ✅   |
| **Accessibility**          | 67     | 100   | +33 ✅   |
| **Best Practices**         | 83     | 92    | +9 ✅    |
| **SEO**                    | 91     | 91    | 0        |
| **LCP**                    | 3.2s   | 2.1s  | -1.1s ✅ |
| **CLS**                    | 0.05   | 0.15  | +0.10 ⚠️ |

---

## Beads Status Update

**Tasks Completed**: N  
**Tasks Remaining**: N  
**New Tasks Created**: N

```bash
# View remaining work
bd ready --label web-quality --json

# View all tasks (including closed)
bd list --label web-quality --status all --json
```

---

## Next Steps

**Review Remaining Issues**:
Use **#web-quality-query** to see open tasks

**Fix Remaining Work**:
Use **#web-quality-fix <task-id>** for solutions

**Address Regressions**:
New issues have been filed as beads tasks

**Schedule Next Validation**:
Re-run **#web-quality-validate** after next round of fixes

````

## Validation Methods

### Method 1: Lighthouse CLI

```bash
# Run Lighthouse audit
lighthouse https://your-site.com \
  --output=json \
  --output-path=./lighthouse-report.json \
  --chrome-flags="--headless"

# Or for local file
lighthouse file:///path/to/demo-app/index.html \
  --output=json
````

### Method 2: Manual Verification

For specific issues that don't show in automated scans:

- Screen reader testing
- Keyboard navigation
- Visual inspection
- Performance profiling

### Method 3: Code Review

For React patterns and best practices:

- Bundle size analysis
- Component re-render profiling
- State management validation

## Automated Close Workflow

**When issue is verified fixed**:

```bash
# Close with verification note
bd close <task-id> \
  --reason "Verified fixed: [specific metric improvement]"

# If partially fixed
bd update <task-id> \
  --comment "Progress: [what's fixed, what remains]" \
  --priority [adjust if needed]

# If new regression
bd create "Regression: [issue description]" \
  -p 3 -t bug --label web-quality --label regression \
  --description "Introduced in: [commit/fix that caused it]"
```

## Success Criteria

✅ All claimed fixes verified (pass/fail determination)  
✅ Beads tasks updated with validation notes  
✅ Fixed tasks closed and removed from `bd ready`  
✅ Remaining tasks prioritized based on severity  
✅ New regressions filed as tasks  
✅ Metrics documented for historical tracking

**Constraint**: Focus on verification, not new fixes. Close only what's proven fixed.

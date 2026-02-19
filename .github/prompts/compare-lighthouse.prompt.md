---
description: "Compare Lighthouse reports before/after to measure optimization impact"
tools: ["codebase", "terminal"]
---

# Compare Lighthouse Reports

**Goal**: Automatically compare before/after Lighthouse audits and quantify improvements

## Quick Start

```bash
# Compare two reports
node scripts/compare-lighthouse.js before.json after.json

# Get JSON output for programmatic use
node scripts/compare-lighthouse.js before.json after.json --format json
```

## Workflow

1. **Run baseline audit** (before fixes):

   ```bash
   lighthouse http://localhost:8080 --output=json --output-path=reports/before.json
   ```

2. **Apply fixes** from beads tasks or web-quality prompts

3. **Run comparison audit** (after fixes):

   ```bash
   lighthouse http://localhost:8080 --output=json --output-path=reports/after.json
   ```

4. **Generate comparison**:

   ```bash
   node scripts/compare-lighthouse.js reports/before.json reports/after.json
   ```

5. **Review results**:
   - Score changes by category (Performance, Accessibility, Best Practices, SEO)
   - Top audit improvements
   - Any regressions detected
   - Summary statistics

## Example Output

```markdown
=== Lighthouse Comparison Report ===

## Score Changes

| Category      | Before | After | Change | Status      |
| ------------- | ------ | ----- | ------ | ----------- |
| performance   | 72     | 85    | +13    | ✅ Improved |
| accessibility | 88     | 95    | +7     | ✅ Improved |
| bestPractices | 92     | 92    | 0      | → No change |
| seo           | 90     | 95    | +5     | ✅ Improved |

## Audit Changes

### ✅ Improvements

| Audit                               | Before | After | Change |
| ----------------------------------- | ------ | ----- | ------ |
| Image elements have explicit width  | 0      | 100   | +100   |
| Images have alt text                | 60     | 100   | +40    |
| Eliminate render-blocking resources | 50     | 90    | +40    |

## Summary

- Improved audits: 12
- Regressed audits: 0
- Unchanged audits: 45
```

## Integration with Beads Workflow

After applying fixes, document results in task:

```bash
# Run comparison
node scripts/compare-lighthouse.js before.json after.json > comparison.txt

# Update task with results
bd update <task-id> --append-notes "Performance +13pts, Accessibility +7pts - see comparison.txt"

# Close task with quantified impact
bd close <task-id> --reason "Fixed - verified with Lighthouse comparison showing +20pt total improvement"
```

## Best Practices

✅ **DO**:

- Run audits in same environment (same network, device simulation)
- Wait for page load between audits to avoid caching differences
- Save reports with descriptive names: `baseline-2024-02-19.json`, `post-image-fixes.json`
- Keep reports in `demo-app/reports/` or similar tracked location
- Document which fixes were applied between audits

❌ **DON'T**:

- Compare audits from different Lighthouse versions
- Run audits with different throttling settings
- Compare live site vs localhost (network differences skew results)
- Delete baseline reports (you need them for historical tracking)

## Advanced Usage

### Compare Multiple Reports

Track progress over time:

```bash
# Baseline
lighthouse http://localhost:8080 --output=json --output-path=reports/1-baseline.json

# After accessibility fixes
lighthouse http://localhost:8080 --output=json --output-path=reports/2-a11y-fixes.json
node scripts/compare-lighthouse.js reports/1-baseline.json reports/2-a11y-fixes.json

# After performance fixes
lighthouse http://localhost:8080 --output=json --output-path=reports/3-perf-fixes.json
node scripts/compare-lighthouse.js reports/2-a11y-fixes.json reports/3-perf-fixes.json

# Total improvement
node scripts/compare-lighthouse.js reports/1-baseline.json reports/3-perf-fixes.json
```

### JSON Output for Automation

Use JSON format for CI/CD integration:

```bash
node scripts/compare-lighthouse.js before.json after.json --format json > diff.json

# Parse with jq
cat diff.json | jq '.scoreChanges.performance.delta'  # Get performance delta
cat diff.json | jq '.auditChanges.summary.improved'   # Count improvements
```

### Detect Regressions

Fail CI if scores regress:

```bash
#!/bin/bash
RESULT=$(node scripts/compare-lighthouse.js before.json after.json --format json)
PERF_DELTA=$(echo "$RESULT" | jq '.scoreChanges.performance.delta')

if [ "$PERF_DELTA" -lt 0 ]; then
  echo "Performance regressed by $PERF_DELTA points!"
  exit 1
fi
```

## Integration with Other Prompts

- **After** `#web-quality-fix`: Verify fix actually improved scores
- **After** `#batch-fixes`: Quantify batch improvements
- **Before** `#web-quality-validate`: Confirm changes meet thresholds
- **During** optimization sessions: Track incremental progress

## Troubleshooting

**Reports look identical despite fixes**:

- Clear browser cache before after-audit
- Verify server restarted with new code
- Check reports are from different runs (compare timestamps)

**Scores worse after fixes**:

- Review audit regressions in output
- Check for unintended side effects (broken styles, scripts)
- Verify fixes didn't introduce new issues
- Run audit again to rule out flakiness

**Script errors**:

- Verify JSON files are valid Lighthouse reports
- Check Node.js version (requires Node 14+)
- Ensure files exist at specified paths

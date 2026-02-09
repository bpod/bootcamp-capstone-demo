---
description: Run comprehensive Lighthouse audit and get actionable optimization recommendations
agent: agent
tools: ["codebase", "runCommands", "getTerminalOutput", "editFiles", "search"]
---

# Lighthouse Audit and Optimization

Run a comprehensive Lighthouse audit on the application and receive prioritized, actionable optimization recommendations.

## Workflow

### Step 1: Identify Audit Target

Determine what to audit:

**Option A: Production URL**

- If ${input:url} is provided, audit that URL
- Otherwise, ask user for production URL

**Option B: Local Development**

- Check if development server is running
- If not, offer to start it
- Audit localhost URL

### Step 2: Run Lighthouse Audit

Execute Lighthouse with comprehensive output:

```bash
lighthouse ${input:url} \
  --output=json \
  --output=html \
  --output-path=./lighthouse-report \
  --view
```

**Capture All Categories:**

- Performance
- Accessibility
- Best Practices
- SEO
- Progressive Web App (if applicable)

### Step 3: Analyze Results

Parse Lighthouse JSON output and identify:

**Performance Issues:**

- Largest Contentful Paint (LCP) - Target: ≤ 2.5s
- Interaction to Next Paint (INP) - Target: ≤ 200ms
- Cumulative Layout Shift (CLS) - Target: ≤ 0.1
- First Contentful Paint (FCP)
- Total Blocking Time (TBT)
- Speed Index

**Top Opportunities:**

- Highest impact items with estimated savings
- Render-blocking resources
- Unused JavaScript/CSS
- Image optimization opportunities
- Third-party code impact

**Accessibility Violations:**

- WCAG Level A/AA failures
- Critical issues (keyboard nav, color contrast, ARIA)
- Moderate issues

**Best Practice Gaps:**

- Security issues (HTTPS, mixed content)
- Browser compatibility
- JavaScript errors / console warnings

### Step 4: Prioritize Recommendations

Rank issues by **Impact × Effort** matrix:

**High Priority (Do First):**

- High impact, low effort
- Example: Optimize uncompressed images, add missing alt text

**Medium Priority (Do Next):**

- High impact, high effort OR Low impact, low effort
- Example: Implement code splitting, refactor render-blocking CSS

**Low Priority (Do Later):**

- Low impact, high effort
- Example: Migrate to newer framework version

### Step 5: Generate Actionable Plan

For each high-priority issue, provide:

1. **Problem Description**: What's wrong and why it matters
2. **Expected Impact**: Quantified improvement (e.g., "Reduce LCP by ~1.2s")
3. **Implementation Steps**: Specific code changes or configuration
4. **Validation Method**: How to verify the fix worked
5. **Related Files**: Which files need changes

**Example**:

```markdown
## Issue: Unoptimized Hero Image (1.2MB)

**Impact**: LCP 4.2s → ~2.1s (50% reduction)
**Effort**: Low (20 minutes)

**Steps**:

1. Convert hero.jpg to WebP format
2. Add responsive srcset with multiple sizes
3. Implement lazy loading for below-fold images

**Files to Change**:

- src/components/Hero.jsx
- public/images/hero.jpg → hero.webp

**Validation**:

- Re-run Lighthouse audit
- Verify LCP ≤ 2.5s
- Check image loads in Safari (WebP fallback)
```

### Step 6: Offer Implementation Assistance

Ask user which issue to tackle first, then:

1. **Show before/after code examples**
2. **Implement changes incrementally**
3. **Run validation tests**
4. **Update memory system** with findings

**Measure-Optimize-Validate Loop:**

- Baseline metrics captured ✓
- Implement optimization
- Re-run Lighthouse to verify improvement
- Move to next issue

## Variables

- `${input:url}` - URL to audit (optional, will prompt if not provided)
- `${workspaceFolder}` - Project root directory

## Success Criteria

After running this prompt:

✅ Lighthouse audit completed with all category scores  
✅ Top 3-5 issues identified and prioritized  
✅ Actionable implementation plan provided  
✅ Clear validation steps for each recommendation  
✅ User knows exactly what to do next

## Example Usage

**In Copilot Chat:**

```
/lighthouse-audit https://my-app.com
```

**Or prompt for URL:**

```
Run the lighthouse audit prompt
> Enter URL to audit: https://my-app.com
```

**For local development:**

```
Run lighthouse audit on localhost:3000
```

## Follow-up Actions

After implementing optimizations:

1. **Re-run this prompt** to validate improvements
2. **Document findings** in .github/memory/session-notes.md
3. **Extract patterns** to .github/memory/patterns-discovered.md
4. **Commit working changes** with descriptive message

## References

- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [Testing Guidelines](../../docs/testing-guidelines.md)

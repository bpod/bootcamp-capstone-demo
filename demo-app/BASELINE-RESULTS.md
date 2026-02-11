# Baseline Audit Results

**Date**: 2026-02-11  
**Tool**: Lighthouse CLI  
**Target**: http://localhost:8080 (demo-app)  
**Report Files**: 
- [baseline.report.html](reports/baseline.report.html)
- [baseline.report.json](reports/baseline.report.json)

---

## Overall Scores

| Category | Score | Status |
|----------|-------|--------|
| **Performance** | 95 | ✅ Excellent |
| **Accessibility** | 74 | ⚠️ Needs Improvement |
| **Best Practices** | 96 | ✅ Excellent |
| **SEO** | 82 | ✅ Good |

---

## Core Web Vitals

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| **LCP** (Largest Contentful Paint) | 2.4s | ≤ 2.5s | ✅ Good |
| **CLS** (Cumulative Layout Shift) | 0.021 | ≤ 0.1 | ✅ Good |
| **TBT** (Total Blocking Time) | 0ms | ≤ 200ms | ✅ Excellent |

---

## Identified Accessibility Issues (Score: 74)

### Critical Issues

1. **Color Contrast Problems**
   - Issue: Background and foreground colors do not have sufficient contrast ratio
   - Impact: Low-contrast text is difficult or impossible for many users to read
   - Severity: High
   - WCAG Level: AA (4.5:1 for normal text, 3:1 for large text)

2. **Missing Alt Attributes**
   - Issue: Image elements do not have `[alt]` attributes
   - Impact: Screen readers cannot describe images to users
   - Severity: High
   - Elements Affected: Hero image (placeholder.com)

3. **Links Without Discernible Names**
   - Issue: Links do not have descriptive, discernible names
   - Impact: Screen reader users can't understand link purpose
   - Severity: Medium
   - Elements Affected: Navigation links with onclick handlers

---

## Intentional Issues in Demo App

The demo-app was built with the following intentional issues for testing purposes:

### Performance Issues
- ✅ Render-blocking CSS (not minified, not inlined)
- ✅ Render-blocking JavaScript
- ✅ Missing resource hints for external resources (Google Fonts)
- ✅ Images without width/height causing potential CLS
- ✅ Not using modern image formats (WebP/AVIF)
- ✅ Images not lazy loaded

### Accessibility Issues (Detected ✅)
- ✅ Missing skip navigation link
- ✅ Non-semantic HTML (divs instead of nav)
- ✅ Images without alt text
- ✅ Color contrast problems
- ✅ Inline onclick handlers instead of proper event listeners
- ✅ Links without descriptive text

### Best Practices Issues
- ✅ Inline event handlers (onclick)
- ✅ Missing error boundaries
- ✅ No error handling in JavaScript

---

## Analysis

### Why Performance Score is High (95)

Despite intentional performance issues, the score is excellent because:
- **Simple, small file sizes**: Minimal HTML/CSS/JS
- **Local serving**: No network latency
- **Minimal JavaScript execution**: Simple functions only
- **Small DOM tree**: Few elements to render

**Insight**: Performance scores are relative. A simple app can score well even with non-optimal patterns. Real-world apps with more complexity would suffer more from these issues.

### Why Accessibility Score is Lower (74)

The accessibility issues are structural and cannot be mitigated by simplicity:
- Missing alt text impacts all users with screen readers
- Color contrast affects users with vision impairments
- Poor link text impacts keyboard-only navigation

**Insight**: Accessibility issues have consistent impact regardless of app complexity. This makes them perfect for testing our accessibility-focused prompts.

---

## Testing Suitability

This baseline establishes that the demo-app is **well-suited** for testing:

✅ **Web Quality Prompts**: The accessibility score (74) + identified issues provide real problems to detect  
✅ **Performance Prompts**: While score is high, intentional anti-patterns exist to identify  
✅ **Code Quality Prompts**: Inline handlers, no error handling, non-semantic HTML  
✅ **Security Prompts**: Inline events, no CSP, potential XSS vectors  

---

## Next Steps

### Immediate (Blocked - Need VS Code Insiders)
1. ⚠️ Install VS Code Insiders or switch Copilot Chat to pre-release
2. ⚠️ Verify MCP servers load (check Output → MCP dropdown)
3. ⚠️ Test `#lighthouse-audit` prompt invocation
4. ⚠️ Test automated MCP tool execution

### After VS Code Upgrade
1. Test `lighthouse-audit` prompt - should identify all issues above
2. Test `accessibility-review` prompt - should focus on the 3 main a11y issues
3. Test `performance-optimization` prompt - should find anti-patterns despite good score
4. Test remaining 19 prompts systematically
5. Document which prompts successfully detect and provide guidance for these issues

### Alternative: Manual Testing (Can Do Now)
- Use `#file:lighthouse-audit.prompt.md` to load prompt as context
- Manually request analysis of baseline.report.json results
- Document recommendations quality without MCP automation

---

## Command Reference

```bash
# View baseline report in browser
open demo-app/reports/baseline.report.html

# Re-run audit to compare after fixes
lighthouse http://localhost:8080 --output=json --output=html --output-path=./demo-app/reports/after-fixes

# Extract specific audit results
cat demo-app/reports/baseline.report.json | jq '.categories'
```

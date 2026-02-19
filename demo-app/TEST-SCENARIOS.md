# Demo App Test Scenarios

**Purpose**: This demo app intentionally contains web quality issues to validate toolkit functionality. It serves as a comprehensive test bed for all prompts, tools, and workflows.

**Philosophy**: Keep issues realistic and educational. Each issue should demonstrate a real-world problem that developers encounter and the toolkit can detect/fix.

---

## Expected Lighthouse Scores

These baseline scores validate that the toolkit correctly detects issues:

| Category | Target Score | Expected Status | Purpose |
|----------|--------------|-----------------|---------|
| **Performance** | 90-95 | ✅ Good | Some perf issues, but not catastrophic |
| **Accessibility** | 70-80 | ⚠️ Needs Work | Multiple a11y issues for testing |
| **Best Practices** | 95+ | ✅ Excellent | Generally follows modern practices |
| **SEO** | 80-85 | ✅ Good | Some SEO issues, but fundamentals present |

**Why not 100s?** We need detectable issues to validate toolkit detection capabilities.

---

## Current Known Issues (Intentional)

### Performance Issues

#### 1. Render-Blocking Resources
**Status**: Intentionally Unfixed  
**Location**: `<head>` section  
**Issue**: CSS and JS loaded synchronously, blocking render  
**Lighthouse Audit**: `render-blocking-resources`  
**Expected Detection**: ✅ Detected by `#lighthouse-audit`, `#performance-check`

```html
<!-- ISSUE: Should use async/defer or inline critical CSS -->
<link rel="stylesheet" href="style.css" />
<script src="script.js"></script>
```

**Fix Strategy** (for testing toolkit):
- Inline critical CSS
- Defer non-critical JavaScript
- Use `async` or `defer` attributes

**Validation**: Performance score should improve ~5-10 points after fix

---

#### 2. Missing Resource Hints
**Status**: Intentionally Unfixed  
**Location**: External Google Fonts  
**Issue**: No `rel="preconnect"` for external domains  
**Lighthouse Audit**: `uses-rel-preconnect`  
**Expected Detection**: ✅ Detected by `#performance-check`

```html
<!-- ISSUE: Missing preconnect -->
<link href="https://fonts.googleapis.com/..." />
<!-- SHOULD BE: -->
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
```

**Fix Strategy**:
- Add `preconnect` hints for external resources
- Reduces DNS/TLS negotiation time

**Validation**: Time to First Byte (TTFB) should improve slightly

---

#### 3. Unoptimized Image Formats
**Status**: Intentionally Unfixed  
**Location**: Hero and feature images  
**Issue**: Using JPEG placeholders instead of WebP/AVIF  
**Lighthouse Audit**: `modern-image-formats`  
**Expected Detection**: ✅ Detected by `#web-quality-scan`

```html
<!-- ISSUE: Old format -->
<img src="https://via.placeholder.com/1200x600.jpg" />
<!-- SHOULD USE: WebP with JPEG fallback -->
<picture>
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="...">
</picture>
```

**Fix Strategy**:
- Convert to WebP/AVIF with fallbacks
- Implement responsive images with `srcset`

**Validation**: Image payload should reduce by 30-50%

---

### Accessibility Issues

#### 4. Color Contrast Failures
**Status**: Intentionally Unfixed (Mixed - some fixed, some broken)  
**Location**: Feature card: "Easy to Use" heading  
**Issue**: `color: #888` on white background fails WCAG AA (contrast ratio ~2.8:1)  
**WCAG Criterion**: 1.4.3 Contrast (Minimum) - Level AA  
**Expected Detection**: ✅ Detected by `#accessibility-check`, axe-core

```html
<!-- ISSUE: Low contrast -->
<h3 style="color: #888">Easy to Use</h3>
<!-- NEEDS: color: #333 or darker (ratio ≥ 4.5:1) -->
```

**Why Partially Fixed**: Demonstrates batch fix scenarios - "fix all contrast issues together"

**Fix Strategy**:
- Use color contrast checker (WebAIM or similar)
- Ensure 4.5:1 for normal text, 3:1 for large text
- Test with toolkit's accessibility-check prompt

**Validation**: Accessibility score should improve ~5-10 points after batch fix

---

#### 5. Non-Semantic Navigation
**Status**: Intentionally Unfixed  
**Location**: Header navigation  
**Issue**: Using `<div class="navigation">` instead of `<nav>`  
**WCAG Criterion**: 1.3.1 Info and Relationships - Level A  
**Expected Detection**: ✅ Detected by `#accessibility-check`, manual review

```html
<!-- ISSUE: Non-semantic -->
<div class="navigation">
  <a href="#home">Home</a>
</div>
<!-- SHOULD BE: -->
<nav aria-label="Main navigation">
  <a href="#home">Home</a>
</nav>
```

**Fix Strategy**:
- Replace with semantic HTML5 elements
- Add ARIA labels for context

**Validation**: Screen reader testing, semantic HTML validation

---

#### 6. Missing Skip Navigation Link
**Status**: Intentionally Unfixed  
**Location**: Before `<header>`  
**Issue**: No skip link for keyboard users  
**WCAG Criterion**: 2.4.1 Bypass Blocks - Level A  
**Expected Detection**: ⚠️ Manual detection (not all automated tools catch this)

```html
<!-- MISSING: -->
<a href="#main-content" class="skip-link">Skip to main content</a>
```

**Fix Strategy**:
- Add skip link that becomes visible on focus
- Link should jump to main content area

**Validation**: Tab through page - skip link should appear first

---

#### 7. Inline Event Handlers (Anti-Pattern)
**Status**: Intentionally Unfixed  
**Location**: "Learn More" button, navigation links  
**Issue**: Using `onclick` instead of event listeners  
**Best Practice**: Separation of concerns, CSP-compliant  
**Expected Detection**: ⚠️ Manual detection, CSP validation

```html
<!-- ISSUE: Inline onclick -->
<button onclick="showModal()">Learn More</button>
<!-- SHOULD BE: -->
<button id="learn-more-btn">Learn More</button>
<script>
  document.getElementById('learn-more-btn').addEventListener('click', showModal);
</script>
```

**Fix Strategy**:
- External event listeners
- Enables Content Security Policy (CSP)

**Validation**: Check CSP compliance

---

### SEO Issues

#### 8. Missing Meta Description (Partial - one exists)
**Status**: Intentionally kept broken for testing  
**Location**: `<head>` section  
**Issue**: Could be improved, but present  
**Lighthouse Audit**: `meta-description`  
**Expected Detection**: ✅ Detected by `#web-quality-scan`

**Current**: Has basic description  
**Enhancement Opportunity**: Could be more compelling and keyword-rich

**Fix Strategy**:
- Optimize description for click-through rate
- Include primary keywords
- Keep under 160 characters

---

#### 9. Missing Structured Data
**Status**: Intentionally Unfixed  
**Location**: Entire page  
**Issue**: No JSON-LD schema markup  
**SEO Impact**: Poor rich snippet support  
**Expected Detection**: ⚠️ Manual detection

```json
<!-- MISSING: Schema.org structured data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Demo App",
  "description": "...",
  "url": "..."
}
</script>
```

**Fix Strategy**:
- Add appropriate schema.org types
- Validate with Google Rich Results Test

**Validation**: Rich snippet preview in search results

---

## Future Enhancement Opportunities

These issues could be **added** to increase test coverage:

### Additional Performance Issues

- [ ] **Large JavaScript Bundle** - Add unused dependencies to test bundle analysis
- [ ] **Missing Image Lazy Loading** - Hero image currently not lazy (correct), but add more images below fold
- [ ] **No Service Worker** - Offline capability and caching strategy
- [ ] **Third-Party Script Bloat** - Add analytics/tracking scripts to test impact

### Additional Accessibility Issues

- [ ] **Form Without Labels** - Add contact form with missing `<label>` associations
- [ ] **Missing ARIA Landmarks** - More complex page structure needing roles
- [ ] **Keyboard Trap** - Modal that doesn't trap focus properly
- [ ] **Missing Focus Indicators** - Custom focus styles that fail visibility requirements
- [ ] **Poor Heading Hierarchy** - Skipped heading levels (h1 → h3)

### React-Specific Issues (When React Added)

- [ ] **Unnecessary Re-renders** - Component updating too frequently
- [ ] **Missing Keys in Lists** - Dynamic lists without proper keys
- [ ] **Inline Function Definitions** - Functions created on every render
- [ ] **Prop Drilling** - Passing props through multiple levels
- [ ] **Large Component Files** - Single file >500 lines

### Additional SEO Issues

- [ ] **Missing Canonical URL** - Multiple URLs for same content
- [ ] **No Open Graph Tags** - Social media sharing metadata
- [ ] **Missing XML Sitemap** - Crawlability issues
- [ ] **Robots.txt Issues** - Blocking important resources

---

## Toolkit Validation Workflow

Use this checklist to validate toolkit functionality:

### 1. Detection Phase

```bash
# Test web-quality-scan
@workspace #web-quality-scan

# Expected: Should detect ALL issues listed above
# Validate: Compare detected issues with this document
```

### 2. Lighthouse Integration

```bash
# Test lighthouse audit
lighthouse http://localhost:8080 --output=json --output-path=baseline.json

# Expected Scores:
# - Performance: 90-95
# - Accessibility: 70-80
# - Best Practices: 95+
# - SEO: 80-85
```

### 3. Fix Application

```bash
# Test individual fix workflow
@workspace #web-quality-fix <task-id>

# Should provide before/after code with explanations
```

### 4. Batch Fix Workflow

```bash
# Test batch fixes
@workspace #batch-fixes accessibility

# Expected: Group related issues (all contrast problems together)
```

### 5. Comparison Workflow

```bash
# Apply a fix, re-run audit
lighthouse http://localhost:8080 --output=json --output-path=after-fix.json

# Compare results
node scripts/compare-lighthouse.js baseline.json after-fix.json

# Expected: Quantified improvement in affected category
```

### 6. Query and Tracking

```bash
# Test beads integration
bd list --label accessibility --status open

# Expected: See unfixed accessibility issues
```

---

## Success Criteria

The toolkit is working correctly if:

✅ **Detection**: All issues listed above are identified by appropriate prompts  
✅ **Grouping**: Batch fixes correctly group related issues by category  
✅ **Fix Quality**: Generated fixes follow web standards and best practices  
✅ **Measurement**: Comparison script accurately quantifies improvements  
✅ **Integration**: Beads workflow tracks progress and provides context  
✅ **Documentation**: Fix explanations include rationale and authoritative references

---

## Maintenance Notes

**When to Update This Document**:
- New issues added to demo app
- New toolkit features requiring validation
- Discovery of edge cases or blind spots
- Changes to Lighthouse audits or WCAG standards

**Philosophy**: Demo app should remain **broken enough to be useful**, but not so broken it's unrealistic. Real-world apps don't score 0s - they have specific, addressable issues.

---

## Related Documents

- [BASELINE-RESULTS.md](BASELINE-RESULTS.md) - Initial audit results
- [VALIDATION.md](VALIDATION.md) - Toolkit validation against external standards
- [TEST-PLAN.md](TEST-PLAN.md) - Comprehensive testing strategy
- [Demo Script](DEMO-SCRIPT.md) - Live demonstration workflow

---

**Last Updated**: 2026-02-19  
**Status**: Comprehensive test coverage for current toolkit features  
**Next Review**: When new toolkit features added or Lighthouse standards updated

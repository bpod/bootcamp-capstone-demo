# Demo App - Web Quality Testing

## Purpose

This demo application intentionally contains **numerous web quality, performance, and accessibility issues**. It serves as:

1. **Testing Ground**: Validate web quality prompts and workflows
2. **Documentation Example**: Demonstrate real-world problem detection and fixes
3. **Training Material**: Show before/after improvements with concrete metrics

## Intentional Issues

### Performance Issues

**Lighthouse Performance Category:**
- ❌ Render-blocking CSS and JavaScript
- ❌ No resource hints (preconnect, prefetch, preload)
- ❌ Images without width/height (Cumulative Layout Shift)
- ❌ Not using modern image formats (WebP/AVIF)
- ❌ No lazy loading for below-the-fold images
- ❌ Large third-party library (lodash) for minimal usage
- ❌ No code splitting or minification
- ❌ Expensive CSS properties (box-shadow, transforms)
- ❌ Animations without `prefers-reduced-motion`
- ❌ Scroll/resize handlers without debouncing

**Core Web Vitals:**
- ❌ **LCP (Largest Contentful Paint)**: Hero image not optimized
- ❌ **INP (Interaction to Next Paint)**: Blocking JavaScript operations
- ❌ **CLS (Cumulative Layout Shift)**: Images without dimensions

### Accessibility Issues (WCAG 2.1 Level AA)

**Perceivable:**
- ❌ Images missing alt text
- ❌ Poor color contrast (headings with `#aaa`, `#999`, `#888`)
- ❌ No text alternatives for icon images

**Operable:**
- ❌ Missing skip navigation link
- ❌ No focus indicators (`outline: none` on buttons)
- ❌ Clickable divs instead of buttons/links
- ❌ No keyboard support for interactive elements
- ❌ Modal without focus management or ESC key handler

**Understandable:**
- ❌ Form inputs without associated labels
- ❌ No validation feedback
- ❌ Generic link text ("click here" style)

**Robust:**
- ❌ Non-semantic HTML (divs instead of nav, main, blockquote)
- ❌ Missing ARIA attributes (modal, navigation)
- ❌ No ARIA labels for icon-only links

### JavaScript Issues

**Performance:**
- ❌ Global variable pollution
- ❌ No event delegation (listeners in loops)
- ❌ Synchronous blocking operations
- ❌ Unnecessary intervals
- ❌ Reading DOM properties in every scroll/resize
- ❌ Memory leaks (event listeners not cleaned up)

**Best Practices:**
- ❌ Inline event handlers (onclick)
- ❌ No `'use strict'`
- ❌ Using `alert()` instead of accessible feedback
- ❌ No input validation or sanitization
- ❌ Mixed ES5/ES6 patterns

### CSS Issues

**Performance:**
- ❌ Expensive properties (box-shadow on hover)
- ❌ Transition on `all` properties
- ❌ No mobile-first approach
- ❌ Missing responsive breakpoints
- ❌ Overly specific selectors

**Accessibility:**
- ❌ No focus styles for keyboard navigation
- ❌ Animations without `prefers-reduced-motion` check
- ❌ Poor color contrast

### HTML Issues

**Semantics:**
- ❌ Non-semantic divs instead of nav, main, article, aside
- ❌ Missing skip link for keyboard users
- ❌ Divs used for interactive elements

**Forms:**
- ❌ Inputs without labels
- ❌ No fieldset/legend for form grouping
- ❌ Missing autocomplete attributes

**Images:**
- ❌ Missing width/height attributes
- ❌ No lazy loading
- ❌ Not using modern formats

## Testing Workflow

### 1. Baseline Audit

Run Lighthouse audit to establish baseline metrics:

```bash
# Install Lighthouse CLI if not already installed
npm install -g lighthouse

# Run audit (requires local server)
npx http-server demo-app -p 8080
lighthouse http://localhost:8080 --output=html --output-path=./demo-app/reports/baseline.html
```

Expected baseline scores:
- Performance: ~40-50 (Poor)
- Accessibility: ~60-70 (Needs Improvement)
- Best Practices: ~70-80 (Okay)
- SEO: ~80-90 (Good)

### 2. Test Each Prompt

Go through each web quality prompt and document:
- What issues it detects
- What recommendations it provides
- How helpful the guidance is
- Any gaps in coverage

**Prompts to Test:**
1. `lighthouse-audit.prompt.md`
2. `accessibility-review.prompt.md`
3. `performance-optimization.prompt.md`
4. `core-web-vitals.prompt.md`
5. `image-optimization.prompt.md`
6. `bundle-analysis.prompt.md`

### 3. Apply Fixes

Document the before/after for key improvements:
- Lighthouse score changes
- Core Web Vitals improvements
- Accessibility improvements
- Bundle size reductions

### 4. Document Findings

Create examples showing:
- Original problematic code
- Prompt output/guidance
- Fixed code
- Measured improvements

## Usage

### Serve Locally

```bash
# Using Python (Python 3)
cd demo-app
python3 -m http.server 8080

# Using Node.js http-server
npx http-server demo-app -p 8080

# Using PHP
cd demo-app
php -S localhost:8080
```

### Run Lighthouse Audit

```bash
# Performance audit
lighthouse http://localhost:8080 --only-categories=performance

# Accessibility audit
lighthouse http://localhost:8080 --only-categories=accessibility

# Full audit
lighthouse http://localhost:8080 --output=html --output-path=./report.html
```

### Run Accessibility Tests

```bash
# Install axe-core CLI
npm install -g @axe-core/cli

# Run accessibility audit
axe http://localhost:8080 --save results.json
```

## Expected Improvements

After applying fixes guided by the prompts, expect:

**Performance:**
- Lighthouse score: 40-50 → 90-95
- LCP: >4s → <2.5s
- INP: >500ms → <200ms
- CLS: >0.25 → <0.1

**Accessibility:**
- Lighthouse score: 60-70 → 95-100
- WCAG compliance: Fails → Level AA compliant
- Axe violations: ~20-30 → 0

**Bundle Size:**
- JavaScript: ~250KB → ~20KB (remove lodash, minify)
- Images: Use WebP, lazy loading
- CSS: Minify, remove unused styles

## Next Steps

1. ✅ Create demo app with intentional issues
2. ⏳ Test each web quality prompt workflow
3. ⏳ Document findings and improvements
4. ⏳ Create before/after examples for documentation
5. ⏳ Update quick-start guide with real examples
6. ⏳ Create validation summary report

## Notes

This is a **deliberately flawed** application. Do not use as a template for production code!

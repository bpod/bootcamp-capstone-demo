---
name: Browser Compatibility Check
description: Check code for cross-browser compatibility issues
agent: frontend-developer
tools: ["readonly"]
---

# Browser Compatibility Check

Analyze code for browser compatibility issues and provide guidance for supporting target browsers.

## Analysis Areas

1. **JavaScript Features**: ES6+ feature support
2. **CSS Properties**: Modern CSS feature support
3. **APIs**: Browser API availability
4. **Polyfills**: Required polyfills for target browsers

## Target Browser Guidelines

**Modern Approach** (recommended):

- Last 2 versions of Chrome, Firefox, Safari, Edge
- iOS Safari 13+
- Android Chrome 90+

**Wide Compatibility** (conservative):

- IE11 support requires significant polyfills
- Older mobile browsers need careful testing

## Common Compatibility Issues

**JavaScript:**

- Optional chaining (`?.`) - Chrome 80+, Safari 13.1+
- Nullish coalescing (`??`) - Chrome 80+, Safari 13.1+
- Private fields (`#field`) - Chrome 74+, Safari 14.1+
- Top-level await - Chrome 89+, Safari 15+

**CSS:**

- Grid layout - IE11 needs prefixes
- CSS variables - No IE11 support
- Flexbox gap - Chrome 84+, Safari 14.1+
- Container queries - Chrome 105+, Safari 16+

**APIs:**

- IntersectionObserver - IE11 needs polyfill
- ResizeObserver - IE11 needs polyfill
- fetch() - IE11 needs polyfill

## Output Format

Provide compatibility report with:

1. **Issues Found**: Features used that may not be supported
2. **Browser Impact**: Which browsers affected
3. **Solutions**: Polyfills, fallbacks, or alternative approaches
4. **Testing Recommendations**: BrowserStack or cross-browser testing strategy

Include caniuse.com links for relevant features.

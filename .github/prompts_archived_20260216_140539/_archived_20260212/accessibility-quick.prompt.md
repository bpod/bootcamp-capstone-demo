---
description: Quick accessibility scan identifying top 5 critical WCAG violations
agent: accessibility-expert
tools: ["readonly", "web-quality"]
---

Identify **top 5 most critical** WCAG 2.1 Level AA violations in ${file} or ${selection} for immediate fixes.

**Your Task**: Scan code, list top 5 Critical/High issues ranked by severity and ease of fix, provide one-line code fixes for each.

**Common Critical Violations**:

1. **Images without alt text** (WCAG 1.1.1): `<img>` missing `alt` attribute
2. **Poor color contrast** (WCAG 1.4.3): Text/background contrast <4.5:1 (normal) or <3:1 (large text)
3. **Form inputs without labels** (WCAG 3.3.2): `<input>`, `<select>`, `<textarea>` missing `<label>` or `aria-label`
4. **Non-semantic interactive elements** (WCAG 4.1.2): `<div onClick>` instead of `<button>`, generic containers instead of `<nav>`, `<main>`, etc.
5. **Missing keyboard support** (WCAG 2.1.1): Custom widgets without `tabIndex`, `onKeyDown`, or visible focus indicators

**Output Format**:

```
1. [Specific issue found] - WCAG X.X.X
   Fix: [One-line code example]

2. [Next issue] - WCAG X.X.X
   Fix: [One-line code example]
...
```

**Critical Rule**: Focus on highest-impact issues that block users. Keyboard navigation failures and missing alt text take priority. For comprehensive audit use `#accessibility-review` prompt.

**Success Criteria**: User can immediately copy-paste fixes to resolve top 5 critical violations within 5 minutes.

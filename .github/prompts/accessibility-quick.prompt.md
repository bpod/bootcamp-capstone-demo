---
description: Quick accessibility scan identifying top 5 critical WCAG violations
agent: accessibility-expert
tools: ["readonly", "web-quality"]
---

Identify **top 5 most critical** WCAG 2.1 Level AA violations in ${file} or ${selection}.

**Common Violations**:

1. **Images without alt text** (WCAG 1.1.1)
2. **Poor color contrast** < 4.5:1 (WCAG 1.4.3)
3. **Form inputs without labels** (WCAG 3.3.2)
4. **Non-semantic elements** - div onClick instead of button (WCAG 4.1.2)
5. **Missing keyboard navigation** - custom widgets without keyboard support (WCAG 2.1.1)

**Workflow**: Scan code → List top 5 issues → Provide quick fixes

**Output Format**:

```
1. [Issue] - [WCAG Criterion]
   Fix: [One-line code example]

2. [Issue] - [WCAG Criterion]
   Fix: [One-line code example]
...
```

Focus on highest-impact, easiest-to-fix issues. For comprehensive audit, use `accessibility-review` prompt.

- Check inline styles and CSS classes

3. **Form inputs without labels** (WCAG 3.3.2 - Level A)
   - `<input>`, `<textarea>`, `<select>` without associated `<label>`
   - Missing `aria-label` or `aria-labelledby`
   - Placeholder used as label (not sufficient)

4. **Non-semantic HTML** (WCAG 4.1.2 - Level A)
   - `<div onClick>` instead of `<button>`
   - `<div>` for navigation instead of `<nav>`
   - Generic containers instead of semantic elements

5. **Missing ARIA attributes** (WCAG 4.1.2 - Level A)
   - Interactive elements without roles
   - Icon-only buttons without `aria-label`
   - Modals without `role="dialog"` and `aria-modal="true"`

## Output Format

For each issue found, provide:

````markdown
### Issue #1: [Issue Type]

**Line(s)**: [line numbers]  
**Severity**: Critical | High | Medium  
**WCAG**: [criterion number]

**Current code:**

```[language]
[problematic code]
```
````

**Fixed code:**

```[language]
[corrected code with explanation]
```

**Why it matters**: [Brief explanation of user impact]

````

## Prioritization

- **Critical**: Blocks users completely (no alt text, no labels, keyboard traps)
- **High**: Significantly impairs users (poor contrast, non-semantic HTML)
- **Medium**: Creates confusion (missing ARIA hints, unclear labels)

Focus on **quick wins** - issues that are easy to fix with high impact.

## Example Output

### Issue #1: Images Missing Alt Text

**Line(s)**: 42, 61, 63, 65
**Severity**: Critical
**WCAG**: 1.1.1 (Non-text Content)

**Current code:**
```html
<img src="hero.jpg" class="hero-image" />
````

**Fixed code:**

```html
<img
  src="hero.jpg"
  class="hero-image"
  alt="Team collaborating on web development"
/>
```

**Why it matters**: Screen reader users hear "image" with no context. They can't understand page content.

---

Keep it focused, actionable, and quick to implement.

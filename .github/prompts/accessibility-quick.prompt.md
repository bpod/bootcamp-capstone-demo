---
name: accessibility-quick
description: Quick accessibility audit - find top 5 WCAG 2.1 Level AA violations
---

# Quick Accessibility Audit

Identify the **top 5 most critical** WCAG 2.1 Level AA violations in ${file} or ${selection}.

## Focus Areas

Scan for these common violations:

1. **Images without alt text** (WCAG 1.1.1 - Level A)
   - `<img>` tags missing `alt` attribute
   - Icon images without accessible labels

2. **Poor color contrast** (WCAG 1.4.3 - Level AA)
   - Text contrast < 4.5:1 (normal text)
   - Large text contrast < 3:1 (18pt+ or 14pt+ bold)
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

***

Keep it focused, actionable, and quick to implement.

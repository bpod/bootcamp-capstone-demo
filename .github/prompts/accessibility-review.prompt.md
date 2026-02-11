---
name: accessibility-review
description: Comprehensive accessibility review following WCAG 2.1 Level AA standards
---

# Accessibility Review and Remediation

Perform a comprehensive accessibility audit of components or pages and provide specific fixes for WCAG 2.1 Level AA compliance.

## Workflow

### Step 1: Define Audit Scope

Determine what to audit:

**If ${selection} is provided:**

- Audit the selected component or code block
- Focus on component-specific a11y issues

**If ${file} is provided:**

- Audit the entire file
- Check all components in the file

**If neither provided:**

- Ask user: "What should I audit? (component name, file path, or URL)"
- Search codebase for the target

### Step 2: Automated Accessibility Checks

Run automated accessibility testing tools:

**Browser-based (if URL provided):**

```bash
# Using pa11y for automated WCAG testing
npx pa11y ${input:url} --standard WCAG2AA --reporter json
```

**Code-based (for components):**

```bash
# Using eslint-plugin-jsx-a11y
npm run lint -- --ext .jsx,.tsx

# Or run specific accessibility linter
npx eslint ${file} --plugin jsx-a11y
```

### Step 3: Manual Accessibility Review

Review code for common WCAG violations:

**1. Semantic HTML (WCAG 4.1.2)**
Check for:

- ❌ `<div onClick={}>` instead of `<button>`
- ❌ `<div>` for navigation instead of `<nav>`
- ❌ `<div>` for headings instead of `<h1>`-`<h6>`
- ✅ Proper use of semantic elements

**2. Keyboard Navigation (WCAG 2.1.1)**
Check for:

- ❌ Missing `tabIndex` on custom interactive elements
- ❌ Focus trapped in modals without escape route
- ❌ Interactive elements without keyboard handlers
- ✅ All interactive elements accessible via Tab
- ✅ Focus indicators visible (3:1 contrast ratio)

**3. ARIA Attributes (WCAG 4.1.2, 4.1.3)**
Check for:

- ❌ Missing `aria-label` on icon-only buttons
- ❌ Incorrect `role` attributes
- ❌ `aria-labelledby` referencing non-existent IDs
- ✅ Proper ARIA when semantic HTML insufficient
- ✅ ARIA states updated correctly (aria-expanded, aria-pressed)

**4. Color Contrast (WCAG 1.4.3)**
Check for:

- ❌ Text with contrast < 4.5:1 (normal text)
- ❌ Large text with contrast < 3:1 (18pt+ or 14pt+ bold)
- ❌ Interactive elements with contrast < 3:1
- ✅ All text meets minimum contrast ratios

**5. Form Accessibility (WCAG 3.3.2)**
Check for:

- ❌ Inputs without associated `<label>`
- ❌ Missing `aria-required` or `required` attributes
- ❌ Error messages not announced to screen readers
- ❌ Placeholder used as label
- ✅ Every input has explicit label
- ✅ Error states have `aria-invalid` and `aria-describedby`

**6. Images and Media (WCAG 1.1.1)**
Check for:

- ❌ Images without `alt` attributes
- ❌ Decorative images with non-empty alt text
- ❌ Videos without captions/transcripts
- ✅ Descriptive alt text for meaningful images
- ✅ `alt=""` for decorative images

**7. Dynamic Content (WCAG 4.1.3)**
Check for:

- ❌ Content updates not announced (missing aria-live)
- ❌ Loading states not communicated
- ❌ Focus lost after dynamic updates
- ✅ Loading indicators accessible
- ✅ Dynamic updates use aria-live regions

### Step 4: Prioritize Issues

Categorize findings by severity:

**Critical (Fix Immediately):**

- Complete keyboard navigation failures
- Missing alt text on essential images
- Forms without labels
- Color contrast below minimum thresholds
- ARIA errors causing screen reader confusion

**High Priority (Fix Soon):**

- Improper semantic HTML (divs as buttons)
- Missing ARIA labels on icon buttons
- Focus management issues in modals
- Insufficient focus indicators

**Medium Priority (Fix When Possible):**

- ARIA best practice improvements
- Enhanced screen reader experience
- Better error messaging

**Low Priority (Nice to Have):**

- Descriptive alt text improvements
- Additional ARIA hints
- Enhanced keyboard shortcuts

### Step 5: Provide Specific Fixes

For each issue, provide:

**Before (Current Code):**

```jsx
// ❌ Accessibility violation
<div onClick={handleClick}>Click me</div>
```

**After (Fixed Code):**

```jsx
// ✅ Accessible implementation
<button onClick={handleClick} aria-label="Submit form">
  Click me
</button>
```

**Explanation:**

- Why this matters (WCAG criterion)
- How it affects users (screen reader users, keyboard-only users)
- Validation method (test with keyboard, check with screen reader)

### Step 6: Screen Reader Testing Mental Model

Simulate screen reader experience:

**For each interactive element:**

1. What will be announced? (role + accessible name)
2. How does user activate it? (Enter, Space, click)
3. What feedback is provided? (success/error states)

**Example:**

```jsx
<button aria-label="Delete task" onClick={handleDelete}>
  <TrashIcon />
</button>
```

**Screen Reader Announces:**

- "Delete task, button"
- User presses Enter/Space to activate
- Deletion confirmed with aria-live message

### Step 7: Generate Accessibility Report

Create summary report:

```markdown
## Accessibility Audit Report

**Audit Date**: [Date]
**Scope**: [Component/File/URL]
**WCAG Level**: AA (Level 2.1)

### Summary

- ✅ Passed: X checks
- ⚠️ Warnings: Y issues
- ❌ Failures: Z critical issues

### Critical Issues (Z)

1. [Issue]: [Description]
   - **WCAG**: [Criterion]
   - **Impact**: [Who's affected]
   - **Fix**: [Code example]

### High Priority Issues (Y)

[List with fixes...]

### Recommendations

[Additional improvements...]

### Next Steps

1. Fix critical issues immediately
2. Test with keyboard navigation
3. Manual test with screen reader (NVDA/JAWS/VoiceOver)
4. Re-run automated audit to verify
```

## Testing Workflow

After implementing fixes:

**1. Keyboard Testing:**

```
- Tab through all interactive elements
- Verify focus visible at all times
- Test Enter/Space to activate
- Test Escape to dismiss modals
```

**2. Screen Reader Testing:**

```
- Enable VoiceOver (Mac): Cmd+F5
- Enable NVDA (Windows): Download and run
- Navigate with screen reader controls
- Verify all content announced correctly
```

**3. Automated Re-test:**

```bash
npx pa11y ${url} --standard WCAG2AA
```

## Variables

- `${selection}` - Selected code to audit
- `${file}` - Current file path
- `${input:url}` - URL to audit (optional)

## Success Criteria

✅ All WCAG 2.1 Level AA violations identified  
✅ Specific code fixes provided with before/after  
✅ Issues prioritized by severity  
✅ Screen reader impact explained  
✅ Validation steps included  
✅ Follow-up testing checklist provided

## Example Usage

**Audit current file:**

```
Run accessibility review on this file
```

**Audit selected component:**

```
[Select component code]
Run accessibility review
```

**Audit production site:**

```
Run accessibility review on https://my-app.com
```

## Follow-up Actions

1. **Document findings** in session-notes.md
2. **Create accessibility pattern** in patterns-discovered.md (if recurring)
3. **Run Lighthouse audit** to verify improved a11y score
4. **Manual testing** with real screen reader

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Testing with Screen Readers](https://webaim.org/articles/screenreader_testing/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

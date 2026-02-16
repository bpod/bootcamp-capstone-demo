---
name: React Accessibility Review
description: Review React components for accessibility compliance
agent: frontend-developer
tools: ["react-dev", "readonly"]
---

# React Accessibility Review

Specialized accessibility review for React components, focusing on React-specific patterns and common a11y issues in React applications.

## Review Focus

1. **Semantic JSX**: Proper HTML elements in JSX
2. **ARIA in React**: Correct attribute naming and usage
3. **Event Handlers**: Keyboard and pointer event accessibility
4. **Focus Management**: Refs and focus control
5. **Accessible Forms**: Labels, validation, error messages
6. **Dynamic Content**: Announcements and live regions

## React-Specific A11y Patterns

**Keyboard Event Handling:**

```jsx
function AccessibleButton({ onClick, children }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div role="button" tabIndex={0} onClick={onClick} onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
}
```

**Focus Management:**

```jsx
function Modal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement;
      modalRef.current?.focus();
    } else {
      previousFocus.current?.focus();
    }
  }, [isOpen]);

  return (
    <div ref={modalRef} role="dialog" aria-modal="true" tabIndex={-1}>
      {/* Modal content */}
    </div>
  );
}
```

**Form Accessibility:**

```jsx
function AccessibleInput({ label, error, ...props }) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <span id={errorId} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
```

**Live Regions for Dynamic Content:**

```jsx
function SearchResults({ results, loading }) {
  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {loading ? "Searching..." : `Found ${results.length} results`}
      </div>
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </>
  );
}
```

## Common React A11y Issues

**❌ Anti-Patterns:**

- Using `<div>` with `onClick` instead of `<button>`
- Missing keyboard handlers for custom interactive elements
- Incorrect ARIA attribute naming (`aria-label` vs `ariaLabel` in JSX)
- Missing focus management in modals/dialogs
- Form inputs without associated labels
- Missing or incorrect ARIA live regions for dynamic content

**✅ Best Practices:**

- Use semantic HTML elements when possible
- Add keyboard support for all custom interactive elements
- Use React's built-in `useId()` for linking labels and inputs
- Manage focus with `useRef()` and `useEffect()`
- Provide screen reader announcements for state changes
- Test with keyboard navigation and screen readers

## Analysis Workflow

1. Review component structure for semantic HTML
2. Check custom interactive elements for keyboard support
3. Verify ARIA attributes are correctly named (JSX format)
4. Analyze focus management in modals/dynamic UI
5. Review form accessibility patterns
6. Check for screen reader announcements
7. Identify missing keyboard navigation

## Output Format

Provide structured findings:

1. **Critical Issues**: Blocks usage for keyboard/screen reader users
2. **High Priority**: Significant usability problems
3. **Medium Priority**: Should be fixed but has workarounds
4. **Recommendations**: Specific React code examples
5. **Testing Steps**: How to verify improvements

Include React-specific code examples for all recommendations.

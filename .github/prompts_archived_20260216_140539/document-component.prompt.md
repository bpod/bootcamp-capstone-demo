---
name: Document Component
description: Generate component documentation with usage examples
agent: frontend-developer
tools: ["readonly"]
---

# Document Component

Generate comprehensive documentation for React components, including props, usage examples, and best practices.

## Documentation Structure

1. **Component Overview**: Purpose and use cases
2. **Props API**: All props with types and descriptions
3. **Usage Examples**: Common scenarios with code
4. **Accessibility**: A11y considerations and ARIA usage
5. **Styling**: How to customize appearance
6. **Best Practices**: Recommended usage patterns

## Component Documentation Template

````markdown
# Button Component

A reusable button component that supports multiple variants and sizes.

## Props

| Prop       | Type                                   | Default     | Description                 |
| ---------- | -------------------------------------- | ----------- | --------------------------- |
| `variant`  | `'primary' \| 'secondary' \| 'danger'` | `'primary'` | Visual style variant        |
| `size`     | `'sm' \| 'md' \| 'lg'`                 | `'md'`      | Button size                 |
| `disabled` | `boolean`                              | `false`     | Disables button interaction |
| `loading`  | `boolean`                              | `false`     | Shows loading spinner       |
| `onClick`  | `() => void`                           | -           | Click handler function      |
| `children` | `ReactNode`                            | -           | Button content              |

## Usage

```jsx
import { Button } from './components/Button';

// Primary button
<Button onClick={() => console.log('clicked')}>
  Click Me
</Button>

// Secondary with loading state
<Button variant="secondary" loading>
  Submitting...
</Button>

// Danger button (destructive actions)
<Button variant="danger" onClick={handleDelete}>
  Delete Account
</Button>
```

## Accessibility

- Uses semantic `<button>` element
- Supports keyboard navigation (Enter and Space)
- Disabled state prevents interaction and is announced to screen readers
- Loading state announced via `aria-busy` attribute

## Styling

The component uses CSS modules. To customize:

```css
.button {
  /* Override default styles */
}
```

Or pass a `className` prop for custom styling.

## Best Practices

✅ **Do:**

- Use appropriate variant for the action context
- Provide clear, action-oriented button labels
- Use `loading` state for async operations

❌ **Don't:**

- Don't use for navigation (use Link component)
- Don't nest buttons inside buttons
- Don't make the button too small for touch targets (min 44x44px)
````

## Output Format

Generate documentation that includes:

1. **Component name and description**
2. **Props table**: All props with types, defaults, descriptions
3. **Usage examples**: 3-5 realistic scenarios
4. **Accessibility notes**: A11y features and considerations
5. **Styling guide**: How to customize appearance
6. **Best practices**: Do's and don'ts

Documentation should be copy-paste ready for README files or Storybook.

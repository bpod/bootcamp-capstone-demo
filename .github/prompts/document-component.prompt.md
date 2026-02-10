---
description: Generate comprehensive component documentation with props, usage examples, accessibility notes, and TypeScript types
agent: frontend-developer
tools: ["codebase", "search", "problems"]
---

# Component Documentation Generator

Generate comprehensive, maintainable documentation for React components including props, usage examples, accessibility considerations, and TypeScript types. Follows JSDoc/TSDoc conventions with practical examples.

**Focus**: Create documentation that helps developers use the component correctly and efficiently.

---

## Documentation Generation Workflow

### Step 1: Analyze Component

**Understand component structure:**

1. **Component Name and Purpose** - What does this component do?
2. **Props Interface** - What inputs does it accept?
3. **Component Variants** - Does it support different modes/styles?
4. **State Management** - Internal state or controlled props?
5. **Side Effects** - API calls, events, timers?
6. **Accessibility Features** - ARIA, keyboard support, focus management?
7. **Dependencies** - External libraries, context providers?

**Example Analysis:**

```typescript
// Component to document
interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  onClick,
  children,
  icon,
  fullWidth = false,
}: ButtonProps) {
  // Implementation...
}
```

**Key Points to Document:**

- Purpose: Buttons for user actions
- Variants: 3 visual styles
- Sizes: 3 size options
- Loading state: Disables and shows spinner
- Accessibility: Proper disabled state, keyboard support
- Customization: Icon support, full-width option

---

### Step 2: Generate Component Header Documentation

**JSDoc/TSDoc Format:**

```typescript
/**
 * A versatile button component with multiple variants, sizes, and states.
 * Supports loading states, icons, and full keyboard accessibility.
 *
 * @component
 * @example
 * // Basic usage
 * <Button onClick={handleClick}>Click me</Button>
 *
 * @example
 * // With variant and icon
 * <Button variant="primary" icon={<SaveIcon />} onClick={handleSave}>
 *   Save Changes
 * </Button>
 *
 * @example
 * // Loading state
 * <Button loading={true} onClick={handleSubmit}>
 *   Submit
 * </Button>
 */
export function Button({ ... }: ButtonProps) {
  // ...
}
```

**Key Sections:**

1. **Brief Description** - One-line summary
2. **Detailed Description** - Features, use cases, behavior
3. **@component** tag - Identifies as React component
4. **@example** tags - Multiple usage examples (basic → advanced)

---

### Step 3: Document Props Interface

**TypeScript Interface Documentation:**

```typescript
/**
 * Props for the Button component.
 */
export interface ButtonProps {
  /**
   * Visual style variant of the button.
   * - `primary`: Main action (e.g., submit, save)
   * - `secondary`: Less prominent actions
   * - `danger`: Destructive actions (e.g., delete)
   * @default 'primary'
   */
  variant?: "primary" | "secondary" | "danger";

  /**
   * Size of the button.
   * - `small`: Compact size (32px height)
   * - `medium`: Default size (40px height)
   * - `large`: Prominent size (48px height)
   * @default 'medium'
   */
  size?: "small" | "medium" | "large";

  /**
   * Whether the button is disabled.
   * Disables interaction and changes visual appearance.
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the button is in loading state.
   * Shows spinner and disables interaction.
   * @default false
   */
  loading?: boolean;

  /**
   * Click event handler.
   * Called when user clicks the button (not called when disabled or loading).
   * @param event - React mouse event
   */
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Button content (text, elements).
   */
  children: React.ReactNode;

  /**
   * Optional icon to display before button text.
   * Should be 16x16 or 20x20 SVG icon.
   */
  icon?: React.ReactNode;

  /**
   * Whether button should take full width of container.
   * @default false
   */
  fullWidth?: boolean;
}
```

**Documentation Guidelines:**

✅ **DO**:

- Describe what each prop does
- Explain different option meanings
- Document default values
- Specify dimensions, formats, units
- Note when props affect other props

❌ **DON'T**:

- Copy prop name as description ("variant: The variant")
- Leave obvious props undocumented
- Forget to document complex types

---

### Step 4: Create Usage Examples

**Basic Example:**

```typescript
/**
 * @example
 * // Basic button
 * <Button onClick={() => console.log('Clicked')}>
 *   Click Me
 * </Button>
 */
```

**Variant Examples:**

```typescript
/**
 * @example
 * // Primary button (default)
 * <Button variant="primary" onClick={handleSave}>
 *   Save
 * </Button>
 *
 * @example
 * // Secondary button
 * <Button variant="secondary" onClick={handleCancel}>
 *   Cancel
 * </Button>
 *
 * @example
 * // Danger button for destructive actions
 * <Button variant="danger" onClick={handleDelete}>
 *   Delete Account
 * </Button>
 */
```

**State Examples:**

```typescript
/**
 * @example
 * // Disabled button
 * <Button disabled onClick={handleClick}>
 *   Cannot Click
 * </Button>
 *
 * @example
 * // Loading button
 * <Button loading onClick={handleSubmit}>
 *   Submitting...
 * </Button>
 */
```

**Advanced Examples:**

```typescript
/**
 * @example
 * // Button with icon
 * import { SaveIcon } from './icons';
 *
 * <Button icon={<SaveIcon />} onClick={handleSave}>
 *   Save Changes
 * </Button>
 *
 * @example
 * // Full-width button in form
 * <form>
 *   <input type="email" />
 *   <Button fullWidth onClick={handleSubmit}>
 *     Sign Up
 *   </Button>
 * </form>
 *
 * @example
 * // Controlled loading state
 * const [loading, setLoading] = useState(false);
 *
 * const handleSubmit = async () => {
 *   setLoading(true);
 *   await submitForm();
 *   setLoading(false);
 * };
 *
 * <Button loading={loading} onClick={handleSubmit}>
 *   Submit
 * </Button>
 */
```

---

### Step 5: Document Accessibility

**Accessibility Section:**

````markdown
## Accessibility

### Keyboard Support

- **Enter/Space**: Activates button when focused
- **Tab**: Focuses button (respects tab order)
- Button cannot be focused when disabled or loading

### ARIA Attributes

- Automatically includes `role="button"` (native button element)
- `aria-disabled="true"` applied when disabled
- `aria-busy="true"` applied when loading
- Icon receives `aria-hidden="true"` (decorative)

### Screen Reader Behavior

**Normal state:**

```html
<button>Save Changes</button>
<!-- Announced as: "Save Changes, button" -->
```
````

**Loading state:**

```html
<button aria-busy="true">
  <span aria-hidden="true">⟳</span> Submitting...
</button>
<!-- Announced as: "Submitting, button, busy" -->
```

**Disabled state:**

```html
<button disabled>Delete</button>
<!-- Announced as: "Delete, button, dimmed" or skipped -->
```

### Best Practices

✅ **DO**:

- Use descriptive button text (not "Click here")
- Provide loading text that explains what's happening
- Ensure 44×44px minimum touch target for mobile
- Maintain 3:1 contrast ratio for focus indicators

❌ **DON'T**:

- Rely only on color to convey state (use icons, text)
- Hide disabled buttons (show and disable instead)
- Use icon-only buttons without labels

````

---

### Step 6: Document Browser Support

**Browser Compatibility Section:**

```markdown
## Browser Support

### Supported Browsers

- ✅ Chrome/Edge (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ iOS Safari (iOS 14+)
- ✅ Chrome Android (latest)

### Polyfills Required

None. Uses only standard HTML/CSS/React features.

### Known Issues

- **Safari < 14.0**: Focus visible indicator may not display correctly
  - Workaround: Manually apply `:focus-visible` polyfill
- **IE11**: Not supported (component uses modern JavaScript)

### Progressive Enhancement

- Component degrades gracefully without JavaScript
- Loading state requires JavaScript (shows normal button otherwise)
- Icon prop requires JavaScript (omitted in no-JS environment)
````

---

### Step 7: Add Implementation Notes

**Internal Details (For Maintainers):**

```markdown
## Implementation Notes

### Component Architecture
```

Button
├── Handles click events
├── Manages loading/disabled states
├── Renders icon (optional)
└── Applies variant/size styles

```

### State Management

- **Controlled**: Parent manages loading state
- **Internal**: Button manages focus, hover, active states

### Styling

- CSS Modules: `Button.module.css`
- Utility Classes: Tailwind (if applicable)
- Variants: Separate classes for each variant

### Dependencies

- React 18+
- No external libraries required
- Optional: Icon library (user-provided)

### Performance Considerations

- Component is lightweight (~2KB gzipped)
- No re-renders unless props change
- Memoization not required (simple component)

### Testing

See `Button.test.tsx` for comprehensive test suite:
- Renders all variants and sizes
- Handles click events correctly
- Respects disabled and loading states
- Keyboard navigation works
- Accessibility checks pass
```

---

### Step 8: Create Standalone README (Optional)

**Component README (Button/README.md):**

````markdown
# Button Component

A versatile, accessible button component with multiple variants, sizes, and states.

## Quick Start

```tsx
import { Button } from "@/components/Button";

function App() {
  return <Button onClick={() => alert("Clicked")}>Click Me</Button>;
}
```
````

## Props

| Prop        | Type                                   | Default     | Description                |
| ----------- | -------------------------------------- | ----------- | -------------------------- |
| `variant`   | `'primary' \| 'secondary' \| 'danger'` | `'primary'` | Visual style variant       |
| `size`      | `'small' \| 'medium' \| 'large'`       | `'medium'`  | Button size                |
| `disabled`  | `boolean`                              | `false`     | Disable button interaction |
| `loading`   | `boolean`                              | `false`     | Show loading spinner       |
| `onClick`   | `(e: MouseEvent) => void`              | _required_  | Click handler              |
| `children`  | `ReactNode`                            | _required_  | Button content             |
| `icon`      | `ReactNode`                            | -           | Optional icon              |
| `fullWidth` | `boolean`                              | `false`     | Full container width       |

## Examples

### Basic Button

```tsx
<Button onClick={handleClick}>Click Me</Button>
```

### Variants

```tsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="danger">Delete</Button>
```

### With Icon

```tsx
import { SaveIcon } from "@/icons";

<Button icon={<SaveIcon />} onClick={handleSave}>
  Save
</Button>;
```

### Loading State

```tsx
const [loading, setLoading] = useState(false);

<Button loading={loading} onClick={handleSubmit}>
  {loading ? "Submitting..." : "Submit"}
</Button>;
```

## Accessibility

- Fully keyboard accessible
- Screen reader compatible
- WCAG 2.1 Level AA compliant
- 44×44px touch targets

## Browser Support

Chrome, Firefox, Safari, Edge (latest 2 versions)

## Testing

```bash
npm test Button.test.tsx
```

## Related

- [Icon Component](../Icon/README.md)
- [Form Components](../Form/README.md)

````

---

## Documentation Templates

### Template 1: Simple Component

```typescript
/**
 * [Component Name] - [One-line description]
 *
 * [Detailed description of purpose and behavior]
 *
 * @component
 * @example
 * <ComponentName prop1="value" />
 */
export function ComponentName(props: ComponentNameProps) {
  // ...
}

/**
 * Props for [Component Name].
 */
export interface ComponentNameProps {
  /**
   * [Prop description]
   * @default [default value]
   */
  prop1: string;
}
````

### Template 2: Complex Component with Multiple Examples

```typescript
/**
 * [Component Name] - [One-line description]
 *
 * [Detailed description]
 *
 * Features:
 * - Feature 1
 * - Feature 2
 * - Feature 3
 *
 * @component
 *
 * @example
 * // Basic usage
 * <ComponentName />
 *
 * @example
 * // With props
 * <ComponentName prop1="value" prop2={true} />
 *
 * @example
 * // Advanced usage
 * <ComponentName
 *   prop1="value"
 *   onEvent={(data) => console.log(data)}
 * >
 *   <Child />
 * </ComponentName>
 */
```

### Template 3: Hook Documentation

```typescript
/**
 * [Hook Name] - [One-line description]
 *
 * [Detailed description of what the hook does]
 *
 * @param {ParamType} param1 - [Description]
 * @returns {ReturnType} [Description of returned value]
 *
 * @example
 * const result = useHookName(input);
 *
 * @example
 * // With options
 * const result = useHookName(input, {
 *   option1: true,
 *   option2: false
 * });
 */
export function useHookName(param: ParamType): ReturnType {
  // ...
}
```

---

## Style Guide

### Writing Style

✅ **DO**:

- Use present tense ("Returns the user" not "Will return")
- Be specific ("Shows a loading spinner" not "Handles loading")
- Include units ("32px" not "small")
- Explain why, not just what ("Disables to prevent double-submission")

❌ **DON'T**:

- Use jargon without explanation
- Write overly technical descriptions
- Assume knowledge of internals
- Leave examples uncommented

### Code Examples

✅ **DO**:

- Show realistic use cases
- Include imports when needed
- Comment complex examples
- Demonstrate error handling
- Show both controlled and uncontrolled usage

❌ **DON'T**:

- Use placeholder values (foo, bar)
- Show only happy path
- Omit necessary context
- Use deprecated patterns

### Prop Descriptions

✅ **DO**:

```typescript
/**
 * Callback fired when user submits the form.
 * Receives validated form data as parameter.
 * @param data - Form data that passed validation
 */
onSubmit: (data: FormData) => void;
```

❌ **DON'T**:

```typescript
/**
 * onSubmit callback
 */
onSubmit: (data: FormData) => void;
```

---

## Variables

- `${selection}` - Selected component code (optional)
- `${file}` - Component file path (optional)
- `${workspaceFolder}` - Project root directory

---

## Success Criteria

After running this prompt:

✅ Component purpose clearly explained  
✅ All props documented with types and descriptions  
✅ Multiple usage examples provided (basic to advanced)  
✅ Accessibility features documented  
✅ Browser support specified  
✅ Examples are copy-paste ready  
✅ Documentation follows JSDoc/TSDoc conventions

---

## Example Usage

**Generate Documentation for Existing Component:**

```
@workspace /document-component

[Select component code or provide file path]
```

**With Specific Component:**

```
Document the Button component in src/components/Button.tsx
```

**For TypeScript Component:**

```
Generate comprehensive documentation with TypeScript types for the DataTable component
```

---

## Follow-up Actions

After generating documentation:

1. **Review Generated Docs** - Ensure accuracy and completeness
2. **Add Examples to Storybook** - Create stories matching documentation examples
3. **Update README** - Add component to project's component catalog
4. **Run Documentation Linter** - Check for JSDoc errors
5. **Generate Type Definitions** - Ensure .d.ts files are up-to-date
6. **Update Component Tests** - Verify examples from docs are tested

---

## Documentation Tools

### JSDoc/TSDoc

```bash
# Generate documentation site
npx typedoc --out docs src

# Validate JSDoc comments
npx eslint --plugin jsdoc
```

### Storybook

```bash
# Generate stories from documentation
npx storybook
```

### Type Checking

```bash
# Verify TypeScript types in documentation
npm run type-check
```

---

## Common Patterns

### Pattern 1: Controlled Component

```typescript
/**
 * Controlled input component.
 * Parent manages value via `value` and `onChange` props.
 *
 * @example
 * const [text, setText] = useState('');
 * <Input value={text} onChange={(e) => setText(e.target.value)} />
 */
```

### Pattern 2: Compound Component

```typescript
/**
 * Accordion component with sub-components.
 *
 * @example
 * <Accordion>
 *   <Accordion.Item>
 *     <Accordion.Trigger>Section 1</Accordion.Trigger>
 *     <Accordion.Content>Content here</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 */
```

### Pattern 3: Render Props

```typescript
/**
 * Component using render prop pattern.
 *
 * @example
 * <DataFetcher url="/api/users">
 *   {({ data, loading, error }) => (
 *     loading ? <Spinner /> : <UserList users={data} />
 *   )}
 * </DataFetcher>
 */
```

---

## References

- [JSDoc Documentation](https://jsdoc.app/)
- [TSDoc Specification](https://tsdoc.org/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Storybook Documentation](https://storybook.js.org/docs/react/writing-docs/introduction)
- [TypeDoc (TypeScript Documentation Generator)](https://typedoc.org/)

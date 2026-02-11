---
description: "Review React component for best practices, performance, accessibility, and maintainability"
---

# React Component Review

Comprehensive review of React components against best practices. Covers component structure, state management, performance optimization, accessibility, testing, and common anti-patterns.

**Applies to**: React functional components (.jsx, .tsx files)

---

## Review Checklist

This workflow reviews components across 8 dimensions:

1. **Component Structure** - Organization, readability, single responsibility
2. **State Management** - Proper useState, useReducer, state colocation
3. **Performance** - Memoization, code splitting, re-render optimization
4. **Accessibility** - WCAG compliance, semantic HTML, ARIA
5. **Error Handling** - Error boundaries, loading states, edge cases
6. **Testing** - Testability, React Testing Library patterns
7. **TypeScript** - Type safety, prop types, generics (if applicable)
8. **Anti-Patterns** - Common mistakes and code smells

---

## 1. Component Structure Review

### ✅ Good Component Organization

A well-structured component follows this order:

```jsx
import { useState, useEffect, useMemo } from 'react'; // React imports
import { helpers } from './utils';                   // Third-party
import { Button } from './Button';                   // Local components
import './styles.css';                               // Styles

// ✅ TypeScript: Define props interface first
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

// ✅ Main component export
export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  // 1. State declarations
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 2. Computed values (useMemo, useCallback)
  const displayName = useMemo(() => {
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
  }, [user]);

  // 3. Effects
  useEffect(() => {
    loadUser(userId);
  }, [userId]);

  // 4. Event handlers
  const handleSave = useCallback(async () => {
    // Handle save logic
  }, [user]);

  // 5. Helper functions (or extract to utils)
  async function loadUser(id: string) {
    setIsLoading(true);
    const data = await fetchUser(id);
    setUser(data);
    setIsLoading(false);
  }

  // 6. Early returns (loading, error states)
  if (isLoading) return <LoadingSpinner />;
  if (!user) return <ErrorMessage>User not found</ErrorMessage>;

  // 7. Main render
  return (
    <div className="user-profile">
      <h1>{displayName}</h1>
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
}
```

### ❌ Anti-Pattern: Poor Organization

```jsx
// ❌ BAD: Random order, hard to read
export function UserProfile({ userId, onUpdate }) {
  const displayName = user ? `${user.firstName} ${user.lastName}` : "Unknown";

  async function loadUser(id) {
    /* ... */
  }

  useEffect(() => {
    loadUser(userId);
  }, [userId]);

  const [user, setUser] = useState(null); // State scattered
  const handleSave = async () => {
    /* ... */
  };
  const [isLoading, setIsLoading] = useState(false); // More scattered state

  return <div>{displayName}</div>;
}
```

**Check For:**

- [ ] Imports organized (React → third-party → local → styles)
- [ ] Props interface/types defined before component
- [ ] State declared together at top
- [ ] Computed values (useMemo, useCallback) before effects
- [ ] Effects before event handlers
- [ ] Helper functions after hooks
- [ ] Early returns before main render
- [ ] Single responsibility (component does one thing well)

---

## 2. State Management Review

### ✅ Best Practices

**Proper useState initialization:**

```jsx
// ✅ GOOD: Initialize arrays correctly
const [items, setItems] = useState<Item[]>([]);  // Empty array, not null

// ✅ GOOD: Initialize objects correctly
const [formData, setFormData] = useState({
  name: '',
  email: '',
  preferences: []
});
```

**State colocation:**

```jsx
// ✅ GOOD: State lives close to where it's used
function UserForm() {
  const [formData, setFormData] = useState(initialData); // Used only here

  return <form>{/* form fields */}</form>;
}

// ❌ BAD: State in parent when only child needs it
function ParentComponent() {
  const [formData, setFormData] = useState(initialData); // Only UserForm uses this

  return <UserForm data={formData} onChange={setFormData} />;
}
```

**Derived state (don't store what can be computed):**

```jsx
// ❌ BAD: Storing derived state
const [users, setUsers] = useState([]);
const [activeUsers, setActiveUsers] = useState([]); // Derived from users!

useEffect(() => {
  setActiveUsers(users.filter((u) => u.active)); // Unnecessary sync
}, [users]);

// ✅ GOOD: Compute derived values
const [users, setUsers] = useState([]);
const activeUsers = useMemo(() => users.filter((u) => u.active), [users]);
```

**Check For:**

- [ ] Arrays initialized as `[]` not `null`
- [ ] Objects initialized properly (not `null` or `undefined`)
- [ ] State colocated (lives in most specific component needing it)
- [ ] No derived state (values computed from other state)
- [ ] State updates use functional form when depending on previous value

---

## 3. Performance Optimization Review

### When to Use React.memo

**✅ Use memo for expensive pure components:**

```jsx
// Component re-renders frequently with same props
export const ExpensiveList = React.memo(function ExpensiveList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
});
```

**❌ Don't over-use memo:**

```jsx
// ❌ BAD: Memo on simple component (overhead > benefit)
export const SimpleButton = React.memo(function SimpleButton({ label }) {
  return <button>{label}</button>;
});
```

### useMemo and useCallback Guidelines

**✅ Use when profiling shows benefit:**

```jsx
// ✅ GOOD: Expensive computation, run only when dependencies change
const sortedAndFilteredItems = useMemo(() => {
  return items
    .filter((item) => item.category === category)
    .sort((a, b) => a.priority - b.priority);
}, [items, category]);

// ✅ GOOD: Function passed to memoized child
const MemoizedChild = React.memo(ChildComponent);

function Parent() {
  const handleClick = useCallback(() => {
    // Handle click
  }, []); // Stable reference prevents MemoizedChild re-render

  return <MemoizedChild onClick={handleClick} />;
}
```

**❌ Premature optimization:**

```jsx
// ❌ BAD: Simple calculation doesn't need useMemo
const doubled = useMemo(() => count * 2, [count]);

// ✅ GOOD: Just compute directly
const doubled = count * 2;
```

### Code Splitting (Lazy Loading)

```jsx
import { lazy, Suspense } from "react";

// ✅ Lazy load heavy components
const HeavyChart = lazy(() => import("./HeavyChart"));
const RichTextEditor = lazy(() => import("./RichTextEditor"));

export function Dashboard() {
  return (
    <div>
      <Suspense fallback={<LoadingSpinner />}>
        <HeavyChart data={chartData} />
      </Suspense>

      <Suspense fallback={<div>Loading editor...</div>}>
        <RichTextEditor />
      </Suspense>
    </div>
  );
}
```

**Check For:**

- [ ] React.memo used only for expensive components (after profiling)
- [ ] useMemo/useCallback used when profiling shows benefit
- [ ] Heavy components lazy-loaded with React.lazy
- [ ] Suspense boundaries provide loading states
- [ ] No premature optimization (profile first!)

---

## 4. Accessibility Review

### Semantic HTML

```jsx
// ❌ BAD: Div soup
<div onClick={handleClick}>Submit</div>
<div onClick={handleNav}>Products</div>

// ✅ GOOD: Semantic elements
<button onClick={handleClick}>Submit</button>
<a href="/products">Products</a>
```

### Keyboard Navigation

```jsx
// ✅ All interactive elements keyboard accessible
export function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return;

    // Focus management
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
    >
      <h2 id="modal-title">Modal Title</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

### Form Accessibility

```jsx
// ✅ GOOD: Labels, error messages, ARIA attributes
export function EmailInput({ error }) {
  const inputId = useId();
  const errorId = `${inputId}-error`;

  return (
    <div>
      <label htmlFor={inputId}>Email Address</label>
      <input
        id={inputId}
        type="email"
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        required
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

**Check For:**

- [ ] Semantic HTML (`button`, `nav`, `main`, `article` vs generic `div`)
- [ ] All interactive elements keyboard accessible
- [ ] Focus management (modals, dynamic content)
- [ ] ARIA attributes used correctly (don't over-ARIA)
- [ ] Form inputs have labels (htmlFor + id)
- [ ] Error messages associated with inputs (aria-describedby)
- [ ] Images have alt text
- [ ] Color not the only indicator (text labels for status)

---

## 5. Error Handling Review

### Loading States

```jsx
// ✅ GOOD: Clear loading, error, and success states
export function UserProfile({ userId }) {
  const [user, setUser] = (useState < User) | (null > null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = (useState < string) | (null > null);

  useEffect(() => {
    async function loadUser() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchUser(userId);
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load user");
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [userId]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!user) return <EmptyState>User not found</EmptyState>;

  return <div>{/* Render user */}</div>;
}
```

### Error Boundaries

```jsx
// ✅ Create error boundary for component trees
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

**Check For:**

- [ ] Loading states handled explicitly
- [ ] Error states handled explicitly
- [ ] Empty states handled (no data scenarios)
- [ ] Error boundaries wrap component trees
- [ ] Async errors caught and displayed to users
- [ ] Network failures have retry mechanisms

---

## 6. Testing & Testability Review

### Testable Component Structure

```jsx
// ✅ GOOD: Testable component
export function SearchBox({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} role="search">
      <label htmlFor="search-input">Search</label>
      <input
        id="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

**Test (React Testing Library):**

```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("calls onSearch when form submitted", async () => {
  const handleSearch = vi.fn(); // or jest.fn() if using Jest
  render(<SearchBox onSearch={handleSearch} />);

  const input = screen.getByRole("searchbox");
  const submitButton = screen.getByRole("button", { name: /search/i });

  await userEvent.type(input, "React testing");
  await userEvent.click(submitButton);

  expect(handleSearch).toHaveBeenCalledWith("React testing");
});
```

**Check For:**

- [ ] Components accept behavior via props (onSearch, onClick, etc.)
- [ ] Side effects isolated (API calls in parent, not component)
- [ ] Semantic HTML enables role-based queries
- [ ] Tests use React Testing Library (behavior, not implementation)
- [ ] Tests avoid implementation details (no `.state()`, `.instance()`)
- [ ] Mock external dependencies (API, localStorage, etc.)

---

## 7. TypeScript Review (if applicable)

### Proper Prop Types

```typescript
// ✅ GOOD: Explicit prop interface
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  children
}: ButtonProps) {
  // ...
}

// ✅ GOOD: Generic component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

export function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
```

**Check For:**

- [ ] Prop interfaces defined and exported
- [ ] Optional props marked with `?`
- [ ] Default values provided for optional props
- [ ] Event handlers typed correctly (`() => void`, `(e: Event) => void`)
- [ ] Generic types used for reusable components
- [ ] No `any` types (use `unknown` if type truly unknown)

---

## 8. Common Anti-Patterns

### ❌ Inline Object/Array Creation in JSX

```jsx
// ❌ BAD: Creates new object every render
<UserProfile user={{ name: 'John', age: 30 }} />
<List items={[1, 2, 3]} />

// ✅ GOOD: Stable reference
const user = { name: 'John', age: 30 };
const items = [1, 2, 3];
<UserProfile user={user} />
<List items={items} />
```

### ❌ Missing Keys in Lists

```jsx
// ❌ BAD: Index as key
{
  items.map((item, index) => <Item key={index} data={item} />);
}

// ✅ GOOD: Stable unique identifier
{
  items.map((item) => <Item key={item.id} data={item} />);
}
```

### ❌ Direct State Mutation

```jsx
// ❌ BAD: Mutating state directly
const addItem = (newItem) => {
  items.push(newItem); // Mutates!
  setItems(items);
};

// ✅ GOOD: Create new array
const addItem = (newItem) => {
  setItems([...items, newItem]);
};
```

### ❌ useEffect Dependencies

```jsx
// ❌ BAD: Missing dependencies
useEffect(() => {
  fetchData(userId); // userId not in dependency array!
}, []);

// ✅ GOOD: All dependencies listed
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

**Check For:**

- [ ] No inline object/array creation in JSX props
- [ ] Unique, stable keys in lists (not index)
- [ ] No direct state mutation (use spread, map, filter)
- [ ] useEffect dependencies complete (or use ESLint rule)
- [ ] No nested component definitions
- [ ] No string refs (use useRef)

---

## Review Summary Template

```markdown
## Component Review: [ComponentName]

### ✅ Strengths

- [List what the component does well]

### ⚠️ Issues Found

#### Critical

- [Accessibility violations, major bugs]

#### High Priority

- [Performance issues, missing error handling]

#### Medium Priority

- [Code organization, testability improvements]

#### Low Priority / Nice-to-Have

- [Code style, minor optimizations]

### 📋 Recommended Actions

1. [First action with code example]
2. [Second action with code example]
3. [Third action with code example]

### 📚 Resources

- [Link to relevant documentation]
```

---

## Success Criteria

✅ **Structure**: Clear organization, single responsibility, follows established pattern  
✅ **State**: Properly initialized, colocated, no derived state  
✅ **Performance**: Memoization used judiciously, code split where appropriate  
✅ **Accessibility**: Semantic HTML, keyboard navigation, ARIA when needed  
✅ **Error Handling**: Loading, error, and empty states handled  
✅ **Testable**: Behavior via props, side effects isolated  
✅ **TypeScript**: Proper types, no `any`, exported interfaces  
✅ **No Anti-Patterns**: Stable keys, no mutations, complete dependencies

---

## Related Resources

- [react-component.instructions.md](../instructions/react-component.instructions.md) - Auto-applied React guidelines
- [accessibility-review.prompt.md](accessibility-review.prompt.md) - Detailed a11y audit
- [React Documentation](https://react.dev) - Official React docs
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) - TypeScript patterns

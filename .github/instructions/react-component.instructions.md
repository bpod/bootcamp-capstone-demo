---
description: React component development guidelines for performance, accessibility, and best practices
applyTo: "**/*.jsx,**/*.tsx"
---

# React Component Instructions

These guidelines apply when creating or editing React components (.jsx/.tsx files). Follow these patterns for consistent, performant, and accessible components.

## Component Structure

### Functional Components with Hooks

**Always use functional components:**

```jsx
// ✅ Functional component
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  // ...
}

// ❌ Avoid class components
class UserProfile extends Component {
  // ...
}
```

### Component Organization

```jsx
// 1. Imports (external, then internal)
import { useState, useEffect } from "react";
import { fetchUser } from "../api/users";

// 2. Component definition
function UserProfile({ userId }) {
  // 3. State hooks
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 4. Effects
  useEffect(() => {
    // Effect logic
  }, [userId]);

  // 5. Event handlers
  const handleClick = () => {
    // Handler logic
  };

  // 6. Derived state/memoized values
  const displayName = user ? `${user.firstName} ${user.lastName}` : "";

  // 7. Early returns for loading/error states
  if (loading) return <LoadingSpinner />;
  if (!user) return <ErrorMessage />;

  // 8. Main render
  return <div>{/* JSX */}</div>;
}

// 9. Export
export default UserProfile;
```

## State Management

### Initialize State Correctly

**Arrays/Collections:**

```jsx
// ✅ Initialize with empty array (enables .map without checks)
const [users, setUsers] = useState([]);

// ❌ Avoid null/undefined for collections
const [users, setUsers] = useState(null); // requires defensive checks
```

**See pattern**: [Service State Initialization](../memory/patterns-discovered.md#pattern-service-state-initialization)

### State Colocation

Keep state as local as possible:

```jsx
// ✅ State only in component that needs it
function SearchResults() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  // ...
}

// ❌ Avoid lifting state unnecessarily
function App() {
  const [searchQuery, setSearchQuery] = useState(""); // Don't lift until needed by siblings
  // ...
}
```

## Performance Optimization

### Memoization (When Profiled)

**Only optimize when you've measured the problem:**

```jsx
// ✅ Memoize expensive computations
const sortedUsers = useMemo(() => {
  return users.sort((a, b) => a.name.localeCompare(b.name));
}, [users]);

// ✅ Memoize callbacks passed to child components
const handleClick = useCallback(
  (userId) => {
    // Handle click
  },
  [
    /* dependencies */
  ],
);

// ❌ Don't memoize everything prematurely
const displayName = useMemo(
  () => `${firstName} ${lastName}`,
  [firstName, lastName],
); // Overkill
```

### Code Splitting

```jsx
// ✅ Lazy load heavy components
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./Dashboard"));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Dashboard />
    </Suspense>
  );
}
```

## Accessibility (Non-Negotiable)

### Semantic HTML

```jsx
// ✅ Use semantic elements
<button onClick={handleClick}>Submit</button>
<nav aria-label="Main navigation">...</nav>

// ❌ Avoid divs for interactive elements
<div onClick={handleClick}>Submit</div>
```

### ARIA Attributes

```jsx
// ✅ Add ARIA when semantic HTML insufficient
<button
  aria-label="Close dialog"
  onClick={handleClose}
>
  <CloseIcon />
</button>

// ✅ Manage focus for dynamic content
<div role="alert" aria-live="polite">
  {errorMessage}
</div>
```

### Form Accessibility

```jsx
// ✅ Associate labels with inputs
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? "email-error" : undefined}
/>
{errors.email && <span id="email-error">{errors.email}</span>}

// ❌ Avoid placeholder-as-label
<input placeholder="Email" /> // Not accessible
```

## Testing

### Component Tests with React Testing Library

**Test user behavior, not implementation:**

```jsx
import { render, screen, userEvent } from "@testing-library/react";

test("submits form with user data", async () => {
  render(<SignupForm />);

  // Find elements by their accessible roles/labels
  const emailInput = screen.getByLabelText(/email/i);
  const submitButton = screen.getByRole("button", { name: /sign up/i });

  // Simulate user actions
  await userEvent.type(emailInput, "user@example.com");
  await userEvent.click(submitButton);

  // Assert on outcomes, not implementation details
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});
```

**Don't test implementation details:**

```jsx
// ❌ Avoid testing state directly
expect(component.state.email).toBe("user@example.com");

// ✅ Test user-visible behavior
expect(screen.getByDisplayValue("user@example.com")).toBeInTheDocument();
```

## TypeScript (When Applicable)

```typescript
// ✅ Define prop types
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

function UserProfile({ userId, onUpdate }: UserProfileProps) {
  // ...
}

// ✅ Type event handlers
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setEmail(event.target.value);
};

// ✅ Type state
const [user, setUser] = useState<User | null>(null);
```

## Common Patterns

### Loading States

```jsx
function DataComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData()
      .then((data) => setData(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <div>{/* Render data */}</div>;
}
```

### Conditional Rendering

```jsx
// ✅ Early returns for major conditions
if (loading) return <LoadingSpinner />;

// ✅ Ternary for simple conditions
{
  isLoggedIn ? <Dashboard /> : <LoginPrompt />;
}

// ✅ Logical AND for conditional display
{
  errorMessage && <ErrorAlert message={errorMessage} />;
}

// ❌ Avoid nested ternaries
{
  condition1 ? condition2 ? <A /> : <B /> : <C />;
} // Hard to read
```

## Anti-Patterns to Avoid

❌ **Mutating state directly**

```jsx
users.push(newUser); // Don't mutate
setUsers(users);

// ✅ Create new array
setUsers([...users, newUser]);
```

❌ **Using index as key**

```jsx
{
  items.map((item, index) => <div key={index}>{item}</div>);
}

// ✅ Use stable unique ID
{
  items.map((item) => <div key={item.id}>{item}</div>);
}
```

❌ **Inline object/array creation in props**

```jsx
<Child style={{ margin: 10 }} data={[1, 2, 3]} />; // Creates new reference on every render

// ✅ Define outside or memoize
const style = { margin: 10 };
const data = [1, 2, 3];
<Child style={style} data={data} />;
```

## Plug-In Architecture Adherence

**Detect existing patterns in the project:**

- Check if project uses a specific state management library (Zustand, Jotai, Redux)
- Adapt to existing styling approach (CSS Modules, styled-components, Tailwind)
- Follow project's testing patterns (if using different matchers, assertions)
- Match existing component organization and file structure

**Don't enforce specific tools** - adapt to what the project already uses.

## References

- [React Documentation](https://react.dev/)
- [React Testing Library](https://testing-library.com/react)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Project Patterns](../memory/patterns-discovered.md)

---

**Remember**: Components should be performant, accessible, and testable. When in doubt, optimize for clarity and accessibility first.

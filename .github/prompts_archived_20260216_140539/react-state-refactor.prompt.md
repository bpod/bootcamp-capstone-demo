---
name: React State Refactor
description: Refactor complex state management to simpler patterns
agent: frontend-developer
tools: ["react-dev", "readonly"]
---

# React State Refactor

Refactor complex or problematic state management into cleaner, more maintainable patterns.

## When to Use This Prompt

- State is overly complex or nested
- Multiple related state values update together
- Prop drilling is excessive (passing props 3+ levels)
- State updates cause performance issues
- State logic is duplicated across components

## Refactoring Strategies

**1. Multiple Related States → useReducer:**

```jsx
// ❌ Before: Multiple related useState calls
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);

// ✅ After: Single useReducer for related state
const [state, dispatch] = useReducer(dataReducer, {
  loading: false,
  error: null,
  data: null,
});

function dataReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { loading: true, error: null, data: null };
    case "FETCH_SUCCESS":
      return { loading: false, error: null, data: action.payload };
    case "FETCH_ERROR":
      return { loading: false, error: action.payload, data: null };
    default:
      return state;
  }
}
```

**2. Prop Drilling → Context:**

```jsx
// ❌ Before: Props passed through multiple levels
<App>
  <Layout user={user} theme={theme}>
    <Dashboard user={user} theme={theme}>
      <Widget user={user} theme={theme} />
    </Dashboard>
  </Layout>
</App>;

// ✅ After: Context for shared state
const AppContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  return (
    <AppContext.Provider value={{ user, theme, setUser, setTheme }}>
      <Layout>
        <Dashboard>
          <Widget />
        </Dashboard>
      </Layout>
    </AppContext.Provider>
  );
}

function Widget() {
  const { user, theme } = useContext(AppContext);
  // Use directly without prop drilling
}
```

**3. Complex State Logic → Custom Hook:**

```jsx
// ❌ Before: State logic mixed in component
function Form() {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    // validation logic...
  };

  const handleBlur = (name) => {
    setTouched((t) => ({ ...t, [name]: true }));
    // validation logic...
  };

  // render...
}

// ✅ After: Extracted custom hook
function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback(
    (name, value) => {
      setValues((v) => ({ ...v, [name]: value }));
      const fieldErrors = validate({ ...values, [name]: value });
      setErrors(fieldErrors);
    },
    [values, validate],
  );

  const handleBlur = useCallback((name) => {
    setTouched((t) => ({ ...t, [name]: true }));
  }, []);

  return { values, errors, touched, handleChange, handleBlur };
}

function Form() {
  const form = useForm(initialValues, validateForm);
  // Clean component focused on rendering
}
```

**4. Global State → External Library:**

For complex global state, consider:

- **Zustand**: Simple, hook-based state management
- **Jotai**: Atomic state management
- **Redux Toolkit**: For large applications with complex requirements

```jsx
// Zustand example (lightweight)
import create from "zustand";

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  cart: [],
  addToCart: (item) =>
    set((state) => ({
      cart: [...state.cart, item],
    })),
}));

function Component() {
  const { user, cart, addToCart } = useStore();
  // Use global state directly
}
```

## Analysis Workflow

1. **Identify Problems**: What makes current state management difficult?
2. **Choose Strategy**: Which refactoring pattern applies?
3. **Plan Migration**: Step-by-step refactoring approach
4. **Implement Incrementally**: Small, testable changes
5. **Verify Behavior**: Ensure no regressions

## Output Format

Provide refactoring guidance:

1. **Current Issues**: Problems with existing state management
2. **Recommended Approach**: Which pattern to use and why
3. **Refactored Code**: Complete implementation
4. **Migration Steps**: How to transition safely
5. **Testing Strategy**: How to verify correctness

Focus on maintainability and clarity over clever solutions.

---
name: react-hook-migration
description: "Migrate React class components to functional components with hooks"
---

# React Hook Migration

Systematic migration of React class components to functional components with hooks. This workflow ensures safe, tested migration while preserving functionality and improving code maintainability.

**Applies to**: React class components (.jsx, .tsx files)

***

## Why Migrate to Hooks?

**Benefits:**

- **Simpler Code**: Less boilerplate, easier to read and test
- **Better Reusability**: Extract logic into custom hooks
- **Smaller Bundles**: No class overhead, better tree shaking
- **Modern Patterns**: Align with React team recommendations (since React 16.8)
- **Future-Proof**: New React features target hooks first
- **Better TypeScript**: Simpler type inference with hooks

**When to Migrate:**

- ✅ During feature work on existing components
- ✅ When adding new functionality that benefits from hooks
- ✅ During refactoring or cleanup sprints
- ✅ When component has grown complex with lifecycle methods
- ❌ Don't migrate blindly - focus on active codebases
- ❌ Don't rush - test thoroughly

***

## Migration Workflow

### Phase 1: Preparation (Before Code Changes)

#### 1. Assess the Component

**Complexity Check:**

```jsx
// Simple component (easy migration):
class UserGreeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

// Medium component (moderate):
class Counter extends Component {
  state = { count: 0 };

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return <button onClick={this.increment}>{this.state.count}</button>;
  }
}

// Complex component (challenging):
class DataTable extends Component {
  state = { data: [], loading: true, error: null };
  intervalId = null;

  componentDidMount() {
    this.fetchData();
    this.intervalId = setInterval(this.fetchData, 60000);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      this.fetchData();
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  // ... more methods
}
```

**Migration Priority:**

1. **High**: Simple, single-purpose components
2. **Medium**: Components with state and lifecycle methods
3. **Low**: Complex components with many instance properties
4. **Defer**: Components with HOCs, legacy patterns, or unstable tests

#### 2. Review Tests

**Pre-Migration Testing:**

```bash
# Run existing tests to establish baseline
npm test -- ComponentName.test

# If no tests exist, add basic smoke test first:
```

```jsx
import { render, screen } from "@testing-library/react";
import { UserProfile } from "./UserProfile";

test("renders without crashing", () => {
  render(<UserProfile userId="123" />);
});

test("displays user name", async () => {
  render(<UserProfile userId="123" />);
  expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();
});
```

**✅ All tests passing? Proceed to migration.**  
**❌ Tests failing? Fix tests first, then migrate.**

#### 3. Create Feature Branch

```bash
git checkout -b migrate/user-profile-to-hooks
```

***

### Phase 2: Migration Steps

#### Step 1: Convert Class to Function

**Before:**

```jsx
import React, { Component } from "react";

class UserProfile extends Component {
  render() {
    const { name, email } = this.props;
    return (
      <div>
        <h1>{name}</h1>
        <p>{email}</p>
      </div>
    );
  }
}

export default UserProfile;
```

**After:**

```jsx
import React from "react";

function UserProfile({ name, email }) {
  return (
    <div>
      <h1>{name}</h1>
      <p>{email}</p>
    </div>
  );
}

export default UserProfile;
```

**TypeScript Version:**

```tsx
import React from "react";

interface UserProfileProps {
  name: string;
  email: string;
}

function UserProfile({ name, email }: UserProfileProps) {
  return (
    <div>
      <h1>{name}</h1>
      <p>{email}</p>
    </div>
  );
}

export default UserProfile;
```

#### Step 2: Migrate State → useState

**Before:**

```jsx
class Counter extends Component {
  state = {
    count: 0,
    isActive: true,
  };

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <button onClick={this.increment} disabled={!this.state.isActive}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

**After:**

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const increment = () => {
    setCount(count + 1); // or setCount(c => c + 1) for safer updates
  };

  return (
    <button onClick={increment} disabled={!isActive}>
      Count: {count}
    </button>
  );
}
```

**Complex State (Consider useReducer):**

```jsx
// Before: Complex state updates
this.setState({
  data: newData,
  loading: false,
  error: null,
});

// After: useReducer for related state
const [state, dispatch] = useReducer(reducer, {
  data: [],
  loading: true,
  error: null,
});

dispatch({ type: "FETCH_SUCCESS", payload: newData });
```

#### Step 3: Migrate Lifecycle Methods → useEffect

**componentDidMount:**

```jsx
// Before
class UserList extends Component {
  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = async () => {
    const users = await api.getUsers();
    this.setState({ users });
  };
}

// After
function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const users = await api.getUsers();
      setUsers(users);
    }
    fetchUsers();
  }, []); // Empty array = run once on mount
}
```

**componentDidUpdate:**

```jsx
// Before
componentDidUpdate(prevProps) {
  if (prevProps.userId !== this.props.userId) {
    this.fetchUser(this.props.userId);
  }
}

// After
useEffect(() => {
  fetchUser(userId);
}, [userId]); // Run when userId changes
```

**componentWillUnmount:**

```jsx
// Before
componentDidMount() {
  this.intervalId = setInterval(this.tick, 1000);
}

componentWillUnmount() {
  clearInterval(this.intervalId);
}

// After
useEffect(() => {
  const intervalId = setInterval(tick, 1000);

  return () => {
    clearInterval(intervalId); // Cleanup function
  };
}, []);
```

**Combined Lifecycle Methods:**

```jsx
// Before: Multiple lifecycle methods
class DataSubscriber extends Component {
  componentDidMount() {
    this.subscribe(this.props.channelId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.channelId !== this.props.channelId) {
      this.unsubscribe(prevProps.channelId);
      this.subscribe(this.props.channelId);
    }
  }

  componentWillUnmount() {
    this.unsubscribe(this.props.channelId);
  }
}

// After: Single useEffect with cleanup
function DataSubscriber({ channelId }) {
  useEffect(() => {
    subscribe(channelId);

    return () => {
      unsubscribe(channelId);
    };
  }, [channelId]); // Re-run when channelId changes
}
```

#### Step 4: Migrate Instance Properties → useRef

**For DOM References:**

```jsx
// Before
class TextInput extends Component {
  inputRef = React.createRef();

  componentDidMount() {
    this.inputRef.current.focus();
  }

  render() {
    return <input ref={this.inputRef} />;
  }
}

// After
function TextInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} />;
}
```

**For Mutable Values:**

```jsx
// Before: Instance property holds mutable value
class Timer extends Component {
  intervalId = null;

  componentDidMount() {
    this.intervalId = setInterval(this.tick, 1000);
  }
}

// After: useRef for mutable value that persists across renders
function Timer() {
  const intervalIdRef = useRef(null);

  useEffect(() => {
    intervalIdRef.current = setInterval(tick, 1000);

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, []);
}
```

#### Step 5: Migrate Event Handlers → useCallback (When Needed)

**Before:**

```jsx
class TodoList extends Component {
  handleDelete = (id) => {
    // Delete logic
  };

  render() {
    return (
      <ul>
        {this.state.todos.map((todo) => (
          <TodoItem key={todo.id} onDelete={() => this.handleDelete(todo.id)} />
        ))}
      </ul>
    );
  }
}
```

**After (Basic):**

```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleDelete = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} onDelete={() => handleDelete(todo.id)} />
      ))}
    </ul>
  );
}
```

**After (Optimized with useCallback):**

```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleDelete = useCallback((id) => {
    setTodos((todos) => todos.filter((t) => t.id !== id)); // Use function form
  }, []); // No dependencies needed with function form

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} onDelete={() => handleDelete(todo.id)} />
      ))}
    </ul>
  );
}
```

#### Step 6: Migrate Context Consumers

**Before (Class Context):**

```jsx
class UserProfile extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    return <div style={{ color: theme.color }}>Profile</div>;
  }
}
```

**After (useContext):**

```jsx
function UserProfile() {
  const theme = useContext(ThemeContext);

  return <div style={{ color: theme.color }}>Profile</div>;
}
```

**Multiple Contexts:**

```jsx
// Before: Nested Context.Consumer
<ThemeContext.Consumer>
  {(theme) => (
    <UserContext.Consumer>
      {(user) => <div>Welcome, {user.name}!</div>}
    </UserContext.Consumer>
  )}
</ThemeContext.Consumer>;

// After: Clean useContext calls
function Welcome() {
  const theme = useContext(ThemeContext);
  const user = useContext(UserContext);

  return <div>Welcome, {user.name}!</div>;
}
```

***

### Phase 3: Advanced Patterns

#### Pattern 1: Extract Custom Hooks

**Before (Logic in Component):**

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const data = await api.getUser(userId);
        setUser(data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [userId]);

  // Component logic...
}
```

**After (Extracted Custom Hook):**

```jsx
// hooks/useUser.js
function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const data = await api.getUser(userId);
        setUser(data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [userId]);

  return { user, loading, error };
}

// UserProfile.jsx
function UserProfile({ userId }) {
  const { user, loading, error } = useUser(userId);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <div>{user.name}</div>;
}
```

#### Pattern 2: Complex State with useReducer

**When to Use:**

- Multiple related state variables
- Complex state transitions
- State depends on previous state
- Easier to test state logic

**Example:**

```jsx
// reducer.js
const initialState = {
  data: [],
  loading: true,
  error: null,
  filter: "all",
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, data: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    default:
      return state;
  }
}

// Component
function DataTable() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "FETCH_START" });
    api
      .getData()
      .then((data) => dispatch({ type: "FETCH_SUCCESS", payload: data }))
      .catch((err) => dispatch({ type: "FETCH_ERROR", payload: err }));
  }, []);

  return (
    <div>
      <FilterBar
        value={state.filter}
        onChange={(f) => dispatch({ type: "SET_FILTER", payload: f })}
      />
      {state.loading && <LoadingSpinner />}
      {state.error && <ErrorMessage error={state.error} />}
      {state.data.map(/* render data */)}
    </div>
  );
}
```

***

### Phase 4: Testing After Migration

#### 1. Run All Tests

```bash
npm test -- ComponentName.test
```

**Expected Result**: All tests pass with no changes to test code.

**If Tests Fail**:

- Check for timing issues (async operations)
- Verify mock setup (especially for lifecycle methods)
- Update snapshot tests if needed

#### 2. Manual Testing

**Test Checklist:**

- [ ] Component renders correctly
- [ ] State updates work as expected
- [ ] Event handlers trigger properly
- [ ] Side effects run (API calls, timers)
- [ ] Cleanup happens (no memory leaks)
- [ ] Props changes trigger correct re-renders
- [ ] Error boundaries catch errors

#### 3. Performance Check

```jsx
// Add performance measurement
import { Profiler } from "react";

function onRenderCallback(id, phase, actualDuration) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

<Profiler id="UserProfile" onRender={onRenderCallback}>
  <UserProfile userId={userId} />
</Profiler>;
```

**Compare Before/After:**

- Render times similar or better
- No unnecessary re-renders
- Memory usage stable

***

## Migration Checklist

### Pre-Migration

- [ ] Component has tests (or add basic smoke test)
- [ ] All tests passing before migration
- [ ] Feature branch created
- [ ] Component complexity assessed

### During Migration

- [ ] Class → function conversion
- [ ] state → useState (or useReducer)
- [ ] componentDidMount → useEffect
- [ ] componentDidUpdate → useEffect with dependencies
- [ ] componentWillUnmount → useEffect cleanup
- [ ] Instance properties → useRef
- [ ] Context consumption → useContext
- [ ] Event handlers stable (useCallback if needed)

### Post-Migration

- [ ] All tests still passing
- [ ] Manual testing complete
- [ ] Performance validated (no regressions)
- [ ] Code review completed
- [ ] Documentation updated

***

## Common Pitfalls

### 1. useEffect Dependency Arrays

**❌ Missing Dependencies:**

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults(query); // query used but not in deps
  }, []); // ❌ Missing dependency
}
```

**✅ Include All Dependencies:**

```jsx
useEffect(() => {
  fetchResults(query);
}, [query]); // ✅ query included
```

### 2. Stale Closures

**❌ Stale State:**

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // ❌ Always uses initial count
    }, 1000);
    return () => clearInterval(id);
  }, []); // ❌ count not in deps
}
```

**✅ Use Function Form:**

```jsx
useEffect(() => {
  const id = setInterval(() => {
    setCount((c) => c + 1); // ✅ Use latest value
  }, 1000);
  return () => clearInterval(id);
}, []); // ✅ No stale closure
```

### 3. Unnecessary useCallback/useMemo

**❌ Over-Optimization:**

```jsx
function UserProfile({ name }) {
  const greeting = useMemo(() => `Hello, ${name}`, [name]); // ❌ Unnecessary
  const handleClick = useCallback(() => console.log(name), [name]); // ❌ Unnecessary
}
```

**✅ Only When Needed:**

```jsx
// Only use when passing to memoized child components
// or expensive computations
```

### 4. useRef vs useState Confusion

**❌ Using useState for Mutable Values:**

```jsx
function Timer() {
  const [intervalId, setIntervalId] = useState(null); // ❌ Triggers re-render
}
```

**✅ Use useRef:**

```jsx
function Timer() {
  const intervalIdRef = useRef(null); // ✅ No re-render
}
```

***

## TypeScript Migration Tips

**Generic Props:**

```tsx
// Before
interface Props<T> {
  data: T;
}

class DataDisplay<T> extends Component<Props<T>> {
  // ...
}

// After
interface Props<T> {
  data: T;
}

function DataDisplay<T>({ data }: Props<T>) {
  // ...
}
```

**Ref Typing:**

```tsx
const inputRef = useRef<HTMLInputElement>(null);
```

**useReducer Typing:**

```tsx
type State = { count: number };
type Action = { type: "INCREMENT" } | { type: "DECREMENT" };

const [state, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, {
  count: 0,
});
```

***

## Resources

**Official React Docs:**

- [Hooks at a Glance](https://react.dev/reference/react)
- [Hooks FAQ](https://react.dev/learn)
- [Rules of Hooks](https://react.dev/warnings/invalid-hook-call-warning)

**Migration Tools:**

- [react-codemod](https://github.com/reactjs/react-codemod) - Automated refactoring scripts
- ESLint plugin: `eslint-plugin-react-hooks` - Catch hooks violations

**Testing:**

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Testing hooks
- [React Hooks Testing Library](https://react-hooks-testing-library.com/) - Testing custom hooks

***

## Summary

**Migration Strategy:**

1. ✅ **Start simple** - Migrate stateless components first
2. ✅ **Test thoroughly** - Baseline tests before, verify after
3. ✅ **Extract logic** - Create custom hooks for reusable patterns
4. ✅ **Iterate** - One component at a time, not wholesale rewrites
5. ✅ **Document** - Note any behavioral changes or gotchas

**Success Criteria:**

- All tests passing
- No console warnings
- Performance maintained or improved
- Code is more readable and maintainable

**Remember**: Migration is not mandatory. Focus on components you actively maintain. Don't migrate for migration's sake.

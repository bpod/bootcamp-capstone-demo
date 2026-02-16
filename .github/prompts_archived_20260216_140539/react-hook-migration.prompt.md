---
name: React Hook Migration
description: Migrate class components to functional components with hooks
agent: frontend-developer
tools: ["react-dev", "readonly"]
---

# React Hook Migration

Convert React class components to modern functional components using hooks.

## Migration Strategy

1. **Analyze Class Component**: Identify state, lifecycle, and methods
2. **Map to Hooks**: Determine which hooks are needed
3. **Convert Incrementally**: Start with small components
4. **Preserve Behavior**: Ensure identical functionality
5. **Test Thoroughly**: Verify no regressions

## Common Hook Mappings

**State:**

```jsx
// Class
this.state = { count: 0 };
this.setState({ count: 1 });

// Hooks
const [count, setCount] = useState(0);
setCount(1);
```

**Component Lifecycle:**

```jsx
// Class
componentDidMount() { /* ... */ }
componentWillUnmount() { /* ... */ }

// Hooks
useEffect(() => {
  // componentDidMount logic
  return () => {
    // componentWillUnmount logic
  };
}, []);
```

**Instance Methods:**

```jsx
// Class
handleClick = () => {
  /* ... */
};

// Hooks
const handleClick = useCallback(() => {
  /* ... */
}, [dependencies]);
```

**Refs:**

```jsx
// Class
this.myRef = React.createRef();

// Hooks
const myRef = useRef(null);
```

## Complete Migration Example

**Before (Class Component):**

```jsx
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchUser();
  }

  componentWillUnmount() {
    this.controller.abort();
  }

  fetchUser = async () => {
    this.controller = new AbortController();
    try {
      const response = await fetch(`/api/users/${this.props.userId}`, {
        signal: this.controller.signal,
      });
      const user = await response.json();
      this.setState({ user, loading: false });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error(error);
      }
    }
  };

  render() {
    const { user, loading } = this.state;
    if (loading) return <div>Loading...</div>;
    return <div>{user.name}</div>;
  }
}
```

**After (Functional Component with Hooks):**

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          signal: controller.signal,
        });
        const user = await response.json();
        setUser(user);
        setLoading(false);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      }
    };

    fetchUser();

    return () => controller.abort();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}
```

## Migration Checklist

- [ ] All state converted to `useState`
- [ ] Lifecycle methods converted to `useEffect`
- [ ] Instance methods converted to functions/`useCallback`
- [ ] Refs converted to `useRef`
- [ ] Context consumers converted to `useContext`
- [ ] `this.props` replaced with function parameters
- [ ] Class binding removed
- [ ] Tests updated and passing
- [ ] No behavior changes (verify with testing)

## Output Format

Provide migration guidance with:

1. **Analysis**: Current class component structure
2. **Hook Requirements**: Which hooks are needed
3. **Converted Code**: Complete functional component
4. **Explanation**: Key differences and rationale
5. **Testing**: How to verify the migration

The converted component should be production-ready.

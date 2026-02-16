---
name: React Render Optimization
description: Identify and fix unnecessary React re-renders
agent: frontend-developer
tools: ["react-dev", "readonly"]
---

# React Render Optimization

Identify unnecessary re-renders in React components and provide specific optimizations to improve performance.

## When to Use This Prompt

- Component re-renders too frequently
- UI feels sluggish or unresponsive
- Profiling shows performance bottlenecks
- Need to optimize expensive renders

## Analysis Workflow

1. **Profile First**: Use React DevTools Profiler to identify problem areas
2. **Analyze Causes**: Determine why unnecessary re-renders happen
3. **Prioritize**: Focus on components that re-render most frequently
4. **Optimize**: Apply appropriate memoization techniques
5. **Measure**: Verify improvements with React Profiler

## Common Re-Render Causes

**1. Inline Object/Array Creation:**

```jsx
// ❌ Bad - creates new object on every render
<Component style={{ margin: 10 }} />;

// ✅ Good - stable reference
const buttonStyle = { margin: 10 };
<Component style={buttonStyle} />;
```

**2. Inline Function Definitions:**

```jsx
// ❌ Bad - new function every render
<Button onClick={() => handleClick(id)} />;

// ✅ Good - stable function with useCallback
const handleButtonClick = useCallback(() => {
  handleClick(id);
}, [id]);
<Button onClick={handleButtonClick} />;
```

**3. Parent Re-Renders Cascade:**

```jsx
// ❌ Bad - child re-renders when parent updates
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>{count}</button>
      <ExpensiveChild data={data} />
    </>
  );
}

// ✅ Good - memoize expensive child
const MemoizedChild = React.memo(ExpensiveChild);
```

**4. Context Value Changes:**

```jsx
// ❌ Bad - new object every render causes all consumers to re-render
<MyContext.Provider value={{ user, theme }}>{children}</MyContext.Provider>;

// ✅ Good - memoize context value
const contextValue = useMemo(() => ({ user, theme }), [user, theme]);
<MyContext.Provider value={contextValue}>{children}</MyContext.Provider>;
```

## Optimization Techniques

**React.memo() - For Pure Components:**

```jsx
// Only re-renders if props actually change
export default React.memo(ExpensiveComponent);

// Custom comparison for complex props
export default React.memo(ExpensiveComponent, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id;
});
```

**useMemo() - For Expensive Computations:**

```jsx
function DataTable({ data }) {
  // Only recalculates when data changes
  const sortedData = useMemo(() => {
    return data.sort((a, b) => b.score - a.score);
  }, [data]);

  return <Table data={sortedData} />;
}
```

**useCallback() - For Function Stability:**

```jsx
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  // Stable function reference for child components
  const handleSearch = useCallback(() => {
    onSearch(query);
  }, [query, onSearch]);

  return <SearchButton onClick={handleSearch} />;
}
```

**State Colocation - Move State Down:**

```jsx
// ❌ Bad - whole form re-renders on every keystroke
function Form() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  return (
    <>
      <NameInput value={name} onChange={setName} />
      <EmailInput value={email} onChange={setEmail} />
      <ExpensiveComponent />
    </>
  );
}

// ✅ Good - isolate state to specific inputs
function NameInput() {
  const [value, setValue] = useState("");
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
```

## When NOT to Optimize

**Don't prematurely optimize:**

- Small, fast components (< 100 elements)
- Components that rarely re-render
- Optimizations that add significant code complexity

**Profile before optimizing:**

- Use React DevTools Profiler
- Measure actual render times
- Focus on components with > 10ms render time or high frequency

## Output Format

Provide analysis with:

1. **Identified Issues**: Specific re-render causes in the code
2. **Profiling Recommendation**: How to measure the problem
3. **Optimization Strategy**: Which technique to apply and why
4. **Code Examples**: Before/after showing the fix
5. **Expected Impact**: Estimated reduction in re-renders
6. **Verification Steps**: How to confirm improvement

Always recommend profiling before and after to validate improvements.

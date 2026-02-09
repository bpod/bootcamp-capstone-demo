---
description: "Find and fix unnecessary React re-renders to improve performance"
agent: "agent"
tools: ["codebase", "search", "problems"]
---

# React Re-Render Optimization

Diagnose and fix unnecessary re-renders in React applications. This workflow helps identify performance bottlenecks caused by excessive component updates and provides targeted fixes.

## Why Re-Renders Matter

**Performance Impact:**

- Unnecessary re-renders waste CPU cycles
- Can cause UI jank and poor user experience
- Compound as component trees grow
- Critical for complex dashboards, lists, forms

**Common Causes:**

- Inline object/array creation in props
- Missing memoization for computed values
- Unstable callback references
- Parent re-renders triggering child re-renders
- Context value changes affecting all consumers

---

## 1. Identify Re-Render Issues

### Use React DevTools Profiler

```bash
# Install React DevTools (Chrome/Firefox extension)
# Or use standalone: npm install -g react-devtools
```

**Profiling Workflow:**

1. Open React DevTools → Profiler tab
2. Click record (⚫)
3. Interact with your app (click buttons, type in forms, etc.)
4. Stop recording
5. Review "Flame Graph" and "Ranked" views

**What to Look For:**

- Components rendering multiple times in single interaction
- Large yellow/red bars (slow renders)
- Components rendering when props haven't changed
- Deep component trees re-rendering together

### Check for Console Warnings

```jsx
// Enable strict mode to catch potential issues
import { StrictMode } from "react";

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root"),
);
```

### Use Why-Did-You-Render Library

```bash
npm install --save-dev @welldone-software/why-did-you-render
```

```javascript
// wdyr.js
import React from "react";

if (process.env.NODE_ENV === "development") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    logOnDifferentValues: true,
  });
}
```

```javascript
// index.js
import "./wdyr"; // Import before React components
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
```

---

## 2. Common Anti-Patterns & Fixes

### ❌ Anti-Pattern #1: Inline Object/Array Creation

**Problem:**

```jsx
// ❌ BAD: New object created every render
function Dashboard() {
  return (
    <UserProfile
      user={{ name: "John", role: "admin" }} // New object each time!
      permissions={["read", "write"]} // New array each time!
    />
  );
}
```

**Why It's Bad:** Even if `UserProfile` is memoized, it re-renders because props references change.

**Solution:**

```jsx
// ✅ GOOD: Stable references
const defaultUser = { name: "John", role: "admin" };
const defaultPermissions = ["read", "write"];

function Dashboard() {
  return <UserProfile user={defaultUser} permissions={defaultPermissions} />;
}

// ✅ BETTER: If values are dynamic, use useMemo
function Dashboard({ userName, userRole }) {
  const user = useMemo(
    () => ({ name: userName, role: userRole }),
    [userName, userRole],
  );

  return <UserProfile user={user} />;
}
```

---

### ❌ Anti-Pattern #2: Inline Function Definitions

**Problem:**

```jsx
// ❌ BAD: New function created every render
function ProductList({ products }) {
  return (
    <div>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={() => handleSelect(product.id)} // New function each render!
        />
      ))}
    </div>
  );
}
```

**Solution:**

```jsx
// ✅ GOOD: Stable callback with useCallback
const ProductCard = React.memo(function ProductCard({ product, onSelect }) {
  return <div onClick={onSelect}>{product.name}</div>;
});

function ProductList({ products }) {
  const handleSelect = useCallback((productId) => {
    console.log("Selected:", productId);
  }, []);

  return (
    <div>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={() => handleSelect(product.id)}
        />
      ))}
    </div>
  );
}

// ✅ BETTER: Pass ID directly
function ProductList({ products }) {
  const handleSelect = useCallback((productId) => {
    console.log("Selected:", productId);
  }, []);

  return (
    <div>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          productId={product.id}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}

const ProductCard = React.memo(function ProductCard({
  product,
  productId,
  onSelect,
}) {
  return <div onClick={() => onSelect(productId)}>{product.name}</div>;
});
```

---

### ❌ Anti-Pattern #3: Context Updates Triggering Unnecessary Renders

**Problem:**

```jsx
// ❌ BAD: Any context change re-renders all consumers
const UserContext = createContext();

function App() {
  const [user, setUser] = useState({ name: "John", theme: "dark" });

  // Changing theme re-renders ALL components consuming UserContext
  return (
    <UserContext.Provider value={user}>
      <Header />
      <Dashboard />
      <Footer />
    </UserContext.Provider>
  );
}
```

**Solution 1: Split Contexts**

```jsx
// ✅ GOOD: Separate contexts for independent data
const UserInfoContext = createContext();
const ThemeContext = createContext();

function App() {
  const [user, setUser] = useState({ name: "John", email: "john@example.com" });
  const [theme, setTheme] = useState("dark");

  return (
    <UserInfoContext.Provider value={user}>
      <ThemeContext.Provider value={theme}>
        <Header />
        <Dashboard />
        <Footer />
      </ThemeContext.Provider>
    </UserInfoContext.Provider>
  );
}

// Only Header re-renders when theme changes
function Header() {
  const theme = useContext(ThemeContext); // Only subscribes to theme
  return <header className={theme}>...</header>;
}
```

**Solution 2: Use Selectors (with Zustand/Jotai)**

```jsx
// ✅ BETTER: State management with selectors
import { create } from "zustand";

const useStore = create((set) => ({
  user: { name: "John", email: "john@example.com" },
  theme: "dark",
  setTheme: (theme) => set({ theme }),
}));

// Component only re-renders when theme changes
function Header() {
  const theme = useStore((state) => state.theme); // Selector
  return <header className={theme}>...</header>;
}
```

---

### ❌ Anti-Pattern #4: Not Using React.memo for Expensive Components

**Problem:**

```jsx
// ❌ BAD: Complex list re-renders when parent updates
function DataTable({ rows, columns, onSort }) {
  return (
    <table>
      {rows.map((row) => (
        <TableRow key={row.id} row={row} columns={columns} />
      ))}
    </table>
  );
}

function Dashboard() {
  const [counter, setCounter] = useState(0);

  return (
    <div>
      <button onClick={() => setCounter((c) => c + 1)}>Count: {counter}</button>
      <DataTable rows={largeDataset} columns={columns} onSort={handleSort} />
    </div>
  );
}
```

**Solution:**

```jsx
// ✅ GOOD: Memo prevents unnecessary re-renders
const DataTable = React.memo(function DataTable({ rows, columns, onSort }) {
  return (
    <table>
      {rows.map(row => (
        <TableRow key={row.id} row={row} columns={columns} />
      ))}
    </table>
  );
});

const TableRow = React.memo(function TableRow({ row, columns }) {
  // Only re-renders if row or columns change
  return <tr>{/* render row */}</tr>;
});

function Dashboard() {
  const [counter, setCounter] = useState(0);

  // Ensure stable references
  const columns = useMemo(() => [...], []);
  const handleSort = useCallback(() => { /* ... */ }, []);

  return (
    <div>
      <button onClick={() => setCounter(c => c + 1)}>Count: {counter}</button>
      <DataTable rows={largeDataset} columns={columns} onSort={handleSort} />
    </div>
  );
}
```

---

## 3. Optimization Strategies

### Strategy 1: Component Splitting

**Move frequently updating state down:**

```jsx
// ❌ BAD: Form state at top level causes everything to re-render
function Dashboard() {
  const [formData, setFormData] = useState({ name: "", email: "" });

  return (
    <div>
      <ExpensiveChart />
      <ExpensiveTable />
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
    </div>
  );
}

// ✅ GOOD: Extract form into separate component
function Dashboard() {
  return (
    <div>
      <ExpensiveChart />
      <ExpensiveTable />
      <UserForm />
    </div>
  );
}

function UserForm() {
  const [formData, setFormData] = useState({ name: "", email: "" });

  return (
    <input
      value={formData.name}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    />
  );
}
```

### Strategy 2: Use Key Prop to Reset State

```jsx
// Force re-mount instead of re-render
function UserProfile({ userId }) {
  return <ProfileDetails key={userId} userId={userId} />;
}

// ProfileDetails gets fresh state when userId changes
function ProfileDetails({ userId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchUserData(userId).then(setData);
  }, [userId]);

  return <div>{/* render */}</div>;
}
```

### Strategy 3: Virtualize Long Lists

```bash
npm install react-window
# or
npm install react-virtualized
```

```jsx
import { FixedSizeList } from "react-window";

// ✅ Only render visible items
function LargeList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

---

## 4. Debugging Workflow

### Step-by-Step Process

1. **Profile Application**:

   ```
   - Open React DevTools Profiler
   - Record user interaction
   - Identify components rendering frequently
   ```

2. **Analyze Render Reasons**:

   ```
   - Check props (are they stable?)
   - Check context (is it changing unnecessarily?)
   - Check parent (is parent re-rendering?)
   ```

3. **Apply Fixes in Order**:

   ```
   a. Fix inline object/array creation (easiest, high impact)
   b. Add React.memo to expensive components
   c. Use useCallback for passed functions
   d. Use useMemo for computed values
   e. Split contexts or use state management
   f. Consider component splitting
   g. Virtualize long lists if needed
   ```

4. **Measure Impact**:
   ```
   - Re-profile after each fix
   - Verify render count decreased
   - Check Lighthouse performance score
   ```

### Diagnostic Script

Add this to a component to log render reasons:

```jsx
import { useEffect, useRef } from "react";

export function useWhyDidYouUpdate(name, props) {
  const previousProps = useRef();

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps = {};

      allKeys.forEach((key) => {
        if (previousProps.current[key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log("[why-did-you-update]", name, changedProps);
      }
    }

    previousProps.current = props;
  });
}

// Usage
function MyComponent(props) {
  useWhyDidYouUpdate("MyComponent", props);
  return <div>...</div>;
}
```

---

## 5. Performance Checklist

Before optimizing, verify the problem exists:

- [ ] **Profile First**: Use React DevTools to confirm unnecessary re-renders
- [ ] **Measure Baseline**: Record current render counts and performance metrics
- [ ] **Prioritize**: Fix highest-impact issues first (frequent renders of expensive components)
- [ ] **One Change at a Time**: Apply fixes incrementally to measure impact
- [ ] **Re-profile**: Verify improvements with React DevTools after each fix

**Red Flags** (optimize these):

- [ ] Component rendering >10 times per interaction
- [ ] Large lists without virtualization
- [ ] Context updates affecting many components
- [ ] Inline objects/arrays in frequently re-rendering components
- [ ] Missing React.memo on expensive pure components

**Don't Optimize** (premature optimization):

- [ ] Components rendering once or twice per interaction
- [ ] Simple components (render cost < memo overhead)
- [ ] No user-visible performance issues

---

## Success Criteria

✅ **Reduced Re-Renders**: Unnecessary renders eliminated (check React DevTools Profiler)  
✅ **Stable Props**: No inline object/array creation in frequently rendering components  
✅ **Memoization Applied**: React.memo, useMemo, useCallback used judiciously  
✅ **Context Optimized**: Split contexts or using selectors for granular updates  
✅ **Performance Improved**: Lighthouse performance score increased, UI feels snappier  
✅ **Measured Impact**: Before/after profiling shows concrete improvements

---

## Common Mistakes to Avoid

❌ **Over-memoizing**: Adding memo/useMemo to every component (overhead > benefit)  
❌ **Missing Dependencies**: Incomplete dependency arrays in useMemo/useCallback  
❌ **Optimizing Without Profiling**: Guessing instead of measuring  
❌ **Ignoring Root Cause**: Fixing symptoms instead of architectural issues  
❌ **Complex Memo Comparisons**: Custom comparison functions that are slow

---

## Related Resources

- [react-component-review.prompt.md](react-component-review.prompt.md) - Comprehensive component review
- [performance-optimization.prompt.md](performance-optimization.prompt.md) - Overall performance improvement
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools) - Official profiling guide
- [Why Did You Render](https://github.com/welldone-software/why-did-you-render) - Debug tool
- [React.memo Documentation](https://react.dev/reference/react/memo) - Official React docs

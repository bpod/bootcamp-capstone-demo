---
name: debug-session
description: Structured debugging workflow using Chrome DevTools, logging strategies, and systematic problem isolation
---

# Debug Session - Systematic Problem Solving

Structured debugging workflow for identifying and resolving frontend issues using Chrome DevTools, logging strategies, breakpoints, and performance profiling.

## Debugging Philosophy

**Systematic Investigation:**

1. **Reproduce** - Confirm the issue consistently occurs
2. **Isolate** - Narrow down to specific component/function
3. **Hypothesize** - Form theory about root cause
4. **Test** - Validate hypothesis with evidence
5. **Fix** - Implement targeted solution
6. **Verify** - Confirm issue resolved without side effects

**Avoid Random Changes:** Don't guess. Use data to guide decisions.

***

## Step 1: Issue Identification

### Gather Context

**Ask User (if not provided):**

- What's the expected behavior?
- What's the actual behavior?
- When did this start happening?
- Can you reproduce it consistently?
- Which browser(s) are affected?
- Any error messages or console warnings?

**Check Existing Diagnostics:**

```bash
# Review recent error logs
cat logs/app.log | grep -i error | tail -20

# Check for linting/compilation errors
npm run lint
npm run type-check  # If TypeScript
```

**Browser Console Check:**

- Open DevTools Console (Cmd+Option+J / Ctrl+Shift+J)
- Look for uncaught errors, warnings, network failures
- Note any CORS, CSP, or security errors

***

## Step 2: Reproduction Setup

### Create Minimal Reproduction

**Goal:** Isolate issue to smallest possible code sample.

**Strategy A: Comment Out Code**

```javascript
function BrokenComponent() {
  // Comment sections incrementally to find problem area
  // return <Section1 />;  // ✓ Works
  // return <Section2 />;  // ✓ Works
  // return <Section3 />;  // ✗ Breaks - issue in Section3!
}
```

**Strategy B: Binary Search**

1. Disable 50% of functionality
2. If issue persists → Problem in active 50%
3. If issue gone → Problem in disabled 50%
4. Repeat until isolated

**Strategy C: Fresh Component**

```javascript
// Create simplified version
function TestComponent() {
  return <div>Minimal reproduction</div>;
}

// Gradually add back complexity until issue reappears
```

### Environment Check

```bash
# Verify dependencies
npm ls | grep -i [problematic-package]

# Check Node/npm versions
node -v
npm -v

# Try clean install
rm -rf node_modules package-lock.json
npm install
```

***

## Step 3: Chrome DevTools Debugging

### Console Debugging

**Strategic Logging:**

```javascript
// ❌ BAD: Vague logging
console.log("here");
console.log("data:", data);

// ✅ GOOD: Descriptive logging with context
console.log("[UserProfile] Rendering with props:", { userId, userName });
console.log("[API] Request started:", {
  endpoint,
  method,
  timestamp: Date.now(),
});
console.log("[State] Update triggered:", {
  before: prevState,
  after: nextState,
});

// Group related logs
console.group("🔍 User Authentication Flow");
console.log("1. Validating credentials...");
console.log("2. Token received:", token);
console.log("3. Redirecting to dashboard");
console.groupEnd();
```

**Conditional Breakpoints in Console:**

```javascript
// Log only when condition met
if (user.id === 123) {
  console.log("Debug user 123:", user);
}

// Performance timing
console.time("expensive-operation");
expensiveOperation();
console.timeEnd("expensive-operation");

// Stack trace on demand
console.trace("How did we get here?");
```

### Breakpoints

**Sources Panel Strategy:**

**1. Line Breakpoints**

- Click line number in Sources panel
- Execution pauses at that line
- Inspect variables, call stack, scope

**2. Conditional Breakpoints**

- Right-click line number → "Add conditional breakpoint"
- Example: `userId === 123` (only pauses for user 123)
- Useful for loops: `i > 500` (pause after 500 iterations)

**3. DOM Breakpoints**

- Right-click element in Elements panel
- "Break on" → subtree modifications / attribute modifications / node removal
- Finds code changing DOM unexpectedly

**4. Event Listener Breakpoints**

- Sources → Event Listener Breakpoints (right sidebar)
- Enable "click", "keydown", "scroll", etc.
- Pauses when event fires

**5. XHR/Fetch Breakpoints**

- Sources → XHR/fetch Breakpoints
- Add URL pattern (e.g., `/api/users`)
- Pauses before network request

**Breakpoint Workflow:**

```javascript
function problematicFunction(data) {
  debugger; // Programmatic breakpoint

  const result = processData(data); // Set breakpoint here
  // When paused:
  // - Hover over variables to inspect
  // - Use Watch panel to track expressions
  // - Check Call Stack to see execution path
  // - Step Over (F10), Step Into (F11), Step Out (Shift+F11)

  return result;
}
```

**Step Controls:**

- **Step Over (F10)**: Execute current line, don't enter functions
- **Step Into (F11)**: Enter function calls
- **Step Out (Shift+F11)**: Exit current function
- **Continue (F8)**: Resume until next breakpoint

### Call Stack Analysis

**Reading the Stack:**

```
1. onClick (Button.jsx:45)     ← Where error occurred
2. handleSubmit (Form.jsx:89)  ← Called by
3. submitForm (api.js:123)     ← Called by
4. fetchData (api.js:67)       ← Root cause here!
```

**Strategy:**

- Start at top (error location)
- Work down stack to find where bad data originated
- Often root cause is 3-4 levels deep

### Network Tab Debugging

**Identify Network Issues:**

```
Filter requests by type:
- XHR/Fetch: API calls
- JS: Script loading
- CSS: Stylesheet loading
- Img: Image resources

Check for:
✗ Failed requests (red, 4xx/5xx status)
✗ Slow requests (large "Time" column)
✗ Blocked requests (CORS errors)
✗ Large payloads (> 1MB warnings)
```

**Request Inspection:**

1. Click request in Network tab
2. **Headers**: Verify request/response headers
3. **Preview**: See formatted response
4. **Response**: Raw response data
5. **Timing**: Breakdown of request phases

**Common Issues:**

```javascript
// CORS error
Access to fetch at 'https://api.example.com' from origin 'http://localhost:3000'
has been blocked by CORS policy

// Solution: Configure server CORS headers
// Or use proxy in development
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'https://api.example.com'
    }
  }
}
```

### React DevTools

**Component Tree Inspection:**

1. Install React DevTools extension
2. Open Components tab
3. Select component to inspect
4. View props, state, hooks, context

**Finding Re-render Issues:**

```javascript
// Enable "Highlight updates when components render"
// Settings → Profiler → Highlight updates

// Unexpected re-renders will flash on screen
// Investigate why component updated

// Use React Profiler to find performance bottlenecks
function ExpensiveComponent() {
  // Profiler shows render duration
  // If slow, consider:
  // - React.memo() to prevent re-renders
  // - useMemo() for expensive calculations
  // - useCallback() for stable function references
}
```

***

## Step 4: Common Debugging Scenarios

### Scenario A: State Not Updating

**Symptom:** State change doesn't reflect in UI

**Debug Steps:**

```javascript
function MyComponent() {
  const [count, setCount] = useState(0);

  function increment() {
    // ❌ ISSUE: State updates are asynchronous
    setCount(count + 1);
    console.log(count); // Still shows old value!
  }

  // ✅ DEBUG: Use useEffect to see actual state
  useEffect(() => {
    console.log("Count updated:", count);
  }, [count]);

  // ✅ SOLUTION: Use functional update
  function incrementCorrectly() {
    setCount((prev) => prev + 1);
  }
}
```

**Common Causes:**

- State mutation instead of replacement
- Missing dependency in useEffect
- Closure capturing stale value

### Scenario B: Infinite Loop

**Symptom:** Browser freezes, "Maximum update depth exceeded" error

**Debug Steps:**

```javascript
// ❌ ISSUE: useEffect missing dependencies
useEffect(() => {
  fetchData(); // Causes state update
}); // No dependency array = runs every render!

// ✅ FIX: Add dependency array
useEffect(() => {
  fetchData();
}, []); // Run once on mount

// ❌ ISSUE: State update triggers itself
useEffect(() => {
  setCount(count + 1); // Creates infinite loop
}, [count]); // Depends on count, which it updates!

// ✅ FIX: Remove circular dependency
useEffect(() => {
  // Only update when external condition changes
  if (externalCondition) {
    setCount((prev) => prev + 1);
  }
}, [externalCondition]);
```

**Detection:**

- React DevTools shows component re-render count
- Console logs repeat rapidly
- Browser DevTools Performance tab shows constant activity

### Scenario C: Async/Promise Issues

**Symptom:** Data not loading, "undefined" errors

**Debug Steps:**

```javascript
// ❌ ISSUE: Not handling loading state
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  return <div>{user.name}</div>; // Error! user is null initially
}

// ✅ FIX: Handle loading/error states
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchUser(userId)
      .then((data) => {
        setUser(data);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        console.error("[UserProfile] Fetch failed:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <div>No user data</div>;

  return <div>{user.name}</div>;
}
```

**Debugging Promises:**

```javascript
// Add extensive logging
async function fetchUser(userId) {
  console.log("[fetchUser] Starting:", userId);

  try {
    const response = await fetch(`/api/users/${userId}`);
    console.log("[fetchUser] Response:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("[fetchUser] Data:", data);
    return data;
  } catch (error) {
    console.error("[fetchUser] Error:", error);
    throw error;
  }
}
```

### Scenario D: Event Handler Not Firing

**Symptom:** Click/input doesn't trigger expected action

**Debug Steps:**

```javascript
// ❌ ISSUE: Event handler called immediately
<button onClick={handleClick()}>Click</button>
// handleClick() executes on render, not on click!

// ✅ FIX: Pass function reference
<button onClick={handleClick}>Click</button>

// ❌ ISSUE: Event delegation problem
document.querySelector('.button').addEventListener('click', handler);
// If .button is dynamically added later, listener won't attach

// ✅ FIX: Event delegation on parent
document.querySelector('.container').addEventListener('click', (e) => {
  if (e.target.matches('.button')) {
    handler(e);
  }
});

// Test event is firing
function handleClick(event) {
  console.log("Click event:", event);
  debugger; // Breakpoint to verify execution
}
```

**Verify Event Listeners:**

- Elements tab → Select element → Event Listeners panel
- Shows all listeners attached to element
- Click to jump to handler code

### Scenario E: CSS/Styling Issues

**Symptom:** Styles not applying as expected

**Debug Steps:**

```css
/* Check specificity in Elements → Styles panel */
/* Strikethrough = overridden by more specific rule */

/* ❌ LOW SPECIFICITY */
.button {
  color: blue; /* Overridden ↓ */
}

/* ✅ HIGHER SPECIFICITY */
.container .button {
  color: red; /* This wins */
}

/* Debug with !important (temporarily!) */
.button {
  color: blue !important; /* Forces application */
}
/* Remove !important once real issue found */
```

**Computed Panel:**

- Shows final computed values
- Reveals which rules actually applied
- Helps understand cascade/inheritance

**Layout Debugging:**

- Enable "Show gridlines" in Elements panel
- Use box model visualization (margin/border/padding)
- Check Flexbox/Grid overlays

***

## Step 5: Performance Debugging

### Performance Tab Profiling

**Record Performance:**

1. Open Performance tab
2. Click Record (●)
3. Interact with app (reproduce slow scenario)
4. Stop recording
5. Analyze flame graph

**Reading Flame Graph:**

```
Top of stack = highest level functions
Bottom = deeply nested calls
Wider bars = more time spent
Red/orange = long tasks (> 50ms)

Look for:
- Long yellow bars (JavaScript execution)
- Purple bars (layout/reflow)
- Green bars (painting)
```

**Common Performance Issues:**

```javascript
// ❌ ISSUE: Expensive operation in render
function ProductList({ products }) {
  const sortedProducts = products.sort((a, b) => b.price - a.price);
  // Sorts on every render!

  return sortedProducts.map((p) => <ProductCard key={p.id} {...p} />);
}

// ✅ FIX: Memoize expensive calculation
function ProductList({ products }) {
  const sortedProducts = useMemo(() => {
    return products.sort((a, b) => b.price - a.price);
  }, [products]); // Only re-sort when products change

  return sortedProducts.map((p) => <ProductCard key={p.id} {...p} />);
}
```

### Memory Leaks

**Detect Memory Leaks:**

```javascript
// Common leak: Forgot to cleanup
useEffect(() => {
  const interval = setInterval(() => {
    console.log("Running...");
  }, 1000);

  // ❌ LEAK: No cleanup
}); // Interval continues after unmount!

// ✅ FIX: Cleanup in return
useEffect(() => {
  const interval = setInterval(() => {
    console.log("Running...");
  }, 1000);

  return () => {
    clearInterval(interval); // Cleanup on unmount
  };
}, []);
```

**Memory Tab:**

1. Take heap snapshot (capture memory state)
2. Interact with app
3. Take another snapshot
4. Compare snapshots
5. Look for objects not being garbage collected

**Common Leak Sources:**

- Event listeners not removed
- Timers not cleared
- Closures holding large objects
- Global variables never released

***

## Step 6: Debugging Tools & Techniques

### Source Maps

**Enable Source Maps:**

```javascript
// vite.config.js
export default {
  build: {
    sourcemap: true, // Generate source maps
  },
};

// webpack.config.js
module.exports = {
  devtool: "source-map", // Enable in production for debugging
};
```

**Benefits:**

- Debug minified code with original variable names
- Set breakpoints in original source files
- Readable stack traces in production

### Proxy/Mock API for Testing

**Isolate Frontend Issues:**

```javascript
// Mock response to test rendering logic
const mockUser = {
  id: 123,
  name: "Test User",
  email: "test@example.com",
};

// Replace API call temporarily
async function fetchUser(userId) {
  // return fetch(`/api/users/${userId}`);
  return Promise.resolve(mockUser); // Mock response
}
```

**MSW (Mock Service Worker) for Complex Scenarios:**

```javascript
// src/mocks/handlers.js
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/users/:userId", ({ params }) => {
    return HttpResponse.json({
      id: params.userId,
      name: "Mock User",
    });
  }),
];
```

### Error Boundaries

**Catch React Errors:**

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.message}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>;
```

### Debugging Third-Party Code

**Strategy:**

```javascript
// 1. Check node_modules source (with source maps)
// node_modules/library-name/dist/index.js

// 2. Add breakpoint in library code
// Sources → node_modules → library → file

// 3. Verify library version
import packageJson from "library-name/package.json";
console.log("Library version:", packageJson.version);

// 4. Check known issues
// GitHub: library-name/issues
// Search: "[library-name] [your-error-message]"

// 5. Isolate library behavior
const testResult = libraryFunction(testInput);
console.log("Library result:", testResult);
```

***

## Step 7: Resolution & Verification

### Implement Fix

**Incremental Changes:**

```javascript
// 1. Make smallest possible fix
// 2. Test immediately
// 3. Verify issue resolved
// 4. Check no new issues introduced
// 5. Commit with descriptive message

// Example
git add src/components/UserProfile.jsx
git commit -m "fix: handle null user data in UserProfile

- Add loading/error states
- Prevent render before data loaded
- Fixes 'Cannot read property name of null' error

Resolves #123"
```

### Regression Testing

**Verify No Side Effects:**

```bash
# Run test suite
npm test

# Manual testing checklist
# [ ] Issue resolved
# [ ] No console errors
# [ ] No visual regressions
# [ ] Works in different browsers
# [ ] Performance acceptable
```

### Documentation

**Record Findings:**

```markdown
## Debug Session: 2026-02-10 - User Profile Crash

**Issue:** UserProfile component crashes with "Cannot read property 'name' of null"

**Root Cause:** Component renders before user data loads from API

**Solution:** Added loading state and conditional rendering

**Files Changed:**

- src/components/UserProfile.jsx

**Prevention:** Always handle async data loading states (loading/error/success)

**References:**

- React docs: https://react.dev/learn/render-and-commit
- Related issue: #89 (similar pattern)
```

**Update Memory System:**

```bash
# Add to session-notes.md
echo "## Debug Session: User Profile Fix" >> .github/memory/session-notes.md

# Extract pattern if recurring
echo "### Pattern: Async Data Loading" >> .github/memory/patterns-discovered.md
```

***

## Variables

- `${selection}` - Selected code to debug (optional)
- `${file}` - Current file to debug (optional)
- `${workspaceFolder}` - Project root directory

***

## Success Criteria

After running this prompt:

✅ Issue consistently reproducible  
✅ Root cause identified with evidence  
✅ Fix implemented and tested  
✅ No regressions introduced  
✅ Debugging process documented  
✅ Preventive patterns extracted

***

## Example Usage

**In Copilot Chat:**

```
Run debug-session prompt

> Describe the issue: UserProfile crashes on load
> [AI guides through systematic debugging]
> [Issue identified: missing null check]
> [Fix implemented and verified]
```

**With Code Selection:**

```
[Select problematic code]
Find the bug in this code using the debug-session workflow
```

***

## Common Debugging Patterns

### Pattern 1: Binary Search

```javascript
// Progressively narrow down problem area
// Start: 1000 lines of code
// Disable 500 lines → Issue gone? Problem in disabled half
// Disable 250 lines → Issue persists? Problem in other 250
// Disable 125 lines → Repeat until isolated to specific function
```

### Pattern 2: Rubber Duck Debugging

```
Explain code line-by-line (to AI or colleague):
1. "This function receives user data..."
2. "It maps over the array..." ← Wait, what if array is undefined?
3. Found issue while explaining!
```

### Pattern 3: Git Bisect

```bash
# Find commit that introduced bug
git bisect start
git bisect bad                # Current commit is broken
git bisect good v1.2.0        # v1.2.0 was working
# Git checks out middle commit
npm test                      # Test if issue present
git bisect good/bad           # Repeat until found

# Identifies exact commit that broke functionality
```

### Pattern 4: Differential Debugging

```javascript
// Compare working vs broken scenarios
console.log("Working input:", workingData);
console.log("Broken input:", brokenData);
// Spot the difference to find root cause

// Example output:
// Working: { id: 1, name: "Alice", role: "admin" }
// Broken:  { id: 2, name: "Bob" } ← Missing 'role' field!
```

***

## Follow-up Actions

After debugging session:

1. **Document in session-notes.md** - Record findings for future reference
2. **Extract patterns** - Add to patterns-discovered.md if recurring issue
3. **Improve error handling** - Add defensive checks to prevent similar issues
4. **Add tests** - Write test cases that would have caught this bug
5. **Update monitoring** - Add logging/tracking for this scenario

***

## References

- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
- [React DevTools Guide](https://react.dev/learn/react-developer-tools)
- [JavaScript Debugging Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger)
- [Performance Profiling](https://web.dev/rail/)
- [Memory Leak Detection](https://developer.chrome.com/docs/devtools/memory-problems/)

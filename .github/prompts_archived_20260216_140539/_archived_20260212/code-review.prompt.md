---
description: Comprehensive code review analyzing quality, maintainability, performance, and best practices
agent: frontend-developer
tools: ["readonly"]
---

Perform multi-dimensional code review of ${selection} or ${file}.

**Your Task**: Review code across 7 dimensions, prioritize issues by severity (Critical→Low), provide specific fixes with code examples.

**Review Dimensions**:

1. **Architecture**: Structure, design patterns, separation of concerns, modularity
2. **Code Quality**: Readability, naming conventions, complexity (cyclomatic), duplication, comments where needed
3. **Performance**: Unnecessary computations, memory leaks, bundle size, render optimization, algorithm efficiency
4. **Security**: Input validation, XSS vulnerabilities, auth/authz issues, sensitive data exposure, OWASP Top 10
5. **Accessibility**: WCAG 2.1 Level AA, semantic HTML, keyboard navigation, ARIA, color contrast
6. **Testing**: Test coverage, testability, edge cases handled, mocking strategies
7. **Maintainability**: Error handling, logging, documentation, consistent style, tech debt

**Output Format**: Group issues by dimension and severity. For each issue: location, problem description, why it matters (impact), specific fix with code example, references to standards.

**Standards**:

- [Web Quality Skills](https://github.com/addyosmani/web-quality-skills) - Performance, accessibility, best practices
- [Vercel React Best Practices](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices) - React patterns
- OWASP Top 10 - Security

**Success Criteria**: All Critical issues identified with fixes, code meets quality standards, actionable improvements provided.

**Adapt to Detected Language/Framework**: Reference appropriate standards for Python, TypeScript, React, Vue, etc.

Focus on high-impact issues first. Provide actionable, specific feedback. 8. **Best Practices** - Framework conventions, language idioms, anti-patterns

---

## 1. Architecture & Design

### SOLID Principles

**Single Responsibility (S)**

```javascript
// ❌ BAD: Component doing too much
function UserDashboard() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Handles user loading, posts, analytics, rendering
  // ... 300+ lines of code
}

// ✅ GOOD: Split responsibilities
function UserDashboard() {
  return (
    <div>
      <UserProfile />
      <UserPosts />
      <UserAnalytics />
    </div>
  );
}
```

**Dependency Inversion (D)**

```javascript
// ❌ BAD: Direct dependency on concrete implementation
class OrderService {
  constructor() {
    this.database = new MySQLDatabase(); // Tight coupling
  }
}

// ✅ GOOD: Depend on abstraction
class OrderService {
  constructor(database) {
    // Inject dependency
    this.database = database;
  }
}

// Usage
const db = new MySQLDatabase(); // Or PostgreSQLDatabase, MongoDatabase, etc.
const orderService = new OrderService(db);
```

### Design Patterns

**Check For:**

- [ ] Appropriate pattern usage (Observer, Factory, Strategy, etc.)
- [ ] Avoiding over-engineering (use simplest solution)
- [ ] Clear separation of concerns (data, logic, presentation)
- [ ] Proper abstraction levels (not too abstract, not too concrete)

---

## 2. Code Quality

### Readability

**Naming Conventions:**

```javascript
// ❌ BAD: Unclear names
function f(d) {
  let x = d.filter((i) => i.a > 10);
  return x.map((i) => i.b);
}

// ✅ GOOD: Descriptive names
function getActiveUsernames(users) {
  const activeUsers = users.filter((user) => user.accountAge > 10);
  return activeUsers.map((user) => user.username);
}
```

**Complexity Reduction:**

```javascript
// ❌ BAD: Nested complexity (cyclomatic complexity: 8)
function processOrder(order) {
  if (order) {
    if (order.items) {
      if (order.items.length > 0) {
        if (order.status === "pending") {
          if (order.user) {
            if (order.user.isVerified) {
              // Process order
            }
          }
        }
      }
    }
  }
}

// ✅ GOOD: Early returns (cyclomatic complexity: 2)
function processOrder(order) {
  if (!order?.items?.length) return;
  if (order.status !== "pending") return;
  if (!order.user?.isVerified) return;

  // Process order
}
```

### Code Duplication (DRY)

```javascript
// ❌ BAD: Repeated logic
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validateUserEmail(user) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(user.email);
}

// ✅ GOOD: Extract common logic
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}

function validateUserEmail(user) {
  return isValidEmail(user.email);
}
```

**Check For:**

- [ ] Functions under 50 lines (ideally under 20)
- [ ] Cyclomatic complexity < 10
- [ ] No code duplication (DRY principle)
- [ ] Clear, descriptive names (no abbreviations unless standard)
- [ ] Consistent formatting and style

---

## 3. Performance

### Algorithmic Efficiency

```javascript
// ❌ BAD: O(n²) - checking duplicates
function hasDuplicates(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}

// ✅ GOOD: O(n) - using Set
function hasDuplicates(arr) {
  return new Set(arr).size !== arr.length;
}
```

### Resource Management

```javascript
// ❌ BAD: Memory leak potential
function setupWebSocket() {
  const ws = new WebSocket("wss://api.example.com");
  ws.addEventListener("message", handleMessage);
  // Never cleaned up!
}

// ✅ GOOD: Cleanup on unmount
function useWebSocket(url) {
  useEffect(() => {
    const ws = new WebSocket(url);
    ws.addEventListener("message", handleMessage);

    return () => {
      ws.removeEventListener("message", handleMessage);
      ws.close();
    };
  }, [url]);
}
```

### Database Queries (N+1 Problem)

```javascript
// ❌ BAD: N+1 queries
const users = await db.users.findAll();
for (const user of users) {
  user.posts = await db.posts.findByUserId(user.id); // N queries!
}

// ✅ GOOD: Single query with join
const users = await db.users.findAll({
  include: [{ model: db.posts }],
});
```

**Check For:**

- [ ] Efficient algorithms (avoid O(n²) for large datasets)
- [ ] Proper data structures (Map vs Object, Set vs Array)
- [ ] No memory leaks (cleanup event listeners, timers, subscriptions)
- [ ] Database query optimization (no N+1 problems)
- [ ] Lazy loading for heavy resources

---

## 4. Security

### Input Validation & Sanitization

```javascript
// ❌ BAD: No validation, SQL injection vulnerable
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.query(
    `SELECT * FROM users WHERE username='${username}' AND password='${password}'`,
  );
});

// ✅ GOOD: Parameterized queries + validation
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  // Use parameterized query
  db.query("SELECT * FROM users WHERE username=? AND password=?", [
    username,
    password,
  ]);
});
```

### XSS Prevention

```javascript
// ❌ BAD: Rendering unsanitized user input
function UserComment({ comment }) {
  return <div dangerouslySetInnerHTML={{ __html: comment.text }} />;
}

// ✅ GOOD: Sanitize or let React escape
import DOMPurify from "dompurify";

function UserComment({ comment }) {
  const sanitized = DOMPurify.sanitize(comment.text);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// ✅ BETTER: Let React handle escaping
function UserComment({ comment }) {
  return <div>{comment.text}</div>; // React auto-escapes
}
```

### Authentication & Authorization

```javascript
// ❌ BAD: No auth check
app.get("/admin/users", (req, res) => {
  const users = db.users.findAll();
  res.json(users);
});

// ✅ GOOD: Middleware authentication
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

app.get("/admin/users", requireAdmin, (req, res) => {
  const users = db.users.findAll();
  res.json(users);
});
```

**Check For:**

- [ ] Input validation (type, length, format)
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitize user input)
- [ ] CSRF protection (tokens for state-changing operations)
- [ ] Authentication/authorization checks
- [ ] Sensitive data not logged or exposed
- [ ] Dependencies up to date (no known vulnerabilities)

---

## 5. Accessibility

### Semantic HTML

```html
<!-- ❌ BAD: Generic divs -->
<div class="header">
  <div class="nav">
    <div onclick="navigate()">Home</div>
  </div>
</div>

<!-- ✅ GOOD: Semantic elements -->
<header>
  <nav>
    <a href="/home">Home</a>
  </nav>
</header>
```

### Keyboard Navigation

```jsx
// ❌ BAD: Click-only interaction
<div onClick={handleClick}>Click me</div>

// ✅ GOOD: Keyboard accessible
<button onClick={handleClick}>Click me</button>

// ✅ CUSTOM: Non-button elements made accessible
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Custom button
</div>
```

### ARIA Attributes

```jsx
// ✅ Proper ARIA usage
<button
  aria-expanded={isOpen}
  aria-controls="dropdown-menu"
  onClick={toggleMenu}
>
  Menu
</button>

<ul id="dropdown-menu" hidden={!isOpen}>
  <li>Item 1</li>
</ul>
```

**Check For:**

- [ ] Semantic HTML (header, nav, main, button vs div)
- [ ] Keyboard navigation (all interactive elements accessible)
- [ ] ARIA attributes used correctly (not over-ARIA)
- [ ] Form labels associated with inputs
- [ ] Images have alt text
- [ ] Color contrast meets WCAG AA standards (4.5:1)
- [ ] Focus indicators visible

---

## 6. Testing

### Test Coverage

```javascript
// ✅ GOOD: Test behavior, not implementation
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("SearchBox", () => {
  it("calls onSearch when form submitted", async () => {
    const handleSearch = vi.fn();
    render(<SearchBox onSearch={handleSearch} />);

    const input = screen.getByRole("searchbox");
    const button = screen.getByRole("button", { name: /search/i });

    await userEvent.type(input, "React testing");
    await userEvent.click(button);

    expect(handleSearch).toHaveBeenCalledWith("React testing");
  });

  it("displays error when search fails", async () => {
    const handleSearch = vi.fn().mockRejectedValue(new Error("Network error"));
    render(<SearchBox onSearch={handleSearch} />);

    // Trigger search
    const button = screen.getByRole("button", { name: /search/i });
    await userEvent.click(button);

    // Check error message appears
    expect(await screen.findByRole("alert")).toHaveTextContent("Network error");
  });
});
```

### Testability Issues

```javascript
// ❌ BAD: Hard to test (global state, side effects)
function Component() {
  const data = fetchFromGlobalStore(); // Depends on global
  document.title = "New Title"; // Side effect

  return <div>{data}</div>;
}

// ✅ GOOD: Testable (dependencies injected)
function Component({ data, onTitleChange }) {
  useEffect(() => {
    onTitleChange("New Title");
  }, [onTitleChange]);

  return <div>{data}</div>;
}
```

**Check For:**

- [ ] Adequate test coverage (critical paths covered)
- [ ] Tests focus on behavior, not implementation
- [ ] Edge cases tested (empty, null, error states)
- [ ] Tests are fast and reliable (no flaky tests)
- [ ] Code is testable (no tight coupling to globals)
- [ ] Mocks used appropriately (external dependencies only)

---

## 7. Maintainability

### Error Handling

```javascript
// ❌ BAD: Silent failures
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  } catch (error) {
    // Swallowed error!
  }
}

// ✅ GOOD: Proper error handling
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error(`Unable to load user ${id}`);
  }
}
```

### Documentation

```javascript
// ❌ BAD: No documentation
function calc(a, b, c) {
  return ((a + b) * c) / 100;
}

// ✅ GOOD: Clear documentation
/**
 * Calculate percentage of sum
 *
 * @param {number} baseAmount - Base monetary amount
 * @param {number} additionalAmount - Additional amount to add
 * @param {number} percentageRate - Percentage rate (0-100)
 * @returns {number} Calculated percentage of the sum
 *
 * @example
 * calculatePercentage(100, 50, 10) // Returns 15 (10% of 150)
 */
function calculatePercentage(baseAmount, additionalAmount, percentageRate) {
  const total = baseAmount + additionalAmount;
  return (total * percentageRate) / 100;
}
```

### Magic Numbers & Configuration

```javascript
// ❌ BAD: Magic numbers
if (user.age > 18 && user.accountAge > 30) {
  // What do 18 and 30 mean?
}

// ✅ GOOD: Named constants
const MINIMUM_AGE = 18;
const MINIMUM_ACCOUNT_DAYS = 30;

if (user.age > MINIMUM_AGE && user.accountAge > MINIMUM_ACCOUNT_DAYS) {
  // Clear and maintainable
}
```

**Check For:**

- [ ] Comprehensive error handling (try/catch, error boundaries)
- [ ] Errors logged with context
- [ ] No magic numbers (use constants)
- [ ] Complex logic documented
- [ ] TODOs tracked with issue numbers
- [ ] Deprecation warnings for legacy code

---

## 8. Framework-Specific Best Practices

### React Patterns

```jsx
// Check for React-specific issues
- [ ] Proper hook usage (dependencies, cleanup)
- [ ] No unnecessary re-renders
- [ ] Keys in lists (unique, stable)
- [ ] No mutations of state
- [ ] Error boundaries present
```

### Vue Patterns

```vue
// Check for Vue-specific issues - [ ] Proper reactivity usage (ref, reactive) -
[ ] Computed properties for derived state - [ ] Lifecycle hooks used correctly -
[ ] Props validation defined
```

### Node.js/Express Patterns

```javascript
// Check for backend-specific issues
- [ ] Async error handling (try/catch or .catch())
- [ ] Database connections properly closed
- [ ] Environment variables for config
- [ ] Request validation middleware
- [ ] Rate limiting for public endpoints
```

---

## Review Process

### Step-by-Step Workflow

1. **Understand Context**: Read related code, understand purpose
2. **Architecture Review**: Check design patterns, separation of concerns
3. **Quality Scan**: Check naming, complexity, duplication
4. **Performance Check**: Look for inefficient algorithms, memory leaks
5. **Security Audit**: Validate inputs, check for common vulnerabilities
6. **Accessibility Review**: Semantic HTML, keyboard navigation
7. **Test Review**: Coverage, quality, testability
8. **Maintainability**: Error handling, documentation
9. **Framework Patterns**: Check framework-specific best practices
10. **Prioritize Findings**: Critical → High → Medium → Low

---

## Review Output Template

```markdown
## Code Review Summary

**File**: [filename]
**Review Date**: [date]
**Lines Reviewed**: [count]

### ✅ Strengths

- [What the code does well]

### 🚨 Critical Issues (Fix Immediately)

1. **[Issue]**: [Description]
   - Location: [file:line]
   - Fix: [Specific remedy]
   - Code example: [before/after]

### ⚠️ High Priority (Fix Before Merge)

[Similar format]

### 📋 Medium Priority (Address Soon)

[Similar format]

### 💡 Suggestions (Nice to Have)

[Similar format]

### 📊 Metrics

- Complexity Score: [score]
- Test Coverage: [percentage]
- Security Issues: [count]
- Performance Concerns: [count]

### 📚 Recommendations

1. [Action item]
2. [Action item]
```

---

## Success Criteria

✅ **Architecture**: Clear separation of concerns, appropriate patterns  
✅ **Quality**: Readable, maintainable, no duplication (complexity < 10)  
✅ **Performance**: Efficient algorithms, no memory leaks, optimized queries  
✅ **Security**: Input validated, no XSS/injection, proper auth  
✅ **Accessibility**: WCAG AA compliant, keyboard accessible, semantic HTML  
✅ **Testing**: Critical paths covered, behavior tested, no flaky tests  
✅ **Maintainability**: Errors handled, code documented, no magic numbers  
✅ **Best Practices**: Framework conventions followed, no anti-patterns

---

## Related Prompts

- [react-component-review.prompt.md](react-component-review.prompt.md) - React-specific review
- [accessibility-review.prompt.md](accessibility-review.prompt.md) - Detailed a11y audit
- [performance-optimization.prompt.md](performance-optimization.prompt.md) - Performance improvements

---

## Tools & Resources

- **Linters**: ESLint, Prettier
- **Security**: npm audit, Snyk, OWASP dependency check
- **Complexity**: SonarQube, Code Climate
- **Testing**: Jest, Vitest, React Testing Library
- **Accessibility**: axe-core, Pa11y, Lighthouse

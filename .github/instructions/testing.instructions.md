---
description: Testing patterns, conventions, and best practices for maintainable test suites
applyTo: "**/*.test.*,**/*.spec.*,**/__tests__/**"
---

# Testing Instructions

These guidelines apply when writing tests (.test._, .spec._, or files in **tests** directories). Follow these patterns for maintainable, reliable test suites.

## Test Structure

### AAA Pattern (Arrange-Act-Assert)

```javascript
// ✅ Clear structure
test("calculateTotal adds item prices", () => {
  // Arrange - Set up test data
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 1 },
  ];

  // Act - Execute the code under test
  const total = calculateTotal(items);

  // Assert - Verify the result
  expect(total).toBe(25);
});

// ❌ Unclear structure
test("total", () => {
  expect(
    calculateTotal([
      { price: 10, quantity: 2 },
      { price: 5, quantity: 1 },
    ]),
  ).toBe(25);
});
```

### One Assertion Per Test (Guideline)

```javascript
// ✅ Focused tests
test("user has correct name", () => {
  const user = createUser({ name: "Alice" });
  expect(user.name).toBe("Alice");
});

test("user has correct email", () => {
  const user = createUser({ email: "alice@example.com" });
  expect(user.email).toBe("alice@example.com");
});

// ⚠️ Multiple assertions OK if testing single behavior
test("user creation sets all required fields", () => {
  const user = createUser({ name: "Alice", email: "alice@example.com" });
  expect(user.name).toBe("Alice");
  expect(user.email).toBe("alice@example.com");
  expect(user.createdAt).toBeInstanceOf(Date);
});
```

---

## Test Naming

### Descriptive Test Names

```javascript
// ❌ Vague test names
test("user works", () => {
  /* ... */
});
test("validation", () => {
  /* ... */
});
test("test1", () => {
  /* ... */
});

// ✅ Descriptive test names (behavior-focused)
test("createUser returns user object with id, name, and email", () => {
  /* ... */
});
test("validateEmail returns error when email is missing @ symbol", () => {
  /* ... */
});
test("fetchUsers throws error when API returns 404", () => {
  /* ... */
});

// ✅ Alternative: "should" format
test("should return user object when given valid data", () => {
  /* ... */
});
test("should throw error when email is invalid", () => {
  /* ... */
});
```

### describe Block Organization

```javascript
// ✅ Organize related tests
describe("UserService", () => {
  describe("createUser", () => {
    test("creates user with valid data", () => {
      /* ... */
    });
    test("throws error when name is missing", () => {
      /* ... */
    });
    test("throws error when email is invalid", () => {
      /* ... */
    });
  });

  describe("updateUser", () => {
    test("updates user name", () => {
      /* ... */
    });
    test("updates user email", () => {
      /* ... */
    });
    test("throws error when user not found", () => {
      /* ... */
    });
  });

  describe("deleteUser", () => {
    test("deletes user by id", () => {
      /* ... */
    });
    test("returns false when user not found", () => {
      /* ... */
    });
  });
});
```

---

## Framework-Agnostic Patterns

**Note**: Examples use Vitest syntax, but patterns apply to all testing frameworks (Jest, Mocha, etc.).

### Test Setup and Teardown

```javascript
// Setup before each test
beforeEach(() => {
  // Reset state, create fresh test data
  database.clear();
  localStorage.clear();
});

// Cleanup after each test
afterEach(() => {
  // Restore mocks, close connections
  vi.restoreAllMocks(); // Vitest | jest.restoreAllMocks() in Jest
});

// Setup before all tests in describe block
beforeAll(async () => {
  await database.connect();
});

// Cleanup after all tests
afterAll(async () => {
  await database.disconnect();
});
```

### Mock Functions

```javascript
// Create mock function
const mockCallback = vi.fn(); // Vitest | jest.fn() in Jest | sinon.spy() in Sinon

// Mock with implementation
const mockFetch = vi.fn(() => Promise.resolve({ data: "test" }));

// Mock with different return values
mockFetch
  .mockResolvedValueOnce({ data: "first" })
  .mockResolvedValueOnce({ data: "second" });

// Assertions
expect(mockFetch).toHaveBeenCalled();
expect(mockFetch).toHaveBeenCalledWith("https://api.example.com");
expect(mockFetch).toHaveBeenCalledTimes(2);
```

---

## React Component Testing

### Testing Library Principles

**Test behavior, not implementation.**

```javascript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ✅ Test what users see and do
test("shows error message when form is submitted with empty email", async () => {
  const user = userEvent.setup();

  render(<LoginForm />);

  const submitButton = screen.getByRole("button", { name: /submit/i });
  await user.click(submitButton);

  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
});

// ❌ Test implementation details
test("sets emailError state when email is empty", () => {
  const { result } = renderHook(() => useLoginForm());

  result.current.setEmail("");
  result.current.validate();

  expect(result.current.emailError).toBe("Email is required");
  // Brittle: tied to internal state names
});
```

### Accessible Queries (Recommended)

```javascript
// ✅ Accessible queries (best → good)
screen.getByRole("button", { name: /submit/i }); // Semantic role
screen.getByLabelText(/email address/i); // Form field labels
screen.getByPlaceholderText(/enter email/i); // Input placeholders
screen.getByText(/welcome/i); // Visible text

// ⚠️ Avoid test IDs unless necessary
screen.getByTestId("submit-button"); // Last resort

// ❌ Don't query by implementation details
wrapper.find(".submit-button"); // CSS classes
wrapper.find("SubmitButton"); // Component names
```

### User Interactions

```javascript
import userEvent from "@testing-library/user-event";

test("user can type in search input", async () => {
  const user = userEvent.setup();

  render(<SearchInput />);

  const input = screen.getByRole("textbox", { name: /search/i });

  await user.type(input, "react");

  expect(input).toHaveValue("react");
});

test("user can submit form with keyboard", async () => {
  const user = userEvent.setup();
  const mockSubmit = vi.fn();

  render(<LoginForm onSubmit={mockSubmit} />);

  await user.type(screen.getByLabelText(/email/i), "test@example.com");
  await user.type(screen.getByLabelText(/password/i), "password123");
  await user.keyboard("{Enter}");

  expect(mockSubmit).toHaveBeenCalled();
});
```

### Async Testing

```javascript
import { waitFor, waitForElementToBeRemoved } from "@testing-library/react";

// ✅ Use findBy queries for async content
test("displays user data after loading", async () => {
  render(<UserProfile userId={1} />);

  // findBy automatically waits for element to appear
  const userName = await screen.findByText(/alice/i);

  expect(userName).toBeInTheDocument();
});

// ✅ Use waitFor for complex async logic
test("shows error message after failed fetch", async () => {
  mockFetch.mockRejectedValueOnce(new Error("API Error"));

  render(<UserProfile userId={1} />);

  await waitFor(() => {
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });
});

// ✅ Use waitForElementToBeRemoved for loading states
test("removes loading spinner when data loads", async () => {
  render(<UserProfile userId={1} />);

  const loadingSpinner = screen.getByText(/loading/i);

  await waitForElementToBeRemoved(loadingSpinner);

  expect(screen.getByText(/alice/i)).toBeInTheDocument();
});
```

---

## Testing Async Code

### Promise-based Tests

```javascript
// ✅ Return promise (no async/await needed)
test("fetchUser returns user data", () => {
  return fetchUser(1).then((user) => {
    expect(user.name).toBe("Alice");
  });
});

// ✅ Async/await (cleaner)
test("fetchUser returns user data", async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe("Alice");
});

// ✅ Test rejection
test("fetchUser throws error when user not found", async () => {
  await expect(fetchUser(999)).rejects.toThrow("User not found");
});

// ❌ Don't forget await (test will pass incorrectly)
test("fetchUser returns user data", async () => {
  const user = fetchUser(1); // Missing await!
  expect(user.name).toBe("Alice"); // Always fails but test might pass
});
```

### Testing Timers

```javascript
// Use fake timers
beforeEach(() => {
  vi.useFakeTimers(); // Vitest | jest.useFakeTimers() in Jest
});

afterEach(() => {
  vi.restoreAllMocks(); // Vitest | jest.restoreAllMocks() in Jest
});

test("debounced search calls API after delay", async () => {
  const user = userEvent.setup({ delay: null }); // Disable userEvent delays
  const mockSearch = vi.fn();

  render(<SearchInput onSearch={mockSearch} />);

  await user.type(screen.getByRole("textbox"), "react");

  // Advance timers
  vi.advanceTimersByTime(300); // Vitest | jest.advanceTimersByTime() in Jest

  expect(mockSearch).toHaveBeenCalledWith("react");
});
```

---

## Mocking Strategies

### Mock Levels (Prefer Higher Levels)

**1. Mock at Network Layer (Highest)**

```javascript
// ✅ Mock with MSW (Mock Service Worker)
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get("/api/users/:id", (req, res, ctx) => {
    return res(ctx.json({ id: 1, name: "Alice" }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("fetches user from API", async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe("Alice");
});
```

**2. Mock Services/Modules**

```javascript
// ✅ Mock module
vi.mock("../services/api", () => ({
  fetchUser: vi.fn(() => Promise.resolve({ id: 1, name: "Alice" })),
}));

test("displays user name", async () => {
  render(<UserProfile userId={1} />);
  expect(await screen.findByText("Alice")).toBeInTheDocument();
});
```

**3. Dependency Injection (Lowest, Most Flexible)**

```javascript
// ✅ Inject dependencies for testability
function UserProfile({ userId, userService = defaultUserService }) {
  // Use userService.fetchUser(userId)
}

// Test with mock service
test("displays user name", async () => {
  const mockService = {
    fetchUser: () => Promise.resolve({ id: 1, name: "Alice" }),
  };

  render(<UserProfile userId={1} userService={mockService} />);
  expect(await screen.findByText("Alice")).toBeInTheDocument();
});
```

---

## Test Anti-Patterns

### 1. Testing Implementation Details

```javascript
// ❌ Testing internal state
test("sets loading state to true", () => {
  const { result } = renderHook(() => useUsers());
  act(() => {
    result.current.fetchUsers();
  });
  expect(result.current.loading).toBe(true);
});

// ✅ Test user-visible behavior
test("shows loading indicator while fetching", async () => {
  render(<UserList />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
});
```

### 2. Too Many Mocks

```javascript
// ❌ Over-mocking makes test fragile
test("renders user profile", () => {
  const mockUser = { id: 1, name: "Alice", email: "alice@example.com" };
  const mockFetch = vi.fn(() => Promise.resolve(mockUser));
  const mockLogger = vi.fn();
  const mockAnalytics = vi.fn();

  render(
    <UserProfile
      fetch={mockFetch}
      logger={mockLogger}
      analytics={mockAnalytics}
    />,
  );
  // Test is now tightly coupled to implementation
});

// ✅ Only mock external dependencies
test("renders user profile", async () => {
  // Mock API response only
  server.use(
    rest.get("/api/users/1", (req, res, ctx) => {
      return res(ctx.json({ id: 1, name: "Alice" }));
    }),
  );

  render(<UserProfile userId={1} />);
  expect(await screen.findByText("Alice")).toBeInTheDocument();
});
```

### 3. Large, Complex Tests

```javascript
// ❌ Testing too much in one test
test("entire user workflow", async () => {
  // 50 lines of test code testing: login, navigation, CRUD operations, logout
  // Hard to debug when fails, unclear what broke
});

// ✅ Break into focused tests
describe("User workflow", () => {
  test("user can log in", async () => {
    /* ... */
  });
  test("user can create post", async () => {
    /* ... */
  });
  test("user can edit post", async () => {
    /* ... */
  });
  test("user can delete post", async () => {
    /* ... */
  });
  test("user can log out", async () => {
    /* ... */
  });
});
```

### 4. Snapshot Overuse

```javascript
// ❌ Snapshot entire component (brittle)
test("renders correctly", () => {
  const { container } = render(<UserProfile user={mockUser} />);
  expect(container).toMatchSnapshot();
  // Breaks on any HTML change, even whitespace
});

// ✅ Test specific behavior
test("displays user name and email", () => {
  render(<UserProfile user={mockUser} />);
  expect(screen.getByText(mockUser.name)).toBeInTheDocument();
  expect(screen.getByText(mockUser.email)).toBeInTheDocument();
});

// ✅ Snapshot specific data structures (OK for JSON)
test("generates correct report data", () => {
  const report = generateReport(data);
  expect(report).toMatchSnapshot();
});
```

---

## Test Coverage Guidelines

### What to Test

**✅ High Priority:**

- User-visible behavior
- Edge cases and error states
- Business logic and calculations
- Data transformations
- API integrations
- Critical user flows

**⚠️ Lower Priority:**

- Pure presentation components with no logic
- Third-party library code
- Constants and configuration
- Trivial getters/setters

**❌ Don't Test:**

- Framework internals (React, etc.)
- External library implementations
- Auto-generated code

### Coverage Targets

```bash
# Aim for high coverage of business logic
# 80% statement coverage is reasonable goal
# 100% coverage doesn't guarantee quality
```

**Coverage is a metric, not a goal.** Focus on testing critical paths.

---

## TDD (Test-Driven Development)

### RED-GREEN-REFACTOR Cycle

```javascript
// 1. RED - Write failing test first
test("calculateDiscount applies 10% discount for orders over $100", () => {
  const order = { total: 150 };
  expect(calculateDiscount(order)).toBe(15);
});
// ❌ Test fails: calculateDiscount not implemented

// 2. GREEN - Write minimal code to pass
function calculateDiscount(order) {
  if (order.total > 100) {
    return order.total * 0.1;
  }
  return 0;
}
// ✅ Test passes

// 3. REFACTOR - Improve code while keeping tests green
const DISCOUNT_THRESHOLD = 100;
const DISCOUNT_RATE = 0.1;

function calculateDiscount(order) {
  if (order.total <= DISCOUNT_THRESHOLD) {
    return 0;
  }
  return order.total * DISCOUNT_RATE;
}
// ✅ Tests still pass, code is cleaner
```

---

## Best Practices

### 1. Deterministic Tests

```javascript
// ❌ Non-deterministic (flaky)
test("creates timestamp", () => {
  const user = createUser();
  expect(user.createdAt).toBe(new Date()); // Time keeps changing!
});

// ✅ Deterministic
test("creates timestamp", () => {
  const now = new Date("2024-01-01");
  vi.setSystemTime(now); // Freeze time

  const user = createUser();
  expect(user.createdAt).toEqual(now);
});
```

### 2. Isolated Tests

```javascript
// ❌ Tests depend on each other
let user;

test("creates user", () => {
  user = createUser({ name: "Alice" });
  expect(user).toBeDefined();
});

test("updates user", () => {
  updateUser(user, { name: "Bob" }); // Depends on previous test!
  expect(user.name).toBe("Bob");
});

// ✅ Independent tests
test("creates user", () => {
  const user = createUser({ name: "Alice" });
  expect(user).toBeDefined();
});

test("updates user", () => {
  const user = createUser({ name: "Alice" });
  updateUser(user, { name: "Bob" });
  expect(user.name).toBe("Bob");
});
```

### 3. Fast Tests

```javascript
// ✅ Fast: Use in-memory implementations
const mockDatabase = {
  users: new Map(),
  findById: (id) => mockDatabase.users.get(id),
  save: (user) => mockDatabase.users.set(user.id, user),
};

// ✅ Fast: Mock timers instead of real delays
test("debounced function", () => {
  vi.useFakeTimers();
  // Test runs instantly
  vi.advanceTimersByTime(500);
});

// ❌ Slow: Real database in tests
test("creates user in database", async () => {
  await database.connect(); // Slow
  const user = await database.users.create({ name: "Alice" });
  await database.disconnect();
});
```

### 4. Clear Error Messages

```javascript
// ❌ Unclear failure message
expect(result).toBe(expected);
// Error: Expected 42, received 43

// ✅ Descriptive error message
expect(result).toBe(expected);
// Use custom matchers or add context
expect(calculateTotal(items)).toBe(42); // "calculateTotal" in error helps debug
```

---

## Common Assertions

```javascript
// Equality
expect(value).toBe(42); // Strict equality (===)
expect(object).toEqual({ name: "Alice" }); // Deep equality

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Numbers
expect(value).toBeGreaterThan(10);
expect(value).toBeLessThan(100);
expect(value).toBeCloseTo(3.14, 2); // Floating point comparison

// Strings
expect(string).toMatch(/pattern/);
expect(string).toContain("substring");

// Arrays/Iterables
expect(array).toContain(item);
expect(array).toHaveLength(3);

// Objects
expect(object).toHaveProperty("key");
expect(object).toMatchObject({ name: "Alice" }); // Partial match

// Errors
expect(() => throwError()).toThrow();
expect(() => throwError()).toThrow("Error message");
expect(async () => await fetchData()).rejects.toThrow();

// React Testing Library
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toHaveTextContent("text");
expect(input).toHaveValue("value");
```

---

## Resources

**Testing Library:**

- [Testing Library Docs](https://testing-library.com/)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

**Framework Documentation:**

- Vitest: https://vitest.dev/
- Jest: https://jestjs.io/
- Mocha: https://mochajs.org/

**Best Practices:**

- Test behavior, not implementation
- Use accessible queries
- Keep tests fast and isolated
- Avoid testing third-party code
- Aim for deterministic tests

---

## Quick Reference

**Test Structure:**

- Arrange → Act → Assert
- One behavior per test
- Descriptive test names

**Query Priority (React Testing Library):**

1. getByRole (most accessible)
2. getByLabelText
3. getByPlaceholderText
4. getByText
5. getByTestId (last resort)

**Common Mistakes:**

- ❌ Testing implementation details
- ❌ Too many mocks
- ❌ Non-deterministic tests
- ❌ Tests that depend on each other
- ❌ Snapshot overuse

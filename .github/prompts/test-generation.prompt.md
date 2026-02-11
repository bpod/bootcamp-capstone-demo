---
description: "Generate comprehensive tests for components using React Testing Library and TDD principles"
---

# Test Generation

Generate high-quality, maintainable tests for React components using Testing Library principles and TDD methodology. Focuses on user-centric testing, proper async handling, and framework-agnostic patterns.

**Focus**: Test behavior, not implementation. Write tests users would understand.

---

## Test Generation Workflow

### 1. Analyze Component

**Understand what to test:**

- **User-visible behavior** - What users see and do
- **Component inputs** - Props, user interactions, data fetching
- **Component outputs** - Rendered UI, callbacks, side effects
- **Edge cases** - Empty states, errors, loading states
- **Accessibility** - Keyboard navigation, screen reader support

**Questions to ask:**

1. What are the main use cases for this component?
2. What props does it accept and how do they affect rendering?
3. What user interactions are possible (clicks, typing, etc.)?
4. Are there async operations (data fetching, timers)?
5. What error states exist?
6. Is this component accessible?

---

### 2. Choose Testing Strategy

#### When to Use Each Test Type

**Component Tests (Most Common)**

Use for: Testing user interactions and UI behavior

```javascript
// ✅ Test user-facing behavior
test("submits form when user enters valid data", async () => {
  const user = userEvent.setup();
  const mockSubmit = vi.fn(); // Vitest: vi.fn() | Jest: jest.fn()

  render(<LoginForm onSubmit={mockSubmit} />);

  await user.type(screen.getByLabelText(/email/i), "user@example.com");
  await user.type(screen.getByLabelText(/password/i), "password123");
  await user.click(screen.getByRole("button", { name: /log in/i }));

  expect(mockSubmit).toHaveBeenCalledWith({
    email: "user@example.com",
    password: "password123",
  });
});
```

**Integration Tests**

Use for: Testing multiple components working together

```javascript
// ✅ Test feature flow across components
test("user can complete checkout process", async () => {
  const user = userEvent.setup();

  render(<CheckoutFlow />);

  // Step 1: Enter shipping info
  await user.type(screen.getByLabelText(/address/i), "123 Main St");
  await user.click(screen.getByRole("button", { name: /continue/i }));

  // Step 2: Enter payment
  await user.type(screen.getByLabelText(/card number/i), "4242424242424242");
  await user.click(screen.getByRole("button", { name: /place order/i }));

  // Verify completion
  expect(await screen.findByText(/order confirmed/i)).toBeInTheDocument();
});
```

**Unit Tests (Custom Hooks/Utilities)**

Use for: Testing pure logic without UI

```javascript
// ✅ Test utility function
import { formatCurrency } from "./utils";

describe("formatCurrency", () => {
  test("formats dollars with two decimal places", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });

  test("handles zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  test("handles negative numbers", () => {
    expect(formatCurrency(-50)).toBe("-$50.00");
  });
});
```

---

### 3. TDD Workflow (Optional but Recommended)

Use TDD when implementing new features or fixing bugs:

#### RED: Write a Failing Test

```javascript
describe("Counter", () => {
  test("increments when button clicked", async () => {
    const user = userEvent.setup();

    render(<Counter />);

    const button = screen.getByRole("button", { name: /increment/i });

    expect(screen.getByText("Count: 0")).toBeInTheDocument();

    await user.click(button);

    // This will fail initially (RED)
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });
});
```

#### GREEN: Make It Pass (Minimal Implementation)

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

#### REFACTOR: Improve Code Quality

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount((prev) => prev + 1); // Use updater function

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

---

## Testing Patterns

### Pattern 1: Form Testing

**Test user input and validation:**

```javascript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "./ContactForm";

describe("ContactForm", () => {
  test("submits form with valid data", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn(); // Vitest: vi.fn() | Jest: jest.fn()

    render(<ContactForm onSubmit={mockSubmit} />);

    // Fill form fields
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello world");

    // Submit form
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // Verify submission
    expect(mockSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      message: "Hello world",
    });
  });

  test("shows validation errors for invalid email", async () => {
    const user = userEvent.setup();

    render(<ContactForm onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText(/email/i), "invalid-email");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // Check for error message
    expect(screen.getByText(/valid email address/i)).toBeInTheDocument();

    // Form not submitted
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("prevents submission with empty required fields", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();

    render(<ContactForm onSubmit={mockSubmit} />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    // Show errors
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();

    // Don't call submit
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
```

---

### Pattern 2: Async Data Fetching

**Test loading states, success, and errors:**

```javascript
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { fetchUserProfile } from "../api/users";
import { UserProfile } from "./UserProfile";

// Vitest: vi.mock() | Jest: jest.mock() | Mocha: use sinon
vi.mock("../api/users");

describe("UserProfile", () => {
  test("displays loading state initially", () => {
    fetchUserProfile.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<UserProfile userId="123" />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("displays user data after successful fetch", async () => {
    fetchUserProfile.mockResolvedValue({
      id: "123",
      name: "Jane Doe",
      email: "jane@example.com",
      bio: "Software engineer",
    });

    render(<UserProfile userId="123" />);

    // Wait for loading to disappear
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    // Check user data is displayed
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("Software engineer")).toBeInTheDocument();
  });

  test("displays error message on fetch failure", async () => {
    fetchUserProfile.mockRejectedValue(new Error("Network error"));

    render(<UserProfile userId="123" />);

    // Wait for error message
    expect(
      await screen.findByText(/error loading profile/i),
    ).toBeInTheDocument();

    // No user data shown
    expect(screen.queryByText("Jane Doe")).not.toBeInTheDocument();
  });

  test("refetches data when userId changes", async () => {
    fetchUserProfile
      .mockResolvedValueOnce({ id: "1", name: "User 1" })
      .mockResolvedValueOnce({ id: "2", name: "User 2" });

    const { rerender } = render(<UserProfile userId="1" />);

    expect(await screen.findByText("User 1")).toBeInTheDocument();

    // Change userId prop
    rerender(<UserProfile userId="2" />);

    expect(await screen.findByText("User 2")).toBeInTheDocument();
    expect(screen.queryByText("User 1")).not.toBeInTheDocument();
  });
});
```

---

### Pattern 3: User Interactions

**Test clicks, typing, and complex interactions:**

```javascript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoList } from "./TodoList";

describe("TodoList", () => {
  test("adds new todo when user types and presses enter", async () => {
    const user = userEvent.setup();

    render(<TodoList />);

    const input = screen.getByPlaceholderText(/add a todo/i);

    await user.type(input, "Buy groceries{Enter}");

    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
    expect(input).toHaveValue(""); // Input cleared
  });

  test("marks todo as complete when checkbox clicked", async () => {
    const user = userEvent.setup();

    render(
      <TodoList initialTodos={[{ id: 1, text: "Task 1", done: false }]} />,
    );

    const checkbox = screen.getByRole("checkbox", { name: /task 1/i });

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  test("deletes todo when delete button clicked", async () => {
    const user = userEvent.setup();

    render(
      <TodoList initialTodos={[{ id: 1, text: "Task 1", done: false }]} />,
    );

    expect(screen.getByText("Task 1")).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", { name: /delete task 1/i });
    await user.click(deleteButton);

    expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
  });

  test("filters todos by completion status", async () => {
    const user = userEvent.setup();

    render(
      <TodoList
        initialTodos={[
          { id: 1, text: "Done task", done: true },
          { id: 2, text: "Pending task", done: false },
        ]}
      />,
    );

    // Initially shows both
    expect(screen.getByText("Done task")).toBeInTheDocument();
    expect(screen.getByText("Pending task")).toBeInTheDocument();

    // Filter to show only active
    await user.click(screen.getByRole("button", { name: /active/i }));

    expect(screen.queryByText("Done task")).not.toBeInTheDocument();
    expect(screen.getByText("Pending task")).toBeInTheDocument();

    // Filter to show completed
    await user.click(screen.getByRole("button", { name: /completed/i }));

    expect(screen.getByText("Done task")).toBeInTheDocument();
    expect(screen.queryByText("Pending task")).not.toBeInTheDocument();
  });
});
```

---

### Pattern 4: Modal/Dialog Testing

**Test focus trap, keyboard navigation, and accessibility:**

```javascript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog } from "./ConfirmDialog";

describe("ConfirmDialog", () => {
  test("focuses first button when opened", () => {
    render(
      <ConfirmDialog isOpen={true} onConfirm={vi.fn()} onCancel={vi.fn()}>
        Delete this item?
      </ConfirmDialog>,
    );

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    expect(confirmButton).toHaveFocus();
  });

  test("closes when escape key pressed", async () => {
    const user = userEvent.setup();
    const mockCancel = vi.fn();

    render(
      <ConfirmDialog isOpen={true} onConfirm={vi.fn()} onCancel={mockCancel}>
        Delete this item?
      </ConfirmDialog>,
    );

    await user.keyboard("{Escape}");

    expect(mockCancel).toHaveBeenCalled();
  });

  test("calls onConfirm when confirm button clicked", async () => {
    const user = userEvent.setup();
    const mockConfirm = vi.fn();

    render(
      <ConfirmDialog isOpen={true} onConfirm={mockConfirm} onCancel={vi.fn()}>
        Delete this item?
      </ConfirmDialog>,
    );

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    expect(mockConfirm).toHaveBeenCalled();
  });

  test("traps focus inside dialog", async () => {
    const user = userEvent.setup();

    render(
      <ConfirmDialog isOpen={true} onConfirm={vi.fn()} onCancel={vi.fn()}>
        Delete this item?
      </ConfirmDialog>,
    );

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    const cancelButton = screen.getByRole("button", { name: /cancel/i });

    expect(confirmButton).toHaveFocus();

    // Tab to next element
    await user.tab();
    expect(cancelButton).toHaveFocus();

    // Tab again should cycle back to first
    await user.tab();
    expect(confirmButton).toHaveFocus();
  });
});
```

---

### Pattern 5: Custom Hooks Testing

**Test hooks in isolation using Testing Library's renderHook:**

```javascript
import { renderHook, waitFor } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Vitest: vi.useFakeTimers() | Jest: jest.useFakeTimers()
  });

  afterEach(() => {
    vi.useRealTimers(); // Vitest: vi.useRealTimers() | Jest: jest.useRealTimers()
  });

  test("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 500));

    expect(result.current).toBe("hello");
  });

  test("updates value after delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "hello", delay: 500 },
      },
    );

    expect(result.current).toBe("hello");

    // Update value
    rerender({ value: "world", delay: 500 });

    // Still old value immediately
    expect(result.current).toBe("hello");

    // Fast-forward time
    vi.advanceTimersByTime(500);

    // Now updated
    expect(result.current).toBe("world");
  });

  test("cancels previous timeout on rapid changes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: "a" },
      },
    );

    rerender({ value: "b" });
    vi.advanceTimersByTime(200);

    rerender({ value: "c" });
    vi.advanceTimersByTime(200);

    rerender({ value: "d" });
    vi.advanceTimersByTime(200);

    // Only 600ms passed, still showing initial
    expect(result.current).toBe("a");

    // Complete the 500ms from last change
    vi.advanceTimersByTime(300);

    // Now shows last value
    expect(result.current).toBe("d");
  });
});
```

---

### Pattern 6: Accessibility Testing

**Use jest-axe to catch a11y violations:**

```javascript
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe"; // Or vitest-axe
import userEvent from "@testing-library/user-event";
import { SearchBar } from "./SearchBar";

expect.extend(toHaveNoViolations);

describe("SearchBar accessibility", () => {
  test("has no accessibility violations", async () => {
    const { container } = render(<SearchBar onSearch={vi.fn()} />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("search input has proper label", () => {
    render(<SearchBar onSearch={vi.fn()} />);

    const input = screen.getByLabelText(/search/i);
    expect(input).toBeInTheDocument();
  });

  test("is keyboard accessible", async () => {
    const user = userEvent.setup();
    const mockSearch = vi.fn();

    render(<SearchBar onSearch={mockSearch} />);

    const input = screen.getByLabelText(/search/i);

    // Tab to input
    await user.tab();
    expect(input).toHaveFocus();

    // Type search query
    await user.type(input, "test query");

    // Press Enter to submit
    await user.keyboard("{Enter}");

    expect(mockSearch).toHaveBeenCalledWith("test query");
  });

  test("clear button has accessible name", () => {
    render(<SearchBar onSearch={vi.fn()} defaultValue="test" />);

    const clearButton = screen.getByRole("button", { name: /clear search/i });
    expect(clearButton).toBeInTheDocument();
  });
});
```

---

## Edge Cases to Test

### Empty States

```javascript
test("shows empty state when no items", () => {
  render(<ItemList items={[]} />);

  expect(screen.getByText(/no items found/i)).toBeInTheDocument();
});
```

### Loading States

```javascript
test("shows loading spinner while fetching", () => {
  render(<AsyncComponent isLoading={true} />);

  expect(screen.getByRole("status")).toBeInTheDocument();
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
});
```

### Error States

```javascript
test("displays error message when fetch fails", async () => {
  mockFetch.mockRejectedValue(new Error("Network error"));

  render(<DataComponent />);

  const errorMessage = await screen.findByText(/something went wrong/i);
  expect(errorMessage).toBeInTheDocument();
});
```

### Boundary Values

```javascript
describe("Pagination", () => {
  test("handles page 1 correctly", () => {
    render(<Pagination currentPage={1} totalPages={10} />);

    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
  });

  test("handles last page correctly", () => {
    render(<Pagination currentPage={10} totalPages={10} />);

    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  test("handles single page", () => {
    render(<Pagination currentPage={1} totalPages={1} />);

    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });
});
```

---

## Testing Best Practices

### 1. Test User Behavior, Not Implementation

```javascript
// ❌ BAD: Testing implementation details
test("updates state when button clicked", () => {
  const { result } = renderHook(() => useState(0));
  act(() => {
    result.current[1](1); // Directly calling setState
  });
  expect(result.current[0]).toBe(1);
});

// ✅ GOOD: Testing user-visible behavior
test("increments counter when button clicked", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  await user.click(screen.getByRole("button", { name: /increment/i }));

  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

### 2. Use Accessible Queries

**Query Priority (from Testing Library docs):**

1. **getByRole** - Preferred (reflects how users/assistive tech see page)
2. **getByLabelText** - Good for form fields
3. **getByPlaceholderText** - Acceptable for inputs
4. **getByText** - Good for non-interactive elements
5. **getByDisplayValue** - For form elements with values
6. **getByAltText** - For images
7. **getByTitle** - Last resort
8. **getByTestId** - Avoid if possible (implementation detail)

```javascript
// ✅ GOOD: Accessible queries
const button = screen.getByRole("button", { name: /submit/i });
const input = screen.getByLabelText(/email/i);
const heading = screen.getByRole("heading", { name: /welcome/i });

// ❌ AVOID: Test IDs (use only when no better option)
const button = screen.getByTestId("submit-button");
```

### 3. Handle Async Operations Properly

```javascript
// ❌ BAD: Not waiting for async operations
test("displays user data", () => {
  render(<UserProfile userId="123" />);
  expect(screen.getByText("John Doe")).toBeInTheDocument(); // Fails!
});

// ✅ GOOD: Wait for async updates
test("displays user data", async () => {
  render(<UserProfile userId="123" />);
  expect(await screen.findByText("John Doe")).toBeInTheDocument();
});

// ✅ GOOD: Wait for element to be removed
test("loading spinner disappears after fetch", async () => {
  render(<UserProfile userId="123" />);

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

  expect(screen.getByText("John Doe")).toBeInTheDocument();
});
```

### 4. Isolate Tests

```javascript
// ✅ GOOD: Each test is independent
describe("TodoList", () => {
  test("adds todo", async () => {
    render(<TodoList />);
    // ... test adding
  });

  test("deletes todo", async () => {
    // Fresh render with initial state
    render(<TodoList initialTodos={[{ id: 1, text: "Task" }]} />);
    // ... test deleting
  });
});
```

### 5. Mock External Dependencies

```javascript
// ✅ GOOD: Mock API calls
vi.mock("../api/users", () => ({
  fetchUsers: vi.fn(),
  createUser: vi.fn(),
}));

// ✅ GOOD: Mock timers for debounce/throttle
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});
```

---

## Common Test Smells to Avoid

### ❌ Smell 1: Testing Too Much at Once

```javascript
// ❌ BAD: Giant test
test("complete user flow", async () => {
  // 50 lines of actions and assertions
  // Hard to debug when it fails
});

// ✅ GOOD: Focused tests
test("user can log in", async () => {
  /* ... */
});
test("user can view profile", async () => {
  /* ... */
});
test("user can update settings", async () => {
  /* ... */
});
```

### ❌ Smell 2: Overusing Snapshots

```javascript
// ❌ BAD: Snapshot for everything
test("renders correctly", () => {
  const { container } = render(<Component />);
  expect(container).toMatchSnapshot(); // Brittle, hard to review
});

// ✅ GOOD: Specific assertions
test("renders welcome message", () => {
  render(<Component />);
  expect(screen.getByText("Welcome, User!")).toBeInTheDocument();
});
```

### ❌ Smell 3: Not Cleaning Up

```javascript
// ❌ BAD: Leaving side effects
test("fetches data", async () => {
  // Starts a timer but never cleans up
  setInterval(() => {
    /* ... */
  }, 1000);
});

// ✅ GOOD: Clean up in afterEach
afterEach(() => {
  vi.clearAllTimers();
  vi.clearAllMocks();
});
```

---

## Test File Structure

**Recommended organization:**

```javascript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentName } from "./ComponentName";

// Mock dependencies
vi.mock("../api/data");

describe("ComponentName", () => {
  // Setup/teardown
  beforeEach(() => {
    // Reset mocks, timers, etc.
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Group related tests
  describe("rendering", () => {
    test("renders with default props", () => {
      // ...
    });

    test("renders with custom props", () => {
      // ...
    });
  });

  describe("user interactions", () => {
    test("handles button click", async () => {
      // ...
    });

    test("submits form", async () => {
      // ...
    });
  });

  describe("edge cases", () => {
    test("handles empty state", () => {
      // ...
    });

    test("handles error state", () => {
      // ...
    });
  });

  describe("accessibility", () => {
    test("has no a11y violations", async () => {
      // ...
    });
  });
});
```

---

## Test Coverage Guidelines

**What to aim for:**

- **Statements**: 80%+ - Every line of code executed
- **Branches**: 75%+ - All if/else paths tested
- **Functions**: 80%+ - All functions called
- **Lines**: 80%+ - Similar to statements

**When to write more tests:**

- Critical user flows (auth, checkout, data entry)
- Complex business logic
- Error handling paths
- Accessibility features
- Security-sensitive code

**When fewer tests are okay:**

- Simple presentational components
- Third-party library wrappers
- Configuration files
- Type definitions

---

## Running Tests

### Local Development

```bash
# Run all tests
npm test

# Run in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test UserProfile.test.jsx

# Run tests matching pattern
npm test -- --testNamePattern="user login"
```

### CI/CD Integration

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: npm test -- --coverage --ci

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

---

## Quick Reference

### Essential Testing Library Queries

```javascript
// By Role (PREFERRED)
screen.getByRole("button", { name: /submit/i });
screen.getByRole("heading", { level: 1 });
screen.getByRole("textbox", { name: /email/i });

// By Label Text
screen.getByLabelText(/email/i);

// By Text Content
screen.getByText(/welcome back/i);

// Async Queries (wait for element)
await screen.findByText(/loading complete/i);

// Query for absence
expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
```

### Common User Events

```javascript
const user = userEvent.setup();

await user.click(element);
await user.dblClick(element);
await user.type(input, "text");
await user.clear(input);
await user.selectOptions(select, "value");
await user.tab();
await user.keyboard("{Enter}");
await user.keyboard("{Escape}");
await user.hover(element);
await user.upload(input, file);
```

### Assertions

```javascript
// Presence
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();

// Visibility
expect(element).toBeVisible();
expect(element).not.toBeVisible();

// Disabled/Enabled
expect(button).toBeDisabled();
expect(button).toBeEnabled();

// Form Elements
expect(input).toHaveValue("text");
expect(checkbox).toBeChecked();
expect(option).toBeSelected();

// Attributes
expect(link).toHaveAttribute("href", "/about");
expect(element).toHaveClass("active");

// Text Content
expect(element).toHaveTextContent("Hello");

// Functions
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
expect(mockFn).toHaveBeenCalledTimes(3);
```

---

## Summary

**Key Principles:**

1. **Test behavior, not implementation** - What users see and do
2. **Use accessible queries** - getByRole, getByLabelText preferred
3. **Handle async properly** - await findBy, waitFor, waitForElementToBeRemoved
4. **Keep tests focused** - One concept per test
5. **Mock external dependencies** - APIs, timers, modules
6. **Test edge cases** - Empty, error, loading states
7. **Make tests readable** - Clear names, good structure, comments when needed

**Remember**: The goal is confidence that your code works correctly for users. Write tests that would catch real bugs, not just increase coverage numbers.

Need help generating tests for a specific component? Provide the code and I'll create comprehensive tests following these patterns! 🧪

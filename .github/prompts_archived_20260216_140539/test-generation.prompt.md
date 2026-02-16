---
name: Test Generation
description: Generate tests for components, functions, and features
agent: testing-specialist
tools: ["readonly"]
---

# Test Generation

Generate comprehensive, maintainable tests for JavaScript/TypeScript code, React components, and application features.

## Test Framework Detection

Automatically detect and use the project's existing testing framework:

- **Vitest**: Modern, Vite-native test framework
- **Jest**: Industry standard JavaScript testing
- **Testing Library**: React/DOM component testing
- **Playwright/Cypress**: E2E testing (if configured)

Check package.json and existing test files to match patterns.

## Analysis Workflow

1. Detect testing framework from package.json and config files
2. Review the code to be tested (component, function, module)
3. Identify test scenarios and edge cases
4. Generate test structure matching project patterns
5. Include accessibility tests for UI components
6. Provide instructions to run tests

## Test Coverage Goals

Focus on **meaningful coverage**, not just percentage:

1. **Happy Path**: Core functionality works as expected
2. **Edge Cases**: Boundary conditions, empty states, errors
3. **User Interactions**: Click, type, submit, navigate
4. **Accessibility**: Keyboard navigation, ARIA, screen readers
5. **Error Handling**: Graceful failures, error messages
6. **Integration**: Component interactions, API calls

## Component Test Pattern

```javascript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("renders with required props", () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles user interaction", async () => {
    const user = userEvent.setup();
    const onClickMock = vi.fn();

    render(<MyComponent onClick={onClickMock} />);
    await user.click(screen.getByRole("button"));

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it("is keyboard accessible", async () => {
    const user = userEvent.setup();
    render(<MyComponent />);

    const button = screen.getByRole("button");
    button.focus();
    expect(button).toHaveFocus();

    await user.keyboard("{Enter}");
    // Assert expected behavior
  });
});
```

## Function Test Pattern

```javascript
import { describe, it, expect } from "vitest";
import { calculateTotal } from "./utils";

describe("calculateTotal", () => {
  it("calculates sum of positive numbers", () => {
    expect(calculateTotal([1, 2, 3])).toBe(6);
  });

  it("handles empty array", () => {
    expect(calculateTotal([])).toBe(0);
  });

  it("handles negative numbers", () => {
    expect(calculateTotal([-1, -2, -3])).toBe(-6);
  });

  it("rounds to two decimal places", () => {
    expect(calculateTotal([1.111, 2.222])).toBe(3.33);
  });
});
```

## Test Principles

1. **Arrange-Act-Assert**: Clear test structure
2. **Test Behavior, Not Implementation**: Focus on user-visible outcomes
3. **One Assertion Per Test**: Makes failures easier to debug
4. **Descriptive Test Names**: "it should X when Y" or "it handles Z"
5. **No Test Interdependence**: Each test should run independently
6. **Query by Accessibility**: Use `getByRole`, `getByLabelText` over `getByTestId`

## Output Format

Provide generated tests with:

1. **Test File Name**: Matching project convention (`.test.js`, `.spec.js`)
2. **Import Statements**: Correct framework and testing library imports
3. **Test Suite**: Complete `describe` block with all test cases
4. **Coverage Summary**: What scenarios are tested
5. **Run Command**: How to execute the tests
6. **Missing Coverage**: Suggestions for additional tests

Tests should be ready to run without modification.

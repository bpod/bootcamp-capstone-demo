---
name: Debug Session
description: Interactive debugging assistance for errors and issues
agent: agent
tools: ["readonly"]
---

# Debug Session

Interactive debugging session to diagnose and resolve errors, unexpected behavior, or bugs.

## Debugging Workflow

1. **Understand the Problem**: What's the expected vs actual behavior?
2. **Gather Context**: Error messages, stack traces, reproduction steps
3. **Form Hypotheses**: Possible causes based on symptoms
4. **Test Hypotheses**: Suggest debugging steps to narrow down the issue
5. **Identify Root Cause**: Find the actual source of the problem
6. **Propose Fix**: Provide solution with explanation

## Information Needed

To debug effectively, provide:

- **Error Message**: Full error text and stack trace
- **Reproduction Steps**: How to trigger the issue
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Browser, Node version, dependencies
- **Recent Changes**: What was modified before the issue appeared

## Debugging Techniques

**Console Logging:**

```javascript
console.log("Debug point 1:", variable);
console.table(arrayOfObjects);
console.trace("Execution path");
```

**Breakpoint Suggestions:**

```javascript
debugger; // Pause execution here
```

**Error Boundaries (React):**

```jsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error("Caught error:", error, errorInfo);
  }
}
```

**Network Inspection:**

- Check Network tab for failed requests
- Verify request/response payloads
- Check for CORS errors

## Common Issue Patterns

**Async Timing Issues:**

- Race conditions
- Unhandled promise rejections
- State updates after unmount

**State Management:**

- Stale closures
- Incorrect dependency arrays
- State mutation vs immutable updates

**Type Errors:**

- Undefined is not a function
- Cannot read property of undefined
- Type mismatches

## Output Format

Provide debugging guidance:

1. **Diagnosis**: What's likely causing the issue
2. **Debugging Steps**: How to confirm the diagnosis
3. **Solution**: Fix with code example
4. **Prevention**: How to avoid this in the future
5. **Testing**: How to verify the fix works

Work interactively - ask clarifying questions as needed.

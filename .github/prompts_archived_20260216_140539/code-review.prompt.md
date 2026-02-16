---
name: Code Review
description: Comprehensive code quality and best practices review
agent: frontend-developer
tools: ["readonly"]
---

# Code Review

Conduct a comprehensive code review focusing on quality, maintainability, performance, and best practices for frontend code.

## Review Areas

1. **Code Quality**: Readability, naming, structure
2. **Best Practices**: Language and framework patterns
3. **Performance**: Efficiency and optimization opportunities
4. **Security**: Common vulnerabilities and risks
5. **Maintainability**: Documentation, complexity, testability
6. **Accessibility**: If UI code, check a11y compliance

## Analysis Workflow

1. Understand the code's purpose and context
2. Review code structure and organization
3. Check for anti-patterns and code smells
4. Evaluate performance implications
5. Assess security considerations
6. Review error handling and edge cases
7. Provide actionable recommendations

## Code Quality Checklist

**Readability:**

- [ ] Clear, descriptive variable and function names
- [ ] Consistent formatting and style
- [ ] Appropriate comments for complex logic
- [ ] No dead code or commented-out blocks
- [ ] Logical code organization and file structure

**Best Practices:**

- [ ] DRY (Don't Repeat Yourself) principle followed
- [ ] Single Responsibility Principle for functions/components
- [ ] Proper error handling and edge cases
- [ ] TypeScript types are meaningful (not `any`)
- [ ] No console.log statements in production code

**Performance:**

- [ ] Efficient algorithms and data structures
- [ ] No performance anti-patterns (N+1 queries, etc.)
- [ ] Appropriate use of memoization/caching
- [ ] Bundle size considerations for imports

**Security:**

- [ ] No hardcoded credentials or sensitive data
- [ ] Proper input validation and sanitization
- [ ] XSS prevention in rendered content
- [ ] CSRF protection for state-changing operations

**Maintainability:**

- [ ] Functions are small and focused (< 30 lines ideal)
- [ ] Appropriate abstraction levels
- [ ] Clear dependencies and imports
- [ ] Tests exist or are easy to add

## Common Code Smells

**Long Functions:**

```javascript
// ❌ Bad - too many responsibilities
function processUserData(user) {
  // 100+ lines of logic
}

// ✅ Good - broken into focused functions
function processUserData(user) {
  const validated = validateUser(user);
  const normalized = normalizeData(validated);
  return transformForDisplay(normalized);
}
```

**Magic Numbers:**

```javascript
// ❌ Bad - unclear what 86400000 means
setTimeout(cleanup, 86400000);

// ✅ Good - named constant
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
setTimeout(cleanup, ONE_DAY_MS);
```

**Deeply Nested Code:**

```javascript
// ❌ Bad - hard to follow
if (user) {
  if (user.isActive) {
    if (user.hasPermission) {
      // do something
    }
  }
}

// ✅ Good - early returns
if (!user) return;
if (!user.isActive) return;
if (!user.hasPermission) return;
// do something
```

**Unclear Naming:**

```javascript
// ❌ Bad - vague names
function process(d) {
  const temp = d.map((x) => x.val);
  return temp.filter((y) => y > 0);
}

// ✅ Good - descriptive names
function getPositiveValues(items) {
  const values = items.map((item) => item.value);
  return values.filter((value) => value > 0);
}
```

## Output Format

Provide structured feedback:

1. **Overview**: Brief summary of code purpose and overall quality
2. **Strengths**: What the code does well
3. **Issues**: Categorized by severity
   - 🔴 Critical: Must fix (security, bugs)
   - 🟡 High: Should fix (performance, maintainability)
   - 🔵 Medium: Nice to fix (style, minor improvements)
   - ⚪ Low: Optional suggestions
4. **Recommendations**: Specific changes with code examples
5. **Priority**: Suggested order for addressing issues

Focus on the highest-impact improvements first.

---
name: React Component Review
description: Review React components for best practices and patterns
agent: frontend-developer
tools: ["react-dev", "readonly"]
---

# React Component Review

Analyze React components for best practices, performance patterns, and code quality based on industry standards.

## Review Areas

1. **Component Design**: Single responsibility, proper composition, reusability
2. **Hooks Usage**: Correct hook patterns, custom hooks for reusable logic
3. **Performance**: Unnecessary re-renders, memoization opportunities (when profiled)
4. **State Management**: Appropriate state location, context usage, prop drilling
5. **Props/Types**: Clear interfaces, proper TypeScript types or PropTypes
6. **Code Quality**: Naming conventions, consistent patterns, readability

## Analysis Workflow

1. Identify component type and purpose
2. Review component structure and organization
3. Analyze hook dependencies and effects
4. Check for common anti-patterns
5. Evaluate performance considerations
6. Suggest specific improvements with rationale

## React Best Practices Checked

**Component Patterns:**

- Functional components with hooks (not class components)
- Clear component boundaries and responsibilities
- Composition over complexity
- Early returns for conditional rendering

**Performance:**

- Avoid inline function definitions in frequently re-rendered components
- Use `React.memo()` for expensive pure components (with profiling)
- Implement code splitting with `React.lazy()` and `Suspense`
- Optimize `useMemo` and `useCallback` usage (when measured)

**Code Quality:**

- PascalCase for components, camelCase for functions
- Meaningful variable and function names
- Consistent file structure and exports
- Proper error boundaries

## Output Format

Provide structured feedback:

1. **Strengths**: What the component does well
2. **Issues Found**: Categorized by severity (Critical/High/Medium/Low)
3. **Specific Recommendations**: Code examples showing improvements
4. **Performance Impact**: Expected benefits of suggested changes
5. **Priority**: Order recommendations by impact

Reference Vercel's React Best Practices for authoritative patterns.

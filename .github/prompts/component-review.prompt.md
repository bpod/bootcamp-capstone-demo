---
description: "Review React component for best practices"
agent: frontend-developer
tools: ["codebase", "search", "fetch", "usages", "problems"]
---

Analyze the selected React component for best practices, performance, and maintainability.

Check for:

- Component structure (functional components, single responsibility, clear props)
- Performance issues (unnecessary re-renders, missing memoization)
- State management (local state, proper useState/useReducer usage)
- Effects (correct dependencies, cleanup functions)
- Accessibility (semantic HTML, keyboard navigation, ARIA)
- Code quality (no prop drilling, clear naming)

Provide an overall assessment (Good/Needs Improvement/Refactor), then list specific issues with line numbers and before/after code examples. Rank by priority.

Reference: https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices

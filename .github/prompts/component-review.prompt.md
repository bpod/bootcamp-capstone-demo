---
description: "Quick React component scan"
agent: frontend-developer
tools: ["codebase", "search"]
---

Analyze ONLY the selected React component for top 3 issues using Vercel best practices.

Reference: https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices

**Fast checks:**

- Data fetching waterfalls (serial vs parallel) → Critical
- Missing `React.memo`/`useMemo`/`useCallback` causing re-renders → Critical
- Effect dependency issues (missing deps, infinite loops) → Critical
- Prop drilling > 3 levels → High
- Non-semantic HTML (`<div onClick>` vs `<button>`) → High
- Inline functions in frequently rendered JSX → Medium

**Output:**

```
1. [Priority] Issue (Line X)
   Fix: <code>
   Impact: [rendering/bundle/UX]

2-3. [Next issues]...
```

**Constraint: 200 words max. Top 3 only.**

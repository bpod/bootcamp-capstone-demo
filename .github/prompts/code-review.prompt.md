---
description: "Quick code quality review"
agent: frontend-developer
tools: ["codebase", "search"]
---

Review ONLY selected code for top 3 quality/security issues. Adapt to detected framework.

**Fast checks:**

- Security: Hardcoded secrets, XSS via innerHTML, no input validation
- Quality: Long functions (>50 lines), poor naming, code duplication
- Performance: Inefficient loops, blocking operations, memory leaks
- Testing: Untestable code, missing error handling

**Output:**

```
1. [Critical/Important/Suggestion] Issue (Line X)
   Fix: <brief code>

2-3. [Next issues]...

✅ What's done well: [1 positive note]
```

**Constraint: 200 words max. Top 3 only.**

---
description: "Quick accessibility scan of selected code"
agent: accessibility-expert
tools: ["codebase", "search"]
---

Scan ONLY the selected/visible code for the top 3 accessibility violations.

**Priority checks:**

- Form inputs missing `<label for="">` → WCAG 3.3.2 (-10 pts)
- Text contrast < 4.5:1 (check #666, #888, #999) → WCAG 1.4.3 (-10 pts)
- Images missing `alt` → WCAG 1.1.1 (-10 pts)
- Buttons/links without accessible names → WCAG 4.1.2 (-8 pts)
- Missing focus styles (`outline: none`) → WCAG 2.4.7 (-5 pts)

**Output (keep concise):**

```
1. [Issue] WCAG X.X.X (Line Y)
   Fix: <code>
   Impact: +X pts

2-3. [Next issues]...
```

**Constraint: Max 250 words. Top 3 only. No long explanations.**

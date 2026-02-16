---
description: "Quick Lighthouse scan of selected code"
agent: performance-tuner
tools: ["codebase", "search"]
---

Analyze ONLY the selected/visible code for the top 3 highest-impact Lighthouse issues.

**Fast scan for:**

- Images without `width`/`height` or `alt` → CLS + A11y (-15 pts)
- Form inputs without `<label for="">` → A11y (-10 pts)
- Poor contrast (#666, #888, #999 on white) → A11y (-10 pts)
- Render-blocking `<link>` or `<script>` in `<head>` → Performance (-10 pts)
- Buttons without `type="button"` or accessible names → Best Practices (-5 pts)

**Output format (keep brief):**

```
1. [audit-id] Issue description (Line X)
   Fix: <code example>
   Impact: +X points

2. [next issue]...
```

Reference: https://github.com/addyosmani/web-quality-skills

**Constraint: Respond in under 300 words. Top 3 issues only.**

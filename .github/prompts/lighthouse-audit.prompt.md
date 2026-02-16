---
description: "Run Lighthouse performance and accessibility audit"
agent: performance-tuner
tools: ["codebase", "search", "fetch", "usages", "problems"]
---

Analyze the selected code or URL for web quality issues using Lighthouse standards.

Check for:

- Performance issues (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1)
- Accessibility violations (WCAG 2.1 Level AA)
- Best practices (HTTPS, console errors, deprecated APIs)
- SEO basics (meta tags, mobile-friendliness)

Provide the top 3-5 issues ranked by impact, with specific line numbers and fix suggestions. Include expected improvements for each fix.

Reference: https://github.com/addyosmani/web-quality-skills

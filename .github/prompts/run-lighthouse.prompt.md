---
description: "Execute Lighthouse CLI and analyze full audit report"
agent: performance-tuner
tools: ["codebase", "search", "terminal"]
---

Run the Lighthouse CLI against a URL and analyze the complete report.

**Command to run:**

```bash
npx lighthouse <url> --output json --output html --output-path ./reports/lighthouse-$(date +%Y%m%d-%H%M%S)
```

**Analyze the report for:**

**Performance (Target: 90+)**

- First Contentful Paint ≤ 1.8s
- Largest Contentful Paint ≤ 2.5s
- Total Blocking Time ≤ 200ms
- Cumulative Layout Shift ≤ 0.1
- Speed Index ≤ 3.4s

**Accessibility (Target: 100)**

- All 30+ automated WCAG 2.1 Level AA checks from web-quality-skills
- Color contrast, ARIA, labels, alt text, keyboard nav, focus management

**Best Practices (Target: 100)**

- HTTPS, no console errors, image aspect ratios, deprecated APIs

**SEO (Target: 100)**

- Meta descriptions, viewport, font sizes, tap targets, structured data

After audit completes (30-60 seconds), provide:

1. Score breakdown with before/after comparison
2. Top 5 failing audits by impact
3. Specific fixes with line numbers and code examples
4. Expected score improvements for each fix

Reference: https://github.com/addyosmani/web-quality-skills (150+ audit rules)

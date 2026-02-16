---
description: "Performance analysis and optimization suggestions"
agent: performance-tuner
tools: ["codebase", "search", "fetch", "usages", "problems"]
---

Analyze the selected code for performance issues and optimization opportunities.

Check for:

- Loading performance (bundle size, code splitting, lazy loading, asset optimization)
- Runtime performance (execution time, re-renders, memory leaks)
- Network performance (HTTP requests, API waterfalls, caching)
- Core Web Vitals (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1)

Detect the project's stack (Vite, Webpack, Next.js, React) and provide stack-specific recommendations.

List the top 3-5 optimization opportunities ranked by impact, with specific code examples and expected improvements (e.g., "Reduce bundle by ~30%"). Suggest measurement tools to validate changes.

Reference: https://github.com/addyosmani/web-quality-skills

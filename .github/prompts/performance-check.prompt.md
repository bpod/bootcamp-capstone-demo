---
description: "Quick Core Web Vitals check"
agent: performance-tuner
tools: ["codebase", "search"]
---

Scan ONLY selected code for top 3 performance issues affecting Core Web Vitals.

Reference: https://github.com/addyosmani/web-quality-skills

**Fast checks:**

- Images without `width`/`height` → CLS issue (-0.05-0.2 CLS)
- Render-blocking `<link>` or `<script>` in `<head>` → LCP (+500ms-1s)
- Large unoptimized images (not WebP, no lazy load) → LCP (+800ms)
- Heavy JS bundles (lodash, moment.js) → INP (+100ms)
- Missing resource hints (`preconnect`, `preload`) → LCP (+300ms)

**Output:**

```
1. [Issue] affects [LCP/INP/CLS] (Line X)
   Fix: <code>
   Impact: [quantified improvement]

2-3. [Next issues]...
```

**Constraint: 200 words. Top 3 only. No deep analysis.**

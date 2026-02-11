---
name: lighthouse-audit
description: Run comprehensive Lighthouse audit and get actionable optimization recommendations
---

Run a Lighthouse audit and provide prioritized optimization recommendations.

**Workflow:**

1. **Measure**: Run Lighthouse audit on ${input:url} or current development server
2. **Analyze**: Parse performance, accessibility, best practices, and SEO scores
3. **Prioritize**: Rank opportunities by impact (high/medium/low)
4. **Recommend**: Provide specific fixes referencing [Web Quality Skills](https://github.com/addyosmani/web-quality-skills)

**MCP Tool**: If available, use `lighthouse_audit` tool. Otherwise guide manual execution with:

```bash
lighthouse <url> --output=json --output=html
```

**Standards Reference**: All recommendations follow Lighthouse's 150+ audit patterns covering:

- Performance: Core Web Vitals, resource optimization, rendering
- Accessibility: WCAG 2.1 Level AA compliance
- SEO: Meta tags, structured data, crawlability
- Best Practices: Security, modern APIs, browser compatibility

Focus on top 3-5 highest-impact issues first. Provide code examples for each fix.

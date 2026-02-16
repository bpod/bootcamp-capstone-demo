---
description: Run comprehensive Lighthouse audit and get actionable optimization recommendations
agent: performance-tuner
tools: ["readonly", "web-quality"]
---

Run a Lighthouse audit on ${input:url} (or current development server) and provide prioritized optimization recommendations.

**Your Task**: Execute Lighthouse audit, analyze results across Performance, Accessibility, Best Practices, and SEO, then provide actionable fixes ranked by impact.

**Tool Usage**: Use `lighthouse_audit` MCP tool if available. Otherwise guide manual execution:

```bash
lighthouse <url> --output=json --output=html
```

**Analysis Focus**: Performance (Core Web Vitals: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1, resource optimization), Accessibility (WCAG 2.1 Level AA), Best Practices (security, modern APIs), SEO (meta tags, structured data).

**Output Requirements**: Prioritize top 3-5 highest-impact issues. For each: severity level, specific fix with code example, expected improvement, reference to [Web Quality Skills](https://github.com/addyosmani/web-quality-skills) audit.

**Success Criteria**: User can immediately implement fixes that improve Lighthouse scores by ≥10 points.

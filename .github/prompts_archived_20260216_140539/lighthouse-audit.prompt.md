---
name: Lighthouse Performance Audit
description: Run Lighthouse audit and analyze performance metrics
agent: performance-tuner
tools: ["web-quality", "readonly"]
---

# Lighthouse Performance Audit

Run a Lighthouse audit on the current project or specified URL and provide actionable recommendations.

## Analysis Steps

1. Identify target URL or local development server
2. Run Lighthouse audit for all categories
3. Parse results and identify top issues
4. Prioritize recommendations by impact
5. Provide specific, actionable fixes

## Focus Areas

- Performance score and Core Web Vitals (LCP, INP, CLS)
- Accessibility compliance (WCAG 2.1 Level AA)
- Best practices violations
- SEO opportunities
- Progressive Web App criteria

## Output Format

Provide a structured summary with:

1. Overall scores for each category
2. Top 3-5 highest-impact issues
3. Specific recommendations with code examples
4. Estimated improvement potential
5. Next steps for validation

Prioritize changes that improve multiple categories simultaneously.

---
name: Performance Optimization
description: Analyze and optimize web performance issues
agent: performance-tuner
tools: ["web-quality", "readonly"]
---

# Performance Optimization

Identify and resolve performance bottlenecks to improve Core Web Vitals and overall page speed.

## Optimization Targets

- **LCP (Largest Contentful Paint)**: ≤ 2.5 seconds
- **INP (Interaction to Next Paint)**: ≤ 200 milliseconds
- **CLS (Cumulative Layout Shift)**: ≤ 0.1

## Analysis Areas

1. **Image Optimization**: Format, sizing, lazy loading
2. **JavaScript Bundles**: Code splitting, tree shaking, minification
3. **Render-Blocking Resources**: Critical CSS, async scripts
4. **Resource Hints**: Preload, prefetch, preconnect
5. **Caching Strategies**: Service workers, HTTP caching
6. **Third-Party Scripts**: Impact on load time

## Workflow

1. Establish baseline metrics (run Lighthouse)
2. Identify highest-impact issues
3. Propose specific optimizations with rationale
4. Provide implementation code
5. Estimate expected improvement
6. Suggest validation approach

## Output Format

For each optimization, provide:

1. Current issue and impact on metrics
2. Specific recommendation with code example
3. Expected performance gain
4. Implementation complexity (Low/Medium/High)
5. Trade-offs or considerations

Prioritize optimizations by impact vs effort ratio. Always measure before and after.

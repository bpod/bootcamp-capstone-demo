---
description: Guided performance optimization workflow using Measure-Optimize-Validate loop
agent: performance-tuner
tools: ["readonly", "web-quality"]
---

Guide systematic performance improvement for ${file} or ${input:url} following **Measure → Optimize → Validate** loop with ONE change at a time.

**Your Task**: Detect project stack (Vite/Webpack/Next.js from package.json), run Lighthouse baseline, identify highest-impact issue, implement single optimization, validate improvement, document and iterate.

**Workflow**: Measure baseline (Lighthouse: Performance score, LCP, INP, CLS, bundle size) → Identify top issue by impact (images > bundles > render-blocking > third-party) → Implement ONE change adapted to detected stack → Validate impact (re-run Lighthouse) → Verify no regressions (tests, manual check) → Commit and document → Repeat.

**Optimization Priorities by Impact**:

1. **Images** (40-60% page weight): Convert to WebP/AVIF, add responsive srcset, lazy load below-fold, explicit width/height for CLS
2. **JavaScript Bundles**: Code splitting (React.lazy, dynamic imports), remove unused deps (depcheck), tree shaking
3. **Render-Blocking**: Critical CSS extraction, async/defer scripts, resource hints (preload, preconnect)
4. **Third-Party Scripts**: Defer analytics, lazy load social widgets, use facades for embeds

**Stack-Specific Implementations**:

- **Vite**: vite-plugin-imagemin, vite-bundle-visualizer, import.meta.glob for splitting
- **Webpack**: image-webpack-loader, webpack-bundle-analyzer, webpackChunkName comments
- **Next.js**: next/image component, next/dynamic with ssr:false option, built-in bundle analyzer

**Example - Image Optimization**:

```jsx
// Before
<img src="/hero.jpg" alt="Hero" />

// After (React/Next.js)
<picture>
  <source srcset="/hero-480.webp 480w, /hero-1200.webp 1200w" type="image/webp" />
  <img src="/hero-1200.jpg" alt="Hero" width="1200" height="600" loading="eager" />
</picture>
```

**Example - Code Splitting (React)**:

```javascript
import { lazy, Suspense } from "react";
const HeavyChart = lazy(() => import("./HeavyChart"));

function Dashboard() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyChart />
    </Suspense>
  );
}
```

**Tools**: Use `lighthouse_audit` MCP tool if available, or guide: `lighthouse ${input:url} --output=json`. Analyze bundles: `npx vite-bundle-visualizer` (Vite) or `npx webpack-bundle-analyzer dist/stats.json` (Webpack).

**Validation Steps**: Re-run Lighthouse, compare before/after (LCP reduction 20-50%, bundle size -20-60%, +10-30 Performance score), test on Chrome DevTools Slow 3G, verify tests pass, check accessibility maintained.

**Web Quality Standards**: Follow [web-quality-skills](https://github.com/addyosmani/web-quality-skills). Target Core Web Vitals: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1, Performance score ≥90.

**Critical Rules**: Never optimize without baseline metrics. Only ONE change per cycle (isolate impact). Adapt to detected stack (Vite plugins ≠ Webpack loaders ≠ Next.js config). Verify no functional or accessibility regressions. Document findings in memory system.

**Success Criteria**: Baseline captured, single optimization implemented and validated with measurable improvement (quantified), no regressions, changes committed with descriptive message, ready for next iteration.

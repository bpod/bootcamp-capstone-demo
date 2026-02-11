---
name: performance-optimization
description: Guided performance optimization workflow using Measure-Optimize-Validate loop
---

Systematic performance improvement following **Measure-Optimize-Validate** loop.

**Workflow:**

1. **Detect**: Check project for build tool (Vite/Webpack/Next.js) and framework
2. **Measure**: Run Lighthouse audit to capture baseline (Performance score, LCP, INP, CLS, bundle size)
3. **Identify**: Prioritize by impact - Image optimization, bundle size, render-blocking resources, third-party code
4. **Optimize**: Implement ONE change incrementally
5. **Validate**: Re-run Lighthouse, compare metrics, verify no regressions
6. **Iterate**: Document findings, commit, move to next optimization

**MCP Tool**: If available, use `lighthouse_audit` tool.

**Standards Reference**: All optimizations follow [Web Quality Skills - Performance](https://github.com/addyosmani/web-quality-skills) patterns:

- Image Optimization: WebP/AVIF, responsive images, lazy loading
- Code Splitting: React.lazy, dynamic imports, route-based splitting
- Resource Hints: preload, preconnect, dns-prefetch
- Bundle Analysis: Remove unused deps, tree shaking
- Core Web Vitals: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1

**Adapt to Detected Stack**: Reference user's existing build tool (Vite plugins, Webpack loaders, Next.js config)

Implement one optimization at a time. Never optimize without measuring first.

```bash
# If production URL available
lighthouse ${input:url} --output=json --output-path=./baseline-report.json

# Or analyze build output
npm run build
ls -lh dist/ # or build/ depending on setup
```

**Capture baseline metrics:**

- Performance score (target: ≥ 90/100)
- LCP (target: ≤ 2.5s)
- INP (target: ≤ 200ms)
- CLS (target: ≤ 0.1)
- Total bundle size
- Largest resources

### Step 3: Identify Optimization Opportunities

**Analyze and prioritize by impact:**

**High Impact Optimizations:**

1. **Image Optimization** (often 40-60% of page weight)
   - Uncompressed images
   - Missing responsive images
   - No lazy loading below fold
   - Old formats (JPEG/PNG vs WebP/AVIF)

2. **JavaScript Bundle Size** (blocking rendering)
   - Large vendor bundles
   - Unused dependencies
   - No code splitting
   - Unminified production code

3. **Render-Blocking Resources** (delays FCP/LCP)
   - Synchronous CSS/JS in `<head>`
   - No critical CSS extraction
   - Missing resource hints

4. **Third-Party Code** (uncontrollable delays)
   - Analytics scripts blocking main thread
   - Social media widgets
   - Ads and tracking pixels

**Medium Impact Optimizations:** 5. Font loading strategies 6. Service worker caching 7. Preload/prefetch critical resources 8. Tree shaking unused code

**Low Impact (Do Last):** 9. Minify HTML 10. Inline critical CSS 11. HTTP/2 push

### Step 4: Implement Optimizations (Pick One)

**Choose highest-impact issue** and implement incrementally.

#### Optimization: Image Optimization

**If images are largest resources:**

```javascript
// Detect image usage in project
```

**Recommended actions:**

1. Convert to WebP/AVIF formats
2. Add responsive `srcset` with multiple sizes
3. Implement lazy loading for below-fold images
4. Add explicit `width` and `height` to prevent CLS
5. Use `loading="eager"` for above-fold hero images

**Example implementation:**

```jsx
// Before: Unoptimized image
<img src="/hero.jpg" alt="Hero" />

// After: Optimized with responsive loading
<picture>
  <source
    srcset="/hero-480.webp 480w, /hero-768.webp 768w, /hero-1200.webp 1200w"
    type="image/webp"
  />
  <source
    srcset="/hero-480.jpg 480w, /hero-768.jpg 768w, /hero-1200.jpg 1200w"
    type="image/jpeg"
  />
  <img
    src="/hero-1200.jpg"
    alt="Hero"
    width="1200"
    height="600"
    loading="eager"
    fetchpriority="high"
  />
</picture>
```

**Build tool integration:**

Detect build tool and provide appropriate plugin:

- **Vite**: Use `vite-plugin-imagemin` or `vite-imagetools`
- **Webpack**: Use `image-webpack-loader` or `next/image` (Next.js)
- **Astro**: Built-in `<Image>` component
- **Manual**: Use `sharp` or `imagemagick` pre-processing

#### Optimization: Code Splitting

**For large JavaScript bundles:**

Check framework and provide appropriate approach:

**React (Vite/Webpack):**

```javascript
import { lazy, Suspense } from "react";

// Split heavy component
const HeavyChart = lazy(() => import("./HeavyChart"));

function Dashboard() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyChart />
    </Suspense>
  );
}
```

**Next.js:**

```javascript
import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("./HeavyChart"), {
  loading: () => <LoadingSpinner />,
  ssr: false, // if client-only
});
```

**Vue:**

```javascript
const HeavyChart = defineAsyncComponent(() => import("./HeavyChart.vue"));
```

#### Optimization: Remove Unused Dependencies

**Analyze bundle:**

```bash
# Vite
npx vite-bundle-visualizer

# Webpack
npx webpack-bundle-analyzer dist/stats.json

# Next.js
npm run build -- --analyze
```

**Find and remove unused packages:**

```bash
npx depcheck
npm uninstall [unused-package]
```

#### Optimization: Resource Hints

**Add to `<head>` in main HTML/layout:**

```html
<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="dns-prefetch" href="https://analytics.example.com" />

<!-- Preload critical resources -->
<link
  rel="preload"
  href="/fonts/inter.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
<link rel="preload" href="/hero.webp" as="image" />

<!-- Prefetch next-page resources (low priority) -->
<link rel="prefetch" href="/about.js" />
```

### Step 5: Validate Impact

**Re-run performance audit:**

```bash
lighthouse ${input:url} --output=json --output-path=./optimized-report.json
npm run build
```

**Compare metrics:**

```bash
# Compare bundle sizes
echo "Before: [baseline size]"
echo "After: [new size]"
echo "Savings: [percentage]%"

# Compare Lighthouse scores
```

**Expected improvements:**

- LCP: Reduced by 20-50% (image/bundle optimizations)
- Performance score: +10-30 points
- Bundle size: -20-60% (code splitting, unused deps)
- INP: Improved with smaller JS bundles

### Step 6: Verify No Regressions

**Check functionality:**

- Manual browser test on slow network (Chrome DevTools → Network → Slow 3G)
- Verify images load correctly (WebP fallbacks work)
- Test code-split components lazy load properly
- Ensure accessibility maintained (no missing alt text, focus management intact)

**Run automated tests:**

```bash
# Run existing test suite
npm test
```

### Step 7: Document and Iterate

**Document in memory system:**

- Update `.github/memory/scratch/working-notes.md` with findings
- Note what optimization was applied and impact
- Record any trade-offs or edge cases

**Move to next optimization:**

- Commit working changes
- Re-run this prompt for next issue
- Continue Measure-Optimize-Validate loop

## Variables

- `${input:url}` - URL to optimize (optional, will prompt if not provided)
- `${workspaceFolder}` - Project root directory

## Success Criteria

✅ Baseline performance metrics captured  
✅ Highest-impact optimization identified  
✅ Implementation adapted to project's build tool/framework  
✅ Measurable improvement achieved and validated  
✅ No functionality or accessibility regressions  
✅ Changes committed and documented

## Example Usage

**Start optimization workflow:**

```
@workspace /performance-optimization https://my-app.com
```

**Or for local build:**

```
@workspace /performance-optimization
> Enter URL or 'local': local
```

## Optimization Checklist

After completing each optimization:

- [ ] Baseline metrics captured
- [ ] Optimization implemented incrementally
- [ ] Build still successful
- [ ] Tests still pass
- [ ] Performance improvement validated (Lighthouse re-run)
- [ ] Manual testing on slow network
- [ ] Accessibility maintained
- [ ] Changes committed with descriptive message
- [ ] Findings documented in memory system

## Common Pitfalls

**❌ Avoid:**

- Optimizing without measuring first
- Implementing multiple changes at once (can't isolate impact)
- Sacrificing accessibility for performance
- Breaking functionality for marginal gains
- Over-optimizing low-impact areas

**✅ Do:**

- Measure before and after each change
- Make one optimization at a time
- Test on real devices and slow networks
- Prioritize by effort vs impact
- Document findings for future reference

## Related Prompts

- [lighthouse-audit.prompt.md](lighthouse-audit.prompt.md) - Full Lighthouse audit
- [core-web-vitals.prompt.md](core-web-vitals.prompt.md) - Focus on CWV metrics
- [image-optimization.prompt.md](image-optimization.prompt.md) - Detailed image optimization
- [bundle-analysis.prompt.md](bundle-analysis.prompt.md) - JavaScript bundle optimization

## References

- [Web Performance Guidelines](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Testing Guidelines](../../docs/testing-guidelines.md)
- [Project Overview](../../docs/project-overview.md)

---

**Remember**: Performance optimization is iterative. Complete one optimization, validate impact, then move to the next. Quality over speed.

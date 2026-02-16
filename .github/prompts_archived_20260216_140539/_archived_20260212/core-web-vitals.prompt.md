---
description: Check and optimize Core Web Vitals (LCP, INP, CLS) to meet thresholds
agent: performance-tuner
tools: ["readonly", "web-quality"]
---

Analyze and optimize Core Web Vitals for ${input:url} or current project to achieve: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1.

**Your Task**: Measure current Core Web Vitals, identify bottlenecks for failing metrics, provide targeted fixes to meet "Good" thresholds (75th percentile).

**Measurement**: Use `analyze_performance` MCP tool if available. Otherwise guide field data collection with web-vitals library or Lighthouse.

**Optimization by Metric**:

**LCP (Largest Contentful Paint) ≤2.5s**: Targets largest visible element (hero image, text block). Fixes: Preload critical images (`<link rel="preload" as="image">`), use WebP/AVIF format, implement CDN, optimize server TTFB, inline critical CSS, add `fetchpriority="high"` to LCP image, remove render-blocking resources.

**INP (Interaction to Next Paint) ≤200ms**: Measures interaction responsiveness. Fixes: Code-split JavaScript bundles, debounce expensive event handlers, use `requestIdleCallback` for non-critical work, optimize React re-renders with `useMemo`/`React.memo`, move heavy computations to Web Workers, defer third-party scripts.

**CLS (Cumulative Layout Shift) ≤0.1**: Prevents unexpected layout shifts. Fixes: Set explicit width/height on all images and videos, reserve space for ads and embeds with min-height, avoid inserting content above existing content, use `aspect-ratio` CSS property, preload fonts with `font-display: swap`, set dimensions on iframes.

**Strategy**: Focus on worst metric first - it determines overall pass/fail. Provide before/after code examples. Reference [Web Quality Skills - Core Web Vitals](https://github.com/addyosmani/web-quality-skills) for detailed patterns.

**Success Criteria**: All three metrics achieve "Good" thresholds (green in Lighthouse/PageSpeed Insights). Explain user experience impact of each fix.

```html
<script type="module">
  import { onLCP, onINP, onCLS } from "https://unpkg.com/web-vitals@3?module";

  onLCP(console.log); // Logs LCP metric
  onINP(console.log); // Logs INP metric
  onCLS(console.log); // Logs CLS metric
</script>
```

**Analyze results:**

- Which metrics are failing?
- What are the current values?
- How far from thresholds?

### Step 2: Optimize LCP (Largest Contentful Paint)

**If LCP > 2.5s:**

**Identify LCP element:**

- Usually hero image, video, or large text block
- Check Lighthouse report "Largest Contentful Paint element"

**Common causes and fixes:**

**1. Large image file size**

```bash
# Check image sizes
ls -lh public/images/*.{jpg,png} | sort -rh
```

**Fix:**

- Convert to WebP/AVIF (60-80% smaller)
- Add responsive srcset with multiple sizes
- Use `loading="eager"` and `fetchpriority="high"` for LCP image

```html
<!-- Optimize LCP hero image -->
<img
  src="/hero.webp"
  srcset="/hero-480.webp 480w, /hero-768.webp 768w, /hero-1200.webp 1200w"
  sizes="100vw"
  alt="Hero image"
  width="1200"
  height="600"
  loading="eager"
  fetchpriority="high"
/>
```

**2. Render-blocking resources**

Check for CSS/JS blocking LCP element:

```html
<!-- ❌ Blocks rendering -->
<link rel="stylesheet" href="/styles.css" />
<script src="/app.js"></script>

<!-- ✅ Non-blocking -->
<link
  rel="stylesheet"
  href="/styles.css"
  media="print"
  onload="this.media='all'"
/>
<script src="/app.js" defer></script>
```

**3. Slow server response (TTFB)**

If Time to First Byte > 600ms:

- Use CDN for static assets
- Enable server-side caching
- Optimize database queries
- Consider edge rendering (Vercel, Cloudflare)

**4. Client-side rendering delay**

For React/Vue/Angular apps with slow FCP:

- Use SSR (Next.js, Nuxt, etc.)
- Implement critical CSS
- Reduce JavaScript bundle size
- Use streaming SSR

**Expected impact:** LCP reduced by 30-60%

---

### Step 3: Optimize INP (Interaction to Next Paint)

**If INP > 200ms:**

**INP measures responsiveness** - time from user interaction (click, tap, keypress) to visual feedback.

**Common causes and fixes:**

**1. Long JavaScript tasks (blocking main thread)**

```bash
# Check bundle size
npm run build
ls -lh dist/*.js | head -5
```

**Fix:** Code splitting and lazy loading

Detect framework and provide appropriate solution:

**React:**

```javascript
import { lazy, Suspense } from "react";

// Split heavy components
const Dashboard = lazy(() => import("./Dashboard"));

<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>;
```

**Next.js:**

```javascript
import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("./Dashboard"), {
  loading: () => <Spinner />,
});
```

**2. Inefficient event handlers**

```javascript
// ❌ Heavy computation on every keystroke
const handleInput = (e) => {
  const results = expensiveFilter(largeArray, e.target.value);
  setResults(results);
};

// ✅ Debounce expensive operations
import { debounce } from "lodash-es"; // or lightweight alternative

const handleInput = debounce((e) => {
  const results = expensiveFilter(largeArray, e.target.value);
  setResults(results);
}, 300);
```

**3. Unnecessary re-renders (React)**

```javascript
// ❌ Inline functions cause re-renders
<button onClick={() => handleClick(item.id)}>Click</button>;

// ✅ Memoize callbacks
const handleClick = useCallback((id) => {
  // Handle click
}, []);

<button onClick={() => handleClick(item.id)}>Click</button>;
```

**4. Third-party scripts blocking interactions**

```html
<!-- ❌ Blocking analytics script -->
<script src="https://analytics.example.com/tracker.js"></script>

<!-- ✅ Defer non-critical scripts -->
<script src="https://analytics.example.com/tracker.js" defer></script>
```

**Expected impact:** INP reduced by 40-70%

---

### Step 4: Optimize CLS (Cumulative Layout Shift)

**If CLS > 0.1:**

**CLS measures visual stability** - unexpected layout shifts during page load.

**Common causes and fixes:**

**1. Images without dimensions**

```html
<!-- ❌ Causes layout shift when image loads -->
<img src="/photo.jpg" alt="Photo" />

<!-- ✅ Reserves space, prevents shift -->
<img src="/photo.jpg" alt="Photo" width="800" height="600" />
```

**For responsive images:**

```css
/* Use aspect-ratio to prevent shifts */
img {
  aspect-ratio: 16 / 9;
  width: 100%;
  height: auto;
}
```

**2. Web fonts causing FOIT/FOUT**

```css
/* ❌ Font swap causes layout shift */
@font-face {
  font-family: "CustomFont";
  src: url("/fonts/custom.woff2");
}

/* ✅ Preload and use font-display: optional */
```

```html
<link
  rel="preload"
  href="/fonts/custom.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

```css
@font-face {
  font-family: "CustomFont";
  src: url("/fonts/custom.woff2");
  font-display: optional; /* Uses fallback if not loaded quickly */
}
```

**3. Ads/embeds without reserved space**

```html
<!-- ❌ Ad loads → pushes content down -->
<div id="ad-slot"></div>

<!-- ✅ Reserve space with min-height -->
<div id="ad-slot" style="min-height: 250px;"></div>
```

**4. Dynamic content insertion**

```javascript
// ❌ Inserting banner pushes content
document.body.insertBefore(banner, document.body.firstChild);

// ✅ Use transform instead of inserting in flow
banner.style.position = "fixed";
banner.style.top = "0";
banner.style.transform = "translateY(0)";
```

**Expected impact:** CLS reduced to < 0.1

---

### Step 5: Validate Improvements

**Re-run Lighthouse:**

```bash
lighthouse ${input:url} --output=json --output-path=./cwv-optimized.json --only-categories=performance
```

**Compare metrics:**

```
Before → After:
- LCP: [X]s → [Y]s (target: ≤ 2.5s) [✅/❌]
- INP: [X]ms → [Y]ms (target: ≤ 200ms) [✅/❌]
- CLS: [X] → [Y] (target: ≤ 0.1) [✅/❌]
```

**Real User Monitoring (RUM):**

For production validation, implement web-vitals tracking:

```javascript
// Install: npm install web-vitals
import { onLCP, onINP, onCLS } from "web-vitals";

function sendToAnalytics(metric) {
  // Send to your analytics endpoint
  fetch("/analytics", {
    method: "POST",
    body: JSON.stringify(metric),
  });
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
```

### Step 6: Monitor and Maintain

**Set up ongoing monitoring:**

1. **Google Search Console** - Core Web Vitals report
2. **PageSpeed Insights** - Field data (real users)
3. **Lighthouse CI** - Catch regressions in CI/CD
4. **Custom RUM** - Track your specific metrics

**Performance budget:**

Create budget file for CI:

```json
// lighthouse-budget.json
{
  "performance": [
    {
      "timings": [
        { "metric": "largest-contentful-paint", "budget": 2500 },
        { "metric": "cumulative-layout-shift", "budget": 0.1 },
        { "metric": "total-blocking-time", "budget": 200 }
      ]
    }
  ]
}
```

```bash
# In CI pipeline
lighthouse ${url} --budget-path=lighthouse-budget.json
```

## Variables

- `${input:url}` - URL to audit and optimize

## Success Criteria

✅ All three Core Web Vitals meet "good" thresholds:

- LCP ≤ 2.5s
- INP ≤ 200ms
- CLS ≤ 0.1  
  ✅ Improvements validated with Lighthouse  
  ✅ No functionality regressions  
  ✅ Monitoring implemented for ongoing validation

## Example Usage

```
@workspace /core-web-vitals https://my-app.com
```

## Quick Reference

| Metric  | Threshold | Primary Fixes                                                                   |
| ------- | --------- | ------------------------------------------------------------------------------- |
| **LCP** | ≤ 2.5s    | Optimize images, remove render-blocking resources, improve TTFB                 |
| **INP** | ≤ 200ms   | Code splitting, debounce handlers, reduce JS execution time                     |
| **CLS** | ≤ 0.1     | Add image dimensions, font-display: optional, reserve space for dynamic content |

## Related Prompts

- [performance-optimization.prompt.md](performance-optimization.prompt.md) - General performance workflow
- [lighthouse-audit.prompt.md](lighthouse-audit.prompt.md) - Full Lighthouse audit
- [image-optimization.prompt.md](image-optimization.prompt.md) - Image-specific optimizations

## References

- [Core Web Vitals Guide](https://web.dev/vitals/)
- [LCP Optimization](https://web.dev/optimize-lcp/)
- [INP Optimization](https://web.dev/optimize-inp/)
- [CLS Optimization](https://web.dev/optimize-cls/)
- [web-vitals Library](https://github.com/GoogleChrome/web-vitals)

---

**Focus on the worst-performing metric first** - the weakest link determines your overall Core Web Vitals score.

---
description: "Analyze and optimize JavaScript bundle size - code splitting, tree shaking, lazy loading"
---

# JavaScript Bundle Optimization Workflow

Reduce JavaScript bundle sizes to improve load times, Time to Interactive (TTI), and overall performance. This workflow detects your build tool and provides targeted optimization strategies.

## Bundle Size Impact on Performance

**Time to Interactive (TTI)**:

- Large bundles delay interactivity
- Target: TTI ≤ 3.8 seconds on mobile
- Every 100KB of JS adds ~1 second to TTI

**First Contentful Paint (FCP)**:

- Render-blocking JavaScript delays FCP
- Defer non-critical scripts
- Target: FCP ≤ 1.8 seconds

**Core Web Vitals**:

- INP (Interaction to Next Paint): Heavy JS execution blocks interactions
- FID (First Input Delay): Large bundles delay input response
- Smaller bundles = faster, more responsive apps

---

## 1. Detect Build Tool & Analyze Current Bundle

### Detect Build Configuration

```bash
# Check for build tool
if [ -f "vite.config.js" ] || [ -f "vite.config.ts" ]; then
  echo "Build Tool: Vite"
  BUILD_TOOL="vite"
elif [ -f "webpack.config.js" ] || grep -q "webpack" package.json; then
  echo "Build Tool: Webpack"
  BUILD_TOOL="webpack"
elif [ -f "next.config.js" ]; then
  echo "Build Tool: Next.js (Webpack/Turbopack)"
  BUILD_TOOL="nextjs"
elif grep -q "\"astro\"" package.json; then
  echo "Build Tool: Astro (Vite)"
  BUILD_TOOL="astro"
else
  echo "Build Tool: Unknown (using framework defaults)"
  BUILD_TOOL="unknown"
fi
```

### Generate Bundle Analysis

**For Vite:**

```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
};

# Build and analyze
npm run build
```

**For Webpack:**

```bash
# Install webpack bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Add to webpack.config.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: true
    })
  ]
};

# Build and analyze
npm run build
```

**For Next.js:**

```bash
# Install Next.js bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Create next.config.js wrapper
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer({
  // ...existing config
});

# Analyze bundles
ANALYZE=true npm run build
```

### Identify Large Dependencies

```bash
# Use npm or yarn to check package sizes
npx npkd  # Package size inspector

# Or check node_modules sizes
du -sh node_modules/* | sort -hr | head -20

# Or use bundlephobia (online)
# Visit: https://bundlephobia.com
```

---

## 2. Code Splitting Strategies

### Route-Based Code Splitting

**React with React Router:**

```jsx
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load route components
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

**Next.js (Automatic Route Splitting):**

Next.js automatically splits code by route. No additional configuration needed!

```jsx
// pages/dashboard.js - Automatically code-split
export default function Dashboard() {
  return <div>Dashboard</div>;
}
```

**Vue Router:**

```javascript
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("./views/Home.vue"), // Lazy loaded
    },
    {
      path: "/dashboard",
      component: () => import("./views/Dashboard.vue"),
    },
  ],
});
```

### Component-Based Code Splitting

**Lazy load heavy components:**

```jsx
import { lazy, Suspense } from "react";

// Heavy chart library - only load when needed
const ChartComponent = lazy(() => import("./ChartComponent"));

// Heavy rich text editor
const RichTextEditor = lazy(() => import("./RichTextEditor"));

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <Suspense fallback={<div>Loading chart...</div>}>
        <ChartComponent data={chartData} />
      </Suspense>

      <Suspense fallback={<div>Loading editor...</div>}>
        <RichTextEditor />
      </Suspense>
    </div>
  );
}
```

### Feature-Based Code Splitting

**Split by user interaction:**

```jsx
import { useState } from "react";

function UserProfile() {
  const [showEditor, setShowEditor] = useState(false);
  const [Editor, setEditor] = useState(null);

  const handleEdit = async () => {
    if (!Editor) {
      // Load editor only when user clicks "Edit"
      const module = await import("./ProfileEditor");
      setEditor(() => module.default);
    }
    setShowEditor(true);
  };

  return (
    <div>
      <ProfileView />
      <button onClick={handleEdit}>Edit Profile</button>

      {showEditor && Editor && <Editor />}
    </div>
  );
}
```

---

## 3. Tree Shaking & Dead Code Elimination

### Enable Tree Shaking (Build Tool Specific)

**Vite (Enabled by Default):**

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Group vendor libraries
          vendor: ["react", "react-dom"],
          ui: ["@mui/material"], // Separate UI library
        },
      },
    },
  },
};
```

**Webpack:**

```javascript
// webpack.config.js
module.exports = {
  mode: "production", // Enables tree shaking
  optimization: {
    usedExports: true, // Mark unused exports
    minimize: true, // Remove dead code
    sideEffects: false, // Honor package.json sideEffects
  },
};
```

### Use Modular Imports

**❌ BAD: Imports entire library**

```javascript
import _ from "lodash"; // Imports all 70KB minified
import { Button, Modal, Input } from "@mui/material"; // Imports entire library
```

**✅ GOOD: Import only what you need**

```javascript
import debounce from "lodash/debounce"; // Only 2KB
import isEmpty from "lodash/isEmpty";

import Button from "@mui/material/Button"; // Individual components
import Modal from "@mui/material/Modal";
```

### Mark Side-Effect-Free Packages

```json
// package.json
{
  "sideEffects": false  // Tells bundler all modules are pure
}

// Or specify files with side effects
{
  "sideEffects": ["*.css", "*.scss", "./src/polyfills.js"]
}
```

---

## 4. Replace Heavy Dependencies

### Identify Oversized Libraries

**Common culprits:**

| Library       | Size (min+gzip) | Lighter Alternative                  | Savings |
| ------------- | --------------- | ------------------------------------ | ------- |
| Moment.js     | 67KB            | date-fns or Day.js                   | ~50KB   |
| Lodash (full) | 71KB            | Lodash (modular) or native           | ~60KB   |
| Axios         | 14KB            | Native fetch                         | ~14KB   |
| jQuery        | 87KB            | Native DOM APIs                      | ~87KB   |
| Chart.js      | 160KB           | Recharts or lightweight alternatives | Varies  |

### Migration Examples

**Replace Moment.js with date-fns:**

```javascript
// ❌ Before: Moment.js (67KB)
import moment from "moment";
const formatted = moment(date).format("YYYY-MM-DD");

// ✅ After: date-fns (2-4KB per function)
import { format } from "date-fns";
const formatted = format(date, "yyyy-MM-dd");
```

**Replace Axios with Fetch:**

```javascript
// ❌ Before: Axios (14KB)
import axios from "axios";
const data = await axios.get("/api/users");

// ✅ After: Native fetch (0KB)
const response = await fetch("/api/users");
const data = await response.json();
```

**Replace Lodash with Native Methods:**

```javascript
// ❌ Before: Lodash
import _ from "lodash";
const filtered = _.filter(users, (user) => user.active);
const mapped = _.map(filtered, "name");

// ✅ After: Native JavaScript
const filtered = users.filter((user) => user.active);
const mapped = filtered.map((user) => user.name);
```

---

## 5. Dynamic Imports for Large Libraries

**Load libraries only when needed:**

```jsx
// Heavy visualization library - load on demand
async function loadChartLibrary() {
  const Chart = await import("chart.js/auto");
  return Chart;
}

function Analytics() {
  const [chartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    // Load chart library after component mounts
    loadChartLibrary().then(() => setChartLoaded(true));
  }, []);

  return chartLoaded ? <ChartComponent /> : <LoadingSpinner />;
}
```

**Load polyfills conditionally:**

```javascript
// Load polyfills only for older browsers
async function loadPolyfills() {
  if (!window.IntersectionObserver) {
    await import("intersection-observer");
  }

  if (!Array.prototype.flat) {
    await import("core-js/features/array/flat");
  }
}

loadPolyfills().then(() => {
  // Initialize app after polyfills loaded
  ReactDOM.render(<App />, document.getElementById("root"));
});
```

---

## 6. Optimize Third-Party Scripts

### Defer Non-Critical Scripts

```html
<!-- ❌ BAD: Render-blocking -->
<script src="https://cdn.example.com/analytics.js"></script>

<!-- ✅ GOOD: Async loading -->
<script async src="https://cdn.example.com/analytics.js"></script>

<!-- ✅ BETTER: Defer until page interactive -->
<script defer src="https://cdn.example.com/analytics.js"></script>
```

### Load Scripts After User Interaction

```javascript
// Load analytics only after user interaction
let analyticsLoaded = false;

function loadAnalytics() {
  if (analyticsLoaded) return;

  const script = document.createElement("script");
  script.src = "https://cdn.example.com/analytics.js";
  script.async = true;
  document.body.appendChild(script);

  analyticsLoaded = true;
}

// Load after first interaction
["click", "scroll", "keydown"].forEach((event) => {
  window.addEventListener(event, loadAnalytics, { once: true });
});

// Or after delay
setTimeout(loadAnalytics, 3000);
```

### Self-Host Third-Party Scripts

```bash
# Download and self-host instead of CDN
# Example: Google Analytics
wget https://www.google-analytics.com/analytics.js -O public/analytics.js

# Reference local file
<script async src="/analytics.js"></script>
```

**Benefits:**

- Control over caching strategy
- Reduce DNS lookups
- Avoid render-blocking from third-party domains

---

## 7. Set Performance Budgets

### Configure Budget in Build Tool

**Vite:**

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        chunkSizeWarningLimit: 500, // Warn if chunk > 500KB
      },
    },
  },
};
```

**Webpack:**

```javascript
// webpack.config.js
module.exports = {
  performance: {
    maxEntrypointSize: 250000, // 250KB
    maxAssetSize: 100000, // 100KB
    hints: "error", // Fail build if exceeded
  },
};
```

**Lighthouse CI (Universal):**

```yaml
# lighthouserc.json
{
  "ci":
    {
      "assert":
        {
          "assertions":
            {
              "total-byte-weight": ["error", { "maxNumericValue": 500000 }],
              "bootup-time": ["error", { "maxNumericValue": 4000 }],
            },
        },
    },
}
```

---

## 8. Measure & Validate

### Check Bundle Size Impact

```bash
# Build and check sizes
npm run build

# Look for:
# - Total bundle size (should be < 250KB for initial load)
# - Individual chunk sizes (< 100KB per chunk ideally)
# - Number of chunks (more chunks = better code splitting)
```

### Lighthouse Audit

```bash
lighthouse https://your-app.com --only-categories=performance --view

# Key metrics to check:
# - Total Blocking Time (TBT)
# - Time to Interactive (TTI)
# - JavaScript execution time
# - "Reduce unused JavaScript" opportunities
```

### Real User Monitoring

```javascript
// Track bundle load performance
window.addEventListener("load", () => {
  const perfData = performance.getEntriesByType("navigation")[0];
  const jsResources = performance
    .getEntriesByType("resource")
    .filter((r) => r.initiatorType === "script");

  const totalJSSize = jsResources.reduce((sum, r) => sum + r.transferSize, 0);

  console.log(`Total JS transferred: ${(totalJSSize / 1024).toFixed(2)} KB`);

  // Send to analytics
  gtag("event", "bundle_size", {
    total_js_kb: (totalJSSize / 1024).toFixed(2),
  });
});
```

---

## Success Criteria

✅ **Bundle Analysis**:

- Bundle visualizer shows clear chunk separation
- No single chunk > 100KB (except vendor bundles)
- Largest libraries identified and evaluated for alternatives

✅ **Code Splitting**:

- Routes are code-split (separate chunks per route)
- Heavy components are lazy-loaded
- Vendor libraries split into separate chunk

✅ **Tree Shaking**:

- Modular imports used (e.g., `import debounce from 'lodash/debounce'`)
- Build tool configured for tree shaking
- Dead code eliminated in production build

✅ **Performance Metrics**:

- Initial bundle ≤ 250KB (gzipped)
- TTI improved by 20-40%
- Lighthouse "Reduce unused JavaScript" scoring 90+
- TBT (Total Blocking Time) ≤ 300ms

---

## Common Pitfalls to Avoid

❌ **Importing entire libraries**: Use modular imports  
❌ **No code splitting**: Implement route and component splitting  
❌ **Bundling all polyfills**: Load conditionally based on browser support  
❌ **Render-blocking third-party scripts**: Use `async` or `defer`  
❌ **No performance budgets**: Set limits to prevent regression  
❌ **Optimizing without measuring**: Run bundle analyzer first  
❌ **Splitting too aggressively**: Balance bundle count with HTTP/2 multiplexing

---

## Related Prompts

- [performance-optimization.prompt.md](performance-optimization.prompt.md) - Overall performance improvement
- [core-web-vitals.prompt.md](core-web-vitals.prompt.md) - INP/FID optimization
- [lighthouse-audit.prompt.md](lighthouse-audit.prompt.md) - Comprehensive audit workflow

---

## Resources

- [web.dev: Code Splitting](https://web.dev/reduce-javascript-payloads-with-code-splitting/)
- [webpack: Bundle Analysis](https://webpack.js.org/guides/code-splitting/)
- [Vite: Build Optimizations](https://vitejs.dev/guide/build.html)
- [Bundlephobia: Package Size Checker](https://bundlephobia.com/)
- [Import Cost VS Code Extension](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)

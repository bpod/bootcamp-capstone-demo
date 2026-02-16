---
name: Bundle Analysis
description: Analyze JavaScript bundle size and optimization opportunities
agent: performance-tuner
tools: ["web-quality", "readonly"]
---

# Bundle Analysis

Analyze JavaScript bundle sizes and identify opportunities for code splitting, tree shaking, and dependency optimization.

## Analysis Areas

1. **Total Bundle Size**: Main bundle and chunks
2. **Third-Party Dependencies**: Large libraries and their usage
3. **Code Splitting**: Dynamic imports and route-based splitting
4. **Tree Shaking**: Unused code elimination
5. **Duplicate Code**: Shared code between chunks
6. **Compression**: Minification and gzip/brotli

## Analysis Workflow

1. Detect build tool (Vite, Webpack, etc.) from package.json
2. Review build configuration for optimization settings
3. Analyze bundle composition and largest dependencies
4. Identify code splitting opportunities
5. Check for unused dependencies or imports
6. Recommend specific optimizations with expected savings

## Bundle Size Targets

- **Mobile**: ≤ 170 KB total JavaScript (gzipped)
- **Desktop**: ≤ 350 KB total JavaScript (gzipped)
- **Initial Bundle**: As small as possible (aim for < 100 KB)
- **Route Chunks**: Lazy load per-route to reduce initial load

## Common Optimization Strategies

**Code Splitting:**

```javascript
// Route-based code splitting (React example)
const Dashboard = React.lazy(() => import("./Dashboard"));
const Settings = React.lazy(() => import("./Settings"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

**Tree Shaking (ES Modules):**

```javascript
// ✅ Good - tree-shakeable
import { specific } from "lodash-es";

// ❌ Bad - imports entire library
import _ from "lodash";
import "heavy-library"; // Side-effect import
```

**Dynamic Imports:**

```javascript
// Load heavy library only when needed
async function handleExport() {
  const { exportToCSV } = await import("./csv-exporter");
  exportToCSV(data);
}
```

## Build Tool Detection

The prompt will automatically detect and provide recommendations for:

- **Vite**: Uses Rollup under the hood, excellent defaults
- **Webpack**: Check for optimization config, split chunks configuration
- **esbuild**: Fast but requires manual optimization config
- **Rollup**: Advanced tree shaking, manual chunk optimization

## Analysis Checklist

- [ ] Build tool configured for production optimizations
- [ ] Code splitting enabled for routes/pages
- [ ] Large dependencies identified and evaluated
- [ ] Tree shaking working (ES modules used)
- [ ] Source maps disabled in production build
- [ ] Compression enabled (gzip or brotli)
- [ ] Unused dependencies removed from package.json
- [ ] Heavy libraries loaded dynamically when possible

## Output Format

Provide analysis results:

1. **Current Bundle Sizes**: Total and per-chunk breakdown
2. **Largest Dependencies**: Top 5-10 libraries by size
3. **Optimization Opportunities**: Specific recommendations ranked by impact
4. **Expected Savings**: KB/MB reduction for each recommendation
5. **Implementation**: Code examples and configuration changes
6. **Build Script**: Commands to analyze bundle (e.g., `vite build --analyze`)

Prioritize optimizations that reduce initial bundle size first.

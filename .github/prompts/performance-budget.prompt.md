---
name: performance-budget
description: Define and enforce performance budgets for assets, bundles, and metrics with CI/CD integration
---

# Performance Budget Definition and Enforcement

Define measurable performance budgets for your application and enforce them in your build process and CI/CD pipeline. This prevents performance regressions by failing builds that exceed defined limits.

## What Are Performance Budgets?

**Performance budgets** are self-imposed limits on metrics that affect site performance:

- **Resource budgets**: File size limits for assets (JS, CSS, images, fonts)
- **Quantity budgets**: Maximum number of HTTP requests
- **Timing budgets**: Limits on metrics (LCP, TTI, First Contentful Paint)
- **Bundle budgets**: JavaScript bundle size limits by route/page

**Why budgets matter:**

- Prevent gradual performance degradation
- Make trade-offs explicit and visible
- Catch regressions before deployment
- Set clear performance goals for the team

## Workflow

### Step 1: Detect Build Tool and Framework

**Check project structure:**

```bash
# Detect build tool
[ -f "vite.config.js" ] || [ -f "vite.config.ts" ] && echo "Vite detected"
[ -f "webpack.config.js" ] && echo "Webpack detected"
[ -f "next.config.js" ] && echo "Next.js detected"

# Check framework
grep -E '"(react|vue|angular|svelte)"' package.json
```

**Budget configuration varies by tool** - adapt approach accordingly.

***

### Step 2: Establish Baseline Metrics

**Measure current performance:**

```bash
# Build production bundle
npm run build

# Analyze bundle sizes
ls -lh dist/**/*.{js,css} | sort -rh
# Or for Next.js
ls -lh .next/static/**/*.js | sort -rh

# Count total size
du -sh dist/ # or build/ or .next/
```

**Capture baseline:**

- Total bundle size (all JS)
- Main bundle size
- Vendor bundle size
- CSS bundle size
- Total build size
- Asset counts (images, fonts, etc.)

**Example baseline:**

```
Total build: 2.8 MB
JavaScript: 850 KB (main: 320 KB, vendor: 530 KB)
CSS: 180 KB
Images: 1.5 MB
Fonts: 270 KB
Total requests: 47
```

***

### Step 3: Define Performance Budgets

**Use the "20% rule"**: Set budgets at **80% of current baseline** to allow room for growth while preventing regression.

**Recommended budgets by app type:**

#### E-commerce / Content Site

```json
{
  "budgets": {
    "javascript": {
      "maxSize": "300 KB", // Initial bundle
      "maxTotalSize": "600 KB" // All JavaScript
    },
    "css": {
      "maxSize": "100 KB"
    },
    "images": {
      "maxSize": "1 MB" // Per page
    },
    "fonts": {
      "maxSize": "100 KB"
    }
  },
  "timing": {
    "LCP": "2.5s",
    "FCP": "1.8s",
    "TTI": "3.8s",
    "TBT": "300ms"
  }
}
```

#### SaaS Application / Dashboard

```json
{
  "budgets": {
    "javascript": {
      "maxSize": "400 KB", // Initial bundle (more features acceptable)
      "maxTotalSize": "800 KB"
    },
    "css": {
      "maxSize": "150 KB"
    }
  },
  "timing": {
    "LCP": "2.5s",
    "FCP": "1.8s",
    "TTI": "4.0s"
  }
}
```

#### Marketing Site / Blog

```json
{
  "budgets": {
    "javascript": {
      "maxSize": "150 KB", // Minimal interactivity
      "maxTotalSize": "300 KB"
    },
    "css": {
      "maxSize": "50 KB"
    },
    "images": {
      "maxSize": "500 KB"
    }
  },
  "timing": {
    "LCP": "2.0s",
    "FCP": "1.5s",
    "TTI": "3.0s"
  }
}
```

***

### Step 4: Configure Budget Enforcement (By Tool)

#### Option A: Vite Configuration

**File: `vite.config.ts`**

```typescript
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  build: {
    // Chunk size warning limit (KB)
    chunkSizeWarningLimit: 350, // Fail build if exceeded

    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendor chunks
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }
            return "vendor";
          }
        },
      },
    },
  },

  plugins: [
    // Bundle size visualization
    visualizer({
      filename: "./dist/stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
```

**Package.json script:**

```json
{
  "scripts": {
    "build": "vite build",
    "build:check": "vite build && node scripts/check-bundle-size.js"
  }
}
```

#### Option B: Webpack Configuration

**File: `webpack.config.js`**

```javascript
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  // ...other config

  performance: {
    maxEntrypointSize: 350000, // 350 KB (fail build)
    maxAssetSize: 300000, // 300 KB
    hints: "error", // 'warning' or 'error'
  },

  plugins: [
    // Bundle analysis
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "bundle-report.html",
      openAnalyzer: false,
    }),
  ],
};
```

#### Option C: Next.js Configuration

**File: `next.config.js`**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable bundle analyzer
  ...(process.env.ANALYZE === "true" && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            reportFilename: "./analyze.html",
            openAnalyzer: false,
          }),
        );
      }
      return config;
    },
  }),
};

module.exports = nextConfig;
```

**Package.json script:**

```json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build",
    "build:check": "npm run build && node scripts/check-bundle-size.js"
  }
}
```

***

### Step 5: Create Budget Validation Script

**File: `scripts/check-bundle-size.js`**

```javascript
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { gzip } = require("zlib");

const gzipAsync = promisify(gzip);

// Define budgets (in bytes, gzipped)
const BUDGETS = {
  "main.js": 320 * 1024, // 320 KB
  "vendor.js": 530 * 1024, // 530 KB
  "total-js": 850 * 1024, // 850 KB total
  "total-css": 180 * 1024, // 180 KB
};

async function getGzipSize(filePath) {
  const content = fs.readFileSync(filePath);
  const gzipped = await gzipAsync(content);
  return gzipped.length;
}

async function checkBudgets() {
  const distDir = path.join(__dirname, "../dist"); // or '../build'

  // Find all JS files
  const jsFiles = [];
  const cssFiles = [];

  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith(".js") && !file.endsWith(".map")) {
        jsFiles.push(filePath);
      } else if (file.endsWith(".css")) {
        cssFiles.push(filePath);
      }
    });
  }

  walkDir(distDir);

  // Calculate sizes
  let totalJsSize = 0;
  let totalCssSize = 0;
  const violations = [];

  console.log("📦 Bundle Size Report (gzipped)\n");
  console.log("JavaScript files:");

  for (const file of jsFiles) {
    const size = await getGzipSize(file);
    totalJsSize += size;

    const relativePath = path.relative(distDir, file);
    const sizeKB = (size / 1024).toFixed(2);
    console.log(`  ${relativePath}: ${sizeKB} KB`);

    // Check individual file budgets
    const filename = path.basename(file);
    if (
      filename.includes("main") &&
      BUDGETS["main.js"] &&
      size > BUDGETS["main.js"]
    ) {
      violations.push(
        `Main bundle exceeds budget: ${sizeKB} KB > ${(BUDGETS["main.js"] / 1024).toFixed(2)} KB`,
      );
    }
    if (
      filename.includes("vendor") &&
      BUDGETS["vendor.js"] &&
      size > BUDGETS["vendor.js"]
    ) {
      violations.push(
        `Vendor bundle exceeds budget: ${sizeKB} KB > ${(BUDGETS["vendor.js"] / 1024).toFixed(2)} KB`,
      );
    }
  }

  console.log("\nCSS files:");
  for (const file of cssFiles) {
    const size = await getGzipSize(file);
    totalCssSize += size;

    const relativePath = path.relative(distDir, file);
    const sizeKB = (size / 1024).toFixed(2);
    console.log(`  ${relativePath}: ${sizeKB} KB`);
  }

  // Check total budgets
  console.log("\n📊 Totals:");
  console.log(`  Total JS: ${(totalJsSize / 1024).toFixed(2)} KB`);
  console.log(`  Total CSS: ${(totalCssSize / 1024).toFixed(2)} KB`);

  if (BUDGETS["total-js"] && totalJsSize > BUDGETS["total-js"]) {
    violations.push(
      `Total JavaScript exceeds budget: ${(totalJsSize / 1024).toFixed(2)} KB > ${(BUDGETS["total-js"] / 1024).toFixed(2)} KB`,
    );
  }

  if (BUDGETS["total-css"] && totalCssSize > BUDGETS["total-css"]) {
    violations.push(
      `Total CSS exceeds budget: ${(totalCssSize / 1024).toFixed(2)} KB > ${(BUDGETS["total-css"] / 1024).toFixed(2)} KB`,
    );
  }

  // Report violations
  if (violations.length > 0) {
    console.error("\n❌ Budget Violations:");
    violations.forEach((v) => console.error(`  - ${v}`));
    console.error("\nBuild failed due to performance budget violations.");
    process.exit(1);
  }

  console.log("\n✅ All budgets met!");
}

checkBudgets().catch((err) => {
  console.error("Error checking budgets:", err);
  process.exit(1);
});
```

**Usage:**

```bash
npm run build:check
```

***

### Step 6: Configure Lighthouse Budgets

**File: `budget.json`**

```json
[
  {
    "path": "/*",
    "resourceSizes": [
      {
        "resourceType": "script",
        "budget": 350
      },
      {
        "resourceType": "stylesheet",
        "budget": 100
      },
      {
        "resourceType": "image",
        "budget": 1000
      },
      {
        "resourceType": "font",
        "budget": 100
      },
      {
        "resourceType": "total",
        "budget": 2000
      }
    ],
    "resourceCounts": [
      {
        "resourceType": "script",
        "budget": 10
      },
      {
        "resourceType": "stylesheet",
        "budget": 5
      },
      {
        "resourceType": "third-party",
        "budget": 10
      }
    ],
    "timings": [
      {
        "metric": "interactive",
        "budget": 3800
      },
      {
        "metric": "first-contentful-paint",
        "budget": 1800
      },
      {
        "metric": "largest-contentful-paint",
        "budget": 2500
      },
      {
        "metric": "max-potential-fid",
        "budget": 200
      }
    ]
  }
]
```

**Run Lighthouse with budget:**

```bash
lighthouse https://example.com --budget-path=./budget.json --output=json --output-path=./lighthouse-budget-report.json
```

**Check for budget violations:**

```bash
# Extract budget audits
cat lighthouse-budget-report.json | jq '.audits["performance-budget"]'
```

***

### Step 7: CI/CD Integration

#### GitHub Actions Example

**File: `.github/workflows/performance-budget.yml`**

```yaml
name: Performance Budget Check

on:
  pull_request:
    branches: [main, develop]

jobs:
  performance-budget:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build production bundle
        run: npm run build

      - name: Check bundle size budgets
        run: node scripts/check-bundle-size.js

      - name: Upload bundle analysis
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: bundle-analysis
          path: dist/stats.html # or bundle-report.html

      - name: Comment PR with bundle size
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const { execSync } = require('child_process');

            // Get bundle sizes
            const output = execSync('ls -lh dist/**/*.js | awk \'{print $5, $9}\'').toString();

            const comment = `## 📦 Bundle Size Report\n\n\`\`\`\n${output}\`\`\`\n\nSee artifacts for detailed analysis.`;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

#### Lighthouse CI Example

**File: `lighthouserc.json`**

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000"],
      "startServerCommand": "npm run preview",
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:no-pwa",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1800 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "interactive": ["error", { "maxNumericValue": 3800 }],
        "max-potential-fid": ["error", { "maxNumericValue": 200 }],
        "resource-summary:script:size": [
          "error",
          { "maxNumericValue": 350000 }
        ],
        "resource-summary:stylesheet:size": [
          "error",
          { "maxNumericValue": 100000 }
        ]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

**GitHub Actions workflow:**

```yaml
- name: Run Lighthouse CI
  run: |
    npm install -g @lhci/cli@0.13.x
    lhci autorun
```

***

### Step 8: Monitor Budget Health

**Create budget dashboard script:**

**File: `scripts/budget-dashboard.js`**

```javascript
const budgets = require("../budget.json");

function generateDashboard() {
  console.log("📊 Performance Budget Dashboard\n");
  console.log("═══════════════════════════════════════\n");

  budgets.forEach((budget, index) => {
    console.log(`Path: ${budget.path}`);
    console.log("\nResource Size Budgets:");

    budget.resourceSizes.forEach((r) => {
      const emoji = r.resourceType === "total" ? "📦" : "📄";
      console.log(`  ${emoji} ${r.resourceType}: ${r.budget} KB`);
    });

    if (budget.timings) {
      console.log("\nTiming Budgets:");
      budget.timings.forEach((t) => {
        console.log(`  ⏱️  ${t.metric}: ${t.budget}ms`);
      });
    }

    if (budget.resourceCounts) {
      console.log("\nResource Count Budgets:");
      budget.resourceCounts.forEach((r) => {
        console.log(`  🔢 ${r.resourceType}: ${r.budget} requests`);
      });
    }

    console.log("\n═══════════════════════════════════════\n");
  });
}

generateDashboard();
```

**Usage:**

```bash
node scripts/budget-dashboard.js
```

***

## Success Criteria

- [ ] Performance budgets defined for all critical resources
- [ ] Build tool configured to enforce bundle size limits
- [ ] Custom validation script created and tested
- [ ] Lighthouse budget configuration created
- [ ] CI/CD pipeline fails on budget violations
- [ ] Team aware of budgets and how to check them
- [ ] Budget dashboard accessible to stakeholders
- [ ] Process for reviewing and adjusting budgets established

***

## Common Budget Violations and Fixes

### Violation: Main bundle too large

**Diagnosis:**

```bash
# Analyze bundle composition
npm run build
npx vite-bundle-visualizer # or webpack-bundle-analyzer
```

**Fixes:**

1. **Code splitting** - Split routes/pages into separate chunks
2. **Dynamic imports** - Load heavy components on demand
3. **Tree shaking** - Remove unused exports
4. **Lighter alternatives** - Replace heavy libraries

### Violation: Vendor bundle too large

**Common culprits:**

- **moment.js** (288 KB) → Use **date-fns** (12 KB per function)
- **lodash** (70 KB) → Use **lodash-es** with tree shaking
- **axios** (13 KB) → Use native **fetch** (0 KB)
- **react-icons** (full library) → Import specific icons only

**Fix:**

```javascript
// ❌ Imports entire library
import { FaHome } from "react-icons/fa";

// ✅ Imports only needed icon
import FaHome from "react-icons/fa/FaHome";
```

### Violation: Image budget exceeded

**Fixes:**

1. Convert to WebP/AVIF (60-80% reduction)
2. Implement responsive images with srcset
3. Lazy load images below the fold
4. Use CDN with automatic optimization

### Violation: CSS budget exceeded

**Fixes:**

1. Remove unused CSS (PurgeCSS, UnCSS)
2. Enable CSS minification
3. Extract critical CSS above the fold
4. Consider CSS-in-JS with dead code elimination

***

## Tips for Maintaining Budgets

1. **Review budgets quarterly** - Adjust as application grows
2. **Make budgets visible** - Dashboard, CI comments, team meetings
3. **Celebrate wins** - Recognize bundle size reductions
4. **Budget for new features** - Consider performance cost upfront
5. **Monitor trends** - Track bundle size over time (bundlesize.io, bundlephobia.com)
6. **Educate team** - Regular performance reviews and training

***

## References

- [Web.dev Performance Budgets](https://web.dev/performance-budgets-101/)
- [Lighthouse Performance Budgets](https://developer.chrome.com/docs/lighthouse/performance/performance-budgets)
- [webpack Performance Hints](https://webpack.js.org/configuration/performance/)
- [Vite Build Options](https://vitejs.dev/config/build-options.html)

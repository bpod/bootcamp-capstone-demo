---
name: Performance Budget
description: Set and track performance budgets for your project
agent: performance-tuner
tools: ["web-quality", "readonly"]
---

# Performance Budget

Establish performance budgets for your project and track metrics to prevent performance regressions.

## What is a Performance Budget?

A performance budget sets limits on metrics that affect user experience. When budgets are exceeded, it signals a need for optimization before shipping.

## Budget Categories

**1. Quantity-Based Metrics:**

- Maximum JavaScript bundle size
- Maximum CSS size
- Maximum image size
- Total number of HTTP requests

**2. Time-Based Metrics (Core Web Vitals):**

- LCP (Largest Contentful Paint) ≤ 2.5s
- INP (Interaction to Next Paint) ≤ 200ms
- CLS (Cumulative Layout Shift) ≤ 0.1

**3. Rule-Based Metrics:**

- Lighthouse Performance Score ≥ 90
- Accessibility Score ≥ 90
- No render-blocking resources > 500ms

## Recommended Budgets

**Mobile (3G Connection):**

```json
{
  "budgets": [
    {
      "resourceType": "script",
      "budget": 170
    },
    {
      "resourceType": "stylesheet",
      "budget": 50
    },
    {
      "resourceType": "image",
      "budget": 200
    },
    {
      "resourceType": "total",
      "budget": 500
    }
  ],
  "timings": {
    "firstContentfulPaint": 2000,
    "largestContentfulPaint": 2500,
    "interactive": 3500
  }
}
```

**Desktop (Fast Connection):**

```json
{
  "budgets": [
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
      "budget": 500
    },
    {
      "resourceType": "total",
      "budget": 1000
    }
  ],
  "timings": {
    "firstContentfulPaint": 1000,
    "largestContentfulPaint": 1500,
    "interactive": 2000
  }
}
```

## Implementation

**Lighthouse CI Budget Configuration:**

Create `.lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "url": ["http://localhost:3000"]
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "resource-summary:script:size": [
          "error",
          { "maxNumericValue": 170000 }
        ],
        "resource-summary:stylesheet:size": [
          "error",
          { "maxNumericValue": 50000 }
        ],
        "resource-summary:image:size": ["error", { "maxNumericValue": 200000 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

**Webpack Performance Hints:**

```javascript
module.exports = {
  performance: {
    maxAssetSize: 200000, // 200 KB
    maxEntrypointSize: 350000, // 350 KB
    hints: "error",
  },
};
```

**Vite Build Warnings:**

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split large dependencies
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 200, // KB
  },
});
```

## Monitoring Strategy

**1. CI/CD Integration:**

- Run Lighthouse CI on every PR
- Fail builds that exceed budgets
- Track trends over time

**2. Real User Monitoring (RUM):**

- Monitor actual user Core Web Vitals
- Alert on budget violations in production
- Track by device type and connection speed

**3. Regular Audits:**

- Weekly Lighthouse audits
- Monthly budget review and adjustment
- Track progress toward goals

## Output Format

When setting budgets, provide:

1. **Current Baseline**: Measure existing performance
2. **Recommended Budgets**: Appropriate limits for the project
3. **Configuration Files**: Ready-to-use configs for build tools
4. **Monitoring Setup**: How to track and enforce budgets
5. **Action Plan**: Steps to meet budgets if currently exceeded

Budgets should be challenging but achievable, forcing the team to prioritize performance.

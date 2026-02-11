---
name: browser-compatibility
description: Cross-browser compatibility testing, polyfills, and progressive enhancement strategies
---

Ensure cross-browser compatibility for ${workspaceFolder} or ${selection}.

**Workflow:**

1. **Define Support Matrix**: Identify target browsers based on analytics
2. **Detect Issues**: Check caniuse.com for feature support
3. **Implement Fixes**: Polyfills, feature detection, progressive enhancement
4. **Test**: BrowserStack or manual testing on target browsers

**Common Support Tiers**:

- Tier 1 (Full): Chrome, Firefox, Safari, Edge (last 2 versions)
- Tier 2 (Core): IE11, older mobile browsers
- Tier 3 (Basic): Graceful degradation

**Strategies**:

- **Feature Detection**: `if ('IntersectionObserver' in window)`
- **Polyfills**: core-js, intersection-observer polyfill
- **Transpilation**: Babel for ES6+ → ES5
- **Progressive Enhancement**: Core functionality works everywhere, enhancements for modern browsers
- **Autoprefixer**: CSS vendor prefixes

**Tools**:

- Can I Use: Feature support lookup
- Browserslist: Define target browsers in package.json
- Polyfill.io: Dynamic polyfill delivery

Provide polyfill and configuration recommendations for detected issues.

- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

#### Tier 2: Core Support (≥80% features, graceful degradation)

- Chrome (last 3-5 versions)
- Firefox (last 3-5 versions)
- Safari (iOS 12+, macOS 10.14+)
- Samsung Internet

#### Tier 3: Basic Support (HTML/CSS only, progressive enhancement)

- Internet Explorer 11 (if required)
- Older mobile browsers

**Check current project browserslist:**

```bash
# View browserslist config
cat .browserslistrc
# Or check package.json
cat package.json | grep -A 5 "browserslist"

# See which browsers match your query
npx browserslist
```

**Common browserslist configurations:**

```json
{
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ],
    "modern": [
      "last 2 Chrome versions",
      "last 2 Firefox versions",
      "last 2 Safari versions",
      "last 2 Edge versions"
    ],
    "legacy": ["ie 11", "last 3 versions", "> 0.5%"]
  }
}
```

---

### Step 2: Audit Browser Compatibility Issues

**Check for potential compatibility issues:**

#### Modern JavaScript Features

**Check if using ES2015+ features without transpilation:**

```bash
# Search for modern syntax that may not be supported
grep -r "async/await\|?.=" src/
grep -r "??\|?.=" src/ # Nullish coalescing, optional chaining
grep -r "class \|=>" src/ # Classes, arrow functions
```

**Modern APIs to watch:**

```javascript
// ⚠️ May need polyfills
- fetch()
- Promise
- IntersectionObserver
- ResizeObserver
- Web Animations API
- CSS Custom Properties (IE11)
- CSS Grid (IE11 partial)
- Flexbox (IE11 buggy)
```

#### CSS Compatibility

**Check for unsupported CSS features:**

```bash
# Modern CSS that may need fallbacks
grep -r "gap:\|aspect-ratio:\|backdrop-filter:" src/
grep -r "@supports\|@container" src/
grep -r "clamp\|min\|max\|calc" src/
```

**Can I Use integration:**

```bash
# Install caniuse-lite
npm install --save-dev caniuse-lite

# Check feature support
npx browserslist-useragent-regexp --browsers "defaults"
```

---

### Step 3: Configure Transpilation and Polyfills

#### TypeScript Configuration

**File: `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020", // Or ES2015 for wider support
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "downlevelIteration": true, // Support for...of on iterables
    "importHelpers": true // Use tslib for smaller bundle
  }
}
```

#### Babel Configuration (if using)

**File: `.babelrc` or `babel.config.js`**

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3,
        "targets": "> 0.25%, not dead"
      }
    ],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ],
  "plugins": [
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator"
  ]
}
```

#### Core-js Polyfills

**Install core-js:**

```bash
npm install --save core-js
```

**Import selectively at app entry:**

```javascript
// src/polyfills.ts
// Only import what you need for better bundle size

// Promise support (IE11)
import "core-js/features/promise";

// Fetch API (older browsers)
import "core-js/features/url-search-params";

// Array methods
import "core-js/features/array/flat";
import "core-js/features/array/flat-map";
import "core-js/features/array/includes";

// Object methods
import "core-js/features/object/entries";
import "core-js/features/object/values";
import "core-js/features/object/from-entries";

// String methods
import "core-js/features/string/includes";
import "core-js/features/string/starts-with";
import "core-js/features/string/ends-with";

// Modern features
import "core-js/features/promise/all-settled";
import "core-js/features/symbol";
```

**Import at app entry:**

```javascript
// src/main.tsx or src/index.tsx
import "./polyfills";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Rest of app
```

---

### Step 4: Feature Detection (Progressive Enhancement)

**Use feature detection instead of browser detection:**

```javascript
// ✅ Feature detection (good)
if ("IntersectionObserver" in window) {
  // Use IntersectionObserver
  const observer = new IntersectionObserver(callback);
} else {
  // Fallback: load all images immediately
  images.forEach((img) => (img.src = img.dataset.src));
}

// ❌ Browser detection (bad)
if (navigator.userAgent.includes("Safari")) {
  // Fragile and unreliable
}
```

**Modernizr for comprehensive feature detection:**

```bash
npm install --save-dev modernizr
```

**File: `.modernizrrc`**

```json
{
  "feature-detects": [
    "css/flexbox",
    "css/grid",
    "css/customproperties",
    "intersectionobserver",
    "fetch",
    "promises",
    "webp"
  ]
}
```

**Using Modernizr in code:**

```javascript
import Modernizr from "modernizr";

if (Modernizr.webp) {
  // Use WebP images
  imageSrc = "image.webp";
} else {
  // Fallback to JPEG
  imageSrc = "image.jpg";
}

if (Modernizr.fetchapi) {
  // Use fetch
  fetch(url).then((r) => r.json());
} else {
  // Fallback to XMLHttpRequest
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.send();
}
```

---

### Step 5: CSS Fallbacks and Autoprefixer

#### Autoprefixer Configuration

**File: `postcss.config.js`**

```javascript
module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: ["> 0.5%", "last 2 versions", "not dead"],
      grid: "autoplace", // Grid prefixes for IE11
    },
  },
};
```

**Install autoprefixer:**

```bash
npm install --save-dev autoprefixer postcss
```

#### CSS Feature Queries

**Progressive enhancement with @supports:**

```css
/* Flexbox fallback for older browsers */
.container {
  display: flex; /* Modern browsers */
  flex-wrap: wrap;
  gap: 1rem; /* Modern gap property */
}

/* Fallback for browsers without gap support */
@supports not (gap: 1rem) {
  .container > * {
    margin: 0.5rem;
  }
}

/* Grid with fallback */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

/* Flexbox fallback for IE11 */
@supports not (display: grid) {
  .grid {
    display: flex;
    flex-wrap: wrap;
  }

  .grid > * {
    flex: 1 0 250px;
    margin: 1rem;
  }
}

/* CSS Custom Properties with fallback */
.button {
  background-color: #007bff; /* Fallback */
  background-color: var(--primary-color, #007bff); /* Modern */
}

/* Backdrop blur with fallback */
.modal-overlay {
  background: rgba(0, 0, 0, 0.8); /* Fallback */
}

@supports (backdrop-filter: blur(10px)) {
  .modal-overlay {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
  }
}
```

---

### Step 6: Browser-Specific Testing

#### Local Testing

**Browser installation for testing:**

**macOS:**

```bash
# Install multiple browsers with Homebrew
brew install --cask google-chrome firefox microsoft-edge
brew install --cask safari-technology-preview
```

**Windows:**

```bash
# Use Chocolatey
choco install googlechrome firefox microsoft-edge
```

**Linux:**

```bash
# Debian/Ubuntu
sudo apt install chromium-browser firefox
```

#### BrowserStack / Sauce Labs (Cloud Testing)

**BrowserStack configuration:**

```yaml
# browserstack.yml
browsers:
  - os: Windows
    os_version: 11
    browser: Chrome
    browser_version: latest

  - os: Windows
    os_version: 11
    browser: Edge
    browser_version: latest

  - os: OS X
    os_version: Monterey
    browser: Safari
    browser_version: 15.0

  - os: iOS
    os_version: 15
    device: iPhone 13
    browser: Safari

  - os: android
    os_version: 12.0
    device: Samsung Galaxy S22
    browser: Chrome
```

**Local BrowserStack testing:**

```bash
# Install BrowserStack Local
npm install -g browserstack-local

# Start local testing
browserstack-local --key YOUR_ACCESS_KEY

# Your local dev server is now accessible
# http://localhost:3000 → bs-local.com:3000
```

#### Playwright for Automated Cross-Browser Testing

**Install Playwright:**

```bash
npm install --save-dev @playwright/test
npx playwright install
```

**File: `playwright.config.ts`**

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 13"] },
    },
    {
      name: "Edge",
      use: { ...devices["Desktop Edge"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

**Cross-browser test example:**

```typescript
// e2e/compatibility.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Cross-browser compatibility", () => {
  test("navigation works across browsers", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Test critical functionality
    await page.click("text=Get Started");
    await expect(page).toHaveURL(/.*dashboard/);

    // Check for console errors
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.waitForTimeout(2000);
    expect(errors).toHaveLength(0);
  });

  test("forms work across browsers", async ({ page }) => {
    await page.goto("http://localhost:3000/contact");

    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('textarea[name="message"]', "Test message");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Thank you")).toBeVisible();
  });
});
```

**Run tests:**

```bash
# Test all browsers
npx playwright test

# Test specific browser
npx playwright test --project=firefox

# Debug mode
npx playwright test --debug
```

---

### Step 7: Polyfill Strategy by Feature

#### Intersection Observer Polyfill

```bash
npm install --save intersection-observer
```

```javascript
// Conditionally load polyfill
if (!("IntersectionObserver" in window)) {
  import("intersection-observer").then(() => {
    // IntersectionObserver now available
    initLazyLoading();
  });
} else {
  initLazyLoading();
}
```

#### Fetch Polyfill

```bash
npm install --save whatwg-fetch
```

```javascript
// Conditionally load
if (!("fetch" in window)) {
  import("whatwg-fetch");
}
```

#### ResizeObserver Polyfill

```bash
npm install --save @juggle/resize-observer
```

```javascript
// src/utils/resize-observer.ts
let ResizeObserverPolyfill: typeof ResizeObserver;

if (typeof ResizeObserver === 'undefined') {
  import('@juggle/resize-observer').then((module) => {
    ResizeObserverPolyfill = module.ResizeObserver;
  });
}

export const getResizeObserver = () => {
  return ResizeObserverPolyfill || ResizeObserver;
};
```

#### CSS Custom Properties Polyfill (IE11)

```bash
npm install --save css-vars-ponyfill
```

```javascript
// src/polyfills.ts
import cssVars from "css-vars-ponyfill";

// Only run on browsers that don't support CSS variables
if (!window.CSS || !window.CSS.supports("color", "var(--primary)")) {
  cssVars({
    include: "style,link",
    watch: true,
  });
}
```

---

### Step 8: Create Compatibility Report

**File: `scripts/compatibility-report.js`**

```javascript
const browserslist = require("browserslist");
const caniuse = require("caniuse-lite");

const features = [
  "fetch",
  "promises",
  "arrow-functions",
  "css-grid",
  "flexbox",
  "css-variables",
  "intersectionobserver",
  "resizeobserver",
  "webp",
  "avif",
  "es6-module",
];

function generateReport() {
  const browsers = browserslist();

  console.log("📊 Browser Compatibility Report\n");
  console.log(`Target: ${browsers.length} browser versions\n`);

  console.log("Browser Support:");
  browsers.forEach((browser) => {
    console.log(`  ✓ ${browser}`);
  });

  console.log("\n═══════════════════════════════════════\n");

  features.forEach((feature) => {
    console.log(`\nFeature: ${feature}`);
    // Check support via caniuse data
    // This is simplified - actual implementation would check caniuse-lite data
    console.log(`  Status: Check https://caniuse.com/${feature}`);
  });
}

generateReport();
```

---

## Common Compatibility Issues and Solutions

### Issue 1: Optional Chaining Not Working (IE11)

**Error:** `Unexpected token '?'`

**Solution:**

```javascript
// Ensure Babel transpiles optional chaining
// .babelrc
{
  "plugins": ["@babel/plugin-proposal-optional-chaining"]
}

// Or configure target properly
{
  "presets": [["@babel/preset-env", {
    "targets": "ie 11"
  }]]
}
```

### Issue 2: CSS Grid Not Working (IE11)

**Solution: Use Autoprefixer with grid support**

```css
/* Modern grid */
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

/* Autoprefixer generates for IE11: */
.container {
  display: -ms-grid;
  -ms-grid-columns: 1fr 1rem 1fr 1fr 1rem 1fr;
}
```

**Or provide Flexbox fallback:**

```css
.container {
  display: flex; /* Fallback */
  flex-wrap: wrap;
}

@supports (display: grid) {
  .container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Issue 3: Fetch Not Available (IE11, older browsers)

**Solution:**

```javascript
// Use fetch polyfill
import "whatwg-fetch";

// Or create abstraction
async function request(url, options) {
  if (typeof fetch !== "undefined") {
    return fetch(url, options);
  } else {
    // XMLHttpRequest fallback
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(options.method || "GET", url);
      xhr.onload = () =>
        resolve({
          ok: xhr.status >= 200 && xhr.status < 300,
          json: () => Promise.resolve(JSON.parse(xhr.responseText)),
        });
      xhr.onerror = reject;
      xhr.send(options.body);
    });
  }
}
```

### Issue 4: CSS Custom Properties Not Working (IE11)

**Solution: Use PostCSS plugin**

```bash
npm install --save-dev postcss-custom-properties
```

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    "postcss-custom-properties": {
      preserve: true, // Keep original for modern browsers
    },
    autoprefixer: {},
  },
};
```

**Or use CSS-in-JS fallback:**

```javascript
const buttonStyle = {
  backgroundColor: "var(--primary-color, #007bff)", // Fallback
};
```

---

## Success Criteria

- [ ] Target browser matrix defined (browserslist configured)
- [ ] Transpilation configured for target browsers
- [ ] Polyfills added for required features
- [ ] CSS autoprefixer configured
- [ ] Feature detection implemented (no browser sniffing)
- [ ] CSS fallbacks provided (@supports queries)
- [ ] Cross-browser tests passing (Playwright/BrowserStack)
- [ ] No console errors in target browsers
- [ ] Core functionality works on all Tier 1 browsers
- [ ] Progressive enhancement for Tier 2/3 browsers
- [ ] Compatibility report generated

---

## Testing Checklist

**Manual Testing:**

- [ ] Test in Chrome (latest)
- [ ] Test in Firefox (latest)
- [ ] Test in Safari (latest)
- [ ] Test in Edge (latest)
- [ ] Test on iOS Safari (mobile)
- [ ] Test on Android Chrome (mobile)
- [ ] Test with slow network (throttling)
- [ ] Test with JavaScript disabled (progressive enhancement)

**Automated Testing:**

- [ ] Playwright tests pass on all target browsers
- [ ] No console errors logged during tests
- [ ] Performance budgets met across browsers
- [ ] Accessibility tests pass on all browsers

---

## References

- [Browserslist](https://github.com/browserslist/browserslist)
- [Can I Use](https://caniuse.com/)
- [MDN Browser Compatibility](https://developer.mozilla.org/en-US/docs/Web/Guide/Browser_support)
- [Autoprefixer](https://github.com/postcss/autoprefixer)
- [Core-js](https://github.com/zloirock/core-js)
- [Playwright](https://playwright.dev/)
- [BrowserStack](https://www.browserstack.com/)

# Testing Guidelines for Frontend Quality

## Overview

This project emphasizes **quality-driven development** patterns for building high-performance, accessible web applications. Testing ensures your optimizations work as intended and provides confidence when refactoring.

## Testing Scope

This project focuses on **frontend quality validation**:

- ✅ **Web Performance Tests**: Lighthouse CI, Core Web Vitals monitoring, bundle analysis
- ✅ **Accessibility Tests**: Automated a11y audits, WCAG compliance validation
- ✅ **Component Tests**: Framework-agnostic component behavior validation
- ✅ **Visual Regression Tests**: Ensuring UI changes don't introduce unintended visual bugs
- ✅ **Code Quality Tests**: Linting, type checking, best practice enforcement

We do **NOT** include:

- ❌ **Full E2E Browser Automation**: Keeps focus on quality patterns vs test infrastructure
- ❌ **Backend API Testing**: Frontend-focused tooling only

**Why this scope?** This focuses on frontend quality patterns that improve user experience through performance, accessibility, and maintainability.

## Testing Philosophy

### Quality as a Continuous Process

1. **Define Quality Metrics**: Lighthouse scores, Core Web Vitals, accessibility targets
2. **Measure Baseline**: Establish current state
3. **Implement Improvements**: Apply optimizations systematically
4. **Validate Impact**: Run tests to confirm improvements
5. **Monitor Regression**: Ensure quality doesn't degrade over time

### Quality Workflow Principles

When optimizing web applications:

- ✅ **DO**: Measure before and after each optimization
- ✅ **DO**: Test on real devices and network conditions
- ✅ **DO**: Validate accessibility with automated and manual tools
- ✅ **DO**: Monitor bundle sizes and performance budgets
- ❌ **DO NOT**: Optimize prematurely without measuring
- ❌ **DO NOT**: Sacrifice accessibility for performance
- ❌ **DO NOT**: Trust optimizations without validation

**Why?** Quality improvements must be measurable and validated. Assumptions without data lead to wasted effort.

### Tests Provide Validation

Each quality test validates:

- **Performance**: Load times, render speeds, interaction responsiveness
- **Accessibility**: WCAG compliance, screen reader compatibility, keyboard navigation
- **Best Practices**: Code quality, security, maintainability
- **User Experience**: Visual consistency, error handling, edge cases

## Web Performance Testing

### Lighthouse CI Integration

Automate Lighthouse audits in your CI/CD pipeline:

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push, pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://your-app.com
            https://your-app.com/page
          budgetPath: ./budget.json
          uploadArtifacts: true
```

### Core Web Vitals Monitoring

Track the metrics that matter:

```javascript
// web-vitals-test.js
import { getLCP, getFID, getCLS, getFCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const { name, value, delta, id } = metric;
  // Send to your analytics endpoint
  console.log({ name, value, delta, id });
}

getLCP(sendToAnalytics);
getFID(sendToAnalytics);
getCLS(sendToAnalytics);
getFCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Performance Budget Testing

Enforce performance budgets:

```json
// budget.json
[
  {
    "path": "/*",
    "timings": [
      { "metric": "first-contentful-paint", "budget": 2000 },
      { "metric": "largest-contentful-paint", "budget": 2500 },
      { "metric": "interactive", "budget": 3000 }
    ],
    "resourceSizes": [
      { "resourceType": "script", "budget": 300 },
      { "resourceType": "image", "budget": 500 },
      { "resourceType": "total", "budget": 1000 }
    ]
  }
]
```

### Bundle Size Analysis

Monitor JavaScript bundle sizes:

```bash
# Using webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer

# Add to webpack config
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html'
    })
  ]
};
```

## Accessibility Testing

### Automated Accessibility Audits

Use tools like axe-core to catch a11y issues:

```javascript
// Install: npm install --save-dev @axe-core/cli

// Run accessibility audit
axe https://your-app.com --save results.json

// Or integrate with jest-axe for component testing
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('component should have no accessibility violations', async () => {
  const { container } = render(<YourComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### WCAG Compliance Testing

Validate against WCAG 2.1 Level AA standards:

```javascript
// pa11y for automated testing
const pa11y = require('pa11y');

async function runAccessibilityTest() {
  const results = await pa11y('https://your-app.com', {
    standard: 'WCAG2AA',
    runners: ['axe', 'htmlcs']
  });
  
  console.log(`Issues found: ${results.issues.length}`);
  results.issues.forEach(issue => {
    console.log(`${issue.type}: ${issue.message}`);
  });
}
```

### Keyboard Navigation Testing

Ensure full keyboard accessibility:

```javascript
// Test keyboard navigation patterns
test('interactive elements are keyboard accessible', () => {
  render(<NavigationMenu />);
  
  const firstButton = screen.getByRole('button', { name: /menu/i });
  firstButton.focus();
  
  // Tab should move focus to next element
  userEvent.tab();
  expect(screen.getByRole('link', { name: /home/i })).toHaveFocus();
  
  // Enter/Space should activate
  userEvent.keyboard('{Enter}');
  expect(mockNavigate).toHaveBeenCalled();
});
```

### Screen Reader Testing

Manual testing checklist:
- ✅ All images have appropriate alt text
- ✅ Form inputs have associated labels
- ✅ Interactive elements have accessible names
- ✅ Dynamic content changes are announced
- ✅ Skip links for navigation
- ✅ Landmarks are properly used (header, nav, main, footer)

### Color Contrast Testing

```javascript
// Use tools like axe to validate color contrast
test('maintain sufficient color contrast', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container, {
    rules: {
      'color-contrast': { enabled: true }
    }
  });
  expect(results).toHaveNoViolations();
});
```

## Component Testing (Framework-Agnostic)

### Testing Principles

#### 1. Test User Behavior, Not Implementation

❌ **Don't test internal state:**
```javascript
test('state updates correctly', () => {
  const wrapper = shallow(<Component />);
  wrapper.instance().setState({ value: 'test' });
  expect(wrapper.state().value).toBe('test');
});
```

✅ **Do test user-visible behavior:**
```javascript
test('displays updated value when user types', () => {
  render(<Component />);
  const input = screen.getByRole('textbox');
  userEvent.type(input, 'test');
  expect(screen.getByDisplayValue('test')).toBeInTheDocument();
});
```

#### 2. Query by Accessibility

Use queries that match how users interact:

```javascript
// Best: By role (accessible to all)
screen.getByRole('button', { name: /submit/i });

// Good: By label (semantic)
screen.getByLabelText('Email address');

// OK: By placeholder  
screen.getByPlaceholderText('Enter email...');

// Last resort: By test ID
screen.getByTestId('submit-btn');
```

### Framework Examples

#### React (with Testing Library)
```javascript
import { render, screen, userEvent } from '@testing-library/react';

test('button triggers action on click', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  const button = screen.getByRole('button');
  userEvent.click(button);
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

#### Vue (with Vue Test Utils)
```javascript
import { mount } from '@vue/test-utils';

test('button triggers action on click', async () => {
  const wrapper = mount(Button, {
    props: { label: 'Click me' }
  });
  
  await wrapper.find('button').trigger('click');
  
  expect(wrapper.emitted('click')).toHaveLength(1);
});
```

#### Web Components (with Testing Library)
```javascript
import { fixture, expect } from '@open-wc/testing';

test('custom element renders correctly', async () => {
  const el = await fixture('<my-button>Click me</my-button>');
  
  expect(el.shadowRoot.querySelector('button')).to.exist;
  expect(el.shadowRoot.textContent).to.include('Click me');
});
```

### Run Performance Audits

```bash
# Lighthouse CLI
lighthouse https://your-app.com --output=json --output-path=./report.json

# With specific categories
lighthouse https://your-app.com --only-categories=performance,accessibility
```

### Run Accessibility Tests

```bash
# axe-core CLI
axe https://your-app.com

# pa11y
pa11y https://your-app.com --standard WCAG2AA
```

### Run Component Tests

```bash
npm test
```

### Run Bundle Analysis

```bash
# webpack-bundle-analyzer
npm run build -- --analyze

# Or source-map-explorer
source-map-explorer 'build/static/js/*.js'
```

## Quality-Driven Workflow with AI

### Step 1: Identify Optimization Opportunity

```
You: "Run Lighthouse audit on our homepage and identify the top 3 
performance issues."

Copilot: "Based on the Lighthouse report:
1. Large JavaScript bundles (1.2MB)
2. Images not optimized (no WebP, no lazy loading)
3. Render-blocking CSS"
```

### Step 2: Measure Baseline

```
You: "What are our current Core Web Vitals scores?"

Copilot: "Current metrics:
- LCP: 4.2s (Poor - target < 2.5s)
- FID: 180ms (Needs improvement - target < 100ms)  
- CLS: 0.15 (Needs improvement - target < 0.1)"
```

### Step 3: Implement Optimization

```
You: "Help me implement lazy loading for images in our gallery component."

Copilot: [Provides implementation with loading="lazy" attribute]
```

### Step 4: Validate Impact

```bash
# Re-run Lighthouse
lighthouse https://your-app.com --output=json
```

```
You: "Compare before/after metrics."

Copilot: "Improvement:
- LCP: 4.2s → 2.8s (-33%)
- Performance score: 45 → 72 (+60%)"
```

### Step 5: Monitor and Iterate

```
You: "Set up Lighthouse CI to prevent regression."

Copilot: [Provides CI configuration]
```

## Common Testing Patterns

### Testing Performance Improvements

```javascript
// Before optimization
test('component renders within performance budget', async () => {
  const start = performance.now();
  render(<HeavyComponent data={largeDataset} />);
  const duration = performance.now() - start;
  
  expect(duration).toBeLessThan(100); // 100ms budget
});
```

### Testing Lazy Loading

```javascript
test('images use lazy loading', () => {
  render(<Gallery images={images} />);
  const imgs = screen.getAllByRole('img');
  
  imgs.forEach(img => {
    expect(img).toHaveAttribute('loading', 'lazy');
  });
});
```

### Testing Accessibility Features

```javascript
test('focus management works correctly', () => {
  render(<Modal />);
  
  const closeButton = screen.getByRole('button', { name: /close/i });
  
  // Modal should trap focus
  userEvent.tab();
  expect(closeButton).toHaveFocus();
  
  // Escape closes modal
  userEvent.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
```

### Testing Code Splitting

```javascript
// Verify dynamic imports
test('component is code-split', async () => {
  const { default: LazyComponent } = await import('./LazyComponent');
  
  render(<LazyComponent />);
  expect(screen.getByText('Lazy content')).toBeInTheDocument();
});
```

## Debugging Performance Issues

### 1. Use Chrome DevTools Performance Panel

```
1. Open DevTools → Performance tab
2. Start recording
3. Interact with your app
4. Stop recording
5. Analyze:
   - Long tasks (> 50ms)
   - Layout shifts
   - Excessive re-renders
```

### 2. Lighthouse Reports

```
Lighthouse identifies:
- Render-blocking resources
- Unused JavaScript
- Large DOM size
- Image optimization opportunities
```

### 3. Bundle Analysis

```bash
# Identify large dependencies
npm run build -- --analyze

# Look for:
- Duplicate dependencies
- Unnecessarily large libraries
- Moment.js (use date-fns or dayjs instead)
- Lodash (use specific imports)
```

### 4. Ask AI for Analysis

```
You: "I'm seeing a 300ms rendering delay. Here's the component: [paste code]
What's causing the performance issue?"

Copilot: "The issue is in the useEffect that runs on every render..."
```

### 5. Web Vitals Debugging

```javascript
// Add debugging for Core Web Vitals
import { onCLS, onFID, onLCP } from 'web-vitals';

onLCP(console.log, { reportAllChanges: true });
onFID(console.log, { reportAllChanges: true });
onCLS(console.log, { reportAllChanges: true });
```

## Quality Testing Best Practices

### Organize by Quality Area

```javascript
describe('Performance', () => {
  describe('Bundle Size', () => {
    test('main bundle is under 200KB', ...);
    test('vendor bundle is code-split', ...);
  });
  
  describe('Rendering', () => {
    test('initial render completes within 100ms', ...);
    test('no unnecessary re-renders', ...);
  });
});

describe('Accessibility', () => {
  describe('Keyboard Navigation', () => {
    test('all interactive elements are keyboard accessible', ...);
    test('focus order is logical', ...);
  });
  
  describe('Screen Readers', () => {
    test('images have alt text', ...);
    test('form inputs have labels', ...);
  });
});
```

### Use Descriptive Test Names

❌ **Vague:**
```javascript
test('works', ...);
test('performance ok', ...);
```

✅ **Clear:**
```javascript
test('lazy loads images below the fold', ...);
test('maintains LCP under 2.5s on 3G', ...);
test('passes WCAG 2.1 Level AA color contrast', ...);
```

### Set Performance Budgets

```javascript
const BUDGETS = {
  LCP: 2500, // milliseconds
  FID: 100,
  CLS: 0.1,
  mainBundle: 200 * 1024, // bytes
  vendorBundle: 300 * 1024
};

test('meets performance budgets', () => {
  const metrics = getMetrics();
  expect(metrics.lcp).toBeLessThan(BUDGETS.LCP);
  expect(metrics.bundleSize).toBeLessThan(BUDGETS.mainBundle);
});
```

## Success Criteria

You understand quality testing when you can:

- ✅ Run Lighthouse audits and interpret results
- ✅ Measure and optimize Core Web Vitals
- ✅ Identify and fix accessibility violations
- ✅ Analyze bundle sizes and reduce bloat
- ✅ Test component behavior across frameworks
- ✅ Set up automated quality gates in CI/CD
- ✅ Use AI assistants to optimize performance
- ✅ Monitor quality metrics over time

## Remember

> "Quality isn't a feature—it's a practice. Performance, accessibility, and
> best practices must be continuously measured, validated, and improved.
> Automated testing ensures your optimizations work and quality doesn't regress."

Happy optimizing! 🚀⚡

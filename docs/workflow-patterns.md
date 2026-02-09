# Agentic Development Workflow Patterns

## Overview

**Agentic Development** refers to working with AI coding assistants as collaborative agents in iterative, feedback-driven development cycles. This document outlines key workflow patterns you'll practice in Session 5.

## Core Principles

1. **Iterative Problem Solving**: Break large problems into small, verifiable steps
2. **Continuous Validation**: Test after every change to maintain confidence
3. **Feedback-Driven**: Let tests, compilers, and runtime errors guide your next action
4. **Incremental Progress**: Small, working steps beat large, broken changes
5. **Human-in-the-Loop**: You remain the decision-maker; AI is your tool

---

## Pattern 1: Quality-Driven Development Cycle

### The Measure-Optimize-Validate Loop

```
1. MEASURE   → Identify quality baseline (Lighthouse, a11y audit)
2. OPTIMIZE  → Implement improvement
3. VALIDATE  → Verify impact with metrics
4. REFACTOR  → Clean up implementation
5. REPEAT    → Move to next optimization
```

### Workflow with AI

1. **Measure Baseline**

   ```bash
   lighthouse https://your-app.com --output=json
   ```

   - Review Lighthouse scores
   - Identify Core Web Vitals
   - Note accessibility violations
   - Ask Copilot: "Analyze this Lighthouse report and prioritize top 3 issues"

2. **Implement Optimization**

   - Focus on highest-impact issue first
   - Ask Copilot: "How can I reduce my LCP from 4.2s to under 2.5s?"
   - Implement suggested changes incrementally

3. **Validate Impact**

   ```bash
   lighthouse https://your-app.com --output=json
   ```

   - Compare before/after metrics
   - Verify improvement meets target
   - Check for unintended side effects

4. **Refactor if Needed**

   - Ask Copilot: "Can this lazy-loading implementation be simplified?"
   - Ensure code remains maintainable
   - Document optimization for team

5. **Move to Next Issue**
   - Commit working optimization
   - Tackle next quality issue

### Example Conversation with Copilot

```
You: "Run a Lighthouse audit and show me the performance issues."
Copilot: [Shows Lighthouse results]
- Performance: 45/100
- LCP: 4.2s (Poor)
- Largest cause: Unoptimized hero image (2.3MB)

You: "Help me optimize this hero image. Here's the current img tag:
<img src='hero.jpg' alt='Hero' />"

Copilot: [Provides optimized solution]
<picture>
  <source srcset='hero.webp' type='image/webp' />
  <source srcset='hero.jpg' type='image/jpeg' />
  <img src='hero.jpg' alt='Hero' loading='eager' 
       fetchpriority='high' width='1200' height='600' />
</picture>

You: "Apply this change and re-run Lighthouse."
[LCP improved: 4.2s → 2.1s ✓]

You: "Perfect! Now let's tackle the unused JavaScript issue."
```

---

## Pattern 2: Code Quality and Lint Resolution Loop

### The Error-Fix-Verify Cycle

```
1. RUN LINT → Identify errors (ESLint, a11y linters)
2. ANALYZE  → Understand each error
3. FIX      → Correct one error at a time
4. VERIFY   → Re-run to confirm fix
5. REPEAT   → Until clean
```

### Workflow with AI

1. **Run Linters**

   ```bash
   npm run lint
   npm run lint:a11y  # eslint-plugin-jsx-a11y
   ```

2. **Triage Errors**

   - Copy error messages to Copilot
   - Ask: "Explain these linting errors and their impact on accessibility/performance"

3. **Fix Systematically**

   - Fix by category (e.g., all a11y issues, then performance)
   - Ask Copilot: "Fix all missing alt text errors in this component"

4. **Verify Each Fix**

   ```bash
   npm run lint
   ```

5. **Commit When Clean**
   - Clean code is a prerequisite for the next optimization
   - Quality gates should pass before merging

### Example ESLint + Accessibility Workflow

```
Terminal Output:
  15:7  error  img elements must have an alt prop  jsx-a11y/alt-text
  22:9  warning  Avoid importing the entire lodash library  import/no-extraneous-dependencies
  45:3  error  onClick used without onKeyDown  jsx-a11y/click-events-have-key-events

You: "I have these lint errors. Help me fix them properly."

Copilot:
1. Add alt text: <img src='...' alt='Product thumbnail' />
2. Use specific lodash import: import debounce from 'lodash/debounce'
3. Add keyboard support:
   <div onClick={handler} onKeyDown={handler} role='button' tabIndex={0}>

You: "Apply these fixes."
[Copilot edits code]

You: "Run lint again to verify."
[All errors resolved ✓]
```

---

## Pattern 3: Feature Optimization Planning and Execution

### The Plan-Build-Test-Fix Cycle

```
1. PLAN    → Break optimization into steps
2. BUILD   → Implement one step
3. TEST    → Verify step improves metrics
4. FIX     → Debug issues
5. REPEAT  → Next step
```

### Workflow with AI

1. **Create Optimization Plan**

   ```
   You: "I need to implement code splitting for our app. 
   Create a step-by-step plan to reduce bundle size."

   Copilot:
   1. Analyze current bundle composition
   2. Identify route-based split points
   3. Implement dynamic imports for routes
   4. Add loading states for lazy components
   5. Code-split heavy third-party libraries
   6. Measure bundle size reduction
   7. Set up bundle size monitoring
   ```

2. **Implement Step-by-Step**

   ```
   You: "Implement step 1 and 2: analyze bundle and identify split points."
   [Copilot runs webpack-bundle-analyzer]
   
   Copilot:
   - Main bundle: 1.2MB
   - Largest: chart.js (300KB), lodash (100KB)
   - Routes: Home, Dashboard, Settings, Reports

   You: "Good! Now implement step 3: dynamic imports for routes."
   ```

3. **Test Each Step**

   ```bash
   # After each change
   npm run build
   ls -lh build/static/js/*.js
   lighthouse https://localhost:3000
   ```

4. **Iterate Based on Feedback**

   ```
   Terminal: Bundle size reduced from 1.2MB to 800KB

   You: "Great progress! Now let's tackle the chart.js library 
   in step 5. What alternatives exist?"
   
   Copilot: "Consider Chart.js alternatives:
   - recharts: 180KB (React-specific)
   - apex-charts: 150KB
   - lightweight-charts: 50KB (limited features)
   
   Or use dynamic import for chart.js:
   const Chart = lazy(() => import('chart.js'));"
   ```

### Benefits of This Approach

- ✅ Smaller changes = easier to measure impact
- ✅ Each step can be validated independently  
- ✅ Clear progress markers
- ✅ Easy to roll back if optimization hurts UX
- ✅ Builds understanding incrementally

---

## Pattern 4: Performance Testing and Debugging

### The Run-Observe-Fix-Rerun Cycle

```
1. RUN APP     → Start application
2. OBSERVE     → Test performance manually
3. PROFILE     → Use DevTools to identify bottlenecks
4. FIX         → Correct specific problem
5. RERUN       → Verify fix improves metrics
6. REPEAT      → Until performance targets met
```

### Workflow with AI

1. **Start Application**

   ```bash
   npm run dev
   # Open Chrome DevTools → Performance tab
   ```

2. **Test Performance Scenarios**

   - Page load (cold start)
   - Route transitions
   - Data fetching
   - User interactions (typing, scrolling)
   - Check Core Web Vitals in DevTools

3. **Document Issues**

   ```
   You: "I'm seeing a 500ms delay when clicking the filter button.
   Here's the component code: [paste FilterButton.jsx]
   
   And here's the Performance profile screenshot.
   What's causing the delay?"

   Copilot: "The bottleneck is in the filterData function:
   1. It processes entire 10,000-item array on every click
   2. Uses inefficient .filter() chaining
   3. Causes re-render of all child components
   
   Solutions:
   - Memoize filterData with useMemo
   - Use React.memo for child components
   - Consider virtualization for large lists"
   ```

4. **Fix and Retest**

   ```
   You: "Implement the memoization solution."
   [Copilot provides optimized code]

   You: "Record another Performance profile."
   [Delay reduced: 500ms → 50ms ✓]
   ```

5. **Test Integration Points**
   - Does optimization maintain correct behavior?
   - Are loading states still shown?
   - Does it work with different data sizes?
   - Are all edge cases handled?

---

## Pattern 5: Performance Bottleneck Investigation

### The Isolate-Reproduce-Fix Cycle

```
1. ISOLATE     → Narrow down problem location
2. REPRODUCE   → Create minimal test case
3. HYPOTHESIZE → Form theory about cause
4. TEST        → Verify hypothesis with profiling
5. FIX         → Implement solution
6. VALIDATE    → Confirm fix improves metrics
```

### Workflow with AI

1. **Describe the Problem Clearly**

   ```
   You: "Our dashboard page has a 3-second lag when loading.
   Here's the main component: [paste Dashboard.jsx]
   
   Performance profile shows:
   - Long Task: 2800ms in useEffect
   - Memory spike: 150MB allocated
   
   What's causing this?"
   ```

2. **Ask for Analysis**

   ```
   Copilot: "The bottleneck is in the data processing:
   
   Line 45: processChartData() runs on every render
   Line 67: Heavy calculation inside render (not memoized)
   Line 89: Creating new objects in map() on every render
   
   Root cause: Missing optimization hooks
   
   Solutions:
   1. Wrap processChartData in useMemo with proper dependencies
   2. Memoize heavy calculations
   3. Move object creation outside render or memoize
   4. Consider moving processing to Web Worker for large datasets"
   ```

3. **Implement Fix**

   ```
   You: "Implement solution 1, 2, and 3 first."
   
   [Copilot refactors with useMemo, React.memo]
   ```

4. **Create Test to Prevent Regression**
   ```
   You: "Add a performance test that fails if rendering takes > 100ms."
   
   [Copilot adds performance test]
   ```

5. **Validate**
   ```bash
   # Before: 3000ms load time
   # After: 450ms load time
   # Improvement: 85% faster ✓
   ```

---

## Best Practices for AI-Assisted Workflows

### DO ✅

- **Be Specific**: "Optimize LCP for hero image" vs "Make it faster"
- **Provide Context**: Share Lighthouse reports, DevTools profiles, relevant code
- **Ask for Explanation**: "Why is this slow?" before "Make this faster"
- **Verify Each Step**: Re-run Lighthouse/tests after each optimization
- **Commit Frequently**: Save working optimizations
- **Break Down Problems**: Tackle one metric at a time
- **Measure Impact**: Always compare before/after metrics

### DON'T ❌

- **Don't Optimize Blindly**: Always measure first
- **Don't Skip Testing**: Verify optimizations don't break functionality
- **Don't Batch Changes**: Multiple optimizations = unclear which helped
- **Don't Ignore Metrics**: Data over intuition
- **Don't Rush**: Premature optimization wastes time
- **Don't Sacrifice Accessibility**: Performance shouldn't harm a11y

---

## Practice Exercises

Use these prompts with Copilot to practice each pattern:

### Quality-Driven Exercise

```
"Run a Lighthouse audit on our homepage. Identify the top 3 performance 
issues and create an optimization plan. Let's implement them one by one."
```

### Lint Exercise

```
"Run ESLint with jsx-a11y plugin and explain each accessibility error. 
Then fix them systematically, verifying after each fix."
```

### Optimization Exercise

```
"Our bundle size is 1.5MB. Analyze the bundle, create a detailed plan 
to reduce it below 500KB, then implement step-by-step, measuring after 
each change."
```

### Performance Exercise

```
"Profile our dashboard page and identify why it takes 3 seconds to load. 
Document any bottlenecks, then optimize them one at a time."
```

### Debug Exercise

```
"Our LCP score is 5.2s but we've already optimized images. Help debug 
this by analyzing the Critical Rendering Path and proposing fixes."
```

---

## Measuring Success

You're mastering agentic workflows when:

- ✅ You naturally break optimizations into measurable steps
- ✅ You run Lighthouse/tests frequently and automatically
- ✅ You understand performance metrics and use them to guide optimizations
- ✅ You can explain each optimization and its impact
- ✅ You commit working optimizations regularly
- ✅ You catch performance regressions early through continuous monitoring
- ✅ You collaborate effectively with AI by providing metrics and context
- ✅ You balance performance, accessibility, and maintainability

---

## Remember

> "The goal isn't to get AI to optimize all your code. The goal is to develop
> a reliable, repeatable workflow where AI helps you build faster, more
> accessible, and higher-performing applications through systematic quality
> improvements."

Good luck, and happy optimizing! 🚀⚡

# Prompt Files Catalog

This directory contains reusable prompt files for common development workflows. Prompts provide structured, repeatable workflows that can be invoked from GitHub Copilot Chat.

## Available Prompts

---

### Web Quality & Performance

#### [lighthouse-audit.prompt.md](lighthouse-audit.prompt.md)
**Purpose**: Run comprehensive Lighthouse audit and receive prioritized optimization recommendations

**Use When**:
- Starting performance optimization work
- Validating improvements after changes
- Establishing baseline metrics
- Prioritizing optimization efforts

**Usage**:
```
@workspace /lighthouse-audit https://my-app.com
```

**Or prompt for URL**:
```
Run the lighthouse audit prompt
```

**What It Does**:
1. Runs Lighthouse audit with all categories (Performance, Accessibility, Best Practices, SEO)
2. Analyzes results and identifies top 3-5 issues
3. Prioritizes by Impact × Effort matrix
4. Provides actionable implementation plan with code examples
5. Suggests validation steps
6. Offers to implement optimizations

**Output**: Actionable optimization plan with before/after code examples and expected impact metrics

---

#### [accessibility-review.prompt.md](accessibility-review.prompt.md)
**Purpose**: Comprehensive accessibility audit using WCAG 2.1 Level AA standards

**Use When**:
- Reviewing new components for accessibility
- Fixing accessibility violations
- Ensuring WCAG compliance
- Preparing for accessibility audits

**Usage**:
```
@workspace /accessibility-review
```

**With selection**:
```
[Select component code]
@workspace /accessibility-review
```

**With URL**:
```
@workspace /accessibility-review https://my-app.com
```

**What It Does**:
1. Runs automated accessibility checks (pa11y, eslint-plugin-jsx-a11y)
2. Manual code review for WCAG violations:
   - Semantic HTML
   - Keyboard navigation
   - ARIA attributes
   - Color contrast
   - Form accessibility
   - Images and alt text
   - Dynamic content
3. Prioritizes issues by severity (Critical, High, Medium, Low)
4. Provides before/after code fixes with explanations
5. Simulates screen reader experience
6. Generates accessibility audit report

**Output**: Detailed accessibility report with prioritized fixes and testing checklist

---

#### [performance-optimization.prompt.md](performance-optimization.prompt.md)
**Purpose**: Systematic performance improvement using Measure-Optimize-Validate loop

**~~`performance-optimization.prompt.md` - Guided performance improvement workflow~~ ✅
- ~~`core-web-vitals.prompt.md` - Check and optimize Core Web Vitals~~ ✅
- Want guided workflow through performance optimization
- Following structured approach to performance gains
- Validating impact of optimizations incrementally

**Usage**:
```
@workspace /performance-optimization https://my-app.com
```

**What It Does**:
1. Detects existing build tools and framework
2. Measures baseline performance (Lighthouse, bundle analysis)
3. Identifies highest-impact optimization opportunities
4. Guides through implementing one optimization at a time
5. Validates improvement with metrics
6. Documents findings and moves to next issue

**Output**: Iterative performance improvements with measurable results

---

#### [core-web-vitals.prompt.md](core-web-vitals.prompt.md)
**Purpose**: Focus specifically on Core Web Vitals (LCP, INP, CLS) optimization

**Use When**:
- Core Web Vitals are failing Google's thresholds  
- Preparing for search ranking improvements
- Targeting specific CWV metrics
- Setting up performance budgets and monitoring

**Usage**:
```
@workspace /core-web-vitals https://my-app.com
```

**What It Does**:
1. Measures current LCP, INP, and CLS metrics
2. Provides targeted fixes for each failing metric:
   - LCP: Image optimization, render-blocking resources, TTFB
   - INP: Code splitting, event handler optimization, JS execution time
   - CLS: Image dimensions, font loading, dynamic content spacing
3. Validates improvements meet "good" thresholds
4. Sets up Real User Monitoring (RUM)
5. Configures performance budgets for CI/CD

**Output**: Core Web Vitals meeting Google's "good" thresholds (≤ 2.5s, ≤ 200ms, ≤ 0.1)

---

#### [image-optimization.prompt.md](image-optimization.prompt.md)
**Purpose**: Optimize images for web performance - format selection, sizing, lazy loading, CDN delivery

**Use When**:
- Images are causing slow LCP (Largest Contentful Paint)
- Need to reduce page weight/bandwidth usage
- Implementing responsive images for multiple screen sizes
- Setting up image lazy loading strategy

**Usage**:
```
@workspace /image-optimization
```

**What It Does**:
1. Audits current image usage (formats, sizes, dimensions)
2. Recommends optimal image formats (WebP/AVIF vs JPEG/PNG)
3. Implements responsive images with `<picture>` and `srcset`
4. Sets up lazy loading (native `loading="lazy"` or Intersection Observer)
5. Configures build tool integration (Vite, Webpack, Next.js)
6. Prevents Cumulative Layout Shift with proper dimensions
7. Recommends CDN services for automatic optimization

**Output**: Optimized images reducing LCP by 20-50% and page weight by 30-60%

---

#### [bundle-analysis.prompt.md](bundle-analysis.prompt.md)
**Purpose**: Analyze and optimize JavaScript bundle size - code splitting, tree shaking, lazy loading

**Use When**:
- JavaScript bundles are too large (>250KB initial load)
- Time to Interactive (TTI) is slow
- Need to implement code splitting strategy
- Want to replace heavy dependencies with lighter alternatives

**Usage**:
```
@workspace /bundle-analysis
```

**What It Does**:
1. Detects build tool (Vite, Webpack, Next.js, Astro)
2. Generates bundle analysis visualization
3. Identifies oversized dependencies and suggests alternatives
4. Implements route-based and component-based code splitting
5. Enables tree shaking and dead code elimination
6. Optimizes third-party scripts (async/defer loading)
7. Sets performance budgets in build configuration

**Output**: Reduced bundle sizes (≤250KB initial), improved TTI by 20-40%, optimized code splitting

---

#### [react-component-review.prompt.md](react-component-review.prompt.md)
**Purpose**: Comprehensive review of React components against best practices, performance, accessibility

**Use When**:
- Reviewing existing React component for quality
- Want detailed feedback on component structure
- Checking for React anti-patterns
- Ensuring accessibility and performance best practices
- Preparing component for production

**Usage**:
```
@workspace /react-component-review
```

**With selection**:
```
[Select React component code]
@workspace /react-component-review
```

**What It Does**:
1. Reviews component structure and organization
2. Analyzes state management (useState, proper initialization)
3. Checks performance patterns (memo, useMemo, useCallback, code splitting)
4. Validates accessibility (semantic HTML, ARIA, keyboard navigation)
5. Reviews error handling (loading, error, empty states)
6. Assesses testability with React Testing Library
7. Checks TypeScript types (if applicable)
8. Identifies common anti-patterns (mutations, missing keys, inline objects)

**Output**: Detailed review with categorized issues (Critical, High, Medium, Low) and code examples for fixes

---

#### [react-optimize-renders.prompt.md](react-optimize-renders.prompt.md)
**Purpose**: Find and fix unnecessary React re-renders to improve performance

**Use When**:
- React app feels sluggish or has UI jank
- Components re-rendering unnecessarily
- Want to optimize performance with memoization
- Need to diagnose re-render causes

**Usage**:
```
@workspace /react-optimize-renders
```

**With component**:
```
[Select React component]
@workspace /react-optimize-renders
```

**What It Does**:
1. Guides through React DevTools Profiler usage
2. Identifies anti-patterns causing unnecessary re-renders:
   - Inline object/array creation in props
   - Missing useCallback for functions passed to children
   - Context updates triggering all consumers
   - Missing React.memo for expensive components
3. Provides before/after code fixes
4. Recommends optimization strategies (component splitting, virtualization)
5. Includes diagnostic hooks and debugging tools

**Output**: Specific fixes for re-render issues with measurable performance improvements

---

#### [code-review.prompt.md](code-review.prompt.md)
**Purpose**: Comprehensive code review across 8 dimensions - architecture, quality, performance, security, accessibility, testing, maintainability, best practices

**Use When**:
- Conducting code review before merge
- Auditing codebase quality
- Preparing for production release
- Teaching best practices to team

**Usage**:
```
@workspace /code-review
```

**With file or selection**:
```
[Select code to review]
@workspace /code-review
```

**What It Does**:
1. **Architecture**: SOLID principles, design patterns, separation of concerns
2. **Quality**: Readability, naming, complexity (cyclomatic < 10), DRY
3. **Performance**: Algorithm efficiency, memory management, N+1 queries
4. **Security**: Input validation, XSS/injection prevention, auth checks
5. **Accessibility**: WCAG compliance, semantic HTML, keyboard navigation
6. **Testing**: Coverage, testability, quality of tests
7. **Maintainability**: Error handling, documentation, no magic numbers
8. **Best Practices**: Framework patterns, language idioms, no anti-patterns

**Output**: Prioritized issues (Critical/High/Medium/Low) with code examples and fix recommendations

---

## Coming Soon

### Performance Optimization
- ~~`performance-optimization.prompt.md`~~ ✅
- ~~`core-web-vitals.prompt.md`~~ ✅
- ~~`image-optimization.prompt.md`~~ ✅
- ~~`bundle-analysis.prompt.md`~~ ✅

### React Development
- ~~`react-component-review.prompt.md` - Review component for best practices~~ ✅
- ~~`react-optimize-renders.prompt.md` - Find and fix unnecessary re-renders~~ ✅
- `react-hook-migration.prompt.md` - Migrate class to functional components
- `react-state-refactor.prompt.md` - Improve state management
- `react-accessibility.prompt.md` - React-specific a11y patterns

### Code Quality
- ~~`code-review.prompt.md` - Comprehensive code review checklist~~ ✅
- `refactor-guide.prompt.md` - Step-by-step refactoring assistance
- `debug-session.prompt.md` - Structured debugging workflow
- `test-generation.prompt.md` - Generate tests for components

### Documentation
- `document-component.prompt.md` - Component documentation generation
- `document-api.prompt.md` - API documentation helper
- `readme-generator.prompt.md` - Project README creation

---

## How to Use Prompt Files

### Basic Usage

**Run a prompt**:
```
@workspace /prompt-name
```

**With variables**:
```
@workspace /lighthouse-audit https://example.com
```

**Interactive (prompt will ask for inputs)**:
```
Run the lighthouse audit prompt
> Enter URL to audit: https://example.com
```

### Variables in Prompts

Prompts can use these variables:

- `${input:variableName}` - Prompt user for input
- `${selection}` - Currently selected text in editor
- `${file}` - Current file path
- `${workspaceFolder}` - Project root directory

**Example**:
```markdown
---
description: Example prompt
---

Run analysis on ${input:url} using ${workspaceFolder} as context
```

### Prompt Modes

Prompts can run in different modes:

- `mode: ask` - Simple Q&A, returns text response
- `mode: edit` - Makes code changes
- `mode: agent` - Multi-step workflow with tool invocation (most common)

### Specifying Tools

Limit which tools the prompt can use:

```yaml
---
tools: ["codebase", "search", "runCommands", "editFiles"]
---
```

**Available Tools**:
- `codebase` - Search and understand codebase
- `search` - Semantic search
- `fetch` - Fetch web content
- `usages` - Find code usages
- `problems` - Check for errors
- `editFiles` - Edit files
- `createFile` - Create new files
- `runCommands` - Execute terminal commands
- `getTerminalOutput` - Get command output
- `testFailure` - Access test failure information

### Tool Sets

Use predefined tool sets from `.vscode/settings.json`:

```yaml
---
tools: ["web-quality", "readonly", "editFiles"]
---
```

**Defined Tool Sets**:
- `readonly` - Non-modifying tools (codebase, search, fetch, usages, problems)
- `web-quality` - Web quality MCP tools (when available)
- `react-dev` - React development MCP tools (when available)

---

## Creating New Prompt Files

### Template

```markdown
---
description: Brief description shown in prompt picker
mode: agent
tools: ["codebase", "search", "editFiles", "runCommands"]
---

# Prompt Title

One-line description of what this prompt does.

## Workflow

### Step 1: [Step Name]

What happens in this step...

### Step 2: [Next Step]

What happens next...

## Variables

- `${input:name}` - Description of input
- `${selection}` - How selection is used

## Success Criteria

✅ What should be accomplished  
✅ What outputs are provided  

## Example Usage

\```
@workspace /prompt-name arg1 arg2
\```

## References

- [Related docs]
```

### Best Practices

**DO**:
✅ Start with clear description in frontmatter
✅ Break workflow into numbered steps
✅ Explain what each step accomplishes
✅ Provide example usage
✅ List success criteria
✅ Reference related documentation

**DON'T**:
❌ Create overly complex prompts (split into multiple)
❌ Assume context without variables
❌ Skip validation steps
❌ Forget to document expected inputs/outputs

### Testing New Prompts

1. **Create prompt file** in `.github/prompts/`
2. **Reload VS Code** (Cmd+Shift+P → "Developer: Reload Window")
3. **Test in chat**: `@workspace /prompt-name`
4. **Iterate** based on results
5. **Document** in this README

---

## Prompt Development Workflow

### 1. Identify Repetitive Task

When you find yourself doing the same workflow multiple times, consider creating a prompt.

**Good candidates**:
- Multi-step processes (audit → analyze → recommend → implement)
- Workflows requiring specific tool sequences
- Tasks with consistent structure but variable inputs
- Quality checks that need standardization

### 2. Design Workflow Steps

Map out the workflow:
```
1. Gather context (codebase, files)
2. Analyze situation
3. Identify issues
4. Provide recommendations
5. Implement fixes
6. Validate results
```

### 3. Create Prompt File

Use template above, focusing on:
- Clear step-by-step instructions
- Conditional logic ("If X, do Y")
- Expected inputs and outputs
- Success criteria

### 4. Test and Refine

Run prompt multiple times with different inputs:
- Does it handle missing inputs gracefully?
- Are outputs actionable?
- Does it stay focused on the task?

### 5. Document and Share

Add to this README with:
- Purpose and use cases
- Example usage
- Expected outputs
- Related prompts

---

## Integration with Chat Modes

Chat modes can reference and suggest prompt files:

```markdown
# In .github/chatmodes/frontend-developer.chatmode.md

User: "I keep running Lighthouse audits manually"
You: "Let's use the lighthouse-audit prompt file:"
→ Suggest: @workspace /lighthouse-audit
```

---

## References

- [VS Code Prompt Files Documentation](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
- [Project Testing Guidelines](../../docs/testing-guidelines.md)
- [Workflow Patterns](../../docs/workflow-patterns.md)
- [Frontend Developer Chat Mode](../.github/chatmodes/frontend-developer.chatmode.md)

---

**Last Updated**: 2026-02-09  
**Prompts Available**: 9 (lighthouse-audit, accessibility-review, performance-optimization, core-web-vitals, image-optimization, bundle-analysis, react-component-review, react-optimize-renders, code-review)  
**Prompts Planned**: 15+  

_This README is updated as new prompt files are created._

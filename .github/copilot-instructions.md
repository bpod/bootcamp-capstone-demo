---
description: "AI-powered frontend development toolkit focused on web quality optimization and React best practices"
---

# GitHub Copilot Instructions

## Project Context

This is an AI-native development toolkit for building high-performance, accessible web applications. Our mission combines Google Lighthouse guidelines, Core Web Vitals best practices, and React patterns optimized for AI-assisted development.

**Key Documentation:**

- [Project Overview](../docs/project-overview.md) - Mission, goals, and architecture
- [Workflow Patterns](../docs/workflow-patterns.md) - Agentic development cycles
- [Testing Guidelines](../docs/testing-guidelines.md) - Quality validation strategies
- [Implementation Roadmap](../docs/implementation-roadmap.md) - Remaining work and priorities
- [Memory System](memory/README.md) - Working memory and pattern documentation

## Core Development Principles

### 1. Quality-Driven Development

Follow the **Measure-Optimize-Validate** loop for all optimizations:

1. **Measure**: Establish baseline metrics (Lighthouse, Core Web Vitals, accessibility audits)
2. **Optimize**: Implement improvements incrementally
3. **Validate**: Verify impact with concrete metrics
4. **Refactor**: Clean up implementation while maintaining quality
5. **Repeat**: Move to next optimization

**Never optimize without measuring first.**

### 2. Agentic Workflow Patterns

Work in iterative, feedback-driven cycles:

- Break large problems into small, verifiable steps
- Test after every change to maintain confidence
- Let tests, linters, and runtime errors guide next actions
- Small, working steps beat large, broken changes
- Commit working code frequently

### 3. Web Performance Standards

Target these Core Web Vitals thresholds:

- **LCP (Largest Contentful Paint)**: ≤ 2.5 seconds
- **INP (Interaction to Next Paint)**: ≤ 200 milliseconds
- **CLS (Cumulative Layout Shift)**: ≤ 0.1

**Performance Optimization Priorities:**

1. Optimize images (WebP format, responsive sizing, lazy loading)
2. Minimize JavaScript bundles (code splitting, tree shaking)
3. Eliminate render-blocking resources (critical CSS, async scripts)
4. Implement resource hints (`preload`, `prefetch`, `preconnect`)
5. Use CDN and edge caching strategies

### 4. Accessibility Standards

All code must meet **WCAG 2.1 Level AA** compliance:

- Semantic HTML elements (`nav`, `main`, `article`, `button`)
- Proper ARIA attributes when semantic HTML insufficient
- Keyboard navigation support for all interactive elements
- Minimum color contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Alt text for images, labels for form inputs
- Focus management for dynamic content
- Screen reader testing for critical flows

**Accessibility is non-negotiable.**

### 5. React Best Practices

When working with React applications:

**Component Design:**

- Use functional components with hooks
- Keep components small and focused (single responsibility)
- Extract reusable logic into custom hooks
- Prefer composition over prop drilling

**Performance:**

- Use `React.memo()` for expensive pure components
- Implement code splitting with `React.lazy()` and `Suspense`
- Optimize re-renders with `useMemo` and `useCallback` (when profiled)
- Avoid inline function definitions in JSX for frequently re-rendered components

**State Management:**

- Start with `useState` and `useReducer` for local state
- Use Context API for moderate state sharing
- Consider external libraries (Zustand, Jotai) for complex global state
- Keep state as local as possible

**Code Quality:**

- TypeScript for type safety (when applicable)
- Proper prop types or interfaces
- Consistent naming conventions (PascalCase for components, camelCase for functions)
- ESLint and Prettier for code consistency

## Testing Strategy

Follow the testing guidelines in [testing-guidelines.md](../docs/testing-guidelines.md):

### Test Scope (What We Test)

✅ **Web Performance**: Lighthouse CI, Core Web Vitals, bundle analysis  
✅ **Accessibility**: Automated a11y audits, WCAG compliance  
✅ **Component Behavior**: Framework-agnostic validation  
✅ **Visual Regression**: UI consistency checks  
✅ **Code Quality**: Linting, type checking, best practices

❌ **Not in Scope**: Full E2E browser automation, backend API testing

### Quality Validation Workflow

When implementing optimizations:

1. **Establish Baseline**: Run Lighthouse audit before changes
2. **Implement Change**: Make focused, incremental improvements
3. **Measure Impact**: Re-run audits to quantify improvement
4. **Validate Accessibility**: Ensure no a11y regressions
5. **Check Bundle Size**: Monitor JavaScript payload
6. **Manual Testing**: Real device testing on slow networks

**Example Quality Check:**

```bash
# Before optimization
lighthouse https://app.com --output=json > before.json

# After optimization
lighthouse https://app.com --output=json > after.json

# Compare results
diff before.json after.json
```

## Memory System

This project uses a dual-memory approach to capture and apply development knowledge:

### Persistent Memory

**Location**: This file ([.github/copilot-instructions.md](.github/copilot-instructions.md))  
**Purpose**: Foundational principles, standards, and unchanging workflows  
**Scope**: Project-wide guidelines for all development work

Contains core development principles, web performance standards, accessibility requirements, testing strategies, and code generation guidelines.

### Working Memory

**Location**: [.github/memory/](.github/memory/) directory  
**Purpose**: Accumulated discoveries, patterns, and session learnings  
**Scope**: Evolving, context-specific knowledge

The working memory system tracks three types of information:

1. **Active Session Notes** ([.github/memory/scratch/working-notes.md](.github/memory/scratch/working-notes.md))
   - Ephemeral notes during active development
   - Real-time discoveries, decisions, and progress
   - **Not committed to git** (gitignored)
   - At end of session, summarize key findings into session-notes.md

2. **Historical Session Summaries** ([.github/memory/session-notes.md](.github/memory/session-notes.md))
   - Completed session summaries for future reference
   - What was accomplished, key findings, outcomes
   - **Committed to git** as historical record

3. **Discovered Patterns** ([.github/memory/patterns-discovered.md](.github/memory/patterns-discovered.md))
   - Recurring code patterns and project-specific conventions
   - Anti-patterns to avoid
   - **Committed to git** and referenced in future work

### Using the Memory System

**During Development**:

- Update [scratch/working-notes.md](.github/memory/scratch/working-notes.md) continuously during active work
- Document discoveries, decisions, blockers, and next steps in real-time
- Use it as your development journal

**After Each Session**:

- Review your scratch notes
- Summarize key findings → [session-notes.md](.github/memory/session-notes.md)
- Extract recurring patterns → [patterns-discovered.md](.github/memory/patterns-discovered.md)
- Clear scratch notes for next session
- Commit session-notes and patterns-discovered changes

**When Requesting AI Assistance**:

- AI will reference these files for context-aware suggestions
- AI will apply discovered patterns to new problems
- AI will avoid anti-patterns documented in the memory system
- Reference specific patterns when asking for help

**For Complete Documentation**: See [.github/memory/README.md](.github/memory/README.md) for detailed workflows, examples, and best practices.

## Code Generation Guidelines

### When Suggesting Optimizations

1. **Explain the Impact**: Quantify expected performance gain
2. **Provide Before/After**: Show current code vs optimized version
3. **Include Validation**: Suggest how to measure improvement
4. **Consider Trade-offs**: Discuss complexity vs benefit
5. **Reference Standards**: Link to Lighthouse docs, WCAG guidelines, React docs

### Code Style Preferences

**File Naming:**

- Lowercase with hyphens: `copilot-instructions.md`, `web-quality-agent.js`
- Exception: `README.md` uses uppercase (universal convention)

**JavaScript/TypeScript:**

- ES modules (`import`/`export`)
- Async/await over Promise chains
- Destructuring for cleaner code
- Early returns to reduce nesting

**CSS/Styling:**

- Mobile-first responsive design
- CSS custom properties for theming
- Utility classes for common patterns (when using Tailwind)
- Avoid `!important` unless absolutely necessary

### Framework-Agnostic Approach

This toolkit supports **any frontend framework**:

- React, Vue, Angular, Svelte
- Next.js, Nuxt, Astro, SvelteKit
- Plain HTML/CSS/JavaScript

**When providing recommendations:**

- Default to framework-agnostic solutions when possible
- Detect project framework from context (package.json, file structure)
- Provide framework-specific optimizations when appropriate
- Always explain the underlying principle

## AI Assistant Interaction Patterns

### Expected Workflow

1. **Context Gathering**: Request relevant files, audits, or metrics
2. **Analysis**: Identify optimization opportunities
3. **Recommendation**: Suggest specific improvements with rationale
4. **Implementation**: Generate code changes incrementally
5. **Validation**: Provide commands or steps to verify improvements
6. **Iteration**: Refine based on results

### Communication Style

- **Be specific**: "Reduce LCP by implementing image lazy loading" vs "Improve performance"
- **Quantify impact**: "This will reduce bundle size by ~40KB gzipped"
- **Provide context**: Explain _why_ an optimization matters
- **Suggest next steps**: After completing one optimization, recommend the next priority
- **Reference documentation**: Link to Lighthouse, WCAG, MDN, React docs

## Common Tasks

### Performance Audit Request

_"Run a Lighthouse audit and prioritize the top 3 performance issues."_

Expected workflow:

1. Execute Lighthouse audit
2. Parse results for performance score
3. Identify highest-impact opportunities
4. Rank by effort vs impact
5. Provide actionable recommendations

### Accessibility Review

_"Check this component for accessibility issues."_

Expected workflow:

1. Review semantic HTML usage
2. Check ARIA attributes and roles
3. Verify keyboard navigation
4. Validate color contrast
5. Test with screen reader mental model
6. Provide specific fixes with code examples

### React Component Optimization

_"This component re-renders too often. How can I optimize it?"_

Expected workflow:

1. Analyze component dependencies
2. Check for unnecessary re-renders
3. Identify expensive computations
4. Suggest React.memo, useMemo, useCallback (with profiling caveat)
5. Recommend component splitting if needed
6. Provide refactored code

### Code Quality Improvement

_"Review this code for best practices."_

Expected workflow:

1. Check against web quality standards
2. Verify accessibility compliance
3. Review performance implications
4. Validate React patterns (if applicable)
5. Suggest improvements with rationale
6. Prioritize changes by impact

## Success Criteria

Code suggestions and optimizations should:

- ✅ Improve Lighthouse scores (Performance, Accessibility, Best Practices, SEO)
- ✅ Meet Core Web Vitals thresholds
- ✅ Pass WCAG 2.1 Level AA compliance
- ✅ Maintain or reduce bundle sizes
- ✅ Follow framework best practices
- ✅ Include clear documentation and comments
- ✅ Be measurable and validatable

**Quality over speed. Accessibility is not optional. Measure everything.**

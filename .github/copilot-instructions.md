---
description: "AI-powered frontend development toolkit focused on web quality optimization and React best practices"
---

# GitHub Copilot Instructions

## Project Context

This is an AI-native development toolkit for building high-performance, accessible web applications. Our mission combines Google Lighthouse guidelines, Core Web Vitals best practices, and React patterns optimized for AI-assisted development.

**Core Architecture**: This toolkit uses a **plug-in architecture** designed to integrate with any existing frontend project. It detects and adapts to the user's current stack (build tools, test frameworks, component libraries) rather than requiring specific tools or configurations.

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

### 3. Plug-In Architecture Principle

**Detect, Don't Prescribe:**

- **Always detect existing tools** before making recommendations (check package.json, config files)
- **Adapt to user's stack**: If they use Vite, reference Vite; if Webpack, reference Webpack
- **Never require tool changes**: Work with their existing build tools, test frameworks, and libraries
- **Use universal tools**: Lighthouse CLI, axe-core, browser DevTools work everywhere
- **Framework-agnostic guidance**: Principles apply across React, Vue, Angular, Svelte, etc.
- **Prefer native features**: Suggest web platform features over framework-specific solutions when possible

**Example Detection:**

```javascript
// Check package.json for existing tools
- Has "vite"? → Reference Vite commands and config
- Has "vitest"? → Use Vitest examples (vi.fn(), etc.)
- Has "webpack"? → Reference webpack config and plugins
- Has "@testing-library/react"? → Use RTL patterns
```

**When Tool Preference Needed:**

- If recommending new setup (rare), mention: "If you need to add [category], Vite/Vitest are good modern choices"
- Always frame as suggestion, not requirement
- Explain why (fast, modern, good DX) but acknowledge alternatives

### 4. Web Performance Standards

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

### 5. Accessibility Standards

All code must meet **WCAG 2.1 Level AA** compliance:

- Semantic HTML elements (`nav`, `main`, `article`, `button`)
- Proper ARIA attributes when semantic HTML insufficient
- Keyboard navigation support for all interactive elements
- Minimum color contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Alt text for images, labels for form inputs
- Focus management for dynamic content
- Screen reader testing for critical flows

**Accessibility is non-negotiable.**

### 6. React Best Practices

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

**Location**: This file (`.github/copilot-instructions.md`)  
**Purpose**: Foundational principles, standards, and unchanging workflows  
**Scope**: Project-wide guidelines for all development work

Contains core development principles, web performance standards, accessibility requirements, testing strategies, and code generation guidelines.

### Working Memory

**Location**: [memory/](memory/) directory  
**Purpose**: Accumulated discoveries, patterns, and session learnings  
**Scope**: Evolving, context-specific knowledge

The working memory system tracks three types of information:

1. **Active Session Notes** ([memory/scratch/working-notes.md](memory/scratch/working-notes.md))
   - Ephemeral notes during active development
   - Real-time discoveries, decisions, and progress
   - **Not committed to git** (gitignored)
   - At end of session, summarize key findings into session-notes.md

2. **Historical Session Summaries** ([memory/session-notes.md](memory/session-notes.md))
   - Completed session summaries for future reference
   - What was accomplished, key findings, outcomes
   - **Committed to git** as historical record

3. **Discovered Patterns** ([memory/patterns-discovered.md](memory/patterns-discovered.md))
   - Recurring code patterns and project-specific conventions
   - Anti-patterns to avoid
   - **Committed to git** and referenced in future work

### Using the Memory System

**During Development**:

- Update [memory/scratch/working-notes.md](memory/scratch/working-notes.md) continuously during active work
- Document discoveries, decisions, blockers, and next steps in real-time
- Use it as your development journal

**After Each Session**:

- Review your scratch notes
- Summarize key findings → [memory/session-notes.md](memory/session-notes.md)
- Extract recurring patterns → [memory/patterns-discovered.md](memory/patterns-discovered.md)
- Clear scratch notes for next session
- Commit session-notes and patterns-discovered changes

**When Requesting AI Assistance**:

- AI will reference these files for context-aware suggestions
- AI will apply discovered patterns to new problems
- AI will avoid anti-patterns documented in the memory system
- Reference specific patterns when asking for help

**For Complete Documentation**: See [memory/README.md](memory/README.md) for detailed workflows, examples, and best practices.

## Tool Sets

This project uses **tool sets** to organize and control which tools are available in different contexts. Tool sets group related capabilities to reduce noise and improve focus during specialized workflows.

### Configured Tool Sets

Three tool sets are defined in `.vscode/settings.json`:

#### 1. `readonly` - Code Exploration

**Purpose**: Safe, non-mutating operations for code analysis and search.

**Tools**:

- `codebase` - Semantic search across workspace
- `search` - Text/regex search in files
- `fetch` - Retrieve web content
- `usages` - Find references/definitions
- `problems` - View compile/lint errors

**When to Use**:

- Code review workflows
- Understanding existing codebases
- Planning refactoring without making changes
- Documentation generation

#### 2. `web-quality` - Performance & Accessibility

**Purpose**: Web quality optimization and validation workflows.

**Tools** (requires MCP server implementation):

- `lighthouse_audit` - Run Lighthouse performance audits
- `analyze_performance` - Core Web Vitals analysis
- `check_accessibility` - WCAG 2.1 Level AA compliance checks
- `optimize_images` - Image format and loading recommendations
- `analyze_bundle` - JavaScript bundle size analysis

**When to Use**:

- Performance optimization workflows
- Accessibility audits
- Pre-deployment quality checks
- Core Web Vitals monitoring

**Status**: Infrastructure ready, awaiting MCP server implementation. See [mcp-setup.md](../docs/mcp-setup.md) for details.

#### 3. `react-dev` - React Development

**Purpose**: React-specific development assistance and pattern recommendations.

**Tools** (requires MCP server implementation):

- `review_component` - React component best practices analysis
- `suggest_hooks` - Hook usage patterns and recommendations
- `detect_anti_patterns` - Identify React anti-patterns
- `optimize_renders` - Find unnecessary re-renders
- `suggest_state_management` - State management strategy recommendations

**When to Use**:

- React component development
- Performance optimization (React-specific)
- Code review for React patterns
- Refactoring class components to hooks

**Status**: Infrastructure ready, awaiting MCP server implementation. See [mcp-setup.md](../docs/mcp-setup.md) for details.

### Using Tool Sets in Chat Modes

Chat modes can specify which tool sets to use via the `tools` property in their frontmatter:

```markdown
---
description: "Performance optimization specialist"
tools: ["readonly", "web-quality"]
---
```

This restricts the mode to only tools from those sets, keeping the interaction focused.

### Using Tool Sets in Prompts

Prompt files can also specify tool sets:

```markdown
---
description: "Run Lighthouse audit"
tools: ["web-quality"]
---
```

### Adding New Tool Sets

To create a new tool set, add it to `.vscode/settings.json`:

```jsonc
"chat.toolSets": {
  "my-custom-set": [
    "codebase",
    "my_mcp_tool"
  ]
}
```

Then reference it in chat modes or prompts by name.

### MCP Integration

Tool sets can include both built-in VS Code tools and MCP server tools. When MCP servers are configured in `.vscode/mcp.json`, their tools become available and can be grouped into tool sets for easier management.

**See Also**:

- [MCP Setup Guide](../docs/mcp-setup.md) - Configure MCP servers
- [Chat Modes](chatmodes/) - Specialized agents using tool sets
- [Prompt Files](prompts/) - On-demand workflows with tool sets

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

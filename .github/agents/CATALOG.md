# Agents Catalog

This catalog provides an overview of all available AI agent specializations in the toolkit. Each agent is optimized for specific development workflows with pre-configured tools and expertise.

## Quick Reference

| Agent                     | Specialization                                          | Primary Use Cases                       |
| ------------------------- | ------------------------------------------------------- | --------------------------------------- |
| **frontend-developer**    | General frontend development, web quality, performance  | Most common workflows, default agent    |
| **accessibility-expert**  | WCAG compliance, a11y testing, inclusive design         | Accessibility audits and fixes          |
| **performance-tuner**     | Performance optimization, Core Web Vitals, monitoring   | Speed optimization, metrics improvement |
| **testing-specialist**    | TDD, test generation, RTL patterns                      | Writing tests, improving coverage       |
| **copilot-customization** | GitHub Copilot setup, prompt/agent/instruction creation | Extending this toolkit                  |

---

## frontend-developer.agent.md

### Description

Specialized agent for high-performance, accessible frontend development with web quality optimization

### Expertise

- **Web Performance**: Lighthouse audits, Core Web Vitals, performance optimization
- **Accessibility**: WCAG 2.1 Level AA compliance, a11y testing
- **React Development**: Component design, hooks, state management, performance
- **Testing**: Framework-agnostic testing, TDD workflows
- **Security**: OWASP Top 10, secure coding practices
- **Build Tools**: Vite, Webpack, Next.js (adapts to your stack)

### Tools Available

- `codebase` - Search and understand code semantically
- `fetch` - Retrieve web resources and documentation
- `usages` - Find all usages of functions, components, variables
- `search` - Fast text/regex search
- `problems` - View compile/lint errors
- `editFiles` - Make code changes
- `createFile` - Create new files
- `runCommands` - Execute terminal commands
- `getTerminalOutput` - Check command results

### When to Use

- **Default agent** for most development tasks
- General frontend development work
- Web quality optimization
- React component development
- Performance troubleshooting
- Accessibility improvements
- Build configuration
- General code reviews

### Example Usage

```
Switch to frontend-developer agent for general development work
"Review this component for React best practices"
"Help me optimize the Lighthouse performance score"
"Set up a new React component with TypeScript"
```

### Recommended Prompts

- lighthouse-audit.prompt.md
- accessibility-check.prompt.md
- component-review.prompt.md
- code-review.prompt.md
- performance-check.prompt.md

---

## accessibility-expert.agent.md

### Description

WCAG 2.1 Level AA compliance specialist focused on inclusive, accessible web experiences

### Expertise

- **WCAG Compliance**: Level A and AA success criteria
- **Automated Testing**: axe-core, Lighthouse accessibility, Pa11y
- **Manual Testing**: Screen readers (NVDA, JAWS, VoiceOver), keyboard navigation
- **ARIA Patterns**: Proper ARIA usage, semantic HTML
- **Inclusive Design**: Color contrast, focus management, form accessibility
- **Testing Tools**: Chrome DevTools, accessibility tree inspection

### Tools Available

- `codebase` - Analyze code for a11y issues
- `search` - Find accessibility patterns
- `problems` - View accessibility linting errors
- `runCommands` - Run axe-core audits
- `getTerminalOutput` - Review automated test results
- `editFiles` - Fix accessibility issues
- `createFile` - Create accessible components

### When to Use

- **Accessibility audits** before launches
- **WCAG compliance** requirements
- **Screen reader testing** guidance
- **Keyboard navigation** issues
- **Color contrast** problems
- **Form accessibility** improvements
- **ARIA patterns** implementation
- **Inclusive design** reviews

### Example Usage

```
Switch to accessibility-expert for a11y-focused work
"Audit this checkout flow for WCAG 2.1 Level AA compliance"
"Fix keyboard navigation in this modal dialog"
"Review color contrast across the app"
```

### Recommended Prompts

- accessibility-check.prompt.md
- component-review.prompt.md (for React component accessibility)

### Key Patterns

- Always prioritize semantic HTML over ARIA
- Test with actual assistive technologies
- Focus management for dynamic content
- Color contrast ratios: 4.5:1 normal text, 3:1 large text
- Keyboard-only navigation for all interactive elements

---

## performance-tuner.agent.md

### Description

Performance optimization specialist focused on Core Web Vitals, bundle size, and runtime performance

### Expertise

- **Core Web Vitals**: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1
- **Performance Budgets**: Budget definition, enforcement, monitoring
- **Bundle Optimization**: Code splitting, tree shaking, dynamic imports
- **Image Optimization**: WebP, responsive images, lazy loading
- **Runtime Performance**: React profiling, render optimization, memoization
- **Network Performance**: Resource hints, caching strategies, CDN optimization

### Tools Available

- `codebase` - Analyze code for performance issues
- `search` - Find performance patterns
- `runCommands` - Run Lighthouse, bundle analysis
- `getTerminalOutput` - Review performance metrics
- `editFiles` - Implement optimizations
- `createFile` - Create optimized components
- `problems` - View performance warnings

### When to Use

- **Lighthouse scores** below target
- **Core Web Vitals** failing
- **Bundle size** too large (> 200KB gzipped)
- **LCP** > 2.5 seconds
- **INP** > 200 milliseconds
- **CLS** > 0.1
- **Performance budgets** setup
- **Image optimization** needed

### Example Usage

```
Switch to performance-tuner for speed optimization
"My Lighthouse performance score is 42. Help me reach 90+"
"Reduce bundle size - currently 500KB gzipped"
"Fix LCP - it's 4.8 seconds"
```

### Recommended Prompts

- lighthouse-audit.prompt.md
- performance-check.prompt.md

### Performance Thresholds

| Metric | Good    | Needs Improvement | Poor    |
| ------ | ------- | ----------------- | ------- |
| LCP    | ≤ 2.5s  | 2.5s - 4.0s       | > 4.0s  |
| INP    | ≤ 200ms | 200ms - 500ms     | > 500ms |
| CLS    | ≤ 0.1   | 0.1 - 0.25        | > 0.25  |

---

## testing-specialist.agent.md

### Description

Test-driven development expert specializing in React Testing Library, framework-agnostic testing, and comprehensive test coverage

### Expertise

- **TDD Workflows**: RED-GREEN-REFACTOR cycle
- **React Testing Library**: User-centric testing, best practices
- **Framework-Agnostic**: Adapts to Vitest, Jest, Mocha, or your test framework
- **Test Coverage**: Achieving meaningful coverage (not just numbers)
- **Testing Patterns**: Unit, integration, component, accessibility tests
- **Test Quality**: Avoiding common pitfalls, maintainable tests

### Tools Available

- `codebase` - Understand code to test
- `search` - Find existing test patterns
- `problems` - View test failures
- `runCommands` - Execute test suites
- `testFailure` - Analyze test failures
- `editFiles` - Write/update tests
- `createFile` - Create new test files

### When to Use

- **Writing new tests** for features/components
- **TDD workflows** (write tests first)
- **Improving test coverage** (<80% target)
- **Fixing failing tests**
- **Refactoring tests** for maintainability
- **Learning testing patterns**
- **Accessibility testing** with RTL
- **Test reviews** and quality improvements

### Example Usage

```
Switch to testing-specialist for test-related work
"Generate comprehensive tests for this useAuth hook"
"Help me write a test-first implementation for this feature"
"Why is this test failing? Help me debug it"
```

### Recommended Prompts

- code-review.prompt.md (includes testing recommendations)

### Testing Principles

1. **Test behavior, not implementation** - Focus on what users see/do
2. **Framework detection first** - Check package.json before suggesting commands
3. **Meaningful coverage** - 80%+ coverage of critical paths
4. **Accessibility in tests** - Use RTL queries that match user experience
5. **Avoid testing libraries** - Don't test React/framework internals
6. **Maintainable tests** - Clear, focused, easy to understand

---

## copilot-customization.agent.md

### Description

Expert in GitHub Copilot customizations for VS Code - creating prompts, agents, instructions, and MCP servers

### Expertise

- **Custom Instructions**: `.github/copilot-instructions.md`, `*.instructions.md`
- **Prompt Files**: `.prompt.md` with variables and templates
- **Chat Agents**: `.agent.md` (formerly `.chatmode.md`)
- **MCP Servers**: Model Context Protocol integration
- **Tool Sets**: Grouping and managing available tools
- **VS Code API**: Latest Copilot customization features

### Tools Available

- `codebase` - Understand existing customizations
- `search` - Find patterns in prompts/agents
- `editFiles` - Update customizations
- `createFile` - Create new customizations
- `runCommands` - Test configurations
- `problems` - Debug customization issues

### When to Use

- **Creating new prompts** for team workflows
- **Building custom agents** for specialized tasks
- **Writing instructions files** for auto-apply guidance
- **Setting up MCP servers** for external integrations
- **Extending this toolkit** with new capabilities
- **Debugging customizations** that aren't working
- **Migrating chatmodes** to new agent API

### Example Usage

```
Switch to copilot-customization for extending the toolkit
"Create a new prompt for GraphQL schema generation"
"Build an agent specialized in Tailwind CSS"
"Set up an MCP server for our internal API"
```

### File Types

- **Instructions**: Auto-apply to matching files (via `applyTo` pattern)
- **Prompts**: On-demand, reusable workflows with variables
- **Agents**: Specialist AI with specific tools and expertise
- **MCP Servers**: External tool integration (databases, APIs, etc.)

### Configuration Locations

- **Workspace**: `.github/prompts/`, `.github/agents/`, `.github/instructions/`
- **User Profile**: `~/.vscode/` for personal customizations
- **MCP Config**: `.vscode/mcp.json` for Model Context Protocol servers

---

## Switching Between Agents

### In VS Code Chat

**Method 1: Agent Picker**

1. Open GitHub Copilot Chat
2. Click the agent icon (👤) in the chat input
3. Select the agent you want

**Method 2: @ Mention**

1. Type `@` in the chat input
2. Select the agent from the dropdown
3. Continue typing your question

**Method 3: Command Palette**

1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "GitHub Copilot: Select Agent"
3. Choose the agent

### Best Practices

**Use the Right Agent for the Task**:

- General development → **frontend-developer**
- Accessibility work → **accessibility-expert**
- Performance issues → **performance-tuner**
- Writing tests → **testing-specialist**
- Extending toolkit → **copilot-customization**

**Agents Remember Context**:

- Agent stays active for the current chat session
- Switch agents mid-conversation if needed
- Agents have access to full conversation history

**Combining Agents and Prompts**:

- Switch to appropriate agent
- Run relevant prompt
- Example: @performance-tuner + lighthouse-audit.prompt.md

---

## Creating Custom Agents

To create a new specialized agent:

1. **Identify the Specialization**: What unique expertise does this agent need?
2. **Define Tools**: Which tools are essential for this workflow?
3. **Write Instructions**: Clear guidelines for the agent's behavior
4. **Create the File**: `.github/agents/your-agent-name.agent.md`
5. **Test Thoroughly**: Try various scenarios
6. **Document**: Add to this catalog

**Template**:

```markdown
---
description: Brief description of agent's specialization
tools:
  - codebase
  - search
  - editFiles
  # ... other tools
---

# Agent Name

## Expertise

- Area 1
- Area 2

## Guidelines

- Guideline 1
- Guideline 2

## Common Workflows

1. Workflow 1
2. Workflow 2
```

---

## Support

For questions or issues:

- See [Quick Start Guide](../../docs/quick-start.md)
- Review [Project Documentation](../../docs/)
- Check [Prompts Catalog](../prompts/CATALOG.md)
- See [CONTRIBUTING.md](../../CONTRIBUTING.md)

# Prompts Catalog

This catalog provides an overview of all available prompt files in the toolkit. Each prompt is a reusable workflow for specific development tasks.

## Quick Reference

| Category | Prompts | Total |
|----------|---------|-------|
| **Web Quality** | lighthouse-audit, accessibility-review, performance-optimization, core-web-vitals, image-optimization, bundle-analysis, performance-budget, browser-compatibility | 8 |
| **React** | component-review, optimize-renders, hook-migration, state-refactor, accessibility | 5 |
| **Code Quality** | code-review, refactor-guide, test-generation, debug-session | 4 |
| **Security** | security-review | 1 |
| **Documentation** | document-component, document-api, readme-generator | 3 |
| **Total** | | **21** |

---

## Web Quality Prompts

### lighthouse-audit.prompt.md
**Description**: Run comprehensive Lighthouse audit and get actionable optimization recommendations  
**Use Case**: Initial performance assessment, identifying optimization opportunities  
**Agent**: frontend-developer  
**Tools**: codebase, runCommands, getTerminalOutput, editFiles, search  
**When to Use**:
- Starting a new performance optimization initiative
- Preparing for production deployment
- Establishing baseline metrics
- Quarterly performance reviews

**Example Usage**: "Run a Lighthouse audit on https://myapp.com and prioritize the top 3 performance issues"

---

### accessibility-review.prompt.md
**Description**: Comprehensive WCAG 2.1 Level AA accessibility audit with automated and manual checks  
**Use Case**: Ensuring accessibility compliance, fixing a11y issues  
**Agent**: accessibility-expert  
**Tools**: codebase, runCommands, getTerminalOutput, editFiles, search, problems  
**When to Use**:
- Before launching new features
- Responding to accessibility complaints
- Legal compliance requirements (ADA, Section 508)
- Quarterly accessibility audits

**Example Usage**: "Review this component for accessibility issues and provide fixes"

---

### performance-optimization.prompt.md
**Description**: Guided performance improvement workflow following measure-optimize-validate loop  
**Use Case**: Systematic performance optimization, reducing load times  
**Agent**: performance-tuner  
**Tools**: codebase, runCommands, getTerminalOutput, editFiles, search  
**When to Use**:
- App feels slow or unresponsive
- High bounce rates due to load times
- Core Web Vitals failing
- Preparing for traffic spikes

**Example Usage**: "My app takes 8 seconds to load. Help me optimize it."

---

### core-web-vitals.prompt.md
**Description**: Check and optimize Core Web Vitals metrics (LCP, INP, CLS)  
**Use Case**: Meeting Google's Core Web Vitals thresholds, improving search ranking  
**Agent**: performance-tuner  
**Tools**: codebase, runCommands, editFiles, search  
**When to Use**:
- LCP > 2.5s, INP > 200ms, or CLS > 0.1
- Google Search Console warnings
- SEO optimization initiatives
- Mobile performance issues

**Example Usage**: "Fix my failing Core Web Vitals - LCP is 4.2 seconds"

---

### image-optimization.prompt.md
**Description**: Optimize images for web (format, size, lazy loading, responsive images)  
**Use Case**: Reducing image payload, improving LCP  
**Agent**: performance-tuner  
**Tools**: codebase, runCommands, editFiles, createFile  
**When to Use**:
- Images are the largest assets in Lighthouse audit
- High data usage on mobile
- Slow image loading
- Implementing responsive images

**Example Usage**: "Optimize all images in my project for web performance"

---

### bundle-analysis.prompt.md
**Description**: Analyze JavaScript bundle size and reduce unnecessary code  
**Use Case**: Reducing bundle size, implementing code splitting  
**Agent**: performance-tuner  
**Tools**: codebase, runCommands, getTerminalOutput, editFiles, search  
**When to Use**:
- Bundle size > 200KB gzipped
- Large vendor chunks
- Lighthouse identifies unused JavaScript
- Initial load time too high

**Example Usage**: "My JavaScript bundle is 500KB. Help me reduce it."

---

### performance-budget.prompt.md
**Description**: Define and enforce performance budgets with CI/CD integration  
**Use Case**: Preventing performance regressions, maintaining speed over time  
**Agent**: performance-tuner  
**Tools**: codebase, runCommands, getTerminalOutput, editFiles, createFile, search  
**When to Use**:
- Establishing performance governance
- Setting up CI/CD performance checks
- Preventing feature bloat
- Maintaining performance SLAs

**Example Usage**: "Set up a performance budget for my e-commerce site with CI/CD enforcement"

---

### browser-compatibility.prompt.md
**Description**: Cross-browser compatibility testing and polyfill strategies  
**Use Case**: Ensuring app works across all target browsers  
**Agent**: frontend-developer  
**Tools**: codebase, runCommands, editFiles, createFile, search, problems  
**When to Use**:
- Supporting older browsers (IE11, Safari < 14)
- User reports of broken functionality in specific browsers
- Implementing modern JavaScript features
- Preparing for international markets

**Example Usage**: "Set up cross-browser compatibility for my app targeting last 2 versions of major browsers"

---

## React Prompts

### react-component-review.prompt.md
**Description**: Comprehensive React component code review covering all best practices  
**Use Case**: Reviewing components for quality, performance, and maintainability  
**Agent**: frontend-developer  
**Tools**: codebase, usages, search, problems  
**When to Use**:
- Pull request reviews
- Refactoring legacy components
- Learning React best practices
- Onboarding new team members

**Example Usage**: "Review this UserProfile component for React best practices"

---

### react-optimize-renders.prompt.md
**Description**: Identify and fix unnecessary re-renders in React applications  
**Use Case**: Improving React app performance, reducing CPU usage  
**Agent**: frontend-developer  
**Tools**: codebase, usages, search, problems, editFiles  
**When to Use**:
- React DevTools shows many unnecessary re-renders
- UI feels sluggish during interactions
- High CPU usage in Chrome DevTools
- Performance profiling shows render bottlenecks

**Example Usage**: "This dashboard re-renders constantly. Help me optimize it."

---

### react-hook-migration.prompt.md
**Description**: Migrate React class components to functional components with hooks  
**Use Case**: Modernizing React codebase, adopting hooks  
**Agent**: frontend-developer  
**Tools**: codebase, usages, search, editFiles, problems  
**When to Use**:
- Legacy class component codebase
- Adopting modern React patterns
- Simplifying component logic
- Enabling custom hooks usage

**Example Usage**: "Migrate this class component to use hooks"

---

### react-state-refactor.prompt.md
**Description**: Refactor React state management for better organization  
**Use Case**: Improving state architecture, fixing prop drilling  
**Agent**: frontend-developer  
**Tools**: codebase, usages, search, editFiles  
**When to Use**:
- Excessive prop drilling (>3 levels)
- State management feels chaotic
- Considering Context API or state library
- Performance issues from state updates

**Example Usage**: "Refactor the state management in this feature to use Context API"

---

### react-accessibility.prompt.md
**Description**: React-specific accessibility patterns and fixes  
**Use Case**: Making React components accessible  
**Agent**: accessibility-expert  
**Tools**: codebase, search, problems, editFiles  
**When to Use**:
- React components failing a11y audits
- Implementing accessible forms/modals/navigation
- Learning React accessibility patterns
- Screen reader testing failures

**Example Usage**: "Make this modal component fully accessible"

---

## Code Quality Prompts

### code-review.prompt.md
**Description**: Comprehensive 8-dimensional code review (readability, performance, security, testing, etc.)  
**Use Case**: Thorough code review before merging  
**Agent**: frontend-developer  
**Tools**: codebase, usages, search, problems  
**When to Use**:
- Pull request reviews
- Pre-merge quality checks
- Code audit initiatives
- Mentoring junior developers

**Example Usage**: "Review this pull request for code quality issues"

---

### refactor-guide.prompt.md
**Description**: Safe refactoring workflows for improving code structure  
**Use Case**: Systematic refactoring, eliminating code smells  
**Agent**: frontend-developer  
**Tools**: codebase, usages, search, editFiles, problems  
**When to Use**:
- Code smells detected (long functions, duplication, etc.)
- Improving maintainability
- Reducing technical debt
- Preparing for new features

**Example Usage**: "This 500-line component needs refactoring. Help me break it down."

---

### test-generation.prompt.md
**Description**: Generate comprehensive tests using testing best practices  
**Use Case**: Writing tests for components, functions, or features  
**Agent**: testing-specialist  
**Tools**: codebase, usages, search, editFiles, createFile, runCommands  
**When to Use**:
- New feature needs test coverage
- Improving test coverage metrics
- Writing tests for legacy code
- Learning testing best practices

**Example Usage**: "Generate tests for this useAuth hook"

---

### debug-session.prompt.md
**Description**: Systematic debugging workflow using scientific method  
**Use Case**: Debugging complex issues, understanding unexpected behavior  
**Agent**: frontend-developer  
**Tools**: codebase, search, problems, runCommands, getTerminalOutput, editFiles  
**When to Use**:
- Bug reports from users/QA
- Unexpected behavior in production
- Intermittent/hard-to-reproduce issues
- Learning debugging techniques

**Example Usage**: "Users report the cart total sometimes shows incorrect values"

---

## Security Prompts

### security-review.prompt.md
**Description**: OWASP Top 10 security audit and vulnerability scanning  
**Use Case**: Security hardening, compliance requirements  
**Agent**: frontend-developer  
**Tools**: codebase, search, runCommands, getTerminalOutput, editFiles, problems  
**When to Use**:
- Pre-production security audit
- Responding to security vulnerabilities
- Compliance requirements (SOC 2, HIPAA, etc.)
- Quarterly security reviews

**Example Usage**: "Audit this app for security vulnerabilities before production deployment"

---

## Documentation Prompts

### document-component.prompt.md
**Description**: Generate comprehensive component documentation with JSDoc/TSDoc  
**Use Case**: Documenting React components for team and consumers  
**Agent**: frontend-developer  
**Tools**: codebase, editFiles, createFile  
**When to Use**:
- Component library development
- Onboarding documentation
- API documentation generation
- Exported components need docs

**Example Usage**: "Document this Button component with props, examples, and accessibility notes"

---

### document-api.prompt.md
**Description**: Create comprehensive API documentation with request/response examples  
**Use Case**: Documenting REST/GraphQL APIs  
**Agent**: frontend-developer  
**Tools**: codebase, editFiles, createFile, search  
**When to Use**:
- Building public APIs
- Internal API documentation
- Frontend-backend communication docs
- OpenAPI/Swagger generation

**Example Usage**: "Document the /api/users endpoints with request/response schemas"

---

### readme-generator.prompt.md
**Description**: Generate comprehensive README with installation, usage, and deployment instructions  
**Use Case**: Creating project documentation  
**Agent**: frontend-developer  
**Tools**: codebase, createFile, search  
**When to Use**:
- New project setup
- Open-source release preparation
- Onboarding documentation
- Portfolio project documentation

**Example Usage**: "Generate a comprehensive README for this React app"

---

## Usage Tips

### How to Use Prompts in VS Code

1. **Command Palette**: Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. **Type**: "Chat: Run Prompt"
3. **Select**: Choose the prompt from the list
4. **Input**: Provide any required variables (e.g., `${selection}`, `${input:url}`)

### Combining Prompts

Many workflows benefit from chaining prompts:

**Example: Performance Optimization Workflow**
1. `lighthouse-audit.prompt.md` - Identify issues
2. `image-optimization.prompt.md` - Fix image issues
3. `bundle-analysis.prompt.md` - Reduce bundle size
4. `core-web-vitals.prompt.md` - Verify CWV improvements
5. `performance-budget.prompt.md` - Prevent regressions

**Example: New Component Workflow**
1. Create component code
2. `react-component-review.prompt.md` - Review quality
3. `test-generation.prompt.md` - Generate tests
4. `react-accessibility.prompt.md` - Add a11y
5. `document-component.prompt.md` - Add documentation

### Customizing Prompts

All prompts are markdown files that can be customized:
- Edit the instructions to match your team's standards
- Add custom validation steps
- Include company-specific requirements
- Reference internal tools or processes

### Creating New Prompts

To create a new prompt:
1. Copy an existing prompt as a template
2. Update the YAML frontmatter (description, agent, tools)
3. Write clear instructions with examples
4. Include success criteria and validation steps
5. Test with real-world scenarios

---

## Tags Reference

| Tag | Prompts |
|-----|---------|
| **performance** | lighthouse-audit, performance-optimization, core-web-vitals, image-optimization, bundle-analysis, performance-budget |
| **accessibility** | accessibility-review, react-accessibility |
| **testing** | test-generation |
| **security** | security-review |
| **react** | react-component-review, react-optimize-renders, react-hook-migration, react-state-refactor, react-accessibility |
| **debugging** | debug-session |
| **refactoring** | refactor-guide, react-state-refactor, react-hook-migration |
| **documentation** | document-component, document-api, readme-generator |
| **code-quality** | code-review, refactor-guide |
| **browser-compatibility** | browser-compatibility |

---

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines on adding new prompts.

## Support

For issues or questions:
- Check the [Quick Start Guide](../../docs/quick-start.md)
- Review [Project Documentation](../../docs/)
- Open an issue on GitHub

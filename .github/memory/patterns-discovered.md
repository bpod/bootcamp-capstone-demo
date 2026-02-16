# Patterns Discovered

## Purpose
This file documents recurring code patterns, anti-patterns, and project-specific conventions discovered during development. Each pattern includes context, the problem it solves, the solution, and examples from the codebase.

**This file is committed to git** and grows as patterns emerge during development.

---

## Pattern Template

Copy this template when documenting a new pattern:

```markdown
## Pattern: [Pattern Name]

**Context**: When and where this pattern applies (specific situations, file types, components)

**Problem**: What problem this pattern solves or what issue it prevents

**Solution**: How to implement the pattern (high-level approach)

**Example**: 
\```javascript
// Code snippet demonstrating the pattern
\```

**Anti-Pattern** (if applicable):
\```javascript
// Code snippet showing what NOT to do
\```

**Related Files**: 
- [file-path.js](../path/to/file.js#L10-L20) (lines 10-20)

**Performance Impact** (if applicable): Quantified improvement or overhead

**When to Use**: Specific conditions or triggers for applying this pattern

**When to Avoid**: Cases where this pattern doesn't apply
```

---

## Pattern: Simple Conversational Prompt Format

**Context**: When creating `.prompt.md` files for GitHub Copilot Chat workflows.

**Problem**: Complex documentation-style prompts with nested headers (##, ###, ####) cause:
1. VS Code UI navigation issues (prompts show up as navigable sections)
2. Prompts read like technical specs instead of actionable instructions
3. Too much structure makes prompts hard to maintain and update
4. Users struggle to understand what the prompt actually does

**Solution**: Use simple, conversational instructions with minimal structure

**Correct Format**:
```markdown
---
description: "Brief, clear description"
agent: specialized-agent-name
tools: ["codebase", "search", "fetch", "usages", "problems"]
---

Direct, conversational instruction about what to analyze.

Check for:
- Key point 1 (brief, actionable)
- Key point 2 (brief, actionable)
- Key point 3 (brief, actionable)

Provide output in this format: [brief description]. Include line numbers and code examples.

Reference: [link to authoritative source]
```

**Anti-Pattern** (Overly Complex):
```markdown
---
description: "Description"
mode: "agent"  # ❌ Deprecated
tools: ["readonly"]  # ❌ Tool set name, not actual tools
---

# Main Heading  # ❌ Adds navigation noise

Long introductory paragraph explaining the prompt's purpose...

## What to Review  # ❌ Nested structure

### 1. Category One  # ❌ Too much nesting
- Detailed explanation
- Multiple sub-points
- Complex descriptions

### 2. Category Two
...

## Output Format  # ❌ Over-documentation

Provide:
1. Thing one
2. Thing two
...

## Success Criteria  # ❌ Unnecessary sections
...

## References
...
```

**Key Principles**:
1. **No heading hierarchy** - Just frontmatter and plain text/bullets
2. **Conversational tone** - "Review X for Y" not "This prompt reviews X by analyzing Y"
3. **Action-focused** - Tell the AI what to do, not how the prompt works
4. **Brief** - 10-15 lines ideal, 20 max
5. **Specific output format** - Clear expectations without over-structuring

**Examples from Fresh Start (2026-02-16)**:

✅ **Good** (code-review.prompt.md - 16 lines):
```markdown
---
description: "General code quality and best practices review"
agent: frontend-developer
tools: ["codebase", "search", "fetch", "usages", "problems"]
---

Review the selected code for quality, maintainability, and best practices.

Check for:
- Code quality (clear naming, small functions, DRY principle)
- Error handling and security (no hardcoded secrets, input validation)
- Performance (efficient algorithms, no bottlenecks)
- Testing and maintainability (testable code, consistent style)

Adapt your review to the framework if applicable (React, TypeScript, Node.js, CSS).

Provide a brief summary, then list issues in order of priority: Critical (must fix), Important (should fix), and Suggestions (nice-to-have). Include line numbers and code snippets. Also mention what's done well.
```

❌ **Bad** (previous version - 82 lines):
```markdown
# Code Review

Perform a comprehensive code review focusing on quality, maintainability, and best practices.

## What to Review

### 1. Code Quality
- Clear and descriptive naming (variables, functions, classes)
- Functions are small and focused (single responsibility)
...

### 2. Error Handling
...

## Framework-Specific Checks
...

## Output Format
...

## Success Criteria
...
```

**When to Use**:
- All new prompt files
- When refactoring existing prompts
- When users report prompt UI/navigation issues

**When to Avoid**:
- Complex multi-step workflows that genuinely need structure (rare)
- Variable-heavy prompts with many ${substitutions} (but still minimize headings)

**Related Patterns**:
- Pattern: Prompt File Agent Specification (assign to specialized agents)
- Pattern: Tool Set vs Individual Tools (use actual tool names, not set names)

**Performance Impact**: 
- Reduced prompt token count by 70-85%
- Faster comprehension by LLM
- Better UI/UX in VS Code (no navigation clutter)

---

## Pattern: Prompt File Agent Specification

**Context**: All prompt files (`.prompt.md`) should specify which specialized agent should execute them via the `agent:` frontmatter property.

**Problem**: Using the generic `agent: "agent"` doesn't leverage the specialized context, tools, and instructions of custom agents we've defined in `.github/agents/`.

**Solution**: Map each prompt to the most appropriate specialized agent based on the prompt's domain expertise. We have 5 custom agents defined.

### Agent Mapping (Current as of Feb 16, 2026 - Fresh Start)

**5 Essential Prompts with Agent Assignments**:

**Performance Tuner** (`performance-tuner`) - 2 prompts:
- lighthouse-audit.prompt.md
- performance-check.prompt.md

**Accessibility Expert** (`accessibility-expert`) - 1 prompt:
- accessibility-check.prompt.md

**Frontend Developer** (`frontend-developer`) - 2 prompts:
- component-review.prompt.md
- code-review.prompt.md

**Note**: Previous 22 prompts archived to `.github/prompts_archived_20260216_140539/`

### Decision Rationale

**Why specialized agents?**
1. **Deeper Context**: Agent brings specialized domain knowledge and patterns
2. **Appropriate Tools**: Agent has domain-specific MCP tools pre-configured
3. **Consistent Expertise**: Same specialized context whether invoked via chat or prompt
4. **Better Results**: Domain-focused agents produce higher-quality recommendations

**Why some stay generic?**
- Security, debugging, and API documentation are cross-cutting concerns
- They apply across languages, frameworks, and tech stacks
- No single specialized agent owns these domains
- Generic `agent` provides flexibility without losing context

### Frontmatter Format

**Correct format** (note: `agent` not `mode`):

```yaml
---
description: "Brief description of prompt purpose"
agent: performance-tuner  # ✅ Specialized agent
tools: ["readonly", "web-quality"]
---
```

**Deprecated format**:

```yaml
---
name: prompt-name  # ❌ Redundant - filename is the identifier
mode: agent        # ❌ Deprecated property - use 'agent:' instead
---
```

### Benefits Observed

1. **Automatic Tool Access**: Prompts inherit agent's MCP tool configuration
2. **Contextual Expertise**: Agent's specialized instructions augment prompt guidance
3. **Consistent Behavior**: Same agent behavior in chat and prompt invocation
4. **Better Discoverability**: Users know which agent handles which domain

**Example**:

```yaml
---
description: "Optimize Core Web Vitals"
agent: performance-tuner  # ✅ Gets performance tuning context, Lighthouse tools
tools: ["readonly", "web-quality"]
---
```

**Anti-Pattern**:

```yaml
---
description: "Optimize Core Web Vitals"
agent: agent  # ❌ Misses specialized performance tuning context
tools: ["readonly", "web-quality"]
---
```

---

## Pattern: Prompt File Frontmatter Format

**Context**: GitHub Copilot prompt files (`.prompt.md`) use YAML frontmatter to configure behavior. The format has evolved and certain properties are deprecated or redundant.

**Problem**: Older documentation shows `name:` and `mode:` properties that are either redundant or deprecated, leading to incorrect prompt file configuration.

**Solution**: Use the current GitHub Copilot prompt frontmatter format (as of Feb 2026):

### Required Properties

```yaml
---
name: Display Name                                      # REQUIRED for UI visibility
description: "Brief description shown in prompt picker" # REQUIRED
agent: agent-name                                       # REQUIRED (or ask/edit)
tools: ["tool1", "tool2"]                              # OPTIONAL but recommended
---
```

### Property Details

**`name:`** (REQUIRED) ⚠️ **CRITICAL**
- **Display name shown in VS Code's prompt picker UI**
- **Without this, prompts will NOT appear in the UI**
- Should be clear and descriptive (3-5 words ideal)
- Examples: "Lighthouse Performance Audit", "Accessibility Review", "Performance Optimization"
- **MUST NOT be duplicated as H1 heading in prompt body** (causes symbol parsing issues)

**`description:`** (REQUIRED)
- Brief description shown when user browses prompts
- Shown in `#` autocomplete menu in Copilot Chat
- Keep concise but descriptive (50-100 characters ideal)

**`agent:`** (REQUIRED)
- Specifies execution mode and/or custom agent
- Values:
  - `agent` - Multi-turn conversational workflow (generic)
  - `ask` - Single-response query (no follow-up conversation)
  - `edit` - Direct code editing workflow
  - Custom agent name: `performance-tuner`, `accessibility-expert`, `frontend-developer`, `testing-specialist`

**`tools:`** (OPTIONAL)
- Array of available tools for this prompt
- Can reference tool sets defined in [.vscode/settings.json](../../.vscode/settings.json)
- Can list individual MCP tools or built-in VS Code tools
- Example: `["readonly", "web-quality"]` references two tool sets

### Deprecated/Removed Properties

**`mode:`** - ❌ DEPRECATED (renamed to `agent:`)
- Older property name for specifying execution mode
- Replaced by `agent:` property
- If present, rename to `agent:`

### Format Examples

**Multi-turn workflow with custom agent:**

```yaml
---
name: Core Web Vitals Optimization
description: Optimize Core Web Vitals (LCP, INP, CLS)
agent: performance-tuner
tools: ["readonly", "web-quality"]
---
```

**Quick single-response query:**

```yaml
---
name: Quick Accessibility Scan
description: Quick accessibility scan
agent: ask
tools: ["readonly", "web-quality"]
---
```

**Code editing workflow:**

```yaml
---
name: Refactor to Hooks
description: Refactor component to use hooks
agent: edit
tools: ["readonly", "react-dev"]
---
```

**Generic multi-turn (cross-cutting concerns):**

```yaml
---
name: Security Review
description: Security review covering OWASP Top 10
agent: agent
tools: ["readonly"]
---
```

### Anti-Patterns

```yaml
---
# ❌ Missing name - prompt won't appear in UI
description: Run Lighthouse audit
agent: performance-tuner
tools: ["readonly", "web-quality"]
---
```

```yaml
---
name: lighthouse-audit              # ✓ Good - has name
mode: agent                         # ❌ Deprecated - use 'agent:' instead
description: Run Lighthouse audit
agent: performance-tuner
tools: ["readonly", "web-quality"]
---
```

### Benefits

1. **UI Visibility**: `name:` ensures prompts appear in VS Code's prompt picker
2. **Clear intent**: `agent:` property explicitly shows execution mode
3. **Better tooling**: VS Code recognizes current format for validation
4. **Organized workflows**: Tool sets group related capabilities
5. **Future-proof**: Aligns with latest GitHub Copilot customization features

**When to Use Each Agent Value**:

- `agent: agent` - Generic multi-turn workflow for cross-cutting concerns
- `agent: ask` - Quick single-answer queries that don't need follow-up
- `agent: edit` - Direct code modifications (rare for our toolkit)
- `agent: <custom-name>` - Specialized workflows that benefit from domain expertise

**Related Files**:
- [.github/prompts/*.prompt.md](../../prompts/) - All prompt files follow this format
- [GitHub Copilot Prompt Files Docs](https://code.visualstudio.com/docs/copilot/customization/prompt-files)

---

## Pattern: Prompt File Body Structure (Industry Standard)

**Context**: GitHub Copilot prompt files need a specific body structure to display correctly in VS Code. After frontmatter, the body should contain simple focused instructions, NOT complex documentation with section headers.

**Problem**: Using markdown section headers (`##`, `###`) in prompt file bodies causes VS Code to parse each section as a separate menu item. For example, a prompt with `## Workflow`, `## Common Pitfalls`, `## Example Usage` sections would appear as 4+ separate items in the `#` autocomplete menu instead of 1 prompt.

**Solution**: Follow the official GitHub Copilot prompt file format from VS Code documentation and the github/awesome-copilot repository:
1. **YAML frontmatter** (description, agent, tools)
2. **Simple task instructions** - NO `##` or `###` section headers
3. **Structure with bold text, bullets, code blocks** - NOT markdown headings
4. **Length: 20-40 lines** typically sufficient (not hundreds)

### Official Format (VS Code Documentation)

**Source**: [VS Code - Prompt Files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)

```markdown
---
description: Brief description
agent: agent-name
tools: ["tool1", "tool2"]
---

[Task description in sentence form, using ${selection} or ${file} variables]

**Your Task**: [Clear objective statement]

**Category 1**: [Guidance using bold, bullets, inline code examples]

**Category 2**: [More guidance]

**Tool Usage**: [Specific tool instructions]

**Success Criteria**: [Measurable outcomes]
```

### Industry Examples (github/awesome-copilot)

**Real-world examples from production repos**:

```markdown
---
description: Create Python quickstart for Dataverse API
agent: ask
tools: ["codebase"]
---

Create Python quickstart code for dataverse api using ${file}.
```
*(13 lines total - simple and focused)*

```markdown
---
description: Optimize React component for performance
agent: frontend-developer
tools: ["readonly", "react-dev"]
---

Analyze ${selection} for React performance anti-patterns: unnecessary re-renders, missing memoization, expensive computations in render.

**Your Task**: Profile component, identify bottlenecks, suggest optimizations (React.memo, useMemo, useCallback) with profiler data justification.

**Check For**:
- Inline object/function definitions in JSX
- Missing dependency arrays in useEffect/useCallback
- Large component trees without code splitting

**Success Criteria**: Profiler shows 50%+ reduction in render time, no prop drilling beyond 2 levels.
```
*(~25 lines - comprehensive but concise)*

### Structure Without Headers

**Use bold text and bullets** for organization, NOT `##` headers:

```markdown
**Workflow**: Measure → Optimize → Validate cycle for all changes.

**Performance Priorities**:
- Optimize images (WebP, lazy loading)
- Minimize JavaScript bundles
- Eliminate render-blocking resources

**Tools**: Run `lighthouse https://site.com` for baseline metrics.
```

**Anti-Pattern (causes menu fragmentation)**:

```markdown
## Workflow

Measure → Optimize → Validate cycle for all changes.

### Step 1: Measure

Run Lighthouse audit...

### Step 2: Optimize

Implement fixes...

## Success Criteria

- LCP < 2.5s
- INP < 200ms
```
*This would create 5+ separate menu items in VS Code!*

### Length Guidelines

**Target: 20-40 lines** (excluding frontmatter)

Most prompts can be simplified to this range while preserving all essential information:
- Before: 700-1200 lines of documentation-style content
- After: 25-35 lines of focused instructions
- **90%+ reduction** with NO loss of essential guidance

**What to Include**:
- Clear task objective
- Key strategies/patterns (bulleted)
- Tool usage instructions (inline)
- Standards references (links)
- Success criteria (measurable)

**What to Omit**:
- Extensive examples (link to docs instead)
- Step-by-step walkthroughs (AI can infer)
- Detailed subsections with headers
- Verbose explanations (be concise)

### Benefits

1. **Correct VS Code Display**: Prompts appear as single items in menu
2. **Faster Loading**: Less text to parse and display
3. **Better UX**: Users see concise descriptions, not overwhelming documentation
4. **Maintainability**: Easier to update and keep consistent
5. **Industry Alignment**: Follows official GitHub Copilot conventions

### Real Before/After Examples

**Before** (359 lines - fragmented into 7+ menu items):
```markdown
---
description: Optimize Core Web Vitals
agent: performance-tuner
tools: ["readonly", "web-quality"]
---

Optimize Core Web Vitals for ${selection} or ${file}.

## Workflow

### Step 1: Measure Baseline
Run Lighthouse audit to establish baseline metrics...

### Step 2: Analyze Results
Review Core Web Vitals scores...

## Core Web Vitals Thresholds

### Largest Contentful Paint (LCP)
...100+ lines of detailed explanation...

### Interaction to Next Paint (INP)
...100+ lines of detailed explanation...

## Optimization Strategies

### Image Optimization
...detailed subsections...

## Success Criteria
...
```

**After** (30 lines - single cohesive prompt):
```markdown
---
description: Optimize Core Web Vitals
agent: performance-tuner
tools: ["readonly", "web-quality"]
---

Optimize Core Web Vitals (LCP, INP, CLS) for ${selection} or ${file} following Measure → Optimize → Validate workflow.

**Your Task**: Run Lighthouse audit, identify worst-performing metrics, implement optimizations targeting LCP < 2.5s, INP < 200ms, CLS < 0.1.

**LCP Optimization**: Optimize images (WebP, lazy loading, responsive sizing), eliminate render-blocking resources (critical CSS, async scripts), use CDN for static assets.

**INP Optimization**: Debounce expensive handlers, code-split large bundles, use web workers for heavy computation, optimize JavaScript execution time.

**CLS Optimization**: Set explicit width/height on images/videos, reserve space for dynamic content, avoid inserting content above existing, use font-display: swap.

**Tools**: `lighthouse https://site.com --output=json` for baseline, Chrome DevTools Performance tab for profiling, web.dev/vitals for thresholds.

**Success Criteria**: All Core Web Vitals in "Good" range (green), Lighthouse Performance score ≥90, no layout shifts on load.
```

**Related Files**:
- [.github/prompts/*.prompt.md](../../prompts/) - All 22 prompts follow this format
- [VS Code Docs - Prompt Files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
- [github/awesome-copilot](https://github.com/github/awesome-copilot) - Real-world prompt examples

**When to Use**: **ALWAYS** when creating or updating prompt files. This is the official standard.

**When to Avoid**: Never - this is the required format for VS Code compatibility.

---

**When to Use Generic Agent**:

- Truly framework/domain-agnostic prompts
- When creating prompts before specialized agents exist
- Documentation or exploration tasks that don't fit existing agents

**Related Files**: 
- [frontend-developer.agent.md](../.github/agents/frontend-developer.agent.md)
- [accessibility-expert.agent.md](../.github/agents/accessibility-expert.agent.md)
- [testing-specialist.agent.md](../.github/agents/testing-specialist.agent.md)
- [copilot-customization.agent.md](../.github/agents/copilot-customization.agent.md)

**When to Revisit**: 
- When creating new specialized agents, audit existing prompts to see if they should use the new agent
- When creating new prompt files, always choose the most appropriate agent

---

## Example Pattern

## Pattern: Service State Initialization

**Context**: Initializing state for data fetched from services/APIs in React components, particularly when using `.map()`, `.filter()`, or other array methods.

**Problem**: Initializing service state with `null` or `undefined` causes runtime errors when array methods are called before data loads. This creates defensive coding burden and inconsistent handling across components.

**Solution**: Initialize service state with an empty array `[]` for collections or empty object `{}` for single entities. This allows array methods to work immediately (returning empty results) and provides consistent behavior during loading states.

**Example**:
```javascript
// ✅ Good: Initialize with empty array
const [users, setUsers] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  fetchUsers().then(data => {
    setUsers(data);
    setIsLoading(false);
  });
}, []);

// No defensive checks needed - .map() works on empty array
return (
  <div>
    {isLoading && <LoadingSpinner />}
    {users.map(user => <UserCard key={user.id} user={user} />)}
  </div>
);
```

**Anti-Pattern**:
```javascript
// ❌ Bad: Initialize with null
const [users, setUsers] = useState(null);

// Requires defensive checks everywhere
return (
  <div>
    {users && users.map(user => <UserCard key={user.id} user={user} />)}
    {/* or */}
    {users?.map(user => <UserCard key={user.id} user={user} />)}
  </div>
);
```

**Related Files**: 
- [src/components/UserDashboard.jsx](../../src/components/UserDashboard.jsx) (example implementation)
- [src/components/ProductList.jsx](../../src/components/ProductList.jsx) (example implementation)

**Performance Impact**: Negligible - empty array allocation is ~8 bytes. Benefit is cleaner code and fewer null checks.

**When to Use**: 
- Any state representing a collection/array from an API
- State used with `.map()`, `.filter()`, `.reduce()`, etc.
- Data that loads asynchronously

**When to Avoid**: 
- Single non-collection values (use null/undefined to distinguish "not loaded" from "loaded but empty")
- When you need to distinguish between "not fetched yet" vs "fetched and empty" (use separate loading state)

---

## Pattern: Plug-In Architecture - Detect, Don't Prescribe

**Context**: This toolkit is designed to integrate with ANY existing frontend project without requiring users to change their build tools, test frameworks, or development setup.

**Problem**: Recommending or assuming specific tools (Vite, Webpack, Jest, Vitest, etc.) creates barriers to adoption. Users with existing projects shouldn't need to migrate their tooling to use this toolkit.

**Solution**: Always **detect existing tools first**, then adapt recommendations to match the user's current stack. Provide framework-agnostic and tool-agnostic guidance that works universally.

**Detection Strategy**:
```javascript
// Check package.json dependencies
1. Build tool: vite, webpack, parcel, rollup, esbuild
2. Test framework: vitest, jest, mocha, jasmine
3. Frontend framework: react, vue, angular, svelte
4. Component libraries: MUI, Chakra, Tailwind, etc.

// Adapt recommendations accordingly
- If Vite detected → Use Vite terminology and commands
- If Vitest detected → Use vi.fn(), Vitest config patterns
- If Jest detected → Use jest.fn(), Jest config patterns
- If no test framework → Suggest options with Vite/Vitest as modern choice
```

**Example**:
```markdown
// ❌ Prescriptive (forces tool choice)
"Install Vite for your build tool"
"Use Vitest for testing"
"Configure webpack.config.js like this..."

// ✅ Detective (adapts to existing)
"I see you're using Webpack. Let's optimize your webpack.config.js..."
"Your project uses Jest. Here's how to add this test with jest.fn()..."
"No test framework detected. If you need one, Vite/Vitest are good modern choices, though Jest and others work too."
```

**Universal Tools (Always Safe to Recommend)**:
- ✅ Lighthouse CLI - Works with any project
- ✅ axe-core - Framework-agnostic accessibility testing
- ✅ Browser DevTools - Universal debugging
- ✅ React Testing Library - When React detected
- ✅ npm/yarn/pnpm - Package manager agnostic

**Tool Preference (When Asked)**:
If user explicitly asks "What test framework should I use?" or needs to add new tooling:
- **Suggest**: Vite/Vitest (fast, modern, good DX)
- **Frame as suggestion**: "Vite/Vitest are good modern choices, though [alternatives] work too"
- **Explain why**: Fast, ESM-native, integrated experience
- **Respect choice**: Support whatever they choose

**When to Use**:
- Writing any tool-specific guidance
- Creating prompt files or chat mode responses
- Providing code examples
- Suggesting optimizations or configurations
- Discussing build tools, test frameworks, or development setup

**Anti-Pattern**:
```markdown
❌ "This guide assumes you're using Vite and Vitest"
❌ "First, install Vite: npm install vite --save-dev"
❌ Hardcoded config files for specific tools
```

**Related Files**:
- [project-overview.md](../../docs/project-overview.md) - Mission statement and architecture
- [copilot-instructions.md](../copilot-instructions.md) - Plug-In Architecture Principle
- [frontend-developer.chatmode.md](../chatmodes/frontend-developer.chatmode.md) - Framework detection

**Rationale**:
This toolkit should **enhance** existing projects, not require rebuilding them. By detecting and adapting to the user's stack, we maximize adoption and minimize friction.

---

## Pattern: Framework-Agnostic Testing Guidance

**Context**: Documenting testing approaches and examples in project documentation, chat modes, agents, and prompt files. Critical for testing-specialist agent and all test-related prompts.

**Problem**: Recommending specific test frameworks (Jest, Mocha, etc.) violates the "plug-in architecture principle" and creates coupling. Users may have Vitest, Jest, Mocha, or other test runners based on their project configuration. Prescribing one framework forces users to change their setup.

**Solution**: Use framework-agnostic testing patterns with multi-framework syntax hints. Show primary example with inline comments explaining equivalents across popular frameworks.

**Example**:
```javascript
// ❌ Framework-specific (violates plug-in architecture)
const mockSubmit = jest.fn();
jest.mock("../api/userApi");
jest.useFakeTimers();

// ✅ Framework-agnostic with hints
const mockSubmit = vi.fn(); // Vitest: vi.fn() | Jest: jest.fn() | Sinon: sinon.spy()

// Vitest: vi.mock() | Jest: jest.mock() | Mocha: use sinon
vi.mock("../api/userApi");

vi.useFakeTimers(); // Vitest: vi.useFakeTimers() | Jest: jest.useFakeTimers()
```

**Implementation Pattern**:
1. **Add Framework Detection Section** at top of agent/documentation
2. **Use Generic Terminology**: "mock function" not "Jest mock", "test framework" not "Jest"
3. **Show Multi-Framework Syntax**: Primary example + inline comments with equivalents
4. **Provide Multiple Config Examples**: Both Vitest and Jest configurations in Tools section
5. **Update References**: Link to multiple framework docs, not just one

**Critical Anti-Pattern** ⚠️:
```javascript
// ❌ NEVER prescribe a specific framework throughout all examples
import { jest } from '@jest/globals';
const mock = jest.fn();  // Hardcoded Jest everywhere

// ✅ ALWAYS show framework-agnostic patterns
const mock = vi.fn(); // Vitest: vi.fn() | Jest: jest.fn()
```

**Real-World Example**: 
testing-specialist.agent.md initially prescribed Jest in all 14 code examples, violating core project principle. Refactored to show framework-agnostic patterns with multi-framework comments throughout.

**Rationale**:
- Different projects use different test runners (Vitest, Jest, Mocha, etc.)
- Project should work with any testing setup
- Guidance focuses on testing principles, not tool specifics
- Users can adapt examples to their chosen framework
- **Compliance with "plug-in architecture principle"** from copilot-instructions.md
- Users can adapt examples to their chosen framework

**When to Use**:
- Writing documentation about testing
- Creating prompt files
- Providing testing guidance in chat modes
- Writing example test code

**Related Files**:
- [frontend-developer.chatmode.md](../chatmodes/frontend-developer.chatmode.md) - TDD guidance
- [testing-guidelines.md](../../docs/testing-guidelines.md) - Testing examples

**Exceptions**:
- React Testing Library is acceptable to mention (de facto standard for React testing)
- Lighthouse CLI is acceptable (standard tool for performance auditing)
- Browser dev tools are acceptable (universal)

---

## [Your Next Pattern]

## Pattern: [Pattern Name]

**Context**: 

**Problem**: 

**Solution**: 

**Example**:
```javascript
// Code snippet
```

**Related Files**: 
- 

**When to Use**: 
-

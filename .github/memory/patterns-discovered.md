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

## Pattern: Prompt File Agent Specification

**Context**: All prompt files (`.prompt.md`) should specify which agent should execute them via the `agent:` frontmatter property.

**Problem**: Using the generic `agent: "agent"` doesn't leverage the specialized context, tools, and instructions of custom agents we've created (frontend-developer, accessibility-expert, copilot-customization).

**Solution**: Map each prompt to the most appropriate specialized agent based on the prompt's domain:

- **Accessibility prompts** → `accessibility-expert`
  - accessibility-review.prompt.md
  - react-accessibility.prompt.md
  
- **Frontend/React/Performance prompts** → `frontend-developer`
  - lighthouse-audit.prompt.md
  - performance-optimization.prompt.md
  - core-web-vitals.prompt.md
  - image-optimization.prompt.md
  - bundle-analysis.prompt.md
  - react-component-review.prompt.md
  - react-optimize-renders.prompt.md
  - react-hook-migration.prompt.md
  - react-state-refactor.prompt.md

- **Testing prompts** → `testing-specialist`
  - test-generation.prompt.md (planned)
  - Any TDD or React Testing Library focused prompts

- **General code quality** → `agent` (keep generic)
  - code-review.prompt.md (applies across all languages/frameworks)

**Benefits**:

1. **Automatic Context**: Prompt inherits the agent's specialized instructions and knowledge
2. **Appropriate Tools**: Agent's configured tool set is available (e.g., accessibility-expert has runCommands for axe-core)
3. **Consistent Expertise**: Same agent context whether invoked via chat or prompt file
4. **Better Results**: Specialized agents have deeper domain knowledge and better patterns

**Example**:

```yaml
---
description: "Review React component for best practices"
agent: "frontend-developer"  # ✅ Uses frontend-developer context
tools: ["codebase", "search", "problems"]
---
```

**Anti-Pattern**:

```yaml
---
description: "Review React component for best practices"
agent: "agent"  # ❌ Generic agent lacks React-specific context
tools: ["codebase", "search", "problems"]
---
```

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

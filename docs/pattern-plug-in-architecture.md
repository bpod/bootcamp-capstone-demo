# Pattern: Plug-In Architecture - Detect, Don't Prescribe

**Pattern ID**: `plug-in-architecture`  
**Category**: Architecture  
**Tags**: `#framework-agnostic` `#tool-detection` `#adoption` `#integration`

---

## Overview

This toolkit integrates with ANY existing frontend project without requiring users to change their build tools, test frameworks, or development setup. Always detect existing tools first, then adapt recommendations.

## Problem

Recommending or assuming specific tools (Vite, Webpack, Jest, Vitest, etc.) creates barriers to adoption:

- ❌ Users with existing projects need to migrate tooling
- ❌ Prescriptive guidance limits compatibility
- ❌ Assumes greenfield projects (most projects aren't)
- ❌ Creates "our way or no way" perception

## Solution

**Detect existing tools first**, then adapt recommendations to match the user's current stack.

### Detection Strategy

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

## Example Comparisons

### ❌ Prescriptive (Forces Tool Choice)

```markdown
"Install Vite for your build tool"
"Use Vitest for testing"
"Configure webpack.config.js like this..."
"This guide assumes you're using Vite and Vitest"
```

### ✅ Detective (Adapts to Existing)

```markdown
"I see you're using Webpack. Let's optimize your webpack.config.js..."
"Your project uses Jest. Here's how to add this test with jest.fn()..."
"No test framework detected. If you need one, Vite/Vitest are good modern choices, though Jest and others work too."
```

## Universal Tools (Always Safe to Recommend)

These tools work with ANY project:

- ✅ **Lighthouse CLI** - Works with any project
- ✅ **axe-core** - Framework-agnostic accessibility testing
- ✅ **Browser DevTools** - Universal debugging
- ✅ **React Testing Library** - When React detected
- ✅ **npm/yarn/pnpm** - Package manager agnostic

## Tool Preferences (When Asked)

If user explicitly asks "What test framework should I use?" or needs to add new tooling:

1. **Suggest Vite/Vitest** - Fast, modern, good DX
2. **Frame as suggestion** - "Vite/Vitest are good modern choices, though [alternatives] work too"
3. **Explain why** - Fast, ESM-native, integrated experience
4. **Respect choice** - Support whatever they choose

## Implementation Examples

### Detecting Build Tool

```javascript
// Read package.json
const pkg = require('./package.json');

if (pkg.dependencies.vite || pkg.devDependencies.vite) {
  return {
    tool: 'vite',
    configFile: 'vite.config.js',
    commands: {
      dev: 'vite',
      build: 'vite build'
    }
  };
} else if (pkg.dependencies.webpack || pkg.devDependencies.webpack) {
  return {
    tool: 'webpack',
    configFile: 'webpack.config.js',
    commands: {
      dev: 'webpack serve',
      build: 'webpack build'
    }
  };
}
```

### Adaptive Guidance in Prompts

```markdown
Review the ${selection} for performance issues.

${buildTool === 'vite' 
  ? 'Check vite.config.js for optimization opportunities'
  : buildTool === 'webpack'
  ? 'Check webpack.config.js for optimization opportunities'
  : 'Check your build configuration for optimization opportunities'
}
```

## When to Use

- ✅ Writing any tool-specific guidance
- ✅ Creating prompt files or chat mode responses
- ✅ Providing code examples
- ✅ Suggesting optimizations or configurations
- ✅ Discussing build tools, test frameworks, or development setup

## When to Avoid

- ❌ When tool is explicitly specified by user
- ❌ Internal toolkit development (use your preferred tools)
- ❌ Documentation clearly labeled as tool-specific tutorial

## Anti-Patterns

```markdown
❌ "This guide assumes you're using Vite and Vitest"
❌ "First, install Vite: npm install vite --save-dev"
❌ Hardcoded config files for specific tools
❌ "You need to migrate to Vite to use this feature"
```

## Related Patterns

- [Project Overview](./project-overview.md) - Mission statement and architecture
- [Copilot Instructions](../.github/copilot-instructions.md) - Plug-In Architecture Principle
- [Frontend Developer Agent](../.github/agents/frontend-developer.agent.md) - Framework detection examples

## Benefits

1. **Maximum Adoption** - Works with any existing project
2. **Reduced Friction** - No migration required
3. **User Respect** - Honors existing tool choices
4. **True Enhancement** - Adds value without disruption

## Rationale

This toolkit should **enhance** existing projects, not require rebuilding them. By detecting and adapting to the user's stack, we maximize adoption and minimize friction.

**Philosophy**: "Integrate gracefully, prescribe sparingly."

## Source

Discovered during toolkit development (2026-02-16-2026-02-18) when identifying adoption barriers and designing for maximum compatibility.

**Documented**: 2026-02-19  
**Status**: Core Architectural Principle

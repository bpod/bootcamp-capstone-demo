# Pattern: Simple Conversational Prompt Format

**Pattern ID**: `simple-conversational-prompts`  
**Category**: Prompt Design  
**Tags**: `#prompts` `#markdown` `#ux` `#github-copilot`

---

## Overview

When creating `.prompt.md` files for GitHub Copilot Chat, use simple conversational instructions with minimal structure instead of complex documentation-style hierarchies.

## Problem

Complex prompts with nested headers (##, ###, ####) cause:

1. **VS Code UI Issues**: Prompts appear as navigable sections in file explorer
2. **Poor Readability**: Read like technical specs instead of actionable instructions
3. **Hard to Maintain**: Too much structure makes updates difficult
4. **User Confusion**: Purpose unclear behind layers of documentation

## Solution

Use simple, conversational instructions with minimal structure:

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

## Key Principles

1. **No heading hierarchy** - Just frontmatter and plain text/bullets
2. **Conversational tone** - "Review X for Y" not "This prompt reviews X..."
3. **Action-focused** - Tell AI what to do, not how prompt works
4. **Brief** - 10-15 lines ideal, 20 max
5. **Specific output format** - Clear expectations without over-structuring

## Example Comparison

### ✅ Good (16 lines)

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

### ❌ Bad (82 lines with nested structure)

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

## When to Use

- ✅ All new prompt files
- ✅ Refactoring existing prompts
- ✅ Users report prompt UI/navigation issues  
- ✅ Creating prompts for GitHub Copilot Chat

## When to Avoid

- ❌ Complex multi-step workflows that genuinely need structure (rare)
- ❌ Documentation files (non-prompt .md files)

## Related Patterns

- [Prompt File Agent Specification](./pattern-prompt-agent-specification.md) - Assigning to specialized agents
- [Tool Sets vs Individual Tools](./pattern-tool-sets.md) - Using actual tool names

## References

- [VS Code Docs - Prompt Files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
- [github/awesome-copilot](https://github.com/github/awesome-copilot) - Real-world examples
- [Project Prompts](../.github/prompts/) - All 22 prompts follow this format

## Source

Discovered during Fresh Start (2026-02-16) when simplifying prompt structure to fix VS Code navigation issues and improve maintainability.

**Documented**: 2026-02-19  
**Status**: Production Standard

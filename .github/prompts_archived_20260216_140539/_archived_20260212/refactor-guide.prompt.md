---
description: Strategic code refactoring guidance
agent: frontend-developer
tools: ["readonly"]
---

Guide safe refactoring of ${file} or ${selection} using test-driven refactoring principles.

**Your Task**: Identify code smells, propose refactoring patterns, provide step-by-step refactoring plan ensuring tests stay green throughout.

**Process**: IDENTIFY → TEST → REFACTOR → VERIFY → COMMIT (repeat incrementally).

**Common Code Smells**:

- Long functions (>50 lines) → Extract functions for single responsibilities
- Duplicate code → Extract reusable functions/components
- Deep nesting (>3 levels) → Early returns, extract functions, guard clauses
- Magic numbers → Named constants
- Large components/classes → Split by responsibility
- Tight coupling → Dependency injection, interfaces
- Primitive obsession → Domain objects
- Long parameter lists → Configuration objects

**Refactoring Patterns**:

- Extract Function: Break large functions into smaller named pieces
- Extract Component: Split large React components
- Extract Variable: Name complex expressions
- Inline: Remove unnecessary indirection
- Rename: Improve naming clarity
- Move: Relocate code to better location
- Replace Conditional with Polymorphism: For complex conditionals

**Safety Rules**: Tests must exist before refactoring. Tests must stay green after each change. Commit after each successful refactoring. Never refactor and add features simultaneously.

**Success Criteria**: Code simpler and more maintainable, tests passing, no behavioral changes, each step documented.

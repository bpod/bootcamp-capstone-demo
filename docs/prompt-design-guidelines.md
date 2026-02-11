# Prompt Design Guidelines

## The Hybrid Architecture (Option 3)

This toolkit uses a **dual-layer architecture** for AI assistance:

### 🤖 Layer 1: Agents (Comprehensive Context)
**Location**: `.github/agents/*.agent.md`  
**Purpose**: Background specialist modes with deep domain knowledge  
**Size**: 200-500+ lines acceptable  
**Characteristics**:
- Rich, comprehensive context
- Detailed guidelines and patterns
- Multiple workflows and approaches
- Reference material embedded
- Always available in background

**Why agents can be comprehensive:**
- Loaded once when switched to (`@agent-name`)
- Persistent context during conversation
- User expects to "talk" with expert over multiple messages
- Can reference complex decision trees and patterns

**Example:** `accessibility-expert.agent.md` can contain:
- Full WCAG 2.1 checklist
- Common patterns and anti-patterns
- Testing strategies
- Screen reader mental models
- Complex workflows

---

### ⚡ Layer 2: Prompts (Fast & Focused)
**Location**: `.github/prompts/*.prompt.md`  
**Purpose**: On-demand, single-task actions  
**Size**: 50-150 lines maximum (strict)  
**Characteristics**:
- Single focused task
- Clear, direct instructions
- Minimal examples
- Quick to execute
- Actionable output

**Why prompts must be simple:**
- Invoked on-demand (`Cmd+Shift+P → Run Prompt`)
- One-shot execution with full context window needed
- User expects immediate, focused results
- Copilot processes entire prompt + file in single pass
- Timeout risk with complex instructions

**Example:** `accessibility-quick.prompt.md` should:
- Focus on finding top 5 issues
- Provide direct fixes
- No complex workflows
- Reference agent for deep guidance

---

## Design Principles

### ✅ For Prompts (DO)

1. **Single Task Focus**
   - One clear objective
   - One output format
   - One success criteria

2. **Size Constraints**
   - Maximum 150 lines
   - Minimum 30 lines
   - Aim for 50-75 lines sweet spot

3. **Clear Structure**
   - Brief description
   - Focused instructions (3-5 key points)
   - Output format example
   - Done

4. **Reference, Don't Embed**
   - Link to docs for details
   - Link to agents for comprehensive guidance
   - Keep examples minimal (1-2 max)

5. **Actionable Output**
   - Code examples
   - Line numbers
   - Specific fixes
   - Priority levels

### ❌ For Prompts (DON'T)

1. **No Multi-Step Workflows**
   - Avoid "Step 1, Step 2, Step 3..."
   - No conditional branching
   - No complex decision trees

2. **No Exhaustive Checklists**
   - Not a reference manual
   - Not comprehensive documentation
   - Focus on high-impact items

3. **No Tool Orchestration**
   - Avoid chaining multiple tools
   - Keep tool usage optional
   - Don't require terminal commands

4. **No Extensive Examples**
   - 1-2 examples maximum
   - Reference external docs
   - Show pattern, not variations

---

## Refactoring Guide

### Converting Comprehensive → Focused

**Before (324 lines):**
```markdown
# Comprehensive Accessibility Review

## Workflow
### Step 1: Define Scope
### Step 2: Automated Checks
### Step 3: Manual Review
- Semantic HTML checklist (20 items)
- Keyboard navigation (15 items)
- ARIA attributes (25 items)
- Color contrast (10 items)
- Forms (12 items)
- Images (8 items)
- Dynamic content (10 items)
### Step 4: Prioritize
### Step 5: Fix
### Step 6: Test
### Step 7: Report
[... 200 more lines of examples and edge cases ...]
```

**After (94 lines):**
```markdown
# Quick Accessibility Audit

Find the **top 5** WCAG 2.1 Level AA violations.

## Focus Areas
1. Images without alt text
2. Poor color contrast
3. Form inputs without labels
4. Non-semantic HTML
5. Missing ARIA attributes

## Output Format
[Example of one issue]

Keep it focused and actionable.
```

**Reduction Strategy:**
1. Remove workflow steps → Focus on single output
2. Collapse checklists → Top 3-5 items only
3. Remove examples → Keep 1 representative example
4. Cut background → Assume agent has context
5. Simplify output → One consistent format

---

## Prompt Naming Convention

**Pattern**: `[domain]-[action].prompt.md`

**Examples:**
- `accessibility-quick.prompt.md` - Fast audit
- `lighthouse-audit.prompt.md` - Run Lighthouse
- `react-component-review.prompt.md` - Review component
- `test-generation.prompt.md` - Generate tests

**Avoid:**
- Generic names (`review.prompt.md`)
- Comprehensive names (`comprehensive-accessibility-review.prompt.md`)
- Multi-action names (`audit-and-fix.prompt.md`)

---

## Quality Checklist

Before committing a new prompt:

- [ ] Single, clear task
- [ ] 50-150 lines (strict)
- [ ] One output format
- [ ] Minimal examples (1-2 max)
- [ ] No multi-step workflows
- [ ] No exhaustive checklists
- [ ] Tested locally (doesn't timeout)
- [ ] Clear success criteria
- [ ] References agent/docs for details

---

## Agent <-> Prompt Relationship

### How They Work Together

**User starts with Agent:**
```
User: @accessibility-expert
User: Review my app for accessibility issues
Agent: [Comprehensive analysis using full context]
Agent: For quick audits, try the accessibility-quick prompt
```

**User invokes Prompt:**
```
Cmd+Shift+P → accessibility-quick
[Fast, focused scan returns top 5 issues]
```

**User returns to Agent for deep dive:**
```
User: @accessibility-expert
User: Tell me more about the color contrast issue on line 42
Agent: [Detailed guidance, alternative approaches, testing strategies]
```

### Division of Labor

| Task | Use | Reason |
|------|-----|--------|
| Quick scan | Prompt | Fast, focused results |
| Deep analysis | Agent | Complex reasoning needed |
| Learning | Agent | Teaching concepts |
| Fixing | Prompt | Concrete code output |
| Strategy | Agent | Multiple approaches |
| Validation | Prompt | Quick check |

---

## Migration Plan

### Phase 1: Create Quick Versions ✅
- [x] `accessibility-quick.prompt.md`
- [ ] `performance-quick.prompt.md`
- [ ] `react-review-quick.prompt.md`
- [ ] `security-quick.prompt.md`

### Phase 2: Update Catalogs
- [ ] Mark comprehensive prompts as "Reference - Use agent for on-demand"
- [ ] Categorize quick vs comprehensive
- [ ] Update documentation

### Phase 3: Refactor All Prompts
- [ ] Audit all 21 prompts
- [ ] Identify oversized prompts (>150 lines)
- [ ] Create quick versions
- [ ] Rename comprehensive to `.reference.md`
- [ ] Update aliases/shortcuts

### Phase 4: Document Pattern
- [ ] Add to CONTRIBUTING.md
- [ ] Create prompt template
- [ ] Add to project-overview.md
- [ ] Update quick-start guide

---

## Success Metrics

Prompts are working when:

- ✅ No timeout errors
- ✅ Response in <10 seconds
- ✅ Focused, actionable output
- ✅ Users get immediate value
- ✅ <150 lines

Agents are working when:

- ✅ Comprehensive knowledge available
- ✅ Can handle complex queries
- ✅ Provides detailed guidance
- ✅ Remember context across conversation

---

## References

- [VS Code Prompt Files Docs](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
- [VS Code Custom Chat Modes](https://code.visualstudio.com/docs/copilot/customization/custom-chat-modes)
- [Project Architecture](../docs/project-overview.md)

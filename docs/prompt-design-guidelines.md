# Prompt Design Guidelines

**Official Format**: This guide follows [VS Code's Prompt Files documentation](https://code.visualstudio.com/docs/copilot/customization/prompt-files) and real-world examples from [github/awesome-copilot](https://github.com/github/awesome-copilot).

---

## The Hybrid Architecture

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

---

### ⚡ Layer 2: Prompts (Fast & Focused)
**Location**: `.github/prompts/*.prompt.md`  
**Purpose**: On-demand, single-task actions  
**Size**: **20-40 lines** (industry standard)  
**Characteristics**:
- Single focused task
- Clear, direct instructions
- **NO `##` or `###` section headers** (critical for VS Code compatibility)
- Quick to execute
- Actionable output

**Why prompts must be simple:**
- Invoked on-demand (`#prompt-name` in Copilot Chat)
- One-shot execution with full context window needed
- User expects immediate, focused results
- **VS Code parses `##` headers as separate menu items** (breaks display)
- Timeout risk with complex instructions

---

## 🔮 The Beads Pattern (Progressive Disclosure)

**Problem**: Traditional prompts that analyze entire projects timeout. Selection-based approaches defeat ease-of-use.

**Solution**: Beads pattern—progressive disclosure in 3 tiers that prevents timeouts while maximizing value.

### Three-Tier Structure

```
Stage 1: QUICK SCAN (30 seconds)
├─> Fast table summary
├─> Issue counts by category
├─> No deep analysis (just counts)
└─> Commands: "show [category] issues"

Stage 2: CATEGORY DETAILS (on demand)
├─> User runs: "show accessibility issues"
├─> Compact list with file:line references
├─> Brief descriptions, no code yet
└─> Commands: "fix issue N"

Stage 3: SPECIFIC FIX (on demand)
├─> User runs: "fix issue 2"
├─> Before/after code with explanation
├─> Include audit IDs, WCAG references
└─> Learn More links to authoritative sources
```

### Smart Scope Detection

Beads prompts automatically detect project size and adjust scope:

| Project Size | Scope | Rationale |
|--------------|-------|-----------|
| **< 10 files** | Analyze all files | Small enough for full scan |
| **10-50 files** | Current file + imports | Medium project, focus on context |
| **> 50 files** | Current file only | Large project, prevent timeout |

**Example Scope Logic**:
```markdown
**Scope Detection**: Count relevant files (*.js, *.ts, *.jsx, *.tsx, *.html, *.css).
- Found 8 files → Analyzing whole project
- Found 35 files → Analyzing current file + dependencies
- Found 120 files → Analyzing current file only

Display scope to user: "Analyzing 3 files (whole project mode)"
```

### Beads Pattern Example

**Stage 1 - Quick Scan Prompt** (lighthouse-scan.prompt.md):
```markdown
---
description: Quick Lighthouse scan (Stage 1 of 3)
agent: performance-tuner
tools: ["codebase", "search"]
---

Fast Lighthouse scan of ${input:url} - counts only, no deep analysis.

**Scope Detection**: Detect project size, adjust scope (all/current+imports/current only).

**Output Format**:
| Category | Issues | Severity | Top Issue |
|----------|--------|----------|-----------|
| Accessibility | 12 | 🔴 Critical | Images without alt text |
| Performance | 8 | 🟠 High | Render-blocking resources |

**Next Steps**: "show accessibility issues" for details, "fix issue 1" for code.
```

**Stage 2 - Detail Prompt** (show-accessibility-issues.prompt.md):
```markdown
---
description: Show accessibility issues (Stage 2 of 3)
agent: accessibility-expert
tools: ["codebase", "search"]
---

List all accessibility issues found in previous scan.

**Output Format**: Numbered list with file:line, severity, brief description.

1. **Images without alt text** - `image-alt` (WCAG 1.1.1)
   - [index.html:45](index.html#L45) - `<img src="hero.jpg">`
   - Impact: Screen readers cannot describe images

**Next Steps**: "fix issue 1" to get code solution.
```

**Stage 3 - Fix Prompt** (fix-issue.prompt.md):
```markdown
---
description: Generate fix for specific issue (Stage 3 of 3)
agent: frontend-developer
tools: ["codebase", "search"]
---

Fix issue #${input:issueNumber} identified in previous scan.

**Output Format**:
- Current code (before)
- Fixed code (after)
- Explanation of fix
- Best practices
- Learn More links

Reference web-quality-skills or Vercel patterns for authoritative guidance.
```

### Benefits of Beads Pattern

✅ **No Timeouts**: Stage 1 completes in ~30 seconds, no risk  
✅ **No Manual Selection**: Smart scope detection handles it automatically  
✅ **Maximum Value**: User explores what matters to them via progressive disclosure  
✅ **Context Efficient**: Only load detailed context when requested  
✅ **Conversational**: Natural commands like "show performance issues", "fix issue 2"

### Conversational Follow-up

Beads pattern supports natural language commands:

```
User: Run a Lighthouse scan
[Stage 1 output - table of issues]

User: show me the accessibility problems
[Stage 2 output - issue list]

User: fix the first issue
[Stage 3 output - before/after code]

User: what about performance?
[Stage 2 output - performance issues]
```

### When to Use Beads Pattern

**Use beads for**:
- ✅ Web quality audits (Lighthouse, accessibility, performance)
- ✅ Multi-file analysis (React component review across project)
- ✅ Long-running operations (bundle analysis, test generation)
- ✅ Complex results (many issues to triage)

**Skip beads for**:
- ❌ Single-file operations (refactoring current file)
- ❌ Simple queries (what is Core Web Vitals?)
- ❌ Quick validations (check this component for hooks issues)

**See**: [BEADS-IMPLEMENTATION-PLAN.md](../BEADS-IMPLEMENTATION-PLAN.md) for complete implementation guide.

---

## Critical Format Requirements

### 🚨 RULE 1: NO Section Headers in Body

**Problem**: Using `##` or `###` markdown headers in prompt file bodies causes VS Code to parse each section as a separate menu item. A prompt with `## Workflow`, `## Example`, `## Success Criteria` sections appears as 4+ fragmented items instead of 1 cohesive prompt.

**❌ WRONG** (fragments into multiple menu items):
```markdown
---
description: Optimize performance
agent: performance-tuner
---

Optimize Core Web Vitals for ${file}.

## Workflow

### Step 1: Measure
Run Lighthouse audit...

### Step 2: Optimize
Implement fixes...

## Success Criteria

- LCP < 2.5s
- INP < 200ms
```
*This creates 5+ separate menu items in VS Code!*

**✅ CORRECT** (single cohesive prompt):
```markdown
---
description: Optimize Core Web Vitals
agent: performance-tuner
tools: ["readonly", "web-quality"]
---

Optimize Core Web Vitals (LCP, INP, CLS) for ${file} following Measure → Optimize → Validate workflow.

**Your Task**: Run Lighthouse audit, identify worst metrics, implement optimizations targeting LCP < 2.5s, INP < 200ms, CLS < 0.1.

**LCP Optimization**: Optimize images (WebP, lazy loading), eliminate render-blocking resources, use CDN.

**INP Optimization**: Debounce handlers, code-split bundles, optimize JavaScript execution.

**Tools**: `lighthouse https://site.com --output=json` for baseline metrics.

**Success Criteria**: All Core Web Vitals in "Good" range, Lighthouse Performance score ≥90.
```

**Structure with Bold Text**: Use **bold text**, bullets, and inline code blocks for organization—NOT markdown headers.

---

### 🎯 RULE 2: Length Target 20-40 Lines

**Industry Standard**: Real-world GitHub Copilot prompts from production repos are typically 10-40 lines.

**Examples from github/awesome-copilot**:
- `dataverse-python-quickstart.prompt.md` - 13 lines
- Most production prompts - 15-35 lines
- Complex prompts rarely exceed 50 lines

**Our Standard**: 
- **Target: 20-40 lines** (excluding frontmatter)
- Minimum: 15 lines (for very simple tasks)
- Maximum: 50 lines (rare exceptions)

**Why This Works**:
- Copilot processes entire prompt + file in single pass
- Shorter prompts = faster responses
- Forces clarity and focus
- Prevents timeout errors

---

### 📝 RULE 3: Required Frontmatter Format

**Official Format** (from VS Code docs):

```yaml
---
description: "Brief description shown in prompt picker"  # REQUIRED
agent: agent-name                                       # REQUIRED
tools: ["tool1", "tool2"]                              # OPTIONAL
---
```

**Property Details**:

**`description:`** (REQUIRED)
- Brief description shown in `#` autocomplete menu
- Keep concise: 50-100 characters
- Example: `"Optimize Core Web Vitals (LCP, INP, CLS)"`

**`agent:`** (REQUIRED)
- Specifies execution mode or custom agent
- Options:
  - `agent` - Generic multi-turn workflow
  - `ask` - Single-response query (no follow-up)
  - `edit` - Direct code editing
  - Custom agents: `performance-tuner`, `accessibility-expert`, `frontend-developer`, `testing-specialist`

**`tools:`** (OPTIONAL but recommended)
- Array of tool sets or individual tools
- Examples: `["readonly"]`, `["readonly", "web-quality"]`
- References tool sets from `.vscode/settings.json`

---

## Standard Prompt Structure

### Template (Copy This)

```markdown
---
description: [Brief task description]
agent: [specialized-agent or agent/ask/edit]
tools: ["readonly"]  # or other tool sets
---

[Task description using ${selection} or ${file} variables]

**Your Task**: [Clear objective with success criteria]

**[Category 1]**: [Consolidated guidance with bold, bullets, inline code]

**[Category 2]**: [More guidance, examples inline]

**Tools** (if applicable): [Specific commands or alternatives]

**Standards/References**: [Links to external docs]

**Success Criteria**: [Measurable outcomes]
```

### Real Example

```markdown
---
description: Generate React Testing Library tests
agent: testing-specialist
tools: ["readonly"]
---

Generate tests for ${selection} or ${file} following Testing Library philosophy: test behavior users see, not implementation details.

**Your Task**: Analyze component behavior, detect test framework (Vitest/Jest), generate tests using React Testing Library patterns (Arrange-Act-Assert), cover edge cases.

**Testing Library Query Priority** (accessibility-first):
1. `getByRole` - Prefer always (button, heading, textbox)
2. `getByLabelText` - Form inputs with labels
3. `getByText` - Non-interactive text
4. `getByTestId` - Last resort only

**Test Coverage**: Rendering, interactions (clicks, typing), props variations, async operations, edge cases (empty states, errors), accessibility (keyboard, screen reader).

**Example**:
\```tsx
it('submits form when user clicks submit', async () => {
  const onSubmit = vi.fn();
  render(<Form onSubmit={onSubmit} />);
  await userEvent.type(screen.getByRole('textbox'), 'test@example.com');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
});
\```

**Success Criteria**: Generated tests are copy-pasteable, use proper queries, pass when component works.
```
*(35 lines total)*

---

## Design Principles

### ✅ For Prompts (DO)

1. **Single Task Focus**
   - One clear objective
   - One output format
   - One success criteria

2. **Simple Structure**
   - YAML frontmatter
   - Task description (1 sentence)
   - Bold text categories (NOT `##` headers)
   - Bulleted guidance
   - Inline code examples (1-2 max)
   - Success criteria

3. **Reference, Don't Embed**
   - Link to official docs for details
   - Link to agents for comprehensive workflows
   - Keep examples minimal

4. **Actionable Output**
   - Specific code examples
   - Clear priorities
   - Measurable success criteria

5. **Use Variables**
   - `${selection}` - For selected code
   - `${file}` - For current file
   - `${folder}` - For workspace folder

### ❌ For Prompts (DON'T)

1. **NO `##` or `###` Headers**
   - Causes VS Code to fragment prompt into multiple menu items
   - Use **bold text** instead

2. **No Multi-Step Workflows**
   - Avoid "Step 1, Step 2, Step 3..."
   - If workflow needed, describe as sentence: "Measure → Optimize → Validate"

3. **No Exhaustive Documentation**
   - Not a reference manual
   - Focus on high-impact patterns
   - Link to external docs

4. **No Verbose Examples**
   - 1-2 code examples maximum
   - Show pattern, not every variation

5. **No Tool Orchestration**
   - Keep tool usage optional when possible
   - Provide manual alternatives

---

## Before/After Examples

### Example 1: Performance Optimization

**❌ Before** (781 lines, fragments into 12+ menu items):
```markdown
---
description: Set performance budgets
agent: performance-tuner
---

Set performance budgets for ${file}.

## Workflow

### Step 1: Analyze Current Metrics

Run Lighthouse audit to establish baseline...

[100+ lines of detailed steps]

### Step 2: Define Budget Thresholds

#### JavaScript Bundle Size
- Initial load: < 200 KB
- Code splitting: < 50 KB per chunk
[50+ lines of thresholds]

### Step 3: Configure Budget Tools

#### Lighthouse Budget Configuration
[200+ lines of config examples]

## Performance Budget Categories

### 1. Resource Size Budgets
[extensive examples]

### 2. Timing Budgets
[extensive examples]

## Common Pitfalls

### Pitfall 1: Overly Aggressive Budgets
[detailed explanation]

## Example Configurations
[300+ lines of examples]

## Success Criteria
- Budget file created
- CI integration configured
```

**✅ After** (35 lines, single cohesive prompt):
```markdown
---
description: Create performance budget configuration
agent: performance-tuner
tools: ["readonly", "web-quality"]
---

Create performance budget for ${file} based on baseline Lighthouse audit and industry best practices.

**Your Task**: Run Lighthouse audit, analyze current metrics, define realistic budgets (10-20% below current), configure monitoring.

**Budget Categories**:
- **Resource Sizes**: Total JavaScript < 200KB, CSS < 50KB, Images < 500KB (gzipped)
- **Timing Metrics**: FCP < 1.8s, LCP < 2.5s, TTI < 3.8s
- **Resource Counts**: Requests < 50, third-party scripts < 10

**Configuration Format** (lighthouserc.json):
\```json
{
  "ci": {
    "assert": {
      "assertions": {
        "total-byte-weight": ["error", {"maxNumericValue": 512000}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}]
      }
    }
  }
}
\```

**Tools**: `lighthouse https://site.com --output=json` for baseline. Web.dev/fast for budget guidance.

**Success Criteria**: Budget file created, thresholds 10-20% below current metrics, CI integration ready.
```

---

### Example 2: Accessibility Review

**❌ Before** (317 lines, fragments into 8+ menu items):
```markdown
---
description: Comprehensive accessibility review
agent: accessibility-expert
---

Review ${file} for accessibility issues.

## Workflow

### Step 1: Automated Scanning
Run axe-core or Lighthouse...

### Step 2: Manual Testing
[50+ lines of manual checks]

## WCAG 2.1 Compliance Checklist

### 1. Perceivable
#### 1.1 Text Alternatives
- [ ] All images have alt text
- [ ] Decorative images use alt=""
[100+ lines of detailed checklist items]

### 2. Operable
[100+ lines]

### 3. Understandable
[50+ lines]

### 4. Robust
[30+ lines]

## Common Issues and Fixes

### Color Contrast
[detailed explanation with examples]

## Testing Tools
[extensive tool documentation]
```

**✅ After** (30 lines, single cohesive prompt):
```markdown
---
description: Review code for accessibility issues
agent: accessibility-expert
tools: ["readonly", "web-quality"]
---

Review ${selection} or ${file} for WCAG 2.1 Level AA violations and recommend fixes.

**Your Task**: Scan code for common accessibility issues, prioritize by severity (Critical→Low), provide specific fixes with code examples.

**Check For**:
- **Semantic HTML**: Use `<button>` not `<div onclick>`, `<nav>`, `<main>`, `<article>` for structure
- **Alt Text**: All images need descriptive alt text (empty alt="" for decorative only)
- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text (use WebAIM contrast checker)
- **Keyboard Navigation**: All interactive elements reachable and operable with Tab/Enter/Space
- **Form Labels**: Every input has associated `<label>` or aria-label
- **ARIA**: Only when semantic HTML insufficient, use valid roles/states
- **Focus Management**: Visible focus indicators, logical tab order

**Tools**: Run `npx @axe-core/cli https://site.com` for automated scan, Chrome DevTools Lighthouse for quick audit.

**WCAG Reference**: [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)

**Success Criteria**: All Critical/High severity issues identified with fixes, automated axe-core scan passes.
```

---

## Prompt Naming Convention

**Pattern**: `[domain]-[action].prompt.md`

**Good Examples**:
- `lighthouse-audit.prompt.md`
- `accessibility-quick.prompt.md`
- `react-component-review.prompt.md`
- `test-generation.prompt.md`
- `bundle-analysis.prompt.md`

**Avoid**:
- Generic: `review.prompt.md`, `optimize.prompt.md`
- Verbose: `comprehensive-accessibility-review-with-testing.prompt.md`
- Multi-action: `audit-and-fix-performance.prompt.md`

---

## Quality Checklist

Before committing a new prompt, verify:

- [ ] **Description** - Clear, concise frontmatter description
- [ ] **Agent** - Appropriate specialized agent assigned
- [ ] **Tools** - Relevant tool sets specified
- [ ] **Length** - 20-40 lines (max 50)
- [ ] **NO `##` Headers** - Body uses bold text, NOT markdown section headers
- [ ] **Single Task** - One clear objective
- [ ] **Variables** - Uses `${selection}` or `${file}` appropriately
- [ ] **Examples** - 1-2 inline code examples max
- [ ] **Success Criteria** - Measurable outcomes defined
- [ ] **Tested** - Works correctly in VS Code, displays as single item

---

## Testing Your Prompt

### VS Code Display Test

1. Save prompt file to `.github/prompts/[name].prompt.md`
2. Reload VS Code window (`Cmd+Shift+P` → "Reload Window")
3. Open Copilot Chat
4. Type `#` and find your prompt
5. **Verify**: Prompt appears as **single item**, not multiple fragments
6. **If fragmented**: Check for `##` headers in body—remove them!

### Functional Test

1. Invoke prompt on sample code
2. Verify output is focused and actionable
3. Check response time < 10 seconds
4. Confirm success criteria met

---

## Agent <-> Prompt Relationship

### How They Work Together

**User starts with Agent:**
```
User: @accessibility-expert
User: Review my app for accessibility issues
Agent: [Comprehensive analysis using full context]
Agent: For quick scans, try #accessibility-quick
```

**User invokes Prompt:**
```
User: #accessibility-quick
[Fast, focused scan returns top 5 issues with fixes]
```

**User returns to Agent for deep dive:**
```
User: @accessibility-expert
User: Explain more about the color contrast issue
Agent: [Detailed guidance, testing strategies, alternative approaches]
```

### Division of Labor

| Task | Use | Reason |
|------|-----|--------|
| Quick scan | Prompt | Fast, focused results |
| Deep analysis | Agent | Complex reasoning |
| Learning | Agent | Teaching concepts |
| Specific fix | Prompt | Concrete code output |
| Strategy discussion | Agent | Multiple approaches |
| Validation | Prompt | Quick check |

---

## Success Metrics

**Prompts are working when**:
- ✅ Appear as single items in VS Code menu (not fragmented)
- ✅ No timeout errors
- ✅ Response in < 10 seconds
- ✅ Focused, actionable output
- ✅ 20-40 lines

**Agents are working when**:
- ✅ Comprehensive knowledge available
- ✅ Handle complex queries
- ✅ Provide detailed guidance
- ✅ Remember context across conversation
- ✅ 200-500+ lines acceptable

---

## References

**Official Documentation**:
- [VS Code Prompt Files](https://code.visualstudio.com/docs/copilot/customization/prompt-files) - Official format specification
- [github/awesome-copilot](https://github.com/github/awesome-copilot) - Real-world prompt examples

**Internal Documentation**:
- [.github/memory/patterns-discovered.md](../.github/memory/patterns-discovered.md) - Documented patterns including prompt format
- [Project Overview](./project-overview.md) - Overall architecture

**All prompts in this project follow this standard**.

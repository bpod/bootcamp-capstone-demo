# Beads Pattern Implementation Plan

**Date**: 2026-02-16  
**Branch**: `feature/beads-pattern`  
**Status**: Approved for Implementation  

---

## Executive Summary

**Problem**: Current prompts timeout when analyzing entire projects due to comprehensive multi-file analysis. Selection-based approach was rejected as it defeats ease-of-use.

**Solution**: Implement beads pattern (progressive disclosure) with smart scope detection.
- **Stage 1 (Quick Scan)**: 30-second table summary → No timeout risk  
- **Stage 2 (Category Details)**: Issue list on demand → User controls depth  
- **Stage 3 (Specific Fix)**: Code examples only when requested → Minimal context use  

**Benefits**:
- ✅ No timeouts (Stage 1 completes quickly)
- ✅ No manual selection required (automatic smart scope)
- ✅ Maximum value (user explores what matters to them)
- ✅ Context efficient (only load details on demand)

**Reference Implementation**: [steveyegge/beads](https://github.com/steveyegge/beads) - Original beads pattern by Steve Yegge with examples and best practices

---

## Table of Contents

1. [Competitive Analysis](#competitive-analysis)
2. [Integration with Core Sources of Truth](#integration-with-core-sources-of-truth)
3. [Technical Architecture](#technical-architecture)
4. [Memory System Enhancement with Beads](#memory-system-enhancement-with-beads)
5. [Implementation Phases](#implementation-phases)
6. [Prompt Structure](#prompt-structure)
7. [Testing Strategy](#testing-strategy)
8. [Success Metrics](#success-metrics)
9. [Timeline & Milestones](#timeline--milestones)

---

## Competitive Analysis

### Similar Toolkits in the Ecosystem

#### 1. **Lighthouse CI** (GoogleChrome/lighthouse-ci)
**What it does**:
- Automates Lighthouse audits in CI/CD pipelines
- Compares results across builds
- Enforces performance budgets via assertions
- GitHub status checks

**Strengths**:
- Production-proven (widely adopted)
- Comprehensive assertion framework
- Build comparison over time
- Integrates with major CI providers

**Limitations**:
- Requires separate server for historical tracking
- Configuration complexity (lighthouserc.js)
- Not AI-native (no conversational interface)
- No auto-fix suggestions

**Our Differentiation**:
- ✅ Conversational AI interface (no config files to start)
- ✅ Auto-fix code suggestions via GitHub Copilot
- ✅ Progressive disclosure (beads pattern) vs all-at-once reports
- ✅ Contextual guidance integrated into editor
- ⚡ Potential Integration: Could generate lighthouserc.json configs automatically

---

#### 2. **axe-core** (dequelabs/axe-core)
**What it does**:
- Automated accessibility testing engine
- Runs in browser or Node.js
- WCAG 2.x compliance checking
- Supports Shadow DOM

**Strengths**:
- Industry standard for a11y testing
- Zero false positives (by design)
- Extensive rule coverage (100+ rules)
- Framework agnostic

**Limitations**:
- Accessibility-only focus
- API-driven (not conversational)
- No performance analysis
- Requires integration code

**Our Differentiation**:
- ✅ Unified experience (accessibility + performance + React patterns)
- ✅ Natural language interaction
- ✅ Beads pattern for progressive exploration
- ✅ Auto-generates fix code suggestions
- ⚡ Potential Integration: Could use axe-core as execution engine for accessibility scans

---

#### 3. **Web Quality Skills** (addyosmani/web-quality-skills)
**What it does**:
- Agent skills for Lighthouse/Core Web Vitals
- Rules and guidance documentation
- Best practices catalog

**Strengths**:
- Authoritative (Addy Osmani, Google Chrome team)
- Comprehensive rule coverage (150+ audits)
- Performance + Accessibility + SEO + Best Practices

**Limitations**:
- Documentation/guidance only (no execution)
- Not interactive
- No automated detection
- Manual application required

**Our Relationship**: **Core Source of Truth**
- We reference their audit IDs and thresholds
- We automate execution of their recommendations
- We provide conversational interface to their guidance

---

#### 4. **Vercel React Best Practices** (vercel-labs/agent-skills/react-best-practices)
**What it does**:
- 40+ React-specific rules
- Categorized by impact (Critical → Low)
- 8 categories (waterfalls, bundle, re-renders, etc.)

**Strengths**:
- Production-proven patterns from Vercel Engineering
- Prioritized by performance impact
- Covers modern React (hooks, Suspense, etc.)

**Limitations**:
- Documentation only
- Requires manual code review
- Not automated

**Our Relationship**: **Core Source of Truth**
- We implement their patterns in our React prompts
- We automate detection of anti-patterns
- We extend with framework-specific guidance (Next.js, Vite, etc.)

---

#### 5. **Perfsee** (perfsee/perfsee)
**What it does**:
- Frontend performance measurement platform
- Bundle analysis and visualization
- Lighthouse integration
- Historical tracking

**Strengths**:
- All-in-one performance platform
- Bundle analyzer with flamegraphs
- Lab + field data correlation

**Limitations**:
- Requires hosted platform
- Complex setup
- Not AI-assisted
- Separate from editor workflow

**Our Differentiation**:
- ✅ Integrated into editor (no separate platform)
- ✅ AI-guided optimization workflow
- ✅ Conversational interface
- ✅ Progressive disclosure (beads pattern)

---

#### 6. **Playwright Performance Testing** (microsoft/playwright)
**What it does**:
- E2E testing with performance tracing
- Lighthouse integration
- Visual regression testing

**Strengths**:
- Comprehensive testing framework
- Multi-browser support
- Performance tracing

**Limitations**:
- E2E testing focus (not lightweight)
- Requires test infrastructure
- Not focused on static analysis

**Our Differentiation**:
- ✅ Lightweight (no browser automation required for prompts)
- ✅ Instant feedback in editor
- ✅ AI-guided recommendations
- ✅ Static + runtime analysis

---

### Competitive Positioning

**Our Unique Value Proposition**:

| Feature | Lighthouse CI | axe-core | Web Quality Skills | Our Toolkit |
|---------|---------------|----------|-------------------|-------------|
| **Automated Execution** | ✅ CI/CD | ✅ API | ❌ Docs only | ✅ MCP + Prompts |
| **AI-Guided Fixes** | ❌ | ❌ | ❌ | ✅ GitHub Copilot |
| **Progressive Disclosure** | ❌ All-at-once | ❌ All results | ❌ | ✅ Beads pattern |
| **Editor Integration** | ❌ CI-only | ⚠️ Via extensions | ❌ | ✅ Native VS Code |
| **Conversational Interface** | ❌ Config files | ❌ API calls | ❌ | ✅ Natural language |
| **Smart Scope Detection** | ❌ Manual config | ❌ | ❌ | ✅ Auto-detects |
| **Framework Agnostic** | ✅ | ✅ | ✅ | ✅ |
| **React Best Practices** | ❌ | ❌ | ⚠️ Some | ✅ Vercel patterns |

**Market Gap We Fill**:
- No existing tool combines automated execution + AI guidance + progressive UX + editor integration
- Existing tools are either config-heavy (Lighthouse CI) or API-driven (axe-core)
- We automate and integrate authoritative sources into daily workflow

---

### Features We Could Add (Inspired by Competition)

Based on competitive analysis, consider adding:

1. **From Lighthouse CI**:
   - ⭐ Config file generation (auto-create lighthouserc.json)
   - ⭐ Assertion framework (fail builds on thresholds)
   - ⭐ Build comparison over time (track improvements)
   - Budget.json integration

2. **From axe-core**:
   - ⭐ Shadow DOM testing support
   - ⭐ Custom rule authoring
   - Multiple output formats (JSON, CSV, etc.)

3. **From Perfsee**:
   - Bundle visualization (dependency tree)
   - Historical trend charts
   - Comparison UI (before/after)

4. **Novel Ideas** (not in competition):
   - ⭐ MCP server for automated Lighthouse execution
   - ⭐ "Fix all issues in this category" batch command
   - ⭐ Integration with GitHub Actions (auto-comment on PRs)
   - ⭐ WebP/AVIF conversion automation
   - ⭐ Accessibility remediation code generation
   - VS Code extension with inline warnings

**Priority**: Focus on core beads pattern first, add features iteratively based on user feedback.

---

## Integration with Core Sources of Truth

### 1. Web Quality Skills (addyosmani/web-quality-skills)

**Source**: https://github.com/addyosmani/web-quality-skills

**What We Leverage**:
- 150+ Lighthouse audit definitions
- Core Web Vitals thresholds
  - LCP ≤ 2.5s
  - INP ≤ 200ms
  - CLS ≤ 0.1
- Audit categorization (Performance, Accessibility, Best Practices, SEO)

**How We Integrate**:

**Stage 1 (Quick Scan)**: Reference audit IDs and categories
```markdown
| Category | Issues | Severity | Top Issue |
|----------|--------|----------|-----------|
| Performance | 8 | 🔴 Critical | `render-blocking-resources` |
| Accessibility | 12 | 🟠 High | `image-alt` |
```

**Stage 2 (Category Details)**: Show audit IDs with scores
```markdown
### Accessibility Issues (12)
1. `image-alt` - Images without alt attributes [Score: 0/100]
2. `color-contrast` - Low text contrast [Score: 67/100]
3. `label` - Form inputs without labels [Score: 50/100]
```

**Stage 3 (Specific Fix)**: Link to web.dev guidance
```markdown
**Audit**: `image-alt` (WCAG 1.1.1)
**Learn More**: https://web.dev/image-alt/
**Fix**: Add descriptive alt text to all images
```

**Implementation**: Maintain mapping of audit IDs to our recommendations

---

### 2. Vercel React Best Practices (vercel-labs/agent-skills)

**Source**: https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices

**What We Leverage**:
- 40+ React-specific rules
- 8 categories:
  - Waterfalls & Roundtrips
  - Bundle Size
  - Code Splitting
  - Re-renders
  - Data Fetching
  - State Management
  - Client/Server Patterns
  - Build Configuration

**Priority Levels**:
- 🔴 **Critical** - Causes major performance degradation
- 🟠 **High** - Noticeable impact
- 🟡 **Medium** - Incremental improvement
- 🟢 **Low** - Best practice, minimal impact

**How We Integrate**:

**Stage 1 (Quick Scan)**:
```markdown
| Category | Issues | Severity | Top Issue |
|----------|--------|----------|-----------|
| Waterfalls | 3 | 🔴 Critical | Sequential async calls in component |
| Re-renders | 5 | 🟠 High | Missing React.memo on expensive component |
| Bundle Size | 2 | 🟡 Medium | Importing entire lodash library |
```

**Stage 2 (Category Details)**: Show rule IDs with priorities
```markdown
### Waterfalls Issues (3)
1. 🔴 **Sequential API calls** - `react-001` [Line 45-52]
2. 🔴 **Async calls in useEffect** - `react-002` [Line 78]
3. 🟠 **No Promise.all for parallel requests** - `react-003` [Line 102]
```

**Stage 3 (Specific Fix)**: Provide Vercel-approved pattern
```jsx
// ❌ Anti-pattern: Sequential fetches (Waterfall)
useEffect(() => {
  const data1 = await fetch('/api/user');
  const data2 = await fetch('/api/posts');
}, []);

// ✅ Vercel Pattern: Parallel fetches
useEffect(() => {
  const [data1, data2] = await Promise.all([
    fetch('/api/user'),
    fetch('/api/posts')
  ]);
}, []);
```

**Implementation**: Maintain mapping of Vercel rule IDs to our React prompts

---

### 3. WCAG 2.1 Guidelines

**Source**: https://www.w3.org/WAI/WCAG21/quickref/

**What We Leverage**:
- Level AA compliance (our target)
- 4 principles: Perceivable, Operable, Understandable, Robust
- Success criteria with testable conditions

**How We Integrate**:

**Stage 1**: Aggregate by WCAG principle
```markdown
| WCAG Principle | Issues | Failures |
|----------------|--------|----------|
| Perceivable | 8 | 1.1.1, 1.4.3, 1.4.11 |
| Operable | 5 | 2.1.1, 2.4.1 |
| Understandable | 3 | 3.2.2 |
| Robust | 1 | 4.1.2 |
```

**Stage 2**: Show success criteria
```markdown
### Perceivable Issues (8)
1. **1.1.1 Non-text Content** - Missing alt attributes [Severity: A]
2. **1.4.3 Contrast (Minimum)** - Text contrast < 4.5:1 [Severity: AA]
3. **1.4.11 Non-text Contrast** - Button borders < 3:1 [Severity: AA]
```

**Stage 3**: Provide remediation with WCAG reference
```html
<!-- ❌ Fails WCAG 1.1.1 -->
<img src="logo.png">

<!-- ✅ Passes WCAG 1.1.1 Level A -->
<img src="logo.png" alt="Company Logo - Acme Corp">
```

---

### Unified Integration Strategy

**Single Source of Truth Principle**:
- We automate execution and provide conversational UX
- We reference authoritative sources, not duplicate them
- We link users to original documentation for deep dives

**Implementation**:
- Maintain JSON mapping files (`audit-mappings.json`, `react-rules.json`, `wcag-criteria.json`)
- Update mappings when sources publish new versions
- Include version references in prompt outputs

**Example Mapping File** (`audit-mappings.json`):
```json
{
  "image-alt": {
    "source": "web-quality-skills",
    "category": "accessibility",
    "wcag": "1.1.1",
    "severity": "critical",
    "learnMore": "https://web.dev/image-alt/"
  },
  "render-blocking-resources": {
    "source": "web-quality-skills",
    "category": "performance",
    "impact": "LCP",
    "learnMore": "https://web.dev/render-blocking-resources/"
  }
}
```

---

## Technical Architecture

### Three-Tier Prompt Structure

```
┌─────────────────────────────────────────────────────┐
│  STAGE 1: QUICK SCAN (30 seconds)                  │
│  - Read project files intelligently                 │
│  - Generate summary table                           │
│  - No deep analysis, just counts                   │
│  Output: Table + "Use 'show X issues' for details" │
└─────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│  STAGE 2: CATEGORY DETAILS (on demand)             │
│  - User runs: "show accessibility issues"          │
│  - Return compact list with file:line references   │
│  - Brief description, no code examples yet         │
│  Output: Issue list + "Fix issue #N for code"     │
└─────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│  STAGE 3: SPECIFIC FIX (on demand)                 │
│  - User runs: "fix issue 2"                        │
│  - Return before/after code with explanation       │
│  - Include audit ID, WCAG reference, impact        │
│  Output: Code example + Learn More link            │
└─────────────────────────────────────────────────────┘
```

---

### Smart Scope Detection

Automatically determine what to analyze based on project size:

```javascript
function detectScope(projectContext) {
  const fileCount = countRelevantFiles(projectContext);
  
  if (fileCount < 10) {
    return {
      scope: 'whole-project',
      reason: 'Small project, analyze all files',
      files: getAllRelevantFiles()
    };
  }
  
  if (fileCount >= 10 && fileCount <= 50) {
    return {
      scope: 'current-file-plus-imports',
      reason: 'Medium project, analyze current file and dependencies',
      files: [
        getCurrentFile(),
        ...getDirectImports(getCurrentFile())
      ]
    };
  }
  
  return {
    scope: 'current-file-only',
    reason: 'Large project, analyze current file only',
    files: [getCurrentFile()]
  };
}
```

**Implementation**:
- Prompts detect scope before execution
- Display scope to user: "Analyzing 3 files (whole project mode)"
- Allow override: User can say "scan only index.html"

---

### Example Outputs for Each Stage

#### Stage 1: Quick Scan Output

```markdown
# Web Quality Scan Complete ✅

**Scope**: Analyzed 3 files (whole project detected)
**Time**: 28 seconds

## Results Summary

| Category | Issues | Severity | Top Issue |
|----------|--------|----------|-----------|
| **Accessibility** | 12 | 🔴 Critical | Images without alt text (8 occurrences) |
| **Performance** | 8 | 🟠 High | Render-blocking resources (3 files) |
| **Best Practices** | 5 | 🟡 Medium | Missing error boundaries |
| **SEO** | 2 | 🟢 Low | Missing meta description |

**Total Issues**: 27

---

## Next Steps

Run any of these commands to explore:
- `show accessibility issues` - See all 12 accessibility problems
- `show performance issues` - See all 8 performance bottlenecks
- `show best-practices issues` - See all 5 code quality issues
- `show seo issues` - See all 2 SEO improvements

Or jump directly to a fix:
- `fix issue 1` - Fix the top accessibility issue
```

---

#### Stage 2: Category Details Output

```markdown
# Accessibility Issues (12)

**Analyzed**: index.html, style.css, script.js

## Critical Issues (8)

1. **Images without alt text** - `image-alt` (WCAG 1.1.1)
   - [index.html:45](index.html#L45) - `<img src="hero.jpg">`
   - [index.html:67](index.html#L67) - `<img src="feature1.png">`
   - [index.html:78](index.html#L78) - `<img src="feature2.png">`
   - **Impact**: Screen readers cannot describe images to users
   - **Audit ID**: `image-alt` ([Learn more](https://web.dev/image-alt/))

2. **Form inputs without labels** - `label` (WCAG 3.3.2)
   - [index.html:120](index.html#L120) - `<input type="email">`
   - [index.html:125](index.html#L125) - `<input type="text">`
   - **Impact**: Screen reader users don't know input purpose
   - **Audit ID**: `label` ([Learn more](https://web.dev/label/))

## High Issues (3)

3. **Low text contrast** - `color-contrast` (WCAG 1.4.3)
   - [style.css:24](style.css#L24) - `color: #999` on white background (2.85:1)
   - [style.css:58](style.css#L58) - `color: #aaa` on white background (2.32:1)
   - **Impact**: Users with low vision cannot read text
   - **Required**: 4.5:1 for normal text, 3:1 for large text
   - **Audit ID**: `color-contrast` ([Learn more](https://web.dev/color-contrast/))

---

**Commands**:
- `fix issue 1` - Get code to fix missing alt text
- `fix issue 2` - Get code to fix missing labels
- `fix issue 3` - Get code to fix text contrast
- `fix all critical` - Generate fixes for all critical issues (coming soon)
```

---

#### Stage 3: Specific Fix Output

```markdown
# Fix: Images Without Alt Text

**Issue ID**: 1  
**Audit**: `image-alt` (WCAG 1.1.1 Level A)  
**Severity**: 🔴 Critical  
**Impact**: Screen readers cannot describe images

---

## Current Code (index.html:45)

```html
<!-- ❌ Fails WCAG 1.1.1 - Missing alt attribute -->
<div class="hero">
  <img src="hero.jpg">
  <h1>Welcome to Our Platform</h1>
</div>
```

---

## Fixed Code

```html
<!-- ✅ Passes WCAG 1.1.1 - Descriptive alt text -->
<div class="hero">
  <img src="hero.jpg" alt="Team collaborating on laptops in modern office space">
  <h1>Welcome to Our Platform</h1>
</div>
```

---

## Explanation

**What Changed**:
- Added `alt` attribute with descriptive text
- Alt text describes what's in the image for users who cannot see it

**Best Practices**:
- ✅ Be descriptive but concise (< 150 characters)
- ✅ Describe the content, not "image of" or "picture of"
- ✅ For decorative images, use `alt=""` (empty string)
- ✅ For complex images (graphs), provide longer description in surrounding text

**Example Alt Text**:
- ❌ Bad: "image"
- ❌ Bad: "picture of people"
- ✅ Good: "Team collaborating on laptops in modern office space"
- ✅ Good: "Bar chart showing 40% increase in revenue from Q1 to Q2"

---

## Apply This Fix

Run this command to apply the fix automatically:
```bash
# Coming soon: Auto-apply fixes
apply-fix --issue=1
```

Or copy the fixed code above and replace the current code manually.

---

## Learn More

- [Web.dev: Image Alt Text](https://web.dev/image-alt/)
- [WCAG 1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html)
- [WebAIM: Alternative Text](https://webaim.org/techniques/alttext/)

---

**Other Issues**:
- `fix issue 2` - Fix missing form labels
- `show accessibility issues` - Back to full list
```

---

## Memory System Enhancement with Beads

### Current Memory System Problems

The existing `.github/memory/` system has significant scalability issues:

**Problem 1: File Size Explosion**
- `session-notes.md`: **2,109 lines** (and growing with every session)
- `patterns-discovered.md`: **874 lines** (comprehensive pattern library)
- Both files become harder to query as they grow
- AI context window limitations make loading entire files expensive
- Users must manually search through large documents

**Problem 2: No Progressive Disclosure**
- Current approach: Load entire file or manually search with grep
- All-or-nothing: Either read everything or know exactly what to search for
- No quick overview to see what's available
- Cannot browse historical sessions efficiently

**Problem 3: Poor Discoverability**
- Hard to remember what sessions exist: "Was that Feb 11 or Feb 16?"
- Pattern names not surfaced: "What accessibility patterns do we have?"
- No categorization or filtering: "Show me all React patterns"
- Ephemeral scratch notes lost: No way to query past working notes

**Problem 4: Context Inefficiency**
- Loading full session history uses thousands of tokens
- Most queries need only 1-2 sessions, not all history
- Patterns loaded even when only session info needed (or vice versa)
- No on-demand loading of specific entries

---

### Beads Pattern Solution for Memory

Replace the current 3-file system with **memory-aware prompts** using progressive disclosure:

#### Architecture: Memory as Beads

```
📋 memory/
├── index.json              # Lightweight index for quick scanning
├── sessions/               # One file per session (easier to load on-demand)
│   ├── 2026-02-16-fresh-start.md
│   ├── 2026-02-11-testing-session.md
│   └── 2026-02-11-phase1-2-complete.md
├── patterns/               # One file per pattern category
│   ├── accessibility.md
│   ├── react.md
│   ├── performance.md
│   └── prompt-design.md
└── scratch/
    └── working-notes.md    # Still gitignored, but indexed daily
```

#### Stage 1: Memory Overview (Quick Scan)

**Prompt**: `#memory-scan` or "what's in the memory system?"

**Output**:
```markdown
# Memory System Overview 📚

**Last Updated**: 2026-02-16
**Total Sessions**: 12
**Total Patterns**: 47
**Session Duration**: 3 weeks

## Recent Sessions (Last 5)

| Date | Topic | Key Achievement | Files Changed |
|------|-------|-----------------|---------------|
| 2026-02-16 | Fresh Start: Prompt Reset | Created 5 minimal starter prompts | 7 created |
| 2026-02-11 | Testing Session | Demo app infrastructure | 4 created |
| 2026-02-11 | Phase 1 & 2 Complete | MCP integration finished | 9 updated |
| 2026-02-10 | Agent Integration | Added MCP tools to 3 agents | 3 updated |
| 2026-02-09 | MCP Servers | web-quality + react servers | 2 created |

## Pattern Categories

| Category | Patterns | Last Updated | Top Pattern |
|----------|----------|--------------|-------------|
| **Accessibility** | 8 | 2026-02-11 | WCAG Level AA compliance |
| **React** | 12 | 2026-02-16 | Component review workflow |
| **Performance** | 9 | 2026-02-11 | Core Web Vitals optimization |
| **Prompt Design** | 6 | 2026-02-16 | Simple conversational format |
| **Testing** | 5 | 2026-02-11 | Demo app validation |
| **Documentation** | 7 | 2026-02-16 | Memory system workflows |

**Total Patterns**: 47

---

## Next Steps

Explore specific sessions or patterns:
- `show session 2026-02-16` - Full details on Fresh Start session
- `show accessibility patterns` - All 8 accessibility patterns
- `show recent sessions` - Last 10 sessions with full details
- `search memory "lighthouse"` - Full-text search across all memory
```

**Implementation**:
- Reads `memory/index.json` only (lightweight, <10KB)
- Shows overview without loading any markdown files
- Completes in <5 seconds, no timeout risk

---

#### Stage 2: Category/Session Details (On Demand)

**Prompt**: `#memory-session 2026-02-16` or "show accessibility patterns"

**Output for Session**:
```markdown
## Fresh Start: Prompt Reset - 2026-02-16

### What Was Accomplished ✅
- Archived 22 previous prompts to `prompts_archived_20260216/`
- Created 5 minimal, essential starter prompts
- Simplified format from 60-80 line documentation-style to 10-15 line conversational
- Fixed formatting errors (deprecated `mode:`, incorrect `tools:`)
- Updated all documentation

### Key Findings and Decisions 🔍

**Problem**: Complex nested heading structures caused UI issues and made prompts read like technical documentation.

**Solution**: Complete format simplification
- Conversational, direct instructions
- No nested headings - just simple bullet points
- Focus on "what to do" not "how the prompt works"

**Decision Rationale**:
1. Quality over quantity: 5 great prompts > 22 problematic
2. Industry standards: Follow VS Code/Copilot best practices
3. Maintainability: Simple prompts easier to test and update

### Files Changed (7 files)
- Created: `.github/prompts/README.md`
- Created: 5 prompt files (lighthouse-audit, accessibility-check, etc.)
- Created: `docs/_archive/2026-02-16-fresh-start.md`

### Related Patterns
- [Simple Conversational Prompt Format](patterns/prompt-design.md#simple-conversational-format)
- [Agent Assignment Pattern](patterns/prompt-design.md#agent-assignment)

---

**Want more details?**
- `show pattern "simple conversational format"` - Full pattern with examples
- `show all patterns from this session` - 3 patterns discovered
- `compare session 2026-02-16 with 2026-02-11` - See evolution
```

**Output for Pattern Category**:
```markdown
# Accessibility Patterns (8 patterns)

**Last Updated**: 2026-02-11
**Related Sessions**: testing-session, phase1-2-complete

## Pattern Index

| # | Pattern Name | When to Use | Related Files |
|---|--------------|-------------|---------------|
| 1 | WCAG Level AA Compliance | All production code | 12 references |
| 2 | Semantic HTML First | Component scaffolding | 8 references |
| 3 | ARIA Attributes (When Needed) | Complex UI patterns | 6 references |
| 4 | Color Contrast Validation | Design system colors | 4 references |
| 5 | Focus Management | Dynamic content | 5 references |
| 6 | Alt Text Generation Pattern | Image handling | 10 references |
| 7 | Keyboard Navigation | Interactive components | 7 references |
| 8 | Screen Reader Testing | Critical user flows | 3 references |

---

**Explore patterns**:
- `show pattern "WCAG Level AA Compliance"` - Full details with code examples
- `show pattern 6` - Alt text generation pattern
- `show all accessibility patterns` - Full content of all 8 patterns
```

**Implementation**:
- Loads specific session file OR pattern category file (not all memory)
- Returns compact summary with links to deeper details
- Completes in <10 seconds

---

#### Stage 3: Detailed Pattern/Session (Deep Dive)

**Prompt**: `#memory-pattern "Simple Conversational Format"` or "show full pattern for alt text generation"

**Output**:
```markdown
## Pattern: Simple Conversational Prompt Format

**Context**: When creating `.prompt.md` files for GitHub Copilot Chat workflows

**Problem**: 
Complex documentation-style prompts with nested headers (##, ###, ####) cause:
1. VS Code UI navigation issues (prompts show up as navigable sections)
2. Prompts read like technical specs instead of actionable instructions
3. Too much structure makes prompts hard to maintain
4. Users struggle to understand what the prompt actually does

**Solution**: Use simple, conversational instructions with minimal structure

---

### ✅ Correct Format

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

---

### ❌ Anti-Pattern (Overly Complex)

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
...
```

---

### Related Files

- [lighthouse-audit.prompt.md](.github/prompts/lighthouse-audit.prompt.md) - Exemplar
- [accessibility-check.prompt.md](.github/prompts/accessibility-check.prompt.md) - Exemplar
- [docs/_archive/2026-02-16-fresh-start.md](docs/_archive/2026-02-16-fresh-start.md) - Origin session

### Performance Impact

- **Before**: 60-80 lines, complex navigation, hard to maintain
- **After**: 10-15 lines, simple structure, easy to update
- **Improvement**: ~75% reduction in prompt complexity

### When to Use

✅ Use this pattern:
- When creating any new `.prompt.md` file
- When refactoring existing prompts
- When prompts become hard to read or maintain

❌ Avoid this pattern:
- Never! Always use simple, conversational format

### History

- **Discovered**: 2026-02-16 (Fresh Start session)
- **Validation**: Tested with 6 prompts, zero errors
- **Status**: ✅ Adopted as standard

---

**Related patterns**:
- `show pattern "Agent Assignment"` - How to choose the right agent
- `show session 2026-02-16` - Session where this was discovered
```

**Implementation**:
- Loads single pattern file from `patterns/` directory
- Returns complete information with code examples
- Only loaded when user explicitly requests deep dive

---

### Implementation Strategy

#### 1. Restructure Memory Files

**Create `memory/index.json`**:
```json
{
  "lastUpdated": "2026-02-16T14:30:00Z",
  "sessions": [
    {
      "id": "2026-02-16-fresh-start",
      "date": "2026-02-16",
      "title": "Fresh Start: Prompt Reset",
      "keyAchievement": "Created 5 minimal starter prompts",
      "filesChanged": 7,
      "patternsDiscovered": ["simple-conversational-format", "agent-assignment"]
    }
  ],
  "patternCategories": [
    {
      "name": "accessibility",
      "count": 8,
      "lastUpdated": "2026-02-11",
      "topPattern": "WCAG Level AA Compliance"
    }
  ]
}
```

#### 2. Split Large Files

**Current `session-notes.md` (2109 lines)** → Split into:
- `sessions/2026-02-16-fresh-start.md` (~100 lines)
- `sessions/2026-02-11-testing-session.md` (~150 lines)
- `sessions/2026-02-11-phase1-2-complete.md` (~200 lines)
- ... (one file per session)

**Current `patterns-discovered.md` (874 lines)** → Split into:
- `patterns/accessibility.md` (~110 lines)
- `patterns/react.md` (~150 lines)
- `patterns/performance.md` (~120 lines)
- `patterns/prompt-design.md` (~140 lines)
- ... (one file per category)

#### 3. Create Memory Prompts

**New prompts**:
- `memory-scan.prompt.md` - Stage 1 (quick overview)
- `memory-session.prompt.md` - Stage 2 (session details)
- `memory-pattern.prompt.md` - Stage 2 (pattern category)
- `memory-search.prompt.md` - Full-text search across all memory

#### 4. Auto-Index Working Notes

**Daily automation**:
- At end of each session, AI summarizes `scratch/working-notes.md`
- Extracts key findings → adds to `memory/index.json`
- Creates new session file in `sessions/`
- Clears scratch notes for next session

---

### Benefits of Beads-Based Memory

| Aspect | Current System | With Beads Pattern |
|--------|----------------|-------------------|
| **File Size** | 2109 + 874 lines (single files) | 50-200 lines per file (split) |
| **Load Time** | 30-60 seconds (load all) | <5 seconds (index only) |
| **Discoverability** | Manual grep/search | Table overview + categories |
| **Context Efficiency** | Load everything or nothing | Load only what's needed |
| **Timeout Risk** | High (large files) | None (index + on-demand) |
| **Maintenance** | Hard to manage large files | Easy to add/update individual files |
| **AI Query UX** | "Read session-notes.md line 500-600" | "show session 2026-02-16" |

---

### Migration Plan

**Phase 1**: Create infrastructure (Week 1)
- [ ] Create `memory/index.json` generator script
- [ ] Split `session-notes.md` into individual session files
- [ ] Split `patterns-discovered.md` into category files
- [ ] Update `.github/copilot-instructions.md` to reference new structure

**Phase 2**: Create memory prompts (Week 1)
- [ ] `memory-scan.prompt.md` - Quick overview
- [ ] `memory-session.prompt.md` - Session details
- [ ] `memory-pattern.prompt.md` - Pattern category
- [ ] `memory-search.prompt.md` - Full-text search

**Phase 3**: Validation (Week 2)
- [ ] Test memory-scan on demo-app  
- [ ] Verify load times < 5 seconds
- [ ] Test pattern discovery workflow
- [ ] Document usage in README

**Phase 4**: Deprecate old system (Week 2)
- [ ] Archive `session-notes.md` → `_archive/session-notes-legacy.md`
- [ ] Archive `patterns-discovered.md` → `_archive/patterns-discovered-legacy.md`
- [ ] Update memory/README.md with new workflows
- [ ] Update all documentation references

---

### Success Criteria

✅ Memory system passes these tests:
- [ ] `#memory-scan` completes in <5 seconds
- [ ] Returns table overview without loading full files
- [ ] `show session [date]` loads only that session file
- [ ] `show [category] patterns` loads only that category
- [ ] Full-text search works across all memory files
- [ ] No timeouts on any memory query
- [ ] Users can discover sessions without knowing dates
- [ ] Pattern categories clearly organized
- [ ] New sessions automatically indexed

---

## Implementation Phases

### Phase 1: Core Beads Pattern (Week 1)

**Goal**: Implement 3-tier structure for web quality prompts

#### Tasks:
1. **Create Scan Prompts** (Stage 1)
   - [ ] `lighthouse-scan.prompt.md`
   - [ ] `accessibility-scan.prompt.md`
   - [ ] `performance-scan.prompt.md`
   - [ ] `react-scan.prompt.md`
   
   **Each scan prompt must**:
   - Complete in < 30 seconds
   - Output table format
   - Include scope detection
   - Provide "next steps" commands

2. **Create Detail Prompts** (Stage 2)
   - [ ] `show-accessibility-issues.prompt.md`
   - [ ] `show-performance-issues.prompt.md`
   - [ ] `show-react-issues.prompt.md`
   - [ ] `show-best-practices-issues.prompt.md`
   
   **Each detail prompt must**:
   - Accept category from scan
   - Return compact list with file:line
   - Include severity indicators
   - Provide "fix issue N" commands

3. **Create Fix Prompts** (Stage 3)
   - [ ] `fix-issue.prompt.md` (generic handler)
   - Accepts issue ID from detail prompt
   - Returns before/after code
   - Includes explanation and links

4. **Smart Scope Detection**
   - [ ] Implement file counting logic
   - [ ] Add scope detection to all scan prompts
   - [ ] Test on demo-app (3 files), medium project (30 files), large project (100+ files)

#### Deliverables:
- 3 scan prompts (Stage 1)
- 4 detail prompts (Stage 2)
- 1 fix prompt (Stage 3)
- README update with usage examples

---

### Phase 2: Testing & Validation (Week 1-2)

**Goal**: Validate beads pattern with demo-app

#### Tasks:
1. **Test Stage 1 (Scan)**
   - [ ] Run `lighthouse-scan` on demo-app
   - [ ] Verify completes in < 30 seconds
   - [ ] Validate table output format
   - [ ] Confirm "next steps" commands work

2. **Test Stage 2 (Details)**
   - [ ] Run `show accessibility issues`
   - [ ] Verify compact list format
   - [ ] Validate file:line references
   - [ ] Confirm issue counts match scan

3. **Test Stage 3 (Fix)**
   - [ ] Run `fix issue 1`
   - [ ] Verify before/after code correctness
   - [ ] Validate explanation quality
   - [ ] Confirm Learn More links work

4. **End-to-End Workflow**
   - [ ] Complete workflow: scan → details → fix → apply
   - [ ] Measure time for each stage
   - [ ] Document user experience
   - [ ] Collect improvement feedback

#### Deliverables:
- Test results document
- Before/after screenshots
- Performance metrics (time per stage)
- User feedback summary

---

### Phase 3: Revert Selection-Based Prompts (Week 2)

**Goal**: Remove rejected selection-based approach

#### Tasks:
1. **Revert Modified Prompts**
   - [ ] lighthouse-audit.prompt.md
   - [ ] accessibility-check.prompt.md
   - [ ] component-review.prompt.md
   - [ ] performance-check.prompt.md
   - [ ] code-review.prompt.md

2. **Replace with Beads Pattern**
   - [ ] Migrate to scan/detail/fix structure
   - [ ] Remove "top 3 only" constraints
   - [ ] Remove word limits
   - [ ] Add smart scope detection

3. **Update Documentation**
   - [ ] README.md - Update prompt descriptions
   - [ ] .github/prompts/README.md - Update usage guide
   - [ ] Add beads pattern examples

#### Deliverables:
- 6 prompts updated to beads pattern
- Updated documentation
- Git commit with clear message

---

### Phase 4: MCP Integration (Week 3)

**Goal**: Enhance scans with MCP server automation

#### Tasks:
1. **Web Quality MCP Server**
   - [ ] `lighthouse_audit` tool - Execute Lighthouse
   - [ ] `axe_audit` tool - Execute axe-core
   - [ ] `analyze_performance` tool - Core Web Vitals
   
2. **React MCP Server**
   - [ ] `review_component` tool - Analyze React component
   - [ ] `detect_anti_patterns` tool - Find React anti-patterns
   - [ ] `suggest_optimizations` tool - Performance suggestions

3. **Integration Testing**
   - [ ] Test MCP tools from scan prompts
   - [ ] Verify JSON output parsing
   - [ ] Validate error handling
   - [ ] Measure execution time

#### Deliverables:
- 2 MCP servers with tools
- Integration tests
- Updated prompts using MCP tools
- README with MCP setup instructions

---

### Phase 5: Polish & Documentation (Week 3-4)

**Goal**: Production-ready toolkit

#### Tasks:
1. **User Documentation**
   - [ ] Getting Started guide
   - [ ] Workflow examples
   - [ ] Troubleshooting guide
   - [ ] Video demo (5 minutes)

2. **Developer Documentation**
   - [ ] Architecture overview
   - [ ] Adding new prompts guide
   - [ ] MCP server development guide
   - [ ] Testing guide

3. **Examples & Templates**
   - [ ] Before/after examples from demo-app
   - [ ] Real-world case studies
   - [ ] Integration templates (GitHub Actions, etc.)

4. **Memory System**
   - [ ] Update memory/session-notes.md
   - [ ] Document patterns-discovered.md
   - [ ] Create architecture decision records

#### Deliverables:
- Complete documentation
- Video demo
- Examples repository
- Updated memory system

---

## Prompt Structure

### Scan Prompt Template

```markdown
---
description: "Quick [category] scan (Stage 1 of 3)"
tools: ["codebase", "search"]
---

# Quick [Category] Scan

**Stage**: 1 of 3 (Quick Scan)
**Time**: ~30 seconds
**Scope**: Smart detection (whole project, current file, or current + imports)

## Instructions

1. **Detect Scope**
   - Count relevant files in project
   - < 10 files: Analyze whole project
   - 10-50 files: Analyze current file + imports
   - > 50 files: Analyze current file only

2. **Scan for Issues**
   - Run quick analysis (counts only)
   - No deep dive, no code examples
   - Categorize by severity (Critical, High, Medium, Low)

3. **Generate Summary Table**

Format:
| Category | Issues | Severity | Top Issue |
|----------|--------|----------|-----------|
| [Name] | [Count] | [Icon] | [Brief description] |

4. **Provide Next Steps**

List commands:
- `show [category] issues` - See detailed list
- `fix issue N` - Get code to fix specific issue

## Example Output

[Include sample table and next steps]

## Notes

- This is Stage 1 of 3 (progressive disclosure)
- Users drill down via follow-up commands
- No code examples at this stage (prevents timeouts)
```

---

### Detail Prompt Template

```markdown
---
description: "Show [category] issues in detail (Stage 2 of 3)"
tools: ["codebase", "search"]
---

# [Category] Issues - Detailed List

**Stage**: 2 of 3 (Category Details)
**Previous**: User ran scan and saw issue count
**Next**: User can request specific fix

## Instructions

1. **List All Issues**
   - Number sequentially (1, 2, 3...)
   - Include file:line references
   - Brief description (1 line)
   - Severity indicator (🔴 🟠 🟡 🟢)

2. **Group by Severity**
   - Critical first
   - Then High, Medium, Low

3. **Format**

```markdown
## Critical Issues (N)

1. **[Issue name]** - `[audit-id]` (WCAG X.X.X)
   - [file.js:45](file.js#L45) - Brief context
   - **Impact**: User impact description
   - **Audit ID**: Link to web.dev or docs

[Repeat for all issues]
```

4. **Provide Next Steps**

Commands:
- `fix issue 1` - Get code to fix this issue
- `fix all critical` - Generate fixes for all critical issues (future)

## Example Output

[Include sample list]

## Notes

- Keep descriptions brief (1 line per issue)
- No code examples yet (Stage 3)
- Link to authoritative sources
```

---

### Fix Prompt Template

```markdown
---
description: "Generate fix for specific issue (Stage 3 of 3)"
tools: ["codebase", "search"]
---

# Fix Issue #[N]

**Stage**: 3 of 3 (Specific Fix)
**Previous**: User saw issue list and requested fix

## Instructions

1. **Fetch Issue Context**
   - Load file and line number
   - Extract current code snippet
   - Identify audit/rule violated

2. **Generate Fix**

Format:
```markdown
# Fix: [Issue Name]

**Issue ID**: [N]
**Audit**: `[audit-id]` (WCAG X.X.X)
**Severity**: [Icon] [Level]
**Impact**: [Description]

---

## Current Code ([file:line])

```[language]
[Before code with problem highlighted]
```

---

## Fixed Code

```[language]
[After code with fix applied]
```

---

## Explanation

**What Changed**:
- [List specific changes]

**Best Practices**:
- [Guidelines to follow]

**Example** (optional):
- [Additional examples]

---

## Learn More

- [Link to web.dev or docs]
- [Link to WCAG]
- [Link to other resources]
```

3. **Provide Apply Command** (future)
- `apply-fix --issue=[N]` - Auto-apply fix

## Example Output

[Include sample fix]

## Notes

- Include before/after code
- Explain WHY not just WHAT
- Link to authoritative sources
- Consider edge cases in explanation
```

---

## Testing Strategy

### Test Plan: Beads Pattern Validation

#### Test Environment
- **Project**: demo-app (3 files: index.html, style.css, script.js)
- **Known Issues**: Accessibility score 74 (see BASELINE-RESULTS.md)
- **Expected Behavior**: No timeouts, progressive disclosure works

---

#### Test Case 1: Stage 1 (Quick Scan)

**Prompt**: `lighthouse-scan`

**Expected Output**:
- Completes in < 30 seconds
- Table with categories: Accessibility, Performance, Best Practices, SEO
- Accessibility shows ~12 issues (matches baseline)
- "Next steps" commands listed

**Success Criteria**:
- ✅ No timeout
- ✅ Table format correct
- ✅ Issue counts accurate (±2 tolerance)
- ✅ Next steps commands present

---

#### Test Case 2: Stage 2 (Category Details)

**Prompt**: `show accessibility issues`

**Expected Output**:
- List of 12 accessibility issues
- File:line references for each
- Severity indicators (🔴 🟠 🟡 🟢)
- "fix issue N" commands

**Success Criteria**:
- ✅ All 12 issues listed
- ✅ File:line references correct
- ✅ Grouped by severity
- ✅ Includes Learn More links

---

#### Test Case 3: Stage 3 (Specific Fix)

**Prompt**: `fix issue 1`

**Expected Output**:
- Before/after code for missing alt text
- Explanation of fix
- Best practices guidelines
- Learn More links

**Success Criteria**:
- ✅ Correct file:line identified
- ✅ Before code matches current code
- ✅ After code is valid and fixes issue
- ✅ Explanation clear and helpful
- ✅ Links work

---

#### Test Case 4: End-to-End Workflow

**Steps**:
1. Run `lighthouse-scan`
2. Note accessibility issues (12)
3. Run `show accessibility issues`
4. Pick issue 1 (missing alt text)
5. Run `fix issue 1`
6. Apply fix manually
7. Re-run `lighthouse-scan`
8. Verify issue count decreased to 11

**Success Criteria**:
- ✅ Full workflow completes without errors
- ✅ Issue count decreases after fix
- ✅ Total time < 5 minutes
- ✅ User experience smooth

---

#### Test Case 5: Smart Scope Detection

**Small Project** (demo-app, 3 files):
- Run `lighthouse-scan`
- Verify scope: "Analyzing 3 files (whole project)"

**Medium Project** (simulated, 25 files):
- Run `lighthouse-scan`
- Verify scope: "Analyzing index.html + 4 imports (current + imports)"

**Large Project** (simulated, 150 files):
- Run `lighthouse-scan`
- Verify scope: "Analyzing index.html only (current file)"

**Success Criteria**:
- ✅ Correct scope detection for each size
- ✅ Scope communicated to user
- ✅ Analysis completes in < 30 seconds for all

---

#### Test Case 6: Conversational Follow-up

**Natural Language Commands**:
- "show me the accessibility problems"
- "fix the first issue"
- "what about performance?"
- "fix issue number 2"

**Success Criteria**:
- ✅ Natural language understood
- ✅ Correct prompt triggered
- ✅ Context maintained across turns

---

### Regression Testing

After beads pattern implementation, verify:

1. **No Timeouts**
   - [ ] Run all scan prompts on demo-app
   - [ ] Run all scan prompts on larger project (50+ files)
   - [ ] Verify all complete in < 60 seconds

2. **Correct Issue Detection**
   - [ ] Compare scan results to Lighthouse CLI output
   - [ ] Verify issue counts match (±10% tolerance)
   - [ ] Validate severity classifications

3. **Code Quality**
   - [ ] All fix suggestions are valid code
   - [ ] No syntax errors in before/after examples
   - [ ] Fixes actually resolve the issue

4. **Documentation**
   - [ ] All Learn More links work
   - [ ] Audit IDs correct and searchable
   - [ ] WCAG references accurate

---

## Success Metrics

### Quantitative Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Stage 1 Completion Time** | < 30 seconds | Timestamp logs |
| **Stage 2 Completion Time** | < 10 seconds | Timestamp logs |
| **Stage 3 Completion Time** | < 5 seconds | Timestamp logs |
| **Issue Detection Accuracy** | > 90% | Compare to Lighthouse CLI |
| **Fix Correctness** | 100% | Manual code review |
| **User Workflow Time** (scan → fix) | < 5 minutes | End-to-end test |
| **Timeout Rate** | 0% | Error tracking |

---

### Qualitative Metrics

| Metric | Assessment |
|--------|-----------|
| **Ease of Use** | Can user complete workflow without documentation? |
| **Value Delivered** | Does user feel they got actionable insights? |
| **Progressive Disclosure** | Does 3-stage pattern feel natural? |
| **Fix Quality** | Would user trust and apply suggested fixes? |
| **Documentation Clarity** | Are Learn More links helpful? |

---

### User Feedback Questions

After testing, ask users:

1. **Usability**
   - How intuitive was the 3-stage workflow?
   - Did you understand what to do at each stage?
   - Any confusing commands or unclear instructions?

2. **Performance**
   - Did any stage feel slow or timeout?
   - Was the quick scan actually quick?
   - Would you use this in your daily workflow?

3. **Value**
   - Did the findings help you improve your code?
   - Were the fix suggestions accurate and helpful?
   - What features are missing?

4. **Comparison**
   - How does this compare to running Lighthouse manually?
   - Would you prefer this over axe-core CLI?
   - What does this do better/worse than alternatives?

---

## Timeline & Milestones

### Week 1: Core Implementation + Testing

| Days | Tasks | Deliverable |
|------|-------|-------------|
| **Mon-Tue** | Phase 1.1-1.2: Create scan and detail prompts | 7 new prompt files |
| **Wed** | Phase 1.3-1.4: Create fix prompt + smart scope detection | 1 prompt + scope logic |
| **Thu-Fri** | Phase 2: Testing & validation on demo-app | Test results report |

**Milestone 1**: Beads pattern working end-to-end on demo-app ✅

---

### Week 2: Revert & Polish

| Days | Tasks | Deliverable |
|------|-------|-------------|
| **Mon-Tue** | Phase 3.1-3.2: Revert selection-based, replace with beads | 6 prompts updated |
| **Wed** | Phase 3.3: Update documentation | README, examples |
| **Thu-Fri** | Phase 5.1-5.2: User documentation + examples | Getting started guide |

**Milestone 2**: All prompts use beads pattern ✅

---

### Week 3: MCP Integration

| Days | Tasks | Deliverable |
|------|-------|-------------|
| **Mon-Tue** | Phase 4.1: Implement web quality MCP server | 3 MCP tools |
| **Wed** | Phase 4.2: Implement React MCP server | 3 MCP tools |
| **Thu-Fri** | Phase 4.3: Integration testing | Test report |

**Milestone 3**: MCP servers enhance scan prompts ✅

---

### Week 4: Final Polish

| Days | Tasks | Deliverable |
|------|-------|-------------|
| **Mon** | Phase 5.3: Examples & templates | Before/after examples |
| **Tue** | Phase 5.4: Memory system updates | Updated memory docs |
| **Wed** | Video demo creation | 5-minute demo video |
| **Thu** | Final testing & bug fixes | Bug fix commits |
| **Fri** | Release prep & documentation review | Release checklist |

**Milestone 4**: Production-ready release ✅

---

## Next Steps (Immediate Actions)

1. **Create new branch** ✅
   ```bash
   git checkout -b feature/beads-pattern
   ```

2. **Start with Phase 1 Task 1**: Create scan prompts
   - Begin with `lighthouse-scan.prompt.md`
   - Test on demo-app immediately
   - Iterate based on results

3. **Document as you go**
   - Update memory/scratch/working-notes.md during work
   - Commit working code frequently
   - Create examples for documentation

4. **Measure everything**
   - Track completion time for each stage
   - Log timeout occurrences (should be zero)
   - Document user experience

5. **Get feedback early**
   - Test Stage 1 prompt first
   - Validate table format with user
   - Adjust before building Stages 2 and 3

---

## Risk Mitigation

### Risk 1: Stage 1 Still Times Out

**Mitigation**:
- Start with absolute minimal analysis (file counts only)
- No AST parsing in Stage 1
- No external tool execution (save for MCP integration)
- Fallback: If timeout, return partial results + "run scan again"

---

### Risk 2: User Doesn't Understand 3-Stage Pattern

**Mitigation**:
- Clear "Stage X of 3" labeling
- "Next steps" prominently displayed
- Include examples in every output
- Provide video demo

---

### Risk 3: Fix Suggestions Are Incorrect

**Mitigation**:
- Test all fixes manually before release
- Include "verify this fix" disclaimer
- Link to authoritative sources for validation
- Maintain fix-correctness.md tracking known issues

---

### Risk 4: MCP Integration Slows Down Scans

**Mitigation**:
- MCP tools optional (prompts work without them)
- Cache MCP results
- Timeout on MCP calls (5 seconds max)
- Fallback to prompt-only analysis

---

## Open Questions

1. **Should Stage 3 include auto-apply?**
   - Pro: Maximum convenience
   - Con: Risk of breaking code
   - **Decision**: Defer to Phase 5, include manual apply initially

2. **Should we allow "fix all critical"?**
   - Pro: Batch efficiency
   - Con: Large context consumption, risk of conflicts
   - **Decision**: Implement in Phase 5 if Stage 3 works well

3. **How to handle non-deterministic issues?**
   - Example: "Performance score varies by 5 points"
   - **Decision**: Show ranges in Stage 1, link to variability docs

4. **Should scans be cached?**
   - Pro: Instant re-run if no code changes
   - Con: Complexity, potential staleness
   - **Decision**: Defer to Phase 5 based on user feedback

---

## Appendix A: Competitive Feature Matrix

| Feature | Lighthouse CI | axe-core | Web Quality Skills | Our Toolkit (Post-Implementation) |
|---------|---------------|----------|-------------------|----------------------------------|
| Automated Execution | ✅ CI/CD | ✅ API | ❌ Docs | ✅ MCP + Prompts |
| Progressive Disclosure (Beads) | ❌ | ❌ | ❌ | ✅ 3-stage pattern |
| AI-Guided Fixes | ❌ | ❌ | ❌ | ✅ Before/after code |
| Natural Language Interface | ❌ | ❌ | ❌ | ✅ Copilot Chat |
| Smart Scope Detection | ❌ | ❌ | ❌ | ✅ Auto-detects project size |
| Editor Integration | ❌ CI-only | ⚠️ Extensions | ❌ | ✅ Native VS Code |
| Timeout Prevention | ⚠️ Long runs | ✅ Fast | N/A | ✅ Beads pattern |
| Framework Agnostic | ✅ | ✅ | ✅ | ✅ |
| React Best Practices | ❌ | ❌ | ⚠️ Some | ✅ Vercel patterns |
| Sources of Truth Integration | ⚠️ Own rules | ⚠️ Own rules | ✅ | ✅ References web-quality-skills |

---

## Appendix B: Prompt Naming Convention

**Scan Prompts** (Stage 1):
- `[domain]-scan.prompt.md`
- Examples: `lighthouse-scan`, `accessibility-scan`, `react-scan`

**Detail Prompts** (Stage 2):
- `show-[category]-issues.prompt.md`
- Examples: `show-accessibility-issues`, `show-performance-issues`

**Fix Prompts** (Stage 3):
- `fix-issue.prompt.md` (generic)
- Future: `fix-[specific].prompt.md` for specialized fixes

**Rationale**: Clear naming indicates stage and purpose

---

## Appendix C: Example User Workflow

**Scenario**: Developer wants to improve accessibility

**Session Transcript**:

```
USER: How is the accessibility of my demo-app?

COPILOT: [Runs lighthouse-scan]

# Web Quality Scan Complete ✅

**Scope**: Analyzed 3 files (whole project detected)
**Time**: 28 seconds

## Results Summary

| Category | Issues | Severity | Top Issue |
|----------|--------|----------|-----------|
| **Accessibility** | 12 | 🔴 Critical | Images without alt text (8 occurrences) |
| **Performance** | 8 | 🟠 High | Render-blocking resources (3 files) |
| **Best Practices** | 5 | 🟡 Medium | Missing error boundaries |

**Total Issues**: 25

---

## Next Steps

Run: `show accessibility issues` to see all 12 problems

---

USER: show accessibility issues

COPILOT: [Runs show-accessibility-issues]

# Accessibility Issues (12)

## Critical Issues (8)

1. **Images without alt text** - `image-alt` (WCAG 1.1.1)
   - [index.html:45](index.html#L45) - `<img src="hero.jpg">`
   - [index.html:67](index.html#L67) - `<img src="feature1.png">`
   - **Impact**: Screen readers cannot describe images

2. **Form inputs without labels** - `label` (WCAG 3.3.2)
   - [index.html:120](index.html#L120) - `<input type="email">`
   - **Impact**: Screen reader users don't know input purpose

[... more issues ...]

**Commands**: Run `fix issue 1` to get code

---

USER: fix issue 1

COPILOT: [Runs fix-issue with ID=1]

# Fix: Images Without Alt Text

**Issue ID**: 1
**Audit**: `image-alt` (WCAG 1.1.1 Level A)
**Severity**: 🔴 Critical

---

## Current Code (index.html:45)

```html
<!-- ❌ Missing alt attribute -->
<img src="hero.jpg">
```

---

## Fixed Code

```html
<!-- ✅ Descriptive alt text -->
<img src="hero.jpg" alt="Team collaborating on laptops in modern office space">
```

---

## Explanation

Alt text provides a text alternative for screen reader users...

[... best practices ...]

---

## Learn More

- [Web.dev: Image Alt Text](https://web.dev/image-alt/)

---

USER: Apply this fix

COPILOT: [User manually applies fix to index.html]

✅ Fix applied! Run `lighthouse-scan` again to verify improvement.
```

**Result**: Full workflow completed in < 5 minutes, user understood each stage, issue resolved.

---

**END OF IMPLEMENTATION PLAN**

Generated: 2026-02-16  
Authors: AI Assistant + User Feedback  
Version: 1.0  
Status: Ready for Implementation ✅

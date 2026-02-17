# Beads CLI Integration Plan

**Date**: 2026-02-17 (Updated)  
**Branch**: `feature/beads-integration`  
**Status**: Phase 2 Complete - Memory System Migrated ✅  
**Progress**: Phase 0 ✅ | Phase 1 🔄 | Phase 2 ✅ | Phase 3 ⏸️  

---

## Executive Summary

**Problem**: Current system has two critical issues:
1. Prompts timeout when analyzing entire projects (no progressive disclosure)
2. No persistent memory across sessions (fixes are lost, must re-scan)

**Solution**: Dual integration of [beads CLI](https://github.com/steveyegge/beads) tool:
1. **Progressive Disclosure Pattern** - Avoid timeouts with 3-stage workflow
2. **Task Persistence** - Track web quality issues, memory, and patterns across sessions

### Progressive Disclosure (UX Pattern)
- **Stage 1 (Quick Scan)**: 30-second table summary → No timeout risk  
- **Stage 2 (Category Details)**: Issue list on demand → User controls depth  
- **Stage 3 (Specific Fix)**: Code examples only when requested → Minimal context use  

### Beads CLI Integration (Task Persistence)
- **Git-backed task tracker** specifically designed for AI agents
- **JSON API** for every command (agent-native)
- **Structured memory** replaces markdown files (2,109 + 874 lines)
- **Dependency tracking** for blocking relationships
- **Cross-session state** - persistent context across agent sessions
- **Zero-conflict merges** using Dolt (versioned SQL) + hash IDs

**Benefits**:
- ✅ No timeouts (Stage 1 completes quickly)
- ✅ No manual selection required (automatic smart scope)
- ✅ Maximum value (user explores what matters to them)
- ✅ Context efficient (only load details on demand)
- ✅ **Persistent memory** - Track issues across sessions
- ✅ **No re-scanning** - Query beads instead of re-running audits
- ✅ **Dependency tracking** - "Fix A before B" relationships
- ✅ **Multi-agent coordination** - Shared task database

**What is Beads**: Distributed, git-backed issue tracker designed for AI agents. Provides structured, versioned task management with JSON API, automatic git sync, and cell-level conflict resolution.

---

## Implementation Note: Using Beads v0.49.6

**Current Approach**: Downgrade to Beads v0.49.6 with SQLite backend  
**Reason**: v0.52.0 has multiple blocking issues:
- CGO dependency prevents Dolt initialization ([#1812](https://github.com/steveyegge/beads/issues/1812), [#1805](https://github.com/steveyegge/beads/issues/1805))
- `--no-db` flag documented but not implemented in v0.52.0
- `no-db: true` config ignored in v0.50+ ([#1833](https://github.com/steveyegge/beads/issues/1833))

**Solution**: v0.49.6 is production-stable with SQLite (no CGO needed)  
**Status**: Community-proven workaround, waiting for v0.53+ to fix issues

### Why v0.49.6?

✅ **Production-Ready Features**:
- **SQLite backend** - No CGO dependency, works out-of-the-box
- **JSONL mode** - `no-db: true` config works perfectly
- **Full feature set** - JSON API, dependencies, labels, git hooks
- **Community-proven** - Stable version, positive feedback
- **Simple setup** - No complex source builds or dependency hell

✅ **All Features We Need**:
- Git-backed persistence (`.beads/issues.jsonl` tracked in git)
- JSON API for all commands (`--json` flag)
- Task creation, listing, updating, closing
- Dependency tracking (`bd dep` commands)
- Cross-session state persistence
- Git hooks for auto-sync
- Hash-based IDs (bd-abc format)
- Labels and filtering

⚠️ **What We'll Get Later (Dolt in v0.53+)**:
- Cell-level merge conflict resolution (not critical for single-user)
- Multi-writer concurrency (not needed initially)
- Advanced SQL queries (JSONL sufficient for now)

### Upgrade Path

When beads fixes issues (v0.53+ expected):

```bash
# Option 1: Upgrade and keep SQLite
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
bd migrate --yes  # Migrate data if needed

# Option 2: Upgrade and migrate to Dolt (if CGO resolved)
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
bd migrate --to-dolt  # Migrate to Dolt backend

# Option 3: Keep v0.49.6 (if it works for you)
# No action needed, pin to v0.49.6
```

**Decision**: Use v0.49.6 now (stable, works immediately), upgrade when issues resolved. All features needed for this project work in v0.49.6.

---

## Table of Contents

1. [Competitive Analysis](#competitive-analysis)
2. [Integration with Core Sources of Truth](#integration-with-core-sources-of-truth)
3. [Technical Architecture](#technical-architecture)
4. [Beads CLI Overview](#beads-cli-overview)
5. [Web Quality Integration with Beads CLI](#web-quality-integration-with-beads-cli)
6. [Memory System with Beads CLI](#memory-system-with-beads-cli)
7. [Implementation Phases](#implementation-phases)
8. [Prompt Structure](#prompt-structure)
9. [Testing Strategy](#testing-strategy)
10. [Success Metrics](#success-metrics)
11. [Timeline & Milestones](#timeline--milestones)

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

## Beads CLI Overview

### What is Beads?

**Beads** (`bd`) is a distributed, git-backed issue tracker designed specifically for AI agents. Created by Steve Yegge, it provides persistent, structured memory for long-horizon tasks.

**Key Features**:
- **Dolt-Powered**: Versioned SQL database with cell-level merge (no conflicts)
- **Git Integration**: Automatic JSONL export/import via git hooks
- **Agent-Optimized**: Every command has `--json` flag for parsing
- **Dependency Tracking**: `bd dep add <child> <parent>` for blocking relationships
- **Hash-Based IDs**: `bd-a1b2` format prevents merge collisions
- **Hierarchical Tasks**: Epic → Task → Sub-task (`bd-abc.1.2`)
- **Auto-Ready Detection**: `bd ready` shows only unblocked tasks
- **Zero Configuration**: `bd init` in any project, works immediately

### Core Commands

```bash
# Initialize in project
bd init

# Create tasks
bd create "Fix accessibility issues" -p 1 -t bug --label web-quality --json

# List ready tasks (no blockers)
bd ready --json
bd ready --label web-quality --json

# Claim and track work
bd update bd-abc --claim --json
bd update bd-abc --status in_progress --json

# Add dependencies
bd dep add bd-xyz bd-abc  # xyz blocks abc

# Close completed work
bd close bd-abc --reason "Fixed all alt text" --json

# Sync with git (export, commit, push)
bd sync

# View task details
bd show bd-abc --json
```

### Why Use Beads for This Project?

**Problem 1: No Cross-Session Memory**
- Current: Run Lighthouse → Find 27 issues → Fix 5 → **No record of which 5**
- Next session: Must remember what was fixed or re-scan everything

**Solution with Beads**:
- Lighthouse scan creates 27 beads tasks (one per issue)
- Fix 5 issues → Close 5 beads tasks
- Next session: `bd ready --label web-quality` shows 22 remaining
- **No re-scanning needed** - Query beads database

**Problem 2: No Dependency Tracking**
- Some optimizations depend on others (e.g., LCP improvement requires fixing render-blocking CSS)
- Current: Manual tracking in prose ("must fix X before Y")

**Solution with Beads**:
- `bd dep add bd-lcp bd-render` (LCP blocks on render-blocking fix)
- `bd ready` automatically excludes blocked tasks
- Natural progression through optimization hierarchy

**Problem 3: Large Markdown Files**
- `session-notes.md`: 2,109 lines (growing)
- `patterns-discovered.md`: 874 lines
- Hard to query, expensive to load, merge conflicts

**Solution with Beads**:
- Structured SQL database for session/pattern data
- JSON API for queries
- Cell-level merge (no conflicts)

### Installation

```bash
# Via curl (recommended)
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash

# Via npm
npm install -g @beads/bd

# Via Homebrew
brew install beads

# Verify
bd version
```

---

## Web Quality Integration with Beads CLI

### Problem: No Persistence for Web Quality Findings

**Current Workflow (Without Beads)**:
1. Session 1: Run Lighthouse → Find 27 issues → Fix 5 critical
2. Session 2: Run Lighthouse again → Shows 22 issues, but **no context** about:
   - Which 5 were fixed
   - Which issues are in progress
   - What dependencies exist ("fix A before B")
   - Historical improvements
3. Every session requires full re-scan or manual note-keeping

**Problem**: No structured, persistent tracking of web quality issues across sessions.

---

### Solution: Beads CLI + Progressive Disclosure

**Dual Integration**:
1. **Progressive Disclosure Pattern** - Avoid timeouts during initial scan
2. **Beads CLI** - Persist findings as tasks for cross-session tracking

---

### Integrated Workflow

#### Stage 1: Initial Scan + Create Tasks

**Prompt**: `#web-quality-scan` or "run lighthouse audit"

**What Happens**:
1. Progressive scan (Stage 1: Quick overview, <30 seconds)
2. For each finding, create a beads task:

```bash
# Accessibility issues
bd create "Fix: Images without alt text (8 occurrences)" \
  -p 1 -t bug --label web-quality --label accessibility \
  --description "index.html lines 45, 67, 78, etc. Missing alt attributes" \
  --json
# Returns: bd-a1b2

bd create "Fix: Form inputs without labels (2 occurrences)" \
  -p 1 -t bug --label web-quality --label accessibility \
  --description "index.html lines 120, 125" \
  --json
# Returns: bd-c3d4

# Performance issues
bd create "Fix: Render-blocking CSS (3 files)" \
  -p 1 -t bug --label web-quality --label performance \
  --description "style.css, theme.css, vendor.css blocking LCP" \
  --json
# Returns: bd-e5f6

bd create "Improve: LCP to < 2.5s" \
  -p 0 -t task --label web-quality --label performance \
  --description "Current: 3.2s, Target: 2.5s" \
  --json
# Returns: bd-g7h8

# Add dependency: LCP improvement depends on fixing render-blocking
bd dep add bd-g7h8 bd-e5f6  # g7h8 (LCP) blocks on e5f6 (render-blocking)
```

**Output to User**:
```markdown
# Web Quality Scan Complete ✅

**Scope**: Analyzed 3 files (whole project)
**Tasks Created**: 27 beads tasks filed

## Results Summary

| Category | Issues | Tasks Filed | Top Issue |
|----------|--------|-------------|--------|
| Accessibility | 12 | bd-a1b2 to bd-m13n | Images without alt text |
| Performance | 8 | bd-e5f6 to bd-w21x | Render-blocking resources |
| Best Practices | 5 | bd-y23z to bd-c27d | Missing error boundaries |
| SEO | 2 | bd-e29f to bd-g31h | Missing meta description |

**Total Issues**: 27 tasks in beads tracker

---

## Next Steps

Query beads to explore:
- `bd ready --label accessibility --json` - Show unblocked accessibility tasks
- `bd ready --label performance --json` - Show unblocked performance tasks
- `show accessibility issues` - Stage 2 details from beads
- `fix issue bd-a1b2` - Stage 3 fix code
```

**Key Innovation**: Issues now persisted in beads. No need to re-scan to see what remains.

---

#### Stage 2: Query Tasks (No Re-Scan!)

**Prompt**: `show accessibility issues` or "what accessibility work remains?"

**What Happens**:
1. Query beads (NOT re-run Lighthouse):

```bash
bd ready --label accessibility --json
```

2. Generate Stage 2 output from beads tasks:

**Output**:
```markdown
# Accessibility Issues (12 tasks)

**Source**: Beads tracker (no re-scan required)
**Ready Tasks**: 10 (2 blocked by dependencies)

## Critical Issues (8 tasks ready)

1. **bd-a1b2**: Images without alt text - `image-alt` (WCAG 1.1.1)
   - Files: index.html (lines 45, 67, 78)
   - Status: `open` | Priority: P1
   - **Impact**: Screen readers cannot describe images
   - **Command**: `fix issue bd-a1b2`

2. **bd-c3d4**: Form inputs without labels - `label` (WCAG 3.3.2)
   - Files: index.html (lines 120, 125)
   - Status: `open` | Priority: P1
   - **Impact**: Screen reader users don't know input purpose
   - **Command**: `fix issue bd-c3d4`

## Blocked Issues (2 tasks)

10. **bd-k19l**: Improve keyboard navigation
    - Blocked by: bd-j17i (Focus management)
    - Will be ready when dependency closes

---

**Commands**:
- `fix issue bd-a1b2` - Get code to fix alt text
- `claim bd-a1b2` - Assign task to yourself
- `bd show bd-a1b2 --json` - Full task details
```

**Benefits**:
- ✅ No Lighthouse re-scan (query beads instead)
- ✅ See exactly what's left (not what's already fixed)
- ✅ Dependency visualization (blocked tasks shown separately)
- ✅ Fast (<5 seconds vs 30+ seconds for re-scan)

---

#### Stage 3: Fix & Close Task

**Prompt**: `fix issue bd-a1b2` or "show fix for alt text issue"

**What Happens**:
1. Query beads for task details:
```bash
bd show bd-a1b2 --json
```

2. Generate Stage 3 fix code (same as before)

3. After user applies fix:
```bash
# Claim task
bd update bd-a1b2 --claim --status in_progress --json

# User applies fix

# Close task
bd close bd-a1b2 --reason "Added alt text to all 8 images" --json

# Sync with git
bd sync
```

**Output**:
```markdown
# Fix: Images Without Alt Text (bd-a1b2)

[... same Stage 3 output as before with code examples ...]

---

## After Applying Fix

Run these commands to update beads:

```bash
# Mark as completed
bd close bd-a1b2 --reason "Added alt text to all 8 images"

# Sync with git (export, commit, push)
bd sync
```

**Progress Update**: 11 accessibility tasks remaining (was 12)
```

---

#### Stage 4: Cross-Session Continuity

**Session 1** (Initial scan):
```bash
bd ready --label web-quality --json
# 27 tasks, fix 5 critical ones
```

**Session 2** (Next day):
```bash
bd ready --label web-quality --json
# 22 tasks remain
# Beads remembers: "You fixed 5 issues last session"
# Agent: "Last session you completed bd-a1b2, bd-c3d4, bd-e5f6, bd-g7h8, bd-i9j0"
```

**Session 3** (Re-validation):
```bash
# Periodically re-run Lighthouse to verify fixes
# Compare findings with open beads tasks
# Close any validated fixes
# File new tasks for any regressions
```

---

### Dependency Tracking Example

**Scenario**: LCP improvement requires fixing render-blocking CSS first

```bash
# Create performance tasks
bd create "Fix: Render-blocking CSS" -p 1 -t bug --label performance --json
# Returns: bd-render

bd create "Improve: LCP to < 2.5s" -p 0 -t task --label performance --json
# Returns: bd-lcp

# Add dependency (LCP blocked by render-blocking)
bd dep add bd-lcp bd-render  # lcp BLOCKS ON render

# Query ready tasks
bd ready --label performance --json
# Shows bd-render (ready)
# Does NOT show bd-lcp (blocked)

# After fixing render-blocking:
bd close bd-render --reason "Eliminated 3 blocking stylesheets"

# Query again
bd ready --label performance --json
# NOW shows bd-lcp (unblocked)
```

**Benefits**:
- Natural progression through optimization hierarchy
- Prevents working on blocked optimizations
- Documents why certain fixes come before others

---

### Complete Workflow Diagram

```
┌─────────────────────────────────────┐
│ INITIAL SCAN (Progressive + Beads) │
│ - Stage 1: Lighthouse (30s)        │
│ - Create beads task per finding    │
│ - Add dependencies where needed    │
│ - Show summary table               │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ QUERY TASKS (No Re-Scan)           │
│ - bd ready --label <category>      │
│ - Stage 2: Details from beads      │
│ - Show file:line from task data    │
│ - Fast (<5s vs 30+s)               │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ FIX & CLOSE                        │
│ - Stage 3: Show fix code           │
│ - bd update (claim/in-progress)    │
│ - Apply fix manually               │
│ - bd close (after verification)    │
│ - bd sync (git commit + push)      │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ RE-VALIDATE (Periodic)             │
│ - Re-run Lighthouse (weekly?)      │
│ - Compare with open tasks          │
│ - Close validated fixes            │
│ - File new tasks for regressions   │
└─────────────────────────────────────┘
```

---

### Benefits Summary: Web Quality + Beads

| Aspect | Without Beads | With Beads CLI |
|--------|---------------|----------------|
| **Initial Scan** | 30s Lighthouse run | 30s + task creation (<5s) |
| **Query Issues** | Re-run Lighthouse (30s) | Query beads (<5s) |
| **Cross-Session** | No memory, must re-scan | Persistent state |
| **Progress Tracking** | Manual notes | Structured task status |
| **Dependencies** | Not tracked | First-class support |
| **Multi-Agent** | Coordination issues | Shared task database |
| **Merge Conflicts** | Common (manual notes) | Rare (hash IDs + Dolt) |
| **Historical Data** | Lost or in prose | Queryable audit trail |

---

### Implementation: Web Quality Prompts

**New Prompts**:

1. **`web-quality-scan.prompt.md`**
   - Stage 1 progressive scan + create beads tasks
   - Output: Summary table with task IDs

2. **`web-quality-query.prompt.md`**
   - Query beads (no re-scan)
   - Generate Stage 2 output from tasks
   - Filter by category/priority

3. **`web-quality-fix.prompt.md`**
   - Show Stage 3 fix code
   - Update beads task status
   - Provide close commands

4. **`web-quality-validate.prompt.md`**
   - Re-run Lighthouse for validation
   - Compare with beads tasks
   - Close verified fixes

**Modified Prompts**:
- Update existing `lighthouse-audit.prompt.md` to integrate beads
- Update `accessibility-check.prompt.md` to query beads first

---

## Memory System with Beads CLI

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

### Solution: Beads CLI for Memory Management

Replace markdown files with **beads CLI tasks** + **progressive disclosure prompts**:

#### Architecture: Memory in Beads

```
.beads/
├── beads.db              # Dolt database (source of truth, gitignored)
├── issues.jsonl          # Git-tracked export (automatic via hooks)
└── .beads-hooks/         # Git hooks for auto-sync

memory/ (optional, complementary)
├── index.json            # Lightweight index (generated from beads)
└── scratch/
    └── working-notes.md  # Ephemeral notes (still gitignored)
```

**Key Insight**: Sessions and patterns become **beads tasks**, not markdown files.

#### Beads Task Types for Memory

```bash
# Sessions as tasks
bd create "Session: Fresh Start - Prompt Reset" \
  -t epic --label session --label 2026-02-16 \
  --description "Created 5 minimal starter prompts, archived 22 old prompts" \
  --acceptance "5 prompt files created, documentation updated" \
  --json

# Patterns as tasks  
bd create "Pattern: Simple Conversational Prompt Format" \
  -t task --label pattern --label prompt-design \
  --description "Use simple, conversational instructions. No nested headers." \
  --design "Solves: UI navigation issues, hard to maintain complex prompts" \
  --notes "Examples: lighthouse-audit.prompt.md, accessibility-check.prompt.md" \
  --json

# Sub-tasks for session work
bd create "Archive 22 previous prompts" \
  -t task --label session --label 2026-02-16 \
  --json
```

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

#### Stage 1: Memory Overview (Query Beads)

**Prompt**: `#memory-scan` or "what's in the memory system?"

**What Happens**:
```bash
# Query beads for sessions
bd list --label session --json

# Query beads for patterns by category
bd list --label pattern --label accessibility --json
bd list --label pattern --label react --json
```

**Output**:
```markdown
# Memory System Overview 📚

**Source**: Beads task tracker
**Last Updated**: 2026-02-17
**Total Sessions**: 12 tasks
**Total Patterns**: 47 tasks

## Recent Sessions (Last 5)

| Task ID | Date | Topic | Status | Key Achievement |
|---------|------|-------|--------|----------------|
| bd-s012 | 2026-02-16 | Fresh Start: Prompt Reset | closed | 5 minimal prompts created |
| bd-s011 | 2026-02-11 | Testing Session | closed | Demo app infrastructure |
| bd-s010 | 2026-02-11 | Phase 1 & 2 Complete | closed | MCP integration |
| bd-s009 | 2026-02-10 | Agent Integration | closed | MCP tools added |
| bd-s008 | 2026-02-09 | MCP Servers | closed | 2 servers created |

## Pattern Categories

| Category | Tasks | Last Updated | Sample Patterns |
|----------|-------|--------------|----------------|
| accessibility | 8 | 2026-02-11 | WCAG compliance, semantic HTML |
| react | 12 | 2026-02-16 | Component review, hooks |
| performance | 9 | 2026-02-11 | Core Web Vitals |
| prompt-design | 6 | 2026-02-16 | Simple format |

**Total**: 47 pattern tasks

---

## Next Steps

- `show session bd-s012` - Full details on Fresh Start
- `show patterns accessibility` - All 8 accessibility patterns
- `bd show bd-s012 --json` - Raw task data
```

**Implementation**: Query beads, format output as table (<5 seconds).

---

#### Stage 2: Session/Pattern Details (Query Specific Task)

**Prompt**: `show session bd-s012` or "show accessibility patterns"

**What Happens**:
```bash
# Get specific session
bd show bd-s012 --json

# Get patterns by label
bd list --label pattern --label accessibility --json
```

**Output for Session**:
```markdown
## Session: Fresh Start - Prompt Reset (bd-s012)

**Date**: 2026-02-16  
**Status**: Closed  
**Duration**: 4 hours

### What Was Accomplished
- Archived 22 previous prompts
- Created 5 minimal, essential starter prompts  
- Simplified format from 60-80 lines to 10-15 lines
- Fixed formatting errors

### Key Decisions
- Quality over quantity: 5 great prompts > 22 problematic
- Simple conversational format adopted as standard
- No nested headings in prompts

### Related Patterns
- bd-p047: Simple Conversational Prompt Format
- bd-p046: Agent Assignment Pattern

**Commands**:
- `show pattern bd-p047` - Simple format details
- `bd show bd-s012 --json` - Full task JSON
```

**Output for Pattern Category**:
```markdown
# Accessibility Patterns (8 tasks)

**Source**: Beads tracker  
**Label**: `pattern`, `accessibility`

| Task ID | Pattern Name | Status | Related Sessions |
|---------|--------------|--------|------------------|
| bd-p001 | WCAG Level AA Compliance | active | bd-s010, bd-s011 |
| bd-p002 | Semantic HTML First | active | bd-s011 |
| bd-p003 | ARIA When Needed | active | bd-s010 |
| bd-p004 | Color Contrast | active | bd-s011 |
| bd-p005 | Focus Management | active | bd-s010 |
| bd-p006 | Alt Text Generation | active | bd-s011 |
| bd-p007 | Keyboard Navigation | active | bd-s010 |
| bd-p008 | Screen Reader Testing | active | bd-s011 |

**Commands**:
- `show pattern bd-p001` - Full WCAG pattern details
- `bd show bd-p006 --json` - Alt text pattern JSON
```

---

#### Stage 3: Detailed Pattern (Full Task)

**Prompt**: `show pattern bd-p047` or "show simple conversational format pattern"

**What Happens**:
```bash
bd show bd-p047 --json
```

**Output**: Display full task with description, design notes, examples, related files.

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

### Benefits: Memory with Beads CLI

| Aspect | Current (Markdown) | With Beads CLI |
|--------|-------------------|----------------|
| **Storage** | 2,109 + 874 lines (2 files) | Structured SQL database |
| **Query Speed** | 30-60s (load full files) | <5s (SQL query) |
| **Discoverability** | Manual grep/search | `bd list --label <category>` |
| **Context Efficiency** | All-or-nothing | Query specific tasks |
| **Timeout Risk** | High (large files) | None (fast queries) |
| **Merge Conflicts** | Common (large file edits) | Rare (hash IDs + Dolt) |
| **Multi-Agent** | Coordination issues | Shared database |
| **Versioning** | Git (file-level) | Dolt (cell-level) + Git |
| **Dependencies** | Not tracked | `bd dep add` support |
| **Status Tracking** | Manual prose | Task status fields |

---

## Implementation Phases

### Phase 0: Setup Beads CLI (Week 1, Days 1-2)

**Goal**: Install beads v0.49.6 and initialize in project

**Tasks**:
- [x] Research blocking issues in v0.52.0
  - Identified CGO dependency preventing Dolt init
  - Found `--no-db` flag not implemented despite docs
  - Discovered v0.49.6 workaround from issue #1833
  **Result**: Decision to use v0.49.6 (stable, SQLite backend)

- [ ] Downgrade to beads v0.49.6
  ```bash
  # Remove current version
  rm ~/.local/bin/bd ~/.local/bin/beads
  
  # Install v0.49.6 (last stable SQLite version)
  curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/v0.49.6/scripts/install.sh | bash
  
  # Verify version
  bd version  # Should show v0.49.6
  ```
  **Why v0.49.6**: SQLite backend (no CGO), `no-db: true` works, community-proven

- [ ] Initialize beads in project
  ```bash
  cd /path/to/bootcamp-capstone-demo
  bd init
  
  # Optional: Configure JSONL-only mode (no database)
  echo "no-db: true" >> .beads/config.yaml
  
  # Install git hooks for auto-sync
  bd hooks install
  ```
  **Note**: Can use SQLite or JSONL-only mode (both work in v0.49.6)

- [ ] Configure `.gitignore`
  ```gitignore
  # Add to .gitignore
  .beads/beads.db          # SQLite database (if not using no-db mode)
  .beads/*.log             # Log files
  
  # Keep these tracked:
  # .beads/issues.jsonl    # Core data (always tracked)
  # .beads/config.yaml     # Configuration
  # .beads-hooks/          # Git hooks
  ```

- [ ] Test basic workflow
  ```bash
  # Create test task
  bd create "Test task" -p 1 --json
  
  # List tasks
  bd list --json
  
  # Sync with git
  bd sync
  
  # Verify git tracking
  git status  # Should show .beads/issues.jsonl
  
  # Close test task
  bd close <task-id> --reason "Testing complete"
  ```

**Success Criteria**:
- ✅ `bd version` shows v0.49.6
- ✅ `.beads/` directory created
- ✅ Git hooks installed and working
- ✅ Test task created, listed, and closed successfully
- ✅ JSONL file tracked in git
- ✅ JSON API working (`--json` flag on all commands)

---

### Phase 1: Web Quality Integration (Week 1, Days 3-5)

**Goal**: Integrate beads with web quality prompts

**Tasks**:
- [ ] Create `web-quality-scan.prompt.md`
  - Stage 1 progressive scan
  - Create beads task per finding
  - Add dependency relationships
  - Output: Summary table with task IDs
  
- [ ] Create `web-quality-query.prompt.md`
  - Query beads (no re-scan)
  - Generate Stage 2 from tasks
  - Filter by category/priority
  
- [ ] Create `web-quality-fix.prompt.md`
  - Show Stage 3 fix code
  - Update task status
  - Provide close commands
  
- [ ] Create `web-quality-validate.prompt.md`
  - Re-run Lighthouse
  - Compare with beads
  - Close verified fixes
  
- [ ] Update existing prompts
  - Modify `lighthouse-audit.prompt.md`
  - Modify `accessibility-check.prompt.md`
  
- [ ] Test on demo-app
  - Run initial scan
  - Verify tasks created
  - Query and fix workflow
  - Validate persistence

**Success Criteria**:
- ✅ Initial scan creates beads tasks
- ✅ Query shows tasks (no re-scan)
- ✅ Fix workflow updates task status
- ✅ Tasks persist across sessions
- ✅ Dependencies tracked correctly

---

### Phase 2: Memory System Migration ✅ **COMPLETE** (2026-02-17)

**Goal**: Migrate memory from markdown to beads

**Tasks**:
- [x] ~~Create migration script~~ **Manual migration chosen for quality**
  - Curated selection (10 high-value sessions)
  - Clean formatting
  - Appropriate labels applied
  - **Decision**: Manual > automated for initial migration
  
- [x] Run migration
  ```bash
  # 10 sessions migrated manually:
  bd list --label session --status closed --json | jq 'length'  # Returns: 10
  bd list --label pattern --json | jq 'length'                  # Returns: 2
  ```
  **Result**: 10 sessions + 2 patterns migrated successfully
  
- [x] Create memory prompts
  - ✅ `memory-scan.prompt.md` - Overview (session count + pattern list)
  - ✅ `memory-session.prompt.md` - Session details with filters
  - ✅ `memory-pattern.prompt.md` - Pattern search and application
  - ⏸️ `memory-new-session.prompt.md` - **Deferred** (manual workflow sufficient)
  - ⏸️ `memory-new-pattern.prompt.md` - **Deferred** (manual workflow sufficient)
  
- [x] ~~Archive old markdown files~~ **Keeping for reference**
  - **Decision**: Keep `.github/memory/*.md` as comprehensive documentation
  - Beads provides queryable interface, markdown provides detailed context
  - Best of both worlds approach
  
- [x] Update documentation
  - ✅ Created `docs/phase-2-memory-schema.md` (comprehensive schema)
  - ✅ Created `docs/phase-2-summary.md` (session documentation)
  - ✅ Updated `.github/memory/README.md` with beads integration

**Completed Migration**:
- **Sessions**: 10 (2026-02-08 through 2026-02-16)
  - Accessibility: 1 session
  - MCP Infrastructure: 1 session
  - Agents: 2 sessions
  - Prompts: 4 sessions
  - Architecture: 1 session
  - Documentation: 1 session
- **Patterns**: 2 (Simple Conversational Prompt Format, Plug-In Architecture)
- **Prompts**: 3 functional memory query prompts

**Success Criteria**:
- ✅ 10 sessions migrated to beads (100% of initial target)
- ✅ 2 patterns migrated to beads
- ✅ Memory prompts functional (#memory-scan, #memory-session, #memory-pattern)
- ✅ Query performance <1s (validated)
- ✅ Documentation comprehensive (schema + summary)

---

### Phase 3: Validation & Documentation (Week 2, Days 4-5)

**Goal**: Test integrated workflow and document

**Tasks**:
- [ ] End-to-end web quality test
  - Initial scan → tasks created
  - Query → fast, no re-scan
  - Fix → task updated
  - Validate → task closed
  - Cross-session → state persists
  
- [ ] End-to-end memory test
  - Create new session task
  - Query sessions/patterns
  - Progressive disclosure works
  - Fast query (<5s)
  
- [ ] Multi-agent test (if applicable)
  - Simulate concurrent work
  - Verify no conflicts
  - Test `bd sync` workflow
  
- [ ] Update documentation
  - `.github/copilot-instructions.md` - Add beads workflow
  - `docs/using-beads.md` - Complete guide
  - `README.md` - Quick start section
  - `CONTRIBUTING.md` - Beads conventions
  
- [ ] Create video demo (optional)
  - Show full workflow
  - Highlight benefits

**Success Criteria**:
- ✅ Web quality workflow validated
- ✅ Memory workflow validated
- ✅ No merge conflicts in testing
- ✅ Documentation complete
- ✅ All prompts functional

---

### Phase 4: Adoption & Iteration (Week 3+)

**Goal**: Use beads in daily workflow, iterate based on learnings

**Tasks**:
- [ ] Use beads for all new work
  - Create tasks for features/bugs
  - Track dependencies
  - Close completed work
  - Sync regularly
  
- [ ] Monitor effectiveness
  - Track query times (should be <5s)
  - Count avoided re-scans
  - Observe merge conflicts (should be rare)
  - Gather user feedback
  
- [ ] Iterate on prompts
  - Refine based on usage
  - Add new prompts as needed
  - Optimize query patterns
  
- [ ] Expand use cases
  - React analysis + beads
  - Bundle analysis + beads
  - Testing results + beads
  
- [ ] Community contribution prep
  - Polish documentation
  - Create examples
  - Prepare for sharing

**Success Criteria**:
- ✅ Beads used daily
- ✅ Measurable time savings
- ✅ Team adoption (if applicable)
- ✅ Workflow improvements identified
- ✅ Ready to share externally

---
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

## Timeline & Milestones

### Week 1: Foundation & Web Quality

**Days 1-2: Beads Setup (Phase 0)**
- ✅ Install beads CLI
- ✅ Initialize in project
- ✅ Test basic workflow
- ✅ Git hooks configured

**Days 3-5: Web Quality Integration (Phase 1)**
- ✅ Create 4 new web-quality prompts
- ✅ Modify 2 existing prompts
- ✅ Test on demo-app
- ✅ Validate persistence across sessions

**Success Metrics**:
- ✅ Beads installed and operational
- ✅ Web quality scan creates beads tasks
- ✅ Query works without re-scan
- ✅ Tasks persist across sessions

---

### Week 2: Memory Migration & Validation

**Days 1-3: Memory System (Phase 2)**
- ✅ Create migration script
- ✅ Migrate sessions (12 tasks)
- ✅ Migrate patterns (47 tasks)
- ✅ Create 5 memory prompts
- ✅ Archive old markdown

**Days 4-5: Validation (Phase 3)**
- ✅ End-to-end web quality test
- ✅ End-to-end memory test
- ✅ Multi-agent test (if applicable)
- ✅ Documentation complete
- ✅ All prompts functional

**Success Metrics**:
- ✅ All memory migrated to beads
- ✅ Query times < 5 seconds
- ✅ No merge conflicts observed
- ✅ Documentation complete

---

### Week 3+: Adoption & Iteration

**Phase 4: Daily Usage**
- Use beads for all development work
- Monitor effectiveness
- Iterate on prompts
- Expand use cases

**Ongoing Metrics to Track**:
- Query response times (target: <5s)
- Number of avoided re-scans per week
- Merge conflicts (target: near zero)
- User satisfaction / adoption rate
- Cross-session context retention

---

### Key Milestones

| Milestone | Target Date | Status | Deliverables |
|-----------|-------------|--------|--------------|
| **M1: Beads Operational** | Week 1, Day 2 | 🟡 Pending | Beads installed, initialized, tested |
| **M2: Web Quality Live** | Week 1, Day 5 | 🟡 Pending | 6 prompts working with beads |
| **M3: Memory Migrated** | Week 2, Day 3 | 🟡 Pending | 59 tasks in beads, old files archived |
| **M4: Fully Validated** | Week 2, Day 5 | 🟡 Pending | All tests passing, docs complete |
| **M5: Production Ready** | Week 3, Day 1 | 🟡 Pending | Daily workflow adopted |

---

### Risk Mitigation

**Risk 1: Beads installation issues**
- **Mitigation**: Support for curl, npm, Homebrew (3 install methods)
- **Fallback**: Manual binary download if all fail

**Risk 2: Migration script errors**
- **Mitigation**: Dry-run mode in script, manual verification
- **Fallback**: Keep old markdown files until validation complete

**Risk 3: Adoption resistance**
- **Mitigation**: Clear documentation, video demos, compelling benefits
- **Fallback**: Beads optional initially, markdown still functional

**Risk 4: Performance issues (queries slow)**
- **Mitigation**: SQL database is fast, Dolt optimized
- **Fallback**: Add indexes if needed, optimize queries

**Risk 5: Merge conflicts despite Dolt**
- **Mitigation**: Hash IDs prevent most conflicts, cell-level merge
- **Fallback**: `bd sync` resolves via JSONL import/export

---

### Decision Points

**Decision Point 1: Memory Architecture (End of Week 1)**
- **Question**: Keep markdown files as backup, or full migration?
- **Criteria**: Query speed, user preference, risk tolerance
- **Expected**: Full migration if queries < 5s consistently

**Decision Point 2: Web Quality Re-Scan Frequency (Week 2)**
- **Question**: How often to re-validate with Lighthouse?
- **Criteria**: Code change frequency, CI/CD integration
- **Expected**: Weekly manual, or on-demand after major changes

**Decision Point 3: Multi-Agent Adoption (Week 3)**
- **Question**: Expand to multiple agents/contributors?
- **Criteria**: Zero conflicts observed, clear benefits
- **Expected**: Yes if single-agent workflow stable

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

Generated: 2026-02-17 (Updated with Beads CLI integration)  
Original: 2026-02-16  
Authors: AI Assistant + User Feedback  
Version: 2.0  
Status: Ready for Implementation ✅

**Major Update**: Integrated [beads CLI](https://github.com/steveyegge/beads) for:
- Web quality task persistence (no more re-scanning)
- Memory system management (replacing markdown files)
- Dependency tracking for optimization workflows
- Cross-session context retention

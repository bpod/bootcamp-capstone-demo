# Phase 2: Memory System → Beads Schema Design

**Goal**: Migrate memory system from markdown files to beads tasks for persistent, queryable knowledge base.

---

## Current State Analysis

### File 1: `session-notes.md` (2109 lines)
**Structure**: Date-based session entries
```markdown
## [Session Name] - [YYYY-MM-DD]

### What Was Accomplished
- Completed work items

### Key Findings and Decisions
- Important discoveries
- Architecture decisions

### Outcomes
- Metrics and validation
```

**Characteristics**:
- Historical record (all past sessions)
- Many entries (20+ sessions documented)
- Rich context per session
- Already "closed" work (completed sessions)

### File 2: `patterns-discovered.md` (874 lines)
**Structure**: Pattern entries with examples
```markdown
## Pattern: [Pattern Name]

**Context**: When pattern applies
**Problem**: What it solves
**Solution**: How to implement
**Example**: Code snippets
**Related Files**: Links to examples
```

**Characteristics**:
- Evergreen patterns (remain relevant)
- Code-focused
- Reusable across projects
- Active reference material

---

## Beads Schema Mapping

### Design Principle: **Semantic Task Categories**

Use beads' native features:
- **Labels**: Category, type, lifecycle
- **Status**: open/closed (for active vs historical)
- **Priority**: Importance/criticality
- **Description**: Full content (markdown supported)
- **Title**: Searchable summary

### Session Notes → Beads Tasks

**Task Type**: `session`  
**Labels**: `memory`, `session`, `[date]`, `[topic]`  
**Status**: `closed` (historical sessions)  
**Priority**: 3 (informational)

**Title Format**: `Session: [Name] - [Date]`

**Description Format**:
```markdown
## What Was Accomplished
- Item 1
- Item 2

## Key Findings
- Discovery 1
- Discovery 2

## Outcomes
- Result 1

## Original Entry
From session-notes.md line [X]
```

**Example**:
```bash
bd create "Session: Fresh Start Prompt Reset - 2026-02-16" \
  -t session --label memory --label session --label 2026-02-16 --label prompts \
  --description "## Accomplished
- Archived 22 prompts, created 5 minimal ones
- Simplified format from 60-80 lines to 10-15

## Key Findings
- Simple conversational > documentation style
- Agent assignment critical

## Outcomes
- Zero errors, clean foundation" \
  --status closed \
  -p 3
```

### Pattern Notes → Beads Tasks

**Task Type**: `pattern`  
**Labels**: `memory`, `pattern`, `[domain]`, `[language]`  
**Status**: `open` (patterns are actively referenced)  
**Priority**: 2 (reference material)

**Title Format**: `Pattern: [Pattern Name]`

**Description Format**:
```markdown
## Context
When this pattern applies

## Problem
What it solves

## Solution
How to implement

## Example
```code
// snippet
```

## Anti-Pattern
```code
// what NOT to do
```

## Related Files
- [file](path#L10)

## Original Entry
From patterns-discovered.md line [X]
```

**Example**:
```bash
bd create "Pattern: Simple Conversational Prompt Format" \
  -t pattern --label memory --label pattern --label prompts --label markdown \
  --description "## Context
When creating .prompt.md files

## Problem
Complex nested headers cause UI issues

## Solution
Use simple, conversational instructions

## Example
\`\`\`markdown
---
description: 'Brief'
agent: name
---

Direct instruction about what to analyze.
\`\`\`" \
  -p 2
```

---

## Label Strategy

### Primary Labels (Required)

| Label | Purpose | Applied To |
|-------|---------|------------|
| `memory` | All memory system items | Sessions, Patterns |
| `session` | Historical session summaries | Sessions only |
| `pattern` | Code patterns and conventions | Patterns only |

### Domain Labels (Contextual)

| Label | Applied When | Examples |
|-------|--------------|----------|
| `prompts` | Related to prompt engineering | Prompt patterns, prompt sessions |
| `accessibility` | Related to a11y | WCAG patterns, a11y sessions |
| `performance` | Related to performance | Optimization patterns, perf sessions |
| `testing` | Related to testing | Test patterns, testing sessions |
| `react` | React-specific | Component patterns, React sessions |

### Temporal Labels (For Sessions)

| Label | Format | Purpose |
|-------|--------|---------|
| `2026-02-16` | YYYY-MM-DD | Date-based filtering |
| `2026-02` | YYYY-MM | Month-based aggregation |
| `2026` | YYYY | Year-based trends |

---

## Query Patterns

### Common Queries

**All memory items**:
```bash
bd ready --label memory --json
```

**All sessions**:
```bash
bd list --label session --status closed --json
```

**All patterns** (active reference):
```bash
bd ready --label pattern --json
```

**Sessions from specific date**:
```bash
bd ready --label session --label 2026-02-16 --json
```

**Patterns by domain**:
```bash
bd ready --label pattern --label prompts --json
bd ready --label pattern --label accessibility --json
```

**Recent sessions** (last 30 days):
```bash
bd list --label session --since 30d --json
```

---

## Migration Strategy

### Option A: Automated Script (Original Plan)
**Pros**: Fast, consistent
**Cons**: Risk of data loss, hard to validate quality

### Option B: Manual + Prompt-Assisted (Recommended ✅)
**Pros**: High quality, selective, validate as we go
**Cons**: Slower (but only ~30 items)

**Recommendation**: **Option B**

**Why**:
1. **Quality over speed**: Only ~30 sessions + ~10 patterns
2. **Selective migration**: Pick most valuable items
3. **Validation**: Verify each entry is useful
4. **Learning**: Understand what makes good memory items

### Migration Process (Manual)

**Step 1: Migrate Top 5 Sessions**
- Pick most recent or most impactful
- Test beads workflow
- Refine schema if needed

**Step 2: Migrate Top 5 Patterns**
- Pick most commonly referenced
- Test pattern queries
- Validate usefulness

**Step 3: Create Memory Prompts**
- `#memory-scan` - Overview of all memory
- `#memory-session` - Query sessions
- `#memory-pattern` - Query patterns

**Step 4: Test Workflow**
- Query memory via prompts
- Verify cross-session persistence
- Validate usefulness

**Step 5: Migrate Remaining Items** (Optional)
- Only if Step 4 proves valuable
- Otherwise keep markdown as archive

---

## Prompt Design

### #memory-scan (Overview)

**Purpose**: Fast overview of all memory (sessions + patterns)

**Workflow**:
```bash
# Get all memory items
bd ready --label memory --json

# Summarize:
- Total sessions (closed)
- Total patterns (open)
- Top 5 recent sessions
- Top 5 referenced patterns
```

**Output**: Table with counts and highlights

### #memory-session (Query Sessions)

**Purpose**: Search and display session summaries

**Workflow**:
```bash
# Query sessions
bd list --label session --status closed --json

# Filter by:
- Date range (--since, --until)
- Topic (--label prompts)
- Keyword (bd search "keyword" --label session)

# Display:
- Session title
- Key findings
- Outcomes
```

**Output**: Filtered list with summaries

### #memory-pattern (Query Patterns)

**Purpose**: Find applicable patterns for current work

**Workflow**:
```bash
# Query patterns
bd ready --label pattern --json

# Filter by:
- Domain (--label react, --label prompts)
- Keyword (bd search "async" --label pattern)

# Display:
- Pattern name
- Context + Problem + Solution
- Code examples
- Related files
```

**Output**: Relevant patterns with code examples

---

## Success Metrics

### Quantitative

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Query speed | <1s | Time `bd ready --label memory` |
| Sessions migrated | 5-10 | Count with `bd list --label session` |
| Patterns migrated | 5-10 | Count with `bd ready --label pattern` |
| Memory prompts | 3 | Count `.prompt.md` files |

### Qualitative

| Metric | Target | How to Validate |
|--------|--------|-----------------|
| Usefulness | High | Can answer "what did we learn about X?" |
| Discoverability | Easy | Find relevant patterns in <30s |
| Persistence | Reliable | Memory survives across days |
| Cross-session | Working | Reference past sessions easily |

---

## Comparison: Markdown vs Beads

| Aspect | Markdown Files | Beads Tasks |
|--------|----------------|-------------|
| **Search** | grep/VSCode search | `bd search`, label filtering |
| **Structure** | Manual headings | Native task schema |
| **Query** | Parse markdown | JSON API |
| **Filter** | Manual | Labels, status, priority |
| **Persistence** | File-based | Database + JSONL |
| **Cross-session** | Manual file reading | Native task queries |
| **Integration** | Requires parsing | Native beads commands |
| **Version control** | Git diffs | Git JSONL + database |

**Winner**: Beads for queryability, Markdown for readability

**Hybrid Approach**: Use both!
- Beads: Primary system (queries, persistence)
- Markdown: Archive (backup, human-readable)

---

## Implementation Plan

### Todo List (Phase 2)

1. ✅ Design schema (this document)
2. ⏳ Migrate 5 sample sessions manually
3. ⏳ Migrate 5 sample patterns manually
4. ⏳ Create `#memory-scan` prompt
5. ⏳ Create `#memory-session` prompt
6. ⏳ Create `#memory-pattern` prompt
7. ⏳ Test memory workflow
8. ⏳ Validate usefulness
9. ⏳ Document findings

### Estimated Time
- Design: 30 min ✅ Done
- Sample migration: 45 min
- Prompt creation: 60 min
- Testing: 30 min
- Documentation: 15 min

**Total**: ~3 hours

---

## Next Step

**Start with**: Migrate 5 sample sessions to validate schema and workflow.

**Command template ready**:
```bash
bd create "Session: [Name] - [Date]" \
  -t session --label memory --label session --label [date] --label [topic] \
  --description "[content]" \
  --status closed \
  -p 3 \
  --json
```

Ready to begin migration?

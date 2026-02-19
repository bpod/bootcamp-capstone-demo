# Pattern: Terminal Hygiene Best Practices

**Pattern ID**: `terminal-hygiene`  
**Category**: Agent Workflows, Debugging, Development Hygiene  
**Status**: Active  
**Discovered**: 2026-02-19

## Overview

Strategic management of terminal output during long command sequences to prevent scrollback pollution, confusion about execution state, and tooling file warnings caused by massive accumulated output.

## Problem Statement

### Symptoms

When running multiple commands in a terminal session (especially with AI agents):

1. **Output Accumulation**: Terminal scrollback buffer fills with historical output from previous commands
2. **Verification Confusion**: Difficulty determining if new commands executed vs showing stale scrollback
3. **Large File Warnings**: Tooling reports 11KB+ output from simple commands due to scrollback pollution
4. **Context Overflow**: Historical output mixed with current results makes debugging harder
5. **False Positives**: Seeing old error messages and mistaking them for current issues

### Example Bad Pattern

```bash
# Terminal session after 20+ commands without clearing
# User runs: echo "Current status"
# Output shows:
# - Last 15 commands of scrollback
# - Old git commit messages
# - Previous beads queries
# - Finally, "Current status" somewhere in the noise
# Result: 11KB file, can't tell if command ran
```

### Real-World Impact

- Agent workflows repeatedly checking "did that command work?" 
- Difficult to debug multi-step processes (git + beads + tests)
- Tooling slow-downs from processing large output files
- Wasted time scrolling to find actual results
- False bug reports from seeing old output

## Solution

### Core Principle

**Clear terminal strategically to separate concerns and verify execution.**

Key tactics:
1. **Clear before critical operations** - Start fresh for important workflows
2. **Use execution markers** - Timestamp/label output to prove execution
3. **Separate concerns** - Clear between beads/git/testing operations
4. **Clear periodically** - After every 5-10 commands in long sessions

### Good Pattern Examples

#### 1. Clear Before Beads Operations

```bash
# ✅ GOOD: Clean slate for task query
clear && bd ready -q --json | jq -r '.[] | .title'

# ✅ GOOD: Clear before multi-task workflow
clear && echo "=== Task Review ===" && bd list -q --label enhancement
```

#### 2. Clear Before Git Multi-Step Workflows

```bash
# ✅ GOOD: Separate git workflow from previous output
clear && git status && git add . && git commit -m "message"

# ✅ GOOD: Clear before landing workflow
clear && git add -A && git commit -m "feat: ..." && bd sync -q && git push
```

#### 3. Execution Markers (Timestamps)

```bash
# ✅ GOOD: Marker proves command ran fresh
echo "=== Beads Query $(date +%H:%M:%S) ===" && bd ready -q --json | jq

# ✅ GOOD: Named operation with verification
echo "=== Testing Enhancement Workflow $(date +%H:%M:%S) ===" && npm test

# ✅ GOOD: Completion confirmation
bd sync -q && echo "✓ Beads synced $(date +%H:%M:%S)"
```

**Why timestamps matter**: After clearing terminal, output shows ONLY current execution. Timestamp proves "this just ran" vs "stale scrollback."

#### 4. Command Separation

```bash
# ✅ GOOD: Group related operations, clear between concerns
clear && bd ready -q --json | jq '.[] | .title'
# ... work on tasks ...

clear && git add . && git commit -m "message" && git status
# ... verify commit ...

clear && bd list -q --status closed | tail -5
# ... review completed work ...
```

#### 5. Long Debugging Sessions

```bash
# ✅ GOOD: Clear after every 5-10 commands
# Command 1-5: investigate issue...
# Command 6-10: try fixes...
clear && echo "=== Verification Round 2 ===" && npm test
# Command 11-15: more debugging...
clear && echo "=== Final Validation ===" && git diff
```

### Bad Pattern Examples

#### ❌ Never Clearing Terminal

```bash
# ❌ BAD: 50 commands without clearing
git status
bd ready -q
git log --oneline
bd show task-id -q
npm test
git diff
# ... 44 more commands ...
# Output now 20KB+, completely unreadable
```

#### ❌ No Execution Markers

```bash
# ❌ BAD: No way to verify fresh execution
bd ready -q --json | jq '.[] | .title'
# Output shows tasks... but are these from NOW or from scrollback 5 minutes ago?
```

#### ❌ Mixed Concerns Without Separation

```bash
# ❌ BAD: Git + beads + tests all mixed together
git status && bd ready -q && npm test && git log && bd sync -q
# Which output belongs to what operation?
```

## Implementation Guidelines

### When to Clear Terminal

| Scenario | Clear? | Rationale |
|----------|--------|-----------|
| Before beads query | ✅ Yes | Ensures results are fresh, not scrollback |
| Before git multi-step workflow | ✅ Yes | Separates git operations from previous context |
| Before running tests | ✅ Yes | Test output should be isolated |
| After every 5-10 commands | ✅ Yes | Prevents scrollback accumulation |
| Single quick command | ❌ No | Unnecessary for `ls`, `pwd`, etc. |
| Within a pipeline | ❌ No | Don't clear mid-pipeline |

### When to Use Markers

| Scenario | Marker? | Example |
|----------|---------|---------|
| After clearing terminal | ✅ Yes | Proves execution happened |
| Long-running operation | ✅ Yes | Shows progress checkpoints |
| Critical validation step | ✅ Yes | Confirms completion |
| Simple command | ❌ No | Overhead not worth it |

### Command Structure Pattern

```bash
clear && echo "=== [Operation Name] $(date +%H:%M:%S) ===" && [command]
```

**Breakdown**:
- `clear` - Wipes terminal slate
- `echo "=== ..."` - Visual separator and execution proof
- `$(date +%H:%M:%S)` - Timestamp proves fresh execution
- `[command]` - Actual operation

**Benefits**:
1. No scrollback pollution
2. Clear visual separation
3. Timestamp verification
4. Easy to scan output

## When to Use

✅ **Use this pattern when**:

- Running multiple beads commands in sequence
- Executing multi-step git workflows (add, commit, push)
- Long debugging sessions (10+ commands)
- Validating completions ("Landing the Plane")
- Working with AI agents that parse terminal output
- Need to verify command execution vs scrollback

❌ **Don't use when**:

- Single, simple commands (`ls`, `pwd`, `which`)
- Commands already piped through filters
- Interactive prompts that need scrollback context
- Reviewing git history (intentionally want scrollback)

## Related Patterns

- **Beads `--quiet` Flag**: Reduces beads output from 16KB to minimal (pair with terminal clearing)
- **Single-Line Command Strings**: Prevents terminal quote mode (different issue)
- **Landing the Plane Workflow**: Uses terminal clearing in final status checks

## Detection and Remediation

### Detecting the Problem

Signs you need better terminal hygiene:

1. Tooling reports "Large file warning (11KB+)" on simple commands
2. Scrolling to find actual command output
3. Uncertainty whether command executed or showing scrollback
4. Debugging takes longer due to output noise
5. Old error messages causing confusion

### Remediation Steps

If you notice these symptoms:

1. **Immediate**: Run `clear` to reset terminal
2. **Next command**: Add `clear &&` prefix
3. **Add marker**: `echo "=== [Operation] $(date +%H:%M:%S) ==="`
4. **Review workflow**: Plan clearing strategy for current task
5. **Document**: Note pattern for future similar workflows

## Benefits

✅ **Clean mental model**: Each operation has clear, isolated output  
✅ **Faster debugging**: No scrollback noise to filter  
✅ **Verification confidence**: Timestamps prove execution  
✅ **Better AI context**: Agents see only relevant output  
✅ **Reduced file warnings**: Output stays small and focused  
✅ **Improved communication**: Clear visual separation of concerns

## Real-World Examples

### Example 1: Git Commit Quote Mode Incident (2026-02-19)

**What Happened**: While documenting terminal hygiene patterns, attempted to commit with multi-line `git commit -m` message. This triggered terminal quote mode ("dquote>") - ironically demonstrating the exact problem being documented.

**The Mistake**:
```bash
# ❌ BAD: Multi-line -m message
git commit -m "docs: Add terminal hygiene best practices

Problem Addressed:
- Terminal output accumulates
- Scrollback pollution
...
"
# Result: Terminal enters quote mode, command hangs
```

**Why It Happened**: 
- Multi-line text in `-m` argument causes shell quote mode
- **Same principle as beads commands** - applies to ALL CLI tools
- Agent violated the rule it just documented 😅

**The Fix**:
```bash
# ✅ GOOD: Single-line commit message
git commit -m "docs: Add terminal hygiene best practices to prevent scrollback pollution and verify execution"

# ✅ ALTERNATIVE: Use git commit (no -m) for detailed messages
git commit  # Opens editor, supports multi-paragraph messages
```

**Lesson Learned**: 
- The "avoid multi-line in command arguments" rule is **universal**, not tool-specific
- Applies equally to: beads, git, npm, docker, kubectl, any CLI tool
- When you need detail: use editor (`git commit`) or reference files
- Terminal recovery: Send closing quote `"` or kill terminal and restart

**Teachable Moment**: Perfect example of why we document patterns - even while documenting them, we can violate them!

### Example 2: Terminal Scrollback Pollution

### Before (Poor Hygiene)

```bash
# Terminal session excerpt
bd ready -q --json | jq '.[] | .title'
# Output: 15 previous commands showing, then task titles somewhere in the noise
git status
# Output: More scrollback pollution
bd show task-id -q
# Output: Can't tell if this executed or showing old output
# Result: 11KB file warning, confusion about state
```

### After (Good Hygiene)

```bash
clear && echo "=== Task Query 14:23:45 ===" && bd ready -q --json | jq '.[] | .title'
# Output: Only "=== Task Query 14:23:45 ===" + clean task list

clear && echo "=== Git Status 14:24:10 ===" && git status
# Output: Only "=== Git Status 14:24:10 ===" + current git state

clear && echo "=== Task Detail 14:24:30 ===" && bd show task-id -q
# Output: Only "=== Task Detail 14:24:30 ===" + task info

# Result: Each output ~500 bytes, no confusion, clear execution proof
```

## References

- **Source**: Discovered during Feb 19, 2026 session investigating "large file warnings"
- **Agent Instructions**: See [AGENTS.md](../AGENTS.md) "Terminal Hygiene Best Practices" section
- **Related Issues**: Scrollback buffer pollution in long agent sessions

## Revision History

- **2026-02-19**: Initial pattern documented (Pattern discovery session)

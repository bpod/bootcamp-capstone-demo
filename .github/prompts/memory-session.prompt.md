---
description: "Query and display session summaries with filtering"
tools: ["run_in_terminal"]
---

Query session memory from beads with optional filters.

Ask the user what they want to search for:

- All sessions: `bd list --label session --status closed --json`
- By date: `bd list --label session --status closed --json | jq '.[] | select(.labels[] | contains("2026-02-16"))'`
- By topic/domain: `bd list --label session --status closed --json | jq '.[] | select(.labels[] | contains("accessibility"))'`

Display format for each session:

```
[TITLE]
Date: [extract from labels: YYYY-MM-DD]
Labels: [domain labels, not memory/session]

Key Points:
[extract from description - show "What Was Accomplished" and "Key Findings" sections]

---
```

Limit to 5 sessions unless user asks for more.

If user asks about patterns, redirect to #memory-pattern instead.

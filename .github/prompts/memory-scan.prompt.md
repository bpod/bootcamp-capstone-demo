---
description: "Quick overview of all memory (sessions + patterns)"
tools: ["run_in_terminal"]
---

Provide a fast overview of all memory items stored in beads.

Query the beads database:

- Count sessions: `bd list --label session --status closed --json | jq 'length'`
- Count patterns: `bd ready --label pattern --json | jq 'length'`
- Recent sessions: `bd list --label session --status closed --json | jq -r '.[].labels' | grep -o '202[0-9]-[0-9][0-9]-[0-9][0-9]' | sort -r | head -5 | uniq`
- All patterns: `bd ready --label pattern --json | jq -r '.[] | "- \(.title)"'`

Output format:

```
Memory Overview
===============

Sessions (closed): [count] historical records
Patterns (open): [count] active references

Recent Sessions (last 5 dates):
- [YYYY-MM-DD]
- [YYYY-MM-DD]
...

Available Patterns:
- [Pattern title]
- [Pattern title]
...
```

Keep it brief - this is for quick scanning, not detailed retrieval.

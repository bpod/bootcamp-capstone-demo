---
description: "Find applicable patterns for current work"
tools: ["run_in_terminal"]
---

Find relevant patterns from memory based on the user's current work or question.

Ask what they're working on, then query:

- All patterns: `bd ready --label pattern --json`
- By domain: `bd ready --label pattern --json | jq '.[] | select(.labels[] | contains("prompts"))'`
- Multiple domains: `bd ready --label pattern --json | jq '.[] | select(.labels[] | (contains("accessibility") or contains("performance")))'`

Display format for each pattern:

```
[TITLE]
Labels: [domain labels]

[Full description from beads]

Related: [infer related files/areas from context]

---
```

Show full pattern details including examples and code snippets.

If user is asking about historical events or "what we did", redirect to #memory-session instead.

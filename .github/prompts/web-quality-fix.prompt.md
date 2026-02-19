---
description: "Stage 3: Show fix code for specific web quality issue"
agent: web-quality-fixer
tools: ["codebase", "search"]
---

# Web Quality Fix (Stage 3: Specific Fix Code)

**Goal**: Provide before/after code with explanation for a specific beads task

## Workflow

1. **Get Task Details**:

   ```bash
   bd show <task-id> --json
   ```

2. **Parse JSON** - Extract:
   - Title: Issue description
   - Description: File locations, specific occurrences
   - Labels: Category (accessibility, performance, etc.)
   - Priority: Severity level

3. **Read Relevant Files** - Load only files mentioned in task

4. **Generate Fix** - Provide before/after code with:
   - Current code (problematic)
   - Fixed code (compliant)
   - Explanation of what changed
   - Best practices guidance
   - Links to authoritative sources

5. **Update Task** (optional) - Mark as in-progress:
   ```bash
   bd update <task-id> --status in_progress --claim
   ```

## Output Format

````markdown
# Fix: [Issue Title from Beads]

**Task ID**: `<task-id>`  
**Category**: [accessibility/performance/best-practices]  
**Priority**: [Critical/High/Medium/Low]  
**Audit ID**: `[lighthouse-audit-id]` (if applicable)  
**WCAG**: [criterion] (if applicable)

---

## Current Code ([file:line])

\`\`\`html

<!-- ❌ Problematic code -->
<div class="hero">
  <img src="hero.jpg">
  <h1>Welcome</h1>
</div>
\`\`\`

**Issue**: [Explain what's wrong and why it matters]

---

## Fixed Code

\`\`\`html

<!-- ✅ Compliant code -->
<div class="hero">
  <img src="hero.jpg" alt="Team collaborating in modern office">
  <h1>Welcome</h1>
</div>
\`\`\`

**What Changed**:

- Added `alt` attribute with descriptive text
- Alt text describes image content for screen reader users

---

## Best Practices

✅ **Do**:

- Be descriptive but concise (<150 characters)
- Describe the content, not "image of" or "picture of"
- For decorative images, use `alt=""` (empty string)

❌ **Don't**:

- Use meaningless alt text like "image" or "photo"
- Omit alt attribute entirely
- Use file names as alt text

**Example Alt Text**:

- ❌ Bad: "image", "hero.jpg", "picture of people"
- ✅ Good: "Team collaborating on laptops in modern office"
- ✅ Good: "Bar chart showing 40% revenue increase Q1 to Q2"

---

## Apply This Fix

**Manual**:
Copy the fixed code above and replace current code

**Update Beads**:

```bash
# Mark as completed
bd close <task-id> --reason "Added alt text to all N occurrences"

# Verify removal from ready list
bd ready --label web-quality --json
```
````

---

## Learn More

- [Web.dev: Image Alt Text](https://web.dev/image-alt/)
- [WCAG 1.1.1: Non-text Content](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html)
- [WebAIM: Alternative Text](https://webaim.org/techniques/alttext/)

---

## Related Tasks

[If multiple occurrences or related issues exist, list them]:

- Fix #2: Form labels
- Fix #3: Color contrast

Use **#web-quality-query** to see all remaining tasks.

```

## Audit ID Mapping

Map beads tasks to authoritative sources:

### Accessibility (WCAG)
- `image-alt` → WCAG 1.1.1 Non-text Content (Level A)
- `label` → WCAG 3.3.2 Labels or Instructions (Level A)
- `color-contrast` → WCAG 1.4.3 Contrast (Minimum) (Level AA)
- `button-name` → WCAG 4.1.2 Name, Role, Value (Level A)

### Performance (Lighthouse)
- `render-blocking-resources` → Remove render-blocking resources
- `uses-responsive-images` → Properly size images
- `offscreen-images` → Defer offscreen images
- `unminified-css` → Minify CSS

### React (Vercel Patterns)
- `sequential-fetches` → Critical - Use Promise.all()
- `missing-memo` → High - Add React.memo for expensive components
- `large-bundle` → Medium - Code split and tree shake

## Success Workflow

1. User runs: **#web-quality-fix <task-id>**
2. Agent shows before/after code with explanation
3. User applies fix manually (or future: auto-apply)
4. User closes task: `bd close <task-id>`
5. Task removed from `bd ready` list

**Constraint**: Focus on ONE task. Provide complete fix with context. Keep explanation under 500 words.
```

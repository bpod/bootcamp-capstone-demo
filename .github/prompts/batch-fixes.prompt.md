---
description: "Batch related fixes workflow - group and fix similar issues together"
tools: ["codebase", "search"]
---

# Batch Related Fixes

**Goal**: Fix multiple related issues together in one efficient session

## Quick Start

Run this prompt with a category label:

```
@workspace /batch-fixes accessibility
@workspace /batch-fixes performance
@workspace /batch-fixes seo
```

## Workflow

1. **Query related tasks**:

   ```bash
   bd ready --label <category> --json | jq -r '.[] | "\(.id): \(.title)"'
   ```

2. **Group by logical batches**:
   - **Images**: Missing alt text, missing dimensions, unoptimized format
   - **Semantics**: Missing headings, landmark navigation, ARIA labels
   - **Performance**: Render-blocking, bundle size, lazy loading
   - **SEO**: Meta tags, structured data, canonical URLs

3. **Prioritize by impact**:
   - Critical: Accessibility barriers, broken functionality
   - High: Core Web Vitals, user-facing issues
   - Medium: Best practices, optimization opportunities
   - Low: Minor improvements, edge cases

4. **Claim all related tasks**:

   ```bash
   bd update <task-id-1> --status in_progress --claim
   bd update <task-id-2> --status in_progress --claim
   # etc.
   ```

5. **Apply fixes in batch**:
   - Read all affected files once
   - Make related changes together
   - Test batch before committing
   - Commit with descriptive message

6. **Close completed tasks**:
   ```bash
   bd close <task-id-1> --reason "Fixed with batch commit [sha]"
   bd close <task-id-2> --reason "Fixed with batch commit [sha]"
   ```

## Example: Batch Image Fixes

**Query**:

```bash
bd ready --label image --json
```

**Grouping**:

```
Batch 1 - Missing alt text:
- task-a: product.png missing alt
- task-b: hero.jpg missing alt
- task-c: logo.svg missing alt

Batch 2 - Missing dimensions:
- task-d: img width/height
- task-e: responsive sizing

Batch 3 - Format optimization:
- task-f: Convert to WebP
- task-g: Implement lazy loading
```

**Workflow**:

1. Claim all 7 tasks
2. Fix all alt text issues → commit
3. Add dimensions to all images → commit
4. Optimize formats → commit
5. Close all tasks with commit references

**Benefits**: 3 focused commits vs 7 scattered fixes

## Example: Batch Accessibility Fixes

**Query**:

```bash
bd ready --label accessibility --json | jq -r 'group_by(.labels | contains(["aria"]), .labels | contains(["semantic"]), .labels | contains(["keyboard"]))[]'
```

**Grouping Strategy**:

- **ARIA fixes**: Related attribute additions
- **Semantic HTML**: Replace divs with proper elements
- **Keyboard navigation**: Tab order, focus management
- **Color contrast**: Text/background pairs

**Single commit approach**: Fix all ARIA issues in one pass for easier testing

## Tips for Efficient Batching

✅ **DO**:

- Group by file/directory for locality
- Batch similar code patterns (all missing alt text)
- Test batch together to verify no conflicts
- Use conventional commit scope: `fix(a11y): batch missing alt text - 5 images`

❌ **DON'T**:

- Mix unrelated issues (accessibility + performance)
- Batch too many (>10 tasks = lose focus)
- Skip testing between batches
- Forget to update task status

## When to Batch vs Individual

**Batch together**:

- Same file, multiple issues
- Same pattern repeated across files
- Quick wins that share context
- Related but independent changes

**Fix individually**:

- Complex issues needing investigation
- Fixes requiring different testing approaches
- Changes affecting shared dependencies
- High-risk modifications

## Output Format

After analyzing tasks, provide:

1. **Grouping Summary**: Logical batches with task IDs
2. **Priority Order**: Which batch to tackle first
3. **Estimated Impact**: Expected score improvements
4. **Fix Strategy**: Specific code changes needed
5. **Test Plan**: How to verify batch fixes
6. **Commit Messages**: Suggested git commit structure

## Integration with Other Prompts

- Use `#web-quality-scan` to identify issues first
- Use `#web-quality-fix` for complex individual fixes
- Use `#web-quality-validate` to verify batch results
- Use `#lighthouse-audit` for before/after comparison

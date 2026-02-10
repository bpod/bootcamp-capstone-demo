---
description: Markdown formatting standards, documentation structure, code blocks, links, and best practices
applyTo: "**/*.md"
---

# Markdown Documentation Instructions

These guidelines apply when writing Markdown documentation. Follow these patterns for clear, consistent, and maintainable documentation.

## Document Structure

### Heading Hierarchy

```markdown
<!-- ✅ Proper heading hierarchy -->

# Document Title (H1) - Use once per document

Brief introduction paragraph.

## Main Section (H2)

Content for main section.

### Subsection (H3)

Content for subsection.

#### Detail Section (H4)

Content for details.

<!-- ❌ Skipping heading levels -->

# Title

### Subsection <!-- Skipped H2! -->
```

**Rules:**

- ✅ One H1 per document (document title)
- ✅ Don't skip heading levels (H1 → H2 → H3, not H1 → H3)
- ✅ Use sentence case for headings: "Getting started guide" not "Getting Started Guide"
- ✅ Keep headings concise and descriptive

---

## Code Blocks

### Language-Specific Code Blocks

````markdown
<!-- ✅ Specify language for syntax highlighting -->

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```
````

```bash
npm install package-name
```

```json
{
  "name": "example",
  "version": "1.0.0"
}
```

<!-- ❌ No language specified (no syntax highlighting) -->

```
function greet(name) {
  return `Hello, ${name}!`;
}
```

````

**Supported Languages:**

- `typescript`, `javascript`, `jsx`, `tsx`
- `python`, `java`, `rust`, `go`
- `bash`, `shell`, `sh`, `zsh`
- `json`, `yaml`, `toml`, `xml`
- `css`, `scss`, `html`
- `markdown`, `diff`

### Inline Code

```markdown
<!-- ✅ Use backticks for inline code -->
Use the `useState` hook to manage state.
Install with `npm install react`.
The `API_KEY` environment variable is required.

<!-- ❌ Don't use code formatting for emphasis -->
This is *very* important (use italics instead).
````

**When to Use Inline Code:**

- ✅ Function names: `handleClick`, `useState`
- ✅ Variable names: `userId`, `API_URL`
- ✅ File names: `package.json`, `vite.config.ts`
- ✅ Command names: `npm`, `git`, `curl`
- ✅ HTTP methods: `GET`, `POST`, `PUT`, `DELETE`
- ✅ Status codes: `200`, `404`, `500`
- ❌ Emphasis or highlighting (use **bold** or _italic_)

### Code Comments

````markdown
<!-- ✅ Add comments to explain code -->

```typescript
// Check if user is authenticated
if (!user) {
  throw new Error("Unauthorized");
}

// Fetch user profile with retry logic
const profile = await fetchWithRetry(userId, { maxRetries: 3 });
```
````

<!-- ✅ Use comments to show BAD vs GOOD patterns -->

```typescript
// ❌ BAD: Mutates original array
function sortUsers(users) {
  return users.sort((a, b) => a.name.localeCompare(b.name));
}

// ✅ GOOD: Creates new sorted array
function sortUsers(users) {
  return [...users].sort((a, b) => a.name.localeCompare(b.name));
}
```

````

---

## Links

### Internal Links

```markdown
<!-- ✅ Relative links to other docs -->
See the [installation guide](./installation.md) for setup instructions.
Check the [API reference](../api/reference.md) for endpoints.

<!-- ✅ Links to specific headings -->
See [Environment Variables](#environment-variables) below.
Check [React Patterns](./react-patterns.md#hooks) for hook examples.

<!-- ❌ Absolute paths (breaks portability) -->
See [guide](/Users/me/project/docs/guide.md).

<!-- ❌ Links without descriptive text -->
Click [here](./guide.md) for more info.
````

**Rules:**

- ✅ Use relative paths for internal links
- ✅ Use descriptive link text (not "click here" or "this")
- ✅ Link to headings with `#heading-slug` (kebab-case)
- ✅ Verify links work before committing

### External Links

```markdown
<!-- ✅ External links with descriptive text -->

See the [React documentation](https://react.dev) for more details.
Follow [WCAG 2.1 guidelines](https://www.w3.org/WAI/WCAG21/quickref/) for accessibility.

<!-- ✅ Reference-style links for repeated URLs -->

Check the [React docs][react-docs] and [React hooks guide][react-docs].

[react-docs]: https://react.dev

<!-- ❌ Bare URLs (not descriptive) -->

See https://react.dev for more info.
```

### Link Text Best Practices

```markdown
<!-- ✅ Descriptive link text -->

Read the [TypeScript handbook](https://typescriptlang.org/docs/handbook/) to learn more.
Install dependencies with [npm](https://npmjs.com) or [pnpm](https://pnpm.io).

<!-- ❌ Generic link text -->

Click [here](https://typescriptlang.org) to learn TypeScript.
[This page](https://npmjs.com) has more information.
```

---

## Lists

### Unordered Lists

```markdown
<!-- ✅ Consistent list markers (use - or *) -->

- First item
- Second item
  - Nested item
  - Another nested item
- Third item

<!-- ❌ Inconsistent markers -->

- First item

* Second item

- Third item
```

### Ordered Lists

```markdown
<!-- ✅ Sequential numbers -->

1. Install dependencies
2. Configure environment
3. Start development server

<!-- ✅ All 1s (auto-numbered by Markdown) -->

1. Install dependencies
1. Configure environment
1. Start development server

<!-- ❌ Non-sequential numbers -->

1. First step
2. Second step
3. Third step
```

### Task Lists

```markdown
<!-- ✅ Task lists with checkboxes -->

- [x] Set up project structure
- [x] Install dependencies
- [ ] Write tests
- [ ] Deploy to production

<!-- Use for tracking progress in issues/PRs -->
```

### Nested Lists

```markdown
<!-- ✅ Proper indentation (2 spaces) -->

- Web Quality
  - Lighthouse audits
  - Performance optimization
    - Bundle size reduction
    - Image optimization
  - Accessibility compliance

<!-- ❌ Inconsistent indentation -->

- Web Quality
  - Lighthouse audits
  - Performance optimization
```

---

## Tables

### Basic Tables

```markdown
<!-- ✅ Well-formatted table with alignment -->

| HTTP Method | Endpoint         | Description     |
| ----------- | ---------------- | --------------- |
| GET         | `/api/users`     | List all users  |
| GET         | `/api/users/:id` | Get user by ID  |
| POST        | `/api/users`     | Create new user |
| PUT         | `/api/users/:id` | Update user     |
| DELETE      | `/api/users/:id` | Delete user     |

<!-- ✅ Column alignment -->

| Package   |   Size | Downloads |
| :-------- | -----: | --------: |
| react     | 6.4 KB |  20M/week |
| react-dom | 130 KB |  20M/week |
| lodash    |  70 KB |  50M/week |
```

**Alignment:**

- `:---` = left-aligned
- `:---:` = center-aligned
- `---:` = right-aligned

### Complex Tables

```markdown
<!-- ✅ Tables with code and links -->

| Tool | Command        | Documentation                      |
| ---- | -------------- | ---------------------------------- |
| npm  | `npm install`  | [npm docs](https://docs.npmjs.com) |
| yarn | `yarn install` | [yarn docs](https://yarnpkg.com)   |
| pnpm | `pnpm install` | [pnpm docs](https://pnpm.io)       |

<!-- For very complex tables, consider using HTML -->
```

---

## Emphasis and Formatting

### Text Emphasis

```markdown
<!-- ✅ Bold for strong emphasis -->

**Warning:** This action cannot be undone.
**Required:** API key must be set before starting.

<!-- ✅ Italic for subtle emphasis -->

_Note:_ This feature is experimental.
The _recommended_ approach is to use TypeScript.

<!-- ✅ Bold + italic for maximum emphasis -->

**_Important:_** Read this before proceeding.

<!-- ❌ ALL CAPS for emphasis (avoid) -->

DO NOT USE ALL CAPS FOR EMPHASIS.

<!-- ❌ Underscores for emphasis (use asterisks) -->

**Bold** and _italic_ are less readable.
```

### Strikethrough

```markdown
<!-- ✅ Strikethrough for deprecated content -->

~~This API endpoint is deprecated.~~ Use `/api/v2/users` instead.
```

---

## Images

### Image Syntax

```markdown
<!-- ✅ Image with alt text -->

![Dashboard screenshot](./images/dashboard.png)

<!-- ✅ Image with title (tooltip) -->

![Dashboard screenshot](./images/dashboard.png "Dashboard with analytics")

<!-- ✅ Linked image -->

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/user/repo)

<!-- ❌ No alt text (accessibility issue) -->

![](./images/dashboard.png)
```

**Alt Text Best Practices:**

- ✅ Describe the image content: "Bar chart showing user growth over 6 months"
- ✅ Keep it concise but descriptive
- ✅ Don't start with "Image of" or "Picture of"
- ❌ Don't leave alt text empty (unless decorative)

### Image Organization

```markdown
<!-- ✅ Organize images in a dedicated folder -->

![Architecture diagram](./images/architecture.png)
![Component tree](./images/components.png)

<!-- ✅ Use relative paths -->

![Logo](../assets/logo.png)

<!-- ❌ Absolute paths (not portable) -->

![Logo](/Users/me/project/assets/logo.png)
```

---

## Blockquotes

### Standard Blockquotes

```markdown
<!-- ✅ Use for important notes or quotes -->

> **Note:** This feature requires Node.js 18 or higher.

> This is a quote from the documentation. It can span
> multiple lines and will be formatted as a single
> blockquote.

<!-- ✅ Nested blockquotes -->

> Main quote
>
> > Nested quote
> >
> > More nested content
```

### Callouts (GitHub Flavored Markdown)

```markdown
<!-- ✅ Note callout -->

> [!NOTE]
> Useful information that users should know.

<!-- ✅ Warning callout -->

> [!WARNING]
> Critical content that requires user attention.

<!-- ✅ Tip callout -->

> [!TIP]
> Helpful advice for doing things better or more easily.

<!-- ✅ Important callout -->

> [!IMPORTANT]
> Key information users need to know.

<!-- ✅ Caution callout -->

> [!CAUTION]
> Negative potential consequences of an action.
```

---

## Horizontal Rules

```markdown
<!-- ✅ Use to separate major sections -->

## Section One

Content for section one.

---

## Section Two

Content for section two.

## <!-- ✅ Three or more dashes, asterisks, or underscores -->

---

---
```

---

## Badges

### Common Badge Patterns

```markdown
<!-- ✅ Build status -->

[![Build Status](https://github.com/user/repo/workflows/CI/badge.svg)](https://github.com/user/repo/actions)

<!-- ✅ Code coverage -->

[![Coverage](https://codecov.io/gh/user/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/user/repo)

<!-- ✅ npm version -->

[![npm version](https://img.shields.io/npm/v/package-name.svg)](https://npmjs.com/package/package-name)

<!-- ✅ License -->

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

<!-- ✅ Custom badges (shields.io) -->

![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
```

---

## Documentation Best Practices

### README Structure

````markdown
# Project Title

Brief one-paragraph description of the project.

[![Build Status](badge-url)](link)
[![Coverage](badge-url)](link)
[![License](badge-url)](link)

## Features

- Key feature 1
- Key feature 2
- Key feature 3

## Installation

```bash
npm install package-name
```
````

## Quick Start

```typescript
import { feature } from "package-name";

const result = feature();
```

## Documentation

- [Getting Started](./docs/getting-started.md)
- [API Reference](./docs/api.md)
- [Examples](./docs/examples.md)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

MIT © [Your Name](https://github.com/username)

````

### API Documentation

```markdown
## API Reference

### `functionName(param1, param2)`

Brief description of what the function does.

**Parameters:**

- `param1` (string): Description of parameter 1
- `param2` (number, optional): Description of parameter 2. Default: `100`

**Returns:** (Promise<Result>): Description of return value

**Example:**

```typescript
const result = await functionName('value', 50);
console.log(result);
````

**Throws:**

- `Error`: When param1 is empty or invalid

````

### Changelog Format

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New feature description

### Changed
- Changes to existing functionality

### Deprecated
- Features that will be removed in future releases

### Removed
- Features that were removed in this release

### Fixed
- Bug fixes

### Security
- Security vulnerability fixes

## [1.2.0] - 2026-02-10

### Added
- User authentication system
- API rate limiting

### Fixed
- Memory leak in component unmount
````

---

## Line Length and Wrapping

````markdown
<!-- ✅ Wrap prose at 100 characters for readability -->

This is a long paragraph that wraps at approximately 100 characters to maintain
readability in both editors and on GitHub. This makes reviewing changes in diffs
much easier.

<!-- ✅ Don't wrap code blocks -->

```bash
npm install very-long-package-name --save-dev --legacy-peer-deps --force --no-audit
```
````

<!-- ✅ Don't wrap links -->

See the [very long title for this external documentation page](https://example.com/docs/very-long-url/path/to/document.html) for more details.

````

---

## Common Anti-Patterns

### ❌ Avoid These Mistakes

```markdown
<!-- ❌ Multiple H1 headings -->
# First Title
# Second Title

<!-- ✅ One H1, multiple H2s -->
# Document Title
## First Section
## Second Section

---

<!-- ❌ Inconsistent list markers -->
- Item one
* Item two
+ Item three

<!-- ✅ Consistent markers -->
- Item one
- Item two
- Item three

---

<!-- ❌ No blank lines around code blocks -->
Some text before code
```javascript
const code = 'here';
````

More text after code

<!-- ✅ Blank lines before and after -->

Some text before code

```javascript
const code = "here";
```

More text after code

---

<!-- ❌ Generic link text -->

Click [here](./guide.md) for the guide.
See [this](https://example.com) for more info.

<!-- ✅ Descriptive link text -->

See the [installation guide](./guide.md) for setup instructions.
Read the [API documentation](https://example.com) for endpoint details.

---

<!-- ❌ Empty lines with spaces (trailing whitespace) -->

Line one

Line two

<!-- ✅ Truly empty lines -->

Line one

Line two

---

<!-- ❌ Images without alt text -->

![](./screenshot.png)

<!-- ✅ Images with descriptive alt text -->

![Dashboard showing user analytics](./screenshot.png)

````

---

## File Naming Conventions

```markdown
<!-- ✅ Lowercase with hyphens -->
getting-started.md
api-reference.md
contributing-guidelines.md

<!-- ❌ Uppercase or underscores -->
Getting_Started.md
API_REFERENCE.MD

<!-- Exception: Special files use uppercase -->
README.md
CONTRIBUTING.md
LICENSE.md
CHANGELOG.md
````

---

## Documentation Maintenance

### Keep Documentation Current

```markdown
<!-- ✅ Include version information -->

> This documentation applies to version 2.x. For version 1.x, see [legacy docs](./v1/README.md).

<!-- ✅ Date-stamp major changes -->

**Last updated:** February 10, 2026

<!-- ✅ Mark deprecated features -->

## Old Method (Deprecated)

~~This method is deprecated as of v2.0.~~ Use [`newMethod`](#new-method) instead.

## New Method

This is the current recommended approach.
```

### Link Validation

```markdown
<!-- ✅ Verify all links work -->

# Run markdown link checker

npm install -g markdown-link-check
markdown-link-check README.md

<!-- ✅ Use relative links that won't break -->

[Guide](./docs/guide.md)

<!-- ❌ Brittle absolute links -->

[Guide](https://github.com/user/repo/blob/main/docs/guide.md)
```

---

## Accessibility Considerations

```markdown
<!-- ✅ Accessible tables -->

| Tool | Purpose         |
| ---- | --------------- |
| npm  | Package manager |

<!-- ✅ Descriptive alt text -->

![Bar chart showing 300% increase in users from January to June 2026](./chart.png)

<!-- ✅ Semantic heading structure -->

# Main Title (H1)

## Section (H2)

### Subsection (H3)

<!-- ✅ Descriptive link text -->

Read the [accessibility guidelines](./a11y.md) for best practices.

<!-- ❌ Generic link text -->

Click [here](./a11y.md).
```

---
description: "Quick WCAG 2.1 Level AA accessibility review"
agent: accessibility-expert
tools: ["codebase", "search", "fetch", "usages", "problems"]
---

Review the selected code for accessibility issues targeting WCAG 2.1 Level AA compliance.

Check for:

- Semantic HTML (proper headings, buttons, nav elements)
- Keyboard navigation and focus management
- ARIA attributes (only when semantic HTML isn't sufficient)
- Color contrast (4.5:1 for text, 3:1 for large text)
- Alt text for images and labels for form inputs
- Screen reader compatibility

List critical issues first, then important issues. Include specific line numbers and code fixes. Mention which WCAG success criteria each issue violates.

Reference: https://www.w3.org/WAI/WCAG21/quickref/

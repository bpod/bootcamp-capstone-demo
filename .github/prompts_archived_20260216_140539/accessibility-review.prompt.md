---
name: Accessibility Review
description: Review code for WCAG 2.1 Level AA compliance
agent: accessibility-expert
tools: ["web-quality", "readonly"]
---

# Accessibility Review

Conduct a comprehensive accessibility audit of the current code or component against WCAG 2.1 Level AA standards.

## Review Areas

1. **Semantic HTML**: Proper use of semantic elements (nav, main, article, button, etc.)
2. **ARIA**: Appropriate ARIA attributes when semantic HTML is insufficient
3. **Keyboard Navigation**: All interactive elements keyboard accessible
4. **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
5. **Form Labels**: All inputs have associated labels
6. **Focus Management**: Visible focus indicators and logical tab order
7. **Screen Reader Support**: Meaningful alt text and announcements

## Analysis Steps

1. Review code structure for semantic HTML usage
2. Check ARIA roles, states, and properties
3. Verify color contrast ratios
4. Test keyboard navigation patterns
5. Validate form accessibility
6. Identify missing alt text or labels

## Output Format

Provide findings with:

1. Critical issues (blockers to accessibility)
2. High priority issues (major usability problems)
3. Medium priority issues (improvements needed)
4. Specific fixes with code examples
5. Testing recommendations

Focus on issues that affect users with disabilities most significantly.

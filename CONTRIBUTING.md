# Contributing to AI-Powered Frontend Development Toolkit

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

---

## 🌟 Ways to Contribute

### 1. Add New Prompts
Create reusable workflows for common development tasks.

**Good Prompt Ideas**:
- CSS optimization workflows
- Database query optimization
- GraphQL schema generation
- Tailwind CSS component creation
- E2E testing setup (Playwright, Cypress)
- Deployment automation
- Monitoring setup (Sentry, LogRocket)

### 2. Create Specialized Agents
Build domain-specific AI agents with focused expertise.

**Good Agent Ideas**:
- **css-expert**: Tailwind, CSS-in-JS, design systems
- **backend-developer**: API development, database optimization
- **devops-specialist**: CI/CD, deployment, monitoring
- **mobile-developer**: React Native, responsive design
- **graphql-specialist**: Schema design, resolver optimization

### 3. Improve Documentation
- Fix typos or unclear explanations
- Add more examples to existing prompts
- Improve catalog descriptions
- Translate documentation to other languages
- Create video tutorials or screenshots

### 4. Report Bugs
- Issues with prompt execution
- Incorrect agent behavior
- Documentation errors
- Configuration problems

### 5. Suggest Enhancements
- New features or workflows
- Improvements to existing prompts
- Better organization or structure
- Integration with additional tools

---

## 📋 Contribution Guidelines

### General Principles

1. **Quality Over Quantity**: One excellent prompt is better than five mediocre ones
2. **Real-World Examples**: Use actual code, not placeholders like `foo` or `bar`
3. **Framework-Agnostic**: Detect user's tools, don't prescribe specific ones
4. **Comprehensive**: Include success criteria, validation steps, troubleshooting
5. **Tested**: Verify your contribution works in real scenarios

### File Naming Conventions

- **Prompts**: `my-workflow.prompt.md` (lowercase-with-hyphens)
- **Agents**: `my-specialist.agent.md` (lowercase-with-hyphens)
- **Instructions**: `my-context.instructions.md` (lowercase-with-hyphens)
- **Exception**: `README.md` uses uppercase (universal convention)

---

## 🔧 Creating a New Prompt

### Template

```markdown
---
description: Brief description shown in prompt picker (one sentence)
agent: agent-name
tools: ["tool1", "tool2", "tool3"]
---

# Prompt Title

Brief overview of what this prompt does and when to use it.

## Workflow

### Step 1: [Action]

Detailed instructions for step 1.

**Example**:
```bash
command example
```

### Step 2: [Action]

Detailed instructions for step 2.

## Success Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Common Issues

**Issue**: Description of problem
**Solution**: How to fix it

## References

- [Documentation Link](https://example.com)
```

### Required Sections

1. **YAML Frontmatter**: description, agent, tools
2. **Overview**: What this prompt does
3. **Workflow**: Step-by-step instructions
4. **Success Criteria**: How to verify completion
5. **Examples**: Real-world code examples
6. **Common Issues**: Troubleshooting guide (optional but recommended)

### Best Practices

- **Use variables**: `${workspaceFolder}`, `${selection}`, `${input:name}`
- **Include validation**: Commands to verify success
- **Show trade-offs**: Discuss complexity vs. benefits
- **Link to docs**: Reference official documentation
- **Add examples**: Both ❌ BAD and ✅ GOOD patterns

### Testing Your Prompt

1. Save prompt file in `.github/prompts/`
2. Open VS Code Command Palette (`Cmd+Shift+P`)
3. Run "Chat: Run Prompt"
4. Select your new prompt
5. Verify it works as expected
6. Test edge cases and error scenarios

---

## 🤖 Creating a New Agent

### Template

```markdown
---
description: Brief description of agent specialization
tools:
  - codebase
  - search
  - editFiles
  # Add other necessary tools
---

# Agent Name

## Expertise

List areas of expertise:
- Expertise area 1
- Expertise area 2
- Expertise area 3

## Guidelines

### Guideline Category 1

- Specific guideline
- Another guideline

### Guideline Category 2

- Specific guideline
- Another guideline

## Common Workflows

1. **Workflow 1**: Description and steps
2. **Workflow 2**: Description and steps

## Tools

Available tools and how to use them:
- **codebase**: Semantic code search
- **search**: Text/regex search
- **editFiles**: Modify code

## References

- [Documentation](https://example.com)
```

### Required Sections

1. **YAML Frontmatter**: description, tools
2. **Expertise**: Areas of specialization
3. **Guidelines**: Specific instructions for the agent
4. **Common Workflows**: Typical use cases
5. **Tools**: Available tools and usage

### Best Practices

- **Focused expertise**: Don't try to cover everything
- **Clear guidelines**: Specific, actionable instructions
- **Minimal tools**: Only include necessary tools
- **Examples**: Show common workflows

---

## 📝 Creating Instructions Files

### Template

```markdown
---
description: Brief description shown on hover
applyTo: "**/*.ext,**/*.other"
---

# Instructions Title

## Category 1

- Guideline 1
- Guideline 2

## Category 2

- Guideline 3
- Guideline 4

## Common Patterns

❌ **BAD**:
```language
// Anti-pattern example
```

✅ **GOOD**:
```language
// Best practice example
```
```

### Required Sections

1. **YAML Frontmatter**: description, applyTo glob pattern
2. **Guidelines**: Clear, actionable rules
3. **Examples**: Show good and bad patterns

### Best Practices

- **Specific applyTo pattern**: Target exact file types
- **Actionable rules**: Clear dos and don'ts
- **Examples**: Both anti-patterns and best practices
- **Framework detection**: Adapt to user's tools

---

## 🔄 Pull Request Process

### Before Submitting

1. **Test thoroughly**: Verify your contribution works
2. **Follow conventions**: Use consistent naming and formatting
3. **Update catalogs**: Add entry to relevant CATALOG.md file
4. **Update roadmap**: If applicable, mark items complete in implementation-roadmap.md
5. **Write clear commit messages**: Describe what and why

### PR Template

```markdown
## Description

Brief description of changes.

## Type of Change

- [ ] New prompt
- [ ] New agent
- [ ] New instructions
- [ ] Documentation improvement
- [ ] Bug fix
- [ ] Enhancement

## Testing

How you tested this:
- [ ] Tested in real project
- [ ] Verified all steps work
- [ ] Tested edge cases
- [ ] Checked for errors

## Checklist

- [ ] Follows file naming conventions
- [ ] Includes all required sections
- [ ] Added to appropriate CATALOG.md
- [ ] Updated roadmap if applicable
- [ ] Tested thoroughly
- [ ] Clear commit messages
```

### Review Process

1. **Automated checks**: Linting, link validation (when CI/CD setup)
2. **Maintainer review**: Code quality, completeness, best practices
3. **Feedback**: Address review comments
4. **Approval**: Merge when ready

---

## 📐 Code Standards

### Markdown Formatting

- **Headings**: Use `##` for main sections, `###` for subsections
- **Code blocks**: Always specify language for syntax highlighting
- **Links**: Use descriptive text, not "click here"
- **Lists**: Consistent bullet styles
- **Whitespace**: One blank line between sections

### Code Examples

- **Use real code**: Not `foo`, `bar`, `baz` placeholders
- **Show context**: Enough code to understand the pattern
- **Explain trade-offs**: When to use vs. when not to use
- **Include comments**: Explain non-obvious logic

### YAML Frontmatter

- **Required fields**: description, agent (prompts), tools (agents/prompts), applyTo (instructions)
- **Tool names**: Exact match from VS Code Copilot tools list
- **Descriptions**: One sentence, clear and concise

---

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
**Description**: Clear description of the issue

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**: What should happen

**Actual Behavior**: What actually happens

**Environment**:
- OS: [macOS/Windows/Linux]
- VS Code version: [e.g., 1.85.0]
- GitHub Copilot version: [e.g., 1.150.0]
- Node.js version: [e.g., 18.17.0]

**Additional Context**: Screenshots, error messages, logs
```

### Before Reporting

- **Search existing issues**: Check if already reported
- **Reproduce consistently**: Ensure it's not a one-time glitch
- **Provide details**: Include all relevant information
- **Include logs**: Error messages, console output

---

## 💡 Suggesting Enhancements

### Enhancement Template

```markdown
**Description**: What enhancement you're suggesting

**Use Case**: Why this would be valuable

**Proposed Solution**: How it could be implemented

**Alternatives Considered**: Other approaches you thought about

**Additional Context**: Examples, mockups, related issues
```

### Good Enhancement Suggestions

- **Specific**: Clear, well-defined idea
- **Valuable**: Solves a real problem
- **Feasible**: Realistic to implement
- **Examples**: Show what it would look like

---

## 🌐 Framework-Specific Contributions

### Vue, Angular, Svelte, etc.

We welcome framework-specific prompts and instructions!

**Requirements**:
- **Expert authorship**: Written by framework experts, not scraped from GitHub
- **Quality standards**: Same depth as existing React instructions
- **Framework detection**: Include patterns to detect project setup
- **Comprehensive examples**: Real-world code, anti-patterns, testing
- **Maintenance commitment**: Agree to update as framework evolves

**Process**:
1. Open an issue proposing the framework-specific addition
2. Discuss scope and approach with maintainers
3. Create PR with comprehensive content
4. Commit to maintaining as framework evolves

---

## 📊 Quality Standards

### For Prompts

- ✅ Clear workflow with step-by-step instructions
- ✅ Success criteria checklist
- ✅ Real-world examples (not placeholders)
- ✅ Troubleshooting section
- ✅ Links to official documentation
- ✅ Framework-agnostic when possible
- ✅ Tested in real projects

### For Agents

- ✅ Focused expertise area
- ✅ Clear guidelines and patterns
- ✅ Minimal necessary tools
- ✅ Common workflows documented
- ✅ Consistent with project principles
- ✅ Tested with multiple scenarios

### For Instructions

- ✅ Specific applyTo pattern
- ✅ Actionable, clear rules
- ✅ Good and bad examples
- ✅ Framework detection where applicable
- ✅ Tested with matching files

---

## 🤝 Community Guidelines

### Be Respectful
- Treat everyone with respect
- Welcome newcomers
- Be patient with questions
- Provide constructive feedback

### Be Collaborative
- Share knowledge generously
- Help others learn
- Give credit where due
- Celebrate contributions

### Be Professional
- Keep discussions on-topic
- Avoid inflammatory language
- Respect different opinions
- Focus on ideas, not individuals

---

## 📞 Getting Help

**Questions about Contributing?**
- Open a [GitHub Discussion](https://github.com/bpod/bootcamp-capstone-demo/discussions)
- Check existing issues and PRs
- Review [Project Documentation](docs/)

**Need Development Help?**
- See [Quick Start Guide](docs/quick-start.md)
- Check [Workflow Patterns](docs/workflow-patterns.md)
- Review existing prompts for patterns

---

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Session notes for significant contributions
- GitHub contributors graph
- Release notes when applicable

---

**Thank you for contributing to making frontend development better for everyone!** 🙏

Your contributions help developers worldwide build faster, more accessible, and higher-quality web applications.


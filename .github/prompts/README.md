# Prompt Files

This directory contains reusable prompt files for GitHub Copilot. These prompts provide on-demand workflows for common development tasks.

## 🎯 Philosophy: Start Small, Build Gradually

This is a **fresh start** with a minimal set of well-tested, essential prompts. We prioritize quality over quantity:

- **Simple and focused**: Each prompt does one thing well
- **Well-tested**: Validated with the demo-app before adding more
- **Incremental growth**: Add new prompts only when you have a proven need
- **Stack-agnostic**: Work with any frontend framework or build tool

## 📋 Available Prompts (6)

**All prompts optimized for speed: analyze selection only, top 3 issues, under 300 words**

### Web Quality
- **lighthouse-audit** - Quick Lighthouse scan (images, labels, contrast, blocking resources)
- **run-lighthouse** - Execute full CLI audit (30-60s, generates reports) - *Use in terminal instead*
- **accessibility-check** - WCAG 2.1 quick scan (labels, contrast, alt text, focus)

### React Development  
- **component-review** - React quick analysis (waterfalls, re-renders, semantic HTML)

### Code Quality
- **code-review** - General code quality (framework-agnostic)
- **performance-check** - Core Web Vitals quick check (CLS, LCP, INP)

## 🚀 Usage

Use the Command Palette (`Cmd/Ctrl+Shift+P`) → **Chat: Run Prompt** → Select prompt

Or in Copilot Chat: `@workspace /run [prompt-name]`

## 📚 Additional Resources

- [Copilot Instructions](../copilot-instructions.md) - Project-wide guidelines
- [Specialized Agents](../agents/) - Expert AI assistants
- [Auto-Apply Instructions](../instructions/) - Context-aware guidance
- [MCP Servers](../../scripts/mcp-servers/) - Automated tool execution

## 🔄 Archived Prompts

Previous prompt iterations are archived in `.github/prompts_archived_*/` for reference. These were reset to start fresh with a simpler, more maintainable approach.

## 💡 Adding New Prompts

Before adding a new prompt:

1. **Validate the need**: Is this something you'll use regularly?
2. **Keep it simple**: Each prompt should be focused and single-purpose
3. **Test thoroughly**: Validate with demo-app or real projects
4. **Document clearly**: Update this README with the new prompt

**Quality over quantity** - A few great prompts beat many mediocre ones.

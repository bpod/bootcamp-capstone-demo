# AI-Powered Frontend Development Toolkit

> **Transform your frontend development with AI-native workflows** for performance, accessibility, and code quality.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub Copilot](https://img.shields.io/badge/Powered%20by-GitHub%20Copilot-blue)](https://github.com/features/copilot)
[![Web Quality](https://img.shields.io/badge/Web%20Quality-Lighthouse-orange)](https://developers.google.com/web/tools/lighthouse)

An AI-native development toolkit combining Google Lighthouse guidelines, Core Web Vitals best practices, and React patterns—all optimized for AI-assisted development with GitHub Copilot.

---

## ✨ What This Toolkit Provides

### 🚀 **21 Ready-to-Use Prompts** (140% of target!)
Reusable workflows for common development tasks:
- **Web Quality**: Lighthouse audits, accessibility reviews, performance optimization, Core Web Vitals
- **React**: Component reviews, render optimization, hook migration, state refactoring
- **Code Quality**: Code reviews, refactoring, test generation, debugging
- **Security**: OWASP Top 10 audits, vulnerability scanning
- **Documentation**: Component docs, API docs, README generation
- **Performance**: Budget enforcement, browser compatibility testing

**[→ Browse All Prompts](.github/prompts/CATALOG.md)**

### 🤖 **5 Specialized AI Agents** (83% complete)
Expert AI assistants for specific workflows:
- **frontend-developer**: General development, web quality, performance (default)
- **accessibility-expert**: WCAG compliance, a11y testing
- **performance-tuner**: Core Web Vitals, bundle optimization
- **testing-specialist**: TDD, test generation, RTL patterns
- **copilot-customization**: Extending this toolkit

**[→ Browse All Agents](.github/agents/CATALOG.md)**

### 📋 **6 Auto-Apply Instructions** (120% of target!)
Context-aware guidance that automatically activates:
- **TypeScript**: Type safety, interfaces, generics
- **Testing**: Framework-agnostic testing patterns
- **React Components**: Hooks, performance, accessibility
- **Package.json**: Dependencies, security, scripts
- **Config Files**: Build tools, linting, environment variables
- **Markdown**: Documentation structure and formatting

**[→ Browse All Instructions](.github/instructions/CATALOG.md)**

---

## 🎯 Key Features

### ⚡ **Plug-In Architecture**
- **Works with your existing stack** - No forced dependencies
- **Framework-agnostic** - React, Vue, Angular, Svelte, or plain JavaScript
- **Build tool detection** - Adapts to Vite, Webpack, Next.js, etc.
- **Test framework flexible** - Vitest, Jest, Mocha, or any test runner

### 🎨 **Web Quality First**
- Google Lighthouse integration
- Core Web Vitals optimization (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1)
- WCAG 2.1 Level AA compliance
- Performance budgets with CI/CD enforcement

### 🧠 **AI-Native Design**
- Optimized for GitHub Copilot
- LLM-friendly documentation
- Agentic workflow patterns
- Context-aware suggestions

### 📊 **Comprehensive Coverage**
- ~24,000 lines of expert guidance
- Real-world examples (not placeholders)
- ❌ BAD / ✅ GOOD pattern comparisons
- Multi-step workflows with success criteria

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm/pnpm/yarn
- **VS Code** with GitHub Copilot extension
- **GitHub Copilot subscription** (Individual, Business, or Enterprise)

### Installation

**Option 1: Clone the Repository**
```bash
git clone https://github.com/yourusername/bootcamp-capstone-demo.git
cd bootcamp-capstone-demo
```

**Option 2: Copy into Existing Project**
```bash
# Copy toolkit files into your project
cp -r bootcamp-capstone-demo/.github your-project/
cp -r bootcamp-capstone-demo/docs your-project/
```

### Enable Copilot Customizations

1. Open VS Code Settings (`Cmd+,` on Mac, `Ctrl+,` on Windows/Linux)
2. Search for "Copilot"
3. Enable these settings:
   - ✅ `github.copilot.chat.codeGeneration.useInstructionFiles`
   - ✅ `chat.promptFiles` (experimental)

### Verify Setup

1. Open GitHub Copilot Chat (`Cmd+Shift+I` on Mac, `Ctrl+Shift+I` on Windows/Linux)
2. Type `@` to see available agents
3. You should see: `@frontend-developer`, `@accessibility-expert`, `@performance-tuner`, etc.
4. Press `Cmd+Shift+P` and search "Chat: Run Prompt"
5. You should see all 21 prompts available

**[→ Detailed Quick Start Guide](docs/quick-start.md)**

---

## 📖 Example Workflows

### Performance Optimization
```
1. Run: lighthouse-audit.prompt.md
2. Review: Lighthouse score and prioritized issues
3. Run: image-optimization.prompt.md (if images are slow)
4. Run: bundle-analysis.prompt.md (if JS is large)
5. Run: core-web-vitals.prompt.md (verify improvements)
6. Run: performance-budget.prompt.md (prevent regressions)
```

### New React Component
```
1. Create component code
2. Run: react-component-review.prompt.md
3. Run: test-generation.prompt.md
4. Run: react-accessibility.prompt.md
5. Run: document-component.prompt.md
6. Commit with confidence ✅
```

### Accessibility Audit
```
1. Switch to: @accessibility-expert agent
2. Run: accessibility-review.prompt.md
3. Fix issues with AI guidance
4. Verify with keyboard navigation
5. Test with screen reader (VoiceOver, NVDA)
```

---

## 📚 Documentation

- **[Quick Start Guide](docs/quick-start.md)** - Get productive in 5 minutes
- **[Project Overview](docs/project-overview.md)** - Mission, goals, architecture
- **[Implementation Roadmap](docs/implementation-roadmap.md)** - Progress and future plans
- **[Workflow Patterns](docs/workflow-patterns.md)** - Agentic development cycles
- **[Testing Guidelines](docs/testing-guidelines.md)** - Quality validation strategies
- **[Solution Evaluation](docs/solution-evaluation.md)** - Comprehensive analysis and roadmap

### Catalogs

- **[Prompts Catalog](.github/prompts/CATALOG.md)** - All 21 prompts with use cases
- **[Agents Catalog](.github/agents/CATALOG.md)** - All 5 agents with specializations
- **[Instructions Catalog](.github/instructions/CATALOG.md)** - All 6 auto-apply instructions

---

## 🎓 Use Cases

### For Individual Developers
- Learn web performance and accessibility best practices
- Write better React code with AI guidance
- Generate comprehensive tests automatically
- Debug issues systematically with proven workflows

### For Teams
- Standardize code quality across the team
- Enforce performance budgets in CI/CD
- Onboard new developers faster with AI assistance
- Document components and APIs consistently

### For Open Source Projects
- Improve Lighthouse scores
- Achieve WCAG compliance
- Generate professional documentation
- Maintain code quality with automated reviews

---

## 🛠️ Technology Stack

**Works With**:
- **Frameworks**: React, Vue, Angular, Svelte, Next.js, Nuxt, Astro, plain JavaScript
- **Build Tools**: Vite, Webpack, Rollup, esbuild, Parcel
- **Test Frameworks**: Vitest, Jest, Mocha, Jasmine, Testing Library
- **Package Managers**: npm, pnpm, yarn

**Requires**:
- **GitHub Copilot**: For AI-powered suggestions
- **VS Code**: Copilot customization features
- **Node.js 16+**: For running tools (Lighthouse, linters, etc.)

---

## 📊 Quality Metrics

### Current State (as of Feb 2026)
- ✅ **21 Prompts** (140% of target) - Exceeds goal by 40%
- ✅ **6 Instructions** (120% of target) - Exceeds goal by 20%
- ✅ **5 Agents** (83% of target) - Near complete
- ✅ **~24,000 lines** of expert guidance
- ✅ **42 configuration files** total

### Performance Goals
- **Lighthouse Performance Score**: 90+ (target: 100)
- **Core Web Vitals**: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1
- **Accessibility Score**: 100 (WCAG 2.1 Level AA)
- **Best Practices Score**: 100
- **SEO Score**: 100

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Ways to Contribute**:
- Add new prompts for common workflows
- Create specialized agents for specific frameworks
- Improve existing documentation
- Report bugs or suggest enhancements
- Share your success stories

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

This project is free and open-source. Use it, modify it, share it!

---

## 🙏 Acknowledgments

Inspired by:
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [GitHub Copilot](https://github.com/features/copilot)
- [React Testing Library](https://testing-library.com/react)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Core Web Vitals](https://web.dev/vitals/)

Built with ❤️ for the frontend development community.

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/bpod/bootcamp-capstone-demo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/bpod/bootcamp-capstone-demo/discussions)
- **Documentation**: [Project Docs](docs/)

---

## 🔗 Related Resources

- [VS Code Copilot Customization Docs](https://code.visualstudio.com/docs/copilot/customization)
- [Web Quality Skills (Addy Osmani)](https://github.com/addyosmani/web-quality-skills)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Start optimizing your frontend development today!** 🚀

[Get Started →](docs/quick-start.md)

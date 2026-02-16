# Quick Start Guide

Get productive with the AI-Powered Frontend Development Toolkit in 5 minutes.

---

## Prerequisites

Before starting, ensure you have:

- ✅ **VS Code** installed
- ✅ **GitHub Copilot extension** installed and enabled
- ✅ **GitHub Copilot subscription** (Individual, Business, or Enterprise)
- ✅ **Node.js 16+** for running tools (optional but recommended)

---

## Step 1: Install the Toolkit (2 minutes)

### Option A: Clone Repository

```bash
git clone https://github.com/bpod/bootcamp-capstone-demo.git
cd bootcamp-capstone-demo
code .
```

### Option B: Add to Existing Project

```bash
# Copy toolkit files into your project
cd your-project
curl -L https://github.com/bpod/bootcamp-capstone-demo/archive/main.zip -o toolkit.zip
unzip toolkit.zip
cp -r bootcamp-capstone-demo-main/.github .
cp -r bootcamp-capstone-demo-main/docs .
rm -rf bootcamp-capstone-demo-main toolkit.zip
```

### Option C: Manual Setup

1. Download repository as ZIP from GitHub
2. Extract to a folder
3. Copy `.github/` and `docs/` folders to your project
4. Open project in VS Code

---

## Step 2: Enable Copilot Customizations (1 minute)

### In VS Code Settings

1. Press `Cmd+,` (Mac) or `Ctrl+,` (Windows/Linux)
2. Search for **"Copilot"**
3. Enable these settings:
   - ✅ **GitHub Copilot > Chat > Code Generation: Use Instruction Files**
   - ✅ **Chat > Prompt Files** (experimental feature)

### Alternative: Edit settings.json
            
Press `Cmd+Shift+P`, search "Open User Settings (JSON)", add:

```json
{
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  "chat.promptFiles": true
}
```

---

## Step 3: Verify Setup (1 minute)

### Check Available Agents

1. Open GitHub Copilot Chat: `Cmd+Shift+I` (Mac) or `Ctrl+Shift+I` (Windows/Linux)
2. Type `@` in the chat input
3. You should see:
   - `@frontend-developer` - General development, web quality, TDD
   - `@accessibility-expert` - WCAG compliance, a11y audits
   - `@performance-tuner` - Core Web Vitals, bundle optimization
   - `@testing-specialist` - Test generation, RTL patterns
   - `@copilot-customization` - Toolkit customization

### Check Available Prompts

1. In Copilot Chat, type `#`
2. You should see 6 essential prompts:
   - `#lighthouse-audit` / `#run-lighthouse` - Performance and accessibility audit
   - `#accessibility-check` - WCAG 2.1 Level AA compliance
   - `#component-review` - React component best practices
   - `#code-review` - General code quality review
   - `#performance-check` - Performance analysis

**✅ Success**: If you see agents and prompts, setup is complete!

---

## Step 4: Try Your First Workflow (1 minute)

### Quick Web Quality Check

1. Open any HTML, JavaScript, or React file
2. In Copilot Chat, run:
   ```
   #accessibility-check
   ```
3. Review suggestions for accessibility improvements

### Or Ask an Agent

1. In Copilot Chat:
   ```
   @performance-tuner how can I improve my app's load time?
   ```
2. Get personalized guidance based on your code

---

## Common First Tasks

### 1. Lighthouse Audit

**Goal**: Comprehensive performance and accessibility analysis

**Workflow**:
```
#lighthouse-audit http://localhost:3000
```

**What you get**:
- Performance, Accessibility, Best Practices, SEO scores
- Core Web Vitals (LCP, INP, CLS)
- Prioritized optimization recommendations

**Note**: Requires Lighthouse CLI installed globally:
```bash
npm install -g lighthouse
```

---

### 2. Accessibility Review (Beads Pattern)

**Goal**: Find and fix WCAG 2.1 Level AA violations

**The beads pattern** uses progressive disclosure to prevent timeouts:

**Stage 1 - Quick Scan**:
```
@accessibility-expert scan my project for accessibility issues
```

Get a fast table summary (~30 seconds):
| Category | Issues | Severity | Top Issue |
|----------|--------|----------|-----------|
| Images | 8 | Critical | Missing alt text |
| Forms | 3 | High | Missing labels |
| Colors | 5 | Medium | Low contrast |

**Stage 2 - Details**:
```
show me the image issues
```

Get a detailed list with file:line references:
1. **Missing alt text** - [index.html:45](index.html#L45)
2. **Missing alt text** - [about.html:22](about.html#L22)
...

**Stage 3 - Fix**:
```
fix issue 1
```

Get before/after code with explanation:
```html
<!-- ❌ Before -->
<img src="hero.jpg">

<!-- ✅ After -->
<img src="hero.jpg" alt="Team collaborating in modern office">
```

**Why beads pattern?**
- ✅ No timeouts (Stage 1 is fast)
- ✅ No manual selection needed (smart scope detection)
- ✅ You control depth (explore what matters)
- ✅ Conversational (natural language commands)

---

### 3. React Component Review

**Goal**: Analyze React component for best practices

**Workflow**:
```
#component-review
```

*(Works on currently open React component)*

**What you get**:
- Hook usage patterns
- Performance optimization opportunities (React.memo, useMemo, useCallback)
- Accessibility issues (semantic HTML, ARIA attributes)
- Testing suggestions
- References to Vercel React Best Practices

---

### 4. Code Quality Review

**Goal**: General code quality and maintainability check

**Workflow**:
```
#code-review
```

**What you get**:
- Code smells and anti-patterns
- Complexity analysis
- Naming conventions
- Documentation suggestions
- Security considerations

---

### 5. Performance Optimization

**Goal**: Improve Core Web Vitals and load time

**Workflow**:
```
#performance-check
```

**What you get**:
- LCP, INP, CLS analysis
- Bundle size optimization
- Image optimization strategies
- Code splitting recommendations
- Render performance tips

---
   - `@performance-tuner`
   - `@testing-specialist`
   - `@copilot-customization`

### Check Available Prompts

1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Search **"Chat: Run Prompt"**
3. You should see 6 essential prompts:
   - lighthouse-audit / run-lighthouse
   - accessibility-check
   - component-review
   - code-review
   - performance-check

**✅ If you see agents and prompts, you're ready to go!**

---

## Step 4: Run Your First Prompt (1 minute)

Let's run a Lighthouse audit to see the toolkit in action.

### Method 1: Command Palette

1. `Cmd+Shift+P` → "Chat: Run Prompt"
2. Select **"lighthouse-audit"**
3. When prompted, enter your local dev server URL (e.g., `http://localhost:3000`)
4. The prompt will guide you through the audit

### Method 2: Chat Interface

1. Open Copilot Chat (`Cmd+Shift+I`)
2. Type: `Run the lighthouse-audit prompt on http://localhost:3000`
3. Follow the AI's guidance

### Method 3: Direct Request

1. Open Copilot Chat
2. Type: `@frontend-developer run a Lighthouse audit on my app and show me the top 3 performance issues`
3. Follow suggestions

---

## 🎯 Common First Tasks

Now that you're set up, try these common workflows:

### 1. Performance Optimization

**Goal**: Improve Lighthouse score from 42 to 90+

```
1. Run: lighthouse-audit.prompt.md
   Enter your URL: http://localhost:3000
   
2. Review the performance score and recommendations

3. If images are slow:
   Run: image-optimization.prompt.md
   
4. If JavaScript bundle is large:
   Run: bundle-analysis.prompt.md
   
5. Verify improvements:
   Run: core-web-vitals.prompt.md
```

**Expected Result**: Lighthouse score 90+, Core Web Vitals passing

---

### 2. Accessibility Review

**Goal**: Ensure WCAG 2.1 Level AA compliance

```
1. Switch to accessibility-expert agent:
   In chat, type: @accessibility-expert
   
2. Run: accessibility-review.prompt.md
   
3. Review automated findings (axe-core audit)

4. Test keyboard navigation:
   - Tab through all interactive elements
   - Enter/Space activates buttons
   - Escape closes modals
   
5. Test with screen reader:
   - Mac: VoiceOver (Cmd+F5)
   - Windows: NVDA (free)
```

**Expected Result**: Lighthouse Accessibility score 100, no axe violations

---

### 3. React Component Review

**Goal**: Review a component for best practices

```
1. Open your component file (e.g., UserProfile.tsx)

2. Select all code (Cmd+A)

3. Run: react-component-review.prompt.md
   (or type in chat: @frontend-developer review this component)
   
4. Review the 8-dimensional analysis:
   - Component Structure
   - Props and Types
   - State Management
   - Side Effects
   - Performance
   - Accessibility
   - Error Handling
   - Testing
   
5. Apply suggested improvements
```

**Expected Result**: Component follows all React best practices

---

### 4. Generate Tests

**Goal**: Write comprehensive tests for a custom hook

```
1. Open your hook file (e.g., useAuth.ts)

2. Switch to testing-specialist:
   In chat: @testing-specialist
   
3. Run: test-generation.prompt.md
   
4. Review generated tests:
   - Setup and teardown
   - Happy path scenarios
   - Error cases
   - Edge cases
   
5. Run tests: npm test (or yarn test, pnpm test)
```

**Expected Result**: 80%+ test coverage, all tests passing

---

### 5. Security Audit

**Goal**: Find and fix security vulnerabilities

```
1. Run: security-review.prompt.md

2. Review OWASP Top 10 checklist:
   - Injection attacks
   - Authentication issues
   - Sensitive data exposure
   - XML External Entities (XXE)
   - Broken access control
   - Security misconfiguration
   - Cross-Site Scripting (XSS)
   - Insecure deserialization
   - Using components with known vulnerabilities
   - Insufficient logging & monitoring
   
3. Run dependency audit:
   npm audit (or pnpm audit, yarn audit)
   
4. Fix high/critical vulnerabilities
```

**Expected Result**: No high/critical vulnerabilities, security best practices followed

---

## 📚 Learning Resources

### Catalogs (Browse Available Tools)

- **[Prompts Directory](.github/prompts/)** - All 6 prompts with descriptions
- **[Agents Catalog](.github/agents/CATALOG.md)** - All 5 agents with specializations
- **[Instructions Catalog](.github/instructions/CATALOG.md)** - All 6 auto-apply instructions

### Documentation

- **[Project Overview](docs/project-overview.md)** - Mission, goals, architecture
- **[Workflow Patterns](docs/workflow-patterns.md)** - Agentic development cycles
- **[Testing Guidelines](docs/testing-guidelines.md)** - Quality validation strategies
- **[Implementation Roadmap](docs/implementation-roadmap.md)** - Progress and future plans

### External Resources

- [VS Code Copilot Docs](https://code.visualstudio.com/docs/copilot/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Core Web Vitals](https://web.dev/vitals/)
- [React Testing Library](https://testing-library.com/react)

---

## 🔧 Troubleshooting

### Prompts Not Showing

**Problem**: Can't see prompts in "Chat: Run Prompt"

**Solutions**:
1. Check settings: `github.copilot.chat.codeGeneration.useInstructionFiles` enabled
2. Check settings: `chat.promptFiles` enabled (experimental)
3. Restart VS Code
4. Verify files exist in `.github/prompts/` folder
5. Check file extensions: Must be `.prompt.md`

---

### Agents Not Available

**Problem**: Can't see agents when typing `@`

**Solutions**:
1. Verify files exist in `.github/agents/` folder
2. Check file extensions: Must be `.agent.md`
3. Restart VS Code
4. Check VS Code version: Update to latest
5. Check GitHub Copilot extension: Update to latest

---

### Instructions Not Auto-Applying

**Problem**: Instructions don't activate when editing files

**Solutions**:
1. Check settings: `github.copilot.chat.codeGeneration.useInstructionFiles` enabled
2. Verify `applyTo` pattern matches your file (check frontmatter)
3. Restart VS Code
4. Check file extensions: Must be `.instructions.md`
5. Try opening a new file that matches the pattern

---

### Copilot Not Responding

**Problem**: Copilot gives generic responses, ignoring customizations

**Solutions**:
1. Check GitHub Copilot subscription is active
2. Sign out and sign back in to GitHub in VS Code
3. Disable then re-enable GitHub Copilot extension
4. Clear VS Code cache: `Cmd+Shift+P` → "Developer: Reload Window"
5. Check internet connection

---

### Commands Not Found

**Problem**: Prompts reference commands not available in your project

**Solutions**:
1. Install necessary tools: `npm install -g lighthouse @axe-core/cli`
2. Check Node.js version: `node --version` (need 16+)
3. Follow prompt's installation instructions
4. Adapt commands to your package manager (npm/yarn/pnpm)

---

## 💡 Pro Tips

### 1. Combine Agents and Prompts

Switch to the specialized agent, then run the related prompt:

```
@performance-tuner
Run: lighthouse-audit.prompt.md
```

This gives you expert guidance for the specific workflow.

---

### 2. Use Variables in Chat

Reference workspace context:

```
"Optimize the performance of ${workspaceFolder}/src/App.tsx"
"Review the security of ${selection}"
```

---

### 3. Chain Workflows

Create multi-step optimization flows:

```
1. lighthouse-audit → Identify issues
2. image-optimization → Fix images
3. bundle-analysis → Reduce JS
4. core-web-vitals → Verify
5. performance-budget → Prevent regressions
```

---

### 4. Customize for Your Team

Edit prompts to match your standards:

```markdown
# In lighthouse-audit.prompt.md
- Change target scores (e.g., 95 instead of 90)
- Add company-specific requirements
- Reference internal tools
```

---

### 5. Create Custom Workflows

Build project-specific prompts:

```markdown
---
description: Deploy to staging environment
agent: frontend-developer
tools: ["runCommands", "getTerminalOutput"]
---

# Deploy to Staging

1. Run tests: npm test
2. Build: npm run build
3. Deploy: npm run deploy:staging
4. Verify: Check https://staging.myapp.com
```

---

## 🎯 Next Steps

Now that you're set up, explore:

1. **Browse Catalogs**: See all available tools
   - [Prompts Catalog](.github/prompts/CATALOG.md)
   - [Agents Catalog](.github/agents/CATALOG.md)
   - [Instructions Catalog](.github/instructions/CATALOG.md)

2. **Run Example Workflows**: Try the workflows above

3. **Customize**: Edit prompts/agents/instructions for your needs

4. **Contribute**: Share your custom workflows
   - See [CONTRIBUTING.md](../CONTRIBUTING.md)

5. **Learn More**: Read full documentation
   - [Project Overview](project-overview.md)
   - [Workflow Patterns](workflow-patterns.md)
   - [Testing Guidelines](testing-guidelines.md)

---

## 📞 Getting Help

**Questions?**
- Check [Project Documentation](../docs/)
- Browse [GitHub Issues](https://github.com/bpod/bootcamp-capstone-demo/issues)
- Start [GitHub Discussion](https://github.com/bpod/bootcamp-capstone-demo/discussions)

**Found a Bug?**
- See [CONTRIBUTING.md](../CONTRIBUTING.md) for bug report template
- Open issue with detailed reproduction steps

**Want to Contribute?**
- Read [CONTRIBUTING.md](../CONTRIBUTING.md)
- Add new prompts, agents, or improvements
- Share your success stories!

---

**Happy coding! 🚀**

You're now ready to build high-performance, accessible web applications with AI assistance.

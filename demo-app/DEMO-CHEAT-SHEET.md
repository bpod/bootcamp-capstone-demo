# Demo Cheat Sheet - Quick Reference

**Time**: 15-20 minutes total  
**Key Message**: Systematic web quality improvement with measurable results

---

## 🎬 Flow

1. **Problem** (3 min) → Show app, baseline (A11y: 74)
2. **Detection** (7 min) → Run prompt, review findings
3. **Fix** (5 min) → Apply 3 fixes with Copilot
4. **Proof** (3 min) → Re-audit (A11y: 74→95)
5. **Close** (2 min) → Show catalog, GitHub repo

---

## 📋 Pre-Demo Checklist

- [ ] Server: `cd demo-app && python3 -m http.server 8080`
- [ ] VS Code open with `demo-app/index.html`
- [ ] Browser tabs:
  - `http://localhost:8080`
  - `demo-app/reports/baseline.report.html`
  - `https://github.com/bpod/bootcamp-capstone-demo`
- [ ] Terminal ready for Lighthouse
- [ ] Copilot working (test with simple query)

---

## 🎯 Key Demo Points

### Opening Hook
> "How many have shipped with good performance but accessibility issues?"

### The Numbers
- **Before**: A11y 74, Performance 95
- **After**: A11y 95+, Performance 95
- **Impact**: "28% improvement in ~5 minutes"

### The Fixes (Pick 3)
1. **Images**: Add alt text
   - Before: `<img src="..." class="hero-image">`
   - After: `<img src="..." alt="Team collaborating..." class="hero-image">`

2. **Contrast**: Fix color
   - Before: `<h3 style="color: #aaa;">Fast Performance</h3>`
   - After: `<h3 style="color: #333;">Fast Performance</h3>`

3. **Forms**: Add labels
   - Before: `<input type="text" placeholder="Your name" id="name">`
   - After: `<label for="name">Your Name</label><input...>`

---

## 💬 Commands to Run

### Accessibility Review Prompt
```
Cmd+Shift+P → "Chat: Run Prompt" → "accessibility-review"
```

### Re-run Lighthouse
```bash
lighthouse http://localhost:8080 --output=html --output-path=./demo-app/reports/after-fixes.html --quiet
```

### Quick Fixes with Copilot
- "Add descriptive alt text to this image"
- "Fix the color contrast to meet WCAG AA standards"
- "Add proper labels to this form for accessibility"

---

## 📊 Key Stats to Mention

- **21 prompts** - Comprehensive coverage
- **5 agents** - Specialized expertise
- **74 → 95** - Accessibility improvement
- **5 minutes** - Time to setup
- **96% of sites** - Have accessibility errors (WebAIM)

---

## 🎤 Talking Points

### Why This Matters
- "Performance isn't enough - a11y excludes real users"
- "Manual review is error-prone and time-consuming"
- "AI catches issues systematically"

### Differentiators
- **Framework-agnostic** - Works with React, Vue, Angular, plain HTML
- **Tool-agnostic** - Adapts to your build system
- **Free & open source** - Available now

### Call to Action
- "Clone the repo, get started in 5 minutes"
- "Customize for your team's standards"
- "Contribute your own prompts"

---

## ❓ Q&A - Quick Answers

**Q: Requires MCP servers?**
A: No, works today with Copilot. MCP is optional.

**Q: Cost?**
A: Free if you have Copilot. Toolkit is open source.

**Q: My framework?**
A: Framework-agnostic. React-specific prompts available too.

**Q: Disagree with recommendation?**
A: You control it. Prompts guide, you decide. Fully customizable.

**Q: Production ready?**
A: Yes! Use in dev, code review, or pre-commit checks.

---

## 🆘 Backup Plans

### If Lighthouse Slow
- Show pre-generated report
- Talk through what it's checking
- Have screenshot ready

### If Copilot Unresponsive  
- Have example responses ready
- Show catalog instead
- Focus on approach/methodology

### If Demo App Won't Load
- Screenshots of app
- Focus on code and prompts
- "Imagine this is your app..."

---

## ⏱️ Time Checkpoints

- **3 min** → Should be showing baseline audit
- **10 min** → Should be fixing first issue
- **15 min** → Should be showing after-audit
- **18 min** → Showing catalog, wrapping up

If behind: Skip one fix, jump straight to results

---

## 🔥 One-Liner Closes

Pick one for maximum impact:

1. "74 to 95 in 5 minutes. That's the power of systematic AI guidance."

2. "Works with your stack, your tools, your team. Available now."

3. "21 prompts, 100% free, ready today. What are you waiting for?"

---

## 📞 Share After Demo

- GitHub: `https://github.com/bpod/bootcamp-capstone-demo`
- Quick Start: `docs/quick-start.md`
- Prompts: `.github/prompts/CATALOG.md`

---

**Remember**: Focus on the story, not every feature. Show the transformation: problem → detection → fix → proof. Let the metrics speak.

**You've got this! 🚀**

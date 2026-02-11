# Demo Script: AI-Powered Frontend Development Toolkit

**Duration**: 15-20 minutes  
**Objective**: Demonstrate systematic web quality improvement with AI assistance  
**Audience**: Developers, Engineering Managers, Tech Leaders

---

## Pre-Demo Setup (5 minutes before)

### 1. Environment Check
- [ ] VS Code open with project loaded
- [ ] GitHub Copilot extension enabled and working
- [ ] Local server running: `cd demo-app && python3 -m http.server 8080`
- [ ] Browser tabs ready:
  - `http://localhost:8080` (demo app)
  - `demo-app/reports/baseline.report.html` (baseline Lighthouse)
  - GitHub repo: `https://github.com/bpod/bootcamp-capstone-demo`

### 2. Files to Have Open
- [ ] `demo-app/index.html` (the problem)
- [ ] `demo-app/VALIDATION.md` (testing progress)
- [ ] `.github/prompts/CATALOG.md` (show breadth)
- [ ] `.github/agents/CATALOG.md` (show specialization)

### 3. Terminal Ready
- [ ] One terminal with server running (background)
- [ ] One terminal ready for commands
- [ ] Lighthouse CLI ready: `lighthouse --version`

### 4. Backup Plan
- [ ] Screenshots of Lighthouse results (in case of network issues)
- [ ] Pre-recorded GIF of prompt running (optional)

---

## Act 1: The Problem (3 minutes)

### Opening Hook
> "How many of you have shipped a web app with great Lighthouse performance scores, only to find out later it has serious accessibility issues?"

**[Show hands raise]**

> "Today I'll show you how to catch these systematically, before users do."

---

### 1.1 Introduce Demo App (1 minute)

**[Open browser: http://localhost:8080]**

```
SPEAKING POINTS:
- "Here's a typical web application"
- "Clean design, modern layout, looks professional"
- "Uses common patterns - hero section, features, form, modal"
- "But appearances can be deceiving"
```

**[Scroll through the page to show different sections]**

---

### 1.2 Show Baseline Metrics (1 minute)

**[Open demo-app/reports/baseline.report.html in browser]**

```
SPEAKING POINTS:
- "Let's run Lighthouse to see how we're doing"
- "Performance: 95 - Excellent! ✅"
- "Best Practices: 96 - Great! ✅"
- "SEO: 82 - Good! ✅"
- "Accessibility: 74 - Needs Improvement ❌"
- "This is the problem - 74 means we're excluding users"
```

**[Hover over accessibility score to show failed audits]**

```
KEY STAT:
"According to WebAIM, 96% of home pages have accessibility errors.
We're about to fix ours systematically."
```

---

### 1.3 Peek at Code (1 minute)

**[Switch to VS Code, show demo-app/index.html]**

```
SPEAKING POINTS:
- "Let's look at the code"
- [Scroll to image] "Images without alt text"
- [Scroll to form] "Form inputs without labels"
- [Scroll to navigation] "Non-semantic divs instead of nav"
- "These are common, easy-to-miss issues"
- "Manually reviewing for all accessibility issues? Time-consuming and error-prone"
```

**[Pause for effect]**

> "Let's see how AI can help us catch these systematically."

---

## Act 2: AI-Powered Detection (7 minutes)

### 2.1 Introduce the Toolkit (1 minute)

**[Show .github/prompts/CATALOG.md briefly]**

```
SPEAKING POINTS:
- "This toolkit has 21 specialized prompts"
- "Each one follows web quality best practices"
- "Based on Google Lighthouse, WCAG 2.1, React patterns"
- "Let's use the accessibility review prompt"
```

**[Don't read the whole catalog - just show the breadth]**

---

### 2.2 Run Accessibility Review Prompt (3 minutes)

**[Open Command Palette: Cmd+Shift+P]**
**[Type: "Chat: Run Prompt"]**
**[Select: "accessibility-review"]**

**WAIT - Let the audience see the prompt selection**

```
SPEAKING POINTS (while prompt loads):
- "This prompt follows a comprehensive WCAG 2.1 Level AA checklist"
- "It looks at perceivable, operable, understandable, and robust criteria"
- "Let's see what it finds..."
```

**[Watch Copilot analyze the file]**

**PRO TIP**: If Copilot is slow, narrate what it's doing:
- "Checking semantic HTML structure"
- "Analyzing color contrast ratios"
- "Looking for keyboard accessibility"

---

### 2.3 Review Findings (3 minutes)

**[Copilot will return a detailed report]**

```
SPEAKING POINTS:
- "Look at this comprehensive analysis"
- "It found [X] critical issues automatically"
- "Let me highlight the top 3:"
```

**[Read out actual findings, but summarize - examples]:**

1. **Images Without Alt Text**
   - "6 images missing alternative text"
   - "Screen reader users have no idea what these show"
   - "That's a WCAG Level A failure - mandatory"

2. **Poor Color Contrast**
   - "Feature card headings use #aaa, #999, #888"
   - "Contrast ratio: 2.8:1, need 4.5:1 minimum"
   - "That's 55% of users with low vision who can't read this"

3. **Form Inputs Without Labels**
   - "Name, email, message fields have no <label> elements"
   - "Screen readers can't identify what each field is for"
   - "Keyboard users have no way to click into fields"

```
KEY MESSAGE:
"These aren't just 'nice to haves' - they're blocking real users
from using our application. And the AI found them all in seconds."
```

---

## Act 3: The Fix (5 minutes)

### 3.1 Fix Images (1.5 minutes)

**[Navigate to first image without alt text in index.html]**

```html
<!-- BEFORE -->
<img src="https://via.placeholder.com/1200x600.jpg" class="hero-image">
```

**[Ask Copilot to fix it]**

**In chat**: "Add descriptive alt text to this image"

**[Copilot suggests]:**

```html
<!-- AFTER -->
<img src="https://via.placeholder.com/1200x600.jpg" 
     class="hero-image"
     alt="Team collaborating on web development project with modern tools">
```

```
SPEAKING POINTS:
- "Notice the alt text is descriptive, not just 'image'"
- "It describes what the image shows, not just that it exists"
- "That's proper accessibility"
```

---

### 3.2 Fix Color Contrast (1.5 minutes)

**[Navigate to feature card with poor contrast]**

```html
<!-- BEFORE -->
<h3 style="color: #aaa;">Fast Performance</h3>
```

**[Ask Copilot]:**

**In chat**: "Fix the color contrast to meet WCAG AA standards"

**[Copilot suggests]:**

```html
<!-- AFTER -->
<h3 style="color: #333;">Fast Performance</h3>
```

**[In CSS, Copilot might suggest]:**
```css
.feature-card h3 {
    color: #333; /* Contrast ratio: 12.6:1 - exceeds WCAG AA */
}
```

```
SPEAKING POINTS:
- "Changed from #aaa to #333"
- "Now contrast ratio is 12.6:1 - way above the 4.5:1 minimum"
- "Readable for everyone, including users with low vision"
```

---

### 3.3 Fix Form Labels (2 minutes)

**[Navigate to form section]**

```html
<!-- BEFORE -->
<input type="text" placeholder="Your name" id="name">
```

**[Ask Copilot]:**

**In chat**: "Add proper labels to this form for accessibility"

**[Copilot suggests]:**

```html
<!-- AFTER -->
<label for="name">Your Name</label>
<input type="text" 
       id="name" 
       name="name"
       placeholder="Your name"
       required
       aria-describedby="name-help">
<span id="name-help" class="sr-only">Please enter your full name</span>
```

```
SPEAKING POINTS:
- "Notice we added an explicit <label> element"
- "Connected with 'for' attribute to the input id"
- "Added aria-describedby for extra context"
- "Screen readers now announce: 'Your name, required, edit text, Please enter your full name'"
- "That's a complete, accessible experience"
```

**[Optional: Show one more fix if time allows, or move to results]**

---

## Act 4: The Proof (3 minutes)

### 4.1 Re-run Lighthouse (2 minutes)

**[In terminal]:**

```bash
lighthouse http://localhost:8080 --output=html --output-path=./demo-app/reports/after-fixes.html --quiet
```

**[While it runs (takes ~15 seconds)]:**

```
SPEAKING POINTS:
- "Let's verify our improvements with Lighthouse"
- "Same tool, same metrics, different results"
- "This is the beauty of measurable improvements"
```

**[Open the new report]:**

```
HIGHLIGHT:
- Accessibility: 74 → 95 (or higher!) ✅
- "That's a 28% improvement!"
- "We went from 'Needs Improvement' to 'Excellent'"
```

**[Show the passing audits that were previously failing]:**
- ✅ Images now have alt attributes
- ✅ Color contrast meets WCAG AA
- ✅ Form elements have associated labels

---

### 4.2 Show the Broader Toolkit (1 minute)

**[Quick tour - don't dwell]:**

**[Show .github/prompts/CATALOG.md]:**
```
SPEAKING POINTS:
- "Accessibility is just one prompt out of 21"
- [Scroll quickly] "Performance optimization, bundle analysis, React reviews, security audits"
- "All following industry best practices"
```

**[Show .github/agents/CATALOG.md]:**
```
SPEAKING POINTS:
- "We also have 5 specialized agents"
- "Frontend Developer, Performance Tuner, Testing Specialist"
- "Each one knows the patterns for their domain"
```

**[Don't read every item - just show the breadth]**

---

## Closing (2 minutes)

### Key Takeaways

**[Back to presentation or just speak]:**

```
1. SYSTEMATIC, NOT AD-HOC
"AI helps you catch issues systematically, not by luck"

2. MEASURABLE IMPROVEMENTS
"74 to 95 accessibility score - that's real impact"

3. WORKS WITH YOUR STACK
"Not tied to React, Vue, or any framework"
"Works with your existing tools - Vite, Webpack, Jest, whatever"

4. AVAILABLE NOW
"This isn't vaporware - it's ready to use today"
```

---

### Call to Action

**[Show GitHub repo in browser]:**

```
SPEAKING POINTS:
- "Everything you saw is open source"
- "Clone the repo, get started in 5 minutes"
- "Quick-start guide walks you through installation"
- "21 prompts, 5 agents, 6 instruction files - all ready to use"
```

**[Show the URL clearly]:**
```
https://github.com/bpod/bootcamp-capstone-demo
```

---

### Q&A Preparation

**Common Questions:**

**Q: "Does this require MCP servers?"**
A: "No, the prompts work today with regular Copilot. MCP integration is optional for advanced features."

**Q: "How much does this cost?"**
A: "If you have GitHub Copilot, you already have what you need. The toolkit is free and open source."

**Q: "Will this work with my framework (Vue/Angular/Svelte)?"**
A: "Yes! It's framework-agnostic. Prompts use universal web standards. We have React-specific prompts, but core web quality works everywhere."

**Q: "What if I disagree with a recommendation?"**
A: "You're in control. Prompts guide, you decide. Plus, you can customize any prompt for your team's standards."

**Q: "Can I use this in production?"**
A: "Absolutely. Use it during development, in code reviews, or as pre-commit checks."

**Q: "How do I add my own prompts?"**
A: "Super easy - just create a `.prompt.md` file in `.github/prompts/`. Check the CONTRIBUTING guide for templates."

---

## Backup Plans

### If Lighthouse is Slow
- "While this runs, let me show you [another feature]"
- Have pre-generated report screenshot ready
- Skip to showing the after-report you pre-generated

### If Copilot is Unresponsive
- Have pre-written responses ready to paste
- "Sometimes Copilot is thinking hard - let me show you what it typically suggests"
- Fall back to showing the catalog and explaining the approach

### If Demo App Won't Load
- Have screenshots of the app ready
- Focus on the code and prompts in VS Code
- "Imagine this is your app, here's what happens..."

### If Network Issues
- Everything works offline except Lighthouse
- Show the baseline report you already have
- Focus on the code fixes and prompt workflow

---

## Post-Demo

### Follow-Up Materials
- [ ] Share demo recording link
- [ ] Share GitHub repo link in chat
- [ ] Share quick-start guide link
- [ ] Offer office hours for questions

### Metrics to Track
- [ ] GitHub stars/forks after demo
- [ ] Questions asked (shows interest areas)
- [ ] Follow-up requests

---

## Practice Run Checklist

**Before the actual demo:**

- [ ] Run through entire script once
- [ ] Time each section (should hit 15-20 min target)
- [ ] Test all commands work
- [ ] Verify Copilot responses are reasonable
- [ ] Have backup screenshots ready
- [ ] Practice transitioning between sections smoothly
- [ ] Prepare 2-3 audience engagement questions
- [ ] Test screen sharing if remote

---

**Good luck! You've got this! 🚀**

Remember: The goal isn't to show every feature - it's to tell a story of systematic improvement with measurable results. Keep it focused, keep it moving, and let the metrics speak for themselves.

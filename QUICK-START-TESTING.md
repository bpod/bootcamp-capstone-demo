# Quick Start - Resume Testing

**Last Session**: 2026-02-11  
**Status**: Infrastructure complete, blocked by VS Code environment  
**Read First**: [TESTING-SESSION-SUMMARY.md](TESTING-SESSION-SUMMARY.md)

---

## 🚀 Quick Resume Steps

### 1. Upgrade VS Code Environment (5 minutes)

**Option A: Install VS Code Insiders**
```bash
# Download from: https://code.visualstudio.com/insiders/
# macOS: Install .dmg and launch
```

**Option B: Switch to Pre-Release Extension** (Easier)
1. Open VS Code
2. Extensions panel (`Cmd+Shift+X`)
3. Find "GitHub Copilot Chat"
4. Click dropdown → "Switch to Pre-Release Version"
5. Reload window when prompted

### 2. Verify MCP Working (2 minutes)

```bash
# Check MCP servers load
# 1. Open VS Code in this workspace
# 2. View → Output
# 3. Dropdown should show "MCP" option
# 4. Should see: "✅ web-quality-skills connected (6 tools)"
#               "✅ react-best-practices connected (6 tools)"
```

### 3. Start Demo Server (30 seconds)

```bash
cd demo-app && python3 -m http.server 8080

# Verify: http://localhost:8080 should load demo app
```

### 4. Test First Prompt (1 minute)

Open Copilot Chat and try:
```
#lighthouse-audit http://localhost:8080
```

**Expected**: Should analyze the baseline audit or run new one  
**If fails**: Use workaround: `#file:lighthouse-audit.prompt.md http://localhost:8080`

---

## 📁 Where Everything Is

- **Overall Plan**: [docs/implementation-roadmap.md](docs/implementation-roadmap.md)
- **Session Summary**: [TESTING-SESSION-SUMMARY.md](TESTING-SESSION-SUMMARY.md)
- **Test Plan**: [demo-app/TEST-PLAN.md](demo-app/TEST-PLAN.md) (22 prompts detailed)
- **Test Results**: [demo-app/TEST-RESULTS.md](demo-app/TEST-RESULTS.md) (track progress here)
- **Baseline Metrics**: [demo-app/BASELINE-RESULTS.md](demo-app/BASELINE-RESULTS.md)
- **Baseline Reports**: [demo-app/reports/baseline.report.html](demo-app/reports/baseline.report.html)

---

## ✅ What's Already Done

- Test infrastructure created
- Demo app with intentional issues ready
- Lighthouse baseline audit complete (Perf: 95, A11y: 74)
- 3 accessibility issues identified and documented
- MCP servers implemented and tested standalone
- All 22 prompts catalogued and prioritized

---

## 🎯 Next: Test These 8 Prompts First

Priority web quality prompts with real issues to detect:

1. ✅ `#lighthouse-audit http://localhost:8080`
2. `#accessibility-review` (should find 3 issues)
3. `#accessibility-quick` (fast check)
4. `#performance-optimization`
5. `#core-web-vitals http://localhost:8080`
6. `#image-optimization`
7. `#bundle-analysis`
8. `#performance-budget`

**For each prompt**:
- Run it in Copilot Chat
- Note if MCP tools auto-invoke
- Check if issues detected match baseline
- Document results in TEST-RESULTS.md
- Mark pass ✅, partial ⚠️, or fail ❌

---

## 🆘 If Something's Not Working

**MCP not loading?**
- Check Output → MCP for errors
- Run: `node scripts/mcp-servers/test-servers.js` (should show ✅)
- Verify `.vscode/mcp.json` exists

**Prompt invocation failing?**
- Use workaround: `#file:prompt-name.prompt.md`
- Verify settings: `chat.experimental.promptFiles.enabled: true`
- Check `.github/prompts/` has 22 `.prompt.md` files

**Demo server not responding?**
```bash
# Check if running
lsof -ti:8080

# Kill and restart
lsof -ti:8080 | xargs kill
cd demo-app && python3 -m http.server 8080
```

---

## 📊 Current Progress

```
Testing Status: 0/22 prompts tested (0%)

✅ Infrastructure: Complete
⚠️  Environment: Needs VS Code Insiders/pre-release
⏳ Testing: Ready to start
```

---

**Time Estimate**: 2-3 hours to test all 22 prompts after environment upgrade

# Quick Start: Using MCP Servers

Your MCP servers are now installed and ready to use! Follow these steps to start using them.

## 1. Restart VS Code

**Action**: Restart VS Code to load the MCP servers.

```
Cmd+Shift+P → "Developer: Reload Window"
```

Or quit and reopen VS Code.

## 2. Verify Servers Are Running

**Check MCP server status**:

```
Cmd+Shift+P → "MCP: List Servers"
```

You should see:
- ✅ `web-quality-skills` - Running
- ✅ `react-best-practices` - Running

If servers are not running, check the **Output** panel:
```
View → Output → Select "MCP" from dropdown
```

## 3. Try Your First Commands

### Web Quality Tools

Open GitHub Copilot Chat and try:

```
Run a lighthouse audit on https://example.com
```

```
Analyze Core Web Vitals for http://localhost:3000
```

```
Check accessibility issues on my website
```

```
How can I optimize images on this page?
```

```
Analyze my JavaScript bundle for optimization opportunities
```

```
Give me prioritized optimization recommendations
```

### React Tools

With a React component open, try:

```
Review this React component for best practices
```

```
What hooks should I use for managing form state?
```

```
Detect anti-patterns in this code
```

```
How can I optimize this component's renders?
```

```
What state management approach should I use for a medium-sized app?
```

```
Suggest a testing strategy for this form component
```

## 4. Use in Chat Modes

The tools are automatically available in the **Frontend Developer** chat mode.

Open chat mode:
```
Cmd+Shift+P → "Chat: Select Chat Mode" → "Frontend Developer"
```

Now all 12 MCP tools are accessible in your conversation.

## 5. Best Practices

### For Web Quality Audits

✅ **Do**:
- Audit publicly accessible URLs
- Use deployed preview URLs for local apps
- Run audits on production and staging
- Follow up on high-impact recommendations first

❌ **Don't**:
- Try to audit `localhost` without port forwarding
- Run too many audits in parallel (they're slow)
- Ignore accessibility failures

### For React Analysis

✅ **Do**:
- Provide full component code for best results
- Ask follow-up questions for clarification
- Use tools iteratively (review → optimize → test)
- Request examples for patterns you're unsure about

❌ **Don't**:
- Expect the tools to execute code
- Provide incomplete code snippets (context matters)
- Ignore anti-pattern warnings

## 6. Troubleshooting

### "MCP server not found" or "Tool not available"

**Fix**:
1. Verify servers are in MCP: List Servers
2. Check Output panel for errors
3. Ensure `disabled: false` in `.vscode/mcp.json`
4. Restart VS Code

### "Lighthouse audit failed"

**Fix**:
1. Ensure URL is publicly accessible
2. Install Lighthouse globally: `npm install -g lighthouse`
3. Check firewall/network settings
4. Try with a simpler URL first (e.g., https://example.com)

### "Server crashed" or "Connection lost"

**Fix**:
1. Check Output panel → MCP logs
2. Look for Node.js errors
3. Verify dependencies installed: `cd scripts/mcp-servers && npm install`
4. Restart MCP servers: `Cmd+Shift+P → "MCP: Restart All Servers"`

## 7. Examples & Recipes

### Recipe: Full Site Quality Check

```
1. Run a lighthouse audit on https://mysite.com
2. Analyze Core Web Vitals and tell me what's failing
3. Check accessibility issues
4. Analyze JavaScript bundle for optimization
5. Prioritize the top 5 optimizations by impact
```

### Recipe: React Component Optimization

```
1. Review this component for best practices
2. Detect any anti-patterns
3. Suggest render optimizations
4. Recommend a testing strategy
```

### Recipe: New Feature Planning

```
I'm building a user dashboard with real-time data.
1. What state management should I use?
2. What hooks are appropriate for this use case?
3. How should I structure the testing?
```

## 8. Advanced Usage

### Use with Prompt Files

Combine MCP tools with prompt files for powerful workflows:

```
@lighthouse-audit - Run comprehensive Lighthouse analysis
```

```
@react-component-review - Full React component review with MCP tools
```

### Create Custom Chat Modes

Create specialized modes with specific tool sets:

```yaml
---
description: "Performance optimization specialist"
tools: ["web-quality"]
---

You are a performance optimization expert...
```

### Chain Multiple Tools

```
1. Run lighthouse audit on my site
2. Based on the results, analyze the bundle
3. Then optimize images
4. Give me an implementation plan
```

## 9. What's Next?

### Try These Challenges

1. **Audit the Demo App**
   ```
   Run a lighthouse audit on the demo app in this project
   Analyze the results and suggest improvements
   ```

2. **React Component Health Check**
   ```
   Review all React components in the src/ folder
   Find the most critical issues
   Prioritize fixes
   ```

3. **Build a Quality Dashboard**
   ```
   Create a script that uses these tools to generate a quality report
   Track metrics over time
   ```

### Learn More

- Read [MCP Server README](README.md) for detailed documentation
- See [Implementation Summary](IMPLEMENTATION-SUMMARY.md) for architecture details
- Check [MCP Setup Guide](../../docs/mcp-setup.md) for advanced configuration
- Review [Project Overview](../../docs/project-overview.md) for context

## 10. Getting Help

### Check These Resources

1. **Server Logs**: Output panel → MCP
2. **Server Status**: `MCP: List Servers` command
3. **Tool List**: Use `lighthouse_audit`, `review_component`, etc. in chat
4. **Documentation**: See README.md and docs/

### Common Questions

**Q: Can I audit localhost?**  
A: Yes, but it needs to be accessible. Use ngrok or deploy to a preview URL.

**Q: How long do audits take?**  
A: Lighthouse audits take 30-60 seconds. Be patient!

**Q: Can I use these in CI/CD?**  
A: Not yet, but that's a future enhancement. For now, use Lighthouse CLI directly.

**Q: Do I need Lighthouse installed?**  
A: No, the server uses `npx -y lighthouse` which downloads on-demand. But installing globally makes it faster.

**Q: Can the React tools modify my code?**  
A: No, they only analyze and suggest. You implement the changes via Copilot Chat.

---

## Ready to Go! 🚀

You now have 12 powerful tools at your fingertips:

**Web Quality** (6 tools):
- lighthouse_audit
- analyze_performance
- check_accessibility
- optimize_images
- analyze_bundle
- suggest_optimizations

**React Best Practices** (6 tools):
- review_component
- suggest_hooks
- detect_anti_patterns
- optimize_renders
- suggest_state_management
- test_strategy

**Start experimenting and building better web experiences!**

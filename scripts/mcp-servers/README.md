# MCP Servers

This directory contains Model Context Protocol (MCP) servers that extend GitHub Copilot's capabilities with specialized tools for web quality optimization and React development.

## Philosophy: Automation Layer for Industry Standards

These MCP servers **automate and integrate** industry-standard best practices rather than competing with them:

### Authoritative Sources

**Web Quality Standards**:
- [**web-quality-skills**](https://github.com/addyosmani/web-quality-skills) by Addy Osmani (Google Chrome Team)
  - 150+ Lighthouse audits covering Performance, Accessibility, SEO, Best Practices
  - Core Web Vitals thresholds: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1
  - _Our servers reference these patterns in tool responses_

**React Best Practices**:
- [**Vercel Agent Skills - React Best Practices**](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)
  - 40+ rules prioritized by impact (Critical → Low)
  - Categories: Waterfalls, Bundle Size, Server Performance, Re-renders, etc.
  - _Our servers cite specific Vercel rules when analyzing components_

### Our Value Add

1. **Automated Execution**: One-click Lighthouse audits, accessibility checks, React analysis
2. **Pattern References**: Tool responses include links to specific rules from authoritative sources
3. **GitHub Copilot Integration**: Seamless workflow within Copilot Chat
4. **Contextual Recommendations**: Surface relevant patterns based on your code

## Servers

### 1. Web Quality Skills Server (`web-quality-server.js`)

Provides tools for web performance, accessibility, and quality optimization.

**Available Tools:**

- `lighthouse_audit` - Run comprehensive Lighthouse audits
- `analyze_performance` - Analyze Core Web Vitals (LCP, TBT/INP, CLS)
- `check_accessibility` - WCAG 2.1 Level AA compliance checks
- `optimize_images` - Image optimization recommendations
- `analyze_bundle` - JavaScript bundle analysis
- `suggest_optimizations` - Prioritized optimization recommendations

**Prerequisites:**
```bash
# Lighthouse CLI must be available
npm install -g lighthouse
# Or use npx (server uses npx by default)
```

**Usage Example:**
```javascript
// In Copilot Chat, you can now request:
// "Run a lighthouse audit on http://localhost:3000"
// "Analyze Core Web Vitals for my site"
// "Check accessibility issues"
```

### 2. React Best Practices Server (`react-best-practices-server.js`)

Provides tools for React component analysis, pattern recommendations, and optimization guidance.

**Available Tools:**

- `review_component` - Analyze component for best practices
- `suggest_hooks` - React hooks guidance for use cases
- `detect_anti_patterns` - Identify React anti-patterns
- `optimize_renders` - Render optimization strategies
- `suggest_state_management` - State management recommendations
- `test_strategy` - Testing approach suggestions

**Usage Example:**
```javascript
// In Copilot Chat:
// "Review this React component for best practices"
// "How should I optimize this component's renders?"
// "What state management should I use for this app?"
```

## Configuration

The servers are configured in `.vscode/mcp.json`:

```jsonc
{
  "mcpServers": {
    "web-quality-skills": {
      "command": "node",
      "args": ["${workspaceFolder}/scripts/mcp-servers/web-quality-server.js"],
      "disabled": false
    },
    "react-best-practices": {
      "command": "node",
      "args": ["${workspaceFolder}/scripts/mcp-servers/react-best-practices-server.js"],
      "disabled": false
    }
  }
}
```

## Tool Sets

Tools are grouped into tool sets defined in `.vscode/settings.json`:

```json
{
  "chat.toolSets": {
    "web-quality": [
      "lighthouse_audit",
      "analyze_performance",
      "check_accessibility",
      "optimize_images",
      "analyze_bundle",
      "suggest_optimizations"
    ],
    "react-dev": [
      "review_component",
      "suggest_hooks",
      "detect_anti_patterns",
      "optimize_renders",
      "suggest_state_management",
      "test_strategy"
    ]
  }
}
```

## Development

### Installing Dependencies

```bash
cd scripts/mcp-servers
npm install
```

### Testing Locally

You can test the servers locally:

```bash
# Test web-quality server
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node web-quality-server.js

# Test react-best-practices server
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node react-best-practices-server.js
```

### Debugging

MCP servers output logs to stderr. Check VS Code's Output panel:
1. Open Output panel (View → Output)
2. Select "MCP" from the dropdown
3. Look for server connection and error messages

### Adding New Tools

To add a new tool to a server:

1. **Define the tool handler function:**
```javascript
async function myNewTool(params) {
  // Implementation
  return { result: 'data' };
}
```

2. **Register in tools/list handler:**
```javascript
{
  name: 'my_new_tool',
  description: 'What this tool does',
  inputSchema: {
    type: 'object',
    properties: {
      param1: { type: 'string', description: '...' }
    },
    required: ['param1']
  }
}
```

3. **Add to tools/call handler:**
```javascript
case 'my_new_tool':
  result = await myNewTool(args.param1);
  break;
```

4. **Update tool set in `.vscode/settings.json`**

## Troubleshooting

### Server Not Starting

- Check MCP server logs in VS Code Output panel
- Verify Node.js is installed and available in PATH
- Ensure dependencies are installed: `cd scripts/mcp-servers && npm install`

### Tool Not Available

- Restart VS Code after configuration changes
- Check `.vscode/mcp.json` has `disabled: false`
- Verify server is listed in MCP: List Servers command

### Lighthouse Audit Fails

- Ensure Lighthouse CLI is installed: `npm install -g lighthouse`
- Check URL is publicly accessible
- Verify firewall/network isn't blocking the audit

### Tool Returns Error

- Check the error message in the JSON response
- Look at stderr output in MCP logs
- Verify all prerequisites are met for that tool

## Architecture

These servers follow the Model Context Protocol specification:

- **Transport**: stdio (stdin/stdout communication)
- **Protocol**: JSON-RPC 2.0
- **Lifecycle**: Started on-demand by VS Code, remains running
- **State**: Stateless - each tool call is independent

## Resources

- [MCP Specification](https://github.com/modelcontextprotocol/specification)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [Lighthouse CLI](https://github.com/GoogleChrome/lighthouse)
- [React Best Practices](https://react.dev/learn)

## License

MIT

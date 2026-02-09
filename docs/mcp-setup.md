# MCP Server Setup Guide

## Overview

Model Context Protocol (MCP) servers extend GitHub Copilot's capabilities by providing specialized tools and resources. This project uses MCP servers to integrate web quality optimization and React best practices directly into your development workflow.

**Current Status**: MCP configuration created, servers not yet integrated (pending MCP server implementations)

---

## Prerequisites

- VS Code with GitHub Copilot installed
- Node.js 18+ installed
- GitHub Copilot Chat extension enabled
- MCP feature enabled in VS Code settings

---

## Enabling MCP in VS Code

1. Open VS Code Settings (Cmd+,)
2. Search for "mcp"
3. Enable these settings:
   - `chat.mcp.access`: Set to "all" (or configure specific servers)
   - `chat.mcp.autostart`: Enable to auto-start MCP servers

---

## MCP Configuration File

The project includes a `.vscode/mcp.json` file that defines available MCP servers:

```json
{
  "mcpServers": {
    "web-quality-skills": {
      "command": "node",
      "args": ["path/to/web-quality-skills/server.js"],
      "disabled": true
    },
    "react-best-practices": {
      "command": "node",
      "args": ["path/to/react-best-practices/server.js"],
      "disabled": true
    }
  }
}
```

**Note**: Both servers are currently `disabled: true` because the MCP server implementations are not yet available in the referenced repositories.

---

## Planned MCP Servers

### 1. Web Quality Skills Server

**Purpose**: Provide tools for web performance and quality optimization

**Planned Tools**:
- `lighthouse-audit` - Run Lighthouse audits on URLs or local builds
- `analyze-performance` - Analyze Core Web Vitals metrics
- `check-accessibility` - Run WCAG compliance checks
- `optimize-images` - Suggest image format and loading optimizations
- `analyze-bundle` - Analyze JavaScript bundle size and composition
- `suggest-optimizations` - Get prioritized optimization recommendations

**Repository**: [web-quality-skills](https://github.com/addyosmani/web-quality-skills)  
**Status**: Documentation-only repository, no MCP server implementation yet

**Setup Steps** (once available):
```bash
# Clone the repository
git clone https://github.com/addyosmani/web-quality-skills.git

# Install dependencies
cd web-quality-skills
npm install

# Update .vscode/mcp.json with correct path
# Set disabled: false
```

### 2. React Best Practices Server

**Purpose**: Provide React-specific development guidance

**Planned Tools**:
- `review-component` - Analyze React component for best practices
- `suggest-hooks` - Recommend appropriate React hooks usage
- `detect-anti-patterns` - Identify common React anti-patterns
- `optimize-renders` - Suggest render optimization strategies
- `suggest-state-management` - Recommend state management approach
- `test-strategy` - Suggest testing approach for components

**Repository**: [react-best-practices](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)  
**Status**: Documentation-only repository, no MCP server implementation yet

**Setup Steps** (once available):
```bash
# Clone the repository
git clone https://github.com/vercel-labs/agent-skills.git

# Navigate to React skills
cd agent-skills/skills/react-best-practices

# Install dependencies
npm install

# Update .vscode/mcp.json with correct path
# Set disabled: false
```

---

## Creating Custom MCP Servers

Until official MCP servers are available, you can create custom MCP servers for this project.

### Option 1: Create a Simple Web Quality MCP Server

Create a Node.js MCP server that wraps existing tools:

```javascript
// scripts/mcp-servers/web-quality-server.js
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const server = new Server(
  {
    name: 'web-quality-skills',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register Lighthouse audit tool
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'lighthouse_audit',
        description: 'Run Lighthouse audit on a URL',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL to audit',
            },
          },
          required: ['url'],
        },
      },
    ],
  };
});

server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'lighthouse_audit') {
    const { url } = request.params.arguments;
    
    try {
      const { stdout } = await execAsync(
        `lighthouse ${url} --output=json --quiet`
      );
      const results = JSON.parse(stdout);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              performance: results.categories.performance.score * 100,
              accessibility: results.categories.accessibility.score * 100,
              bestPractices: results.categories['best-practices'].score * 100,
              seo: results.categories.seo.score * 100,
              metrics: results.audits.metrics.details.items[0],
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Lighthouse audit failed: ${error.message}`);
    }
  }
  
  throw new Error(`Unknown tool: ${request.params.name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

**Setup**:
```bash
# Install MCP SDK
npm install @modelcontextprotocol/sdk

# Update .vscode/mcp.json
{
  "mcpServers": {
    "web-quality-skills": {
      "command": "node",
      "args": ["scripts/mcp-servers/web-quality-server.js"],
      "disabled": false
    }
  }
}
```

### Option 2: Use Existing MCP Servers

Browse the [MCP Servers Registry](https://github.com/modelcontextprotocol/servers) for available servers:

**Useful MCP Servers**:
- `@modelcontextprotocol/server-fetch` - Fetch web content
- `@modelcontextprotocol/server-filesystem` - File operations
- `@modelcontextprotocol/server-github` - GitHub integration
- Custom servers from community

**Install Example**:
```bash
# Install a community MCP server
npx -y @modelcontextprotocol/create-server web-quality

# Add to .vscode/mcp.json
{
  "mcpServers": {
    "web-quality": {
      "command": "npx",
      "args": ["-y", "@your-org/web-quality-mcp"],
      "disabled": false
    }
  }
}
```

---

## Tool Sets Configuration

Tool sets group related tools for easier access in chat modes. Add to `.vscode/settings.json`:

```json
{
  "chat.toolSets": {
    "web-quality": [
      "lighthouse_audit",
      "analyze_performance",
      "check_accessibility",
      "optimize_images",
      "analyze_bundle"
    ],
    "react-dev": [
      "review_component",
      "suggest_hooks",
      "detect_anti_patterns",
      "optimize_renders",
      "suggest_state_management"
    ],
    "readonly": [
      "codebase",
      "search",
      "fetch",
      "problems",
      "usages"
    ]
  }
}
```

Reference tool sets in chat modes:

```yaml
# .github/chatmodes/frontend-developer.chatmode.md
---
tools: ["web-quality", "react-dev", "readonly", "editFiles", "runCommands"]
---
```

---

## Verifying MCP Server Connection

### 1. Check MCP Server Status

Use VS Code Command Palette (Cmd+Shift+P):
- `MCP: List Servers` - View all configured servers
- `MCP: Show Installed Servers` - See running servers
- `MCP: Restart Server` - Restart a specific server

### 2. Test Tool Availability

In GitHub Copilot Chat, ask:
```
@workspace What MCP tools are available?
```

Expected response should list tools from connected MCP servers.

### 3. Invoke a Tool

Try using an MCP tool in chat:
```
@workspace Run a lighthouse audit on https://example.com
```

If the tool is available, Copilot will invoke it and show results.

---

## Troubleshooting

### MCP Server Not Starting

**Symptoms**: Server listed as "disabled" or "error" in MCP status

**Solutions**:
1. Check `disabled` flag in `mcp.json` (should be `false`)
2. Verify command path is correct (use absolute paths)
3. Check Node.js is installed: `node --version`
4. Review VS Code Output panel: "GitHub Copilot Chat" logs
5. Restart VS Code

### Tools Not Appearing in Chat

**Symptoms**: Copilot doesn't recognize MCP tools

**Solutions**:
1. Verify MCP server is running: `MCP: List Servers`
2. Check tool set configuration in settings.json
3. Ensure `chat.mcp.access` is set to "all"
4. Restart GitHub Copilot: `Developer: Reload Window`

### Permission Errors

**Symptoms**: "Permission denied" or "EACCES" errors

**Solutions**:
1. Make server script executable: `chmod +x server.js`
2. Check file paths in `mcp.json` are accessible
3. Verify environment variables are set correctly

### Tool Execution Failures

**Symptoms**: Tool invoked but returns errors

**Solutions**:
1. Check tool prerequisites are installed (e.g., Lighthouse CLI)
2. Verify input parameters match tool schema
3. Review server logs for specific error messages
4. Test tool command manually in terminal

---

## Development Workflow with MCP

### Typical Workflow

1. **Start Development Session**
   ```
   User: "Run a Lighthouse audit on my app"
   Copilot: [Invokes lighthouse_audit tool via MCP]
   Copilot: "Performance: 78/100, LCP: 3.2s. Top issues..."
   ```

2. **Get Optimization Suggestions**
   ```
   User: "What should I optimize first?"
   Copilot: [Analyzes Lighthouse results]
   Copilot: "Focus on optimizing hero image (1.2MB)..."
   ```

3. **Implement Changes**
   ```
   User: "Convert hero image to WebP"
   Copilot: [Edits files and provides implementation]
   ```

4. **Validate Improvements**
   ```
   User: "Re-run Lighthouse audit"
   Copilot: [Invokes lighthouse_audit again]
   Copilot: "Performance: 92/100, LCP: 2.1s ✅"
   ```

---

## Next Steps

1. **Monitor MCP Server Development**
   - Watch [web-quality-skills](https://github.com/addyosmani/web-quality-skills) repository
   - Watch [agent-skills](https://github.com/vercel-labs/agent-skills) repository
   - Check for MCP server implementations

2. **Create Custom MCP Servers** (if needed)
   - Follow MCP SDK documentation
   - Implement priority tools first (Lighthouse, accessibility)
   - Test thoroughly with frontend-developer chat mode

3. **Document Patterns**
   - Add MCP usage patterns to [patterns-discovered.md](../.github/memory/patterns-discovered.md)
   - Document successful workflows in [session-notes.md](../.github/memory/session-notes.md)

4. **Update Configuration**
   - Enable servers in `mcp.json` once available
   - Configure tool sets for optimized workflow
   - Test end-to-end with chat modes

---

## References

- [VS Code MCP Documentation](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)
- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [MCP SDK for TypeScript](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Servers Registry](https://github.com/modelcontextprotocol/servers)
- [Web Quality Skills Repo](https://github.com/addyosmani/web-quality-skills)
- [React Best Practices Repo](https://github.com/vercel-labs/agent-skills)

---

## Status Updates

**2026-02-09**: Initial MCP configuration created. Servers disabled pending MCP implementations.

_Update this section as MCP servers become available and are integrated._

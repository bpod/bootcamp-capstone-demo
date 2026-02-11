#!/usr/bin/env node

/**
 * Test script for MCP servers
 * Verifies that servers respond to JSON-RPC requests
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function testServer(serverPath, serverName) {
  console.log(`\n🧪 Testing ${serverName}...\n`);
  
  return new Promise((resolve) => {
    const server = spawn('node', [serverPath]);
    
    let stdout = '';
    let stderr = '';
    
    server.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    server.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    // Send tools/list request
    const request = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
      params: {}
    }) + '\n';
    
    server.stdin.write(request);
    
    // Wait for response
    setTimeout(() => {
      try {
        // Parse JSON-RPC response
        const lines = stdout.trim().split('\n');
        const response = JSON.parse(lines[lines.length - 1]);
        
        if (response.result && response.result.tools) {
          console.log(`✅ ${serverName} is working!`);
          console.log(`   Found ${response.result.tools.length} tools:`);
          response.result.tools.forEach(tool => {
            console.log(`   - ${tool.name}: ${tool.description.substring(0, 60)}...`);
          });
          resolve(true);
        } else {
          console.error(`❌ ${serverName} returned unexpected response`);
          console.error('Response:', JSON.stringify(response, null, 2));
          resolve(false);
        }
      } catch (error) {
        console.error(`❌ ${serverName} failed to respond`);
        console.error('Error:', error.message);
        if (stdout) console.error('Stdout:', stdout);
        if (stderr) console.error('Stderr:', stderr);
        resolve(false);
      }
      
      server.kill();
    }, 2000);
  });
}

async function main() {
  console.log('🚀 MCP Server Test Suite\n');
  console.log('This will verify that MCP servers are properly configured and can respond to requests.\n');
  
  const webQualityPath = path.join(__dirname, 'web-quality-server.js');
  const reactPath = path.join(__dirname, 'react-best-practices-server.js');
  
  const results = await Promise.all([
    testServer(webQualityPath, 'Web Quality Skills Server'),
    testServer(reactPath, 'React Best Practices Server'),
  ]);
  
  console.log('\n' + '='.repeat(60));
  
  if (results.every(r => r)) {
    console.log('\n✅ All servers are working correctly!');
    console.log('\nNext steps:');
    console.log('1. Restart VS Code to load the MCP servers');
    console.log('2. Open GitHub Copilot Chat');
    console.log('3. Try commands like:');
    console.log('   - "Run a lighthouse audit on https://example.com"');
    console.log('   - "Review this React component for best practices"');
    console.log('\nYou can also check MCP server status:');
    console.log('  Cmd+Shift+P → "MCP: List Servers"');
    process.exit(0);
  } else {
    console.error('\n❌ Some servers failed. Check the output above for details.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});

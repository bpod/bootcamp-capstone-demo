#!/usr/bin/env node

/**
 * compare-lighthouse.js
 * 
 * Compare two Lighthouse JSON reports and generate improvement summary.
 * 
 * Usage:
 *   node compare-lighthouse.js before.json after.json
 *   node compare-lighthouse.js before.json after.json --format table
 *   node compare-lighthouse.js before.json after.json --format json
 * 
 * Output:
 *   - Score changes for Performance, Accessibility, Best Practices, SEO
 *   - Audit improvements and regressions
 *   - Summary statistics
 */

const fs = require('fs');
const path = require('path');

function loadReport(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    process.exit(1);
  }
}

function getScores(report) {
  return {
    performance: report.categories?.performance?.score ?? null,
    accessibility: report.categories?.accessibility?.score ?? null,
    bestPractices: report.categories?.['best-practices']?.score ?? null,
    seo: report.categories?.seo?.score ?? null,
    pwa: report.categories?.pwa?.score ?? null
  };
}

function compareScores(before, after) {
  const changes = {};
  for (const [key, beforeScore] of Object.entries(before)) {
    const afterScore = after[key];
    if (beforeScore !== null && afterScore !== null) {
      changes[key] = {
        before: Math.round(beforeScore * 100),
        after: Math.round(afterScore * 100),
        delta: Math.round((afterScore - beforeScore) * 100),
        improved: afterScore > beforeScore,
        regressed: afterScore < beforeScore
      };
    }
  }
  return changes;
}

function getAuditChanges(beforeReport, afterReport) {
  const beforeAudits = beforeReport.audits || {};
  const afterAudits = afterReport.audits || {};
  
  const improvements = [];
  const regressions = [];
  const noChange = [];
  
  const allAuditIds = new Set([
    ...Object.keys(beforeAudits),
    ...Object.keys(afterAudits)
  ]);
  
  for (const auditId of allAuditIds) {
    const beforeAudit = beforeAudits[auditId];
    const afterAudit = afterAudits[auditId];
    
    if (!beforeAudit || !afterAudit) continue;
    if (beforeAudit.scoreDisplayMode === 'notApplicable') continue;
    
    const beforeScore = beforeAudit.score ?? 0;
    const afterScore = afterAudit.score ?? 0;
    
    if (afterScore > beforeScore) {
      improvements.push({
        id: auditId,
        title: afterAudit.title,
        beforeScore: Math.round(beforeScore * 100),
        afterScore: Math.round(afterScore * 100),
        delta: Math.round((afterScore - beforeScore) * 100)
      });
    } else if (afterScore < beforeScore) {
      regressions.push({
        id: auditId,
        title: afterAudit.title,
        beforeScore: Math.round(beforeScore * 100),
        afterScore: Math.round(afterScore * 100),
        delta: Math.round((afterScore - beforeScore) * 100)
      });
    } else {
      noChange.push({
        id: auditId,
        title: afterAudit.title,
        score: Math.round(afterScore * 100)
      });
    }
  }
  
  return { improvements, regressions, noChange };
}

function formatTable(scoreChanges, auditChanges) {
  console.log('\n=== Lighthouse Comparison Report ===\n');
  
  console.log('## Score Changes\n');
  console.log('| Category       | Before | After | Change | Status |');
  console.log('|----------------|--------|-------|--------|--------|');
  
  for (const [category, data] of Object.entries(scoreChanges)) {
    const status = data.improved ? '✅ Improved' : data.regressed ? '❌ Regressed' : '→ No change';
    const deltaStr = data.delta > 0 ? `+${data.delta}` : data.delta.toString();
    console.log(`| ${category.padEnd(14)} | ${data.before.toString().padStart(6)} | ${data.after.toString().padStart(5)} | ${deltaStr.padStart(6)} | ${status.padEnd(6)} |`);
  }
  
  console.log('\n## Audit Changes\n');
  
  if (auditChanges.improvements.length > 0) {
    console.log('### ✅ Improvements\n');
    console.log('| Audit | Before | After | Change |');
    console.log('|-------|--------|-------|--------|');
    auditChanges.improvements
      .sort((a, b) => b.delta - a.delta)
      .slice(0, 10)
      .forEach(audit => {
        console.log(`| ${audit.title.slice(0, 40).padEnd(40)} | ${audit.beforeScore.toString().padStart(6)} | ${audit.afterScore.toString().padStart(5)} | +${audit.delta} |`);
      });
    if (auditChanges.improvements.length > 10) {
      console.log(`\n*(${auditChanges.improvements.length - 10} more improvements not shown)*`);
    }
  }
  
  if (auditChanges.regressions.length > 0) {
    console.log('\n### ❌ Regressions\n');
    console.log('| Audit | Before | After | Change |');
    console.log('|-------|--------|-------|--------|');
    auditChanges.regressions
      .sort((a, b) => a.delta - b.delta)
      .forEach(audit => {
        console.log(`| ${audit.title.slice(0, 40).padEnd(40)} | ${audit.beforeScore.toString().padStart(6)} | ${audit.afterScore.toString().padStart(5)} | ${audit.delta} |`);
      });
  }
  
  console.log('\n## Summary\n');
  console.log(`- Improved audits: ${auditChanges.improvements.length}`);
  console.log(`- Regressed audits: ${auditChanges.regressions.length}`);
  console.log(`- Unchanged audits: ${auditChanges.noChange.length}`);
  console.log('');
}

function formatJson(scoreChanges, auditChanges) {
  const output = {
    scoreChanges,
    auditChanges: {
      improvements: auditChanges.improvements,
      regressions: auditChanges.regressions,
      summary: {
        improved: auditChanges.improvements.length,
        regressed: auditChanges.regressions.length,
        unchanged: auditChanges.noChange.length
      }
    }
  };
  console.log(JSON.stringify(output, null, 2));
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: node compare-lighthouse.js <before.json> <after.json> [--format table|json]');
    console.error('');
    console.error('Examples:');
    console.error('  node compare-lighthouse.js baseline.json optimized.json');
    console.error('  node compare-lighthouse.js baseline.json optimized.json --format json');
    process.exit(1);
  }
  
  const beforePath = args[0];
  const afterPath = args[1];
  const format = args.includes('--format') 
    ? args[args.indexOf('--format') + 1] 
    : 'table';
  
  if (!fs.existsSync(beforePath)) {
    console.error(`Error: File not found: ${beforePath}`);
    process.exit(1);
  }
  
  if (!fs.existsSync(afterPath)) {
    console.error(`Error: File not found: ${afterPath}`);
    process.exit(1);
  }
  
  const beforeReport = loadReport(beforePath);
  const afterReport = loadReport(afterPath);
  
  const beforeScores = getScores(beforeReport);
  const afterScores = getScores(afterReport);
  const scoreChanges = compareScores(beforeScores, afterScores);
  
  const auditChanges = getAuditChanges(beforeReport, afterReport);
  
  if (format === 'json') {
    formatJson(scoreChanges, auditChanges);
  } else {
    formatTable(scoreChanges, auditChanges);
  }
}

if (require.main === module) {
  main();
}

module.exports = { loadReport, getScores, compareScores, getAuditChanges };

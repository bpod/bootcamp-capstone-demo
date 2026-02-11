#!/usr/bin/env node

/**
 * Web Quality Skills MCP Server
 * 
 * Provides tools for web performance, accessibility, and quality optimization.
 * Wraps Lighthouse CLI, accessibility auditing, and performance analysis tools.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import path from 'path';

const execAsync = promisify(exec);

// Pattern references from web-quality-skills (authoritative source)
const WEB_QUALITY_SKILLS_URL = 'https://github.com/addyosmani/web-quality-skills';
const PATTERN_REFERENCES = {
  lcp: {
    url: `${WEB_QUALITY_SKILLS_URL}#core-web-vitals`,
    threshold: '≤ 2.5s',
    patterns: [
      'Optimize server response times',
      'Eliminate render-blocking resources',
      'Optimize and compress images (WebP/AVIF format)',
      'Implement lazy loading for off-screen images',
      'Use CDN for faster content delivery',
    ],
  },
  inp: {
    url: `${WEB_QUALITY_SKILLS_URL}#core-web-vitals`,
    threshold: '≤ 200ms',
    patterns: [
      'Break up long tasks into smaller chunks',
      'Optimize JavaScript execution',
      'Remove or defer unnecessary JavaScript',
      'Use code splitting and lazy loading',
      'Consider using Web Workers for heavy computation',
    ],
  },
  cls: {
    url: `${WEB_QUALITY_SKILLS_URL}#core-web-vitals`,
    threshold: '≤ 0.1',
    patterns: [
      'Add width and height attributes to images and videos',
      'Reserve space for ads and embeds',
      'Avoid inserting content above existing content',
      'Use transform animations instead of properties that trigger layout',
    ],
  },
  accessibility: {
    url: `${WEB_QUALITY_SKILLS_URL}#accessibility`,
    standard: 'WCAG 2.1 Level AA',
    patterns: [
      'Use semantic HTML elements (nav, main, article, button)',
      'Provide text alternatives for non-text content',
      'Ensure sufficient color contrast (4.5:1 normal, 3:1 large)',
      'Support keyboard navigation for all interactive elements',
      'Provide clear focus indicators',
      'Test with screen readers',
    ],
  },
};

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

/**
 * Tool: lighthouse_audit
 * Run Lighthouse audit on a URL and return comprehensive results
 */
async function lighthouseAudit(url, options = {}) {
  try {
    const preset = options.preset || 'desktop';
    const categories = options.categories || 'performance,accessibility,best-practices,seo';
    
    // Build Lighthouse command
    const command = [
      'npx',
      '-y',
      'lighthouse',
      url,
      '--output=json',
      '--quiet',
      `--preset=${preset}`,
      `--only-categories=${categories}`
    ].join(' ');
    
    const { stdout, stderr } = await execAsync(command, {
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large reports
    });
    
    if (stderr && !stderr.includes('chrome-launcher')) {
      console.error('Lighthouse stderr:', stderr);
    }
    
    const results = JSON.parse(stdout);
    
    // Extract key metrics
    const categories_scores = {};
    for (const [key, category] of Object.entries(results.categories)) {
      categories_scores[key] = Math.round(category.score * 100);
    }
    
    const metrics = results.audits.metrics?.details?.items?.[0] || {};
    const opportunities = [];
    
    // Collect optimization opportunities
    for (const [key, audit] of Object.entries(results.audits)) {
      if (audit.details?.type === 'opportunity' && audit.score !== null && audit.score < 1) {
        opportunities.push({
          id: key,
          title: audit.title,
          description: audit.description,
          score: Math.round(audit.score * 100),
          savings: audit.details.overallSavingsMs || 0,
          displayValue: audit.displayValue,
        });
      }
    }
    
    // Sort opportunities by potential savings
    opportunities.sort((a, b) => b.savings - a.savings);
    
    return {
      url: results.finalUrl,
      fetchTime: results.fetchTime,
      scores: categories_scores,
      metrics: {
        firstContentfulPaint: metrics.firstContentfulPaint,
        largestContentfulPaint: metrics.largestContentfulPaint,
        totalBlockingTime: metrics.totalBlockingTime,
        cumulativeLayoutShift: metrics.cumulativeLayoutShift,
        speedIndex: metrics.speedIndex,
        interactive: metrics.interactive,
      },
      opportunities: opportunities.slice(0, 10), // Top 10 opportunities
      fullReport: results, // Include full report for detailed analysis
    };
  } catch (error) {
    throw new Error(`Lighthouse audit failed: ${error.message}`);
  }
}

/**
 * Tool: analyze_performance
 * Analyze Core Web Vitals and provide optimization recommendations
 */
async function analyzePerformance(url) {
  try {
    // Run Lighthouse with performance focus
    const audit = await lighthouseAudit(url, { categories: 'performance' });
    
    const metrics = audit.metrics;
    const recommendations = [];
    
    // Analyze LCP (target: ≤ 2.5s)
    if (metrics.largestContentfulPaint > 2500) {
      recommendations.push({
        metric: 'LCP',
        current: `${(metrics.largestContentfulPaint / 1000).toFixed(2)}s`,
        target: PATTERN_REFERENCES.lcp.threshold,
        priority: 'high',
        suggestions: PATTERN_REFERENCES.lcp.patterns,
        reference: {
          source: 'web-quality-skills (Google Chrome Team)',
          url: PATTERN_REFERENCES.lcp.url,
        },
      });
    }
    
    // Analyze TBT (proxy for INP, target: ≤ 200ms)
    if (metrics.totalBlockingTime > 200) {
      recommendations.push({
        metric: 'TBT/INP',
        current: `${Math.round(metrics.totalBlockingTime)}ms`,
        target: PATTERN_REFERENCES.inp.threshold,
        priority: 'high',
        suggestions: PATTERN_REFERENCES.inp.patterns,
        reference: {
          source: 'web-quality-skills (Google Chrome Team)',
          url: PATTERN_REFERENCES.inp.url,
        },
      });
    }
    
    // Analyze CLS (target: ≤ 0.1)
    if (metrics.cumulativeLayoutShift > 0.1) {
      recommendations.push({
        metric: 'CLS',
        current: metrics.cumulativeLayoutShift.toFixed(3),
        target: PATTERN_REFERENCES.cls.threshold,
        priority: 'high',
        suggestions: PATTERN_REFERENCES.cls.patterns,
        reference: {
          source: 'web-quality-skills (Google Chrome Team)',
          url: PATTERN_REFERENCES.cls.url,
        },
      });
    }
    
    return {
      url: audit.url,
      score: audit.scores.performance,
      metrics: {
        lcp: `${(metrics.largestContentfulPaint / 1000).toFixed(2)}s`,
        tbt: `${Math.round(metrics.totalBlockingTime)}ms`,
        cls: metrics.cumulativeLayoutShift.toFixed(3),
        fcp: `${(metrics.firstContentfulPaint / 1000).toFixed(2)}s`,
        si: `${(metrics.speedIndex / 1000).toFixed(2)}s`,
      },
      passesThresholds: {
        lcp: metrics.largestContentfulPaint <= 2500,
        tbt: metrics.totalBlockingTime <= 200,
        cls: metrics.cumulativeLayoutShift <= 0.1,
      },
      recommendations,
      opportunities: audit.opportunities.slice(0, 5),
    };
  } catch (error) {
    throw new Error(`Performance analysis failed: ${error.message}`);
  }
}

/**
 * Tool: check_accessibility
 * Run accessibility audit and check WCAG compliance
 */
async function checkAccessibility(url) {
  try {
    const audit = await lighthouseAudit(url, { categories: 'accessibility' });
    
    const accessibilityAudits = Object.entries(audit.fullReport.audits)
      .filter(([key, value]) => value.scoreDisplayMode !== 'notApplicable')
      .filter(([key]) => key.startsWith('accessibility') || 
                         ['aria-', 'button-name', 'color-contrast', 'document-title', 
                          'html-has-lang', 'image-alt', 'label', 'link-name'].some(prefix => key.includes(prefix)))
      .map(([key, value]) => ({
        id: key,
        title: value.title,
        description: value.description,
        score: value.score,
        scoreDisplayMode: value.scoreDisplayMode,
        displayValue: value.displayValue,
      }));
    
    const failures = accessibilityAudits.filter(audit => audit.score !== null && audit.score < 1);
    const passed = accessibilityAudits.filter(audit => audit.score === 1);
    
    return {
      url: audit.url,
      score: audit.scores.accessibility,
      wcagCompliance: audit.scores.accessibility >= 90 ? 'Good' : 
                      audit.scores.accessibility >= 50 ? 'Needs Improvement' : 'Poor',
      summary: {
        total: accessibilityAudits.length,
        passed: passed.length,
        failed: failures.length,
      },
      failures: failures.map(f => ({
        title: f.title,
        description: f.description,
      })),
      recommendations: failures.length > 0 ? 
        PATTERN_REFERENCES.accessibility.patterns : 
        ['Continue monitoring accessibility in development'],
      reference: {
        source: 'web-quality-skills (Google Chrome Team)',
        standard: PATTERN_REFERENCES.accessibility.standard,
        url: PATTERN_REFERENCES.accessibility.url,
      },
    };
  } catch (error) {
    throw new Error(`Accessibility check failed: ${error.message}`);
  }
}

/**
 * Tool: optimize_images
 * Analyze images and provide optimization recommendations
 */
async function optimizeImages(url) {
  try {
    const audit = await lighthouseAudit(url, { categories: 'performance' });
    
    const imageAudits = {
      modernFormats: audit.fullReport.audits['modern-image-formats'],
      properSizing: audit.fullReport.audits['uses-responsive-images'],
      optimizedImages: audit.fullReport.audits['uses-optimized-images'],
      offscreenImages: audit.fullReport.audits['offscreen-images'],
    };
    
    const recommendations = [];
    
    if (imageAudits.modernFormats?.score < 1) {
      recommendations.push({
        type: 'Format Optimization',
        priority: 'high',
        savings: imageAudits.modernFormats.details?.overallSavingsMs || 0,
        suggestion: 'Convert images to WebP or AVIF format for better compression',
        action: 'Use <picture> element with multiple sources or convert all images to WebP',
      });
    }
    
    if (imageAudits.properSizing?.score < 1) {
      recommendations.push({
        type: 'Responsive Sizing',
        priority: 'high',
        savings: imageAudits.properSizing.details?.overallSavingsMs || 0,
        suggestion: 'Serve appropriately-sized images for different screen sizes',
        action: 'Use srcset and sizes attributes or responsive image solutions',
      });
    }
    
    if (imageAudits.optimizedImages?.score < 1) {
      recommendations.push({
        type: 'Compression',
        priority: 'medium',
        savings: imageAudits.optimizedImages.details?.overallSavingsMs || 0,
        suggestion: 'Optimize images with better compression',
        action: 'Use image optimization tools (ImageOptim, Squoosh, Sharp)',
      });
    }
    
    if (imageAudits.offscreenImages?.score < 1) {
      recommendations.push({
        type: 'Lazy Loading',
        priority: 'medium',
        savings: imageAudits.offscreenImages.details?.overallSavingsMs || 0,
        suggestion: 'Defer loading of offscreen images',
        action: 'Add loading="lazy" attribute to images below the fold',
      });
    }
    
    // Sort by potential savings
    recommendations.sort((a, b) => b.savings - a.savings);
    
    return {
      url: audit.url,
      summary: {
        totalIssues: recommendations.length,
        potentialSavings: recommendations.reduce((sum, r) => sum + r.savings, 0),
      },
      recommendations,
      implementationGuide: {
        webp: 'Use <picture> or convert images: <img src="image.webp" alt="..." />',
        responsive: 'Add srcset: <img srcset="small.jpg 300w, large.jpg 1200w" sizes="(max-width: 600px) 300px, 1200px" />',
        lazy: 'Add loading attribute: <img loading="lazy" src="image.jpg" alt="..." />',
      },
    };
  } catch (error) {
    throw new Error(`Image optimization analysis failed: ${error.message}`);
  }
}

/**
 * Tool: analyze_bundle
 * Analyze JavaScript bundle size and suggest optimizations
 */
async function analyzeBundle(url) {
  try {
    const audit = await lighthouseAudit(url, { categories: 'performance' });
    
    const bundleAudits = {
      unusedJavaScript: audit.fullReport.audits['unused-javascript'],
      unminifiedJavaScript: audit.fullReport.audits['unminified-javascript'],
      legacyJavaScript: audit.fullReport.audits['legacy-javascript'],
      bootupTime: audit.fullReport.audits['bootup-time'],
      mainThreadWork: audit.fullReport.audits['mainthread-work-breakdown'],
    };
    
    const issues = [];
    
    if (bundleAudits.unusedJavaScript?.score < 1) {
      const savings = bundleAudits.unusedJavaScript.details?.overallSavingsBytes || 0;
      issues.push({
        type: 'Unused JavaScript',
        severity: 'high',
        savings: `${Math.round(savings / 1024)}KB`,
        description: 'Remove or defer unused JavaScript code',
        actions: [
          'Implement code splitting',
          'Use dynamic imports for route-based chunks',
          'Use tree shaking to eliminate dead code',
          'Analyze bundle with tools like webpack-bundle-analyzer',
        ],
      });
    }
    
    if (bundleAudits.unminifiedJavaScript?.score < 1) {
      const savings = bundleAudits.unminifiedJavaScript.details?.overallSavingsBytes || 0;
      issues.push({
        type: 'Unminified JavaScript',
        severity: 'high',
        savings: `${Math.round(savings / 1024)}KB`,
        description: 'Minify JavaScript files',
        actions: [
          'Enable minification in production builds',
          'Use Terser or esbuild for minification',
          'Enable gzip/brotli compression',
        ],
      });
    }
    
    if (bundleAudits.legacyJavaScript?.score < 1) {
      issues.push({
        type: 'Legacy JavaScript',
        severity: 'medium',
        description: 'Polyfills or legacy syntax detected',
        actions: [
          'Use modern JavaScript syntax (ES2020+)',
          'Remove unnecessary polyfills',
          'Use @babel/preset-env with browserslist',
          'Consider differential serving for modern vs legacy browsers',
        ],
      });
    }
    
    const bootupTime = bundleAudits.bootupTime?.numericValue || 0;
    if (bootupTime > 2000) {
      issues.push({
        type: 'JavaScript Execution Time',
        severity: 'high',
        time: `${(bootupTime / 1000).toFixed(2)}s`,
        description: 'Reduce JavaScript execution time',
        actions: [
          'Defer non-critical JavaScript',
          'Use async/defer attributes on script tags',
          'Optimize heavy computations',
          'Consider Web Workers for CPU-intensive tasks',
        ],
      });
    }
    
    return {
      url: audit.url,
      summary: {
        performanceScore: audit.scores.performance,
        totalIssues: issues.length,
        bootupTime: `${(bootupTime / 1000).toFixed(2)}s`,
      },
      issues,
      recommendations: [
        'Implement code splitting by route or component',
        'Use dynamic imports: import("./module").then(...)',
        'Enable tree shaking in build configuration',
        'Analyze bundle composition with visualization tools',
        'Consider lazy loading for heavy libraries',
      ],
    };
  } catch (error) {
    throw new Error(`Bundle analysis failed: ${error.message}`);
  }
}

/**
 * Tool: suggest_optimizations
 * Get prioritized list of optimization recommendations
 */
async function suggestOptimizations(url) {
  try {
    const audit = await lighthouseAudit(url);
    
    // Collect all opportunities and diagnostics
    const allSuggestions = [];
    
    for (const [key, auditResult] of Object.entries(audit.fullReport.audits)) {
      if (auditResult.score !== null && auditResult.score < 1) {
        const savings = auditResult.details?.overallSavingsMs || 0;
        const impact = savings > 1000 ? 'high' : savings > 500 ? 'medium' : 'low';
        
        allSuggestions.push({
          category: auditResult.scoreDisplayMode === 'binary' ? 'Fix' : 'Opportunity',
          title: auditResult.title,
          description: auditResult.description,
          impact,
          savings: `${(savings / 1000).toFixed(2)}s`,
          score: Math.round(auditResult.score * 100),
        });
      }
    }
    
    // Sort by impact
    const impactOrder = { high: 0, medium: 1, low: 2 };
    allSuggestions.sort((a, b) => {
      const impactDiff = impactOrder[a.impact] - impactOrder[b.impact];
      if (impactDiff !== 0) return impactDiff;
      return parseFloat(b.savings) - parseFloat(a.savings);
    });
    
    return {
      url: audit.url,
      scores: audit.scores,
      overallHealth: 
        Object.values(audit.scores).every(score => score >= 90) ? 'Excellent' :
        Object.values(audit.scores).some(score => score < 50) ? 'Needs Significant Improvement' :
        'Good, but Room for Improvement',
      topPriorities: allSuggestions.slice(0, 10),
      quickWins: allSuggestions.filter(s => s.impact === 'low' && s.category === 'Opportunity').slice(0, 5),
      summary: {
        totalOpportunities: allSuggestions.length,
        highImpact: allSuggestions.filter(s => s.impact === 'high').length,
        mediumImpact: allSuggestions.filter(s => s.impact === 'medium').length,
        lowImpact: allSuggestions.filter(s => s.impact === 'low').length,
      },
    };
  } catch (error) {
    throw new Error(`Optimization suggestions failed: ${error.message}`);
  }
}

// Register request handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'lighthouse_audit',
        description: 'Run comprehensive Lighthouse audit on a URL. Returns performance, accessibility, best practices, and SEO scores with detailed metrics and opportunities.',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL to audit (must be publicly accessible)',
            },
            preset: {
              type: 'string',
              enum: ['desktop', 'mobile'],
              description: 'Audit preset (default: desktop)',
            },
          },
          required: ['url'],
        },
      },
      {
        name: 'analyze_performance',
        description: 'Analyze Core Web Vitals (LCP, TBT/INP, CLS) and get targeted performance optimization recommendations.',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL to analyze for performance',
            },
          },
          required: ['url'],
        },
      },
      {
        name: 'check_accessibility',
        description: 'Run WCAG 2.1 Level AA accessibility audit. Identifies accessibility failures and provides remediation guidance.',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL to check for accessibility issues',
            },
          },
          required: ['url'],
        },
      },
      {
        name: 'optimize_images',
        description: 'Analyze image loading and optimization opportunities. Suggests modern formats, responsive sizing, compression, and lazy loading.',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL to analyze for image optimization',
            },
          },
          required: ['url'],
        },
      },
      {
        name: 'analyze_bundle',
        description: 'Analyze JavaScript bundle size and execution time. Identifies unused code, minification issues, and suggests code splitting strategies.',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL to analyze for JavaScript bundle optimization',
            },
          },
          required: ['url'],
        },
      },
      {
        name: 'suggest_optimizations',
        description: 'Get prioritized list of all optimization opportunities across performance, accessibility, SEO, and best practices.',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL to analyze for optimization opportunities',
            },
          },
          required: ['url'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    let result;
    
    switch (name) {
      case 'lighthouse_audit':
        result = await lighthouseAudit(args.url, args);
        break;
      case 'analyze_performance':
        result = await analyzePerformance(args.url);
        break;
      case 'check_accessibility':
        result = await checkAccessibility(args.url);
        break;
      case 'optimize_images':
        result = await optimizeImages(args.url);
        break;
      case 'analyze_bundle':
        result = await analyzeBundle(args.url);
        break;
      case 'suggest_optimizations':
        result = await suggestOptimizations(args.url);
        break;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: error.message,
            tool: name,
            suggestion: 'Ensure Lighthouse CLI is installed: npm install -g lighthouse',
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);

console.error('Web Quality Skills MCP Server running...');

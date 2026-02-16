---
name: Core Web Vitals Analysis
description: Analyze and optimize Core Web Vitals metrics
agent: performance-tuner
tools: ["web-quality", "readonly"]
---

# Core Web Vitals Analysis

Focus specifically on optimizing the three Core Web Vitals metrics that directly impact user experience and search rankings.

## Core Web Vitals Targets

- **LCP (Largest Contentful Paint)**: ≤ 2.5 seconds
- **INP (Interaction to Next Paint)**: ≤ 200 milliseconds
- **CLS (Cumulative Layout Shift)**: ≤ 0.1

## Analysis Workflow

1. Measure current Core Web Vitals scores
2. Identify which metric(s) need improvement
3. Analyze root causes for poor performance
4. Recommend targeted optimizations
5. Estimate expected improvement
6. Provide validation approach

## LCP Optimization Strategies

**Common Issues:**

- Slow server response times
- Render-blocking resources (CSS/JS)
- Slow resource load times (images, fonts)
- Client-side rendering delays

**Solutions:**

- Optimize server response (TTFB < 600ms)
- Preload critical resources
- Optimize and compress hero images
- Implement CDN and edge caching
- Use responsive images with srcset

## INP Optimization Strategies

**Common Issues:**

- Long JavaScript tasks blocking main thread
- Inefficient event handlers
- Heavy rendering operations
- Unnecessary re-renders in frameworks

**Solutions:**

- Break up long tasks (use `setTimeout` or `requestIdleCallback`)
- Debounce/throttle expensive event handlers
- Use web workers for heavy computation
- Optimize React re-renders with profiling

## CLS Optimization Strategies

**Common Issues:**

- Images without dimensions
- Ads, embeds, or iframes without reserved space
- Dynamically injected content
- Web fonts causing FOIT/FOUT

**Solutions:**

- Always specify width/height for images and video
- Reserve space for dynamic content with min-height
- Use `font-display: swap` for web fonts
- Avoid inserting content above existing content

## Output Format

For each metric issue:

1. **Current Score**: Actual measured value
2. **Target Score**: What we're aiming for
3. **Root Cause**: Why the metric is failing
4. **Recommendation**: Specific fix with code example
5. **Expected Impact**: Projected score improvement
6. **Implementation**: Step-by-step instructions

Prioritize the metric that's furthest from the target threshold.

---
name: Image Optimization
description: Optimize images for performance and Core Web Vitals
agent: performance-tuner
tools: ["web-quality", "readonly"]
---

# Image Optimization

Analyze and optimize image usage to improve LCP, reduce bundle size, and enhance overall page performance.

## Optimization Areas

1. **Format Selection**: WebP, AVIF, or appropriate format
2. **Responsive Images**: srcset and sizes attributes
3. **Lazy Loading**: Native lazy loading for below-the-fold images
4. **Compression**: Appropriate quality levels
5. **Dimensions**: Explicit width/height to prevent CLS
6. **Delivery**: CDN usage and modern image services

## Analysis Workflow

1. Identify all images in the codebase
2. Check current formats and file sizes
3. Analyze loading strategies (eager vs lazy)
4. Review responsive image implementation
5. Measure impact on LCP and bundle size
6. Recommend specific optimizations

## Modern Image Best Practices

**Format Strategy:**

```html
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" width="800" height="600" />
</picture>
```

**Responsive Images:**

```html
<img
  src="image-800w.jpg"
  srcset="image-400w.jpg 400w, image-800w.jpg 800w, image-1200w.jpg 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
  alt="Description"
  width="800"
  height="600"
  loading="lazy"
/>
```

**Above-the-Fold (Hero) Images:**

- Use eager loading (default)
- Preload with `<link rel="preload">`
- Optimize aggressively (affects LCP directly)
- Provide WebP/AVIF with fallbacks

**Below-the-Fold Images:**

- Use `loading="lazy"` attribute
- Can be larger file size (loads on scroll)
- Still optimize, but lower priority

## Image Checklist

- [ ] All images use modern formats (WebP/AVIF with fallbacks)
- [ ] Hero/LCP images are preloaded
- [ ] All images have explicit width and height attributes
- [ ] Below-the-fold images use lazy loading
- [ ] Responsive images use srcset for different viewport sizes
- [ ] Images are served from CDN when possible
- [ ] Decorative images have empty alt text (alt="")
- [ ] Meaningful images have descriptive alt text

## Output Format

For each image issue:

1. **Current Implementation**: What's being done now
2. **Problem**: Impact on performance or accessibility
3. **Recommendation**: Specific optimization with code
4. **File Size Impact**: Expected savings (KB/MB)
5. **LCP Impact**: If image affects LCP metric
6. **Implementation Steps**: How to apply the fix

Prioritize hero/LCP images first, then the largest file sizes.

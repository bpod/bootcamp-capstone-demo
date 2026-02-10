---
description: "Optimize images for web performance - format selection, sizing, lazy loading, CDN delivery"
agent: "frontend-developer"
tools: ["codebase", "search", "problems"]
---

# Image Optimization Workflow

Optimize images to improve performance metrics (LCP, bundle size, bandwidth). This workflow provides comprehensive image optimization strategies with framework-agnostic implementation guidance.

## Image Performance Impact

**Largest Contentful Paint (LCP)**:

- Images are often the LCP element (~77% of pages)
- Target: LCP ≤ 2.5 seconds
- Optimized images can reduce LCP by 30-50%

**Bundle Size & Bandwidth**:

- Images account for ~50% of average page weight
- Proper optimization reduces bandwidth by 50-80%
- Faster load times on slow networks

---

## 1. Audit Current Image Usage

### Gather Image Inventory

**Scan the codebase:**

```bash
# Find all image references
find . -type f \( -name "*.jsx" -o -name "*.tsx" -o -name "*.html" -o -name "*.css" \) \
  -exec grep -l "\.jpg\|\.jpeg\|\.png\|\.gif\|\.webp\|\.avif\|\.svg" {} \;

# List image assets
find ./src ./public -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.gif" -o -name "*.webp" \) \
  -exec ls -lh {} \; | sort -k5 -hr | head -20
```

**Identify problematic images:**

- Large file sizes (>100KB without optimization)
- PNG used for photos (should use WebP/AVIF)
- Missing width/height attributes (causes CLS)
- No lazy loading for below-fold images
- Retina images served to all devices

### Run Lighthouse Audit

```bash
lighthouse https://your-app.com --only-categories=performance --view
```

**Look for these opportunities:**

- "Properly size images"
- "Efficiently encode images"
- "Serve images in modern formats"
- "Defer offscreen images"

---

## 2. Choose Optimal Image Formats

### Format Decision Tree

```
Is it a simple icon or logo with few colors?
  ✅ YES → Use SVG (vector, infinitely scalable)
  ❌ NO → Continue...

Is it a photographic image?
  ✅ YES → Use WebP or AVIF (best compression)
            Fallback: JPEG for older browsers
  ❌ NO → Continue...

Does it need transparency?
  ✅ YES → Use WebP with alpha, fallback to PNG
  ❌ NO → Use WebP or JPEG
```

### Format Comparison

| Format   | Use Case                   | Compression                  | Browser Support | Recommendation       |
| -------- | -------------------------- | ---------------------------- | --------------- | -------------------- |
| **WebP** | Photos, graphics           | 25-35% smaller than JPEG/PNG | 95%+ (modern)   | ✅ Primary choice    |
| **AVIF** | Photos (next-gen)          | 50% smaller than JPEG        | 80%+ (2021+)    | ✅ Use with fallback |
| **JPEG** | Photos (legacy)            | Good lossy compression       | 100%            | Use as fallback      |
| **PNG**  | Graphics with transparency | Lossless, large files        | 100%            | Avoid for photos     |
| **SVG**  | Icons, logos               | Vector (tiny)                | 100%            | ✅ Best for graphics |
| **GIF**  | Animations                 | Poor compression             | 100%            | ⚠️ Use video instead |

---

## 3. Implement Responsive Images

### HTML Picture Element (Framework-Agnostic)

```html
<picture>
  <!-- Modern formats with fallbacks -->
  <source
    srcset="/images/hero.avif 1x, /images/hero@2x.avif 2x"
    type="image/avif"
  />
  <source
    srcset="/images/hero.webp 1x, /images/hero@2x.webp 2x"
    type="image/webp"
  />

  <!-- Fallback JPEG -->
  <img
    src="/images/hero.jpg"
    srcset="/images/hero.jpg 1x, /images/hero@2x.jpg 2x"
    alt="Hero image description"
    width="1200"
    height="600"
    loading="lazy"
  />
</picture>
```

### React Example (Detect Existing Image Component)

**Check for existing image optimization:**

```bash
# Search for image components
grep -r "import.*Image.*from" src/
grep -r "next/image" src/  # Next.js
grep -r "gatsby-image" src/  # Gatsby
```

**If using Next.js Image:**

```jsx
import Image from "next/image";

export function OptimizedImage({ src, alt, priority = false }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={600}
      priority={priority} // For LCP images
      placeholder="blur" // Blur-up effect
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

**If no image component exists, create one:**

```jsx
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  loading = "lazy",
  className = "",
}) {
  // Generate srcset for responsive images
  const srcSet = `
    ${src} 1x,
    ${src.replace(/\.(jpg|png)$/, "@2x.$1")} 2x
  `.trim();

  return (
    <picture>
      <source srcSet={src.replace(/\.(jpg|png)$/, ".webp")} type="image/webp" />
      <img
        src={src}
        srcSet={srcSet}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={className}
      />
    </picture>
  );
}
```

---

## 4. Implement Lazy Loading

### Native Lazy Loading

```html
<!-- For below-fold images -->
<img
  src="/images/product.jpg"
  alt="Product"
  loading="lazy"
  width="300"
  height="200"
/>

<!-- For above-fold images (LCP candidates) -->
<img
  src="/images/hero.jpg"
  alt="Hero"
  loading="eager"
  width="1200"
  height="600"
/>
```

### React Lazy Loading with Intersection Observer

```jsx
import { useEffect, useRef, useState } from "react";

export function LazyImage({ src, alt, width, height, threshold = 0.1 }) {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : undefined}
      alt={alt}
      width={width}
      height={height}
      style={{ backgroundColor: "#f0f0f0" }} // Placeholder color
    />
  );
}
```

---

## 5. Build Tool Integration

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from "vite";
import imagemin from "vite-plugin-imagemin";

export default defineConfig({
  plugins: [
    imagemin({
      gifsicle: { optimizationLevel: 3 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.7, 0.9] },
      svgo: {
        plugins: [
          { name: "removeViewBox", active: false },
          { name: "cleanupIDs", active: false },
        ],
      },
      webp: { quality: 80 },
    }),
  ],
});
```

### Webpack Configuration

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name].[hash][ext]",
        },
        use: [
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: { quality: 80, progressive: true },
              pngquant: { quality: [0.65, 0.9], speed: 4 },
              webp: { quality: 80 },
            },
          },
        ],
      },
    ],
  },
};
```

---

## 6. CDN & Delivery Optimization

### Image CDN Services

**Recommended Services** (plug-in to any project):

- **Cloudflare Images**: Automatic format optimization, resizing
- **Cloudinary**: Comprehensive transformations, AI-powered optimization
- **Imgix**: Real-time image processing
- **ImageKit**: Free tier, automatic WebP/AVIF conversion

**Example Implementation:**

```jsx
// Generic CDN wrapper component
export function CDNImage({ src, alt, width, height, transforms = {} }) {
  const cdnUrl = process.env.REACT_APP_IMAGE_CDN_URL;

  // Build CDN URL with transforms
  const transformedSrc = `${cdnUrl}/${src}?w=${width}&h=${height}&q=80&f=auto`;

  return (
    <img
      src={transformedSrc}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
    />
  );
}
```

### Resource Hints

```html
<!-- Preconnect to image CDN -->
<link rel="preconnect" href="https://cdn.example.com" />
<link rel="dns-prefetch" href="https://cdn.example.com" />

<!-- Preload critical images (LCP candidates) -->
<link rel="preload" as="image" href="/hero.webp" type="image/webp" />
```

---

## 7. Prevent Cumulative Layout Shift (CLS)

### Always Specify Dimensions

```html
<!-- ❌ BAD: No dimensions, causes CLS -->
<img src="/product.jpg" alt="Product" />

<!-- ✅ GOOD: Explicit dimensions -->
<img src="/product.jpg" alt="Product" width="400" height="300" />
```

### CSS Aspect Ratio Boxes

```css
/* Maintain aspect ratio during load */
.image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9; /* Modern approach */
}

.image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### React Aspect Ratio Component

```jsx
export function AspectRatioImage({
  src,
  alt,
  aspectRatio = "16/9",
  className = "",
}) {
  return (
    <div className={className} style={{ aspectRatio }}>
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        loading="lazy"
      />
    </div>
  );
}
```

---

## 8. Validation & Measurement

### Check Image Optimization Impact

```bash
# Re-run Lighthouse
lighthouse https://your-app.com --only-categories=performance --view

# Compare before/after
# Look for improvements in:
# - LCP: Should decrease (especially if images were LCP element)
# - Total page size: Should decrease 30-60%
# - "Properly size images" score
# - "Modern image formats" score
```

### Monitor Real User Metrics

```javascript
// Track image load performance
const imgObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.initiatorType === "img") {
      console.log(`Image loaded: ${entry.name} in ${entry.duration}ms`);

      // Send to analytics
      gtag("event", "image_load", {
        image_url: entry.name,
        load_time: entry.duration,
      });
    }
  }
});

imgObserver.observe({ type: "resource", buffered: true });
```

---

## Success Criteria

✅ **Format Optimization**:

- Modern formats (WebP/AVIF) used for all photos
- SVG used for icons and logos
- Fallbacks provided for older browsers

✅ **Responsive Images**:

- `<picture>` or `srcset` used for multiple resolutions
- Appropriate image sizes for different devices
- No oversized images served to mobile

✅ **Lazy Loading**:

- Above-fold images use `loading="eager"` or are preloaded
- Below-fold images use `loading="lazy"`
- Intersection Observer used for advanced cases

✅ **Layout Stability**:

- All images have explicit `width` and `height` attributes
- CLS score ≤ 0.1
- No content jumps during image load

✅ **Performance Metrics**:

- LCP improved by 20-50% (if images were LCP element)
- Total page size reduced by 30-60%
- Lighthouse image audits show 90+ scores

---

## Common Pitfalls to Avoid

❌ **Serving retina images to all users**: Use `srcset` with `1x` and `2x` variants  
❌ **Using PNG for photographs**: Switch to WebP/JPEG for better compression  
❌ **No lazy loading**: Implement for below-fold images  
❌ **Missing width/height**: Always specify to prevent CLS  
❌ **Not using CDN**: Consider image CDN for automatic optimization  
❌ **Forgetting alt text**: Required for accessibility  
❌ **Loading="lazy" on LCP image**: Use `eager` for above-fold critical images

---

## Related Prompts

- [performance-optimization.prompt.md](performance-optimization.prompt.md) - Overall performance improvement
- [core-web-vitals.prompt.md](core-web-vitals.prompt.md) - Focus on LCP/CLS metrics
- [lighthouse-audit.prompt.md](lighthouse-audit.prompt.md) - Comprehensive audit workflow
- [accessibility-review.prompt.md](accessibility-review.prompt.md) - Check image alt text compliance

---

## Resources

- [web.dev: Image Optimization](https://web.dev/fast/#optimize-your-images)
- [MDN: Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Next.js Image Component](https://nextjs.org/docs/api-reference/next/image) (if using Next.js)
- [Cloudinary Image Optimization](https://cloudinary.com/documentation/image_optimization)

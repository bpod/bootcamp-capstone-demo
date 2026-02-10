---
description: Configuration file patterns, environment variables, build tool settings, and security best practices
applyTo: "**/*.config.js,**/*.config.ts,**/.*.rc,**/vite.config.*,**/webpack.config.*,**/next.config.*,**/.eslintrc.*,**/.prettierrc.*,**/tsconfig.json,**/.env*"
---

# Configuration Files Instructions

These guidelines apply when editing configuration files. Follow these patterns for secure, maintainable, and framework-agnostic configurations.

## Build Tool Configurations

### Vite Configuration

**File**: `vite.config.js` / `vite.config.ts`

```typescript
// ✅ Well-structured Vite configuration
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },

  build: {
    // Source maps for production debugging
    sourcemap: true,

    // Chunk size warnings (performance budget)
    chunkSizeWarningLimit: 1000, // KB

    rollupOptions: {
      output: {
        // Manual chunking for better caching
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          utils: ["date-fns", "lodash-es"],
        },
      },
    },
  },

  server: {
    port: 3000,
    // Proxy API requests to backend
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  // Environment variable prefix (expose only VITE_ prefixed vars)
  envPrefix: "VITE_",
});
```

### Webpack Configuration

**File**: `webpack.config.js`

```javascript
// ✅ Production-ready Webpack configuration
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  return {
    entry: "./src/index.tsx",

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isDevelopment ? "[name].js" : "[name].[contenthash].js",
      clean: true, // Clean dist folder before build
    },

    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@components": path.resolve(__dirname, "src/components"),
      },
    },

    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
          ],
        },
      ],
    },

    optimization: {
      minimize: !isDevelopment,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: !isDevelopment,
            },
          },
        }),
      ],
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: 10,
          },
        },
      },
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
      }),
    ],

    devServer: {
      port: 3000,
      hot: true,
      historyApiFallback: true,
    },
  };
};
```

### Next.js Configuration

**File**: `next.config.js` / `next.config.mjs`

```javascript
// ✅ Next.js configuration with performance optimizations
/** @type {import('next').NextConfig} */
const nextConfig = {
  // React strict mode for development warnings
  reactStrictMode: true,

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ["cdn.example.com", "assets.example.com"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },

  // Internationalization
  i18n: {
    locales: ["en", "es", "fr"],
    defaultLocale: "en",
  },

  // Bundle analyzer (enable with ANALYZE=true)
  ...(process.env.ANALYZE === "true" && {
    webpack: (config) => {
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          reportFilename: "./analyze.html",
          openAnalyzer: false,
        }),
      );
      return config;
    },
  }),

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## Linting and Formatting

### ESLint Configuration

**File**: `.eslintrc.js` / `.eslintrc.json` / `eslint.config.js`

```javascript
// ✅ ESLint configuration with TypeScript and React support
module.exports = {
  root: true,

  env: {
    browser: true,
    es2021: true,
    node: true,
  },

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended", // Accessibility linting
    "prettier", // Disable conflicting rules
  ],

  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json",
  },

  plugins: ["react", "react-hooks", "@typescript-eslint", "jsx-a11y"],

  rules: {
    // TypeScript
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",

    // React
    "react/react-in-jsx-scope": "off", // Not needed in React 17+
    "react/prop-types": "off", // Using TypeScript instead
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // Accessibility
    "jsx-a11y/anchor-is-valid": "warn",

    // General
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "prefer-const": "error",
    "no-var": "error",
  },

  settings: {
    react: {
      version: "detect",
    },
  },
};
```

### Prettier Configuration

**File**: `.prettierrc` / `.prettierrc.js` / `.prettierrc.json`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "jsxSingleQuote": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**File**: `.prettierignore`

```
# Build outputs
dist
build
.next
out
coverage

# Dependencies
node_modules
.pnpm-store

# Generated files
*.min.js
*.min.css

# Environment files
.env*

# Lock files
package-lock.json
yarn.lock
pnpm-lock.yaml
```

---

## TypeScript Configuration

### TypeScript Config

**File**: `tsconfig.json`

```json
{
  "compilerOptions": {
    // Type Checking
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,

    // Module Resolution
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,

    // Language and Environment
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",

    // Emit
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "removeComments": true,
    "noEmit": true,

    // Interop Constraints
    "isolatedModules": true,
    "allowJs": false,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,

    // Path Mapping
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@types/*": ["./src/types/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "build", "**/*.spec.ts", "**/*.test.ts"]
}
```

---

## Environment Variables

### Environment Variable Conventions

**Security Rules:**

- ✅ **NEVER commit `.env` files with secrets to git**
- ✅ **Use `.env.example` for documentation**
- ✅ **Prefix public variables** (e.g., `VITE_`, `NEXT_PUBLIC_`, `REACT_APP_`)
- ✅ **Validate required variables at startup**
- ❌ **NEVER expose server secrets to client**

### Environment Files

```bash
# .env.example (commit this)
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=5000

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=false

# Server-side only (not prefixed, not exposed)
DATABASE_URL=postgresql://localhost:5432/mydb
JWT_SECRET=your-secret-key-here
API_KEY=your-api-key-here
```

```bash
# .env.development
VITE_API_URL=http://localhost:8000
VITE_ENABLE_DEBUG=true
```

```bash
# .env.production
VITE_API_URL=https://api.production.com
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

### Environment Variable Validation

```typescript
// ✅ Validate environment variables at startup
// src/config/env.ts
interface EnvConfig {
  apiUrl: string;
  apiTimeout: number;
  enableAnalytics: boolean;
  enableDebug: boolean;
}

function validateEnv(): EnvConfig {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    throw new Error("VITE_API_URL is required");
  }

  const apiTimeout = Number(import.meta.env.VITE_API_TIMEOUT) || 5000;
  if (apiTimeout < 0) {
    throw new Error("VITE_API_TIMEOUT must be positive");
  }

  return {
    apiUrl,
    apiTimeout,
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
    enableDebug: import.meta.env.VITE_ENABLE_DEBUG === "true",
  };
}

export const env = validateEnv();
```

### Build Tool Environment Variable Support

```typescript
// Vite: import.meta.env.VITE_*
const apiUrl = import.meta.env.VITE_API_URL;

// Next.js: process.env.NEXT_PUBLIC_*
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Create React App: process.env.REACT_APP_*
const apiUrl = process.env.REACT_APP_API_URL;

// Webpack: process.env.* (with DefinePlugin)
const apiUrl = process.env.API_URL;
```

---

## Configuration Best Practices

### Cross-Environment Configuration

```typescript
// ✅ Use environment-specific configs
// config/config.ts
interface Config {
  apiUrl: string;
  apiTimeout: number;
  logLevel: "debug" | "info" | "warn" | "error";
  enableAnalytics: boolean;
}

const configs: Record<string, Config> = {
  development: {
    apiUrl: "http://localhost:8000",
    apiTimeout: 10000,
    logLevel: "debug",
    enableAnalytics: false,
  },
  staging: {
    apiUrl: "https://api.staging.example.com",
    apiTimeout: 5000,
    logLevel: "info",
    enableAnalytics: true,
  },
  production: {
    apiUrl: "https://api.example.com",
    apiTimeout: 5000,
    logLevel: "warn",
    enableAnalytics: true,
  },
};

const environment = import.meta.env.MODE || "development";
export const config = configs[environment];
```

### Performance Budgets

```javascript
// ✅ Enforce performance budgets in build config
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
        },
      },
    },
    // Fail build if bundle too large
    chunkSizeWarningLimit: 500, // KB
  },
});

// webpack.config.js
module.exports = {
  performance: {
    maxEntrypointSize: 512000, // 500 KB
    maxAssetSize: 512000,
    hints: "error", // Fail build on budget violation
  },
};
```

### Security Headers

```javascript
// ✅ Configure security headers
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
```

---

## Git Configuration

### .gitignore Best Practices

```gitignore
# Dependencies
node_modules/
.pnp/
.pnp.js

# Build outputs
dist/
build/
out/
.next/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/

# Temporary
.cache/
.temp/
*.tmp
```

---

## Common Configuration Patterns

### Path Aliases

```json
// ✅ Configure path aliases consistently across tools
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"]
    }
  }
}
```

```javascript
// vite.config.ts
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
});
```

### Source Maps

```javascript
// ✅ Configure source maps for debugging

// Development: detailed source maps
// vite.config.ts (development)
export default defineConfig({
  build: {
    sourcemap: true, // Generate source maps
  },
});

// Production: hidden source maps (for error tracking, not public)
// vite.config.ts (production)
export default defineConfig({
  build: {
    sourcemap: 'hidden', // Source maps not referenced in code
  },
});
```

---

## Anti-Patterns

### ❌ Avoid These Common Mistakes

```javascript
// ❌ Hardcoded secrets in config
export default defineConfig({
  define: {
    API_KEY: 'sk-1234567890abcdef', // NEVER DO THIS!
  },
});

// ✅ Use environment variables
export default defineConfig({
  define: {
    API_KEY: JSON.stringify(process.env.API_KEY),
  },
});
```

```javascript
// ❌ Exposing server secrets to client
// .env
JWT_SECRET = my - secret; // This should NOT be prefixed with VITE_

// ❌ BAD: Exposes to client
VITE_JWT_SECRET = my - secret;

// ✅ GOOD: Server-side only (no prefix)
JWT_SECRET = my - secret;
```

```javascript
// ❌ No environment-specific configuration
const config = {
  apiUrl: "http://localhost:8000", // Hardcoded!
};

// ✅ Environment-specific configuration
const config = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
};
```

```json
// ❌ Overly permissive TypeScript config
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": false,
    "skipLibCheck": true
  }
}

// ✅ Strict TypeScript config
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "skipLibCheck": true // OK for performance
  }
}
```

---

## Framework Detection

When providing build configuration advice, **detect the user's existing build tool** by checking:

1. `package.json` dependencies (`vite`, `webpack`, `@vercel/next`, `parcel`)
2. Existing config files (`vite.config.*`, `webpack.config.*`, `next.config.*`)
3. Build scripts in `package.json` (`vite build`, `webpack`, `next build`)

**Adapt recommendations to their stack:**

- Has Vite? → Reference `vite.config.ts` and Vite plugins
- Has Webpack? → Reference `webpack.config.js` and webpack loaders
- Has Next.js? → Reference `next.config.js` and Next.js features
- Has Parcel? → Reference `.parcelrc` and Parcel conventions

**Never prescribe a specific build tool.** Work with what they have.

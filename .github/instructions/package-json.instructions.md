---
description: Dependency management, semantic versioning, script conventions, and security best practices for package.json
applyTo: "**/package.json"
---

# Package.json Instructions

These guidelines apply when editing package.json files. Follow these patterns for secure, maintainable dependency management.

## Dependency Management

### Semantic Versioning

**Version Format**: `MAJOR.MINOR.PATCH` (e.g., `1.4.2`)

- **MAJOR**: Breaking changes (incompatible API changes)
- **MINOR**: New features (backwards-compatible)
- **PATCH**: Bug fixes (backwards-compatible)

### Version Range Specifiers

```json
{
  "dependencies": {
    // ✅ Caret (recommended for libraries)
    // Allows minor and patch updates
    "react": "^18.2.0", // 18.2.0 ≤ version < 19.0.0

    // ✅ Tilde (conservative)
    // Allows only patch updates
    "express": "~4.18.2", // 4.18.2 ≤ version < 4.19.0

    // ✅ Exact version (for critical dependencies)
    "typescript": "5.3.3", // Exactly 5.3.3

    // ⚠️ Wildcard (too permissive, avoid)
    "lodash": "*", // Any version (dangerous!)

    // ⚠️ Greater than (too permissive, avoid)
    "axios": ">=1.0.0" // Any version 1.0.0 or higher
  }
}
```

**Recommended Strategy:**

```json
{
  "dependencies": {
    // Use caret for most dependencies
    "react": "^18.2.0",
    "react-dom": "^18.2.0",

    // Use exact versions for build tools and TypeScript
    "typescript": "5.3.3",
    "vite": "5.0.8"
  },
  "devDependencies": {
    // Dev dependencies can be more flexible
    "vitest": "^1.2.0",
    "@testing-library/react": "^14.1.2"
  }
}
```

---

## Dependency Categories

### dependencies vs devDependencies vs peerDependencies

```json
{
  "dependencies": {
    // ✅ Runtime dependencies (needed in production)
    "react": "^18.2.0",
    "axios": "^1.6.2",
    "date-fns": "^2.30.0"
  },

  "devDependencies": {
    // ✅ Development-only dependencies
    "vite": "^5.0.8",
    "vitest": "^1.2.0",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@types/react": "^18.2.48"
  },

  "peerDependencies": {
    // ✅ For libraries: dependencies the consumer should provide
    "react": "^17.0.0 || ^18.0.0",
    "react-dom": "^17.0.0 || ^18.0.0"
  },

  "optionalDependencies": {
    // ⚠️ Rarely used: dependencies that enhance but aren't required
    "fsevents": "^2.3.3"
  }
}
```

**When to Use Each:**

- **dependencies**: Required at runtime (production)
- **devDependencies**: Development, testing, build tools
- **peerDependencies**: (Libraries only) Let consumer provide the dependency
- **optionalDependencies**: Enhancement features, fails gracefully if missing

---

## Script Conventions

### Standard Script Names

```json
{
  "scripts": {
    // ✅ Standard lifecycle scripts
    "dev": "vite", // Local development
    "build": "vite build", // Production build
    "preview": "vite preview", // Preview production build
    "test": "vitest", // Run tests
    "test:watch": "vitest --watch", // Watch mode
    "test:coverage": "vitest --coverage", // With coverage
    "lint": "eslint src/", // Lint code
    "lint:fix": "eslint src/ --fix", // Auto-fix linting
    "format": "prettier --write src/", // Format code
    "format:check": "prettier --check src/", // Check formatting
    "type-check": "tsc --noEmit", // TypeScript type checking

    // ✅ Specialized scripts (prefix with category)
    "build:analyze": "vite-bundle-visualizer",
    "test:e2e": "playwright test",
    "test:unit": "vitest run",
    "deploy:staging": "...",
    "deploy:production": "...",

    // ✅ Compound scripts
    "validate": "npm run lint && npm run type-check && npm run test",
    "prepare": "husky install" // Runs after npm install
  }
}
```

**Script Naming Conventions:**

- Use lowercase with hyphens or colons
- Group related scripts with colons: `test:unit`, `test:e2e`
- Use descriptive names: `build:analyze` not `analyze`
- Avoid overly generic names: `start` should always start dev server

---

## Security Best Practices

### Version Pinning for Security

```json
{
  "dependencies": {
    // ✅ Pin exact versions for critical security dependencies
    "jsonwebtoken": "9.0.2",
    "helmet": "7.1.0",

    // ✅ Use caret for other dependencies (allows patches)
    "express": "^4.18.2"
  }
}
```

### Checking for Vulnerabilities

**Add audit script:**

```json
{
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix",
    "audit:production": "npm audit --omit=dev"
  }
}
```

**Regular Security Checks:**

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Check only production dependencies
npm audit --omit=dev
```

### Dependency Updates

```json
{
  "scripts": {
    // Check for outdated dependencies
    "outdated": "npm outdated",

    // Update dependencies interactively (requires npm-check-updates)
    "update:deps": "ncu -i"
  }
}
```

---

## Package Configuration

### Essential Fields

```json
{
  "name": "my-app", // Required: package name
  "version": "1.0.0", // Required: semantic version
  "description": "A React application", // Recommended
  "type": "module", // Use ESM (recommended)
  "private": true, // Apps should be private

  "author": "Your Name <email>",
  "license": "MIT",

  "keywords": ["react", "vite"], // For npm search

  "homepage": "https://example.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/user/repo"
  },
  "bugs": {
    "url": "https://github.com/user/repo/issues"
  }
}
```

### Module System

```json
{
  // ✅ Use ES modules (modern)
  "type": "module",

  // If you need CommonJS
  "type": "commonjs"
}
```

**Note**: With `"type": "module"`:

- `.js` files are ESM
- Use `.cjs` extension for CommonJS files

### Entry Points

```json
{
  // For applications
  "main": "./src/main.js",

  // For libraries (multiple entry points)
  "main": "./dist/index.js", // CommonJS
  "module": "./dist/index.mjs", // ESM
  "types": "./dist/index.d.ts", // TypeScript definitions

  // Modern: exports field (recommended for libraries)
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./utils": {
      "import": "./dist/utils.mjs",
      "require": "./dist/utils.js"
    }
  }
}
```

---

## Engine Compatibility

### Specify Node and npm Versions

```json
{
  "engines": {
    "node": ">=18.0.0", // Minimum Node.js version
    "npm": ">=9.0.0" // Minimum npm version
  },

  // Enforce engine requirements
  "engineStrict": true
}
```

**Why Specify Engines?**

- Prevents issues from incompatible Node.js versions
- Documents project requirements
- CI/CD can validate environment

---

## Browser Compatibility

### Browserslist Configuration

```json
{
  "browserslist": [
    "> 0.5%", // Browsers with >0.5% market share
    "last 2 versions", // Last 2 versions of each browser
    "not dead", // Exclude browsers without official support
    "not IE 11" // Explicitly exclude IE11
  ]
}
```

**Common Configurations:**

```json
{
  "browserslist": {
    // Different targets for different builds
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

---

## Workspaces (Monorepo)

### npm Workspaces

```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": ["packages/*", "apps/*"],

  "scripts": {
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "lint": "npm run lint --workspaces"
  }
}
```

**Workspace Commands:**

```bash
# Install all workspace dependencies
npm install

# Run script in specific workspace
npm run build --workspace=packages/ui

# Run script in all workspaces
npm run test --workspaces

# Add dependency to specific workspace
npm install react --workspace=packages/ui
```

---

## Scripts Best Practices

### Pre and Post Scripts

```json
{
  "scripts": {
    "build": "vite build",
    "prebuild": "npm run lint && npm run type-check", // Runs before build
    "postbuild": "npm run build:analyze", // Runs after build

    "test": "vitest run",
    "pretest": "npm run lint", // Validate before testing

    "prepare": "husky install" // Runs after npm install
  }
}
```

**Lifecycle Hooks:**

- `pre<script>`: Runs before the script
- `post<script>`: Runs after the script
- `prepare`: Runs after `npm install`
- `prepublishOnly`: Runs before publishing to npm (libraries)

### Cross-platform Scripts

```json
{
  "scripts": {
    // ❌ Unix-only (fails on Windows)
    "clean": "rm -rf dist",

    // ✅ Cross-platform (works everywhere)
    "clean": "rimraf dist",

    // ❌ Environment variables (Unix-only)
    "build": "NODE_ENV=production vite build",

    // ✅ Cross-platform environment variables
    "build": "cross-env NODE_ENV=production vite build"
  },
  "devDependencies": {
    "rimraf": "^5.0.5",
    "cross-env": "^7.0.3"
  }
}
```

---

## Package Size and Bundle Analysis

### Package Metadata

```json
{
  "files": ["dist", "README.md", "LICENSE"],

  // Files to exclude (use .npmignore file instead)
  ".npmignore": "..."
}
```

**What to Include:**

- Compiled distribution files (`dist/`)
- Documentation (`README.md`, `LICENSE`)
- Type definitions (`*.d.ts`)

**What to Exclude:**

- Source code (unless needed)
- Tests (`*.test.js`, `__tests__/`)
- Config files (`.eslintrc`, `tsconfig.json`)
- Development scripts

### Size Tracking

```json
{
  "scripts": {
    "size": "size-limit",
    "size:why": "size-limit --why"
  },
  "size-limit": [
    {
      "path": "dist/index.js",
      "limit": "50 KB"
    }
  ],
  "devDependencies": {
    "size-limit": "^11.0.1",
    "@size-limit/preset-small-lib": "^11.0.1"
  }
}
```

---

## Common Pitfalls

### ❌ Don't Commit node_modules

```json
// Ensure .gitignore contains:
```

**.gitignore:**

```
node_modules/
dist/
.env
.env.local
```

### ❌ Don't Use Latest/Next Tags

```json
{
  "dependencies": {
    // ❌ Unpredictable versions
    "react": "latest",
    "next": "next",

    // ✅ Explicit versions
    "react": "^18.2.0",
    "next": "^14.0.4"
  }
}
```

### ❌ Don't Mix Dependency Ranges Inconsistently

```json
{
  // ❌ Inconsistent versioning
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "18.2.0" // Should also use caret
  },

  // ✅ Consistent versioning
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

---

## CI/CD Integration

### GitHub Actions

```json
{
  "scripts": {
    "ci": "npm run lint && npm run type-check && npm run test && npm run build",
    "ci:test": "npm run test -- --run --coverage",
    "ci:build": "npm run build -- --mode production"
  }
}
```

### Lock Files

**Always commit lock files:**

```bash
# npm: commit package-lock.json
# yarn: commit yarn.lock
# pnpm: commit pnpm-lock.yaml
```

**Why?**

- Ensures deterministic installs in CI/CD
- Prevents "works on my machine" issues
- Required for accurate security audits

---

## Example Complete package.json

```json
{
  "name": "my-react-app",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "Modern React application with Vite and TypeScript",

  "author": "Your Name <email@example.com>",
  "license": "MIT",

  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },

  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",

    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",

    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write src/",
    "format:check": "prettier --check src/",
    "type-check": "tsc --noEmit",

    "validate": "npm run lint && npm run type-check && npm run test",
    "ci": "npm run validate && npm run build",

    "prepare": "husky install"
  },

  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.1"
  },

  "devDependencies": {
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.56.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "husky": "^8.0.3",
    "prettier": "^3.2.4",
    "typescript": "5.3.3",
    "vite": "^5.0.8",
    "vitest": "^1.2.0"
  },

  "browserslist": ["> 0.5%", "last 2 versions", "not dead", "not IE 11"]
}
```

---

## Quick Reference

**Version Ranges:**

- `^1.2.3` - Allow minor and patch updates
- `~1.2.3` - Allow only patch updates
- `1.2.3` - Exact version
- `*` - Any version (avoid)

**Dependency Types:**

- `dependencies` - Runtime (production)
- `devDependencies` - Development only
- `peerDependencies` - Let consumer provide (libraries)
- `optionalDependencies` - Nice-to-have enhancements

**Script Conventions:**

- `dev` - Start development server
- `build` - Production build
- `test` - Run tests
- `lint` - Check code quality
- `format` - Format code
- Use colons for grouping: `test:unit`, `test:e2e`

**Security:**

- Run `npm audit` regularly
- Pin critical security dependencies
- Keep dependencies updated
- Commit lock files

**Best Practices:**

- Specify engine versions
- Use semantic versioning
- Keep dependency ranges consistent
- Document scripts with comments
- Use cross-platform commands

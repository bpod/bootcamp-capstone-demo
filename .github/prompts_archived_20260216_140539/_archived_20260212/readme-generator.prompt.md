---
description: Generate comprehensive project README with setup instructions, architecture overview, usage examples, and deployment guides
agent: frontend-developer
tools: ["readonly"]
---

Generate comprehensive README.md for ${workspaceFolder}.

**Your Task**: Analyze project (detect stack, dependencies, build tools, scripts), generate complete README with setup instructions, usage commands, project structure, adapted to detected technologies.

**README Sections**:

1. **Title & Description**: Project name, one-line summary, status badges (build, coverage, npm version)
2. **Features**: Bullet list of key capabilities
3. **Prerequisites**: Required tools (Node version, package manager, system dependencies)
4. **Installation**: Clone repo, install deps, configure .env
5. **Usage**: Dev server command, build command, test command (use actual scripts from package.json)
6. **Project Structure**: Directory tree with brief explanation of each folder's purpose
7. **Configuration**: Environment variables table, config files explanation
8. **Scripts**: Explain all package.json scripts
9. **Contributing**: How to contribute, code style, PR process
10. **License**: License type

**Stack Detection**: Inspect package.json, detect:

- Package manager (npm/yarn/pnpm) from lock files
- Framework (React/Vue/Next.js/Vite)
- Build tool and commands
- Testing framework
- Linting setup

**Adapt Commands**: Use real script names. If package.json has `"dev": "vite"`, say `npm run dev` not generic examples. Check actual port from configs.

**Example Structure Section**:

```
src/
├── components/  # Reusable UI components
├── pages/       # Route components
├── hooks/       # Custom React hooks
└── utils/       # Helper functions
```

**Success Criteria**: README complete and accurate, commands work as documented, new developers can set up project from README alone.

**Detection Commands:**

```bash
# Check package.json for metadata
cat package.json | jq '.name, .version, .description, .scripts'

# Detect framework
ls -1 | grep -E "(next.config|vite.config|webpack.config)"

# Check for TypeScript
[ -f "tsconfig.json" ] && echo "TypeScript detected"

# Detect test framework
cat package.json | jq '.devDependencies | keys[]' | grep -E "(vitest|jest|mocha)"

# Check deployment config
ls -1 | grep -E "(vercel.json|netlify.toml|Dockerfile)"
```

---

### Step 2: Create Project Header

**Title and Badges:**

```markdown
# Project Name

[![CI/CD](https://github.com/username/repo/workflows/CI/badge.svg)](https://github.com/username/repo/actions)
[![codecov](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/username/repo)
[![npm version](https://badge.fury.io/js/package-name.svg)](https://www.npmjs.com/package/package-name)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> One-line description of what this project does.

[Live Demo](https://demo.example.com) · [Documentation](https://docs.example.com) · [Report Bug](https://github.com/username/repo/issues) · [Request Feature](https://github.com/username/repo/issues)

---

## Overview

[2-3 sentence description of the project, its purpose, and key benefits]

This project is a [type of project] built with [key technologies] that [solves what problem]. It provides [key features] and is designed for [target audience].

**Key Features:**

- ✨ Feature 1 - Brief description
- 🚀 Feature 2 - Brief description
- 🎯 Feature 3 - Brief description
- 🔒 Feature 4 - Brief description

**Demo**

![Project Screenshot](./docs/images/screenshot.png)

_[Caption describing what the screenshot shows]_
```

**Badge Selection:**

✅ **Include**:

- CI/CD status (GitHub Actions, CircleCI)
- Test coverage (Codecov, Coveralls)
- npm version (for libraries)
- License type
- Build status

❌ **Avoid**:

- Too many badges (max 5-6)
- Outdated or broken badges
- Vanity metrics without value

---

### Step 3: Write Table of Contents

**For Long READMEs (>500 lines):**

```markdown
## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [License](#license)

---
```

**For Short READMEs (<500 lines):**

Skip TOC - keep it simple and scannable without extra navigation.

---

### Step 4: Document Prerequisites

**System Requirements:**

````markdown
## Prerequisites

Before you begin, ensure you have the following installed:

### Required

- **Node.js** - v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** - v9.0.0 or higher (comes with Node.js)
- **Git** - For cloning the repository

### Optional

- **Docker** - For containerized development ([Download](https://www.docker.com/))
- **VS Code** - Recommended IDE ([Download](https://code.visualstudio.com/))

### Verify Installation

```bash
node --version  # Should show v18.0.0 or higher
npm --version   # Should show v9.0.0 or higher
git --version   # Any recent version
```
````

**Operating Systems:**

- ✅ macOS (10.15+)
- ✅ Linux (Ubuntu 20.04+, Debian 10+)
- ✅ Windows 10/11 (with WSL2 recommended)

**Note:** Windows users should use WSL2 or Git Bash for best compatibility.

````

***

### Step 5: Write Installation Instructions

**Step-by-Step Setup:**

```markdown
## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/username/repo-name.git
cd repo-name
````

### 2. Install Dependencies

```bash
npm install
```

**Using Yarn:**

```bash
yarn install
```

**Using pnpm:**

```bash
pnpm install
```

### 3. Configure Environment Variables

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Edit `.env` and fill in required values:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# External APIs
STRIPE_API_KEY=sk_test_xxxxx
SENDGRID_API_KEY=SG.xxxxx
```

**Required Environment Variables:**

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token signing (generate with `openssl rand -hex 32`)

**Optional Environment Variables:**

- `STRIPE_API_KEY` - For payment processing
- `SENDGRID_API_KEY` - For email sending

### 4. Database Setup

Run database migrations:

```bash
npm run db:migrate
```

Seed database with sample data (optional):

```bash
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

The application should now be running at:

**Frontend:** http://localhost:3000  
**API:** http://localhost:3000/api  
**API Docs:** http://localhost:3000/api-docs

---

## Verification

After installation, verify everything works:

```bash
# Run health check
curl http://localhost:3000/health

# Expected response:
# {"status":"ok","timestamp":"2026-02-10T12:00:00.000Z"}

# Run test suite
npm test

# All tests should pass
```

✅ If you see the application running and tests passing, you're all set!

**Troubleshooting Installation:**

See [Troubleshooting](#troubleshooting) section below for common issues.

````

***

### Step 6: Write Usage Documentation

**Basic Usage Examples:**

```markdown
## Usage

### Development Mode

Start the development server with hot-reloading:

```bash
npm run dev
````

Changes to source files will automatically reload the application.

### Production Build

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

### Common Tasks

#### Create a New Component

```bash
npm run generate:component MyComponent
```

This creates:

- `src/components/MyComponent/MyComponent.tsx`
- `src/components/MyComponent/MyComponent.test.tsx`
- `src/components/MyComponent/MyComponent.module.css`
- `src/components/MyComponent/index.ts`

#### Run Linting

```bash
npm run lint        # Check for errors
npm run lint:fix    # Fix auto-fixable errors
```

#### Format Code

```bash
npm run format      # Format all files with Prettier
```

#### Type Checking

```bash
npm run type-check  # Run TypeScript compiler
```

---

## Examples

### Example 1: Basic Usage

```typescript
import { MyComponent } from './components/MyComponent';

function App() {
  return (
    <div>
      <MyComponent title="Hello World" />
    </div>
  );
}
```

### Example 2: API Integration

```typescript
import { apiClient } from "./lib/api";

async function fetchUsers() {
  try {
    const users = await apiClient.get("/users");
    console.log("Users:", users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
}
```

### Example 3: Authentication Flow

```typescript
import { useAuth } from './hooks/useAuth';

function LoginPage() {
  const { login, loading, error } = useAuth();

  const handleSubmit = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Redirect to dashboard
    } catch (error) {
      // Show error message
    }
  };

  return <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />;
}
```

---

## Documentation

For more detailed documentation, see:

- **[Architecture Overview](./docs/architecture.md)** - System design and patterns
- **[API Reference](./docs/api-reference.md)** - API endpoints and schemas
- **[Component Library](./docs/components.md)** - Available components
- **[Style Guide](./docs/style-guide.md)** - Code conventions
- **[Testing Guide](./docs/testing.md)** - Testing strategies

**External Documentation:**

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

````

***

### Step 7: Document Architecture

**System Architecture:**

```markdown
## Architecture

### Tech Stack

**Frontend:**

- ⚛️ **React 18** - UI library
- 📘 **TypeScript** - Type safety
- ⚡ **Vite** - Build tool and dev server
- 🎨 **Tailwind CSS** - Styling
- 📋 **React Hook Form** - Form management
- 🔍 **React Query** - Data fetching and caching

**Backend:**

- 🟢 **Node.js** - Runtime
- 🚂 **Express** - Web framework
- 🗄️ **PostgreSQL** - Database
- 🔐 **JWT** - Authentication
- ✅ **Zod** - Schema validation

**DevOps:**

- 🐳 **Docker** - Containerization
- ▲ **Vercel** - Deployment
- 🔄 **GitHub Actions** - CI/CD
- 📊 **Codecov** - Test coverage

### Project Structure

````

project-root/
├── .github/ # GitHub Actions workflows
│ └── workflows/
│ └── ci.yml
├── docs/ # Documentation
│ ├── architecture.md
│ └── api-reference.md
├── public/ # Static assets
│ ├── favicon.ico
│ └── images/
├── src/ # Source code
│ ├── components/ # React components
│ │ ├── Button/
│ │ │ ├── Button.tsx
│ │ │ ├── Button.test.tsx
│ │ │ └── Button.module.css
│ │ └── ...
│ ├── hooks/ # Custom React hooks
│ │ ├── useAuth.ts
│ │ └── useUser.ts
│ ├── lib/ # Utilities and helpers
│ │ ├── api.ts
│ │ └── utils.ts
│ ├── pages/ # Page components
│ │ ├── Home.tsx
│ │ └── Login.tsx
│ ├── styles/ # Global styles
│ │ └── globals.css
│ ├── types/ # TypeScript types
│ │ └── index.ts
│ ├── App.tsx # Root component
│ └── main.tsx # Entry point
├── tests/ # Test utilities
│ └── setup.ts
├── .env.example # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md # This file

```

### Data Flow

```

User Interaction
↓
React Component
↓
React Query (useQuery/useMutation)
↓
API Client (axios/fetch)
↓
Backend API Endpoint
↓
Database (PostgreSQL)
↓
Response flows back up the chain

```

### Design Patterns

**Component Patterns:**

- **Container/Presenter** - Separation of logic and presentation
- **Custom Hooks** - Reusable stateful logic
- **Composition** - Building complex UIs from simple components

**State Management:**

- **Local State** - useState for component-specific state
- **Server State** - React Query for data fetching/caching
- **Context** - React Context for auth and theme

**Data Fetching:**

- React Query handles caching, background updates, and error retry
- Optimistic updates for better UX
- Suspense for loading states
```

---

### Step 8: Write Development Guide

**Contributing and Development:**

````markdown
## Development

### Development Workflow

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/my-feature
   ```
````

2. **Make your changes** following the style guide

3. **Write tests** for new functionality:

   ```bash
   npm test -- --watch
   ```

4. **Run quality checks**:

   ```bash
   npm run lint
   npm run type-check
   npm test
   ```

5. **Commit your changes**:

   ```bash
   git commit -m "feat: add new feature"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/)

6. **Push and create PR**:
   ```bash
   git push origin feature/my-feature
   ```

### Code Style

This project uses:

- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

Run all checks:

```bash
npm run check      # Runs lint, type-check, and test
```

Format code:

```bash
npm run format     # Auto-format with Prettier
```

### Testing

**Run all tests:**

```bash
npm test
```

**Watch mode (for TDD):**

```bash
npm test -- --watch
```

**Coverage report:**

```bash
npm run test:coverage
```

**Test structure:**

```typescript
describe('ComponentName', () => {
  test('renders correctly', () => {
    // Arrange
    render(<ComponentName />);

    // Act
    // (user interactions)

    // Assert
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Debugging

**VS Code Debug Configuration:**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Frontend",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

**Chrome DevTools:**

1. Open DevTools (F12)
2. Go to Sources tab
3. Set breakpoints in source files
4. Interact with app to trigger breakpoints

### Environment-Specific Configs

**Development:**

- Uses `.env.development`
- Hot module reloading enabled
- Source maps enabled
- Verbose logging

**Production:**

- Uses `.env.production`
- Minified builds
- Source maps disabled (optional)
- Error tracking (Sentry)

---

## Scripts Reference

| Script               | Description               |
| -------------------- | ------------------------- |
| `npm run dev`        | Start development server  |
| `npm run build`      | Build for production      |
| `npm start`          | Start production server   |
| `npm test`           | Run test suite            |
| `npm run lint`       | Lint code                 |
| `npm run format`     | Format code with Prettier |
| `npm run type-check` | Run TypeScript compiler   |
| `npm run db:migrate` | Run database migrations   |
| `npm run db:seed`    | Seed database             |

````

***

### Step 9: Document Deployment

**Deployment Instructions:**

```markdown
## Deployment

### Vercel (Recommended)

**Automatic Deployment:**

1. Push to `main` branch
2. Vercel automatically builds and deploys
3. Preview deployments created for PRs

**Manual Deployment:**

```bash
npm i -g vercel
vercel login
vercel --prod
````

**Environment Variables:**

Set in Vercel dashboard:

- Settings → Environment Variables
- Add all variables from `.env.production`

### Docker

**Build image:**

```bash
docker build -t app-name:latest .
```

**Run container:**

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  app-name:latest
```

**Docker Compose:**

```bash
docker-compose up -d
```

### Manual Deployment

**Build production bundle:**

```bash
npm run build
```

**Start production server:**

```bash
NODE_ENV=production npm start
```

**Using PM2:**

```bash
npm i -g pm2
pm2 start npm --name "app" -- start
pm2 save
pm2 startup
```

### Health Checks

**Endpoint:** `GET /health`

```bash
curl https://app.example.com/health

# Response:
{
  "status": "ok",
  "timestamp": "2026-02-10T12:00:00.000Z",
  "uptime": 86400,
  "database": "connected"
}
```

### Monitoring

- **Status Page:** https://status.example.com
- **Logs:** Vercel dashboard or `pm2 logs`
- **Errors:** Sentry dashboard
- **Analytics:** Google Analytics / Plausible

````

***

### Step 10: Add Troubleshooting Section

**Common Issues:**

```markdown
## Troubleshooting

### Installation Issues

**"npm install" fails**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lockfile
rm -rf node_modules package-lock.json

# Reinstall
npm install
````

**Port already in use**

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Runtime Issues

**Database connection fails**

Check `.env` file has correct `DATABASE_URL`:

```bash
# Verify database is running
pg_isready -h localhost -p 5432

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

**Build fails with type errors**

```bash
# Clean build cache
rm -rf dist .turbo node_modules/.cache

# Rebuild
npm run type-check
npm run build
```

### Getting Help

**Before asking for help:**

1. ✅ Check this README
2. ✅ Search [existing issues](https://github.com/username/repo/issues)
3. ✅ Review error logs carefully
4. ✅ Try on latest `main` branch

**When asking for help, include:**

- Operating system and version
- Node.js and npm versions (`node -v`, `npm -v`)
- Full error message and stack trace
- Steps to reproduce
- What you've already tried

**Where to get help:**

- 💬 [GitHub Discussions](https://github.com/username/repo/discussions) - Questions and community
- 🐛 [GitHub Issues](https://github.com/username/repo/issues) - Bug reports
- 📧 Email: support@example.com - Direct support

````

***

### Step 11: Add Contributing Section

**Contribution Guidelines:**

```markdown
## Contributing

We welcome contributions! Please read these guidelines before submitting.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and commit: `git commit -m 'feat: add amazing feature'`
4. **Push to your fork**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Formatting, missing semicolons, etc.
- `refactor:` Code restructuring
- `perf:` Performance improvements
- `test:` Adding tests
- `chore:` Maintenance tasks

**Examples:**

````

feat: add user authentication
fix: resolve memory leak in data fetching
docs: update installation instructions

```

### Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass (`npm test`)
4. Run linting (`npm run lint`)
5. Update CHANGELOG.md if applicable
6. PR will be reviewed by maintainers

### Code Review

PRs require:
- ✅ Passing CI checks
- ✅ Approval from 1+ maintainer
- ✅ No merge conflicts
- ✅ Up-to-date with `main` branch

### Code of Conduct

Be respectful and inclusive. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

***

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

***

## Acknowledgments

- [React](https://react.dev) - UI library
- [Vite](https://vitejs.dev) - Build tool
- [TypeScript](https://www.typescriptlang.org) - Type safety
- All [contributors](https://github.com/username/repo/graphs/contributors)

***

## Contact

**Maintainer:** Your Name ([@username](https://github.com/username))

**Project Link:** https://github.com/username/repo

**Website:** https://example.com
```

---

## README Templates

### Template 1: Library/Package README

```markdown
# Package Name

> One-line description

## Installation

\`\`\`bash
npm install package-name
\`\`\`

## Usage

\`\`\`typescript
import { feature } from 'package-name';

feature();
\`\`\`

## API

### `feature(options)`

Description of feature.

**Parameters:**

- `options` (Object) - Configuration options

**Returns:** Result description

## License

MIT
```

### Template 2: Application README

```markdown
# App Name

> One-line description

## Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

Open http://localhost:3000

## Features

- Feature 1
- Feature 2

## Tech Stack

- React
- TypeScript
- Node.js

## Development

See [Development Guide](./docs/development.md)

## Deployment

See [Deployment Guide](./docs/deployment.md)

## License

MIT
```

---

## Variables

- `${workspaceFolder}` - Project root directory
- `${input:projectName}` - Project name (prompts if not provided)
- `${input:description}` - Project description (prompts if not provided)

---

## Success Criteria

After running this prompt:

✅ Project purpose clearly explained
✅ Prerequisites listed with versions  
✅ Step-by-step installation instructions  
✅ Usage examples provided  
✅ Architecture documented  
✅ Deployment process explained  
✅ Troubleshooting section included  
✅ Contributing guidelines provided  
✅ License and contact information added

---

## Example Usage

**Generate README for Project:**

```
@workspace /readme-generator
```

**Update Existing README:**

```
Review and update the README.md with current project information
```

**Generate README Section:**

```
Add deployment section to README for Vercel hosting
```

---

## Follow-up Actions

After generating README:

1. **Add Screenshots** - Visual documentation helps understanding
2. **Create Badge Images** - CI/CD, coverage, version badges
3. **Link Documentation** - Reference detailed docs in `./docs/`
4. **Test Instructions** - Verify setup steps work on clean machine
5. **Add to Website** - Display README on project website
6. **Keep Updated** - README should reflect current state

---

## References

- [Make a README](https://www.makeareadme.com/)
- [Awesome README Examples](https://github.com/matiassingers/awesome-readme)
- [Shields.io](https://shields.io/) - Generate badges
- [GitHub Docs: About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)

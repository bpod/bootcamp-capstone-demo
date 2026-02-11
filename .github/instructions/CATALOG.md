# Instructions Catalog

This catalog provides an overview of all available instructions files in the toolkit. Instructions files automatically apply guidance when working with specific file types.

## How Instructions Work

Instructions files use the `applyTo` glob pattern to automatically activate when you're working with matching files. This provides context-aware guidance without needing to manually invoke prompts.

### Example

When you edit a `.ts` or `.tsx` file:
- `typescript.instructions.md` automatically applies
- GitHub Copilot uses these guidelines for suggestions
- Recommendations follow your TypeScript patterns

---

## Quick Reference

| Instructions File | Applies To | Purpose |
|-------------------|------------|---------|
| **typescript.instructions.md** | `**/*.ts`, `**/*.tsx` | Type safety, interfaces, generics |
| **testing.instructions.md** | `**/*.test.*`, `**/*.spec.*` | Testing conventions, RTL patterns |
| **package-json.instructions.md** | `**/package.json` | Dependencies, scripts, security |
| **react-component.instructions.md** | `**/*.jsx`, `**/*.tsx` (React projects) | React patterns, hooks, performance |
| **config-files.instructions.md** | Config files (see below) | Build tools, linting, env vars |
| **markdown-docs.instructions.md** | `**/*.md` | Documentation structure, formatting |

---

## typescript.instructions.md

### Description
TypeScript type safety patterns, interfaces, generics, and best practices

### Applies To
```
**/*.ts,**/*.tsx
```
All TypeScript files in the project

### Key Guidelines

**Type Safety**:
- Use `strict: true` in tsconfig.json
- Prefer explicit types over `any`
- Use `unknown` for truly unknown types
- Leverage type narrowing with type guards

**Interfaces vs Types**:
- Use `interface` for object shapes (can extend)
- Use `type` for unions, intersections, primitives
- Keep interfaces focused and composable

**Generics**:
- Use generics for reusable, type-safe code
- Constrain generics with `extends` when needed
- Prefer inference over explicit type arguments

**Best Practices**:
- Use utility types: `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`
- Avoid type assertions unless absolutely necessary
- Use `as const` for literal types
- Prefer tuple types over arrays when length/types are known

### Common Patterns

**Props Interface**:
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}
```

**Generic Hook**:
```typescript
function useLocalStorage<T>(key: string, initial: T): [T, (value: T) => void] {
  // Implementation
}
```

### When This Applies
Automatically active when editing `.ts` or `.tsx` files

---

## testing.instructions.md

### Description
Testing conventions, React Testing Library patterns, and framework-agnostic best practices

### Applies To
```
**/*.test.*,**/*.spec.*,**/__tests__/**/*
```
All test files regardless of extension

### Key Guidelines

**Framework Detection**:
- Check `package.json` before suggesting test commands
- Adapt syntax to detected framework (Vitest, Jest, Mocha)
- Use framework-agnostic patterns when possible

**React Testing Library**:
- Query by accessibility role/label (user perspective)
- Avoid implementation details (className, internal state)
- Use `screen` for queries
- Test behavior, not implementation

**Test Structure**:
- AAA pattern: Arrange, Act, Assert
- One assertion per test (when practical)
- Descriptive test names that explain behavior
- Group related tests with `describe` blocks

**Best Practices**:
- Aim for 80%+ coverage of critical paths
- Test error states and edge cases
- Mock external dependencies
- Avoid testing library internals

### Common Patterns

**Component Test**:
```typescript
describe('LoginForm', () => {
  it('submits credentials when form is valid', async () => {
    // Arrange
    const onSubmit = vi.fn(); // Vitest | jest.fn() for Jest
    render(<LoginForm onSubmit={onSubmit} />);
    
    // Act
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    // Assert
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123'
    });
  });
});
```

### When This Applies
Automatically active when editing test files

---

## package-json.instructions.md

### Description
Dependency management, security audits, scripts, and package.json best practices

### Applies To
```
**/package.json
```
All package.json files in the project

### Key Guidelines

**Dependency Management**:
- Use exact versions for production dependencies
- Allow caret ranges for devDependencies (`^1.2.3`)
- Regular security audits: `npm audit` or `pnpm audit`
- Remove unused dependencies
- Keep dependencies up-to-date

**Scripts**:
- Consistent naming: `dev`, `build`, `test`, `lint`
- Chain scripts with `npm-run-all` or `&&`
- Document complex scripts in README
- Use `pre` and `post` hooks appropriately

**Security**:
- Never commit secrets in package.json
- Use `engines` field to specify Node/npm versions
- Validate package authenticity before installing
- Review dependency licenses

**Best Practices**:
- Use `private: true` for non-published projects
- Provide clear `name` and `description`
- Include `repository`, `bugs`, `homepage` for open source
- Use `type: "module"` for ES modules

### Common Patterns

**Security Audit**:
```json
{
  "scripts": {
    "audit": "npm audit --audit-level=moderate",
    "audit:fix": "npm audit fix"
  }
}
```

**Build Scripts**:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

### When This Applies
Automatically active when editing package.json files

---

## react-component.instructions.md

### Description
React component patterns, hooks, performance optimization, and best practices

### Applies To
```
**/*.jsx,**/*.tsx
```
React JSX/TSX files (detected via imports)

### Key Guidelines

**Component Design**:
- Functional components with hooks
- Single responsibility principle
- Prefer composition over prop drilling
- Extract reusable logic into custom hooks

**Hooks Best Practices**:
- Use `useState` for local state
- Use `useEffect` with proper dependencies
- Use `useMemo` for expensive calculations (only when needed)
- Use `useCallback` for stable function references

**Performance**:
- Use `React.memo()` for expensive pure components
- Implement code splitting with `React.lazy()` and `Suspense`
- Avoid inline function definitions in JSX (for frequently re-rendered components)
- Profile before optimizing

**Accessibility**:
- Semantic HTML elements (`button`, `nav`, `main`)
- Proper ARIA attributes when needed
- Keyboard navigation support
- Form labels and error messages

### Common Patterns

**Custom Hook**:
```typescript
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue] as const;
}
```

**Memoized Component**:
```typescript
const ExpensiveComponent = React.memo(({ data }: Props) => {
  // Expensive render logic
});
```

### When This Applies
Automatically active when editing React component files

---

## config-files.instructions.md

### Description
Build tool configurations, linting, environment variables, and security best practices

### Applies To
```
**/*.config.js,**/*.config.ts,**/.*.rc,
**/vite.config.*,**/webpack.config.*,**/next.config.*,
**/.eslintrc.*,**/.prettierrc.*,
**/tsconfig.json,**/.env*
```
All configuration files

### Key Guidelines

**Framework Detection**:
- Check package.json for existing build tools
- Adapt to Vite, Webpack, Next.js, or other detected tools
- Never prescribe specific tools - work with what's there

**Build Configuration**:
- Code splitting for optimal bundle size
- Source maps for debugging (production: false)
- Environment-specific configurations
- Performance budgets enforcement

**Environment Variables**:
- Never commit secrets to `.env` files
- Use `.env.example` with dummy values
- Validate required env vars at runtime
- Follow prefix conventions: `VITE_`, `NEXT_PUBLIC_`, `REACT_APP_`

**Linting & Formatting**:
- ESLint for code quality
- Prettier for formatting
- Consistent rules across team
- Pre-commit hooks for enforcement

**Security**:
- Security headers (CSP, X-Frame-Options, HSTS)
- CORS configuration for APIs
- Dependency vulnerability scanning

### Common Patterns

**Vite Config**:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
});
```

**Environment Validation**:
```typescript
const requiredEnvVars = ['VITE_API_URL', 'VITE_API_KEY'];
requiredEnvVars.forEach(varName => {
  if (!import.meta.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});
```

### When This Applies
Automatically active when editing configuration files

---

## markdown-docs.instructions.md

### Description
Documentation structure, formatting, code blocks, links, and best practices

### Applies To
```
**/*.md
```
All Markdown files in the project

### Key Guidelines

**Document Structure**:
- Clear heading hierarchy (H1 for title, H2 for sections)
- Table of contents for long documents
- Consistent formatting across docs
- Short paragraphs for readability

**Code Blocks**:
- Always specify language for syntax highlighting
- Use inline code for symbols (`function`, `variable`)
- Provide context and explanations
- Show both ❌ BAD and ✅ GOOD examples

**Links**:
- Use descriptive link text (not "click here")
- Relative links for internal docs
- External links open in new tab when needed
- Verify links aren't broken

**Lists & Tables**:
- Consistent bullet styles
- Tables for structured data
- Numbered lists for sequential steps

**Accessibility**:
- Alt text for images
- Descriptive headings
- Proper semantic structure
- Screen reader friendly

### Common Patterns

**Code Example with Context**:
````markdown
To handle async state updates:

```typescript
// ❌ BAD: Doesn't handle cleanup
useEffect(() => {
  fetchData().then(setData);
}, []);

// ✅ GOOD: Handles cleanup and cancellation
useEffect(() => {
  let cancelled = false;
  
  fetchData().then(result => {
    if (!cancelled) setData(result);
  });
  
  return () => { cancelled = true; };
}, []);
```
````

**README Template**:
```markdown
# Project Name

Brief description (1-2 sentences)

## Features
- Feature 1
- Feature 2

## Installation
```bash
npm install
```

## Usage
Quick example

## Documentation
Links to full docs

## License
MIT
```

### When This Applies
Automatically active when editing Markdown files

---

## Creating Custom Instructions

To create new instructions for your project:

1. **Identify File Types**: What files need specific guidance?
2. **Define applyTo Pattern**: Glob pattern for matching files
3. **Document Guidelines**: Clear, actionable rules
4. **Provide Examples**: Show good and bad patterns
5. **Test**: Edit matching files and verify instructions apply

**Template**:
```markdown
---
description: Brief description shown on hover
applyTo: "**/*.ext,**/*.other"
---

# Instructions Title

## Category 1
- Guideline 1
- Guideline 2

## Category 2
- Guideline 3
- Guideline 4

## Common Patterns

❌ **BAD**:
```language
// Anti-pattern example
```

✅ **GOOD**:
```language
// Best practice example
```
```

---

## Disabling Instructions

If instructions interfere with specific work:

**Temporary Disable in Chat**:
Type `@workspace` instead of using auto-applied instructions

**Disable Feature**:
1. Open VS Code Settings
2. Search for "Copilot instructions"
3. Uncheck "Use instruction files"

**Disable Specific File**:
Add to `.gitignore` or remove `applyTo` pattern

---

## Support

For questions or issues:
- See [Quick Start Guide](../../docs/quick-start.md)
- Review [Project Documentation](../../docs/)
- Check [CONTRIBUTING.md](../../CONTRIBUTING.md)
- Open an issue on GitHub

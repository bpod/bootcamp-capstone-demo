---
name: README Generator
description: Generate comprehensive README files for projects
agent: frontend-developer
tools: ["readonly"]
---

# README Generator

Generate well-structured, comprehensive README.md files for projects, libraries, or components.

## README Structure

1. **Project Title & Description**
2. **Badges** (build status, version, license)
3. **Demo / Screenshot** (if applicable)
4. **Features**
5. **Installation**
6. **Usage Examples**
7. **API Documentation** (for libraries)
8. **Configuration**
9. **Development Setup**
10. **Contributing**
11. **License**

## README Template

````markdown
# Project Name

Brief, compelling description of what the project does and why it exists.

[![Build Status](https://img.shields.io/github/workflow/status/user/repo/CI)](https://github.com/user/repo/actions)
[![npm version](https://img.shields.io/npm/v/package-name.svg)](https://www.npmjs.com/package/package-name)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **Fast**: Optimized for performance
- ♿ **Accessible**: WCAG 2.1 Level AA compliant
- 📱 **Responsive**: Works on all devices
- 🎨 **Themeable**: Customizable styling
- 📦 **Zero Dependencies**: No external dependencies

## Demo

[Live Demo](https://example.com/demo) | [CodeSandbox](https://codesandbox.io/xxx)

![Screenshot](./assets/screenshot.png)

## Installation

```bash
npm install package-name
# or
yarn add package-name
# or
pnpm add package-name
```

## Usage

```javascript
import { Component } from "package-name";

function App() {
  return (
    <Component title="Hello World" onAction={() => console.log("clicked")} />
  );
}
```

## API

### Component Props

| Prop       | Type                       | Default     | Description                    |
| ---------- | -------------------------- | ----------- | ------------------------------ |
| `title`    | `string`                   | `''`        | The title text to display      |
| `variant`  | `'primary' \| 'secondary'` | `'primary'` | Visual style variant           |
| `onAction` | `() => void`               | -           | Callback when action triggered |

## Configuration

Create a `config.js` file:

```javascript
module.exports = {
  theme: "dark",
  apiUrl: "https://api.example.com",
};
```

## Development

### Prerequisites

- Node.js 18+
- npm 9+ or pnpm 8+

### Setup

```bash
# Clone the repository
git clone https://github.com/user/repo.git
cd repo

# Install dependencies
npm install

# Start development server
npm run dev
```

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [Project Name](https://example.com)
- Built with [Technology](https://example.com)
- Thanks to all contributors!

## Support

- 📧 Email: support@example.com
- 💬 Discord: [Join our community](https://discord.gg/xxx)
- 🐛 Issues: [GitHub Issues](https://github.com/user/repo/issues)
````

## README Best Practices

**Do:**

- ✅ Include working code examples
- ✅ Add badges for status, version, coverage
- ✅ Provide screenshots/demos for visual projects
- ✅ Keep installation instructions simple
- ✅ Document all public APIs
- ✅ Include troubleshooting section

**Don't:**

- ❌ Use non-working or outdated examples
- ❌ Forget to update version numbers
- ❌ Skip prerequisite requirements
- ❌ Make assumptions about user knowledge
- ❌ Leave TODO items in published README

## Output Format

Generate a README that includes:

1. **Clear Title & Description**: What and why
2. **Quick Start**: Get users running in < 5 minutes
3. **Comprehensive Examples**: Cover common use cases
4. **Complete API Docs**: All props/options/methods
5. **Development Guide**: How to contribute
6. **License & Support**: Legal and contact info

README should be ready to commit without modifications.

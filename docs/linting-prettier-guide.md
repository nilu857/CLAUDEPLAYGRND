# Linting and Prettier Configuration Guide

## Overview

Linting and code formatting tools help maintain consistent, high-quality code across your project.

## Why Use Linting and Prettier?

### Benefits
- **Consistency**: Uniform code style across all contributors
- **Error Prevention**: Catch bugs and anti-patterns early
- **Code Reviews**: Focus on logic, not formatting
- **Maintainability**: Easier to read and maintain codebase

### Can You Work Without It?
Yes, but you'll face:
- Inconsistent code styles
- More time spent on formatting debates
- Potential bugs that linters catch automatically
- Harder onboarding for new developers

## Setup

### 1. Install Dependencies

```bash
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier
```

### 2. ESLint Configuration

Create `.eslintrc.json`:

```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    // Add rules incrementally below
  }
}
```

### 3. Prettier Configuration

Create `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

Create `.prettierignore`:

```
node_modules
dist
build
coverage
```

## Enforcing Rules

### NPM Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

### Pre-commit Hooks (Recommended)

```bash
npm install --save-dev husky lint-staged
npx husky init
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{js,ts,jsx,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

### CI/CD Integration

Add to your CI pipeline:

```yaml
- run: npm run lint
- run: npm run format:check
```

## Adding Rules (Template)

Incrementally add rules to `.eslintrc.json`:

```json
{
  "rules": {
    // Code Quality
    "no-unused-vars": "warn",
    "no-console": "warn",
    "eqeqeq": "error",

    // Best Practices
    "no-var": "error",
    "prefer-const": "error",
    "no-duplicate-imports": "error",

    // Add more rules as needed...
  }
}
```

### Common Rule Categories

| Category | Example Rules |
|----------|--------------|
| Errors | `no-undef`, `no-unreachable` |
| Best Practices | `eqeqeq`, `no-eval` |
| Style | `camelcase`, `max-len` |
| ES6+ | `prefer-arrow-callback`, `no-var` |

## How Linter Improves Code

1. **Catches bugs**: Undefined variables, unreachable code
2. **Enforces patterns**: Consistent naming, imports
3. **Security**: Flags dangerous functions like `eval()`
4. **Performance**: Identifies inefficient patterns

## Making Changes

1. Run `npm run lint` to see issues
2. Run `npm run lint:fix` to auto-fix
3. Manually fix remaining issues
4. Run `npm run format` to format code

## Quick Reference

```bash
# Check for issues
npm run lint
npm run format:check

# Fix issues
npm run lint:fix
npm run format
```

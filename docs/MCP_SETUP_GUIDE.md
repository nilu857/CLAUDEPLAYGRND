# Playwright MCP and BrowserStack MCP Setup Guide

## Quick Start (TL;DR)

### Playwright MCP - 3 Steps
```bash
# 1. Install
npm install -g @anthropic/mcp-playwright && npx playwright install

# 2. Add to ~/.claude/settings.json
{"mcpServers":{"playwright":{"command":"npx","args":["@anthropic/mcp-playwright"]}}}

# 3. Restart Claude Code and verify
/mcp
```

### BrowserStack MCP - 3 Steps
```bash
# 1. Set credentials
export BROWSERSTACK_USERNAME="your_username"
export BROWSERSTACK_ACCESS_KEY="your_access_key"

# 2. Add to ~/.claude/settings.json
{"mcpServers":{"browserstack":{"command":"npx","args":["@anthropic/mcp-browserstack"]}}}

# 3. Restart and verify
/mcp
```

### VS Code Setup - 3 Steps
1. Install "Claude" extension from VS Code marketplace
2. Open Settings (Ctrl+,) > search "Claude MCP" > Edit settings.json
3. Add MCP config (same as above) and reload window

---

## Common Prompts Cheat Sheet

### UI Testing Prompts
| Task | Prompt |
|------|--------|
| Navigate | `"Go to https://example.com"` |
| Screenshot | `"Take a screenshot"` |
| Login test | `"Fill username 'test' and password 'pass123', click login"` |
| Verify | `"Check if 'Welcome' text appears"` |
| Full flow | `"Test checkout: add item, go to cart, complete purchase"` |

### API Testing Prompts
| Task | Prompt |
|------|--------|
| Intercept | `"Capture all requests to /api/users"` |
| Validate | `"Verify /api/health returns 200"` |
| Mock | `"Mock /api/products to return empty array"` |
| Performance | `"Report load time and API response times"` |

### Code Generation Prompts (Copilot/Claude)
| Task | Prompt |
|------|--------|
| Generate test | `"Write a Playwright test for login with valid/invalid credentials"` |
| Page object | `"Create a page object model for the checkout page"` |
| API test | `"Generate API tests for CRUD operations on /api/users"` |
| Fixtures | `"Create test fixtures for user authentication scenarios"` |

### Code Explanation Prompts
| Task | Prompt |
|------|--------|
| Explain | `"Explain this test file line by line"` |
| Debug | `"Why is this test flaky? Suggest fixes"` |
| Improve | `"How can I make this test more maintainable?"` |
| Review | `"Review this test for best practices"` |

---

# Detailed Guide

## Table of Contents
- [VS Code Setup](#vs-code-setup)
- [Playwright MCP Setup](#playwright-mcp-setup)
- [BrowserStack MCP Setup](#browserstack-mcp-setup)
- [UI Testing with MCP](#ui-testing-with-mcp)
- [API Testing with MCP](#api-testing-with-mcp)
- [Copilot/Claude Prompting Guide](#copilotclaude-prompting-guide)
- [Advanced Usage](#advanced-usage-patterns)
- [Troubleshooting](#troubleshooting)

---

## VS Code Setup

### Prerequisites
- VS Code 1.80+
- Node.js 18+
- Claude extension installed

### Step 1: Install Claude Extension

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search "Claude" or "Claude Code"
4. Click Install
5. Sign in with your Anthropic account

### Step 2: Configure MCP Servers

Open VS Code settings:
- Press `Ctrl+,` (or `Cmd+,` on Mac)
- Click "Open Settings (JSON)" icon in top right
- Or: File > Preferences > Settings > search "claude"

Add MCP configuration:
```json
{
  "claude.mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@anthropic/mcp-playwright"]
    },
    "browserstack": {
      "command": "npx",
      "args": ["@anthropic/mcp-browserstack"],
      "env": {
        "BROWSERSTACK_USERNAME": "your_username",
        "BROWSERSTACK_ACCESS_KEY": "your_access_key"
      }
    }
  }
}
```

### Step 3: Reload and Verify

1. Press `Ctrl+Shift+P` > "Developer: Reload Window"
2. Open Claude panel (Ctrl+Shift+C or from Activity Bar)
3. Type `/mcp` to verify servers are connected

### VS Code Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Claude | `Ctrl+Shift+C` |
| Quick prompt | `Ctrl+I` |
| Explain selection | Select code + `Ctrl+Shift+E` |
| Generate test | `Ctrl+Shift+T` |

### Workspace-Level Configuration

Create `.vscode/settings.json` in your project:
```json
{
  "claude.mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@anthropic/mcp-playwright", "--headless"]
    }
  }
}
```

---

## Playwright MCP Setup

### Step 1: Install Playwright MCP

```bash
npm install -g @anthropic/mcp-playwright
```

Or use npx (no installation required):
```bash
npx @anthropic/mcp-playwright
```

### Step 2: Configure Claude Code

Add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@anthropic/mcp-playwright"]
    }
  }
}
```

### Step 3: Install Browser Dependencies

```bash
npx playwright install
```

### Step 4: Verify Installation

```
/mcp
```

---

## BrowserStack MCP Setup

### Step 1: Get BrowserStack Credentials

1. Sign up at [BrowserStack](https://www.browserstack.com/)
2. Navigate to **Account Settings** > **Automate**
3. Copy your **Username** and **Access Key**

### Step 2: Set Environment Variables

```bash
export BROWSERSTACK_USERNAME="your_username"
export BROWSERSTACK_ACCESS_KEY="your_access_key"
```

### Step 3: Configure Claude Code

Add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "browserstack": {
      "command": "npx",
      "args": ["@anthropic/mcp-browserstack"],
      "env": {
        "BROWSERSTACK_USERNAME": "your_username",
        "BROWSERSTACK_ACCESS_KEY": "your_access_key"
      }
    }
  }
}
```

---

## UI Testing with MCP

### Available Tools

| Tool | Description |
|------|-------------|
| `playwright_navigate` | Navigate to URL |
| `playwright_screenshot` | Capture screenshots |
| `playwright_click` | Click elements |
| `playwright_fill` | Fill input fields |
| `playwright_select` | Select dropdowns |
| `playwright_hover` | Hover elements |
| `playwright_evaluate` | Execute JavaScript |
| `playwright_get_text` | Extract text |
| `playwright_wait_for_selector` | Wait for elements |

### Example Workflows

**Login Flow:**
```
"Test login: go to /login, enter user@test.com and password123, click submit, verify dashboard loads"
```

**Form Validation:**
```
"Test registration form validation: submit empty form, verify all error messages appear"
```

**E2E Shopping:**
```
"Complete purchase flow: search 'laptop', add first result to cart, checkout with test card"
```

---

## API Testing with MCP

### Request Interception
```
"Navigate to dashboard and capture all /api/* requests with their response times"
```

### Response Mocking
```
"Mock /api/user to return {role: 'admin'}, verify admin panel is visible"
```

### Combined UI + API
```
"Submit contact form and verify:
1. POST request sent to /api/contact
2. Response status is 201
3. Success toast appears"
```

---

## Copilot/Claude Prompting Guide

### Effective Prompts for Code Generation

#### Be Specific with Context
```
BAD:  "Write a test"
GOOD: "Write a Playwright test for login page that tests:
       - Valid credentials redirect to dashboard
       - Invalid password shows error message
       - Empty fields show validation errors
       Use page object pattern and data-testid selectors"
```

#### Include Technical Requirements
```
"Generate API tests for /api/users endpoint:
- Use TypeScript with Playwright test runner
- Include positive and negative test cases
- Add proper assertions for response body structure
- Use test.describe for grouping"
```

#### Request Specific Patterns
```
"Create a page object model for checkout page with:
- Selectors as private properties
- Public methods for each action
- Built-in waits for dynamic elements
- TypeScript interfaces for form data"
```

### Effective Prompts for Code Explanation

#### Ask for Specific Analysis
```
BAD:  "Explain this code"
GOOD: "Explain this test file:
       - What is each test case testing?
       - Why are these specific waits used?
       - What edge cases are missing?"
```

#### Request Improvements
```
"Review this test for:
- Flakiness risks
- Missing assertions
- Performance improvements
- Better error messages"
```

#### Debug with Context
```
"This test fails intermittently on CI.
Error: 'Element not found'
- What could cause this flakiness?
- How should I fix it?
- Show the corrected code"
```

### Prompt Templates

#### Generate Test Suite
```
"Create a comprehensive test suite for [FEATURE]:

Requirements:
- Framework: Playwright + TypeScript
- Pattern: Page Object Model
- Coverage: Happy path + edge cases + error scenarios

Include:
1. Page object class
2. Test fixtures
3. Test cases with proper grouping
4. Test data as JSON fixtures"
```

#### Explain and Improve
```
"Analyze this test code:
1. Explain what each section does
2. Identify potential issues
3. Suggest improvements with code examples
4. Rate the test quality (1-10) with reasoning"
```

#### Debug Failing Test
```
"Debug this failing test:

Error message: [PASTE ERROR]
Test code: [PASTE CODE]

Provide:
1. Root cause analysis
2. Step-by-step fix
3. Prevention tips for future"
```

---

## Advanced Usage Patterns

### CI/CD Integration

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@anthropic/mcp-playwright", "--headless"]
    }
  }
}
```

### Cross-Browser Testing
```
"Run login test on:
- Chrome Windows 11
- Safari macOS Ventura
- Firefox Ubuntu
- iPhone 14 Safari
- Samsung Galaxy S23 Chrome"
```

### Performance Monitoring
```
"Test homepage performance:
- Page load time
- First contentful paint
- Largest contentful paint
- Total API calls and sizes"
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| MCP not connecting | Restart VS Code/Claude, check Node.js 18+ |
| Browser not found | Run `npx playwright install` |
| BrowserStack auth failed | Verify credentials in env vars |
| Element not found | Add `wait_for_selector` before interaction |
| Timeout errors | Increase timeout, check network |

### Debug Commands

```bash
# Test Playwright MCP directly
npx @anthropic/mcp-playwright --version

# Verify browsers installed
npx playwright --version

# Test BrowserStack connection
curl -u "username:key" https://api.browserstack.com/automate/plan.json
```

### Getting Help

- [Playwright Docs](https://playwright.dev)
- [BrowserStack Docs](https://www.browserstack.com/docs)
- [Claude Code Docs](https://docs.claude.com)

---

## Quick Reference Card

### Setup Commands
```bash
# Install all
npm i -g @anthropic/mcp-playwright @anthropic/mcp-browserstack
npx playwright install

# Verify
/mcp
```

### Top 10 Prompts
1. `"Navigate to [URL] and screenshot"`
2. `"Test login with [credentials]"`
3. `"Verify [element] contains [text]"`
4. `"Capture API calls to [endpoint]"`
5. `"Mock [endpoint] to return [data]"`
6. `"Test on [browser] [OS]"`
7. `"Generate Playwright test for [feature]"`
8. `"Explain this test code"`
9. `"Why is this test flaky?"`
10. `"Create page object for [page]"`

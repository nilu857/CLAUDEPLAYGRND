# Playwright MCP and BrowserStack MCP Setup Guide

This guide covers setting up Model Context Protocol (MCP) servers for Playwright and BrowserStack integration with Claude Code.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Playwright MCP Setup](#playwright-mcp-setup)
- [BrowserStack MCP Setup](#browserstack-mcp-setup)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)

---

## Prerequisites

- Node.js 18+ installed
- Claude Code CLI installed
- npm or npx available
- BrowserStack account (for BrowserStack MCP)

---

## Playwright MCP Setup

Playwright MCP enables browser automation capabilities directly through Claude Code.

### Step 1: Install Playwright MCP

```bash
npm install -g @anthropic/mcp-playwright
```

Or use npx (no installation required):
```bash
npx @anthropic/mcp-playwright
```

### Step 2: Configure Claude Code

Add the Playwright MCP server to your Claude Code configuration. Create or edit `~/.claude/settings.json`:

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

This installs Chromium, Firefox, and WebKit browsers.

### Step 4: Verify Installation

Restart Claude Code and verify the MCP server is connected:
```
/mcp
```

---

## BrowserStack MCP Setup

BrowserStack MCP provides cloud-based cross-browser testing capabilities.

### Step 1: Get BrowserStack Credentials

1. Sign up at [BrowserStack](https://www.browserstack.com/)
2. Navigate to **Account Settings** > **Automate**
3. Copy your **Username** and **Access Key**

### Step 2: Install BrowserStack MCP

```bash
npm install -g @anthropic/mcp-browserstack
```

Or use npx:
```bash
npx @anthropic/mcp-browserstack
```

### Step 3: Set Environment Variables

```bash
export BROWSERSTACK_USERNAME="your_username"
export BROWSERSTACK_ACCESS_KEY="your_access_key"
```

For persistent configuration, add to your shell profile (`~/.bashrc`, `~/.zshrc`):
```bash
echo 'export BROWSERSTACK_USERNAME="your_username"' >> ~/.bashrc
echo 'export BROWSERSTACK_ACCESS_KEY="your_access_key"' >> ~/.bashrc
source ~/.bashrc
```

### Step 4: Configure Claude Code

Add BrowserStack MCP to `~/.claude/settings.json`:

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

### Step 5: Verify Installation

Restart Claude Code and check MCP servers:
```
/mcp
```

---

## Combined Configuration

To use both Playwright and BrowserStack MCP servers together:

```json
{
  "mcpServers": {
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

---

## Usage Examples

### Playwright MCP

Once configured, you can ask Claude to:
- "Navigate to https://example.com and take a screenshot"
- "Fill out the login form with test credentials"
- "Click the submit button and wait for the response"

### BrowserStack MCP

With BrowserStack MCP, you can:
- "Run the test on Chrome Windows 11"
- "Test the page on Safari macOS Ventura"
- "Execute cross-browser testing on mobile devices"

---

## Troubleshooting

### Common Issues

1. **MCP server not connecting**
   - Ensure Node.js 18+ is installed
   - Check that the package is installed globally or npx is available
   - Restart Claude Code after configuration changes

2. **BrowserStack authentication failed**
   - Verify credentials are correct
   - Check environment variables are set
   - Ensure account has available Automate minutes

3. **Playwright browser not found**
   - Run `npx playwright install` to install browsers
   - Check system dependencies: `npx playwright install-deps`

### Getting Help

- [Playwright MCP Documentation](https://github.com/anthropics/mcp-playwright)
- [BrowserStack MCP Documentation](https://github.com/anthropics/mcp-browserstack)
- [Claude Code MCP Guide](https://docs.claude.com/en/docs/claude-code)

---

## Project-Level Configuration

For project-specific MCP configuration, create `.claude/settings.json` in your project root:

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

This allows different projects to have different MCP configurations.

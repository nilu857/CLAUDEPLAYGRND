# Playwright MCP and BrowserStack MCP Setup Guide

This guide covers setting up Model Context Protocol (MCP) servers for Playwright and BrowserStack integration with Claude Code.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Playwright MCP Setup](#playwright-mcp-setup)
- [BrowserStack MCP Setup](#browserstack-mcp-setup)
- [Configuration](#configuration)
- [UI Testing with MCP](#ui-testing-with-mcp)
- [API Testing with MCP](#api-testing-with-mcp)
- [Advanced Usage Patterns](#advanced-usage-patterns)
- [Troubleshooting](#troubleshooting)

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

## UI Testing with MCP

### Available Playwright MCP Tools

Once configured, Claude Code gains access to these browser automation tools:

| Tool | Description |
|------|-------------|
| `playwright_navigate` | Navigate to a URL |
| `playwright_screenshot` | Capture page screenshots |
| `playwright_click` | Click on elements |
| `playwright_fill` | Fill input fields |
| `playwright_select` | Select dropdown options |
| `playwright_hover` | Hover over elements |
| `playwright_evaluate` | Execute JavaScript in browser |
| `playwright_get_text` | Extract text content |
| `playwright_get_attribute` | Get element attributes |
| `playwright_wait_for_selector` | Wait for elements to appear |

### UI Testing Examples

#### Basic Navigation and Screenshot
```
Ask Claude: "Navigate to https://example.com and take a screenshot"
```
Claude will use `playwright_navigate` followed by `playwright_screenshot`.

#### Form Testing
```
Ask Claude: "Go to the login page, fill in username 'testuser' and password 'test123', then click submit"
```
Claude executes:
1. `playwright_navigate` to login URL
2. `playwright_fill` for username field
3. `playwright_fill` for password field
4. `playwright_click` on submit button

#### Element Verification
```
Ask Claude: "Navigate to the dashboard and verify the welcome message contains 'Hello'"
```
Claude uses `playwright_get_text` to extract and verify content.

#### Interactive Testing Workflow
```
Ask Claude: "Test the shopping cart flow:
1. Go to product page
2. Add item to cart
3. Verify cart count shows 1
4. Proceed to checkout
5. Take a screenshot of the checkout page"
```

#### Visual Regression Testing
```
Ask Claude: "Navigate to the homepage, take a screenshot, then compare it with the baseline"
```

### BrowserStack UI Testing

#### Cross-Browser Testing
```
Ask Claude: "Test the login flow on:
- Chrome on Windows 11
- Safari on macOS Ventura
- Firefox on Ubuntu"
```

#### Mobile Device Testing
```
Ask Claude: "Test the responsive design on iPhone 14 Pro and Samsung Galaxy S23"
```

#### Supported BrowserStack Capabilities
- **Desktop**: Chrome, Firefox, Safari, Edge on Windows/macOS
- **Mobile**: iOS Safari, Android Chrome
- **Real devices**: Physical device testing
- **Emulators**: Device emulation

---

## API Testing with MCP

### Using Playwright for API Testing

Playwright MCP can intercept and test API calls made during browser sessions.

#### Network Request Interception
```
Ask Claude: "Navigate to the app and capture all API requests made to /api/users"
```

#### API Response Validation
```
Ask Claude: "Go to the dashboard and verify the /api/data endpoint returns status 200"
```

#### Mock API Responses
```
Ask Claude: "Mock the /api/products endpoint to return an empty array, then verify the 'No products' message appears"
```

### Combined UI + API Testing

#### End-to-End with API Verification
```
Ask Claude: "Test user registration:
1. Fill the registration form
2. Submit and capture the POST request to /api/register
3. Verify response status is 201
4. Verify success message appears on screen"
```

#### API-Driven UI State Testing
```
Ask Claude: "
1. Intercept /api/notifications
2. Mock it to return 5 unread notifications
3. Verify the notification badge shows '5'"
```

### Performance Testing

#### Load Time Analysis
```
Ask Claude: "Navigate to the homepage and report:
- Page load time
- Time to first contentful paint
- Number of API calls made
- Total data transferred"
```

#### API Response Time Monitoring
```
Ask Claude: "Monitor response times for all /api/* endpoints while navigating through the app"
```

---

## Advanced Usage Patterns

### Test Automation Workflows

#### Automated Test Generation
```
Ask Claude: "Analyze the login page and generate Playwright test cases for:
- Valid login
- Invalid credentials
- Empty fields
- Remember me functionality"
```

#### Test Data Generation
```
Ask Claude: "Create test scenarios with different user roles and verify access permissions for each"
```

### CI/CD Integration

#### Headless Testing
Configure for CI environments:
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

#### BrowserStack Automate Integration
```
Ask Claude: "Run the test suite on BrowserStack and generate a report with session links"
```

### Debugging Capabilities

#### Step-by-Step Execution
```
Ask Claude: "Execute each step slowly with screenshots:
1. Navigate to cart
2. Screenshot
3. Click remove item
4. Screenshot
5. Verify empty cart message"
```

#### Error Capture
```
Ask Claude: "If any step fails, capture:
- Screenshot
- Console errors
- Network failures
- DOM state"
```

### Multi-Tab/Window Testing
```
Ask Claude: "Test OAuth flow:
1. Click 'Login with Google'
2. Handle the popup window
3. Complete authentication
4. Verify redirect back to app"
```

### File Upload/Download Testing
```
Ask Claude: "Test file upload:
1. Navigate to upload page
2. Upload test.pdf
3. Verify success message
4. Download the file and verify it exists"
```

---

## Best Practices

### UI Testing
1. **Use stable selectors**: Prefer data-testid over CSS classes
2. **Wait for elements**: Always wait for elements before interacting
3. **Isolate tests**: Each test should be independent
4. **Screenshot on failure**: Capture visual evidence of failures

### API Testing
1. **Validate response structure**: Check both status and body
2. **Test error scenarios**: Include 4xx and 5xx cases
3. **Mock external dependencies**: Isolate from third-party APIs
4. **Monitor performance**: Track response times

### BrowserStack Usage
1. **Prioritize real devices**: For critical user flows
2. **Use parallel execution**: Run tests concurrently
3. **Tag sessions**: For easy identification in dashboard
4. **Clean up sessions**: Avoid orphaned browser sessions

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

4. **Timeout errors**
   - Increase timeout values for slow-loading pages
   - Check network connectivity
   - Verify element selectors are correct

5. **Element not found**
   - Use `playwright_wait_for_selector` before interacting
   - Verify selector syntax
   - Check if element is inside iframe

### Getting Help

- [Playwright MCP Documentation](https://github.com/anthropics/mcp-playwright)
- [BrowserStack MCP Documentation](https://github.com/anthropics/mcp-browserstack)
- [Claude Code MCP Guide](https://docs.claude.com/en/docs/claude-code)
- [Playwright Official Docs](https://playwright.dev)
- [BrowserStack Documentation](https://www.browserstack.com/docs)

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

---

## Quick Reference Card

### Common Commands to Ask Claude

| Task | Example Prompt |
|------|----------------|
| Navigate | "Go to https://example.com" |
| Screenshot | "Take a screenshot of the current page" |
| Click | "Click the login button" |
| Fill form | "Enter 'test@email.com' in the email field" |
| Verify text | "Check if 'Welcome' appears on the page" |
| API check | "Verify /api/health returns 200" |
| Cross-browser | "Test this on Chrome and Safari" |
| Mobile test | "Test on iPhone 14 simulator" |
| Full flow | "Complete the checkout process and verify order confirmation" |

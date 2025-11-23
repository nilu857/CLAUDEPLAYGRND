# Interview Questions Guide: Playwright Automation Testing & Related Technologies

This comprehensive guide contains interview questions and expected responses for roles involving Playwright automation testing, MCP (Model Context Protocol), AI for testing, BrowserStack, Azure DevOps (ADO), and CI/CD concepts.

---

## Table of Contents

1. [Playwright Automation Testing](#playwright-automation-testing)
2. [MCP (Model Context Protocol)](#mcp-model-context-protocol)
3. [AI for Testing](#ai-for-testing)
4. [BrowserStack](#browserstack)
5. [Azure DevOps (ADO)](#azure-devops-ado)
6. [CI/CD Concepts](#cicd-concepts)
7. [Scenario-Based Questions](#scenario-based-questions)

---

## Playwright Automation Testing

### Q1: What is Playwright and what are its key advantages over other automation frameworks?

**Expected Response:**
Playwright is a modern end-to-end testing framework developed by Microsoft that enables reliable automation across all modern browsers (Chromium, Firefox, WebKit). Key advantages include:

- **Auto-waiting**: Built-in smart waiting mechanism that waits for elements to be actionable before performing actions
- **Multi-browser support**: Single API works across Chromium, Firefox, and WebKit
- **Multi-language support**: Available in JavaScript/TypeScript, Python, Java, and .NET
- **Network interception**: Ability to mock and modify network requests/responses
- **Auto-screenshot and video recording**: Built-in debugging capabilities
- **Parallel execution**: Tests run in parallel by default for faster execution
- **Mobile emulation**: Test responsive designs with device emulation
- **Codegen**: Built-in test generator that records user actions
- **Trace viewer**: Powerful debugging tool with timeline and snapshots

### Q2: Explain the difference between `page.locator()` and `page.$()` in Playwright.

**Expected Response:**
- **`page.locator()`**: Returns a Locator object that supports auto-waiting and retry-ability. It's the recommended approach as it:
  - Automatically waits for elements to be actionable
  - Supports strict mode to prevent flaky tests
  - Can be chained and filtered
  - Lazy evaluation (doesn't query DOM immediately)

- **`page.$()`**: Returns an ElementHandle or null immediately. It's discouraged because:
  - No auto-waiting mechanism
  - Can lead to flaky tests with timing issues
  - Requires manual waiting logic
  - Disposed after use

**Example:**
```typescript
// Recommended
await page.locator('button.submit').click();

// Not recommended (legacy)
const button = await page.$('button.submit');
if (button) await button.click();
```

### Q3: How do you handle dynamic elements and waits in Playwright?

**Expected Response:**
Playwright has built-in auto-waiting, but for specific scenarios:

1. **Auto-waiting (default)**: Playwright automatically waits for elements to be:
   - Attached to DOM
   - Visible
   - Stable (not animating)
   - Enabled
   - Receives events

2. **Explicit waits**:
```typescript
// Wait for element to be visible
await page.locator('.dynamic-content').waitFor({ state: 'visible' });

// Wait for network idle
await page.waitForLoadState('networkidle');

// Wait for specific condition
await page.waitForFunction(() => window.loaded === true);

// Wait for API response
await page.waitForResponse(resp => resp.url().includes('/api/data'));
```

3. **Custom timeouts**:
```typescript
await page.locator('.slow-element').click({ timeout: 10000 });
```

### Q4: Explain the Page Object Model (POM) pattern and how you implement it in Playwright.

**Expected Response:**
The Page Object Model is a design pattern that creates an object repository for web elements and encapsulates page-specific logic. Benefits include:
- Improved maintainability
- Reduced code duplication
- Better readability
- Easier updates when UI changes

**Implementation:**
```typescript
// pages/LoginPage.ts
export class LoginPage {
  private page: Page;

  // Locators
  private usernameInput = () => this.page.locator('#username');
  private passwordInput = () => this.page.locator('#password');
  private loginButton = () => this.page.locator('button[type="submit"]');
  private errorMessage = () => this.page.locator('.error-message');

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput().fill(username);
    await this.passwordInput().fill(password);
    await this.loginButton().click();
  }

  async getErrorMessage() {
    return await this.errorMessage().textContent();
  }
}

// test.spec.ts
test('user login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('user@test.com', 'password123');
});
```

### Q5: How do you handle authentication and session management in Playwright tests?

**Expected Response:**
Multiple strategies for handling authentication:

1. **Storage State (Recommended for speed)**:
```typescript
// auth.setup.ts
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#username', 'user@test.com');
  await page.fill('#password', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');

  // Save storage state
  await page.context().storageState({
    path: 'auth/user.json'
  });
});

// playwright.config.ts
export default defineConfig({
  use: {
    storageState: 'auth/user.json',
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],
});
```

2. **API-based authentication**:
```typescript
test.beforeEach(async ({ page, request }) => {
  const response = await request.post('/api/auth/login', {
    data: { username: 'user', password: 'pass' }
  });
  const { token } = await response.json();
  await page.goto('/', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
});
```

### Q6: What are fixtures in Playwright and how do you create custom fixtures?

**Expected Response:**
Fixtures are Playwright's way to set up test environment and provide dependencies. They enable:
- Test isolation
- Reusable test setup
- Dependency injection
- Automatic cleanup

**Creating custom fixtures:**
```typescript
// fixtures.ts
import { test as base } from '@playwright/test';

type MyFixtures = {
  authenticatedPage: Page;
  testData: { username: string; password: string };
};

export const test = base.extend<MyFixtures>({
  testData: async ({}, use) => {
    const data = {
      username: process.env.TEST_USER || 'test@example.com',
      password: process.env.TEST_PASS || 'password123'
    };
    await use(data);
  },

  authenticatedPage: async ({ page, testData }, use) => {
    await page.goto('/login');
    await page.fill('#username', testData.username);
    await page.fill('#password', testData.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await use(page);

    // Cleanup
    await page.goto('/logout');
  }
});

// test.spec.ts
import { test } from './fixtures';

test('dashboard test', async ({ authenticatedPage }) => {
  await expect(authenticatedPage.locator('h1')).toContainText('Dashboard');
});
```

### Q7: How do you perform API testing in Playwright?

**Expected Response:**
Playwright provides a built-in API testing context:

```typescript
import { test, expect } from '@playwright/test';

test('API test example', async ({ request }) => {
  // GET request
  const response = await request.get('/api/users/1');
  expect(response.ok()).toBeTruthy();
  const user = await response.json();
  expect(user.id).toBe(1);

  // POST request
  const createResponse = await request.post('/api/users', {
    data: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer token123'
    }
  });
  expect(createResponse.status()).toBe(201);

  // PUT request
  await request.put('/api/users/1', {
    data: { name: 'Jane Doe' }
  });

  // DELETE request
  const deleteResponse = await request.delete('/api/users/1');
  expect(deleteResponse.ok()).toBeTruthy();
});
```

### Q8: Explain how to handle file uploads and downloads in Playwright.

**Expected Response:**

**File Uploads:**
```typescript
// Simple upload
await page.setInputFiles('input[type="file"]', 'path/to/file.pdf');

// Multiple files
await page.setInputFiles('input[type="file"]', [
  'file1.pdf',
  'file2.pdf'
]);

// Buffer upload
await page.setInputFiles('input[type="file"]', {
  name: 'file.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from('file content')
});

// Remove files
await page.setInputFiles('input[type="file"]', []);
```

**File Downloads:**
```typescript
test('download file', async ({ page }) => {
  // Start waiting for download before clicking
  const downloadPromise = page.waitForEvent('download');
  await page.click('a.download-link');

  const download = await downloadPromise;

  // Get download properties
  const fileName = download.suggestedFilename();
  const filePath = await download.path();

  // Save to specific location
  await download.saveAs('/path/to/save/' + fileName);

  // Verify download
  expect(fileName).toBe('report.pdf');
});
```

### Q9: How do you handle iframes in Playwright?

**Expected Response:**
```typescript
// Method 1: Using frameLocator (recommended)
const frame = page.frameLocator('iframe[title="Payment"]');
await frame.locator('#card-number').fill('4242424242424242');

// Method 2: Using frame() with name or URL
const frameByName = page.frame('payment-frame');
await frameByName?.locator('#card-number').fill('4242424242424242');

// Method 3: Using frame() with selector
const frameElement = await page.waitForSelector('iframe.payment');
const frame = await frameElement.contentFrame();
await frame?.locator('#card-number').fill('4242424242424242');

// Nested iframes
const parentFrame = page.frameLocator('iframe#parent');
const childFrame = parentFrame.frameLocator('iframe#child');
await childFrame.locator('button').click();
```

### Q10: What strategies do you use for test data management in Playwright?

**Expected Response:**
Multiple approaches for effective test data management:

1. **JSON/CSV files**:
```typescript
import testData from './data/users.json';

test('login with various users', async ({ page }) => {
  for (const user of testData.users) {
    await page.goto('/login');
    await page.fill('#username', user.username);
    await page.fill('#password', user.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
    await page.click('.logout');
  }
});
```

2. **Environment variables**:
```typescript
test('use env config', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'http://localhost:3000');
  await page.fill('#username', process.env.TEST_USER!);
});
```

3. **Test parameterization**:
```typescript
const users = [
  { username: 'user1@test.com', role: 'admin' },
  { username: 'user2@test.com', role: 'user' },
];

for (const user of users) {
  test(`test for ${user.role}`, async ({ page }) => {
    await page.fill('#username', user.username);
    // ...
  });
}
```

4. **Faker library for dynamic data**:
```typescript
import { faker } from '@faker-js/faker';

test('create user with random data', async ({ page }) => {
  await page.fill('#name', faker.person.fullName());
  await page.fill('#email', faker.internet.email());
  await page.fill('#phone', faker.phone.number());
});
```

---

## MCP (Model Context Protocol)

### Q11: What is MCP (Model Context Protocol) and how does it relate to testing?

**Expected Response:**
MCP (Model Context Protocol) is an open protocol developed by Anthropic that standardizes how AI applications connect to data sources and tools. In the context of testing:

**Key Concepts:**
- MCP enables AI assistants (like Claude) to interact with external systems through standardized servers
- Acts as a bridge between AI models and testing tools/data
- Provides context to AI for better test generation and maintenance

**Testing Applications:**
1. **Test Generation**: AI can access application code and generate relevant test cases
2. **Test Data Management**: MCP servers can provide test data from databases or APIs
3. **Tool Integration**: Connect testing frameworks (Playwright, Jest) with AI assistants
4. **Documentation Access**: AI can reference API documentation to create accurate tests

**Example MCP Server for Testing:**
```typescript
// MCP server that provides test helpers
import { McpServer } from '@modelcontextprotocol/sdk';

const server = new McpServer({
  name: 'playwright-testing-server',
  version: '1.0.0',
});

server.tool('generate_test_data', async (params) => {
  return {
    users: generateMockUsers(params.count),
    products: generateMockProducts(params.count)
  };
});

server.tool('run_playwright_test', async (params) => {
  const result = await execPlaywrightTest(params.testFile);
  return { status: result.status, output: result.output };
});
```

### Q12: How would you set up an MCP server for Playwright test automation?

**Expected Response:**
Setting up an MCP server involves creating tools and resources that AI can use to assist with testing:

**1. Server Structure:**
```json
{
  "mcpServers": {
    "playwright-automation": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"],
      "env": {
        "PLAYWRIGHT_CONFIG": "./playwright.config.ts"
      }
    }
  }
}
```

**2. Available Tools:**
- `run_test`: Execute specific test files
- `generate_locator`: Create robust selectors
- `debug_test`: Run tests with trace viewer
- `get_test_results`: Fetch test execution results

**3. Resources Provided:**
- Test files and structure
- Playwright configuration
- Test data files
- Page object models

**Benefits:**
- AI-assisted test creation
- Intelligent test debugging
- Automated test maintenance
- Context-aware test suggestions

### Q13: How can AI and MCP improve test automation workflows?

**Expected Response:**

**1. Test Generation:**
- AI analyzes application code and generates comprehensive test cases
- Creates edge case scenarios based on code analysis
- Generates test data that covers boundary conditions

**2. Test Maintenance:**
- AI detects UI changes and suggests locator updates
- Automatically updates page object models
- Identifies flaky tests and suggests fixes

**3. Intelligent Debugging:**
```typescript
// AI can analyze failed test traces
// MCP provides access to:
- Test execution traces
- Screenshots at failure points
- Network logs
- Console errors
- Stack traces

// AI suggests fixes based on:
- Error patterns
- Similar past failures
- Code changes
```

**4. Documentation and Reporting:**
- Auto-generate test documentation
- Create human-readable test reports
- Explain complex test scenarios

**5. Code Review:**
- AI reviews test code for best practices
- Suggests improvements for test reliability
- Identifies missing test coverage

---

## AI for Testing

### Q14: How can AI/LLMs be leveraged for test automation?

**Expected Response:**
AI and Large Language Models can enhance test automation in multiple ways:

**1. Test Case Generation:**
```typescript
// AI can generate test cases from requirements
Input: "User should be able to add items to cart"
Output:
- Test adding single item
- Test adding multiple items
- Test adding same item twice
- Test adding item with out of stock status
- Test cart total calculation
- Test removing items from cart
```

**2. Smart Locator Generation:**
- AI analyzes DOM structure to suggest robust selectors
- Generates multiple fallback locators
- Prioritizes accessible locators (ARIA, roles)

**3. Visual Testing:**
- AI-powered visual regression detection
- Intelligent screenshot comparison (ignoring dynamic content)
- Anomaly detection in UI

**4. Test Data Generation:**
```typescript
// AI generates realistic test data
const testData = generateWithAI({
  schema: {
    firstName: 'string',
    lastName: 'string',
    email: 'email',
    age: 'number (18-65)'
  },
  count: 100,
  locale: 'en-US'
});
```

**5. Self-Healing Tests:**
- AI detects when locators break
- Automatically suggests or applies fixes
- Learns from test execution patterns

**6. Test Analysis and Insights:**
- Identifies patterns in test failures
- Suggests root cause of flaky tests
- Recommends test coverage improvements

### Q15: What are the challenges and limitations of using AI in test automation?

**Expected Response:**

**Challenges:**

1. **Accuracy and Reliability:**
- AI-generated tests may miss edge cases
- Can produce false positives in test scenarios
- Requires validation by human testers

2. **Context Understanding:**
- AI may not understand business logic fully
- Domain-specific requirements need human input
- Complex user workflows require guidance

3. **Maintenance:**
- AI-generated code needs review and maintenance
- Updates to AI models may change behavior
- Version control of AI-assisted changes

4. **Security and Privacy:**
- Sharing application code with AI services
- Protecting sensitive test data
- Compliance requirements (GDPR, HIPAA)

5. **Cost:**
- API costs for AI services
- Processing time for large codebases
- Infrastructure requirements

**Best Practices:**

1. **Human-in-the-Loop:**
```typescript
// AI suggests, human reviews
const aiGeneratedTests = await generateTests(requirements);
const reviewedTests = await humanReview(aiGeneratedTests);
await commitTests(reviewedTests);
```

2. **Validation:**
- Always validate AI-generated tests
- Run tests in isolated environment first
- Monitor test effectiveness over time

3. **Hybrid Approach:**
- Use AI for repetitive tasks
- Human expertise for complex scenarios
- AI assists, doesn't replace testers

### Q16: How would you implement AI-powered visual regression testing?

**Expected Response:**

**Implementation Strategy:**

1. **Traditional Pixel Comparison:**
```typescript
import { test, expect } from '@playwright/test';

test('visual regression', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveScreenshot('dashboard.png', {
    maxDiffPixels: 100,
  });
});
```

2. **AI-Enhanced Visual Testing:**
```typescript
import { test } from '@playwright/test';
import { aiVisualCompare } from './ai-visual-helper';

test('AI visual regression', async ({ page }) => {
  await page.goto('/dashboard');
  const screenshot = await page.screenshot();

  const result = await aiVisualCompare({
    current: screenshot,
    baseline: 'baseline/dashboard.png',
    ignoreRegions: [
      { selector: '.timestamp' },
      { selector: '.dynamic-ad' }
    ],
    sensitivity: 'medium', // AI determines acceptable differences
    detectLayoutShifts: true,
    detectColorChanges: true,
  });

  expect(result.passed).toBeTruthy();
  if (!result.passed) {
    console.log('Differences:', result.differences);
    console.log('AI Analysis:', result.analysis);
  }
});
```

3. **Smart Ignore Patterns:**
- AI learns what to ignore (ads, timestamps, user-specific content)
- Focuses on critical UI elements
- Adapts to acceptable variations

4. **Anomaly Detection:**
- AI identifies unexpected UI changes
- Detects broken layouts
- Flags accessibility issues

---

## BrowserStack

### Q17: What is BrowserStack and how do you integrate it with Playwright?

**Expected Response:**
BrowserStack is a cloud-based cross-browser testing platform that allows testing on real devices and browsers without maintaining local infrastructure.

**Key Features:**
- Real device cloud (3000+ real devices)
- Desktop and mobile browser testing
- Automated and manual testing
- Parallel test execution
- Visual testing and debugging tools
- Network simulation and geolocation testing

**Playwright Integration:**

**1. Configuration:**
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const caps = {
  browser: 'chrome',
  os: 'osx',
  os_version: 'catalina',
  name: 'Playwright Test',
  build: 'playwright-browserstack',
  'browserstack.username': process.env.BROWSERSTACK_USERNAME,
  'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
};

export default defineConfig({
  use: {
    connectOptions: {
      wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`
    }
  },
  projects: [
    {
      name: 'chrome-mac',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'iphone-13',
      use: {
        ...devices['iPhone 13'],
      },
    },
  ],
});
```

**2. Test Execution:**
```typescript
import { test, expect } from '@playwright/test';

test('BrowserStack test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);

  // Mark test status on BrowserStack
  await page.evaluate(() => {},
    `browserstack_executor: ${JSON.stringify({
      action: 'setSessionStatus',
      arguments: { status: 'passed', reason: 'Test completed successfully' }
    })}`
  );
});
```

**3. Local Testing:**
```bash
# Start BrowserStack Local
./BrowserStackLocal --key YOUR_ACCESS_KEY

# Configure local testing
"browserstack.local": "true",
"browserstack.localIdentifier": "unique_id"
```

### Q18: How do you handle parallel testing on BrowserStack with Playwright?

**Expected Response:**

**1. Configure Parallel Execution:**
```typescript
// playwright.config.ts
export default defineConfig({
  workers: 5, // Run 5 parallel tests
  fullyParallel: true,

  projects: [
    { name: 'chrome-windows', use: { /* caps */ } },
    { name: 'chrome-mac', use: { /* caps */ } },
    { name: 'firefox-windows', use: { /* caps */ } },
    { name: 'safari-mac', use: { /* caps */ } },
    { name: 'edge-windows', use: { /* caps */ } },
  ],
});
```

**2. Optimize for BrowserStack:**
```typescript
// Consider BrowserStack parallel limit
const maxParallel = parseInt(process.env.BROWSERSTACK_PARALLEL_LIMIT || '5');

export default defineConfig({
  workers: maxParallel,

  use: {
    // Optimize timeouts for cloud testing
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
});
```

**3. Session Management:**
```typescript
test.beforeEach(async ({ page }) => {
  // Set BrowserStack session name
  await page.evaluate(() => {},
    `browserstack_executor: ${JSON.stringify({
      action: 'setSessionName',
      arguments: { name: test.info().title }
    })}`
  );
});

test.afterEach(async ({ page }, testInfo) => {
  // Mark test status
  const status = testInfo.status === 'passed' ? 'passed' : 'failed';
  await page.evaluate(() => {},
    `browserstack_executor: ${JSON.stringify({
      action: 'setSessionStatus',
      arguments: {
        status,
        reason: testInfo.error?.message || 'Test completed'
      }
    })}`
  );
});
```

**4. Cost Optimization:**
- Group related tests
- Use efficient selectors
- Minimize unnecessary waits
- Cache authentication states
- Use BrowserStack's automate plan limits wisely

### Q19: How do you debug failed tests on BrowserStack?

**Expected Response:**

**1. BrowserStack Dashboard Features:**
- Video recordings of test execution
- Screenshots at each step
- Console logs (browser and network)
- Selenium/Playwright logs
- Network HAR files

**2. Enable Debugging in Tests:**
```typescript
test('debug example', async ({ page }) => {
  // Enable console message capture
  page.on('console', msg => console.log('Browser log:', msg.text()));

  // Enable detailed logging
  await page.goto('https://example.com', {
    waitUntil: 'networkidle'
  });

  // Take screenshots for debugging
  await page.screenshot({
    path: `debug-${Date.now()}.png`,
    fullPage: true
  });

  // Mark debugging points
  await page.evaluate(() => {},
    `browserstack_executor: ${JSON.stringify({
      action: 'annotate',
      arguments: {
        data: 'Checkpoint: Before form submission',
        level: 'info'
      }
    })}`
  );
});
```

**3. Local Debugging with BrowserStack:**
```typescript
// Use BrowserStack Local for debugging
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
```

**4. Access BrowserStack Test Results:**
```typescript
// Retrieve test session details via API
const getBrowserStackSession = async (sessionId: string) => {
  const auth = Buffer.from(
    `${process.env.BROWSERSTACK_USERNAME}:${process.env.BROWSERSTACK_ACCESS_KEY}`
  ).toString('base64');

  const response = await fetch(
    `https://api.browserstack.com/automate/sessions/${sessionId}.json`,
    { headers: { 'Authorization': `Basic ${auth}` } }
  );

  return response.json();
};
```

---

## Azure DevOps (ADO)

### Q20: How do you integrate Playwright tests with Azure DevOps pipelines?

**Expected Response:**

**1. Azure Pipeline YAML Configuration:**
```yaml
# azure-pipelines.yml
trigger:
  - main
  - develop

pool:
  vmImage: 'ubuntu-latest'

variables:
  NODE_VERSION: '18.x'

stages:
  - stage: Test
    jobs:
      - job: PlaywrightTests
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: $(NODE_VERSION)
            displayName: 'Install Node.js'

          - script: npm ci
            displayName: 'Install dependencies'

          - script: npx playwright install --with-deps
            displayName: 'Install Playwright browsers'

          - script: npm run test
            displayName: 'Run Playwright tests'
            env:
              BASE_URL: $(BASE_URL)
              TEST_USER: $(TEST_USER)
              TEST_PASSWORD: $(TEST_PASSWORD)

          - task: PublishTestResults@2
            displayName: 'Publish test results'
            inputs:
              testResultsFormat: 'JUnit'
              testResultsFiles: '**/test-results/junit.xml'
              failTaskOnFailedTests: true
            condition: always()

          - task: PublishPipelineArtifact@1
            displayName: 'Publish test artifacts'
            inputs:
              targetPath: 'playwright-report'
              artifact: 'playwright-report'
            condition: always()
```

**2. Reporter Configuration for ADO:**
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],

  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
});
```

**3. Multi-environment Configuration:**
```yaml
parameters:
  - name: environment
    type: string
    default: 'dev'
    values:
      - dev
      - staging
      - prod

jobs:
  - job: Test_${{ parameters.environment }}
    variables:
      - group: 'playwright-${{ parameters.environment }}'
    steps:
      - script: npm run test:${{ parameters.environment }}
        env:
          BASE_URL: $(BASE_URL)
```

### Q21: How do you manage test environments and secrets in Azure DevOps?

**Expected Response:**

**1. Variable Groups:**
```yaml
# Reference variable group in pipeline
variables:
  - group: 'playwright-test-secrets'
  - group: 'environment-config'

# Use variables in scripts
- script: |
    echo "Running tests against $(BASE_URL)"
    npm run test
  env:
    BASE_URL: $(BASE_URL)
    API_KEY: $(API_KEY)
    BROWSERSTACK_USERNAME: $(BROWSERSTACK_USERNAME)
    BROWSERSTACK_ACCESS_KEY: $(BROWSERSTACK_ACCESS_KEY)
```

**2. Environment-specific Configurations:**
```yaml
# Multi-stage pipeline with environments
stages:
  - stage: Test_Dev
    variables:
      - group: 'dev-config'
    jobs:
      - job: PlaywrightTests
        steps:
          - script: npm run test
            env:
              ENV: 'dev'

  - stage: Test_Staging
    dependsOn: Test_Dev
    variables:
      - group: 'staging-config'
    jobs:
      - deployment: PlaywrightTests
        environment: 'staging'
        strategy:
          runOnce:
            deploy:
              steps:
                - script: npm run test
                  env:
                    ENV: 'staging'
```

**3. Azure Key Vault Integration:**
```yaml
variables:
  - group: 'playwright-keyvault'  # Linked to Azure Key Vault

steps:
  - task: AzureKeyVault@2
    inputs:
      azureSubscription: 'Azure Subscription'
      KeyVaultName: 'my-test-keyvault'
      SecretsFilter: '*'
      RunAsPreJob: true

  - script: npm run test
    env:
      TEST_PASSWORD: $(test-user-password)  # From Key Vault
```

**4. Secure File Storage:**
```yaml
steps:
  - task: DownloadSecureFile@1
    name: authFile
    inputs:
      secureFile: 'auth-state.json'

  - script: |
      cp $(authFile.secureFilePath) ./auth/state.json
      npm run test
```

### Q22: How do you implement test reporting and notifications in Azure DevOps?

**Expected Response:**

**1. Test Results Publishing:**
```yaml
- task: PublishTestResults@2
  displayName: 'Publish Playwright Test Results'
  inputs:
    testResultsFormat: 'JUnit'
    testResultsFiles: '**/junit.xml'
    searchFolder: '$(System.DefaultWorkingDirectory)/test-results'
    mergeTestResults: true
    failTaskOnFailedTests: true
    testRunTitle: 'Playwright E2E Tests - $(Build.BuildNumber)'
    publishRunAttachments: true
  condition: always()
```

**2. HTML Report Publishing:**
```yaml
- task: PublishPipelineArtifact@1
  displayName: 'Publish HTML Report'
  inputs:
    targetPath: 'playwright-report'
    artifact: 'playwright-html-report-$(Build.BuildNumber)'
    publishLocation: 'pipeline'
  condition: always()

# Or publish to Azure Blob Storage
- task: AzureFileCopy@4
  displayName: 'Upload Report to Azure Storage'
  inputs:
    SourcePath: 'playwright-report'
    azureSubscription: 'Azure Subscription'
    Destination: 'AzureBlob'
    storage: 'testreportsstorage'
    ContainerName: 'playwright-reports'
  condition: always()
```

**3. Email Notifications:**
```yaml
- task: SendEmail@1
  displayName: 'Send test failure notification'
  inputs:
    To: 'qa-team@company.com'
    From: 'devops@company.com'
    Subject: 'Playwright Tests Failed - Build $(Build.BuildNumber)'
    Body: |
      Build: $(Build.BuildNumber)
      Status: Failed
      Branch: $(Build.SourceBranch)

      View Results: $(System.TeamFoundationCollectionUri)$(System.TeamProject)/_build/results?buildId=$(Build.BuildId)
  condition: failed()
```

**4. Slack/Teams Integration:**
```yaml
- task: PowerShell@2
  displayName: 'Send Teams notification'
  inputs:
    targetType: 'inline'
    script: |
      $body = @{
        "@type" = "MessageCard"
        "summary" = "Playwright Test Results"
        "sections" = @(
          @{
            "activityTitle" = "Test Run Completed"
            "activitySubtitle" = "Build $(Build.BuildNumber)"
            "facts" = @(
              @{ "name" = "Status"; "value" = "$(Agent.JobStatus)" }
              @{ "name" = "Branch"; "value" = "$(Build.SourceBranch)" }
              @{ "name" = "Triggered By"; "value" = "$(Build.RequestedFor)" }
            )
          }
        )
        "potentialAction" = @(
          @{
            "@type" = "OpenUri"
            "name" = "View Results"
            "targets" = @(
              @{ "os" = "default"; "uri" = "$(System.TeamFoundationCollectionUri)$(System.TeamProject)/_build/results?buildId=$(Build.BuildId)" }
            )
          }
        )
      } | ConvertTo-Json -Depth 10

      Invoke-RestMethod -Uri '$(TEAMS_WEBHOOK_URL)' -Method Post -Body $body -ContentType 'application/json'
  condition: always()
```

**5. Custom Test Summary:**
```typescript
// custom-reporter.ts
import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

class ADOReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'failed') {
      console.log(`##vso[task.logissue type=error]Test failed: ${test.title}`);
      console.log(`##vso[task.logissue type=error]Error: ${result.error?.message}`);
    }
  }

  onEnd() {
    console.log(`##vso[task.complete result=Succeeded]Tests completed`);
  }
}

export default ADOReporter;
```

---

## CI/CD Concepts

### Q23: What are the key principles of CI/CD and how do they apply to test automation?

**Expected Response:**

**Continuous Integration (CI):**
- Developers merge code frequently (multiple times per day)
- Each merge triggers automated build and test
- Fast feedback on code quality
- Early detection of integration issues

**Continuous Delivery/Deployment (CD):**
- Code is always in deployable state
- Automated deployment to staging/production
- Minimal manual intervention

**Application to Test Automation:**

**1. Test Pyramid in CI/CD:**
```
         /\
        /E2E\      <- Few (slow, comprehensive)
       /______\
      /  API  \    <- More (faster, focused)
     /________\
    /   Unit   \   <- Many (fast, isolated)
   /___________\
```

**2. CI/CD Pipeline Stages:**
```yaml
stages:
  - Lint & Type Check (seconds)
  - Unit Tests (1-2 minutes)
  - Integration Tests (5-10 minutes)
  - API Tests (5-10 minutes)
  - E2E Tests - Critical Path (10-15 minutes)
  - E2E Tests - Full Suite (parallel, 20-30 minutes)
  - Visual Regression Tests (10-15 minutes)
  - Performance Tests (optional)
  - Deploy to Staging
  - Smoke Tests on Staging
  - Deploy to Production
```

**3. Best Practices:**
- **Fast Feedback**: Run critical tests first
- **Parallel Execution**: Reduce total run time
- **Test Isolation**: Tests don't depend on each other
- **Deterministic Tests**: Same result every time
- **Fail Fast**: Stop on first critical failure
- **Automatic Retry**: Handle flaky tests intelligently

### Q24: How do you handle flaky tests in a CI/CD pipeline?

**Expected Response:**

**Identification:**
```typescript
// playwright.config.ts
export default defineConfig({
  // Retry failed tests
  retries: process.env.CI ? 2 : 0,

  // Report flaky tests
  reporter: [
    ['html'],
    ['junit', { outputFile: 'results.xml' }],
    ['json', { outputFile: 'test-results.json' }],
  ],
});
```

**Root Causes and Solutions:**

**1. Timing Issues:**
```typescript
// ❌ Bad - race condition
await page.click('button');
const text = await page.locator('.result').textContent();

// ✅ Good - auto-waiting
await page.click('button');
await expect(page.locator('.result')).toHaveText('Success');
```

**2. Test Dependencies:**
```typescript
// ❌ Bad - tests depend on order
test('create user', async () => { /* creates user */ });
test('delete user', async () => { /* deletes same user */ });

// ✅ Good - isolated tests
test('create user', async ({ page }) => {
  const userId = generateUniqueId();
  await createUser(userId);
  // cleanup
  await deleteUser(userId);
});
```

**3. External Dependencies:**
```typescript
// ❌ Bad - relies on external service
await fetch('https://external-api.com/data');

// ✅ Good - mock external calls
await page.route('**/api/**', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify(mockData)
  });
});
```

**4. CI/CD Strategy for Flaky Tests:**
```yaml
# Quarantine flaky tests
- script: npm run test:stable
  displayName: 'Run stable tests'

- script: npm run test:flaky
  displayName: 'Run quarantined tests'
  continueOnError: true  # Don't fail build

# Track flaky test metrics
- script: |
    npm run analyze-flaky-tests
    # Report to monitoring system
  displayName: 'Analyze flaky tests'
```

**5. Monitoring and Metrics:**
```typescript
// Track test stability
interface TestMetrics {
  testName: string;
  totalRuns: number;
  failures: number;
  flakyRate: number;
  avgDuration: number;
}

// Flag tests with >5% flaky rate
const flakyTests = metrics.filter(m => m.flakyRate > 0.05);
```

### Q25: How do you optimize CI/CD pipeline execution time for test automation?

**Expected Response:**

**1. Parallel Execution:**
```yaml
# Azure Pipelines
strategy:
  parallel: 5  # Run 5 jobs in parallel

jobs:
  - job: TestShard
    strategy:
      matrix:
        shard_1: { SHARD: '1/5' }
        shard_2: { SHARD: '2/5' }
        shard_3: { SHARD: '3/5' }
        shard_4: { SHARD: '4/5' }
        shard_5: { SHARD: '5/5' }
    steps:
      - script: npx playwright test --shard=$(SHARD)
```

```typescript
// Playwright sharding
export default defineConfig({
  workers: 5,
  fullyParallel: true,
});
```

**2. Selective Test Execution:**
```yaml
# Run only affected tests
- script: |
    git diff --name-only origin/main...HEAD > changed-files.txt
    npm run test:affected
  displayName: 'Run tests for changed files'
```

**3. Caching Dependencies:**
```yaml
# Cache node_modules
- task: Cache@2
  inputs:
    key: 'npm | "$(Agent.OS)" | package-lock.json'
    path: 'node_modules'
    restoreKeys: |
      npm | "$(Agent.OS)"
  displayName: 'Cache npm packages'

# Cache Playwright browsers
- task: Cache@2
  inputs:
    key: 'playwright | "$(Agent.OS)" | package-lock.json'
    path: '~/.cache/ms-playwright'
    restoreKeys: |
      playwright | "$(Agent.OS)"
  displayName: 'Cache Playwright browsers'
```

**4. Test Categorization:**
```typescript
// Tag tests by priority
test.describe('critical', () => {
  test('user login', async ({ page }) => { /* */ });
});

test.describe('smoke', () => {
  test('homepage loads', async ({ page }) => { /* */ });
});

test.describe('full', () => {
  test('complex workflow', async ({ page }) => { /* */ });
});
```

```yaml
# Run different test suites at different stages
- script: npx playwright test --grep @critical
  displayName: 'Critical tests (on every commit)'

- script: npx playwright test --grep @smoke
  displayName: 'Smoke tests (on merge to main)'

- script: npx playwright test
  displayName: 'Full test suite (nightly)'
  condition: eq(variables['Build.Reason'], 'Schedule')
```

**5. Resource Optimization:**
```typescript
export default defineConfig({
  // Limit parallel workers based on resources
  workers: process.env.CI ? 2 : undefined,

  // Optimize for CI environment
  use: {
    // Disable video in CI for speed
    video: 'off',
    // Only screenshot on failure
    screenshot: 'only-on-failure',
    // Reduce trace overhead
    trace: 'retain-on-failure',
  },
});
```

**6. Performance Metrics:**
```yaml
- script: |
    echo "Test duration: $SECONDS seconds"
    echo "##vso[task.setvariable variable=TestDuration]$SECONDS"
  displayName: 'Track test duration'

- task: PublishBuildArtifacts@1
  inputs:
    pathtoPublish: 'performance-metrics.json'
    artifactName: 'metrics'
```

---

## Scenario-Based Questions

### Q26: You have a test suite that takes 2 hours to run. How would you reduce this time?

**Expected Response:**

**Analysis Phase:**
1. Profile current test execution
2. Identify bottlenecks (slow tests, sequential execution, setup/teardown)
3. Categorize tests by criticality

**Optimization Strategy:**

**1. Immediate Wins (0-2 weeks):**
```typescript
// Enable parallel execution
export default defineConfig({
  workers: process.env.CI ? 10 : 5,
  fullyParallel: true,

  // Remove unnecessary waits
  use: {
    actionTimeout: 5000, // Reduced from default
  },
});

// Result: 2 hours → 30 minutes (4x improvement)
```

**2. Test Optimization (2-4 weeks):**
```typescript
// Before: Each test logs in (100 tests × 5 seconds = 500 seconds)
test('test 1', async ({ page }) => {
  await login(page);  // 5 seconds
  await doTest(page); // 2 seconds
});

// After: Shared authentication state
test.use({ storageState: 'auth.json' });
test('test 1', async ({ page }) => {
  await doTest(page); // 2 seconds only
});

// Savings: 100 tests × 5 seconds = 8.3 minutes saved
```

**3. Selective Execution (ongoing):**
```yaml
# Critical path tests (5 minutes) - run on every PR
- script: npx playwright test --grep @critical

# Full suite (30 minutes) - run on merge to main
- script: npx playwright test --grep-invert @slow

# Complete suite (30 minutes) - nightly
- script: npx playwright test
  condition: eq(variables['Build.Reason'], 'Schedule')
```

**4. Infrastructure (if budget allows):**
- Use BrowserStack for parallel execution (10-20 concurrent sessions)
- Upgrade CI/CD runners (more CPU/RAM)
- Implement test sharding across multiple agents

**Expected Results:**
- Week 1: 2 hours → 30 minutes (parallel execution)
- Week 3: 30 minutes → 20 minutes (auth optimization)
- Week 4: 20 minutes → 15 minutes (selective execution)
- Final: Critical tests in 5 minutes, full suite in 15 minutes

### Q27: A test passes locally but fails in CI. How do you debug this?

**Expected Response:**

**Common Causes and Solutions:**

**1. Timing/Race Conditions:**
```typescript
// Issue: CI environment is slower
// Solution: Increase timeouts and use better waits

export default defineConfig({
  use: {
    // Increase timeouts for CI
    actionTimeout: process.env.CI ? 15000 : 5000,
    navigationTimeout: process.env.CI ? 30000 : 10000,
  },
});

// Replace hard waits with smart waits
// ❌ await page.waitForTimeout(1000);
// ✅ await page.waitForLoadState('networkidle');
```

**2. Environment Differences:**
```typescript
// Check environment variables
test('debug env', async () => {
  console.log('BASE_URL:', process.env.BASE_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('CI:', process.env.CI);
});

// Ensure consistent environment
// .env.ci
BASE_URL=https://staging.example.com
API_URL=https://api.staging.example.com
```

**3. Screen Resolution:**
```typescript
// CI may have different viewport
export default defineConfig({
  use: {
    viewport: { width: 1280, height: 720 },  // Explicit size
  },
});
```

**4. Missing Dependencies:**
```yaml
# Ensure all dependencies installed
- script: npx playwright install --with-deps
  displayName: 'Install Playwright with system dependencies'
```

**5. Debug Artifacts:**
```typescript
// Enable full debugging in CI
export default defineConfig({
  use: {
    trace: process.env.CI ? 'on' : 'on-first-retry',
    video: process.env.CI ? 'on' : 'retain-on-failure',
    screenshot: 'on',
  },
});
```

**6. Reproduce Locally:**
```bash
# Run with CI environment variables
CI=true npm run test

# Run in Docker (same as CI)
docker run -it --rm -v $(pwd):/app -w /app mcr.microsoft.com/playwright:v1.40.0-focal npm test
```

**Debugging Workflow:**
1. Download CI artifacts (traces, screenshots, videos)
2. Open trace in Playwright Trace Viewer
3. Check console logs and network requests
4. Compare local vs CI environment settings
5. Add detailed logging at failure point
6. Run test multiple times in CI to check for flakiness

### Q28: How would you design a test automation framework from scratch for a new project?

**Expected Response:**

**Phase 1: Requirements & Planning**

**1. Understand Requirements:**
- Application type (web, mobile, API)
- Technology stack
- Test types needed (E2E, API, visual, performance)
- Team size and skill level
- CI/CD integration needs
- Reporting requirements

**2. Technology Selection:**
```
Framework: Playwright (cross-browser, modern, maintained)
Language: TypeScript (type safety, better IDE support)
Test Runner: Built-in Playwright Test
Reporting: HTML, JUnit, Allure
CI/CD: Azure DevOps / GitHub Actions
Version Control: Git
```

**Phase 2: Project Structure**

```
project/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── tests/
│   ├── e2e/
│   │   ├── auth/
│   │   ├── checkout/
│   │   └── search/
│   ├── api/
│   └── visual/
├── pages/
│   ├── LoginPage.ts
│   ├── HomePage.ts
│   └── BasePage.ts
├── fixtures/
│   └── customFixtures.ts
├── helpers/
│   ├── apiHelper.ts
│   ├── dbHelper.ts
│   └── testDataHelper.ts
├── config/
│   ├── dev.config.ts
│   ├── staging.config.ts
│   └── prod.config.ts
├── data/
│   ├── testUsers.json
│   └── testProducts.json
├── utils/
│   ├── logger.ts
│   └── reporter.ts
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

**Phase 3: Core Implementation**

**1. Base Configuration:**
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['html'],
    ['junit', { outputFile: 'results.xml' }],
    ['list'],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },
  ],
});
```

**2. Page Object Model:**
```typescript
// pages/BasePage.ts
export class BasePage {
  constructor(protected page: Page) {}

  async navigate(path: string) {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
}

// pages/LoginPage.ts
export class LoginPage extends BasePage {
  private readonly usernameInput = () => this.page.locator('#username');
  private readonly passwordInput = () => this.page.locator('#password');
  private readonly loginButton = () => this.page.locator('button[type="submit"]');

  async login(username: string, password: string) {
    await this.usernameInput().fill(username);
    await this.passwordInput().fill(password);
    await this.loginButton().click();
    await this.waitForPageLoad();
  }
}
```

**3. Custom Fixtures:**
```typescript
// fixtures/customFixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type MyFixtures = {
  loginPage: LoginPage;
  authenticatedPage: Page;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  authenticatedPage: async ({ page }, use) => {
    // Auto-login for tests that need it
    const loginPage = new LoginPage(page);
    await loginPage.navigate('/login');
    await loginPage.login(
      process.env.TEST_USER!,
      process.env.TEST_PASSWORD!
    );
    await use(page);
  },
});
```

**4. Test Data Management:**
```typescript
// helpers/testDataHelper.ts
import { faker } from '@faker-js/faker';

export class TestDataHelper {
  static generateUser() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
    };
  }

  static loadTestData(filename: string) {
    return JSON.parse(
      fs.readFileSync(`./data/${filename}`, 'utf-8')
    );
  }
}
```

**Phase 4: CI/CD Integration**

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run tests
        run: npm test
        env:
          BASE_URL: ${{ secrets.BASE_URL }}

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

**Phase 5: Best Practices & Guidelines**

Create documentation:
- README with setup instructions
- Contributing guidelines
- Test writing standards
- Code review checklist
- Troubleshooting guide

**Key Principles:**
1. **Maintainability**: Easy to update when UI changes
2. **Readability**: Tests as documentation
3. **Reliability**: No flaky tests
4. **Speed**: Fast feedback
5. **Scalability**: Easy to add new tests

### Q29: How do you handle testing in different environments (dev, staging, production)?

**Expected Response:**

**1. Configuration Management:**

```typescript
// config/environments.ts
export const environments = {
  dev: {
    baseURL: 'https://dev.example.com',
    apiURL: 'https://api-dev.example.com',
    timeout: 10000,
  },
  staging: {
    baseURL: 'https://staging.example.com',
    apiURL: 'https://api-staging.example.com',
    timeout: 15000,
  },
  prod: {
    baseURL: 'https://example.com',
    apiURL: 'https://api.example.com',
    timeout: 20000,
    // Production-specific settings
    slowMo: 100, // Slower execution for production
  },
};

export const getConfig = (env: string) => {
  return environments[env as keyof typeof environments] || environments.dev;
};
```

```typescript
// playwright.config.ts
const environment = process.env.TEST_ENV || 'dev';
const config = getConfig(environment);

export default defineConfig({
  use: {
    baseURL: config.baseURL,
    actionTimeout: config.timeout,
  },
});
```

**2. Environment-Specific Test Data:**

```typescript
// data/users.ts
export const testUsers = {
  dev: {
    admin: {
      username: 'admin@dev.com',
      password: process.env.DEV_ADMIN_PASS
    },
    user: {
      username: 'user@dev.com',
      password: process.env.DEV_USER_PASS
    },
  },
  staging: {
    admin: {
      username: 'admin@staging.com',
      password: process.env.STAGING_ADMIN_PASS
    },
  },
  prod: {
    // Production uses different auth (no password-based)
    admin: {
      apiKey: process.env.PROD_API_KEY
    },
  },
};

export const getTestUser = (role: string) => {
  const env = process.env.TEST_ENV || 'dev';
  return testUsers[env][role];
};
```

**3. Environment-Specific Test Selection:**

```typescript
// tests/smoke.spec.ts
test.describe('Smoke Tests', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Example/);
  });
});

// tests/full-suite.spec.ts
test.describe('Full Test Suite', () => {
  test.skip(
    () => process.env.TEST_ENV === 'prod',
    'Skipping destructive tests in production'
  );

  test('delete user', async ({ page }) => {
    // Only runs in dev/staging
  });
});

// tests/prod-only.spec.ts
test.describe('Production Monitoring', () => {
  test.skip(
    () => process.env.TEST_ENV !== 'prod',
    'Production-only tests'
  );

  test('check SSL certificate', async ({ page }) => {
    // Only runs in production
  });
});
```

**4. CI/CD Pipeline for Multiple Environments:**

```yaml
# azure-pipelines.yml
trigger:
  branches:
    include:
      - develop  # Triggers dev tests
      - main     # Triggers staging tests

stages:
  # Dev environment - on develop branch
  - stage: Test_Dev
    condition: eq(variables['Build.SourceBranch'], 'refs/heads/develop')
    jobs:
      - job: DevTests
        variables:
          TEST_ENV: 'dev'
        steps:
          - script: npm run test
            env:
              TEST_ENV: $(TEST_ENV)
              BASE_URL: $(DEV_BASE_URL)

  # Staging environment - on main branch
  - stage: Test_Staging
    condition: eq(variables['Build.SourceBranch'], 'refs/heads/main')
    jobs:
      - job: StagingTests
        variables:
          TEST_ENV: 'staging'
        steps:
          - script: npm run test
            env:
              TEST_ENV: $(TEST_ENV)
              BASE_URL: $(STAGING_BASE_URL)

  # Production smoke tests - after deployment
  - stage: Test_Production
    dependsOn: Deploy_Production
    jobs:
      - job: ProductionSmokeTests
        variables:
          TEST_ENV: 'prod'
        steps:
          - script: npm run test:smoke
            env:
              TEST_ENV: $(TEST_ENV)
              BASE_URL: $(PROD_BASE_URL)
```

**5. Production Testing Strategy:**

```typescript
// Production tests should be:
// - Non-destructive (read-only)
// - Minimal (smoke tests only)
// - Use production credentials securely
// - Monitor critical user journeys

test.describe('Production Health Check', () => {
  test('critical user journey', async ({ page }) => {
    // Use read-only test account
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();

    // Navigate through critical path
    await page.click('a.products');
    await expect(page).toHaveURL(/.*products/);

    // Don't actually purchase/modify data
    await page.click('.product:first-child');
    await expect(page.locator('.product-details')).toBeVisible();

    // Verify external integrations
    const apiResponse = await page.request.get('/api/health');
    expect(apiResponse.ok()).toBeTruthy();
  });
});
```

**6. Environment Validation:**

```typescript
// helpers/environmentValidator.ts
export async function validateEnvironment() {
  const env = process.env.TEST_ENV;
  const required = ['BASE_URL', 'API_URL'];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required env var: ${key} for ${env}`);
    }
  }

  // Verify environment is accessible
  const response = await fetch(process.env.BASE_URL + '/health');
  if (!response.ok) {
    throw new Error(`Environment ${env} is not accessible`);
  }
}

// globalSetup.ts
async function globalSetup() {
  await validateEnvironment();
}

export default globalSetup;
```

### Q30: Describe your approach to testing a complex multi-step workflow (e.g., e-commerce checkout).

**Expected Response:**

**Workflow: E-commerce Checkout**
Steps: Browse → Add to Cart → Checkout → Payment → Confirmation

**1. Test Strategy:**

**a) Happy Path (Priority 1):**
```typescript
test('complete checkout flow - happy path', async ({ page }) => {
  // Use Page Object Model for each step
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const paymentPage = new PaymentPage(page);
  const confirmationPage = new ConfirmationPage(page);

  // Step 1: Browse products
  await homePage.navigate();
  await homePage.searchFor('laptop');

  // Step 2: Add to cart
  await productPage.selectProduct('MacBook Pro');
  await productPage.addToCart();
  await expect(page.locator('.cart-count')).toHaveText('1');

  // Step 3: Checkout
  await cartPage.navigate();
  await cartPage.proceedToCheckout();

  // Step 4: Fill shipping info
  await checkoutPage.fillShippingDetails({
    name: 'John Doe',
    address: '123 Main St',
    city: 'San Francisco',
    zip: '94102',
  });

  // Step 5: Payment
  await paymentPage.fillPaymentDetails({
    cardNumber: '4242424242424242',
    expiry: '12/25',
    cvv: '123',
  });
  await paymentPage.placeOrder();

  // Step 6: Confirmation
  await expect(confirmationPage.orderNumber).toBeVisible();
  const orderNumber = await confirmationPage.getOrderNumber();
  expect(orderNumber).toMatch(/ORD-\d+/);
});
```

**b) Individual Step Tests (Priority 2):**
```typescript
test.describe('Cart Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Add item to cart
    await addProductToCart(page, 'test-product-id');
  });

  test('update quantity', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.updateQuantity('test-product-id', 3);
    await expect(cart.getItemQuantity('test-product-id')).toHaveText('3');
  });

  test('remove item', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.removeItem('test-product-id');
    await expect(cart.emptyCartMessage).toBeVisible();
  });

  test('apply coupon code', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.applyCoupon('SAVE10');
    await expect(cart.discount).toContainText('10%');
  });
});
```

**c) Edge Cases (Priority 3):**
```typescript
test.describe('Checkout Edge Cases', () => {
  test('handle out of stock during checkout', async ({ page }) => {
    // Add item to cart
    await addProductToCart(page, 'limited-stock-item');

    // Simulate stock running out
    await page.route('**/api/cart/validate', route => {
      route.fulfill({
        status: 400,
        body: JSON.stringify({
          error: 'Item out of stock'
        }),
      });
    });

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    await expect(page.locator('.error-message'))
      .toContainText('out of stock');
  });

  test('handle payment failure', async ({ page }) => {
    // Go through checkout
    await completeCheckoutUpToPayment(page);

    // Mock payment failure
    await page.route('**/api/payment/process', route => {
      route.fulfill({
        status: 400,
        body: JSON.stringify({
          error: 'Payment declined'
        }),
      });
    });

    const paymentPage = new PaymentPage(page);
    await paymentPage.placeOrder();

    await expect(page.locator('.payment-error'))
      .toContainText('Payment declined');
  });
});
```

**2. Data-Driven Testing:**
```typescript
const checkoutScenarios = [
  {
    name: 'single item, standard shipping',
    items: [{ id: 'item1', quantity: 1 }],
    shipping: 'standard',
    expectedTotal: 29.99,
  },
  {
    name: 'multiple items, express shipping',
    items: [
      { id: 'item1', quantity: 2 },
      { id: 'item2', quantity: 1 },
    ],
    shipping: 'express',
    expectedTotal: 89.97,
  },
];

for (const scenario of checkoutScenarios) {
  test(`checkout: ${scenario.name}`, async ({ page }) => {
    // Add items
    for (const item of scenario.items) {
      await addProductToCart(page, item.id, item.quantity);
    }

    // Complete checkout
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.navigate();
    await checkoutPage.selectShipping(scenario.shipping);

    // Verify total
    const total = await checkoutPage.getTotal();
    expect(total).toBe(scenario.expectedTotal);
  });
}
```

**3. State Management:**
```typescript
// Save cart state for reuse
test('save cart state for later tests', async ({ page, context }) => {
  await addMultipleItemsToCart(page);

  // Save storage state
  await context.storageState({
    path: 'auth/cart-with-items.json'
  });
});

// Reuse cart state
test.use({ storageState: 'auth/cart-with-items.json' });
test('checkout with pre-filled cart', async ({ page }) => {
  // Cart already has items
  const cartPage = new CartPage(page);
  await cartPage.navigate();
  await expect(cartPage.itemCount).not.toHaveText('0');
});
```

**4. API Validation:**
```typescript
test('validate checkout creates order in backend', async ({ page, request }) => {
  // Complete checkout through UI
  const orderNumber = await completeCheckout(page);

  // Verify via API
  const response = await request.get(`/api/orders/${orderNumber}`);
  expect(response.ok()).toBeTruthy();

  const order = await response.json();
  expect(order.status).toBe('confirmed');
  expect(order.items).toHaveLength(2);
  expect(order.total).toBeGreaterThan(0);
});
```

**5. Performance Testing:**
```typescript
test('checkout completes within acceptable time', async ({ page }) => {
  const startTime = Date.now();

  await completeCheckout(page);

  const endTime = Date.now();
  const duration = endTime - startTime;

  // Checkout should complete within 10 seconds
  expect(duration).toBeLessThan(10000);
});
```

**6. Cleanup:**
```typescript
test.afterEach(async ({ request }, testInfo) => {
  // Clean up test data after each test
  if (testInfo.annotations.some(a => a.type === 'order-created')) {
    const orderNumber = testInfo.annotations
      .find(a => a.type === 'order-created')?.description;

    // Cancel order via API
    await request.delete(`/api/orders/${orderNumber}`);
  }
});
```

---

## Additional Resources

### Recommended Reading
- [Playwright Documentation](https://playwright.dev)
- [MCP Documentation](https://modelcontextprotocol.io)
- [BrowserStack Documentation](https://www.browserstack.com/docs)
- [Azure DevOps Documentation](https://learn.microsoft.com/azure/devops)

### Best Practices Summary

1. **Test Design:**
   - Use Page Object Model for maintainability
   - Write independent, isolated tests
   - Follow AAA pattern (Arrange, Act, Assert)
   - Use descriptive test names

2. **Reliability:**
   - Leverage Playwright's auto-waiting
   - Avoid hard-coded waits
   - Use proper selectors (prefer user-facing)
   - Handle async operations correctly

3. **Maintainability:**
   - Keep tests DRY (Don't Repeat Yourself)
   - Use fixtures for common setup
   - Centralize test data
   - Document complex test scenarios

4. **CI/CD:**
   - Fast feedback (run critical tests first)
   - Parallel execution where possible
   - Proper artifact collection
   - Clear test reports

5. **Collaboration:**
   - Code reviews for test code
   - Share knowledge and best practices
   - Document framework decisions
   - Regular test maintenance

---

## Interview Tips

### For Interviewers:
- Ask follow-up questions to assess depth of knowledge
- Request code examples for practical understanding
- Discuss real-world scenarios and trade-offs
- Evaluate problem-solving approach, not just answers

### For Candidates:
- Provide specific examples from your experience
- Explain your reasoning and decision-making process
- Discuss trade-offs and alternative approaches
- Ask clarifying questions when needed
- Show passion for quality and testing

---

**Document Version:** 1.0
**Last Updated:** November 2025
**Maintained by:** QA Team

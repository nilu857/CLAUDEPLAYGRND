# Getting Started with API Testing in Playwright

## Table of Contents

1. [Introduction](#introduction)
2. [What is API Testing?](#what-is-api-testing)
3. [Understanding REST APIs](#understanding-rest-apis)
4. [Why Playwright for API Testing?](#why-playwright-for-api-testing)
5. [Prerequisites](#prerequisites)
6. [Installation and Setup](#installation-and-setup)
7. [Core Concepts](#core-concepts)
8. [Writing Your First API Test](#writing-your-first-api-test)
9. [Framework Components Deep Dive](#framework-components-deep-dive)
10. [Advanced Topics](#advanced-topics)
    - [Database Integration Testing](#9-database-integration-testing)
    - [Using API Tests to Complement UI Tests](#using-api-tests-to-complement-ui-tests)
11. [Best Practices](#best-practices)
12. [Common Patterns and Examples](#common-patterns-and-examples)
13. [Troubleshooting](#troubleshooting)
14. [Test Recording and Reporting Best Practices](#test-recording-and-reporting-best-practices)
15. [Reporting: Allure vs Playwright HTML Report](#reporting-allure-vs-playwright-html-report)

---

## Introduction

This comprehensive guide will teach you everything you need to know about API testing using Playwright. Whether you're new to API testing or transitioning from another tool, this guide covers all concepts from the ground up with detailed explanations and practical examples.

By the end of this guide, you'll be able to:
- Understand what APIs are and how they work
- Write comprehensive API tests using Playwright
- Validate API responses effectively
- Handle authentication and complex scenarios
- Build a maintainable test automation framework
- Integrate database testing with API tests
- Use APIs to complement and optimize UI tests
- Verify backend state while testing UI flows

---

## What is API Testing?

### Understanding APIs

An **API (Application Programming Interface)** is a set of rules and protocols that allows different software applications to communicate with each other. Think of it as a waiter in a restaurant:

- **You (Client)** place an order
- **Waiter (API)** takes your order to the kitchen
- **Kitchen (Server)** prepares your food
- **Waiter (API)** brings the food back to you

### Why Test APIs?

API testing is crucial because:

1. **Early Detection**: Find bugs before they reach the UI
2. **Faster Execution**: API tests run faster than UI tests
3. **Better Coverage**: Test business logic directly
4. **Integration Testing**: Verify different systems work together
5. **Independence**: Test backend functionality without a UI

### Types of API Testing

- **Functional Testing**: Verify the API works as expected
- **Performance Testing**: Check response times and throughput
- **Security Testing**: Ensure proper authentication and authorization
- **Contract Testing**: Verify API contracts between services
- **Integration Testing**: Test API interactions with other systems

---

## Understanding REST APIs

### What is REST?

REST (Representational State Transfer) is an architectural style for building web APIs. RESTful APIs use HTTP methods to perform operations on resources.

### HTTP Methods

The most common HTTP methods are:

#### 1. GET - Retrieve Data
```
Purpose: Fetch data from the server
Example: GET /users/1
Response: Returns user with ID 1
Status Code: 200 OK (success)
```

#### 2. POST - Create New Data
```
Purpose: Create a new resource
Example: POST /users
Body: { "name": "John", "email": "john@example.com" }
Response: Returns the created user with an ID
Status Code: 201 Created (success)
```

#### 3. PUT - Update Entire Resource
```
Purpose: Replace an entire resource
Example: PUT /users/1
Body: { "name": "John Updated", "email": "john.new@example.com" }
Response: Returns the updated user
Status Code: 200 OK (success)
```

#### 4. PATCH - Partial Update
```
Purpose: Update specific fields of a resource
Example: PATCH /users/1
Body: { "email": "newemail@example.com" }
Response: Returns the updated user
Status Code: 200 OK (success)
```

#### 5. DELETE - Remove Data
```
Purpose: Delete a resource
Example: DELETE /users/1
Response: May return empty body or deletion confirmation
Status Code: 200 OK or 204 No Content (success)
```

### HTTP Status Codes

Understanding status codes is essential for API testing:

**2xx - Success**
- `200 OK`: Request succeeded
- `201 Created`: New resource created
- `204 No Content`: Success but no data to return

**3xx - Redirection**
- `301 Moved Permanently`: Resource has a new permanent URL
- `302 Found`: Resource temporarily at different URL

**4xx - Client Errors**
- `400 Bad Request`: Invalid request format
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: No permission to access
- `404 Not Found`: Resource doesn't exist
- `422 Unprocessable Entity`: Validation failed

**5xx - Server Errors**
- `500 Internal Server Error`: Server encountered an error
- `502 Bad Gateway`: Invalid response from upstream server
- `503 Service Unavailable`: Server temporarily unavailable

### Request Components

A typical HTTP request consists of:

1. **URL/Endpoint**: Where to send the request
   ```
   https://api.example.com/users/1
   ```

2. **Method**: What action to perform (GET, POST, etc.)

3. **Headers**: Metadata about the request
   ```
   Content-Type: application/json
   Authorization: Bearer token123
   Accept: application/json
   ```

4. **Body**: Data being sent (for POST, PUT, PATCH)
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com"
   }
   ```

5. **Query Parameters**: Filter or modify the request
   ```
   /users?page=1&limit=10&sort=name
   ```

### Response Components

An HTTP response contains:

1. **Status Code**: Indicates success or failure (200, 404, etc.)

2. **Headers**: Metadata about the response
   ```
   Content-Type: application/json
   Content-Length: 1234
   ```

3. **Body**: The actual data returned
   ```json
   {
     "id": 1,
     "name": "John Doe",
     "email": "john@example.com"
   }
   ```

---

## Why Playwright for API Testing?

### Advantages

1. **Built-in API Testing**: Native support for HTTP requests
2. **TypeScript Support**: Type-safe tests with excellent IDE support
3. **Parallel Execution**: Run tests concurrently for faster feedback
4. **Retry Mechanism**: Automatically retry flaky tests
5. **Rich Reporting**: HTML, JSON, JUnit reports out of the box
6. **CI/CD Integration**: Easy integration with GitHub Actions, Jenkins, etc.
7. **Combined UI & API Tests**: Test both in the same framework
8. **Request Context**: Reusable configuration for all requests

### Comparison with Other Tools

| Feature | Playwright | Postman | Rest-Assured | SuperTest |
|---------|-----------|---------|--------------|-----------|
| Language | JavaScript/TypeScript | JavaScript | Java | JavaScript |
| Type Safety | ✅ Excellent | ❌ Limited | ✅ Good | ❌ Limited |
| Parallel Tests | ✅ Built-in | ⚠️ Limited | ✅ Via TestNG | ⚠️ Manual |
| CI/CD Ready | ✅ Yes | ✅ Via Newman | ✅ Yes | ✅ Yes |
| Learning Curve | 🟢 Easy | 🟢 Easy | 🟡 Medium | 🟢 Easy |
| UI + API Tests | ✅ Yes | ❌ No | ❌ No | ❌ No |

---

## Prerequisites

Before starting, ensure you have:

### Required Knowledge
- Basic understanding of JavaScript/TypeScript
- Familiarity with JSON format
- Understanding of HTTP concepts
- Command line basics

### Software Requirements
- **Node.js**: Version 16 or higher
  ```bash
  # Check your Node version
  node --version
  ```
- **npm** or **yarn**: Package manager
  ```bash
  # Check npm version
  npm --version
  ```
- **Code Editor**: VS Code recommended
- **Git**: For version control

### Recommended VS Code Extensions
- **Playwright Test for VSCode**: Run and debug tests
- **REST Client**: Test APIs directly in VS Code
- **Thunder Client**: Lightweight API testing tool

---

## Installation and Setup

### Step 1: Clone or Create Project

```bash
# If starting fresh
mkdir playwright-api-testing
cd playwright-api-testing
npm init -y
```

### Step 2: Install Playwright

```bash
# Install Playwright Test
npm install -D @playwright/test

# Install TypeScript (recommended)
npm install -D typescript ts-node

# Install dotenv for environment variables
npm install -D dotenv
```

### Step 3: Initialize TypeScript Configuration

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "types": ["node", "@playwright/test"]
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist", "playwright-report", "test-results"]
}
```

### Step 4: Create Playwright Configuration

Create `playwright.config.ts`:

```typescript
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',

  // Maximum time one test can run
  timeout: 60 * 1000,

  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  // Global test settings
  use: {
    // Base URL for API requests
    baseURL: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',

    // Extra HTTP headers
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },

    // Collect trace on failure
    trace: 'retain-on-failure',
  },
});
```

### Step 5: Create Environment File

Create `.env`:

```env
# API Configuration
API_BASE_URL=https://jsonplaceholder.typicode.com
API_KEY=your_api_key_here
LOG_LEVEL=INFO

# Environment-specific URLs
DEV_API_BASE_URL=https://dev-api.example.com
STAGING_API_BASE_URL=https://staging-api.example.com
PROD_API_BASE_URL=https://api.example.com
```

Create `.env.example` (for version control):

```env
API_BASE_URL=https://jsonplaceholder.typicode.com
API_KEY=
LOG_LEVEL=INFO
```

### Step 6: Update package.json Scripts

Add test scripts to `package.json`:

```json
{
  "scripts": {
    "test": "npx playwright test",
    "test:headed": "npx playwright test --headed",
    "test:debug": "npx playwright test --debug",
    "test:ui": "npx playwright test --ui",
    "test:api": "npx playwright test --grep @api",
    "report": "npx playwright show-report"
  }
}
```

### Step 7: Create Project Structure

```bash
mkdir -p tests/api
mkdir -p lib
mkdir -p helpers
mkdir -p utils
mkdir -p data
mkdir -p config
```

Your project structure should look like:

```
playwright-api-testing/
├── config/
├── data/
├── helpers/
├── lib/
├── tests/
│   └── api/
├── utils/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

---

## Core Concepts

### 1. Request Context

Playwright's `request` context is the foundation of API testing. It's automatically available in your tests:

```typescript
import { test } from '@playwright/test';

test('example test', async ({ request }) => {
  // 'request' is automatically provided by Playwright
  const response = await request.get('/endpoint');
});
```

**What is Request Context?**
- A fixture that provides HTTP client functionality
- Automatically manages cookies and authentication
- Shares configuration from playwright.config.ts
- Isolated per test (no state pollution)

### 2. Making HTTP Requests

#### Basic Syntax

```typescript
// GET request
const response = await request.get('/users');

// POST request
const response = await request.post('/users', {
  data: {
    name: 'John',
    email: 'john@example.com'
  }
});

// PUT request
const response = await request.put('/users/1', {
  data: {
    name: 'John Updated'
  }
});

// PATCH request
const response = await request.patch('/users/1', {
  data: {
    email: 'newemail@example.com'
  }
});

// DELETE request
const response = await request.delete('/users/1');
```

### 3. Response Object

Every API request returns an `APIResponse` object:

```typescript
const response = await request.get('/users/1');

// Status code
const status = response.status(); // 200

// Check if successful (2xx status)
const isOk = response.ok(); // true

// Headers
const headers = response.headers();
const contentType = headers['content-type'];

// Response body as JSON
const body = await response.json();

// Response body as text
const text = await response.text();

// Response body as buffer
const buffer = await response.body();
```

### 4. Request Options

Customize requests with options:

```typescript
const response = await request.post('/users', {
  // Request body
  data: {
    name: 'John',
    email: 'john@example.com'
  },

  // Custom headers
  headers: {
    'Authorization': 'Bearer token123',
    'X-Custom-Header': 'value'
  },

  // Query parameters
  params: {
    page: 1,
    limit: 10
  },

  // Timeout
  timeout: 30000,

  // Fail on status codes >= 400
  failOnStatusCode: false,
});
```

---

## Writing Your First API Test

Let's write a complete API test step by step.

### Step 1: Create Test File

Create `tests/api/first.api.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('My First API Tests', () => {

  test('GET request - Fetch a user', async ({ request }) => {
    // Send GET request
    const response = await request.get('/users/1');

    // Check status code
    expect(response.status()).toBe(200);

    // Parse response body
    const user = await response.json();

    // Validate response data
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user.id).toBe(1);

    // Log the response
    console.log('User:', user);
  });

});
```

### Step 2: Run Your Test

```bash
npm test tests/api/first.api.spec.ts
```

### Step 3: Understanding the Output

```
Running 1 test using 1 worker

  ✓ My First API Tests > GET request - Fetch a user (234ms)

  1 passed (1s)
```

### Step 4: Add More Tests

```typescript
test('POST request - Create a user', async ({ request }) => {
  // Prepare request data
  const newUser = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    username: 'janedoe'
  };

  // Send POST request
  const response = await request.post('/users', {
    data: newUser
  });

  // Validate response
  expect(response.status()).toBe(201);

  const createdUser = await response.json();
  expect(createdUser).toMatchObject(newUser);
  expect(createdUser).toHaveProperty('id');

  console.log('Created user:', createdUser);
});

test('PUT request - Update a user', async ({ request }) => {
  const updatedData = {
    name: 'John Updated',
    email: 'john.updated@example.com'
  };

  const response = await request.put('/users/1', {
    data: updatedData
  });

  expect(response.status()).toBe(200);

  const user = await response.json();
  expect(user.id).toBe(1);
});

test('DELETE request - Delete a user', async ({ request }) => {
  const response = await request.delete('/users/1');

  expect(response.status()).toBe(200);
});

test('Error handling - 404 Not Found', async ({ request }) => {
  const response = await request.get('/users/99999');

  expect(response.status()).toBe(404);
});
```

---

## Framework Components Deep Dive

Now let's explore the framework components in detail.

### 1. API Client

The API Client provides a wrapper around Playwright's request context with additional features.

#### Creating BaseApiClient

Create `lib/BaseApiClient.ts`:

```typescript
import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseApiClient {
  protected request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async get(url: string, options?: any): Promise<APIResponse> {
    return await this.request.get(url, options);
  }

  async post(url: string, options?: any): Promise<APIResponse> {
    return await this.request.post(url, options);
  }

  async put(url: string, options?: any): Promise<APIResponse> {
    return await this.request.put(url, options);
  }

  async patch(url: string, options?: any): Promise<APIResponse> {
    return await this.request.patch(url, options);
  }

  async delete(url: string, options?: any): Promise<APIResponse> {
    return await this.request.delete(url, options);
  }
}
```

#### Using the API Client

```typescript
import { test, expect } from '@playwright/test';
import { BaseApiClient } from '../../lib/BaseApiClient';

test('Using API Client', async ({ request }) => {
  const apiClient = new BaseApiClient(request);

  const response = await apiClient.get('/users/1');
  expect(response.status()).toBe(200);
});
```

#### Enhanced API Client with Logging

Create `lib/ApiClient.ts`:

```typescript
import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';

export class ApiClient extends BaseApiClient {

  async get(url: string, options?: any): Promise<APIResponse> {
    console.log(`GET ${url}`);
    const response = await super.get(url, options);
    console.log(`Response: ${response.status()}`);
    return response;
  }

  async post(url: string, options?: any): Promise<APIResponse> {
    console.log(`POST ${url}`);
    const response = await super.post(url, options);
    console.log(`Response: ${response.status()}`);
    return response;
  }

  // Retry mechanism
  async requestWithRetry(
    method: string,
    url: string,
    options?: any,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<APIResponse> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt} of ${maxRetries}: ${method} ${url}`);

        let response: APIResponse;
        switch (method.toUpperCase()) {
          case 'GET':
            response = await this.get(url, options);
            break;
          case 'POST':
            response = await this.post(url, options);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        if (response.ok()) {
          return response;
        }

        lastError = new Error(`Request failed with status ${response.status()}`);
      } catch (error) {
        lastError = error;
        console.log(`Attempt ${attempt} failed:`, error);
      }

      if (attempt < maxRetries) {
        await this.delay(delayMs);
      }
    }

    throw lastError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 2. Request Builder

The Request Builder provides a fluent API for constructing complex requests.

#### Why Use Request Builder?

**Without Request Builder:**
```typescript
const response = await request.post('/users', {
  data: { name: 'John' },
  headers: {
    'Authorization': 'Bearer token',
    'X-Custom-Header': 'value',
    'Accept': 'application/json'
  },
  params: {
    page: 1,
    limit: 10
  }
});
```

**With Request Builder:**
```typescript
const builder = new RequestBuilder();
const options = builder
  .setBody({ name: 'John' })
  .setBearerToken('token')
  .addHeader('X-Custom-Header', 'value')
  .addQueryParam('page', 1)
  .addQueryParam('limit', 10)
  .build();

const response = await request.post('/users', options);
```

#### Request Builder Features

**1. Adding Headers:**
```typescript
const builder = new RequestBuilder();

// Single header
builder.addHeader('Accept', 'application/json');

// Multiple headers
builder.addHeaders({
  'Accept': 'application/json',
  'X-Request-ID': 'abc123'
});
```

**2. Query Parameters:**
```typescript
// Single parameter
builder.addQueryParam('page', 1);

// Multiple parameters
builder.addQueryParams({
  page: 1,
  limit: 10,
  sort: 'name'
});
```

**3. Request Body:**
```typescript
builder.setBody({
  name: 'John Doe',
  email: 'john@example.com'
});
```

**4. Authentication:**
```typescript
// Bearer token
builder.setBearerToken('your-token-here');

// Basic auth
builder.setBasicAuth('username', 'password');
```

**5. Form Data:**
```typescript
builder.setFormData({
  field1: 'value1',
  field2: 'value2'
});
```

**6. Chaining Methods:**
```typescript
const options = new RequestBuilder()
  .addHeader('Accept', 'application/json')
  .setBearerToken('token')
  .addQueryParam('page', 1)
  .setBody({ name: 'John' })
  .build();
```

**7. Resetting Builder:**
```typescript
const builder = new RequestBuilder();
builder.addHeader('X-Header', 'value').build();

// Reuse for another request
builder.reset();
builder.setBody({ data: 'new' }).build();
```

### 3. Response Validation

#### Using Built-in Assertions

```typescript
test('Basic assertions', async ({ request }) => {
  const response = await request.get('/users/1');
  const user = await response.json();

  // Status code
  expect(response.status()).toBe(200);

  // Check response is OK (2xx)
  expect(response.ok()).toBeTruthy();

  // Headers
  expect(response.headers()['content-type']).toContain('application/json');

  // Body properties
  expect(user).toHaveProperty('id');
  expect(user.id).toBe(1);
  expect(user.name).toBeTruthy();

  // Object matching
  expect(user).toMatchObject({
    id: 1,
    name: expect.any(String),
    email: expect.stringContaining('@')
  });
});
```

#### Using ApiAssertions Helper

Create `helpers/ApiAssertions.ts` and use it:

```typescript
import { ApiAssertions } from '../../helpers/ApiAssertions';

test('Using ApiAssertions', async ({ request }) => {
  const response = await request.get('/users/1');

  // Status code
  await ApiAssertions.assertStatusCode(response, 200);

  // Content type
  await ApiAssertions.assertContentType(response, 'application/json');

  // Body properties
  await ApiAssertions.assertBodyHasProperty(response, 'id');
  await ApiAssertions.assertBodyHasProperty(response, 'name');

  // Property values
  await ApiAssertions.assertBodyPropertyValue(response, 'id', 1);

  // Array assertions
  const listResponse = await request.get('/users');
  await ApiAssertions.assertBodyIsArray(listResponse);
  await ApiAssertions.assertBodyArrayMinLength(listResponse, 1);
});
```

#### All Available ApiAssertions Methods

```typescript
// Status assertions
ApiAssertions.assertStatusCode(response, 200);
ApiAssertions.assertSuccess(response);
ApiAssertions.assertStatusInRange(response, 200, 299);

// Header assertions
ApiAssertions.assertHasHeader(response, 'content-type');
ApiAssertions.assertHeaderValue(response, 'content-type', 'application/json');
ApiAssertions.assertContentType(response, 'application/json');

// Body assertions
ApiAssertions.assertBodyHasProperty(response, 'id');
ApiAssertions.assertBodyPropertyValue(response, 'name', 'John');
ApiAssertions.assertBodyPropertyContains(response, 'email', '@example.com');

// Array assertions
ApiAssertions.assertBodyIsArray(response);
ApiAssertions.assertBodyArrayLength(response, 10);
ApiAssertions.assertBodyArrayMinLength(response, 1);
ApiAssertions.assertBodyArrayContains(response, expectedItem);

// Schema assertions
ApiAssertions.assertBodyMatchesSchema(response, {
  id: 'number',
  name: 'string',
  email: 'string'
});

// Object matching
ApiAssertions.assertBodyMatchesObject(response, {
  name: 'John',
  email: 'john@example.com'
});
ApiAssertions.assertBodyEquals(response, expectedBody);

// Performance assertions
ApiAssertions.assertResponseTime(duration, 1000);

// Empty/Not empty
ApiAssertions.assertBodyIsEmpty(response);
ApiAssertions.assertBodyIsNotEmpty(response);
```

#### Using ResponseValidator (Fluent API)

```typescript
import { ResponseValidator } from '../../helpers/ResponseValidator';

test('Using ResponseValidator', async ({ request }) => {
  const response = await request.get('/users/1');

  const validator = new ResponseValidator(response);
  await validator
    .validateStatus(200)
    .then(v => v.validateContentType('application/json'))
    .then(v => v.validateBodyHasProperty('id'))
    .then(v => v.validateBodyHasProperty('name'))
    .then(v => v.validateBodyPropertyValue('id', 1));
});
```

### 4. Schema Validation

Schema validation ensures your API responses have the correct structure.

#### Basic Schema Validation

```typescript
import { SchemaValidator } from '../../helpers/SchemaValidator';

test('Validate user schema', async ({ request }) => {
  const response = await request.get('/users/1');
  const user = await response.json();

  const userSchema = {
    required: ['id', 'name', 'email', 'username'],
    properties: {
      id: { type: 'number' },
      name: { type: 'string', minLength: 1 },
      email: { type: 'string', pattern: '^[^@]+@[^@]+\\.[^@]+$' },
      username: { type: 'string', minLength: 3 }
    }
  };

  const result = SchemaValidator.validate(user, userSchema);
  expect(result.valid).toBeTruthy();
  expect(result.errors).toHaveLength(0);

  if (!result.valid) {
    console.log('Validation errors:', result.errors);
  }
});
```

#### Complex Schema with Nested Objects

```typescript
const postSchema = {
  required: ['id', 'userId', 'title', 'body'],
  properties: {
    id: { type: 'number' },
    userId: { type: 'number' },
    title: { type: 'string', minLength: 1, maxLength: 200 },
    body: { type: 'string', minLength: 1 },
    author: {
      type: 'object',
      required: ['name', 'email'],
      properties: {
        name: { type: 'string' },
        email: { type: 'string', pattern: '^[^@]+@[^@]+$' }
      }
    }
  }
};
```

#### Array Schema Validation

```typescript
const usersArraySchema = {
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    required: ['id', 'name'],
    properties: {
      id: { type: 'number' },
      name: { type: 'string' }
    }
  }
};

const response = await request.get('/users');
const users = await response.json();

const result = SchemaValidator.validate(users, usersArraySchema);
expect(result.valid).toBeTruthy();
```

### 5. Test Data Management

#### Why Manage Test Data?

- **Reusability**: Use same data across multiple tests
- **Maintainability**: Update data in one place
- **Organization**: Keep test data separate from test logic
- **Consistency**: Ensure tests use valid data structures

#### Creating Test Data Files

Create `data/testUsers.json`:

```json
{
  "testUser1": {
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "phone": "1234567890"
  },
  "testUser2": {
    "name": "Jane Smith",
    "username": "janesmith",
    "email": "jane@example.com",
    "phone": "0987654321"
  },
  "invalidUser": {
    "name": "",
    "email": "invalid-email"
  }
}
```

Create `data/testPosts.json`:

```json
{
  "validPost": {
    "userId": 1,
    "title": "Test Post Title",
    "body": "This is a test post body with some content."
  },
  "longPost": {
    "userId": 1,
    "title": "A Very Long Post Title",
    "body": "Lorem ipsum dolor sit amet..."
  }
}
```

#### Using TestDataManager

```typescript
import { TestDataManager } from '../../data/TestDataManager';

test('Using test data', async ({ request }) => {
  const dataManager = TestDataManager.getInstance();

  // Load specific test data
  const testUser = dataManager.loadDataByKey('testUsers.json', 'testUser1');

  const builder = new RequestBuilder();
  const options = builder.setBody(testUser).build();

  const response = await request.post('/users', options);

  await ApiAssertions.assertStatusCode(response, 201);
  await ApiAssertions.assertBodyPropertyValue(response, 'email', testUser.email);
});
```

#### Loading All Test Data

```typescript
test('Load all users', async ({ request }) => {
  const dataManager = TestDataManager.getInstance();

  // Load entire file
  const allUsers = dataManager.loadData('testUsers.json');

  // Iterate through all users
  for (const [key, userData] of Object.entries(allUsers)) {
    console.log(`Testing with ${key}:`, userData);
    // Use userData in tests
  }
});
```

### 6. Data Generation

Generate random test data for unique tests.

#### Using DataGenerator

```typescript
import { DataGenerator } from '../../utils/DataGenerator';

test('Create user with random data', async ({ request }) => {
  const newUser = {
    name: DataGenerator.randomString(10),
    username: DataGenerator.randomString(8),
    email: DataGenerator.randomEmail(),
    phone: DataGenerator.randomPhoneNumber(),
    website: DataGenerator.randomUrl(),
    userId: DataGenerator.randomNumber(1, 100)
  };

  const builder = new RequestBuilder();
  const options = builder.setBody(newUser).build();

  const response = await request.post('/users', options);
  await ApiAssertions.assertStatusCode(response, 201);
});
```

#### Available DataGenerator Methods

```typescript
// String generation
DataGenerator.randomString(length);          // Random alphanumeric
DataGenerator.randomString(10);              // "aB3xY9zK2p"

// Email generation
DataGenerator.randomEmail();                 // "user_abc123@example.com"
DataGenerator.randomEmail('custom.com');     // "user_xyz@custom.com"

// Number generation
DataGenerator.randomNumber(min, max);        // Random integer
DataGenerator.randomNumber(1, 100);          // Number between 1-100

// Phone generation
DataGenerator.randomPhoneNumber();           // "+1234567890"

// UUID generation
DataGenerator.randomUUID();                  // "550e8400-e29b-41d4-a716-446655440000"

// URL generation
DataGenerator.randomUrl();                   // "https://example-abc123.com"

// Boolean generation
DataGenerator.randomBoolean();               // true or false

// Date generation
DataGenerator.randomDate(start, end);        // Random date between range
DataGenerator.futureDate(days);              // Date N days in future
DataGenerator.pastDate(days);                // Date N days in past

// Object generation
DataGenerator.randomUser();                  // Complete user object
```

#### Custom Data Generators

```typescript
class CustomDataGenerator {
  static randomProduct() {
    return {
      id: DataGenerator.randomNumber(1000, 9999),
      name: `Product ${DataGenerator.randomString(8)}`,
      price: DataGenerator.randomNumber(10, 1000),
      inStock: DataGenerator.randomBoolean(),
      sku: `SKU-${DataGenerator.randomString(6).toUpperCase()}`
    };
  }

  static randomOrder() {
    return {
      orderId: DataGenerator.randomUUID(),
      userId: DataGenerator.randomNumber(1, 100),
      items: [this.randomProduct(), this.randomProduct()],
      total: DataGenerator.randomNumber(100, 5000),
      status: ['pending', 'processing', 'shipped', 'delivered'][
        DataGenerator.randomNumber(0, 3)
      ]
    };
  }
}
```

### 7. API Helper Utilities

#### Extracting Values from Responses

```typescript
import { ApiHelper } from '../../utils/ApiHelper';

test('Extract and use response values', async ({ request }) => {
  // Create a post
  const postResponse = await request.post('/posts', {
    data: { title: 'Test', body: 'Content', userId: 1 }
  });

  // Extract the post ID
  const postId = await ApiHelper.extractValue(postResponse, 'id');

  // Use extracted ID in another request
  const getResponse = await request.get(`/posts/${postId}`);
  await ApiAssertions.assertStatusCode(getResponse, 200);
});
```

#### Extracting Multiple Values

```typescript
test('Extract multiple values', async ({ request }) => {
  const response = await request.get('/users/1');

  const values = await ApiHelper.extractValues(response, [
    'id',
    'name',
    'email',
    'address.city',        // Nested property
    'company.name'         // Nested property
  ]);

  console.log('Extracted:', values);
  // { id: 1, name: 'John', email: 'john@example.com', ... }
});
```

#### Comparing Responses

```typescript
test('Compare two responses', async ({ request }) => {
  const response1 = await request.get('/users/1');
  const response2 = await request.get('/users/1');

  const comparison = await ApiHelper.compareResponses(response1, response2);

  expect(comparison.statusMatch).toBeTruthy();
  expect(comparison.bodyMatch).toBeTruthy();
  expect(comparison.differences).toHaveLength(0);

  if (comparison.differences.length > 0) {
    console.log('Differences found:', comparison.differences);
  }
});
```

#### Waiting for Conditions

```typescript
test('Wait for resource to be ready', async ({ request }) => {
  // Create a resource
  await request.post('/jobs', { data: { type: 'process' } });

  // Wait for job to complete
  await ApiHelper.waitForCondition(
    async () => {
      const response = await request.get('/jobs/1');
      const job = await response.json();
      return job.status === 'completed';
    },
    30000,  // Max wait time (30 seconds)
    1000    // Check interval (1 second)
  );

  // Job is now completed
  const finalResponse = await request.get('/jobs/1');
  const job = await finalResponse.json();
  expect(job.status).toBe('completed');
});
```

---

## Advanced Topics

### 1. Authentication

#### Bearer Token Authentication

```typescript
test('API with Bearer token', async ({ request }) => {
  const builder = new RequestBuilder();
  const options = builder
    .setBearerToken('your-api-token-here')
    .build();

  const response = await request.get('/protected/resource', options);
  await ApiAssertions.assertStatusCode(response, 200);
});
```

#### Basic Authentication

```typescript
test('API with Basic auth', async ({ request }) => {
  const builder = new RequestBuilder();
  const options = builder
    .setBasicAuth('username', 'password')
    .build();

  const response = await request.get('/protected/resource', options);
  await ApiAssertions.assertStatusCode(response, 200);
});
```

#### OAuth 2.0 Flow

```typescript
test('OAuth 2.0 authentication', async ({ request }) => {
  // Step 1: Get access token
  const tokenResponse = await request.post('/oauth/token', {
    data: {
      grant_type: 'client_credentials',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    }
  });

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  // Step 2: Use token for authenticated request
  const builder = new RequestBuilder();
  const options = builder.setBearerToken(accessToken).build();

  const response = await request.get('/api/protected', options);
  await ApiAssertions.assertStatusCode(response, 200);
});
```

#### API Key Authentication

```typescript
test('API Key in header', async ({ request }) => {
  const builder = new RequestBuilder();
  const options = builder
    .addHeader('X-API-Key', process.env.API_KEY!)
    .build();

  const response = await request.get('/api/data', options);
  await ApiAssertions.assertStatusCode(response, 200);
});

test('API Key in query parameter', async ({ request }) => {
  const builder = new RequestBuilder();
  const options = builder
    .addQueryParam('api_key', process.env.API_KEY)
    .build();

  const response = await request.get('/api/data', options);
  await ApiAssertions.assertStatusCode(response, 200);
});
```

### 2. Chaining API Calls

API calls often depend on data from previous calls.

#### Example: Create Post, Then Add Comment

```typescript
test('Chain API calls', async ({ request }) => {
  // Step 1: Create a new post
  const newPost = {
    userId: 1,
    title: 'My New Post',
    body: 'Post content here'
  };

  const postResponse = await request.post('/posts', {
    data: newPost
  });

  await ApiAssertions.assertStatusCode(postResponse, 201);
  const post = await postResponse.json();
  const postId = post.id;

  // Step 2: Add a comment to the post
  const newComment = {
    postId: postId,
    name: 'Commenter',
    email: 'commenter@example.com',
    body: 'Great post!'
  };

  const commentResponse = await request.post('/comments', {
    data: newComment
  });

  await ApiAssertions.assertStatusCode(commentResponse, 201);
  await ApiAssertions.assertBodyPropertyValue(commentResponse, 'postId', postId);

  // Step 3: Verify comment appears on post
  const commentsResponse = await request.get(`/posts/${postId}/comments`);
  await ApiAssertions.assertStatusCode(commentsResponse, 200);
  await ApiAssertions.assertBodyArrayMinLength(commentsResponse, 1);
});
```

#### Example: CRUD Flow

```typescript
test('Complete CRUD flow', async ({ request }) => {
  // CREATE
  const newUser = {
    name: DataGenerator.randomString(10),
    email: DataGenerator.randomEmail()
  };

  const createResponse = await request.post('/users', { data: newUser });
  await ApiAssertions.assertStatusCode(createResponse, 201);

  const createdUser = await createResponse.json();
  const userId = createdUser.id;

  // READ
  const readResponse = await request.get(`/users/${userId}`);
  await ApiAssertions.assertStatusCode(readResponse, 200);
  await ApiAssertions.assertBodyPropertyValue(readResponse, 'email', newUser.email);

  // UPDATE
  const updatedData = { email: DataGenerator.randomEmail() };
  const updateResponse = await request.patch(`/users/${userId}`, {
    data: updatedData
  });
  await ApiAssertions.assertStatusCode(updateResponse, 200);
  await ApiAssertions.assertBodyPropertyValue(updateResponse, 'email', updatedData.email);

  // DELETE
  const deleteResponse = await request.delete(`/users/${userId}`);
  await ApiAssertions.assertStatusCode(deleteResponse, 200);

  // VERIFY DELETION
  const verifyResponse = await request.get(`/users/${userId}`);
  await ApiAssertions.assertStatusCode(verifyResponse, 404);
});
```

### 3. Parallel Requests

Execute multiple requests concurrently for better performance.

```typescript
test('Multiple concurrent requests', async ({ request }) => {
  const startTime = Date.now();

  // Create array of promises
  const requests = [
    request.get('/users/1'),
    request.get('/users/2'),
    request.get('/users/3'),
    request.get('/users/4'),
    request.get('/users/5'),
  ];

  // Execute all requests in parallel
  const responses = await Promise.all(requests);

  const duration = Date.now() - startTime;
  console.log(`5 requests completed in ${duration}ms`);

  // Verify all responses
  for (const response of responses) {
    await ApiAssertions.assertStatusCode(response, 200);
  }
});
```

### 4. Pagination Testing

```typescript
test('Test pagination', async ({ request }) => {
  const builder = new RequestBuilder();
  const allPages: any[] = [];
  let currentPage = 1;
  const pageSize = 10;
  let hasMore = true;

  while (hasMore) {
    const options = builder
      .reset()
      .addQueryParam('_page', currentPage)
      .addQueryParam('_limit', pageSize)
      .build();

    const response = await request.get('/posts', options);
    await ApiAssertions.assertStatusCode(response, 200);

    const data = await response.json();
    allPages.push(...data);

    // Check if there are more pages
    hasMore = data.length === pageSize;
    currentPage++;

    // Safety limit
    if (currentPage > 10) break;
  }

  console.log(`Fetched ${allPages.length} items across ${currentPage - 1} pages`);
  expect(allPages.length).toBeGreaterThan(0);
});
```

### 5. File Upload Testing

```typescript
test('Upload file', async ({ request }) => {
  const fs = require('fs');
  const path = require('path');

  const filePath = path.join(__dirname, 'test-file.txt');
  const fileContent = Buffer.from('Test file content');
  fs.writeFileSync(filePath, fileContent);

  const response = await request.post('/upload', {
    multipart: {
      file: {
        name: 'test-file.txt',
        mimeType: 'text/plain',
        buffer: fileContent
      },
      description: 'Test file upload'
    }
  });

  await ApiAssertions.assertStatusCode(response, 200);

  // Cleanup
  fs.unlinkSync(filePath);
});
```

### 6. Error Handling and Negative Testing

```typescript
test.describe('Error handling tests', () => {

  test('Handle 400 Bad Request', async ({ request }) => {
    const invalidData = {
      // Missing required fields
      name: ''
    };

    const response = await request.post('/users', {
      data: invalidData,
      failOnStatusCode: false
    });

    await ApiAssertions.assertStatusCode(response, 400);
  });

  test('Handle 401 Unauthorized', async ({ request }) => {
    const response = await request.get('/protected/resource', {
      failOnStatusCode: false
    });

    await ApiAssertions.assertStatusCode(response, 401);
  });

  test('Handle 404 Not Found', async ({ request }) => {
    const response = await request.get('/users/999999', {
      failOnStatusCode: false
    });

    await ApiAssertions.assertStatusCode(response, 404);
  });

  test('Handle 422 Validation Error', async ({ request }) => {
    const invalidEmail = {
      name: 'Test',
      email: 'not-an-email'
    };

    const response = await request.post('/users', {
      data: invalidEmail,
      failOnStatusCode: false
    });

    await ApiAssertions.assertStatusCode(response, 422);

    // Verify error message
    const error = await response.json();
    expect(error).toHaveProperty('errors');
  });
});
```

### 7. Performance Testing

```typescript
test('Response time validation', async ({ request }) => {
  const startTime = Date.now();

  const response = await request.get('/users');

  const duration = Date.now() - startTime;

  await ApiAssertions.assertStatusCode(response, 200);
  ApiAssertions.assertResponseTime(duration, 2000); // Max 2 seconds

  console.log(`Response time: ${duration}ms`);
});

test('Load testing - Multiple users', async ({ request }) => {
  const concurrentUsers = 10;
  const requestsPerUser = 5;

  const startTime = Date.now();
  const allRequests: Promise<any>[] = [];

  for (let user = 0; user < concurrentUsers; user++) {
    for (let req = 0; req < requestsPerUser; req++) {
      allRequests.push(request.get('/posts'));
    }
  }

  const responses = await Promise.all(allRequests);
  const duration = Date.now() - startTime;

  console.log(`${concurrentUsers * requestsPerUser} requests in ${duration}ms`);
  console.log(`Average: ${duration / (concurrentUsers * requestsPerUser)}ms per request`);

  // Verify all succeeded
  for (const response of responses) {
    expect(response.ok()).toBeTruthy();
  }
});
```

### 8. Retry Logic

```typescript
test('Request with retry', async ({ request }) => {
  const apiClient = new ApiClient(request);

  // Will retry up to 3 times with 1 second delay
  const response = await apiClient.requestWithRetry(
    'GET',
    '/flaky-endpoint',
    {},
    3,    // max retries
    1000  // delay in ms
  );

  await ApiAssertions.assertSuccess(response);
});
```

### 9. Database Integration Testing

Often you need to validate that API operations correctly update the database, or set up specific database states for testing.

#### Installing Database Drivers

```bash
# For PostgreSQL
npm install -D pg

# For MySQL
npm install -D mysql2

# For MongoDB
npm install -D mongodb

# For SQLite
npm install -D sqlite3
```

#### Creating Database Helper

Create `utils/DatabaseHelper.ts`:

```typescript
import { Client } from 'pg'; // or your preferred database driver

export class DatabaseHelper {
  private client: Client;
  private connected: boolean = false;

  constructor(config?: {
    host?: string;
    port?: number;
    database?: string;
    user?: string;
    password?: string;
  }) {
    this.client = new Client({
      host: config?.host || process.env.DB_HOST || 'localhost',
      port: config?.port || parseInt(process.env.DB_PORT || '5432'),
      database: config?.database || process.env.DB_NAME || 'testdb',
      user: config?.user || process.env.DB_USER || 'postgres',
      password: config?.password || process.env.DB_PASSWORD || 'password'
    });
  }

  async connect(): Promise<void> {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
      console.log('✓ Database connected');
    }
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      await this.client.end();
      this.connected = false;
      console.log('✓ Database disconnected');
    }
  }

  async query(sql: string, params?: any[]): Promise<any> {
    try {
      const result = await this.client.query(sql, params);
      return result.rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async executeQuery(sql: string, params?: any[]): Promise<number> {
    try {
      const result = await this.client.query(sql, params);
      return result.rowCount || 0;
    } catch (error) {
      console.error('Database execute error:', error);
      throw error;
    }
  }

  async getUserById(userId: number): Promise<any> {
    const result = await this.query('SELECT * FROM users WHERE id = $1', [userId]);
    return result[0];
  }

  async insertUser(user: { name: string; email: string; [key: string]: any }): Promise<number> {
    const result = await this.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id',
      [user.name, user.email]
    );
    return result[0].id;
  }

  async updateUser(userId: number, updates: { [key: string]: any }): Promise<void> {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const sql = `UPDATE users SET ${setClause} WHERE id = $${fields.length + 1}`;

    await this.executeQuery(sql, [...values, userId]);
  }

  async deleteUser(userId: number): Promise<void> {
    await this.executeQuery('DELETE FROM users WHERE id = $1', [userId]);
  }

  async clearTable(tableName: string): Promise<void> {
    await this.executeQuery(`DELETE FROM ${tableName}`);
    console.log(`✓ Table ${tableName} cleared`);
  }

  async countRecords(tableName: string, whereClause?: string): Promise<number> {
    const sql = whereClause
      ? `SELECT COUNT(*) as count FROM ${tableName} WHERE ${whereClause}`
      : `SELECT COUNT(*) as count FROM ${tableName}`;

    const result = await this.query(sql);
    return parseInt(result[0].count);
  }

  async verifyRecordExists(tableName: string, conditions: { [key: string]: any }): Promise<boolean> {
    const fields = Object.keys(conditions);
    const values = Object.values(conditions);

    const whereClause = fields.map((field, index) => `${field} = $${index + 1}`).join(' AND ');
    const sql = `SELECT COUNT(*) as count FROM ${tableName} WHERE ${whereClause}`;

    const result = await this.query(sql, values);
    return parseInt(result[0].count) > 0;
  }

  async setupTestData(data: { table: string; records: any[] }[]): Promise<void> {
    for (const { table, records } of data) {
      for (const record of records) {
        const fields = Object.keys(record);
        const values = Object.values(record);
        const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');

        const sql = `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders})`;
        await this.executeQuery(sql, values);
      }
    }
    console.log('✓ Test data setup complete');
  }
}
```

#### Using Database Helper with API Tests

**Example 1: Verify API Creates Database Record**

```typescript
import { test, expect } from '@playwright/test';
import { DatabaseHelper } from '../../utils/DatabaseHelper';
import { ApiAssertions } from '../../helpers/ApiAssertions';

test.describe('User API with Database Verification', () => {
  let dbHelper: DatabaseHelper;

  test.beforeAll(async () => {
    dbHelper = new DatabaseHelper();
    await dbHelper.connect();
  });

  test.afterAll(async () => {
    await dbHelper.disconnect();
  });

  test('should create user in database via API', async ({ request }) => {
    const newUser = {
      name: 'John Doe',
      email: 'john.doe@example.com'
    };

    // Step 1: Create user via API
    const apiResponse = await request.post('/users', {
      data: newUser
    });

    await ApiAssertions.assertStatusCode(apiResponse, 201);
    const responseBody = await apiResponse.json();
    const userId = responseBody.id;

    // Step 2: Verify user exists in database
    const dbUser = await dbHelper.getUserById(userId);

    expect(dbUser).toBeTruthy();
    expect(dbUser.name).toBe(newUser.name);
    expect(dbUser.email).toBe(newUser.email);
    expect(dbUser.created_at).toBeTruthy();

    // Cleanup
    await dbHelper.deleteUser(userId);
  });
});
```

**Example 2: Setup Database State for API Tests**

```typescript
test('should update user via API and verify in database', async ({ request }) => {
  // Step 1: Setup - Insert user directly in database
  const userId = await dbHelper.insertUser({
    name: 'Jane Smith',
    email: 'jane@example.com'
  });

  // Step 2: Update user via API
  const updateData = {
    name: 'Jane Updated',
    email: 'jane.updated@example.com'
  };

  const apiResponse = await request.patch(`/users/${userId}`, {
    data: updateData
  });

  await ApiAssertions.assertStatusCode(apiResponse, 200);

  // Step 3: Verify changes in database
  const dbUser = await dbHelper.getUserById(userId);

  expect(dbUser.name).toBe(updateData.name);
  expect(dbUser.email).toBe(updateData.email);
  expect(dbUser.updated_at).toBeTruthy();

  // Cleanup
  await dbHelper.deleteUser(userId);
});
```

**Example 3: Test Data Cleanup Using Database**

```typescript
test.describe('Posts API Tests', () => {
  test.beforeEach(async () => {
    // Clean database before each test
    await dbHelper.clearTable('posts');
    await dbHelper.clearTable('comments');
  });

  test.afterEach(async () => {
    // Clean database after each test
    await dbHelper.clearTable('posts');
    await dbHelper.clearTable('comments');
  });

  test('should create post and verify database state', async ({ request }) => {
    const newPost = {
      title: 'Test Post',
      body: 'Post content',
      userId: 1
    };

    const response = await request.post('/posts', { data: newPost });
    const post = await response.json();

    // Verify in database
    const postCount = await dbHelper.countRecords('posts', `id = ${post.id}`);
    expect(postCount).toBe(1);

    const exists = await dbHelper.verifyRecordExists('posts', {
      id: post.id,
      title: newPost.title
    });
    expect(exists).toBeTruthy();
  });
});
```

**Example 4: Complex Database Verification**

```typescript
test('should handle user with multiple posts', async ({ request }) => {
  // Setup: Create user in database
  const userId = await dbHelper.insertUser({
    name: 'Test User',
    email: 'test@example.com'
  });

  // Create multiple posts via API
  const posts = [
    { title: 'Post 1', body: 'Content 1', userId },
    { title: 'Post 2', body: 'Content 2', userId },
    { title: 'Post 3', body: 'Content 3', userId }
  ];

  for (const post of posts) {
    const response = await request.post('/posts', { data: post });
    await ApiAssertions.assertStatusCode(response, 201);
  }

  // Verify all posts in database
  const postCount = await dbHelper.countRecords('posts', `user_id = ${userId}`);
  expect(postCount).toBe(3);

  // Verify user's posts via API
  const apiResponse = await request.get(`/users/${userId}/posts`);
  const userPosts = await apiResponse.json();

  expect(userPosts.length).toBe(3);

  // Cleanup
  await dbHelper.clearTable('posts');
  await dbHelper.deleteUser(userId);
});
```

**Example 5: Test Database Constraints**

```typescript
test('should reject duplicate email in database', async ({ request }) => {
  const user = {
    name: 'John Doe',
    email: 'duplicate@example.com'
  };

  // Create first user via API
  const response1 = await request.post('/users', { data: user });
  await ApiAssertions.assertStatusCode(response1, 201);
  const user1 = await response1.json();

  // Attempt to create duplicate
  const response2 = await request.post('/users', { data: user });
  await ApiAssertions.assertStatusCode(response2, 400); // Or 409 Conflict

  // Verify only one record exists in database
  const count = await dbHelper.countRecords('users', `email = '${user.email}'`);
  expect(count).toBe(1);

  // Cleanup
  await dbHelper.deleteUser(user1.id);
});
```

#### Database Setup for Different Databases

**MongoDB Example:**

```typescript
import { MongoClient, Db } from 'mongodb';

export class MongoDBHelper {
  private client: MongoClient;
  private db: Db | null = null;

  constructor(uri?: string, dbName?: string) {
    const connectionString = uri || process.env.MONGO_URI || 'mongodb://localhost:27017';
    this.client = new MongoClient(connectionString);
    this.dbName = dbName || process.env.MONGO_DB_NAME || 'testdb';
  }

  async connect(): Promise<void> {
    await this.client.connect();
    this.db = this.client.db(this.dbName);
    console.log('✓ MongoDB connected');
  }

  async disconnect(): Promise<void> {
    await this.client.close();
    console.log('✓ MongoDB disconnected');
  }

  async insertOne(collection: string, document: any): Promise<any> {
    const result = await this.db!.collection(collection).insertOne(document);
    return result.insertedId;
  }

  async findOne(collection: string, query: any): Promise<any> {
    return await this.db!.collection(collection).findOne(query);
  }

  async deleteMany(collection: string, query: any): Promise<number> {
    const result = await this.db!.collection(collection).deleteMany(query);
    return result.deletedCount;
  }

  async clearCollection(collection: string): Promise<void> {
    await this.db!.collection(collection).deleteMany({});
    console.log(`✓ Collection ${collection} cleared`);
  }
}

// Usage
test('should create user in MongoDB', async ({ request }) => {
  const mongoHelper = new MongoDBHelper();
  await mongoHelper.connect();

  const response = await request.post('/users', {
    data: { name: 'John', email: 'john@example.com' }
  });

  const user = await response.json();

  // Verify in MongoDB
  const dbUser = await mongoHelper.findOne('users', { _id: user.id });
  expect(dbUser.name).toBe('John');

  await mongoHelper.disconnect();
});
```

**MySQL Example:**

```typescript
import mysql from 'mysql2/promise';

export class MySQLHelper {
  private connection: mysql.Connection | null = null;

  async connect(): Promise<void> {
    this.connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'testdb'
    });
    console.log('✓ MySQL connected');
  }

  async disconnect(): Promise<void> {
    await this.connection?.end();
    console.log('✓ MySQL disconnected');
  }

  async query(sql: string, params?: any[]): Promise<any> {
    const [rows] = await this.connection!.execute(sql, params);
    return rows;
  }

  async executeQuery(sql: string, params?: any[]): Promise<number> {
    const [result]: any = await this.connection!.execute(sql, params);
    return result.affectedRows;
  }
}
```

#### Best Practices for Database Testing

**1. Use Transactions for Test Isolation:**

```typescript
export class DatabaseHelper {
  async beginTransaction(): Promise<void> {
    await this.client.query('BEGIN');
  }

  async rollback(): Promise<void> {
    await this.client.query('ROLLBACK');
  }

  async commit(): Promise<void> {
    await this.client.query('COMMIT');
  }
}

// Usage
test('should rollback database changes', async ({ request }) => {
  await dbHelper.beginTransaction();

  try {
    // Perform test operations
    await request.post('/users', { data: { name: 'Test', email: 'test@example.com' } });

    // Test assertions
    // ...
  } finally {
    // Always rollback to clean state
    await dbHelper.rollback();
  }
});
```

**2. Use Database Fixtures:**

```typescript
// fixtures/database.fixture.ts
export class DatabaseFixture {
  static async setupUserData(dbHelper: DatabaseHelper): Promise<number[]> {
    const userIds = [];

    const users = [
      { name: 'User 1', email: 'user1@example.com' },
      { name: 'User 2', email: 'user2@example.com' },
      { name: 'User 3', email: 'user3@example.com' }
    ];

    for (const user of users) {
      const id = await dbHelper.insertUser(user);
      userIds.push(id);
    }

    return userIds;
  }

  static async cleanupUserData(dbHelper: DatabaseHelper, userIds: number[]): Promise<void> {
    for (const id of userIds) {
      await dbHelper.deleteUser(id);
    }
  }
}

// Usage in tests
test('should fetch users with database fixture', async ({ request }) => {
  const userIds = await DatabaseFixture.setupUserData(dbHelper);

  const response = await request.get('/users');
  const users = await response.json();

  expect(users.length).toBeGreaterThanOrEqual(3);

  await DatabaseFixture.cleanupUserData(dbHelper, userIds);
});
```

**3. Environment-Specific Database Configuration:**

```typescript
// config/database.config.ts
export class DatabaseConfig {
  static getConfig() {
    const env = process.env.TEST_ENV || 'development';

    const configs = {
      development: {
        host: 'localhost',
        port: 5432,
        database: 'dev_db',
        user: 'dev_user',
        password: 'dev_pass'
      },
      test: {
        host: 'localhost',
        port: 5433,
        database: 'test_db',
        user: 'test_user',
        password: 'test_pass'
      },
      ci: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      }
    };

    return configs[env] || configs.development;
  }
}

// Usage
const dbHelper = new DatabaseHelper(DatabaseConfig.getConfig());
```

---

## Using API Tests to Complement UI Tests

API tests are significantly faster than UI tests. By combining both approaches, you can create a comprehensive and efficient test strategy.

### Why Combine API and UI Tests?

| Aspect | API Tests | UI Tests |
|--------|-----------|----------|
| **Speed** | ⚡ Very fast (milliseconds) | 🐌 Slow (seconds) |
| **Reliability** | ✅ Highly reliable | ⚠️ Can be flaky |
| **Coverage** | ✅ Backend logic | ✅ User experience |
| **Debugging** | ✅ Easy to debug | ⚠️ Harder to debug |
| **Maintenance** | ✅ Low maintenance | ⚠️ Higher maintenance |
| **Setup Cost** | 🟢 Low | 🟡 Medium-High |

**Best Strategy:** Use API tests for data setup/teardown and backend validation, UI tests for critical user journeys.

### Pattern 1: API Setup for UI Tests

Use APIs to set up test data before UI tests, making UI tests faster and more reliable.

**Example: E-commerce Checkout Test**

```typescript
import { test, expect } from '@playwright/test';

test.describe('E-commerce Checkout', () => {
  let userId: string;
  let productId: string;
  let authToken: string;

  test.beforeEach(async ({ request, page }) => {
    // Step 1: Create user via API (fast)
    const userResponse = await request.post('/api/users', {
      data: {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'Test123!'
      }
    });
    const user = await userResponse.json();
    userId = user.id;

    // Step 2: Login via API to get auth token
    const loginResponse = await request.post('/api/auth/login', {
      data: {
        email: user.email,
        password: 'Test123!'
      }
    });
    const loginData = await loginResponse.json();
    authToken = loginData.token;

    // Step 3: Create product via API
    const productResponse = await request.post('/api/products', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        name: 'Test Product',
        price: 29.99,
        stock: 100
      }
    });
    const product = await productResponse.json();
    productId = product.id;

    // Step 4: Add product to cart via API
    await request.post(`/api/users/${userId}/cart`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        productId: productId,
        quantity: 2
      }
    });

    // Step 5: Set auth cookie for UI test
    await page.context().addCookies([{
      name: 'auth_token',
      value: authToken,
      domain: 'localhost',
      path: '/'
    }]);
  });

  test('should complete checkout flow', async ({ page }) => {
    // Now the UI test starts with data already set up
    await page.goto('/checkout');

    // Verify cart items (UI validation)
    await expect(page.locator('.cart-item')).toHaveCount(1);
    await expect(page.locator('.product-name')).toHaveText('Test Product');
    await expect(page.locator('.product-quantity')).toHaveText('2');

    // Fill checkout form
    await page.fill('#shipping-address', '123 Test St');
    await page.fill('#city', 'Test City');
    await page.fill('#zip', '12345');

    // Complete purchase
    await page.click('#complete-purchase');

    // Verify success message
    await expect(page.locator('.success-message')).toBeVisible();
  });

  test.afterEach(async ({ request }) => {
    // Cleanup via API (fast)
    await request.delete(`/api/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    await request.delete(`/api/products/${productId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
  });
});
```

### Pattern 2: API Verification After UI Actions

Use API tests to verify that UI actions correctly updated the backend.

**Example: User Profile Update**

```typescript
test('should update user profile via UI and verify via API', async ({ page, request }) => {
  // Setup
  const userResponse = await request.post('/api/users', {
    data: { name: 'John Doe', email: 'john@example.com', password: 'Pass123!' }
  });
  const user = await userResponse.json();

  // Login via UI
  await page.goto('/login');
  await page.fill('#email', 'john@example.com');
  await page.fill('#password', 'Pass123!');
  await page.click('#login-button');

  // Update profile via UI
  await page.goto('/profile');
  await page.fill('#name', 'John Updated');
  await page.fill('#phone', '555-1234');
  await page.click('#save-profile');

  // Verify success message in UI
  await expect(page.locator('.success-message')).toBeVisible();

  // Verify changes in backend via API
  const verifyResponse = await request.get(`/api/users/${user.id}`);
  const updatedUser = await verifyResponse.json();

  expect(updatedUser.name).toBe('John Updated');
  expect(updatedUser.phone).toBe('555-1234');
  expect(updatedUser.email).toBe('john@example.com'); // Unchanged

  // Cleanup
  await request.delete(`/api/users/${user.id}`);
});
```

### Pattern 3: Hybrid Test Strategy

Combine API and UI tests in a single test for comprehensive coverage.

**Example: Blog Post Creation**

```typescript
test('should create, edit, and delete blog post', async ({ page, request }) => {
  let postId: string;
  let authToken: string;

  // Step 1: Setup user via API
  const authResponse = await request.post('/api/auth/login', {
    data: { email: 'blogger@example.com', password: 'BlogPass123!' }
  });
  authToken = (await authResponse.json()).token;

  // Step 2: Create blog post via UI
  await page.goto('/dashboard');
  await page.click('#new-post');
  await page.fill('#post-title', 'My Test Blog Post');
  await page.fill('#post-content', 'This is test content for my blog post.');
  await page.selectOption('#post-category', 'Technology');
  await page.click('#publish-post');

  // Verify UI shows success
  await expect(page.locator('.success-notification')).toBeVisible();

  // Step 3: Verify post created in backend via API
  const postsResponse = await request.get('/api/posts?author=blogger@example.com', {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  const posts = await postsResponse.json();

  expect(posts.length).toBeGreaterThan(0);

  const createdPost = posts.find(p => p.title === 'My Test Blog Post');
  expect(createdPost).toBeTruthy();
  expect(createdPost.content).toContain('This is test content');
  expect(createdPost.category).toBe('Technology');

  postId = createdPost.id;

  // Step 4: Edit post via API (faster than UI)
  await request.patch(`/api/posts/${postId}`, {
    headers: { 'Authorization': `Bearer ${authToken}` },
    data: {
      title: 'My Updated Blog Post',
      content: 'Updated content with more information.'
    }
  });

  // Step 5: Verify changes appear in UI
  await page.reload();
  await expect(page.locator('.post-title')).toHaveText('My Updated Blog Post');
  await expect(page.locator('.post-content')).toContain('Updated content');

  // Step 6: Delete via API (cleanup)
  await request.delete(`/api/posts/${postId}`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });

  // Verify deletion in UI
  await page.reload();
  await expect(page.locator(`[data-post-id="${postId}"]`)).not.toBeVisible();
});
```

### Pattern 4: API for Test Data Seeding

Create multiple records via API to test UI list/table functionality.

**Example: User Management Dashboard**

```typescript
test('should display and filter users in dashboard', async ({ page, request }) => {
  const authToken = await getAdminAuthToken(request);
  const userIds: string[] = [];

  // Seed multiple users via API
  const usersToCreate = [
    { name: 'Alice Smith', email: 'alice@example.com', role: 'Admin', status: 'Active' },
    { name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Active' },
    { name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'Inactive' },
    { name: 'Diana Prince', email: 'diana@example.com', role: 'Editor', status: 'Active' },
    { name: 'Eve Wilson', email: 'eve@example.com', role: 'User', status: 'Active' }
  ];

  for (const userData of usersToCreate) {
    const response = await request.post('/api/users', {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: userData
    });
    const user = await response.json();
    userIds.push(user.id);
  }

  // Test UI with seeded data
  await page.goto('/admin/users');

  // Verify all users are displayed
  await expect(page.locator('.user-row')).toHaveCount(5);

  // Test filtering by role
  await page.selectOption('#role-filter', 'User');
  await expect(page.locator('.user-row')).toHaveCount(3);

  // Test filtering by status
  await page.selectOption('#status-filter', 'Active');
  await expect(page.locator('.user-row')).toHaveCount(2);

  // Test search
  await page.fill('#search-input', 'Alice');
  await expect(page.locator('.user-row')).toHaveCount(1);
  await expect(page.locator('.user-name')).toHaveText('Alice Smith');

  // Cleanup via API
  for (const userId of userIds) {
    await request.delete(`/api/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
  }
});
```

### Pattern 5: API for Performance Optimization

Use API to set up complex test scenarios quickly.

**Example: Shopping Cart with Many Items**

```typescript
test('should handle cart with 50 items', async ({ page, request }) => {
  const authToken = await getUserAuthToken(request);
  const userId = await getUserId(request, authToken);

  // Add 50 items to cart via API (would be very slow via UI)
  const productIds: string[] = [];

  for (let i = 1; i <= 50; i++) {
    // Create product
    const productResponse = await request.post('/api/products', {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: {
        name: `Test Product ${i}`,
        price: 9.99 + i,
        stock: 100
      }
    });
    const product = await productResponse.json();
    productIds.push(product.id);

    // Add to cart
    await request.post(`/api/users/${userId}/cart`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: {
        productId: product.id,
        quantity: 1
      }
    });
  }

  // Now test UI with 50 items in cart
  await page.goto('/cart');

  // Verify cart displays correctly
  await expect(page.locator('.cart-item')).toHaveCount(50);

  // Test pagination
  await expect(page.locator('.pagination')).toBeVisible();

  // Test total calculation
  const totalText = await page.locator('.cart-total').textContent();
  expect(totalText).toContain('$'); // Verify total is displayed

  // Cleanup
  for (const productId of productIds) {
    await request.delete(`/api/products/${productId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
  }
});
```

### Pattern 6: API State Verification During UI Flow

Verify backend state at various points during a UI workflow.

**Example: Multi-Step Form**

```typescript
test('should save form progress at each step', async ({ page, request }) => {
  const authToken = await getUserAuthToken(request);
  let applicationId: string;

  // Start application via UI
  await page.goto('/applications/new');

  // Step 1: Personal Information
  await page.fill('#firstName', 'John');
  await page.fill('#lastName', 'Doe');
  await page.fill('#email', 'john@example.com');
  await page.click('#next-step');

  // Verify Step 1 saved via API
  const step1Response = await request.get('/api/applications/current', {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  const step1Data = await step1Response.json();

  expect(step1Data.firstName).toBe('John');
  expect(step1Data.lastName).toBe('Doe');
  expect(step1Data.currentStep).toBe(2);

  applicationId = step1Data.id;

  // Step 2: Address Information
  await page.fill('#address', '123 Main St');
  await page.fill('#city', 'Anytown');
  await page.fill('#zipCode', '12345');
  await page.click('#next-step');

  // Verify Step 2 saved via API
  const step2Response = await request.get(`/api/applications/${applicationId}`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  const step2Data = await step2Response.json();

  expect(step2Data.address).toBe('123 Main St');
  expect(step2Data.city).toBe('Anytown');
  expect(step2Data.currentStep).toBe(3);

  // Step 3: Review and Submit
  await page.click('#submit-application');

  // Verify application submitted via API
  const finalResponse = await request.get(`/api/applications/${applicationId}`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  const finalData = await finalResponse.json();

  expect(finalData.status).toBe('submitted');
  expect(finalData.submittedAt).toBeTruthy();

  // Cleanup
  await request.delete(`/api/applications/${applicationId}`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
});
```

### Pattern 7: API for Concurrent User Testing

Simulate multiple users via API while testing UI for one user.

**Example: Real-time Collaboration**

```typescript
test('should show real-time updates from other users', async ({ page, request }) => {
  const user1Token = await getUserAuthToken(request, 'user1@example.com', 'pass1');
  const user2Token = await getUserAuthToken(request, 'user2@example.com', 'pass2');

  const documentId = await createDocument(request, user1Token, 'Shared Document');

  // User 1 opens document in UI
  await page.goto(`/documents/${documentId}`);
  await expect(page.locator('.document-title')).toHaveText('Shared Document');

  // User 2 edits document via API (simulating concurrent user)
  await request.patch(`/api/documents/${documentId}`, {
    headers: { 'Authorization': `Bearer ${user2Token}` },
    data: {
      content: 'User 2 added this content',
      lastEditedBy: 'user2@example.com'
    }
  });

  // Verify User 1 sees the update in UI (real-time or after refresh)
  await page.waitForTimeout(2000); // Wait for real-time update

  await expect(page.locator('.document-content')).toContain('User 2 added this content');
  await expect(page.locator('.last-edited-by')).toHaveText('user2@example.com');

  // Cleanup
  await request.delete(`/api/documents/${documentId}`, {
    headers: { 'Authorization': `Bearer ${user1Token}` }
  });
});
```

### Helper Functions for API + UI Tests

Create reusable helper functions:

```typescript
// helpers/TestSetupHelpers.ts
export class TestSetupHelpers {
  static async createAuthenticatedUser(
    request: APIRequestContext,
    userData?: Partial<{ name: string; email: string; password: string }>
  ): Promise<{ userId: string; token: string; email: string }> {
    const user = {
      name: userData?.name || 'Test User',
      email: userData?.email || `test${Date.now()}@example.com`,
      password: userData?.password || 'TestPass123!'
    };

    const createResponse = await request.post('/api/users', { data: user });
    const createdUser = await createResponse.json();

    const loginResponse = await request.post('/api/auth/login', {
      data: { email: user.email, password: user.password }
    });
    const loginData = await loginResponse.json();

    return {
      userId: createdUser.id,
      token: loginData.token,
      email: user.email
    };
  }

  static async setupUserSession(
    page: Page,
    token: string,
    domain: string = 'localhost'
  ): Promise<void> {
    await page.context().addCookies([{
      name: 'auth_token',
      value: token,
      domain: domain,
      path: '/'
    }]);
  }

  static async seedProducts(
    request: APIRequestContext,
    count: number,
    authToken: string
  ): Promise<string[]> {
    const productIds: string[] = [];

    for (let i = 1; i <= count; i++) {
      const response = await request.post('/api/products', {
        headers: { 'Authorization': `Bearer ${authToken}` },
        data: {
          name: `Test Product ${i}`,
          price: 10 + i,
          stock: 100
        }
      });
      const product = await response.json();
      productIds.push(product.id);
    }

    return productIds;
  }

  static async cleanupEntities(
    request: APIRequestContext,
    entityType: string,
    ids: string[],
    authToken: string
  ): Promise<void> {
    for (const id of ids) {
      await request.delete(`/api/${entityType}/${id}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
    }
  }
}

// Usage in tests
test('using helper functions', async ({ page, request }) => {
  const { userId, token } = await TestSetupHelpers.createAuthenticatedUser(request);
  await TestSetupHelpers.setupUserSession(page, token);

  const productIds = await TestSetupHelpers.seedProducts(request, 10, token);

  // Perform UI tests
  await page.goto('/products');
  await expect(page.locator('.product-card')).toHaveCount(10);

  // Cleanup
  await TestSetupHelpers.cleanupEntities(request, 'products', productIds, token);
  await TestSetupHelpers.cleanupEntities(request, 'users', [userId], token);
});
```

### Best Practices for API + UI Testing

1. **Use API for Setup and Cleanup**
   - Always prefer API for test data creation
   - Use API for teardown to ensure clean state
   - Avoid creating data through UI unless testing that specific flow

2. **Verify Critical Paths with Both**
   - Use UI to test user experience
   - Use API to verify backend state
   - Combine both for comprehensive coverage

3. **Optimize Test Speed**
   - Minimize UI interactions
   - Use API for bulk operations
   - Run API tests in parallel

4. **Maintain Test Independence**
   - Each test should set up its own data
   - Clean up after each test
   - Don't rely on test execution order

5. **Use Appropriate Tools for Each Layer**
   ```typescript
   // Good: API for data setup
   await request.post('/api/users', { data: userData });

   // Then UI for user journey
   await page.goto('/dashboard');
   await page.click('#profile-link');

   // Then API to verify backend
   const user = await request.get(`/api/users/${userId}`);
   ```

---

## Best Practices

### 1. Test Organization

**Group related tests:**
```typescript
test.describe('User API', () => {
  test.describe('GET /users', () => {
    test('should return all users', async ({ request }) => {
      // ...
    });

    test('should filter by query params', async ({ request }) => {
      // ...
    });
  });

  test.describe('POST /users', () => {
    test('should create user', async ({ request }) => {
      // ...
    });

    test('should validate required fields', async ({ request }) => {
      // ...
    });
  });
});
```

### 2. Use beforeEach and afterEach

```typescript
test.describe('Posts API', () => {
  let apiClient: ApiClient;
  let createdPostId: number;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);

    // Setup: Create a post for tests
    const response = await apiClient.post('/posts', {
      data: { title: 'Test', body: 'Content', userId: 1 }
    });
    const post = await response.json();
    createdPostId = post.id;
  });

  test.afterEach(async () => {
    // Cleanup: Delete created post
    if (createdPostId) {
      await apiClient.delete(`/posts/${createdPostId}`);
    }
  });

  test('should update post', async () => {
    const response = await apiClient.patch(`/posts/${createdPostId}`, {
      data: { title: 'Updated' }
    });
    await ApiAssertions.assertStatusCode(response, 200);
  });
});
```

### 3. Use Descriptive Test Names

```typescript
// ❌ Bad
test('test 1', async ({ request }) => {});

// ✅ Good
test('GET /users/:id should return 404 for non-existent user', async ({ request }) => {});

// ✅ Better
test('should return 404 when requesting non-existent user by ID', async ({ request }) => {});
```

### 4. Test Data Independence

```typescript
// ✅ Each test creates its own data
test('should create user', async ({ request }) => {
  const newUser = {
    name: DataGenerator.randomString(10),
    email: DataGenerator.randomEmail()
  };

  const response = await request.post('/users', { data: newUser });
  await ApiAssertions.assertStatusCode(response, 201);
});

// ❌ Don't rely on data from other tests
test('should update user', async ({ request }) => {
  // Don't assume userId 1 exists
  const response = await request.patch('/users/1', {
    data: { name: 'Updated' }
  });
});
```

### 5. Assert All Important Fields

```typescript
test('should return complete user data', async ({ request }) => {
  const response = await request.get('/users/1');

  // Verify status
  await ApiAssertions.assertStatusCode(response, 200);

  // Verify all important fields
  await ApiAssertions.assertBodyHasProperty(response, 'id');
  await ApiAssertions.assertBodyHasProperty(response, 'name');
  await ApiAssertions.assertBodyHasProperty(response, 'email');
  await ApiAssertions.assertBodyHasProperty(response, 'username');

  // Verify data types
  const user = await response.json();
  expect(typeof user.id).toBe('number');
  expect(typeof user.name).toBe('string');
  expect(typeof user.email).toBe('string');
});
```

### 6. Handle Environment Configuration

```typescript
// config/environment.ts
export class Environment {
  static get baseURL(): string {
    return process.env.API_BASE_URL || 'https://api.example.com';
  }

  static get apiKey(): string {
    if (!process.env.API_KEY) {
      throw new Error('API_KEY is required');
    }
    return process.env.API_KEY;
  }

  static get timeout(): number {
    return parseInt(process.env.TIMEOUT || '30000');
  }
}

// Use in tests
test('should use environment config', async ({ request }) => {
  const builder = new RequestBuilder();
  const options = builder
    .addHeader('X-API-Key', Environment.apiKey)
    .build();

  const response = await request.get('/data', options);
  await ApiAssertions.assertStatusCode(response, 200);
});
```

### 7. Use Tags for Test Organization

```typescript
// @smoke @critical
test('Critical health check', async ({ request }) => {
  const response = await request.get('/health');
  await ApiAssertions.assertStatusCode(response, 200);
});

// @regression
test('Detailed validation test', async ({ request }) => {
  // Detailed test...
});
```

Run specific tags:
```bash
npx playwright test --grep @smoke
npx playwright test --grep "@critical|@smoke"
```

### 8. Log Important Information

```typescript
test('should create and verify user', async ({ request }) => {
  const newUser = {
    name: DataGenerator.randomString(10),
    email: DataGenerator.randomEmail()
  };

  console.log('Creating user with data:', newUser);

  const response = await request.post('/users', { data: newUser });
  const createdUser = await response.json();

  console.log('Created user:', createdUser);

  await ApiAssertions.assertStatusCode(response, 201);
});
```

---

## Common Patterns and Examples

### Pattern 1: Search and Filter

```typescript
test('Search users by criteria', async ({ request }) => {
  const builder = new RequestBuilder();
  const options = builder
    .addQueryParam('name', 'John')
    .addQueryParam('email', '@example.com')
    .addQueryParam('_sort', 'name')
    .addQueryParam('_order', 'asc')
    .build();

  const response = await request.get('/users', options);

  await ApiAssertions.assertStatusCode(response, 200);
  await ApiAssertions.assertBodyIsArray(response);

  const users = await response.json();
  users.forEach((user: any) => {
    expect(user.name).toContain('John');
  });
});
```

### Pattern 2: Batch Operations

```typescript
test('Create multiple resources', async ({ request }) => {
  const users = [
    { name: 'User 1', email: 'user1@example.com' },
    { name: 'User 2', email: 'user2@example.com' },
    { name: 'User 3', email: 'user3@example.com' },
  ];

  const createPromises = users.map(user =>
    request.post('/users', { data: user })
  );

  const responses = await Promise.all(createPromises);

  for (const response of responses) {
    await ApiAssertions.assertStatusCode(response, 201);
  }
});
```

### Pattern 3: Conditional Testing

```typescript
test('Conditional endpoint testing', async ({ request }) => {
  const configResponse = await request.get('/config');
  const config = await configResponse.json();

  if (config.featureEnabled) {
    const featureResponse = await request.get('/new-feature');
    await ApiAssertions.assertStatusCode(featureResponse, 200);
  } else {
    const featureResponse = await request.get('/new-feature');
    await ApiAssertions.assertStatusCode(featureResponse, 404);
  }
});
```

### Pattern 4: Data-Driven Testing

```typescript
const testCases = [
  { input: { name: 'John', email: 'john@example.com' }, expectedStatus: 201 },
  { input: { name: '', email: 'john@example.com' }, expectedStatus: 400 },
  { input: { name: 'John', email: 'invalid' }, expectedStatus: 400 },
  { input: {}, expectedStatus: 400 },
];

testCases.forEach(({ input, expectedStatus }) => {
  test(`should return ${expectedStatus} for input ${JSON.stringify(input)}`, async ({ request }) => {
    const response = await request.post('/users', {
      data: input,
      failOnStatusCode: false
    });

    await ApiAssertions.assertStatusCode(response, expectedStatus);
  });
});
```

### Pattern 5: Polling for Status

```typescript
test('Poll until job completes', async ({ request }) => {
  // Start a long-running job
  const startResponse = await request.post('/jobs', {
    data: { type: 'export' }
  });
  const job = await startResponse.json();
  const jobId = job.id;

  // Poll for completion
  let completed = false;
  let attempts = 0;
  const maxAttempts = 30;

  while (!completed && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const statusResponse = await request.get(`/jobs/${jobId}`);
    const status = await statusResponse.json();

    console.log(`Attempt ${attempts + 1}: Job status is ${status.state}`);

    if (status.state === 'completed') {
      completed = true;
    } else if (status.state === 'failed') {
      throw new Error('Job failed');
    }

    attempts++;
  }

  expect(completed).toBeTruthy();
});
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Connection Timeout

**Error:**
```
Error: page.request.get: Request timeout of 30000ms exceeded
```

**Solution:**
```typescript
// Increase timeout in playwright.config.ts
export default defineConfig({
  timeout: 120 * 1000, // 2 minutes
});

// Or per request
const response = await request.get('/slow-endpoint', {
  timeout: 60000
});
```

#### 2. CORS Errors

**Error:**
```
Access-Control-Allow-Origin header is missing
```

**Solution:**
CORS is typically not an issue in API testing since we're making server-to-server requests, not browser requests. If you encounter this, you're likely testing from a browser context.

#### 3. SSL Certificate Errors

**Error:**
```
Error: self signed certificate
```

**Solution:**
```typescript
// In playwright.config.ts (NOT recommended for production)
export default defineConfig({
  use: {
    ignoreHTTPSErrors: true,
  },
});
```

#### 4. Authentication Failures

**Error:**
```
401 Unauthorized
```

**Solution:**
```typescript
// Verify token is correctly set
const builder = new RequestBuilder();
const options = builder
  .setBearerToken(process.env.API_TOKEN!)
  .build();

// Check token in .env file
console.log('Token:', process.env.API_TOKEN);

// Verify header format
console.log('Headers:', options.headers);
```

#### 5. Response Parsing Errors

**Error:**
```
SyntaxError: Unexpected token < in JSON
```

**Solution:**
```typescript
// Check content type first
const contentType = response.headers()['content-type'];
console.log('Content-Type:', contentType);

// Parse based on content type
if (contentType.includes('application/json')) {
  const data = await response.json();
} else {
  const text = await response.text();
  console.log('Non-JSON response:', text);
}
```

#### 6. Flaky Tests

**Problem:** Tests pass sometimes, fail other times

**Solution:**
```typescript
// Use retry mechanism
const apiClient = new ApiClient(request);
const response = await apiClient.requestWithRetry('GET', '/endpoint', {}, 3, 1000);

// Or configure retries in playwright.config.ts
export default defineConfig({
  retries: 2,
});

// Add waits for eventual consistency
await ApiHelper.waitForCondition(
  async () => {
    const response = await request.get('/resource');
    return response.ok();
  },
  10000
);
```

### Debug Tips

#### 1. Enable Verbose Logging

```typescript
// In your test
test('debug test', async ({ request }) => {
  const response = await request.get('/users/1');

  console.log('Status:', response.status());
  console.log('Headers:', response.headers());
  console.log('Body:', await response.text());
});
```

#### 2. Use Playwright Inspector

```bash
npx playwright test --debug
```

#### 3. Save Response to File

```typescript
test('save response', async ({ request }) => {
  const response = await request.get('/users');
  const data = await response.json();

  const fs = require('fs');
  fs.writeFileSync('response.json', JSON.stringify(data, null, 2));
});
```

#### 4. Check Network in Report

After running tests, open the HTML report:
```bash
npx playwright show-report
```

Click on a test to see network requests and responses.

---

## Test Recording and Reporting Best Practices

### Why Record Test Details?

Recording comprehensive test details is crucial for:

1. **Debugging Failures**: Understand what went wrong when tests fail
2. **Audit Trail**: Track what was tested and when
3. **Collaboration**: Help team members understand test execution
4. **Compliance**: Provide evidence of testing for regulatory requirements
5. **Performance Analysis**: Track response times and identify bottlenecks
6. **Historical Trends**: Analyze test stability over time

### What to Record

#### 1. Essential Information

Always record these details for every test:

```typescript
import { test, expect } from '@playwright/test';

test('Example with comprehensive logging', async ({ request }) => {
  const testStartTime = Date.now();

  console.log('='.repeat(50));
  console.log(`Test: ${test.info().title}`);
  console.log(`Started at: ${new Date().toISOString()}`);
  console.log('='.repeat(50));

  // Test execution
  const requestStartTime = Date.now();
  const response = await request.get('/users/1');
  const requestDuration = Date.now() - requestStartTime;

  // Log request details
  console.log('\n📤 REQUEST:');
  console.log(`  Method: GET`);
  console.log(`  URL: /users/1`);
  console.log(`  Duration: ${requestDuration}ms`);

  // Log response details
  console.log('\n📥 RESPONSE:');
  console.log(`  Status: ${response.status()}`);
  console.log(`  Content-Type: ${response.headers()['content-type']}`);

  const body = await response.json();
  console.log(`  Body: ${JSON.stringify(body, null, 2)}`);

  // Assertions
  expect(response.status()).toBe(200);

  const testDuration = Date.now() - testStartTime;
  console.log(`\n✅ Test completed in ${testDuration}ms`);
});
```

#### 2. Request and Response Data

**Create a Logger Helper:**

Create `utils/TestLogger.ts`:

```typescript
export class TestLogger {
  static logRequest(method: string, url: string, data?: any, headers?: any) {
    console.log('\n📤 API REQUEST:');
    console.log(`  Timestamp: ${new Date().toISOString()}`);
    console.log(`  Method: ${method}`);
    console.log(`  URL: ${url}`);

    if (headers) {
      console.log(`  Headers:`);
      Object.entries(headers).forEach(([key, value]) => {
        // Mask sensitive data
        if (key.toLowerCase().includes('auth') || key.toLowerCase().includes('key')) {
          console.log(`    ${key}: ****`);
        } else {
          console.log(`    ${key}: ${value}`);
        }
      });
    }

    if (data) {
      console.log(`  Body: ${JSON.stringify(data, null, 2)}`);
    }
  }

  static logResponse(response: any, duration: number, body?: any) {
    console.log('\n📥 API RESPONSE:');
    console.log(`  Timestamp: ${new Date().toISOString()}`);
    console.log(`  Status: ${response.status()}`);
    console.log(`  Duration: ${duration}ms`);
    console.log(`  Headers:`);

    const headers = response.headers();
    Object.entries(headers).forEach(([key, value]) => {
      console.log(`    ${key}: ${value}`);
    });

    if (body) {
      console.log(`  Body: ${JSON.stringify(body, null, 2)}`);
    }
  }

  static logAssertion(description: string, expected: any, actual: any, passed: boolean) {
    const icon = passed ? '✅' : '❌';
    console.log(`\n${icon} ASSERTION: ${description}`);
    console.log(`  Expected: ${JSON.stringify(expected)}`);
    console.log(`  Actual: ${JSON.stringify(actual)}`);
    console.log(`  Result: ${passed ? 'PASSED' : 'FAILED'}`);
  }

  static logError(error: Error) {
    console.error('\n❌ ERROR:');
    console.error(`  Message: ${error.message}`);
    console.error(`  Stack: ${error.stack}`);
  }

  static logTestStep(stepNumber: number, description: string) {
    console.log(`\n📋 Step ${stepNumber}: ${description}`);
  }

  static logSeparator(title?: string) {
    console.log('\n' + '='.repeat(70));
    if (title) {
      console.log(`  ${title}`);
      console.log('='.repeat(70));
    }
  }
}
```

**Using the Logger:**

```typescript
import { TestLogger } from '../../utils/TestLogger';

test('Using TestLogger for detailed recording', async ({ request }) => {
  TestLogger.logSeparator('CREATE USER TEST');

  // Step 1: Prepare data
  TestLogger.logTestStep(1, 'Prepare test data');
  const newUser = {
    name: 'John Doe',
    email: 'john@example.com'
  };
  console.log('Test data:', newUser);

  // Step 2: Send request
  TestLogger.logTestStep(2, 'Send POST request to create user');
  TestLogger.logRequest('POST', '/users', newUser);

  const startTime = Date.now();
  const response = await request.post('/users', { data: newUser });
  const duration = Date.now() - startTime;

  const responseBody = await response.json();
  TestLogger.logResponse(response, duration, responseBody);

  // Step 3: Verify response
  TestLogger.logTestStep(3, 'Verify response');
  const statusMatch = response.status() === 201;
  TestLogger.logAssertion('Status code is 201', 201, response.status(), statusMatch);
  expect(statusMatch).toBeTruthy();

  TestLogger.logSeparator('TEST COMPLETED');
});
```

#### 3. Attachments in Playwright

Playwright allows you to attach files, screenshots, and data to test reports:

```typescript
import { test } from '@playwright/test';

test('Test with attachments', async ({ request }, testInfo) => {
  const response = await request.get('/users/1');
  const body = await response.json();

  // Attach JSON response
  await testInfo.attach('response-body', {
    body: JSON.stringify(body, null, 2),
    contentType: 'application/json'
  });

  // Attach request details
  await testInfo.attach('request-details', {
    body: JSON.stringify({
      method: 'GET',
      url: '/users/1',
      timestamp: new Date().toISOString(),
      status: response.status()
    }, null, 2),
    contentType: 'application/json'
  });

  // Attach performance metrics
  const performanceData = {
    testDuration: testInfo.duration,
    status: response.status(),
    timestamp: Date.now()
  };

  await testInfo.attach('performance-metrics', {
    body: JSON.stringify(performanceData, null, 2),
    contentType: 'application/json'
  });
});
```

#### 4. Custom Test Metadata

Add custom annotations to track test metadata:

```typescript
test('Critical user creation test', async ({ request }, testInfo) => {
  // Add custom annotations
  testInfo.annotations.push(
    { type: 'priority', description: 'critical' },
    { type: 'jira', description: 'PROJ-123' },
    { type: 'author', description: 'john.doe@example.com' },
    { type: 'execution-time', description: new Date().toISOString() }
  );

  // Test implementation
  const response = await request.post('/users', {
    data: { name: 'Test User', email: 'test@example.com' }
  });

  expect(response.status()).toBe(201);
});
```

### Performance Tracking

Create a performance tracking helper:

```typescript
// utils/PerformanceTracker.ts
export class PerformanceTracker {
  private metrics: Map<string, number[]> = new Map();

  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  getMetrics(name: string) {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return null;

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      count: values.length
    };
  }

  getAllMetrics() {
    const result: any = {};
    this.metrics.forEach((values, name) => {
      result[name] = this.getMetrics(name);
    });
    return result;
  }

  generateReport() {
    console.log('\n📊 PERFORMANCE REPORT:');
    console.log('='.repeat(70));

    this.metrics.forEach((values, name) => {
      const stats = this.getMetrics(name);
      console.log(`\n${name}:`);
      console.log(`  Calls: ${stats?.count}`);
      console.log(`  Min: ${stats?.min}ms`);
      console.log(`  Max: ${stats?.max}ms`);
      console.log(`  Avg: ${stats?.avg.toFixed(2)}ms`);
    });

    console.log('\n' + '='.repeat(70));
  }
}

// Usage
test('Performance tracking example', async ({ request }) => {
  const tracker = new PerformanceTracker();

  for (let i = 1; i <= 5; i++) {
    const start = Date.now();
    await request.get(`/users/${i}`);
    const duration = Date.now() - start;

    tracker.recordMetric('GET /users/:id', duration);
  }

  tracker.generateReport();
});
```

---

## Reporting: Allure vs Playwright HTML Report

### Overview Comparison

| Feature | Playwright HTML Report | Allure Report |
|---------|------------------------|---------------|
| **Setup Complexity** | 🟢 Built-in, zero config | 🟡 Requires installation & setup |
| **Visual Appeal** | 🟢 Clean, modern UI | 🟢 Professional, highly visual |
| **Historical Trends** | ❌ Single run only | ✅ Track trends over time |
| **Categories & Suites** | ✅ Basic grouping | ✅ Advanced categorization |
| **Attachments** | ✅ Screenshots, traces | ✅ Any file type, rich media |
| **Test Steps** | ⚠️ Limited | ✅ Detailed step-by-step view |
| **Filtering** | ✅ Basic filtering | ✅ Advanced filtering & search |
| **Retries Visualization** | ✅ Shows retry attempts | ✅ Shows retry attempts |
| **Environment Info** | ⚠️ Limited | ✅ Comprehensive env details |
| **Custom Metadata** | ⚠️ Via annotations | ✅ Extensive metadata support |
| **Integration** | 🟢 Perfect with Playwright | 🟢 Works with many frameworks |
| **CI/CD Hosting** | ⚠️ Requires custom solution | ✅ Many hosting options available |
| **Real-time Updates** | ❌ Post-execution only | ❌ Post-execution only |
| **Mobile Friendly** | ✅ Responsive design | ✅ Responsive design |
| **Test Duration Graphs** | ✅ Basic timeline | ✅ Detailed graphs & charts |

### Playwright HTML Report

#### Advantages

1. **Zero Configuration**
   - Built into Playwright
   - No additional setup required
   - Works out of the box

2. **Perfect Integration**
   - Native support for Playwright features
   - Automatic trace viewer integration
   - Built-in screenshot viewing

3. **Simplicity**
   - Easy to understand
   - Quick to navigate
   - Minimal learning curve

4. **Trace Viewer**
   - Interactive trace inspection
   - Network tab visualization
   - Console logs included

#### Limitations

1. **Single Run Focus**
   - No historical trend analysis
   - Cannot compare runs
   - No long-term tracking

2. **Limited Customization**
   - Fixed report format
   - Limited branding options
   - No custom sections

3. **Basic Categorization**
   - Simple project/file grouping
   - Limited tagging capabilities
   - No advanced filtering

#### Setup & Usage

**Already configured in `playwright.config.ts`:**

```typescript
export default defineConfig({
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'], // Console output
  ],
});
```

**Generate and view:**

```bash
# Run tests (automatically generates report)
npm test

# View the report
npm run report
# or
npx playwright show-report
```

**Report Features:**

- **Test results** with pass/fail status
- **Duration** for each test
- **Error messages** and stack traces
- **Attachments** (screenshots, traces, videos)
- **Retry information** for flaky tests
- **Filters** by status, project, file

#### Example with Enhanced Logging

```typescript
test('Playwright HTML report example', async ({ request }, testInfo) => {
  // This will appear in the report
  console.log('Starting user creation test');

  const response = await request.post('/users', {
    data: { name: 'Test User', email: 'test@example.com' }
  });

  const body = await response.json();

  // Attach response for debugging
  await testInfo.attach('response', {
    body: JSON.stringify(body, null, 2),
    contentType: 'application/json'
  });

  expect(response.status()).toBe(201);
});
```

### Allure Report

#### Advantages

1. **Historical Analysis**
   - Track test trends over multiple runs
   - Identify flaky tests automatically
   - Compare execution history

2. **Rich Visualizations**
   - Graphs and charts
   - Test duration trends
   - Success rate over time
   - Pie charts for test distribution

3. **Advanced Organization**
   - Behavior-driven organization (Features, Stories)
   - Custom categories
   - Severity levels
   - Test suites and sub-suites

4. **Detailed Test Steps**
   - Step-by-step execution view
   - Nested steps support
   - Step attachments
   - Duration per step

5. **Comprehensive Metadata**
   - Environment details
   - Test parameters
   - Links (JIRA, documentation)
   - Owner information
   - Tags and labels

6. **Better for Stakeholders**
   - Executive summaries
   - Professional appearance
   - Export capabilities
   - Timeline visualization

#### Limitations

1. **Setup Complexity**
   - Requires additional npm package
   - Needs Java for report generation
   - More configuration required

2. **Learning Curve**
   - More features to learn
   - Requires understanding of Allure concepts
   - Need to manage result history

3. **Dependencies**
   - Java runtime required for viewing
   - Additional tooling needed
   - More moving parts

#### Setup Instructions

**Step 1: Install Dependencies**

```bash
npm install -D allure-playwright
```

**Step 2: Install Allure CLI (choose one method)**

```bash
# Using npm
npm install -g allure-commandline --save-dev

# Using brew (macOS)
brew install allure

# Using scoop (Windows)
scoop install allure
```

**Step 3: Update `playwright.config.ts`**

```typescript
export default defineConfig({
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['allure-playwright', {
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: false,
      environmentInfo: {
        'Test Environment': process.env.TEST_ENV || 'Development',
        'Base URL': process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
        'Node Version': process.version,
        'OS': process.platform
      }
    }]
  ],
});
```

**Step 4: Update `package.json` scripts**

Already configured:
```json
{
  "scripts": {
    "allure:generate": "allure generate ./allure-results --clean -o ./allure-report",
    "allure:serve": "allure serve ./allure-results"
  }
}
```

**Step 5: Run tests and generate report**

```bash
# Run tests
npm test

# Generate and view Allure report
npm run allure:serve

# Or generate report and open manually
npm run allure:generate
# Then open allure-report/index.html
```

#### Using Allure Features in Tests

**1. Basic Test with Description**

```typescript
import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test('User creation with Allure annotations', async ({ request }) => {
  await allure.description('This test verifies that a new user can be created via the API');
  await allure.owner('john.doe@example.com');
  await allure.tag('smoke');
  await allure.tag('critical');
  await allure.severity('critical');
  await allure.link('https://jira.example.com/PROJ-123', 'JIRA Ticket');

  const response = await request.post('/users', {
    data: { name: 'John Doe', email: 'john@example.com' }
  });

  expect(response.status()).toBe(201);
});
```

**2. Test with Steps**

```typescript
test('Complete user workflow with steps', async ({ request }) => {
  await allure.epic('User Management');
  await allure.feature('User CRUD Operations');
  await allure.story('Create and verify user');

  let userId: number;

  await allure.step('Step 1: Create new user', async () => {
    const newUser = { name: 'Jane Doe', email: 'jane@example.com' };

    await allure.step('Prepare user data', async () => {
      console.log('User data:', newUser);
      await allure.attachment('Request Body', JSON.stringify(newUser, null, 2), 'application/json');
    });

    await allure.step('Send POST request', async () => {
      const response = await request.post('/users', { data: newUser });
      const body = await response.json();
      userId = body.id;

      await allure.attachment('Response Body', JSON.stringify(body, null, 2), 'application/json');
      expect(response.status()).toBe(201);
    });
  });

  await allure.step('Step 2: Verify user was created', async () => {
    await allure.parameter('User ID', userId);

    const response = await request.get(`/users/${userId}`);
    expect(response.status()).toBe(200);

    const user = await response.json();
    await allure.attachment('User Details', JSON.stringify(user, null, 2), 'application/json');
  });

  await allure.step('Step 3: Update user email', async () => {
    const response = await request.patch(`/users/${userId}`, {
      data: { email: 'jane.updated@example.com' }
    });
    expect(response.status()).toBe(200);
  });

  await allure.step('Step 4: Delete user', async () => {
    const response = await request.delete(`/users/${userId}`);
    expect(response.status()).toBe(200);
  });
});
```

**3. Test with Parameters**

```typescript
const testData = [
  { name: 'John Doe', email: 'john@example.com', expectedStatus: 201 },
  { name: 'Jane Smith', email: 'jane@example.com', expectedStatus: 201 },
];

testData.forEach(({ name, email, expectedStatus }) => {
  test(`Create user: ${name}`, async ({ request }) => {
    await allure.parameter('Name', name);
    await allure.parameter('Email', email);
    await allure.parameter('Expected Status', expectedStatus);

    const response = await request.post('/users', {
      data: { name, email }
    });

    expect(response.status()).toBe(expectedStatus);
  });
});
```

**4. Test with Environment Info**

```typescript
import { test } from '@playwright/test';
import { allure } from 'allure-playwright';

test.beforeEach(async () => {
  // Add environment information
  await allure.parameter('Environment', process.env.TEST_ENV || 'development');
  await allure.parameter('Base URL', process.env.API_BASE_URL || 'default');
  await allure.parameter('Execution Time', new Date().toISOString());
});
```

**5. Attaching Files and Screenshots**

```typescript
test('Test with various attachments', async ({ request }) => {
  const response = await request.get('/users/1');
  const body = await response.json();

  // Attach JSON
  await allure.attachment('Response JSON', JSON.stringify(body, null, 2), 'application/json');

  // Attach text
  await allure.attachment('Request Details', `
    Method: GET
    URL: /users/1
    Status: ${response.status()}
    Timestamp: ${new Date().toISOString()}
  `, 'text/plain');

  // Attach CSV (example)
  const csvData = 'id,name,email\n1,John,john@example.com';
  await allure.attachment('User Data CSV', csvData, 'text/csv');
});
```

### When to Use Which Report?

#### Use Playwright HTML Report When:

1. **Quick Feedback Needed**
   - Running tests locally during development
   - Debugging specific test failures
   - You need immediate visual feedback

2. **Simple Projects**
   - Small test suites
   - Limited stakeholder reporting
   - No historical analysis required

3. **CI/CD Simplicity**
   - Want minimal dependencies
   - Don't want to manage Java runtime
   - Need fast report generation

4. **Trace Analysis Important**
   - Heavy use of Playwright's trace viewer
   - Need to debug UI interactions
   - Want integrated debugging tools

#### Use Allure Report When:

1. **Professional Reporting**
   - Sharing with non-technical stakeholders
   - Executive summaries needed
   - Want polished, professional appearance

2. **Historical Analysis**
   - Track test stability over time
   - Identify flaky tests
   - Monitor test suite trends

3. **Large Test Suites**
   - Hundreds or thousands of tests
   - Need advanced filtering
   - Require detailed categorization

4. **Complex Organization**
   - Multiple teams/projects
   - Behavior-driven development (BDD)
   - Need epic/feature/story hierarchy

5. **Compliance & Documentation**
   - Need audit trails
   - Require detailed test documentation
   - Link tests to requirements/tickets

### Using Both Reports Together (Recommended)

You can (and should) use both reporters simultaneously:

```typescript
// playwright.config.ts
export default defineConfig({
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],  // For developers
    ['allure-playwright', { outputFolder: 'allure-results' }],  // For stakeholders
    ['list'],  // Console output
    ['json', { outputFile: 'test-results/results.json' }],  // For CI/CD
    ['junit', { outputFile: 'test-results/junit.xml' }],  // For CI/CD integration
  ],
});
```

**Workflow:**

1. **During Development**: Use Playwright HTML report for quick debugging
2. **For Stakeholders**: Generate Allure report for presentations
3. **In CI/CD**: Both reports + JSON/JUnit for integration

### Report Hosting and Sharing

#### Playwright HTML Report

**GitHub Pages:**
```yaml
# .github/workflows/tests.yml
- name: Upload Playwright Report
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30
```

#### Allure Report

**Allure Server (Self-hosted):**
```bash
# Install Allure Docker
docker pull frankescobar/allure-docker-service

# Run Allure Server
docker run -p 5050:5050 \
  -v $(pwd)/allure-results:/app/allure-results \
  frankescobar/allure-docker-service
```

**GitHub Pages with History:**
```yaml
- name: Deploy Allure Report to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./allure-report
    keep_files: true
```

### Best Practices for Test Reporting

1. **Always Record**:
   - Request/response bodies
   - Response times
   - Error details
   - Test environment info

2. **Use Meaningful Names**:
   - Descriptive test names
   - Clear step descriptions
   - Meaningful attachment names

3. **Categorize Tests**:
   - Use tags (smoke, regression, critical)
   - Group by feature/module
   - Add severity levels

4. **Include Context**:
   - Environment variables
   - Test data used
   - API endpoints tested

5. **Attach Evidence**:
   - Request/response payloads
   - Error screenshots (if applicable)
   - Performance metrics

6. **Track Performance**:
   - Record response times
   - Monitor trends
   - Set performance thresholds

---

## Next Steps

Congratulations! You now have a comprehensive understanding of API testing with Playwright. Here's what to do next:

### 1. Practice
- Write tests for a public API (JSONPlaceholder, ReqRes, etc.)
- Create tests for your own application's APIs
- Experiment with different assertion methods

### 2. Extend the Framework
- Add custom assertions for your domain
- Create reusable test fixtures
- Build custom reporters

### 3. Integrate with CI/CD
- Set up GitHub Actions workflow
- Configure test execution on pull requests
- Add test result reporting

### 4. Explore Advanced Topics
- Contract testing with Pact
- Performance testing with k6
- API mocking with Mock Service Worker
- GraphQL API testing

### 5. Resources
- [Playwright Documentation](https://playwright.dev/)
- [REST API Tutorial](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [JSON Schema](https://json-schema.org/)

---

## Summary

In this guide, you learned:

✅ What API testing is and why it matters
✅ How REST APIs work (HTTP methods, status codes, requests/responses)
✅ Setting up Playwright for API testing
✅ Writing your first API tests
✅ Using framework components (ApiClient, RequestBuilder, validators)
✅ Managing test data and generating random data
✅ Advanced topics (authentication, chaining, parallel requests)
✅ **Database integration testing with Playwright**
✅ **Using API tests to complement UI tests for faster, more reliable testing**
✅ **Hybrid testing strategies combining API and UI tests**
✅ Best practices for maintainable tests
✅ Common patterns and troubleshooting
✅ Comprehensive test reporting with Playwright HTML and Allure

You're now ready to build comprehensive API test suites with Playwright, integrate database verification, and create efficient hybrid testing strategies!

---

**Happy Testing! 🚀**

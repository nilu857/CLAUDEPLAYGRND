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
11. [Best Practices](#best-practices)
12. [Common Patterns and Examples](#common-patterns-and-examples)
13. [Troubleshooting](#troubleshooting)

---

## Introduction

This comprehensive guide will teach you everything you need to know about API testing using Playwright. Whether you're new to API testing or transitioning from another tool, this guide covers all concepts from the ground up with detailed explanations and practical examples.

By the end of this guide, you'll be able to:
- Understand what APIs are and how they work
- Write comprehensive API tests using Playwright
- Validate API responses effectively
- Handle authentication and complex scenarios
- Build a maintainable test automation framework

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

#### Test Data Design Patterns

Designing effective test data is crucial for comprehensive API testing. Here are common patterns and strategies:

##### 1. Invalid Data Testing

Test data should cover all invalid scenarios for each field type. Create comprehensive invalid data files:

**Create `data/invalidUserData.json`:**

```json
{
  "emptyName": {
    "name": "",
    "email": "valid@example.com",
    "username": "validuser",
    "expectedError": "Name is required"
  },
  "nullName": {
    "name": null,
    "email": "valid@example.com",
    "username": "validuser",
    "expectedError": "Name must be a string"
  },
  "tooShortName": {
    "name": "Jo",
    "email": "valid@example.com",
    "username": "validuser",
    "expectedError": "Name must be at least 3 characters"
  },
  "tooLongName": {
    "name": "A".repeat(256),
    "email": "valid@example.com",
    "username": "validuser",
    "expectedError": "Name must be less than 255 characters"
  },
  "invalidEmailFormat": {
    "name": "John Doe",
    "email": "not-an-email",
    "username": "validuser",
    "expectedError": "Invalid email format"
  },
  "emptyEmail": {
    "name": "John Doe",
    "email": "",
    "username": "validuser",
    "expectedError": "Email is required"
  },
  "emailMissingAt": {
    "name": "John Doe",
    "email": "emailexample.com",
    "username": "validuser",
    "expectedError": "Invalid email format"
  },
  "emailMissingDomain": {
    "name": "John Doe",
    "email": "email@",
    "username": "validuser",
    "expectedError": "Invalid email format"
  },
  "specialCharsInName": {
    "name": "John<script>alert('xss')</script>",
    "email": "valid@example.com",
    "username": "validuser",
    "expectedError": "Name contains invalid characters"
  },
  "sqlInjectionInName": {
    "name": "John'; DROP TABLE users; --",
    "email": "valid@example.com",
    "username": "validuser",
    "expectedError": "Name contains invalid characters"
  },
  "duplicateEmail": {
    "name": "John Doe",
    "email": "existing@example.com",
    "username": "newuser",
    "expectedError": "Email already exists"
  },
  "invalidUsernameChars": {
    "name": "John Doe",
    "email": "valid@example.com",
    "username": "user@123!",
    "expectedError": "Username can only contain alphanumeric and underscore"
  },
  "tooShortUsername": {
    "name": "John Doe",
    "email": "valid@example.com",
    "username": "ab",
    "expectedError": "Username must be at least 3 characters"
  },
  "numericFieldAsString": {
    "name": "John Doe",
    "email": "valid@example.com",
    "age": "not-a-number",
    "expectedError": "Age must be a number"
  },
  "negativeAge": {
    "name": "John Doe",
    "email": "valid@example.com",
    "age": -5,
    "expectedError": "Age must be positive"
  },
  "ageOutOfRange": {
    "name": "John Doe",
    "email": "valid@example.com",
    "age": 200,
    "expectedError": "Age must be between 0 and 150"
  },
  "invalidPhoneFormat": {
    "name": "John Doe",
    "email": "valid@example.com",
    "phone": "abc-def-ghij",
    "expectedError": "Invalid phone number format"
  },
  "phoneWithInvalidChars": {
    "name": "John Doe",
    "email": "valid@example.com",
    "phone": "123-456-7890!@#",
    "expectedError": "Phone number contains invalid characters"
  },
  "missingRequiredField": {
    "name": "John Doe",
    "expectedError": "Email is required"
  },
  "extraUnknownFields": {
    "name": "John Doe",
    "email": "valid@example.com",
    "username": "validuser",
    "unknownField1": "value1",
    "unknownField2": "value2",
    "expectedError": "Unknown fields not allowed"
  },
  "wrongDataType": {
    "name": 12345,
    "email": "valid@example.com",
    "username": "validuser",
    "expectedError": "Name must be a string"
  },
  "arrayInsteadOfString": {
    "name": ["John", "Doe"],
    "email": "valid@example.com",
    "username": "validuser",
    "expectedError": "Name must be a string"
  },
  "objectInsteadOfString": {
    "name": { "first": "John", "last": "Doe" },
    "email": "valid@example.com",
    "username": "validuser",
    "expectedError": "Name must be a string"
  },
  "unicodeCharacters": {
    "name": "约翰·多伊",
    "email": "valid@example.com",
    "username": "validuser",
    "expectedError": null
  },
  "emojiInName": {
    "name": "John 😊 Doe",
    "email": "valid@example.com",
    "username": "validuser",
    "expectedError": "Name contains invalid characters"
  }
}
```

**Using Invalid Data in Tests:**

```typescript
test.describe('Invalid User Data Tests', () => {
  const dataManager = TestDataManager.getInstance();
  const invalidDataSets = dataManager.loadData('invalidUserData.json');

  // Test each invalid data scenario
  Object.entries(invalidDataSets).forEach(([scenario, testData]: [string, any]) => {
    test(`should reject ${scenario}`, async ({ request }) => {
      const { expectedError, ...userData } = testData;

      const builder = new RequestBuilder();
      const options = builder.setBody(userData).build();

      const response = await request.post('/users', {
        ...options,
        failOnStatusCode: false
      });

      // Should return error status
      expect(response.status()).toBeGreaterThanOrEqual(400);
      expect(response.status()).toBeLessThan(500);

      // Verify error message if expected
      if (expectedError) {
        const errorBody = await response.json();
        expect(JSON.stringify(errorBody).toLowerCase())
          .toContain(expectedError.toLowerCase().split(' ')[0]); // Check for key word
      }

      console.log(`✓ Correctly rejected ${scenario}`);
    });
  });
});
```

##### 2. Pagination Test Data

Design test data specifically for pagination scenarios:

**Create `data/paginationTestData.json`:**

```json
{
  "scenarios": {
    "firstPage": {
      "page": 1,
      "limit": 10,
      "expectedMinItems": 10,
      "expectedMaxItems": 10,
      "description": "First page should have exactly 10 items"
    },
    "middlePage": {
      "page": 5,
      "limit": 10,
      "expectedMinItems": 1,
      "expectedMaxItems": 10,
      "description": "Middle page should have items"
    },
    "lastPage": {
      "page": 10,
      "limit": 10,
      "expectedMinItems": 1,
      "expectedMaxItems": 10,
      "description": "Last page might have fewer items"
    },
    "beyondLastPage": {
      "page": 999,
      "limit": 10,
      "expectedMinItems": 0,
      "expectedMaxItems": 0,
      "description": "Beyond last page should return empty array"
    },
    "largePage": {
      "page": 1,
      "limit": 100,
      "expectedMinItems": 1,
      "expectedMaxItems": 100,
      "description": "Large page size"
    },
    "singleItem": {
      "page": 1,
      "limit": 1,
      "expectedMinItems": 1,
      "expectedMaxItems": 1,
      "description": "Single item per page"
    },
    "zeroPage": {
      "page": 0,
      "limit": 10,
      "expectedStatus": 400,
      "description": "Page 0 should be invalid"
    },
    "negativePage": {
      "page": -1,
      "limit": 10,
      "expectedStatus": 400,
      "description": "Negative page should be invalid"
    },
    "zeroLimit": {
      "page": 1,
      "limit": 0,
      "expectedStatus": 400,
      "description": "Zero limit should be invalid"
    },
    "negativeLimit": {
      "page": 1,
      "limit": -10,
      "expectedStatus": 400,
      "description": "Negative limit should be invalid"
    },
    "excessiveLimit": {
      "page": 1,
      "limit": 10000,
      "expectedStatus": 400,
      "description": "Excessive limit should be rejected"
    },
    "stringInsteadOfNumber": {
      "page": "abc",
      "limit": "xyz",
      "expectedStatus": 400,
      "description": "String values should be rejected"
    }
  },
  "expectedMetadata": {
    "totalItems": 100,
    "totalPages": 10,
    "itemsPerPage": 10
  }
}
```

**Using Pagination Test Data:**

```typescript
test.describe('Pagination Tests', () => {
  const dataManager = TestDataManager.getInstance();
  const paginationData = dataManager.loadData('paginationTestData.json');

  Object.entries(paginationData.scenarios).forEach(([scenario, config]: [string, any]) => {
    test(`Pagination: ${config.description}`, async ({ request }) => {
      const builder = new RequestBuilder();
      const options = builder
        .addQueryParam('_page', config.page)
        .addQueryParam('_limit', config.limit)
        .build();

      const response = await request.get('/posts', {
        ...options,
        failOnStatusCode: false
      });

      // Check expected status
      if (config.expectedStatus) {
        await ApiAssertions.assertStatusCode(response, config.expectedStatus);
        return; // Error case, don't check data
      }

      // Success case - verify data
      await ApiAssertions.assertStatusCode(response, 200);
      const data = await response.json();

      expect(Array.isArray(data)).toBeTruthy();
      expect(data.length).toBeGreaterThanOrEqual(config.expectedMinItems);
      expect(data.length).toBeLessThanOrEqual(config.expectedMaxItems);

      console.log(`✓ ${scenario}: Returned ${data.length} items`);
    });
  });

  test('Pagination: Verify data uniqueness across pages', async ({ request }) => {
    const pageSize = 10;
    const idsFromPages: Set<number> = new Set();

    // Fetch first 3 pages
    for (let page = 1; page <= 3; page++) {
      const builder = new RequestBuilder();
      const options = builder
        .addQueryParam('_page', page)
        .addQueryParam('_limit', pageSize)
        .build();

      const response = await request.get('/posts', options);
      const data = await response.json();

      // Verify no duplicate IDs across pages
      data.forEach((item: any) => {
        expect(idsFromPages.has(item.id)).toBeFalsy();
        idsFromPages.add(item.id);
      });
    }

    console.log(`✓ Verified ${idsFromPages.size} unique items across 3 pages`);
  });

  test('Pagination: Verify total count remains consistent', async ({ request }) => {
    const pageSize = 10;
    let totalFetched = 0;
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 20) { // Safety limit
      const builder = new RequestBuilder();
      const options = builder
        .addQueryParam('_page', page)
        .addQueryParam('_limit', pageSize)
        .build();

      const response = await request.get('/posts', options);
      const data = await response.json();

      totalFetched += data.length;
      hasMore = data.length === pageSize;
      page++;
    }

    console.log(`✓ Total items fetched: ${totalFetched} across ${page - 1} pages`);
    expect(totalFetched).toBeGreaterThan(0);
  });
});
```

##### 3. Boundary Value Test Data

Test edge cases and boundaries:

**Create `data/boundaryTestData.json`:**

```json
{
  "stringLengthBoundaries": {
    "exactlyMinLength": {
      "value": "abc",
      "field": "username",
      "minLength": 3,
      "shouldPass": true
    },
    "oneLessThanMin": {
      "value": "ab",
      "field": "username",
      "minLength": 3,
      "shouldPass": false
    },
    "exactlyMaxLength": {
      "value": "a".repeat(255),
      "field": "name",
      "maxLength": 255,
      "shouldPass": true
    },
    "oneMoreThanMax": {
      "value": "a".repeat(256),
      "field": "name",
      "maxLength": 255,
      "shouldPass": false
    }
  },
  "numericBoundaries": {
    "minValue": {
      "value": 0,
      "field": "age",
      "min": 0,
      "max": 150,
      "shouldPass": true
    },
    "maxValue": {
      "value": 150,
      "field": "age",
      "min": 0,
      "max": 150,
      "shouldPass": true
    },
    "belowMin": {
      "value": -1,
      "field": "age",
      "min": 0,
      "max": 150,
      "shouldPass": false
    },
    "aboveMax": {
      "value": 151,
      "field": "age",
      "min": 0,
      "max": 150,
      "shouldPass": false
    },
    "veryLargeNumber": {
      "value": 999999999999,
      "field": "id",
      "shouldPass": false
    },
    "floatInsteadOfInt": {
      "value": 25.5,
      "field": "age",
      "shouldPass": false
    }
  },
  "arrayBoundaries": {
    "emptyArray": {
      "value": [],
      "field": "tags",
      "minItems": 1,
      "shouldPass": false
    },
    "exactlyMinItems": {
      "value": ["tag1"],
      "field": "tags",
      "minItems": 1,
      "shouldPass": true
    },
    "exactlyMaxItems": {
      "value": ["tag1", "tag2", "tag3", "tag4", "tag5"],
      "field": "tags",
      "maxItems": 5,
      "shouldPass": true
    },
    "oneMoreThanMaxItems": {
      "value": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
      "field": "tags",
      "maxItems": 5,
      "shouldPass": false
    }
  },
  "dateBoundaries": {
    "todayDate": {
      "value": "2024-01-15",
      "field": "birthDate",
      "shouldPass": true
    },
    "futureDate": {
      "value": "2099-12-31",
      "field": "birthDate",
      "shouldPass": false
    },
    "veryOldDate": {
      "value": "1900-01-01",
      "field": "birthDate",
      "shouldPass": true
    },
    "invalidDateFormat": {
      "value": "15-01-2024",
      "field": "birthDate",
      "shouldPass": false
    },
    "invalidDate": {
      "value": "2024-02-30",
      "field": "birthDate",
      "shouldPass": false
    }
  }
}
```

##### 4. Sorting and Filtering Test Data

**Create `data/sortingFilteringData.json`:**

```json
{
  "sortingScenarios": {
    "sortByNameAsc": {
      "sortField": "name",
      "sortOrder": "asc",
      "expectedOrder": "ascending"
    },
    "sortByNameDesc": {
      "sortField": "name",
      "sortOrder": "desc",
      "expectedOrder": "descending"
    },
    "sortByDateAsc": {
      "sortField": "createdAt",
      "sortOrder": "asc",
      "expectedOrder": "ascending"
    },
    "sortByMultipleFields": {
      "sortFields": ["category", "price"],
      "sortOrders": ["asc", "desc"]
    },
    "invalidSortField": {
      "sortField": "nonExistentField",
      "expectedStatus": 400
    }
  },
  "filteringScenarios": {
    "singleFilter": {
      "filters": {
        "status": "active"
      },
      "expectedField": "status",
      "expectedValue": "active"
    },
    "multipleFilters": {
      "filters": {
        "status": "active",
        "category": "electronics",
        "price_min": 100,
        "price_max": 500
      }
    },
    "rangeFilter": {
      "filters": {
        "createdAt_gte": "2024-01-01",
        "createdAt_lte": "2024-12-31"
      }
    },
    "wildcardSearch": {
      "filters": {
        "name_contains": "phone"
      }
    }
  },
  "combinedScenarios": {
    "filterAndSort": {
      "filters": {
        "category": "electronics"
      },
      "sort": {
        "field": "price",
        "order": "desc"
      },
      "pagination": {
        "page": 1,
        "limit": 20
      }
    }
  }
}
```

**Using Sorting and Filtering Test Data:**

```typescript
test.describe('Sorting and Filtering Tests', () => {
  const dataManager = TestDataManager.getInstance();
  const testData = dataManager.loadData('sortingFilteringData.json');

  Object.entries(testData.sortingScenarios).forEach(([scenario, config]: [string, any]) => {
    test(`Sorting: ${scenario}`, async ({ request }) => {
      if (config.expectedStatus) {
        // Test invalid sort field
        const builder = new RequestBuilder();
        const options = builder
          .addQueryParam('_sort', config.sortField)
          .build();

        const response = await request.get('/posts', {
          ...options,
          failOnStatusCode: false
        });

        await ApiAssertions.assertStatusCode(response, config.expectedStatus);
        return;
      }

      // Test valid sorting
      const builder = new RequestBuilder();
      const options = builder
        .addQueryParam('_sort', config.sortField)
        .addQueryParam('_order', config.sortOrder)
        .build();

      const response = await request.get('/posts', options);
      await ApiAssertions.assertStatusCode(response, 200);

      const data = await response.json();

      // Verify sorting order
      if (config.expectedOrder === 'ascending') {
        for (let i = 0; i < data.length - 1; i++) {
          expect(data[i][config.sortField] <= data[i + 1][config.sortField]).toBeTruthy();
        }
      } else {
        for (let i = 0; i < data.length - 1; i++) {
          expect(data[i][config.sortField] >= data[i + 1][config.sortField]).toBeTruthy();
        }
      }

      console.log(`✓ Verified ${config.expectedOrder} sort on ${config.sortField}`);
    });
  });

  Object.entries(testData.filteringScenarios).forEach(([scenario, config]: [string, any]) => {
    test(`Filtering: ${scenario}`, async ({ request }) => {
      const builder = new RequestBuilder();

      // Add all filters as query params
      Object.entries(config.filters).forEach(([key, value]) => {
        builder.addQueryParam(key, value);
      });

      const options = builder.build();
      const response = await request.get('/posts', options);

      await ApiAssertions.assertStatusCode(response, 200);
      const data = await response.json();

      // Verify filtering if expected field and value provided
      if (config.expectedField && config.expectedValue) {
        data.forEach((item: any) => {
          expect(item[config.expectedField]).toBe(config.expectedValue);
        });
      }

      console.log(`✓ Filtering verified for ${scenario}: ${data.length} items`);
    });
  });
});
```

##### 5. State Transition Test Data

**Create `data/stateTransitionData.json`:**

```json
{
  "orderStates": {
    "validTransitions": [
      {
        "from": "pending",
        "to": "processing",
        "shouldSucceed": true
      },
      {
        "from": "processing",
        "to": "shipped",
        "shouldSucceed": true
      },
      {
        "from": "shipped",
        "to": "delivered",
        "shouldSucceed": true
      },
      {
        "from": "pending",
        "to": "cancelled",
        "shouldSucceed": true
      }
    ],
    "invalidTransitions": [
      {
        "from": "delivered",
        "to": "pending",
        "shouldSucceed": false,
        "expectedError": "Cannot change status from delivered to pending"
      },
      {
        "from": "cancelled",
        "to": "processing",
        "shouldSucceed": false,
        "expectedError": "Cannot process cancelled order"
      },
      {
        "from": "shipped",
        "to": "pending",
        "shouldSucceed": false,
        "expectedError": "Cannot revert shipped order to pending"
      }
    ]
  }
}
```

##### 6. Concurrent Request Test Data

**Create `data/concurrencyTestData.json`:**

```json
{
  "scenarios": {
    "simultaneousCreation": {
      "requestCount": 10,
      "requestData": {
        "title": "Concurrent Post",
        "body": "Testing concurrent creation",
        "userId": 1
      },
      "expectedUniqueIds": 10
    },
    "raceCondition": {
      "resource": "/counter/increment",
      "requestCount": 100,
      "expectedFinalValue": 100
    },
    "bulkUpdate": {
      "resources": [1, 2, 3, 4, 5],
      "updateData": {
        "status": "updated"
      },
      "concurrent": true
    }
  }
}
```

**Using Concurrency Test Data:**

```typescript
test.describe('Concurrency Tests', () => {
  const dataManager = TestDataManager.getInstance();
  const testData = dataManager.loadData('concurrencyTestData.json');

  test('Concurrent creation should generate unique IDs', async ({ request }) => {
    const scenario = testData.scenarios.simultaneousCreation;

    // Create multiple concurrent requests
    const requests = Array(scenario.requestCount).fill(null).map(() =>
      request.post('/posts', { data: scenario.requestData })
    );

    const responses = await Promise.all(requests);

    // Collect all IDs
    const ids = new Set();
    for (const response of responses) {
      await ApiAssertions.assertStatusCode(response, 201);
      const data = await response.json();
      ids.add(data.id);
    }

    // Verify all IDs are unique
    expect(ids.size).toBe(scenario.expectedUniqueIds);
    console.log(`✓ Created ${ids.size} unique resources concurrently`);
  });
});
```

##### 7. Test Data Organization Best Practices

**Folder Structure:**

```
data/
├── valid/
│   ├── users.json
│   ├── posts.json
│   └── products.json
├── invalid/
│   ├── userValidation.json
│   ├── postValidation.json
│   └── fieldErrors.json
├── scenarios/
│   ├── pagination.json
│   ├── sorting.json
│   ├── filtering.json
│   └── stateTransitions.json
├── boundaries/
│   ├── stringBoundaries.json
│   ├── numericBoundaries.json
│   └── dateBoundaries.json
└── performance/
    ├── concurrency.json
    └── loadTesting.json
```

**Complete Test Data Template:**

```typescript
// data/testDataTemplate.ts
export interface TestDataTemplate {
  valid: any;
  invalid: {
    scenario: string;
    data: any;
    expectedError: string;
    expectedStatus: number;
  }[];
  boundary: {
    scenario: string;
    data: any;
    shouldPass: boolean;
  }[];
}

// Example usage
export const userTestData: TestDataTemplate = {
  valid: {
    name: "John Doe",
    email: "john@example.com",
    age: 30
  },
  invalid: [
    {
      scenario: "Empty name",
      data: { name: "", email: "john@example.com" },
      expectedError: "Name is required",
      expectedStatus: 400
    }
  ],
  boundary: [
    {
      scenario: "Minimum age",
      data: { name: "John", email: "john@example.com", age: 0 },
      shouldPass: true
    }
  ]
};
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
✅ Best practices for maintainable tests
✅ Common patterns and troubleshooting

You're now ready to build comprehensive API test suites with Playwright!

---

**Happy Testing! 🚀**

# API Testing Helpers Guide

## Table of Contents
1. [Overview](#overview)
2. [PaginationHelper](#paginationhelper)
3. [SortingHelper](#sortinghelper)
4. [AuthHelper](#authhelper)
5. [Usage Examples](#usage-examples)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Overview

This framework provides three specialized helper classes to streamline API testing:

| Helper | Purpose | Location |
|--------|---------|----------|
| **PaginationHelper** | Test pagination functionality | `helpers/PaginationHelper.ts` |
| **SortingHelper** | Test sorting functionality | `helpers/SortingHelper.ts` |
| **AuthHelper** | Manage authentication | `helpers/AuthHelper.ts` |

These helpers abstract common testing patterns, reduce code duplication, and provide consistent validation across your test suite.

## PaginationHelper

### Overview

The `PaginationHelper` class provides methods to test API pagination with various page sizes, offsets, and navigation scenarios.

### Key Features

- ✅ Test pagination with different page sizes
- ✅ Generate comprehensive pagination test cases
- ✅ Validate pagination metadata (total, hasNext, hasPrevious)
- ✅ Support multiple pagination formats (limit/skip, pageSize/pageNumber)
- ✅ Performance testing for pagination queries

### Constructor

```typescript
constructor(request: APIRequestContext, baseUrl: string = '')
```

**Parameters:**
- `request`: Playwright's APIRequestContext
- `baseUrl`: (Optional) Base URL for the API

**Example:**
```typescript
import { PaginationHelper } from '../../helpers/PaginationHelper';

test.beforeEach(async ({ request }) => {
  const paginationHelper = new PaginationHelper(request);
  // or with base URL
  const helper = new PaginationHelper(request, 'https://api.example.com');
});
```

### Methods

#### testPagination()

Test pagination for a given endpoint.

```typescript
async testPagination(
  endpoint: string,
  params: Record<string, any>
): Promise<{
  status: number;
  data: any;
  headers: Record<string, string>;
}>
```

**Example:**
```typescript
const response = await paginationHelper.testPagination('/users', {
  limit: 10,
  skip: 0
});

console.log(response.status); // 200
console.log(response.data.users.length); // 10
```

#### validatePaginationResponse()

Validate pagination response structure and metadata.

```typescript
async validatePaginationResponse(
  response: { status: number; data: any },
  expectedParams: {
    limit?: number;
    skip?: number;
    pageSize?: number;
    pageNumber?: number;
    expectedItemCount?: number;
    minItems?: number;
    maxItems?: number;
  }
): Promise<void>
```

**Example:**
```typescript
const response = await paginationHelper.testPagination('/users', {
  limit: 25,
  skip: 0
});

await paginationHelper.validatePaginationResponse(response, {
  limit: 25,
  skip: 0,
  expectedItemCount: 25
});
```

#### generatePaginationTestCases()

Generate comprehensive pagination test cases automatically.

```typescript
generatePaginationTestCases(
  totalItems: number,
  pageSizes: number[] = [10, 25, 50, 100],
  format: 'limit-skip' | 'page-size' = 'limit-skip'
): Array<{
  name: string;
  params: Record<string, number>;
  expectedItemCount: number;
  description: string;
}>
```

**Example:**
```typescript
// Generate test cases for 150 total users with page sizes 10, 30, 50
const testCases = paginationHelper.generatePaginationTestCases(150, [10, 30, 50]);

for (const testCase of testCases) {
  const response = await paginationHelper.testPagination('/users', testCase.params);
  console.log(`✓ ${testCase.name}: ${testCase.description}`);
}

// Output:
// ✓ First page with limit=10: Fetch first 10 items
// ✓ Middle page with limit=10: Fetch items 76 to 85
// ✓ Last page with limit=10: Fetch last 10 items
// ... and more
```

#### validatePaginationNavigation()

Validate pagination navigation metadata (hasNext, hasPrevious).

```typescript
validatePaginationNavigation(
  data: any,
  currentPage: number,
  totalPages: number
): void
```

**Example:**
```typescript
const response = await paginationHelper.testPagination('/users', {
  limit: 10,
  skip: 10
});

paginationHelper.validatePaginationNavigation(
  response.data,
  2, // Current page
  15 // Total pages
);
```

#### testPaginationPerformance()

Test pagination performance by measuring response times.

```typescript
async testPaginationPerformance(
  endpoint: string,
  params: Record<string, any>,
  maxDuration: number = 5000
): Promise<number>
```

**Example:**
```typescript
const duration = await paginationHelper.testPaginationPerformance(
  '/users',
  { limit: 100, skip: 0 },
  3000 // Max 3 seconds
);

console.log(`Pagination query took ${duration}ms`);
```

### Complete Usage Example

```typescript
import { test, expect } from '@playwright/test';
import { PaginationHelper } from '../../helpers/PaginationHelper';

test.describe('Users API Pagination', () => {
  let paginationHelper: PaginationHelper;

  test.beforeEach(async ({ request }) => {
    paginationHelper = new PaginationHelper(request);
  });

  test('should paginate users with different page sizes', async () => {
    const testCases = paginationHelper.generatePaginationTestCases(100, [10, 25]);

    for (const testCase of testCases) {
      const response = await paginationHelper.testPagination('/users', testCase.params);

      await paginationHelper.validatePaginationResponse(response, {
        limit: testCase.params.limit,
        skip: testCase.params.skip,
        expectedItemCount: testCase.expectedItemCount
      });

      console.log(`✓ ${testCase.name}`);
    }
  });

  test('should validate pagination metadata', async () => {
    const response = await paginationHelper.testPagination('/users', {
      limit: 20,
      skip: 20
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('total');
    expect(response.data).toHaveProperty('limit');
    expect(response.data).toHaveProperty('skip');
  });
});
```

## SortingHelper

### Overview

The `SortingHelper` class provides methods to test API sorting functionality across various fields, orders, and data types.

### Key Features

- ✅ Test sorting by multiple fields
- ✅ Support ascending and descending orders
- ✅ Validate sort order for different data types (string, number, date)
- ✅ Test combined sorting with pagination
- ✅ Validate sorting stability across pages

### Constructor

```typescript
constructor(request: APIRequestContext, baseUrl: string = '')
```

**Example:**
```typescript
import { SortingHelper } from '../../helpers/SortingHelper';

test.beforeEach(async ({ request }) => {
  const sortingHelper = new SortingHelper(request);
});
```

### Methods

#### testSorting()

Test sorting for a given endpoint.

```typescript
async testSorting(
  endpoint: string,
  sortBy: string,
  order: 'asc' | 'desc',
  limit: number = 50
): Promise<{
  status: number;
  data: any;
}>
```

**Example:**
```typescript
const response = await sortingHelper.testSorting(
  '/users',
  'firstName',
  'asc',
  30
);

console.log(`Fetched ${response.data.users.length} users sorted by firstName`);
```

#### validateSortOrder()

Validate that items are sorted correctly.

```typescript
validateSortOrder(
  items: any[],
  field: string,
  order: 'asc' | 'desc',
  dataType: 'string' | 'number' | 'date' = 'string'
): void
```

**Example:**
```typescript
const response = await sortingHelper.testSorting('/users', 'age', 'desc', 20);

// Validate that ages are in descending order
sortingHelper.validateSortOrder(
  response.data.users,
  'age',
  'desc',
  'number'
);
```

#### validateSortingResponse()

Validate complete sorting response including status and sort order.

```typescript
async validateSortingResponse(
  response: { status: number; data: any },
  field: string,
  order: 'asc' | 'desc',
  dataType: 'string' | 'number' | 'date' = 'string'
): Promise<void>
```

**Example:**
```typescript
const response = await sortingHelper.testSorting('/users', 'email', 'asc', 25);

await sortingHelper.validateSortingResponse(
  response,
  'email',
  'asc',
  'string'
);
```

#### generateSortingTestCases()

Generate sorting test scenarios for multiple fields.

```typescript
generateSortingTestCases(
  fields: Array<{
    name: string;
    dataType?: 'string' | 'number' | 'date';
    orders?: Array<'asc' | 'desc'>;
  }>
): Array<{
  name: string;
  sortBy: string;
  order: 'asc' | 'desc';
  field: string;
  dataType: 'string' | 'number' | 'date';
}>
```

**Example:**
```typescript
const fields = [
  { name: 'firstName', dataType: 'string' },
  { name: 'age', dataType: 'number' },
  { name: 'createdDate', dataType: 'date', orders: ['desc'] }
];

const testCases = sortingHelper.generateSortingTestCases(fields);

for (const testCase of testCases) {
  const response = await sortingHelper.testSorting(
    '/users',
    testCase.sortBy,
    testCase.order,
    20
  );

  await sortingHelper.validateSortingResponse(
    response,
    testCase.field,
    testCase.order,
    testCase.dataType
  );
}
```

#### testSortingWithPagination()

Test combined sorting and pagination.

```typescript
async testSortingWithPagination(
  endpoint: string,
  sortBy: string,
  order: 'asc' | 'desc',
  paginationParams: {
    limit?: number;
    skip?: number;
    pageSize?: number;
    pageNumber?: number;
  }
): Promise<{
  status: number;
  data: any;
}>
```

**Example:**
```typescript
const response = await sortingHelper.testSortingWithPagination(
  '/users',
  'lastName',
  'asc',
  { limit: 25, skip: 50 }
);

expect(response.data.users.length).toBeLessThanOrEqual(25);
sortingHelper.validateSortOrder(response.data.users, 'lastName', 'asc', 'string');
```

#### validateSortStability()

Validate that sorting is stable across paginated results.

```typescript
async validateSortStability(
  endpoint: string,
  sortBy: string,
  order: 'asc' | 'desc',
  limit: number,
  totalPages: number,
  dataType: 'string' | 'number' | 'date' = 'string'
): Promise<void>
```

**Example:**
```typescript
// Fetch 5 pages and validate sorting is consistent
await sortingHelper.validateSortStability(
  '/users',
  'firstName',
  'asc',
  10, // Items per page
  5,  // Test 5 pages
  'string'
);

console.log('✓ Sort order is stable across 5 pages');
```

### Complete Usage Example

```typescript
import { test, expect } from '@playwright/test';
import { SortingHelper } from '../../helpers/SortingHelper';

test.describe('Users API Sorting', () => {
  let sortingHelper: SortingHelper;

  test.beforeEach(async ({ request }) => {
    sortingHelper = new SortingHelper(request);
  });

  test('should sort users by various fields', async () => {
    const fields = [
      { name: 'firstName', dataType: 'string' },
      { name: 'age', dataType: 'number' },
      { name: 'email', dataType: 'string' }
    ];

    const testCases = sortingHelper.generateSortingTestCases(fields);

    for (const testCase of testCases) {
      const response = await sortingHelper.testSorting(
        '/users',
        testCase.sortBy,
        testCase.order,
        20
      );

      await sortingHelper.validateSortingResponse(
        response,
        testCase.field,
        testCase.order,
        testCase.dataType
      );

      console.log(`✓ ${testCase.name}`);
    }
  });

  test('should maintain sort order across pages', async () => {
    await sortingHelper.validateSortStability(
      '/users',
      'lastName',
      'asc',
      15,
      3,
      'string'
    );
  });
});
```

## AuthHelper

### Overview

The `AuthHelper` class manages authentication for API tests, supporting multiple authentication types.

### Key Features

- ✅ Support for Bearer tokens
- ✅ Support for API keys
- ✅ Support for Basic Auth
- ✅ Token caching to reduce authentication requests
- ✅ Service account authentication
- ✅ Environment variable integration

### Constructor

```typescript
constructor(request: APIRequestContext, baseUrl: string = '')
```

### Methods

#### getBearerAuthHeaders()

Get authentication headers for Bearer token.

```typescript
getBearerAuthHeaders(token: string): Record<string, string>
```

**Example:**
```typescript
const authHelper = new AuthHelper(request);
const headers = authHelper.getBearerAuthHeaders('your-token-here');

const response = await request.get('/protected-endpoint', { headers });
```

#### getApiKeyAuthHeaders()

Get authentication headers for API Key.

```typescript
getApiKeyAuthHeaders(
  apiKey: string,
  headerName: string = 'X-API-Key'
): Record<string, string>
```

**Example:**
```typescript
const headers = authHelper.getApiKeyAuthHeaders('api-key-123', 'X-Custom-API-Key');

const response = await request.get('/api/data', { headers });
```

#### getBasicAuthHeaders()

Get authentication headers for Basic Auth.

```typescript
getBasicAuthHeaders(username: string, password: string): Record<string, string>
```

**Example:**
```typescript
const headers = authHelper.getBasicAuthHeaders('user@example.com', 'password123');

const response = await request.get('/api/data', { headers });
```

#### authenticateAndGetToken()

Authenticate and get token (for OAuth/JWT flows).

```typescript
async authenticateAndGetToken(
  endpoint: string,
  credentials: { username?: string; password?: string; [key: string]: any },
  cacheKey?: string
): Promise<string>
```

**Example:**
```typescript
const token = await authHelper.authenticateAndGetToken(
  '/auth/login',
  {
    username: 'testuser@example.com',
    password: 'password123'
  },
  'test-user' // Cache key
);

// Use token in subsequent requests
const headers = authHelper.getBearerAuthHeaders(token);
```

#### getTokenFromEnv()

Get token from environment variable.

```typescript
getTokenFromEnv(envVarName: string = 'API_TOKEN'): string
```

**Example:**
```typescript
// .env file
// API_TOKEN=your-token-here

const token = authHelper.getTokenFromEnv('API_TOKEN');
const headers = authHelper.getBearerAuthHeaders(token);
```

#### getServiceAccountToken()

Get service account token for automated testing.

```typescript
async getServiceAccountToken(serviceAccountConfig: {
  endpoint?: string;
  clientId?: string;
  clientSecret?: string;
  [key: string]: any;
}): Promise<string>
```

**Example:**
```typescript
const token = await authHelper.getServiceAccountToken({
  endpoint: '/auth/service-account',
  clientId: 'test-service-account',
  clientSecret: 'secret123'
});

const headers = authHelper.getBearerAuthHeaders(token);
```

#### clearTokenCache()

Clear token cache.

```typescript
clearTokenCache(cacheKey?: string): void
```

**Example:**
```typescript
// Clear specific token
authHelper.clearTokenCache('test-user');

// Clear all tokens
authHelper.clearTokenCache();
```

### Complete Usage Example

```typescript
import { test, expect } from '@playwright/test';
import { AuthHelper } from '../../helpers/AuthHelper';
import { ApiClient } from '../../lib/ApiClient';

test.describe('Authenticated API Tests', () => {
  let authHelper: AuthHelper;
  let apiClient: ApiClient;
  let authHeaders: Record<string, string>;

  test.beforeAll(async ({ request }) => {
    authHelper = new AuthHelper(request, process.env.API_BASE_URL);

    // Get token from environment
    const token = authHelper.getTokenFromEnv('API_TOKEN');
    authHeaders = authHelper.getBearerAuthHeaders(token);
  });

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test('should access protected endpoint with Bearer token', async ({ request }) => {
    const response = await request.get('/api/protected/users', {
      headers: authHeaders
    });

    expect(response.status()).toBe(200);
  });

  test('should authenticate and access user profile', async ({ request }) => {
    const token = await authHelper.authenticateAndGetToken(
      '/auth/login',
      {
        username: process.env.TEST_USERNAME,
        password: process.env.TEST_PASSWORD
      }
    );

    const headers = authHelper.getBearerAuthHeaders(token);
    const response = await request.get('/api/profile', { headers });

    expect(response.status()).toBe(200);
  });
});
```

## Usage Examples

### Example 1: Testing Pagination and Sorting Together

```typescript
import { test } from '@playwright/test';
import { PaginationHelper } from '../../helpers/PaginationHelper';
import { SortingHelper } from '../../helpers/SortingHelper';

test('should paginate and sort users', async ({ request }) => {
  const paginationHelper = new PaginationHelper(request);
  const sortingHelper = new SortingHelper(request);

  const response = await sortingHelper.testSortingWithPagination(
    '/users',
    'firstName',
    'asc',
    { limit: 20, skip: 0 }
  );

  // Validate pagination
  await paginationHelper.validatePaginationResponse(response, {
    limit: 20,
    skip: 0
  });

  // Validate sorting
  sortingHelper.validateSortOrder(response.data.users, 'firstName', 'asc', 'string');
});
```

### Example 2: Authenticated Pagination Test

```typescript
test('should paginate protected endpoint', async ({ request }) => {
  const authHelper = new AuthHelper(request);
  const paginationHelper = new PaginationHelper(request);

  const token = authHelper.getTokenFromEnv();
  const headers = authHelper.getBearerAuthHeaders(token);

  const response = await request.get('/api/protected/users?limit=25&skip=0', {
    headers
  });

  const data = await response.json();

  await paginationHelper.validatePaginationResponse(
    { status: response.status(), data },
    { limit: 25, skip: 0 }
  );
});
```

### Example 3: Performance Testing with Helpers

```typescript
test('should test pagination performance', async ({ request }) => {
  const paginationHelper = new PaginationHelper(request);
  const pageSizes = [10, 50, 100];

  for (const limit of pageSizes) {
    const duration = await paginationHelper.testPaginationPerformance(
      '/users',
      { limit, skip: 0 },
      5000 // Max 5 seconds
    );

    console.log(`Pagination with limit=${limit} took ${duration}ms`);
  }
});
```

## Best Practices

### 1. Reuse Helper Instances

```typescript
// Good: Create once in beforeEach
test.beforeEach(async ({ request }) => {
  paginationHelper = new PaginationHelper(request);
});

// Avoid: Creating in every test
test('test 1', async ({ request }) => {
  const helper = new PaginationHelper(request); // Avoid
});
```

### 2. Use Generated Test Cases for Comprehensive Coverage

```typescript
// Good: Generate test cases
const testCases = paginationHelper.generatePaginationTestCases(150, [10, 25, 50]);

// Avoid: Manual test cases for everything
test('page 1', ...);
test('page 2', ...);
// ... 20 more manual tests
```

### 3. Validate Both Pagination and Sorting in Combined Tests

```typescript
// Good: Validate both aspects
await paginationHelper.validatePaginationResponse(response, { limit: 20 });
sortingHelper.validateSortOrder(data.users, 'firstName', 'asc', 'string');

// Avoid: Only checking one aspect
expect(response.data.users.length).toBe(20); // Only pagination
```

### 4. Cache Authentication Tokens

```typescript
// Good: Cache tokens to avoid repeated auth
const token = await authHelper.authenticateAndGetToken(
  '/auth/login',
  credentials,
  'cache-key' // Will be cached
);

// Avoid: Authenticating in every test
test('test 1', async () => {
  const token = await authHelper.authenticateAndGetToken(...); // No cache
});
```

## Troubleshooting

### Issue: Pagination validation fails

**Problem:** `validatePaginationResponse` throws errors

**Solutions:**
1. Check that your API returns the expected structure
2. Verify that `limit` and `skip` parameters match API expectations
3. Ensure response includes `total`, `limit`, and `skip` fields

```typescript
// Debug: Log the response
const response = await paginationHelper.testPagination('/users', { limit: 10, skip: 0 });
console.log(JSON.stringify(response.data, null, 2));
```

### Issue: Sort order validation fails

**Problem:** `validateSortOrder` reports items are not sorted

**Solutions:**
1. Verify the field name is correct (case-sensitive)
2. Check the data type matches the actual data
3. Ensure API actually supports sorting by that field

```typescript
// Debug: Log the values being compared
const values = response.data.users.map(u => u.firstName);
console.log('Values:', values);
```

### Issue: Authentication fails

**Problem:** Token not working or environment variable not found

**Solutions:**
1. Verify environment variable is set: `console.log(process.env.API_TOKEN)`
2. Check token format (Bearer vs API Key)
3. Ensure token hasn't expired

```typescript
// Debug: Validate token
const isValid = await authHelper.validateToken(token, '/auth/validate');
console.log('Token valid:', isValid);
```

## Summary

The helper classes provided in this framework significantly simplify API testing:

- **PaginationHelper**: Comprehensive pagination testing with minimal code
- **SortingHelper**: Robust sorting validation across multiple scenarios
- **AuthHelper**: Flexible authentication management for all test types

Use these helpers consistently across your test suite to:
- Reduce code duplication
- Ensure consistent validation
- Improve test maintainability
- Increase test coverage

## Next Steps

1. Review the [Parameterized Testing Guide](./PARAMETERIZED_TESTING_GUIDE.md) for testing strategies
2. Check out [Test Data Management Guide](./TEST_DATA_MANAGEMENT_GUIDE.md) for data organization
3. Read the [Edge Case Testing Guide](./EDGE_CASE_TESTING_GUIDE.md) for boundary testing approaches

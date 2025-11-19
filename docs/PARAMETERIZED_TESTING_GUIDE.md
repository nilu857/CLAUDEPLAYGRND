# Parameterized Testing Guide

## Table of Contents
1. [Overview](#overview)
2. [What is Parameterized Testing?](#what-is-parameterized-testing)
3. [Why Use Parameterized Testing?](#why-use-parameterized-testing)
4. [Implementation Approaches](#implementation-approaches)
5. [Pagination Testing](#pagination-testing)
6. [Sorting Testing](#sorting-testing)
7. [Combined Testing](#combined-testing)
8. [Best Practices](#best-practices)
9. [Examples](#examples)

## Overview

Parameterized testing is a testing technique where you run the same test logic with different sets of input data. Instead of writing multiple similar tests, you define the test logic once and execute it with various parameter combinations.

## What is Parameterized Testing?

Parameterized testing allows you to:
- **Write tests once, run with many inputs**: Define test logic in one place
- **Test multiple scenarios efficiently**: Cover more ground with less code
- **Maintain tests easily**: Change test logic in one location
- **Improve test coverage**: Test edge cases, boundary values, and typical use cases systematically

### Traditional vs Parameterized Approach

**Traditional Approach (Repetitive):**
```typescript
test('GET /users with limit=10', async () => {
  const response = await apiClient.get('/users?limit=10');
  expect(response.status()).toBe(200);
  // ... validations
});

test('GET /users with limit=25', async () => {
  const response = await apiClient.get('/users?limit=25');
  expect(response.status()).toBe(200);
  // ... same validations
});

test('GET /users with limit=50', async () => {
  const response = await apiClient.get('/users?limit=50');
  expect(response.status()).toBe(200);
  // ... same validations
});
```

**Parameterized Approach (Efficient):**
```typescript
const pageSizes = [10, 25, 50, 100];

pageSizes.forEach((limit) => {
  test(`GET /users with limit=${limit}`, async () => {
    const response = await apiClient.get(`/users?limit=${limit}`);
    expect(response.status()).toBe(200);
    // ... validations
  });
});
```

## Why Use Parameterized Testing?

### Benefits

1. **Reduced Code Duplication**
   - Write test logic once
   - Reuse across multiple scenarios
   - Easier to maintain

2. **Comprehensive Coverage**
   - Test many scenarios quickly
   - Cover edge cases systematically
   - Matrix testing (e.g., pagination × sorting)

3. **Maintainability**
   - Update test logic in one place
   - Add new scenarios by adding data
   - Separate test data from test logic

4. **Readability**
   - Clear test naming from parameters
   - Easy to see what's being tested
   - Self-documenting test scenarios

5. **Scalability**
   - Easy to add new test cases
   - Test data can be externalized
   - Suitable for large test suites

## Implementation Approaches

### Approach 1: Inline Array with forEach

**Best for:** Simple scenarios with few parameters

```typescript
const limits = [10, 25, 50, 100];

limits.forEach((limit) => {
  test(`Should paginate with limit=${limit}`, async () => {
    const response = await paginationHelper.testPagination('/users', { limit, skip: 0 });
    expect(response.status).toBe(200);
  });
});
```

**Pros:**
- Simple and straightforward
- No external dependencies
- Easy to understand

**Cons:**
- Not suitable for complex test data
- Harder to maintain with many parameters

### Approach 2: External JSON Data Files

**Best for:** Complex scenarios, many parameters, data-driven testing

```typescript
// data/paginationScenarios.json
[
  {
    "scenario": "First page with limit 10",
    "params": { "limit": 10, "skip": 0 },
    "expected": { "minItems": 1, "maxItems": 10 }
  }
]

// Test file
import paginationScenarios from '../../data/paginationScenarios.json';

paginationScenarios.forEach(({ scenario, params, expected }) => {
  test(scenario, async () => {
    const response = await paginationHelper.testPagination('/users', params);
    // Validate using expected values
  });
});
```

**Pros:**
- Separates test data from test logic
- Easy to add new scenarios without code changes
- Non-developers can add test cases
- Reusable across multiple test files

**Cons:**
- Requires external file management
- Less type-safe (unless using TypeScript imports)

### Approach 3: Helper-Generated Test Cases

**Best for:** Systematic testing (e.g., boundary values, matrix combinations)

```typescript
test('should handle various page sizes', async () => {
  // Generate test cases dynamically
  const testCases = paginationHelper.generatePaginationTestCases(250, [10, 25, 50, 100]);

  for (const testCase of testCases) {
    const response = await paginationHelper.testPagination('/users', testCase.params);
    await paginationHelper.validatePaginationResponse(response, testCase);
    console.log(`✓ ${testCase.name}`);
  }
});
```

**Pros:**
- Comprehensive coverage with minimal code
- Automatically tests edge cases (first page, last page, middle)
- Reduces human error in test case creation

**Cons:**
- Less explicit about what's being tested
- May generate too many test cases

## Pagination Testing

### What to Test

1. **Various page sizes**: 10, 25, 50, 100
2. **Different pages**: First, middle, last
3. **Skip/offset values**: 0, 25, 50, etc.
4. **Metadata validation**: total, limit, skip
5. **Navigation**: hasNext, hasPrevious

### Example: Pagination Test

```typescript
import { test, expect } from '@playwright/test';
import { PaginationHelper } from '../../helpers/PaginationHelper';
import paginationScenarios from '../../data/paginationScenarios.json';

test.describe('Pagination Tests', () => {
  let paginationHelper: PaginationHelper;

  test.beforeEach(async ({ request }) => {
    paginationHelper = new PaginationHelper(request);
  });

  // Approach 1: Using external JSON data
  paginationScenarios.forEach(({ scenario, params, expected }) => {
    test(scenario, async () => {
      const response = await paginationHelper.testPagination('/users', params);

      expect(response.status).toBe(200);
      expect(response.data.limit).toBe(params.limit);
      expect(response.data.skip).toBe(params.skip);

      if (expected.maxItems) {
        expect(response.data.users.length).toBeLessThanOrEqual(expected.maxItems);
      }
    });
  });

  // Approach 2: Generated test cases
  test('should handle all page sizes', async () => {
    const testCases = paginationHelper.generatePaginationTestCases(150, [10, 30, 50]);

    for (const testCase of testCases) {
      const response = await paginationHelper.testPagination('/users', testCase.params);
      await paginationHelper.validatePaginationResponse(response, testCase);
    }
  });
});
```

### Running Pagination Tests

```bash
# Run all pagination tests
npm run test tests/api/pagination.spec.ts

# Run with UI mode
npm run test:ui tests/api/pagination.spec.ts

# Run specific test
npm run test tests/api/pagination.spec.ts -g "First page"
```

## Sorting Testing

### What to Test

1. **Sort fields**: firstName, lastName, email, age, date
2. **Sort orders**: ascending (asc), descending (desc)
3. **Data types**: string, number, date
4. **Sort validation**: Verify actual sort order
5. **Stability**: Sorting consistency across pages

### Example: Sorting Test

```typescript
import { test, expect } from '@playwright/test';
import { SortingHelper } from '../../helpers/SortingHelper';
import sortingScenarios from '../../data/sortingScenarios.json';

test.describe('Sorting Tests', () => {
  let sortingHelper: SortingHelper;

  test.beforeEach(async ({ request }) => {
    sortingHelper = new SortingHelper(request);
  });

  // Approach 1: Using external JSON data
  sortingScenarios.forEach(({ scenario, params, field, dataType }) => {
    test(scenario, async () => {
      const response = await sortingHelper.testSorting(
        '/users',
        params.sortBy,
        params.order,
        30
      );

      await sortingHelper.validateSortingResponse(
        response,
        field,
        params.order,
        dataType
      );
    });
  });

  // Approach 2: Generated test cases
  test('should sort by various fields', async () => {
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
        25
      );

      await sortingHelper.validateSortingResponse(
        response,
        testCase.field,
        testCase.order,
        testCase.dataType
      );
    }
  });
});
```

### Running Sorting Tests

```bash
# Run all sorting tests
npm run test tests/api/sorting.spec.ts

# Run specific sort scenario
npm run test tests/api/sorting.spec.ts -g "ascending"
```

## Combined Testing

### Matrix Testing: Pagination × Sorting

Test all combinations of pagination and sorting parameters to ensure they work together correctly.

```typescript
import combinedScenarios from '../../data/combinedScenarios.json';

test.describe('Combined Pagination and Sorting', () => {
  combinedScenarios.forEach(({ scenario, params, field, dataType }) => {
    test(scenario, async () => {
      const response = await sortingHelper.testSortingWithPagination(
        '/users',
        params.sortBy,
        params.order,
        { limit: params.limit, skip: params.skip }
      );

      // Validate pagination
      expect(response.data.limit).toBe(params.limit);
      expect(response.data.skip).toBe(params.skip);

      // Validate sorting
      sortingHelper.validateSortOrder(
        response.data.users,
        field,
        params.order,
        dataType
      );
    });
  });
});
```

### Running Combined Tests

```bash
# Run combined tests
npm run test tests/api/combined-pagination-sorting.spec.ts
```

## Best Practices

### 1. Use Descriptive Test Names

```typescript
// Good: Descriptive, includes parameters
test(`Should return ${expected} items with pageSize=${pageSize}`, async () => {});

// Bad: Generic, no context
test('pagination test', async () => {});
```

### 2. Separate Test Data from Test Logic

```typescript
// Good: External data file
import scenarios from '../../data/scenarios.json';

// Avoid: Inline large data structures
const scenarios = [/* 50+ scenarios */];
```

### 3. Log Test Progress

```typescript
test(scenario, async () => {
  const response = await testPagination('/users', params);
  console.log(`✓ ${scenario}: Fetched ${response.data.users.length} users`);
});
```

### 4. Group Related Tests

```typescript
test.describe('Pagination - Boundary Cases', () => {
  // Tests for first page, last page, beyond limit
});

test.describe('Pagination - Performance', () => {
  // Performance tests
});
```

### 5. Validate Both Happy and Sad Paths

```typescript
// Happy path
test('should return users with valid pagination', async () => {});

// Sad path
test('should handle invalid page size gracefully', async () => {});
```

### 6. Use Helpers for Complex Validation

```typescript
// Good: Use helper for complex validation
await paginationHelper.validatePaginationResponse(response, expectedParams);

// Avoid: Inline complex validation logic
expect(response.data.users.length).toBe(10);
expect(response.data.limit).toBe(10);
// ... 20 more assertions
```

## Examples

### Example 1: Basic Pagination Test

```typescript
test.describe('Basic Pagination', () => {
  const pageSizes = [10, 25, 50];

  pageSizes.forEach((limit) => {
    test(`GET /users with limit=${limit}`, async ({ request }) => {
      const helper = new PaginationHelper(request);
      const response = await helper.testPagination('/users', { limit, skip: 0 });

      expect(response.status).toBe(200);
      expect(response.data.users.length).toBeLessThanOrEqual(limit);
    });
  });
});
```

### Example 2: Sorting with Multiple Fields

```typescript
test.describe('Multi-field Sorting', () => {
  const sortTests = [
    { field: 'firstName', order: 'asc', type: 'string' },
    { field: 'age', order: 'desc', type: 'number' },
    { field: 'email', order: 'asc', type: 'string' }
  ];

  sortTests.forEach(({ field, order, type }) => {
    test(`Sort by ${field} ${order}`, async ({ request }) => {
      const helper = new SortingHelper(request);
      const response = await helper.testSorting('/users', field, order, 20);

      await helper.validateSortingResponse(response, field, order, type);
    });
  });
});
```

### Example 3: Matrix Testing

```typescript
test.describe('Pagination × Sorting Matrix', () => {
  const limits = [10, 25];
  const sorts = [
    { field: 'firstName', order: 'asc' },
    { field: 'age', order: 'desc' }
  ];

  limits.forEach((limit) => {
    sorts.forEach(({ field, order }) => {
      test(`limit=${limit}, sort=${field} ${order}`, async ({ request }) => {
        const sortingHelper = new SortingHelper(request);
        const response = await sortingHelper.testSortingWithPagination(
          '/users',
          field,
          order,
          { limit, skip: 0 }
        );

        expect(response.data.users.length).toBeLessThanOrEqual(limit);
        sortingHelper.validateSortOrder(response.data.users, field, order, 'string');
      });
    });
  });
});
```

## Summary

Parameterized testing is a powerful technique that:
- **Reduces code duplication** by reusing test logic
- **Increases test coverage** with minimal effort
- **Improves maintainability** through separation of data and logic
- **Scales well** for large test suites

Use the helpers provided (`PaginationHelper`, `SortingHelper`) and external JSON data files to implement efficient, maintainable parameterized tests in your API testing framework.

## Next Steps

1. Review existing tests in `tests/api/pagination.spec.ts`
2. Explore test data in `data/paginationScenarios.json`
3. Create your own parameterized tests using the helpers
4. Read the [API Testing Helpers Guide](./API_TESTING_HELPERS_GUIDE.md) for more details on helper functions
5. Check out the [Edge Case Testing Guide](./EDGE_CASE_TESTING_GUIDE.md) for boundary testing approaches

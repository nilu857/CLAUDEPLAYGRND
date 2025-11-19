# Test Data Management Guide

## Table of Contents
1. [Overview](#overview)
2. [Test Data Organization](#test-data-organization)
3. [JSON Data Files](#json-data-files)
4. [Using TestDataManager](#using-testdatamanager)
5. [Creating Test Data](#creating-test-data)
6. [Best Practices](#best-practices)
7. [Examples](#examples)

## Overview

Effective test data management is crucial for maintainable, scalable API testing. This guide covers how to organize, create, and use test data in your Playwright API testing framework.

### Benefits of Proper Test Data Management

- **Separation of Concerns**: Test data is separate from test logic
- **Reusability**: Same data can be used across multiple tests
- **Maintainability**: Update data without changing code
- **Collaboration**: Non-developers can contribute test scenarios
- **Version Control**: Track changes to test data over time

## Test Data Organization

### Directory Structure

```
project-root/
├── data/
│   ├── paginationScenarios.json      # Pagination test scenarios
│   ├── sortingScenarios.json         # Sorting test scenarios
│   ├── combinedScenarios.json        # Combined pagination + sorting
│   ├── edgeCaseScenarios.json        # Edge cases and boundaries
│   ├── testUsers.json                # Sample user data
│   ├── testPosts.json                # Sample post data
│   └── TestDataManager.ts            # Data management utility
├── tests/
│   └── api/
│       ├── pagination.spec.ts
│       ├── sorting.spec.ts
│       └── ...
└── ...
```

### File Naming Conventions

| Pattern | Purpose | Example |
|---------|---------|---------|
| `{feature}Scenarios.json` | Test scenarios for a feature | `paginationScenarios.json` |
| `test{Entity}.json` | Sample entity data | `testUsers.json`, `testPosts.json` |
| `{type}CaseScenarios.json` | Specific test case types | `edgeCaseScenarios.json` |

## JSON Data Files

### Pagination Scenarios

**File:** `data/paginationScenarios.json`

```json
[
  {
    "scenario": "Default pagination - First page with limit 10",
    "params": {
      "limit": 10,
      "skip": 0
    },
    "expected": {
      "minItems": 1,
      "maxItems": 10,
      "hasMore": true
    }
  },
  {
    "scenario": "Large page size - 100 items",
    "params": {
      "limit": 100,
      "skip": 0
    },
    "expected": {
      "minItems": 1,
      "maxItems": 100
    }
  }
]
```

**Structure:**
- `scenario`: Descriptive name for the test case
- `params`: API parameters to send
- `expected`: Expected results for validation

**Usage:**
```typescript
import paginationScenarios from '../../data/paginationScenarios.json';

paginationScenarios.forEach(({ scenario, params, expected }) => {
  test(scenario, async () => {
    const response = await paginationHelper.testPagination('/users', params);
    // Validate using expected values
  });
});
```

### Sorting Scenarios

**File:** `data/sortingScenarios.json`

```json
[
  {
    "scenario": "Sort by firstName ascending",
    "params": {
      "sortBy": "firstName",
      "order": "asc"
    },
    "field": "firstName",
    "dataType": "string"
  },
  {
    "scenario": "Sort by age descending",
    "params": {
      "sortBy": "age",
      "order": "desc"
    },
    "field": "age",
    "dataType": "number"
  }
]
```

**Structure:**
- `scenario`: Test case description
- `params`: Sort parameters
- `field`: Field to validate sorting on
- `dataType`: Data type for proper comparison

**Usage:**
```typescript
import sortingScenarios from '../../data/sortingScenarios.json';

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
```

### Combined Scenarios

**File:** `data/combinedScenarios.json`

```json
[
  {
    "scenario": "First page with name ascending sort",
    "params": {
      "limit": 10,
      "skip": 0,
      "sortBy": "firstName",
      "order": "asc"
    },
    "field": "firstName",
    "dataType": "string"
  },
  {
    "scenario": "Medium page with age descending sort",
    "params": {
      "limit": 25,
      "skip": 25,
      "sortBy": "age",
      "order": "desc"
    },
    "field": "age",
    "dataType": "number"
  }
]
```

**Structure:** Combines pagination and sorting parameters

**Usage:**
```typescript
import combinedScenarios from '../../data/combinedScenarios.json';

combinedScenarios.forEach(({ scenario, params, field, dataType }) => {
  test(scenario, async () => {
    const response = await sortingHelper.testSortingWithPagination(
      '/users',
      params.sortBy,
      params.order,
      { limit: params.limit, skip: params.skip }
    );

    // Validate both pagination and sorting
  });
});
```

### Edge Case Scenarios

**File:** `data/edgeCaseScenarios.json`

```json
[
  {
    "scenario": "Zero page size",
    "params": {
      "limit": 0,
      "skip": 0
    },
    "expectedStatus": 400,
    "description": "Should return 400 error for invalid page size"
  },
  {
    "scenario": "Negative limit",
    "params": {
      "limit": -10,
      "skip": 0
    },
    "expectedStatus": 400,
    "description": "Should return 400 error for negative limit"
  },
  {
    "scenario": "Skip beyond available data",
    "params": {
      "limit": 10,
      "skip": 999999
    },
    "expectedStatus": 200,
    "expectedItems": 0,
    "description": "Should return empty array when skip exceeds total items"
  }
]
```

**Structure:**
- `scenario`: Edge case name
- `params`: Parameters that trigger the edge case
- `expectedStatus`: Expected HTTP status code
- `expectedItems`: (Optional) Expected number of items
- `description`: What this edge case tests

**Usage:**
```typescript
import edgeCaseScenarios from '../../data/edgeCaseScenarios.json';

edgeCaseScenarios.forEach(({ scenario, params, expectedStatus, description }) => {
  test(`Edge case: ${scenario}`, async () => {
    const queryParams = new URLSearchParams(params);
    const response = await apiClient.get(`/users?${queryParams}`);

    // Validate expected status
    console.log(`✓ ${scenario}: ${description}`);
  });
});
```

### Sample Entity Data

**File:** `data/testUsers.json`

```json
{
  "testUser1": {
    "name": "John Doe",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "phone": "555-1234"
  },
  "testUser2": {
    "name": "Jane Smith",
    "username": "janesmith",
    "email": "jane.smith@example.com",
    "phone": "555-5678"
  },
  "adminUser": {
    "name": "Admin User",
    "username": "admin",
    "email": "admin@example.com",
    "role": "administrator"
  }
}
```

**Usage:**
```typescript
import testUsers from '../../data/testUsers.json';

test('should create user', async () => {
  const newUser = testUsers.testUser1;

  const response = await apiClient.post('/users', { data: newUser });
  expect(response.status()).toBe(201);
});
```

## Using TestDataManager

### Overview

`TestDataManager` is a utility class that provides centralized access to test data files.

### Basic Usage

```typescript
import { TestDataManager } from '../../data/TestDataManager';

test.describe('Using TestDataManager', () => {
  const testDataManager = TestDataManager.getInstance();

  test('should load test user', async () => {
    const user = testDataManager.loadDataByKey('testUsers.json', 'testUser1');

    const response = await apiClient.post('/users', { data: user });
    expect(response.status()).toBe(201);
  });
});
```

### Loading All Data from a File

```typescript
const allUsers = testDataManager.loadAllData('testUsers.json');

console.log(allUsers.testUser1);
console.log(allUsers.adminUser);
```

### Loading Specific Data by Key

```typescript
const adminUser = testDataManager.loadDataByKey('testUsers.json', 'adminUser');
```

## Creating Test Data

### Guidelines for Creating Test Data

#### 1. Make Data Realistic

```json
// Good: Realistic data
{
  "email": "john.doe@example.com",
  "phone": "+1-555-123-4567",
  "birthDate": "1990-05-15"
}

// Avoid: Unrealistic data
{
  "email": "test",
  "phone": "123",
  "birthDate": "1900-01-01"
}
```

#### 2. Include Edge Cases

```json
{
  "emptyString": "",
  "nullValue": null,
  "veryLongString": "Lorem ipsum dolor sit amet...",
  "specialCharacters": "Café ñoño",
  "unicode": "中文字符",
  "maxInteger": 2147483647
}
```

#### 3. Use Descriptive Names

```json
// Good: Descriptive
{
  "validUser": { ... },
  "userWithMissingEmail": { ... },
  "userWithInvalidPhone": { ... }
}

// Avoid: Generic
{
  "user1": { ... },
  "user2": { ... },
  "user3": { ... }
}
```

#### 4. Structure for Reusability

```json
{
  "commonFields": {
    "company": "Acme Corp",
    "country": "USA"
  },
  "users": [
    {
      "name": "User 1",
      "email": "user1@acme.com"
    }
  ]
}
```

### Creating Pagination Scenarios

**Template:**

```json
[
  {
    "scenario": "Descriptive name",
    "params": {
      "limit": 10,
      "skip": 0
    },
    "expected": {
      "minItems": 1,
      "maxItems": 10
    }
  }
]
```

**Tips:**
- Include first page, middle page, last page scenarios
- Test various page sizes: 10, 25, 50, 100
- Add edge cases: skip beyond total, zero limit

### Creating Sorting Scenarios

**Template:**

```json
[
  {
    "scenario": "Sort by {field} {order}",
    "params": {
      "sortBy": "fieldName",
      "order": "asc|desc"
    },
    "field": "fieldName",
    "dataType": "string|number|date"
  }
]
```

**Tips:**
- Test both ascending and descending for each field
- Include string, number, and date fields
- Consider nested fields: `user.address.city`

### Creating Edge Case Scenarios

**Template:**

```json
[
  {
    "scenario": "Edge case name",
    "params": { ... },
    "expectedStatus": 200 | 400 | 404 | 500,
    "expectedItems": 0,
    "description": "What this tests"
  }
]
```

**Common Edge Cases:**
- Zero/negative values
- Extremely large values
- Missing required parameters
- Invalid data types
- Special characters
- SQL injection attempts
- XSS attempts

## Best Practices

### 1. Organize by Feature

```
data/
├── users/
│   ├── createUserScenarios.json
│   ├── updateUserScenarios.json
│   └── validUsers.json
├── posts/
│   ├── createPostScenarios.json
│   └── validPosts.json
└── pagination/
    ├── paginationScenarios.json
    └── edgeCases.json
```

### 2. Use Consistent Structure

All scenario files should follow the same structure:

```json
[
  {
    "scenario": "...",
    "params": { ... },
    "expected": { ... }
  }
]
```

### 3. Version Test Data

Track test data changes in version control just like code:

```bash
git add data/paginationScenarios.json
git commit -m "Add large page size pagination scenario"
```

### 4. Document Test Data Files

Add comments at the top of JSON files (if using JSONC):

```json
{
  "_comment": "Pagination test scenarios for Users API",
  "_lastUpdated": "2024-01-15",
  "_owner": "QA Team",
  "scenarios": [...]
}
```

Or maintain a README in the data directory:

```markdown
# Test Data Documentation

## paginationScenarios.json
- **Purpose**: Test pagination functionality
- **Used by**: tests/api/pagination.spec.ts
- **Last updated**: 2024-01-15
```

### 5. Keep Data DRY (Don't Repeat Yourself)

```json
// Good: Reference common data
{
  "baseUser": {
    "company": "Acme Corp",
    "country": "USA"
  },
  "testUser1": {
    "name": "John Doe",
    "...": "use baseUser"
  }
}

// Avoid: Duplicate common fields
{
  "testUser1": {
    "name": "John Doe",
    "company": "Acme Corp",
    "country": "USA"
  },
  "testUser2": {
    "name": "Jane Smith",
    "company": "Acme Corp",  // Duplicated
    "country": "USA"         // Duplicated
  }
}
```

### 6. Validate Test Data

Create a script to validate test data structure:

```typescript
// scripts/validateTestData.ts
import paginationScenarios from '../data/paginationScenarios.json';

function validatePaginationScenarios() {
  paginationScenarios.forEach((scenario, index) => {
    if (!scenario.scenario) {
      throw new Error(`Scenario ${index} missing 'scenario' field`);
    }
    if (!scenario.params) {
      throw new Error(`Scenario ${index} missing 'params' field`);
    }
    // More validations...
  });

  console.log('✓ All pagination scenarios are valid');
}

validatePaginationScenarios();
```

### 7. Use Environment-Specific Data

```typescript
// data/config.ts
export const getTestData = () => {
  const env = process.env.TEST_ENV || 'dev';

  switch (env) {
    case 'prod':
      return import('./prod/testUsers.json');
    case 'staging':
      return import('./staging/testUsers.json');
    default:
      return import('./dev/testUsers.json');
  }
};
```

## Examples

### Example 1: Loading and Using Pagination Scenarios

```typescript
import { test, expect } from '@playwright/test';
import { PaginationHelper } from '../../helpers/PaginationHelper';
import paginationScenarios from '../../data/paginationScenarios.json';

test.describe('Pagination Tests', () => {
  let paginationHelper: PaginationHelper;

  test.beforeEach(async ({ request }) => {
    paginationHelper = new PaginationHelper(request);
  });

  paginationScenarios.forEach(({ scenario, params, expected }) => {
    test(scenario, async () => {
      const response = await paginationHelper.testPagination('/users', params);

      expect(response.status).toBe(200);

      if (expected.maxItems) {
        expect(response.data.users.length).toBeLessThanOrEqual(expected.maxItems);
      }

      console.log(`✓ ${scenario}: ${response.data.users.length} users`);
    });
  });
});
```

### Example 2: Creating Test User with TestDataManager

```typescript
import { test, expect } from '@playwright/test';
import { TestDataManager } from '../../data/TestDataManager';
import { ApiClient } from '../../lib/ApiClient';

test('should create user from test data', async ({ request }) => {
  const testDataManager = TestDataManager.getInstance();
  const apiClient = new ApiClient(request);

  const newUser = testDataManager.loadDataByKey('testUsers.json', 'testUser1');

  const response = await apiClient.post('/users', { data: newUser });

  expect(response.status()).toBe(201);
  const createdUser = await response.json();
  expect(createdUser).toMatchObject(newUser);
});
```

### Example 3: Matrix Testing with Combined Scenarios

```typescript
import { test, expect } from '@playwright/test';
import { SortingHelper } from '../../helpers/SortingHelper';
import combinedScenarios from '../../data/combinedScenarios.json';

test.describe('Combined Pagination + Sorting', () => {
  let sortingHelper: SortingHelper;

  test.beforeEach(async ({ request }) => {
    sortingHelper = new SortingHelper(request);
  });

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

      // Validate sorting
      sortingHelper.validateSortOrder(
        response.data.users,
        field,
        params.order,
        dataType
      );

      console.log(`✓ ${scenario}`);
    });
  });
});
```

## Summary

Effective test data management:
- **Separates data from logic** for better maintainability
- **Enables data-driven testing** for comprehensive coverage
- **Facilitates collaboration** between developers and QA
- **Improves scalability** as test suite grows

Key takeaways:
- Organize data files by feature or entity
- Use consistent JSON structure
- Create realistic and meaningful test data
- Include edge cases and boundary values
- Version control test data
- Use TestDataManager for centralized access

## Next Steps

1. Review existing test data files in the `data/` directory
2. Create new scenario files for your specific features
3. Read the [Parameterized Testing Guide](./PARAMETERIZED_TESTING_GUIDE.md) to use your data effectively
4. Check out the [Edge Case Testing Guide](./EDGE_CASE_TESTING_GUIDE.md) for boundary testing

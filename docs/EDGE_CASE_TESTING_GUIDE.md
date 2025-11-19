# Edge Case Testing Guide

## Table of Contents
1. [Overview](#overview)
2. [What are Edge Cases?](#what-are-edge-cases)
3. [Types of Edge Cases](#types-of-edge-cases)
4. [Boundary Value Testing](#boundary-value-testing)
5. [Invalid Input Testing](#invalid-input-testing)
6. [Security Testing](#security-testing)
7. [Implementation Examples](#implementation-examples)
8. [Best Practices](#best-practices)
9. [Common Edge Cases Checklist](#common-edge-cases-checklist)

## Overview

Edge case testing is critical for building robust APIs. Edge cases are scenarios that occur at the extreme boundaries of expected input or operating parameters. Testing these scenarios helps ensure your API handles unusual or unexpected inputs gracefully.

### Why Test Edge Cases?

- **Prevent crashes**: Ensure API doesn't fail with invalid inputs
- **Security**: Detect vulnerabilities like SQL injection, XSS
- **User experience**: Provide meaningful error messages
- **Data integrity**: Prevent corruption from invalid data
- **Compliance**: Meet security and quality standards

## What are Edge Cases?

Edge cases are scenarios that:
- Occur at boundary limits (min/max values)
- Use invalid or unexpected inputs
- Test error handling capabilities
- Violate normal usage patterns
- Expose security vulnerabilities

### Examples

| Category | Example |
|----------|---------|
| Boundary | Limit = 0, Limit = MAX_INT |
| Invalid Type | String instead of number |
| Missing Data | Required field omitted |
| Extreme Values | Very long strings, negative numbers |
| Security | SQL injection, XSS attempts |

## Types of Edge Cases

### 1. Boundary Values

Values at the edge of valid ranges:

```typescript
// Pagination boundaries
{
  "validMin": { "limit": 1, "skip": 0 },
  "validMax": { "limit": 100, "skip": 0 },
  "belowMin": { "limit": 0, "skip": 0 },      // Invalid
  "aboveMax": { "limit": 101, "skip": 0 },    // Invalid
  "exactlyMax": { "limit": 100, "skip": 0 }   // Valid edge
}
```

### 2. Invalid Data Types

Wrong type for expected parameter:

```typescript
{
  "stringInsteadOfNumber": { "limit": "abc", "skip": 0 },
  "nullValue": { "limit": null, "skip": 0 },
  "undefinedValue": { "limit": undefined, "skip": 0 },
  "objectInsteadOfPrimitive": { "limit": {}, "skip": 0 },
  "arrayInsteadOfValue": { "limit": [10], "skip": 0 }
}
```

### 3. Missing Required Parameters

Omitting required fields:

```typescript
{
  "missingLimit": { "skip": 0 },
  "missingSkip": { "limit": 10 },
  "missingAll": {},
  "onlyInvalidParams": { "foo": "bar" }
}
```

### 4. Out-of-Range Values

Values outside acceptable range:

```typescript
{
  "negativeLimit": { "limit": -10, "skip": 0 },
  "negativeSkip": { "limit": 10, "skip": -5 },
  "tooLargeLimit": { "limit": 999999, "skip": 0 },
  "skipBeyondData": { "limit": 10, "skip": 9999999 }
}
```

### 5. Special Characters & Encoding

Non-standard characters:

```typescript
{
  "unicodeCharacters": { "sortBy": "用户名", "order": "asc" },
  "specialCharacters": { "sortBy": "name!@#$%", "order": "asc" },
  "urlEncoded": { "sortBy": "first%20name", "order": "asc" },
  "emoji": { "sortBy": "name😀", "order": "asc" }
}
```

## Boundary Value Testing

### Concept

Boundary Value Analysis (BVA) is a testing technique that focuses on values at the edges of input ranges.

### The Rule of Three

Test three values for each boundary:
1. **Just below** the boundary (invalid)
2. **Exactly at** the boundary (valid edge)
3. **Just above** the boundary (invalid or next valid value)

### Example: Pagination Limit

Assume valid range is 1-100:

```typescript
const boundaryTests = [
  // Lower boundary
  { value: 0, expected: 'invalid', description: 'Just below minimum' },
  { value: 1, expected: 'valid', description: 'Exactly at minimum' },
  { value: 2, expected: 'valid', description: 'Just above minimum' },

  // Upper boundary
  { value: 99, expected: 'valid', description: 'Just below maximum' },
  { value: 100, expected: 'valid', description: 'Exactly at maximum' },
  { value: 101, expected: 'invalid', description: 'Just above maximum' }
];

boundaryTests.forEach(({ value, expected, description }) => {
  test(`Limit=${value}: ${description}`, async () => {
    const response = await apiClient.get(`/users?limit=${value}&skip=0`);

    if (expected === 'valid') {
      expect(response.status()).toBe(200);
    } else {
      expect(response.status()).toBe(400);
    }
  });
});
```

### Common Boundaries to Test

#### Pagination

- **Limit**: 0, 1, 100, 101, -1, MAX_INT
- **Skip**: -1, 0, 1, total-1, total, total+1

#### Sorting

- **Sort field**: Empty string, very long field name, non-existent field
- **Sort order**: 'asc', 'desc', 'invalid', empty, null

#### String Length

- **Empty**: ""
- **Single character**: "a"
- **Maximum length**: String of max allowed length
- **Over maximum**: String exceeding max length

#### Numeric Values

- **Zero**: 0
- **Negative**: -1, -MAX_INT
- **Positive**: 1, MAX_INT
- **Decimal**: 10.5 (if integers expected)

## Invalid Input Testing

### Categories of Invalid Inputs

#### 1. Type Mismatches

```typescript
test.describe('Type Mismatch Edge Cases', () => {
  const invalidTypes = [
    { param: 'limit', value: 'abc', type: 'string instead of number' },
    { param: 'limit', value: true, type: 'boolean instead of number' },
    { param: 'limit', value: [10], type: 'array instead of number' },
    { param: 'limit', value: { val: 10 }, type: 'object instead of number' }
  ];

  invalidTypes.forEach(({ param, value, type }) => {
    test(`should reject ${type}`, async () => {
      const response = await apiClient.get(`/users?${param}=${value}`);
      // Expect 400 Bad Request or handled gracefully
      console.log(`${type}: Status ${response.status()}`);
    });
  });
});
```

#### 2. Malformed Data

```typescript
const malformedInputs = [
  {
    name: 'Invalid JSON in body',
    body: '{invalid json}',
    expectedStatus: 400
  },
  {
    name: 'Incomplete data structure',
    body: { name: 'John' }, // Missing required fields
    expectedStatus: 400
  },
  {
    name: 'Extra unexpected fields',
    body: { name: 'John', unexpectedField: 'value' },
    expectedStatus: 400 // Or 200 if API ignores extra fields
  }
];
```

#### 3. Missing Required Fields

```typescript
test('should reject missing required fields', async () => {
  const incompleteUser = {
    name: 'John Doe'
    // Missing: email, username (required fields)
  };

  const response = await apiClient.post('/users', { data: incompleteUser });

  expect(response.status()).toBe(400);

  const error = await response.json();
  expect(error).toHaveProperty('message');
  expect(error.message).toContain('required');
});
```

## Security Testing

### SQL Injection

```typescript
test.describe('SQL Injection Prevention', () => {
  const sqlInjectionAttempts = [
    "'; DROP TABLE users; --",
    "' OR '1'='1",
    "1' UNION SELECT * FROM passwords--",
    "admin'--",
    "' OR 1=1--"
  ];

  sqlInjectionAttempts.forEach((injection) => {
    test(`should prevent SQL injection: ${injection}`, async () => {
      const response = await apiClient.get(
        `/users?sortBy=${encodeURIComponent(injection)}&order=asc&limit=10`
      );

      // Should not return 500 (server error)
      expect(response.status()).toBeLessThan(500);

      // Should either reject (400) or sanitize and process safely (200)
      const validStatuses = [200, 400, 403];
      expect(validStatuses).toContain(response.status());
    });
  });
});
```

### Cross-Site Scripting (XSS)

```typescript
test.describe('XSS Prevention', () => {
  const xssAttempts = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")>',
    'javascript:alert("XSS")',
    '<iframe src="javascript:alert(\'XSS\')">',
    '<svg onload=alert("XSS")>'
  ];

  xssAttempts.forEach((xss) => {
    test(`should prevent XSS: ${xss.substring(0, 30)}...`, async () => {
      const response = await apiClient.post('/users', {
        data: {
          name: xss,
          email: 'test@example.com'
        }
      });

      // Should handle safely
      expect(response.status()).toBeLessThan(500);

      if (response.status() === 201) {
        const user = await response.json();
        // If accepted, ensure it's sanitized
        expect(user.name).not.toContain('<script>');
      }
    });
  });
});
```

### Path Traversal

```typescript
test.describe('Path Traversal Prevention', () => {
  const pathTraversalAttempts = [
    '../../../etc/passwd',
    '..\\..\\..\\windows\\system32',
    '%2e%2e%2f%2e%2e%2f',
    '....//....//....//etc/passwd'
  ];

  pathTraversalAttempts.forEach((path) => {
    test(`should prevent path traversal: ${path}`, async () => {
      const response = await apiClient.get(`/files/${encodeURIComponent(path)}`);

      // Should reject or handle safely
      expect(response.status()).not.toBe(200);
      expect([400, 403, 404]).toContain(response.status());
    });
  });
});
```

### Header Injection

```typescript
test('should prevent header injection', async ({ request }) => {
  const maliciousHeader = 'value\r\nX-Injected-Header: injected';

  const response = await request.get('/users', {
    headers: {
      'X-Custom-Header': maliciousHeader
    }
  });

  // Should handle safely without injecting headers
  expect(response.status()).toBeLessThan(500);
});
```

## Implementation Examples

### Example 1: Comprehensive Edge Case Test Suite

```typescript
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../lib/ApiClient';
import edgeCaseScenarios from '../../data/edgeCaseScenarios.json';

test.describe('Edge Cases - Pagination', () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  edgeCaseScenarios.forEach(({ scenario, params, expectedStatus, description }) => {
    test(`Edge case: ${scenario}`, async () => {
      const queryParams = new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      );

      const response = await apiClient.get(`/users?${queryParams}`);

      console.log(`${scenario}: Expected ${expectedStatus}, Got ${response.status()}`);
      console.log(`Description: ${description}`);

      // Note: Some APIs may handle edge cases differently
      // Document the actual behavior
    });
  });
});
```

### Example 2: Boundary Value Testing

```typescript
test.describe('Boundary Value Testing - Pagination Limit', () => {
  const boundaries = [
    { value: -1, valid: false, description: 'Negative limit' },
    { value: 0, valid: false, description: 'Zero limit' },
    { value: 1, valid: true, description: 'Minimum valid limit' },
    { value: 50, valid: true, description: 'Mid-range limit' },
    { value: 100, valid: true, description: 'Maximum valid limit' },
    { value: 101, valid: false, description: 'Above maximum limit' },
    { value: 10000, valid: false, description: 'Extremely large limit' }
  ];

  boundaries.forEach(({ value, valid, description }) => {
    test(`Limit=${value}: ${description}`, async ({ request }) => {
      const response = await request.get(`/users?limit=${value}&skip=0`);

      if (valid) {
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data.users.length).toBeLessThanOrEqual(value);
      } else {
        // Expect error status or graceful handling
        console.log(`Invalid limit ${value}: Status ${response.status()}`);
      }
    });
  });
});
```

### Example 3: Invalid Data Type Testing

```typescript
test.describe('Invalid Data Types', () => {
  const invalidInputs = [
    { name: 'String for limit', params: { limit: 'abc', skip: 0 } },
    { name: 'Decimal for limit', params: { limit: 10.5, skip: 0 } },
    { name: 'Boolean for limit', params: { limit: true, skip: 0 } },
    { name: 'Array for limit', params: { limit: [10], skip: 0 } },
    { name: 'Object for limit', params: { limit: { val: 10 }, skip: 0 } }
  ];

  invalidInputs.forEach(({ name, params }) => {
    test(`should handle ${name}`, async ({ request }) => {
      const queryParams = new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      );

      const response = await request.get(`/users?${queryParams}`);

      // Document how API handles invalid types
      console.log(`${name}: Status ${response.status()}`);

      // Ideally should return 400 Bad Request
      // But some APIs may ignore and use defaults
    });
  });
});
```

### Example 4: Empty and Null Values

```typescript
test.describe('Empty and Null Values', () => {
  test('should handle empty sort field', async ({ request }) => {
    const response = await request.get('/users?sortBy=&order=asc&limit=10');

    console.log(`Empty sortBy: Status ${response.status()}`);
    // Should either use default sort or return error
  });

  test('should handle missing pagination parameters', async ({ request }) => {
    const response = await request.get('/users');

    expect(response.status()).toBe(200);

    const data = await response.json();
    // Should use default pagination
    expect(data).toHaveProperty('limit');
    expect(data).toHaveProperty('skip');

    console.log(`Default pagination: limit=${data.limit}, skip=${data.skip}`);
  });

  test('should handle partial parameters', async ({ request }) => {
    const response = await request.get('/users?limit=25');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.limit).toBe(25);
    // Skip should default to 0
    expect(data.skip).toBe(0);
  });
});
```

## Best Practices

### 1. Document Expected Behavior

```typescript
test('should reject negative page size', async () => {
  const response = await apiClient.get('/users?limit=-10&skip=0');

  // Expected behavior: Return 400 Bad Request
  // Actual behavior: May vary by API implementation
  // Document what your API does

  expect(response.status()).toBe(400); // Or document actual status
});
```

### 2. Test Both Positive and Negative Cases

```typescript
test.describe('Pagination Edge Cases', () => {
  test('✓ Should accept valid boundary values', async () => {
    const response = await apiClient.get('/users?limit=100&skip=0');
    expect(response.status()).toBe(200);
  });

  test('✗ Should reject invalid boundary values', async () => {
    const response = await apiClient.get('/users?limit=101&skip=0');
    expect(response.status()).toBe(400);
  });
});
```

### 3. Use Descriptive Test Names

```typescript
// Good: Descriptive
test('should return 400 for negative limit value', async () => {});

// Avoid: Generic
test('edge case 1', async () => {});
```

### 4. Log Unexpected Behavior

```typescript
test('should handle zero limit', async () => {
  const response = await apiClient.get('/users?limit=0&skip=0');

  if (response.status() !== 400) {
    console.warn(`⚠️ Unexpected: Zero limit returned status ${response.status()}`);
    console.warn('Expected: 400 Bad Request');
  }
});
```

### 5. Group Related Edge Cases

```typescript
test.describe('Boundary Values', () => {
  // All boundary tests
});

test.describe('Invalid Types', () => {
  // All type mismatch tests
});

test.describe('Security', () => {
  // All security-related edge cases
});
```

### 6. Prioritize Critical Edge Cases

Focus on:
1. **Security vulnerabilities** (highest priority)
2. **Data corruption scenarios**
3. **Common user errors**
4. **Boundary values**
5. **Rare edge cases** (lower priority)

## Common Edge Cases Checklist

### Pagination

- [ ] Limit = 0
- [ ] Limit < 0
- [ ] Limit > maximum allowed
- [ ] Skip < 0
- [ ] Skip > total items
- [ ] Decimal values for limit/skip
- [ ] Non-numeric values
- [ ] Missing parameters

### Sorting

- [ ] Invalid sort field name
- [ ] Empty sort field
- [ ] Non-existent field
- [ ] Invalid sort order
- [ ] Special characters in field name
- [ ] Very long field name
- [ ] Case sensitivity

### String Fields

- [ ] Empty string ("")
- [ ] Very long string (> max length)
- [ ] Special characters (!@#$%^&*)
- [ ] Unicode characters (中文, العربية)
- [ ] Emoji (😀🎉)
- [ ] HTML/XML tags
- [ ] SQL injection attempts
- [ ] XSS attempts

### Numeric Fields

- [ ] Zero (0)
- [ ] Negative numbers
- [ ] Maximum integer
- [ ] Decimal instead of integer
- [ ] Infinity
- [ ] NaN (Not a Number)
- [ ] Scientific notation (1e10)

### Request Structure

- [ ] Missing required fields
- [ ] Extra unexpected fields
- [ ] Null values
- [ ] Undefined values
- [ ] Malformed JSON
- [ ] Empty request body
- [ ] Very large request body

### Security

- [ ] SQL injection
- [ ] XSS (Cross-Site Scripting)
- [ ] Path traversal
- [ ] Header injection
- [ ] Command injection
- [ ] LDAP injection
- [ ] XML injection

## Summary

Edge case testing is essential for:
- **Robustness**: Ensure API handles unexpected inputs
- **Security**: Prevent vulnerabilities
- **User Experience**: Provide meaningful error messages
- **Reliability**: Prevent crashes and data corruption

Key strategies:
- Use Boundary Value Analysis (BVA)
- Test invalid inputs systematically
- Include security testing
- Document expected vs actual behavior
- Prioritize critical edge cases

## Next Steps

1. Review the [edge case scenarios file](../data/edgeCaseScenarios.json)
2. Run edge case tests: `npm run test tests/api/edge-cases.spec.ts`
3. Add project-specific edge cases
4. Integrate edge case testing into CI/CD pipeline
5. Review [Parameterized Testing Guide](./PARAMETERIZED_TESTING_GUIDE.md) for efficient edge case testing
6. Check [Test Data Management Guide](./TEST_DATA_MANAGEMENT_GUIDE.md) for organizing edge case data

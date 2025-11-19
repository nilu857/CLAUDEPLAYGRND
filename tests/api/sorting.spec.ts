import { test, expect } from '@playwright/test';
import { ApiClient } from '../../lib/ApiClient';
import { SortingHelper } from '../../helpers/SortingHelper';
import sortingScenarios from '../../data/sortingScenarios.json';

/**
 * Sorting API Tests
 *
 * These tests validate sorting functionality using parameterized test data.
 * Tests cover various sort fields, orders (asc/desc), and data types.
 *
 * Test approach: Data-driven testing with external JSON fixtures
 */

test.describe('API Sorting Tests - Users Endpoint', () => {
  let apiClient: ApiClient;
  let sortingHelper: SortingHelper;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
    sortingHelper = new SortingHelper(request);
  });

  /**
   * Approach 1: Using forEach with external JSON data
   * Best for: Comprehensive coverage of all sort fields
   */
  test.describe('Parameterized Sorting Scenarios', () => {
    sortingScenarios.forEach(({ scenario, params, field, dataType }) => {
      test(`${scenario}`, async () => {
        const response = await sortingHelper.testSorting(
          '/users',
          params.sortBy,
          params.order as 'asc' | 'desc',
          30 // Fetch 30 items to validate sorting
        );

        await sortingHelper.validateSortingResponse(
          response,
          field,
          params.order as 'asc' | 'desc',
          dataType as 'string' | 'number' | 'date'
        );

        console.log(
          `✓ ${scenario}: Validated ${response.data.users?.length || 0} users sorted by ${field} ${params.order}`
        );
      });
    });
  });

  /**
   * Approach 2: Generated test cases
   * Best for: Consistent testing across multiple fields
   */
  test.describe('Generated Sorting Test Cases', () => {
    test('should sort users by various fields', async () => {
      const fields = [
        { name: 'firstName', dataType: 'string' as const },
        { name: 'lastName', dataType: 'string' as const },
        { name: 'email', dataType: 'string' as const },
        { name: 'age', dataType: 'number' as const },
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

        console.log(`✓ ${testCase.name}`);
      }
    });
  });

  /**
   * Approach 3: Individual test cases with detailed validation
   * Best for: Critical sorting scenarios requiring specific assertions
   */
  test.describe('Specific Sorting Scenarios', () => {
    test('GET /users sorted by firstName ascending', async () => {
      const response = await apiClient.get('/users?sortBy=firstName&order=asc&limit=20');

      expect(response.status()).toBe(200);
      const data = await response.json();

      expect(data.users.length).toBeGreaterThan(0);

      // Validate sort order manually
      const firstNames = data.users.map((user: any) => user.firstName);
      for (let i = 0; i < firstNames.length - 1; i++) {
        const current = firstNames[i].toLowerCase();
        const next = firstNames[i + 1].toLowerCase();
        expect(current.localeCompare(next)).toBeLessThanOrEqual(0);
      }

      console.log(`First user: ${data.users[0].firstName}`);
      console.log(`Last user: ${data.users[data.users.length - 1].firstName}`);
    });

    test('GET /users sorted by age descending', async () => {
      const response = await apiClient.get('/users?sortBy=age&order=desc&limit=20');

      expect(response.status()).toBe(200);
      const data = await response.json();

      expect(data.users.length).toBeGreaterThan(0);

      // Validate sort order
      const ages = data.users.map((user: any) => user.age);
      for (let i = 0; i < ages.length - 1; i++) {
        expect(ages[i]).toBeGreaterThanOrEqual(ages[i + 1]);
      }

      console.log(`Oldest user age: ${ages[0]}`);
      console.log(`Youngest user age: ${ages[ages.length - 1]}`);
    });

    test('GET /users sorted by email ascending', async () => {
      const response = await apiClient.get('/users?sortBy=email&order=asc&limit=15');

      expect(response.status()).toBe(200);
      const data = await response.json();

      // Use helper to validate
      sortingHelper.validateSortOrder(data.users, 'email', 'asc', 'string');

      console.log(`First email: ${data.users[0].email}`);
      console.log(`Last email: ${data.users[data.users.length - 1].email}`);
    });
  });

  /**
   * Posts sorting tests
   */
  test.describe('Posts Sorting', () => {
    test('GET /posts sorted by title ascending', async () => {
      const response = await sortingHelper.testSorting('/posts', 'title', 'asc', 20);

      expect(response.status).toBe(200);
      expect(response.data.posts.length).toBeGreaterThan(0);

      sortingHelper.validateSortOrder(response.data.posts, 'title', 'asc', 'string');
    });

    test('GET /posts sorted by reactions descending', async () => {
      const response = await sortingHelper.testSorting('/posts', 'reactions', 'desc', 20);

      expect(response.status).toBe(200);
      expect(response.data.posts.length).toBeGreaterThan(0);

      // Validate reactions are in descending order
      sortingHelper.validateSortOrder(response.data.posts, 'reactions', 'desc', 'number');
    });
  });

  /**
   * Products sorting tests
   */
  test.describe('Products Sorting', () => {
    test('GET /products sorted by price ascending', async () => {
      const response = await sortingHelper.testSorting('/products', 'price', 'asc', 25);

      expect(response.status).toBe(200);
      expect(response.data.products.length).toBeGreaterThan(0);

      sortingHelper.validateSortOrder(response.data.products, 'price', 'asc', 'number');
    });

    test('GET /products sorted by title descending', async () => {
      const response = await sortingHelper.testSorting('/products', 'title', 'desc', 25);

      expect(response.status).toBe(200);
      sortingHelper.validateSortOrder(response.data.products, 'title', 'desc', 'string');
    });
  });

  /**
   * Performance testing
   */
  test.describe('Sorting Performance', () => {
    test('should respond within acceptable time for various sort operations', async () => {
      const sortFields = ['firstName', 'lastName', 'email', 'age'];

      for (const field of sortFields) {
        const duration = await sortingHelper.testSortingPerformance(
          '/users',
          field,
          'asc',
          5000 // Max 5 seconds
        );

        console.log(`✓ Sorting by ${field} took ${duration}ms`);
        expect(duration).toBeLessThan(5000);
      }
    });
  });

  /**
   * Sorting stability across pages
   */
  test.describe('Sorting Stability', () => {
    test('should maintain sort order across multiple pages', async () => {
      await sortingHelper.validateSortStability(
        '/users',
        'firstName',
        'asc',
        10, // Items per page
        3, // Test 3 pages
        'string'
      );

      console.log('✓ Sort order is stable across 3 pages');
    });
  });
});

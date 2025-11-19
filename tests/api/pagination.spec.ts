import { test, expect } from '@playwright/test';
import { ApiClient } from '../../lib/ApiClient';
import { PaginationHelper } from '../../helpers/PaginationHelper';
import paginationScenarios from '../../data/paginationScenarios.json';

/**
 * Pagination API Tests
 *
 * These tests validate pagination functionality using parameterized test data.
 * Tests cover various page sizes, offsets, and navigation scenarios.
 *
 * Test approach: Data-driven testing with external JSON fixtures
 */

test.describe('API Pagination Tests - Users Endpoint', () => {
  let apiClient: ApiClient;
  let paginationHelper: PaginationHelper;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
    paginationHelper = new PaginationHelper(request);
  });

  /**
   * Approach 1: Using forEach with external JSON data
   * Best for: Maintainable, data-driven testing
   */
  test.describe('Parameterized Pagination Scenarios', () => {
    paginationScenarios.forEach(({ scenario, params, expected }) => {
      test(`${scenario}`, async () => {
        const response = await paginationHelper.testPagination('/users', params);

        expect(response.status).toBe(200);
        const data = response.data;

        // Validate pagination parameters
        expect(data.limit).toBe(params.limit);
        expect(data.skip).toBe(params.skip);

        // Validate response structure
        expect(data).toHaveProperty('users');
        expect(data).toHaveProperty('total');
        expect(Array.isArray(data.users)).toBeTruthy();

        // Validate item count
        if (expected.minItems) {
          expect(data.users.length).toBeGreaterThanOrEqual(expected.minItems);
        }
        if (expected.maxItems) {
          expect(data.users.length).toBeLessThanOrEqual(expected.maxItems);
        }

        console.log(
          `✓ ${scenario}: Fetched ${data.users.length} users (limit: ${params.limit}, skip: ${params.skip})`
        );
      });
    });
  });

  /**
   * Approach 2: Dynamically generated test cases
   * Best for: Comprehensive coverage with minimal test data
   */
  test.describe('Generated Pagination Test Cases', () => {
    test('should handle various page sizes dynamically', async () => {
      // Generate test cases for 150 total users
      const testCases = paginationHelper.generatePaginationTestCases(150, [10, 30, 50]);

      for (const testCase of testCases) {
        const response = await paginationHelper.testPagination('/users', testCase.params);

        await paginationHelper.validatePaginationResponse(response, {
          limit: testCase.params.limit,
          skip: testCase.params.skip,
          expectedItemCount: testCase.expectedItemCount,
        });

        console.log(`✓ ${testCase.name}: ${testCase.description}`);
      }
    });
  });

  /**
   * Approach 3: Individual test cases with inline data
   * Best for: Specific, well-documented scenarios
   */
  test.describe('Specific Pagination Scenarios', () => {
    test('GET /users with limit=10, skip=0 - First page', async () => {
      const response = await apiClient.get('/users?limit=10&skip=0');

      expect(response.status()).toBe(200);
      const data = await response.json();

      expect(data.limit).toBe(10);
      expect(data.skip).toBe(0);
      expect(data.users.length).toBeLessThanOrEqual(10);
      expect(data.total).toBeGreaterThan(0);

      // Validate user structure
      if (data.users.length > 0) {
        const firstUser = data.users[0];
        expect(firstUser).toHaveProperty('id');
        expect(firstUser).toHaveProperty('firstName');
        expect(firstUser).toHaveProperty('lastName');
        expect(firstUser).toHaveProperty('email');
      }
    });

    test('GET /users with limit=25, skip=25 - Second page', async () => {
      const response = await apiClient.get('/users?limit=25&skip=25');

      expect(response.status()).toBe(200);
      const data = await response.json();

      expect(data.limit).toBe(25);
      expect(data.skip).toBe(25);
      expect(data.users.length).toBeLessThanOrEqual(25);
    });

    test('GET /users with limit=50, skip=0 - Large page size', async () => {
      const response = await apiClient.get('/users?limit=50&skip=0');

      expect(response.status()).toBe(200);
      const data = await response.json();

      expect(data.limit).toBe(50);
      expect(data.skip).toBe(0);
      expect(data.users.length).toBeLessThanOrEqual(50);
      expect(data.users.length).toBeGreaterThan(0);
    });
  });

  /**
   * Performance testing
   */
  test.describe('Pagination Performance', () => {
    test('should respond within acceptable time for different page sizes', async () => {
      const pageSizes = [10, 30, 50, 100];

      for (const limit of pageSizes) {
        const duration = await paginationHelper.testPaginationPerformance(
          '/users',
          { limit, skip: 0 },
          5000 // Max 5 seconds
        );

        console.log(`✓ Pagination with limit=${limit} took ${duration}ms`);
        expect(duration).toBeLessThan(5000);
      }
    });
  });

  /**
   * Pagination metadata validation
   */
  test.describe('Pagination Metadata', () => {
    test('should return correct total count', async () => {
      const response = await paginationHelper.testPagination('/users', {
        limit: 10,
        skip: 0,
      });

      expect(response.data.total).toBeGreaterThan(0);
      expect(typeof response.data.total).toBe('number');
    });

    test('should handle pagination beyond available data', async () => {
      // Get total first
      const firstResponse = await paginationHelper.testPagination('/users', {
        limit: 10,
        skip: 0,
      });
      const total = firstResponse.data.total;

      // Request page beyond total
      const response = await paginationHelper.testPagination('/users', {
        limit: 10,
        skip: total + 100,
      });

      expect(response.status).toBe(200);
      expect(response.data.users.length).toBe(0);
    });
  });

  /**
   * Posts endpoint pagination
   */
  test.describe('Posts Pagination', () => {
    test('GET /posts with pagination - should return paginated posts', async () => {
      const response = await paginationHelper.testPagination('/posts', {
        limit: 15,
        skip: 0,
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('posts');
      expect(response.data.posts.length).toBeLessThanOrEqual(15);

      // Validate post structure
      if (response.data.posts.length > 0) {
        const firstPost = response.data.posts[0];
        expect(firstPost).toHaveProperty('id');
        expect(firstPost).toHaveProperty('title');
        expect(firstPost).toHaveProperty('body');
        expect(firstPost).toHaveProperty('userId');
      }
    });
  });

  /**
   * Products endpoint pagination
   */
  test.describe('Products Pagination', () => {
    test('GET /products with pagination - should return paginated products', async () => {
      const response = await paginationHelper.testPagination('/products', {
        limit: 20,
        skip: 10,
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('products');
      expect(response.data.products.length).toBeLessThanOrEqual(20);
      expect(response.data.limit).toBe(20);
      expect(response.data.skip).toBe(10);
    });
  });
});

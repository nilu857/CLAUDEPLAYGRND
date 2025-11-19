import { test, expect } from '@playwright/test';
import { ApiClient } from '../../lib/ApiClient';
import { PaginationHelper } from '../../helpers/PaginationHelper';
import { SortingHelper } from '../../helpers/SortingHelper';
import combinedScenarios from '../../data/combinedScenarios.json';

/**
 * Combined Pagination and Sorting Tests
 *
 * These tests validate that pagination and sorting work correctly together.
 * This is critical for ensuring consistent user experience when both features are used simultaneously.
 *
 * Test approach: Matrix testing of pagination + sorting combinations
 */

test.describe('Combined Pagination and Sorting Tests', () => {
  let apiClient: ApiClient;
  let paginationHelper: PaginationHelper;
  let sortingHelper: SortingHelper;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
    paginationHelper = new PaginationHelper(request);
    sortingHelper = new SortingHelper(request);
  });

  /**
   * Approach 1: Using forEach with external JSON data
   * Best for: Comprehensive matrix testing
   */
  test.describe('Parameterized Combined Scenarios', () => {
    combinedScenarios.forEach(({ scenario, params, field, dataType }) => {
      test(`${scenario}`, async () => {
        const response = await sortingHelper.testSortingWithPagination(
          '/users',
          params.sortBy,
          params.order as 'asc' | 'desc',
          { limit: params.limit, skip: params.skip }
        );

        expect(response.status).toBe(200);
        const data = response.data;

        // Validate pagination
        expect(data.limit).toBe(params.limit);
        expect(data.skip).toBe(params.skip);
        expect(data.users.length).toBeLessThanOrEqual(params.limit);

        // Validate sorting
        if (data.users.length > 0) {
          sortingHelper.validateSortOrder(
            data.users,
            field,
            params.order as 'asc' | 'desc',
            dataType as 'string' | 'number' | 'date'
          );
        }

        console.log(
          `✓ ${scenario}: ${data.users.length} users (limit: ${params.limit}, skip: ${params.skip}, sort: ${params.sortBy} ${params.order})`
        );
      });
    });
  });

  /**
   * Approach 2: Manual matrix testing
   * Best for: Specific scenarios with detailed validation
   */
  test.describe('Matrix Testing - Pagination x Sorting', () => {
    const pageSizes = [10, 25, 50];
    const sortFields = [
      { name: 'firstName', order: 'asc' as const },
      { name: 'age', order: 'desc' as const },
      { name: 'email', order: 'asc' as const },
    ];

    sortFields.forEach(({ name, order }) => {
      pageSizes.forEach((limit) => {
        test(`Limit=${limit}, Sort by ${name} ${order}`, async () => {
          const response = await sortingHelper.testSortingWithPagination(
            '/users',
            name,
            order,
            { limit, skip: 0 }
          );

          expect(response.status).toBe(200);
          expect(response.data.users.length).toBeLessThanOrEqual(limit);

          // Validate sorting
          const dataType = name === 'age' ? 'number' : 'string';
          sortingHelper.validateSortOrder(
            response.data.users,
            name,
            order,
            dataType as 'string' | 'number'
          );
        });
      });
    });
  });

  /**
   * Approach 3: Comprehensive integration tests
   */
  test.describe('Integration Tests', () => {
    test('should paginate and sort users by firstName ascending', async () => {
      // First page
      const page1 = await apiClient.get('/users?limit=10&skip=0&sortBy=firstName&order=asc');
      expect(page1.status()).toBe(200);
      const data1 = await page1.json();

      expect(data1.users.length).toBe(10);
      sortingHelper.validateSortOrder(data1.users, 'firstName', 'asc', 'string');

      // Second page
      const page2 = await apiClient.get('/users?limit=10&skip=10&sortBy=firstName&order=asc');
      expect(page2.status()).toBe(200);
      const data2 = await page2.json();

      expect(data2.users.length).toBe(10);
      sortingHelper.validateSortOrder(data2.users, 'firstName', 'asc', 'string');

      // Validate that last item of page 1 comes before first item of page 2
      const lastOfPage1 = data1.users[data1.users.length - 1].firstName.toLowerCase();
      const firstOfPage2 = data2.users[0].firstName.toLowerCase();
      expect(lastOfPage1.localeCompare(firstOfPage2)).toBeLessThanOrEqual(0);

      console.log(`Page 1 last: ${lastOfPage1}, Page 2 first: ${firstOfPage2}`);
    });

    test('should paginate and sort posts by reactions descending', async () => {
      const response = await apiClient.get(
        '/posts?limit=15&skip=0&sortBy=reactions&order=desc'
      );

      expect(response.status()).toBe(200);
      const data = await response.json();

      expect(data.posts.length).toBeLessThanOrEqual(15);
      sortingHelper.validateSortOrder(data.posts, 'reactions', 'desc', 'number');

      console.log(
        `Most reactions: ${data.posts[0].reactions}, Least: ${data.posts[data.posts.length - 1].reactions}`
      );
    });

    test('should paginate and sort products by price ascending', async () => {
      const response = await apiClient.get(
        '/products?limit=20&skip=10&sortBy=price&order=asc'
      );

      expect(response.status()).toBe(200);
      const data = await response.json();

      expect(data.products.length).toBeLessThanOrEqual(20);
      sortingHelper.validateSortOrder(data.products, 'price', 'asc', 'number');
    });
  });

  /**
   * Sequential page validation with sorting
   */
  test.describe('Sequential Page Validation', () => {
    test('should maintain sort order across multiple pages', async () => {
      const allUsers: any[] = [];
      const totalPages = 5;
      const limit = 10;

      // Fetch multiple pages
      for (let page = 0; page < totalPages; page++) {
        const skip = page * limit;
        const response = await apiClient.get(
          `/users?limit=${limit}&skip=${skip}&sortBy=lastName&order=asc`
        );

        expect(response.status()).toBe(200);
        const data = await response.json();

        allUsers.push(...data.users);
      }

      // Validate that all users together are properly sorted
      sortingHelper.validateSortOrder(allUsers, 'lastName', 'asc', 'string');

      console.log(
        `✓ Validated sort order across ${totalPages} pages (${allUsers.length} total users)`
      );
    });
  });

  /**
   * Boundary testing with combined parameters
   */
  test.describe('Boundary Scenarios', () => {
    test('should handle large page size with sorting', async () => {
      const response = await apiClient.get('/users?limit=100&skip=0&sortBy=email&order=asc');

      expect(response.status()).toBe(200);
      const data = await response.json();

      expect(data.users.length).toBeLessThanOrEqual(100);
      sortingHelper.validateSortOrder(data.users, 'email', 'asc', 'string');
    });

    test('should handle last page with sorting', async () => {
      // Get total count first
      const firstResponse = await apiClient.get('/users?limit=10&skip=0');
      const firstData = await firstResponse.json();
      const total = firstData.total;

      // Calculate last page
      const lastPageSkip = Math.floor(total / 10) * 10;

      const response = await apiClient.get(
        `/users?limit=10&skip=${lastPageSkip}&sortBy=age&order=desc`
      );

      expect(response.status()).toBe(200);
      const data = await response.json();

      if (data.users.length > 0) {
        sortingHelper.validateSortOrder(data.users, 'age', 'desc', 'number');
      }
    });

    test('should handle small page size with complex sorting', async () => {
      const response = await apiClient.get(
        '/users?limit=3&skip=5&sortBy=firstName&order=asc'
      );

      expect(response.status()).toBe(200);
      const data = await response.json();

      expect(data.users.length).toBeLessThanOrEqual(3);
      if (data.users.length > 1) {
        sortingHelper.validateSortOrder(data.users, 'firstName', 'asc', 'string');
      }
    });
  });

  /**
   * Performance testing with combined parameters
   */
  test.describe('Performance Tests', () => {
    test('should perform well with pagination and sorting combined', async () => {
      const scenarios = [
        { limit: 10, skip: 0, sortBy: 'firstName', order: 'asc' },
        { limit: 50, skip: 25, sortBy: 'age', order: 'desc' },
        { limit: 100, skip: 0, sortBy: 'email', order: 'asc' },
      ];

      for (const scenario of scenarios) {
        const startTime = Date.now();

        const response = await apiClient.get(
          `/users?limit=${scenario.limit}&skip=${scenario.skip}&sortBy=${scenario.sortBy}&order=${scenario.order}`
        );

        const duration = Date.now() - startTime;

        expect(response.status()).toBe(200);
        expect(duration).toBeLessThan(5000);

        console.log(
          `✓ Combined query (limit=${scenario.limit}, sort=${scenario.sortBy}) took ${duration}ms`
        );
      }
    });
  });
});

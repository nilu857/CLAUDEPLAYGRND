import { APIRequestContext, APIResponse } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * PaginationHelper - Utility class for testing API pagination
 *
 * Provides methods to:
 * - Test pagination with various page sizes and page numbers
 * - Generate comprehensive pagination test cases
 * - Validate pagination response metadata
 * - Test boundary conditions and edge cases
 */
export class PaginationHelper {
  private request: APIRequestContext;
  private baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string = '') {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  /**
   * Test pagination for a given endpoint
   * @param endpoint - API endpoint to test
   * @param params - Pagination parameters (limit, skip, pageSize, pageNumber, etc.)
   * @returns Response with status, data, and headers
   */
  async testPagination(endpoint: string, params: Record<string, any>): Promise<{
    status: number;
    data: any;
    headers: Record<string, string>;
  }> {
    const url = this.buildUrl(endpoint, params);
    const response = await this.request.get(url);

    return {
      status: response.status(),
      data: await response.json(),
      headers: response.headers(),
    };
  }

  /**
   * Validate pagination response structure and metadata
   * @param response - API response object
   * @param expectedParams - Expected pagination parameters
   */
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
  ): Promise<void> {
    const { data, status } = response;

    // Validate status code
    expect(status).toBe(200);

    // Validate data structure (supports multiple pagination formats)
    // Format 1: DummyJSON style (limit, skip, total)
    if (expectedParams.limit !== undefined) {
      expect(data).toHaveProperty('limit');
      expect(data.limit).toBe(expectedParams.limit);
    }

    if (expectedParams.skip !== undefined) {
      expect(data).toHaveProperty('skip');
      expect(data.skip).toBe(expectedParams.skip);
    }

    // Format 2: Standard pagination (pageSize, pageNumber, totalPages, totalItems)
    if (expectedParams.pageSize !== undefined) {
      expect(data).toHaveProperty('pageSize');
      expect(data.pageSize).toBe(expectedParams.pageSize);
    }

    if (expectedParams.pageNumber !== undefined) {
      expect(data).toHaveProperty('pageNumber');
      expect(data.pageNumber).toBe(expectedParams.pageNumber);
    }

    // Validate total metadata
    expect(data).toHaveProperty('total');
    expect(typeof data.total).toBe('number');

    // Validate items array (supports different response formats)
    const items = this.extractItems(data);
    expect(Array.isArray(items)).toBeTruthy();

    // Validate item count
    if (expectedParams.expectedItemCount !== undefined) {
      expect(items.length).toBe(expectedParams.expectedItemCount);
    }

    if (expectedParams.minItems !== undefined) {
      expect(items.length).toBeGreaterThanOrEqual(expectedParams.minItems);
    }

    if (expectedParams.maxItems !== undefined) {
      expect(items.length).toBeLessThanOrEqual(expectedParams.maxItems);
    }
  }

  /**
   * Generate comprehensive pagination test cases
   * @param totalItems - Total number of items in the dataset
   * @param pageSizes - Array of page sizes to test (default: [10, 25, 50, 100])
   * @param format - Pagination format: 'limit-skip' or 'page-size' (default: 'limit-skip')
   * @returns Array of test case objects
   */
  generatePaginationTestCases(
    totalItems: number,
    pageSizes: number[] = [10, 25, 50, 100],
    format: 'limit-skip' | 'page-size' = 'limit-skip'
  ): Array<{
    name: string;
    params: Record<string, number>;
    expectedItemCount: number;
    description: string;
  }> {
    const testCases: Array<{
      name: string;
      params: Record<string, number>;
      expectedItemCount: number;
      description: string;
    }> = [];

    pageSizes.forEach((pageSize) => {
      if (format === 'limit-skip') {
        // DummyJSON style: limit and skip
        const totalPages = Math.ceil(totalItems / pageSize);

        // Test first page
        testCases.push({
          name: `First page with limit=${pageSize}`,
          params: { limit: pageSize, skip: 0 },
          expectedItemCount: Math.min(pageSize, totalItems),
          description: `Fetch first ${pageSize} items`,
        });

        // Test middle page
        if (totalPages > 2) {
          const middlePage = Math.floor(totalPages / 2);
          const skipCount = (middlePage - 1) * pageSize;
          testCases.push({
            name: `Middle page with limit=${pageSize}`,
            params: { limit: pageSize, skip: skipCount },
            expectedItemCount: Math.min(pageSize, totalItems - skipCount),
            description: `Fetch items ${skipCount + 1} to ${skipCount + pageSize}`,
          });
        }

        // Test last page
        if (totalPages > 1) {
          const lastPageSkip = (totalPages - 1) * pageSize;
          const lastPageItems = totalItems - lastPageSkip;
          testCases.push({
            name: `Last page with limit=${pageSize}`,
            params: { limit: pageSize, skip: lastPageSkip },
            expectedItemCount: lastPageItems,
            description: `Fetch last ${lastPageItems} items`,
          });
        }
      } else {
        // Standard pagination: pageSize and pageNumber
        const totalPages = Math.ceil(totalItems / pageSize);

        // Test first page
        testCases.push({
          name: `First page with pageSize=${pageSize}`,
          params: { pageSize, pageNumber: 1 },
          expectedItemCount: Math.min(pageSize, totalItems),
          description: `Fetch page 1 with ${pageSize} items per page`,
        });

        // Test middle page
        if (totalPages > 2) {
          const middlePage = Math.floor(totalPages / 2);
          testCases.push({
            name: `Middle page (${middlePage}) with pageSize=${pageSize}`,
            params: { pageSize, pageNumber: middlePage },
            expectedItemCount: pageSize,
            description: `Fetch page ${middlePage} with ${pageSize} items per page`,
          });
        }

        // Test last page
        if (totalPages > 1) {
          const lastPageItems = totalItems % pageSize || pageSize;
          testCases.push({
            name: `Last page with pageSize=${pageSize}`,
            params: { pageSize, pageNumber: totalPages },
            expectedItemCount: lastPageItems,
            description: `Fetch last page with ${lastPageItems} items`,
          });
        }
      }
    });

    return testCases;
  }

  /**
   * Extract items array from response data (supports multiple formats)
   */
  private extractItems(data: any): any[] {
    // DummyJSON format
    if (data.users) return data.users;
    if (data.posts) return data.posts;
    if (data.products) return data.products;
    if (data.comments) return data.comments;

    // Standard format
    if (data.items) return data.items;
    if (data.data) return data.data;

    // Fallback: assume data itself is the array
    if (Array.isArray(data)) return data;

    return [];
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(endpoint: string, params: Record<string, any>): string {
    const url = new URL(endpoint, this.baseUrl || 'http://localhost');
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
    return this.baseUrl ? url.toString() : `${endpoint}?${url.searchParams.toString()}`;
  }

  /**
   * Validate pagination navigation metadata (hasNext, hasPrevious, etc.)
   */
  validatePaginationNavigation(
    data: any,
    currentPage: number,
    totalPages: number
  ): void {
    // Check hasNext
    if (data.hasNext !== undefined) {
      const expectedHasNext = currentPage < totalPages;
      expect(data.hasNext).toBe(expectedHasNext);
    }

    // Check hasPrevious
    if (data.hasPrevious !== undefined) {
      const expectedHasPrevious = currentPage > 1;
      expect(data.hasPrevious).toBe(expectedHasPrevious);
    }

    // Check totalPages
    if (data.totalPages !== undefined) {
      expect(data.totalPages).toBe(totalPages);
    }
  }

  /**
   * Test pagination performance by measuring response times
   */
  async testPaginationPerformance(
    endpoint: string,
    params: Record<string, any>,
    maxDuration: number = 5000
  ): Promise<number> {
    const startTime = Date.now();
    await this.testPagination(endpoint, params);
    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(maxDuration);
    return duration;
  }
}

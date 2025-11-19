import { APIRequestContext, APIResponse } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * SortingHelper - Utility class for testing API sorting functionality
 *
 * Provides methods to:
 * - Test sorting by various fields and orders
 * - Validate sort order correctness
 * - Support multiple data types (string, number, date)
 * - Test combined sorting with pagination
 */
export class SortingHelper {
  private request: APIRequestContext;
  private baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string = '') {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  /**
   * Test sorting for a given endpoint
   * @param endpoint - API endpoint to test
   * @param sortBy - Field to sort by
   * @param order - Sort order ('asc' or 'desc')
   * @param limit - Number of items to fetch (default: 50)
   * @returns Response with status and data
   */
  async testSorting(
    endpoint: string,
    sortBy: string,
    order: 'asc' | 'desc',
    limit: number = 50
  ): Promise<{
    status: number;
    data: any;
  }> {
    const params: Record<string, any> = {
      sortBy,
      order,
      limit,
    };

    // Support different query parameter formats
    // Some APIs use 'sortBy' and 'order', others use 'sortOrder'
    const url = this.buildUrl(endpoint, params);
    const response = await this.request.get(url);

    return {
      status: response.status(),
      data: await response.json(),
    };
  }

  /**
   * Validate that items are sorted correctly
   * @param items - Array of items to validate
   * @param field - Field name to check sorting on
   * @param order - Expected sort order ('asc' or 'desc')
   * @param dataType - Data type of the field ('string', 'number', 'date')
   */
  validateSortOrder(
    items: any[],
    field: string,
    order: 'asc' | 'desc',
    dataType: 'string' | 'number' | 'date' = 'string'
  ): void {
    if (items.length === 0) {
      console.warn('No items to validate sort order');
      return;
    }

    const values = items.map((item) => this.getNestedValue(item, field));

    for (let i = 0; i < values.length - 1; i++) {
      const current = values[i];
      const next = values[i + 1];

      // Skip null/undefined values
      if (current === null || current === undefined || next === null || next === undefined) {
        continue;
      }

      const comparisonResult = this.compareValues(current, next, dataType);

      if (order === 'asc') {
        expect(comparisonResult).toBeLessThanOrEqual(0);
      } else {
        expect(comparisonResult).toBeGreaterThanOrEqual(0);
      }
    }
  }

  /**
   * Validate sorting response including status and sort order
   * @param response - API response object
   * @param field - Field name to check sorting on
   * @param order - Expected sort order
   * @param dataType - Data type of the field
   */
  async validateSortingResponse(
    response: { status: number; data: any },
    field: string,
    order: 'asc' | 'desc',
    dataType: 'string' | 'number' | 'date' = 'string'
  ): Promise<void> {
    const { data, status } = response;

    // Validate status code
    expect(status).toBe(200);

    // Extract items from response
    const items = this.extractItems(data);
    expect(items.length).toBeGreaterThan(0);

    // Validate sort order
    this.validateSortOrder(items, field, order, dataType);
  }

  /**
   * Generate sorting test scenarios for multiple fields
   * @param fields - Array of field configurations to test
   * @returns Array of test case objects
   */
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
  }> {
    const testCases: Array<{
      name: string;
      sortBy: string;
      order: 'asc' | 'desc';
      field: string;
      dataType: 'string' | 'number' | 'date';
    }> = [];

    fields.forEach((fieldConfig) => {
      const orders = fieldConfig.orders || ['asc', 'desc'];
      const dataType = fieldConfig.dataType || 'string';

      orders.forEach((order) => {
        testCases.push({
          name: `Sort by ${fieldConfig.name} in ${order} order`,
          sortBy: fieldConfig.name,
          order,
          field: fieldConfig.name,
          dataType,
        });
      });
    });

    return testCases;
  }

  /**
   * Test combined sorting and pagination
   * @param endpoint - API endpoint to test
   * @param sortBy - Field to sort by
   * @param order - Sort order
   * @param paginationParams - Pagination parameters
   */
  async testSortingWithPagination(
    endpoint: string,
    sortBy: string,
    order: 'asc' | 'desc',
    paginationParams: { limit?: number; skip?: number; pageSize?: number; pageNumber?: number }
  ): Promise<{
    status: number;
    data: any;
  }> {
    const params: Record<string, any> = {
      sortBy,
      order,
      ...paginationParams,
    };

    const url = this.buildUrl(endpoint, params);
    const response = await this.request.get(url);

    return {
      status: response.status(),
      data: await response.json(),
    };
  }

  /**
   * Validate that sorting is stable across paginated results
   * @param endpoint - API endpoint to test
   * @param sortBy - Field to sort by
   * @param order - Sort order
   * @param limit - Items per page
   * @param totalPages - Number of pages to test
   * @param dataType - Data type of the field
   */
  async validateSortStability(
    endpoint: string,
    sortBy: string,
    order: 'asc' | 'desc',
    limit: number,
    totalPages: number,
    dataType: 'string' | 'number' | 'date' = 'string'
  ): Promise<void> {
    const allItems: any[] = [];

    // Fetch multiple pages
    for (let page = 0; page < totalPages; page++) {
      const skip = page * limit;
      const response = await this.testSortingWithPagination(endpoint, sortBy, order, {
        limit,
        skip,
      });

      const items = this.extractItems(response.data);
      allItems.push(...items);
    }

    // Validate that all items together are properly sorted
    this.validateSortOrder(allItems, sortBy, order, dataType);
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
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
    return this.baseUrl ? url.toString() : `${endpoint}?${url.searchParams.toString()}`;
  }

  /**
   * Get nested value from object using dot notation
   * @param obj - Object to extract value from
   * @param path - Dot-notation path (e.g., 'user.name')
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Compare two values based on data type
   * @param a - First value
   * @param b - Second value
   * @param dataType - Type of comparison
   * @returns Negative if a < b, 0 if a === b, positive if a > b
   */
  private compareValues(a: any, b: any, dataType: 'string' | 'number' | 'date'): number {
    switch (dataType) {
      case 'number':
        return Number(a) - Number(b);

      case 'date':
        return new Date(a).getTime() - new Date(b).getTime();

      case 'string':
      default:
        const strA = String(a).toLowerCase();
        const strB = String(b).toLowerCase();
        return strA.localeCompare(strB);
    }
  }

  /**
   * Test sorting performance
   */
  async testSortingPerformance(
    endpoint: string,
    sortBy: string,
    order: 'asc' | 'desc',
    maxDuration: number = 5000
  ): Promise<number> {
    const startTime = Date.now();
    await this.testSorting(endpoint, sortBy, order);
    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(maxDuration);
    return duration;
  }
}

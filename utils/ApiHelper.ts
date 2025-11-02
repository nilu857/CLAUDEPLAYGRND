import { APIResponse } from '@playwright/test';

/**
 * API Helper utility functions
 */
export class ApiHelper {
  /**
   * Extract value from response using JSONPath-like syntax
   */
  static async extractValue(response: APIResponse, path: string): Promise<any> {
    const body = await response.json();
    return this.getNestedValue(body, path);
  }

  /**
   * Extract multiple values from response
   */
  static async extractValues(response: APIResponse, paths: string[]): Promise<Record<string, any>> {
    const body = await response.json();
    const result: Record<string, any> = {};

    for (const path of paths) {
      result[path] = this.getNestedValue(body, path);
    }

    return result;
  }

  /**
   * Get nested value from object using dot notation
   */
  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => {
      // Handle array indexing like 'items[0].name'
      const arrayMatch = prop.match(/(.+)\[(\d+)\]/);
      if (arrayMatch) {
        const [, arrayName, index] = arrayMatch;
        return current?.[arrayName]?.[parseInt(index)];
      }
      return current?.[prop];
    }, obj);
  }

  /**
   * Compare two API responses
   */
  static async compareResponses(response1: APIResponse, response2: APIResponse): Promise<ComparisonResult> {
    const body1 = await response1.json();
    const body2 = await response2.json();

    return {
      statusMatch: response1.status() === response2.status(),
      bodyMatch: JSON.stringify(body1) === JSON.stringify(body2),
      differences: this.findDifferences(body1, body2),
    };
  }

  /**
   * Find differences between two objects
   */
  private static findDifferences(obj1: any, obj2: any, path: string = ''): string[] {
    const differences: string[] = [];

    if (typeof obj1 !== typeof obj2) {
      differences.push(`${path}: Type mismatch`);
      return differences;
    }

    if (typeof obj1 === 'object' && obj1 !== null) {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      const allKeys = new Set([...keys1, ...keys2]);

      for (const key of allKeys) {
        const newPath = path ? `${path}.${key}` : key;

        if (!(key in obj1)) {
          differences.push(`${newPath}: Missing in first object`);
        } else if (!(key in obj2)) {
          differences.push(`${newPath}: Missing in second object`);
        } else {
          differences.push(...this.findDifferences(obj1[key], obj2[key], newPath));
        }
      }
    } else if (obj1 !== obj2) {
      differences.push(`${path}: ${obj1} !== ${obj2}`);
    }

    return differences;
  }

  /**
   * Merge request options
   */
  static mergeOptions(...options: any[]): any {
    const merged: any = {};

    for (const option of options) {
      if (!option) continue;

      if (option.headers) {
        merged.headers = { ...merged.headers, ...option.headers };
      }

      if (option.params) {
        merged.params = { ...merged.params, ...option.params };
      }

      if (option.data) {
        merged.data = option.data;
      }

      // Merge other properties
      Object.keys(option).forEach((key) => {
        if (!['headers', 'params', 'data'].includes(key)) {
          merged[key] = option[key];
        }
      });
    }

    return merged;
  }

  /**
   * Build query string from object
   */
  static buildQueryString(params: Record<string, any>): string {
    return Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }

  /**
   * Parse query string to object
   */
  static parseQueryString(queryString: string): Record<string, string> {
    const params: Record<string, string> = {};
    const pairs = queryString.replace(/^\?/, '').split('&');

    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    }

    return params;
  }

  /**
   * Wait for condition with polling
   */
  static async waitForCondition(
    condition: () => Promise<boolean>,
    timeout: number = 30000,
    pollInterval: number = 1000
  ): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return;
      }
      await this.delay(pollInterval);
    }

    throw new Error(`Condition not met within ${timeout}ms`);
  }

  /**
   * Delay helper
   */
  static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export interface ComparisonResult {
  statusMatch: boolean;
  bodyMatch: boolean;
  differences: string[];
}

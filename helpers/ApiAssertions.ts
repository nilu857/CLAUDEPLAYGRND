import { APIResponse, expect } from '@playwright/test';

/**
 * API Assertions helper for common API test assertions
 */
export class ApiAssertions {
  /**
   * Assert response status code
   */
  static async assertStatusCode(response: APIResponse, expectedStatus: number): Promise<void> {
    expect(response.status(), `Expected status ${expectedStatus} but got ${response.status()}`).toBe(expectedStatus);
  }

  /**
   * Assert response is successful (2xx)
   */
  static async assertSuccess(response: APIResponse): Promise<void> {
    expect(response.ok(), `Expected successful response but got status ${response.status()}`).toBeTruthy();
  }

  /**
   * Assert response status is in range
   */
  static async assertStatusInRange(response: APIResponse, min: number, max: number): Promise<void> {
    const status = response.status();
    expect(status).toBeGreaterThanOrEqual(min);
    expect(status).toBeLessThanOrEqual(max);
  }

  /**
   * Assert response has header
   */
  static async assertHasHeader(response: APIResponse, headerName: string): Promise<void> {
    const headers = response.headers();
    expect(headers).toHaveProperty(headerName.toLowerCase());
  }

  /**
   * Assert response header value
   */
  static async assertHeaderValue(response: APIResponse, headerName: string, expectedValue: string): Promise<void> {
    const headers = response.headers();
    expect(headers[headerName.toLowerCase()]).toBe(expectedValue);
  }

  /**
   * Assert response content type
   */
  static async assertContentType(response: APIResponse, expectedType: string): Promise<void> {
    const headers = response.headers();
    const contentType = headers['content-type'];
    expect(contentType, `Expected content-type to contain ${expectedType}`).toContain(expectedType);
  }

  /**
   * Assert response body contains property
   */
  static async assertBodyHasProperty(response: APIResponse, propertyPath: string): Promise<void> {
    const body = await response.json();
    const value = this.getNestedProperty(body, propertyPath);
    expect(value, `Expected property '${propertyPath}' to exist in response body`).toBeDefined();
  }

  /**
   * Assert response body property value
   */
  static async assertBodyPropertyValue(response: APIResponse, propertyPath: string, expectedValue: any): Promise<void> {
    const body = await response.json();
    const value = this.getNestedProperty(body, propertyPath);
    expect(value, `Expected property '${propertyPath}' to equal ${expectedValue}`).toBe(expectedValue);
  }

  /**
   * Assert response body property contains value
   */
  static async assertBodyPropertyContains(response: APIResponse, propertyPath: string, expectedValue: any): Promise<void> {
    const body = await response.json();
    const value = this.getNestedProperty(body, propertyPath);
    expect(value, `Expected property '${propertyPath}' to contain ${expectedValue}`).toContain(expectedValue);
  }

  /**
   * Assert response body is array
   */
  static async assertBodyIsArray(response: APIResponse): Promise<void> {
    const body = await response.json();
    expect(Array.isArray(body), 'Expected response body to be an array').toBeTruthy();
  }

  /**
   * Assert response body array length
   */
  static async assertBodyArrayLength(response: APIResponse, expectedLength: number): Promise<void> {
    const body = await response.json();
    expect(Array.isArray(body), 'Expected response body to be an array').toBeTruthy();
    expect(body.length).toBe(expectedLength);
  }

  /**
   * Assert response body array minimum length
   */
  static async assertBodyArrayMinLength(response: APIResponse, minLength: number): Promise<void> {
    const body = await response.json();
    expect(Array.isArray(body), 'Expected response body to be an array').toBeTruthy();
    expect(body.length).toBeGreaterThanOrEqual(minLength);
  }

  /**
   * Assert response body array contains item
   */
  static async assertBodyArrayContains(response: APIResponse, expectedItem: any): Promise<void> {
    const body = await response.json();
    expect(Array.isArray(body), 'Expected response body to be an array').toBeTruthy();
    expect(body).toContainEqual(expectedItem);
  }

  /**
   * Assert response body matches schema
   */
  static async assertBodyMatchesSchema(response: APIResponse, schema: Record<string, string>): Promise<void> {
    const body = await response.json();

    for (const [key, type] of Object.entries(schema)) {
      expect(body).toHaveProperty(key);
      expect(typeof body[key]).toBe(type);
    }
  }

  /**
   * Assert response body matches partial object
   */
  static async assertBodyMatchesObject(response: APIResponse, expectedObject: any): Promise<void> {
    const body = await response.json();
    expect(body).toMatchObject(expectedObject);
  }

  /**
   * Assert response body equals expected object
   */
  static async assertBodyEquals(response: APIResponse, expectedBody: any): Promise<void> {
    const body = await response.json();
    expect(body).toEqual(expectedBody);
  }

  /**
   * Assert response time is within limit
   */
  static assertResponseTime(duration: number, maxTime: number): void {
    expect(duration, `Response time ${duration}ms exceeded maximum ${maxTime}ms`).toBeLessThanOrEqual(maxTime);
  }

  /**
   * Assert response is empty
   */
  static async assertBodyIsEmpty(response: APIResponse): Promise<void> {
    const body = await response.text();
    expect(body.length).toBe(0);
  }

  /**
   * Assert response body is not empty
   */
  static async assertBodyIsNotEmpty(response: APIResponse): Promise<void> {
    const body = await response.text();
    expect(body.length).toBeGreaterThan(0);
  }

  /**
   * Helper to get nested property from object using dot notation
   */
  private static getNestedProperty(obj: any, path: string): any {
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
}

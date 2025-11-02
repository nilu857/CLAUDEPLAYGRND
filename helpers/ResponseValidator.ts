import { APIResponse, expect } from '@playwright/test';

/**
 * Response Validator for API response validation
 */
export class ResponseValidator {
  private response: APIResponse;
  private responseBody: any;

  constructor(response: APIResponse) {
    this.response = response;
  }

  /**
   * Initialize response body
   */
  private async initResponseBody(): Promise<void> {
    if (!this.responseBody) {
      this.responseBody = await this.response.json();
    }
  }

  /**
   * Validate status code
   */
  async validateStatus(expectedStatus: number): Promise<ResponseValidator> {
    expect(this.response.status()).toBe(expectedStatus);
    return this;
  }

  /**
   * Validate status code is in range
   */
  async validateStatusInRange(min: number, max: number): Promise<ResponseValidator> {
    const status = this.response.status();
    expect(status).toBeGreaterThanOrEqual(min);
    expect(status).toBeLessThanOrEqual(max);
    return this;
  }

  /**
   * Validate response is successful (2xx)
   */
  async validateSuccess(): Promise<ResponseValidator> {
    expect(this.response.ok()).toBeTruthy();
    return this;
  }

  /**
   * Validate response header exists
   */
  async validateHeaderExists(headerName: string): Promise<ResponseValidator> {
    const headers = this.response.headers();
    expect(headers).toHaveProperty(headerName.toLowerCase());
    return this;
  }

  /**
   * Validate response header value
   */
  async validateHeaderValue(headerName: string, expectedValue: string): Promise<ResponseValidator> {
    const headers = this.response.headers();
    expect(headers[headerName.toLowerCase()]).toBe(expectedValue);
    return this;
  }

  /**
   * Validate response header contains value
   */
  async validateHeaderContains(headerName: string, expectedValue: string): Promise<ResponseValidator> {
    const headers = this.response.headers();
    expect(headers[headerName.toLowerCase()]).toContain(expectedValue);
    return this;
  }

  /**
   * Validate response content type
   */
  async validateContentType(expectedType: string): Promise<ResponseValidator> {
    const headers = this.response.headers();
    expect(headers['content-type']).toContain(expectedType);
    return this;
  }

  /**
   * Validate response body contains property
   */
  async validateBodyHasProperty(propertyPath: string): Promise<ResponseValidator> {
    await this.initResponseBody();
    const value = this.getNestedProperty(this.responseBody, propertyPath);
    expect(value).toBeDefined();
    return this;
  }

  /**
   * Validate response body property value
   */
  async validateBodyPropertyValue(propertyPath: string, expectedValue: any): Promise<ResponseValidator> {
    await this.initResponseBody();
    const value = this.getNestedProperty(this.responseBody, propertyPath);
    expect(value).toBe(expectedValue);
    return this;
  }

  /**
   * Validate response body property contains value
   */
  async validateBodyPropertyContains(propertyPath: string, expectedValue: any): Promise<ResponseValidator> {
    await this.initResponseBody();
    const value = this.getNestedProperty(this.responseBody, propertyPath);
    expect(value).toContain(expectedValue);
    return this;
  }

  /**
   * Validate response body matches schema
   */
  async validateBodyMatchesSchema(schema: any): Promise<ResponseValidator> {
    await this.initResponseBody();

    for (const [key, type] of Object.entries(schema)) {
      expect(this.responseBody).toHaveProperty(key);
      expect(typeof this.responseBody[key]).toBe(type);
    }

    return this;
  }

  /**
   * Validate response body is array
   */
  async validateBodyIsArray(): Promise<ResponseValidator> {
    await this.initResponseBody();
    expect(Array.isArray(this.responseBody)).toBeTruthy();
    return this;
  }

  /**
   * Validate response body array length
   */
  async validateBodyArrayLength(expectedLength: number): Promise<ResponseValidator> {
    await this.initResponseBody();
    expect(Array.isArray(this.responseBody)).toBeTruthy();
    expect(this.responseBody.length).toBe(expectedLength);
    return this;
  }

  /**
   * Validate response body array minimum length
   */
  async validateBodyArrayMinLength(minLength: number): Promise<ResponseValidator> {
    await this.initResponseBody();
    expect(Array.isArray(this.responseBody)).toBeTruthy();
    expect(this.responseBody.length).toBeGreaterThanOrEqual(minLength);
    return this;
  }

  /**
   * Validate response time
   */
  async validateResponseTime(maxTime: number): Promise<ResponseValidator> {
    // Note: You'll need to measure this in your test
    // This is a placeholder for the concept
    return this;
  }

  /**
   * Get response body
   */
  async getBody<T = any>(): Promise<T> {
    await this.initResponseBody();
    return this.responseBody;
  }

  /**
   * Helper to get nested property from object using dot notation
   */
  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }
}

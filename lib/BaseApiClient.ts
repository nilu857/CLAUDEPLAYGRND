import { APIRequestContext, APIResponse, expect } from '@playwright/test';

/**
 * Base API Client class providing common API testing functionality
 */
export class BaseApiClient {
  protected request: APIRequestContext;
  protected baseURL: string;

  constructor(request: APIRequestContext, baseURL?: string) {
    this.request = request;
    this.baseURL = baseURL || '';
  }

  /**
   * Perform GET request
   */
  async get(endpoint: string, options?: any): Promise<APIResponse> {
    const response = await this.request.get(endpoint, options);
    return response;
  }

  /**
   * Perform POST request
   */
  async post(endpoint: string, options?: any): Promise<APIResponse> {
    const response = await this.request.post(endpoint, options);
    return response;
  }

  /**
   * Perform PUT request
   */
  async put(endpoint: string, options?: any): Promise<APIResponse> {
    const response = await this.request.put(endpoint, options);
    return response;
  }

  /**
   * Perform PATCH request
   */
  async patch(endpoint: string, options?: any): Promise<APIResponse> {
    const response = await this.request.patch(endpoint, options);
    return response;
  }

  /**
   * Perform DELETE request
   */
  async delete(endpoint: string, options?: any): Promise<APIResponse> {
    const response = await this.request.delete(endpoint, options);
    return response;
  }

  /**
   * Verify response status code
   */
  async verifyStatusCode(response: APIResponse, expectedStatus: number): Promise<void> {
    expect(response.status()).toBe(expectedStatus);
  }

  /**
   * Verify response has specific header
   */
  async verifyHeader(response: APIResponse, headerName: string, expectedValue?: string): Promise<void> {
    const headers = response.headers();
    expect(headers).toHaveProperty(headerName.toLowerCase());

    if (expectedValue) {
      expect(headers[headerName.toLowerCase()]).toBe(expectedValue);
    }
  }

  /**
   * Parse response body as JSON
   */
  async getResponseBody<T = any>(response: APIResponse): Promise<T> {
    return await response.json();
  }

  /**
   * Get response text
   */
  async getResponseText(response: APIResponse): Promise<string> {
    return await response.text();
  }

  /**
   * Log response details for debugging
   */
  async logResponse(response: APIResponse): Promise<void> {
    console.log('Status:', response.status());
    console.log('Status Text:', response.statusText());
    console.log('Headers:', response.headers());
    console.log('Body:', await response.text());
  }
}

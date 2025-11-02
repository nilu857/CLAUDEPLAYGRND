import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';
import { Logger } from '../utils/Logger';

/**
 * Main API Client extending BaseApiClient with additional functionality
 */
export class ApiClient extends BaseApiClient {
  private logger: Logger;

  constructor(request: APIRequestContext, baseURL?: string) {
    super(request, baseURL);
    this.logger = Logger.getInstance();
  }

  /**
   * Enhanced GET request with logging
   */
  async get(endpoint: string, options?: any): Promise<APIResponse> {
    this.logger.request('GET', endpoint, options);
    const response = await super.get(endpoint, options);
    this.logger.response(response.status(), endpoint);
    return response;
  }

  /**
   * Enhanced POST request with logging
   */
  async post(endpoint: string, options?: any): Promise<APIResponse> {
    this.logger.request('POST', endpoint, options?.data);
    const response = await super.post(endpoint, options);
    this.logger.response(response.status(), endpoint);
    return response;
  }

  /**
   * Enhanced PUT request with logging
   */
  async put(endpoint: string, options?: any): Promise<APIResponse> {
    this.logger.request('PUT', endpoint, options?.data);
    const response = await super.put(endpoint, options);
    this.logger.response(response.status(), endpoint);
    return response;
  }

  /**
   * Enhanced PATCH request with logging
   */
  async patch(endpoint: string, options?: any): Promise<APIResponse> {
    this.logger.request('PATCH', endpoint, options?.data);
    const response = await super.patch(endpoint, options);
    this.logger.response(response.status(), endpoint);
    return response;
  }

  /**
   * Enhanced DELETE request with logging
   */
  async delete(endpoint: string, options?: any): Promise<APIResponse> {
    this.logger.request('DELETE', endpoint, options);
    const response = await super.delete(endpoint, options);
    this.logger.response(response.status(), endpoint);
    return response;
  }

  /**
   * Perform request with retry logic
   */
  async requestWithRetry(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    options?: any,
    maxRetries: number = 3,
    retryDelay: number = 1000
  ): Promise<APIResponse> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        let response: APIResponse;

        switch (method) {
          case 'GET':
            response = await this.get(endpoint, options);
            break;
          case 'POST':
            response = await this.post(endpoint, options);
            break;
          case 'PUT':
            response = await this.put(endpoint, options);
            break;
          case 'PATCH':
            response = await this.patch(endpoint, options);
            break;
          case 'DELETE':
            response = await this.delete(endpoint, options);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        if (response.ok()) {
          return response;
        }

        // If not ok and not last attempt, retry
        if (attempt < maxRetries) {
          this.logger.warn(`Request failed with status ${response.status()}, retrying... (Attempt ${attempt + 1}/${maxRetries})`);
          await this.delay(retryDelay * (attempt + 1)); // Exponential backoff
          continue;
        }

        return response;
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries) {
          this.logger.warn(`Request failed with error: ${error}, retrying... (Attempt ${attempt + 1}/${maxRetries})`);
          await this.delay(retryDelay * (attempt + 1));
        }
      }
    }

    throw lastError || new Error('Request failed after all retries');
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Upload file
   */
  async uploadFile(endpoint: string, filePath: string, fieldName: string = 'file'): Promise<APIResponse> {
    const formData = {
      [fieldName]: filePath,
    };

    return await this.post(endpoint, { multipart: formData });
  }

  /**
   * Download file
   */
  async downloadFile(endpoint: string, savePath: string): Promise<void> {
    const response = await this.get(endpoint);
    const buffer = await response.body();
    const fs = require('fs');
    fs.writeFileSync(savePath, buffer);
  }
}

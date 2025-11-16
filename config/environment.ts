import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Environment configuration
 */
export class Environment {
  static get baseURL(): string {
    return process.env.API_BASE_URL || 'https://dummyjson.com';
  }

  static get devBaseURL(): string {
    return process.env.DEV_API_BASE_URL || this.baseURL;
  }

  static get stagingBaseURL(): string {
    return process.env.STAGING_API_BASE_URL || this.baseURL;
  }

  static get prodBaseURL(): string {
    return process.env.PROD_API_BASE_URL || this.baseURL;
  }

  static get apiKey(): string {
    return process.env.API_KEY || '';
  }

  static get apiSecret(): string {
    return process.env.API_SECRET || '';
  }

  static get authToken(): string {
    return process.env.AUTH_TOKEN || '';
  }

  static get logLevel(): string {
    return process.env.LOG_LEVEL || 'INFO';
  }

  static get retryCount(): number {
    return parseInt(process.env.RETRY_COUNT || '3', 10);
  }

  static get retryDelay(): number {
    return parseInt(process.env.RETRY_DELAY || '1000', 10);
  }

  static get requestTimeout(): number {
    return parseInt(process.env.REQUEST_TIMEOUT || '30000', 10);
  }

  static get testUsername(): string {
    return process.env.TEST_USERNAME || 'testuser';
  }

  static get testPassword(): string {
    return process.env.TEST_PASSWORD || 'testpassword';
  }

  static get testEmail(): string {
    return process.env.TEST_EMAIL || 'test@example.com';
  }

  static get enableRetry(): boolean {
    return process.env.ENABLE_RETRY === 'true';
  }

  static get enableLogging(): boolean {
    return process.env.ENABLE_LOGGING === 'true';
  }

  static get enableScreenshots(): boolean {
    return process.env.ENABLE_SCREENSHOTS === 'true';
  }

  static get allureResultsDir(): string {
    return process.env.ALLURE_RESULTS_DIR || './allure-results';
  }

  static get reportOutputDir(): string {
    return process.env.REPORT_OUTPUT_DIR || './test-results';
  }

  static get isCI(): boolean {
    return process.env.CI === 'true';
  }

  static get currentEnvironment(): 'dev' | 'staging' | 'prod' {
    const env = process.env.TEST_ENV || 'dev';
    return env as 'dev' | 'staging' | 'prod';
  }

  static getBaseURLForEnvironment(env?: 'dev' | 'staging' | 'prod'): string {
    const environment = env || this.currentEnvironment;

    switch (environment) {
      case 'dev':
        return this.devBaseURL;
      case 'staging':
        return this.stagingBaseURL;
      case 'prod':
        return this.prodBaseURL;
      default:
        return this.baseURL;
    }
  }

  static printConfig(): void {
    console.log('=== Environment Configuration ===');
    console.log(`Environment: ${this.currentEnvironment}`);
    console.log(`Base URL: ${this.baseURL}`);
    console.log(`Log Level: ${this.logLevel}`);
    console.log(`Retry Count: ${this.retryCount}`);
    console.log(`Request Timeout: ${this.requestTimeout}ms`);
    console.log(`CI Mode: ${this.isCI}`);
    console.log('================================');
  }
}

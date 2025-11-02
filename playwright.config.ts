import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',

  // Maximum time one test can run
  timeout: 60 * 1000,

  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    // Uncomment if using Allure
    // ['allure-playwright', { outputFolder: 'allure-results' }]
  ],

  // Global test settings
  use: {
    // Base URL for API requests
    baseURL: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',

    // Extra HTTP headers
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },

    // Collect trace on failure
    trace: 'retain-on-failure',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure (for API tests this is usually not needed)
    video: 'retain-on-failure',
  },

  // Projects for different test environments
  projects: [
    {
      name: 'API Tests - Development',
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        baseURL: process.env.DEV_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
      },
    },
    {
      name: 'API Tests - Staging',
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        baseURL: process.env.STAGING_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
      },
    },
    {
      name: 'API Tests - Production',
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        baseURL: process.env.PROD_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
      },
    },
  ],

  // Output folder for test artifacts
  outputDir: 'test-results/',
});

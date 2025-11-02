# Playwright API Testing Framework

A comprehensive and production-ready API testing framework built with Playwright and TypeScript. This framework provides a robust foundation for testing REST APIs with features like request builders, response validators, custom assertions, test data management, and more.

## Features

- **Type-Safe**: Built with TypeScript for better IDE support and type checking
- **Modular Architecture**: Clean separation of concerns with reusable components
- **Flexible Request Building**: Fluent API for constructing complex requests
- **Comprehensive Validations**: Multiple ways to validate API responses
- **Schema Validation**: Validate response structures against expected schemas
- **Test Data Management**: Organized test data with easy loading and caching
- **Environment Configuration**: Support for multiple environments (dev, staging, prod)
- **Retry Mechanism**: Built-in retry logic for flaky tests
- **Detailed Logging**: Configurable logging for debugging
- **Data Generation**: Utilities for generating random test data
- **Response Comparisons**: Compare API responses easily
- **CI/CD Ready**: GitHub Actions workflow included

## Project Structure

```
playwright-api-testing-framework/
├── config/                      # Configuration files
│   ├── environment.ts          # Environment configuration
│   └── testConfig.ts           # Test configuration constants
├── data/                        # Test data
│   ├── TestDataManager.ts      # Test data management utility
│   ├── testUsers.json          # Sample user test data
│   └── testPosts.json          # Sample post test data
├── helpers/                     # Helper utilities
│   ├── ApiAssertions.ts        # Custom API assertions
│   ├── ResponseValidator.ts    # Response validation with fluent API
│   └── SchemaValidator.ts      # JSON schema validator
├── lib/                         # Core library
│   ├── BaseApiClient.ts        # Base API client class
│   ├── ApiClient.ts            # Enhanced API client with logging
│   └── RequestBuilder.ts       # Fluent request builder
├── utils/                       # Utility functions
│   ├── Logger.ts               # Logging utility
│   ├── DataGenerator.ts        # Test data generator
│   └── ApiHelper.ts            # API helper functions
├── tests/api/                   # API test suites
│   ├── users.api.spec.ts       # User API tests
│   ├── posts.api.spec.ts       # Post API tests
│   └── advanced.api.spec.ts    # Advanced testing scenarios
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore file
├── package.json                 # Project dependencies
├── playwright.config.ts         # Playwright configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                    # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd playwright-api-testing-framework
```

2. Install dependencies:
```bash
npm install
```

3. Create your environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your API configuration:
```env
API_BASE_URL=https://your-api-url.com
API_KEY=your_api_key
# ... other configurations
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run specific test file
```bash
npx playwright test tests/api/users.api.spec.ts
```

### Run tests in headed mode
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests with UI mode
```bash
npm run test:ui
```

### Run only API tests
```bash
npm run test:api
```

### View test report
```bash
npm run report
```

### Run tests for specific environment
```bash
# Development
npx playwright test --project="API Tests - Development"

# Staging
npx playwright test --project="API Tests - Staging"

# Production
npx playwright test --project="API Tests - Production"
```

## Framework Components

### 1. API Client

The framework provides two API client classes:

#### BaseApiClient
Basic API client with standard HTTP methods:
```typescript
import { BaseApiClient } from './lib/BaseApiClient';

const client = new BaseApiClient(request);
const response = await client.get('/users');
```

#### ApiClient
Enhanced client with logging and retry capabilities:
```typescript
import { ApiClient } from './lib/ApiClient';

const client = new ApiClient(request);
const response = await client.get('/users');

// With retry
const response = await client.requestWithRetry('GET', '/users', {}, 3, 1000);
```

### 2. Request Builder

Build complex requests with a fluent API:
```typescript
import { RequestBuilder } from './lib/RequestBuilder';

const builder = new RequestBuilder();
const options = builder
  .addHeader('Authorization', 'Bearer token')
  .addHeader('X-Custom-Header', 'value')
  .addQueryParam('userId', '1')
  .addQueryParam('limit', '10')
  .setBody({ name: 'John', email: 'john@example.com' })
  .build();

const response = await client.post('/users', options);
```

### 3. Response Validation

#### Using ResponseValidator (Fluent API)
```typescript
import { ResponseValidator } from './helpers/ResponseValidator';

const validator = new ResponseValidator(response);
await validator
  .validateStatus(200)
  .then(v => v.validateContentType('application/json'))
  .then(v => v.validateBodyHasProperty('id'))
  .then(v => v.validateBodyPropertyValue('name', 'John'));
```

#### Using ApiAssertions
```typescript
import { ApiAssertions } from './helpers/ApiAssertions';

await ApiAssertions.assertStatusCode(response, 200);
await ApiAssertions.assertContentType(response, 'application/json');
await ApiAssertions.assertBodyHasProperty(response, 'id');
await ApiAssertions.assertBodyPropertyValue(response, 'name', 'John');
```

### 4. Schema Validation

Validate response structure:
```typescript
import { SchemaValidator } from './helpers/SchemaValidator';

const schema = {
  required: ['id', 'name', 'email'],
  properties: {
    id: { type: 'number' },
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', pattern: '^[^@]+@[^@]+\\.[^@]+$' }
  }
};

const result = SchemaValidator.validate(responseBody, schema);
expect(result.valid).toBeTruthy();
```

### 5. Test Data Management

Load and manage test data:
```typescript
import { TestDataManager } from './data/TestDataManager';

const dataManager = TestDataManager.getInstance();

// Load entire file
const users = dataManager.loadData('testUsers.json');

// Load specific data by key
const validUser = dataManager.loadDataByKey('testUsers.json', 'validUser');
```

### 6. Data Generation

Generate random test data:
```typescript
import { DataGenerator } from './utils/DataGenerator';

const randomEmail = DataGenerator.randomEmail();
const randomString = DataGenerator.randomString(10);
const randomNumber = DataGenerator.randomNumber(1, 100);
const randomUser = DataGenerator.randomUser();
const uuid = DataGenerator.randomUUID();
```

### 7. API Helper

Additional API utilities:
```typescript
import { ApiHelper } from './utils/ApiHelper';

// Extract values from response
const userId = await ApiHelper.extractValue(response, 'id');
const userName = await ApiHelper.extractValue(response, 'user.name');

// Compare responses
const comparison = await ApiHelper.compareResponses(response1, response2);

// Wait for condition
await ApiHelper.waitForCondition(async () => {
  const response = await client.get('/status');
  const body = await response.json();
  return body.status === 'ready';
}, 30000, 1000);
```

## Example Test

```typescript
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../lib/ApiClient';
import { RequestBuilder } from '../../lib/RequestBuilder';
import { ApiAssertions } from '../../helpers/ApiAssertions';
import { DataGenerator } from '../../utils/DataGenerator';

test.describe('User API Tests', () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test('Create and verify user', async () => {
    // Create user
    const newUser = {
      name: DataGenerator.randomString(10),
      email: DataGenerator.randomEmail(),
    };

    const builder = new RequestBuilder();
    const options = builder.setBody(newUser).build();

    const response = await apiClient.post('/users', options);

    // Validate response
    await ApiAssertions.assertStatusCode(response, 201);
    await ApiAssertions.assertBodyHasProperty(response, 'id');
    await ApiAssertions.assertBodyPropertyValue(response, 'email', newUser.email);

    // Extract user ID
    const user = await response.json();
    expect(user.id).toBeDefined();
  });
});
```

## Environment Configuration

The framework supports multiple environments through environment variables:

```env
# .env file
API_BASE_URL=https://api.example.com
DEV_API_BASE_URL=https://dev-api.example.com
STAGING_API_BASE_URL=https://staging-api.example.com
PROD_API_BASE_URL=https://api.example.com

API_KEY=your_api_key
LOG_LEVEL=INFO
RETRY_COUNT=3
```

Access in tests:
```typescript
import { Environment } from '../config/environment';

const baseURL = Environment.baseURL;
const apiKey = Environment.apiKey;
const retryCount = Environment.retryCount;
```

## Logging

Configure logging level in `.env`:
```env
LOG_LEVEL=DEBUG  # DEBUG, INFO, WARN, ERROR
```

Use logger in tests:
```typescript
import { Logger } from '../utils/Logger';

const logger = Logger.getInstance();
logger.info('Test started');
logger.debug('Request details', requestData);
logger.error('Test failed', error);
```

## CI/CD Integration

The framework includes a GitHub Actions workflow for CI/CD. Tests run automatically on push and pull requests.

To use locally:
```bash
# Set CI environment variable
export CI=true
npm test
```

## Best Practices

1. **Use Request Builder**: Always use RequestBuilder for constructing requests
2. **Validate Responses**: Use ApiAssertions or ResponseValidator for validations
3. **Manage Test Data**: Store test data in JSON files and use TestDataManager
4. **Generate Data**: Use DataGenerator for creating unique test data
5. **Handle Errors**: Always validate both success and error scenarios
6. **Use Retry**: Use requestWithRetry for potentially flaky endpoints
7. **Log Appropriately**: Use appropriate log levels for debugging
8. **Environment Variables**: Never commit sensitive data, use .env files

## Advanced Features

### Chaining API Calls
```typescript
// Create post, then add comment
const postResponse = await client.post('/posts', postOptions);
const post = await postResponse.json();

const commentOptions = builder.setBody({ postId: post.id, ... }).build();
const commentResponse = await client.post('/comments', commentOptions);
```

### Concurrent Requests
```typescript
const requests = [
  client.get('/users/1'),
  client.get('/users/2'),
  client.get('/users/3'),
];

const responses = await Promise.all(requests);
```

### Performance Testing
```typescript
const startTime = Date.now();
await client.get('/users');
const duration = Date.now() - startTime;

ApiAssertions.assertResponseTime(duration, 1000); // Max 1 second
```

## Troubleshooting

### Tests failing with timeout
- Increase timeout in playwright.config.ts
- Check network connectivity
- Verify API endpoint is accessible

### Authentication errors
- Check API_KEY and AUTH_TOKEN in .env
- Verify token hasn't expired
- Check header formatting in RequestBuilder

### Type errors
- Run `npm install` to ensure all dependencies are installed
- Check tsconfig.json paths configuration
- Ensure you're using the correct import paths

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run tests to ensure they pass
6. Submit a pull request

## License

MIT

## Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review example tests in `tests/api/`

## Acknowledgments

Built with:
- [Playwright](https://playwright.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)

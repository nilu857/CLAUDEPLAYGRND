/**
 * Test Configuration
 */
export const TestConfig = {
  // API endpoints
  endpoints: {
    users: '/users',
    posts: '/posts',
    comments: '/comments',
    albums: '/albums',
    photos: '/photos',
    todos: '/todos',
  },

  // Timeout values
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000,
  },

  // Retry configuration
  retry: {
    maxAttempts: 3,
    delay: 1000,
    backoffMultiplier: 2,
  },

  // Test data limits
  limits: {
    maxUsers: 100,
    maxPosts: 100,
    maxComments: 500,
  },

  // Headers
  defaultHeaders: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },

  // Status codes
  statusCodes: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },

  // Test users
  testUsers: {
    valid: {
      username: 'testuser',
      email: 'test@example.com',
      password: 'TestPassword123!',
    },
    invalid: {
      username: '',
      email: 'invalid-email',
      password: '123',
    },
  },
};

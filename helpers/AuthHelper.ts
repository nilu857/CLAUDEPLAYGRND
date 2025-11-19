import { APIRequestContext } from '@playwright/test';

/**
 * AuthHelper - Utility class for managing authentication in API tests
 *
 * Provides methods to:
 * - Manage authentication tokens
 * - Handle different authentication types (Bearer, API Key, Basic Auth)
 * - Store and retrieve credentials securely
 * - Support service account authentication
 */
export class AuthHelper {
  private request: APIRequestContext;
  private baseUrl: string;
  private tokenCache: Map<string, { token: string; expiresAt: number }> = new Map();

  constructor(request: APIRequestContext, baseUrl: string = '') {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  /**
   * Get authentication headers for Bearer token
   * @param token - Bearer token
   * @returns Headers object with Authorization header
   */
  getBearerAuthHeaders(token: string): Record<string, string> {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get authentication headers for API Key
   * @param apiKey - API key value
   * @param headerName - Name of the header (default: 'X-API-Key')
   * @returns Headers object with API key header
   */
  getApiKeyAuthHeaders(apiKey: string, headerName: string = 'X-API-Key'): Record<string, string> {
    return {
      [headerName]: apiKey,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get authentication headers for Basic Auth
   * @param username - Username
   * @param password - Password
   * @returns Headers object with Basic Auth header
   */
  getBasicAuthHeaders(username: string, password: string): Record<string, string> {
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    return {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Authenticate and get token (for OAuth/JWT flows)
   * @param endpoint - Authentication endpoint
   * @param credentials - User credentials
   * @param cacheKey - Optional cache key for token storage
   * @returns Authentication token
   */
  async authenticateAndGetToken(
    endpoint: string,
    credentials: { username?: string; password?: string; [key: string]: any },
    cacheKey?: string
  ): Promise<string> {
    // Check cache first
    if (cacheKey && this.tokenCache.has(cacheKey)) {
      const cached = this.tokenCache.get(cacheKey)!;
      if (cached.expiresAt > Date.now()) {
        return cached.token;
      }
    }

    // Make authentication request
    const response = await this.request.post(`${this.baseUrl}${endpoint}`, {
      data: credentials,
    });

    if (!response.ok()) {
      throw new Error(`Authentication failed with status ${response.status()}`);
    }

    const data = await response.json();
    const token = data.token || data.access_token || data.accessToken;

    if (!token) {
      throw new Error('No token found in authentication response');
    }

    // Cache token if cache key provided
    if (cacheKey) {
      const expiresIn = data.expiresIn || data.expires_in || 3600; // Default 1 hour
      this.tokenCache.set(cacheKey, {
        token,
        expiresAt: Date.now() + expiresIn * 1000,
      });
    }

    return token;
  }

  /**
   * Get token from environment variable
   * @param envVarName - Name of environment variable (default: 'API_TOKEN')
   * @returns Token from environment
   */
  getTokenFromEnv(envVarName: string = 'API_TOKEN'): string {
    const token = process.env[envVarName];
    if (!token) {
      throw new Error(`Environment variable ${envVarName} not found`);
    }
    return token;
  }

  /**
   * Get service account token (for automated testing)
   * This method should be configured based on your service account authentication flow
   * @param serviceAccountConfig - Service account configuration
   * @returns Service account token
   */
  async getServiceAccountToken(serviceAccountConfig: {
    endpoint?: string;
    clientId?: string;
    clientSecret?: string;
    [key: string]: any;
  }): Promise<string> {
    const endpoint = serviceAccountConfig.endpoint || '/auth/service-account';
    const cacheKey = `service-account-${serviceAccountConfig.clientId}`;

    // Check cache first
    if (this.tokenCache.has(cacheKey)) {
      const cached = this.tokenCache.get(cacheKey)!;
      if (cached.expiresAt > Date.now()) {
        return cached.token;
      }
    }

    // Authenticate service account
    const response = await this.request.post(`${this.baseUrl}${endpoint}`, {
      data: {
        client_id: serviceAccountConfig.clientId,
        client_secret: serviceAccountConfig.clientSecret,
        grant_type: 'client_credentials',
        ...serviceAccountConfig,
      },
    });

    if (!response.ok()) {
      throw new Error(`Service account authentication failed with status ${response.status()}`);
    }

    const data = await response.json();
    const token = data.access_token || data.token;

    if (!token) {
      throw new Error('No token found in service account authentication response');
    }

    // Cache token
    const expiresIn = data.expires_in || data.expiresIn || 3600;
    this.tokenCache.set(cacheKey, {
      token,
      expiresAt: Date.now() + expiresIn * 1000,
    });

    return token;
  }

  /**
   * Clear token cache
   * @param cacheKey - Optional specific cache key to clear, or clear all if not provided
   */
  clearTokenCache(cacheKey?: string): void {
    if (cacheKey) {
      this.tokenCache.delete(cacheKey);
    } else {
      this.tokenCache.clear();
    }
  }

  /**
   * Validate token by making a test API call
   * @param token - Token to validate
   * @param testEndpoint - Endpoint to test (default: '/auth/validate')
   * @returns True if token is valid
   */
  async validateToken(token: string, testEndpoint: string = '/auth/validate'): Promise<boolean> {
    try {
      const response = await this.request.get(`${this.baseUrl}${testEndpoint}`, {
        headers: this.getBearerAuthHeaders(token),
      });
      return response.ok();
    } catch (error) {
      return false;
    }
  }

  /**
   * Create authenticated request context with headers
   * @param authType - Type of authentication ('bearer', 'apikey', 'basic')
   * @param credentials - Authentication credentials
   * @returns Headers object ready to use in requests
   */
  createAuthHeaders(
    authType: 'bearer' | 'apikey' | 'basic',
    credentials: {
      token?: string;
      apiKey?: string;
      username?: string;
      password?: string;
      headerName?: string;
    }
  ): Record<string, string> {
    switch (authType) {
      case 'bearer':
        if (!credentials.token) throw new Error('Bearer token required');
        return this.getBearerAuthHeaders(credentials.token);

      case 'apikey':
        if (!credentials.apiKey) throw new Error('API key required');
        return this.getApiKeyAuthHeaders(credentials.apiKey, credentials.headerName);

      case 'basic':
        if (!credentials.username || !credentials.password) {
          throw new Error('Username and password required for Basic Auth');
        }
        return this.getBasicAuthHeaders(credentials.username, credentials.password);

      default:
        throw new Error(`Unsupported auth type: ${authType}`);
    }
  }
}

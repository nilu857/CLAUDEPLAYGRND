import { test, expect } from '@playwright/test';
import { ApiClient } from '../../lib/ApiClient';
import { RequestBuilder } from '../../lib/RequestBuilder';
import { ResponseValidator } from '../../helpers/ResponseValidator';
import { ApiAssertions } from '../../helpers/ApiAssertions';
import { TestDataManager } from '../../data/TestDataManager';
import { DataGenerator } from '../../utils/DataGenerator';

test.describe('Users API Tests', () => {
  let apiClient: ApiClient;
  const testDataManager = TestDataManager.getInstance();

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test('GET /users - Should return list of users', async () => {
    const response = await apiClient.get('/users');

    // Using ApiAssertions
    await ApiAssertions.assertStatusCode(response, 200);
    await ApiAssertions.assertContentType(response, 'application/json');
    await ApiAssertions.assertBodyIsArray(response);
    await ApiAssertions.assertBodyArrayMinLength(response, 1);

    // Additional validation
    const users = await response.json();
    expect(users.length).toBeGreaterThan(0);
    expect(users[0]).toHaveProperty('id');
    expect(users[0]).toHaveProperty('name');
    expect(users[0]).toHaveProperty('email');
  });

  test('GET /users/:id - Should return specific user', async () => {
    const userId = 1;
    const response = await apiClient.get(`/users/${userId}`);

    // Using ResponseValidator (fluent API)
    const validator = new ResponseValidator(response);
    await validator
      .validateStatus(200)
      .then((v) => v.validateContentType('application/json'))
      .then((v) => v.validateBodyHasProperty('id'))
      .then((v) => v.validateBodyPropertyValue('id', userId));

    const user = await response.json();
    expect(user.id).toBe(userId);
  });

  test('GET /users/:id - Should return 404 for non-existent user', async () => {
    const response = await apiClient.get('/users/99999');

    await ApiAssertions.assertStatusCode(response, 404);
  });

  test('POST /users - Should create new user', async () => {
    const newUser = {
      name: DataGenerator.randomString(10),
      username: DataGenerator.randomString(8),
      email: DataGenerator.randomEmail(),
      phone: DataGenerator.randomPhoneNumber(),
    };

    const requestBuilder = new RequestBuilder();
    const options = requestBuilder.setBody(newUser).build();

    const response = await apiClient.post('/users', options);

    await ApiAssertions.assertStatusCode(response, 201);
    await ApiAssertions.assertBodyHasProperty(response, 'id');

    const createdUser = await response.json();
    expect(createdUser).toMatchObject(newUser);
  });

  test('POST /users - Should create user with test data', async () => {
    const testUser = testDataManager.loadDataByKey('testUsers.json', 'testUser1');

    const requestBuilder = new RequestBuilder();
    const options = requestBuilder
      .setBody(testUser)
      .addHeader('Accept', 'application/json')
      .build();

    const response = await apiClient.post('/users', options);

    await ApiAssertions.assertStatusCode(response, 201);
    await ApiAssertions.assertBodyPropertyValue(response, 'email', testUser.email);
  });

  test('PUT /users/:id - Should update user', async () => {
    const userId = 1;
    const updatedData = {
      name: 'Updated Name',
      email: 'updated@example.com',
    };

    const requestBuilder = new RequestBuilder();
    const options = requestBuilder.setBody(updatedData).build();

    const response = await apiClient.put(`/users/${userId}`, options);

    await ApiAssertions.assertStatusCode(response, 200);
    await ApiAssertions.assertBodyPropertyValue(response, 'id', userId);
  });

  test('PATCH /users/:id - Should partially update user', async () => {
    const userId = 1;
    const patchData = {
      email: DataGenerator.randomEmail(),
    };

    const requestBuilder = new RequestBuilder();
    const options = requestBuilder.setBody(patchData).build();

    const response = await apiClient.patch(`/users/${userId}`, options);

    await ApiAssertions.assertStatusCode(response, 200);
    await ApiAssertions.assertBodyPropertyValue(response, 'email', patchData.email);
  });

  test('DELETE /users/:id - Should delete user', async () => {
    const userId = 1;
    const response = await apiClient.delete(`/users/${userId}`);

    await ApiAssertions.assertStatusCode(response, 200);
  });

  test('GET /users with query parameters - Should filter users', async () => {
    const requestBuilder = new RequestBuilder();
    const options = requestBuilder.addQueryParam('userId', '1').build();

    const response = await apiClient.get('/users', options);

    await ApiAssertions.assertStatusCode(response, 200);
    await ApiAssertions.assertBodyIsArray(response);
  });

  test('GET /users - Should validate response schema', async () => {
    const response = await apiClient.get('/users/1');

    const expectedSchema = {
      id: 'number',
      name: 'string',
      username: 'string',
      email: 'string',
    };

    await ApiAssertions.assertBodyMatchesSchema(response, expectedSchema);
  });

  test('POST /users - Should validate response time', async ({ request }) => {
    const startTime = Date.now();

    const newUser = {
      name: 'Test User',
      email: 'test@example.com',
    };

    const requestBuilder = new RequestBuilder();
    const options = requestBuilder.setBody(newUser).build();

    await apiClient.post('/users', options);

    const duration = Date.now() - startTime;
    ApiAssertions.assertResponseTime(duration, 5000); // Should respond within 5 seconds
  });
});

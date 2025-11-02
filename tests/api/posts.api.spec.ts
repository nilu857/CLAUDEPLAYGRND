import { test, expect } from '@playwright/test';
import { ApiClient } from '../../lib/ApiClient';
import { RequestBuilder } from '../../lib/RequestBuilder';
import { ResponseValidator } from '../../helpers/ResponseValidator';
import { ApiAssertions } from '../../helpers/ApiAssertions';
import { SchemaValidator } from '../../helpers/SchemaValidator';
import { TestDataManager } from '../../data/TestDataManager';
import { DataGenerator } from '../../utils/DataGenerator';

test.describe('Posts API Tests', () => {
  let apiClient: ApiClient;
  const testDataManager = TestDataManager.getInstance();

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test('GET /posts - Should return all posts', async () => {
    const response = await apiClient.get('/posts');

    await ApiAssertions.assertStatusCode(response, 200);
    await ApiAssertions.assertContentType(response, 'application/json');
    await ApiAssertions.assertBodyIsArray(response);
    await ApiAssertions.assertBodyArrayMinLength(response, 1);
  });

  test('GET /posts/:id - Should return specific post', async () => {
    const postId = 1;
    const response = await apiClient.get(`/posts/${postId}`);

    const validator = new ResponseValidator(response);
    await validator
      .validateStatus(200)
      .then((v) => v.validateBodyHasProperty('id'))
      .then((v) => v.validateBodyHasProperty('title'))
      .then((v) => v.validateBodyHasProperty('body'))
      .then((v) => v.validateBodyPropertyValue('id', postId));
  });

  test('POST /posts - Should create new post', async () => {
    const testPost = testDataManager.loadDataByKey('testPosts.json', 'validPost');

    const requestBuilder = new RequestBuilder();
    const options = requestBuilder.setBody(testPost).build();

    const response = await apiClient.post('/posts', options);

    await ApiAssertions.assertStatusCode(response, 201);
    await ApiAssertions.assertBodyHasProperty(response, 'id');
    await ApiAssertions.assertBodyPropertyValue(response, 'title', testPost.title);
    await ApiAssertions.assertBodyPropertyValue(response, 'body', testPost.body);
  });

  test('POST /posts - Should create post with random data', async () => {
    const randomPost = {
      userId: DataGenerator.randomNumber(1, 10),
      title: `Test Post ${DataGenerator.randomString(10)}`,
      body: `Test body ${DataGenerator.randomString(50)}`,
    };

    const requestBuilder = new RequestBuilder();
    const options = requestBuilder.setBody(randomPost).build();

    const response = await apiClient.post('/posts', options);

    await ApiAssertions.assertStatusCode(response, 201);
    await ApiAssertions.assertBodyMatchesObject(response, randomPost);
  });

  test('PUT /posts/:id - Should update entire post', async () => {
    const postId = 1;
    const updatedPost = {
      id: postId,
      userId: 1,
      title: 'Updated Title',
      body: 'Updated body content',
    };

    const requestBuilder = new RequestBuilder();
    const options = requestBuilder.setBody(updatedPost).build();

    const response = await apiClient.put(`/posts/${postId}`, options);

    await ApiAssertions.assertStatusCode(response, 200);
    await ApiAssertions.assertBodyPropertyValue(response, 'title', updatedPost.title);
  });

  test('PATCH /posts/:id - Should partially update post', async () => {
    const postId = 1;
    const partialUpdate = {
      title: 'Partially Updated Title',
    };

    const requestBuilder = new RequestBuilder();
    const options = requestBuilder.setBody(partialUpdate).build();

    const response = await apiClient.patch(`/posts/${postId}`, options);

    await ApiAssertions.assertStatusCode(response, 200);
    await ApiAssertions.assertBodyPropertyValue(response, 'title', partialUpdate.title);
  });

  test('DELETE /posts/:id - Should delete post', async () => {
    const postId = 1;
    const response = await apiClient.delete(`/posts/${postId}`);

    await ApiAssertions.assertStatusCode(response, 200);
  });

  test('GET /posts?userId=1 - Should filter posts by user', async () => {
    const userId = 1;
    const requestBuilder = new RequestBuilder();
    const options = requestBuilder.addQueryParam('userId', userId).build();

    const response = await apiClient.get('/posts', options);

    await ApiAssertions.assertStatusCode(response, 200);
    await ApiAssertions.assertBodyIsArray(response);

    const posts = await response.json();
    posts.forEach((post: any) => {
      expect(post.userId).toBe(userId);
    });
  });

  test('GET /posts - Should validate schema using SchemaValidator', async () => {
    const response = await apiClient.get('/posts/1');
    const post = await response.json();

    const postSchema = {
      required: ['id', 'userId', 'title', 'body'],
      properties: {
        id: { type: 'number' as const },
        userId: { type: 'number' as const },
        title: { type: 'string' as const, minLength: 1 },
        body: { type: 'string' as const, minLength: 1 },
      },
    };

    const validationResult = SchemaValidator.validate(post, postSchema);
    expect(validationResult.valid).toBeTruthy();
    expect(validationResult.errors).toHaveLength(0);
  });

  test('GET /posts/:id/comments - Should return comments for post', async () => {
    const postId = 1;
    const response = await apiClient.get(`/posts/${postId}/comments`);

    await ApiAssertions.assertStatusCode(response, 200);
    await ApiAssertions.assertBodyIsArray(response);

    const comments = await response.json();
    if (comments.length > 0) {
      expect(comments[0]).toHaveProperty('id');
      expect(comments[0]).toHaveProperty('postId');
      expect(comments[0]).toHaveProperty('name');
      expect(comments[0]).toHaveProperty('email');
      expect(comments[0]).toHaveProperty('body');
    }
  });

  test('POST /posts - Should handle request with retry on failure', async ({ request }) => {
    // This demonstrates the retry functionality
    const testPost = {
      userId: 1,
      title: 'Test Post with Retry',
      body: 'This is a test post',
    };

    const client = new ApiClient(request);
    const requestBuilder = new RequestBuilder();
    const options = requestBuilder.setBody(testPost).build();

    const response = await client.requestWithRetry('POST', '/posts', options, 3, 1000);

    await ApiAssertions.assertSuccess(response);
  });

  test('GET /posts - Should measure response time', async () => {
    const startTime = Date.now();
    const response = await apiClient.get('/posts');
    const endTime = Date.now();

    const responseTime = endTime - startTime;

    await ApiAssertions.assertStatusCode(response, 200);
    ApiAssertions.assertResponseTime(responseTime, 3000); // Max 3 seconds

    console.log(`Response time: ${responseTime}ms`);
  });
});

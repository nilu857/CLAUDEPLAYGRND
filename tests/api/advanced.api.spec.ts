import { test, expect } from '@playwright/test';
import { ApiClient } from '../../lib/ApiClient';
import { RequestBuilder } from '../../lib/RequestBuilder';
import { ApiHelper } from '../../utils/ApiHelper';
import { ApiAssertions } from '../../helpers/ApiAssertions';
import { DataGenerator } from '../../utils/DataGenerator';

test.describe('Advanced API Testing Scenarios', () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test('Chain multiple API calls - Create post and add comment', async () => {
    // Step 1: Create a new post
    const newPost = {
      userId: 1,
      title: `Test Post ${DataGenerator.randomString(8)}`,
      body: 'Test post body',
    };

    const requestBuilder = new RequestBuilder();
    const postOptions = requestBuilder.setBody(newPost).build();

    const postResponse = await apiClient.post('/posts', postOptions);
    await ApiAssertions.assertStatusCode(postResponse, 201);

    const createdPost = await postResponse.json();
    const postId = createdPost.id;

    // Step 2: Add a comment to the created post
    const newComment = {
      postId: postId,
      name: 'Test Comment',
      email: DataGenerator.randomEmail(),
      body: 'This is a test comment',
    };

    requestBuilder.reset();
    const commentOptions = requestBuilder.setBody(newComment).build();

    const commentResponse = await apiClient.post('/comments', commentOptions);
    await ApiAssertions.assertStatusCode(commentResponse, 201);
    await ApiAssertions.assertBodyPropertyValue(commentResponse, 'postId', postId);
  });

  test('Extract and use values from response', async () => {
    // Get a user
    const userResponse = await apiClient.get('/users/1');
    const userId = await ApiHelper.extractValue(userResponse, 'id');
    const userName = await ApiHelper.extractValue(userResponse, 'name');

    expect(userId).toBeDefined();
    expect(userName).toBeDefined();

    // Use extracted values in another request
    const requestBuilder = new RequestBuilder();
    const options = requestBuilder.addQueryParam('userId', userId).build();

    const postsResponse = await apiClient.get('/posts', options);
    await ApiAssertions.assertStatusCode(postsResponse, 200);
  });

  test('Extract multiple values from response', async () => {
    const response = await apiClient.get('/users/1');

    const extractedValues = await ApiHelper.extractValues(response, ['id', 'name', 'email', 'username']);

    expect(extractedValues.id).toBeDefined();
    expect(extractedValues.name).toBeDefined();
    expect(extractedValues.email).toBeDefined();
    expect(extractedValues.username).toBeDefined();

    console.log('Extracted values:', extractedValues);
  });

  test('Compare two API responses', async () => {
    const response1 = await apiClient.get('/users/1');
    const response2 = await apiClient.get('/users/1');

    const comparison = await ApiHelper.compareResponses(response1, response2);

    expect(comparison.statusMatch).toBeTruthy();
    expect(comparison.bodyMatch).toBeTruthy();
    expect(comparison.differences).toHaveLength(0);
  });

  test('Test with custom headers', async () => {
    const requestBuilder = new RequestBuilder();
    const options = requestBuilder
      .addHeader('X-Custom-Header', 'CustomValue')
      .addHeader('X-Request-ID', DataGenerator.randomUUID())
      .build();

    const response = await apiClient.get('/posts/1', options);
    await ApiAssertions.assertStatusCode(response, 200);
  });

  test('Test with multiple query parameters', async () => {
    const requestBuilder = new RequestBuilder();
    const options = requestBuilder
      .addQueryParam('userId', '1')
      .addQueryParam('_limit', '5')
      .addQueryParam('_sort', 'id')
      .build();

    const response = await apiClient.get('/posts', options);
    await ApiAssertions.assertStatusCode(response, 200);

    const posts = await response.json();
    expect(posts.length).toBeLessThanOrEqual(5);
  });

  test('Test error handling - Invalid endpoint', async () => {
    const response = await apiClient.get('/invalid-endpoint');
    await ApiAssertions.assertStatusCode(response, 404);
  });

  test('Test pagination', async () => {
    const requestBuilder = new RequestBuilder();

    // Get first page
    const page1Options = requestBuilder
      .addQueryParam('_page', '1')
      .addQueryParam('_limit', '10')
      .build();

    const page1Response = await apiClient.get('/posts', page1Options);
    await ApiAssertions.assertStatusCode(page1Response, 200);

    const page1Data = await page1Response.json();
    expect(page1Data.length).toBeLessThanOrEqual(10);

    // Get second page
    requestBuilder.reset();
    const page2Options = requestBuilder
      .addQueryParam('_page', '2')
      .addQueryParam('_limit', '10')
      .build();

    const page2Response = await apiClient.get('/posts', page2Options);
    await ApiAssertions.assertStatusCode(page2Response, 200);

    const page2Data = await page2Response.json();

    // Verify pages are different
    expect(JSON.stringify(page1Data)).not.toBe(JSON.stringify(page2Data));
  });

  test('Test sorting and filtering', async () => {
    const requestBuilder = new RequestBuilder();
    const options = requestBuilder
      .addQueryParam('userId', '1')
      .addQueryParam('_sort', 'id')
      .addQueryParam('_order', 'desc')
      .build();

    const response = await apiClient.get('/posts', options);
    await ApiAssertions.assertStatusCode(response, 200);

    const posts = await response.json();

    // Verify all posts belong to userId 1
    posts.forEach((post: any) => {
      expect(post.userId).toBe(1);
    });

    // Verify sorting (descending order)
    for (let i = 0; i < posts.length - 1; i++) {
      expect(posts[i].id).toBeGreaterThanOrEqual(posts[i + 1].id);
    }
  });

  test('Test nested resource endpoints', async () => {
    const userId = 1;

    // Get user's posts
    const postsResponse = await apiClient.get(`/users/${userId}/posts`);
    await ApiAssertions.assertStatusCode(postsResponse, 200);

    const posts = await postsResponse.json();
    expect(Array.isArray(posts)).toBeTruthy();

    // Get user's albums
    const albumsResponse = await apiClient.get(`/users/${userId}/albums`);
    await ApiAssertions.assertStatusCode(albumsResponse, 200);

    const albums = await albumsResponse.json();
    expect(Array.isArray(albums)).toBeTruthy();
  });

  test('Performance test - Multiple concurrent requests', async ({ request }) => {
    const startTime = Date.now();

    // Make 5 concurrent requests
    const requests = [];
    for (let i = 1; i <= 5; i++) {
      requests.push(apiClient.get(`/posts/${i}`));
    }

    const responses = await Promise.all(requests);

    const duration = Date.now() - startTime;

    // Verify all requests succeeded
    for (const response of responses) {
      await ApiAssertions.assertStatusCode(response, 200);
    }

    console.log(`5 concurrent requests completed in ${duration}ms`);
    ApiAssertions.assertResponseTime(duration, 10000); // Should complete within 10 seconds
  });

  test('Test request builder with all options', async () => {
    const requestBuilder = new RequestBuilder();
    const options = requestBuilder
      .addHeader('Accept', 'application/json')
      .addHeader('X-Custom-Header', 'test-value')
      .addQueryParam('userId', '1')
      .addQueryParam('_limit', '10')
      .build();

    const response = await apiClient.get('/posts', options);
    await ApiAssertions.assertStatusCode(response, 200);

    expect(options).toHaveProperty('headers');
    expect(options).toHaveProperty('params');
    expect(options.headers['Accept']).toBe('application/json');
    expect(options.params['userId']).toBe('1');
  });
});

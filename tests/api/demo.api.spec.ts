import { test, expect } from '@playwright/test';
import { ApiClient } from '../../lib/ApiClient';

/**
 * Demo API Tests using DummyJSON
 *
 * DummyJSON (https://dummyjson.com) is a free REST API with realistic data for testing
 * It provides endpoints for users, posts, products, carts, auth, and more
 *
 * Documentation: https://dummyjson.com/docs
 */

test.describe('Demo API Tests - DummyJSON', () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test('GET /users - Should return list of users', async () => {
    const response = await apiClient.get('/users');

    expect(response.status()).toBe(200);

    const data = await response.json();
    console.log('Users response:', JSON.stringify(data, null, 2));

    // DummyJSON returns paginated data with users array
    expect(data).toHaveProperty('users');
    expect(Array.isArray(data.users)).toBeTruthy();
    expect(data.users.length).toBeGreaterThan(0);

    // Check user structure
    const firstUser = data.users[0];
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('firstName');
    expect(firstUser).toHaveProperty('lastName');
    expect(firstUser).toHaveProperty('email');
  });

  test('GET /users/:id - Should return specific user', async () => {
    const userId = 1;
    const response = await apiClient.get(`/users/${userId}`);

    expect(response.status()).toBe(200);

    const user = await response.json();
    console.log('User details:', JSON.stringify(user, null, 2));

    expect(user.id).toBe(userId);
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('lastName');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('phone');
    expect(user).toHaveProperty('image');
  });

  test('GET /posts - Should return list of posts', async () => {
    const response = await apiClient.get('/posts');

    expect(response.status()).toBe(200);

    const data = await response.json();
    console.log('Posts response sample:', JSON.stringify(data.posts?.slice(0, 2), null, 2));

    // DummyJSON returns paginated data
    expect(data).toHaveProperty('posts');
    expect(Array.isArray(data.posts)).toBeTruthy();
    expect(data.posts.length).toBeGreaterThan(0);
    expect(data).toHaveProperty('total');
    expect(data).toHaveProperty('skip');
    expect(data).toHaveProperty('limit');
  });

  test('GET /posts/:id - Should return specific post', async () => {
    const postId = 1;
    const response = await apiClient.get(`/posts/${postId}`);

    expect(response.status()).toBe(200);

    const post = await response.json();
    console.log('Post details:', JSON.stringify(post, null, 2));

    expect(post.id).toBe(postId);
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('body');
    expect(post).toHaveProperty('userId');
    expect(post).toHaveProperty('tags');
    expect(post).toHaveProperty('reactions');
  });

  test('GET /posts with pagination - Should return limited results', async () => {
    const limit = 5;
    const skip = 0;
    const response = await apiClient.get(`/posts?limit=${limit}&skip=${skip}`);

    expect(response.status()).toBe(200);

    const data = await response.json();
    console.log(`Fetched ${data.posts.length} posts with limit=${limit}`);

    expect(data.posts.length).toBeLessThanOrEqual(limit);
    expect(data.limit).toBe(limit);
    expect(data.skip).toBe(skip);
  });

  test('POST /posts/add - Should create new post', async () => {
    const newPost = {
      title: 'Demo Test Post',
      body: 'This is a test post created during demo',
      userId: 1,
      tags: ['test', 'demo']
    };

    const response = await apiClient.post('/posts/add', {
      data: newPost
    });

    expect(response.status()).toBe(201);

    const createdPost = await response.json();
    console.log('Created post:', JSON.stringify(createdPost, null, 2));

    expect(createdPost).toHaveProperty('id');
    expect(createdPost.title).toBe(newPost.title);
    expect(createdPost.body).toBe(newPost.body);
    expect(createdPost.userId).toBe(newPost.userId);
  });

  test('PUT /posts/:id - Should update post', async () => {
    const postId = 1;
    const updatedPost = {
      title: 'Updated Demo Post',
      body: 'This post has been updated'
    };

    const response = await apiClient.put(`/posts/${postId}`, {
      data: updatedPost
    });

    expect(response.status()).toBe(200);

    const result = await response.json();
    console.log('Updated post:', JSON.stringify(result, null, 2));

    expect(result.id).toBe(postId);
    expect(result.title).toBe(updatedPost.title);
    expect(result.body).toBe(updatedPost.body);
  });

  test('DELETE /posts/:id - Should delete post', async () => {
    const postId = 1;
    const response = await apiClient.delete(`/posts/${postId}`);

    expect(response.status()).toBe(200);

    const result = await response.json();
    console.log('Delete result:', JSON.stringify(result, null, 2));

    expect(result).toHaveProperty('isDeleted');
    expect(result.isDeleted).toBe(true);
  });

  test('GET /posts/search - Should search posts', async () => {
    const searchQuery = 'love';
    const response = await apiClient.get(`/posts/search?q=${searchQuery}`);

    expect(response.status()).toBe(200);

    const data = await response.json();
    console.log(`Found ${data.posts.length} posts matching "${searchQuery}"`);

    expect(data).toHaveProperty('posts');
    expect(Array.isArray(data.posts)).toBeTruthy();
  });

  test('GET /comments - Should return list of comments', async () => {
    const response = await apiClient.get('/comments');

    expect(response.status()).toBe(200);

    const data = await response.json();
    console.log('Comments response sample:', JSON.stringify(data.comments?.slice(0, 2), null, 2));

    expect(data).toHaveProperty('comments');
    expect(Array.isArray(data.comments)).toBeTruthy();
    expect(data.comments.length).toBeGreaterThan(0);
  });

  test('GET /comments/post/:id - Should return comments for specific post', async () => {
    const postId = 1;
    const response = await apiClient.get(`/comments/post/${postId}`);

    expect(response.status()).toBe(200);

    const data = await response.json();
    console.log(`Post ${postId} has ${data.comments.length} comments`);

    expect(data).toHaveProperty('comments');
    expect(Array.isArray(data.comments)).toBeTruthy();

    // Verify all comments belong to the post
    if (data.comments.length > 0) {
      data.comments.forEach((comment: any) => {
        expect(comment.postId).toBe(postId);
      });
    }
  });

  test('GET /products - Should return products (DummyJSON specific)', async () => {
    const response = await apiClient.get('/products');

    expect(response.status()).toBe(200);

    const data = await response.json();
    console.log('Products response sample:', JSON.stringify(data.products?.slice(0, 1), null, 2));

    expect(data).toHaveProperty('products');
    expect(Array.isArray(data.products)).toBeTruthy();
    expect(data.products.length).toBeGreaterThan(0);

    const firstProduct = data.products[0];
    expect(firstProduct).toHaveProperty('id');
    expect(firstProduct).toHaveProperty('title');
    expect(firstProduct).toHaveProperty('price');
    expect(firstProduct).toHaveProperty('brand');
    expect(firstProduct).toHaveProperty('category');
  });

  test('Response time - Should respond quickly', async () => {
    const startTime = Date.now();
    await apiClient.get('/users/1');
    const duration = Date.now() - startTime;

    console.log(`API responded in ${duration}ms`);
    expect(duration).toBeLessThan(5000); // Should respond within 5 seconds
  });
});

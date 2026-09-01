import request from 'supertest';
import { createApp } from '../src/app';
import { connectDatabase, disconnectDatabase } from '../src/config/database';
import { User } from '../src/models/User';
import { Post } from '../src/models/Post';

const app = createApp();
let authToken: string;
let createdPostId: string;

beforeAll(async () => {
  await connectDatabase();
  await User.deleteMany({ email: 'test.postauthor@apnose.in' });

  // Register a test user to obtain auth token
  const res = await request(app)
    .post('/api/v1/auth/register')
    .send({
      name: 'पोस्ट लेखक',
      email: 'test.postauthor@apnose.in',
      password: 'Pass@1234',
      dateOfBirth: '1970-01-01',
    });

  authToken = res.body.data?.accessToken;
});

afterAll(async () => {
  await User.deleteMany({ email: 'test.postauthor@apnose.in' });
  if (createdPostId) {
    await Post.findByIdAndDelete(createdPostId);
  }
  await disconnectDatabase();
});

describe('Posts & Feed API', () => {
  it('should create a new post with visibility', async () => {
    const res = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        content: 'यह एक परीक्षण पोस्ट है (Test Post for ApnoSe). 🌸',
        visibility: 'public',
        location: 'नई दिल्ली',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.content).toContain('परीक्षण');
    createdPostId = res.body.data._id;
  });

  it('should fetch feed for authenticated user', async () => {
    const res = await request(app)
      .get('/api/v1/posts/feed')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should react to a post (Like)', async () => {
    const res = await request(app)
      .post(`/api/v1/posts/${createdPostId}/like`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ reaction: 'love' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isLiked).toBe(true);
  });
});

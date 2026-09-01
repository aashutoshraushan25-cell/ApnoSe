import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../src/app';
import { connectDatabase, disconnectDatabase } from '../src/config/database';
import { User } from '../src/models/User';

const app = createApp();

beforeAll(async () => {
  await connectDatabase();
  await User.deleteMany({ email: /test.*@apnose\.in/ });
});

afterAll(async () => {
  await User.deleteMany({ email: /test.*@apnose\.in/ });
  await disconnectDatabase();
});

describe('Authentication & 40+ DOB Restrictions API', () => {
  it('should reject registration if age is below 40 years', async () => {
    const underAgePayload = {
      name: 'Young User',
      email: 'test.young@apnose.in',
      password: 'Pass@1234',
      dateOfBirth: '2005-01-01', // Age ~21
    };

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(underAgePayload);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('AGE_RESTRICTION_FAILED');
  });

  it('should register a senior user aged 40+ successfully', async () => {
    const validPayload = {
      name: 'वरिष्ठ नागरिक',
      email: 'test.senior@apnose.in',
      phone: '+91 99999 88888',
      password: 'Pass@1234',
      dateOfBirth: '1975-05-15', // Age ~51
      location: 'नई दिल्ली',
      language: 'hi',
    };

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.age).toBeGreaterThanOrEqual(40);
  });

  it('should log in successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: 'test.senior@apnose.in',
        password: 'Pass@1234',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('should fail login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: 'test.senior@apnose.in',
        password: 'wrong_password',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should protect /api/v1/auth/me against missing token', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

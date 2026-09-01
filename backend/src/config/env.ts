import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/apnose'),
  JWT_ACCESS_SECRET: z.string().default('apnose_super_secure_jwt_access_secret_key_2026_x9281!'),
  JWT_REFRESH_SECRET: z.string().default('apnose_super_secure_jwt_refresh_secret_key_2026_k1928#'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  UPLOAD_PROVIDER: z.string().default('local'),
  UPLOAD_DIR: z.string().default('uploads'),
  UPLOAD_MAX_FILE_SIZE_MB: z.string().default('10'),
  OTP_PROVIDER: z.string().default('mock'),
  OTP_API_KEY: z.string().default('mock_otp_key_2026'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

export const env = {
  ...parsedEnv.data,
  PORT: parseInt(parsedEnv.data.PORT, 10),
  UPLOAD_MAX_FILE_SIZE_MB: parseInt(parsedEnv.data.UPLOAD_MAX_FILE_SIZE_MB, 10),
};

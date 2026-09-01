import { Router } from 'express';
import { z } from 'zod';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'नाम कम से कम 2 अक्षरों का होना चाहिए').max(70),
    email: z.string().email('मान्य ईमेल दर्ज करें').optional().or(z.literal('')),
    phone: z.string().min(10, 'मान्य मोबाइल नंबर दर्ज करें').optional().or(z.literal('')),
    password: z
      .string()
      .min(8, 'पासवर्ड कम से कम 8 अक्षरों का होना चाहिए')
      .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])/, 'पासवर्ड में अक्षर, अंक और विशेष चिह्न (@, #, $, आदि) का मिश्रण अनिवार्य है'),
    dateOfBirth: z.string({ required_error: 'जन्म तिथि आवश्यक है' }),
    gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
    location: z.string().optional(),
    language: z.enum(['hi', 'en', 'bho', 'mai', 'bn', 'mr']).optional(),
    profilePhoto: z.string().optional(),
    encryptionEnabled: z.boolean().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    identifier: z.string({ required_error: 'मोबाइल नंबर या ईमेल दर्ज करें' }).min(1),
    password: z.string({ required_error: 'पासवर्ड दर्ज करें' }).min(1),
  }),
});

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string({ required_error: 'रिफ्रेश टोकन आवश्यक है' }),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    identifier: z.string({ required_error: 'मोबाइल नंबर या ईमेल दर्ज करें' }),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    identifier: z.string({ required_error: 'मोबाइल नंबर या ईमेल दर्ज करें' }),
    otp: z.string({ required_error: 'OTP कोड दर्ज करें' }),
    newPassword: z
      .string()
      .min(8, 'नया पासवर्ड कम से कम 8 अक्षरों का होना चाहिए')
      .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])/, 'पासवर्ड में अक्षर, अंक और विशेष चिह्न (@, #, $, आदि) का मिश्रण अनिवार्य है'),
  }),
});

router.post('/register', authLimiter, validate(registerSchema), AuthController.register);
router.post('/login', authLimiter, validate(loginSchema), AuthController.login);
router.post('/refresh', validate(refreshSchema), AuthController.refresh);
router.post('/logout', authenticate, AuthController.logout);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), AuthController.resetPassword);
router.get('/me', authenticate, AuthController.getMe);

export default router;

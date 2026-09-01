import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/response';

// General API Rate Limiter: 100 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'बहुत अधिक अनुरोध (Too many requests). कृपया 15 मिनट बाद पुनः प्रयास करें।',
      429,
      'RATE_LIMIT_EXCEEDED'
    );
  },
});

// Strict Auth Limiter (Login / Register / OTP): 10 requests per 15 minutes per IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'सुरक्षा के लिए प्रमाणीकरण सीमित किया गया है। कृपया कुछ समय बाद पुनः प्रयास करें।',
      429,
      'AUTH_RATE_LIMIT_EXCEEDED'
    );
  },
});

// OTP Request Limiter: 3 requests per 5 minutes
export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'OTP अनुरोध सीमा पार हो गई है। कृपया 5 मिनट बाद प्रयास करें।',
      429,
      'OTP_RATE_LIMIT_EXCEEDED'
    );
  },
});

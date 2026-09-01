import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { User } from '../models/User';

export class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  public static async register(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const result = await AuthService.register(req.body);
      return sendSuccess(res, result, 'खाता सफलतापूर्वक बनाया गया। Apno Se में आपका स्वागत है! 🌸', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/login
   */
  public static async login(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { identifier, password } = req.body;
      const result = await AuthService.login(identifier, password);
      return sendSuccess(res, result, 'सफलतापूर्वक प्रवेश किया गया।');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/refresh
   */
  public static async refresh(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return sendError(res, 'रिफ्रेश टोकन आवश्यक है।', 400, 'REFRESH_TOKEN_REQUIRED');
      }
      const result = await AuthService.refreshToken(refreshToken);
      return sendSuccess(res, result, 'टोकन नवीनीकृत किया गया।');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/logout
   */
  public static async logout(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      if (req.user?.userId) {
        await AuthService.logout(req.user.userId);
      }
      return sendSuccess(res, null, 'सफलतापूर्वक लॉग आउट किया गया।');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/auth/me
   */
  public static async getMe(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const user = await User.findById(req.user?.userId);
      if (!user) {
        return sendError(res, 'उपयोगकर्ता नहीं मिला।', 404, 'NOT_FOUND');
      }
      return sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/forgot-password
   */
  public static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { identifier } = req.body;
      // In production we would send SMS OTP or Email link.
      return sendSuccess(
        res,
        { messageSent: true, otpDemo: '1234' },
        'पासवर्ड रीसेट कोड आपके पंजीकृत नंबर / ईमेल पर भेजा गया है।'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/reset-password
   */
  public static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { identifier, otp, newPassword } = req.body;
      // Validate OTP demo (1234 or real OTP service)
      if (otp !== '1234') {
        return sendError(res, 'अमान्य OTP कोड।', 400, 'INVALID_OTP');
      }

      const isEmail = identifier.includes('@');
      const query = isEmail ? { email: identifier.toLowerCase().trim() } : { phone: identifier.trim() };
      const user = await User.findOne(query);

      if (!user) {
        return sendError(res, 'खाता नहीं मिला।', 404, 'NOT_FOUND');
      }

      const { hashPassword } = await import('../utils/password');
      user.passwordHash = await hashPassword(newPassword);
      await user.save();

      return sendSuccess(res, null, 'पासवर्ड सफलतापूर्वक बदल दिया गया है।');
    } catch (error) {
      next(error);
    }
  }
}

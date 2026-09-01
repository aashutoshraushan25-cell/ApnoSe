import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { BlockedUser } from '../models/BlockedUser';
import { sendSuccess, sendError } from '../utils/response';
import { getPaginationOptions, buildPaginationMetadata } from '../utils/pagination';

export class UserController {
  /**
   * GET /api/v1/users/me
   */
  public static async getProfile(req: Request, res: Response, next: NextFunction): Promise<any> {
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
   * PATCH /api/v1/users/me
   */
  public static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const allowedFields = [
        'name',
        'bio',
        'location',
        'language',
        'profilePhoto',
        'coverPhoto',
        'gender',
        'privacySettings',
        'encryptionEnabled',
      ];

      const updates: any = {};
      Object.keys(req.body).forEach((key) => {
        if (allowedFields.includes(key)) {
          updates[key] = req.body[key];
        }
      });

      const updatedUser = await User.findByIdAndUpdate(
        req.user?.userId,
        { $set: updates },
        { new: true, runValidators: true }
      );

      return sendSuccess(res, updatedUser, 'प्रोफ़ाइल सफलतापूर्वक अपडेट की गई।');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/users/:id
   */
  public static async getUserById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select('-refreshToken');
      if (!user) {
        return sendError(res, 'उपयोगकर्ता नहीं मिला।', 404, 'NOT_FOUND');
      }
      return sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/users/search?q=
   */
  public static async searchUsers(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { q, page, limit } = req.query;
      const { page: p, limit: l, skip } = getPaginationOptions(page, limit);

      if (!q || typeof q !== 'string' || q.trim().length === 0) {
        return sendSuccess(res, [], undefined, 200, buildPaginationMetadata(0, p, l));
      }

      const regex = new RegExp(q.trim(), 'i');
      const filter = {
        isActive: true,
        isBlocked: false,
        $or: [{ name: regex }, { location: regex }],
      };

      const total = await User.countDocuments(filter);
      const users = await User.find(filter)
        .select('name profilePhoto age location bio language isVerified')
        .skip(skip)
        .limit(l);

      return sendSuccess(res, users, undefined, 200, buildPaginationMetadata(total, p, l));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/users/:id/block
   */
  public static async blockUser(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const targetUserId = req.params.id;
      const currentUserId = req.user?.userId;

      if (targetUserId === currentUserId) {
        return sendError(res, 'आप स्वयं को ब्लॉक नहीं कर सकते।', 400, 'CANNOT_BLOCK_SELF');
      }

      await BlockedUser.findOneAndUpdate(
        {
          userId: new mongoose.Types.ObjectId(currentUserId),
          blockedUserId: new mongoose.Types.ObjectId(targetUserId),
        },
        {
          userId: new mongoose.Types.ObjectId(currentUserId),
          blockedUserId: new mongoose.Types.ObjectId(targetUserId),
          reason: req.body.reason || 'Blocked by user',
        },
        { upsert: true, new: true }
      );

      return sendSuccess(res, null, 'उपयोगकर्ता को सफलतापूर्वक ब्लॉक किया गया।');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/users/:id/block
   */
  public static async unblockUser(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const targetUserId = req.params.id;
      const currentUserId = req.user?.userId;

      await BlockedUser.findOneAndDelete({
        userId: new mongoose.Types.ObjectId(currentUserId),
        blockedUserId: new mongoose.Types.ObjectId(targetUserId),
      });

      return sendSuccess(res, null, 'उपयोगकर्ता को अनब्लॉक किया गया।');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/users/blocked
   */
  public static async getBlockedUsers(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const currentUserId = req.user?.userId;
      const blocked = await BlockedUser.find({
        userId: new mongoose.Types.ObjectId(currentUserId),
      }).populate('blockedUserId', 'name profilePhoto age location');

      return sendSuccess(res, blocked);
    } catch (error) {
      next(error);
    }
  }
}

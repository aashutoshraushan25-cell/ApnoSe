import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Friendship } from '../models/Friendship';
import { User } from '../models/User';
import { BlockedUser } from '../models/BlockedUser';
import { NotificationService } from '../services/notification.service';
import { sendSuccess, sendError } from '../utils/response';
import { getPaginationOptions, buildPaginationMetadata } from '../utils/pagination';

export class FriendController {
  /**
   * POST /api/v1/friends/:userId/request
   */
  public static async sendFriendRequest(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const recipientId = req.params.userId;
      const requesterId = req.user?.userId!;

      if (recipientId === requesterId) {
        return sendError(res, 'आप स्वयं को मित्र अनुरोध नहीं भेज सकते।', 400, 'SELF_REQUEST');
      }

      const recObjId = new mongoose.Types.ObjectId(recipientId);
      const reqObjId = new mongoose.Types.ObjectId(requesterId);

      // Check if blocked
      const isBlocked = await BlockedUser.findOne({
        $or: [
          { userId: reqObjId, blockedUserId: recObjId },
          { userId: recObjId, blockedUserId: reqObjId },
        ],
      });
      if (isBlocked) {
        return sendError(res, 'यह क्रिया संभव नहीं है।', 403, 'BLOCKED');
      }

      // Check existing friendship/request
      const existing = await Friendship.findOne({
        $or: [
          { requesterId: reqObjId, recipientId: recObjId },
          { requesterId: recObjId, recipientId: reqObjId },
        ],
      });

      if (existing) {
        if (existing.status === 'accepted') {
          return sendError(res, 'आप पहले से मित्र हैं।', 400, 'ALREADY_FRIENDS');
        }
        if (existing.status === 'pending') {
          return sendError(res, 'अनुरोध पहले से लंबित है।', 400, 'REQUEST_PENDING');
        }
        // If rejected, update to pending
        existing.requesterId = reqObjId;
        existing.recipientId = recObjId;
        existing.status = 'pending';
        await existing.save();
      } else {
        await Friendship.create({
          requesterId: reqObjId,
          recipientId: recObjId,
          status: 'pending',
        });
      }

      // Notify recipient
      await NotificationService.createNotification({
        recipientId: recObjId,
        senderId: reqObjId,
        type: 'friend_request',
        title: 'नया मित्रता अनुरोध (Friend Request)',
        body: 'ने आपको मित्र बनाने का अनुरोध भेजा है। 🤝',
        targetId: reqObjId,
        targetModel: 'User',
      });

      return sendSuccess(res, null, 'मित्रता अनुरोध सफलतापूर्वक भेजा गया।');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/friends/:userId/accept
   */
  public static async acceptFriendRequest(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const requesterId = req.params.userId;
      const recipientId = req.user?.userId!;

      const friendship = await Friendship.findOne({
        requesterId: new mongoose.Types.ObjectId(requesterId),
        recipientId: new mongoose.Types.ObjectId(recipientId),
        status: 'pending',
      });

      if (!friendship) {
        return sendError(res, 'लंबित मित्रता अनुरोध नहीं मिला।', 404, 'NOT_FOUND');
      }

      friendship.status = 'accepted';
      await friendship.save();

      // Notify requester
      await NotificationService.createNotification({
        recipientId: new mongoose.Types.ObjectId(requesterId),
        senderId: new mongoose.Types.ObjectId(recipientId),
        type: 'friend_accepted',
        title: 'अनुरोध स्वीकार हुआ! 🎉',
        body: 'ने आपका मित्रता अनुरोध स्वीकार कर लिया है।',
        targetId: new mongoose.Types.ObjectId(recipientId),
        targetModel: 'User',
      });

      return sendSuccess(res, null, 'मित्रता अनुरोध स्वीकार किया गया।');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/friends/:userId/reject
   */
  public static async rejectFriendRequest(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const requesterId = req.params.userId;
      const recipientId = req.user?.userId!;

      await Friendship.findOneAndDelete({
        requesterId: new mongoose.Types.ObjectId(requesterId),
        recipientId: new mongoose.Types.ObjectId(recipientId),
        status: 'pending',
      });

      return sendSuccess(res, null, 'मित्रता अनुरोध अस्वीकार किया गया।');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/friends/:userId
   */
  public static async removeFriend(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const friendId = req.params.userId;
      const userId = req.user?.userId!;

      const userObjId = new mongoose.Types.ObjectId(userId);
      const friendObjId = new mongoose.Types.ObjectId(friendId);

      await Friendship.findOneAndDelete({
        $or: [
          { requesterId: userObjId, recipientId: friendObjId },
          { requesterId: friendObjId, recipientId: userObjId },
        ],
      });

      return sendSuccess(res, null, 'मित्रता सूची से हटाया गया।');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/friends
   */
  public static async getFriends(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId!;
      const userObjId = new mongoose.Types.ObjectId(userId);
      const { page, limit } = req.query;
      const { page: p, limit: l, skip } = getPaginationOptions(page, limit);

      const filter: any = {
        status: 'accepted',
        $or: [{ requesterId: userObjId }, { recipientId: userObjId }],
      };

      const total = await Friendship.countDocuments(filter);
      const friendships = await Friendship.find(filter)
        .skip(skip)
        .limit(l)
        .populate('requesterId', 'name profilePhoto age location bio language lastSeen')
        .populate('recipientId', 'name profilePhoto age location bio language lastSeen')
        .lean();

      const friends = friendships.map((f: any) => {
        return f.requesterId._id.toString() === userId ? f.recipientId : f.requesterId;
      });

      return sendSuccess(res, friends, undefined, 200, buildPaginationMetadata(total, p, l));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/friends/requests
   */
  public static async getFriendRequests(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId!;
      const requests = await Friendship.find({
        recipientId: new mongoose.Types.ObjectId(userId),
        status: 'pending',
      })
        .sort({ createdAt: -1 })
        .populate('requesterId', 'name profilePhoto age location bio language')
        .lean();

      return sendSuccess(res, requests);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/friends/suggestions
   */
  public static async getSuggestions(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId!;
      const userObjId = new mongoose.Types.ObjectId(userId);

      // Find all existing friendship relations
      const existing = await Friendship.find({
        $or: [{ requesterId: userObjId }, { recipientId: userObjId }],
      });

      const excludeIds = new Set<string>();
      excludeIds.add(userId);
      existing.forEach((f) => {
        excludeIds.add(f.requesterId.toString());
        excludeIds.add(f.recipientId.toString());
      });

      const suggestions = await User.find({
        _id: { $nin: Array.from(excludeIds).map((id) => new mongoose.Types.ObjectId(id)) },
        isActive: true,
        isBlocked: false,
      })
        .select('name profilePhoto age location bio language isVerified')
        .limit(10)
        .lean();

      return sendSuccess(res, suggestions);
    } catch (error) {
      next(error);
    }
  }
}

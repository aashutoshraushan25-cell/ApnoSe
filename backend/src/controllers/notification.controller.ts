import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Notification } from '../models/Notification';
import { sendSuccess, sendError } from '../utils/response';
import { getPaginationOptions, buildPaginationMetadata } from '../utils/pagination';

export class NotificationController {
  /**
   * GET /api/v1/notifications
   */
  public static async getNotifications(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId!;
      const { page, limit } = req.query;
      const { page: p, limit: l, skip } = getPaginationOptions(page, limit);

      const filter = { recipientId: new mongoose.Types.ObjectId(userId) };
      const total = await Notification.countDocuments(filter);
      const unreadCount = await Notification.countDocuments({ ...filter, isRead: false });

      const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(l)
        .populate('senderId', 'name profilePhoto age location')
        .lean();

      return sendSuccess(
        res,
        { notifications, unreadCount },
        undefined,
        200,
        buildPaginationMetadata(total, p, l)
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/notifications/:id/read
   */
  public static async markAsRead(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId!;

      const notif = await Notification.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id), recipientId: new mongoose.Types.ObjectId(userId) },
        { $set: { isRead: true } },
        { new: true }
      );

      if (!notif) {
        return sendError(res, 'सूचना नहीं मिली।', 404, 'NOT_FOUND');
      }

      return sendSuccess(res, notif, 'सूचना पढ़ी गई।');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/notifications/read-all
   */
  public static async markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId!;

      await Notification.updateMany(
        { recipientId: new mongoose.Types.ObjectId(userId), isRead: false },
        { $set: { isRead: true } }
      );

      return sendSuccess(res, null, 'सभी सूचनाएं पढ़ी हुई चिह्नित की गईं।');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/notifications/:id
   */
  public static async deleteNotification(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId!;

      await Notification.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(id),
        recipientId: new mongoose.Types.ObjectId(userId),
      });

      return sendSuccess(res, null, 'सूचना हटा दी गई।');
    } catch (error) {
      next(error);
    }
  }
}

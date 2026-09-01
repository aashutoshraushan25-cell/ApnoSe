import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Post } from '../models/Post';
import { Community } from '../models/Community';
import { sendSuccess } from '../utils/response';

export class SearchController {
  /**
   * GET /api/v1/search?q=
   */
  public static async searchAll(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string' || q.trim().length === 0) {
        return sendSuccess(res, { users: [], posts: [], communities: [] });
      }

      const regex = new RegExp(q.trim(), 'i');

      const [users, posts, communities] = await Promise.all([
        // Search users
        User.find({
          isActive: true,
          isBlocked: false,
          'privacySettings.profileVisibility': { $ne: 'nobody' },
          $or: [{ name: regex }, { location: regex }, { bio: regex }],
        })
          .select('name profilePhoto age location bio language isVerified')
          .limit(8)
          .lean(),

        // Search public posts
        Post.find({
          visibility: 'public',
          content: regex,
        })
          .populate('authorId', 'name profilePhoto age location')
          .sort({ createdAt: -1 })
          .limit(8)
          .lean(),

        // Search communities
        Community.find({
          privacy: 'public',
          $or: [{ name: regex }, { description: regex }, { category: regex }],
        })
          .limit(8)
          .lean(),
      ]);

      return sendSuccess(res, { users, posts, communities });
    } catch (error) {
      next(error);
    }
  }
}

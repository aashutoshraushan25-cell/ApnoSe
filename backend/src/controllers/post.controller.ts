import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Post } from '../models/Post';
import { Like, ReactionType } from '../models/Like';
import { PostService } from '../services/post.service';
import { NotificationService } from '../services/notification.service';
import { sendSuccess, sendError } from '../utils/response';
import { AppError } from '../middleware/error.middleware';

export class PostController {
  /**
   * POST /api/v1/posts
   */
  public static async createPost(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { content, media, mediaType, visibility, location, feeling, isEncrypted, encryptedData } = req.body;
      const authorId = req.user?.userId;

      if (!content && (!media || media.length === 0) && !encryptedData) {
        return sendError(res, 'पोस्ट में संदेश या फ़ोटो होना आवश्यक है।', 400, 'EMPTY_POST');
      }

      const post = new Post({
        authorId: new mongoose.Types.ObjectId(authorId),
        content: content || '',
        media: media || [],
        mediaType: mediaType || 'text',
        visibility: visibility || 'friends',
        location,
        feeling,
        isEncrypted: isEncrypted || false,
        encryptedData,
      });

      await post.save();
      await post.populate('authorId', 'name profilePhoto age location');

      return sendSuccess(res, post, 'आपकी पोस्ट सफलतापूर्वक साझा की गई! 🌸', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/posts/feed
   */
  public static async getFeed(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId!;
      const { page, limit } = req.query;
      const result = await PostService.getFeed(userId, page, limit);

      return sendSuccess(res, result.posts, undefined, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/posts/:id
   */
  public static async getPostById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const post = await Post.findById(id).populate('authorId', 'name profilePhoto age location');
      if (!post) {
        return sendError(res, 'पोस्ट नहीं मिली।', 404, 'NOT_FOUND');
      }
      return sendSuccess(res, post);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/posts/:id
   */
  public static async updatePost(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const { content, visibility, location, feeling } = req.body;

      const post = await Post.findById(id);
      if (!post) {
        return sendError(res, 'पोस्ट नहीं मिली।', 404, 'NOT_FOUND');
      }

      // Check author authorization
      if (post.authorId.toString() !== userId && req.user?.role !== 'admin') {
        return sendError(res, 'आप केवल अपनी पोस्ट संपादित कर सकते हैं।', 403, 'FORBIDDEN');
      }

      if (content !== undefined) post.content = content;
      if (visibility !== undefined) post.visibility = visibility;
      if (location !== undefined) post.location = location;
      if (feeling !== undefined) post.feeling = feeling;

      await post.save();
      await post.populate('authorId', 'name profilePhoto age location');

      return sendSuccess(res, post, 'पोस्ट सफलतापूर्वक अपडेट की गई।');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/posts/:id
   */
  public static async deletePost(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const post = await Post.findById(id);
      if (!post) {
        return sendError(res, 'पोस्ट नहीं मिली।', 404, 'NOT_FOUND');
      }

      if (post.authorId.toString() !== userId && req.user?.role !== 'admin') {
        return sendError(res, 'आप केवल अपनी पोस्ट हटा सकते हैं।', 403, 'FORBIDDEN');
      }

      await Post.findByIdAndDelete(id);
      await Like.deleteMany({ targetType: 'post', targetId: new mongoose.Types.ObjectId(id) });

      return sendSuccess(res, null, 'पोस्ट हटा दी गई।');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/posts/:id/like
   */
  public static async reactToPost(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId!;
      const reaction: ReactionType = req.body.reaction || 'like';

      const post = await Post.findById(id);
      if (!post) {
        return sendError(res, 'पोस्ट नहीं मिली।', 404, 'NOT_FOUND');
      }

      const existingLike = await Like.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        targetType: 'post',
        targetId: new mongoose.Types.ObjectId(id),
      });

      if (existingLike) {
        // Update reaction
        existingLike.reaction = reaction;
        await existingLike.save();
      } else {
        // Create new like
        await Like.create({
          userId: new mongoose.Types.ObjectId(userId),
          targetType: 'post',
          targetId: new mongoose.Types.ObjectId(id),
          reaction,
        });

        // Increment likes count
        await Post.findByIdAndUpdate(id, { $inc: { likesCount: 1 } });

        // Notify author
        await NotificationService.createNotification({
          recipientId: post.authorId,
          senderId: userId,
          type: 'like',
          title: 'नया स्नेह (Reaction)',
          body: `ने आपकी पोस्ट को पसंद किया ❤️`,
          targetId: post._id,
          targetModel: 'Post',
        });
      }

      return sendSuccess(res, { reaction, isLiked: true }, 'प्रतिक्रिया दर्ज की गई।');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/posts/:id/like
   */
  public static async removeReaction(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const deleted = await Like.findOneAndDelete({
        userId: new mongoose.Types.ObjectId(userId),
        targetType: 'post',
        targetId: new mongoose.Types.ObjectId(id),
      });

      if (deleted) {
        await Post.findByIdAndUpdate(id, { $inc: { likesCount: -1 } });
      }

      return sendSuccess(res, { isLiked: false }, 'प्रतिक्रिया हटा दी गई।');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/posts/:id/share
   */
  public static async sharePost(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const post = await Post.findByIdAndUpdate(id, { $inc: { sharesCount: 1 } }, { new: true });
      if (!post) {
        return sendError(res, 'पोस्ट नहीं मिली।', 404, 'NOT_FOUND');
      }
      return sendSuccess(res, { sharesCount: post.sharesCount }, 'पोस्ट साझा की गई।');
    } catch (error) {
      next(error);
    }
  }
}

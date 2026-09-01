import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Comment } from '../models/Comment';
import { Post } from '../models/Post';
import { NotificationService } from '../services/notification.service';
import { sendSuccess, sendError } from '../utils/response';
import { getPaginationOptions, buildPaginationMetadata } from '../utils/pagination';

export class CommentController {
  /**
   * POST /api/v1/posts/:postId/comments
   */
  public static async createComment(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { postId } = req.params;
      const { content, parentId } = req.body;
      const authorId = req.user?.userId!;

      if (!content || !content.trim()) {
        return sendError(res, 'टिप्पणी खाली नहीं हो सकती।', 400, 'EMPTY_COMMENT');
      }

      const post = await Post.findById(postId);
      if (!post) {
        return sendError(res, 'पोस्ट नहीं मिली।', 404, 'NOT_FOUND');
      }

      const comment = new Comment({
        postId: new mongoose.Types.ObjectId(postId),
        authorId: new mongoose.Types.ObjectId(authorId),
        parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null,
        content: content.trim(),
      });

      await comment.save();
      await comment.populate('authorId', 'name profilePhoto age location');

      // Increment comments count on post
      await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

      // Notify post author
      await NotificationService.createNotification({
        recipientId: post.authorId,
        senderId: authorId,
        type: 'comment',
        title: 'नई टिप्पणी (Comment)',
        body: `ने आपकी पोस्ट पर टिप्पणी की: "${content.slice(0, 40)}..."`,
        targetId: post._id,
        targetModel: 'Post',
      });

      return sendSuccess(res, comment, 'टिप्पणी जोड़ी गई।', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/posts/:postId/comments
   */
  public static async getComments(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { postId } = req.params;
      const { page, limit } = req.query;
      const { page: p, limit: l, skip } = getPaginationOptions(page, limit);

      const filter = { postId: new mongoose.Types.ObjectId(postId), parentId: null };
      const total = await Comment.countDocuments(filter);

      const comments = await Comment.find(filter)
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(l)
        .populate('authorId', 'name profilePhoto age location')
        .lean();

      return sendSuccess(res, comments, undefined, 200, buildPaginationMetadata(total, p, l));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/comments/:id
   */
  public static async updateComment(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user?.userId;

      const comment = await Comment.findById(id);
      if (!comment) {
        return sendError(res, 'टिप्पणी नहीं मिली।', 404, 'NOT_FOUND');
      }

      if (comment.authorId.toString() !== userId && req.user?.role !== 'admin') {
        return sendError(res, 'आप केवल अपनी टिप्पणी संपादित कर सकते हैं।', 403, 'FORBIDDEN');
      }

      comment.content = content.trim();
      await comment.save();
      await comment.populate('authorId', 'name profilePhoto age location');

      return sendSuccess(res, comment, 'टिप्पणी अपडेट की गई।');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/comments/:id
   */
  public static async deleteComment(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const comment = await Comment.findById(id);
      if (!comment) {
        return sendError(res, 'टिप्पणी नहीं मिली।', 404, 'NOT_FOUND');
      }

      if (comment.authorId.toString() !== userId && req.user?.role !== 'admin') {
        return sendError(res, 'आप केवल अपनी टिप्पणी हटा सकते हैं।', 403, 'FORBIDDEN');
      }

      const postId = comment.postId;
      await Comment.findByIdAndDelete(id);
      // Decrement comments count on post
      await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: -1 } });

      return sendSuccess(res, null, 'टिप्पणी हटा दी गई।');
    } catch (error) {
      next(error);
    }
  }
}

import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';
import { MessageService } from '../services/message.service';
import { sendSuccess, sendError } from '../utils/response';
import { getPaginationOptions, buildPaginationMetadata } from '../utils/pagination';

export class MessageController {
  /**
   * GET /api/v1/conversations
   */
  public static async getConversations(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId!;
      const userObjId = new mongoose.Types.ObjectId(userId);

      const conversations = await Conversation.find({
        participants: userObjId,
      })
        .sort({ updatedAt: -1 })
        .populate('participants', 'name profilePhoto age location lastSeen')
        .populate('lastMessage.senderId', 'name')
        .lean();

      const formatted = conversations.map((c: any) => {
        const otherParticipant = c.participants.find((p: any) => p._id.toString() !== userId);
        return {
          ...c,
          otherParticipant,
          unreadCount: c.unreadCounts ? c.unreadCounts[userId] || 0 : 0,
        };
      });

      return sendSuccess(res, formatted);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/conversations
   */
  public static async createOrGetConversation(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const currentUserId = req.user?.userId!;
      const { recipientId } = req.body;

      if (!recipientId) {
        return sendError(res, 'प्राप्तकर्ता (Recipient ID) आवश्यक है।', 400, 'RECIPIENT_REQUIRED');
      }

      const conversation = await MessageService.getOrCreateConversation(currentUserId, recipientId);
      return sendSuccess(res, conversation);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/conversations/:id/messages
   */
  public static async getMessages(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId!;
      const { page, limit } = req.query;
      const { page: p, limit: l, skip } = getPaginationOptions(page, limit, 30, 100);

      const conv = await Conversation.findById(id);
      if (!conv) {
        return sendError(res, 'बातचीत नहीं मिली।', 404, 'NOT_FOUND');
      }

      const isParticipant = conv.participants.some((p) => p.toString() === userId);
      if (!isParticipant) {
        return sendError(res, 'अनधिकृत पहुंच (Unauthorized).', 403, 'FORBIDDEN');
      }

      const filter = {
        conversationId: new mongoose.Types.ObjectId(id),
        deletedFor: { $ne: new mongoose.Types.ObjectId(userId) },
      };

      const total = await Message.countDocuments(filter);
      const messages = await Message.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(l)
        .populate('senderId', 'name profilePhoto')
        .lean();

      // Return chronological order for UI
      messages.reverse();

      return sendSuccess(res, messages, undefined, 200, buildPaginationMetadata(total, p, l));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/conversations/:id/messages
   */
  public static async sendMessage(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const senderId = req.user?.userId!;
      const { content, type, mediaUrl, isEncrypted } = req.body;

      if (!content && !mediaUrl) {
        return sendError(res, 'संदेश या मीडिया आवश्यक है।', 400, 'EMPTY_MESSAGE');
      }

      const result = await MessageService.sendMessage(
        id,
        senderId,
        content || '',
        type || 'text',
        mediaUrl,
        isEncrypted || false
      );

      return sendSuccess(res, result.message, result.safetyWarning, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/conversations/:id/read
   */
  public static async markRead(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId!;
      const userObjId = new mongoose.Types.ObjectId(userId);

      const conv = await Conversation.findById(id);
      if (conv) {
        conv.unreadCounts.set(userId, 0);
        await conv.save();

        // Add user to readBy array of messages
        await Message.updateMany(
          { conversationId: new mongoose.Types.ObjectId(id), readBy: { $ne: userObjId } },
          { $addToSet: { readBy: userObjId } }
        );
      }

      return sendSuccess(res, null, 'संदेश पढ़े हुए चिह्नित किए गए।');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/messages/:id
   */
  public static async deleteMessage(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId!;

      await Message.findByIdAndUpdate(id, {
        $addToSet: { deletedFor: new mongoose.Types.ObjectId(userId) },
      });

      return sendSuccess(res, null, 'संदेश आपके लिए हटा दिया गया।');
    } catch (error) {
      next(error);
    }
  }
}

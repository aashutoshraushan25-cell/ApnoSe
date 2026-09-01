import mongoose from 'mongoose';
import { Conversation, IConversation } from '../models/Conversation';
import { Message, IMessage, MessageType } from '../models/Message';
import { BlockedUser } from '../models/BlockedUser';
import { SafetyService } from './safety.service';
import { emitToConversation, emitToUser } from '../config/socket';
import { AppError } from '../middleware/error.middleware';

export class MessageService {
  /**
   * Get or create a 1-on-1 conversation between two users
   */
  public static async getOrCreateConversation(
    userId1: string,
    userId2: string
  ): Promise<IConversation> {
    const objId1 = new mongoose.Types.ObjectId(userId1);
    const objId2 = new mongoose.Types.ObjectId(userId2);

    // Check if blocked
    const isBlocked = await BlockedUser.findOne({
      $or: [
        { userId: objId1, blockedUserId: objId2 },
        { userId: objId2, blockedUserId: objId1 },
      ],
    });

    if (isBlocked) {
      throw new AppError('आप इस उपयोगकर्ता से बातचीत नहीं कर सकते (Cannot message this user).', 403, 'USER_BLOCKED');
    }

    let conv = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [objId1, objId2], $size: 2 },
    }).populate('participants', 'name profilePhoto age location lastSeen');

    if (!conv) {
      conv = new Conversation({
        participants: [objId1, objId2],
        isGroup: false,
        unreadCounts: new Map([[userId1, 0], [userId2, 0]]),
      });
      await conv.save();
      await conv.populate('participants', 'name profilePhoto age location lastSeen');
    }

    return conv;
  }

  /**
   * Send a new message
   */
  public static async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    type: MessageType = 'text',
    mediaUrl?: string,
    isEncrypted = false
  ): Promise<{ message: IMessage; safetyWarning?: string }> {
    const convObjId = new mongoose.Types.ObjectId(conversationId);
    const senderObjId = new mongoose.Types.ObjectId(senderId);

    const conv = await Conversation.findById(convObjId);
    if (!conv) {
      throw new AppError('बातचीत नहीं मिली (Conversation not found).', 404, 'NOT_FOUND');
    }

    // Verify sender is participant
    const isParticipant = conv.participants.some((p) => p.equals(senderObjId));
    if (!isParticipant) {
      throw new AppError('आप इस बातचीत का हिस्सा नहीं हैं (Unauthorized).', 403, 'FORBIDDEN');
    }

    // Scan for safety / scam heuristic if not E2EE
    let safetyWarning: string | undefined;
    if (!isEncrypted && type === 'text') {
      const scanResult = SafetyService.scanContent(content);
      if (scanResult.isFlagged && scanResult.warnings.length > 0) {
        safetyWarning = scanResult.warnings[0];
      }
    }

    const message = new Message({
      conversationId: convObjId,
      senderId: senderObjId,
      type,
      content,
      mediaUrl,
      isEncrypted,
      readBy: [senderObjId],
    });

    await message.save();
    await message.populate('senderId', 'name profilePhoto');

    // Update conversation lastMessage and unread counts for other participants
    conv.lastMessage = {
      senderId: senderObjId,
      text: type === 'text' ? content : `[${type.toUpperCase()}]`,
      mediaType: type,
      createdAt: new Date(),
    };

    conv.participants.forEach((pId) => {
      const pStr = pId.toString();
      if (pStr !== senderId) {
        const currentCount = conv.unreadCounts.get(pStr) || 0;
        conv.unreadCounts.set(pStr, currentCount + 1);
      }
    });

    await conv.save();

    // Live Socket emission
    emitToConversation(conversationId, 'message:new', { message, conversationId });

    conv.participants.forEach((pId) => {
      const pStr = pId.toString();
      if (pStr !== senderId) {
        emitToUser(pStr, 'message:new', { message, conversationId });
      }
    });

    return { message, safetyWarning };
  }
}

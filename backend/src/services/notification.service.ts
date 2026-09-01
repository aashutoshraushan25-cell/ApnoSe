import mongoose from 'mongoose';
import { Notification, NotificationType, INotification } from '../models/Notification';
import { emitToUser } from '../config/socket';

export interface CreateNotificationInput {
  recipientId: string | mongoose.Types.ObjectId;
  senderId?: string | mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  body: string;
  targetId?: string | mongoose.Types.ObjectId;
  targetModel?: 'Post' | 'Conversation' | 'Community' | 'User';
}

export class NotificationService {
  /**
   * Creates an in-app notification and dispatches real-time Socket alert
   */
  public static async createNotification(input: CreateNotificationInput): Promise<INotification | null> {
    // Avoid self notifications
    if (input.senderId && input.recipientId.toString() === input.senderId.toString()) {
      return null;
    }

    const notif = new Notification({
      recipientId: new mongoose.Types.ObjectId(input.recipientId),
      senderId: input.senderId ? new mongoose.Types.ObjectId(input.senderId) : undefined,
      type: input.type,
      title: input.title,
      body: input.body,
      targetId: input.targetId ? new mongoose.Types.ObjectId(input.targetId) : undefined,
      targetModel: input.targetModel,
    });

    await notif.save();

    // Emit live socket event to recipient
    emitToUser(input.recipientId.toString(), 'notification:new', notif);

    return notif;
  }
}

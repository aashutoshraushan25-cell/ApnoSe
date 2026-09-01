import mongoose, { Document, Schema } from 'mongoose';

export type NotificationType =
  | 'friend_request'
  | 'friend_accepted'
  | 'like'
  | 'comment'
  | 'share'
  | 'message'
  | 'family_request'
  | 'community'
  | 'birthday'
  | 'anniversary'
  | 'security';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  senderId?: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  body: string;
  targetId?: mongoose.Types.ObjectId; // postId, conversationId, etc.
  targetModel?: 'Post' | 'Conversation' | 'Community' | 'User';
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: [
        'friend_request',
        'friend_accepted',
        'like',
        'comment',
        'share',
        'message',
        'family_request',
        'community',
        'birthday',
        'anniversary',
        'security',
      ],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
    },
    targetModel: {
      type: String,
      enum: ['Post', 'Conversation', 'Community', 'User'],
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

NotificationSchema.index({ recipientId: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

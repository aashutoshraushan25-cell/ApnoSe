import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  _id: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  adminId?: mongoose.Types.ObjectId;
  lastMessage?: {
    senderId: mongoose.Types.ObjectId;
    text: string;
    mediaType?: string;
    createdAt: Date;
  };
  unreadCounts: Map<string, number>; // userId -> unread count
  isEncrypted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    isGroup: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      trim: true,
    },
    groupAvatar: {
      type: String,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    lastMessage: {
      senderId: { type: Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, default: '' },
      mediaType: { type: String, default: 'text' },
      createdAt: { type: Date, default: Date.now },
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    isEncrypted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ updatedAt: -1 });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);

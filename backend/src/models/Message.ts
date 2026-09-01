import mongoose, { Document, Schema } from 'mongoose';

export type MessageType = 'text' | 'image' | 'video' | 'voice' | 'file';

export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  type: MessageType;
  content: string; // Plain text or ciphertext
  mediaUrl?: string;
  mediaDuration?: number; // In seconds for voice/video
  isEncrypted: boolean;
  readBy: mongoose.Types.ObjectId[];
  deletedFor: mongoose.Types.ObjectId[]; // Soft-delete per user
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'voice', 'file'],
      default: 'text',
    },
    content: {
      type: String,
      trim: true,
      default: '',
    },
    mediaUrl: {
      type: String,
    },
    mediaDuration: {
      type: Number,
    },
    isEncrypted: {
      type: Boolean,
      default: false,
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    deletedFor: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ conversationId: 1, createdAt: -1 });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IBlockedUser extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  blockedUserId: mongoose.Types.ObjectId;
  reason?: string;
  createdAt: Date;
}

const BlockedUserSchema = new Schema<IBlockedUser>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    blockedUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Unique compound index so a user cannot block the same user multiple times
BlockedUserSchema.index({ userId: 1, blockedUserId: 1 }, { unique: true });

export const BlockedUser = mongoose.model<IBlockedUser>('BlockedUser', BlockedUserSchema);

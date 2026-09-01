import mongoose, { Document, Schema } from 'mongoose';

export type ReactionType = 'like' | 'love' | 'care' | 'laugh' | 'sad' | 'pray';

export interface ILike extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  targetType: 'post' | 'comment';
  targetId: mongoose.Types.ObjectId;
  reaction: ReactionType;
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ['post', 'comment'],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    reaction: {
      type: String,
      enum: ['like', 'love', 'care', 'laugh', 'sad', 'pray'],
      default: 'like',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Prevent duplicate reactions from same user on same target
LikeSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });

export const Like = mongoose.model<ILike>('Like', LikeSchema);

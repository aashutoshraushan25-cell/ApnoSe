import mongoose, { Document, Schema } from 'mongoose';

export type FriendshipStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';

export interface IFriendship extends Document {
  _id: mongoose.Types.ObjectId;
  requesterId: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  status: FriendshipStatus;
  createdAt: Date;
  updatedAt: Date;
}

const FriendshipSchema = new Schema<IFriendship>(
  {
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'blocked'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate records between two users
FriendshipSchema.index({ requesterId: 1, recipientId: 1 }, { unique: true });

export const Friendship = mongoose.model<IFriendship>('Friendship', FriendshipSchema);

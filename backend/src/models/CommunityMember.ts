import mongoose, { Document, Schema } from 'mongoose';

export type CommunityMemberRole = 'creator' | 'admin' | 'member';

export interface ICommunityMember extends Document {
  _id: mongoose.Types.ObjectId;
  communityId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: CommunityMemberRole;
  joinedAt: Date;
}

const CommunityMemberSchema = new Schema<ICommunityMember>(
  {
    communityId: {
      type: Schema.Types.ObjectId,
      ref: 'Community',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['creator', 'admin', 'member'],
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

CommunityMemberSchema.index({ communityId: 1, userId: 1 }, { unique: true });

export const CommunityMember = mongoose.model<ICommunityMember>('CommunityMember', CommunityMemberSchema);

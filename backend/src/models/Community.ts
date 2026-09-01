import mongoose, { Document, Schema } from 'mongoose';

export type CommunityCategory =
  | 'Gardening'
  | 'Cooking'
  | 'Travel'
  | 'Books'
  | 'Music'
  | 'Photography'
  | 'Spirituality'
  | 'Local Community'
  | 'Business'
  | 'Jobs'
  | 'Health & Wellness';

export interface ICommunity extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: CommunityCategory;
  coverImage?: string;
  avatarImage?: string;
  creatorId: mongoose.Types.ObjectId;
  privacy: 'public' | 'private';
  membersCount: number;
  location?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommunitySchema = new Schema<ICommunity>(
  {
    name: {
      type: String,
      required: [true, 'Community name is required'],
      trim: true,
      minlength: [2, 'Community name must be at least 2 characters'],
      maxlength: [100, 'Community name cannot exceed 100 characters'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      enum: [
        'Gardening',
        'Cooking',
        'Travel',
        'Books',
        'Music',
        'Photography',
        'Spirituality',
        'Local Community',
        'Business',
        'Jobs',
        'Health & Wellness',
      ],
      required: true,
      index: true,
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=1200',
    },
    avatarImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400',
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    privacy: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    membersCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    location: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Community = mongoose.model<ICommunity>('Community', CommunitySchema);

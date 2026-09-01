import mongoose, { Document, Schema } from 'mongoose';

export type PostVisibility = 'public' | 'friends' | 'family' | 'private';
export type MediaType = 'text' | 'image' | 'video' | 'audio';

export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  content: string;
  media: string[];
  mediaType: MediaType;
  visibility: PostVisibility;
  location?: string;
  feeling?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isEncrypted: boolean;
  encryptedData?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      trim: true,
      maxlength: [3000, 'Post content cannot exceed 3000 characters'],
      default: '',
    },
    media: {
      type: [String],
      default: [],
    },
    mediaType: {
      type: String,
      enum: ['text', 'image', 'video', 'audio'],
      default: 'text',
    },
    visibility: {
      type: String,
      enum: ['public', 'friends', 'family', 'private'],
      default: 'friends',
      index: true,
    },
    location: {
      type: String,
      trim: true,
    },
    feeling: {
      type: String,
      trim: true,
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    sharesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isEncrypted: {
      type: Boolean,
      default: false,
    },
    encryptedData: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for feed queries
PostSchema.index({ authorId: 1, createdAt: -1 });
PostSchema.index({ visibility: 1, createdAt: -1 });

export const Post = mongoose.model<IPost>('Post', PostSchema);

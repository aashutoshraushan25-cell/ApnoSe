import mongoose, { Document, Schema } from 'mongoose';

export type ReportReason =
  | 'spam'
  | 'scam'
  | 'harassment'
  | 'fake_account'
  | 'inappropriate_content'
  | 'other';

export type ReportTargetType = 'user' | 'post' | 'comment' | 'message' | 'community';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface IReport extends Document {
  _id: mongoose.Types.ObjectId;
  reporterId: mongoose.Types.ObjectId;
  targetType: ReportTargetType;
  targetId: mongoose.Types.ObjectId;
  reason: ReportReason;
  description?: string;
  evidence?: string[];
  riskLevel: RiskLevel;
  status: ReportStatus;
  reviewedBy?: mongoose.Types.ObjectId;
  resolutionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ['user', 'post', 'comment', 'message', 'community'],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    reason: {
      type: String,
      enum: ['spam', 'scam', 'harassment', 'fake_account', 'inappropriate_content', 'other'],
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    evidence: {
      type: [String],
      default: [],
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending',
      index: true,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    resolutionNotes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model<IReport>('Report', ReportSchema);

import mongoose, { Document, Schema } from 'mongoose';

export type FamilyRelationship =
  | 'husband'
  | 'wife'
  | 'son'
  | 'daughter'
  | 'father'
  | 'mother'
  | 'brother'
  | 'sister'
  | 'grandfather'
  | 'grandmother'
  | 'other';

export interface IFamilyMember extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  memberId: mongoose.Types.ObjectId;
  relationship: FamilyRelationship;
  customRelationName?: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const FamilyMemberSchema = new Schema<IFamilyMember>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    relationship: {
      type: String,
      enum: [
        'husband',
        'wife',
        'son',
        'daughter',
        'father',
        'mother',
        'brother',
        'sister',
        'grandfather',
        'grandmother',
        'other',
      ],
      required: true,
    },
    customRelationName: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

FamilyMemberSchema.index({ userId: 1, memberId: 1 }, { unique: true });

export const FamilyMember = mongoose.model<IFamilyMember>('FamilyMember', FamilyMemberSchema);

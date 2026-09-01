import mongoose, { Document, Schema } from 'mongoose';

export type SupportedLanguage = 'hi' | 'en' | 'bho' | 'mai' | 'bn' | 'mr';
export type UserRole = 'user' | 'moderator' | 'admin';
export type PrivacyScope = 'everyone' | 'friends' | 'family' | 'nobody';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  passwordHash: string;
  dateOfBirth: Date;
  age: number;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  profilePhoto?: string;
  coverPhoto?: string;
  bio?: string;
  location?: string;
  language: SupportedLanguage;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  isBlocked: boolean;
  lastSeen: Date;
  privacySettings: {
    profileVisibility: PrivacyScope;
    postVisibilityDefault: 'public' | 'friends' | 'family' | 'private';
    messagePermission: PrivacyScope;
    friendRequestPermission: 'everyone' | 'friends_of_friends' | 'nobody';
    birthdayVisibility: PrivacyScope;
    locationVisibility: PrivacyScope;
  };
  encryptionEnabled: boolean;
  encryptionPin?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  calculateAge(): number;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [70, 'Name cannot exceed 70 characters'],
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      unique: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required for 40+ verification'],
    },
    age: {
      type: Number,
      min: [40, 'Apno Se is exclusively for seniors & adults aged 40 and above'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      default: 'prefer_not_to_say',
    },
    profilePhoto: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    },
    coverPhoto: {
      type: String,
      default: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=1200',
    },
    bio: {
      type: String,
      maxlength: [300, 'Bio cannot exceed 300 characters'],
      default: 'अपनों से जुड़े रहने की एक नई शुरुआत। 🌸',
    },
    location: {
      type: String,
      trim: true,
      default: 'नई दिल्ली, भारत',
      index: true,
    },
    language: {
      type: String,
      enum: ['hi', 'en', 'bho', 'mai', 'bn', 'mr'],
      default: 'hi',
    },
    role: {
      type: String,
      enum: ['user', 'moderator', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    privacySettings: {
      profileVisibility: { type: String, enum: ['everyone', 'friends', 'family', 'nobody'], default: 'everyone' },
      postVisibilityDefault: { type: String, enum: ['public', 'friends', 'family', 'private'], default: 'friends' },
      messagePermission: { type: String, enum: ['everyone', 'friends', 'family', 'nobody'], default: 'everyone' },
      friendRequestPermission: { type: String, enum: ['everyone', 'friends_of_friends', 'nobody'], default: 'everyone' },
      birthdayVisibility: { type: String, enum: ['everyone', 'friends', 'family', 'nobody'], default: 'friends' },
      locationVisibility: { type: String, enum: ['everyone', 'friends', 'family', 'nobody'], default: 'friends' },
    },
    encryptionEnabled: {
      type: Boolean,
      default: true,
    },
    encryptionPin: {
      type: String,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret: Record<string, any>) => {
        delete ret.passwordHash;
        delete ret.refreshToken;
        delete ret.encryptionPin;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Method to calculate age on server
UserSchema.methods.calculateAge = function (): number {
  if (!this.dateOfBirth) return 0;
  const diffMs = Date.now() - new Date(this.dateOfBirth).getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// Pre-save hook to calculate and enforce age
UserSchema.pre('save', function () {
  if (this.isModified('dateOfBirth') || !this.age) {
    this.age = this.calculateAge();
  }
});

export const User = mongoose.model<IUser>('User', UserSchema);

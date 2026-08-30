export type Language = 'hi' | 'en' | 'bho' | 'mr' | 'bn' | 'mai';

export type RelationshipType = 
  | 'wife' | 'husband' | 'son' | 'daughter' 
  | 'father' | 'mother' | 'brother' | 'sister' 
  | 'grandfather' | 'grandmother' | 'grandson' | 'granddaughter'
  | 'son_in_law' | 'daughter_in_law' | 'brother_in_law' | 'sister_in_law'
  | 'friend' | 'relative' | 'other';

export type PostAudience = 'everyone' | 'friends' | 'family' | 'only_me';

export interface User {
  id: string;
  name: string;
  age: number;
  mobile: string;
  email: string;
  avatar: string;
  coverImage: string;
  location: string;
  preferredLanguage: Language;
  bio: string;
  joinedDate: string;
  occupation?: string;
  isVerified?: boolean;
  interests: string[];
}

export interface FamilyMember {
  id: string;
  userId: string; // The user profile this family member is linked to
  name: string;
  relationship: RelationshipType;
  relationshipLabelHi: string;
  relationshipLabelEn: string;
  avatar: string;
  mobile: string;
  location: string;
  lastContacted: string; // e.g. "आज सुबह 10:30 बजे"
  isOnline: boolean;
  birthDate?: string;
  anniversaryDate?: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorLocation: string;
  authorRelation?: string; // e.g. "बेटा", "पत्नी", "मित्र"
  createdAt: string;
  timestamp: number;
  text: string;
  images?: string[];
  videoUrl?: string;
  audioUrl?: string;
  audioDuration?: number; // seconds
  audioWaveform?: number[];
  feeling?: {
    emoji: string;
    textHi: string;
    textEn: string;
  };
  location?: string;
  audience: PostAudience;
  likesCount: number;
  likedByMe: boolean;
  savedByMe: boolean;
  commentsCount: number;
  sharesCount: number;
  communityId?: string;
  communityName?: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRelation?: string;
  createdAt: string;
  text: string;
  audioUrl?: string;
  audioDuration?: number;
  likesCount: number;
  likedByMe: boolean;
}

export interface Community {
  id: string;
  name: string;
  nameHi: string;
  category: 'hobbies' | 'lifestyle' | 'local' | 'professional';
  categoryLabelHi: string;
  coverImage: string;
  icon: string;
  description: string;
  descriptionHi: string;
  memberCount: number;
  isMember: boolean;
  location?: string;
  rules?: string[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  text?: string;
  audioUrl?: string;
  audioDuration?: number;
  imageUrl?: string;
  createdAt: string;
  timestamp: number;
  isRead: boolean;
  isVoiceNote?: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRelation?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'birthday' | 'anniversary' | 'like' | 'comment' | 'family_update' | 'friend_request' | 'community' | 'safety';
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  avatar?: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  relatedId?: string;
  actionLabel?: string;
  actionLabelHi?: string;
}

export interface BirthdayReminder {
  id: string;
  name: string;
  avatar: string;
  relationship: string;
  relationshipHi: string;
  date: string; // "आज" or "कल" or "12 सितंबर"
  isToday: boolean;
  ageTurning?: number;
  isAnniversary?: boolean;
  yearsOfMarriage?: number;
  partnerName?: string;
}

export interface SafetyAlert {
  id: string;
  severity: 'warning' | 'critical' | 'info';
  titleHi: string;
  titleEn: string;
  descriptionHi: string;
  descriptionEn: string;
  icon: string;
  date: string;
}

export type TextSize = 'normal' | 'large' | 'extralarge';
export type ActiveTab = 'home' | 'family' | 'friends' | 'messages' | 'communities' | 'notifications' | 'profile' | 'safety' | 'settings' | 'birthdays';

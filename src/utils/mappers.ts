import { User, Post, Comment, FamilyMember, Community, Conversation, Message, NotificationItem } from '../types';

export const mapBackendUserToFrontend = (raw: any): User => {
  if (!raw) return raw;
  const id = raw._id ? raw._id.toString() : raw.id || `user-${Date.now()}`;
  return {
    id,
    name: raw.name || 'उपयोगकर्ता',
    age: raw.age || (raw.dateOfBirth ? Math.floor((Date.now() - new Date(raw.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 50),
    mobile: raw.phone || raw.mobile || '+91 98000 00000',
    email: raw.email || '',
    password: raw.password || '',
    avatar: raw.profilePhoto || raw.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    coverImage: raw.coverPhoto || raw.coverImage || 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=1200',
    location: raw.location || 'नई दिल्ली',
    preferredLanguage: raw.language || raw.preferredLanguage || 'hi',
    bio: raw.bio || 'अपनों से जुड़े रहने की शुरुआत। 🌸',
    joinedDate: raw.createdAt ? new Date(raw.createdAt).toLocaleDateString('hi-IN', { month: 'long', year: 'numeric' }) : 'आज',
    occupation: raw.occupation,
    isVerified: raw.isVerified ?? true,
    interests: raw.interests || ['परिवार', 'यादें', 'संस्कृति'],
    privacyAgreed: raw.privacyAgreed ?? true,
    encryptionEnabled: raw.encryptionEnabled ?? true,
  };
};

export const mapBackendPostToFrontend = (raw: any, currentUserId?: string): Post => {
  if (!raw) return raw;
  const id = raw._id ? raw._id.toString() : raw.id;
  const author = typeof raw.authorId === 'object' && raw.authorId !== null ? raw.authorId : {};
  const authorIdStr = author._id ? author._id.toString() : (typeof raw.authorId === 'string' ? raw.authorId : '');

  const createdAtFormatted = raw.createdAt
    ? new Date(raw.createdAt).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })
    : 'अभी';

  return {
    id,
    authorId: authorIdStr || raw.authorId || '',
    authorName: author.name || raw.authorName || 'अज्ञात लेखक',
    authorAvatar: author.profilePhoto || raw.authorAvatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    authorLocation: author.location || raw.authorLocation || raw.location || 'भारत',
    authorRelation: raw.authorRelation || (currentUserId && authorIdStr === currentUserId ? 'आप' : undefined),
    createdAt: raw.createdAtLabel || createdAtFormatted,
    timestamp: raw.createdAt ? new Date(raw.createdAt).getTime() : Date.now(),
    text: raw.content || raw.text || '',
    images: raw.media && raw.media.length > 0 ? raw.media : raw.images,
    audioUrl: raw.mediaType === 'audio' && raw.media?.[0] ? raw.media[0] : raw.audioUrl,
    audioDuration: raw.audioDuration,
    audioWaveform: raw.audioWaveform,
    feeling: raw.feeling ? (typeof raw.feeling === 'string' ? { emoji: '🌸', textHi: raw.feeling, textEn: raw.feeling } : raw.feeling) : undefined,
    location: raw.location,
    audience: raw.visibility || raw.audience || 'everyone',
    likesCount: raw.likesCount || 0,
    likedByMe: raw.isLiked ?? raw.likedByMe ?? false,
    savedByMe: raw.savedByMe ?? false,
    commentsCount: raw.commentsCount || 0,
    sharesCount: raw.sharesCount || 0,
    communityId: raw.communityId ? raw.communityId.toString() : undefined,
    communityName: raw.communityName,
  };
};

export const mapBackendFamilyToFrontend = (raw: any): FamilyMember => {
  if (!raw) return raw;
  const id = raw._id ? raw._id.toString() : raw.id;
  const member = typeof raw.memberId === 'object' && raw.memberId !== null ? raw.memberId : {};
  const memberIdStr = member._id ? member._id.toString() : (typeof raw.memberId === 'string' ? raw.memberId : id);

  const relLabels: Record<string, string> = {
    wife: 'पत्नी',
    husband: 'पति',
    son: 'बेटा',
    daughter: 'बेटी',
    mother: 'माताजी',
    father: 'पिताजी',
    brother: 'भाई',
    sister: 'बहन',
    friend: 'मित्र',
    other: 'परिवार',
  };

  return {
    id,
    userId: memberIdStr,
    name: member.name || raw.name || 'पारिवारिक सदस्य',
    relationship: raw.relationship || 'other',
    relationshipLabelHi: raw.relationshipLabelHi || relLabels[raw.relationship] || 'परिवार',
    relationshipLabelEn: raw.relationship || 'Family',
    avatar: member.profilePhoto || raw.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    mobile: member.phone || raw.mobile || '+91 98000 00000',
    location: member.location || raw.location || 'घर',
    lastContacted: raw.lastContacted || 'हाल ही में',
    isOnline: raw.isOnline ?? true,
    birthDate: raw.birthDate,
    anniversaryDate: raw.anniversaryDate,
  };
};

export const mapBackendCommunityToFrontend = (raw: any, currentUserId?: string): Community => {
  if (!raw) return raw;
  const id = raw._id ? raw._id.toString() : raw.id;
  return {
    id,
    name: raw.name || '',
    nameHi: raw.name || '',
    category: raw.category?.toLowerCase() || 'lifestyle',
    categoryLabelHi: raw.category || 'समुदाय',
    coverImage: raw.coverImage || 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    icon: raw.icon || '🌸',
    description: raw.description || '',
    descriptionHi: raw.description || '',
    memberCount: raw.membersCount || raw.memberCount || 1,
    isMember: raw.isMember ?? true,
    location: raw.location || 'अखिल भारतीय',
    rules: raw.rules,
  };
};

export const mapBackendConversationToFrontend = (raw: any, currentUserId?: string): Conversation => {
  if (!raw) return raw;
  const id = raw._id ? raw._id.toString() : raw.id;
  const participants = Array.isArray(raw.participants) ? raw.participants : [];
  const otherParticipant = participants.find((p: any) => {
    const pId = typeof p === 'object' && p !== null ? (p._id?.toString() || p.id) : p;
    return pId !== currentUserId;
  }) || participants[0] || {};

  const otherId = typeof otherParticipant === 'object' ? (otherParticipant._id?.toString() || otherParticipant.id || id) : otherParticipant;
  const otherName = typeof otherParticipant === 'object' ? (otherParticipant.name || 'प्रियजन') : 'प्रियजन';
  const otherAvatar = typeof otherParticipant === 'object' ? (otherParticipant.profilePhoto || otherParticipant.avatar) : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400';

  const lastMsgText = raw.lastMessage?.text || raw.lastMessage?.content || (typeof raw.lastMessage === 'string' ? raw.lastMessage : 'नमस्ते!');
  const lastMsgTime = raw.lastMessage?.createdAt
    ? new Date(raw.lastMessage.createdAt).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })
    : raw.lastMessageTime || 'अभी';

  return {
    id,
    participantId: otherId,
    participantName: otherName,
    participantAvatar: otherAvatar,
    participantRelation: raw.participantRelation,
    lastMessage: lastMsgText,
    lastMessageTime: lastMsgTime,
    unreadCount: raw.unreadCounts ? (raw.unreadCounts[currentUserId || ''] || 0) : (raw.unreadCount || 0),
    isOnline: true,
  };
};

export const mapBackendMessageToFrontend = (raw: any): Message => {
  if (!raw) return raw;
  const id = raw._id ? raw._id.toString() : raw.id;
  const senderId = typeof raw.senderId === 'object' && raw.senderId !== null ? raw.senderId._id?.toString() : raw.senderId;
  const receiverId = typeof raw.receiverId === 'object' && raw.receiverId !== null ? raw.receiverId._id?.toString() : raw.receiverId || 'other';

  return {
    id,
    senderId: senderId || '',
    receiverId: receiverId || '',
    conversationId: raw.conversationId ? raw.conversationId.toString() : '',
    text: raw.content || raw.text,
    audioUrl: raw.type === 'voice' ? (raw.mediaUrl || raw.audioUrl) : raw.audioUrl,
    audioDuration: raw.audioDuration,
    imageUrl: raw.type === 'image' ? (raw.mediaUrl || raw.imageUrl) : raw.imageUrl,
    createdAt: raw.createdAt ? new Date(raw.createdAt).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }) : 'अभी',
    timestamp: raw.createdAt ? new Date(raw.createdAt).getTime() : Date.now(),
    isRead: raw.readBy && raw.readBy.length > 1 ? true : (raw.isRead ?? true),
    isVoiceNote: raw.type === 'voice' || !!raw.audioUrl,
  };
};

export const mapBackendNotificationToFrontend = (raw: any): NotificationItem => {
  if (!raw) return raw;
  const id = raw._id ? raw._id.toString() : raw.id;
  const sender = typeof raw.senderId === 'object' && raw.senderId !== null ? raw.senderId : {};

  return {
    id,
    type: raw.type || 'like',
    title: raw.title || 'सूचना',
    titleHi: raw.title || 'सूचना',
    description: raw.body || raw.description || '',
    descriptionHi: raw.body || raw.description || '',
    avatar: sender.profilePhoto || raw.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    timestamp: raw.createdAt ? new Date(raw.createdAt).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }) : 'अभी',
    isRead: raw.isRead ?? false,
    relatedId: raw.targetId ? raw.targetId.toString() : undefined,
  };
};

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Post,
  Comment,
  FamilyMember,
  Community,
  Conversation,
  Message,
  NotificationItem,
  BirthdayReminder,
  ActiveTab,
  RelationshipType,
  PostAudience,
} from '../types';
import {
  INITIAL_POSTS,
  INITIAL_COMMENTS,
  INITIAL_FAMILY_MEMBERS,
  INITIAL_COMMUNITIES,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_BIRTHDAYS,
} from '../data/mockData';
import { useAuth } from './AuthContext';
import { useAccessibility } from './AccessibilityContext';
import { postApi } from '../services/postApi';
import { familyApi } from '../services/familyApi';
import { communityApi } from '../services/communityApi';
import { messageApi } from '../services/messageApi';
import { notificationApi } from '../services/notificationApi';
import { socketService } from '../services/socketService';
import {
  mapBackendPostToFrontend,
  mapBackendFamilyToFrontend,
  mapBackendCommunityToFrontend,
  mapBackendConversationToFrontend,
  mapBackendMessageToFrontend,
  mapBackendNotificationToFrontend,
} from '../utils/mappers';

export interface ActiveCallState {
  isOpen: boolean;
  type: 'video' | 'audio';
  participantName: string;
  participantAvatar: string;
  participantRelation?: string;
  isConnecting: boolean;
  isConnected: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeakerOn: boolean;
  durationSeconds: number;
}

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  posts: Post[];
  createPost: (postData: {
    text: string;
    images?: string[];
    audioUrl?: string;
    audioDuration?: number;
    audioWaveform?: number[];
    feeling?: { emoji: string; textHi: string; textEn: string };
    location?: string;
    audience: PostAudience;
    communityId?: string;
  }) => Promise<void>;
  toggleLikePost: (postId: string) => Promise<void>;
  toggleSavePost: (postId: string) => void;
  getCommentsForPost: (postId: string) => Comment[];
  addComment: (postId: string, text: string, audioUrl?: string, audioDuration?: number) => Promise<void>;
  
  // Family
  familyMembers: FamilyMember[];
  addFamilyMember: (member: {
    name: string;
    relationship: RelationshipType;
    relationshipLabelHi: string;
    mobile: string;
    location: string;
    avatar?: string;
  }) => Promise<void>;
  removeFamilyMember: (id: string) => Promise<void>;
  
  // Communities
  communities: Community[];
  toggleJoinCommunity: (communityId: string) => Promise<void>;
  
  // Messaging
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  getMessagesForConversation: (convId: string) => Message[];
  sendMessage: (convId: string, text?: string, audioUrl?: string, audioDuration?: number, imageUrl?: string) => Promise<void>;
  
  // Calling
  activeCall: ActiveCallState | null;
  startCall: (type: 'video' | 'audio', name: string, avatar: string, relation?: string) => void;
  endCall: () => void;
  toggleMuteCall: () => void;
  toggleVideoCall: () => void;
  toggleSpeakerCall: () => void;
  
  // Notifications & Celebrations
  notifications: NotificationItem[];
  unreadNotifCount: number;
  markNotifAsRead: (id: string) => Promise<void>;
  markAllNotifsAsRead: () => Promise<void>;
  birthdays: BirthdayReminder[];
  sendBirthdayGreeting: (birthdayItem: BirthdayReminder, customMessage?: string) => void;
  
  // Modals & UI helpers
  isCreatePostOpen: boolean;
  setIsCreatePostOpen: (open: boolean) => void;
  isVoicePostOpen: boolean;
  setIsVoicePostOpen: (open: boolean) => void;
  isAddFamilyOpen: boolean;
  setIsAddFamilyOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const { playSuccessSound, playClickSound } = useAccessibility();

  const [activeTab, setActiveTabState] = useState<ActiveTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isVoicePostOpen, setIsVoicePostOpen] = useState(false);
  const [isAddFamilyOpen, setIsAddFamilyOpen] = useState(false);

  // Data states initialized from localStorage or mockData
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('apnose_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>(() => {
    const saved = localStorage.getItem('apnose_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    const saved = localStorage.getItem('apnose_family');
    return saved ? JSON.parse(saved) : INITIAL_FAMILY_MEMBERS;
  });

  const [communities, setCommunities] = useState<Community[]>(() => {
    const saved = localStorage.getItem('apnose_communities');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITIES;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('apnose_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('apnose_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('apnose_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [birthdays, setBirthdays] = useState<BirthdayReminder[]>(() => {
    return INITIAL_BIRTHDAYS;
  });

  // Call state
  const [activeCall, setActiveCall] = useState<ActiveCallState | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Sync Backend Data when Current User Changes
  useEffect(() => {
    if (!currentUser) return;

    // 1. Fetch Feed from Backend
    postApi.getFeed().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((p) => mapBackendPostToFrontend(p, currentUser.id));
        setPosts((prev) => {
          // Merge backend posts with any local custom posts not yet on server
          const backendIds = new Set(mapped.map((m) => m.id));
          const localOnly = prev.filter((p) => !backendIds.has(p.id) && p.id.startsWith('post-'));
          return [...mapped, ...localOnly];
        });
      }
    }).catch(() => {});

    // 2. Fetch Family Members
    familyApi.getMembers().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map(mapBackendFamilyToFrontend);
        setFamilyMembers(mapped);
      }
    }).catch(() => {});

    // 3. Fetch Communities
    communityApi.getCommunities().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((c) => mapBackendCommunityToFrontend(c, currentUser.id));
        setCommunities(mapped);
      }
    }).catch(() => {});

    // 4. Fetch Conversations
    messageApi.getConversations().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((c) => mapBackendConversationToFrontend(c, currentUser.id));
        setConversations(mapped);
      }
    }).catch(() => {});

    // 5. Fetch Notifications
    notificationApi.getNotifications().then((res) => {
      if (res.success && res.data?.notifications && res.data.notifications.length > 0) {
        const mapped = res.data.notifications.map(mapBackendNotificationToFrontend);
        setNotifications(mapped);
      }
    }).catch(() => {});

    // 6. Register Real-Time WebSocket Handlers
    const unbindMsg = socketService.on('new_message', (rawMsg: any) => {
      playSuccessSound();
      const mappedMsg = mapBackendMessageToFrontend(rawMsg);
      const convId = mappedMsg.conversationId || rawMsg.conversationId;

      setMessagesMap((prev) => ({
        ...prev,
        [convId]: [...(prev[convId] || []), mappedMsg],
      }));

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                lastMessage: mappedMsg.text || '📷 मीडिया संदेश',
                lastMessageTime: 'अभी',
                unreadCount: c.unreadCount + 1,
              }
            : c
        )
      );

      showToast(`नया संदेश: ${mappedMsg.text?.slice(0, 30) || 'मीडिया'}`);
    });

    const unbindNotif = socketService.on('notification', (rawNotif: any) => {
      playSuccessSound();
      const mappedNotif = mapBackendNotificationToFrontend(rawNotif);
      setNotifications((prev) => [mappedNotif, ...prev]);
      showToast(`🔔 ${mappedNotif.title}`);
    });

    const unbindCall = socketService.on('call:incoming', (callData: any) => {
      playSuccessSound();
      setActiveCall({
        isOpen: true,
        type: callData.callType || 'audio',
        participantName: callData.callerName || 'प्रियजन',
        participantAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
        participantRelation: 'कॉल आ रही है...',
        isConnecting: false,
        isConnected: true,
        isMuted: false,
        isVideoOff: false,
        isSpeakerOn: true,
        durationSeconds: 0,
      });
    });

    return () => {
      unbindMsg();
      unbindNotif();
      unbindCall();
    };
  }, [currentUser, playSuccessSound, showToast]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('apnose_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('apnose_comments', JSON.stringify(commentsMap));
  }, [commentsMap]);

  useEffect(() => {
    localStorage.setItem('apnose_family', JSON.stringify(familyMembers));
  }, [familyMembers]);

  useEffect(() => {
    localStorage.setItem('apnose_communities', JSON.stringify(communities));
  }, [communities]);

  useEffect(() => {
    localStorage.setItem('apnose_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('apnose_messages', JSON.stringify(messagesMap));
  }, [messagesMap]);

  useEffect(() => {
    localStorage.setItem('apnose_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Call duration counter
  useEffect(() => {
    let timer: any;
    if (activeCall && activeCall.isConnected) {
      timer = setInterval(() => {
        setActiveCall((prev) => (prev ? { ...prev, durationSeconds: prev.durationSeconds + 1 } : null));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeCall?.isConnected]);

  const setActiveTab = (tab: ActiveTab) => {
    playClickSound();
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Post methods
  const createPost = async (postData: {
    text: string;
    images?: string[];
    audioUrl?: string;
    audioDuration?: number;
    audioWaveform?: number[];
    feeling?: { emoji: string; textHi: string; textEn: string };
    location?: string;
    audience: PostAudience;
    communityId?: string;
  }) => {
    if (!currentUser) return;
    playSuccessSound();

    let communityName: string | undefined;
    if (postData.communityId) {
      const comm = communities.find((c) => c.id === postData.communityId);
      if (comm) communityName = comm.nameHi;
    }

    const tempId = `post-${Date.now()}`;
    const newPost: Post = {
      id: tempId,
      authorId: currentUser.id,
      authorName: currentUser.name.split(' (')[0],
      authorAvatar: currentUser.avatar,
      authorLocation: currentUser.location.split(' (')[0],
      authorRelation: 'आप',
      createdAt: 'अभी-अभी',
      timestamp: Date.now(),
      text: postData.text,
      images: postData.images && postData.images.length > 0 ? postData.images : undefined,
      audioUrl: postData.audioUrl,
      audioDuration: postData.audioDuration,
      audioWaveform: postData.audioWaveform || (postData.audioUrl ? [30, 60, 90, 45, 80, 100, 60, 40, 75, 50, 30] : undefined),
      feeling: postData.feeling,
      location: postData.location || currentUser.location.split(' (')[0],
      audience: postData.audience,
      likesCount: 1,
      likedByMe: true,
      savedByMe: false,
      commentsCount: 0,
      sharesCount: 0,
      communityId: postData.communityId,
      communityName,
    };

    // Optimistically update UI
    setPosts((prev) => [newPost, ...prev]);
    showToast('आपकी पोस्ट सफलतापूर्वक साझा कर दी गई है! 🌸');

    // Sync with backend API
    try {
      const mediaPayload = postData.images && postData.images.length > 0
        ? postData.images
        : postData.audioUrl
        ? [postData.audioUrl]
        : [];

      const visibilityMap: Record<PostAudience, 'public' | 'friends' | 'family' | 'private'> = {
        everyone: 'public',
        friends: 'friends',
        family: 'family',
        only_me: 'private',
      };

      const res = await postApi.createPost({
        content: postData.text,
        media: mediaPayload,
        mediaType: postData.audioUrl ? 'audio' : postData.images?.length ? 'image' : 'text',
        visibility: visibilityMap[postData.audience] || 'public',
        location: postData.location || currentUser.location.split(' (')[0],
        feeling: postData.feeling?.textHi,
      });

      if (res.success && res.data) {
        const backendPost = mapBackendPostToFrontend(res.data, currentUser.id);
        setPosts((prev) => prev.map((p) => (p.id === tempId ? backendPost : p)));
      }
    } catch {
      // Keep optimistic local post
    }
  };

  const toggleLikePost = async (postId: string) => {
    playClickSound();
    const targetPost = posts.find((p) => p.id === postId);
    if (!targetPost) return;

    const willLike = !targetPost.likedByMe;

    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            likedByMe: willLike,
            likesCount: willLike ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );

    // Call Backend API
    try {
      if (willLike) {
        await postApi.likePost(postId);
      } else {
        await postApi.unlikePost(postId);
      }
    } catch {
      // Optimistic state remains smooth
    }
  };

  const toggleSavePost = (postId: string) => {
    playClickSound();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const saved = !p.savedByMe;
          if (saved) showToast('पोस्ट आपकी "सहेजी गई यादों" में सुरक्षित हो गई है। 📁');
          return { ...p, savedByMe: saved };
        }
        return p;
      })
    );
  };

  const getCommentsForPost = (postId: string): Comment[] => {
    return commentsMap[postId] || [];
  };

  const addComment = async (postId: string, text: string, audioUrl?: string, audioDuration?: number) => {
    if (!currentUser || (!text.trim() && !audioUrl)) return;
    playSuccessSound();

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      postId,
      authorId: currentUser.id,
      authorName: currentUser.name.split(' (')[0],
      authorAvatar: currentUser.avatar,
      authorRelation: 'आप',
      createdAt: 'अभी-अभी',
      text,
      audioUrl,
      audioDuration,
      likesCount: 0,
      likedByMe: false,
    };

    setCommentsMap((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
    );

    showToast('आपकी टिप्पणी जुड़ गई है। 🙏');

    // Call Backend API
    try {
      await postApi.addComment(postId, text);
    } catch {
      // Keep optimistic comment
    }
  };

  // Family
  const addFamilyMember = async (member: {
    name: string;
    relationship: RelationshipType;
    relationshipLabelHi: string;
    mobile: string;
    location: string;
    avatar?: string;
  }) => {
    playSuccessSound();
    const tempId = `fam-${Date.now()}`;
    const newMember: FamilyMember = {
      id: tempId,
      userId: `user-${Date.now()}`,
      name: member.name,
      relationship: member.relationship,
      relationshipLabelHi: member.relationshipLabelHi,
      relationshipLabelEn: member.relationship,
      avatar: member.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      mobile: member.mobile,
      location: member.location || 'घर',
      lastContacted: 'आज जोड़ा गया',
      isOnline: true,
    };

    setFamilyMembers((prev) => [newMember, ...prev]);
    showToast(`${member.name} (${member.relationshipLabelHi}) को परिवार में जोड़ दिया गया है! 👨‍👩‍👧`);

    try {
      const res = await familyApi.addMember({
        memberId: newMember.userId,
        relationship: member.relationship,
        customRelationName: member.relationshipLabelHi,
      });
      if (res.success && res.data) {
        const mapped = mapBackendFamilyToFrontend(res.data);
        setFamilyMembers((prev) => prev.map((m) => (m.id === tempId ? mapped : m)));
      }
    } catch {
      // Keep optimistic member
    }
  };

  const removeFamilyMember = async (id: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
    showToast('सदस्य को सूची से हटा दिया गया है।');

    try {
      await familyApi.removeMember(id);
    } catch {
      // Local state already updated
    }
  };

  // Communities
  const toggleJoinCommunity = async (communityId: string) => {
    playClickSound();
    const comm = communities.find((c) => c.id === communityId);
    const willJoin = !comm?.isMember;

    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === communityId) {
          const isMember = !c.isMember;
          showToast(isMember ? `आप "${c.nameHi}" समुदाय में शामिल हो गए हैं! 🎉` : `आप "${c.nameHi}" से बाहर आ गए हैं।`);
          return {
            ...c,
            isMember,
            memberCount: isMember ? c.memberCount + 1 : c.memberCount - 1,
          };
        }
        return c;
      })
    );

    try {
      if (willJoin) {
        await communityApi.joinCommunity(communityId);
      } else {
        await communityApi.leaveCommunity(communityId);
      }
    } catch {
      // Optimistic update retained
    }
  };

  // Messaging
  const getMessagesForConversation = (convId: string): Message[] => {
    return messagesMap[convId] || [];
  };

  const sendMessage = async (
    convId: string,
    text?: string,
    audioUrl?: string,
    audioDuration?: number,
    imageUrl?: string
  ) => {
    if (!currentUser || (!text?.trim() && !audioUrl && !imageUrl)) return;
    playSuccessSound();

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: 'other',
      conversationId: convId,
      text: text?.trim(),
      audioUrl,
      audioDuration,
      imageUrl,
      createdAt: 'अभी',
      timestamp: Date.now(),
      isRead: true,
      isVoiceNote: !!audioUrl,
    };

    setMessagesMap((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMsg],
    }));

    // Update conversation preview
    const preview = audioUrl ? '🎤 [वॉइस संदेश]' : imageUrl ? '📷 [फोटो]' : text || '';
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              lastMessage: preview,
              lastMessageTime: 'अभी',
            }
          : c
      )
    );

    // Call Backend API
    try {
      await messageApi.sendMessage(convId, {
        content: text?.trim(),
        type: audioUrl ? 'voice' : imageUrl ? 'image' : 'text',
        mediaUrl: audioUrl || imageUrl,
      });
    } catch {
      // Backend unavailable, optimistic message preserved
    }

    // Interactive auto-reply simulation when testing locally
    setTimeout(() => {
      const replies = [
        'जी बहुत बढ़िया! मैं थोड़ी देर में कॉल करता हूँ। 🙏',
        'धन्यवाद! आपका यह संदेश पाकर बहुत खुशी हुई। ❤️',
        'जी समझ गया। परिवार में सब कैसे हैं?',
        'सादर प्रणाम! ईश्वर की कृपा से सब कुशल मंगल है।',
      ];
      const autoReplyText = replies[Math.floor(Math.random() * replies.length)];
      const replyMsg: Message = {
        id: `msg-reply-${Date.now()}`,
        senderId: 'other',
        receiverId: currentUser.id,
        conversationId: convId,
        text: autoReplyText,
        createdAt: 'अभी',
        timestamp: Date.now(),
        isRead: false,
      };

      setMessagesMap((prev) => ({
        ...prev,
        [convId]: [...(prev[convId] || []), replyMsg],
      }));

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                lastMessage: autoReplyText,
                lastMessageTime: 'अभी',
              }
            : c
        )
      );
    }, 2200);
  };

  // Calling
  const startCall = (type: 'video' | 'audio', name: string, avatar: string, relation?: string) => {
    playClickSound();
    setActiveCall({
      isOpen: true,
      type,
      participantName: name,
      participantAvatar: avatar,
      participantRelation: relation,
      isConnecting: true,
      isConnected: false,
      isMuted: false,
      isVideoOff: false,
      isSpeakerOn: true,
      durationSeconds: 0,
    });

    // Notify backend/socket
    socketService.initiateCall('recipient-user-id', { type }, type);

    // Simulate connecting after 1.5 seconds
    setTimeout(() => {
      setActiveCall((prev) => (prev ? { ...prev, isConnecting: false, isConnected: true } : null));
    }, 1500);
  };

  const endCall = () => {
    playClickSound();
    if (activeCall) {
      showToast(`कॉल समाप्त हुई (${Math.floor(activeCall.durationSeconds / 60)} मिनट ${activeCall.durationSeconds % 60} सेकंड)`);
      socketService.endCall('recipient-user-id');
    }
    setActiveCall(null);
  };

  const toggleMuteCall = () => {
    setActiveCall((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null));
  };

  const toggleVideoCall = () => {
    setActiveCall((prev) => (prev ? { ...prev, isVideoOff: !prev.isVideoOff } : null));
  };

  const toggleSpeakerCall = () => {
    setActiveCall((prev) => (prev ? { ...prev, isSpeakerOn: !prev.isSpeakerOn } : null));
  };

  // Notifications
  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  const markNotifAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await notificationApi.markAsRead(id);
    } catch {
      // Local state preserved
    }
  };

  const markAllNotifsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('सभी सूचनाएं पढ़ी हुई चिह्नित कर दी गईं।');
    try {
      await notificationApi.markAllAsRead();
    } catch {
      // Local state preserved
    }
  };

  // Birthday & Celebrations
  const sendBirthdayGreeting = (birthdayItem: BirthdayReminder, customMessage?: string) => {
    playSuccessSound();

    // Trigger joyful confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#9333EA', '#F59E0B', '#F43F5E', '#10B981'],
    });

    const greeting =
      customMessage ||
      `🎂 ${birthdayItem.name} को जन्मदिन की ढेर सारी शुभकामनाएं! ईश्वर आपको लंबी आयु, उत्तम स्वास्थ्य और खुशियां प्रदान करे। 🙏🌸`;

    // Create a public post to wish them
    createPost({
      text: greeting,
      feeling: { emoji: '🎂', textHi: 'उत्सव व बधाई', textEn: 'Celebrating' },
      audience: 'everyone',
      images: [birthdayItem.avatar],
    });

    showToast(`${birthdayItem.name} को आपकी शुभकामनाएं और आशीर्वाद भेज दिया गया है! 🎉`);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        posts,
        createPost,
        toggleLikePost,
        toggleSavePost,
        getCommentsForPost,
        addComment,
        familyMembers,
        addFamilyMember,
        removeFamilyMember,
        communities,
        toggleJoinCommunity,
        conversations,
        activeConversationId,
        setActiveConversationId,
        getMessagesForConversation,
        sendMessage,
        activeCall,
        startCall,
        endCall,
        toggleMuteCall,
        toggleVideoCall,
        toggleSpeakerCall,
        notifications,
        unreadNotifCount,
        markNotifAsRead,
        markAllNotifsAsRead,
        birthdays,
        sendBirthdayGreeting,
        isCreatePostOpen,
        setIsCreatePostOpen,
        isVoicePostOpen,
        setIsVoicePostOpen,
        isAddFamilyOpen,
        setIsAddFamilyOpen,
        searchQuery,
        setSearchQuery,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

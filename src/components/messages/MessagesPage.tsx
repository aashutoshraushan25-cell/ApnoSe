import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { SpeechService } from '../../services/speechService';
import {
  Send,
  Mic,
  MicOff,
  Image,
  Phone,
  Video,
  Smile,
  ShieldAlert,
  Volume2,
  VolumeX,
  CheckCheck,
  Sparkles,
  Search,
  ArrowLeft,
  MoreVertical,
  Info,
  X,
  Play,
  Pause,
  Clock,
  Heart,
  Camera,
  ChevronRight,
  ShieldCheck,
  Check,
  RotateCcw,
  Sparkle,
  MessageCircle,
  Users,
  Paperclip,
  Maximize2,
} from 'lucide-react';
import { Conversation, Message } from '../../types';

// Preset emojis & blessings tailored for Indian seniors & family connections
const BLESSING_CHIPS = [
  '🙏 सादर प्रणाम',
  '🌸 शुभ प्रभात',
  '❤️ खुश रहो बेटा',
  '👍 बहुत बढ़िया',
  '☕ चाय पी ली?',
  '🍲 भोजन कर लिया?',
  '🌺 जय श्री कृष्णा',
  '🕉️ हर हर महादेव',
  '🎉 बहुत बहुत बधाई',
  '📞 थोड़ी देर में कॉल करता हूँ',
];

const EMOJI_CATEGORIES = {
  blessings: {
    label: '🌸 आशीर्वाद व शुभकामनाएं',
    emojis: ['🙏', '🌸', '🌺', '🕉️', '🪔', '🚩', '📿', '💐', '🌼', '✨', '🌻', '🌹'],
  },
  emotions: {
    label: '❤️ स्नेह व भावनाएं',
    emojis: ['❤️', '😊', '🥰', '🤗', '👍', '👏', '🙌', '🎉', '🌟', '💖', '😍', '😇'],
  },
  daily: {
    label: '☕ दिनचर्या व खानपान',
    emojis: ['☕', '🍲', '🍎', '🥭', '🥛', '🏡', '🚶‍♂️', '🧘‍♂️', '💊', '📖', '🗞️', '🚗'],
  },
};

const PRESET_PHOTOS = [
  {
    title: '🌸 सुबह के ताजे फूल',
    url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    caption: 'आज सुबह बगीचे में खिले सुंदर फूल आपके लिए! 🌸🌿',
  },
  {
    title: '🪔 संध्या आरती व दीया',
    url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=800',
    caption: 'शुभ संध्या! भगवान की कृपा आप और पूरे परिवार पर सदैव बनी रहे। 🙏🪔',
  },
  {
    title: '☕ गरमा-गरम चाय',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
    caption: 'आइए, साथ में एक कप गरमा-गरम चाय का आनंद लें! ☕',
  },
  {
    title: '🌺 प्रकृति व हरियाली',
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=800',
    caption: 'प्रकृति का यह सुंदर दृश्य मन को शांत कर देता है। 🌺✨',
  },
];

// Helper to assign vibrant, distinguishable relationship pill colors
const getRelationBadgeStyle = (relation?: string) => {
  if (!relation) return 'bg-warm-100 text-warm-800 border-warm-200';
  if (relation.includes('पत्नी') || relation.includes('पति'))
    return 'bg-rose-100 text-rose-800 border-rose-200';
  if (relation.includes('बेटा') || relation.includes('बेटी'))
    return 'bg-purple-100 text-purple-800 border-purple-200';
  if (relation.includes('भाई') || relation.includes('बहन'))
    return 'bg-blue-100 text-blue-800 border-blue-200';
  if (relation.includes('माता') || relation.includes('पिता') || relation.includes('दादी'))
    return 'bg-amber-100 text-amber-800 border-amber-200';
  if (relation.includes('मित्र'))
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  return 'bg-brand-100 text-brand-800 border-brand-200';
};

export const MessagesPage: React.FC = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const { playClickSound, playSuccessSound } = useAccessibility();
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    getMessagesForConversation,
    sendMessage,
    startCall,
  } = useApp();

  // Local States
  const [inputMessage, setInputMessage] = useState('');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState<keyof typeof EMOJI_CATEGORIES>('blessings');
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);
  const [showSafetyBanner, setShowSafetyBanner] = useState(true);
  const [searchContactQuery, setSearchContactQuery] = useState('');
  const [contactFilter, setContactFilter] = useState<'all' | 'family' | 'friends' | 'unread'>('all');
  const [inChatSearchQuery, setInChatSearchQuery] = useState('');
  const [isInChatSearchOpen, setIsInChatSearchOpen] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [messageReactions, setMessageReactions] = useState<Record<string, string[]>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<any>(null);

  // Active Conversation resolution
  const activeConv =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const activeMessages = activeConv
    ? getMessagesForConversation(activeConv.id)
    : [];

  // Filter messages within chat if in-chat search is active
  const filteredActiveMessages = inChatSearchQuery.trim()
    ? activeMessages.filter((m) =>
        m.text?.toLowerCase().includes(inChatSearchQuery.toLowerCase())
      )
    : activeMessages;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, activeConversationId]);

  // Voice recording timer
  useEffect(() => {
    if (isVoiceRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isVoiceRecording]);

  // Handle Send Text
  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !activeConv) return;
    sendMessage(activeConv.id, inputMessage.trim());
    setInputMessage('');
    setIsEmojiPickerOpen(false);
  };

  // Handle Quick Blessing Click
  const handleQuickBlessing = (phrase: string) => {
    if (!activeConv) return;
    playClickSound();
    sendMessage(activeConv.id, phrase);
  };

  // Handle Voice Recording / Speech-To-Text
  const handleToggleVoiceNote = () => {
    if (!activeConv) return;
    if (isVoiceRecording) {
      setIsVoiceRecording(false);
      SpeechService.stopListening();
      const finalDuration = Math.max(recordingSeconds, 4);
      sendMessage(activeConv.id, undefined, 'voice-note-audio', finalDuration);
    } else {
      setIsVoiceRecording(true);
      SpeechService.startListening(
        (transcript) => {
          setInputMessage(transcript);
        },
        (err) => {
          console.warn('Voice recording error:', err);
          setIsVoiceRecording(false);
        },
        () => {
          setIsVoiceRecording(false);
        }
      );
    }
  };

  const handleCancelVoiceRecording = () => {
    setIsVoiceRecording(false);
    SpeechService.stopListening();
    setRecordingSeconds(0);
  };

  // Handle Photo Send
  const handleSendPhoto = (photoUrl: string, caption: string) => {
    if (!activeConv) return;
    sendMessage(activeConv.id, caption, undefined, undefined, photoUrl);
    setIsPhotoPickerOpen(false);
  };

  // Text-To-Speech Read Aloud Feature for seniors
  const handleToggleSpeak = async (msgId: string, text?: string) => {
    if (!text) return;
    if (speakingMsgId === msgId) {
      SpeechService.stopSpeaking();
      setSpeakingMsgId(null);
    } else {
      setSpeakingMsgId(msgId);
      try {
        await SpeechService.speakText(text, 'hi');
      } finally {
        setSpeakingMsgId(null);
      }
    }
  };

  // Voice Note Play Simulation
  const handleTogglePlayVoice = (msgId: string) => {
    if (playingVoiceId === msgId) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(msgId);
      // Auto stop after 6 seconds simulation
      setTimeout(() => {
        setPlayingVoiceId((prev) => (prev === msgId ? null : prev));
      }, 6000);
    }
  };

  // Emoji reaction toggle
  const handleAddReaction = (msgId: string, emoji: string) => {
    playClickSound();
    setMessageReactions((prev) => {
      const current = prev[msgId] || [];
      if (current.includes(emoji)) {
        return { ...prev, [msgId]: current.filter((e) => e !== emoji) };
      }
      return { ...prev, [msgId]: [...current, emoji] };
    });
  };

  // Filter Conversations in Left Panel
  const filteredConversations = conversations.filter((c) => {
    // Search query filter
    if (searchContactQuery.trim()) {
      const q = searchContactQuery.toLowerCase();
      const matchName = c.participantName.toLowerCase().includes(q);
      const matchRel = c.participantRelation?.toLowerCase().includes(q);
      const matchMsg = c.lastMessage?.toLowerCase().includes(q);
      if (!matchName && !matchRel && !matchMsg) return false;
    }

    // Category filter
    if (contactFilter === 'family') {
      return (
        c.participantRelation === 'पत्नी' ||
        c.participantRelation === 'बेटा' ||
        c.participantRelation === 'बेटी' ||
        c.participantRelation === 'भाई' ||
        c.participantRelation === 'माताजी'
      );
    }
    if (contactFilter === 'friends') {
      return c.participantRelation === 'मित्र' || !c.participantRelation;
    }
    if (contactFilter === 'unread') {
      return c.unreadCount > 0;
    }
    return true;
  });

  const totalUnreadCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <div className="bg-white rounded-3xl shadow-soft-lg border border-warm-200/90 overflow-hidden flex flex-col md:flex-row h-[82vh] min-h-[640px] max-h-[820px] animate-in fade-in transition-all relative">
      
      {/* ========================================================================= */}
      {/* LEFT PANEL: CONVERSATIONS LIST                                            */}
      {/* ========================================================================= */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-warm-200 flex flex-col bg-warm-50/60 transition-all ${
          mobileShowChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Panel Header */}
        <div className="p-4 bg-white border-b border-warm-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-800 to-brand-600 text-white flex items-center justify-center shadow-md">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-warm-900 font-devanagari leading-tight">
                  बातचीत व संदेश
                </h2>
                <p className="text-xs text-warm-500 font-medium">
                  परिवार व अपनों से सीधा संवाद
                </p>
              </div>
            </div>

            {totalUnreadCount > 0 && (
              <span className="px-2.5 py-1 bg-coral-500 text-white text-xs font-extrabold rounded-full shadow-xs animate-pulse">
                {totalUnreadCount} नए
              </span>
            )}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-warm-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchContactQuery}
              onChange={(e) => setSearchContactQuery(e.target.value)}
              placeholder="नाम, संबंध या संदेश खोजें..."
              className="w-full pl-10 pr-8 py-2.5 bg-warm-100/70 border border-warm-200 rounded-xl text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all font-devanagari text-warm-900 placeholder:text-warm-400"
            />
            {searchContactQuery && (
              <button
                onClick={() => setSearchContactQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'सभी' },
              { id: 'family', label: '👨‍👩‍👧 परिवार' },
              { id: 'friends', label: '👥 मित्र' },
              { id: 'unread', label: '🔴 न पढ़े' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound();
                  setContactFilter(tab.id as any);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  contactFilter === tab.id
                    ? 'bg-brand-700 text-white shadow-xs'
                    : 'bg-warm-100 text-warm-700 hover:bg-warm-200/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Online Contacts Ribbon */}
        <div className="px-3.5 py-2.5 bg-warm-100/40 border-b border-warm-200/80 flex items-center gap-3 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-warm-500 uppercase tracking-wider shrink-0">
            ऑनलाइन:
          </span>
          {conversations
            .filter((c) => c.isOnline)
            .map((c) => (
              <button
                key={`ribbon-${c.id}`}
                onClick={() => {
                  playClickSound();
                  setActiveConversationId(c.id);
                  setMobileShowChat(true);
                }}
                className="flex flex-col items-center gap-1 shrink-0 group focus:outline-none"
                title={c.participantName}
              >
                <div className="relative">
                  <img
                    src={c.participantAvatar}
                    alt={c.participantName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 group-hover:scale-105 transition-transform shadow-xs"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <span className="text-[10px] font-bold text-warm-700 max-w-[48px] truncate">
                  {c.participantName.split(' ')[0]}
                </span>
              </button>
            ))}
        </div>

        {/* Conversations List Scrollable */}
        <div className="overflow-y-auto flex-1 divide-y divide-warm-100/80">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => {
              const isSelected = activeConv?.id === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => {
                    playClickSound();
                    setActiveConversationId(conv.id);
                    setMobileShowChat(true);
                  }}
                  className={`w-full p-3.5 sm:p-4 flex items-center gap-3 text-left transition-all ${
                    isSelected
                      ? 'bg-brand-50/90 border-l-4 border-brand-700 shadow-xs'
                      : 'hover:bg-warm-100/80'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={conv.participantAvatar}
                      alt={conv.participantName}
                      className="w-13 h-13 rounded-2xl object-cover border-2 border-warm-200 shadow-xs"
                    />
                    {conv.isOnline && (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full ring-1 ring-emerald-200" />
                    )}
                  </div>

                  {/* Content Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5 truncate">
                        <h3 className="font-extrabold text-sm sm:text-base text-warm-900 truncate font-devanagari">
                          {conv.participantName}
                        </h3>
                        {conv.participantRelation && (
                          <span
                            className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border shrink-0 ${getRelationBadgeStyle(
                              conv.participantRelation
                            )}`}
                          >
                            {conv.participantRelation}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-warm-400 shrink-0 ml-1">
                        {conv.lastMessageTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs sm:text-sm text-warm-600 truncate font-medium flex items-center gap-1">
                        {conv.lastMessage?.includes('वॉइस') ? (
                          <span className="text-brand-700 font-bold flex items-center gap-1">
                            <Volume2 className="w-3.5 h-3.5" /> वॉइस नोट
                          </span>
                        ) : conv.lastMessage?.includes('फोटो') ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <Image className="w-3.5 h-3.5" /> फोटो
                          </span>
                        ) : (
                          conv.lastMessage
                        )}
                      </p>

                      {conv.unreadCount > 0 && (
                        <span className="bg-coral-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center shrink-0 shadow-xs animate-bounce">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-warm-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-bold font-devanagari">
                कोई बातचीत नहीं मिली।
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT PANEL: ACTIVE CONVERSATION CHAT WINDOW                              */}
      {/* ========================================================================= */}
      {activeConv ? (
        <div
          className={`flex-1 flex flex-col bg-[#F9F6F0] relative overflow-hidden transition-all ${
            !mobileShowChat ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Top Chat Header */}
          <div className="p-3 sm:p-3.5 bg-white border-b border-warm-200 flex items-center justify-between gap-2 shadow-xs z-10">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Mobile Back Button */}
              <button
                onClick={() => {
                  playClickSound();
                  setMobileShowChat(false);
                }}
                className="md:hidden p-2 text-warm-700 hover:bg-warm-100 rounded-xl transition-colors shrink-0"
                title="वापस सूची में जाएं"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Avatar + Info */}
              <button
                onClick={() => setIsContactDrawerOpen(true)}
                className="flex items-center gap-2.5 text-left group focus:outline-none min-w-0"
                title="प्रोफाइल विवरण देखें"
              >
                <div className="relative shrink-0">
                  <img
                    src={activeConv.participantAvatar}
                    alt={activeConv.participantName}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-cover border-2 border-brand-500 shadow-xs group-hover:ring-2 ring-brand-300 transition-all"
                  />
                  {activeConv.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full ring-1 ring-emerald-300" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-base sm:text-lg text-warm-900 truncate leading-tight font-devanagari group-hover:text-brand-800 transition-colors">
                      {activeConv.participantName}
                    </h3>
                    {activeConv.participantRelation && (
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border shrink-0 ${getRelationBadgeStyle(
                          activeConv.participantRelation
                        )}`}
                      >
                        {activeConv.participantRelation}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-warm-500 font-medium">
                    {activeConv.isOnline ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        ऑनलाइन उपलब्ध हैं
                      </span>
                    ) : (
                      <span className="text-warm-400">अंतिम देखा: आज सुबह</span>
                    )}
                  </div>
                </div>
              </button>
            </div>

            {/* Header Right Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* In-chat Search Toggle */}
              <button
                onClick={() => {
                  playClickSound();
                  setIsInChatSearchOpen(!isInChatSearchOpen);
                  if (isInChatSearchOpen) setInChatSearchQuery('');
                }}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isInChatSearchOpen
                    ? 'bg-brand-100 text-brand-800 border-brand-300'
                    : 'bg-warm-50 hover:bg-warm-100 text-warm-700 border-warm-200'
                }`}
                title="संदेश में खोजें"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* 1-Touch Audio Call Button */}
              <button
                onClick={() => {
                  playClickSound();
                  startCall(
                    'audio',
                    activeConv.participantName,
                    activeConv.participantAvatar,
                    activeConv.participantRelation
                  );
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-95"
                title="कॉल करें"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">कॉल</span>
              </button>

              {/* 1-Touch Video Call Button */}
              <button
                onClick={() => {
                  playClickSound();
                  startCall(
                    'video',
                    activeConv.participantName,
                    activeConv.participantAvatar,
                    activeConv.participantRelation
                  );
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-brand-50 hover:bg-brand-100 border border-brand-300 text-brand-900 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-95"
                title="वीडियो कॉल करें"
              >
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">वीडियो</span>
              </button>

              {/* Contact Info Drawer Toggle */}
              <button
                onClick={() => {
                  playClickSound();
                  setIsContactDrawerOpen(!isContactDrawerOpen);
                }}
                className="p-2.5 bg-warm-50 hover:bg-warm-100 text-warm-700 border border-warm-200 rounded-xl transition-colors"
                title="विवरण देखें"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* In-Chat Search Bar (Dropdown when active) */}
          {isInChatSearchOpen && (
            <div className="bg-white border-b border-warm-200 px-4 py-2.5 flex items-center gap-2 animate-in slide-in-from-top-2 shadow-xs">
              <Search className="w-4 h-4 text-warm-400 shrink-0" />
              <input
                type="text"
                value={inChatSearchQuery}
                onChange={(e) => setInChatSearchQuery(e.target.value)}
                placeholder="इस बातचीत में कोई शब्द खोजें..."
                className="flex-1 text-sm bg-transparent border-none outline-none font-devanagari text-warm-900 placeholder:text-warm-400"
                autoFocus
              />
              {inChatSearchQuery && (
                <span className="text-xs font-bold text-warm-500">
                  {filteredActiveMessages.length} परिणाम
                </span>
              )}
              <button
                onClick={() => {
                  setIsInChatSearchOpen(false);
                  setInChatSearchQuery('');
                }}
                className="text-warm-400 hover:text-warm-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Senior Safety Alert Banner */}
          {showSafetyBanner && (
            <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2 flex items-center justify-between gap-2 text-amber-900 text-xs font-bold animate-in fade-in">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  सुरक्षा नियम: कभी भी किसी संदेश में OTP, पासवर्ड या बैंक खाते की जानकारी न दें।
                </span>
              </div>
              <button
                onClick={() => setShowSafetyBanner(false)}
                className="text-amber-700 hover:text-amber-900 p-1 shrink-0"
                title="छिपाएं"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MESSAGES SCROLL CANVAS                                                    */}
          {/* ========================================================================= */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Centered Date Pill */}
            <div className="flex justify-center my-2">
              <span className="bg-warm-200/70 text-warm-700 text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
                आज • 30 अगस्त
              </span>
            </div>

            {filteredActiveMessages.map((msg) => {
              const isMe = msg.senderId === currentUser?.id;
              const isSpeaking = speakingMsgId === msg.id;
              const isPlayingVoice = playingVoiceId === msg.id;
              const reactions = messageReactions[msg.id] || [];

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 group ${
                    isMe ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {/* Left Avatar for other participant */}
                  {!isMe && (
                    <img
                      src={activeConv.participantAvatar}
                      alt={activeConv.participantName}
                      className="w-8 h-8 rounded-full object-cover border border-warm-200 shrink-0 shadow-2xs mb-1"
                    />
                  )}

                  <div className="relative max-w-[85%] sm:max-w-md">
                    {/* Message Bubble Card */}
                    <div
                      className={`rounded-3xl p-4 shadow-soft space-y-2 relative transition-all ${
                        isMe
                          ? 'bg-gradient-to-r from-brand-800 to-purple-800 text-white rounded-br-none'
                          : 'bg-white text-warm-900 border border-warm-200/90 rounded-bl-none'
                      }`}
                    >
                      {/* Attached Image */}
                      {msg.imageUrl && (
                        <div
                          onClick={() => setLightboxImage(msg.imageUrl || null)}
                          className="rounded-2xl overflow-hidden cursor-pointer group/img relative"
                        >
                          <img
                            src={msg.imageUrl}
                            alt="Attached"
                            className="w-full h-auto object-cover max-h-64 rounded-2xl group-hover/img:scale-102 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Maximize2 className="w-6 h-6 drop-shadow-md" />
                          </div>
                        </div>
                      )}

                      {/* Attached Voice Note Player */}
                      {msg.isVoiceNote ? (
                        <div
                          className={`flex items-center gap-3 p-3 rounded-2xl ${
                            isMe
                              ? 'bg-white/15 text-white'
                              : 'bg-brand-50 text-brand-900 border border-brand-100'
                          }`}
                        >
                          <button
                            onClick={() => handleTogglePlayVoice(msg.id)}
                            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95 ${
                              isPlayingVoice
                                ? 'bg-amber-500 text-white animate-pulse'
                                : isMe
                                ? 'bg-white text-brand-800'
                                : 'bg-brand-700 text-white'
                            }`}
                            title={isPlayingVoice ? 'रोकें' : 'सुनें'}
                          >
                            {isPlayingVoice ? (
                              <Pause className="w-5 h-5" />
                            ) : (
                              <Play className="w-5 h-5 ml-0.5" />
                            )}
                          </button>

                          <div className="flex-1">
                            <div className="flex items-center justify-between text-xs font-bold mb-1">
                              <span>वॉइस संदेश ({msg.audioDuration || 12}s)</span>
                              <span>{isPlayingVoice ? 'बज रहा है...' : '0:00'}</span>
                            </div>

                            {/* Animated Audio Waveform */}
                            <div className="flex items-center gap-1 h-5">
                              {[35, 75, 45, 95, 60, 100, 50, 80, 65, 90, 40, 70].map(
                                (h, i) => (
                                  <span
                                    key={i}
                                    className={`w-1 rounded-full transition-all duration-300 ${
                                      isPlayingVoice
                                        ? isMe
                                          ? 'bg-white animate-wave'
                                          : 'bg-brand-600 animate-wave'
                                        : isMe
                                        ? 'bg-white/60'
                                        : 'bg-brand-300'
                                    }`}
                                    style={{
                                      height: `${isPlayingVoice ? Math.min(100, h + 10) : h}%`,
                                      animationDelay: `${i * 0.08}s`,
                                    }}
                                  />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Text Message */
                        <p className="text-base sm:text-[17px] leading-relaxed font-devanagari font-medium whitespace-pre-wrap">
                          {msg.text}
                        </p>
                      )}

                      {/* Message Footer: Time + TTS Read Aloud + Status Tick */}
                      <div
                        className={`flex items-center justify-between gap-2 pt-1 text-[11px] font-bold border-t ${
                          isMe
                            ? 'border-white/10 text-purple-200'
                            : 'border-warm-100 text-warm-400'
                        }`}
                      >
                        {/* Text-To-Speech Speaker Button for Seniors */}
                        {!msg.isVoiceNote && msg.text && (
                          <button
                            onClick={() => handleToggleSpeak(msg.id, msg.text)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg transition-colors text-[10px] font-extrabold ${
                              isSpeaking
                                ? 'bg-amber-400 text-amber-950 animate-pulse'
                                : isMe
                                ? 'bg-white/15 text-white hover:bg-white/25'
                                : 'bg-warm-100 text-warm-700 hover:bg-brand-100 hover:text-brand-800'
                            }`}
                            title="संदेश को बोलकर सुनें"
                          >
                            {isSpeaking ? (
                              <>
                                <VolumeX className="w-3 h-3" />
                                <span>रोकें</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3 text-brand-600" />
                                <span>बोलकर सुनें</span>
                              </>
                            )}
                          </button>
                        )}

                        <div className="flex items-center gap-1.5 ml-auto">
                          <span>{msg.createdAt}</span>
                          {isMe && <CheckCheck className="w-4 h-4 text-saffron-300" />}
                        </div>
                      </div>
                    </div>

                    {/* Emoji Reactions Attached to Message */}
                    {reactions.length > 0 && (
                      <div
                        className={`absolute -bottom-2.5 flex items-center gap-1 bg-white border border-warm-200 px-2 py-0.5 rounded-full shadow-xs text-xs z-1 ${
                          isMe ? 'right-2' : 'left-2'
                        }`}
                      >
                        {reactions.map((emoji, idx) => (
                          <span key={idx}>{emoji}</span>
                        ))}
                      </div>
                    )}

                    {/* Quick Reaction Hover Bar */}
                    <div
                      className={`absolute -top-3 hidden group-hover:flex items-center gap-1 bg-white border border-warm-200 px-2 py-1 rounded-full shadow-md z-10 transition-all ${
                        isMe ? 'right-0' : 'left-0'
                      }`}
                    >
                      {['❤️', '🙏', '🌸', '👍', '😊'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleAddReaction(msg.id, emoji)}
                          className="hover:scale-125 transition-transform text-sm p-0.5"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* ========================================================================= */}
          {/* QUICK BLESSINGS & REPLIES SCROLLBAR                                       */}
          {/* ========================================================================= */}
          <div className="px-3 sm:px-4 py-2 bg-white/90 border-t border-warm-200/80 flex items-center gap-2 overflow-x-auto scrollbar-none backdrop-blur-xs">
            <span className="text-[11px] font-extrabold text-brand-800 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              त्वरित संदेश:
            </span>
            {BLESSING_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickBlessing(chip)}
                className="px-3 py-1.5 bg-warm-100 hover:bg-brand-50 hover:text-brand-800 hover:border-brand-300 border border-warm-200 rounded-xl text-xs font-bold text-warm-800 whitespace-nowrap transition-all shadow-2xs active:scale-95"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* ========================================================================= */}
          {/* MULTI-CATEGORY EMOJI & BLESSING PICKER DRAWER                             */}
          {/* ========================================================================= */}
          {isEmojiPickerOpen && (
            <div className="bg-white border-t border-warm-200 p-3 shadow-md animate-in slide-in-from-bottom-2 z-20">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-warm-100">
                <div className="flex items-center gap-2">
                  {(Object.keys(EMOJI_CATEGORIES) as Array<keyof typeof EMOJI_CATEGORIES>).map(
                    (catKey) => (
                      <button
                        key={catKey}
                        onClick={() => setEmojiCategory(catKey)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          emojiCategory === catKey
                            ? 'bg-brand-700 text-white'
                            : 'bg-warm-100 text-warm-700 hover:bg-warm-200'
                        }`}
                      >
                        {EMOJI_CATEGORIES[catKey].label}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={() => setIsEmojiPickerOpen(false)}
                  className="text-warm-400 hover:text-warm-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 px-1 max-h-32 overflow-y-auto">
                {EMOJI_CATEGORIES[emojiCategory].emojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputMessage((prev) => `${prev} ${emoji}`);
                    }}
                    className="text-2xl hover:scale-125 transition-transform p-1.5 rounded-xl hover:bg-warm-100"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PRESET PHOTO SELECTOR MODAL / DRAWER                                      */}
          {/* ========================================================================= */}
          {isPhotoPickerOpen && (
            <div className="bg-white border-t border-warm-200 p-4 shadow-md animate-in slide-in-from-bottom-2 z-20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-extrabold text-sm text-warm-900 font-devanagari">
                    सुंदर तस्वीरें व शुभकामनाएं भेजें
                  </h4>
                </div>
                <button
                  onClick={() => setIsPhotoPickerOpen(false)}
                  className="text-warm-400 hover:text-warm-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PRESET_PHOTOS.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendPhoto(photo.url, photo.caption)}
                    className="group border border-warm-200 rounded-2xl overflow-hidden text-left hover:border-brand-500 hover:shadow-md transition-all focus:outline-none bg-warm-50"
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="p-2">
                      <span className="text-xs font-bold text-warm-800 block truncate">
                        {photo.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* LIVE VOICE RECORDING ACTIVE OVERLAY                                       */}
          {/* ========================================================================= */}
          {isVoiceRecording ? (
            <div className="p-3 sm:p-4 bg-rose-50 border-t-2 border-rose-400 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center animate-ping">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-rose-900 font-devanagari">
                    वॉइस नोट रिकॉर्ड हो रहा है...
                  </h4>
                  <p className="text-xs text-rose-700 font-bold">
                    समय: 0:0{recordingSeconds}s
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelVoiceRecording}
                  className="px-4 py-2 bg-warm-200 hover:bg-warm-300 text-warm-800 font-bold text-xs rounded-xl transition-colors"
                >
                  रद्द करें
                </button>
                <button
                  type="button"
                  onClick={handleToggleVoiceNote}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>भेजें</span>
                </button>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* BOTTOM INPUT BAR FORM                                                     */
            /* ========================================================================= */
            <form
              onSubmit={handleSend}
              className="p-3 sm:p-4 bg-white border-t border-warm-200 flex items-center gap-2"
            >
              {/* Emoji Picker Button */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setIsEmojiPickerOpen(!isEmojiPickerOpen);
                  setIsPhotoPickerOpen(false);
                }}
                className={`p-2.5 rounded-xl transition-colors shrink-0 ${
                  isEmojiPickerOpen
                    ? 'bg-brand-100 text-brand-800'
                    : 'text-warm-600 hover:text-warm-900 hover:bg-warm-100'
                }`}
                title="इमोजी व आशीर्वाद"
              >
                <Smile className="w-6 h-6" />
              </button>

              {/* Photo Attachment Button */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setIsPhotoPickerOpen(!isPhotoPickerOpen);
                  setIsEmojiPickerOpen(false);
                }}
                className={`p-2.5 rounded-xl transition-colors shrink-0 ${
                  isPhotoPickerOpen
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'text-warm-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
                title="फोटो या शुभकामना भेजें"
              >
                <Image className="w-6 h-6 text-emerald-600" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="यहाँ संदेश लिखें या बोलें..."
                className="flex-1 px-4 py-3 bg-warm-50 border border-warm-300 rounded-2xl text-base focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all font-devanagari text-warm-900 placeholder:text-warm-400"
              />

              {/* Voice Recording / Send Action Button */}
              {inputMessage.trim() ? (
                <button
                  type="submit"
                  className="p-3.5 bg-gradient-to-r from-brand-800 to-brand-600 hover:from-brand-900 hover:to-brand-700 text-white rounded-2xl shadow-md active:scale-95 transition-all shrink-0 flex items-center justify-center"
                  title="संदेश भेजें"
                >
                  <Send className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleToggleVoiceNote}
                  className="p-3.5 bg-brand-700 hover:bg-brand-800 text-white rounded-2xl shadow-md active:scale-95 transition-all shrink-0 flex items-center justify-center"
                  title="वॉइस नोट रिकॉर्ड करें"
                >
                  <Mic className="w-5 h-5" />
                </button>
              )}
            </form>
          )}

          {/* ========================================================================= */}
          {/* CONTACT INFO SLIDE-OUT DRAWER                                             */}
          {/* ========================================================================= */}
          {isContactDrawerOpen && (
            <div className="absolute inset-y-0 right-0 w-full sm:w-80 bg-white border-l border-warm-200 shadow-2xl z-30 flex flex-col animate-in slide-in-from-right duration-200">
              <div className="p-4 border-b border-warm-200 flex items-center justify-between bg-warm-50">
                <h3 className="font-extrabold text-base text-warm-900 font-devanagari">
                  संपर्क विवरण
                </h3>
                <button
                  onClick={() => setIsContactDrawerOpen(false)}
                  className="text-warm-500 hover:text-warm-800 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 text-center space-y-4">
                <img
                  src={activeConv.participantAvatar}
                  alt={activeConv.participantName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-brand-500 shadow-md mx-auto"
                />

                <div>
                  <h4 className="font-extrabold text-xl text-warm-900 font-devanagari">
                    {activeConv.participantName}
                  </h4>
                  {activeConv.participantRelation && (
                    <span
                      className={`inline-block mt-1 text-xs font-extrabold px-3 py-1 rounded-full border ${getRelationBadgeStyle(
                        activeConv.participantRelation
                      )}`}
                    >
                      संबंध: {activeConv.participantRelation}
                    </span>
                  )}
                </div>

                {/* Call Shortcuts */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => {
                      setIsContactDrawerOpen(false);
                      startCall(
                        'audio',
                        activeConv.participantName,
                        activeConv.participantAvatar,
                        activeConv.participantRelation
                      );
                    }}
                    className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-2xl flex flex-col items-center gap-1 text-emerald-800 font-bold text-xs"
                  >
                    <Phone className="w-5 h-5 text-emerald-600" />
                    <span>ऑडियो कॉल</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsContactDrawerOpen(false);
                      startCall(
                        'video',
                        activeConv.participantName,
                        activeConv.participantAvatar,
                        activeConv.participantRelation
                      );
                    }}
                    className="p-3 bg-brand-50 hover:bg-brand-100 border border-brand-300 rounded-2xl flex flex-col items-center gap-1 text-brand-900 font-bold text-xs"
                  >
                    <Video className="w-5 h-5 text-brand-700" />
                    <span>वीडियो कॉल</span>
                  </button>
                </div>

                {/* Security Advice in Contact */}
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-left space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>सुरक्षित व सत्यापित संपर्क</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    यह संपर्क आपके पारिवारिक नेटवर्क से जुड़ा हुआ है।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* FULLSCREEN IMAGE LIGHTBOX MODAL                                           */}
          {/* ========================================================================= */}
          {lightboxImage && (
            <div
              onClick={() => setLightboxImage(null)}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
            >
              <div className="relative max-w-3xl max-h-[90vh] bg-black rounded-3xl overflow-hidden border border-white/20">
                <img
                  src={lightboxImage}
                  alt="Expanded"
                  className="w-full h-auto max-h-[85vh] object-contain"
                />
                <button
                  onClick={() => setLightboxImage(null)}
                  className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-warm-500 bg-[#F9F6F0]">
          <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mb-3">
            <MessageCircle className="w-8 h-8" />
          </div>
          <p className="text-lg font-bold font-devanagari text-warm-800">
            बातचीत शुरू करने के लिए बाईं ओर से किसी प्रियजन को चुनें।
          </p>
          <p className="text-xs text-warm-500 mt-1 max-w-sm">
            आप अपने परिवार व मित्रों को सीधे संदेश, वॉइस नोट या तस्वीरें भेज सकते हैं।
          </p>
        </div>
      )}

    </div>
  );
};

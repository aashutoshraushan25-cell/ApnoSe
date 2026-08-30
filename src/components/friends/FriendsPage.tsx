import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Search, UserPlus, Users, MessageCircle, MapPin, Check, X, Sparkles, Heart } from 'lucide-react';

interface SuggestedFriend {
  id: string;
  name: string;
  age: number;
  location: string;
  avatar: string;
  mutualFriends: number;
  interests: string[];
  isRequested?: boolean;
}

const INITIAL_SUGGESTIONS: SuggestedFriend[] = [
  {
    id: 'sug-1',
    name: 'प्रोफ़ेसर अनिल बाजपेयी',
    age: 56,
    location: 'वाराणसी (आपके मूल शहर से)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    mutualFriends: 4,
    interests: ['साहित्य', 'अध्यात्म', 'बनारसी संस्कृति'],
  },
  {
    id: 'sug-2',
    name: 'श्रीमती मंजू श्रीवास्तव',
    age: 52,
    location: 'नई दिल्ली (आपके क्षेत्र से)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    mutualFriends: 6,
    interests: ['गृह वाटिका', 'पारंपरिक रसोई', 'भजन'],
  },
  {
    id: 'sug-3',
    name: 'डॉ. हरीश चंद्र माथुर',
    age: 60,
    location: 'लखनऊ, उत्तर प्रदेश',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    mutualFriends: 2,
    interests: ['आयुर्वेद', 'स्वास्थ्य', 'योग'],
  },
  {
    id: 'sug-4',
    name: 'श्रीमती नीलिमा सेनगुप्ता',
    age: 49,
    location: 'कोलकाता / नई दिल्ली',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    mutualFriends: 3,
    interests: ['रवींद्र संगीत', 'बागवानी', 'किताबें'],
  },
];

interface FriendRequestItem {
  id: string;
  name: string;
  age: number;
  location: string;
  avatar: string;
  mutualCount: number;
  timeAgo: string;
}

const INITIAL_REQUESTS: FriendRequestItem[] = [
  {
    id: 'req-1',
    name: 'सुभाष चंद्र जोशी',
    age: 55,
    location: 'देहरादून, उत्तराखंड',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    mutualCount: 5,
    timeAgo: 'कल',
  },
  {
    id: 'req-2',
    name: 'श्रीमती सरोजिनी पांडेय',
    age: 51,
    location: 'प्रयागराज, उत्तर प्रदेश',
    avatar: 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?auto=format&fit=crop&q=80&w=400',
    mutualCount: 3,
    timeAgo: '3 दिन पहले',
  },
];

export const FriendsPage: React.FC = () => {
  const { t } = useLanguage();
  const { showToast, setActiveConversationId, setActiveTab } = useApp();

  const [activeTab, setActiveFriendsTab] = useState<'suggestions' | 'requests' | 'my_friends'>('suggestions');
  const [searchFilter, setSearchFilter] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestedFriend[]>(INITIAL_SUGGESTIONS);
  const [requests, setRequests] = useState<FriendRequestItem[]>(INITIAL_REQUESTS);
  const [myFriends, setMyFriends] = useState([
    {
      id: 'mf-1',
      name: 'सुरेश वर्मा',
      age: 58,
      location: 'लखनऊ',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
      relation: 'घनिष्ठ मित्र',
    },
    {
      id: 'mf-2',
      name: 'मीनाक्षी शर्मा',
      age: 48,
      location: 'जयपुर',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      relation: 'मित्र',
    },
  ]);

  const handleSendRequest = (id: string, name: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isRequested: true } : s))
    );
    showToast(`${name} को मित्र अनुरोध भेजा गया! 🤝`);
  };

  const handleAcceptRequest = (req: FriendRequestItem) => {
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
    setMyFriends((prev) => [
      ...prev,
      {
        id: req.id,
        name: req.name,
        age: req.age,
        location: req.location,
        avatar: req.avatar,
        relation: 'नया मित्र',
      },
    ]);
    showToast(`${req.name} अब आपके मित्र हैं! 🎉`);
  };

  const handleDeclineRequest = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    showToast('अनुरोध हटा दिया गया।');
  };

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.location.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-brand-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-purple-700">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-saffron-300 border border-white/15">
            <Users className="w-3.5 h-3.5" />
            <span>समान रुचि और शहर के 40+ साथी</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-devanagari tracking-tight">
            दोस्त व संगी-साथी (Friends Network)
          </h1>
          <p className="text-purple-100 text-base font-medium">
            अपने पुराने स्कूल-कॉलेज के दोस्तों और समान रुचि वाले नए साथियों से आसानी से जुड़ें।
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-xl">
        <Search className="w-5 h-5 text-warm-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="नाम या शहर से दोस्त खोजें (जैसे: वाराणसी, लखनऊ, अनिल)..."
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-warm-300 rounded-2xl text-base shadow-xs focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all font-devanagari"
        />
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 border-b border-warm-200">
        <button
          onClick={() => setActiveFriendsTab('suggestions')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-base transition-all whitespace-nowrap ${
            activeTab === 'suggestions'
              ? 'bg-brand-800 text-white shadow-soft'
              : 'bg-white hover:bg-warm-100 text-warm-700 border border-warm-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-saffron-300" />
          <span>सुझाए गए साथी ({suggestions.length})</span>
        </button>

        <button
          onClick={() => setActiveFriendsTab('requests')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-base transition-all whitespace-nowrap ${
            activeTab === 'requests'
              ? 'bg-brand-800 text-white shadow-soft'
              : 'bg-white hover:bg-warm-100 text-warm-700 border border-warm-200'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>मित्र अनुरोध ({requests.length})</span>
        </button>

        <button
          onClick={() => setActiveFriendsTab('my_friends')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-base transition-all whitespace-nowrap ${
            activeTab === 'my_friends'
              ? 'bg-brand-800 text-white shadow-soft'
              : 'bg-white hover:bg-warm-100 text-warm-700 border border-warm-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>मेरे जुड़े हुए दोस्त ({myFriends.length})</span>
        </button>
      </div>

      {/* Tab Content: Suggested Friends */}
      {activeTab === 'suggestions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSuggestions.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 shadow-soft border border-warm-200/80 hover:border-brand-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-18 h-18 rounded-full object-cover border-2 border-brand-500 shadow-sm shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg sm:text-xl text-warm-900 truncate">
                      {item.name}
                    </h3>
                    <span className="text-xs bg-warm-100 text-warm-700 font-bold px-2 py-0.5 rounded-md shrink-0">
                      {item.age} वर्ष
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-warm-600 font-medium mt-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>

                  <p className="text-xs text-warm-500 font-bold mt-1">
                    👥 {item.mutualFriends} साझा परिचित मित्र
                  </p>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.interests.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-bold bg-purple-50 text-brand-800 border border-purple-200 px-2 py-0.5 rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-warm-100">
                <button
                  onClick={() => handleSendRequest(item.id, item.name)}
                  disabled={item.isRequested}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-extrabold text-base transition-all ${
                    item.isRequested
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 cursor-default'
                      : 'bg-gradient-to-r from-brand-800 to-brand-600 hover:from-brand-900 hover:to-brand-700 text-white shadow-soft active:scale-95'
                  }`}
                >
                  {item.isRequested ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>अनुरोध भेजा गया (Pending)</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>+ मित्र बनाएं (Add Friend)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-warm-200">
              <Users className="w-12 h-12 text-warm-300 mx-auto mb-2" />
              <p className="text-lg font-bold text-warm-700 font-devanagari">
                फिलहाल कोई नया मित्र अनुरोध लंबित नहीं है।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl p-5 shadow-soft border border-warm-200 space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={req.avatar}
                      alt={req.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-brand-500 shadow-sm"
                    />
                    <div>
                      <h3 className="font-extrabold text-lg text-warm-900">
                        {req.name} ({req.age} वर्ष)
                      </h3>
                      <p className="text-xs text-warm-500 font-medium">
                        📍 {req.location} • {req.mutualCount} साझा मित्र
                      </p>
                      <p className="text-[11px] text-warm-400 mt-0.5">
                        अनुरोध आया: {req.timeAgo}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-warm-100">
                    <button
                      onClick={() => handleAcceptRequest(req)}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-sm transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>स्वीकार करें</span>
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(req.id)}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-warm-100 hover:bg-warm-200 text-warm-700 font-bold text-sm transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>हटाएं</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: My Friends */}
      {activeTab === 'my_friends' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {myFriends.map((friend) => (
            <div
              key={friend.id}
              className="bg-white rounded-3xl p-5 shadow-soft border border-warm-200 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-brand-500 shadow-sm"
                />
                <div>
                  <h3 className="font-extrabold text-lg text-warm-900">
                    {friend.name}
                  </h3>
                  <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                    {friend.relation}
                  </span>
                  <p className="text-xs text-warm-500 mt-1">📍 {friend.location}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveConversationId('conv-suresh');
                  setActiveTab('messages');
                }}
                className="flex items-center gap-1.5 bg-brand-50 hover:bg-brand-100 text-brand-900 font-bold px-4 py-2.5 rounded-2xl border border-brand-200 transition-colors shrink-0"
              >
                <MessageCircle className="w-4 h-4 text-brand-700" />
                <span>संदेश</span>
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

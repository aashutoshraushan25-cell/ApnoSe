import React, { useState } from 'react';
import { Community, Post } from '../../types';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { PostCard } from '../feed/PostCard';
import {
  X,
  Users,
  Check,
  Plus,
  Send,
  Sparkles,
  ShieldCheck,
  MapPin,
  Heart,
} from 'lucide-react';

interface CommunityDetailModalProps {
  community: Community | null;
  onClose: () => void;
}

export const CommunityDetailModal: React.FC<CommunityDetailModalProps> = ({
  community,
  onClose,
}) => {
  const { posts, toggleJoinCommunity, createPost } = useApp();
  const { currentUser } = useAuth();

  const [groupPostText, setGroupPostText] = useState('');

  if (!community) return null;

  const communityPosts = posts.filter(
    (p) => p.communityId === community.id || p.text.includes(community.nameHi.slice(0, 4))
  );

  const handleGroupPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupPostText.trim()) return;

    createPost({
      text: groupPostText.trim(),
      audience: 'everyone',
      communityId: community.id,
      feeling: { emoji: community.icon, textHi: community.nameHi.slice(0, 10), textEn: 'Group Post' },
    });

    setGroupPostText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-warm-900/65 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-soft-xl border border-warm-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Cover Photo & Group Title Banner */}
        <div className="relative h-48 sm:h-60 shrink-0">
          <img
            src={community.coverImage}
            alt={community.nameHi}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{community.icon}</span>
                <span className="text-xs bg-brand-600 font-bold px-2.5 py-0.5 rounded-full">
                  {community.categoryLabelHi}
                </span>
                {community.location && (
                  <span className="text-xs bg-black/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{community.location}</span>
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-devanagari">
                {community.nameHi}
              </h2>
              <p className="text-xs text-purple-200 font-bold">
                👥 {(community.memberCount).toLocaleString('en-IN')} सदस्य जुड़े हैं
              </p>
            </div>

            {/* Join / Leave Button */}
            <button
              onClick={() => toggleJoinCommunity(community.id)}
              className={`px-6 py-3 rounded-2xl font-extrabold text-base shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 ${
                community.isMember
                  ? 'bg-white text-emerald-800 border-2 border-emerald-500'
                  : 'bg-saffron-500 hover:bg-saffron-600 text-warm-900'
              }`}
            >
              {community.isMember ? (
                <>
                  <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />
                  <span>जुड़े हुए हैं (Joined)</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 stroke-[3]" />
                  <span>+ समूह में जुड़ें</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Group Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-warm-50">
          
          {/* Description & Rules Box */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-warm-200 space-y-2">
            <h3 className="font-extrabold text-base text-warm-900">समूह के बारे में:</h3>
            <p className="text-base text-warm-700 font-medium leading-relaxed font-devanagari">
              {community.descriptionHi}
            </p>
            {community.rules && community.rules.length > 0 && (
              <div className="pt-2 border-t border-warm-100 mt-2">
                <span className="text-xs font-bold text-warm-500 block mb-1">
                  🛡️ समूह के मर्यादा नियम:
                </span>
                <ul className="list-disc list-inside text-xs text-warm-600 space-y-0.5">
                  {community.rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Group Post Composer (if member) */}
          {community.isMember && (
            <form onSubmit={handleGroupPost} className="bg-white rounded-2xl p-4 shadow-xs border border-warm-200 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="w-10 h-10 rounded-full object-cover border border-brand-500"
                />
                <input
                  type="text"
                  value={groupPostText}
                  onChange={(e) => setGroupPostText(e.target.value)}
                  placeholder={`"${community.nameHi}" समूह में अपनी राय या अनुभव साझा करें...`}
                  className="flex-1 px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-base font-devanagari focus:bg-white focus:border-brand-500"
                />
                <button
                  type="submit"
                  disabled={!groupPostText.trim()}
                  className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 disabled:opacity-40 text-white font-bold rounded-xl text-sm flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>साझा करें</span>
                </button>
              </div>
            </form>
          )}

          {/* Group Discussions / Feed */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-lg text-warm-900 font-devanagari flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-saffron-500" />
              <span>समूह की नई चर्चाएं ({communityPosts.length})</span>
            </h3>

            {communityPosts.length > 0 ? (
              communityPosts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center border border-warm-200">
                <p className="text-warm-600 font-medium font-devanagari">
                  इस समूह में अभी पहली पोस्ट आप साझा कर सकते हैं! 🌸
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

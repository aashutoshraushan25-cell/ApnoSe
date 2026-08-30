import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Post } from '../../types';
import { VoicePostPlayer } from './VoicePostPlayer';
import { CommentSection } from './CommentSection';
import { SpeechService } from '../../services/speechService';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MapPin,
  Globe,
  Users,
  Lock,
  Volume2,
  Sparkles,
  Check,
} from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { t, language } = useLanguage();
  const { toggleLikePost, toggleSavePost, showToast } = useApp();

  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReadingAloud, setIsReadingAloud] = useState(false);

  const handleReadAloud = () => {
    if (isReadingAloud) {
      SpeechService.stopSpeaking();
      setIsReadingAloud(false);
    } else {
      setIsReadingAloud(true);
      const textToRead = `${post.authorName} कहते हैं: ${post.text}`;
      SpeechService.speakText(textToRead, language).then(() => {
        setIsReadingAloud(false);
      });
    }
  };

  const handleShareOnWhatsApp = () => {
    const text = encodeURIComponent(`"अपनों से" पर ${post.authorName} की सुंदर पोस्ट:\n\n${post.text}\n\nआप भी जुड़ें: https://apnose.in`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    setIsShareModalOpen(false);
    showToast('पोस्ट साझा करने के लिए लिंक खोला गया! 📲');
  };

  return (
    <article className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft border border-warm-200/80 mb-6 transition-all hover:border-brand-200">
      
      {/* Post Author Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3.5">
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-brand-500 shadow-sm shrink-0"
          />
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="font-extrabold text-lg sm:text-xl text-warm-900 leading-tight">
                {post.authorName}
              </h3>
              {post.authorRelation && (
                <span className="text-xs font-bold text-brand-800 bg-brand-100/80 border border-brand-200 px-2.5 py-0.5 rounded-full">
                  {post.authorRelation}
                </span>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-2 text-xs text-warm-500 font-medium mt-1">
              <span>{post.createdAt}</span>
              {post.location && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-warm-600">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{post.location}</span>
                  </span>
                </>
              )}
              {post.communityName && (
                <>
                  <span>•</span>
                  <span className="font-bold text-brand-700 bg-purple-50 px-2 py-0.5 rounded-md">
                    {post.communityName}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Read Post Aloud Audio Button for 40+ Comfort */}
        <button
          onClick={handleReadAloud}
          title={isReadingAloud ? 'पढ़ना रोकें' : 'पोस्ट को बोलकर सुनें (Read Aloud)'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shrink-0 ${
            isReadingAloud
              ? 'bg-brand-700 text-white border-brand-800 animate-pulse'
              : 'bg-warm-100 hover:bg-brand-50 text-warm-700 hover:text-brand-900 border-warm-200'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span className="hidden sm:inline">{isReadingAloud ? 'सुन रहे हैं...' : 'सुनें 🔊'}</span>
        </button>
      </div>

      {/* Feeling Tag Banner if attached */}
      {post.feeling && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold mb-3">
          <span>{post.feeling.emoji}</span>
          <span>{post.feeling.textHi}</span>
        </div>
      )}

      {/* Main Post Text with Large Typography */}
      <p className="text-lg sm:text-xl text-warm-900 font-normal leading-relaxed whitespace-pre-line mb-4 font-devanagari">
        {post.text}
      </p>

      {/* Voice Recording Player if attached */}
      {post.audioUrl && (
        <VoicePostPlayer
          duration={post.audioDuration || 35}
          waveform={post.audioWaveform}
          authorName={post.authorName}
        />
      )}

      {/* Post Images Gallery */}
      {post.images && post.images.length > 0 && (
        <div className={`grid gap-2 mb-4 rounded-3xl overflow-hidden ${
          post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
        }`}>
          {post.images.map((img, i) => (
            <div key={i} className="relative group overflow-hidden bg-warm-100 max-h-[420px]">
              <img
                src={img}
                alt="Post attachment"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 rounded-2xl"
              />
            </div>
          ))}
        </div>
      )}

      {/* Post Interaction Bar (Like, Comment, Share, Save) with Simple Hindi Labels */}
      <div className="flex items-center justify-between pt-3 border-t border-warm-100 gap-1 sm:gap-2">
        
        {/* Like */}
        <button
          onClick={() => toggleLikePost(post.id)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 sm:px-4 rounded-2xl font-bold text-sm sm:text-base transition-all ${
            post.likedByMe
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'hover:bg-warm-100 text-warm-700'
          }`}
        >
          <Heart
            className={`w-5 h-5 ${
              post.likedByMe ? 'fill-current text-rose-500 scale-110' : 'text-warm-500'
            }`}
          />
          <span>{post.likesCount > 0 ? `${post.likesCount} पसंद` : t.like}</span>
        </button>

        {/* Comment */}
        <button
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 sm:px-4 rounded-2xl font-bold text-sm sm:text-base transition-all ${
            isCommentsOpen
              ? 'bg-brand-50 text-brand-900 border border-brand-200'
              : 'hover:bg-warm-100 text-warm-700'
          }`}
        >
          <MessageCircle className="w-5 h-5 text-warm-500" />
          <span>{post.commentsCount > 0 ? `${post.commentsCount} टिप्पणियां` : t.comment}</span>
        </button>

        {/* Share */}
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-2 sm:px-4 rounded-2xl hover:bg-warm-100 text-warm-700 font-bold text-sm sm:text-base transition-all"
        >
          <Share2 className="w-5 h-5 text-warm-500" />
          <span className="hidden sm:inline">{t.share}</span>
        </button>

        {/* Save to Memories */}
        <button
          onClick={() => toggleSavePost(post.id)}
          title="यादों में सहेजें (Save to Memories)"
          className={`p-3 rounded-2xl transition-all ${
            post.savedByMe
              ? 'bg-amber-50 text-amber-600 border border-amber-200 font-bold'
              : 'hover:bg-warm-100 text-warm-500'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${post.savedByMe ? 'fill-current text-amber-500' : ''}`} />
        </button>

      </div>

      {/* Expandable Comment Section */}
      {isCommentsOpen && <CommentSection postId={post.id} />}

      {/* Share Modal Drawer */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-soft-xl border border-warm-200 space-y-4 animate-in zoom-in-95">
            <h4 className="font-extrabold text-xl text-warm-900 font-devanagari text-center">
              यह पोस्ट किसके साथ साझा करें?
            </h4>
            <div className="space-y-2">
              <button
                onClick={handleShareOnWhatsApp}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-base shadow-md transition-colors"
              >
                <span>📲 व्हाट्सएप पर साझा करें</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast('पोस्ट का लिंक कॉपी कर लिया गया! 📋');
                  setIsShareModalOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-warm-100 hover:bg-warm-200 text-warm-800 rounded-2xl font-bold text-base transition-colors"
              >
                <span>📋 लिंक कॉपी करें</span>
              </button>
            </div>
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="w-full py-2 text-center text-sm font-bold text-warm-500 hover:text-warm-900"
            >
              रद्द करें
            </button>
          </div>
        </div>
      )}

    </article>
  );
};

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Comment } from '../../types';
import { Send, Heart, Smile, Mic, Sparkles } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
}

const QUICK_EMOJI_BLESSINGS = ['🙏 सादर प्रणाम', '❤️ ढेर सारा प्यार', '🌸 शुभ आशीर्वाद', '👏 बहुत उत्तम', '💐 शुभकामनाएं'];

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const { getCommentsForPost, addComment } = useApp();

  const [commentText, setCommentText] = useState('');
  const comments = getCommentsForPost(postId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(postId, commentText.trim());
    setCommentText('');
  };

  const handleAddEmojiBlessing = (text: string) => {
    setCommentText((prev) => (prev ? `${prev} ${text}` : text));
  };

  return (
    <div className="pt-4 mt-4 border-t border-warm-100 space-y-4">
      
      {/* Existing Comments List */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-3 bg-warm-50/80 p-3.5 rounded-2xl border border-warm-100">
            <img
              src={comment.authorAvatar}
              alt={comment.authorName}
              className="w-10 h-10 rounded-full object-cover border border-brand-400 shrink-0"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-warm-900">
                    {comment.authorName}
                  </span>
                  {comment.authorRelation && (
                    <span className="text-[10px] font-bold text-brand-700 bg-brand-100/70 px-2 py-0.5 rounded-full">
                      {comment.authorRelation}
                    </span>
                  )}
                </div>
                <span className="text-xs text-warm-400">{comment.createdAt}</span>
              </div>

              <p className="text-base text-warm-800 font-medium leading-relaxed font-devanagari">
                {comment.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Blessing Buttons for 1-Click Response */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {QUICK_EMOJI_BLESSINGS.map((blessing, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleAddEmojiBlessing(blessing)}
            className="text-xs font-bold bg-warm-100 hover:bg-brand-50 hover:text-brand-900 border border-warm-200 text-warm-700 px-2.5 py-1 rounded-xl transition-colors"
          >
            {blessing}
          </button>
        ))}
      </div>

      {/* Write Comment Form */}
      <form onSubmit={handleSend} className="flex items-center gap-2">
        <img
          src={currentUser?.avatar}
          alt={currentUser?.name}
          className="w-10 h-10 rounded-full object-cover border border-brand-400 shrink-0 hidden sm:block"
        />
        <div className="flex-1 relative">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="अपनी टिप्पणी या आशीर्वाद यहाँ लिखें..."
            className="w-full pl-4 pr-12 py-3 bg-white border border-warm-300 rounded-2xl text-base focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all text-warm-900 placeholder:text-warm-400 font-devanagari"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shadow-xs transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

    </div>
  );
};

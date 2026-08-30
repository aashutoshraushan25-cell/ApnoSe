import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Image, Video, Mic, Smile, Send } from 'lucide-react';

export const CreatePostCard: React.FC = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const { setIsCreatePostOpen, setIsVoicePostOpen } = useApp();

  return (
    <div className="bg-white rounded-3xl p-5 shadow-soft border border-warm-200/80 mb-6">
      
      {/* Top Input Trigger */}
      <div className="flex items-center gap-3 pb-4 border-b border-warm-100">
        <img
          src={currentUser?.avatar}
          alt={currentUser?.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-brand-500 shadow-sm shrink-0"
        />
        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="flex-1 text-left px-5 py-3.5 bg-warm-100/90 hover:bg-brand-50/70 border border-warm-200 hover:border-brand-300 rounded-2xl text-warm-600 font-medium text-base transition-colors"
        >
          {t.whatsOnYourMind}
        </button>
      </div>

      {/* 4 Large Action Buttons with Simple Hindi Labels */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3.5">
        
        {/* Photo */}
        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-warm-50 hover:bg-emerald-50 hover:border-emerald-200 border border-warm-200/70 transition-colors text-warm-800 font-bold text-sm sm:text-base group"
        >
          <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700 group-hover:scale-110 transition-transform">
            <Image className="w-5 h-5" />
          </span>
          <span>{t.addPhoto}</span>
        </button>

        {/* Video */}
        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-warm-50 hover:bg-purple-50 hover:border-purple-200 border border-warm-200/70 transition-colors text-warm-800 font-bold text-sm sm:text-base group"
        >
          <span className="p-1.5 rounded-xl bg-purple-100 text-purple-700 group-hover:scale-110 transition-transform">
            <Video className="w-5 h-5" />
          </span>
          <span>{t.addVideo}</span>
        </button>

        {/* Voice (Dedicated Voice Modal trigger!) */}
        <button
          onClick={() => setIsVoicePostOpen(true)}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-colors text-brand-900 font-extrabold text-sm sm:text-base group shadow-sm"
        >
          <span className="p-1.5 rounded-xl bg-brand-600 text-white group-hover:scale-110 transition-transform animate-pulse">
            <Mic className="w-5 h-5" />
          </span>
          <span>{t.recordVoice}</span>
        </button>

        {/* Feeling */}
        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-warm-50 hover:bg-amber-50 hover:border-amber-200 border border-warm-200/70 transition-colors text-warm-800 font-bold text-sm sm:text-base group"
        >
          <span className="p-1.5 rounded-xl bg-amber-100 text-amber-700 group-hover:scale-110 transition-transform">
            <Smile className="w-5 h-5" />
          </span>
          <span>{t.addFeeling}</span>
        </button>

      </div>

    </div>
  );
};

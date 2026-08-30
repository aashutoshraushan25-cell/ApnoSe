import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Home, HeartHandshake, MessageCircle, User, Plus } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { t } = useLanguage();
  const { activeTab, setActiveTab, setIsCreatePostOpen } = useApp();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-warm-200 shadow-2xl px-2 py-1.5">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'home' ? 'text-brand-800 font-extrabold' : 'text-warm-500 font-semibold'
          }`}
        >
          <Home className={`w-6 h-6 ${activeTab === 'home' ? 'text-brand-700 stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-0.5">{t.home}</span>
        </button>

        {/* Family */}
        <button
          onClick={() => setActiveTab('family')}
          className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'family' ? 'text-brand-800 font-extrabold' : 'text-warm-500 font-semibold'
          }`}
        >
          <HeartHandshake className={`w-6 h-6 ${activeTab === 'family' ? 'text-brand-700 stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-0.5">{t.family}</span>
        </button>

        {/* Big Prominent Center Create Button */}
        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="-mt-5 w-14 h-14 rounded-full bg-gradient-to-tr from-brand-800 to-brand-600 text-white flex items-center justify-center shadow-soft-lg hover:scale-105 active:scale-95 transition-transform border-4 border-white"
          aria-label="नया पोस्ट बनाएं"
        >
          <Plus className="w-8 h-8 stroke-[3]" />
        </button>

        {/* Messages */}
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'messages' ? 'text-brand-800 font-extrabold' : 'text-warm-500 font-semibold'
          }`}
        >
          <MessageCircle className={`w-6 h-6 ${activeTab === 'messages' ? 'text-brand-700 stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-0.5">{t.messages}</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'profile' ? 'text-brand-800 font-extrabold' : 'text-warm-500 font-semibold'
          }`}
        >
          <User className={`w-6 h-6 ${activeTab === 'profile' ? 'text-brand-700 stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-0.5">{t.profile}</span>
        </button>

      </div>
    </div>
  );
};

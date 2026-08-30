import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Sparkles, Cake, ChevronRight, Heart } from 'lucide-react';

export const HeaderBanner: React.FC = () => {
  const { getGreeting, t } = useLanguage();
  const { currentUser } = useAuth();
  const { birthdays, sendBirthdayGreeting, setActiveTab } = useApp();

  const todayBirthday = birthdays.find((b) => b.isToday);
  const firstName = currentUser ? currentUser.name.split(' ')[0] : 'साथी';

  return (
    <div className="space-y-4 mb-6">
      
      {/* Warm Personal Greeting Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-brand-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-7 shadow-soft-lg border border-purple-700/50">
        
        {/* Subtle background decorative shapes */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-20 top-4 w-24 h-24 bg-saffron-400/15 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-saffron-300 border border-white/15">
              <Sparkles className="w-3.5 h-3.5" />
              <span>आज का सुविचार • परिवार ही जीवन की सबसे बड़ी ताकत है</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-devanagari text-white flex items-center gap-2">
              <span>{getGreeting()}, {firstName} जी</span>
              <span className="animate-pulse">👋</span>
            </h1>
            
            <p className="text-purple-100 text-base max-w-xl font-medium">
              आपके अपने प्रियजन आज आपकी एक झलक और बातचीत का इंतजार कर रहे हैं।
            </p>
          </div>

          {/* Quick Family shortcut button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('family')}
              className="flex items-center gap-2 bg-saffron-500 hover:bg-saffron-600 active:scale-95 text-warm-900 font-extrabold px-5 py-3 rounded-2xl shadow-md transition-all text-base border border-saffron-300"
            >
              <Heart className="w-5 h-5 fill-current text-warm-900" />
              <span>मेरा परिवार देखें</span>
            </button>
          </div>
        </div>
      </div>

      {/* Today's Birthday Celebration Ticker (If today has a birthday) */}
      {todayBirthday && (
        <div className="bg-gradient-to-r from-amber-500 via-saffron-500 to-rose-500 text-white rounded-3xl p-4 sm:p-5 shadow-soft border border-amber-300/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 text-2xl shadow-inner">
              🎂
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="bg-white/20 text-white text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  आज उत्सव है!
                </span>
                <span className="text-xs font-bold text-white/90">
                  {todayBirthday.relationshipHi}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                {todayBirthday.name} का आज जन्मदिन है! 🎉
              </h2>
            </div>
          </div>

          <button
            onClick={() => sendBirthdayGreeting(todayBirthday)}
            className="w-full sm:w-auto bg-white hover:bg-amber-50 text-warm-900 font-extrabold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-base shrink-0 flex items-center justify-center gap-2 border border-white/60"
          >
            <Cake className="w-5 h-5 text-coral-500" />
            <span>{t.sendWishes}</span>
          </button>
        </div>
      )}

    </div>
  );
};

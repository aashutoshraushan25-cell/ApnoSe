import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { BirthdayReminder } from '../../types';
import { QUICK_GREETINGS } from '../../data/mockData';
import { Cake, Heart, Sparkles, Send, Calendar, Gift, ChevronRight } from 'lucide-react';

export const BirthdayReminders: React.FC = () => {
  const { t } = useLanguage();
  const { birthdays, sendBirthdayGreeting } = useApp();

  const [selectedBirthday, setSelectedBirthday] = useState<BirthdayReminder | null>(null);
  const [customWish, setCustomWish] = useState(QUICK_GREETINGS[0]);

  const todayBirthdays = birthdays.filter((b) => b.isToday);
  const upcomingBirthdays = birthdays.filter((b) => !b.isToday);

  const handleOpenWishModal = (b: BirthdayReminder) => {
    setSelectedBirthday(b);
  };

  const handleSendCustomWish = () => {
    if (!selectedBirthday) return;
    sendBirthdayGreeting(selectedBirthday, customWish);
    setSelectedBirthday(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      
      {/* Top Celebratory Header */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-amber-300/40">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/25">
            <Gift className="w-3.5 h-3.5" />
            <span>उत्सव व शुभ दिन याद रखें</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-devanagari tracking-tight">
            जन्मदिन, वर्षगांठ व उत्सव (Celebrations)
          </h1>
          <p className="text-purple-100 text-base font-medium">
            परिवार और दोस्तों के खास दिनों को कभी न भूलें। एक क्लिक में अपना स्नेह और आशीर्वाद भेजें।
          </p>
        </div>
      </div>

      {/* Today's Special Celebrations */}
      {todayBirthdays.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-extrabold text-warm-900 font-devanagari flex items-center gap-2">
            <span>🎂 आज के विशेष उत्सव</span>
            <span className="text-xs bg-rose-100 text-rose-800 font-bold px-3 py-1 rounded-full border border-rose-200">
              आज
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {todayBirthdays.map((item) => (
              <div
                key={item.id}
                className="bg-gradient-to-br from-white to-amber-50/50 rounded-3xl p-6 shadow-soft border-2 border-amber-300 flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-20 h-20 rounded-full object-cover border-3 border-amber-400 shadow-md"
                    />
                    <span className="absolute -top-1 -right-1 text-2xl animate-bounce">
                      🎂
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-extrabold bg-amber-200 text-amber-900 px-3 py-0.5 rounded-full uppercase">
                      आज जन्मदिन है!
                    </span>
                    <h3 className="text-2xl font-extrabold text-warm-900 font-devanagari mt-1 leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-sm font-bold text-warm-600 mt-0.5">
                      रिश्ता: {item.relationshipHi} {item.ageTurning ? `(${item.ageTurning} वर्ष)` : ''}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenWishModal(item)}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 active:scale-95 text-white font-extrabold text-lg rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all border border-amber-300"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>शुभकामना व आशीर्वाद भेजें 🎉</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Celebrations & Milestones */}
      <div className="space-y-4">
        <h2 className="text-2xl font-extrabold text-warm-900 font-devanagari flex items-center gap-2">
          <Calendar className="w-6 h-6 text-brand-700" />
          <span>आगामी जन्मदिन व शादी की वर्षगांठ</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {upcomingBirthdays.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 shadow-soft border border-warm-200 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-brand-500 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg sm:text-xl text-warm-900 leading-tight">
                      {item.name}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-brand-800 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    {item.relationshipHi}
                  </span>
                  <p className="text-xs font-bold text-amber-700 mt-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleOpenWishModal(item)}
                className="p-3 bg-brand-50 hover:bg-brand-100 text-brand-800 font-bold rounded-2xl border border-brand-200 transition-colors shrink-0 text-sm flex items-center gap-1"
              >
                <span>बधाई लिखें</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Send Greeting Modal */}
      {selectedBirthday && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-soft-xl border border-warm-200 space-y-5">
            <div className="flex items-center gap-4 border-b border-warm-100 pb-4">
              <img
                src={selectedBirthday.avatar}
                alt={selectedBirthday.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-400"
              />
              <div>
                <span className="text-xs font-black text-amber-700 uppercase">बधाई संदेश</span>
                <h3 className="text-xl font-extrabold text-warm-900 font-devanagari">
                  {selectedBirthday.name}
                </h3>
                <p className="text-xs text-warm-500 font-bold">
                  रिश्ता: {selectedBirthday.relationshipHi}
                </p>
              </div>
            </div>

            {/* Quick Greeting Templates */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-warm-600 block">
                तैयार आशीर्वाद व संदेश चुनें:
              </span>
              <div className="space-y-2">
                {QUICK_GREETINGS.map((g, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCustomWish(g)}
                    className={`w-full text-left p-3 rounded-2xl text-sm font-medium border transition-colors ${
                      customWish === g
                        ? 'bg-brand-50 border-brand-500 text-brand-900 font-bold'
                        : 'bg-warm-50 hover:bg-warm-100 border-warm-200 text-warm-800'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Edit Box */}
            <div>
              <label className="block text-xs font-bold text-warm-700 mb-1">
                या अपनी बात लिखें:
              </label>
              <textarea
                rows={3}
                value={customWish}
                onChange={(e) => setCustomWish(e.target.value)}
                className="w-full p-3 bg-white border border-warm-300 rounded-2xl text-base font-devanagari focus:ring-2 focus:ring-brand-400"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedBirthday(null)}
                className="px-5 py-3 rounded-2xl border border-warm-300 font-bold text-warm-700 hover:bg-warm-100"
              >
                रद्द करें
              </button>
              <button
                onClick={handleSendCustomWish}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-extrabold text-base rounded-2xl shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span>शुभकामना भेजें</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

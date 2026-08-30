import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { NotificationItem } from '../../types';
import {
  Bell,
  CheckCheck,
  Heart,
  MessageCircle,
  Cake,
  ShieldAlert,
  UserPlus,
  Users,
  Sparkles,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { t } = useLanguage();
  const {
    notifications,
    markNotifAsRead,
    markAllNotifsAsRead,
    setActiveTab,
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filterType === 'all') return true;
    if (filterType === 'family') return n.type === 'family_update';
    if (filterType === 'birthdays') return n.type === 'birthday' || n.type === 'anniversary';
    if (filterType === 'safety') return n.type === 'safety';
    return true;
  });

  const getIconForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'birthday':
      case 'anniversary':
        return <Cake className="w-5 h-5 text-amber-500" />;
      case 'like':
        return <Heart className="w-5 h-5 text-rose-500 fill-current" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-brand-600" />;
      case 'family_update':
        return <Heart className="w-5 h-5 text-rose-600" />;
      case 'friend_request':
        return <UserPlus className="w-5 h-5 text-blue-500" />;
      case 'safety':
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      default:
        return <Bell className="w-5 h-5 text-brand-600" />;
    }
  };

  const handleActionClick = (notif: NotificationItem) => {
    markNotifAsRead(notif.id);
    if (notif.type === 'birthday') {
      setActiveTab('birthdays');
    } else if (notif.type === 'family_update' || notif.type === 'like' || notif.type === 'comment') {
      setActiveTab('home');
    } else if (notif.type === 'safety') {
      setActiveTab('safety');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      
      {/* Top Header */}
      <div className="bg-gradient-to-r from-brand-900 via-purple-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-brand-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-saffron-300">
            <Bell className="w-3.5 h-3.5" />
            <span>आपके प्रियजनों की ताजा गतिविधियां</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-devanagari tracking-tight">
            सूचनाएं (Notifications)
          </h1>
          <p className="text-purple-100 text-sm font-medium">
            परिवार, दोस्त, जन्मदिन और सुरक्षा से जुड़ी सभी महत्वपूर्ण खबरें।
          </p>
        </div>

        <button
          onClick={markAllNotifsAsRead}
          className="flex items-center gap-2 bg-white hover:bg-purple-50 text-brand-900 font-extrabold px-5 py-3 rounded-2xl shadow-md transition-colors text-sm shrink-0 border border-purple-200"
        >
          <CheckCheck className="w-4 h-4 text-emerald-600" />
          <span>सभी पढ़ी हुई चिह्नित करें</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-warm-200">
        {[
          { id: 'all', label: 'सभी सूचनाएं (All)' },
          { id: 'family', label: '👨‍👩‍👧 परिवार' },
          { id: 'birthdays', label: '🎂 जन्मदिन व उत्सव' },
          { id: 'safety', label: '🛡️ सुरक्षा अलर्ट' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm sm:text-base whitespace-nowrap transition-all ${
              filterType === tab.id
                ? 'bg-brand-800 text-white shadow-soft font-extrabold'
                : 'bg-white hover:bg-warm-100 text-warm-700 border border-warm-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3.5">
        {filteredNotifs.map((notif) => (
          <div
            key={notif.id}
            onClick={() => markNotifAsRead(notif.id)}
            className={`bg-white rounded-3xl p-5 shadow-soft border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-brand-300 ${
              notif.isRead
                ? 'border-warm-200/80 opacity-90'
                : 'border-brand-400 bg-gradient-to-r from-purple-50/40 via-white to-white ring-2 ring-brand-200/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                {notif.avatar ? (
                  <img
                    src={notif.avatar}
                    alt={notif.titleHi}
                    className="w-14 h-14 rounded-full object-cover border-2 border-brand-500 shadow-sm"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center">
                    {getIconForType(notif.type)}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm">
                  {getIconForType(notif.type)}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg text-warm-900 font-devanagari">
                    {notif.titleHi}
                  </h3>
                  {!notif.isRead && (
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                  )}
                </div>

                <p className="text-sm text-warm-600 font-medium leading-relaxed font-devanagari">
                  {notif.descriptionHi}
                </p>

                <span className="text-xs text-warm-400 font-bold block">
                  {notif.timestamp}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="shrink-0 pt-2 sm:pt-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionClick(notif);
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-900 font-extrabold text-sm rounded-xl border border-brand-200 transition-colors shadow-xs"
              >
                {notif.actionLabelHi || 'देखें'} &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

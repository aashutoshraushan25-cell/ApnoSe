import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import {
  Home,
  Users,
  HeartHandshake,
  MessageCircle,
  FolderHeart,
  Bell,
  User,
  ShieldCheck,
  Settings,
  PlusCircle,
  Cake,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const { activeTab, setActiveTab, setIsCreatePostOpen, unreadNotifCount, familyMembers, startCall } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'family', label: t.family, icon: HeartHandshake },
    { id: 'friends', label: t.friends, icon: Users },
    { id: 'messages', label: t.messages, icon: MessageCircle },
    { id: 'communities', label: t.communities, icon: FolderHeart },
    { id: 'birthdays', label: 'जन्मदिन व उत्सव', icon: Cake },
    { id: 'notifications', label: t.notifications, icon: Bell, badge: unreadNotifCount },
    { id: 'safety', label: t.safety, icon: ShieldCheck },
    { id: 'profile', label: t.profile, icon: User },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <aside className="w-64 xl:w-72 shrink-0 hidden lg:block py-6 pr-4 space-y-6">
      
      {/* Prominent Create Post Button */}
      <button
        onClick={() => setIsCreatePostOpen(true)}
        className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-brand-800 via-brand-700 to-brand-600 hover:from-brand-900 hover:to-brand-700 text-white rounded-2xl font-extrabold text-lg shadow-soft-lg hover:shadow-soft-xl hover:scale-[1.02] active:scale-[0.98] transition-all border border-brand-500/30"
      >
        <PlusCircle className="w-6 h-6 text-saffron-300" />
        <span>{t.createPost}</span>
      </button>

      {/* Navigation List */}
      <nav className="bg-white rounded-3xl p-3 shadow-soft border border-warm-200/80 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-base transition-all ${
                isActive
                  ? 'bg-brand-50 text-brand-900 shadow-sm border border-brand-200 font-extrabold'
                  : 'text-warm-700 hover:bg-warm-100 hover:text-warm-900'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`p-2 rounded-xl transition-colors ${
                    isActive ? 'bg-brand-600 text-white shadow-sm' : 'bg-warm-100 text-warm-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-base tracking-wide">{item.label}</span>
              </div>

              {item.badge && item.badge > 0 ? (
                <span className="bg-coral-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Quick Family Call Mini-Widget */}
      <div className="bg-gradient-to-br from-brand-900 to-brand-800 text-white rounded-3xl p-4 shadow-soft-lg border border-brand-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-saffron-400 animate-pulse" />
            <h4 className="font-bold text-sm text-saffron-100">तुरंत परिवार को कॉल करें</h4>
          </div>
          <span className="text-[11px] bg-brand-700 px-2 py-0.5 rounded-full text-brand-200">1-टच</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {familyMembers.slice(0, 3).map((member) => (
            <button
              key={member.id}
              onClick={() => startCall('audio', member.name, member.avatar, member.relationshipLabelHi)}
              className="flex flex-col items-center p-2 rounded-2xl bg-brand-800/80 hover:bg-brand-700 transition-all border border-brand-600/50 group"
              title={`${member.name} (${member.relationshipLabelHi}) को कॉल करें`}
            >
              <div className="relative mb-1">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover border border-saffron-400 group-hover:scale-105 transition-transform"
                />
                {member.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-brand-900 rounded-full" />
                )}
              </div>
              <span className="text-xs font-semibold text-white truncate max-w-full">
                {member.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-saffron-300 font-medium truncate">
                {member.relationshipLabelHi}
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

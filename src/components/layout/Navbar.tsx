import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, LANGUAGE_OPTIONS } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Globe,
  Type,
  Eye,
  ShieldCheck,
  ChevronDown,
  UserCheck,
  LogOut,
  Sparkles,
  Volume2,
  VolumeX,
  Home,
  HeartHandshake,
  Users,
  MessageCircle,
  FolderHeart,
  Cake,
  User,
  Settings,
  PlusCircle,
} from 'lucide-react';
import { ActiveTab } from '../../types';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { textSize, cycleTextSize, highContrast, toggleHighContrast, soundEnabled, setSoundEnabled } = useAccessibility();
  const { currentUser, availableUsers, switchUser, logout } = useAuth();
  const { activeTab, setActiveTab, unreadNotifCount, searchQuery, setSearchQuery, conversations, setIsCreatePostOpen } = useApp();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const navTabs: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'family', label: t.family, icon: HeartHandshake },
    { id: 'friends', label: t.friends, icon: Users },
    { id: 'messages', label: t.messages, icon: MessageCircle, badge: unreadMessagesCount },
    { id: 'communities', label: t.communities, icon: FolderHeart },
    { id: 'birthdays', label: 'जन्मदिन व उत्सव', icon: Cake },
    { id: 'safety', label: t.safety, icon: ShieldCheck },
    { id: 'notifications', label: t.notifications, icon: Bell, badge: unreadNotifCount },
    { id: 'profile', label: t.profile, icon: User },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-warm-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3.5 cursor-pointer group shrink-0"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-800 to-brand-600 flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform p-1.5 border border-purple-300">
              <img src="/logo.svg" alt="Apno Se Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold bg-gradient-to-r from-brand-900 via-brand-800 to-brand-600 bg-clip-text text-transparent font-devanagari">
                  {t.appName}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-saffron-100 text-saffron-800 font-bold border border-saffron-200">
                  40+
                </span>
              </div>
              <p className="text-xs text-warm-500 font-medium hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-lg mx-2 hidden md:block">
            <div className="relative">
              <Search className="w-5 h-5 text-warm-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-12 pr-4 py-3 bg-warm-100/80 border border-warm-200 rounded-full text-base focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all placeholder:text-warm-400 text-warm-900"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs bg-warm-200 hover:bg-warm-300 rounded-full px-2 py-1 text-warm-700"
                >
                  हटाएं
                </button>
              )}
            </div>
          </div>

          {/* Quick Accessibility & Profile Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Text Size Switcher A- / A / A+ */}
            <button
              onClick={cycleTextSize}
              title="अक्षर का आकार बदलें"
              className="flex items-center gap-1.5 px-3 py-2 bg-warm-100 hover:bg-brand-50 hover:border-brand-300 border border-warm-200 rounded-xl text-warm-800 font-bold text-sm transition-colors"
            >
              <Type className="w-4 h-4 text-brand-700" />
              <span className="text-xs font-semibold">
                {textSize === 'normal' ? 'A (सामान्य)' : textSize === 'large' ? 'A+ (बड़ा)' : 'A++ (विशाल)'}
              </span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-3 py-2 bg-warm-100 hover:bg-brand-50 hover:border-brand-300 border border-warm-200 rounded-xl text-warm-800 font-semibold text-sm transition-colors"
                title="भाषा बदलें (Change Language)"
              >
                <Globe className="w-4 h-4 text-brand-700" />
                <span className="hidden sm:inline">
                  {LANGUAGE_OPTIONS.find((l) => l.code === language)?.nativeName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-warm-500" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-soft-xl border border-warm-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-xs font-bold text-warm-400 uppercase tracking-wider">
                    अपनी भाषा चुनें
                  </div>
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => {
                        setLanguage(opt.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-base flex items-center justify-between hover:bg-brand-50 transition-colors ${
                        language === opt.code ? 'font-bold text-brand-700 bg-brand-50/60' : 'text-warm-800'
                      }`}
                    >
                      <span>{opt.nativeName}</span>
                      <span className="text-xs text-warm-400 font-normal">({opt.name})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* High Contrast Mode Toggle */}
            <button
              onClick={toggleHighContrast}
              title={highContrast ? 'सामान्य दृश्य' : 'उच्च स्पष्टता (High Contrast)'}
              className={`p-2.5 rounded-xl border transition-colors ${
                highContrast
                  ? 'bg-black text-yellow-300 border-black font-bold'
                  : 'bg-warm-100 hover:bg-warm-200 border-warm-200 text-warm-700'
              }`}
            >
              <Eye className="w-5 h-5" />
            </button>

            {/* Sound Mute/Unmute */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'आवाज़ चालू है' : 'आवाज़ बंद है'}
              className="p-2.5 rounded-xl border bg-warm-100 hover:bg-warm-200 border-warm-200 text-warm-700 transition-colors hidden sm:block"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-brand-700" /> : <VolumeX className="w-5 h-5 text-warm-400" />}
            </button>

            {/* Safety quick shortcut */}
            <button
              onClick={() => setActiveTab('safety')}
              title="सुरक्षा केंद्र (Safety Center)"
              className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl transition-colors relative"
            >
              <ShieldCheck className="w-5 h-5" />
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="p-2.5 bg-warm-100 hover:bg-brand-50 hover:border-brand-300 border border-warm-200 text-warm-800 rounded-xl transition-colors relative"
              title="सूचनाएं (Notifications)"
            >
              <Bell className="w-5 h-5 text-warm-700" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-coral-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* User Profile / Switch Persona Menu */}
            {currentUser && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 bg-warm-100 hover:bg-warm-200 rounded-full border border-warm-300 transition-colors"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-brand-500 shadow-sm"
                  />
                  <span className="font-bold text-sm text-warm-900 hidden lg:inline max-w-[110px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-warm-500" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-soft-xl border border-warm-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-warm-100">
                      <div className="flex items-center gap-3">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-brand-500 shadow-sm"
                        />
                        <div>
                          <p className="font-bold text-warm-900 text-base leading-tight">
                            {currentUser.name}
                          </p>
                          <p className="text-xs text-warm-500">
                            {currentUser.age} वर्ष • {currentUser.location.split(' (')[0]}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* View profile button */}
                    <div className="p-2 border-b border-warm-100">
                      <button
                        onClick={() => {
                          setActiveTab('profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm font-bold text-brand-800 hover:bg-brand-50 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <UserCheck className="w-4 h-4 text-brand-600" />
                        मेरी प्रोफ़ाइल और यादें देखें
                      </button>
                    </div>

                    {/* Switch Persona section */}
                    <div className="px-4 py-2 text-xs font-bold text-warm-400 uppercase tracking-wider">
                      डेमो सदस्य बदलें (Switch User)
                    </div>
                    <div className="px-2 space-y-1">
                      {availableUsers.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUser(u.id);
                            setIsUserMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-sm transition-colors ${
                            u.id === currentUser.id
                              ? 'bg-brand-100/70 font-bold text-brand-900'
                              : 'hover:bg-warm-100 text-warm-700'
                          }`}
                        >
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div className="truncate">
                            <span className="block truncate">{u.name.split(' (')[0]}</span>
                            <span className="text-[11px] text-warm-400">{u.age} वर्ष</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Logout */}
                    <div className="p-2 pt-2 mt-2 border-t border-warm-100">
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm font-semibold text-coral-600 hover:bg-coral-50 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        {t.logout}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Horizontal Navigation Menu Bar */}
      <div className="border-t border-warm-200/80 bg-warm-50/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none py-1.5">
          <nav className="flex items-center gap-1 sm:gap-1.5 min-w-max">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-2xl font-bold text-sm sm:text-[15px] transition-all relative shrink-0 ${
                    isActive
                      ? 'bg-brand-700 text-white shadow-soft font-extrabold scale-[1.02]'
                      : 'text-warm-700 hover:bg-warm-200/80 hover:text-warm-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-white' : 'text-brand-700'}`} />
                  <span className="font-devanagari">{tab.label}</span>
                  {tab.badge && tab.badge > 0 ? (
                    <span
                      className={`text-[11px] font-extrabold px-1.5 py-0.2 rounded-full shadow-xs ${
                        isActive ? 'bg-coral-400 text-white' : 'bg-coral-500 text-white animate-pulse'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Prominent Create Post Button in Top Menu */}
          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-800 to-brand-600 hover:from-brand-900 hover:to-brand-700 text-white rounded-2xl font-extrabold text-sm shadow-sm hover:shadow-md transition-all shrink-0 ml-2"
          >
            <PlusCircle className="w-4 h-4 text-saffron-300" />
            <span>{t.createPost}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

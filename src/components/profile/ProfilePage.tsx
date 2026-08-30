import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { PostCard } from '../feed/PostCard';
import { EditProfileModal } from './EditProfileModal';
import {
  MapPin,
  Calendar,
  Heart,
  Users,
  FolderHeart,
  Bookmark,
  Edit3,
  Settings,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  MessageSquare,
  Camera,
  Upload,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { t } = useLanguage();
  const { currentUser, updateCurrentUser } = useAuth();
  const { posts, familyMembers, communities, setActiveTab, showToast } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'posts' | 'photos' | 'saved' | 'communities'>('posts');
  const [isEditOpen, setIsEditOpen] = useState(false);

  const directAvatarInputRef = useRef<HTMLInputElement>(null);
  const directCoverInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) return null;

  // Handle instant photo upload from device
  const handleDirectAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('कृपया केवल फोटो फ़ाइल चुनें।');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateCurrentUser({ avatar: reader.result });
        showToast('आपकी प्रोफ़ाइल फ़ोटो सफलतापूर्वक अपडेट हो गई! 🌸');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle instant cover photo upload from device
  const handleDirectCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('कृपया केवल फोटो फ़ाइल चुनें।');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateCurrentUser({ coverImage: reader.result });
        showToast('कवर फ़ोटो सफलतापूर्वक अपडेट हो गई! 🌸');
      }
    };
    reader.readAsDataURL(file);
  };

  const userPosts = posts.filter((p) => p.authorId === currentUser.id);
  const savedPosts = posts.filter((p) => p.savedByMe);
  const userPhotos = posts
    .filter((p) => p.authorId === currentUser.id && p.images && p.images.length > 0)
    .flatMap((p) => p.images || []);
  const joinedCommunities = communities.filter((c) => c.isMember);

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      
      {/* Hidden Device File Inputs */}
      <input
        type="file"
        ref={directAvatarInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleDirectAvatarUpload}
      />
      <input
        type="file"
        ref={directCoverInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleDirectCoverUpload}
      />

      {/* Profile Header Container */}
      <div className="bg-white rounded-3xl shadow-soft border border-warm-200/80 overflow-hidden">
        
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-64 w-full bg-gradient-to-r from-purple-900 via-brand-800 to-indigo-900 group/cover">
          <img
            src={currentUser.coverImage}
            alt="Cover"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Change Cover Photo Button */}
          <button
            type="button"
            onClick={() => directCoverInputRef.current?.click()}
            className="absolute top-4 right-4 flex items-center gap-1.5 px-3.5 py-2 bg-black/50 hover:bg-black/75 text-white font-extrabold text-xs rounded-2xl backdrop-blur-md border border-white/20 transition-all shadow-md active:scale-95"
            title="डिवाइस से कवर फ़ोटो बदलें"
          >
            <Camera className="w-4 h-4 text-saffron-300" />
            <span>कवर फ़ोटो बदलें</span>
          </button>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            
            {/* Avatar with Camera Upload Badge */}
            <div className="relative inline-block group/avatar">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-soft-xl group-hover/avatar:brightness-95 transition-all"
              />
              
              {/* Direct Camera Upload Button on Avatar */}
              <button
                type="button"
                onClick={() => directAvatarInputRef.current?.click()}
                className="absolute bottom-1 right-1 p-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-full border-2 border-white shadow-md transition-transform active:scale-90 hover:scale-105 flex items-center justify-center"
                title="डिवाइस से नई फ़ोटो चुनें"
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Edit & Settings Action Buttons */}
            <div className="flex items-center gap-2.5 pt-2 sm:pt-0">
              <button
                onClick={() => setIsEditOpen(true)}
                className="flex items-center gap-2 px-5 py-3 bg-brand-800 hover:bg-brand-900 active:scale-95 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-soft transition-all"
              >
                <Edit3 className="w-4 h-4" />
                <span>प्रोफ़ाइल संपादित करें</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="p-3 bg-warm-100 hover:bg-warm-200 text-warm-800 rounded-2xl border border-warm-300 transition-colors"
                title="सेटिंग्स (Settings)"
              >
                <Settings className="w-5 h-5 text-warm-700" />
              </button>
            </div>
          </div>

          {/* User Bio Details */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-warm-900 font-devanagari">
                  {currentUser.name}
                </h1>
                <span className="text-xs bg-saffron-100 text-saffron-800 font-extrabold px-3 py-1 rounded-full border border-saffron-200">
                  {currentUser.age} वर्ष (Age 40+)
                </span>
              </div>
              {currentUser.occupation && (
                <p className="text-sm font-bold text-brand-800 mt-0.5">
                  {currentUser.occupation}
                </p>
              )}
            </div>

            <p className="text-base sm:text-lg text-warm-800 font-medium leading-relaxed max-w-2xl font-devanagari">
              {currentUser.bio}
            </p>

            <div className="flex items-center flex-wrap gap-4 text-xs sm:text-sm text-warm-600 font-bold pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>{currentUser.location}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-warm-400" />
                <span>सदस्यता: {currentUser.joinedDate} से</span>
              </span>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-warm-100">
              <div className="bg-warm-50 p-3.5 rounded-2xl text-center border border-warm-200/80">
                <span className="text-2xl font-extrabold text-brand-900 block">{userPosts.length}</span>
                <span className="text-xs text-warm-600 font-bold">मेरी पोस्ट</span>
              </div>
              <div className="bg-warm-50 p-3.5 rounded-2xl text-center border border-warm-200/80">
                <span className="text-2xl font-extrabold text-rose-700 block">{familyMembers.length}</span>
                <span className="text-xs text-warm-600 font-bold">परिवार सदस्य</span>
              </div>
              <div className="bg-warm-50 p-3.5 rounded-2xl text-center border border-warm-200/80">
                <span className="text-2xl font-extrabold text-amber-700 block">48</span>
                <span className="text-xs text-warm-600 font-bold">जुड़े दोस्त</span>
              </div>
              <div className="bg-warm-50 p-3.5 rounded-2xl text-center border border-warm-200/80">
                <span className="text-2xl font-extrabold text-purple-700 block">{joinedCommunities.length}</span>
                <span className="text-xs text-warm-600 font-bold">समुदाय</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-warm-200">
        {[
          { id: 'posts', label: `मेरी पोस्ट (${userPosts.length})`, icon: MessageSquare },
          { id: 'photos', label: `फ़ोटो व यादें (${userPhotos.length})`, icon: ImageIcon },
          { id: 'saved', label: `सहेजी गई यादें (${savedPosts.length})`, icon: Bookmark },
          { id: 'communities', label: `मेरे समुदाय (${joinedCommunities.length})`, icon: FolderHeart },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-sm sm:text-base whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-800 text-white shadow-soft'
                  : 'bg-white hover:bg-warm-100 text-warm-700 border border-warm-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-saffron-300' : 'text-warm-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SubTab Content: Posts */}
      {activeSubTab === 'posts' && (
        <div className="space-y-4">
          {userPosts.length > 0 ? (
            userPosts.map((p) => <PostCard key={p.id} post={p} />)
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-warm-200">
              <p className="text-lg font-bold text-warm-600 font-devanagari">
                आपने अभी तक कोई पोस्ट साझा नहीं की है।
              </p>
            </div>
          )}
        </div>
      )}

      {/* SubTab Content: Photos */}
      {activeSubTab === 'photos' && (
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-warm-200 space-y-4">
          <h3 className="font-extrabold text-xl text-warm-900 font-devanagari">
            आपकी सभी साझा की गई तस्वीरें
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {userPhotos.map((url, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-warm-200 shadow-xs group">
                <img src={url} alt="User gallery" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab Content: Saved Memories */}
      {activeSubTab === 'saved' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 flex items-center gap-3 text-amber-900 text-sm font-bold">
            <Bookmark className="w-5 h-5 text-amber-600 shrink-0 fill-current" />
            <span>यहाँ वे सभी पोस्ट और यादें हैं जिन्हें आपने बुकमार्क करके सुरक्षित रखा है।</span>
          </div>
          {savedPosts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}

      {/* SubTab Content: Communities */}
      {activeSubTab === 'communities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {joinedCommunities.map((c) => (
            <div key={c.id} className="bg-white rounded-3xl p-5 shadow-soft border border-warm-200 flex items-center gap-4">
              <span className="text-3xl">{c.icon}</span>
              <div>
                <h4 className="font-extrabold text-lg text-warm-900 font-devanagari">{c.nameHi}</h4>
                <span className="text-xs text-warm-500">👥 {c.memberCount} सदस्य जुड़े हैं</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditOpen && <EditProfileModal onClose={() => setIsEditOpen(false)} />}

    </div>
  );
};

import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { X, User, MapPin, Edit3, Camera, Upload, Image, Check, Sparkles, Trash2 } from 'lucide-react';

interface EditProfileModalProps {
  onClose: () => void;
}

const PRESET_AVATARS = [
  {
    label: 'राजेश जी (पारंपरिक)',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
  },
  {
    label: 'सुनीता जी (शालीन)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
  },
  {
    label: 'सुरेश जी (सदाबहार)',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
  },
  {
    label: 'श्रीमती वर्मा (स्नेहमयी)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
  },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
  const { currentUser, updateCurrentUser } = useAuth();
  const { showToast } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [occupation, setOccupation] = useState(currentUser?.occupation || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [coverImage, setCoverImage] = useState(currentUser?.coverImage || '');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Handle Photo selection from User's device (Phone/Computer Gallery or Camera)
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('कृपया केवल फोटो (JPG, PNG) फ़ाइल चुनें।');
      return;
    }

    // Limit file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      showToast('फोटो का आकार 10MB से कम होना चाहिए।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        showToast('डिवाइस से फ़ोटो चुन ली गई है! "सहेजें" बटन दबाकर लागू करें। 🌸');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Cover selection from User's device
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('कृपया केवल फोटो फ़ाइल चुनें।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCoverImage(reader.result);
        showToast('कवर फ़ोटो चुन ली गई है! 🌸');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateCurrentUser({
      name: name.trim(),
      occupation: occupation.trim(),
      location: location.trim(),
      bio: bio.trim(),
      avatar,
      coverImage,
    });

    showToast('आपकी प्रोफ़ाइल फ़ोटो और विवरण सफलतापूर्वक अपडेट हो गए! 🌸');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-900/65 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-soft-xl border border-warm-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-warm-100 bg-brand-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-800 text-white flex items-center justify-center shadow-xs">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-warm-900 font-devanagari">
                प्रोफ़ाइल व फ़ोटो बदलें
              </h2>
              <p className="text-xs text-warm-500 font-medium">
                डिवाइस से फ़ोटो अपलोड करें व विवरण अपडेट करें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-warm-200/80 rounded-full transition-colors text-warm-500 hover:text-warm-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Hidden File Inputs for Device Upload */}
        <input
          type="file"
          ref={avatarInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleAvatarFileChange}
        />
        <input
          type="file"
          ref={coverInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleCoverFileChange}
        />

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Section 1: Profile Photo (Device Upload) */}
          <div className="bg-warm-50 p-4 rounded-3xl border border-warm-200/80 space-y-3">
            <label className="flex items-center gap-2 text-sm font-extrabold text-warm-900 font-devanagari">
              <Camera className="w-4 h-4 text-brand-700" />
              <span>प्रोफ़ाइल फ़ोटो (Profile Photo)</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Avatar Preview */}
              <div className="relative group shrink-0">
                <img
                  src={avatar}
                  alt="Avatar preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-brand-300"
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 rounded-full text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="फ़ोटो बदलें"
                >
                  <Camera className="w-6 h-6" />
                  <span className="text-[10px] font-bold">बदलें</span>
                </button>
              </div>

              {/* Upload Button from Device */}
              <div className="space-y-2 text-center sm:text-left flex-1">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xs transition-all active:scale-95 border border-brand-500"
                >
                  <Upload className="w-4 h-4" />
                  <span>डिवाइस / गैलरी से फ़ोटो चुनें</span>
                </button>
                <p className="text-[11px] text-warm-500 font-medium">
                  फोन या कंप्यूटर से कोई भी साफ और सुंदर तस्वीर चुनें (JPG, PNG)।
                </p>
              </div>
            </div>

            {/* Quick Sample Avatars */}
            <div className="pt-2 border-t border-warm-200/60">
              <span className="text-[11px] font-bold text-warm-600 block mb-2 font-devanagari">
                या इनमें से एक चुनिंदा अवतार चुनें:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_AVATARS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAvatar(preset.url);
                      showToast(`अवतार "${preset.label}" चुना गया!`);
                    }}
                    className={`relative rounded-2xl overflow-hidden border-2 p-0.5 transition-all group ${
                      avatar === preset.url
                        ? 'border-brand-600 ring-2 ring-brand-300 scale-105'
                        : 'border-warm-200 hover:border-brand-400'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-14 object-cover rounded-xl"
                    />
                    {avatar === preset.url && (
                      <span className="absolute top-1 right-1 bg-brand-600 text-white rounded-full p-0.5">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Cover Image Upload */}
          <div className="bg-warm-50 p-4 rounded-3xl border border-warm-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-extrabold text-warm-900 font-devanagari flex items-center gap-2">
                <Image className="w-4 h-4 text-emerald-700" />
                <span>कवर फ़ोटो (Cover Banner)</span>
              </label>

              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="text-xs font-extrabold text-brand-800 hover:text-brand-900 flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-warm-200 shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>डिवाइस से बदलें</span>
              </button>
            </div>

            <div className="h-20 w-full rounded-2xl overflow-hidden border border-warm-200 relative">
              <img
                src={coverImage}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-extrabold text-warm-800 mb-1 font-devanagari">
              पूरा नाम (Full Name) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-warm-50 border border-warm-300 rounded-2xl text-base focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 font-devanagari text-warm-900"
            />
          </div>

          {/* Occupation / Status */}
          <div>
            <label className="block text-sm font-extrabold text-warm-800 mb-1 font-devanagari">
              व्यवसाय / पद (Occupation / Former Role)
            </label>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="उदा. सेवानिवृत्त अध्यापक, पूर्व रेलवे अधिकारी..."
              className="w-full px-4 py-3 bg-warm-50 border border-warm-300 rounded-2xl text-base focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 font-devanagari text-warm-900"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-extrabold text-warm-800 mb-1 font-devanagari">
              स्थान / निवास (City & State)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="उदा. वाराणसी, उत्तर प्रदेश"
              className="w-full px-4 py-3 bg-warm-50 border border-warm-300 rounded-2xl text-base focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 font-devanagari text-warm-900"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-extrabold text-warm-800 mb-1 font-devanagari">
              परिचय (Bio / अपने बारे में)
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="अपने शौक, विचार या परिवार के बारे में कुछ शब्द लिखें..."
              className="w-full p-4 bg-warm-50 border border-warm-300 rounded-2xl text-base focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 font-devanagari text-warm-900 resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-warm-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl border border-warm-300 font-bold text-warm-700 hover:bg-warm-100 text-sm"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="px-7 py-3 bg-brand-800 hover:bg-brand-900 text-white font-extrabold rounded-2xl shadow-soft text-sm transition-transform active:scale-95"
            >
              सहेजें (Save Changes)
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

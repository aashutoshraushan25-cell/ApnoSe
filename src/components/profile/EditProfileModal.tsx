import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { X, User, MapPin, Edit3, Camera } from 'lucide-react';

interface EditProfileModalProps {
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
  const { currentUser, updateCurrentUser } = useAuth();
  const { showToast } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateCurrentUser({
      name: name.trim(),
      location: location.trim(),
      bio: bio.trim(),
      avatar,
    });

    showToast('आपकी प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई! 🌸');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-soft-xl border border-warm-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-warm-100 bg-brand-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-700 text-white flex items-center justify-center">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-warm-900 font-devanagari">
                प्रोफ़ाइल संपादित करें
              </h2>
              <p className="text-xs text-warm-500">
                अपनी जानकारी अपडेट करें
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Avatar Preview */}
          <div className="flex items-center gap-4">
            <img
              src={avatar}
              alt="Avatar preview"
              className="w-20 h-20 rounded-full object-cover border-3 border-brand-500 shadow-md"
            />
            <div className="space-y-1">
              <span className="text-xs font-bold text-warm-700 block">फोटो URL:</span>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full px-3 py-1.5 bg-warm-50 border border-warm-300 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-extrabold text-warm-800 mb-1 font-devanagari">
              पूरा नाम (Full Name) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-warm-50 border border-warm-300 rounded-2xl text-base focus:bg-white focus:border-brand-500 focus:ring-2 font-devanagari"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-extrabold text-warm-800 mb-1 font-devanagari">
              स्थान / निवास (Location)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 bg-warm-50 border border-warm-300 rounded-2xl text-base focus:bg-white focus:border-brand-500 focus:ring-2 font-devanagari"
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
              className="w-full p-4 bg-warm-50 border border-warm-300 rounded-2xl text-base focus:bg-white focus:border-brand-500 focus:ring-2 font-devanagari resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-warm-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl border border-warm-300 font-bold text-warm-700 hover:bg-warm-100"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="px-7 py-3 bg-brand-800 hover:bg-brand-900 text-white font-extrabold rounded-2xl shadow-soft"
            >
              सहेजें (Save)
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

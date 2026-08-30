import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Plus, Heart, Phone, Video } from 'lucide-react';

export const FamilySectionBar: React.FC = () => {
  const { t } = useLanguage();
  const { familyMembers, setIsAddFamilyOpen, startCall, setActiveTab } = useApp();

  return (
    <div className="bg-white rounded-3xl p-5 shadow-soft border border-warm-200/80 mb-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700">
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg sm:text-xl text-warm-900 font-devanagari">
              मेरा परिवार मंडल (My Family Circle)
            </h2>
            <p className="text-xs text-warm-500 font-medium">
              सीधे कॉल करें या उनकी नई पोस्ट देखें
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('family')}
          className="text-sm font-bold text-brand-700 hover:text-brand-900 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-colors hidden sm:block"
        >
          पूरा परिवार देखें &rarr;
        </button>
      </div>

      {/* Horizontal Scrollable Family Avatars */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 pt-1 scrollbar-none">
        
        {/* + Add Family Member Button */}
        <button
          onClick={() => setIsAddFamilyOpen(true)}
          className="flex flex-col items-center justify-center shrink-0 w-24 sm:w-28 group"
        >
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 border-dashed border-brand-400 bg-brand-50/70 flex items-center justify-center group-hover:bg-brand-100 group-hover:border-brand-600 group-hover:scale-105 transition-all shadow-sm">
            <Plus className="w-7 h-7 text-brand-700" />
          </div>
          <span className="mt-2 text-xs sm:text-sm font-bold text-brand-800 text-center leading-tight">
            {t.addFamilyMember}
          </span>
        </button>

        {/* Family Member Circles */}
        {familyMembers.map((member) => (
          <div
            key={member.id}
            className="flex flex-col items-center shrink-0 w-24 sm:w-28 group"
          >
            <div className="relative">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-3 border-brand-500 shadow-md group-hover:scale-105 transition-transform"
              />
              
              {/* Online Indicator */}
              {member.isOnline && (
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
              )}

              {/* Hover Quick Action Overlay for 1-click video/audio call */}
              <div className="absolute inset-0 bg-brand-900/70 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-opacity backdrop-blur-xs">
                <button
                  onClick={() => startCall('audio', member.name, member.avatar, member.relationshipLabelHi)}
                  title="कॉल करें"
                  className="p-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-full text-white shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => startCall('video', member.name, member.avatar, member.relationshipLabelHi)}
                  title="वीडियो कॉल करें"
                  className="p-1.5 bg-brand-600 hover:bg-brand-700 rounded-full text-white shadow-sm"
                >
                  <Video className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <span className="mt-2 text-xs sm:text-sm font-extrabold text-warm-900 text-center truncate max-w-full">
              {member.name.split(' ')[0]}
            </span>
            <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200 mt-0.5">
              {member.relationshipLabelHi}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
};

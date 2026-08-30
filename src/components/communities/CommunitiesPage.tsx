import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Community } from '../../types';
import { CommunityDetailModal } from './CommunityDetailModal';
import {
  FolderHeart,
  Search,
  Users,
  Plus,
  Check,
  Sparkles,
  Palmtree,
  BookOpen,
  MapPin,
  Briefcase,
} from 'lucide-react';

export const CommunitiesPage: React.FC = () => {
  const { t } = useLanguage();
  const { communities, toggleJoinCommunity } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [activeCommunityModal, setActiveCommunityModal] = useState<Community | null>(null);

  const categories = [
    { id: 'all', label: 'सभी समुदाय (All)', icon: Sparkles },
    { id: 'hobbies', label: 'हॉबीज व शौक (Hobbies)', icon: BookOpen },
    { id: 'lifestyle', label: 'लाइफस्टाइल व स्वास्थ्य (Lifestyle)', icon: Palmtree },
    { id: 'local', label: 'स्थानीय व मोहल्ला (Local)', icon: MapPin },
    { id: 'professional', label: 'व्यापार व सलाह (Professional)', icon: Briefcase },
  ];

  const filteredCommunities = communities.filter((c) => {
    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch =
      c.nameHi.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.descriptionHi.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-purple-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-brand-700">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-saffron-300 border border-white/15">
            <FolderHeart className="w-3.5 h-3.5" />
            <span>समान रुचि और शौक का अपना समाज</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-devanagari tracking-tight">
            समुदाय व समूह (Communities)
          </h1>
          <p className="text-purple-100 text-base font-medium">
            बागवानी, पारंपरिक रसोई, योग, स्वास्थ्य और पुराने साहित्य के शौकीनों के साथ विचार बांटें।
          </p>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="space-y-3">
        <div className="relative max-w-xl">
          <Search className="w-5 h-5 text-warm-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="समुदाय खोजें (जैसे: बागवानी, योग, दिल्ली, पाक कला)..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-warm-300 rounded-2xl text-base shadow-xs focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all font-devanagari"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm sm:text-base whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-brand-800 text-white shadow-soft font-extrabold'
                    : 'bg-white hover:bg-warm-100 text-warm-700 border border-warm-200/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-saffron-300' : 'text-warm-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCommunities.map((community) => (
          <div
            key={community.id}
            className="bg-white rounded-3xl overflow-hidden shadow-soft border border-warm-200/80 hover:border-brand-300 transition-all flex flex-col justify-between group"
          >
            {/* Card Cover & Icon */}
            <div className="relative h-44 overflow-hidden bg-warm-100 cursor-pointer" onClick={() => setActiveCommunityModal(community)}>
              <img
                src={community.coverImage}
                alt={community.nameHi}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
              
              <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                {community.categoryLabelHi}
              </div>

              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                <div>
                  <span className="text-2xl block mb-1">{community.icon}</span>
                  <h3 className="font-extrabold text-xl font-devanagari leading-tight drop-shadow-md">
                    {community.nameHi}
                  </h3>
                </div>
              </div>
            </div>

            {/* Content & Description */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <p className="text-xs text-brand-800 font-extrabold mb-1">
                  👥 {(community.memberCount).toLocaleString('en-IN')} सदस्य जुड़े हैं
                </p>
                <p className="text-sm sm:text-base text-warm-700 font-medium leading-relaxed line-clamp-2 font-devanagari">
                  {community.descriptionHi}
                </p>
              </div>

              {/* Actions: View Group and Join/Leave */}
              <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-warm-100">
                <button
                  onClick={() => setActiveCommunityModal(community)}
                  className="py-3 px-3 rounded-2xl bg-warm-100 hover:bg-brand-50 text-brand-900 font-extrabold text-sm sm:text-base border border-warm-200 transition-colors text-center"
                >
                  चर्चा देखें &rarr;
                </button>

                <button
                  onClick={() => toggleJoinCommunity(community.id)}
                  className={`py-3 px-3 rounded-2xl font-extrabold text-sm sm:text-base transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-xs ${
                    community.isMember
                      ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-400'
                      : 'bg-gradient-to-r from-brand-800 to-brand-600 hover:from-brand-900 hover:to-brand-700 text-white'
                  }`}
                >
                  {community.isMember ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      <span>जुड़े हैं</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>+ जुड़ें</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Community Detail Modal */}
      {activeCommunityModal && (
        <CommunityDetailModal
          community={activeCommunityModal}
          onClose={() => setActiveCommunityModal(null)}
        />
      )}

    </div>
  );
};

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Users, Heart, Sparkles, FolderHeart } from 'lucide-react';

export type FeedFilterType = 'all' | 'family' | 'friends' | 'communities';

interface FeedFiltersProps {
  activeFilter: FeedFilterType;
  onChangeFilter: (f: FeedFilterType) => void;
}

export const FeedFilters: React.FC<FeedFiltersProps> = ({
  activeFilter,
  onChangeFilter,
}) => {
  const { t } = useLanguage();

  const filterTabs: { id: FeedFilterType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'all', label: 'सभी पोस्ट (All)', icon: Sparkles },
    { id: 'family', label: 'केवल परिवार (Family)', icon: Heart },
    { id: 'friends', label: 'दोस्त (Friends)', icon: Users },
    { id: 'communities', label: 'समुदाय (Groups)', icon: FolderHeart },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
      {filterTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeFilter === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeFilter(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm sm:text-base whitespace-nowrap transition-all ${
              isActive
                ? 'bg-brand-800 text-white shadow-soft font-extrabold'
                : 'bg-white hover:bg-warm-100 text-warm-700 border border-warm-200/80'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-saffron-300' : 'text-warm-500'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

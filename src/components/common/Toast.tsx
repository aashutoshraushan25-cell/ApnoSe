import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, showToast } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-24 lg:bottom-8 right-6 z-50 max-w-md animate-bounce-short">
      <div className="flex items-center gap-3 bg-brand-900 text-white px-5 py-4 rounded-2xl shadow-soft-xl border border-brand-700">
        <Sparkles className="w-6 h-6 text-saffron-400 shrink-0 animate-pulse" />
        <span className="text-base font-medium flex-1">{toastMessage}</span>
        <button
          onClick={() => showToast('')}
          className="p-1.5 hover:bg-brand-800 rounded-full transition-colors text-white/80 hover:text-white"
          aria-label="बंद करें"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

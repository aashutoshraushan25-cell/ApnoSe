import React from 'react';
import { useLanguage, LANGUAGE_OPTIONS } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Type,
  Eye,
  Globe,
  Lock,
  Bell,
  ShieldCheck,
  LogOut,
  Volume2,
  Check,
  Sparkles,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const {
    textSize,
    setTextSize,
    highContrast,
    setHighContrast,
    soundEnabled,
    setSoundEnabled,
  } = useAccessibility();
  const { currentUser, logout } = useAuth();
  const { showToast, setActiveTab } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-purple-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-brand-700">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-saffron-300">
            <Settings className="w-3.5 h-3.5" />
            <span>सरल व सुगम सेटिंग्स</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-devanagari tracking-tight">
            सेटिंग्स व सुगमता (Settings & Preferences)
          </h1>
          <p className="text-purple-100 text-sm font-medium">
            अपने अनुसार अक्षर का आकार, भाषा, ध्वनि और निजता को अनुकूलित करें।
          </p>
        </div>
      </div>

      {/* 1. Language Preferences (भाषा चयन) */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-warm-200 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-700">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-warm-900 font-devanagari">
              ऐप की भाषा चुनें (App Language)
            </h3>
            <p className="text-xs text-warm-500">
              अपनी पसंदीदा मातृभाषा में ऐप का उपयोग करें
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {LANGUAGE_OPTIONS.map((opt) => {
            const isSelected = language === opt.code;
            return (
              <button
                key={opt.code}
                onClick={() => {
                  setLanguage(opt.code);
                  showToast(`भाषा बदलकर ${opt.nativeName} कर दी गई है।`);
                }}
                className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/70 text-brand-950 font-extrabold shadow-sm'
                    : 'border-warm-200 hover:bg-warm-50 text-warm-800 font-bold'
                }`}
              >
                <div>
                  <span className="text-lg block font-devanagari leading-tight">{opt.nativeName}</span>
                  <span className="text-xs text-warm-500 font-normal">({opt.name})</span>
                </div>
                {isSelected && <Check className="w-5 h-5 text-brand-700 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Text Size & Readability (अक्षर का आकार) */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-warm-200 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-700">
            <Type className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-warm-900 font-devanagari">
              अक्षर का आकार (Text Size Scaling)
            </h3>
            <p className="text-xs text-warm-500">
              आंखों पर जोर दिए बिना पढ़ने के लिए अक्षरों को बड़ा करें
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'normal', label: 'सामान्य (Normal)', preview: 'अ' },
            { id: 'large', label: 'बड़ा (Large - सुझाया गया)', preview: 'अ+' },
            { id: 'extralarge', label: 'अति विशाल (Extra Large)', preview: 'अ++' },
          ].map((tier) => {
            const isSelected = textSize === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => {
                  setTextSize(tier.id as any);
                  showToast(`अक्षर का आकार "${tier.label.split(' (')[0]}" सेट किया गया`);
                }}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/70 text-brand-950 font-extrabold shadow-sm'
                    : 'border-warm-200 hover:bg-warm-50 text-warm-700 font-bold'
                }`}
              >
                <span className="text-2xl font-black mb-1">{tier.preview}</span>
                <span className="text-xs sm:text-sm">{tier.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. High Contrast & Audio Cues */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-warm-200 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-700">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-warm-900 font-devanagari">
              दृश्य व श्रव्य सुगमता (Visual & Audio Comfort)
            </h3>
            <p className="text-xs text-warm-500">
              साफ बॉर्डर और क्लिक ध्वनि
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* High contrast toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-warm-50 border border-warm-200">
            <div>
              <span className="font-extrabold text-base text-warm-900 block font-devanagari">
                उच्च स्पष्टता मोड (High Contrast Mode)
              </span>
              <span className="text-xs text-warm-500">
                काले और सफेद रंगों में अधिक स्पष्टता ताकि पढ़ने में आसानी हो
              </span>
            </div>
            <button
              onClick={() => {
                setHighContrast(!highContrast);
                showToast(highContrast ? 'सामान्य दृश्य चालू' : 'उच्च स्पष्टता मोड चालू');
              }}
              className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
                highContrast ? 'bg-brand-700' : 'bg-warm-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  highContrast ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-warm-50 border border-warm-200">
            <div>
              <span className="font-extrabold text-base text-warm-900 block font-devanagari">
                बटन दबाने पर ध्वनि संकेत (Audio Click Sounds)
              </span>
              <span className="text-xs text-warm-500">
                हर क्रिया पर मधुर ध्वनि पुष्टि
              </span>
            </div>
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                showToast(soundEnabled ? 'ध्वनि बंद की गई' : 'ध्वनि चालू की गई');
              }}
              className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
                soundEnabled ? 'bg-brand-700' : 'bg-warm-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Privacy & Safety Shortcut */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-warm-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-warm-900 font-devanagari">
              डिजिटल सुरक्षा व फ्रॉड रोकथाम
            </h3>
            <p className="text-xs text-warm-500">
              ब्लॉक किए गए नंबर, शिकायतें और निजता नियम
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('safety')}
          className="px-5 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-sm border border-emerald-300 transition-colors shrink-0"
        >
          सुरक्षा केंद्र खोलें &rarr;
        </button>
      </div>

      {/* 5. Logout */}
      <div className="pt-2">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-2xl font-extrabold text-base transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>खाते से लॉग आउट करें (Logout)</span>
        </button>
      </div>

    </div>
  );
};

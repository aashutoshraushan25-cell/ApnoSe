import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { SpeechService } from '../../services/speechService';
import { PostAudience } from '../../types';
import {
  X,
  Image,
  Mic,
  MicOff,
  Smile,
  MapPin,
  Users,
  Globe,
  Lock,
  Heart,
  Send,
  Trash2,
  Sparkles,
} from 'lucide-react';

const SAMPLE_PHOTO_CHOICES = [
  { label: 'सुंदर बगीचा', url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800' },
  { label: 'पारिवारिक भोजन', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800' },
  { label: 'तीर्थ यात्रा व आरती', url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=800' },
  { label: 'प्राकृतिक दृश्य', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800' },
  { label: 'योग व स्वास्थ्य', url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800' },
];

const FEELING_CHOICES = [
  { emoji: '🌸', textHi: 'प्रसन्न व शांत', textEn: 'Peaceful' },
  { emoji: '🙏', textHi: 'भक्तिमय व आभारी', textEn: 'Blessed' },
  { emoji: '❤️', textHi: 'पारिवारिक प्यार', textEn: 'Loved' },
  { emoji: '🌟', textHi: 'गौरवान्वित', textEn: 'Proud' },
  { emoji: '📷', textHi: 'पुरानी मीठी यादें', textEn: 'Nostalgic' },
  { emoji: '🌿', textHi: 'स्वस्थ व तरोताजा', textEn: 'Healthy' },
  { emoji: '🚗', textHi: 'सुखद यात्रा पर', textEn: 'Travelling' },
];

export const CreatePostModal: React.FC = () => {
  const { t, language } = useLanguage();
  const { currentUser } = useAuth();
  const { isCreatePostOpen, setIsCreatePostOpen, createPost } = useApp();

  const [text, setText] = useState('');
  const [audience, setAudience] = useState<PostAudience>('everyone');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedFeeling, setSelectedFeeling] = useState<typeof FEELING_CHOICES[0] | null>(null);
  const [location, setLocation] = useState(currentUser?.location.split(' (')[0] || '');
  const [isListening, setIsListening] = useState(false);
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);
  const [isFeelingPickerOpen, setIsFeelingPickerOpen] = useState(false);
  const [stopListeningFn, setStopListeningFn] = useState<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      if (stopListeningFn) {
        stopListeningFn();
      }
    };
  }, [stopListeningFn]);

  if (!isCreatePostOpen) return null;

  const handleToggleSpeech = () => {
    if (isListening) {
      if (stopListeningFn) stopListeningFn();
      SpeechService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      const stopFn = SpeechService.startListening(
        (transcript) => {
          setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        },
        (error) => {
          console.warn('Speech error:', error);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        },
        language === 'en' ? 'en-IN' : 'hi-IN'
      );
      setStopListeningFn(() => stopFn);
    }
  };

  const handleSelectSamplePhoto = (url: string) => {
    if (selectedImages.includes(url)) {
      setSelectedImages(selectedImages.filter((img) => img !== url));
    } else {
      setSelectedImages([...selectedImages, url]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImages([...selectedImages, event.target.result as string]);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && selectedImages.length === 0) return;

    createPost({
      text: text.trim(),
      images: selectedImages,
      feeling: selectedFeeling || undefined,
      location: location.trim() || undefined,
      audience,
    });

    // Reset and close
    setText('');
    setSelectedImages([]);
    setSelectedFeeling(null);
    setIsCreatePostOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-soft-xl border border-warm-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-warm-100 bg-brand-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
              +
            </div>
            <h2 className="text-xl font-extrabold text-warm-900 font-devanagari">
              नई पोस्ट लिखें (Create Post)
            </h2>
          </div>
          <button
            onClick={() => setIsCreatePostOpen(false)}
            className="p-2 hover:bg-warm-200/80 rounded-full transition-colors text-warm-500 hover:text-warm-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Author Info & Audience Selector */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-brand-500 shadow-sm"
              />
              <div>
                <p className="font-extrabold text-base text-warm-900 leading-tight">
                  {currentUser?.name}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as PostAudience)}
                    className="text-xs font-bold bg-warm-100 border border-warm-300 text-warm-800 rounded-lg px-2 py-1 cursor-pointer focus:ring-2 focus:ring-brand-400"
                  >
                    <option value="everyone">🌐 सबको (Everyone)</option>
                    <option value="friends">👥 केवल दोस्त (Friends)</option>
                    <option value="family">👨‍👩‍👧 केवल परिवार (Family)</option>
                    <option value="only_me">🔒 सिर्फ मैं (Only Me)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Voice Dictation Button in Header */}
            <button
              type="button"
              onClick={handleToggleSpeech}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl font-bold text-sm transition-all border ${
                isListening
                  ? 'bg-coral-500 text-white border-coral-600 animate-pulse shadow-md'
                  : 'bg-brand-50 hover:bg-brand-100 text-brand-800 border-brand-200'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-brand-700" />}
              <span>{isListening ? 'सुन रहे हैं...' : 'बोलकर लिखें'}</span>
            </button>
          </div>

          {/* Active Voice Listening Banner */}
          {isListening && (
            <div className="bg-coral-50 border border-coral-200 rounded-2xl p-3 flex items-center justify-between text-coral-800 text-sm animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-coral-500 animate-ping" />
                <span className="font-bold">कृपया बोलें, आपके शब्द यहाँ लिखे जा रहे हैं...</span>
              </div>
              <button
                type="button"
                onClick={handleToggleSpeech}
                className="text-xs font-bold underline"
              >
                रोकें
              </button>
            </div>
          )}

          {/* Main Textarea with Large Typography */}
          <div className="relative">
            <textarea
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="आप क्या साझा करना चाहते हैं? यहाँ लिखें... (जैसे: पारिवारिक यादें, बगीचे की फोटो, सुविचार)"
              className="w-full p-4 bg-warm-50 border border-warm-200 rounded-2xl text-lg sm:text-xl leading-relaxed focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all placeholder:text-warm-400 text-warm-900 resize-none font-devanagari"
            />
          </div>

          {/* Selected Feeling Tag Display */}
          {selectedFeeling && (
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-xl text-sm font-bold">
              <span>{selectedFeeling.emoji}</span>
              <span>भावना: {selectedFeeling.textHi}</span>
              <button
                type="button"
                onClick={() => setSelectedFeeling(null)}
                className="ml-1 text-amber-700 hover:text-amber-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Selected Photos Gallery */}
          {selectedImages.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-warm-500">चुनी गई तस्वीरें ({selectedImages.length}):</span>
                <button
                  type="button"
                  onClick={() => setSelectedImages([])}
                  className="text-xs text-coral-600 font-bold hover:underline"
                >
                  सभी हटाएं
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {selectedImages.map((img, idx) => (
                  <div key={idx} className="relative group rounded-2xl overflow-hidden aspect-video border border-warm-200">
                    <img src={img} alt="Selected" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-coral-600 text-white rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Photo Picker Drawer */}
          {isPhotoPickerOpen && (
            <div className="bg-warm-50 border border-warm-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-warm-800">तस्वीर चुनें या अपलोड करें:</span>
                <label className="cursor-pointer text-xs font-bold bg-brand-600 text-white px-3 py-1.5 rounded-xl hover:bg-brand-700 transition-colors shadow-sm">
                  <span>+ फोन/कंप्यूटर से चुनें</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {SAMPLE_PHOTO_CHOICES.map((choice, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectSamplePhoto(choice.url)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all aspect-square ${
                      selectedImages.includes(choice.url) ? 'border-brand-600 scale-95 shadow-md' : 'border-transparent opacity-85 hover:opacity-100'
                    }`}
                  >
                    <img src={choice.url} alt={choice.label} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[10px] text-white p-0.5 text-center truncate">
                      {choice.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Feeling Selector Drawer */}
          {isFeelingPickerOpen && (
            <div className="bg-warm-50 border border-warm-200 rounded-2xl p-3">
              <span className="text-xs font-extrabold text-warm-700 block mb-2">अपनी भावना चुनें:</span>
              <div className="flex flex-wrap gap-2">
                {FEELING_CHOICES.map((f, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSelectedFeeling(f);
                      setIsFeelingPickerOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-brand-50 border border-warm-200 text-xs font-bold text-warm-800 transition-colors shadow-xs"
                  >
                    <span>{f.emoji}</span>
                    <span>{f.textHi}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Post Add-on Toolbar */}
          <div className="pt-2 border-t border-warm-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsPhotoPickerOpen(!isPhotoPickerOpen)}
                className="flex items-center gap-1.5 px-3 py-2 bg-warm-100 hover:bg-emerald-50 hover:border-emerald-300 border border-warm-200 rounded-xl text-warm-800 text-xs sm:text-sm font-bold transition-colors"
              >
                <Image className="w-4 h-4 text-emerald-600" />
                <span>फोटो जोड़ें</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFeelingPickerOpen(!isFeelingPickerOpen)}
                className="flex items-center gap-1.5 px-3 py-2 bg-warm-100 hover:bg-amber-50 hover:border-amber-300 border border-warm-200 rounded-xl text-warm-800 text-xs sm:text-sm font-bold transition-colors"
              >
                <Smile className="w-4 h-4 text-amber-600" />
                <span>भावना</span>
              </button>

              <div className="flex items-center gap-1 bg-warm-100 px-3 py-2 border border-warm-200 rounded-xl">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="स्थान (शहर)"
                  className="bg-transparent text-xs sm:text-sm font-bold text-warm-800 focus:outline-none w-28"
                />
              </div>
            </div>

            {/* Large Post Button */}
            <button
              type="submit"
              disabled={!text.trim() && selectedImages.length === 0}
              className="flex items-center justify-center gap-2 px-7 py-3 bg-gradient-to-r from-brand-800 to-brand-600 hover:from-brand-900 hover:to-brand-700 active:scale-95 text-white font-extrabold text-base rounded-2xl shadow-soft disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
              <span>{t.post}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

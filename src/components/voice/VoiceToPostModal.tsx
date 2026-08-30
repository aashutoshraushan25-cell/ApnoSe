import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { SpeechService } from '../../services/speechService';
import { PRESET_VOICE_SAMPLES } from '../../data/mockData';
import {
  X,
  Mic,
  MicOff,
  Send,
  Edit3,
  Sparkles,
  Volume2,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';

export const VoiceToPostModal: React.FC = () => {
  const { t, language } = useLanguage();
  const { isVoicePostOpen, setIsVoicePostOpen, createPost } = useApp();

  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [stopFn, setStopFn] = useState<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      if (stopFn) stopFn();
    };
  }, [stopFn]);

  if (!isVoicePostOpen) return null;

  const startVoiceRecording = () => {
    setIsRecording(true);
    setSpokenText('');
    const stopper = SpeechService.startListening(
      (transcript) => {
        setSpokenText(transcript);
      },
      (err) => {
        console.warn(err);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      },
      language === 'en' ? 'en-IN' : 'hi-IN'
    );
    setStopFn(() => stopper);
  };

  const stopVoiceRecording = () => {
    if (stopFn) stopFn();
    SpeechService.stopListening();
    setIsRecording(false);
  };

  const handleUsePreset = (sample: string) => {
    setSpokenText(sample);
  };

  const handlePublishVoicePost = () => {
    if (!spokenText.trim()) return;

    createPost({
      text: spokenText.trim(),
      audioUrl: 'voice-note-user',
      audioDuration: 18,
      audioWaveform: [25, 40, 75, 90, 60, 45, 80, 100, 70, 50, 30],
      feeling: { emoji: '🎤', textHi: 'आवाज़ का संदेश', textEn: 'Voice Note' },
      audience: 'everyone',
    });

    setSpokenText('');
    setIsVoicePostOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-900/65 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-soft-xl border border-warm-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-warm-100 bg-gradient-to-r from-brand-900 to-purple-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Mic className="w-6 h-6 text-saffron-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold font-devanagari">
                🎤 बोलकर पोस्ट करें (Voice-to-Post)
              </h2>
              <p className="text-xs text-purple-200">
                टाइप करने की जरूरत नहीं — बस बोलिए और साझा करें!
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVoicePostOpen(false)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-center">
          
          {/* Large Interactive Microphone Touch Target */}
          <div className="flex flex-col items-center justify-center pt-2">
            <button
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              className={`w-28 h-28 rounded-full flex items-center justify-center transition-all shadow-xl ${
                isRecording
                  ? 'bg-rose-500 hover:bg-rose-600 text-white ring-8 ring-rose-200 animate-pulse scale-105'
                  : 'bg-gradient-to-tr from-brand-800 to-brand-600 hover:from-brand-900 hover:to-brand-700 text-white hover:scale-105 active:scale-95 ring-8 ring-brand-100'
              }`}
            >
              {isRecording ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12 stroke-[2.5]" />}
            </button>

            <p className="mt-4 font-extrabold text-lg text-warm-900 font-devanagari">
              {isRecording ? 'हम सुन रहे हैं... कृपया बोलिए!' : 'माइक दबाकर बोलना शुरू करें'}
            </p>
            <p className="text-xs text-warm-500">
              {isRecording ? 'बोलना पूरा होने पर फिर से बटन दबाएं' : 'अपनी बात हिंदी या किसी भी भाषा में कहें'}
            </p>

            {/* Audio Wave animation when recording */}
            {isRecording && (
              <div className="flex items-center gap-1.5 h-8 mt-3">
                {[40, 80, 60, 100, 75, 45, 90, 65, 30, 85].map((height, idx) => (
                  <span
                    key={idx}
                    className="w-1.5 bg-brand-600 rounded-full animate-wave"
                    style={{ height: `${height}%`, animationDelay: `${idx * 0.1}s` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Spoken Text Result Box */}
          <div className="bg-warm-50 border-2 border-brand-200/80 rounded-3xl p-5 text-left relative min-h-[120px] shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-brand-800 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
                आपकी बात (Text):
              </span>
              {spokenText && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-warm-200 shadow-xs"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isEditing ? 'सहेजें' : 'बदलें (Edit)'}</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <textarea
                rows={3}
                value={spokenText}
                onChange={(e) => setSpokenText(e.target.value)}
                className="w-full bg-white p-3 rounded-xl border border-warm-300 text-lg font-medium text-warm-900 focus:outline-none focus:ring-2 focus:ring-brand-400 font-devanagari"
              />
            ) : (
              <p className="text-lg sm:text-xl font-bold text-warm-900 leading-relaxed font-devanagari">
                {spokenText || 'आप जो बोलेंगे, वह यहाँ अपने आप लिख जाएगा... ❤️'}
              </p>
            )}
          </div>

          {/* Quick Preset Samples to test with 1-click */}
          <div className="text-left space-y-2">
            <span className="text-xs font-bold text-warm-500 block">
              या इनमें से कोई उदाहरण चुनें (Try Demo Speech):
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_VOICE_SAMPLES.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleUsePreset(sample)}
                  className="text-xs bg-warm-100 hover:bg-brand-50 hover:text-brand-900 border border-warm-200 px-3 py-1.5 rounded-xl font-semibold text-warm-700 transition-colors text-left truncate max-w-full"
                >
                  "{sample.slice(0, 36)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-warm-100">
            <button
              onClick={() => {
                setSpokenText('');
                setIsVoicePostOpen(false);
              }}
              className="px-5 py-3 rounded-2xl border border-warm-300 font-bold text-warm-700 hover:bg-warm-100 transition-colors text-base"
            >
              रद्द करें
            </button>
            <button
              onClick={handlePublishVoicePost}
              disabled={!spokenText.trim()}
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-brand-800 to-brand-600 hover:from-brand-900 hover:to-brand-700 active:scale-95 text-white font-extrabold text-lg rounded-2xl shadow-soft disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
              <span>पोस्ट करें</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

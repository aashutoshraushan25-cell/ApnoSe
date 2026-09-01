import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, LANGUAGE_OPTIONS } from '../../context/LanguageContext';
import { Language } from '../../types';
import {
  X,
  Phone,
  Mail,
  Lock,
  User,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Globe,
  ArrowRight,
  Camera,
  Upload,
  Trash2,
  Check,
} from 'lucide-react';

import { compressImage } from '../../utils/imageCompression';

interface AuthModalProps {
  initialMode?: 'login' | 'register';
  onClose: () => void;
}

const PRESET_REGISTER_AVATARS = [
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = 'login',
  onClose,
}) => {
  const { login, register } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState<number>(52);
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regLocation, setRegLocation] = useState('नई दिल्ली');
  const [regLang, setRegLang] = useState<Language>(language);
  const [regAvatar, setRegAvatar] = useState(PRESET_REGISTER_AVATARS[0]);
  const [customAvatarUploaded, setCustomAvatarUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 450, 0.85);
        setRegAvatar(compressed);
        setCustomAvatarUploaded(true);
        setErrorMsg(null);
      } catch (err: any) {
        setErrorMsg(err.message || 'फ़ोटो लोड करने में विफल');
      }
    }
  };

  const handleRemoveCustomAvatar = () => {
    setCustomAvatarUploaded(false);
    setRegAvatar(PRESET_REGISTER_AVATARS[0]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const res = await login(identifier || 'rajesh', password);
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.message || 'लॉग इन विफल रहा');
    }
  };

  const handleSendOtp = () => {
    if (!identifier.trim()) {
      setErrorMsg('कृपया मोबाइल नंबर दर्ज करें');
      return;
    }
    setOtpSent(true);
    setOtp('1234'); // auto-fill demo OTP
    setErrorMsg(null);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Enforce 40+ rule
    if (regAge < 40) {
      setErrorMsg('⚠️ क्षमा करें, Apno Se केवल 40 वर्ष या उससे अधिक आयु के प्रियजनों के लिए समर्पित है।');
      return;
    }

    const res = await register({
      name: regName.trim(),
      age: Number(regAge),
      mobile: regMobile.trim(),
      email: regEmail.trim(),
      location: regLocation.trim(),
      preferredLanguage: regLang,
      avatar: regAvatar,
    });

    if (res.success) {
      setLanguage(regLang);
      onClose();
    } else {
      setErrorMsg(res.message || 'पंजीकरण विफल रहा');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-900/65 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-soft-xl border border-warm-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-brand-900 via-brand-800 to-purple-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 p-1.5 flex items-center justify-center">
              <img src="/logo.svg" alt="Apno Se" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold font-devanagari">
                {mode === 'login' ? 'अपनों से — लॉग इन करें' : 'नया खाता बनाएं (40+)'}
              </h2>
              <p className="text-xs text-purple-200 font-medium">
                {mode === 'login' ? 'अपने परिवार और दोस्तों से जुड़ें' : 'परिवार, दोस्त और यादों का अपना संसार'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 border-b border-warm-200 bg-warm-50">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`py-3.5 text-base font-extrabold transition-colors ${
              mode === 'login'
                ? 'bg-white text-brand-900 border-b-2 border-brand-700 font-black'
                : 'text-warm-600 hover:text-warm-900'
            }`}
          >
            लॉग इन (Login)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`py-3.5 text-base font-extrabold transition-colors ${
              mode === 'register'
                ? 'bg-white text-brand-900 border-b-2 border-brand-700 font-black'
                : 'text-warm-600 hover:text-warm-900'
            }`}
          >
            नया खाता (40+ Register)
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Error Message Display */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-center gap-2.5 text-rose-900 text-sm font-bold animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Age 40+ Welcome Badge */}
          <div className="bg-brand-50 border border-brand-200 rounded-2xl p-3.5 flex items-center gap-3 text-brand-900 text-xs sm:text-sm font-bold">
            <ShieldCheck className="w-5 h-5 text-brand-700 shrink-0" />
            <span>यह मंच केवल 40 वर्ष या उससे अधिक आयु के प्रियजनों के लिए सुरक्षित बनाया गया है।</span>
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-extrabold text-warm-800 mb-1.5 font-devanagari">
                  मोबाइल नंबर या ईमेल (Mobile / Email)
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-warm-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="+91 98765 43210 या rajesh.kumar@gmail.com"
                    className="w-full pl-12 pr-4 py-3 bg-warm-50 border border-warm-300 rounded-2xl text-base focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 text-warm-900"
                  />
                </div>
                <span className="text-[11px] text-warm-500 mt-1 block">
                  (डेमो के लिए सीधे 'लॉग इन करें' पर भी क्लिक कर सकते हैं)
                </span>
              </div>

              {!otpMode ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-extrabold text-warm-800 font-devanagari">
                      पासवर्ड (Password)
                    </label>
                    <button
                      type="button"
                      onClick={() => setOtpMode(true)}
                      className="text-xs font-bold text-brand-700 hover:underline"
                    >
                      OTP द्वारा लॉग इन करें &rarr;
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-warm-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3 bg-warm-50 border border-warm-300 rounded-2xl text-base focus:bg-white focus:border-brand-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-extrabold text-warm-800 font-devanagari">
                      4-अंकों का OTP
                    </label>
                    <button
                      type="button"
                      onClick={() => setOtpMode(false)}
                      className="text-xs font-bold text-brand-700 hover:underline"
                    >
                      पासवर्ड का उपयोग करें
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="1234"
                      className="flex-1 px-4 py-3 bg-warm-50 border border-warm-300 rounded-2xl text-center text-xl font-bold tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-4 py-3 bg-warm-100 hover:bg-brand-50 text-brand-900 border border-warm-300 rounded-2xl font-bold text-xs shrink-0"
                    >
                      {otpSent ? 'OTP भेजा गया ✓' : 'OTP भेजें'}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-brand-800 to-brand-600 hover:from-brand-900 hover:to-brand-700 text-white font-extrabold text-lg rounded-2xl shadow-soft active:scale-95 transition-all mt-2"
              >
                लॉग इन करें (Login)
              </button>
            </form>
          ) : (
            /* REGISTER FORM (40+ Enforced) */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              {/* Photo Upload Section: Device Upload + Preset Avatars */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-warm-800">
                    प्रोफ़ाइल फ़ोटो (Profile Photo):
                  </label>
                  {customAvatarUploaded && (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>आपकी फ़ोटो चुनी गई</span>
                    </span>
                  )}
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Device Upload Button Card */}
                <div className="bg-warm-50 border-2 border-dashed border-warm-300 hover:border-brand-500 rounded-2xl p-2.5 flex items-center justify-between gap-2.5 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-brand-100 flex items-center justify-center shrink-0 border border-brand-300">
                      {customAvatarUploaded ? (
                        <img src={regAvatar} alt="Custom" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-5 h-5 text-brand-700" />
                      )}
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-warm-900">
                        {customAvatarUploaded ? 'डिवाइस से फ़ोटो अपलोड की गई' : 'गैलरी / डिवाइस से फ़ोटो लगाएं'}
                      </p>
                      <p className="text-[10px] text-warm-500">
                        {customAvatarUploaded ? 'सफलतापूर्वक चुनी गई ✓' : 'फ़ोन या कंप्यूटर से फ़ोटो अपलोड करें'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-brand-800 hover:bg-brand-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{customAvatarUploaded ? 'बदलें' : 'फ़ोटो चुनें'}</span>
                    </button>
                    {customAvatarUploaded && (
                      <button
                        type="button"
                        onClick={handleRemoveCustomAvatar}
                        className="p-1.5 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors"
                        title="हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
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
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="जैसे: राजेश कुमार"
                  className="w-full px-4 py-3 bg-warm-50 border border-warm-300 rounded-2xl text-base font-devanagari"
                />
              </div>

              {/* Age (Enforced 40+) */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-extrabold text-warm-900 font-devanagari flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <span>आपकी आयु (Age - न्यूनतम 40 वर्ष) *</span>
                  </label>
                  <span className="text-lg font-black text-brand-900 bg-white px-3 py-0.5 rounded-xl border border-amber-300 shadow-xs">
                    {regAge} वर्ष
                  </span>
                </div>
                <input
                  type="range"
                  min={35}
                  max={90}
                  value={regAge}
                  onChange={(e) => setRegAge(Number(e.target.value))}
                  className="w-full accent-brand-700 cursor-pointer h-2 bg-amber-200 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-warm-500 font-bold mt-1">
                  <span>35 वर्ष (अस्वीकृत)</span>
                  <span className="text-brand-800 font-black">40+ वर्ष (स्वीकृत)</span>
                  <span>90 वर्ष</span>
                </div>
              </div>

              {/* Mobile / Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-extrabold text-warm-800 mb-1 font-devanagari">
                    मोबाइल नंबर *
                  </label>
                  <div className="flex rounded-2xl border border-warm-300 bg-warm-50 focus-within:bg-white focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-200 overflow-hidden transition-all">
                    <span className="inline-flex items-center px-2.5 bg-warm-200/80 border-r border-warm-300 text-warm-900 font-extrabold text-xs select-none gap-1 shrink-0">
                      <span>🇮🇳</span>
                      <span>+91</span>
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 00000"
                      className="w-full px-2.5 py-2 bg-transparent border-0 text-sm font-bold text-warm-950 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-warm-800 mb-1">
                    निवास शहर *
                  </label>
                  <input
                    type="text"
                    required
                    value={regLocation}
                    onChange={(e) => setRegLocation(e.target.value)}
                    placeholder="जैसे: नई दिल्ली"
                    className="w-full px-3 py-2.5 bg-warm-50 border border-warm-300 rounded-2xl text-sm font-devanagari"
                  />
                </div>
              </div>

              {/* Preferred Language */}
              <div>
                <label className="block text-xs font-extrabold text-warm-800 mb-1 font-devanagari">
                  पसंदीदा भाषा (Preferred Language)
                </label>
                <select
                  value={regLang}
                  onChange={(e) => setRegLang(e.target.value as Language)}
                  className="w-full px-4 py-2.5 bg-warm-50 border border-warm-300 rounded-2xl text-sm font-bold text-warm-900"
                >
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <option key={opt.code} value={opt.code}>
                      {opt.nativeName} ({opt.name})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-brand-800 to-brand-600 hover:from-brand-900 hover:to-brand-700 text-white font-extrabold text-lg rounded-2xl shadow-soft active:scale-95 transition-all mt-2"
              >
                खाता बनाएं (Join Apno Se) &rarr;
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};

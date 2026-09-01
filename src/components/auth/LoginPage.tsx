import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, LANGUAGE_OPTIONS } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Language, User } from '../../types';
import { DEMO_USERS } from '../../data/mockData';
import {
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User as UserIcon,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  Globe,
  ArrowRight,
  Volume2,
  VolumeX,
  Type,
  CheckCircle2,
  Heart,
  Video,
  Mic,
  MessageCircle,
  HelpCircle,
  Plus,
  KeyRound,
  RefreshCw,
  X,
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
  Check,
} from 'lucide-react';
import { compressImage } from '../../utils/imageCompression';

interface LoginPageProps {
  onExploreLanding?: () => void;
}

const PRESET_REGISTER_AVATARS = [
  { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400', label: 'राजेश (54)' },
  { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400', label: 'सुनीता (50)' },
  { url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400', label: 'सुरेश (58)' },
  { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400', label: 'मीनाक्षी (48)' },
];

const CURRENT_YEAR = new Date().getFullYear();

const MONTH_OPTIONS = [
  { value: 1, label: 'जनवरी (01)' },
  { value: 2, label: 'फ़रवरी (02)' },
  { value: 3, label: 'मार्च (03)' },
  { value: 4, label: 'अप्रैल (04)' },
  { value: 5, label: 'मई (05)' },
  { value: 6, label: 'जून (06)' },
  { value: 7, label: 'जुलाई (07)' },
  { value: 8, label: 'अगस्त (08)' },
  { value: 9, label: 'सितंबर (09)' },
  { value: 10, label: 'अक्टूबर (10)' },
  { value: 11, label: 'नवंबर (11)' },
  { value: 12, label: 'दिसंबर (12)' },
];

const YEAR_OPTIONS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);

// 8+ Characters & Mixed (Letters + Numbers + Special Characters) Password Strength Checker
export const checkPasswordStrength = (pass: string) => {
  const cleanPass = pass || '';
  const hasMinLength = cleanPass.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(cleanPass);
  const hasNumber = /[0-9]/.test(cleanPass);
  const hasSpecial = /[^a-zA-Z0-9]/.test(cleanPass);

  let score = 0;
  if (hasMinLength) score++;
  if (hasLetter) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  const isValid = hasMinLength && hasLetter && hasNumber && hasSpecial;

  let strengthLabel = 'कमजोर (Weak)';
  let strengthColor = 'bg-rose-500 text-rose-700';
  if (score === 4) {
    strengthLabel = 'अति सुरक्षित (Strong Mix) 🌟';
    strengthColor = 'bg-emerald-600 text-emerald-700';
  } else if (score === 3) {
    strengthLabel = 'मजबूत (Good) ✓';
    strengthColor = 'bg-teal-500 text-teal-700';
  } else if (score === 2) {
    strengthLabel = 'मध्यम (Medium)';
    strengthColor = 'bg-amber-500 text-amber-700';
  }

  return {
    isValid,
    hasMinLength,
    hasLetter,
    hasNumber,
    hasSpecial,
    score,
    strengthLabel,
    strengthColor,
  };
};

export const LoginPage: React.FC<LoginPageProps> = ({ onExploreLanding }) => {
  const { login, register, availableUsers } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { textSize, cycleTextSize, highContrast, toggleHighContrast } = useAccessibility();

  // Login Method Mode: 'password' | 'otp'
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');

  // Form states
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Login states
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState(['', '', '', '']);
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Register Modal state (Facebook-style popup)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Date of Birth (DOB) & Automatic Age Calculation
  const [dobDay, setDobDay] = useState<number>(15);
  const [dobMonth, setDobMonth] = useState<number>(6);
  const [dobYear, setDobYear] = useState<number>(1972);

  const calculateAgeFromDMY = (d: number, m: number, y: number): number => {
    if (!d || !m || !y) return 0;
    const birthDate = new Date(y, m - 1, d);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return Math.max(0, age);
  };

  const regAge = calculateAgeFromDMY(dobDay, dobMonth, dobYear);

  const [regCity, setRegCity] = useState('नई दिल्ली');
  const [regLang, setRegLang] = useState<Language>(language);
  const [regAvatar, setRegAvatar] = useState(PRESET_REGISTER_AVATARS[0].url);
  const [customAvatarUploaded, setCustomAvatarUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Privacy, encryption and safety consent checkboxes
  const [agreeAge, setAgreeAge] = useState(true);
  const [agreeFamilyPrivacy, setAgreeFamilyPrivacy] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreeEncryption, setAgreeEncryption] = useState(true);

  // Error & Feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle device image upload with automatic client-side resizing & compression
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedDataUrl = await compressImage(file, 450, 0.85);
        setRegAvatar(compressedDataUrl);
        setCustomAvatarUploaded(true);
        setErrorMsg(null);
      } catch (err: any) {
        setErrorMsg(err.message || 'फ़ोटो लोड करने में विफल। कृपया पुनः प्रयास करें।');
      }
    }
  };

  const handleRemoveCustomAvatar = () => {
    setCustomAvatarUploaded(false);
    setRegAvatar(PRESET_REGISTER_AVATARS[0].url);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Voice Narration
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Forgot Password Modal
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // OTP input refs
  const otpRef0 = useRef<HTMLInputElement>(null);
  const otpRef1 = useRef<HTMLInputElement>(null);
  const otpRef2 = useRef<HTMLInputElement>(null);
  const otpRef3 = useRef<HTMLInputElement>(null);

  // OTP Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  // Voice narration helper (Sarathi Voice)
  const handlePlayVoiceGuide = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const text = 'नमस्ते! अपनों से में आपका स्वागत है। आप अपने मोबाइल नंबर या पासवर्ड से लॉग इन कर सकते हैं, या बाईं तरफ दी गई अपनी प्रोफ़ाइल फोटो पर क्लिक करके सीधे 1-क्लिक में प्रवेश कर सकते हैं।';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      setIsSpeaking(true);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } else {
      alert('आपके ब्राउज़र में आवाज़ सहायक समर्थित नहीं है।');
    }
  };

  // 1. Submit Password Login
  const handlePasswordLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const identifier = emailOrPhone.trim();
    if (!identifier) {
      setErrorMsg('कृपया अपना मोबाइल नंबर या ईमेल पता दर्ज करें।');
      return;
    }

    setLoading(true);
    const res = await login(identifier, password || 'demo');
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.message || 'लॉग इन विफल रहा। कृपया सही विवरण दर्ज करें।');
    }
  };

  // 2. Handle Send OTP
  const handleSendOtp = () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMsg('कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setOtpCountdown(30);
      setSuccessMsg('SMS द्वारा 4-अंकों का OTP भेजा गया है। (डेमो OTP: 1234)');
      setTimeout(() => otpRef0.current?.focus(), 100);
    }, 500);
  };

  // Auto-fill OTP
  const handleAutoFillOtp = () => {
    setOtpValue(['1', '2', '3', '4']);
    setErrorMsg(null);
    otpRef3.current?.focus();
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, val: string) => {
    const char = val.slice(-1);
    const newOtp = [...otpValue];
    newOtp[index] = char;
    setOtpValue(newOtp);

    if (char && index === 0) otpRef1.current?.focus();
    if (char && index === 1) otpRef2.current?.focus();
    if (char && index === 2) otpRef3.current?.focus();
  };

  // Submit OTP Login
  const handleOtpLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const code = otpValue.join('');

    if (code.length < 4) {
      setErrorMsg('कृपया 4-अंकों का OTP दर्ज करें।');
      return;
    }

    setLoading(true);
    const res = await login(mobileNumber || 'rajesh', code);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.message || 'लॉग इन विफल रहा');
    }
  };

  // 3. Submit 40+ Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (regAge < 40) {
      setErrorMsg(`🚫 पंजीकरण अस्वीकृत: आपकी परिकलित आयु केवल ${regAge} वर्ष है। ApnoSe केवल 40 वर्ष या उससे अधिक आयु के प्रियजनों के लिए समर्पित है। 40 वर्ष से कम आयु के उपयोगकर्ता नया खाता नहीं बना सकते।`);
      return;
    }

    const fullName = `${regFirstName.trim()} ${regLastName.trim()}`.trim();
    if (!fullName) {
      setErrorMsg('कृपया अपना पूरा नाम दर्ज करें।');
      return;
    }

    const cleanMobile = regMobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMsg('कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें (उदा. 9876543210)।');
      return;
    }

    if (regEmail.trim() && !regEmail.includes('@')) {
      setErrorMsg('कृपया एक मान्य ईमेल पता दर्ज करें (उदा: rajesh@gmail.com)।');
      return;
    }

    const passStrength = checkPasswordStrength(regPassword);
    if (!passStrength.hasMinLength) {
      setErrorMsg('पासवर्ड कम से कम 8 अक्षरों (digits/chars) का होना आवश्यक है।');
      return;
    }

    if (!passStrength.isValid) {
      setErrorMsg('पासवर्ड में अक्षर (A-Z/a-z), अंक (0-9) और विशेष चिह्न (@, #, $, %, ! आदि) का मिश्रण (Mix) होना अनिवार्य है (उदा: ApnoSe@2026)।');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते। कृपया दोनों जगह समान पासवर्ड दर्ज करें।');
      return;
    }

    if (!agreeAge || !agreeFamilyPrivacy || !agreeTerms) {
      setErrorMsg('कृपया आगे बढ़ने के लिए 40+ आयु और गोपनीयता अनुमतियों को स्वीकार करें।');
      return;
    }

    const generatedEmail = regEmail.trim() || `${cleanMobile}@apnose.in`;
    const formattedDob = `${dobYear}-${String(dobMonth).padStart(2, '0')}-${String(dobDay).padStart(2, '0')}`;

    setLoading(true);
    const res = await register({
      name: fullName,
      age: Number(regAge),
      dateOfBirth: formattedDob,
      mobile: regMobile.startsWith('+91') ? regMobile.trim() : `+91 ${cleanMobile}`,
      email: generatedEmail,
      password: regPassword,
      location: regCity.trim() || 'नई दिल्ली',
      preferredLanguage: regLang,
      avatar: regAvatar,
      privacyAgreed: true,
      encryptionEnabled: agreeEncryption,
    });
    setLoading(false);

    if (res.success) {
      setLanguage(regLang);
      setIsRegisterOpen(false);
    } else {
      setErrorMsg(res.message || 'पंजीकरण विफल रहा');
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-warm-900 flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900 font-sans">
      
      {/* TOP ACCESSIBILITY BAR */}
      <header className="bg-white/80 backdrop-blur-md border-b border-warm-200/80 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          
          {/* Tagline Left */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-brand-900 bg-brand-100/80 px-2.5 py-1 rounded-full border border-brand-200">
              40+ समर्पित
            </span>
            <span className="text-xs text-warm-600 font-bold hidden sm:inline font-devanagari">
              भारत का अपना सुरक्षित पारिवारिक मंच 🌸
            </span>
          </div>

          {/* Quick Access Tools: Sarathi Voice + Text Size + High Contrast */}
          <div className="flex items-center gap-2">
            
            {/* Sarathi Voice Assistant */}
            <button
              onClick={handlePlayVoiceGuide}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border shadow-xs ${
                isSpeaking
                  ? 'bg-saffron-500 text-warm-950 border-saffron-600 animate-pulse font-black'
                  : 'bg-warm-100 hover:bg-warm-200 text-brand-900 border-warm-300'
              }`}
              title="सारथी AI हिंदी आवाज़ सुनें"
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-saffron-600" />}
              <span>{isSpeaking ? 'आवाज़ रोकें' : 'सारथी आवाज़ 🔊'}</span>
            </button>

            {/* Text Zoom */}
            <button
              onClick={cycleTextSize}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-warm-100 hover:bg-warm-200 border border-warm-300 rounded-xl text-warm-800 font-bold text-xs shadow-xs transition-colors"
              title="अक्षर का आकार बदलें"
            >
              <Type className="w-3.5 h-3.5 text-brand-700" />
              <span>{textSize === 'normal' ? 'A' : textSize === 'large' ? 'A+' : 'A++'}</span>
            </button>

            {/* High Contrast */}
            <button
              onClick={toggleHighContrast}
              title={highContrast ? 'सामान्य दृश्य' : 'उच्च स्पष्टता'}
              className={`p-1.5 rounded-xl border shadow-xs transition-colors ${
                highContrast ? 'bg-black text-yellow-300 border-black font-bold' : 'bg-warm-100 hover:bg-warm-200 border-warm-300 text-warm-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN TWO-COLUMN FACEBOOK-STYLE LOGIN HERO */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-16 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 w-full items-start">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Facebook-Style Brand Logo + Tagline + Features Grid */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 space-y-6 pt-2 lg:pt-6">
            
            {/* Big Facebook-style Brand Heading */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shadow-soft border-2 border-purple-200 bg-white p-0.5 shrink-0">
                  <img src="/logo.svg" alt="ApnoSe" className="w-full h-full object-contain" />
                </div>
                <div className="flex items-center gap-2">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-sans">
                    <span className="text-brand-900">Apno</span>
                    <span className="text-saffron-500">Se</span>
                  </h1>
                  <span className="text-xs sm:text-sm bg-saffron-100 text-saffron-800 font-black px-2.5 py-0.5 rounded-full border border-saffron-300">
                    40+
                  </span>
                </div>
              </div>

              {/* Tagline */}
              <p className="text-xl sm:text-2xl lg:text-[28px] font-semibold text-warm-800 leading-snug font-devanagari">
                अपने परिवार, पुराने दोस्तों और प्रियजनों से जुड़े रहें और जीवन की सुंदर यादें साझा करें।
              </p>
            </div>

            {/* Senior-Friendly Feature Highlights Showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-warm-200 shadow-xs flex items-start gap-3.5 hover:border-purple-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0 shadow-2xs">
                  <Heart className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-warm-900 font-devanagari">
                    पारिवारिक व सुरक्षित माहौल
                  </h4>
                  <p className="text-xs text-warm-500 mt-0.5 leading-relaxed">
                    केवल अपने परिवार व मित्रों के साथ बिना स्पैम व विज्ञापनों के संवाद करें।
                  </p>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-warm-200 shadow-xs flex items-start gap-3.5 hover:border-emerald-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-warm-900 font-devanagari">
                    100% एंड-टू-एंड एन्क्रिप्शन
                  </h4>
                  <p className="text-xs text-warm-500 mt-0.5 leading-relaxed">
                    आपकी तस्वीरें, संदेश और यादें पूरी तरह सुरक्षित व निजी हैं।
                  </p>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-warm-200 shadow-xs flex items-start gap-3.5 hover:border-amber-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-saffron-100 flex items-center justify-center text-saffron-800 shrink-0 shadow-2xs">
                  <Mic className="w-5 h-5 text-saffron-700" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-warm-900 font-devanagari">
                    बोलकर पोस्ट व आवाज़ सहायक
                  </h4>
                  <p className="text-xs text-warm-500 mt-0.5 leading-relaxed">
                    टाइपिंग की कोई चिंता नहीं — बोलकर पोस्ट लिखें और संदेशों को सुनें।
                  </p>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-warm-200 shadow-xs flex items-start gap-3.5 hover:border-rose-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 shrink-0 shadow-2xs">
                  <Video className="w-5 h-5 text-rose-700" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-warm-900 font-devanagari">
                    1-टच सीधा वीडियो व ऑडियो कॉल
                  </h4>
                  <p className="text-xs text-warm-500 mt-0.5 leading-relaxed">
                    सरल और स्पष्ट वीडियो कॉलिंग से दूर रहकर भी अपनों के पास महसूस करें।
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Senior Friendly Trust Highlights */}
            <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm font-bold text-warm-700 pt-1">
              <div className="flex items-center gap-2 bg-white/70 p-3 rounded-2xl border border-warm-200 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>100% सुरक्षित</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 p-3 rounded-2xl border border-warm-200 shadow-xs">
                <Mic className="w-5 h-5 text-purple-600 shrink-0" />
                <span>सुलभ आवाज़</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 p-3 rounded-2xl border border-warm-200 shadow-xs">
                <Heart className="w-5 h-5 text-rose-600 shrink-0" />
                <span>केवल परिवार</span>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: The Iconic Elevated Facebook Login Card */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            <div className="w-full max-w-[430px] bg-white rounded-3xl shadow-soft-2xl border border-warm-200 p-6 sm:p-7 space-y-4">
              
              {/* Error Message */}
              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-center gap-2.5 text-rose-900 text-xs sm:text-sm font-bold animate-shake">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Success Message */}
              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center gap-2.5 text-emerald-900 text-xs sm:text-sm font-bold animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Toggle Login Method Tabs: Password vs Mobile OTP */}
              <div className="grid grid-cols-2 bg-warm-100 p-1 rounded-2xl text-xs font-extrabold text-center">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('password');
                    setErrorMsg(null);
                  }}
                  className={`py-2 rounded-xl transition-all ${
                    loginMethod === 'password'
                      ? 'bg-white text-brand-900 shadow-xs font-black'
                      : 'text-warm-600 hover:text-warm-900'
                  }`}
                >
                  पासवर्ड लॉग इन
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('otp');
                    setErrorMsg(null);
                  }}
                  className={`py-2 rounded-xl transition-all ${
                    loginMethod === 'otp'
                      ? 'bg-white text-brand-900 shadow-xs font-black'
                      : 'text-warm-600 hover:text-warm-900'
                  }`}
                >
                  📱 मोबाइल OTP
                </button>
              </div>

              {/* ------------------------------------------- */}
              {/* METHOD 1: PASSWORD LOGIN (Standard FB Style) */}
              {/* ------------------------------------------- */}
              {loginMethod === 'password' ? (
                <form onSubmit={handlePasswordLoginSubmit} className="space-y-3.5">
                  
                  {/* Email / Mobile input */}
                  <div>
                    <input
                      type="text"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="मोबाइल नंबर या ईमेल पता"
                      className="w-full px-4 py-3.5 bg-warm-50/70 border-2 border-warm-300 rounded-2xl text-base text-warm-950 placeholder:text-warm-400 focus:bg-white focus:border-brand-600 focus:ring-4 focus:ring-brand-100 font-semibold transition-all"
                    />
                  </div>

                  {/* Password input with show/hide & 8+ chars helper */}
                  <div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="पासवर्ड (कम से कम 8 अक्षर - उदा. Pass@1234)"
                        className="w-full pl-4 pr-12 py-3.5 bg-warm-50/70 border-2 border-warm-300 rounded-2xl text-base text-warm-950 placeholder:text-warm-400 focus:bg-white focus:border-brand-600 focus:ring-4 focus:ring-brand-100 font-semibold transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-700"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-warm-500 font-semibold mt-1 px-1">
                      <span>🔒 8+ अक्षरों का मिश्रित पासवर्ड (अक्षर + अंक + चिह्न)</span>
                      {password && password.length < 8 && (
                        <span className="text-amber-600 font-bold">({password.length}/8 अक्षर)</span>
                      )}
                    </div>
                  </div>

                  {/* Big Primary Login Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-brand-800 hover:bg-brand-900 active:scale-[0.98] text-white font-extrabold text-lg rounded-2xl shadow-soft hover:shadow-soft-lg transition-all"
                  >
                    {loading ? 'लॉग इन हो रहा है...' : 'लॉग इन करें (Log In)'}
                  </button>

                  {/* Forgotten Password Link */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(true)}
                      className="text-xs sm:text-sm font-bold text-brand-800 hover:text-brand-950 hover:underline"
                    >
                      पासवर्ड भूल गए? (Forgotten password?)
                    </button>
                  </div>
                </form>
              ) : (
                /* ------------------------------------------- */
                /* METHOD 2: MOBILE OTP LOGIN                  */
                /* ------------------------------------------- */
                <form onSubmit={otpSent ? handleOtpLoginSubmit : (e) => { e.preventDefault(); handleSendOtp(); }} className="space-y-3.5">
                  
                  {/* Mobile input with 🇮🇳 prefix */}
                  <div>
                    <label className="block text-xs font-bold text-warm-700 mb-1 font-devanagari">
                      मोबाइल नंबर (Mobile Number)
                    </label>
                    <div className="flex rounded-2xl border-2 border-warm-300 bg-warm-50/70 focus-within:bg-white focus-within:border-brand-600 focus-within:ring-4 focus-within:ring-brand-100 overflow-hidden transition-all">
                      <div className="flex items-center gap-1.5 px-3.5 bg-warm-200/80 border-r border-warm-300 text-warm-900 font-extrabold text-sm select-none shrink-0">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="98765 43210"
                        className="w-full px-3.5 py-3.5 bg-transparent border-0 text-base font-bold text-warm-950 focus:outline-none focus:ring-0 placeholder:text-warm-400"
                      />
                    </div>
                  </div>

                  {/* OTP Pins when sent */}
                  {otpSent ? (
                    <div className="space-y-2 pt-1 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-warm-700">4-अंकों का OTP:</span>
                        <button
                          type="button"
                          onClick={handleAutoFillOtp}
                          className="text-[11px] font-black text-brand-800 bg-brand-100 px-2.5 py-0.5 rounded-lg border border-brand-300 hover:bg-brand-200"
                        >
                          OTP भरें (1234)
                        </button>
                      </div>

                      <div className="flex justify-between gap-2">
                        <input
                          ref={otpRef0}
                          type="text"
                          maxLength={1}
                          value={otpValue[0]}
                          onChange={(e) => handleOtpChange(0, e.target.value)}
                          className="w-13 h-13 text-center text-2xl font-black bg-warm-50 border-2 border-warm-300 rounded-xl focus:border-brand-600 focus:bg-white text-brand-900"
                        />
                        <input
                          ref={otpRef1}
                          type="text"
                          maxLength={1}
                          value={otpValue[1]}
                          onChange={(e) => handleOtpChange(1, e.target.value)}
                          className="w-13 h-13 text-center text-2xl font-black bg-warm-50 border-2 border-warm-300 rounded-xl focus:border-brand-600 focus:bg-white text-brand-900"
                        />
                        <input
                          ref={otpRef2}
                          type="text"
                          maxLength={1}
                          value={otpValue[2]}
                          onChange={(e) => handleOtpChange(2, e.target.value)}
                          className="w-13 h-13 text-center text-2xl font-black bg-warm-50 border-2 border-warm-300 rounded-xl focus:border-brand-600 focus:bg-white text-brand-900"
                        />
                        <input
                          ref={otpRef3}
                          type="text"
                          maxLength={1}
                          value={otpValue[3]}
                          onChange={(e) => handleOtpChange(3, e.target.value)}
                          className="w-13 h-13 text-center text-2xl font-black bg-warm-50 border-2 border-warm-300 rounded-xl focus:border-brand-600 focus:bg-white text-brand-900"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-brand-800 hover:bg-brand-900 active:scale-[0.98] text-white font-extrabold text-base rounded-2xl shadow-soft transition-all mt-2"
                      >
                        {loading ? 'सत्यापन...' : 'OTP सत्यापित करें & प्रवेश करें'}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="w-full py-3.5 bg-brand-800 hover:bg-brand-900 active:scale-[0.98] text-white font-extrabold text-base rounded-2xl shadow-soft transition-all"
                    >
                      {loading ? 'भेजा जा रहा है...' : 'OTP भेजें (Get OTP)'}
                    </button>
                  )}
                </form>
              )}

              {/* FACEBOOK STYLE DIVIDER LINE */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-warm-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-warm-400 font-bold">या</span>
                </div>
              </div>

              {/* FACEBOOK STYLE GREEN "CREATE NEW ACCOUNT" BUTTON */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterOpen(true);
                    setErrorMsg(null);
                  }}
                  className="px-6 py-3.5 bg-[#42b72a] hover:bg-[#36a420] text-white font-extrabold text-base sm:text-lg rounded-2xl shadow-soft hover:shadow-soft-lg active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>नया खाता बनाएं (Create New Account)</span>
                </button>
              </div>

            </div>

            {/* Bottom Subtext */}
            <div className="mt-6 text-center text-xs sm:text-sm text-warm-600 font-semibold max-w-sm">
              <span className="font-extrabold text-warm-900 font-devanagari">ApnoSe (अपनों से)</span> 40+ आयु वर्ग के प्रियजनों के लिए भारत का 100% सुरक्षित मंच है।
              {onExploreLanding && (
                <button
                  type="button"
                  onClick={onExploreLanding}
                  className="block mx-auto mt-1.5 text-brand-800 font-black hover:underline"
                >
                  मंच की विशेषताएं देखें (Explore App Tour) &rarr;
                </button>
              )}
            </div>

          </div>

        </div>
      </main>

      {/* ========================================================================= */}
      {/* FACEBOOK-STYLE REGISTRATION POPUP MODAL (40+ Enforced)                    */}
      {/* ========================================================================= */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-soft-2xl border border-warm-200 overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Header */}
            <div className="p-5 border-b border-warm-200 flex items-start justify-between bg-warm-50/50">
              <div>
                <h2 className="text-2xl font-black text-warm-950 font-devanagari">
                  नया खाता बनाएं (Sign Up)
                </h2>
                <p className="text-xs text-warm-500 font-semibold font-devanagari">
                  यह बहुत आसान और तेज़ है — केवल 40+ आयु के प्रियजनों के लिए।
                </p>
              </div>
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="p-1.5 rounded-full hover:bg-warm-200 text-warm-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleRegisterSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              
              {/* Error in modal */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-2xl text-xs font-bold text-rose-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Photo Upload Section: Device Upload + Preset Avatars */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-warm-800 uppercase tracking-wide">
                    प्रोफ़ाइल फ़ोटो (Profile Photo):
                  </label>
                  {customAvatarUploaded && (
                    <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
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

                {/* Device Upload Button Card / Dropzone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-warm-50 border-2 border-dashed border-warm-300 hover:border-brand-500 rounded-2xl p-3 flex items-center justify-between gap-3 transition-colors cursor-pointer group hover:bg-brand-50/40"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-brand-100 flex items-center justify-center shrink-0 border-2 border-brand-400 shadow-xs relative group-hover:scale-105 transition-transform">
                      {customAvatarUploaded ? (
                        <img src={regAvatar} alt="Custom Profile" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-7 h-7 text-brand-700" />
                      )}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <Upload className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <p className="font-extrabold text-sm text-warm-950 font-devanagari">
                        {customAvatarUploaded ? 'फ़ोटो सफलतापूर्वक जोड़ी गई ✓' : 'अपने डिवाइस / गैलरी से फ़ोटो लगाएं'}
                      </p>
                      <p className="text-[11px] text-warm-500 font-medium">
                        {customAvatarUploaded ? 'प्रोफ़ाइल फ़ोटो तैयार है (बदलने के लिए क्लिक करें)' : 'फ़ोन या कंप्यूटर से अपनी पसंदीदा फ़ोटो चुनें'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-3.5 py-2 bg-brand-800 hover:bg-brand-900 text-white rounded-xl text-xs font-extrabold shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{customAvatarUploaded ? 'बदलें' : 'फ़ोटो चुनें'}</span>
                    </button>
                    {customAvatarUploaded && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCustomAvatar();
                        }}
                        className="p-2 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors"
                        title="फ़ोटो हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* First Name & Last Name (Facebook 2-column style) */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                  placeholder="प्रथम नाम (First Name)"
                  className="w-full px-3.5 py-3 bg-warm-50 border-2 border-warm-300 rounded-2xl text-base font-semibold text-warm-900 focus:bg-white focus:border-brand-600"
                />
                <input
                  type="text"
                  required
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  placeholder="उपनाम (Surname)"
                  className="w-full px-3.5 py-3 bg-warm-50 border-2 border-warm-300 rounded-2xl text-base font-semibold text-warm-900 focus:bg-white focus:border-brand-600"
                />
              </div>

              {/* Date of Birth (DOB) with Automatic Age Calculation */}
              <div className="bg-amber-50/80 border-2 border-amber-200/90 rounded-2xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs sm:text-sm font-black text-warm-950 font-devanagari flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <span>जन्म तिथि (Date of Birth) *</span>
                  </label>
                  
                  {/* Real-Time Calculated Age Pill */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-warm-600 font-bold">गणना की गई आयु:</span>
                    <span className={`text-sm sm:text-base font-black px-3 py-0.5 rounded-xl border shadow-xs transition-all ${
                      regAge >= 40 
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300 animate-in fade-in' 
                        : 'bg-rose-100 text-rose-900 border-rose-300 animate-shake'
                    }`}>
                      {regAge > 0 ? `${regAge} वर्ष` : 'चुनें'}
                    </span>
                  </div>
                </div>

                {/* 3 Large Senior-Friendly Dropdowns: Day, Month, Year */}
                <div className="grid grid-cols-3 gap-2.5">
                  {/* Day */}
                  <div>
                    <label className="block text-[11px] font-bold text-warm-700 mb-1 font-devanagari">दिन (Day)</label>
                    <select
                      value={dobDay}
                      onChange={(e) => setDobDay(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-white border-2 border-warm-300 rounded-xl text-sm sm:text-base font-black text-warm-950 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 shadow-2xs cursor-pointer"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Month */}
                  <div>
                    <label className="block text-[11px] font-bold text-warm-700 mb-1 font-devanagari">माह (Month)</label>
                    <select
                      value={dobMonth}
                      onChange={(e) => setDobMonth(Number(e.target.value))}
                      className="w-full px-2 py-2.5 bg-white border-2 border-warm-300 rounded-xl text-xs sm:text-sm font-black text-warm-950 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 shadow-2xs cursor-pointer"
                    >
                      {MONTH_OPTIONS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-[11px] font-bold text-warm-700 mb-1 font-devanagari">वर्ष (Year)</label>
                    <select
                      value={dobYear}
                      onChange={(e) => setDobYear(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-white border-2 border-warm-300 rounded-xl text-sm sm:text-base font-black text-warm-950 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 shadow-2xs cursor-pointer"
                    >
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status Message based on Calculated Age */}
                <div className="pt-1">
                  {regAge >= 40 ? (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 bg-emerald-100/90 px-3 py-2 rounded-xl border border-emerald-300 shadow-2xs animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>✓ पात्रता स्वीकृत: आपकी आयु {regAge} वर्ष है (40+ वरिष्ठ नागरिक मंच के लिए योग्य)।</span>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2.5 text-xs font-bold text-rose-900 bg-rose-100/95 p-3 rounded-xl border-2 border-rose-400 shadow-xs animate-shake">
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-black text-rose-950 text-xs sm:text-sm">
                          🚫 खाता बनाने की अनुमति नहीं है (आयु 40 वर्ष से कम)
                        </p>
                        <p className="text-[11px] text-rose-800 font-semibold mt-0.5 leading-relaxed">
                          आपकी परिकलित आयु केवल <strong>{regAge} वर्ष</strong> है। ApnoSe विशेष रूप से 40 वर्ष या उससे अधिक आयु के वरिष्ठ नागरिकों के लिए है। 40 वर्ष से कम आयु वाले नया खाता नहीं बना सकते।
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Number (Dedicated Input Group) */}
              <div>
                <label className="block text-xs font-black text-warm-800 mb-1 font-devanagari">
                  मोबाइल नंबर (Mobile Number) *
                </label>
                <div className="flex rounded-2xl border-2 border-warm-300 bg-warm-50 focus-within:bg-white focus-within:border-brand-600 focus-within:ring-4 focus-within:ring-brand-100 overflow-hidden transition-all">
                  <div className="flex items-center gap-1.5 px-3.5 bg-warm-200/80 border-r border-warm-300 text-warm-900 font-extrabold text-sm select-none shrink-0">
                    <span className="text-base">🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full px-3.5 py-3 bg-transparent border-0 text-base font-bold text-warm-950 focus:outline-none focus:ring-0 placeholder:text-warm-400"
                  />
                </div>
                <span className="text-[11px] text-warm-500 mt-0.5 block">
                  (10 अंकों का भारतीय मोबाइल नंबर दर्ज करें)
                </span>
              </div>

              {/* Email Address (Dedicated Input - Optional) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-black text-warm-800 font-devanagari">
                    ईमेल पता (Email Address)
                  </label>
                  <span className="text-[11px] text-warm-500 font-bold">वैकल्पिक (Optional)</span>
                </div>
                <div className="relative">
                  <Mail className="w-5 h-5 text-warm-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="उदा. rajesh.kumar@gmail.com (यदि है तो)"
                    className="w-full pl-11 pr-4 py-3 bg-warm-50 border-2 border-warm-300 rounded-2xl text-base font-semibold text-warm-900 focus:bg-white focus:border-brand-600 focus:ring-4 focus:ring-brand-100"
                  />
                </div>
              </div>

              {/* Password & Confirm Password (Dedicated Inputs with Eye Toggle & 8+ Mix Checklist) */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* New Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-black text-warm-800 font-devanagari">
                        पासवर्ड बनाएं (New Password) *
                      </label>
                      {regPassword && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          checkPasswordStrength(regPassword).isValid 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {checkPasswordStrength(regPassword).strengthLabel}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-warm-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="उदा. ApnoSe@2026"
                        className="w-full pl-9 pr-9 py-2.5 bg-warm-50 border-2 border-warm-300 rounded-2xl text-sm font-semibold text-warm-900 focus:bg-white focus:border-brand-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-700"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-black text-warm-800 font-devanagari">
                        पासवर्ड की पुष्टि (Confirm) *
                      </label>
                      {regConfirmPassword && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          regPassword === regConfirmPassword
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {regPassword === regConfirmPassword ? '✓ मेल खाता है' : '✗ मेल नहीं है'}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-warm-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showRegConfirmPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="पासवर्ड दोबारा लिखें"
                        className="w-full pl-9 pr-9 py-2.5 bg-warm-50 border-2 border-warm-300 rounded-2xl text-sm font-semibold text-warm-900 focus:bg-white focus:border-brand-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-700"
                      >
                        {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                </div>

                {/* 8+ Digit / Mixed Character Requirement Checklist & Strength Bar */}
                <div className="bg-warm-100/70 border border-warm-200 rounded-2xl p-3 space-y-2">
                  {/* Strength Bar */}
                  {regPassword && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-warm-700">
                        <span>पासवर्ड सुरक्षा स्तर:</span>
                        <span className="font-extrabold">{checkPasswordStrength(regPassword).strengthLabel}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 h-1.5 rounded-full overflow-hidden bg-warm-200">
                        <div className={`h-full ${checkPasswordStrength(regPassword).score >= 1 ? checkPasswordStrength(regPassword).strengthColor.split(' ')[0] : 'bg-transparent'}`} />
                        <div className={`h-full ${checkPasswordStrength(regPassword).score >= 2 ? checkPasswordStrength(regPassword).strengthColor.split(' ')[0] : 'bg-transparent'}`} />
                        <div className={`h-full ${checkPasswordStrength(regPassword).score >= 3 ? checkPasswordStrength(regPassword).strengthColor.split(' ')[0] : 'bg-transparent'}`} />
                        <div className={`h-full ${checkPasswordStrength(regPassword).score >= 4 ? checkPasswordStrength(regPassword).strengthColor.split(' ')[0] : 'bg-transparent'}`} />
                      </div>
                    </div>
                  )}

                  {/* 4 Requirements: 8+ Chars, Letters, Numbers, Special Symbols */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] font-semibold">
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-all ${
                      regPassword.length >= 8 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' 
                        : 'bg-white text-warm-600 border-warm-200'
                    }`}>
                      {regPassword.length >= 8 ? '✓' : '○'} 8+ अक्षर
                    </span>

                    <span className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-all ${
                      /[a-zA-Z]/.test(regPassword) 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' 
                        : 'bg-white text-warm-600 border-warm-200'
                    }`}>
                      {/[a-zA-Z]/.test(regPassword) ? '✓' : '○'} अक्षर (A-Z)
                    </span>

                    <span className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-all ${
                      /[0-9]/.test(regPassword) 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' 
                        : 'bg-white text-warm-600 border-warm-200'
                    }`}>
                      {/[0-9]/.test(regPassword) ? '✓' : '○'} अंक (0-9)
                    </span>

                    <span className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-all ${
                      /[^a-zA-Z0-9]/.test(regPassword) 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' 
                        : 'bg-white text-warm-600 border-warm-200'
                    }`}>
                      {/[^a-zA-Z0-9]/.test(regPassword) ? '✓' : '○'} चिह्न (@#$)
                    </span>
                  </div>
                </div>
              </div>

              {/* City & Language */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-warm-800 mb-1 font-devanagari">
                    निवास शहर (City) *
                  </label>
                  <input
                    type="text"
                    required
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    placeholder="जैसे: नई दिल्ली / वाराणसी"
                    className="w-full px-3.5 py-2.5 bg-warm-50 border-2 border-warm-300 rounded-2xl text-sm font-semibold text-warm-900 focus:bg-white focus:border-brand-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-warm-800 mb-1 font-devanagari">
                    पसंदीदा भाषा (Language)
                  </label>
                  <select
                    value={regLang}
                    onChange={(e) => setRegLang(e.target.value as Language)}
                    className="w-full px-3 py-2.5 bg-warm-50 border-2 border-warm-300 rounded-2xl text-sm font-bold text-warm-900 focus:bg-white focus:border-brand-600"
                  >
                    {LANGUAGE_OPTIONS.map((opt) => (
                      <option key={opt.code} value={opt.code}>
                        {opt.nativeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PRIVACY & SAFETY PERMISSION CHECKBOXES */}
              <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center gap-2 text-purple-950 font-black text-xs uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
                  <span>गोपनीयता व सुरक्षा अनुमतियां (Privacy & Safety Permissions)</span>
                </div>

                <div className="space-y-2">
                  {/* Permission 1: 40+ Age */}
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs font-semibold text-warm-800">
                    <input
                      type="checkbox"
                      required
                      checked={agreeAge}
                      onChange={(e) => setAgreeAge(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-brand-700 focus:ring-brand-500 border-warm-300 shrink-0"
                    />
                    <span>
                      मैं प्रमाणित करता हूँ कि मेरी आयु 40 वर्ष या उससे अधिक है।
                    </span>
                  </label>

                  {/* Permission 2: Family Privacy */}
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs font-semibold text-warm-800">
                    <input
                      type="checkbox"
                      required
                      checked={agreeFamilyPrivacy}
                      onChange={(e) => setAgreeFamilyPrivacy(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-brand-700 focus:ring-brand-500 border-warm-300 shrink-0"
                    />
                    <span>
                      मेरी तस्वीरें, पारिवारिक पोस्ट व यादें केवल मेरे चुने हुए परिवार और मित्रों तक सुरक्षित रहेंगी (100% डेटा गोपनीयता)।
                    </span>
                  </label>

                  {/* Permission 3: Terms & Policies */}
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs font-semibold text-warm-800">
                    <input
                      type="checkbox"
                      required
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-brand-700 focus:ring-brand-500 border-warm-300 shrink-0"
                    />
                    <span>
                      मैं ApnoSe (अपनों से) की सेवा शर्तें व गोपनीयता नीतियां स्वीकार करता हूँ।
                    </span>
                  </label>

                  {/* Permission 4: Zero-Knowledge Encryption */}
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs font-bold text-purple-950 bg-purple-100/70 p-2 rounded-xl border border-purple-200">
                    <input
                      type="checkbox"
                      checked={agreeEncryption}
                      onChange={(e) => setAgreeEncryption(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-purple-700 focus:ring-purple-500 border-purple-300 shrink-0"
                    />
                    <span>
                      🔐 शून्य-ज्ञान एंड-टू-एंड डेटा एन्क्रिप्शन: मेरा डेटा (फोटो, मेडिकल पर्चियां, संदेश) डिवाइस पर ही एन्क्रिप्ट रहेगा ताकि सर्वर भी इसे न देख सके।
                    </span>
                  </label>
                </div>
              </div>

              {/* Facebook-style Green Sign Up Submit Button */}
              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={loading || regAge < 40 || !agreeAge || !agreeFamilyPrivacy || !agreeTerms}
                  className={`w-full sm:w-auto px-10 py-3.5 text-white font-extrabold text-base sm:text-lg rounded-2xl shadow-soft transition-all ${
                    regAge < 40
                      ? 'bg-rose-500/70 cursor-not-allowed text-rose-100 border-2 border-rose-400 shadow-none'
                      : 'bg-[#00a400] hover:bg-[#008f00] disabled:bg-warm-300 disabled:cursor-not-allowed hover:shadow-soft-lg active:scale-95'
                  }`}
                >
                  {regAge < 40
                    ? `🚫 40+ वर्ष अनिवार्य (आपकी आयु: ${regAge} वर्ष)`
                    : loading
                    ? 'खाता बन रहा है...'
                    : 'खाता बनाएं (Sign Up) 🌸'}
                </button>

                {regAge < 40 && (
                  <p className="text-xs font-bold text-rose-600 mt-2 font-devanagari">
                    ⚠️ 40 वर्ष से कम आयु होने के कारण पंजीकरण अक्षम (Disabled) है।
                  </p>
                )}
              </div>

            </form>

          </div>
        </div>
      )}

      {/* FORGOT PASSWORD MODAL */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-soft-2xl border border-warm-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-warm-100 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-brand-700" />
                <h3 className="font-extrabold text-lg text-warm-900 font-devanagari">पासवर्ड पुनः प्राप्त करें</h3>
              </div>
              <button
                onClick={() => {
                  setForgotModalOpen(false);
                  setForgotOtpSent(false);
                }}
                className="p-1 rounded-full hover:bg-warm-100 text-warm-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!forgotOtpSent ? (
              <div className="space-y-3">
                <p className="text-xs text-warm-600 font-medium">
                  अपना पंजीकृत मोबाइल नंबर दर्ज करें, हम आपको पासवर्ड रीसेट करने के लिए OTP भेजेंगे।
                </p>
                <input
                  type="tel"
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 bg-warm-50 border-2 border-warm-300 rounded-2xl text-base font-bold text-warm-900"
                />
                <button
                  type="button"
                  onClick={() => setForgotOtpSent(true)}
                  className="w-full py-3 bg-brand-800 text-white font-extrabold rounded-2xl shadow-soft"
                >
                  रीसेट OTP भेजें
                </button>
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-900">
                  ✓ OTP भेजा गया (डेमो OTP: 1234)
                </div>
                <input
                  type="text"
                  placeholder="4 अंकों का OTP (1234)"
                  className="w-full px-4 py-3 bg-warm-50 border-2 border-warm-300 rounded-2xl text-base font-bold"
                />
                <div className="space-y-1.5">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="नया पासवर्ड (8+ अक्षर - उदा. NayaPass@2026)"
                    className="w-full px-4 py-3 bg-warm-50 border-2 border-warm-300 rounded-2xl text-base font-bold text-warm-900 focus:bg-white focus:border-brand-600"
                  />
                  <div className="grid grid-cols-2 gap-1 text-[11px] font-semibold px-1">
                    <span className={newPassword.length >= 8 ? 'text-emerald-700 font-bold' : 'text-warm-500'}>
                      {newPassword.length >= 8 ? '✓' : '○'} 8+ अक्षर
                    </span>
                    <span className={checkPasswordStrength(newPassword).isValid ? 'text-emerald-700 font-bold' : 'text-warm-500'}>
                      {checkPasswordStrength(newPassword).isValid ? '✓ मिश्रित (Mix)' : '○ अक्षर+अंक+चिह्न (@#$)'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!checkPasswordStrength(newPassword).isValid}
                  onClick={() => {
                    const check = checkPasswordStrength(newPassword);
                    if (!check.isValid) {
                      setErrorMsg('नया पासवर्ड कम से कम 8 अक्षरों का होना चाहिए और उसमें अक्षर, अंक व विशेष चिह्न का मिश्रण आवश्यक है।');
                      return;
                    }
                    setForgotModalOpen(false);
                    setForgotOtpSent(false);
                    setSuccessMsg('आपका पासवर्ड सफलतापूर्वक रीसेट हो गया है। कृपया नए पासवर्ड से लॉग इन करें।');
                  }}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-warm-300 disabled:cursor-not-allowed text-white font-extrabold rounded-2xl shadow-soft transition-all"
                >
                  नया पासवर्ड सहेजें &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FACEBOOK-STYLE MULTI-LANGUAGE & NAVIGATION FOOTER                          */}
      {/* ========================================================================= */}
      <footer className="bg-white border-t border-warm-200 py-8 text-xs text-warm-500 font-medium">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          
          {/* Languages list row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-warm-100 pb-3">
            {LANGUAGE_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                onClick={() => setLanguage(opt.code)}
                className={`hover:underline ${
                  language === opt.code ? 'font-black text-warm-900' : 'text-warm-500'
                }`}
              >
                {opt.nativeName}
              </button>
            ))}
            <button className="w-6 h-5 bg-warm-100 border border-warm-300 rounded text-warm-700 font-bold flex items-center justify-center hover:bg-warm-200">
              +
            </button>
          </div>

          {/* Nav links row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-warm-500">
            <button onClick={() => setIsRegisterOpen(true)} className="hover:underline">खाता बनाएं</button>
            <span>•</span>
            <button onClick={() => setLoginMethod('password')} className="hover:underline">लॉग इन करें</button>
            <span>•</span>
            <button onClick={() => setLoginMethod('otp')} className="hover:underline">मोबाइल OTP</button>
            <span>•</span>
            <span className="hover:underline cursor-pointer">पारिवारिक मंडल</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">समुदाय</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">जन्मदिन व उत्सव</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">सुरक्षा केंद्र</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">गोपनीयता नीति</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">सहायता केंद्र</span>
          </div>

          {/* Copyright */}
          <div className="pt-2 text-[11px] text-warm-400">
            ApnoSe (अपनों से) © 2026. 40+ आयु वर्ग के भारतीय परिवारों के लिए समर्पित।
          </div>

        </div>
      </footer>

    </div>
  );
};

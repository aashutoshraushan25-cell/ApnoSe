import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AuthModal } from './AuthModal';
import {
  Heart,
  Phone,
  Video,
  Mic,
  ShieldCheck,
  Users,
  FolderHeart,
  Cake,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Type,
  ArrowRight,
  Star,
} from 'lucide-react';

interface LandingPageProps {
  onOpenLogin?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenLogin }) => {
  const { t } = useLanguage();
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | null>(null);

  const features = [
    {
      icon: Phone,
      color: 'bg-emerald-100 text-emerald-700',
      title: 'एक-टच कॉल व वीडियो (Easy Calling)',
      desc: 'बिना नंबर याद रखे सिर्फ एक क्लिक में अपने बच्चों या जीवनसाथी से बात करें।',
    },
    {
      icon: Heart,
      color: 'bg-rose-100 text-rose-700',
      title: 'पारिवारिक रिश्ते व मंडल (Family Connections)',
      desc: 'पत्नी, बेटा, बेटी, भाई और माताजी के अलग-अलग रिश्ते और उनकी ताजा खबरें।',
    },
    {
      icon: Mic,
      color: 'bg-purple-100 text-purple-700',
      title: 'बोलकर पोस्ट करें (Voice-to-Post)',
      desc: 'टाइप करने की कोई जरूरत नहीं — बस अपनी आवाज़ में बोलिए और पोस्ट तैयार।',
    },
    {
      icon: ShieldCheck,
      color: 'bg-blue-100 text-blue-700',
      title: '100% सुरक्षित व निजी (Safe & Private)',
      desc: 'कोई फर्जी कॉल या फ्रॉड नहीं। आपकी घरेलू तस्वीरें केवल आपके अपनों को दिखेंगी।',
    },
    {
      icon: FolderHeart,
      color: 'bg-amber-100 text-amber-700',
      title: 'रुचि के समुदाय (Communities)',
      desc: 'बागवानी, पारंपरिक रसोई, योग, स्वास्थ्य, पुराने गीत और स्थानीय चर्चाएं।',
    },
    {
      icon: Type,
      color: 'bg-indigo-100 text-indigo-700',
      title: 'बड़े व स्पष्ट अक्षर (Large Readable UI)',
      desc: 'आंखों पर जोर नहीं — अपनी सुविधा अनुसार अक्षरों को बड़ा या बहुत बड़ा करें।',
    },
    {
      icon: Cake,
      color: 'bg-rose-100 text-rose-700',
      title: 'जन्मदिन व उत्सव याद दिलाना (Celebration Alerts)',
      desc: 'परिवार में किसका जन्मदिन या वर्षगांठ है, कभी नहीं भूलेंगे। 1-क्लिक में आशीर्वाद भेजें।',
    },
    {
      icon: HelpCircle,
      color: 'bg-teal-100 text-teal-700',
      title: 'सारथी AI आवाज सहायक (Voice Assistant)',
      desc: 'ऐप चलाने में कोई भी परेशानी हो तो सारथी AI हिंदी में बोलकर आपकी मदद करेगा।',
    },
  ];

  const steps = [
    {
      num: '1',
      title: 'सरल प्रोफ़ाइल बनाएं',
      desc: 'केवल नाम, शहर और भाषा चुनकर 1 मिनट में शुरुआत करें।',
    },
    {
      num: '2',
      title: 'परिवार व दोस्तों को जोड़ें',
      desc: 'अपने परिवार के सदस्यों को उनके रिश्ते के साथ मंडल में जोड़ें।',
    },
    {
      num: '3',
      title: 'फोटो, आवाज व यादें साझा करें',
      desc: 'बगीचे के फूल, घर के पकवान या सुबह का सुविचार अपनों तक पहुंचाएं।',
    },
    {
      num: '4',
      title: 'समान रुचि के समूहों से जुड़ें',
      desc: 'बागवानी, भजन और स्वास्थ्य चर्चाओं में भाग लें।',
    },
  ];

  const testimonials = [
    {
      name: 'राजेश कुमार (54 वर्ष)',
      city: 'नई दिल्ली',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
      comment: 'मुझे इंस्टाग्राम बहुत उलझन भरा लगता था। अपनों से पर बड़े अक्षर और परिवार को कॉल करना बहुत आसान है। मेरी सुबह की बागवानी वाली पोस्ट सभी रिश्तेदार देखते हैं।',
    },
    {
      name: 'सुनीता कुमार (50 वर्ष)',
      city: 'वाराणसी',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      comment: 'बेटा बेंगलुरु में रहता है, अब रोज बिना किसी परेशानी के वीडियो कॉल हो जाती है। ऐप में फ्रॉड से बचने की सलाह बहुत अच्छी है।',
    },
    {
      name: 'सुरेश वर्मा (58 वर्ष)',
      city: 'लखनऊ',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
      comment: 'बोलकर पोस्ट लिखने की सुविधा लाजवाब है। मैं अपनी रेलवे की पुरानी यादें और कविताएं आसानी से साझा कर पाता हूँ।',
    },
  ];

  return (
    <div className="min-h-screen bg-warm-50 text-warm-900 font-sans selection:bg-brand-100 selection:text-brand-900">
      
      {/* Top Simple Landing Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-soft border border-purple-200">
            <img src="/logo.svg" alt="ApnoSe" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black tracking-tight font-sans">
              <span className="bg-gradient-to-r from-brand-900 to-brand-700 bg-clip-text text-transparent">Apno</span>
              <span className="bg-gradient-to-r from-saffron-500 to-saffron-600 bg-clip-text text-transparent">Se</span>
            </span>
            <span className="ml-2 text-xs bg-saffron-100 text-saffron-800 font-extrabold px-2.5 py-0.5 rounded-full border border-saffron-300">
              40+
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenLogin ? onOpenLogin() : setAuthModalMode('login')}
            className="px-5 py-2.5 rounded-2xl font-bold text-warm-800 hover:text-brand-900 hover:bg-white text-base transition-colors"
          >
            लॉग इन (Login)
          </button>
          <button
            onClick={() => onOpenLogin ? onOpenLogin() : setAuthModalMode('register')}
            className="px-6 py-2.5 bg-brand-800 hover:bg-brand-900 active:scale-95 text-white font-extrabold text-base rounded-2xl shadow-soft transition-all"
          >
            खाता बनाएं (40+)
          </button>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100/80 border border-brand-300/80 rounded-full text-brand-900 text-sm font-black shadow-xs">
              <Sparkles className="w-4 h-4 text-saffron-500" />
              <span>40+ आयु के लिए भारत का पहला समर्पित पारिवारिक मंच</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-devanagari text-warm-950 tracking-tight leading-[1.15]">
              अपने लोगों से जुड़े रहें।
            </h1>

            <p className="text-xl sm:text-2xl font-bold text-brand-800 font-devanagari">
              "परिवार • दोस्त • समुदाय • यादें"
            </p>

            <p className="text-lg sm:text-xl text-warm-700 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed font-devanagari">
              A simple and सुरक्षित social network designed with large text, easy 1-touch calling, voice posting, and complete privacy.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => setAuthModalMode('register')}
                className="w-full sm:w-auto px-9 py-4 bg-gradient-to-r from-brand-800 via-brand-700 to-brand-600 hover:from-brand-900 hover:to-brand-700 text-white font-black text-lg sm:text-xl rounded-3xl shadow-soft-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-brand-400"
              >
                <span>शुरुआत करें (Join Apno Se)</span>
                <ArrowRight className="w-6 h-6" />
              </button>

              <button
                onClick={() => setAuthModalMode('login')}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-warm-100 text-warm-900 font-extrabold text-lg sm:text-xl rounded-3xl border-2 border-warm-300 shadow-soft transition-all"
              >
                लॉग इन करें (Login)
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs sm:text-sm font-bold text-warm-600">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% विज्ञापन-मुक्त व सुरक्षित</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>सरल हिंदी व मातृभाषाएं</span>
              </span>
            </div>
          </div>

          {/* Right Hero Illustration / Real Warm Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white p-4 rounded-3xl shadow-soft-xl border-4 border-brand-200 rotate-1 hover:rotate-0 transition-transform">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-warm-100">
                <img
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800"
                  alt="Happy Indian family using Apno Se"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="bg-saffron-500 text-warm-950 font-black text-xs px-2.5 py-0.5 rounded-md">
                    सुखी परिवार
                  </span>
                  <p className="font-extrabold text-lg font-devanagari mt-1">
                    "अपनों से — जहाँ हर रिश्ता अनमोल है"
                  </p>
                </div>
              </div>

              {/* Floating feature pills on Hero */}
              <div className="absolute -bottom-6 -left-6 bg-white p-3.5 rounded-2xl shadow-soft-lg border border-warm-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-xs font-bold text-warm-500 block">पारिवारिक मंडल</span>
                  <span className="font-extrabold text-sm text-warm-900">1-टच सीधा कॉल</span>
                </div>
              </div>

              <div className="absolute -top-5 -right-5 bg-brand-900 text-white p-3 rounded-2xl shadow-soft-lg border border-brand-700 flex items-center gap-2">
                <Mic className="w-4 h-4 text-saffron-300 animate-pulse" />
                <span className="text-xs font-black">बोलकर पोस्ट करें 🎤</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FEATURE SECTION */}
      <section className="bg-white py-16 sm:py-20 border-y border-warm-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-sm font-black text-brand-700 uppercase tracking-wider">
              विशेषताएं (Why Apno Se)
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-warm-900 font-devanagari">
              40+ प्रियजनों की सुविधा व सम्मान के लिए निर्मित
            </h2>
            <p className="text-lg text-warm-600 font-medium font-devanagari">
              कोई जटिल मेनू नहीं, कोई भ्रामक विज्ञापन नहीं — सिर्फ आपके अपने लोग और उनकी खुशियां।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-warm-50/70 p-6 rounded-3xl border border-warm-200/80 hover:border-brand-300 hover:bg-white hover:shadow-soft transition-all space-y-3"
                >
                  <div className={`w-14 h-14 rounded-2xl ${feat.color} flex items-center justify-center shadow-xs`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-extrabold text-xl text-warm-900 font-devanagari">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-warm-600 font-medium leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-sm font-black text-brand-700 uppercase tracking-wider">
            सरल प्रक्रिया (How It Works)
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-warm-900 font-devanagari">
            4 आसान चरणों में शुरुआत करें
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-warm-200 shadow-soft text-center space-y-3 relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-800 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md">
                {s.num}
              </div>
              <h3 className="font-extrabold text-xl text-warm-900 font-devanagari">
                {s.title}
              </h3>
              <p className="text-sm text-warm-600 font-medium leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TESTIMONIALS */}
      <section className="bg-gradient-to-b from-purple-50 to-warm-100 py-16 sm:py-20 border-t border-warm-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-sm font-black text-brand-700 uppercase">
              हमारे सदस्यों के अनुभव
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-warm-900 font-devanagari">
              "अब सोशल मीडिया का मतलब सिर्फ परिवार है"
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-warm-200 shadow-soft flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-base text-warm-800 font-medium leading-relaxed italic font-devanagari">
                  "{test.comment}"
                </p>

                <div className="flex items-center gap-3 pt-3 border-t border-warm-100">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-brand-500"
                  />
                  <div>
                    <h4 className="font-extrabold text-base text-warm-900 font-devanagari">
                      {test.name}
                    </h4>
                    <span className="text-xs text-warm-500 font-bold">📍 {test.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-brand-950 text-white py-12 border-t border-brand-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/20 p-1 flex items-center justify-center">
              <img src="/logo.svg" alt="ApnoSe Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight block">
                <span className="text-white">Apno</span>
                <span className="text-saffron-400">Se</span>
              </span>
              <span className="text-xs text-purple-300 font-medium font-devanagari">"अपने लोगों से जुड़े रहें।"</span>
            </div>
          </div>

          <p className="text-sm text-purple-200 font-medium">
            © 2026 ApnoSe. Designed exclusively for 40+ families with love & safety.
          </p>

          <button
            onClick={() => setAuthModalMode('register')}
            className="px-6 py-3 bg-saffron-500 hover:bg-saffron-600 text-warm-950 font-black rounded-2xl text-base shadow-md transition-colors"
          >
            अभी खाता बनाएं (Join Free)
          </button>
        </div>
      </footer>

      {/* Auth Modal */}
      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
        />
      )}

    </div>
  );
};

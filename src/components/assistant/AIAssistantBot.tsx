import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { SpeechService } from '../../services/speechService';
import {
  HelpCircle,
  X,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  actionTab?: 'home' | 'family' | 'safety' | 'settings';
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'फोटो या वीडियो कैसे पोस्ट करें?',
    answer: 'होम स्क्रीन पर ऊपर "+ पोस्ट बनाएं" या "📷 फोटो" बटन दबाएं। अपनी फोटो चुनें, कुछ शब्द लिखें या बोलें, और नीचे बड़ा बैंगनी "पोस्ट करें" बटन दबाएं।',
    actionTab: 'home',
  },
  {
    question: 'परिवार के सदस्य को कैसे जोड़ें?',
    answer: 'बाईं तरफ "मेरा परिवार" विकल्प पर जाएं या होम पेज पर "+ परिवार जोड़ें" बटन दबाएं। सदस्य का नाम, रिश्ता (जैसे: बेटा, पत्नी) और मोबाइल नंबर डालकर जोड़ें।',
    actionTab: 'family',
  },
  {
    question: 'वीडियो कॉल या फोन कॉल कैसे करें?',
    answer: 'अपने परिवार या दोस्त के कार्ड पर जाएं और सीधे हरे "📞 कॉल" या बैंगनी "📹 वीडियो" बटन पर क्लिक करें। कोई नंबर मिलाने की जरूरत नहीं है।',
    actionTab: 'family',
  },
  {
    question: 'अक्षर (Font Size) और बड़ा कैसे करें?',
    answer: 'स्क्रीन पर सबसे ऊपर "A+ (बड़ा)" बटन दिया गया है। उसे एक बार दबाने पर पूरे ऐप के अक्षर बड़े और स्पष्ट हो जाएंगे।',
    actionTab: 'settings',
  },
  {
    question: 'ऑनलाइन धोखाधड़ी (Fraud) से कैसे बचें?',
    answer: 'कभी भी किसी अनजान कॉल या मैसेज में अपना OTP, पासवर्ड या बैंक खाता नंबर न दें। बिजली बिल कटने या लॉटरी के संदेश फर्जी होते हैं।',
    actionTab: 'safety',
  },
  {
    question: 'बोलकर पोस्ट कैसे लिखें?',
    answer: 'ऊपर "🎤 आवाज़" बटन दबाएं। लाल माइक पर क्लिक करें और बोलें। आपके शब्द अपने आप लिख जाएंगे। फिर "पोस्ट करें" दबा दें।',
  },
];

export const AIAssistantBot: React.FC = () => {
  const { t, language } = useLanguage();
  const { setActiveTab, setIsCreatePostOpen, setIsVoicePostOpen, setIsAddFamilyOpen } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text: 'नमस्ते! मैं आपका सारथी AI सहायक हूँ। इस ऐप को चलाने में आपकी क्या मदद करूँ? नीचे दिए गए प्रश्नों में से चुनें या अपनी बात लिखें। 🙏',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSelectFAQ = (faq: FAQItem) => {
    const newMsgs = [
      ...messages,
      { sender: 'user' as const, text: faq.question },
      { sender: 'bot' as const, text: faq.answer },
    ];
    setMessages(newMsgs);

    // Speak aloud for accessibility
    SpeechService.speakText(faq.answer, language);
  };

  const handleCustomQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const q = inputQuery.trim().toLowerCase();
    let reply = 'मैं आपकी बात समझ रहा हूँ। आप होम पेज पर दिए गए बड़े बटनों का उपयोग करके आसानी से पोस्ट कर सकते हैं या परिवार से बात कर सकते हैं।';

    if (q.includes('फोटो') || q.includes('photo') || q.includes('तस्वीर')) {
      reply = 'फोटो डालने के लिए ऊपर "📷 फोटो" बटन दबाएं और अपनी मनपसंद तस्वीर चुनकर "पोस्ट करें" पर क्लिक करें।';
    } else if (q.includes('कॉल') || q.includes('call') || q.includes('video')) {
      reply = 'कॉल करने के लिए "मेरा परिवार" पेज पर जाएं और सदस्य के नाम के आगे "📞 कॉल" या "📹 वीडियो" दबाएं।';
    } else if (q.includes('सुरक्षा') || q.includes('otp') || q.includes('धोखा') || q.includes('scam')) {
      reply = 'सुरक्षा केंद्र में जाएं। किसी को भी बैंक OTP न दें। Apno Se पर आपकी जानकारी पूरी तरह सुरक्षित है।';
    } else if (q.includes('बड़ा') || q.includes('font') || q.includes('अक्षर')) {
      reply = 'ऊपर दाएं कोने में "A+ (बड़ा)" बटन पर क्लिक करके अक्षरों का आकार बढ़ा सकते हैं।';
    }

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: inputQuery.trim() },
      { sender: 'bot', text: reply },
    ]);

    setInputQuery('');
    SpeechService.speakText(reply, language);
  };

  const handleReadLatest = (text: string) => {
    if (isSpeaking) {
      SpeechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      SpeechService.speakText(text, language).then(() => setIsSpeaking(false));
    }
  };

  return (
    <>
      {/* Floating Bottom Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 lg:bottom-8 right-5 z-40 flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-brand-900 to-brand-700 hover:from-brand-800 hover:to-brand-600 text-white rounded-full font-extrabold text-base shadow-soft-xl border-2 border-saffron-300 hover:scale-105 active:scale-95 transition-all group"
          title="सारथी AI सहायक"
        >
          <div className="w-8 h-8 rounded-full bg-saffron-400 text-brand-950 flex items-center justify-center font-black text-lg shadow-sm group-hover:rotate-12 transition-transform">
            ❓
          </div>
          <span className="font-devanagari tracking-wide">मदद चाहिए? (सारथी AI)</span>
        </button>
      )}

      {/* Floating Assistant Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 w-[94vw] sm:w-[420px] bg-white rounded-3xl shadow-2xl border-2 border-brand-500 overflow-hidden flex flex-col h-[540px] animate-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-brand-900 via-brand-800 to-purple-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-saffron-400 text-brand-950 flex items-center justify-center font-extrabold text-xl shadow-md">
                🤖
              </div>
              <div>
                <h3 className="font-extrabold text-lg font-devanagari leading-tight">
                  सारथी AI (Help Assistant)
                </h3>
                <p className="text-xs text-saffron-200 font-medium">
                  सरल भाषा में आपकी सहायता के लिए
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                SpeechService.stopSpeaking();
                setIsOpen(false);
              }}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-warm-50/60">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-base leading-relaxed font-devanagari space-y-1.5 shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-brand-700 text-white font-semibold rounded-br-none'
                      : 'bg-white text-warm-900 border border-warm-200 rounded-bl-none font-medium'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Read Aloud Button for Bot message */}
                  {msg.sender === 'bot' && (
                    <div className="pt-1 flex items-center justify-end">
                      <button
                        onClick={() => handleReadLatest(msg.text)}
                        className="flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-900 bg-brand-50 px-2 py-0.5 rounded-md"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>सुनें 🔊</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Quick Suggested FAQ Options */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-bold text-warm-500 uppercase tracking-wider block">
                अक्सर पूछे जाने वाले सवाल:
              </span>
              <div className="space-y-1.5">
                {FAQ_ITEMS.map((faq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectFAQ(faq)}
                    className="w-full text-left p-2.5 bg-white hover:bg-brand-50 border border-warm-200 rounded-xl text-xs sm:text-sm font-bold text-warm-800 hover:text-brand-900 transition-colors flex items-center justify-between gap-2 shadow-xs"
                  >
                    <span>{faq.question}</span>
                    <ChevronRight className="w-4 h-4 text-warm-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div ref={chatEndRef} />
          </div>

          {/* Query Input */}
          <form onSubmit={handleCustomQuery} className="p-3 bg-white border-t border-warm-200 flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="अपना प्रश्न यहाँ पूछें..."
              className="flex-1 px-4 py-2.5 bg-warm-50 border border-warm-300 rounded-2xl text-sm font-devanagari focus:bg-white focus:border-brand-500 text-warm-900"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-2.5 bg-brand-800 hover:bg-brand-900 disabled:opacity-40 text-white rounded-2xl shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};

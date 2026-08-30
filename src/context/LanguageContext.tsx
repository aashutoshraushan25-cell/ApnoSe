import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface Translations {
  appName: string;
  tagline: string;
  secondaryTagline: string;
  home: string;
  family: string;
  friends: string;
  messages: string;
  communities: string;
  notifications: string;
  profile: string;
  safety: string;
  settings: string;
  createPost: string;
  searchPlaceholder: string;
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  greetingNight: string;
  addFamilyMember: string;
  call: string;
  videoCall: string;
  sendMessage: string;
  like: string;
  comment: string;
  share: string;
  save: string;
  saved: string;
  post: string;
  whatsOnYourMind: string;
  addPhoto: string;
  addVideo: string;
  recordVoice: string;
  addFeeling: string;
  addLocation: string;
  audience: string;
  everyone: string;
  friendsOnly: string;
  familyOnly: string;
  onlyMe: string;
  birthdayToday: string;
  sendWishes: string;
  upcomingEvents: string;
  voiceToPost: string;
  speakNow: string;
  listening: string;
  pressToSpeak: string;
  aiHelpTitle: string;
  safetyCenterTitle: string;
  textSize: string;
  normalText: string;
  largeText: string;
  extraLargeText: string;
  highContrast: string;
  login: string;
  register: string;
  logout: string;
  ageRequirementNotice: string;
  needHelp: string;
}

const translations: Record<Language, Translations> = {
  hi: {
    appName: 'अपनों से',
    tagline: 'अपने लोगों से जुड़े रहें।',
    secondaryTagline: 'परिवार • दोस्त • समुदाय • यादें',
    home: 'होम',
    family: 'परिवार',
    friends: 'दोस्त',
    messages: 'संदेश',
    communities: 'समुदाय',
    notifications: 'सूचनाएं',
    profile: 'मेरी प्रोफ़ाइल',
    safety: 'सुरक्षा केंद्र',
    settings: 'सेटिंग्स',
    createPost: '+ पोस्ट बनाएं',
    searchPlaceholder: 'लोग, पोस्ट और समुदाय खोजें...',
    greetingMorning: 'सुप्रभात',
    greetingAfternoon: 'नमस्ते',
    greetingEvening: 'शुभ संध्या',
    greetingNight: 'शुभ रात्रि',
    addFamilyMember: '+ परिवार जोड़ें',
    call: 'कॉल करें',
    videoCall: 'वीडियो कॉल',
    sendMessage: 'संदेश भेजें',
    like: 'पसंद करें',
    comment: 'टिप्पणी करें',
    share: 'साझा करें',
    save: 'यादें जोड़ें',
    saved: 'सहेजा गया',
    post: 'पोस्ट करें',
    whatsOnYourMind: 'आज आप क्या साझा करना चाहते हैं?',
    addPhoto: '📷 फोटो',
    addVideo: '🎥 वीडियो',
    recordVoice: '🎤 आवाज़',
    addFeeling: '😊 भावना',
    addLocation: '📍 स्थान',
    audience: 'किसे दिखेगा?',
    everyone: 'सबको',
    friendsOnly: 'केवल दोस्त',
    familyOnly: 'केवल परिवार',
    onlyMe: 'सिर्फ मैं',
    birthdayToday: 'आज जन्मदिन है',
    sendWishes: 'शुभकामनाएं भेजें 🎉',
    upcomingEvents: 'आगामी जन्मदिन व उत्सव',
    voiceToPost: 'बोलकर पोस्ट करें',
    speakNow: 'अब बोलिए...',
    listening: 'हम आपकी बात सुन रहे हैं...',
    pressToSpeak: 'माइक दबाकर बोलना शुरू करें',
    aiHelpTitle: 'सारथी AI — आपकी मदद के लिए',
    safetyCenterTitle: 'परिवार व डिजिटल सुरक्षा केंद्र',
    textSize: 'अक्षर का आकार (Font Size)',
    normalText: 'सामान्य',
    largeText: 'बड़ा',
    extraLargeText: 'बहुत बड़ा',
    highContrast: 'उच्च स्पष्टता (High Contrast)',
    login: 'लॉग इन करें',
    register: 'नया खाता बनाएं',
    logout: 'लॉग आउट',
    ageRequirementNotice: 'यह मंच 40+ उम्र के प्रियजनों के लिए समर्पित है',
    needHelp: 'मदद चाहिए?',
  },
  en: {
    appName: 'Apno Se',
    tagline: 'Stay connected with your loved ones.',
    secondaryTagline: 'Family • Friends • Communities • Memories',
    home: 'Home',
    family: 'Family',
    friends: 'Friends',
    messages: 'Messages',
    communities: 'Communities',
    notifications: 'Notifications',
    profile: 'My Profile',
    safety: 'Safety Center',
    settings: 'Settings',
    createPost: '+ Create Post',
    searchPlaceholder: 'Search people, posts, and groups...',
    greetingMorning: 'Good Morning',
    greetingAfternoon: 'Namaste',
    greetingEvening: 'Good Evening',
    greetingNight: 'Good Night',
    addFamilyMember: '+ Add Family',
    call: 'Call',
    videoCall: 'Video Call',
    sendMessage: 'Send Message',
    like: 'Like',
    comment: 'Comment',
    share: 'Share',
    save: 'Save Memory',
    saved: 'Saved',
    post: 'Publish Post',
    whatsOnYourMind: 'What would you like to share today?',
    addPhoto: '📷 Photo',
    addVideo: '🎥 Video',
    recordVoice: '🎤 Voice',
    addFeeling: '😊 Feeling',
    addLocation: '📍 Location',
    audience: 'Who can see this?',
    everyone: 'Everyone',
    friendsOnly: 'Friends Only',
    familyOnly: 'Family Only',
    onlyMe: 'Only Me',
    birthdayToday: 'Today is Birthday',
    sendWishes: 'Send Warm Wishes 🎉',
    upcomingEvents: 'Upcoming Birthdays & Events',
    voiceToPost: 'Voice to Post',
    speakNow: 'Speak now...',
    listening: 'Listening to your voice...',
    pressToSpeak: 'Press microphone to speak',
    aiHelpTitle: 'Sarathi AI — Here to Help',
    safetyCenterTitle: 'Family & Digital Safety Center',
    textSize: 'Text Size',
    normalText: 'Normal',
    largeText: 'Large',
    extraLargeText: 'Extra Large',
    highContrast: 'High Contrast',
    login: 'Login',
    register: 'Create Account',
    logout: 'Logout',
    ageRequirementNotice: 'Apno Se is designed specifically for adults aged 40+',
    needHelp: 'Need Help?',
  },
  bho: {
    appName: 'अपनो से',
    tagline: 'अपन लोगन से जुड़ल रहीं।',
    secondaryTagline: 'परिवार • यार-दोस्त • समाज • सुरत-याद',
    home: 'घर (होम)',
    family: 'परिवार',
    friends: 'संगी-दोस्त',
    messages: 'संदेश',
    communities: 'समाज-टोली',
    notifications: 'खबर-सूचना',
    profile: 'हमार प्रोफ़ाइल',
    safety: 'सुरक्षा घेरा',
    settings: 'सेटिंग',
    createPost: '+ नया बात साझा करीं',
    searchPlaceholder: 'लोग, बात आ टोली खोजीं...',
    greetingMorning: 'सुप्रभात जी',
    greetingAfternoon: 'प्रणाम जी',
    greetingEvening: 'शुभ संध्या',
    greetingNight: 'शुभ रात्रि',
    addFamilyMember: '+ परिवार जोड़ीं',
    call: 'कॉल करीं',
    videoCall: 'वीडियो कॉल',
    sendMessage: 'संदेश भेजीं',
    like: 'पसंद',
    comment: 'राय दीं',
    share: 'आगे भेजीं',
    save: 'संजोईं',
    saved: 'संजोवल गइल',
    post: 'साझा करीं',
    whatsOnYourMind: 'आज राउर मन में का बात बा?',
    addPhoto: '📷 फोटो',
    addVideo: '🎥 वीडियो',
    recordVoice: '🎤 बोली',
    addFeeling: '😊 मन के भाव',
    addLocation: '📍 जगह',
    audience: 'के देखि?',
    everyone: 'सभ केहू',
    friendsOnly: 'खाली दोस्त',
    familyOnly: 'खाली परिवार',
    onlyMe: 'खाली हम',
    birthdayToday: 'आजु जन्मदिन बा',
    sendWishes: 'बधाई भेजीं 🎉',
    upcomingEvents: 'आवे वाला उत्सव',
    voiceToPost: 'बोल के लिखीं',
    speakNow: 'अब बोलीं...',
    listening: 'हम रउवा बात सुनत बानी...',
    pressToSpeak: 'माइक दबा के बोलीं',
    aiHelpTitle: 'सारथी AI — राउर मददगार',
    safetyCenterTitle: 'सुरक्षा केंद्र',
    textSize: 'अक्षर के नाप',
    normalText: 'साधारण',
    largeText: 'बड़का',
    extraLargeText: 'खूब बड़का',
    highContrast: 'साफ़-साफ़ (हाई कंट्रास्ट)',
    login: 'भीतर आईं',
    register: 'खाता बनाईं',
    logout: 'बाहर निकलीं',
    ageRequirementNotice: 'ई मंच 40+ उमर के लोगन खातिर बा',
    needHelp: 'मदद चाहीं?',
  },
  mr: {
    appName: 'अपनों से',
    tagline: 'आपल्या माणसांशी जोडलेले राहा.',
    secondaryTagline: 'कुटुंब • मित्र • समाज • आठवणी',
    home: 'मुख्यपृष्ठ',
    family: 'माझे कुटुंब',
    friends: 'मित्रमंडळी',
    messages: 'संदेश',
    communities: 'समुदाय व गट',
    notifications: 'सूचना',
    profile: 'माझे प्रोफाइल',
    safety: 'सुरक्षा केंद्र',
    settings: 'सेटिंग्ज',
    createPost: '+ पोस्ट तयार करा',
    searchPlaceholder: 'व्यक्ती, पोस्ट आणि गट शोधा...',
    greetingMorning: 'शुभ सकाळ',
    greetingAfternoon: 'नमस्कार',
    greetingEvening: 'शुभ संध्याकाळ',
    greetingNight: 'शुभ रात्री',
    addFamilyMember: '+ कुटुंब सदस्य जोडा',
    call: 'कॉल करा',
    videoCall: 'व्हिडिओ कॉल',
    sendMessage: 'संदेश पाठवा',
    like: 'आवडले',
    comment: 'प्रतिक्रिया',
    share: 'शेअर करा',
    save: 'जतन करा',
    saved: 'जतन केले',
    post: 'पोस्ट करा',
    whatsOnYourMind: 'आज तुम्हाला काय शेअर करायचे आहे?',
    addPhoto: '📷 फोटो',
    addVideo: '🎥 व्हिडिओ',
    recordVoice: '🎤 आवाज',
    addFeeling: '😊 भावना',
    addLocation: '📍 ठिकाण',
    audience: 'कोणाला दिसेल?',
    everyone: 'सर्वांना',
    friendsOnly: 'फक्त मित्र',
    familyOnly: 'फक्त कुटुंब',
    onlyMe: 'फक्त मी',
    birthdayToday: 'आज वाढदिवस आहे',
    sendWishes: 'शुभेच्छा पाठवा 🎉',
    upcomingEvents: 'पुढील कार्यक्रम व वाढदिवस',
    voiceToPost: 'बोलून पोस्ट करा',
    speakNow: 'आता बोला...',
    listening: 'आम्ही ऐकत आहोत...',
    pressToSpeak: 'माईक दाबून बोला',
    aiHelpTitle: 'सारथी AI — मदतीसाठी',
    safetyCenterTitle: 'कुटुंब व डिजिटल सुरक्षा केंद्र',
    textSize: 'अक्षरांचा आकार',
    normalText: 'सामान्य',
    largeText: 'मोठा',
    extraLargeText: 'खूप मोठा',
    highContrast: 'स्पष्ट दृष्टी (High Contrast)',
    login: 'लॉग इन',
    register: 'नोंदणी करा',
    logout: 'लॉग आऊट',
    ageRequirementNotice: 'हे व्यासपीठ ४०+ वयोगटातील प्रियजनांसाठी आहे',
    needHelp: 'मदत हवी आहे?',
  },
  bn: {
    appName: 'আপনো সে',
    tagline: 'আপন মানুষদের সাথে যুক্ত থাকুন।',
    secondaryTagline: 'পরিবার • বন্ধু • সম্প্রদায় • স্মৃতি',
    home: 'হোম',
    family: 'আমার পরিবার',
    friends: 'বন্ধুবান্ধব',
    messages: 'বার্তা',
    communities: 'গ্রুপ ও সম্প্রদায়',
    notifications: 'বিজ্ঞপ্তি',
    profile: 'আমার প্রোফাইল',
    safety: 'নিরাপত্তা কেন্দ্র',
    settings: 'সেটিংস',
    createPost: '+ পোস্ট তৈরি করুন',
    searchPlaceholder: 'মানুষ, পোস্ট এবং গ্রুপ খুঁজুন...',
    greetingMorning: 'সুপ্রভাত',
    greetingAfternoon: 'নমস্কার',
    greetingEvening: 'শুভ সন্ধ্যা',
    greetingNight: 'শুভ রাত্রি',
    addFamilyMember: '+ পরিবার যুক্ত করুন',
    call: 'কল করুন',
    videoCall: 'ভিডিও কল',
    sendMessage: 'বার্তা পাঠান',
    like: 'পছন্দ',
    comment: 'মন্তব্য',
    share: 'শেয়ার করুন',
    save: 'সংরক্ষণ',
    saved: 'সংরক্ষিত',
    post: 'পোস্ট করুন',
    whatsOnYourMind: 'আজ আপনি কি শেয়ার করতে চান?',
    addPhoto: '📷 ছবি',
    addVideo: '🎥 ভিডিও',
    recordVoice: '🎤 কণ্ঠস্বর',
    addFeeling: '😊 অনুভূতি',
    addLocation: '📍 স্থান',
    audience: 'কে দেখতে পাবে?',
    everyone: 'সকলে',
    friendsOnly: 'শুধুমাত্র বন্ধু',
    familyOnly: 'শুধুমাত্র পরিবার',
    onlyMe: 'শুধু আমি',
    birthdayToday: 'আজ জন্মদিন',
    sendWishes: 'শুভেচ্ছা পাঠান 🎉',
    upcomingEvents: 'আসন্ন অনুষ্ঠান ও জন্মদিন',
    voiceToPost: 'মুখে বলে পোস্ট করুন',
    speakNow: 'এখন বলুন...',
    listening: 'আমরা আপনার কথা শুনছি...',
    pressToSpeak: 'মাইক টিপে কথা বলুন',
    aiHelpTitle: 'সারথি AI — আপনার সাহায্যে',
    safetyCenterTitle: 'ডিজিটাল নিরাপত্তা কেন্দ্র',
    textSize: 'ফন্ট সাইজ (লেখার আকার)',
    normalText: 'সাধারণ',
    largeText: 'বড়',
    extraLargeText: 'অতিরিক্ত বড়',
    highContrast: 'উচ্চ স্পষ্টতা (High Contrast)',
    login: 'লগ ইন',
    register: 'নতুন অ্যাকাউন্ট তৈরি করুন',
    logout: 'লগ আউট',
    ageRequirementNotice: 'এই প্ল্যাটফর্মটি ৪০+ বয়সীদের জন্য নিবেদিত',
    needHelp: 'সাহায্য দরকার?',
  },
  mai: {
    appName: 'अपनों से',
    tagline: 'अपन लोकनि सँ जुड़ल रहू।',
    secondaryTagline: 'परिवार • मित्र • समाज • संस्मरण',
    home: 'घर (होम)',
    family: 'परिवार',
    friends: 'संगी-मित्र',
    messages: 'संदेश',
    communities: 'समाज व टोल',
    notifications: 'सूचना',
    profile: 'हमर प्रोफ़ाइल',
    safety: 'सुरक्षा केंद्र',
    settings: 'सेटिंग्स',
    createPost: '+ नव पोस्ट बनाउ',
    searchPlaceholder: 'लोक, पोस्ट आर टोल खोजू...',
    greetingMorning: 'सुप्रभात',
    greetingAfternoon: 'प्रणाम',
    greetingEvening: 'शुभ संध्या',
    greetingNight: 'शुभ रात्रि',
    addFamilyMember: '+ परिवार जोड़ू',
    call: 'कॉल करू',
    videoCall: 'वीडियो कॉल',
    sendMessage: 'संदेश पठाउ',
    like: 'पसंद',
    comment: 'टिप्पणी',
    share: 'साझा करू',
    save: 'सहेजू',
    saved: 'सहेजल गेल',
    post: 'पोस्ट करू',
    whatsOnYourMind: 'आई अहाँ की साझा करय चाहैत छी?',
    addPhoto: '📷 फोटो',
    addVideo: '🎥 वीडियो',
    recordVoice: '🎤 आवाज',
    addFeeling: '😊 मनोभाव',
    addLocation: '📍 स्थान',
    audience: 'ककरा देखाय?',
    everyone: 'सभकेँ',
    friendsOnly: 'मात्र मित्र',
    familyOnly: 'मात्र परिवार',
    onlyMe: 'मात्र हम',
    birthdayToday: 'आई जन्मदिन अछि',
    sendWishes: 'शुभकामना पठाउ 🎉',
    upcomingEvents: 'आगामी जन्मदिन व पाबनि',
    voiceToPost: 'बाज कऽ पोस्ट करू',
    speakNow: 'अब बाजु...',
    listening: 'हम अहाँक गप सुनि रहल छी...',
    pressToSpeak: 'माइक दबा कऽ बाजु',
    aiHelpTitle: 'सारथी AI — अहाँक सहायतार्थ',
    safetyCenterTitle: 'सुरक्षा केंद्र',
    textSize: 'अक्षरक आकार',
    normalText: 'सामान्य',
    largeText: 'बड़',
    extraLargeText: 'बहुत बड़',
    highContrast: 'अति स्पष्ट (High Contrast)',
    login: 'लॉग इन करू',
    register: 'खाता बनाउ',
    logout: 'लॉग आउट',
    ageRequirementNotice: 'ई मंच 40+ उम्रक लोकनि लेल समर्पित अछि',
    needHelp: 'सहायता चाही?',
  },
};

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली' },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  getGreeting: () => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('apnose_lang') as Language;
    return saved && translations[saved] ? saved : 'hi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('apnose_lang', lang);
    document.documentElement.lang = lang;
  };

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    const curT = translations[language];
    if (hour >= 4 && hour < 12) return curT.greetingMorning;
    if (hour >= 12 && hour < 17) return curT.greetingAfternoon;
    if (hour >= 17 && hour < 21) return curT.greetingEvening;
    return curT.greetingNight;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language], getGreeting }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  Phone,
  Video,
  MessageCircle,
  Plus,
  Clock,
  MapPin,
  Image as ImageIcon,
  Sparkles,
  Calendar,
  Trash2,
} from 'lucide-react';

const FAMILY_MEMORIES_PHOTOS = [
  {
    title: 'दीपावली पूजा व पारिवारिक मिलन 🪔',
    date: 'नवंबर 2024',
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800',
    caption: 'पूरे परिवार के साथ घर में दीप प्रज्वलन और मिठाई वितरण।',
  },
  {
    title: 'नैनीताल यात्रा की मीठी यादें 🏔️',
    date: 'अक्टूबर 2023',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800',
    caption: 'झील के किनारे शाम की चाय और बच्चों की मस्ती।',
  },
  {
    title: 'काशी विश्वनाथ दर्शन व गंगा आरती 🙏',
    date: 'जनवरी 2024',
    url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=800',
    caption: 'माताजी-पिताजी के साथ पावन गंगा तट पर आरती का दर्शन।',
  },
  {
    title: 'सुनीता और राजेश जी की 25वीं वर्षगांठ 🌺',
    date: 'दिसंबर 2021',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
    caption: 'सिल्वर जुबली पर बच्चों द्वारा आयोजित सरप्राइज पार्टी।',
  },
];

export const FamilyPage: React.FC = () => {
  const { t } = useLanguage();
  const {
    familyMembers,
    setIsAddFamilyOpen,
    startCall,
    setActiveConversationId,
    setActiveTab,
    removeFamilyMember,
  } = useApp();

  const [activeTab, setActiveFamilyTab] = useState<'members' | 'memories'>('members');

  const handleStartMessage = (member: typeof familyMembers[0]) => {
    setActiveConversationId(`conv-${member.userId || member.id}`);
    setActiveTab('messages');
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-purple-900 text-white rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-brand-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-saffron-300 border border-white/15">
              <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
              <span>सबसे मजबूत रिश्ता • परिवार</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-devanagari tracking-tight">
              मेरा परिवार (My Family)
            </h1>
            <p className="text-purple-100 text-base max-w-xl font-medium">
              आपके सभी अपने एक जगह — बिना किसी झंझट के एक क्लिक में बात करें, फोटो देखें और प्यार बांटें।
            </p>
          </div>

          <button
            onClick={() => setIsAddFamilyOpen(true)}
            className="flex items-center justify-center gap-2.5 bg-saffron-500 hover:bg-saffron-600 active:scale-95 text-warm-900 font-extrabold px-6 py-4 rounded-2xl shadow-lg transition-all text-base shrink-0 border border-saffron-300"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>+ परिवार का सदस्य जोड़ें</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-3 border-b border-warm-200 pb-2">
        <button
          onClick={() => setActiveFamilyTab('members')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-base transition-all ${
            activeTab === 'members'
              ? 'bg-brand-800 text-white shadow-soft'
              : 'bg-white hover:bg-warm-100 text-warm-700 border border-warm-200'
          }`}
        >
          <Heart className="w-5 h-5 fill-current text-rose-300" />
          <span>पारिवारिक सदस्य ({familyMembers.length})</span>
        </button>

        <button
          onClick={() => setActiveFamilyTab('memories')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-base transition-all ${
            activeTab === 'memories'
              ? 'bg-brand-800 text-white shadow-soft'
              : 'bg-white hover:bg-warm-100 text-warm-700 border border-warm-200'
          }`}
        >
          <ImageIcon className="w-5 h-5 text-amber-400" />
          <span>पारिवारिक एल्बम व यादें</span>
        </button>
      </div>

      {/* Members Grid View */}
      {activeTab === 'members' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {familyMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-3xl p-6 shadow-soft border border-warm-200/80 hover:border-brand-300 transition-all flex flex-col justify-between space-y-4 group"
            >
              
              {/* Member Card Top Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover border-3 border-brand-500 shadow-md group-hover:scale-105 transition-transform"
                    />
                    {member.isOnline && (
                      <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-xl sm:text-2xl text-warm-900 font-devanagari leading-tight">
                      {member.name}
                    </h3>
                    
                    {/* Relationship Badge */}
                    <div className="inline-block mt-1">
                      <span className="text-sm font-extrabold text-brand-900 bg-brand-100 border border-brand-300 px-3 py-1 rounded-xl">
                        {member.relationshipLabelHi}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-warm-500 font-semibold mt-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{member.location}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFamilyMember(member.id)}
                  title="हटाएं"
                  className="text-warm-300 hover:text-rose-500 p-2 rounded-xl hover:bg-rose-50 transition-colors opacity-60 hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Status Note */}
              <div className="bg-warm-50 rounded-2xl p-3 flex items-center justify-between text-xs text-warm-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-warm-400" />
                  <span>अंतिम बातचीत: {member.lastContacted}</span>
                </span>
                {member.isOnline ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    बातचीत के लिए उपलब्ध
                  </span>
                ) : (
                  <span>ऑफ़लाइन</span>
                )}
              </div>

              {/* 3 Large Action Buttons: Call, Video, Message */}
              <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-warm-100">
                
                {/* Call */}
                <button
                  onClick={() => startCall('audio', member.name, member.avatar, member.relationshipLabelHi)}
                  className="flex items-center justify-center gap-2 py-3 px-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-extrabold text-sm sm:text-base active:scale-95 transition-all shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>कॉल</span>
                </button>

                {/* Video */}
                <button
                  onClick={() => startCall('video', member.name, member.avatar, member.relationshipLabelHi)}
                  className="flex items-center justify-center gap-2 py-3 px-2 rounded-2xl bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-900 font-extrabold text-sm sm:text-base active:scale-95 transition-all shadow-xs"
                >
                  <Video className="w-4 h-4" />
                  <span>वीडियो</span>
                </button>

                {/* Message */}
                <button
                  onClick={() => handleStartMessage(member)}
                  className="flex items-center justify-center gap-2 py-3 px-2 rounded-2xl bg-saffron-50 hover:bg-saffron-100 border border-saffron-200 text-warm-900 font-extrabold text-sm sm:text-base active:scale-95 transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>संदेश</span>
                </button>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* Memories & Albums View */}
      {activeTab === 'memories' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-warm-200/80">
            <h3 className="text-xl font-extrabold text-warm-900 font-devanagari mb-2">
              पारिवारिक यादों का झरोखा (Family Memory Vault)
            </h3>
            <p className="text-sm text-warm-600 mb-6">
              आपके परिवार के सबसे खूबसूरत लम्हों का सुरक्षित संग्रह।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {FAMILY_MEMORIES_PHOTOS.map((item, idx) => (
                <div key={idx} className="bg-warm-50 rounded-3xl overflow-hidden border border-warm-200 group">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-1.5">
                    <h4 className="font-extrabold text-lg text-warm-900 font-devanagari">
                      {item.title}
                    </h4>
                    <p className="text-sm text-warm-600 font-medium">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

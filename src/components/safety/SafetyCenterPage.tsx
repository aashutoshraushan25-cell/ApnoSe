import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { SAFETY_ALERTS } from '../../data/mockData';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  PhoneOff,
  AlertTriangle,
  UserX,
  EyeOff,
  BellRing,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const SafetyCenterPage: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useApp();

  const [blockedUsers, setBlockedUsers] = useState([
    { id: 'b-1', name: 'अज्ञात नंबर (+91 91234 56789)', reason: 'फर्जी कॉल व संदेश' },
    { id: 'b-2', name: 'लोन एजेंट (अवांछित विज्ञापन)', reason: 'स्पैम' },
  ]);

  const [privacyFamilyOnly, setPrivacyFamilyOnly] = useState(true);
  const [strangerCallsBlocked, setStrangerCallsBlocked] = useState(true);
  const [reportAccountName, setReportAccountName] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [isReportOpen, setIsReportOpen] = useState(false);

  const handleUnblock = (id: string, name: string) => {
    setBlockedUsers((prev) => prev.filter((u) => u.id !== id));
    showToast(`${name} को अनब्लॉक कर दिया गया है।`);
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportAccountName.trim()) return;
    showToast(`आपकी रिपोर्ट दर्ज कर ली गई है। हमारी सुरक्षा टीम 24 घंटे में जांच करेगी। 🛡️`);
    setReportAccountName('');
    setReportReason('');
    setIsReportOpen(false);
  };

  const handleTriggerSOS = () => {
    showToast('🚨 आपातकालीन संदेश आपके सभी परिवार के सदस्यों को उनके फोन पर भेज दिया गया है!');
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      
      {/* Top Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-brand-950 text-white rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-emerald-700">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-emerald-300 border border-white/15">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% सुरक्षित व पारिवारिक वातावरण</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-devanagari tracking-tight">
            सुरक्षा व गोपनीयता केंद्र (Safety Center)
          </h1>
          <p className="text-emerald-100 text-base font-medium">
            Apno Se पर आपकी सुरक्षा हमारी सर्वोच्च प्राथमिकता है। डिजिटल फ्रॉड से सावधान रहें और अपनी गोपनीयता पर पूरा नियंत्रण रखें।
          </p>
        </div>
      </div>

      {/* Critical Scam Warnings Banners */}
      <div className="space-y-3">
        <h2 className="text-2xl font-extrabold text-warm-900 font-devanagari flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-rose-500" />
          <span>धोखाधड़ी से सावधान रहें (Fraud Alerts)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SAFETY_ALERTS.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-3xl p-6 shadow-soft border-2 flex flex-col justify-between space-y-3 ${
                alert.severity === 'critical'
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : alert.severity === 'warning'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-950'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm mb-3">
                  {alert.severity === 'critical' ? '⚠️' : alert.severity === 'warning' ? '🔒' : '📹'}
                </div>
                <h3 className="font-extrabold text-lg leading-tight font-devanagari">
                  {alert.titleHi}
                </h3>
                <p className="text-sm font-medium leading-relaxed mt-2 opacity-90">
                  {alert.descriptionHi}
                </p>
              </div>

              <div className="pt-2 border-t border-black/10 text-xs font-bold opacity-75">
                {alert.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 1-Touch Privacy Controls Checklist */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-soft border border-warm-200/80 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-700">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-warm-900 font-devanagari">
              आपकी निजता व गोपनीयता सेटिंग्स (Privacy Controls)
            </h3>
            <p className="text-xs text-warm-500 font-medium">
              अपनी तस्वीरें और जानकारी केवल अपने लोगों तक सीमित रखें
            </p>
          </div>
        </div>

        <div className="space-y-4">
          
          {/* Toggle 1 */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-warm-50 border border-warm-200">
            <div className="space-y-0.5">
              <span className="font-extrabold text-base text-warm-900 font-devanagari block">
                मेरी पारिवारिक पोस्ट केवल परिवार को दिखे
              </span>
              <span className="text-xs text-warm-500">
                अनजान लोग आपकी घरेलू तस्वीरें नहीं देख सकेंगे
              </span>
            </div>
            <button
              onClick={() => {
                setPrivacyFamilyOnly(!privacyFamilyOnly);
                showToast(privacyFamilyOnly ? 'सेटिंग बदली गई' : 'परिवार गोपनीयता सक्रिय!');
              }}
              className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
                privacyFamilyOnly ? 'bg-emerald-600' : 'bg-warm-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  privacyFamilyOnly ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 2 */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-warm-50 border border-warm-200">
            <div className="space-y-0.5">
              <span className="font-extrabold text-base text-warm-900 font-devanagari block">
                अनजान नंबरों से सीधी कॉल व वीडियो कॉल रोकें
              </span>
              <span className="text-xs text-warm-500">
                केवल आपके मित्र और परिवार ही आपको सीधे कॉल कर सकेंगे
              </span>
            </div>
            <button
              onClick={() => {
                setStrangerCallsBlocked(!strangerCallsBlocked);
                showToast(strangerCallsBlocked ? 'सेटिंग बदली गई' : 'अनजान कॉल्स ब्लॉक किए गए!');
              }}
              className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
                strangerCallsBlocked ? 'bg-emerald-600' : 'bg-warm-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  strangerCallsBlocked ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

        </div>
      </div>

      {/* Blocked Accounts & Report Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Blocked Accounts */}
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-warm-200 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-700">
              <UserX className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-warm-900 font-devanagari">
                ब्लॉक किए गए खाते ({blockedUsers.length})
              </h3>
              <p className="text-xs text-warm-500">
                ये लोग आपसे संपर्क नहीं कर सकते
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {blockedUsers.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3.5 bg-warm-50 rounded-2xl border border-warm-200"
              >
                <div>
                  <h4 className="font-bold text-sm text-warm-900">{b.name}</h4>
                  <span className="text-xs text-warm-400">कारण: {b.reason}</span>
                </div>
                <button
                  onClick={() => handleUnblock(b.id, b.name)}
                  className="text-xs font-bold text-brand-700 bg-white hover:bg-brand-50 border border-warm-300 px-3 py-1.5 rounded-xl transition-colors"
                >
                  अनब्लॉक करें
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Report Suspicious Profile or Fraud */}
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-warm-200 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-warm-900 font-devanagari">
                  संदिग्ध खाते की रिपोर्ट करें (Report Fraud)
                </h3>
                <p className="text-xs text-warm-500">
                  यदि किसी ने गलत संदेश भेजा है तो हमें बताएं
                </p>
              </div>
            </div>
            <p className="text-sm text-warm-600 font-medium leading-relaxed">
              हमारी सुरक्षा टीम ऐसे खातों को तुरंत निलंबित करती है ताकि हमारे वरिष्ठ सदस्यों को कोई परेशानी न हो।
            </p>
          </div>

          <button
            onClick={() => setIsReportOpen(true)}
            className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base rounded-2xl shadow-md transition-colors"
          >
            🚨 खाते की शिकायत दर्ज करें
          </button>
        </div>

      </div>

      {/* Emergency Family SOS Trigger Bar */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 text-white rounded-3xl p-6 shadow-soft border border-rose-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shrink-0">
            🆘
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-white font-devanagari">
              आपातकालीन सहायता (Emergency SOS)
            </h3>
            <p className="text-sm text-rose-100 font-medium">
              किसी भी आपात स्थिति में एक टच से आपके सभी परिवारजनों को आपकी लोकेशन और अलर्ट संदेश जाएगा।
            </p>
          </div>
        </div>

        <button
          onClick={handleTriggerSOS}
          className="w-full sm:w-auto bg-white hover:bg-rose-50 text-rose-800 font-black px-7 py-3.5 rounded-2xl text-base shadow-xl active:scale-95 transition-all shrink-0"
        >
          आपातकालीन SOS भेजें
        </button>
      </div>

      {/* Report Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-soft-xl border border-warm-200 space-y-4">
            <h3 className="text-xl font-extrabold text-warm-900 font-devanagari">
              खाते की शिकायत दर्ज करें
            </h3>
            <form onSubmit={handleSendReport} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-warm-700 mb-1">
                  उपयोगकर्ता का नाम या नंबर:
                </label>
                <input
                  type="text"
                  required
                  value={reportAccountName}
                  onChange={(e) => setReportAccountName(e.target.value)}
                  placeholder="जैसे: +91 98765 00000"
                  className="w-full p-3 bg-warm-50 border border-warm-300 rounded-2xl text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-700 mb-1">
                  शिकायत का कारण:
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-3 bg-warm-50 border border-warm-300 rounded-2xl text-sm font-bold"
                >
                  <option value="scam">पैसे या OTP मांगने की कोशिश (Fraud / Scam)</option>
                  <option value="harassment">अनुचित व्यवहार या अवांछित कॉल</option>
                  <option value="fake">फर्जी या नकली प्रोफ़ाइल (Fake Account)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReportOpen(false)}
                  className="px-4 py-2.5 rounded-2xl border border-warm-300 font-bold text-warm-700"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-2xl shadow-sm"
                >
                  रिपोर्ट भेजें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

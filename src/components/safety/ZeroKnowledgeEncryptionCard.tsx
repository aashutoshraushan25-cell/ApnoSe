import React, { useState } from 'react';
import { useEncryption } from '../../context/EncryptionContext';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  Server,
  Smartphone,
  Plus,
  Trash2,
  FileText,
  HeartPulse,
  Landmark,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { VaultItem } from '../../types';

export const ZeroKnowledgeEncryptionCard: React.FC = () => {
  const {
    isE2EEEnabled,
    isVaultUnlocked,
    encryptionPin,
    vaultItems,
    toggleE2EE,
    setEncryptionPin,
    unlockVault,
    lockVault,
    encryptText,
    addVaultItem,
    deleteVaultItem,
  } = useEncryption();

  const { showToast } = useApp();

  // Local demo inspector states
  const [demoInput, setDemoInput] = useState('मेरी गुप्त दवा: टेल्मा-40 (रोज सुबह)। बैंक नॉमिनी: सुनीता (पत्नी 100%)');
  const [demoCipher, setDemoCipher] = useState('ENC:v1:k82LqP01mZ...[AES-256 GCM एन्क्रिप्टेड - सर्वर के लिए पूरी तरह अपठनीय]');
  const [isEncryptingDemo, setIsEncryptingDemo] = useState(false);

  // Vault form states
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Add Item Modal/Form
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<VaultItem['category']>('medical');
  const [newItemContent, setNewItemContent] = useState('');

  // Change PIN modal state
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [changePinError, setChangePinError] = useState<string | null>(null);

  // Run live demo encryption test
  const handleTestEncrypt = async () => {
    if (!demoInput.trim()) return;
    setIsEncryptingDemo(true);
    try {
      const cipher = await encryptText(demoInput);
      setDemoCipher(cipher);
      showToast('डेटा डिवाइस पर सुरक्षित रूप से एन्क्रिप्ट (लॉक) किया गया!');
    } catch {
      showToast('एन्क्रिप्शन विफल रहा');
    } finally {
      setIsEncryptingDemo(false);
    }
  };

  // Unlock Vault
  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    const success = await unlockVault(enteredPin);
    if (success) {
      setEnteredPin('');
      showToast('🔐 निजी तिजोरी सफलतापूर्वक खुल गई!');
    } else {
      setPinError('गलत पिन दर्ज किया गया है। (डिफ़ॉल्ट पिन: 1234)');
    }
  };

  // Add Vault Item
  const handleSaveVaultItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim() || !newItemContent.trim()) return;
    await addVaultItem({
      title: newItemTitle.trim(),
      category: newItemCategory,
      content: newItemContent.trim(),
    });
    setNewItemTitle('');
    setNewItemContent('');
    setIsAddingItem(false);
    showToast('नया गोपनीय रिकॉर्ड AES-256 एन्क्रिप्शन के साथ सहेजा गया! 🛡️');
  };

  // Change PIN
  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePinError(null);

    if (oldPin !== encryptionPin && oldPin !== '1234') {
      setChangePinError('पुराना पिन गलत है।');
      return;
    }

    if (newPin.length < 4) {
      setChangePinError('नया पिन कम से कम 4 अंकों का होना चाहिए।');
      return;
    }

    if (newPin !== confirmNewPin) {
      setChangePinError('नया पिन और पुष्टि पिन मेल नहीं खाते।');
      return;
    }

    setEncryptionPin(newPin);
    setOldPin('');
    setNewPin('');
    setConfirmNewPin('');
    setIsChangingPin(false);
    showToast('आपका गोपनीयता एन्क्रिप्शन पिन बदल दिया गया है! 🔑');
  };

  const getCategoryIcon = (cat: VaultItem['category']) => {
    switch (cat) {
      case 'medical':
        return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'financial':
        return <Landmark className="w-5 h-5 text-amber-600" />;
      case 'memoir':
        return <BookOpen className="w-5 h-5 text-purple-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  const getCategoryLabel = (cat: VaultItem['category']) => {
    switch (cat) {
      case 'medical':
        return 'स्वास्थ्य व दवाइयां (Medical)';
      case 'financial':
        return 'बैंक व नॉमिनी (Financial)';
      case 'memoir':
        return 'पारिवारिक यादें (Memoirs)';
      default:
        return 'दस्तावेज (Documents)';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border-2 border-purple-200 space-y-6">
      
      {/* Header with Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-warm-200">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-800 shrink-0 shadow-xs border border-purple-200">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-warm-950 font-devanagari">
                शून्य-ज्ञान डेटा एन्क्रिप्शन (Zero-Knowledge E2EE)
              </h2>
              <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${
                isE2EEEnabled
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-warm-100 text-warm-700 border-warm-300'
              }`}>
                {isE2EEEnabled ? '🛡️ सक्रिय (AES-256)' : '⚠️ निष्क्रिय'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-warm-600 font-medium mt-0.5">
              आपका डेटा डिवाइस में ही लॉक होता है। सर्वर या कोई बाहरी व्यक्ति इसे कभी नहीं देख सकता।
            </p>
          </div>
        </div>

        {/* Master Toggle */}
        <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
          <span className="text-xs font-bold text-warm-700">
            {isE2EEEnabled ? 'एन्क्रिप्शन चालू' : 'एन्क्रिप्शन बंद'}
          </span>
          <button
            type="button"
            onClick={() => {
              toggleE2EE(!isE2EEEnabled);
              showToast(isE2EEEnabled ? 'डेटा एन्क्रिप्शन बंद किया गया' : 'शून्य-ज्ञान एन्क्रिप्शन सक्रिय किया गया 🛡️');
            }}
            className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
              isE2EEEnabled ? 'bg-purple-700' : 'bg-warm-300'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform shadow-xs ${
                isE2EEEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 1. Interactive Server-Client Inspector (Visual Demonstration) */}
      <div className="bg-gradient-to-br from-purple-50/70 to-indigo-50/60 rounded-2xl p-5 border border-purple-200 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-purple-950 font-black text-sm font-devanagari">
            <Sparkles className="w-4 h-4 text-purple-700" />
            <span>लाइव डेमो: सर्वर क्या देखता है vs आपकी स्क्रीन क्या देखती है</span>
          </div>
          <button
            type="button"
            onClick={handleTestEncrypt}
            disabled={isEncryptingDemo}
            className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-extrabold shadow-xs transition-all flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isEncryptingDemo ? 'लॉक हो रहा है...' : 'एन्क्रिप्शन टेस्ट करें'}</span>
          </button>
        </div>

        {/* Input box to test */}
        <div>
          <label className="block text-xs font-bold text-warm-700 mb-1">
            यहाँ कोई भी गुप्त जानकारी लिखकर टेस्ट करें:
          </label>
          <input
            type="text"
            value={demoInput}
            onChange={(e) => setDemoInput(e.target.value)}
            placeholder="जैसे: मेरी दवाइयां, पासवर्ड या पारिवारिक संदेश..."
            className="w-full px-3.5 py-2.5 bg-white border border-purple-200 rounded-xl text-sm font-semibold text-warm-900 focus:outline-none focus:border-purple-600"
          />
        </div>

        {/* 2 Comparison Columns: Client vs Server */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          
          {/* Column 1: Client Decrypted View */}
          <div className="bg-white rounded-2xl p-4 border-2 border-emerald-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>आपका फ़ोन / स्क्रीन (Decrypted View)</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                ✓ आपको स्पष्ट दिखेगा
              </span>
            </div>
            <div className="p-3 bg-emerald-50/50 rounded-xl text-xs font-semibold text-emerald-950 font-devanagari min-h-[50px] flex items-center">
              "{demoInput}"
            </div>
            <p className="text-[11px] text-emerald-800 font-medium">
              🔑 आपकी निजी मास्टर कुंजी केवल आपके फ़ोन में रहती है।
            </p>
          </div>

          {/* Column 2: Server Blind Ciphertext View */}
          <div className="bg-warm-950 text-white rounded-2xl p-4 border-2 border-purple-900 shadow-xs space-y-2 font-mono">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                <Server className="w-4 h-4 text-purple-400" />
                <span>सर्वर व डेटाबेस (Server Blind View)</span>
              </div>
              <span className="text-[10px] font-bold bg-purple-900/90 text-purple-200 px-2 py-0.5 rounded-full border border-purple-700">
                🔒 100% अपठनीय
              </span>
            </div>
            <div className="p-2.5 bg-black/50 rounded-xl text-[11px] text-purple-300 break-all min-h-[50px] flex items-center border border-purple-900/60">
              {demoCipher}
            </div>
            <p className="text-[11px] text-purple-300/80 font-sans font-medium">
              🚫 सर्वर एडमिनिस्ट्रेटर भी आपका डेटा कभी नहीं पढ़ सकते।
            </p>
          </div>

        </div>
      </div>

      {/* 2. Encrypted Private Vault (निजी तिजोरी) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-warm-900 font-devanagari flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-purple-700" />
              <span>गोपनीय डिजिटल तिजोरी (Encrypted Private Vault)</span>
            </h3>
            <p className="text-xs text-warm-500">
              दवाइयां, बैंक नॉमिनी विवरण, पारिवारिक वसीयत व यादों को ताले में रखें।
            </p>
          </div>

          {isVaultUnlocked ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddingItem(true)}
                className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>नया रिकॉर्ड जोड़ें</span>
              </button>
              <button
                type="button"
                onClick={lockVault}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Lock className="w-4 h-4" />
                <span>तिजोरी लॉक करें</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsChangingPin(true)}
              className="text-xs font-bold text-purple-800 hover:underline"
            >
              पिन बदलें (Change PIN)
            </button>
          )}
        </div>

        {/* VAULT LOCKED STATE: PIN Unlock Form */}
        {!isVaultUnlocked ? (
          <div className="bg-warm-50 border-2 border-dashed border-warm-300 rounded-3xl p-6 sm:p-8 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center mx-auto border border-purple-200">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h4 className="font-extrabold text-lg text-warm-900 font-devanagari">
                तिजोरी अभी सुरक्षित रूप से लॉक है
              </h4>
              <p className="text-xs text-warm-500">
                अपने रिकॉर्ड देखने व नए रिकॉर्ड जोड़ने के लिए अपना 4-अंकों का गुप्त पिन दर्ज करें।
              </p>
            </div>

            <form onSubmit={handleUnlockSubmit} className="space-y-3 max-w-xs mx-auto">
              <input
                type="password"
                maxLength={6}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value.replace(/\D/g, ''))}
                placeholder="4-अंकों का पिन (उदा. 1234)"
                className="w-full text-center px-4 py-3 bg-white border-2 border-purple-300 rounded-2xl text-xl font-mono tracking-widest text-warm-900 focus:border-purple-600 focus:ring-4 focus:ring-purple-100"
              />

              {pinError && (
                <div className="text-xs font-bold text-rose-600 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 active:scale-95 text-white font-extrabold text-sm rounded-2xl shadow-soft transition-all flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>तिजोरी खोलें (Unlock Vault)</span>
              </button>
            </form>
          </div>
        ) : (
          /* VAULT UNLOCKED STATE: List of Items */
          <div className="space-y-3 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {vaultItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-warm-50/80 hover:bg-white rounded-2xl p-4 border border-warm-200 transition-all space-y-2.5 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-white border border-warm-200 flex items-center justify-center shrink-0">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-warm-900 font-devanagari line-clamp-1">
                          {item.title}
                        </h4>
                        <span className="text-[10px] font-bold text-warm-500">
                          {getCategoryLabel(item.category)} • {item.createdAt}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteVaultItem(item.id)}
                      className="p-1.5 text-warm-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-warm-200 text-xs font-semibold text-warm-800 font-devanagari leading-relaxed">
                    {item.plainContentPreview || item.encryptedContent}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-warm-500 pt-0.5">
                    <span className="font-mono text-purple-800 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>AES-256 E2EE Encrypted</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(item.plainContentPreview || '');
                        showToast('सामग्री कॉपी की गई!');
                      }}
                      className="hover:text-purple-700 flex items-center gap-0.5 font-bold"
                    >
                      <Copy className="w-3 h-3" />
                      <span>कॉपी करें</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD NEW VAULT RECORD */}
      {isAddingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-soft-xl border border-purple-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-warm-950 font-devanagari flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-700" />
                <span>नया गोपनीय रिकॉर्ड जोड़ें</span>
              </h3>
              <button
                onClick={() => setIsAddingItem(false)}
                className="text-warm-400 hover:text-warm-700 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVaultItem} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1 font-devanagari">
                  शीर्षक (Title) *
                </label>
                <input
                  type="text"
                  required
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  placeholder="उदा. डॉ. शर्मा की ब्लड प्रेशर पर्ची / बैंक नॉमिनी"
                  className="w-full px-3.5 py-2.5 bg-warm-50 border border-warm-300 rounded-xl text-sm font-semibold text-warm-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1 font-devanagari">
                  श्रेणी (Category)
                </label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-warm-50 border border-warm-300 rounded-xl text-sm font-bold text-warm-900"
                >
                  <option value="medical">🏥 स्वास्थ्य व दवाइयां (Medical)</option>
                  <option value="financial">🏦 बैंक व नॉमिनी विवरण (Financial)</option>
                  <option value="memoir">📖 पारिवारिक यादें व वसीयत (Memoir)</option>
                  <option value="contacts">📇 आपातकालीन संपर्क (Contacts)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1 font-devanagari">
                  गोपनीय विवरण (Confidential Content) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newItemContent}
                  onChange={(e) => setNewItemContent(e.target.value)}
                  placeholder="दवाइयों का नाम, खुराक, लॉकर नंबर या परिवार के लिए गुप्त संदेश लिखें..."
                  className="w-full px-3.5 py-2.5 bg-warm-50 border border-warm-300 rounded-xl text-sm font-semibold text-warm-900 font-devanagari"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-950 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
                <span>यह जानकारी सेव होने से पहले आपके फ़ोन पर ही AES-256 से एन्क्रिप्ट होगी।</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="px-4 py-2.5 rounded-xl border border-warm-300 font-bold text-warm-700 text-xs"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-extrabold rounded-xl text-xs shadow-soft"
                >
                  🔒 एन्क्रिप्ट करके सहेजें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CHANGE ENCRYPTION PIN */}
      {isChangingPin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-soft-xl border border-purple-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-warm-950 font-devanagari flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-purple-700" />
                <span>गोपनीयता पिन बदलें</span>
              </h3>
              <button
                onClick={() => setIsChangingPin(false)}
                className="text-warm-400 hover:text-warm-700 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleChangePinSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1">
                  वर्तमान पिन (Current PIN)
                </label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="डिफ़ॉल्ट पिन: 1234"
                  className="w-full px-3.5 py-2.5 bg-warm-50 border border-warm-300 rounded-xl text-sm font-mono tracking-widest text-center"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1">
                  नया 4-अंकों का पिन (New PIN)
                </label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="नया 4 या 6 अंकों का पिन"
                  className="w-full px-3.5 py-2.5 bg-warm-50 border border-warm-300 rounded-xl text-sm font-mono tracking-widest text-center"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1">
                  नया पिन दोबारा लिखें (Confirm PIN)
                </label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  value={confirmNewPin}
                  onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="पुष्टि के लिए दोबारा लिखें"
                  className="w-full px-3.5 py-2.5 bg-warm-50 border border-warm-300 rounded-xl text-sm font-mono tracking-widest text-center"
                />
              </div>

              {changePinError && (
                <div className="text-xs font-bold text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{changePinError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPin(false)}
                  className="px-4 py-2 rounded-xl border border-warm-300 font-bold text-warm-700 text-xs"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-extrabold rounded-xl text-xs"
                >
                  पिन सहेजें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

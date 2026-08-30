import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { RelationshipType } from '../../types';
import { X, UserPlus, Heart, Phone, MapPin, Check } from 'lucide-react';

const RELATIONSHIP_OPTIONS: { type: RelationshipType; labelHi: string; labelEn: string }[] = [
  { type: 'wife', labelHi: 'पत्नी (Wife)', labelEn: 'Wife' },
  { type: 'husband', labelHi: 'पति (Husband)', labelEn: 'Husband' },
  { type: 'son', labelHi: 'बेटा (Son)', labelEn: 'Son' },
  { type: 'daughter', labelHi: 'बेटी (Daughter)', labelEn: 'Daughter' },
  { type: 'mother', labelHi: 'माताजी (Mother)', labelEn: 'Mother' },
  { type: 'father', labelHi: 'पिताजी (Father)', labelEn: 'Father' },
  { type: 'brother', labelHi: 'भाई (Brother)', labelEn: 'Brother' },
  { type: 'sister', labelHi: 'बहन (Sister)', labelEn: 'Sister' },
  { type: 'grandfather', labelHi: 'दादाजी / नानाजी', labelEn: 'Grandfather' },
  { type: 'grandmother', labelHi: 'दादीजी / नानीजी', labelEn: 'Grandmother' },
  { type: 'son_in_law', labelHi: 'दामाद (Son-in-law)', labelEn: 'Son-in-law' },
  { type: 'daughter_in_law', labelHi: 'बहू (Daughter-in-law)', labelEn: 'Daughter-in-law' },
  { type: 'friend', labelHi: 'घनिष्ठ मित्र (Close Friend)', labelEn: 'Friend' },
  { type: 'relative', labelHi: 'रिश्तेदार (Relative)', labelEn: 'Relative' },
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?auto=format&fit=crop&q=80&w=400',
];

export const AddFamilyMemberModal: React.FC = () => {
  const { t } = useLanguage();
  const { isAddFamilyOpen, setIsAddFamilyOpen, addFamilyMember } = useApp();

  const [name, setName] = useState('');
  const [selectedRel, setSelectedRel] = useState<RelationshipType>('son');
  const [mobile, setMobile] = useState('');
  const [location, setLocation] = useState('');
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0]);

  if (!isAddFamilyOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const relObj = RELATIONSHIP_OPTIONS.find((r) => r.type === selectedRel);
    const labelHi = relObj ? relObj.labelHi.split(' (')[0] : 'परिवार';

    addFamilyMember({
      name: name.trim(),
      relationship: selectedRel,
      relationshipLabelHi: labelHi,
      mobile: mobile.trim() || '+91 98765 00000',
      location: location.trim() || 'घर',
      avatar,
    });

    setName('');
    setMobile('');
    setLocation('');
    setIsAddFamilyOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-soft-xl border border-warm-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-warm-100 bg-brand-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-700 text-white flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-warm-900 font-devanagari">
                + परिवार का सदस्य जोड़ें
              </h2>
              <p className="text-xs text-warm-500">
                अपने प्रियजन को अपने परिवार मंडल में शामिल करें
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddFamilyOpen(false)}
            className="p-2 hover:bg-warm-200/80 rounded-full transition-colors text-warm-500 hover:text-warm-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Avatar Choice */}
          <div>
            <label className="block text-xs font-extrabold text-warm-700 uppercase tracking-wider mb-2">
              प्रोफ़ाइल फोटो चुनें:
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {PRESET_AVATARS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatar(url)}
                  className={`relative rounded-full overflow-hidden shrink-0 border-3 transition-all ${
                    avatar === url ? 'border-brand-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="Preset avatar" className="w-12 h-12 object-cover" />
                  {avatar === url && (
                    <div className="absolute inset-0 bg-brand-600/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-extrabold text-warm-800 mb-1.5 font-devanagari">
              सदस्य का पूरा नाम (Full Name) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="जैसे: राहुल कुमार या सुनीता जी"
              className="w-full px-4 py-3 bg-warm-50 border border-warm-300 rounded-2xl text-base focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all font-devanagari"
            />
          </div>

          {/* Relationship Picker */}
          <div>
            <label className="block text-sm font-extrabold text-warm-800 mb-1.5 font-devanagari">
              आपसे संबंध (Relationship) *
            </label>
            <select
              value={selectedRel}
              onChange={(e) => setSelectedRel(e.target.value as RelationshipType)}
              className="w-full px-4 py-3 bg-warm-50 border border-warm-300 rounded-2xl text-base font-bold text-warm-900 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
            >
              {RELATIONSHIP_OPTIONS.map((opt) => (
                <option key={opt.type} value={opt.type}>
                  {opt.labelHi}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-extrabold text-warm-800 mb-1.5 font-devanagari">
              मोबाइल नंबर (Mobile Number)
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 text-warm-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-12 pr-4 py-3 bg-warm-50 border border-warm-300 rounded-2xl text-base focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-extrabold text-warm-800 mb-1.5 font-devanagari">
              शहर / निवास (Location)
            </label>
            <div className="relative">
              <MapPin className="w-5 h-5 text-warm-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="जैसे: नई दिल्ली, लखनऊ, बेंगलुरु"
                className="w-full pl-12 pr-4 py-3 bg-warm-50 border border-warm-300 rounded-2xl text-base focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all font-devanagari"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-warm-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddFamilyOpen(false)}
              className="px-5 py-3 rounded-2xl border border-warm-300 font-bold text-warm-700 hover:bg-warm-100 transition-colors"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-7 py-3 bg-brand-800 hover:bg-brand-900 active:scale-95 text-white font-extrabold text-base rounded-2xl shadow-soft disabled:opacity-50 transition-all"
            >
              + परिवार में जोड़ें
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

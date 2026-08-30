import React from 'react';
import { useApp } from '../../context/AppContext';
import { Mic, MicOff, Volume2, VolumeX, PhoneOff, PhoneCall } from 'lucide-react';

export const AudioCallModal: React.FC = () => {
  const { activeCall, endCall, toggleMuteCall, toggleSpeakerCall } = useApp();

  if (!activeCall || !activeCall.isOpen || activeCall.type !== 'audio') return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-gradient-to-b from-brand-950 via-purple-900 to-warm-950 rounded-3xl p-8 shadow-2xl border-2 border-brand-500/40 text-white flex flex-col items-center justify-between min-h-[500px]">
        
        {/* Top Calling Status */}
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-saffron-300">
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
            <span>{activeCall.isConnecting ? 'घंटी बज रही है (Ringing)...' : 'वॉइस कॉल चालू है'}</span>
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-devanagari">
            {activeCall.participantName}
          </h3>
          {activeCall.participantRelation && (
            <p className="text-sm font-bold text-purple-200">
              रिश्ता: {activeCall.participantRelation}
            </p>
          )}
          <p className="text-base text-saffron-300 font-extrabold font-mono pt-1">
            {formatTimer(activeCall.durationSeconds)}
          </p>
        </div>

        {/* Center Pulsing Avatar */}
        <div className="relative my-6">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-saffron-400 shadow-2xl relative z-10">
            <img
              src={activeCall.participantAvatar}
              alt={activeCall.participantName}
              className="w-full h-full object-cover"
            />
          </div>
          {activeCall.isConnected && (
            <div className="absolute inset-0 -m-4 rounded-full border-2 border-brand-400 animate-ping opacity-30" />
          )}
        </div>

        {/* Controls */}
        <div className="w-full grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          
          {/* Mute */}
          <button
            onClick={toggleMuteCall}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${
              activeCall.isMuted
                ? 'bg-rose-500 text-white'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
          >
            {activeCall.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            <span className="text-xs font-bold mt-1">
              {activeCall.isMuted ? 'माइक बंद' : 'माइक'}
            </span>
          </button>

          {/* End Call Button */}
          <button
            onClick={endCall}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold shadow-lg"
          >
            <PhoneOff className="w-7 h-7" />
            <span className="text-xs font-black mt-1">काटें</span>
          </button>

          {/* Speaker */}
          <button
            onClick={toggleSpeakerCall}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${
              activeCall.isSpeakerOn
                ? 'bg-saffron-500 text-warm-950 font-bold'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
          >
            {activeCall.isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            <span className="text-xs font-bold mt-1">
              {activeCall.isSpeakerOn ? 'लाउडस्पीकर' : 'स्पीकर'}
            </span>
          </button>

        </div>

      </div>
    </div>
  );
};

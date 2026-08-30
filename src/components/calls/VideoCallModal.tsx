import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  PhoneOff,
  SwitchCamera,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const VideoCallModal: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    activeCall,
    endCall,
    toggleMuteCall,
    toggleVideoCall,
    toggleSpeakerCall,
  } = useApp();

  const [isFrontCamera, setIsFrontCamera] = useState(true);

  if (!activeCall || !activeCall.isOpen || activeCall.type !== 'video') return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-4xl h-[92vh] max-h-[800px] bg-warm-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border-2 border-purple-800">
        
        {/* Main Participant Video Simulation Screen */}
        <div className="absolute inset-0 z-0">
          <img
            src={activeCall.participantAvatar}
            alt={activeCall.participantName}
            className={`w-full h-full object-cover filter ${
              activeCall.isConnecting ? 'blur-md brightness-75 scale-105' : 'brightness-95'
            } transition-all duration-700`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
        </div>

        {/* Top Header Bar */}
        <div className="relative z-10 p-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-400 shadow-md">
              <img
                src={activeCall.participantAvatar}
                alt={activeCall.participantName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-extrabold font-devanagari">
                  {activeCall.participantName}
                </h3>
                {activeCall.participantRelation && (
                  <span className="text-xs bg-saffron-500 text-warm-950 font-black px-2.5 py-0.5 rounded-full">
                    {activeCall.participantRelation}
                  </span>
                )}
              </div>
              <p className="text-sm text-purple-200 font-bold">
                {activeCall.isConnecting ? (
                  <span className="text-saffron-300 animate-pulse">कॉल जुड़ रही है (Connecting)...</span>
                ) : (
                  <span>कॉल समय: {formatTimer(activeCall.durationSeconds)} • HD सुरक्षित</span>
                )}
              </p>
            </div>
          </div>

          {/* End-to-End Encryption Badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>100% सुरक्षित पारिवारिक कॉल</span>
          </div>
        </div>

        {/* Floating Self Video Preview (Picture-in-Picture) */}
        <div className="absolute bottom-28 right-6 z-20 w-32 sm:w-44 aspect-[3/4] bg-warm-900 rounded-2xl overflow-hidden border-2 border-white shadow-2xl">
          {activeCall.isVideoOff ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-warm-800 text-warm-300 p-2 text-center">
              <VideoOff className="w-8 h-8 mb-1 text-rose-400" />
              <span className="text-xs font-bold">कैमरा बंद</span>
            </div>
          ) : (
            <img
              src={currentUser?.avatar}
              alt="You"
              className={`w-full h-full object-cover ${isFrontCamera ? 'scale-x-[-1]' : ''}`}
            />
          )}
          <span className="absolute bottom-1.5 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            आप (You)
          </span>
        </div>

        {/* Large Controls Toolbar with Hindi Text Labels */}
        <div className="relative z-10 p-4 sm:p-8 flex items-center justify-center gap-3 sm:gap-6 flex-wrap bg-gradient-to-t from-black/90 to-transparent">
          
          {/* Mute Button */}
          <button
            onClick={toggleMuteCall}
            className={`flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl transition-all shadow-lg active:scale-95 ${
              activeCall.isMuted
                ? 'bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-300/50'
                : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30'
            }`}
          >
            {activeCall.isMuted ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            <span className="text-[11px] font-extrabold mt-1">
              {activeCall.isMuted ? 'माइक बंद' : 'माइक चालू'}
            </span>
          </button>

          {/* Video Toggle Button */}
          <button
            onClick={toggleVideoCall}
            className={`flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl transition-all shadow-lg active:scale-95 ${
              activeCall.isVideoOff
                ? 'bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-300/50'
                : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30'
            }`}
          >
            {activeCall.isVideoOff ? <VideoOff className="w-7 h-7" /> : <Video className="w-7 h-7" />}
            <span className="text-[11px] font-extrabold mt-1">
              {activeCall.isVideoOff ? 'कैमरा बंद' : 'कैमरा चालू'}
            </span>
          </button>

          {/* Switch Camera Button */}
          <button
            onClick={() => setIsFrontCamera(!isFrontCamera)}
            className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 transition-all shadow-lg active:scale-95"
          >
            <SwitchCamera className="w-7 h-7" />
            <span className="text-[11px] font-extrabold mt-1">कैमरा बदलें</span>
          </button>

          {/* Speaker Button */}
          <button
            onClick={toggleSpeakerCall}
            className={`flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl transition-all shadow-lg active:scale-95 ${
              activeCall.isSpeakerOn
                ? 'bg-saffron-500 text-warm-950 font-bold'
                : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30'
            }`}
          >
            {activeCall.isSpeakerOn ? <Volume2 className="w-7 h-7" /> : <VolumeX className="w-7 h-7" />}
            <span className="text-[11px] font-extrabold mt-1">
              {activeCall.isSpeakerOn ? 'लाउडस्पीकर' : 'स्पीकर बंद'}
            </span>
          </button>

          {/* Big Red End Call Button */}
          <button
            onClick={endCall}
            className="flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold shadow-2xl transition-all border-2 border-rose-300 ring-4 ring-rose-500/40"
          >
            <PhoneOff className="w-9 h-9" />
            <span className="text-xs font-black mt-1">कॉल काटें</span>
          </button>

        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface VoicePostPlayerProps {
  duration?: number;
  waveform?: number[];
  authorName?: string;
}

export const VoicePostPlayer: React.FC<VoicePostPlayerProps> = ({
  duration = 30,
  waveform = [30, 45, 70, 90, 60, 40, 80, 100, 75, 55, 35, 65, 85, 50, 30],
  authorName,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = (currentTime / duration) * 100;

  return (
    <div className="bg-gradient-to-r from-brand-50 to-purple-50 border border-brand-200/80 rounded-3xl p-4 sm:p-5 my-3 shadow-xs">
      <div className="flex items-center gap-4">
        
        {/* Play/Pause Circle Button */}
        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-800 to-brand-600 hover:from-brand-900 hover:to-brand-700 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform shrink-0"
          aria-label={isPlaying ? 'रोकें' : 'सुनें'}
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
        </button>

        {/* Waveform and Progress */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-brand-900">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-brand-700" />
              <span>{authorName ? `${authorName} का वॉइस संदेश` : 'वॉइस रिकॉर्डिंग'}</span>
            </span>
            <span>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Waveform Bars */}
          <div className="flex items-center gap-1 sm:gap-1.5 h-9 bg-white/70 rounded-xl px-3 py-1 border border-brand-100">
            {waveform.map((val, idx) => {
              const barProgress = (idx / waveform.length) * 100;
              const isPassed = barProgress <= progressPercent;
              return (
                <div
                  key={idx}
                  className={`flex-1 rounded-full transition-all ${
                    isPassed ? 'bg-brand-700' : 'bg-brand-200'
                  } ${isPlaying ? 'animate-pulse' : ''}`}
                  style={{
                    height: `${Math.max(20, val)}%`,
                  }}
                />
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

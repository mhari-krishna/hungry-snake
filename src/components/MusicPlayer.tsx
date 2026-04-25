/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Track } from '../types';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Disc } from 'lucide-react';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'AI Gen.Synth',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: '2',
    title: 'Midnight Drive',
    artist: 'AI Gen.Retro',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: '3',
    title: 'Digital Dream',
    artist: 'AI Gen.Ambient',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200&h=200'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="flex items-center gap-12 w-full h-full">
      {/* Current Track Info */}
      <div className="flex items-center gap-4 w-1/4">
        <div className="w-14 h-14 bg-gradient-to-br from-cyan-600 to-blue-900 rounded-lg flex-shrink-0 border border-white/10 flex items-center justify-center relative overflow-hidden group">
           <Disc className={`w-8 h-8 text-white/40 ${isPlaying ? 'animate-spin-slow' : ''}`} />
           <motion.div 
             animate={{ opacity: isPlaying ? [0.2, 0.5, 0.2] : 0 }}
             transition={{ repeat: Infinity, duration: 2 }}
             className="absolute inset-0 bg-cyan-400/20" 
           />
        </div>
        <div className="overflow-hidden">
          <div className="text-lg font-black text-white truncate leading-tight tracking-tighter uppercase">{currentTrack.title}</div>
          <div className="text-[10px] text-cyan-400/60 font-mono truncate uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            {currentTrack.artist}
          </div>
        </div>
      </div>

      {/* Center Controls & Progress */}
      <div className="flex-grow flex flex-col gap-3 max-w-2xl px-8">
        <div className="flex justify-center items-center gap-10">
          <button onClick={prevTrack} className="text-zinc-600 hover:text-cyan-400 transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] border-4 border-black/10"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
          </button>

          <button onClick={nextTrack} className="text-zinc-600 hover:text-cyan-400 transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>

        <div className="flex items-center gap-4 text-[9px] font-mono text-zinc-600">
          <div className="w-8 text-right">0:00</div>
          <div className="flex-grow h-1.5 bg-[#111] rounded-full overflow-hidden border border-white/5 relative">
            <motion.div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              animate={{ width: `${progress}%` }}
            />
          </div>
          <div className="w-8">3:42</div>
        </div>
      </div>

      {/* Right Side: Diagnostics */}
      <div className="w-1/4 flex justify-end items-center gap-8">
        <div className="flex flex-col items-end gap-1">
           <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Signal_Strength</div>
           <div className="flex gap-0.5 h-3 items-end">
              {[1, 2, 3, 4, 5].map((level) => (
                <div 
                  key={level} 
                  className={`w-1 rounded-t-[1px] ${level <= 4 ? 'bg-cyan-500' : 'bg-zinc-800'}`} 
                  style={{ height: `${level * 20}%` }} 
                />
              ))}
           </div>
        </div>
        
        <div className="flex flex-col items-center border-l border-white/5 pl-8">
           <Volume2 className="w-4 h-4 text-zinc-500 mb-1" />
           <div className="w-20 h-1 bg-zinc-800 rounded-full">
              <div className="w-3/4 h-full bg-zinc-400 rounded-full" />
           </div>
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />
    </div>
  );
}

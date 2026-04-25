/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Zap, Activity, Cpu, Disc } from 'lucide-react';

export default function App() {
  return (
    <main className="min-h-screen bg-[#050505] text-gray-200 p-6 font-sans flex flex-col gap-4 overflow-hidden border-4 border-[#121212]">
      {/* Header Section */}
      <header className="flex justify-between items-end mb-2">
        <div className="flex flex-col">
          <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 uppercase">
            SYNTH-SNAKE V1.0
          </h1>
          <p className="text-[10px] font-mono text-cyan-500/70 tracking-widest uppercase">
            Neural-Link Audio Interface // Active
          </p>
        </div>
        
        <div className="flex gap-4">
          {/* We'll move the scores into the header as per the Bento design */}
          <div className="hidden sm:flex gap-4 text-right">
            <div className="px-4 py-2 bg-[#111] border border-cyan-500/30 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <div className="text-[10px] text-cyan-400 font-mono">STATUS</div>
              <div className="text-xl font-bold font-mono uppercase">Online</div>
            </div>
          </div>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 grid-rows-6 gap-4 flex-grow h-[calc(100vh-160px)]">
        
        {/* Left: Playlist/Status Sidebar */}
        <aside className="col-span-3 row-span-4 bento-card p-4 flex flex-col gap-4">
          <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <Disc className="w-3 h-3 text-fuchsia-500 animate-spin-slow" />
            Active Processes
          </h2>
          <div className="flex flex-col gap-3">
             <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-cyan-400 uppercase">Core_Heartbeat</span>
                </div>
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                   <motion.div animate={{ width: ['20%', '80%', '40%', '60%'] }} transition={{ repeat: Infinity, duration: 4 }} className="h-full bg-cyan-500" />
                </div>
             </div>
             <div className="p-3 rounded-xl bg-fuchsia-500/5 border border-white/5 space-y-2 opacity-60">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-zinc-500" />
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Input_Buffer</span>
                </div>
                <div className="h-0.5 bg-zinc-800 rounded-full" />
             </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-white/5">
            <p className="text-[9px] text-zinc-500 font-mono leading-tight uppercase">
              GRID: SYNCHRONIZED<br/>ENCRYPTION: AES-256-SYNTH
            </p>
          </div>
        </aside>

        {/* Center: Game Board (The Core) */}
        <section className="col-span-6 row-span-4 bento-card neon-border-cyan relative flex items-center justify-center p-2">
          <SnakeGame />
          <div className="absolute top-4 left-4 text-[9px] font-mono text-cyan-500/30 uppercase">
            SYSTEM_X: 42.022 | SYSTEM_Y: 18.992
          </div>
          <div className="absolute bottom-4 right-4 text-[9px] font-mono text-cyan-500/30 uppercase">
            STATUS: EXECUTING_SNAKE_PROCESS
          </div>
        </section>

        {/* Right: Visualizer & Bonus Panels */}
        <aside className="col-span-3 row-span-4 flex flex-col gap-4">
          <div className="flex-1 bento-card p-4 flex flex-col">
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Frequency Response</h2>
            <div className="flex items-end justify-between gap-1 flex-grow pb-2 h-20">
               {[...Array(12)].map((_, i) => (
                 <motion.div 
                   key={i}
                   animate={{ height: ['10%', '60%', '30%', '80%', '40%'] }}
                   transition={{ repeat: Infinity, duration: 1.5 + i * 0.1, ease: 'easeInOut' }}
                   className="w-full bg-cyan-500/50 rounded-t-sm"
                 />
               ))}
            </div>
          </div>
          <div className="h-1/3 bento-card p-4 flex flex-col justify-center items-center text-center bg-gradient-to-br from-fuchsia-500/10 to-transparent border-fuchsia-500/20">
            <div className="w-10 h-10 rounded-full border-2 border-fuchsia-500 flex items-center justify-center mb-2">
               <Zap className="w-5 h-5 text-fuchsia-500 fill-fuchsia-500" />
            </div>
            <div className="text-[10px] font-bold text-fuchsia-400 uppercase font-mono">Bonus Processor</div>
            <div className="text-[8px] text-gray-500 mt-1 uppercase tracking-tighter">Multiplier Stable @ 1.0x</div>
          </div>
        </aside>

        {/* Bottom: Player Controls Bar */}
        <footer className="col-span-12 row-span-2 bento-card px-8 flex items-center gap-8 border-t-2 border-cyan-500/10">
          <MusicPlayer />
        </footer>
      </div>

      {/* Decorative footer text */}
      <div className="flex justify-between items-center opacity-20 mt-2">
        <p className="text-[8px] font-mono uppercase tracking-[0.5em]">Neural Interface Phase 4</p>
        <p className="text-[8px] font-mono uppercase tracking-[0.5em]">AI Studio Runtime</p>
      </div>
    </main>
  );
}

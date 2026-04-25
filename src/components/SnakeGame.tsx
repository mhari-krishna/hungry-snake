/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameStatus, Point } from '../types';
import { Trophy, RefreshCw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;
const MIN_SPEED = 60;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const directionRef = useRef<Point>({ x: 0, y: -1 });
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    directionRef.current = { x: 0, y: -1 };
    setDirection({ x: 0, y: -1 }); // Keep state in sync for UI if needed
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setStatus(GameStatus.PLAYING);
    generateFood([{ x: 10, y: 10 }]);
  };

  const gameOver = () => {
    setStatus(GameStatus.GAME_OVER);
    if (score > highScore) setHighScore(score);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
  };

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const currentDir = directionRef.current;
      const newHead = {
        x: (head.x + currentDir.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + currentDir.y + GRID_SIZE) % GRID_SIZE,
      };

      // Collision checks
      if (
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        gameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Eaten food check
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 100);
        setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood, score, highScore]);

  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [status, moveSnake, speed]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          if (directionRef.current.y !== 1) {
            directionRef.current = { x: 0, y: -1 };
            setDirection({ x: 0, y: -1 });
          }
          break;
        case 'arrowdown':
        case 's':
          if (directionRef.current.y !== -1) {
            directionRef.current = { x: 0, y: 1 };
            setDirection({ x: 0, y: 1 });
          }
          break;
        case 'arrowleft':
        case 'a':
          if (directionRef.current.x !== 1) {
            directionRef.current = { x: -1, y: 0 };
            setDirection({ x: -1, y: 0 });
          }
          break;
        case 'arrowright':
        case 'd':
          if (directionRef.current.x !== -1) {
            directionRef.current = { x: 1, y: 0 };
            setDirection({ x: 1, y: 0 });
          }
          break;
        case 'enter':
          if (status !== GameStatus.PLAYING) resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 w-full h-full relative">
      {/* Header Info */}
      <div className="flex justify-between w-full p-2 bg-black/40 rounded-xl border border-white/5 mb-2">
        <div className="flex flex-col px-3 border-l-2 border-cyan-400">
          <span className="text-[10px] uppercase tracking-widest text-cyan-500 font-mono">Current_Signal</span>
          <span className="text-xl font-bold font-mono text-white">{score.toString().padStart(6, '0')}</span>
        </div>
        <div className="flex flex-col items-end px-3 border-r-2 border-fuchsia-500">
          <span className="text-[10px] uppercase tracking-widest text-fuchsia-500 font-mono">Peak_Signal</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-mono text-zinc-400">{highScore.toString().padStart(6, '0')}</span>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative aspect-square w-full max-w-[420px] bg-[#080808] border border-cyan-500/20 rounded-lg overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Background Grid Lines from Theme */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #333 1px, transparent 0)', backgroundSize: '21px 21px' }} />

        {/* Snake Rendering */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={i === 0 ? { scale: 0.8 } : false}
            animate={{ scale: 1 }}
            className={`
              relative z-10
              ${i === 0 ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-20 rounded-sm' : 'bg-cyan-600/60 rounded-sm'}
            `}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}

        {/* Food Rendering */}
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="bg-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.8)] rounded-full z-10"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {status !== GameStatus.PLAYING && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
            >
              {status === GameStatus.IDLE && (
                <div className="space-y-6">
                  <h2 className="text-4xl font-black text-white italic tracking-tighter">INIT_SNAKE</h2>
                  <p className="text-cyan-500/60 font-mono text-[10px] uppercase tracking-[0.3em]">Directional Input Required</p>
                  <button 
                    onClick={resetGame}
                    className="group relative px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-sm rounded-sm hover:scale-105 transition-transform overflow-hidden"
                  >
                    <span className="relative z-10">Start_Process</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-fuchsia-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                  </button>
                </div>
              )}

              {status === GameStatus.GAME_OVER && (
                <div className="space-y-6">
                  <h2 className="text-5xl font-black text-red-600 tracking-tighter">CRITICAL_ERR</h2>
                  <div className="space-y-1">
                    <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Signal Lost. Score Cached.</p>
                    <div className="text-3xl font-mono font-bold text-white tracking-widest">{score.toString().padStart(6, '0')}</div>
                  </div>
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-2 px-10 py-4 bg-zinc-800 text-white font-black text-xs uppercase tracking-[0.3em] border border-white/10 rounded-sm hover:bg-zinc-700 transition-all font-mono"
                  >
                    <RefreshCw className="w-4 h-4" /> Hard_Reset
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Help */}
      <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center opacity-20">
         <div className="text-[8px] font-mono uppercase tracking-[0.4em] flex gap-4">
            <span>[W-A-S-D] NAV</span>
            <span>[ENTER] REBOOT</span>
         </div>
      </div>
    </div>
  );
}

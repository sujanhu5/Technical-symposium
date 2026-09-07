import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { DepartmentCode } from '../types';
import { soundEffects } from '../utils/soundEffects';

interface OpeningDiffusionHeroProps {
  onSelectDept?: (dept: DepartmentCode) => void;
  onExploreEvents: () => void;
}

// 9 letters of SYMPOSIUM with individual parallax depths and floating wave phases
const SYMPOSIUM_LETTERS = [
  { char: 'S', depth: 1.15, floatSpeed: 0.024, phase: 0 },
  { char: 'Y', depth: 1.4, floatSpeed: 0.021, phase: 0.7 },
  { char: 'M', depth: 1.05, floatSpeed: 0.027, phase: 1.4 },
  { char: 'P', depth: 1.45, floatSpeed: 0.023, phase: 2.1 },
  { char: 'O', depth: 1.25, floatSpeed: 0.029, phase: 2.8 },
  { char: 'S', depth: 1.5, floatSpeed: 0.02, phase: 3.5 },
  { char: 'I', depth: 1.1, floatSpeed: 0.028, phase: 4.2 },
  { char: 'U', depth: 1.35, floatSpeed: 0.022, phase: 4.9 },
  { char: 'M', depth: 1.15, floatSpeed: 0.026, phase: 5.6 },
];

// Glowing perimeter voxel cubes around the word SYMPOSIUM
const VOXEL_CUBES = [
  // Left flank cluster (< :)
  { id: 'left-top', pos: 'left', baseLeft: '4%', baseTop: '20%', size: 18, depth: 1.8, xMult: 65, yMult: 50 },
  { id: 'left-mid', pos: 'left', baseLeft: '1%', baseTop: '45%', size: 24, depth: 2.2, xMult: 75, yMult: 55 },
  { id: 'left-bot', pos: 'left', baseLeft: '5%', baseTop: '70%', size: 16, depth: 1.6, xMult: 60, yMult: 45 },

  // Floating cubes above letters
  { id: 'top-1', pos: 'top', baseLeft: '22%', baseTop: '-28%', size: 18, depth: 2.0, xMult: 55, yMult: 65 },
  { id: 'top-2', pos: 'top', baseLeft: '38%', baseTop: '-36%', size: 22, depth: 2.3, xMult: 60, yMult: 70 },
  { id: 'top-3', pos: 'top', baseLeft: '56%', baseTop: '-24%', size: 16, depth: 1.9, xMult: 50, yMult: 60 },
  { id: 'top-4', pos: 'top', baseLeft: '74%', baseTop: '-32%', size: 20, depth: 2.1, xMult: 58, yMult: 68 },

  // Floating cubes between word and line
  { id: 'bot-1', pos: 'bottom', baseLeft: '18%', baseBottom: '-20%', size: 16, depth: 1.7, xMult: 45, yMult: 40 },
  { id: 'bot-2', pos: 'bottom', baseLeft: '52%', baseBottom: '-24%', size: 20, depth: 2.0, xMult: 50, yMult: 45 },
  { id: 'bot-3', pos: 'bottom', baseLeft: '68%', baseBottom: '-18%', size: 16, depth: 1.6, xMult: 48, yMult: 42 },
  { id: 'bot-4', pos: 'bottom', baseLeft: '84%', baseBottom: '-22%', size: 18, depth: 1.9, xMult: 52, yMult: 46 },

  // Right flank cluster (: >)
  { id: 'right-top', pos: 'right', baseRight: '4%', baseTop: '20%', size: 18, depth: 1.8, xMult: -65, yMult: 50 },
  { id: 'right-mid', pos: 'right', baseRight: '1%', baseTop: '45%', size: 24, depth: 2.2, xMult: -75, yMult: 55 },
  { id: 'right-bot', pos: 'right', baseRight: '5%', baseTop: '70%', size: 16, depth: 1.6, xMult: -60, yMult: 45 },
];

// Floating diamond particles across the background
const BACKGROUND_DIAMONDS = [
  { id: 1, top: '8%', left: '16%', size: 18, depth: 0.6, rotate: 45 },
  { id: 2, top: '15%', left: '30%', size: 28, depth: 0.9, rotate: 45 },
  { id: 3, top: '9%', left: '48%', size: 16, depth: 0.5, rotate: 45 },
  { id: 4, top: '16%', left: '60%', size: 24, depth: 0.8, rotate: 45 },
  { id: 5, top: '10%', left: '76%', size: 30, depth: 1.0, rotate: 45 },
  { id: 6, top: '18%', left: '88%', size: 18, depth: 0.7, rotate: 45 },
  { id: 7, top: '24%', left: '38%', size: 20, depth: 0.75, rotate: 45 },
  { id: 8, top: '22%', left: '68%', size: 16, depth: 0.65, rotate: 45 },
  { id: 9, top: '68%', left: '12%', size: 16, depth: 0.7, rotate: 45 },
  { id: 10, top: '74%', left: '8%', size: 22, depth: 0.85, rotate: 45 },
  { id: 11, top: '82%', left: '18%', size: 18, depth: 0.6, rotate: 45 },
  { id: 12, top: '72%', left: '26%', size: 26, depth: 0.95, rotate: 45 },
  { id: 13, top: '84%', left: '36%', size: 16, depth: 0.55, rotate: 45 },
  { id: 14, top: '76%', left: '56%', size: 14, depth: 0.5, rotate: 45 },
  { id: 15, top: '70%', left: '72%', size: 28, depth: 0.9, rotate: 45 },
  { id: 16, top: '80%', left: '82%', size: 18, depth: 0.65, rotate: 45 },
  { id: 17, top: '86%', left: '90%', size: 14, depth: 0.6, rotate: 45 },
];

export const OpeningDiffusionHero: React.FC<OpeningDiffusionHeroProps> = ({
  onExploreEvents,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Smooth interpolated mouse position (-1 to 1)
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  // Floating time accumulator for ambient wave
  const timeRef = useRef(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      targetMouse.current.x = (e.clientX - halfW) / halfW;
      targetMouse.current.y = (e.clientY - halfH) / halfH;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const halfW = window.innerWidth / 2;
        const halfH = window.innerHeight / 2;
        targetMouse.current.x = (touch.clientX - halfW) / halfW;
        targetMouse.current.y = (touch.clientY - halfH) / halfH;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    let animationFrameId: number;

    const animate = () => {
      // Lerp mouse coordinates for fluid spring feel
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.08;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.08;
      
      timeRef.current += 0.03;

      setCoords({
        x: currentMouse.current.x,
        y: currentMouse.current.y,
      });
      setTime(timeRef.current);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleScrollDown = () => {
    soundEffects.navClick();
    onExploreEvents();
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[#02060c] text-slate-100 overflow-hidden select-none px-4"
      id="opening"
    >
      {/* Background Radial Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/45 via-[#030914] to-[#010408] pointer-events-none" />
      
      {/* Dynamic Cursor-Tracking Ambient Blue Flare Behind Word */}
      <div 
        style={{
          transform: `translate(calc(-50% + ${coords.x * 120}px), calc(-50% + ${coords.y * 90}px))`,
          transition: 'transform 0.05s ease-out',
        }}
        className="absolute top-1/2 left-1/2 w-[320px] sm:w-[650px] md:w-[900px] h-[220px] sm:h-[350px] md:h-[450px] rounded-full bg-gradient-to-r from-blue-700/25 via-cyan-400/35 to-sky-600/25 blur-[90px] sm:blur-[130px] pointer-events-none" 
      />

      {/* Subtle Cyan Grid Lines that Parallax with Cursor */}
      <div 
        className="absolute inset-0 opacity-[0.14] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 210, 255, 0.12) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 210, 255, 0.12) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          transform: `translate(${coords.x * 12}px, ${coords.y * 12}px)`,
        }}
      />

      {/* Floating Tilted Diamond Particles in Background Reacting to Cursor */}
      {BACKGROUND_DIAMONDS.map((p) => {
        const floatY = Math.sin(time + p.id) * 8;
        const offsetX = -coords.x * 45 * p.depth;
        const offsetY = -coords.y * 40 * p.depth + floatY;

        return (
          <div
            key={p.id}
            style={{
              top: p.top,
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              transform: `translate(${offsetX}px, ${offsetY}px) rotate(${p.rotate}deg)`,
              opacity: 0.22 + (p.depth * 0.15),
            }}
            className="absolute pointer-events-none border border-cyan-400/50 bg-cyan-400/10 backdrop-blur-[1px] shadow-[0_0_8px_rgba(6,182,212,0.3)] hidden sm:block will-change-transform"
          />
        );
      })}

      {/* ============================================================ */}
      {/* 3D CURSOR-INTERACTIVE HERO STAGE */}
      {/* "remove technical and keep only symposium" */}
      {/* "the animation must same when you gave in the first like this the cursor movement making them all move" */}
      {/* ============================================================ */}
      <div 
        style={{
          transform: `perspective(1000px) rotateX(${-coords.y * 12}deg) rotateY(${coords.x * 12}deg)`,
          transformStyle: 'preserve-3d',
        }}
        className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center my-auto py-8 transition-transform duration-75 ease-out"
      >
        
        {/* ROW 1: "SYMPOSIUM" with Attached & Floating Glowing Voxel Cubes */}
        <div className="relative flex items-center justify-center w-full px-2 sm:px-6">
          
          {/* --- LEFT FLANK VOXEL CUBES CLUSTER (< :) MOVING WITH CURSOR --- */}
          <div 
            style={{
              transform: `translate(${coords.x * 45}px, ${coords.y * 35}px)`,
            }}
            className="absolute left-[2%] sm:left-[5%] md:left-[8%] lg:left-[10%] flex flex-col items-center gap-1.5 sm:gap-2 z-20 pointer-events-none will-change-transform"
          >
            {/* Top-left small cube */}
            <div 
              style={{
                transform: `translate(${coords.x * 15}px, ${coords.y * 12}px) rotate(4deg)`,
              }}
              className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 bg-gradient-to-br from-white via-cyan-300 to-blue-600 border border-cyan-200 shadow-[0_0_14px_rgba(0,220,255,0.85)] -translate-x-1 sm:-translate-x-2 -translate-y-2" 
            />
            
            {/* Mid-left main glowing cube */}
            <div 
              style={{
                transform: `translate(${coords.x * 25}px, ${coords.y * 18}px)`,
              }}
              className="w-4.5 h-4.5 sm:w-6 sm:h-6 md:w-7 md:h-7 bg-gradient-to-br from-white via-cyan-300 to-sky-600 border border-cyan-100 shadow-[0_0_20px_rgba(0,225,255,0.95)] -translate-x-3 sm:-translate-x-5" 
            />
            
            {/* Bottom-left small cube */}
            <div 
              style={{
                transform: `translate(${coords.x * 18}px, ${coords.y * 15}px) rotate(-4deg)`,
              }}
              className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 bg-gradient-to-br from-white via-cyan-300 to-blue-600 border border-cyan-200 shadow-[0_0_14px_rgba(0,220,255,0.85)] -translate-x-1 sm:-translate-x-2 translate-y-1" 
            />
          </div>

          {/* --- FLOATING CUBES ABOVE LETTERS (DRIVEN BY CURSOR MOVEMENT) --- */}
          {/* Cube above 'Y' */}
          <div 
            style={{
              transform: `translate(${coords.x * 55}px, ${coords.y * 45 + Math.sin(time + 1) * 6}px)`,
            }}
            className="absolute top-[-14px] sm:top-[-24px] md:top-[-32px] left-[24%] sm:left-[26%] w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 md:w-5.5 md:h-5.5 bg-gradient-to-br from-white via-cyan-300 to-blue-600 border border-cyan-200 shadow-[0_0_16px_rgba(0,220,255,0.85)] pointer-events-none hidden xs:block will-change-transform" 
          />
          
          {/* Cube above 'P' */}
          <div 
            style={{
              transform: `translate(${coords.x * 65}px, ${coords.y * 55 + Math.sin(time + 2) * 8}px)`,
            }}
            className="absolute top-[-18px] sm:top-[-30px] md:top-[-40px] left-[42%] sm:left-[43%] w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-br from-white via-cyan-300 to-blue-600 border border-cyan-100 shadow-[0_0_18px_rgba(0,225,255,0.95)] pointer-events-none will-change-transform" 
          />
          
          {/* Cube above 'S' */}
          <div 
            style={{
              transform: `translate(${coords.x * 50}px, ${coords.y * 42 + Math.sin(time + 3) * 6}px)`,
            }}
            className="absolute top-[-10px] sm:top-[-18px] md:top-[-26px] left-[58%] sm:left-[59%] w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-gradient-to-br from-white via-cyan-300 to-blue-600 border border-cyan-200 shadow-[0_0_14px_rgba(0,220,255,0.85)] pointer-events-none hidden xs:block will-change-transform" 
          />

          {/* Cube above 'U' */}
          <div 
            style={{
              transform: `translate(${coords.x * 60}px, ${coords.y * 48 + Math.sin(time + 4) * 7}px)`,
            }}
            className="absolute top-[-14px] sm:top-[-24px] md:top-[-34px] left-[74%] sm:left-[75%] w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 md:w-5.5 md:h-5.5 bg-gradient-to-br from-white via-cyan-300 to-blue-600 border border-cyan-100 shadow-[0_0_16px_rgba(0,225,255,0.85)] pointer-events-none will-change-transform" 
          />

          {/* --- THE WORD: SYMPOSIUM (PIXEL ART LETTERS MOVING WITH CURSOR) --- */}
          <div className="flex items-center justify-center select-none overflow-hidden max-w-full">
            <h1 
              className="flex items-center justify-center font-pixel text-[28px] xs:text-[36px] sm:text-[56px] md:text-[76px] lg:text-[92px] xl:text-[104px] font-bold tracking-tight xs:tracking-normal sm:tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-white via-[#b8edff] via-[#46beff] to-[#0275d8] drop-shadow-[0_0_24px_rgba(0,215,255,0.9)] drop-shadow-[0_0_55px_rgba(0,140,255,0.55)] leading-none text-center"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                textRendering: 'geometricPrecision',
              }}
            >
              {SYMPOSIUM_LETTERS.map((letter, idx) => {
                // Each letter translates dynamically based on cursor movement + subtle ambient sine wave
                const waveY = Math.sin(time * 1.5 + letter.phase) * 4;
                const letterX = coords.x * 24 * letter.depth;
                const letterY = coords.y * 18 * letter.depth + waveY;

                return (
                  <span
                    key={idx}
                    style={{
                      transform: `translate(${letterX}px, ${letterY}px)`,
                      display: 'inline-block',
                      transition: 'transform 0.06s ease-out',
                    }}
                    className="will-change-transform hover:scale-105"
                  >
                    {letter.char}
                  </span>
                );
              })}
            </h1>
          </div>

          {/* --- RIGHT FLANK VOXEL CUBES CLUSTER (: >) MOVING WITH CURSOR --- */}
          <div 
            style={{
              transform: `translate(${coords.x * 45}px, ${coords.y * 35}px)`,
            }}
            className="absolute right-[2%] sm:right-[5%] md:right-[8%] lg:right-[10%] flex flex-col items-center gap-1.5 sm:gap-2 z-20 pointer-events-none will-change-transform"
          >
            {/* Top-right small cube */}
            <div 
              style={{
                transform: `translate(${coords.x * 15}px, ${coords.y * 12}px) rotate(-4deg)`,
              }}
              className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 bg-gradient-to-br from-white via-cyan-300 to-blue-600 border border-cyan-200 shadow-[0_0_14px_rgba(0,220,255,0.85)] translate-x-1 sm:translate-x-2 -translate-y-2" 
            />
            
            {/* Mid-right main glowing cube */}
            <div 
              style={{
                transform: `translate(${coords.x * 25}px, ${coords.y * 18}px)`,
              }}
              className="w-4.5 h-4.5 sm:w-6 sm:h-6 md:w-7 md:h-7 bg-gradient-to-br from-white via-cyan-300 to-sky-600 border border-cyan-100 shadow-[0_0_20px_rgba(0,225,255,0.95)] translate-x-3 sm:translate-x-5" 
            />
            
            {/* Bottom-right small cube */}
            <div 
              style={{
                transform: `translate(${coords.x * 18}px, ${coords.y * 15}px) rotate(4deg)`,
              }}
              className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 bg-gradient-to-br from-white via-cyan-300 to-blue-600 border border-cyan-200 shadow-[0_0_14px_rgba(0,220,255,0.85)] translate-x-1 sm:translate-x-2 translate-y-1" 
            />
          </div>

        </div>

        {/* --- FLOATING CUBES SITTING ALONG THE HORIZONTAL LINE (CURSOR INTERACTIVE) --- */}
        <div className="relative w-full max-w-5xl h-4 sm:h-6 pointer-events-none">
          {/* Cube below 'S' */}
          <div 
            style={{
              transform: `translate(${coords.x * 35}px, ${coords.y * 22}px)`,
            }}
            className="absolute bottom-[2px] sm:bottom-[3px] left-[18%] sm:left-[20%] w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 bg-gradient-to-br from-white via-cyan-300 to-blue-600 border border-cyan-200 shadow-[0_0_14px_rgba(0,220,255,0.85)] will-change-transform" 
          />
          
          {/* Cube below 'O' */}
          <div 
            style={{
              transform: `translate(${coords.x * 45}px, ${coords.y * 28}px)`,
            }}
            className="absolute bottom-[0px] sm:bottom-[1px] left-[50%] sm:left-[51%] w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-white via-cyan-300 to-blue-600 border border-cyan-100 shadow-[0_0_16px_rgba(0,225,255,0.95)] will-change-transform" 
          />

          {/* Cube below 'U' */}
          <div 
            style={{
              transform: `translate(${coords.x * 40}px, ${coords.y * 24}px)`,
            }}
            className="absolute bottom-[2px] sm:bottom-[3px] left-[70%] sm:left-[72%] w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 bg-gradient-to-br from-white via-cyan-300 to-blue-600 border border-cyan-200 shadow-[0_0_14px_rgba(0,220,255,0.85)] will-change-transform" 
          />
          
          {/* Cube far right */}
          <div 
            style={{
              transform: `translate(${coords.x * 50}px, ${coords.y * 30}px)`,
            }}
            className="absolute bottom-[0px] sm:bottom-[1px] right-[7%] sm:right-[10%] w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-white via-cyan-300 to-blue-600 border border-cyan-100 shadow-[0_0_16px_rgba(0,225,255,0.95)] will-change-transform" 
          />
        </div>

        {/* ROW 2: THE THIN LUMINOUS HORIZONTAL LINE (SUBTLE PARALLAX) */}
        <div 
          style={{
            transform: `translate(${coords.x * 16}px, ${coords.y * 10}px)`,
          }}
          className="relative w-full max-w-5xl flex items-center justify-center my-2 sm:my-3 will-change-transform"
        >
          <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/60 via-white/90 via-cyan-400/60 to-transparent shadow-[0_0_12px_rgba(0,215,255,0.85)]" />
        </div>

        {/* ROW 3: "PRESS START 2P  ——  RETRO TECH" (MATCHING USER REFERENCE IMAGE) */}
        <div 
          style={{
            transform: `translate(${coords.x * 20}px, ${coords.y * 12}px)`,
          }}
          className="mt-6 sm:mt-8 flex items-center justify-center gap-3 sm:gap-4 text-cyan-300/85 text-[10px] sm:text-[11px] md:text-xs font-mono tracking-[0.25em] sm:tracking-[0.35em] uppercase will-change-transform"
        >
          <span>PRESS START 2P</span>
          <span className="w-6 sm:w-10 h-[1px] bg-cyan-400/70 shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
          <span>RETRO TECH</span>
        </div>

        {/* ROW 4: INSTITUTION BADGE */}
        <div 
          style={{
            transform: `translate(${coords.x * 14}px, ${coords.y * 8}px)`,
          }}
          className="mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 text-[10px] sm:text-xs font-mono backdrop-blur-xl will-change-transform"
        >
          <span>SJB Institute of Technology • 25th Silver Jubilee</span>
        </div>

      </div>

      {/* SUBTLE INTERACTION ARROW TO SCROLL TO DEPARTMENTS GRID */}
      <div className="relative z-10 mb-6 sm:mb-8 flex flex-col items-center cursor-pointer group" onClick={handleScrollDown}>
        <button
          type="button"
          className="p-2 rounded-full text-slate-400 hover:text-cyan-300 hover:bg-white/[0.05] transition-colors focus:outline-none"
          aria-label="Scroll to Departments Grid and Competitions"
        >
          <ChevronDown className="w-5 h-5 animate-bounce text-cyan-400" />
        </button>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Clock, Zap, Sparkles, Activity, ShieldCheck, Flame } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC = () => {
  // Target date: October 24, 2026 09:00:00 UTC
  const targetDate = new Date('2026-10-24T09:00:00Z').getTime();

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { 
      label: 'DAYS', 
      sublabel: 'EARTH SOLAR', 
      value: timeLeft.days, 
      color: 'text-cyan-300', 
      border: 'border-cyan-500/30', 
      glow: 'rgba(6, 182, 212, 0.15)',
      accent: 'bg-cyan-400' 
    },
    { 
      label: 'HOURS', 
      sublabel: 'STANDARD CLOCK', 
      value: timeLeft.hours, 
      color: 'text-purple-300', 
      border: 'border-purple-500/30', 
      glow: 'rgba(168, 85, 247, 0.15)',
      accent: 'bg-purple-400' 
    },
    { 
      label: 'MINUTES', 
      sublabel: 'TELEMETRY', 
      value: timeLeft.minutes, 
      color: 'text-emerald-300', 
      border: 'border-emerald-500/30', 
      glow: 'rgba(16, 185, 129, 0.15)',
      accent: 'bg-emerald-400' 
    },
    { 
      label: 'SECONDS', 
      sublabel: 'PULSE RATE', 
      value: timeLeft.seconds, 
      color: 'text-amber-300', 
      border: 'border-amber-500/30', 
      glow: 'rgba(245, 158, 11, 0.15)',
      accent: 'bg-amber-400' 
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto" id="countdown-timer-container">
      {/* Top HUD Status line */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <span className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            T-Minus Countdown to Fest Inception
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" />
            Synchronized
          </span>
          <span>•</span>
          <span className="text-slate-300">Oct 24, 09:00 AM IST</span>
        </div>
      </div>

      {/* Cyberpunk Digits Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {timeUnits.map((unit) => (
          <div
            key={unit.label}
            className={`relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border ${unit.border} shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden`}
          >
            {/* Ambient subtle glow ring */}
            <div 
              className="absolute inset-0 rounded-2xl pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity"
              style={{ background: `radial-gradient(circle at 50% 0%, ${unit.glow}, transparent 70%)` }}
            />

            {/* Corner Tech Indicator */}
            <div className={`absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full ${unit.accent} opacity-60 group-hover:opacity-100 shadow-[0_0_8px_currentColor] transition-opacity`} />
            <div className="absolute top-2.5 left-2.5 w-2 h-0.5 bg-white/20" />

            {/* Digital Numerical Value */}
            <span className={`font-display font-black text-3xl sm:text-5xl lg:text-6xl font-mono tracking-tight ${unit.color} drop-shadow-sm`}>
              {String(unit.value).padStart(2, '0')}
            </span>

            {/* Main Label */}
            <span className="mt-1 text-xs font-mono font-extrabold tracking-widest text-slate-200 uppercase">
              {unit.label}
            </span>

            {/* Micro Sublabel */}
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider hidden sm:block">
              {unit.sublabel}
            </span>

            {/* Bottom Accent Micro-line */}
            <div className={`absolute bottom-0 left-6 right-6 h-[1.5px] ${unit.accent} opacity-30 group-hover:opacity-80 transition-opacity`} />
          </div>
        ))}
      </div>
    </div>
  );
};

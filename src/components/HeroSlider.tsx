import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Trophy, 
  Users, 
  Award, 
  Terminal, 
  Radio, 
  Zap, 
  Calendar,
  ShieldCheck,
  Flame,
  Search,
  Compass,
  Cpu,
  MapPin,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CountdownTimer } from './CountdownTimer';
import { useFest } from '../context/FestContext';
import { soundEffects } from '../utils/soundEffects';

interface HeroSliderProps {
  onExploreEvents: () => void;
  onExploreTimeline: () => void;
  onSelectDept: (dept: 'CSE' | 'ISE' | 'ECE' | 'EEE') => void;
  onOpenSearch: () => void;
  onOpenArenaNavigator: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  onExploreEvents,
  onExploreTimeline,
  onSelectDept,
  onOpenSearch,
  onOpenArenaNavigator,
}) => {
  const { stats } = useFest();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 'jubilee-grand',
      tag: '25TH JUBILEE SYMPOSIUM',
      badge: '1999 — 2026: 25 YEARS OF EXCELLENCE',
      badgeColor: 'border-amber-400/40 text-amber-300 bg-amber-950/40',
      titlePrefix: 'TECHNICAL',
      titleHighlight: 'SYMPOSIUM',
      titleSuffix: '2K26',
      subtitle: 'Where a Quarter Century of Engineering Pioneer Spirits Meets the Next Era of Frontier Tech',
      description: 'Join 1,200+ collegiate innovators, developers, hackers, and electrical architects competing across 4 departments for ₹3,50,000+ in prizes, incubation grants, and the Silver Jubilee Cup.',
      primaryBtn: 'Register for Events',
      secondaryBtn: 'Explore 25-Year Journey',
      actionType: 'events',
      accentGradient: 'from-cyan-400 via-blue-500 to-purple-400',
      ambientColor: 'rgba(6, 182, 212, 0.16)',
      highlights: [
        { label: 'Grand Prize Pool', val: '₹3,50,000+', icon: Trophy, color: 'text-amber-400' },
        { label: 'Department Arenas', val: 'CSE • ISE • ECE • EEE', icon: Compass, color: 'text-cyan-400' },
        { label: 'Official Arenas', val: '8 Flagship Competitions', icon: Award, color: 'text-purple-400' },
      ],
    },
    {
      id: 'cse-spotlight',
      tag: 'CSE SPOTLIGHT ARENA',
      badge: 'DEPT. OF COMPUTER SCIENCE & ENGINEERING',
      badgeColor: 'border-cyan-400/40 text-cyan-300 bg-cyan-950/40',
      titlePrefix: 'APP DEV •',
      titleHighlight: 'IDEATHON',
      titleSuffix: '• CTF',
      subtitle: 'Code 24 Hours, Pitch High-Impact Tech Startups, and Defend Zero-Day Exploits',
      description: 'Experience CSE\'s flagship triple-crown: the 24-Hour AppNova Hackathon, InnoVenture VC Pitching, and the CyberPulse Jeopardy CTF Arena with hands-on exploitation.',
      primaryBtn: 'Launch CSE Arena',
      secondaryBtn: 'View Guidelines & Rules',
      actionType: 'cse',
      accentGradient: 'from-cyan-400 via-teal-400 to-blue-500',
      ambientColor: 'rgba(20, 184, 166, 0.16)',
      highlights: [
        { label: 'AppNova Hackathon', val: '24-Hour Non-stop', icon: Terminal, color: 'text-cyan-400' },
        { label: 'InnoVenture Ideathon', val: '₹40,000 & Incubation', icon: Sparkles, color: 'text-teal-400' },
        { label: 'CyberPulse CTF', val: 'Web • Crypto • Reverse', icon: ShieldCheck, color: 'text-blue-400' },
      ],
    },
    {
      id: 'cross-dept-arena',
      tag: 'ISE • ECE • EEE FRONTIER',
      badge: 'INTER-DISCIPLINARY HARDWARE, AI & CLEANTECH',
      badgeColor: 'border-purple-400/40 text-purple-300 bg-purple-950/40',
      titlePrefix: 'AI, ROBOTICS &',
      titleHighlight: 'EV SUPERGRID',
      titleSuffix: '',
      subtitle: 'Agentic LLMs, Autonomous Maze Drones, and Electric Vehicle Powertrain Showdowns',
      description: 'Dive into ISE\'s NeuralQuest AI & CloudCraft DevOps, ECE\'s RoboCircuit line/maze navigation arena, and EEE\'s VoltVanguard clean energy microgrid engineering challenge.',
      primaryBtn: 'Explore All Arenas',
      secondaryBtn: 'View Prize Distribution',
      actionType: 'all_depts',
      accentGradient: 'from-purple-400 via-emerald-400 to-amber-400',
      ambientColor: 'rgba(168, 85, 247, 0.16)',
      highlights: [
        { label: 'ISE NeuralQuest', val: 'Agentic GenAI & ML', icon: Cpu, color: 'text-purple-400' },
        { label: 'ECE RoboCircuit', val: 'Line & Maze Bots', icon: Radio, color: 'text-emerald-400' },
        { label: 'EEE VoltVanguard', val: 'EV CleanTech Grid', icon: Zap, color: 'text-amber-400' },
      ],
    },
  ];

  // Auto-slide every 7 seconds unless hovered/paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const slide = slides[currentSlide];

  const handlePrimaryAction = () => {
    soundEffects.navClick();
    if (slide.actionType === 'cse') {
      onSelectDept('CSE');
      onExploreEvents();
    } else if (slide.actionType === 'all_depts') {
      onOpenArenaNavigator();
    } else {
      onExploreEvents();
    }
  };

  const handleSecondaryAction = () => {
    soundEffects.navClick();
    if (slide.actionType === 'jubilee-grand') {
      onExploreTimeline();
    } else {
      onExploreEvents();
    }
  };

  const nextSlide = () => {
    soundEffects.hoverTick();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    soundEffects.hoverTick();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section 
      id="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden pt-8 sm:pt-12 pb-16 sm:pb-20 border-b border-white/10 cyber-grid"
    >
      {/* Dynamic Animated Ambient Spotlights */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[950px] h-[400px] rounded-full blur-[140px] -z-10 transition-all duration-1000 pointer-events-none"
        style={{ background: slide.ambientColor }}
      />
      <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-cyan-600/10 blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-purple-600/10 blur-[130px] -z-10 pointer-events-none" />

      {/* Cyber Circuit Grid Lines overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Campus Live Telemetry Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-white/10 text-xs font-mono text-slate-400 mb-8 max-w-4xl mx-auto shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-emerald-400 font-bold">CAMPUS STATUS: ACTIVE</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-300">Bangalore Tech Quadrangle</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              Offline Labs & Auditoriums
            </span>
            <button
              onClick={() => {
                soundEffects.navClick();
                onOpenSearch();
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-white/10 transition-colors"
            >
              <Search className="w-3 h-3" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="px-1 text-[9px] bg-slate-900 rounded text-slate-300">⌘K</kbd>
            </button>
          </div>
        </div>

        {/* Dynamic Hero Slide Content with AnimatePresence */}
        <div className="text-center max-w-4xl mx-auto min-h-[380px] sm:min-h-[420px] flex flex-col justify-center items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full flex flex-col items-center"
            >
              {/* Jubilee Announcement Pill */}
              <div className="inline-flex items-center gap-2 mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-semibold tracking-wide font-mono ${slide.badgeColor} shadow-md`}>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  {slide.badge}
                </span>
              </div>

              {/* Hero Main Headline with Dynamic Gradient */}
              <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white leading-none mb-4">
                <span>{slide.titlePrefix} </span>
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.accentGradient} drop-shadow-[0_0_35px_rgba(6,182,212,0.3)]`}>
                  {slide.titleHighlight}
                </span>
                {slide.titleSuffix && <span> {slide.titleSuffix}</span>}
              </h1>

              {/* Subtitle */}
              <h2 className="text-base sm:text-2xl font-bold text-slate-200 mb-4 max-w-2xl font-display leading-snug">
                {slide.subtitle}
              </h2>

              {/* Description */}
              <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-2xl mb-8">
                {slide.description}
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
                <button
                  onClick={handlePrimaryAction}
                  id="hero-primary-cta"
                  className="flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:scale-103 active:scale-97 cursor-pointer"
                >
                  <span>{slide.primaryBtn}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>

                <button
                  onClick={handleSecondaryAction}
                  id="hero-secondary-cta"
                  className="flex items-center gap-2 px-5 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/15 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md transition-all hover:border-cyan-400/50 cursor-pointer shadow-lg"
                >
                  <span>{slide.secondaryBtn}</span>
                </button>

                <button
                  onClick={() => {
                    soundEffects.navClick();
                    onOpenArenaNavigator();
                  }}
                  id="hero-arena-jump-btn"
                  className="hidden md:flex items-center gap-2 px-4 py-3.5 rounded-xl bg-slate-950/70 hover:bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold transition-all"
                >
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>Arena Flight Deck</span>
                </button>
              </div>

              {/* Three Highlight Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl mb-8">
                {slide.highlights.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={idx}
                      className="px-4 py-3 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md flex items-center gap-3 text-left hover:border-white/20 transition-colors shadow-lg"
                    >
                      <div className={`p-2 rounded-xl bg-slate-950/80 border border-white/10 ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block truncate">
                          {item.label}
                        </span>
                        <span className={`font-display font-bold text-sm sm:text-base ${item.color} truncate block`}>
                          {item.val}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Graphical Slide Controls & Quick Selector Tabs */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <div className="flex items-center gap-2 p-1 rounded-full bg-slate-900/90 border border-white/10 shadow-lg">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 px-1">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => {
                    soundEffects.hoverTick();
                    setCurrentSlide(i);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all ${
                    currentSlide === i 
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)] font-bold' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{s.tag}</span>
                </button>
              ))}
            </div>

            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Countdown Timer Embedded in Hero with Next-Level HUD */}
        <div className="pt-2">
          <CountdownTimer />
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  Calendar, 
  Bell, 
  Search, 
  Ticket, 
  Volume2, 
  VolumeX, 
  ArrowUp
} from 'lucide-react';
import { motion } from 'motion/react';
import { soundEffects } from '../utils/soundEffects';

interface GraphicalDockProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenSearch: () => void;
  onOpenPassLookup: () => void;
}

export const GraphicalDock: React.FC<GraphicalDockProps> = ({
  activeSection,
  onNavigate,
  onOpenSearch,
  onOpenPassLookup,
}) => {
  const [muted, setMuted] = useState(soundEffects.isMuted());
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    soundEffects.init();
    setMuted(soundEffects.isMuted());

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 180);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleSound = () => {
    const isNowMuted = soundEffects.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      soundEffects.navClick();
    }
  };

  const dockItems = [
    { id: 'opening', label: 'Top', icon: ArrowUp },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'anniversary', label: 'Jubilee', icon: Sparkles },
    { id: 'updates', label: 'Updates', icon: Bell },
  ];

  const handleItemClick = (id: string) => {
    soundEffects.navClick();
    onNavigate(id);
  };

  return (
    <aside 
      aria-label="Fest Quick Navigation Dock"
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] sm:max-w-max transition-all duration-300 transform-gpu ${
        isScrolled && activeSection !== 'opening'
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-24 opacity-0 pointer-events-none'
      }`}
    >
      <div 
        id="graphical-nav-dock"
        className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
      >
        {/* Navigation Item Buttons */}
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              id={`dock-btn-${item.id}`}
              onClick={() => handleItemClick(item.id)}
              onMouseEnter={() => soundEffects.hoverTick()}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'text-white bg-white/10 border border-white/15' 
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-xs font-mono font-medium hidden sm:inline">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Divider */}
        <div className="w-[1px] h-4 bg-white/10 mx-1" />

        {/* Spotlight Command Search */}
        <button
          onClick={() => {
            soundEffects.navClick();
            onOpenSearch();
          }}
          title="Search Competitions (⌘K)"
          id="dock-search-btn"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-all cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden lg:inline text-[10px] text-slate-400">⌘K</span>
        </button>

        {/* Pass Lookup Button */}
        <button
          onClick={() => {
            soundEffects.navClick();
            onOpenPassLookup();
          }}
          title="Lookup My Pass"
          id="dock-pass-lookup-btn"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-950 hover:bg-slate-200 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
        >
          <Ticket className="w-3.5 h-3.5 text-slate-950" />
          <span>My Pass</span>
        </button>

        {/* Audio FX Toggle */}
        <button
          onClick={handleToggleSound}
          title={muted ? 'Unmute UI Audio' : 'Mute UI Audio'}
          id="dock-sound-toggle-btn"
          className="p-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
        </button>
      </div>
    </aside>
  );
};

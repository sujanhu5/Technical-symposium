import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  Terminal, 
  Cpu, 
  Radio, 
  Zap, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Trophy, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useFest } from '../context/FestContext';
import { FestEvent, DepartmentCode } from '../types';
import { soundEffects } from '../utils/soundEffects';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEvent: (event: FestEvent) => void;
  onSelectDept: (dept: DepartmentCode) => void;
  onNavigateSection: (sectionId: string) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectEvent,
  onSelectDept,
  onNavigateSection,
}) => {
  const { events, departments } = useFest();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setQuery('');
      setSelectedIndex(0);
      soundEffects.navClick();
    }
  }, [isOpen]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filtered items
  const filteredEvents = events.filter((ev) => {
    const q = query.toLowerCase();
    return (
      ev.title.toLowerCase().includes(q) ||
      ev.subtitle.toLowerCase().includes(q) ||
      ev.category.toLowerCase().includes(q) ||
      ev.dept.toLowerCase().includes(q) ||
      ev.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const quickNav = [
    { id: 'hero', label: 'Home & Countdown', dept: null },
    { id: 'anniversary', label: '25th Silver Jubilee Timeline', dept: null },
    { id: 'departments', label: 'Engineering Arenas', dept: null },
    { id: 'events', label: 'All 8 Competitions & Rules', dept: null },
    { id: 'updates', label: 'Live Notification Stream', dept: null },
  ];

  const handleSelect = (ev: FestEvent) => {
    soundEffects.navClick();
    onSelectEvent(ev);
    onClose();
  };

  const handleNav = (id: string, dept?: DepartmentCode) => {
    soundEffects.navClick();
    if (dept) {
      onSelectDept(dept);
    }
    onNavigateSection(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-20 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.3)] text-slate-100 overflow-hidden flex flex-col"
        id="command-palette-card"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-slate-950/70">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search competitions, rules, departments, hackathons (or type CSE, ECE)..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none font-mono"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results / Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Department Quick Jump Tags */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2">
              Fast Arena Jumps
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {departments.map((d) => (
                <button
                  key={d.code}
                  onClick={() => handleNav('events', d.code)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/40 text-left transition-all text-xs group"
                >
                  <span 
                    className="w-2 h-2 rounded-full shrink-0" 
                    style={{ backgroundColor: d.colorTheme.primary }} 
                  />
                  <div className="truncate">
                    <strong className="text-white group-hover:text-cyan-300 font-mono">{d.code}</strong>
                    <span className="block text-[10px] text-slate-400 truncate">{d.stats.eventsCount} Events</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Events Search Matching */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Competitions & Hackathons ({filteredEvents.length})
              </span>
              <span className="text-[10px] font-mono text-cyan-400">Click to inspect</span>
            </div>

            <div className="space-y-1">
              {filteredEvents.map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => handleSelect(ev)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 hover:bg-cyan-950/30 border border-white/5 hover:border-cyan-500/30 text-left transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-300 border border-cyan-500/30 shrink-0">
                      {ev.dept}
                    </span>
                    <div className="truncate">
                      <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {ev.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">
                        {ev.category} • Prize: {ev.prizePool.total} • {ev.venue}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-slate-400 group-hover:text-cyan-300">
                    <span className="text-[10px] font-mono hidden sm:inline">{ev.status}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}

              {filteredEvents.length === 0 && (
                <div className="p-6 text-center text-xs font-mono text-slate-400">
                  No competitions match "{query}". Try searching "hackathon", "robotics", "AI", or "CSE".
                </div>
              )}
            </div>
          </div>

          {/* Quick Page Sections */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2">
              Sections & Fest Portals
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {quickNav.map((nav) => (
                <button
                  key={nav.id}
                  onClick={() => handleNav(nav.id)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-950/40 hover:bg-slate-800 text-slate-300 hover:text-white text-xs text-left transition-colors"
                >
                  <span>{nav.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Command Palette Footer */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">ESC</kbd> to exit</span>
            <span className="hidden sm:inline"><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">⌘K</kbd> to launch</span>
          </div>
          <span className="text-cyan-400">25th Silver Jubilee Official Explorer</span>
        </div>
      </div>
    </div>
  );
};

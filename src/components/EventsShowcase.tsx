import React, { useState } from 'react';
import { 
  Trophy, 
  Users, 
  Calendar, 
  MapPin, 
  ArrowUpRight, 
  Sparkles, 
  FileText, 
  Search, 
  CheckCircle2,
  Terminal,
  Cpu,
  Radio,
  Zap,
  ArrowRight,
  Layers,
  Info
} from 'lucide-react';
import { useFest } from '../context/FestContext';
import { FestEvent, DepartmentCode } from '../types';
import { soundEffects } from '../utils/soundEffects';

interface EventsShowcaseProps {
  onOpenEventDetail: (event: FestEvent) => void;
  onOpenRegistration: (event: FestEvent) => void;
}

interface DepartmentInfo {
  code: DepartmentCode;
  name: string;
  fullName: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  eventsCount: number;
  totalPrize: string;
  color: string;
  badgeBg: string;
  borderColor: string;
  glowColor: string;
  status: 'active' | 'upcoming';
}

const DEPARTMENTS_DATA: DepartmentInfo[] = [
  {
    code: 'CSE',
    name: 'Computer Science',
    fullName: 'Computer Science & Engineering',
    tagline: 'Hackathons, Web3, Full-Stack Prototyping & Cybersecurity CTF',
    icon: Terminal,
    eventsCount: 3,
    totalPrize: '₹1,50,000',
    color: 'text-cyan-300',
    badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-400/30',
    borderColor: 'border-cyan-400/50',
    glowColor: 'shadow-[0_0_30px_rgba(6,182,212,0.25)]',
    status: 'active',
  },
  {
    code: 'ISE',
    name: 'Information Science',
    fullName: 'Information Science & Engineering',
    tagline: 'Predictive Intelligence, Big Data & Scalable Systems',
    icon: Cpu,
    eventsCount: 0,
    totalPrize: 'TBA',
    color: 'text-purple-300',
    badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-400/30',
    borderColor: 'border-purple-400/50',
    glowColor: 'shadow-[0_0_30px_rgba(168,85,247,0.25)]',
    status: 'upcoming',
  },
  {
    code: 'ECE',
    name: 'Electronics & Comm',
    fullName: 'Electronics & Communication Engineering',
    tagline: 'Semiconductors, Autonomous Robotics & Hardware Sprints',
    icon: Radio,
    eventsCount: 0,
    totalPrize: 'TBA',
    color: 'text-emerald-300',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/30',
    borderColor: 'border-emerald-400/50',
    glowColor: 'shadow-[0_0_30px_rgba(16,185,129,0.25)]',
    status: 'upcoming',
  },
  {
    code: 'EEE',
    name: 'Electrical & Electronics',
    fullName: 'Electrical & Electronics Engineering',
    tagline: 'Smart Power Grids, EV Powertrains & Renewable Energy',
    icon: Zap,
    eventsCount: 0,
    totalPrize: 'TBA',
    color: 'text-amber-300',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-400/30',
    borderColor: 'border-amber-400/50',
    glowColor: 'shadow-[0_0_30px_rgba(245,158,11,0.25)]',
    status: 'upcoming',
  },
];

export const EventsShowcase: React.FC<EventsShowcaseProps> = ({
  onOpenEventDetail,
  onOpenRegistration,
}) => {
  const { events, activeDeptFilter, setActiveDeptFilter } = useFest();
  const [searchQuery, setSearchQuery] = useState('');

  const currentSelectedDept = DEPARTMENTS_DATA.find(d => d.code === activeDeptFilter) || DEPARTMENTS_DATA[0];

  const handleSelectDepartment = (deptCode: DepartmentCode) => {
    soundEffects.arenaSwitch();
    setActiveDeptFilter(deptCode);
  };

  // Filter events based on active department and search query
  const displayedEvents = events.filter((ev) => {
    const matchesDept = activeDeptFilter === 'ALL' ? true : ev.dept === activeDeptFilter;
    const matchesSearch = 
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  const getStatusBadge = (status: FestEvent['status']) => {
    switch (status) {
      case 'Open':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Open</span>;
      case 'Filling Fast':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">Filling Fast</span>;
      case 'Closed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-red-500/10 text-red-400 border border-red-500/20">Closed</span>;
    }
  };

  return (
    <section 
      id="events" 
      className="relative py-16 sm:py-24 border-b border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-cyan-300 text-xs font-mono font-medium uppercase tracking-wider mb-4 backdrop-blur-xl">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Departments Grid</span>
          </div>
          
          <h2 className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight mb-3">
            Select an Engineering Department
          </h2>
          
          <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed">
            Click on any department card below to view its scheduled symposium competitions, prize pools, and registration guidelines.
          </p>
        </div>

        {/* ============================================================ */}
        {/* 1. THE DEPARTMENTS GRID (Click each to get its events) */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-12">
          {DEPARTMENTS_DATA.map((dept) => {
            const Icon = dept.icon;
            const isSelected = activeDeptFilter === dept.code || (activeDeptFilter === 'ALL' && dept.code === 'CSE');

            return (
              <button
                type="button"
                key={dept.code}
                id={`dept-grid-card-${dept.code.toLowerCase()}`}
                onClick={() => handleSelectDepartment(dept.code)}
                className={`relative p-5 sm:p-6 rounded-2xl text-left transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden border ${
                  isSelected 
                    ? `bg-white/[0.08] ${dept.borderColor} ${dept.glowColor} scale-[1.02] ring-2 ring-white/20` 
                    : 'bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.05]'
                }`}
              >
                {/* Active Department Corner Indicator */}
                {isSelected && (
                  <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                    <div className="absolute transform rotate-45 bg-cyan-400 text-slate-950 font-mono font-bold text-[9px] py-0.5 right-[-35px] top-[18px] w-[120px] text-center shadow-md">
                      SELECTED
                    </div>
                  </div>
                )}

                <div>
                  {/* Top Row: Icon + Event Count Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border border-white/10 ${
                        isSelected ? 'bg-white/10' : 'bg-white/[0.04]'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${dept.color}`} />
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border ${dept.badgeBg}`}>
                      {dept.eventsCount > 0 ? `${dept.eventsCount} Events` : '0 Events'}
                    </span>
                  </div>

                  {/* Department Code & Full Name */}
                  <div className="font-syncopate font-black text-xl sm:text-2xl text-white mb-1">
                    {dept.code}
                  </div>
                  <div className="text-xs font-mono font-medium text-slate-300 mb-2">
                    {dept.name}
                  </div>

                  {/* Subtitle / Tagline */}
                  <p className="text-[11px] font-mono text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {dept.tagline}
                  </p>
                </div>

                {/* Bottom Row: Prize & Action Label */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{dept.totalPrize}</span>
                  </div>
                  
                  <span className={`flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider ${
                    isSelected ? 'text-cyan-300' : 'text-slate-400 group-hover:text-white'
                  }`}>
                    <span>{isSelected ? 'Viewing' : 'View Events'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* 2. DYNAMIC EVENTS LISTING FOR THE SELECTED DEPARTMENT */}
        {/* ============================================================ */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white/[0.015] border border-white/10 backdrop-blur-2xl">
          
          {/* Active Department Banner Header & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                  Active Department View
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs font-mono text-slate-400">
                  {currentSelectedDept.fullName}
                </span>
              </div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-white">
                {currentSelectedDept.code} Competitions ({displayedEvents.length})
              </h3>
            </div>

            {/* Quick Keyword Filter */}
            {displayedEvents.length > 0 && (
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search CSE events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-slate-200 text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:bg-white/[0.07] transition-all font-mono"
                />
              </div>
            )}
          </div>

          {/* If events exist for this department (CSE) */}
          {displayedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedEvents.map((event) => {
                const fillRatio = Math.round((event.spotsFilled / event.spotsTotal) * 100);

                return (
                  <div
                    key={event.id}
                    id={`event-card-${event.id}`}
                    className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/50 hover:bg-white/[0.06] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border bg-cyan-500/10 text-cyan-300 border-cyan-400/30">
                            {event.dept}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.04] text-slate-400 border border-white/5">
                            {event.category}
                          </span>
                        </div>
                        {getStatusBadge(event.status)}
                      </div>

                      {/* Title & Subtitle */}
                      <h4 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-cyan-300 transition-colors leading-snug mb-1.5">
                        {event.title}
                      </h4>
                      
                      <p className="text-xs font-mono text-slate-400 mb-3 line-clamp-1">
                        {event.subtitle}
                      </p>

                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-5">
                        {event.shortDescription}
                      </p>

                      {/* Quick Meta Specs */}
                      <div className="grid grid-cols-2 gap-2 mb-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-mono">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">Prize: <strong className="text-white">{event.prizePool.total}</strong></span>
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{event.teamSize.min === event.teamSize.max ? `${event.teamSize.min} Mem` : `${event.teamSize.min}-${event.teamSize.max} Mems`}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-300 col-span-2">
                          <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span className="truncate text-slate-400">{event.venue}</span>
                        </div>
                      </div>

                      {/* Live Spots Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                          <span>Team Registration Cap</span>
                          <span className="text-cyan-300 font-semibold">{event.spotsFilled} / {event.spotsTotal} Teams</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              fillRatio > 80 ? 'bg-amber-400' : 'bg-cyan-400'
                            }`}
                            style={{ width: `${Math.min(100, fillRatio)}%` }}
                          />
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {event.tags.slice(0, 4).map((tag, i) => (
                          <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400 border border-white/5">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Action Buttons */}
                    <div className="pt-4 border-t border-white/[0.08] grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenEventDetail(event)}
                        id={`view-guidelines-${event.id}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 text-xs font-semibold tracking-wide border border-white/10 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Guidelines</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenRegistration(event)}
                        id={`register-btn-${event.id}`}
                        disabled={event.status === 'Closed'}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          event.status === 'Closed'
                            ? 'bg-white/[0.05] text-slate-500 border border-white/5 cursor-not-allowed'
                            : 'bg-white text-slate-950 hover:bg-cyan-300 shadow-[0_0_18px_rgba(255,255,255,0.2)] active:scale-98'
                        }`}
                      >
                        <span>{event.status === 'Closed' ? 'Closed' : 'Register'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty state for departments with 0 events (ISE, ECE, EEE as requested by user) */
            <div className="text-center py-16 px-4 rounded-2xl bg-white/[0.02] border border-white/10 max-w-2xl mx-auto my-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Calendar className="w-8 h-8 text-cyan-400" />
              </div>

              <h4 className="font-display font-bold text-lg sm:text-xl text-white mb-2">
                No Events Announced Yet for {currentSelectedDept.fullName}
              </h4>
              
              <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
                Competitions for {currentSelectedDept.code} are currently being finalized by the department coordinators. Please explore the active CSE hackathons and competitions!
              </p>

              <button
                type="button"
                onClick={() => handleSelectDepartment('CSE')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer active:scale-95"
              >
                <Terminal className="w-4 h-4" />
                <span>Explore CSE Events (3 Competitions)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

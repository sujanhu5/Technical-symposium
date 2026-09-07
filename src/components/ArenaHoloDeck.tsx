import React, { useState } from 'react';
import { 
  Terminal, 
  Cpu, 
  Radio, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Trophy, 
  Users, 
  MapPin, 
  ShieldCheck, 
  Activity, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFest } from '../context/FestContext';
import { DepartmentCode, FestEvent } from '../types';
import { soundEffects } from '../utils/soundEffects';

interface ArenaHoloDeckProps {
  onSelectEvent: (event: FestEvent) => void;
  onSelectDept: (dept: DepartmentCode) => void;
  onOpenRegister: (event: FestEvent) => void;
  onExploreTimeline: () => void;
}

export const ArenaHoloDeck: React.FC<ArenaHoloDeckProps> = ({
  onSelectEvent,
  onSelectDept,
  onOpenRegister,
  onExploreTimeline,
}) => {
  const { departments, events, activeDeptFilter, setActiveDeptFilter } = useFest();
  
  // Default to CSE if ALL is active, or use currently selected
  const activeCode: DepartmentCode = activeDeptFilter === 'ALL' ? 'CSE' : activeDeptFilter;
  const activeDept = departments.find((d) => d.code === activeCode) || departments[0];
  const deptEvents = events.filter((e) => e.dept === activeCode);

  const [hoveredNode, setHoveredNode] = useState<DepartmentCode | null>(null);

  const handleDeptSwitch = (code: DepartmentCode) => {
    soundEffects.arenaSwitch();
    setActiveDeptFilter(code);
    onSelectDept(code);
  };

  const getDeptIcon = (code: DepartmentCode, className = "w-5 h-5") => {
    switch (code) {
      case 'CSE': return <Terminal className={className} />;
      case 'ISE': return <Cpu className={className} />;
      case 'ECE': return <Radio className={className} />;
      case 'EEE': return <Zap className={className} />;
    }
  };

  const arenaMetadata: Record<DepartmentCode, {
    facility: string;
    techDomain: string;
    leadHOD: string;
    serverHub: string;
    powerState: string;
    badgeGlow: string;
  }> = {
    CSE: {
      facility: 'Turing Advanced Computing Pavilion (Level 3 & 4)',
      techDomain: 'Full-Stack Apps • Venture Pitching • Jeopardy CTF',
      leadHOD: 'Dr. Ramesh Kumar (Ph.D., IIT-M)',
      serverHub: 'GigaCluster Node #01 (10 Gbps dedicated)',
      powerState: 'OPTIMAL • 100% LIVE',
      badgeGlow: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40',
    },
    ISE: {
      facility: 'Ada Lovelace Neural & Cloud Data Lab (Level 2)',
      techDomain: 'Agentic GenAI • Kubernetes DevOps • Elite Algorithms',
      leadHOD: 'Dr. Sunita Rao (Ph.D., IISc)',
      serverHub: 'TensorFlow/PyTorch HPC Grid #04',
      powerState: 'OPTIMAL • 100% LIVE',
      badgeGlow: 'border-purple-500/40 text-purple-300 bg-purple-950/40',
    },
    ECE: {
      facility: 'Tesla Embedded Systems & Robotics Arena (Ground Arena)',
      techDomain: 'Autonomous Line/Maze Drones • Microcontroller Hardware',
      leadHOD: 'Dr. Anand Verma (Ph.D., NIT-K)',
      serverHub: 'Embedded Telemetry & RF Mesh',
      powerState: 'CALIBRATED • 100% READY',
      badgeGlow: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40',
    },
    EEE: {
      facility: 'Faraday High-Voltage & EV Powertrain Bay (South Wing)',
      techDomain: 'Clean EV Powertrains • Microgrid Simulation • BMS Systems',
      leadHOD: 'Dr. Meera Nambiar (Ph.D., IIT-B)',
      serverHub: 'Smart Inverter Realtime Bus #09',
      powerState: 'ENERGIZED • 100% READY',
      badgeGlow: 'border-amber-500/40 text-amber-300 bg-amber-950/40',
    },
  };

  const meta = arenaMetadata[activeCode];

  return (
    <section 
      id="arena-navigator" 
      className="relative w-full py-16 sm:py-24 bg-slate-950 border-b border-white/10 overflow-hidden"
    >
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 cyber-grid opacity-60 pointer-events-none" />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full blur-[140px] opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: activeDept.colorTheme.primary }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase mb-3 shadow-lg">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Campus Flight Deck</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            Graphical Arena Navigator
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Switch between the 4 engineering departments to explore live hardware arenas, inspect competition rules, and register your team.
          </p>
        </div>

        {/* Tactical Graphical Control Deck / Interactive Radar Hub */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10">
          {departments.map((dept) => {
            const isSelected = activeCode === dept.code;
            return (
              <button
                key={dept.code}
                id={`holo-node-${dept.code}`}
                onClick={() => handleDeptSwitch(dept.code)}
                onMouseEnter={() => {
                  setHoveredNode(dept.code);
                  soundEffects.hoverTick();
                }}
                onMouseLeave={() => setHoveredNode(null)}
                className={`group relative p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer overflow-hidden ${
                  isSelected 
                    ? `bg-slate-900 border-2 shadow-xl ${dept.colorTheme.glow}` 
                    : 'bg-slate-950/70 border-white/10 hover:border-white/20 hover:bg-slate-900/60'
                }`}
                style={{
                  borderColor: isSelected ? dept.colorTheme.primary : undefined,
                }}
              >
                {/* Active Indicator Top Glow bar */}
                {isSelected && (
                  <motion.div 
                    layoutId="holoActiveIndicator"
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: dept.colorTheme.primary }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <div className="flex items-center justify-between mb-2">
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 transition-transform group-hover:scale-110"
                    style={{ 
                      color: dept.colorTheme.primary,
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.06)' : 'transparent'
                    }}
                  >
                    {getDeptIcon(dept.code)}
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${dept.colorTheme.badge}`}>
                    {dept.stats.eventsCount} {dept.stats.eventsCount === 1 ? 'Arena' : 'Arenas'}
                  </span>
                </div>

                <div className="font-display font-bold text-base text-white group-hover:text-cyan-200 transition-colors">
                  {dept.code}
                </div>
                <div className="text-[11px] font-mono text-slate-400 truncate">
                  {dept.tagline}
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Pool</span>
                  <span className="font-bold text-slate-200">{dept.stats.totalPrize}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Holographic Arena Showcase for Active Department */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCode}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl bg-slate-900/90 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
          >
            {/* Top Tactical Status Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-white/10 gap-4">
              <div className="flex items-start sm:items-center gap-4">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/20 shrink-0 shadow-lg"
                  style={{ 
                    backgroundColor: `${activeDept.colorTheme.primary}15`,
                    color: activeDept.colorTheme.primary,
                    borderColor: `${activeDept.colorTheme.primary}40`
                  }}
                >
                  {getDeptIcon(activeCode, "w-7 h-7")}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                      {activeDept.name}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${meta.badgeGlow}`}>
                      {activeDept.code} WING
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-mono text-slate-400 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{meta.facility}</span>
                  </p>
                </div>
              </div>

              {/* Department Vital Stats */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <div>
                    <div className="text-[10px] text-slate-500">SYSTEM STATUS</div>
                    <div className="text-emerald-400 font-bold">{meta.powerState}</div>
                  </div>
                </div>

                <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="text-[10px] text-slate-500">DEPARTMENT PRIZE</div>
                    <div className="text-white font-bold">{activeDept.stats.totalPrize}</div>
                  </div>
                </div>

                <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="text-[10px] text-slate-500">EST. PARTICIPANTS</div>
                    <div className="text-cyan-300 font-bold">{activeDept.stats.estParticipants}+ Students</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Tech Focus Callout */}
            <div className="my-6 px-4 py-3 rounded-xl bg-slate-950/50 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="font-mono font-bold text-cyan-400 uppercase tracking-wider">Focus Areas:</span>
                <span>{meta.techDomain}</span>
              </div>
              <div className="font-mono text-slate-400 text-[11px]">
                Faculty Lead: <span className="text-slate-200">{activeDept.facultyCoordinator}</span>
              </div>
            </div>

            {/* Department Competitions Showcase Cards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <span>{activeDept.code} Flagship Competitions</span>
                  <span className="text-xs font-mono font-normal text-slate-400">
                    ({deptEvents.length} {deptEvents.length === 1 ? 'Official Event' : 'Official Events'})
                  </span>
                </h4>
                <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                  Click event to inspect rounds & rules
                </span>
              </div>

              <div className={`grid gap-4 ${deptEvents.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
                {deptEvents.map((event) => (
                  <div
                    key={event.id}
                    id={`holo-event-card-${event.id}`}
                    className="group relative flex flex-col justify-between p-5 rounded-2xl bg-slate-950/90 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] flex-1"
                  >
                    <div>
                      {/* Event Category & Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-800 text-cyan-300 border border-cyan-500/30">
                          {event.category}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-amber-300 flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5 text-amber-400" />
                          {event.prizePool.total}
                        </span>
                      </div>

                      {/* Event Title */}
                      <h5 className="font-display font-black text-lg text-white group-hover:text-cyan-300 transition-colors mb-1">
                        {event.title}
                      </h5>
                      <p className="text-xs font-mono text-slate-400 mb-3 line-clamp-1">
                        {event.subtitle}
                      </p>

                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                        {event.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 space-y-3">
                      {/* Meta chips */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-cyan-400" />
                          <span>{event.teamSize.min}-{event.teamSize.max} Per Team</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-purple-400" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => {
                            soundEffects.navClick();
                            onSelectEvent(event);
                          }}
                          id={`holo-details-btn-${event.id}`}
                          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/15 text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-1"
                        >
                          <span>Rules</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => {
                            soundEffects.navClick();
                            onOpenRegister(event);
                          }}
                          id={`holo-reg-btn-${event.id}`}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold font-mono transition-transform hover:scale-102 flex items-center justify-center gap-1 shadow-md"
                        >
                          <span>Register</span>
                          <ArrowRight className="w-3 h-3 text-slate-950" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Quick Link to Silver Jubilee Legacy */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="text-xs font-mono text-slate-300">
                  Part of the <strong className="text-amber-300">25th Silver Jubilee Grand Anniversary Celebrations</strong> (1999–2026)
                </span>
              </div>

              <button
                onClick={() => {
                  soundEffects.navClick();
                  onExploreTimeline();
                }}
                className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300 hover:text-amber-200 transition-colors"
              >
                <span>Explore 25-Year College Journey</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

import React from 'react';
import { 
  Terminal, 
  Cpu, 
  Radio, 
  Zap, 
  ArrowRight, 
  Trophy, 
  Users, 
  Sparkles,
  Layers
} from 'lucide-react';
import { useFest } from '../context/FestContext';
import { DepartmentCode } from '../types';

interface DepartmentSectionProps {
  onSelectDepartment: (dept: DepartmentCode) => void;
}

export const DepartmentSection: React.FC<DepartmentSectionProps> = ({ onSelectDepartment }) => {
  const { departments, activeDeptFilter, setActiveDeptFilter } = useFest();

  const getDeptIcon = (code: DepartmentCode) => {
    switch (code) {
      case 'CSE': return <Terminal className="w-6 h-6" />;
      case 'ISE': return <Cpu className="w-6 h-6" />;
      case 'ECE': return <Radio className="w-6 h-6" />;
      case 'EEE': return <Zap className="w-6 h-6" />;
    }
  };

  const handleCardClick = (code: DepartmentCode) => {
    setActiveDeptFilter(code);
    onSelectDepartment(code);
  };

  return (
    <section 
      id="departments" 
      className="relative py-20 bg-slate-950/90 border-b border-white/10 cyber-grid"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Four Engineering Arenas
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              Interactive Department Showcase
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Click any department card to filter competitions, review specialized technical domains, and meet faculty leads.
            </p>
          </div>

          {/* Quick Filter Pill Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-white/10">
            <button
              onClick={() => setActiveDeptFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeDeptFilter === 'ALL'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All (8 Events)
            </button>
            {departments.map((d) => (
              <button
                key={d.code}
                onClick={() => setActiveDeptFilter(d.code)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  activeDeptFilter === d.code
                    ? 'bg-slate-800 text-white border border-white/20 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {d.code} ({d.stats.eventsCount})
              </button>
            ))}
          </div>
        </div>

        {/* 4 Interactive Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {departments.map((dept) => {
            const isSelected = activeDeptFilter === dept.code;
            return (
              <div
                key={dept.code}
                id={`dept-card-${dept.code}`}
                onClick={() => handleCardClick(dept.code)}
                className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b ${dept.colorTheme.bg} border ${dept.colorTheme.border} transition-all duration-300 hover:-translate-y-1.5 hover:${dept.colorTheme.glow} cursor-pointer shadow-xl ${
                  isSelected ? 'ring-2 ring-cyan-400 scale-102' : ''
                }`}
              >
                {/* Ambient Top Glow Line */}
                <div 
                  className="absolute top-0 left-6 right-6 h-[2px] rounded-full transition-all duration-500"
                  style={{ backgroundColor: dept.colorTheme.primary }}
                />

                {/* Card Header: Icon & Dept Code */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900/90 border border-white/15 transition-transform group-hover:scale-110"
                      style={{ color: dept.colorTheme.primary }}
                    >
                      {getDeptIcon(dept.code)}
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="font-display font-black text-2xl text-white tracking-wide">
                        {dept.code}
                      </span>
                      <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${dept.colorTheme.badge}`}>
                        {dept.stats.eventsCount} {dept.stats.eventsCount === 1 ? 'Event' : 'Events'}
                      </span>
                    </div>
                  </div>

                  {/* Dept Title & Tagline */}
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-cyan-200 transition-colors mb-1">
                    {dept.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-300 mb-3 line-clamp-1">
                    {dept.tagline}
                  </p>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                    {dept.description}
                  </p>
                </div>

                {/* Card Footer: Prize, Est Participants, CTA */}
                <div className="pt-4 border-t border-white/10 mt-2 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      Prize Pool
                    </span>
                    <span className="font-bold text-white">{dept.stats.totalPrize}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      Expected
                    </span>
                    <span className="text-slate-300">{dept.stats.estParticipants}+ Students</span>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-xs font-bold text-cyan-300 group-hover:translate-x-1 transition-transform">
                    <span>Explore Competitions</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Visual Corner Indicator */}
                <div 
                  className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: dept.colorTheme.primary }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

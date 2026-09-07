import React, { useState } from 'react';
import { 
  Sparkles, 
  Award, 
  Building2, 
  Rocket, 
  Bot, 
  Trophy, 
  CheckCircle2, 
  GraduationCap, 
  Globe2, 
  FileCheck,
  ChevronDown
} from 'lucide-react';
import { SILVER_JUBILEE_MILESTONES } from '../data/mockData';

export const SilverJubileeTimeline: React.FC = () => {
  const [selectedMilestone, setSelectedMilestone] = useState<number>(5); // Default to Jubilee year

  const getMilestoneIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return <Building2 className="w-5 h-5" />;
      case 'Award': return <Award className="w-5 h-5" />;
      case 'Rocket': return <Rocket className="w-5 h-5" />;
      case 'Bot': return <Bot className="w-5 h-5" />;
      case 'Trophy': return <Trophy className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      default: return <GraduationCap className="w-5 h-5" />;
    }
  };

  const jubileeStats = [
    { label: 'Engineering Legacy', val: '25 Years', detail: 'Founded in 1999' },
    { label: 'Global Alumni', val: '25,000+', detail: 'Across 42 Countries' },
    { label: 'Patents & Papers', val: '150+', detail: 'Tier-1 Peer Reviewed' },
    { label: 'Startup Grants', val: '₹25,00,000', detail: 'Student Innovation Fund' },
  ];

  return (
    <section 
      id="anniversary" 
      className="relative py-24 border-b border-white/[0.08] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-cyan-300 text-xs font-mono font-medium tracking-widest uppercase mb-4 backdrop-blur-xl">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            1999 — 2026: Silver Jubilee
          </div>
          
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight mb-4">
            Celebrating 25 Years of Excellence
          </h2>
          
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            From visionary beginnings to becoming a premier technology and research institute. Honoring a quarter-century of engineering leadership and innovation.
          </p>
        </div>

        {/* High-Impact Numbers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-16">
          {jubileeStats.map((st, i) => (
            <div 
              key={i}
              className="relative p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-cyan-400/40 hover:bg-white/[0.05] backdrop-blur-2xl transition-all duration-300 group shadow-lg"
            >
              <div className="text-[11px] font-mono font-medium uppercase tracking-wider text-slate-400 mb-1">
                {st.label}
              </div>
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-white group-hover:text-cyan-300 transition-colors">
                {st.val}
              </div>
              <div className="mt-2 text-xs text-slate-400 font-medium">
                {st.detail}
              </div>
              <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-cyan-400/50 group-hover:bg-cyan-300 transition-colors" />
            </div>
          ))}
        </div>

        {/* Modern Stepper Timeline */}
        <div className="relative mb-10">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4 relative z-10">
            {SILVER_JUBILEE_MILESTONES.map((milestone, index) => {
              const isSelected = selectedMilestone === index;
              return (
                <button
                  key={milestone.year}
                  onClick={() => setSelectedMilestone(index)}
                  className={`flex flex-col items-center text-center p-3.5 sm:p-4 rounded-2xl transition-all duration-300 cursor-pointer backdrop-blur-xl ${
                    isSelected
                      ? 'bg-white/[0.08] border border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.2)] scale-102'
                      : 'bg-white/[0.02] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl mb-2.5 transition-all ${
                    isSelected
                      ? 'bg-cyan-400 text-slate-950 font-bold'
                      : 'bg-white/[0.05] text-slate-300 border border-white/10'
                  }`}>
                    {getMilestoneIcon(milestone.iconName)}
                  </div>

                  <span className="font-display font-bold text-base sm:text-lg text-white">
                    {milestone.year}
                  </span>

                  <span className={`text-[11px] font-mono truncate max-w-full ${
                    isSelected ? 'text-cyan-300 font-medium' : 'text-slate-400'
                  }`}>
                    {milestone.phase}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Milestone Spotlight Detail Card */}
        {selectedMilestone !== null && (
          <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-2xl shadow-xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    {SILVER_JUBILEE_MILESTONES[selectedMilestone].year} Milestone
                  </span>
                  <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
                    {SILVER_JUBILEE_MILESTONES[selectedMilestone].phase}
                  </span>
                </div>

                <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                  {SILVER_JUBILEE_MILESTONES[selectedMilestone].title}
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {SILVER_JUBILEE_MILESTONES[selectedMilestone].description}
                </p>

                <div className="flex items-center gap-2 pt-2 text-cyan-300 text-xs sm:text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Key Achievement: {SILVER_JUBILEE_MILESTONES[selectedMilestone].highlight}</span>
                </div>
              </div>

              {/* Stats & Badge Box */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col items-center justify-center text-center min-w-[220px]">
                <div className="p-3 rounded-full bg-cyan-500/10 text-cyan-400 mb-2">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-1">Impact Metric</div>
                <div className="font-display font-bold text-lg text-white">
                  {SILVER_JUBILEE_MILESTONES[selectedMilestone].stats}
                </div>
                <div className="mt-2 text-[10px] text-slate-400 font-mono">
                  Official Institutional Milestone
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

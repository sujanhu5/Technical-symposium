import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Award 
} from 'lucide-react';
import { useFest } from '../context/FestContext';

interface FooterProps {
  onOpenAdmin: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onNavigate }) => {
  const { departments } = useFest();

  return (
    <footer className="w-full border-t border-white/[0.08] text-slate-400 text-xs">
      {/* 25th Anniversary Banner */}
      <div className="bg-white/[0.02] backdrop-blur-xl border-b border-white/[0.08] py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <img 
              src="/sjbit-logo.png" 
              alt="SJBIT Logo" 
              className="w-12 h-12 object-contain select-none filter drop-shadow-[0_2px_8px_rgba(235,102,43,0.3)] shrink-0"
            />
            <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex flex-col items-center justify-center shrink-0">
              <span className="font-display font-black text-lg text-white">25</span>
              <span className="text-[8px] font-mono font-bold text-amber-400 uppercase">YEARS</span>
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-white">
                Technical Symposium 2K26 • 25th Anniversary Edition
              </h4>
              <p className="text-xs text-slate-400">
                2001 — 2026: SJB Institute of Technology • Bengaluru, Karnataka
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('events')}
              className="px-5 py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              Register Team
            </button>
            <button
              onClick={onOpenAdmin}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
            >
              Coordinator Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Col 1: College & Fest Bio */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img 
              src="/sjbit-logo.png" 
              alt="SJBIT Logo" 
              className="w-10 h-10 object-contain drop-shadow-[0_2px_8px_rgba(235,102,43,0.35)]" 
            />
            <div>
              <div className="font-display font-black text-sm text-white tracking-wide">
                TECHNICAL SYMPOSIUM <span className="text-cyan-300">2K26</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                SJB Institute of Technology • 25th Silver Jubilee
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
            Inter-collegiate national technical symposium celebrating 25 years of engineering excellence, student innovation, and research breakthroughs.
          </p>
          <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400">
            <Award className="w-3.5 h-3.5" />
            <span>NAAC 'A+' Accredited Autonomous Institution • Approved by AICTE</span>
          </div>
        </div>

        {/* Col 2: Campus Contact & Venue */}
        <div className="space-y-3 md:pl-8 md:border-l md:border-white/[0.08]">
          <h5 className="font-display font-bold text-xs text-white uppercase tracking-wider">
            Symposium Venue & Contact
          </h5>
          <div className="space-y-2.5 font-mono text-xs text-slate-400">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">SJB Institute of Technology, BGS Health & Education City, Dr. Vishnuvardhan Road, Kengeri, Bengaluru 560060</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>symposium2k26@sjbit.edu.in</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>https://sjbit.edu.in</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Security Strip */}
      <div className="border-t border-white/[0.06] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px] font-mono">
          <div>
            © 2026 Technical Symposium • SJB Institute of Technology. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>25th Silver Jubilee Commemoration</span>
            <span>•</span>
            <button 
              onClick={onOpenAdmin}
              className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Faculty & Student Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

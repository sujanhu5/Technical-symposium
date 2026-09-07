import React from 'react';
import { 
  X, 
  Trophy, 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Mail, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { FestEvent } from '../types';

interface EventDetailModalProps {
  event: FestEvent | null;
  onClose: () => void;
  onOpenRegister: (event: FestEvent) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onOpenRegister,
}) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-slate-100 p-6 sm:p-8"
        id="event-detail-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          id="close-event-detail-btn"
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pr-10 mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              Department of {event.dept}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-mono bg-slate-800 text-slate-300 border border-white/10">
              {event.code}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-mono bg-purple-500/15 text-purple-400 border border-purple-500/30">
              {event.category}
            </span>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-4xl text-white leading-tight">
            {event.title}
          </h2>
          <p className="text-sm font-mono text-cyan-300 mt-1">
            {event.subtitle}
          </p>
        </div>

        {/* Prize Pool Spotlight */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-cyan-950/40 border border-amber-500/30 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2">
            <Trophy className="w-4 h-4" />
            <span>25th Silver Jubilee Prize Pool: {event.prizePool.total}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
              <span className="block text-slate-400 text-[10px]">1st Place</span>
              <strong className="text-amber-300 font-display text-sm sm:text-base">{event.prizePool.first}</strong>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
              <span className="block text-slate-400 text-[10px]">2nd Place</span>
              <strong className="text-slate-200 font-display text-sm sm:text-base">{event.prizePool.second}</strong>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
              <span className="block text-slate-400 text-[10px]">3rd Place</span>
              <strong className="text-amber-500 font-display text-sm sm:text-base">{event.prizePool.third}</strong>
            </div>
          </div>
        </div>

        {/* Schedule & Venue Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-white/10 text-xs font-mono mb-6">
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-purple-400 shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Full Overview Description */}
        <div className="space-y-2 mb-6">
          <h3 className="font-display font-bold text-base text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Event Overview & Challenge Scope
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {event.fullDescription}
          </p>
        </div>

        {/* Competition Rounds */}
        <div className="space-y-3 mb-6">
          <h3 className="font-display font-bold text-base text-white">
            Rounds & Evaluation Structure
          </h3>
          <div className="space-y-2.5">
            {event.rounds.map((round) => (
              <div 
                key={round.number} 
                className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300">
                      Round {round.number}
                    </span>
                    <strong className="text-xs sm:text-sm text-white">{round.name}</strong>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{round.description}</p>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300 shrink-0">
                  <span className="px-2 py-1 rounded bg-slate-900 border border-white/5">{round.mode}</span>
                  <span className="text-cyan-400 font-semibold">{round.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Participant Guidelines & Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Rules */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
            <h4 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Guidelines & Rules
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
              {event.rules.map((rule, idx) => (
                <li key={idx} className="leading-relaxed">{rule}</li>
              ))}
            </ul>
          </div>

          {/* Eligibility */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
            <h4 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Eligibility & Team Size
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
              <li>Team Size: {event.teamSize.min} to {event.teamSize.max} participants.</li>
              {event.eligibility.map((item, idx) => (
                <li key={idx} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Coordinator Contacts */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 mb-6">
          <h4 className="font-display font-bold text-sm text-white mb-3">
            Department Coordinators
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {event.coordinators.map((c, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-200">{c.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{c.role}</div>
                </div>
                <div className="flex items-center gap-2">
                  <a 
                    href={`tel:${c.phone}`} 
                    className="p-1.5 rounded bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-400 transition-colors"
                    title={c.phone}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a 
                    href={`mailto:${c.email}`} 
                    className="p-1.5 rounded bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-400 transition-colors"
                    title={c.email}
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
          <div className="text-xs font-mono text-slate-400">
            {event.spotsFilled} of {event.spotsTotal} spots filled
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenRegister(event);
              }}
              id="modal-register-now-btn"
              disabled={event.status === 'Closed'}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                event.status === 'Closed'
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
              }`}
            >
              <span>{event.status === 'Closed' ? 'Registration Closed' : 'Register for this Event'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

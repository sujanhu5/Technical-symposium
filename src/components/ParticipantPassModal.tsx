import React from 'react';
import { 
  X, 
  QrCode, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Download, 
  Printer, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { RegistrationRecord } from '../types';

interface ParticipantPassModalProps {
  registration: RegistrationRecord | null;
  onClose: () => void;
}

export const ParticipantPassModal: React.FC<ParticipantPassModalProps> = ({
  registration,
  onClose,
}) => {
  if (!registration) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-slate-100 p-6 sm:p-8"
        id="participant-pass-modal"
      >
        <button
          onClick={onClose}
          aria-label="Close pass modal"
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pass Card Container for Print / View */}
        <div className="border border-white/15 rounded-2xl p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl relative overflow-hidden">
          {/* Top Pass Hologram Stripe */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400" />

          {/* Pass Header */}
          <div className="flex items-start justify-between gap-3 mb-6 pt-2">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                25th Silver Jubilee Official Pass
              </div>
              <h3 className="font-display font-black text-xl text-white">
                SILVER TECHNOVA '26
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Department of {registration.dept}
              </p>
            </div>

            <div className="flex flex-col items-end">
              <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                {registration.id}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            </div>
          </div>

          {/* Event Title */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 mb-5">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">COMPETITION</span>
            <div className="font-display font-bold text-base text-cyan-300">
              {registration.eventTitle}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono mb-5">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Team Name</span>
              <span className="font-bold text-white text-sm">{registration.teamName}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Team Leader</span>
              <span className="font-bold text-white text-sm">{registration.leader.name}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Leader USN</span>
              <span className="font-bold text-slate-300">{registration.leader.usn}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block uppercase">College</span>
              <span className="font-bold text-slate-300 truncate block">{registration.leader.college}</span>
            </div>
          </div>

          {/* Team Members List if any */}
          {registration.members && registration.members.length > 0 && (
            <div className="mb-5 p-3 rounded-xl bg-slate-950/60 border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">
                Teammates ({registration.members.length})
              </span>
              <div className="space-y-1 text-xs font-mono text-slate-300">
                {registration.members.map((m, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <span>{m.name}</span>
                    <span className="text-slate-400">{m.usn}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QR & Barcode Section */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-white/10">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">SECURITY VERIFICATION</span>
              <div className="text-[11px] font-mono text-slate-300">
                Present this QR at the registration desk for instant badge wristband check-in.
              </div>
              <div className="text-[10px] font-mono text-amber-400 font-semibold pt-1">
                Status: {registration.status.toUpperCase()}
              </div>
            </div>

            <div className="p-2 rounded-lg bg-white shrink-0">
              <QrCode className="w-16 h-16 text-slate-950" />
            </div>
          </div>
        </div>

        {/* Pass Actions */}
        <div className="flex items-center justify-between gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Dismiss
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Print Pass / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

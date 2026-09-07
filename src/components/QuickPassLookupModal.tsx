import React, { useState } from 'react';
import { Ticket, Search, X, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useFest } from '../context/FestContext';
import { RegistrationRecord } from '../types';
import { soundEffects } from '../utils/soundEffects';

interface QuickPassLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewPass: (record: RegistrationRecord) => void;
}

export const QuickPassLookupModal: React.FC<QuickPassLookupModalProps> = ({
  isOpen,
  onClose,
  onViewPass,
}) => {
  const { registrations } = useFest();
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const clean = query.trim().toLowerCase();

    if (!clean) {
      setError('Please enter a Registration ID or Leader Email');
      return;
    }

    const found = registrations.find(
      (r) => 
        r.id.toLowerCase() === clean || 
        r.leader.email.toLowerCase() === clean ||
        r.teamName.toLowerCase().includes(clean)
    );

    if (found) {
      soundEffects.success();
      onViewPass(found);
      onClose();
    } else {
      setError(`No pass found for "${query}". Try sample ID "${registrations[0]?.id || 'TN25-CSE-APP-4921'}" or your registered email.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        className="w-full max-w-md rounded-2xl bg-slate-900 border border-cyan-500/40 p-6 shadow-2xl relative text-slate-100"
        id="pass-lookup-card"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-black text-xl text-white">
              Lookup Digital Pass
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Silver TechNova '26 Official Entry Badge
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
              Registration ID or Leader Email
            </label>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. TN25-CSE-APP-4921 or leader@college.edu"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 font-mono text-sm"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-red-300 text-xs font-mono flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>Retrieve Digital Pass</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick sample badge hint */}
        <div className="mt-4 pt-4 border-t border-white/10 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>Recent demo pass:</span>
          <button
            type="button"
            onClick={() => {
              if (registrations[0]) {
                onViewPass(registrations[0]);
                onClose();
              }
            }}
            className="text-cyan-300 hover:underline cursor-pointer"
          >
            {registrations[0]?.id || 'TN25-CSE-APP-4921'}
          </button>
        </div>
      </div>
    </div>
  );
};

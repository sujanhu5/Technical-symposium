import React from 'react';
import { Mail, Phone, CheckCircle2, Radio } from 'lucide-react';
import { useFest } from '../context/FestContext';

export const LiveUpdatesSection: React.FC = () => {
  const { notifications } = useFest();

  return (
    <section 
      id="updates" 
      className="py-20 border-b border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-purple-300 text-xs font-mono font-medium uppercase tracking-wider mb-3 backdrop-blur-xl">
              <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              Live Broadcast Dispatch
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
              Participant Announcements
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Real-time feed of automated notices and room schedules for all departments.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Automated Gateway Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {notifications.slice(0, 3).map((notif) => (
            <div 
              key={notif.id}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-purple-500/40 hover:bg-white/[0.05] backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {notif.targetDept === 'ALL' ? 'All Arenas' : `Dept: ${notif.targetDept}`}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {notif.status}
                  </span>
                </div>

                <h3 className="font-display font-bold text-sm text-white mb-2 line-clamp-1">
                  {notif.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                  {notif.message}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  {notif.channel === 'BOTH' ? (
                    <>
                      <Mail className="w-3 h-3 text-cyan-400" />
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <span>Email & SMS</span>
                    </>
                  ) : notif.channel === 'EMAIL' ? (
                    <>
                      <Mail className="w-3 h-3 text-cyan-400" />
                      <span>Email</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <span>SMS</span>
                    </>
                  )}
                </span>
                <span>{new Date(notif.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

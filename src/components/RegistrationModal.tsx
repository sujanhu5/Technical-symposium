import React, { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  UserPlus, 
  Trash2, 
  Mail, 
  Phone, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Sparkles, 
  QrCode, 
  ArrowRight, 
  ArrowLeft,
  Download,
  Building,
  ShieldCheck,
  Ticket
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FestEvent, TeamMember, RegistrationRecord } from '../types';
import { useFest } from '../context/FestContext';

interface RegistrationModalProps {
  event: FestEvent | null;
  onClose: () => void;
  onViewPass: (reg: RegistrationRecord) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  onClose,
  onViewPass,
}) => {
  const { registerTeam } = useFest();

  if (!event) return null;

  const [step, setStep] = useState<'DETAILS' | 'MEMBERS' | 'VERIFY' | 'SUCCESS'>('DETAILS');

  // Form State
  const [teamName, setTeamName] = useState('');
  const [leader, setLeader] = useState({
    name: '',
    email: '',
    phone: '',
    usn: '',
    college: '',
    semester: '6th Sem',
  });

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Verification state
  const [generatedCode, setGeneratedCode] = useState('742819');
  const [inputCode, setInputCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(45);

  // Success result
  const [confirmedRegistration, setConfirmedRegistration] = useState<RegistrationRecord | null>(null);

  // Countdown for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'VERIFY' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleAddMember = () => {
    // Current count includes leader (1) + members
    const currentTotal = 1 + members.length;
    if (currentTotal < event.teamSize.max) {
      setMembers([
        ...members,
        { name: '', email: '', phone: '', usn: '', semester: '6th Sem' },
      ]);
    }
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, val: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: val };
    setMembers(updated);
  };

  const validateStep1 = () => {
    const errs: { [key: string]: string } = {};
    if (!teamName.trim()) errs.teamName = 'Team name is required';
    if (!leader.name.trim()) errs.leaderName = 'Team leader name is required';
    if (!leader.email.trim() || !leader.email.includes('@')) errs.leaderEmail = 'Valid email is required';
    if (!leader.phone.trim() || leader.phone.length < 10) errs.leaderPhone = '10-digit phone number is required';
    if (!leader.usn.trim()) errs.leaderUsn = 'USN or College Roll No is required';
    if (!leader.college.trim()) errs.leaderCollege = 'College name is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: { [key: string]: string } = {};
    const totalMembers = 1 + members.length;

    if (totalMembers < event.teamSize.min) {
      errs.teamCount = `This competition requires minimum ${event.teamSize.min} participants (including leader). Please add ${event.teamSize.min - totalMembers} more member(s).`;
    }

    members.forEach((m, idx) => {
      if (!m.name.trim()) errs[`member_${idx}_name`] = `Member ${idx + 1} name is required`;
      if (!m.email.trim() || !m.email.includes('@')) errs[`member_${idx}_email`] = `Valid email required`;
      if (!m.usn.trim()) errs[`member_${idx}_usn`] = `USN required`;
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToMembers = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      if (event.teamSize.max === 1) {
        // Solo event: directly go to verification
        triggerSendCode();
        setStep('VERIFY');
      } else {
        setStep('MEMBERS');
      }
    }
  };

  const handleProceedToVerify = () => {
    if (validateStep2()) {
      triggerSendCode();
      setStep('VERIFY');
    }
  };

  const triggerSendCode = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedCode(code);
    setInputCode('');
    setResendTimer(45);
    setVerifiedSuccess(false);
  };

  const handleVerifyAndSubmit = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // Verify code (accept exact code or any 6 digit test code for smooth previewing)
      if (inputCode.trim() === generatedCode || inputCode.trim() === '123456' || inputCode.length === 6) {
        setVerifiedSuccess(true);
        
        // Execute registration in context
        const newRecord = registerTeam({
          eventId: event.id,
          teamName,
          leader,
          members,
        });

        setConfirmedRegistration(newRecord);
        setStep('SUCCESS');

        // Confetti Celebration
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#a855f7', '#10b981', '#f59e0b'],
          });
        } catch (e) {
          console.error(e);
        }
      } else {
        setErrors({ code: 'Invalid verification code. Please check your simulated code or click "Auto-fill".' });
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-slate-100 p-6 sm:p-8"
        id="registration-modal-card"
      >
        {/* Close Button */}
        {step !== 'SUCCESS' && (
          <button
            onClick={onClose}
            aria-label="Close registration modal"
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="pr-8 mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              {event.dept} • {event.code}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Team Size: {event.teamSize.min === event.teamSize.max ? `${event.teamSize.min}` : `${event.teamSize.min}-${event.teamSize.max}`}
            </span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
            Register: {event.title}
          </h2>
        </div>

        {/* Stepper Progress Indicator */}
        {step !== 'SUCCESS' && (
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-2">
              <span className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-mono font-bold ${
                step === 'DETAILS' ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                1
              </span>
              <span className="text-xs font-mono hidden sm:inline text-slate-300">Team & Leader</span>
            </div>

            <div className="h-0.5 flex-1 mx-2 bg-slate-800" />

            {event.teamSize.max > 1 && (
              <>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-mono font-bold ${
                    step === 'MEMBERS' ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    2
                  </span>
                  <span className="text-xs font-mono hidden sm:inline text-slate-300">Teammates</span>
                </div>
                <div className="h-0.5 flex-1 mx-2 bg-slate-800" />
              </>
            )}

            <div className="flex items-center gap-2">
              <span className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-mono font-bold ${
                step === 'VERIFY' ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {event.teamSize.max > 1 ? 3 : 2}
              </span>
              <span className="text-xs font-mono hidden sm:inline text-slate-300">Email Verification</span>
            </div>
          </div>
        )}

        {/* STEP 1: TEAM & LEADER DETAILS */}
        {step === 'DETAILS' && (
          <form onSubmit={handleProceedToMembers} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                Team Name <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. CyberKnights, ByteSurge, AlphaCoders"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 transition-colors font-mono"
              />
              {errors.teamName && <p className="text-xs text-red-400 mt-1">{errors.teamName}</p>}
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-3">
              <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Team Leader / Primary Participant
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Leader Full Name *</label>
                  <input
                    type="text"
                    value={leader.name}
                    onChange={(e) => setLeader({ ...leader, name: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/15 text-slate-100 text-xs focus:outline-none focus:border-cyan-400"
                  />
                  {errors.leaderName && <p className="text-[11px] text-red-400 mt-0.5">{errors.leaderName}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Leader Email (For Verification) *</label>
                  <input
                    type="email"
                    value={leader.email}
                    onChange={(e) => setLeader({ ...leader, email: e.target.value })}
                    placeholder="aarav@gmail.com"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/15 text-slate-100 text-xs focus:outline-none focus:border-cyan-400"
                  />
                  {errors.leaderEmail && <p className="text-[11px] text-red-400 mt-0.5">{errors.leaderEmail}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">WhatsApp / SMS Phone No *</label>
                  <input
                    type="tel"
                    value={leader.phone}
                    onChange={(e) => setLeader({ ...leader, phone: e.target.value })}
                    placeholder="+91 98451 22345"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/15 text-slate-100 text-xs focus:outline-none focus:border-cyan-400"
                  />
                  {errors.leaderPhone && <p className="text-[11px] text-red-400 mt-0.5">{errors.leaderPhone}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">College USN / Student ID *</label>
                  <input
                    type="text"
                    value={leader.usn}
                    onChange={(e) => setLeader({ ...leader, usn: e.target.value })}
                    placeholder="1MS22CS042"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/15 text-slate-100 text-xs focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  {errors.leaderUsn && <p className="text-[11px] text-red-400 mt-0.5">{errors.leaderUsn}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">College / University Name *</label>
                  <input
                    type="text"
                    value={leader.college}
                    onChange={(e) => setLeader({ ...leader, college: e.target.value })}
                    placeholder="e.g. MSRIT Bangalore"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/15 text-slate-100 text-xs focus:outline-none focus:border-cyan-400"
                  />
                  {errors.leaderCollege && <p className="text-[11px] text-red-400 mt-0.5">{errors.leaderCollege}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Semester</label>
                  <select
                    value={leader.semester}
                    onChange={(e) => setLeader({ ...leader, semester: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/15 text-slate-100 text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option>2nd Sem</option>
                    <option>4th Sem</option>
                    <option>6th Sem</option>
                    <option>8th Sem</option>
                    <option>Postgraduate / Alumni</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                id="details-continue-btn"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
              >
                <span>{event.teamSize.max > 1 ? 'Next: Add Teammates' : 'Next: Email Verification'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: DYNAMIC TEAM MEMBERS */}
        {step === 'MEMBERS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  Team Members ({1 + members.length} / {event.teamSize.max})
                </h3>
                <p className="text-xs text-slate-400">
                  Minimum required: {event.teamSize.min} total (Leader + {event.teamSize.min - 1} members).
                </p>
              </div>

              {1 + members.length < event.teamSize.max && (
                <button
                  type="button"
                  onClick={handleAddMember}
                  id="add-member-btn"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-medium border border-cyan-500/30 transition-colors cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
              )}
            </div>

            {errors.teamCount && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.teamCount}</span>
              </div>
            )}

            {/* Teammate Form Blocks */}
            <div className="space-y-3">
              {members.map((member, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-300">
                      Member #{idx + 2}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(idx)}
                      className="p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                      title="Remove member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                        placeholder="e.g. Diya Patel"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-slate-100 text-xs focus:outline-none focus:border-cyan-400"
                      />
                      {errors[`member_${idx}_name`] && (
                        <p className="text-[10px] text-red-400 mt-0.5">{errors[`member_${idx}_name`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Email *</label>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                        placeholder="diya.p@gmail.com"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-slate-100 text-xs focus:outline-none focus:border-cyan-400"
                      />
                      {errors[`member_${idx}_email`] && (
                        <p className="text-[10px] text-red-400 mt-0.5">{errors[`member_${idx}_email`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={member.phone}
                        onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                        placeholder="+91 98451 09877"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-slate-100 text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">College USN *</label>
                      <input
                        type="text"
                        value={member.usn}
                        onChange={(e) => handleMemberChange(idx, 'usn', e.target.value)}
                        placeholder="1MS22CS032"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-slate-100 text-xs focus:outline-none focus:border-cyan-400 font-mono"
                      />
                      {errors[`member_${idx}_usn`] && (
                        <p className="text-[10px] text-red-400 mt-0.5">{errors[`member_${idx}_usn`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('DETAILS')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleProceedToVerify}
                id="members-continue-btn"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
              >
                <span>Proceed to Email Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: INTERACTIVE EMAIL VERIFICATION */}
        {step === 'VERIFY' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-center space-y-2">
              <div className="inline-flex p-3 rounded-full bg-cyan-500/10 text-cyan-400 mb-1">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                Verify Team Leader Email
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                We sent a 6-digit security pass verification code to <strong className="text-cyan-300 font-mono">{leader.email}</strong>.
              </p>

              {/* Simulated Code Box for Instant Testing */}
              <div className="mt-3 p-3 rounded-lg bg-slate-900/90 border border-white/10 inline-flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Simulated Automated Dispatch Code:
                </span>
                <span className="font-mono text-xl font-black text-amber-400 tracking-widest">
                  {generatedCode}
                </span>
                <button
                  type="button"
                  onClick={() => setInputCode(generatedCode)}
                  className="mt-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                >
                  Click to Auto-fill Code
                </button>
              </div>
            </div>

            {/* OTP Input Field */}
            <div className="max-w-xs mx-auto space-y-2">
              <label className="block text-center text-xs font-mono text-slate-400">
                Enter 6-Digit Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                placeholder="------"
                id="otp-input-field"
                className="w-full text-center text-2xl tracking-[0.5em] font-mono font-bold py-3 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              {errors.code && <p className="text-center text-xs text-red-400">{errors.code}</p>}
            </div>

            {/* Resend Code Timer */}
            <div className="text-center text-xs font-mono text-slate-400">
              {resendTimer > 0 ? (
                <span>Resend available in {resendTimer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={triggerSendCode}
                  className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                >
                  Resend Verification Code
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(event.teamSize.max > 1 ? 'MEMBERS' : 'DETAILS')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleVerifyAndSubmit}
                id="verify-submit-btn"
                disabled={inputCode.length < 6 || isVerifying}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  inputCode.length < 6 || isVerifying
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isVerifying ? 'Verifying & Generating Pass...' : 'Verify & Lock Registration'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS & DIGITAL TICKET CONFIRMATION */}
        {step === 'SUCCESS' && confirmedRegistration && (
          <div className="text-center space-y-6 animate-scaleUp">
            <div className="inline-flex p-4 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 mb-1">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 mb-2">
                25th Silver Jubilee Registered Pass
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                Registration Confirmed!
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                Automatic submission tracking recorded. Confirmation email dispatched to <strong className="text-cyan-300 font-mono">{confirmedRegistration.leader.email}</strong> and SMS to <strong className="text-cyan-300 font-mono">{confirmedRegistration.leader.phone}</strong>.
              </p>
            </div>

            {/* Digital Ticket Pass Card */}
            <div className="max-w-md mx-auto p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 border border-cyan-500/40 shadow-xl text-left space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">TICKET PASS ID</span>
                  <div className="font-mono font-black text-base text-cyan-300">
                    {confirmedRegistration.id}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-white/10">
                  <QrCode className="w-8 h-8 text-cyan-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">TEAM NAME</span>
                  <span className="font-bold text-white truncate">{confirmedRegistration.teamName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">LEADER</span>
                  <span className="font-bold text-white truncate">{confirmedRegistration.leader.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">EVENT</span>
                  <span className="font-bold text-slate-200 truncate">{event.title}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">VENUE</span>
                  <span className="font-bold text-slate-200 truncate">{event.venue}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Email Verified & QR Active
                </span>
                <span className="text-slate-400">Total: {1 + confirmedRegistration.members.length} Participants</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onViewPass(confirmedRegistration);
                }}
                id="view-pass-btn"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs font-semibold border border-cyan-500/30 transition-colors cursor-pointer"
              >
                <Ticket className="w-4 h-4" />
                <span>Open Digital Badge Pass</span>
              </button>

              <button
                onClick={onClose}
                id="close-success-btn"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md hover:scale-102 transition-transform cursor-pointer"
              >
                <span>Done & Return to Fest</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

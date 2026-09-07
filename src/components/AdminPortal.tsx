import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Ticket, 
  Mail, 
  Phone, 
  CheckCircle2, 
  X, 
  Search, 
  Filter, 
  Download, 
  Bell, 
  Send, 
  LogOut, 
  Clock, 
  Layers, 
  Trash2, 
  UserCheck, 
  AlertCircle, 
  RefreshCw,
  QrCode,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet
} from 'lucide-react';
import { useFest } from '../context/FestContext';
import { DepartmentCode, RegistrationRecord, AdminUser } from '../types';
import { ADMIN_USERS } from '../data/mockData';

interface AdminPortalProps {
  onClose: () => void;
  onViewPass: (reg: RegistrationRecord) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onClose, onViewPass }) => {
  const {
    adminUser,
    loginAdmin,
    logoutAdmin,
    switchAdminRole,
    registrations,
    events,
    departments,
    notifications,
    updateRegistrationStatus,
    deleteRegistration,
    resendNotification,
    sendBroadcastNotification,
    toggleEventStatus,
    updateEventCapacity,
    stats,
  } = useFest();

  // Auth form state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Tab navigation in admin dashboard
  const [activeTab, setActiveTab] = useState<'MONITOR' | 'REGISTRATIONS' | 'EVENTS' | 'NOTIFICATIONS'>('MONITOR');

  // Filters for registrations
  const [deptFilter, setDeptFilter] = useState<DepartmentCode | 'ALL'>(
    adminUser?.dept ? adminUser.dept : 'ALL'
  );
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Confirmed' | 'Checked-In'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRegId, setExpandedRegId] = useState<string | null>(null);

  // Broadcast Notification Form
  const [broadcastChannel, setBroadcastChannel] = useState<'EMAIL' | 'SMS' | 'BOTH'>('BOTH');
  const [broadcastDept, setBroadcastDept] = useState<DepartmentCode | 'ALL'>('ALL');
  const [broadcastEventId, setBroadcastEventId] = useState<string>('ALL');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSuccessNotice, setBroadcastSuccessNotice] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const success = loginAdmin(emailInput, passwordInput);
    if (!success) {
      setAuthError('Invalid credentials. You can click any of the quick-login roles below.');
    }
  };

  const handleQuickLogin = (user: AdminUser) => {
    loginAdmin(user.email, 'admin123');
    if (user.dept) {
      setDeptFilter(user.dept);
    } else {
      setDeptFilter('ALL');
    }
  };

  // Filtered registrations
  const filteredRegistrations = registrations.filter((reg) => {
    // If admin is department coordinator, lock to their department unless Super Admin
    const isSuperAdmin = adminUser?.role === 'SUPER_ADMIN';
    const effectiveDept = isSuperAdmin ? deptFilter : (adminUser?.dept || deptFilter);

    const matchesDept = effectiveDept === 'ALL' || reg.dept === effectiveDept;
    const matchesEvent = selectedEventFilter === 'ALL' || reg.eventId === selectedEventFilter;
    const matchesStatus = statusFilter === 'ALL' || reg.status === statusFilter;
    const matchesSearch =
      reg.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.leader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.leader.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.leader.college.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDept && matchesEvent && matchesStatus && matchesSearch;
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Registration ID', 'Event', 'Department', 'Team Name', 'Leader Name', 'Leader Email', 'Leader Phone', 'Leader USN', 'College', 'Semester', 'Members Count', 'Status', 'Registered At'];
    const rows = filteredRegistrations.map(r => [
      r.id,
      r.eventTitle,
      r.dept,
      `"${r.teamName}"`,
      `"${r.leader.name}"`,
      r.leader.email,
      r.leader.phone,
      r.leader.usn,
      `"${r.leader.college}"`,
      r.leader.semester,
      r.members.length,
      r.status,
      r.registeredAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `technova25_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dispatch Broadcast Notification
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    const notif = sendBroadcastNotification({
      title: broadcastTitle,
      message: broadcastMessage,
      channel: broadcastChannel,
      targetDept: broadcastDept,
      targetEventId: broadcastEventId,
    });

    setBroadcastSuccessNotice(`Broadcast dispatched to ${notif.recipientCount} participant(s) via ${broadcastChannel}.`);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setTimeout(() => setBroadcastSuccessNotice(null), 4000);
  };

  const applyTemplate = (title: string, message: string) => {
    setBroadcastTitle(title);
    setBroadcastMessage(message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
      <div 
        className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-3xl bg-slate-900 border border-purple-500/40 shadow-[0_0_60px_rgba(168,85,247,0.25)] text-slate-100 flex flex-col"
        id="admin-portal-modal"
      >
        {/* Top Bar Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-slate-900/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-lg sm:text-2xl text-white">
                  Admin & Coordinator Command Center
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Silver Jubilee '26
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">
                Real-Time Event Monitoring • Registration Management • SMS & Email Notification Dispatch
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close portal"
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AUTHENTICATION VIEW IF NOT LOGGED IN */}
        {!adminUser ? (
          <div className="p-6 sm:p-12 max-w-xl mx-auto w-full my-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Secure Administrative Gate
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                Coordinator & Admin Sign In
              </h3>
              <p className="text-xs text-slate-400">
                Access participant rosters, check-in desks, broadcast channels, and event capacity controls.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Administrative Email</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@technova.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-slate-100 text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Access Passcode</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-slate-100 text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              {authError && <p className="text-xs text-red-400">{authError}</p>}

              <button
                type="submit"
                id="admin-login-submit-btn"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-101 transition-transform cursor-pointer"
              >
                Authenticate & Enter Dashboard
              </button>
            </form>

            {/* Quick Demo Access Roles */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 block text-center uppercase tracking-wider">
                Instant Demo One-Click Access (Select Role):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ADMIN_USERS.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleQuickLogin(user)}
                    className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-white/10 text-left transition-colors cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                      {user.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                      <span>{user.role}</span>
                      <span className="text-cyan-400">Click to enter →</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD */
          <div className="p-4 sm:p-6 space-y-6 flex-1">
            {/* Active User Strip & Tab Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-400 flex items-center justify-center font-bold text-slate-950 text-sm">
                  {adminUser.dept || 'SA'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{adminUser.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {adminUser.role}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{adminUser.email}</span>
                </div>
              </div>

              {/* Tab Selector Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono">
                <button
                  onClick={() => setActiveTab('MONITOR')}
                  id="tab-monitor-btn"
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'MONITOR'
                      ? 'bg-purple-600 text-white font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Live Monitoring
                </button>
                <button
                  onClick={() => setActiveTab('REGISTRATIONS')}
                  id="tab-registrations-btn"
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'REGISTRATIONS'
                      ? 'bg-purple-600 text-white font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Registrations ({filteredRegistrations.length})
                </button>
                <button
                  onClick={() => setActiveTab('EVENTS')}
                  id="tab-events-btn"
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'EVENTS'
                      ? 'bg-purple-600 text-white font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Event Capacity
                </button>
                <button
                  onClick={() => setActiveTab('NOTIFICATIONS')}
                  id="tab-notifs-btn"
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'NOTIFICATIONS'
                      ? 'bg-purple-600 text-white font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SMS & Email Broadcast
                </button>
              </div>

              <button
                onClick={logoutAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400 text-xs font-mono border border-red-500/20 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* TAB 1: REAL-TIME MONITORING */}
            {activeTab === 'MONITOR' && (
              <div className="space-y-6">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10">
                    <span className="text-[11px] font-mono text-slate-400 uppercase">Registered Teams</span>
                    <div className="font-display font-black text-2xl text-cyan-300 mt-1">{stats.totalTeams}</div>
                    <span className="text-[10px] text-slate-500 font-mono">Across 4 Departments</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10">
                    <span className="text-[11px] font-mono text-slate-400 uppercase">Total Participants</span>
                    <div className="font-display font-black text-2xl text-purple-300 mt-1">{stats.totalParticipants}</div>
                    <span className="text-[10px] text-slate-500 font-mono">Students enrolled</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10">
                    <span className="text-[11px] font-mono text-slate-400 uppercase">Verified Emails</span>
                    <div className="font-display font-black text-2xl text-emerald-400 mt-1">{stats.verifiedPercentage}%</div>
                    <span className="text-[10px] text-emerald-400/80 font-mono">Passes Active</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10">
                    <span className="text-[11px] font-mono text-slate-400 uppercase">Venue Check-Ins</span>
                    <div className="font-display font-black text-2xl text-amber-400 mt-1">{stats.checkedInCount}</div>
                    <span className="text-[10px] text-slate-500 font-mono">Checked In</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 col-span-2 lg:col-span-1">
                    <span className="text-[11px] font-mono text-slate-400 uppercase">Total Prize Pool</span>
                    <div className="font-display font-black text-2xl text-white mt-1">{stats.totalPrizeMoney}</div>
                    <span className="text-[10px] text-amber-400 font-mono">Silver Jubilee Grants</span>
                  </div>
                </div>

                {/* Department Registration Distribution */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-4">
                  <h3 className="font-display font-bold text-base text-white flex items-center justify-between">
                    <span>Department Enrollment Breakdown</span>
                    <span className="text-xs font-mono text-slate-400">Total 8 Competitions</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {departments.map((dept) => {
                      const deptTeams = registrations.filter(r => r.dept === dept.code).length;
                      const deptEvents = events.filter(e => e.dept === dept.code);
                      const totalCapacity = deptEvents.reduce((acc, ev) => acc + ev.spotsTotal, 0);
                      const totalFilled = deptEvents.reduce((acc, ev) => acc + ev.spotsFilled, 0);
                      const fillPct = totalCapacity > 0 ? Math.round((totalFilled / totalCapacity) * 100) : 0;

                      return (
                        <div key={dept.code} className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-display font-black text-lg text-white">{dept.code}</span>
                            <span className="text-xs font-mono font-bold text-cyan-300">{deptTeams} Teams</span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">{dept.name}</p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono text-slate-400">
                              <span>Slot Fill Rate</span>
                              <span>{fillPct}% ({totalFilled}/{totalCapacity})</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.min(100, fillPct)}%`,
                                  backgroundColor: dept.colorTheme.primary,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Stream of Recent Registrations */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
                  <h3 className="font-display font-bold text-base text-white">
                    Live Submission Activity Stream
                  </h3>
                  <div className="space-y-2">
                    {registrations.slice(0, 5).map((reg) => (
                      <div key={reg.id} className="p-3 rounded-xl bg-slate-900 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-400">
                            {reg.dept}
                          </span>
                          <div>
                            <strong className="text-white">{reg.teamName}</strong>
                            <span className="text-slate-400"> — {reg.eventTitle}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                          <span>Leader: {reg.leader.name}</span>
                          <span className="text-emerald-400">{reg.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: REGISTRATIONS MANAGEMENT */}
            {activeTab === 'REGISTRATIONS' && (
              <div className="space-y-4">
                {/* Search & Action Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-white/10">
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {/* Dept Filter */}
                    <select
                      value={deptFilter}
                      onChange={(e) => setDeptFilter(e.target.value as any)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-xs text-slate-200 font-mono"
                    >
                      <option value="ALL">All Departments</option>
                      <option value="CSE">CSE</option>
                      <option value="ISE">ISE</option>
                      <option value="ECE">ECE</option>
                      <option value="EEE">EEE</option>
                    </select>

                    {/* Event Filter */}
                    <select
                      value={selectedEventFilter}
                      onChange={(e) => setSelectedEventFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-xs text-slate-200 font-mono max-w-[200px]"
                    >
                      <option value="ALL">All Events</option>
                      {events.map((ev) => (
                        <option key={ev.id} value={ev.id}>
                          {ev.title}
                        </option>
                      ))}
                    </select>

                    {/* Status Filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-xs text-slate-200 font-mono"
                    >
                      <option value="ALL">All Status</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Checked-In">Checked-In</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-60">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search team, USN, college..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>

                    <button
                      onClick={handleExportCSV}
                      title="Export CSV"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium border border-white/10 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                {/* Registrations Roster Table */}
                <div className="space-y-3">
                  {filteredRegistrations.map((reg) => {
                    const isExpanded = expandedRegId === reg.id;

                    return (
                      <div 
                        key={reg.id}
                        className="rounded-xl bg-slate-950/70 border border-white/10 p-4 transition-all"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-cyan-300">
                                {reg.id}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                                {reg.dept}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                reg.status === 'Checked-In'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                              }`}>
                                {reg.status}
                              </span>
                            </div>

                            <h4 className="font-display font-bold text-base text-white">
                              Team: {reg.teamName} <span className="text-xs font-normal text-slate-400 font-mono">({reg.eventTitle})</span>
                            </h4>

                            <div className="text-xs text-slate-300 font-mono flex flex-wrap gap-x-4 gap-y-1">
                              <span>Leader: <strong className="text-slate-100">{reg.leader.name}</strong></span>
                              <span>USN: <strong className="text-slate-100">{reg.leader.usn}</strong></span>
                              <span>College: <strong className="text-slate-100">{reg.leader.college}</strong></span>
                              <span>Phone: <strong className="text-slate-100">{reg.leader.phone}</strong></span>
                            </div>
                          </div>

                          {/* Quick Action Buttons */}
                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            {/* Toggle Check-in */}
                            <button
                              onClick={() => updateRegistrationStatus(reg.id, reg.status === 'Checked-In' ? 'Confirmed' : 'Checked-In')}
                              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                                reg.status === 'Checked-In'
                                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/60'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10'
                              }`}
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>{reg.status === 'Checked-In' ? 'Checked In' : 'Check In'}</span>
                            </button>

                            {/* View Ticket Pass */}
                            <button
                              onClick={() => onViewPass(reg)}
                              title="View Pass"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-white/10 cursor-pointer"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>

                            {/* Resend Confirmation */}
                            <button
                              onClick={() => resendNotification(reg.id, 'both')}
                              title="Resend Email & SMS Confirmation"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-white/10 cursor-pointer"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>

                            {/* Delete Team */}
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to cancel registration for Team "${reg.teamName}"?`)) {
                                  deleteRegistration(reg.id);
                                }
                              }}
                              title="Cancel Registration"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 hover:text-red-400 text-slate-400 border border-white/10 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            {/* Expand Details */}
                            <button
                              onClick={() => setExpandedRegId(isExpanded ? null : reg.id)}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Expanded Teammates Drawer */}
                        {isExpanded && (
                          <div className="mt-4 pt-3 border-t border-white/10 space-y-3 animate-fadeIn text-xs">
                            <div className="font-mono font-bold text-slate-300">
                              Full Team Roster ({1 + reg.members.length} participants):
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              {/* Leader Card */}
                              <div className="p-2.5 rounded-lg bg-slate-900 border border-cyan-500/20">
                                <span className="text-[10px] font-mono text-cyan-400 block">TEAM LEADER</span>
                                <div className="font-bold text-white">{reg.leader.name}</div>
                                <div className="text-[11px] text-slate-400 font-mono">{reg.leader.email}</div>
                                <div className="text-[11px] text-slate-400 font-mono">{reg.leader.phone}</div>
                                <div className="text-[11px] text-slate-400 font-mono">{reg.leader.usn} • {reg.leader.semester}</div>
                              </div>

                              {/* Teammates */}
                              {reg.members.map((m, i) => (
                                <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-white/5">
                                  <span className="text-[10px] font-mono text-purple-400 block">MEMBER #{i + 2}</span>
                                  <div className="font-bold text-white">{m.name}</div>
                                  <div className="text-[11px] text-slate-400 font-mono">{m.email}</div>
                                  <div className="text-[11px] text-slate-400 font-mono">{m.phone || 'N/A'}</div>
                                  <div className="text-[11px] text-slate-400 font-mono">{m.usn} • {m.semester}</div>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                              <span>Registered At: {new Date(reg.registeredAt).toLocaleString()}</span>
                              <span className="text-emerald-400">Email Verification Confirmed</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {filteredRegistrations.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No registrations match the selected filters.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: EVENT CAPACITY & MANAGEMENT */}
            {activeTab === 'EVENTS' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-white">
                    Competition Capacity & Open/Closed Status
                  </h3>
                  <span className="text-xs font-mono text-slate-400">Total 8 Events</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map((ev) => (
                    <div key={ev.id} className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300">
                          {ev.dept} • {ev.code}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleEventStatus(ev.id, ev.status === 'Open' ? 'Closed' : 'Open')}
                            className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
                              ev.status === 'Open'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}
                          >
                            Status: {ev.status}
                          </button>
                        </div>
                      </div>

                      <h4 className="font-display font-bold text-sm text-white">{ev.title}</h4>

                      <div className="space-y-1.5 text-xs font-mono">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Spots Filled</span>
                          <span className="text-cyan-300 font-bold">{ev.spotsFilled} / {ev.spotsTotal}</span>
                        </div>

                        {/* Adjust capacity */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <span className="text-[11px] text-slate-400">Set Max Total Slots:</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateEventCapacity(ev.id, Math.max(ev.spotsFilled, ev.spotsTotal - 5))}
                              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                            >
                              -5
                            </button>
                            <span className="px-2 font-bold text-white">{ev.spotsTotal}</span>
                            <button
                              onClick={() => updateEventCapacity(ev.id, ev.spotsTotal + 5)}
                              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                            >
                              +5
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: AUTOMATED NOTIFICATIONS BROADCAST */}
            {activeTab === 'NOTIFICATIONS' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Notification Composer */}
                <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-4">
                  <div className="flex items-center gap-2 text-purple-400 font-display font-bold text-base">
                    <Send className="w-4 h-4" />
                    <span>Broadcast Automated Participant Alert</span>
                  </div>

                  {broadcastSuccessNotice && (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{broadcastSuccessNotice}</span>
                    </div>
                  )}

                  <form onSubmit={handleSendBroadcast} className="space-y-4">
                    {/* Channel Selector */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">Dispatch Channels</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['BOTH', 'EMAIL', 'SMS'] as const).map((ch) => (
                          <button
                            key={ch}
                            type="button"
                            onClick={() => setBroadcastChannel(ch)}
                            className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                              broadcastChannel === ch
                                ? 'bg-purple-600 text-white shadow'
                                : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
                            }`}
                          >
                            {ch === 'BOTH' ? 'Email & SMS' : ch}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Target Selector */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1">Target Department</label>
                        <select
                          value={broadcastDept}
                          onChange={(e) => setBroadcastDept(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/15 text-xs text-slate-200 font-mono"
                        >
                          <option value="ALL">All Departments</option>
                          <option value="CSE">CSE</option>
                          <option value="ISE">ISE</option>
                          <option value="ECE">ECE</option>
                          <option value="EEE">EEE</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1">Target Event</label>
                        <select
                          value={broadcastEventId}
                          onChange={(e) => setBroadcastEventId(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/15 text-xs text-slate-200 font-mono truncate"
                        >
                          <option value="ALL">All Competitions</option>
                          {events.map((ev) => (
                            <option key={ev.id} value={ev.id}>
                              {ev.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Pre-built Templates */}
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 block mb-1">Quick Templates:</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => applyTemplate(
                            'Reporting Time & Desk Check-In Instructions',
                            'Attention teams! Reporting time is strictly 08:30 AM at the Silver Jubilee Quadrangle. Carry valid college photo ID and digital ticket QR.'
                          )}
                          className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] font-mono text-cyan-300 border border-white/10"
                        >
                          Reporting Reminder
                        </button>
                        <button
                          type="button"
                          onClick={() => applyTemplate(
                            'Join Official Silver TechNova Discord Server',
                            'All participants must join the event Discord server for mentoring channels, Q&A and announcements: https://discord.gg/technova25'
                          )}
                          className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] font-mono text-purple-300 border border-white/10"
                        >
                          Discord Server Link
                        </button>
                        <button
                          type="button"
                          onClick={() => applyTemplate(
                            'Schedule Notice: Preliminary Round Timings',
                            'Notice: Round 1 evaluation commences at 10:00 AM sharp. Please set up your laptops in assigned lab bays.'
                          )}
                          className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] font-mono text-amber-300 border border-white/10"
                        >
                          Schedule Shift
                        </button>
                      </div>
                    </div>

                    {/* Subject / Title */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">Message Title / Subject</label>
                      <input
                        type="text"
                        value={broadcastTitle}
                        onChange={(e) => setBroadcastTitle(e.target.value)}
                        placeholder="e.g. Important Update Regarding Hackathon Lab Allocation"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/15 text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-400"
                        required
                      />
                    </div>

                    {/* Message Body */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-mono text-slate-300">Message Content</label>
                        <span className="text-[10px] font-mono text-slate-500">{broadcastMessage.length} chars</span>
                      </div>
                      <textarea
                        rows={4}
                        value={broadcastMessage}
                        onChange={(e) => setBroadcastMessage(e.target.value)}
                        placeholder="Type update message dispatched to participants' verified emails and phone numbers..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/15 text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-400 resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      id="dispatch-broadcast-btn"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-101 transition-transform cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Dispatch Broadcast to Participants</span>
                    </button>
                  </form>
                </div>

                {/* Real-time Notification Logs */}
                <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-cyan-400 font-display font-bold text-base">
                      <Bell className="w-4 h-4" />
                      <span>Live Notification Dispatch Log</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{notifications.length} Logs</span>
                  </div>

                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-purple-300">{notif.title}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            {notif.status}
                          </span>
                        </div>

                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {notif.message}
                        </p>

                        <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
                          <div className="flex items-center gap-2">
                            <span>Channel: <strong className="text-slate-200">{notif.channel}</strong></span>
                            <span>Recipients: <strong className="text-cyan-300">{notif.recipientCount}</strong></span>
                          </div>
                          <span>{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

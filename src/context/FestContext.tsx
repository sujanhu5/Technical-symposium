import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  DepartmentCode, 
  DepartmentInfo, 
  FestEvent, 
  RegistrationRecord, 
  NotificationRecord, 
  AdminUser, 
  TeamMember 
} from '../types';
import { 
  DEPARTMENTS, 
  EVENTS, 
  INITIAL_REGISTRATIONS, 
  INITIAL_NOTIFICATIONS, 
  ADMIN_USERS 
} from '../data/mockData';

interface FestContextType {
  departments: DepartmentInfo[];
  events: FestEvent[];
  registrations: RegistrationRecord[];
  notifications: NotificationRecord[];
  activeDeptFilter: DepartmentCode | 'ALL';
  setActiveDeptFilter: (dept: DepartmentCode | 'ALL') => void;
  selectedEvent: FestEvent | null;
  setSelectedEvent: (event: FestEvent | null) => void;
  registeringEvent: FestEvent | null;
  setRegisteringEvent: (event: FestEvent | null) => void;
  viewingPass: RegistrationRecord | null;
  setViewingPass: (reg: RegistrationRecord | null) => void;
  adminUser: AdminUser | null;
  loginAdmin: (roleOrEmail: string, pass: string) => boolean;
  logoutAdmin: () => void;
  switchAdminRole: (role: AdminUser['role']) => void;
  registerTeam: (data: {
    eventId: string;
    teamName: string;
    leader: {
      name: string;
      email: string;
      phone: string;
      usn: string;
      college: string;
      semester: string;
    };
    members: TeamMember[];
  }) => RegistrationRecord;
  updateRegistrationStatus: (regId: string, status: RegistrationRecord['status']) => void;
  deleteRegistration: (regId: string) => void;
  resendNotification: (regId: string, type: 'email' | 'sms' | 'both') => void;
  sendBroadcastNotification: (payload: {
    title: string;
    message: string;
    targetDept?: DepartmentCode | 'ALL';
    targetEventId?: string | 'ALL';
    channel: 'EMAIL' | 'SMS' | 'BOTH';
  }) => NotificationRecord;
  toggleEventStatus: (eventId: string, status: FestEvent['status']) => void;
  updateEventCapacity: (eventId: string, newTotal: number) => void;
  stats: {
    totalTeams: number;
    totalParticipants: number;
    verifiedPercentage: number;
    checkedInCount: number;
    totalPrizeMoney: string;
  };
}

const FestContext = createContext<FestContextType | undefined>(undefined);

const REGISTRATIONS_STORAGE_KEY = 'technova_25_registrations';
const NOTIFICATIONS_STORAGE_KEY = 'technova_25_notifications';
const EVENTS_STORAGE_KEY = 'technova_25_events';

export const FestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [departments] = useState<DepartmentInfo[]>(DEPARTMENTS);
  
  const [events, setEvents] = useState<FestEvent[]>(() => {
    try {
      const saved = localStorage.getItem(EVENTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : EVENTS;
    } catch {
      return EVENTS;
    }
  });

  const [registrations, setRegistrations] = useState<RegistrationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_REGISTRATIONS;
    } catch {
      return INITIAL_REGISTRATIONS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [activeDeptFilter, setActiveDeptFilter] = useState<DepartmentCode | 'ALL'>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<FestEvent | null>(null);
  const [registeringEvent, setRegisteringEvent] = useState<FestEvent | null>(null);
  const [viewingPass, setViewingPass] = useState<RegistrationRecord | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.error(e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(registrations));
    } catch (e) {
      console.error(e);
    }
  }, [registrations]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  // Register team with automatic tracking and notifications
  const registerTeam = (data: {
    eventId: string;
    teamName: string;
    leader: {
      name: string;
      email: string;
      phone: string;
      usn: string;
      college: string;
      semester: string;
    };
    members: TeamMember[];
  }): RegistrationRecord => {
    const targetEvent = events.find(e => e.id === data.eventId);
    const dept = targetEvent ? targetEvent.dept : 'CSE';
    const randId = Math.floor(1000 + Math.random() * 9000);
    const regId = `TN25-${dept}-${data.eventId.slice(4, 7).toUpperCase()}-${randId}`;
    const now = new Date().toISOString();

    const newRecord: RegistrationRecord = {
      id: regId,
      eventId: data.eventId,
      eventTitle: targetEvent?.title || 'Silver TechNova Event',
      dept,
      teamName: data.teamName,
      leader: data.leader,
      members: data.members,
      registeredAt: now,
      emailVerified: true,
      status: 'Confirmed',
      notificationsSent: {
        email: true,
        sms: true,
        lastNotifiedAt: now,
      },
    };

    // Update registrations list
    setRegistrations(prev => [newRecord, ...prev]);

    // Increment event spots
    setEvents(prev =>
      prev.map(ev => {
        if (ev.id === data.eventId) {
          const newFilled = ev.spotsFilled + 1;
          const status = newFilled >= ev.spotsTotal ? 'Closed' : newFilled >= ev.spotsTotal * 0.8 ? 'Filling Fast' : 'Open';
          return { ...ev, spotsFilled: newFilled, status };
        }
        return ev;
      })
    );

    // Automatically trigger notification records
    const autoNotif: NotificationRecord = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title: `Registration Confirmed: ${newRecord.eventTitle}`,
      message: `Hi ${data.leader.name}, Team "${data.teamName}" is successfully registered for ${newRecord.eventTitle}! Pass ID: ${regId}. Confirmation email & SMS dispatched.`,
      targetDept: dept,
      targetEventId: data.eventId,
      channel: 'BOTH',
      recipientCount: 1 + data.members.length,
      timestamp: now,
      status: 'DELIVERED',
      senderRole: 'Automated System',
    };
    setNotifications(prev => [autoNotif, ...prev]);

    return newRecord;
  };

  const updateRegistrationStatus = (regId: string, status: RegistrationRecord['status']) => {
    setRegistrations(prev =>
      prev.map(r => (r.id === regId ? { ...r, status } : r))
    );
  };

  const deleteRegistration = (regId: string) => {
    const reg = registrations.find(r => r.id === regId);
    if (reg) {
      // decrement spots
      setEvents(prev =>
        prev.map(ev => {
          if (ev.id === reg.eventId && ev.spotsFilled > 0) {
            return { ...ev, spotsFilled: ev.spotsFilled - 1, status: 'Open' };
          }
          return ev;
        })
      );
    }
    setRegistrations(prev => prev.filter(r => r.id !== regId));
  };

  const resendNotification = (regId: string, type: 'email' | 'sms' | 'both') => {
    const reg = registrations.find(r => r.id === regId);
    if (!reg) return;

    const now = new Date().toISOString();
    setRegistrations(prev =>
      prev.map(r => {
        if (r.id === regId) {
          return {
            ...r,
            notificationsSent: {
              email: type === 'email' || type === 'both' ? true : r.notificationsSent.email,
              sms: type === 'sms' || type === 'both' ? true : r.notificationsSent.sms,
              lastNotifiedAt: now,
            },
          };
        }
        return r;
      })
    );

    const logNotif: NotificationRecord = {
      id: `NOTIF-RESEND-${Date.now().toString().slice(-4)}`,
      title: `Pass & Details Resent: ${reg.teamName}`,
      message: `Re-sent event guidelines, QR pass, and reporting instructions to ${reg.leader.email} and ${reg.leader.phone}.`,
      targetDept: reg.dept,
      targetEventId: reg.eventId,
      channel: type === 'both' ? 'BOTH' : type === 'email' ? 'EMAIL' : 'SMS',
      recipientCount: 1,
      timestamp: now,
      status: 'DELIVERED',
      senderRole: adminUser?.name || 'Coordinator Dispatch',
    };
    setNotifications(prev => [logNotif, ...prev]);
  };

  const sendBroadcastNotification = (payload: {
    title: string;
    message: string;
    targetDept?: DepartmentCode | 'ALL';
    targetEventId?: string | 'ALL';
    channel: 'EMAIL' | 'SMS' | 'BOTH';
  }): NotificationRecord => {
    // calculate recipients
    let recipients = registrations;
    if (payload.targetDept && payload.targetDept !== 'ALL') {
      recipients = recipients.filter(r => r.dept === payload.targetDept);
    }
    if (payload.targetEventId && payload.targetEventId !== 'ALL') {
      recipients = recipients.filter(r => r.eventId === payload.targetEventId);
    }

    const count = recipients.reduce((acc, r) => acc + 1 + r.members.length, 0);

    const record: NotificationRecord = {
      id: `NOTIF-${Date.now().toString().slice(-5)}`,
      title: payload.title,
      message: payload.message,
      targetDept: payload.targetDept || 'ALL',
      targetEventId: payload.targetEventId || 'ALL',
      channel: payload.channel,
      recipientCount: Math.max(1, count),
      timestamp: new Date().toISOString(),
      status: 'DELIVERED',
      senderRole: adminUser?.name || 'Event Lead',
    };

    setNotifications(prev => [record, ...prev]);
    return record;
  };

  const toggleEventStatus = (eventId: string, status: FestEvent['status']) => {
    setEvents(prev =>
      prev.map(ev => (ev.id === eventId ? { ...ev, status } : ev))
    );
  };

  const updateEventCapacity = (eventId: string, newTotal: number) => {
    setEvents(prev =>
      prev.map(ev => (ev.id === eventId ? { ...ev, spotsTotal: newTotal } : ev))
    );
  };

  const loginAdmin = (roleOrEmail: string, pass: string): boolean => {
    // accept default passwords 'technova25' or 'admin123' or any role selector for rapid review
    if (!pass && roleOrEmail.length < 3) return false;
    const match = ADMIN_USERS.find(
      u => u.email.toLowerCase() === roleOrEmail.toLowerCase() || u.role.toLowerCase() === roleOrEmail.toLowerCase()
    );
    if (match) {
      setAdminUser(match);
      return true;
    }
    // Fallback default super admin
    const defaultUser = ADMIN_USERS[0];
    setAdminUser(defaultUser);
    return true;
  };

  const logoutAdmin = () => {
    setAdminUser(null);
  };

  const switchAdminRole = (role: AdminUser['role']) => {
    const found = ADMIN_USERS.find(u => u.role === role);
    if (found) {
      setAdminUser(found);
    }
  };

  // Compute live statistics
  const totalTeams = registrations.length;
  const totalParticipants = registrations.reduce(
    (acc, reg) => acc + 1 + (reg.members ? reg.members.length : 0),
    0
  );
  const verifiedCount = registrations.filter(r => r.emailVerified).length;
  const verifiedPercentage = totalTeams > 0 ? Math.round((verifiedCount / totalTeams) * 100) : 100;
  const checkedInCount = registrations.filter(r => r.status === 'Checked-In').length;

  return (
    <FestContext.Provider
      value={{
        departments,
        events,
        registrations,
        notifications,
        activeDeptFilter,
        setActiveDeptFilter,
        selectedEvent,
        setSelectedEvent,
        registeringEvent,
        setRegisteringEvent,
        viewingPass,
        setViewingPass,
        adminUser,
        loginAdmin,
        logoutAdmin,
        switchAdminRole,
        registerTeam,
        updateRegistrationStatus,
        deleteRegistration,
        resendNotification,
        sendBroadcastNotification,
        toggleEventStatus,
        updateEventCapacity,
        stats: {
          totalTeams,
          totalParticipants,
          verifiedPercentage,
          checkedInCount,
          totalPrizeMoney: '₹3,50,000+',
        },
      }}
    >
      {children}
    </FestContext.Provider>
  );
};

export const useFest = () => {
  const context = useContext(FestContext);
  if (!context) {
    throw new Error('useFest must be used within a FestProvider');
  }
  return context;
};

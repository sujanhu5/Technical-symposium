export type DepartmentCode = 'CSE' | 'ISE' | 'ECE' | 'EEE';

export interface DepartmentInfo {
  code: DepartmentCode;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  iconName: string;
  colorTheme: {
    primary: string;
    border: string;
    bg: string;
    glow: string;
    badge: string;
    text: string;
  };
  stats: {
    eventsCount: number;
    totalPrize: string;
    estParticipants: number;
  };
  hodName: string;
  facultyCoordinator: string;
}

export interface EventRound {
  number: number;
  name: string;
  duration: string;
  description: string;
  mode: 'Online' | 'Offline Lab' | 'Auditorium' | 'Arena';
}

export interface CoordinatorContact {
  name: string;
  role: 'Faculty Lead' | 'Student Coordinator' | 'Technical Lead';
  phone: string;
  email: string;
}

export interface FestEvent {
  id: string;
  code: string;
  dept: DepartmentCode;
  title: string;
  subtitle: string;
  category: 'Hackathon' | 'Ideathon' | 'Cybersecurity' | 'AI & ML' | 'Cloud & Systems' | 'Coding' | 'Robotics & Hardware' | 'Clean Energy';
  featured: boolean;
  shortDescription: string;
  fullDescription: string;
  prizePool: {
    first: string;
    second: string;
    third: string;
    total: string;
  };
  teamSize: {
    min: number;
    max: number;
  };
  date: string;
  time: string;
  venue: string;
  registrationFee: string;
  spotsTotal: number;
  spotsFilled: number;
  status: 'Open' | 'Filling Fast' | 'Closed';
  rounds: EventRound[];
  rules: string[];
  eligibility: string[];
  coordinators: CoordinatorContact[];
  tags: string[];
}

export interface TeamMember {
  name: string;
  email: string;
  phone: string;
  usn: string;
  semester: string;
}

export interface RegistrationRecord {
  id: string; // e.g. "TN25-CSE-APP-4921"
  eventId: string;
  eventTitle: string;
  dept: DepartmentCode;
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
  registeredAt: string;
  emailVerified: boolean;
  verificationCode?: string;
  status: 'Confirmed' | 'Checked-In' | 'Waitlist';
  notificationsSent: {
    email: boolean;
    sms: boolean;
    lastNotifiedAt?: string;
  };
}

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  targetDept?: DepartmentCode | 'ALL';
  targetEventId?: string | 'ALL';
  channel: 'EMAIL' | 'SMS' | 'BOTH';
  recipientCount: number;
  timestamp: string;
  status: 'DELIVERED' | 'SENT' | 'QUEUED';
  senderRole: string;
}

export interface AnniversaryMilestone {
  year: string;
  title: string;
  phase: string;
  description: string;
  highlight: string;
  stats: string;
  iconName: string;
}

export type AdminRole = 'SUPER_ADMIN' | 'COORD_CSE' | 'COORD_ISE' | 'COORD_ECE' | 'COORD_EEE';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  dept?: DepartmentCode;
  avatar: string;
}

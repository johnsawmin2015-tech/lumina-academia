// Academic Year Types
export type AcademicYear = 1 | 2 | 3 | 4 | 5;
export type ClassSection = 'A' | 'B' | 'C';
export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

// Schedule Status
export type ScheduleStatus = 'draft' | 'pending' | 'approved' | 'locked';

// Time Slots
export interface TimeSlot {
  start: string;
  end: string;
  isLunch?: boolean;
}

// Schedule Entry
export interface Schedule {
  id: string;
  year: AcademicYear;
  classSection: ClassSection;
  day: Day;
  timeSlot: TimeSlot;
  subject: string;
  instructor: string;
  room: string;
  status: ScheduleStatus;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

// User Types
export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  year?: AcademicYear;
  classSection?: ClassSection;
}

// Auth Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Filter Types
export interface TimetableFilters {
  year: AcademicYear | 'all';
  classSection: ClassSection | 'all';
  day: Day | 'all';
  status?: ScheduleStatus | 'all';
}

// Form Types
export interface ScheduleFormData {
  year: AcademicYear;
  classSection: ClassSection;
  day: Day;
  startTime: string;
  endTime: string;
  subject: string;
  instructor: string;
  room: string;
}

// Stats Types
export interface DashboardStats {
  totalSchedules: number;
  pendingApprovals: number;
  approvedSchedules: number;
  lockedSchedules: number;
}

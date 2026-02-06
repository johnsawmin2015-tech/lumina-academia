import { AcademicYear, ClassSection, Day, TimeSlot } from '@/types';

// Academic Years
export const ACADEMIC_YEARS: AcademicYear[] = [1, 2, 3, 4, 5];

export const YEAR_LABELS: Record<AcademicYear, string> = {
  1: '1st Year',
  2: '2nd Year',
  3: '3rd Year',
  4: '4th Year',
  5: '5th Year',
};

// Class Sections
export const CLASS_SECTIONS: ClassSection[] = ['A', 'B', 'C'];

// Days
export const DAYS: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Time Slots (with lunch break)
export const TIME_SLOTS: TimeSlot[] = [
  { start: '09:00', end: '10:00' },
  { start: '10:00', end: '11:00' },
  { start: '11:00', end: '12:00' },
  { start: '12:00', end: '13:00', isLunch: true },
  { start: '13:00', end: '14:00' },
  { start: '14:00', end: '15:00' },
  { start: '15:00', end: '16:00' },
];

// Available time options for scheduling (excludes lunch)
export const SCHEDULABLE_TIMES = [
  '09:00', '10:00', '11:00', '13:00', '14:00', '15:00'
];

// Status Labels
export const STATUS_LABELS = {
  draft: 'Draft',
  pending: 'Pending Approval',
  approved: 'Approved',
  locked: 'Locked',
};

// Year Colors (for styling)
export const YEAR_COLORS: Record<AcademicYear, string> = {
  1: 'year-1-bg',
  2: 'year-2-bg',
  3: 'year-3-bg',
  4: 'year-4-bg',
  5: 'year-5-bg',
};

// Mock Credentials
export const MOCK_ADMIN_CREDENTIALS = {
  email: 'admin@university.edu',
  password: 'admin123',
};

export const MOCK_STUDENT_CREDENTIALS = {
  email: 'student@university.edu',
  password: 'student123',
};

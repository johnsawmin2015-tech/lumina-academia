import { Schedule, User, AcademicYear, ClassSection, Day, ScheduleStatus } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@university.edu',
    name: 'Dr. John',
    role: 'admin',
  },
  {
    id: 'student-1',
    email: 'student@university.edu',
    name: 'John Saw Min',
    role: 'student',
    year: 2,
    classSection: 'A',
  },
];

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 11);

// Mock Schedule Data
const createSchedule = (
  year: AcademicYear,
  classSection: ClassSection,
  day: Day,
  start: string,
  end: string,
  subject: string,
  instructor: string,
  room: string,
  status: ScheduleStatus = 'approved'
): Schedule => ({
  id: generateId(),
  year,
  classSection,
  day,
  timeSlot: { start, end },
  subject,
  instructor,
  room,
  status,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...(status === 'approved' || status === 'locked' ? {
    approvedBy: 'admin-1',
    approvedAt: new Date().toISOString(),
  } : {}),
});

export const mockSchedules: Schedule[] = [
  // Year 1, Class A - Monday
  createSchedule(1, 'A', 'Monday', '09:00', '10:00', 'Introduction to Programming', 'Prof. James Mitchell', 'Room 101', 'approved'),
  createSchedule(1, 'A', 'Monday', '10:00', '11:00', 'Calculus I', 'Dr. Sarah Chen', 'Room 102', 'approved'),
  createSchedule(1, 'A', 'Monday', '11:00', '12:00', 'Physics I', 'Dr. Robert Klein', 'Lab 201', 'approved'),
  createSchedule(1, 'A', 'Monday', '13:00', '14:00', 'English Composition', 'Prof. Emily Watson', 'Room 103', 'approved'),
  createSchedule(1, 'A', 'Monday', '14:00', '15:00', 'Computer Lab', 'TA Michael Brown', 'Computer Lab 1', 'locked'),

  // Year 1, Class A - Tuesday
  createSchedule(1, 'A', 'Tuesday', '09:00', '10:00', 'Discrete Mathematics', 'Prof. Alan Turing', 'Room 105', 'approved'),
  createSchedule(1, 'A', 'Tuesday', '10:00', '11:00', 'Introduction to Programming', 'Prof. James Mitchell', 'Room 101', 'pending'),
  createSchedule(1, 'A', 'Tuesday', '13:00', '14:00', 'Physics Lab', 'Dr. Robert Klein', 'Lab 202', 'approved'),

  // Year 1, Class B - Monday
  createSchedule(1, 'B', 'Monday', '09:00', '10:00', 'Calculus I', 'Dr. Sarah Chen', 'Room 104', 'approved'),
  createSchedule(1, 'B', 'Monday', '10:00', '11:00', 'Introduction to Programming', 'Prof. James Mitchell', 'Room 101', 'draft'),
  createSchedule(1, 'B', 'Monday', '14:00', '15:00', 'Chemistry I', 'Dr. Lisa Park', 'Lab 203', 'approved'),

  // Year 2, Class A - Monday
  createSchedule(2, 'A', 'Monday', '09:00', '10:00', 'Data Structures', 'Prof. Katherine Moore', 'Room 201', 'locked'),
  createSchedule(2, 'A', 'Monday', '10:00', '11:00', 'Linear Algebra', 'Dr. William Adams', 'Room 202', 'approved'),
  createSchedule(2, 'A', 'Monday', '13:00', '14:00', 'Object-Oriented Programming', 'Prof. David Liu', 'Computer Lab 2', 'approved'),
  createSchedule(2, 'A', 'Monday', '14:00', '15:00', 'Statistics', 'Dr. Anna Martinez', 'Room 203', 'pending'),

  // Year 2, Class A - Wednesday
  createSchedule(2, 'A', 'Wednesday', '09:00', '10:00', 'Database Systems', 'Prof. Richard Taylor', 'Room 301', 'approved'),
  createSchedule(2, 'A', 'Wednesday', '11:00', '12:00', 'Web Development', 'TA Jennifer White', 'Computer Lab 3', 'draft'),
  createSchedule(2, 'A', 'Wednesday', '13:00', '14:00', 'Data Structures Lab', 'Prof. Katherine Moore', 'Computer Lab 2', 'approved'),

  // Year 3, Class A - Monday
  createSchedule(3, 'A', 'Monday', '09:00', '10:00', 'Algorithms', 'Prof. Charles Darwin', 'Room 301', 'locked'),
  createSchedule(3, 'A', 'Monday', '10:00', '11:00', 'Operating Systems', 'Dr. Grace Hopper', 'Room 302', 'approved'),
  createSchedule(3, 'A', 'Monday', '11:00', '12:00', 'Computer Networks', 'Prof. Tim Berners', 'Lab 301', 'approved'),
  createSchedule(3, 'A', 'Monday', '13:00', '14:00', 'Software Engineering', 'Dr. Frederick Brooks', 'Room 303', 'approved'),
  createSchedule(3, 'A', 'Monday', '14:00', '15:00', 'Machine Learning Intro', 'Prof. Andrew Ng', 'Computer Lab 4', 'pending'),

  // Year 3, Class A - Thursday
  createSchedule(3, 'A', 'Thursday', '09:00', '10:00', 'Artificial Intelligence', 'Prof. John McCarthy', 'Room 401', 'approved'),
  createSchedule(3, 'A', 'Thursday', '10:00', '11:00', 'Algorithms Lab', 'Prof. Charles Darwin', 'Computer Lab 5', 'approved'),

  // Year 4, Class A - Tuesday
  createSchedule(4, 'A', 'Tuesday', '09:00', '10:00', 'Distributed Systems', 'Prof. Leslie Lamport', 'Room 401', 'locked'),
  createSchedule(4, 'A', 'Tuesday', '10:00', '11:00', 'Cloud Computing', 'Dr. Werner Vogels', 'Room 402', 'approved'),
  createSchedule(4, 'A', 'Tuesday', '13:00', '14:00', 'Cybersecurity', 'Prof. Bruce Schneier', 'Lab 401', 'approved'),
  createSchedule(4, 'A', 'Tuesday', '15:00', '16:00', 'Project Seminar', 'Dr. Victoria Sterling', 'Seminar Room A', 'pending'),

  // Year 5, Class A - Friday
  createSchedule(5, 'A', 'Friday', '09:00', '10:00', 'Advanced Machine Learning', 'Prof. Yann LeCun', 'Room 501', 'locked'),
  createSchedule(5, 'A', 'Friday', '10:00', '11:00', 'Research Methods', 'Dr. Victoria Sterling', 'Room 502', 'approved'),
  createSchedule(5, 'A', 'Friday', '13:00', '14:00', 'Thesis Workshop', 'Prof. Committee', 'Seminar Room B', 'approved'),
  createSchedule(5, 'A', 'Friday', '14:00', '16:00', 'Industry Seminar', 'Guest Speakers', 'Auditorium', 'draft'),

  // Year 5, Class B - Friday
  createSchedule(5, 'B', 'Friday', '09:00', '10:00', 'Deep Learning', 'Prof. Geoffrey Hinton', 'Room 503', 'approved'),
  createSchedule(5, 'B', 'Friday', '11:00', '12:00', 'Ethics in AI', 'Dr. Timnit Gebru', 'Room 504', 'approved'),

  // Year 3, Class C - Wednesday
  createSchedule(3, 'C', 'Wednesday', '09:00', '10:00', 'Computer Graphics', 'Prof. Ed Catmull', 'Computer Lab 6', 'approved'),
  createSchedule(3, 'C', 'Wednesday', '10:00', '11:00', 'Game Development', 'TA John Carmack', 'Computer Lab 6', 'pending'),
  createSchedule(3, 'C', 'Wednesday', '14:00', '15:00', 'Mobile Development', 'Prof. Craig Federighi', 'Room 305', 'draft'),
];

// Helper to get schedules from localStorage or use mock data
export const getStoredSchedules = (): Schedule[] => {
  const stored = localStorage.getItem('academic_schedules');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('academic_schedules', JSON.stringify(mockSchedules));
  return mockSchedules;
};

// Helper to save schedules to localStorage
export const saveSchedules = (schedules: Schedule[]) => {
  localStorage.setItem('academic_schedules', JSON.stringify(schedules));
};

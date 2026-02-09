import { Schedule, AcademicYear, ClassSection, Day, ScheduleStatus } from '@/types';
import { DAYS, SCHEDULABLE_TIMES } from '@/lib/constants';
import { detectConflicts } from '@/lib/conflictDetection';

// Curriculum per year
const CURRICULUM: Record<AcademicYear, { subject: string; instructor: string }[]> = {
  1: [
    { subject: 'Introduction to Programming', instructor: 'Prof. James Mitchell' },
    { subject: 'Calculus I', instructor: 'Dr. Sarah Chen' },
    { subject: 'Physics I', instructor: 'Dr. Robert Klein' },
    { subject: 'English Composition', instructor: 'Prof. Emily Watson' },
    { subject: 'Discrete Mathematics', instructor: 'Prof. Alan Turing' },
    { subject: 'Computer Lab', instructor: 'TA Michael Brown' },
  ],
  2: [
    { subject: 'Data Structures', instructor: 'Prof. Katherine Moore' },
    { subject: 'Linear Algebra', instructor: 'Dr. William Adams' },
    { subject: 'Object-Oriented Programming', instructor: 'Prof. David Liu' },
    { subject: 'Statistics', instructor: 'Dr. Anna Martinez' },
    { subject: 'Database Systems', instructor: 'Prof. Richard Taylor' },
    { subject: 'Web Development', instructor: 'TA Jennifer White' },
  ],
  3: [
    { subject: 'Algorithms', instructor: 'Prof. Charles Darwin' },
    { subject: 'Operating Systems', instructor: 'Dr. Grace Hopper' },
    { subject: 'Computer Networks', instructor: 'Prof. Tim Berners' },
    { subject: 'Software Engineering', instructor: 'Dr. Frederick Brooks' },
    { subject: 'Machine Learning Intro', instructor: 'Prof. Andrew Ng' },
    { subject: 'Computer Graphics', instructor: 'Prof. Ed Catmull' },
  ],
  4: [
    { subject: 'Distributed Systems', instructor: 'Prof. Leslie Lamport' },
    { subject: 'Cloud Computing', instructor: 'Dr. Werner Vogels' },
    { subject: 'Cybersecurity', instructor: 'Prof. Bruce Schneier' },
    { subject: 'Artificial Intelligence', instructor: 'Prof. John McCarthy' },
    { subject: 'Project Seminar', instructor: 'Dr. John' },
    { subject: 'Mobile Development', instructor: 'Prof. Craig Federighi' },
  ],
  5: [
    { subject: 'Advanced Machine Learning', instructor: 'Prof. Yann LeCun' },
    { subject: 'Research Methods', instructor: 'Dr. John' },
    { subject: 'Thesis Workshop', instructor: 'Prof. Committee' },
    { subject: 'Deep Learning', instructor: 'Prof. Geoffrey Hinton' },
    { subject: 'Ethics in AI', instructor: 'Dr. Timnit Gebru' },
    { subject: 'Industry Seminar', instructor: 'Guest Speakers' },
  ],
};

const ROOMS = [
  'Room 101', 'Room 102', 'Room 103', 'Room 104', 'Room 105',
  'Room 201', 'Room 202', 'Room 203', 'Room 301', 'Room 302',
  'Room 303', 'Room 401', 'Room 402', 'Room 501', 'Room 502',
  'Lab 201', 'Lab 202', 'Lab 301', 'Computer Lab 1', 'Computer Lab 2',
  'Computer Lab 3', 'Computer Lab 4', 'Seminar Room A', 'Seminar Room B',
];

const generateId = () => Math.random().toString(36).substring(2, 11);

export function autoGenerateSchedule(
  year: AcademicYear,
  classSection: ClassSection,
  existingSchedules: Schedule[] = []
): Schedule[] {
  const curriculum = CURRICULUM[year];
  const generated: Schedule[] = [];
  let subjectIndex = 0;
  let roomIndex = 0;

  for (const day of DAYS) {
    for (const startTime of SCHEDULABLE_TIMES) {
      if (subjectIndex >= curriculum.length) break;

      const endHour = parseInt(startTime.split(':')[0]) + 1;
      const endTime = `${endHour.toString().padStart(2, '0')}:00`;
      const room = ROOMS[(roomIndex + year * 3) % ROOMS.length];

      const candidate = {
        day: day as Day,
        startTime,
        endTime,
        room,
        instructor: curriculum[subjectIndex].instructor,
        year,
        classSection,
      };

      // Check for conflicts against existing + already generated
      const allExisting = [...existingSchedules, ...generated];
      const conflicts = detectConflicts(candidate, allExisting);

      if (conflicts.length === 0) {
        generated.push({
          id: generateId(),
          year,
          classSection,
          day: day as Day,
          timeSlot: { start: startTime, end: endTime },
          subject: curriculum[subjectIndex].subject,
          instructor: curriculum[subjectIndex].instructor,
          room,
          status: 'draft' as ScheduleStatus,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        subjectIndex++;
        roomIndex++;
      } else {
        // Try next room
        roomIndex++;
      }

      if (subjectIndex >= curriculum.length) break;
    }
    if (subjectIndex >= curriculum.length) break;
  }

  return generated;
}

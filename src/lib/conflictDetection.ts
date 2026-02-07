import { Schedule, Day, AcademicYear, ClassSection } from '@/types';

export type ConflictType = 'room' | 'instructor' | 'class';

export interface ScheduleConflict {
  type: ConflictType;
  conflictingSchedule: Schedule;
  message: string;
}

interface TimeRange {
  start: number;
  end: number;
}

/**
 * Converts time string (HH:MM) to minutes since midnight
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Checks if two time ranges overlap
 */
function timeRangesOverlap(range1: TimeRange, range2: TimeRange): boolean {
  return range1.start < range2.end && range1.end > range2.start;
}

/**
 * Detects all conflicts for a schedule entry against existing schedules
 */
export function detectConflicts(
  scheduleData: {
    day: Day;
    startTime: string;
    endTime: string;
    room: string;
    instructor: string;
    year: AcademicYear;
    classSection: ClassSection;
  },
  existingSchedules: Schedule[],
  excludeScheduleId?: string
): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];
  
  const newTimeRange: TimeRange = {
    start: timeToMinutes(scheduleData.startTime),
    end: timeToMinutes(scheduleData.endTime),
  };

  // Filter to same day schedules only
  const sameDaySchedules = existingSchedules.filter(
    (s) => s.day === scheduleData.day && s.id !== excludeScheduleId
  );

  for (const schedule of sameDaySchedules) {
    const existingTimeRange: TimeRange = {
      start: timeToMinutes(schedule.timeSlot.start),
      end: timeToMinutes(schedule.timeSlot.end),
    };

    // Only check for conflicts if times overlap
    if (!timeRangesOverlap(newTimeRange, existingTimeRange)) {
      continue;
    }

    // Room conflict
    if (
      scheduleData.room.toLowerCase().trim() === schedule.room.toLowerCase().trim()
    ) {
      conflicts.push({
        type: 'room',
        conflictingSchedule: schedule,
        message: `Room "${schedule.room}" is already booked for ${schedule.subject} (${schedule.timeSlot.start}-${schedule.timeSlot.end})`,
      });
    }

    // Instructor conflict
    if (
      scheduleData.instructor.toLowerCase().trim() === schedule.instructor.toLowerCase().trim()
    ) {
      conflicts.push({
        type: 'instructor',
        conflictingSchedule: schedule,
        message: `${schedule.instructor} is already teaching ${schedule.subject} (${schedule.timeSlot.start}-${schedule.timeSlot.end})`,
      });
    }

    // Class conflict (same year + section)
    if (
      scheduleData.year === schedule.year &&
      scheduleData.classSection === schedule.classSection
    ) {
      conflicts.push({
        type: 'class',
        conflictingSchedule: schedule,
        message: `Year ${schedule.year} Class ${schedule.classSection} already has ${schedule.subject} scheduled (${schedule.timeSlot.start}-${schedule.timeSlot.end})`,
      });
    }
  }

  return conflicts;
}

/**
 * Returns a severity level for the conflict list
 */
export function getConflictSeverity(conflicts: ScheduleConflict[]): 'none' | 'warning' | 'error' {
  if (conflicts.length === 0) return 'none';
  
  // Class conflicts are always errors (students can't be in two places)
  if (conflicts.some((c) => c.type === 'class')) return 'error';
  
  // Room and instructor conflicts are errors too
  if (conflicts.some((c) => c.type === 'room' || c.type === 'instructor')) return 'error';
  
  return 'warning';
}

/**
 * Groups conflicts by type for display
 */
export function groupConflictsByType(conflicts: ScheduleConflict[]): Record<ConflictType, ScheduleConflict[]> {
  return {
    room: conflicts.filter((c) => c.type === 'room'),
    instructor: conflicts.filter((c) => c.type === 'instructor'),
    class: conflicts.filter((c) => c.type === 'class'),
  };
}

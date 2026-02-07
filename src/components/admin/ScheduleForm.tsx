import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Schedule, ScheduleFormData, AcademicYear, ClassSection, Day } from '@/types';
import { ACADEMIC_YEARS, CLASS_SECTIONS, DAYS, SCHEDULABLE_TIMES, YEAR_LABELS } from '@/lib/constants';
import { detectConflicts, ScheduleConflict, getConflictSeverity } from '@/lib/conflictDetection';
import { getStoredSchedules } from '@/data/mockData';
import { ConflictWarning } from './ConflictWarning';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const scheduleSchema = z.object({
  year: z.number().min(1).max(5),
  classSection: z.enum(['A', 'B', 'C']),
  day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  subject: z.string().min(1, 'Subject is required').max(100),
  instructor: z.string().min(1, 'Instructor is required').max(100),
  room: z.string().min(1, 'Room is required').max(50),
}).refine((data) => {
  const startHour = parseInt(data.startTime.split(':')[0]);
  const endHour = parseInt(data.endTime.split(':')[0]);
  return endHour > startHour;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
}).refine((data) => {
  const startHour = parseInt(data.startTime.split(':')[0]);
  const endHour = parseInt(data.endTime.split(':')[0]);
  // Check lunch overlap
  return !(startHour < 13 && endHour > 12);
}, {
  message: 'Schedule cannot overlap with lunch break (12:00-13:00)',
  path: ['startTime'],
});

interface ScheduleFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduleFormData) => void;
  initialData?: Schedule;
  mode: 'create' | 'edit';
}

export function ScheduleForm({ open, onClose, onSubmit, initialData, mode }: ScheduleFormProps) {
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);
  const [existingSchedules, setExistingSchedules] = useState<Schedule[]>([]);

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: initialData
      ? {
          year: initialData.year,
          classSection: initialData.classSection,
          day: initialData.day,
          startTime: initialData.timeSlot.start,
          endTime: initialData.timeSlot.end,
          subject: initialData.subject,
          instructor: initialData.instructor,
          room: initialData.room,
        }
      : {
          year: 1,
          classSection: 'A',
          day: 'Monday',
          startTime: '09:00',
          endTime: '10:00',
          subject: '',
          instructor: '',
          room: '',
        },
  });

  // Load existing schedules when dialog opens
  useEffect(() => {
    if (open) {
      setExistingSchedules(getStoredSchedules());
      setConflicts([]);
    }
  }, [open]);

  // Watch form values for real-time conflict detection
  const watchedValues = form.watch();

  useEffect(() => {
    if (!open) return;
    
    const { day, startTime, endTime, room, instructor, year, classSection } = watchedValues;
    
    // Only check if we have all required fields
    if (day && startTime && endTime && room && instructor && year && classSection) {
      const detectedConflicts = detectConflicts(
        {
          day: day as Day,
          startTime,
          endTime,
          room,
          instructor,
          year: year as AcademicYear,
          classSection: classSection as ClassSection,
        },
        existingSchedules,
        initialData?.id // Exclude current schedule when editing
      );
      setConflicts(detectedConflicts);
    } else {
      setConflicts([]);
    }
  }, [watchedValues, existingSchedules, initialData?.id, open]);

  const conflictSeverity = useMemo(() => getConflictSeverity(conflicts), [conflicts]);
  const hasBlockingConflicts = conflictSeverity === 'error';

  const handleSubmit = (data: ScheduleFormData) => {
    if (hasBlockingConflicts) {
      return; // Prevent submission with conflicts
    }
    onSubmit(data);
    form.reset();
    onClose();
  };

  const handleClose = () => {
    form.reset();
    setConflicts([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === 'create' ? 'Create New Schedule' : 'Edit Schedule'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Conflict Warning */}
            {conflicts.length > 0 && (
              <ConflictWarning 
                conflicts={conflicts} 
                onDismiss={() => setConflicts([])}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ACADEMIC_YEARS.map((year) => (
                          <SelectItem key={year} value={String(year)}>
                            {YEAR_LABELS[year]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="classSection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Section</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CLASS_SECTIONS.map((section) => (
                          <SelectItem key={section} value={section}>
                            Class {section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DAYS.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Start time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SCHEDULABLE_TIMES.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="End time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'].map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Introduction to Programming" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instructor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructor</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Prof. John Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="room"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Room 101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={hasBlockingConflicts}
                className={hasBlockingConflicts ? 'opacity-50 cursor-not-allowed' : ''}
              >
                {mode === 'create' ? 'Create Schedule' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

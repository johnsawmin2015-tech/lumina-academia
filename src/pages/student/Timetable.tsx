import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { TimetableView } from '@/components/timetable/TimetableView';
import { Schedule } from '@/types';
import { getStoredSchedules } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { staggerContainerVariants, staggerItemVariants } from '@/components/layout/PageTransition';
import { Calendar, Clock, BookOpen } from 'lucide-react';

export default function StudentTimetable() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const allSchedules = getStoredSchedules();
    const visibleSchedules = allSchedules.filter(
      (s) => s.status === 'approved' || s.status === 'locked'
    );
    setSchedules(visibleSchedules);
  }, []);

  const mySchedules = schedules.filter(
    (s) => s.year === user?.year && s.classSection === user?.classSection
  );

  return (
    <StudentLayout>
      <motion.div
        variants={staggerContainerVariants}
        initial="initial"
        animate="enter"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={staggerItemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold text-foreground tracking-tight">My Timetable</h1>
            <p className="text-muted-foreground mt-2">
              {user?.year && user?.classSection
                ? `Year ${user.year} • Class ${user.classSection} — Academic Year 2026`
                : 'View and filter your class schedules'}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{mySchedules.length} classes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <span>{mySchedules.reduce((a, s) => {
                const h = parseInt(s.timeSlot.end.split(':')[0]) - parseInt(s.timeSlot.start.split(':')[0]);
                return a + h;
              }, 0)}h weekly</span>
            </div>
          </div>
        </motion.div>

        {/* Timetable View */}
        <motion.div variants={staggerItemVariants}>
          <TimetableView
            schedules={schedules}
            isAdmin={false}
            defaultYear={user?.year || 1}
            defaultClass={user?.classSection || 'A'}
          />
        </motion.div>
      </motion.div>
    </StudentLayout>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { TimetableView } from '@/components/timetable/TimetableView';
import { Schedule } from '@/types';
import { getStoredSchedules } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { staggerContainerVariants, staggerItemVariants } from '@/components/layout/PageTransition';
import { Calendar, Clock, BookOpen, Zap, MapPin, User } from 'lucide-react';

function getUpcomingClass(schedules: Schedule[]): Schedule | null {
  const now = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = dayNames[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todaySchedules = schedules
    .filter(s => s.day === today)
    .map(s => {
      const [h, m] = s.timeSlot.start.split(':').map(Number);
      return { ...s, startMinutes: h * 60 + m };
    })
    .filter(s => s.startMinutes > currentMinutes)
    .sort((a, b) => a.startMinutes - b.startMinutes);

  return todaySchedules[0] || null;
}

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

  const upcoming = useMemo(() => getUpcomingClass(mySchedules), [mySchedules]);

  const totalHours = mySchedules.reduce((a, s) => {
    const h = parseInt(s.timeSlot.end.split(':')[0]) - parseInt(s.timeSlot.start.split(':')[0]);
    return a + h;
  }, 0);

  const uniqueSubjects = new Set(mySchedules.map(s => s.subject)).size;

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
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>{mySchedules.length} classes</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>{totalHours}h weekly</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span>{uniqueSubjects} subjects</span>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Class Card */}
        <AnimatePresence>
          {upcoming && (
            <motion.div
              variants={staggerItemVariants}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="luxury-card p-5 bg-gradient-to-r from-primary/5 via-primary/8 to-primary/3 border-primary/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Zap className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-primary uppercase tracking-wider">Up Next</p>
                  <h3 className="font-display text-lg font-semibold text-foreground">{upcoming.subject}</h3>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{upcoming.timeSlot.start} – {upcoming.timeSlot.end}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span>{upcoming.instructor}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{upcoming.room}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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

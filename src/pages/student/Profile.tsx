import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, GraduationCap, Users, Calendar, Clock, BookOpen } from 'lucide-react';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getStoredSchedules } from '@/data/mockData';
import { Schedule } from '@/types';
import { YEAR_LABELS } from '@/lib/constants';
import { staggerContainerVariants, staggerItemVariants } from '@/components/layout/PageTransition';

export default function StudentProfile() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const allSchedules = getStoredSchedules();
    // Filter to student's own schedules
    const mySchedules = allSchedules.filter(
      (s) => s.year === user?.year && s.classSection === user?.classSection
    );
    setSchedules(mySchedules);
  }, [user]);

  // Calculate statistics
  const totalClasses = schedules.length;
  const totalHours = schedules.reduce((acc, s) => {
    const start = parseInt(s.timeSlot.start.split(':')[0]);
    const end = parseInt(s.timeSlot.end.split(':')[0]);
    return acc + (end - start);
  }, 0);
  const uniqueInstructors = new Set(schedules.map((s) => s.instructor)).size;
  const uniqueSubjects = new Set(schedules.map((s) => s.subject)).size;

  // Get initials for avatar
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'ST';

  return (
    <StudentLayout>
      <motion.div
        variants={staggerContainerVariants}
        initial="initial"
        animate="enter"
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Profile Header */}
        <motion.div
          variants={staggerItemVariants}
          className="luxury-card overflow-hidden"
        >
          <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20" />
          
          <div className="px-6 pb-6 -mt-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold border-4 border-background shadow-lg">
                {initials}
              </div>
              
              {/* Name & Email */}
              <div className="text-center sm:text-left flex-1">
                <h1 className="font-display text-2xl font-bold text-foreground">{user?.name}</h1>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground mt-1">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user?.email}</span>
                </div>
              </div>
              
              {/* Role Badge */}
              <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Student
              </div>
            </div>
          </div>
        </motion.div>

        {/* Academic Information */}
        <motion.div
          variants={staggerItemVariants}
          className="luxury-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">Academic Information</h2>
              <p className="text-sm text-muted-foreground">UCS Mandalay · 2026</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Academic Year</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {user?.year ? YEAR_LABELS[user.year] : 'N/A'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Class Section</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                Class {user?.classSection || 'N/A'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <User className="h-4 w-4" />
                <span className="text-sm">Student ID</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                KPTM-11125
              </p>
            </div>
          </div>
        </motion.div>

        {/* Schedule Summary */}
        <motion.div
          variants={staggerItemVariants}
          className="luxury-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-status-approved/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-status-approved" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">My Schedule Summary</h2>
              <p className="text-sm text-muted-foreground">Overview of your weekly classes</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
            >
              <Calendar className="h-6 w-6 text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">{totalClasses}</p>
              <p className="text-sm text-muted-foreground">Total Classes</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-lg bg-gradient-to-br from-status-approved/10 to-status-approved/5 border border-status-approved/20"
            >
              <Clock className="h-6 w-6 text-status-approved mb-2" />
              <p className="text-2xl font-bold text-foreground">{totalHours}</p>
              <p className="text-sm text-muted-foreground">Weekly Hours</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-lg bg-gradient-to-br from-status-pending/10 to-status-pending/5 border border-status-pending/20"
            >
              <User className="h-6 w-6 text-status-pending mb-2" />
              <p className="text-2xl font-bold text-foreground">{uniqueInstructors}</p>
              <p className="text-sm text-muted-foreground">Instructors</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-lg bg-gradient-to-br from-status-locked/10 to-status-locked/5 border border-status-locked/20"
            >
              <BookOpen className="h-6 w-6 text-status-locked mb-2" />
              <p className="text-2xl font-bold text-foreground">{uniqueSubjects}</p>
              <p className="text-sm text-muted-foreground">Subjects</p>
            </motion.div>
          </div>

          {schedules.length === 0 && (
            <div className="mt-6 p-6 rounded-lg bg-muted/20 text-center">
              <p className="text-muted-foreground">
                No schedules found for your class. Check back later for updates.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </StudentLayout>
  );
}

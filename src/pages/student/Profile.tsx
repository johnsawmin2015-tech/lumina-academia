import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, GraduationCap, Users, Calendar, Clock, BookOpen, TrendingUp, MapPin } from 'lucide-react';
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
    const mySchedules = allSchedules.filter(
      (s) => s.year === user?.year && s.classSection === user?.classSection
    );
    setSchedules(mySchedules);
  }, [user]);

  const totalClasses = schedules.length;
  const totalHours = schedules.reduce((acc, s) => {
    const start = parseInt(s.timeSlot.start.split(':')[0]);
    const end = parseInt(s.timeSlot.end.split(':')[0]);
    return acc + (end - start);
  }, 0);
  const uniqueInstructors = new Set(schedules.map((s) => s.instructor)).size;
  const uniqueSubjects = new Set(schedules.map((s) => s.subject)).size;
  const uniqueRooms = new Set(schedules.map((s) => s.room)).size;

  // Day distribution
  const dayDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    schedules.forEach(s => {
      counts[s.day] = (counts[s.day] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [schedules]);

  const busiestDay = dayDistribution[0];

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
              <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold border-4 border-background shadow-lg">
                {initials}
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <h1 className="font-display text-2xl font-bold text-foreground">{user?.name}</h1>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground mt-1">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user?.email}</span>
                </div>
              </div>
              
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
              <h2 className="font-display text-lg font-semibold text-foreground">My Schedule Summary</h2>
              <p className="text-sm text-muted-foreground">Overview of your weekly classes</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { icon: Calendar, value: totalClasses, label: 'Total Classes', color: 'primary' },
              { icon: Clock, value: totalHours, label: 'Weekly Hours', color: 'status-approved' },
              { icon: User, value: uniqueInstructors, label: 'Instructors', color: 'status-pending' },
              { icon: BookOpen, value: uniqueSubjects, label: 'Subjects', color: 'status-locked' },
              { icon: MapPin, value: uniqueRooms, label: 'Rooms', color: 'accent' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg bg-gradient-to-br from-${stat.color}/10 to-${stat.color}/5 border border-${stat.color}/20`}
              >
                <stat.icon className={`h-5 w-5 text-${stat.color} mb-2`} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Busiest Day Insight */}
          {busiestDay && (
            <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10 flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Your busiest day is <span className="font-semibold text-foreground">{busiestDay[0]}</span> with {busiestDay[1]} classes scheduled.
              </p>
            </div>
          )}

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

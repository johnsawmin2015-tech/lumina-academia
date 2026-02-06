import React, { useState, useEffect } from 'react';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { TimetableView } from '@/components/timetable/TimetableView';
import { Schedule } from '@/types';
import { getStoredSchedules } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentTimetable() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Load schedules - only show approved and locked for students
    const allSchedules = getStoredSchedules();
    const visibleSchedules = allSchedules.filter(
      (s) => s.status === 'approved' || s.status === 'locked'
    );
    setSchedules(visibleSchedules);
  }, []);

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Timetable</h1>
          <p className="text-muted-foreground mt-1">
            {user?.year && user?.classSection
              ? `Year ${user.year} • Class ${user.classSection}`
              : 'View and filter your class schedules'}
          </p>
        </div>

        {/* Timetable View */}
        <TimetableView
          schedules={schedules}
          isAdmin={false}
          defaultYear={user?.year || 1}
          defaultClass={user?.classSection || 'A'}
        />
      </div>
    </StudentLayout>
  );
}

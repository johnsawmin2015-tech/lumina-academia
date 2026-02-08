import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, Lock, Plus, TrendingUp } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatsCard } from '@/components/admin/StatsCard';
import { ScheduleCard } from '@/components/timetable/ScheduleCard';
import { ScheduleForm } from '@/components/admin/ScheduleForm';
import { Schedule, ScheduleFormData, DashboardStats } from '@/types';
import { getStoredSchedules, saveSchedules } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { staggerContainerVariants, staggerItemVariants } from '@/components/layout/PageTransition';

export default function AdminDashboard() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setSchedules(getStoredSchedules());
  }, []);

  const stats: DashboardStats = {
    totalSchedules: schedules.length,
    pendingApprovals: schedules.filter((s) => s.status === 'pending').length,
    approvedSchedules: schedules.filter((s) => s.status === 'approved').length,
    lockedSchedules: schedules.filter((s) => s.status === 'locked').length,
  };

  const recentSchedules = schedules
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  const handleCreateSchedule = (data: ScheduleFormData) => {
    const newSchedule: Schedule = {
      id: Math.random().toString(36).substring(2, 11),
      year: data.year,
      classSection: data.classSection,
      day: data.day,
      timeSlot: { start: data.startTime, end: data.endTime },
      subject: data.subject,
      instructor: data.instructor,
      room: data.room,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...schedules, newSchedule];
    setSchedules(updated);
    saveSchedules(updated);

    toast({
      title: 'Schedule Created',
      description: `${data.subject} has been added as a draft.`,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-foreground tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Overview of your academic schedule management
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="gap-2 btn-luxury shine">
            <Plus className="h-4 w-4" />
            New Schedule
          </Button>
        </div>

        {/* Stats Grid with stagger animation */}
        <motion.div 
          variants={staggerContainerVariants}
          initial="initial"
          animate="enter"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div variants={staggerItemVariants}>
            <StatsCard
              title="Total Schedules"
              value={stats.totalSchedules}
              icon={Calendar}
              description="All schedule entries"
              variant="default"
            />
          </motion.div>
          <motion.div variants={staggerItemVariants}>
            <StatsCard
              title="Pending Approvals"
              value={stats.pendingApprovals}
              icon={Clock}
              description="Awaiting authorization"
              variant="warning"
            />
          </motion.div>
          <motion.div variants={staggerItemVariants}>
            <StatsCard
              title="Approved"
              value={stats.approvedSchedules}
              icon={CheckCircle}
              description="Ready to lock"
              variant="success"
            />
          </motion.div>
          <motion.div variants={staggerItemVariants}>
            <StatsCard
              title="Locked"
              value={stats.lockedSchedules}
              icon={Lock}
              description="Finalized schedules"
              variant="primary"
            />
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 luxury-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground">Recent Schedules</h2>
              <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
                <a href="/admin/schedules">View All</a>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentSchedules.map((schedule) => (
                <ScheduleCard key={schedule.id} schedule={schedule} compact />
              ))}
            </div>

            {recentSchedules.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No schedules yet. Create your first schedule to get started.
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="luxury-card p-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-8">Quick Stats</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <span className="text-sm text-muted-foreground">Draft Schedules</span>
                <span className="font-semibold text-foreground">
                  {schedules.filter((s) => s.status === 'draft').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <span className="text-sm text-muted-foreground">Active Years</span>
                <span className="font-semibold text-foreground">
                  {new Set(schedules.map((s) => s.year)).size}/5
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <span className="text-sm text-muted-foreground">Class Sections</span>
                <span className="font-semibold text-foreground">
                  {new Set(schedules.map((s) => s.classSection)).size}/3
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <span className="text-sm text-muted-foreground">Instructors</span>
                <span className="font-semibold text-foreground">
                  {new Set(schedules.map((s) => s.instructor)).size}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-status-approved" />
                <span>System running smoothly</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Schedule Form */}
      <ScheduleForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateSchedule}
        mode="create"
      />
    </AdminLayout>
  );
}

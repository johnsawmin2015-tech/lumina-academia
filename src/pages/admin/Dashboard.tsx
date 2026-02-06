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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Overview of your academic schedule management
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Schedule
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Schedules"
            value={stats.totalSchedules}
            icon={Calendar}
            description="All schedule entries"
            variant="default"
          />
          <StatsCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon={Clock}
            description="Awaiting authorization"
            variant="warning"
          />
          <StatsCard
            title="Approved"
            value={stats.approvedSchedules}
            icon={CheckCircle}
            description="Ready to lock"
            variant="success"
          />
          <StatsCard
            title="Locked"
            value={stats.lockedSchedules}
            icon={Lock}
            description="Finalized schedules"
            variant="primary"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Recent Schedules</h2>
              <Button variant="ghost" size="sm" asChild>
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
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Quick Stats</h2>
            
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

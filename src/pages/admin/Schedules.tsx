import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { TimetableView } from '@/components/timetable/TimetableView';
import { ScheduleForm } from '@/components/admin/ScheduleForm';
import { Schedule, ScheduleFormData } from '@/types';
import { getStoredSchedules, saveSchedules } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function AdminSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [deletingSchedule, setDeletingSchedule] = useState<Schedule | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setSchedules(getStoredSchedules());
  }, []);

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
      description: `${data.subject} has been added.`,
    });
  };

  const handleEditSchedule = (data: ScheduleFormData) => {
    if (!editingSchedule) return;

    const updated = schedules.map((s) =>
      s.id === editingSchedule.id
        ? {
            ...s,
            year: data.year,
            classSection: data.classSection,
            day: data.day,
            timeSlot: { start: data.startTime, end: data.endTime },
            subject: data.subject,
            instructor: data.instructor,
            room: data.room,
            updatedAt: new Date().toISOString(),
          }
        : s
    );

    setSchedules(updated);
    saveSchedules(updated);
    setEditingSchedule(null);

    toast({
      title: 'Schedule Updated',
      description: `${data.subject} has been updated.`,
    });
  };

  const handleApprove = (schedule: Schedule) => {
    const updated = schedules.map((s) =>
      s.id === schedule.id
        ? {
            ...s,
            status: 'approved' as const,
            approvedBy: 'admin-1',
            approvedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : s
    );

    setSchedules(updated);
    saveSchedules(updated);

    toast({
      title: 'Schedule Approved',
      description: `${schedule.subject} has been approved.`,
    });
  };

  const handleLock = (schedule: Schedule) => {
    const updated = schedules.map((s) =>
      s.id === schedule.id
        ? {
            ...s,
            status: 'locked' as const,
            updatedAt: new Date().toISOString(),
          }
        : s
    );

    setSchedules(updated);
    saveSchedules(updated);

    toast({
      title: 'Schedule Locked',
      description: `${schedule.subject} has been locked and cannot be modified.`,
    });
  };

  const handleDelete = () => {
    if (!deletingSchedule) return;

    const updated = schedules.filter((s) => s.id !== deletingSchedule.id);
    setSchedules(updated);
    saveSchedules(updated);
    setDeletingSchedule(null);

    toast({
      title: 'Schedule Deleted',
      description: `${deletingSchedule.subject} has been removed.`,
      variant: 'destructive',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Schedules</h1>
            <p className="text-muted-foreground mt-1">
              Manage and organize all academic schedules
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Schedule
          </Button>
        </div>

        {/* Timetable View */}
        <TimetableView
          schedules={schedules}
          onEdit={(schedule) => setEditingSchedule(schedule)}
          onApprove={handleApprove}
          onLock={handleLock}
          onDelete={(schedule) => setDeletingSchedule(schedule)}
          isAdmin={true}
        />
      </div>

      {/* Create Schedule Form */}
      <ScheduleForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateSchedule}
        mode="create"
      />

      {/* Edit Schedule Form */}
      <ScheduleForm
        open={!!editingSchedule}
        onClose={() => setEditingSchedule(null)}
        onSubmit={handleEditSchedule}
        initialData={editingSchedule || undefined}
        mode="edit"
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingSchedule} onOpenChange={() => setDeletingSchedule(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingSchedule?.subject}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ApprovalList } from '@/components/admin/ApprovalList';
import { Schedule } from '@/types';
import { getStoredSchedules, saveSchedules } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function AdminApprovals() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setSchedules(getStoredSchedules());
  }, []);

  const handleApprove = (schedule: Schedule, notes?: string) => {
    const updated = schedules.map((s) =>
      s.id === schedule.id
        ? {
            ...s,
            status: 'approved' as const,
            approvedBy: 'admin-1',
            approvedAt: new Date().toISOString(),
            notes: notes || s.notes,
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

  const handleReject = (schedule: Schedule, notes?: string) => {
    const updated = schedules.map((s) =>
      s.id === schedule.id
        ? {
            ...s,
            status: 'draft' as const,
            notes: notes || s.notes,
            updatedAt: new Date().toISOString(),
          }
        : s
    );

    setSchedules(updated);
    saveSchedules(updated);

    toast({
      title: 'Schedule Rejected',
      description: `${schedule.subject} has been returned to draft.`,
      variant: 'destructive',
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
      description: `${schedule.subject} has been locked.`,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Approvals</h1>
          <p className="text-muted-foreground mt-1">
            Review and authorize pending schedule requests
          </p>
        </div>

        {/* Approval List */}
        <ApprovalList
          schedules={schedules}
          onApprove={handleApprove}
          onReject={handleReject}
          onLock={handleLock}
        />
      </div>
    </AdminLayout>
  );
}

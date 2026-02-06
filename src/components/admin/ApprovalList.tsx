import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Lock, Calendar, User, MapPin } from 'lucide-react';
import { Schedule } from '@/types';
import { YEAR_LABELS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface ApprovalListProps {
  schedules: Schedule[];
  onApprove: (schedule: Schedule, notes?: string) => void;
  onReject: (schedule: Schedule, notes?: string) => void;
  onLock: (schedule: Schedule) => void;
}

export function ApprovalList({ schedules, onApprove, onReject, onLock }: ApprovalListProps) {
  const [selectedSchedule, setSelectedSchedule] = React.useState<Schedule | null>(null);
  const [notes, setNotes] = React.useState('');
  const [action, setAction] = React.useState<'approve' | 'reject' | null>(null);

  const pendingSchedules = schedules.filter((s) => s.status === 'pending');
  const approvedSchedules = schedules.filter((s) => s.status === 'approved');

  const handleAction = () => {
    if (!selectedSchedule || !action) return;
    
    if (action === 'approve') {
      onApprove(selectedSchedule, notes);
    } else {
      onReject(selectedSchedule, notes);
    }
    
    setSelectedSchedule(null);
    setNotes('');
    setAction(null);
  };

  const openActionDialog = (schedule: Schedule, actionType: 'approve' | 'reject') => {
    setSelectedSchedule(schedule);
    setAction(actionType);
  };

  return (
    <div className="space-y-8">
      {/* Pending Approvals */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-status-pending" />
          <h3 className="text-lg font-semibold text-foreground">Pending Approvals</h3>
          <Badge variant="secondary" className="bg-status-pending/15 text-status-pending">
            {pendingSchedules.length}
          </Badge>
        </div>

        <AnimatePresence mode="popLayout">
          {pendingSchedules.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              No pending approvals
            </motion.div>
          ) : (
            <div className="space-y-3">
              {pendingSchedules.map((schedule) => (
                <motion.div
                  key={schedule.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-4 bg-card rounded-lg border border-border hover:border-status-pending/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{schedule.subject}</h4>
                        <Badge variant="outline" className="text-xs">
                          {YEAR_LABELS[schedule.year]} • Class {schedule.classSection}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {schedule.day}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {schedule.timeSlot.start} - {schedule.timeSlot.end}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          {schedule.instructor}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {schedule.room}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openActionDialog(schedule, 'reject')}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => openActionDialog(schedule, 'approve')}
                        className="bg-status-approved hover:bg-status-approved/90"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* Ready to Lock */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Lock className="h-5 w-5 text-status-locked" />
          <h3 className="text-lg font-semibold text-foreground">Ready to Lock</h3>
          <Badge variant="secondary" className="bg-status-approved/15 text-status-approved">
            {approvedSchedules.length}
          </Badge>
        </div>

        {approvedSchedules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No approved schedules ready to lock
          </div>
        ) : (
          <div className="space-y-3">
            {approvedSchedules.map((schedule) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-card rounded-lg border border-status-approved/30 hover:border-status-approved/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{schedule.subject}</h4>
                      <Badge variant="outline" className="text-xs bg-status-approved/10 text-status-approved border-status-approved/30">
                        Approved
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>{YEAR_LABELS[schedule.year]} • Class {schedule.classSection}</span>
                      <span>{schedule.day} • {schedule.timeSlot.start} - {schedule.timeSlot.end}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onLock(schedule)}
                    className="border-status-locked/50 text-status-locked hover:bg-status-locked/10"
                  >
                    <Lock className="h-4 w-4 mr-1" />
                    Lock Schedule
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Action Dialog */}
      <Dialog open={!!selectedSchedule && !!action} onOpenChange={() => { setSelectedSchedule(null); setAction(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'approve' ? 'Approve Schedule' : 'Reject Schedule'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedSchedule && (
            <div className="space-y-4">
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="font-medium text-foreground">{selectedSchedule.subject}</p>
                <p className="text-sm text-muted-foreground">
                  {YEAR_LABELS[selectedSchedule.year]} • Class {selectedSchedule.classSection} • {selectedSchedule.day}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Notes (optional)
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={action === 'approve' ? 'Add approval notes...' : 'Reason for rejection...'}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => { setSelectedSchedule(null); setAction(null); }}>
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              className={action === 'approve' ? 'bg-status-approved hover:bg-status-approved/90' : 'bg-destructive hover:bg-destructive/90'}
            >
              {action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

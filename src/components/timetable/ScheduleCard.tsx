import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User, MapPin, Lock, AlertCircle, CheckCircle, FileEdit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Schedule, ScheduleStatus } from '@/types';
import { YEAR_COLORS, STATUS_LABELS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';

interface ScheduleCardProps {
  schedule: Schedule;
  onEdit?: (schedule: Schedule) => void;
  onApprove?: (schedule: Schedule) => void;
  onLock?: (schedule: Schedule) => void;
  onDelete?: (schedule: Schedule) => void;
  isAdmin?: boolean;
  compact?: boolean;
}

const statusIcons: Record<ScheduleStatus, React.ElementType> = {
  draft: FileEdit,
  pending: AlertCircle,
  approved: CheckCircle,
  locked: Lock,
};

export function ScheduleCard({ 
  schedule, 
  onEdit, 
  onApprove, 
  onLock, 
  onDelete,
  isAdmin = false,
  compact = false 
}: ScheduleCardProps) {
  const StatusIcon = statusIcons[schedule.status];
  const yearColorClass = YEAR_COLORS[schedule.year];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn(
        "group relative bg-card rounded-lg border border-border/50 overflow-hidden",
        "transition-all duration-300 hover:shadow-lg hover:border-border",
        yearColorClass,
        compact ? "p-3" : "p-4"
      )}
    >
      {/* Status Badge */}
      <div className="absolute top-3 right-3">
        <Badge
          variant="secondary"
          className={cn(
            "text-xs font-medium gap-1",
            schedule.status === 'draft' && "bg-muted text-muted-foreground",
            schedule.status === 'pending' && "bg-status-pending/15 text-status-pending",
            schedule.status === 'approved' && "bg-status-approved/15 text-status-approved",
            schedule.status === 'locked' && "bg-status-locked/15 text-status-locked"
          )}
        >
          <StatusIcon className="h-3 w-3" />
          {!compact && STATUS_LABELS[schedule.status]}
        </Badge>
      </div>

      {/* Subject Title */}
      <h4 className={cn(
        "font-semibold text-foreground pr-20 mb-2",
        compact ? "text-sm" : "text-base"
      )}>
        {schedule.subject}
      </h4>

      {/* Details */}
      <div className={cn("space-y-1.5", compact ? "text-xs" : "text-sm")}>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{schedule.timeSlot.start} - {schedule.timeSlot.end}</span>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          <span className="truncate">{schedule.instructor}</span>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{schedule.room}</span>
        </div>
      </div>

      {/* Year & Class Badge */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
        <span className="text-xs font-medium text-muted-foreground">
          Year {schedule.year} • Class {schedule.classSection}
        </span>
      </div>

      {/* Admin Actions Overlay */}
      {isAdmin && schedule.status !== 'locked' && (
        <div className="absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(schedule)}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
            >
              Edit
            </button>
          )}
          {onApprove && schedule.status === 'pending' && (
            <button
              onClick={() => onApprove(schedule)}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-status-approved/20 text-status-approved hover:bg-status-approved/30 transition-colors"
            >
              Approve
            </button>
          )}
          {onLock && schedule.status === 'approved' && (
            <button
              onClick={() => onLock(schedule)}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-status-locked/20 text-status-locked hover:bg-status-locked/30 transition-colors"
            >
              Lock
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(schedule)}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}

      {/* Locked Indicator */}
      {schedule.status === 'locked' && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center pointer-events-none">
          <Lock className="h-8 w-8 text-status-locked/30" />
        </div>
      )}
    </motion.div>
  );
}

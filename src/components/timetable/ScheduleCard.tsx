import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User, MapPin, Lock, AlertCircle, CheckCircle, FileEdit, Sparkles } from 'lucide-react';
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
  animationDelay?: number;
}

const statusIcons: Record<ScheduleStatus, React.ElementType> = {
  draft: FileEdit,
  pending: AlertCircle,
  approved: CheckCircle,
  locked: Lock,
};

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  enter: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    }
  },
};

export function ScheduleCard({ 
  schedule, 
  onEdit, 
  onApprove, 
  onLock, 
  onDelete,
  isAdmin = false,
  compact = false,
  animationDelay = 0
}: ScheduleCardProps) {
  const StatusIcon = statusIcons[schedule.status];
  const yearColorClass = YEAR_COLORS[schedule.year];

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="enter"
      whileHover={{ 
        y: -6, 
        scale: 1.01,
        transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } 
      }}
      transition={{ delay: animationDelay }}
      className={cn(
        "group relative bg-card rounded-xl overflow-hidden",
        "border border-border/40 hover:border-primary/30",
        "shadow-premium-sm hover:shadow-premium-lg hover:shadow-gold/20",
        "transition-all duration-500",
        yearColorClass,
        compact ? "p-4" : "p-5"
      )}
    >
      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge
          variant="secondary"
          className={cn(
            "text-xs font-medium gap-1.5 px-2.5 py-1 rounded-lg backdrop-blur-sm",
            schedule.status === 'draft' && "status-draft",
            schedule.status === 'pending' && "status-pending",
            schedule.status === 'approved' && "status-approved",
            schedule.status === 'locked' && "status-locked"
          )}
        >
          <StatusIcon className="h-3 w-3" />
          {!compact && <span>{STATUS_LABELS[schedule.status]}</span>}
        </Badge>
      </div>

      {/* Subject Title */}
      <h4 className={cn(
        "font-display font-semibold text-foreground pr-24 mb-3 leading-tight",
        compact ? "text-base" : "text-lg"
      )}>
        {schedule.subject}
      </h4>

      {/* Details */}
      <div className={cn("space-y-2", compact ? "text-xs" : "text-sm")}>
        <div className="flex items-center gap-2.5 text-muted-foreground group-hover:text-foreground/70 transition-colors">
          <div className="w-5 h-5 rounded-md bg-secondary/80 flex items-center justify-center">
            <Clock className="h-3 w-3" />
          </div>
          <span className="font-medium">{schedule.timeSlot.start} - {schedule.timeSlot.end}</span>
        </div>
        
        <div className="flex items-center gap-2.5 text-muted-foreground">
          <div className="w-5 h-5 rounded-md bg-secondary/80 flex items-center justify-center">
            <User className="h-3 w-3" />
          </div>
          <span className="truncate">{schedule.instructor}</span>
        </div>
        
        <div className="flex items-center gap-2.5 text-muted-foreground">
          <div className="w-5 h-5 rounded-md bg-secondary/80 flex items-center justify-center">
            <MapPin className="h-3 w-3" />
          </div>
          <span>{schedule.room}</span>
        </div>
      </div>

      {/* Year & Class Badge */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/30">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-primary/60" />
          <span className="text-xs font-medium text-muted-foreground">
            Year {schedule.year} <span className="text-primary/40">•</span> Class {schedule.classSection}
          </span>
        </div>
      </div>

      {/* Admin Actions Overlay */}
      {isAdmin && schedule.status !== 'locked' && (
        <motion.div 
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          {onEdit && (
            <button
              onClick={() => onEdit(schedule)}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-200 hover:scale-105"
            >
              Edit
            </button>
          )}
          {onApprove && schedule.status === 'pending' && (
            <button
              onClick={() => onApprove(schedule)}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-status-approved/15 text-status-approved hover:bg-status-approved/25 transition-all duration-200 hover:scale-105"
            >
              Approve
            </button>
          )}
          {onLock && schedule.status === 'approved' && (
            <button
              onClick={() => onLock(schedule)}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-status-locked/15 text-status-locked hover:bg-status-locked/25 transition-all duration-200 hover:scale-105"
            >
              Lock
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(schedule)}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 transition-all duration-200 hover:scale-105"
            >
              Delete
            </button>
          )}
        </motion.div>
      )}

      {/* Locked Indicator */}
      {schedule.status === 'locked' && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-status-locked/10 flex items-center justify-center">
            <Lock className="h-6 w-6 text-status-locked/40" />
          </div>
        </div>
      )}
    </motion.div>
  );
}

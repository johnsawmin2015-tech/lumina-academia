import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MapPin, User, BookOpen, GraduationCap, Users } from 'lucide-react';
import { Schedule } from '@/types';
import { YEAR_LABELS } from '@/lib/constants';
import { STATUS_LABELS } from '@/lib/constants';

interface ClassDetailCardProps {
  schedule: Schedule | null;
  open: boolean;
  onClose: () => void;
}

export function ClassDetailCard({ schedule, open, onClose }: ClassDetailCardProps) {
  if (!schedule) return null;

  const statusClass = `status-${schedule.status}`;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-md"
          >
            <div className="luxury-card overflow-hidden">
              {/* Header with year gradient */}
              <div className={`year-${schedule.year}-bg p-6 relative`}>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                >
                  <X className="h-4 w-4 text-foreground" />
                </button>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-xl font-bold text-foreground leading-tight">
                      {schedule.subject}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
                        {STATUS_LABELS[schedule.status]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <DetailItem icon={User} label="Lecturer" value={schedule.instructor} />
                  <DetailItem icon={Clock} label="Time" value={`${schedule.timeSlot.start} – ${schedule.timeSlot.end}`} />
                  <DetailItem icon={MapPin} label="Room" value={schedule.room} />
                  <DetailItem icon={GraduationCap} label="Year" value={YEAR_LABELS[schedule.year]} />
                  <DetailItem icon={Users} label="Section" value={`Class ${schedule.classSection}`} />
                  <DetailItem icon={BookOpen} label="Day" value={schedule.day} />
                </div>

                {schedule.notes && (
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">{schedule.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Day, Schedule } from '@/types';
import { TIME_SLOTS } from '@/lib/constants';
import { ScheduleCard } from './ScheduleCard';
import { LunchBlock } from './LunchBlock';
import { cn } from '@/lib/utils';

interface DayColumnProps {
  day: Day;
  schedules: Schedule[];
  onEdit?: (schedule: Schedule) => void;
  onApprove?: (schedule: Schedule) => void;
  onLock?: (schedule: Schedule) => void;
  onDelete?: (schedule: Schedule) => void;
  isAdmin?: boolean;
}

export function DayColumn({
  day,
  schedules,
  onEdit,
  onApprove,
  onLock,
  onDelete,
  isAdmin = false,
}: DayColumnProps) {
  const getScheduleForSlot = (start: string, end: string) => {
    return schedules.find(
      (s) => s.day === day && s.timeSlot.start === start && s.timeSlot.end === end
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col"
    >
      {/* Day Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-3 px-4 border-b border-border mb-4">
        <h3 className="font-semibold text-foreground">{day}</h3>
      </div>

      {/* Time Slots */}
      <div className="space-y-3 px-2">
        {TIME_SLOTS.map((slot, index) => {
          if (slot.isLunch) {
            return <LunchBlock key={`${day}-lunch`} />;
          }

          const schedule = getScheduleForSlot(slot.start, slot.end);

          return (
            <div key={`${day}-${slot.start}`} className="min-h-[100px]">
              {schedule ? (
                <ScheduleCard
                  schedule={schedule}
                  onEdit={onEdit}
                  onApprove={onApprove}
                  onLock={onLock}
                  onDelete={onDelete}
                  isAdmin={isAdmin}
                />
              ) : (
                <div className="h-full min-h-[100px] rounded-lg border border-dashed border-border/50 bg-muted/20 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground/50">
                    {slot.start} - {slot.end}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

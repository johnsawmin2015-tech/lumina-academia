import React from 'react';
import { motion } from 'framer-motion';
import { Day, Schedule } from '@/types';
import { TIME_SLOTS } from '@/lib/constants';
import { ScheduleCard } from './ScheduleCard';
import { LunchBlock } from './LunchBlock';
import { staggerContainerVariants, staggerItemVariants } from '@/components/layout/PageTransition';

interface DayColumnProps {
  day: Day;
  schedules: Schedule[];
  onEdit?: (schedule: Schedule) => void;
  onApprove?: (schedule: Schedule) => void;
  onLock?: (schedule: Schedule) => void;
  onDelete?: (schedule: Schedule) => void;
  isAdmin?: boolean;
  columnIndex?: number;
}

export function DayColumn({
  day,
  schedules,
  onEdit,
  onApprove,
  onLock,
  onDelete,
  isAdmin = false,
  columnIndex = 0,
}: DayColumnProps) {
  const getScheduleForSlot = (start: string, end: string) => {
    return schedules.find(
      (s) => s.day === day && s.timeSlot.start === start && s.timeSlot.end === end
    );
  };

  return (
    <motion.div
      variants={staggerItemVariants}
      initial="initial"
      animate="enter"
      transition={{ delay: columnIndex * 0.1 }}
      className="flex flex-col"
    >
      {/* Day Header */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: columnIndex * 0.1 + 0.1 }}
        className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-3 px-4 border-b border-border mb-4"
      >
        <h3 className="font-semibold text-foreground">{day}</h3>
      </motion.div>

      {/* Time Slots with stagger */}
      <motion.div 
        variants={staggerContainerVariants}
        initial="initial"
        animate="enter"
        className="space-y-3 px-2"
      >
        {TIME_SLOTS.map((slot, index) => {
          if (slot.isLunch) {
            return (
              <motion.div key={`${day}-lunch`} variants={staggerItemVariants}>
                <LunchBlock />
              </motion.div>
            );
          }

          const schedule = getScheduleForSlot(slot.start, slot.end);

          return (
            <motion.div 
              key={`${day}-${slot.start}`} 
              variants={staggerItemVariants}
              className="min-h-[100px]"
            >
              {schedule ? (
                <ScheduleCard
                  schedule={schedule}
                  onEdit={onEdit}
                  onApprove={onApprove}
                  onLock={onLock}
                  onDelete={onDelete}
                  isAdmin={isAdmin}
                  animationDelay={index * 0.05}
                />
              ) : (
                <motion.div 
                  whileHover={{ scale: 1.02, borderColor: 'rgba(var(--primary), 0.3)' }}
                  className="h-full min-h-[100px] rounded-lg border border-dashed border-border/50 bg-muted/20 flex items-center justify-center transition-colors"
                >
                  <span className="text-xs text-muted-foreground/50">
                    {slot.start} - {slot.end}
                  </span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Schedule, Day } from '@/types';
import { DAYS, TIME_SLOTS, YEAR_LABELS } from '@/lib/constants';
import { STATUS_LABELS } from '@/lib/constants';
import { ClassDetailCard } from './ClassDetailCard';
import { UtensilsCrossed, Lock } from 'lucide-react';

interface TimetableTableProps {
  schedules: Schedule[];
  displayDays: Day[];
  isAdmin?: boolean;
}

export function TimetableTable({ schedules, displayDays, isAdmin = false }: TimetableTableProps) {
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const getScheduleForSlot = (day: Day, start: string, end: string) => {
    return schedules.find(
      (s) => s.day === day && s.timeSlot.start === start && s.timeSlot.end === end
    );
  };

  const nonLunchSlots = TIME_SLOTS.filter((s) => !s.isLunch);
  const lunchSlot = TIME_SLOTS.find((s) => s.isLunch);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="luxury-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* Header */}
            <thead>
              <tr className="border-b border-border/50">
                <th className="sticky left-0 z-10 bg-secondary/80 backdrop-blur-sm px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground w-24">
                  Time
                </th>
                {displayDays.map((day) => (
                  <th
                    key={day}
                    className="px-3 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-secondary/40 min-w-[140px]"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot, idx) => {
                if (slot.isLunch) {
                  return (
                    <tr key="lunch" className="border-b border-border/30">
                      <td className="sticky left-0 z-10 bg-muted/40 backdrop-blur-sm px-4 py-3 text-xs font-medium text-muted-foreground">
                        {slot.start}–{slot.end}
                      </td>
                      <td
                        colSpan={displayDays.length}
                        className="lunch-block text-center py-3"
                      >
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <UtensilsCrossed className="h-4 w-4" />
                          <span className="text-xs font-medium">Lunch Break</span>
                          <Lock className="h-3 w-3" />
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={`${slot.start}-${slot.end}`} className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                    <td className="sticky left-0 z-10 bg-background/90 backdrop-blur-sm px-4 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {slot.start}–{slot.end}
                    </td>
                    {displayDays.map((day) => {
                      const schedule = getScheduleForSlot(day, slot.start, slot.end);
                      return (
                        <td key={`${day}-${slot.start}`} className="px-2 py-2">
                          {schedule ? (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedSchedule(schedule)}
                              className={`w-full text-left p-3 rounded-lg year-${schedule.year}-bg cursor-pointer transition-all duration-200 hover:shadow-md group`}
                            >
                              <p className="text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                                {schedule.subject}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 truncate">
                                {schedule.instructor}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-[10px] text-muted-foreground/70">{schedule.room}</span>
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium status-${schedule.status}`}>
                                  {STATUS_LABELS[schedule.status]}
                                </span>
                              </div>
                            </motion.button>
                          ) : (
                            <div className="w-full h-16 rounded-lg border border-dashed border-border/30 bg-muted/10" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Class Detail Modal */}
      <ClassDetailCard
        schedule={selectedSchedule}
        open={!!selectedSchedule}
        onClose={() => setSelectedSchedule(null)}
      />
    </>
  );
}

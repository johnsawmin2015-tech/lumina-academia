import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, Calendar } from 'lucide-react';
import { Schedule, TimetableFilters, AcademicYear, ClassSection, Day } from '@/types';
import { ACADEMIC_YEARS, CLASS_SECTIONS, DAYS, YEAR_LABELS } from '@/lib/constants';
import { DayColumn } from './DayColumn';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TimetableViewProps {
  schedules: Schedule[];
  onEdit?: (schedule: Schedule) => void;
  onApprove?: (schedule: Schedule) => void;
  onLock?: (schedule: Schedule) => void;
  onDelete?: (schedule: Schedule) => void;
  isAdmin?: boolean;
  defaultYear?: AcademicYear;
  defaultClass?: ClassSection;
}

export function TimetableView({
  schedules,
  onEdit,
  onApprove,
  onLock,
  onDelete,
  isAdmin = false,
  defaultYear = 1,
  defaultClass = 'A',
}: TimetableViewProps) {
  const [filters, setFilters] = useState<TimetableFilters>({
    year: defaultYear,
    classSection: defaultClass,
    day: 'all',
  });

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      if (filters.year !== 'all' && schedule.year !== filters.year) return false;
      if (filters.classSection !== 'all' && schedule.classSection !== filters.classSection) return false;
      if (filters.day !== 'all' && schedule.day !== filters.day) return false;
      return true;
    });
  }, [schedules, filters]);

  const displayDays = filters.day === 'all' ? DAYS : [filters.day as Day];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-lg border border-border/50"
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters</span>
        </div>

        <Select
          value={String(filters.year)}
          onValueChange={(value) => 
            setFilters(prev => ({ ...prev, year: value === 'all' ? 'all' : Number(value) as AcademicYear }))
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {ACADEMIC_YEARS.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {YEAR_LABELS[year]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.classSection}
          onValueChange={(value) => 
            setFilters(prev => ({ ...prev, classSection: value as ClassSection | 'all' }))
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {CLASS_SECTIONS.map((section) => (
              <SelectItem key={section} value={section}>
                Class {section}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.day}
          onValueChange={(value) => 
            setFilters(prev => ({ ...prev, day: value as Day | 'all' }))
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select Day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Days</SelectItem>
            {DAYS.map((day) => (
              <SelectItem key={day} value={day}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{filteredSchedules.length} schedule(s)</span>
        </div>
      </motion.div>

      {/* Timetable Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {displayDays.map((day) => (
          <DayColumn
            key={day}
            day={day}
            schedules={filteredSchedules}
            onEdit={onEdit}
            onApprove={onApprove}
            onLock={onLock}
            onDelete={onDelete}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredSchedules.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <Calendar className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No schedules found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters to see more results.
          </p>
        </motion.div>
      )}
    </div>
  );
}

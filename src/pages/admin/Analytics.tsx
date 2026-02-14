import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  Activity, Users, DoorOpen, Clock, TrendingUp, 
  BarChart3, PieChart as PieIcon, CalendarDays, Grid3X3, Zap
} from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatsCard } from '@/components/admin/StatsCard';
import { Schedule, Day } from '@/types';
import { getStoredSchedules } from '@/data/mockData';
import { staggerContainerVariants, staggerItemVariants } from '@/components/layout/PageTransition';
import { cn } from '@/lib/utils';

const DAYS: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_LABELS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'];
const CHART_COLORS = [
  'hsl(36, 50%, 42%)',
  'hsl(160, 55%, 40%)',
  'hsl(220, 55%, 50%)',
  'hsl(280, 45%, 50%)',
  'hsl(16, 60%, 50%)',
];

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export default function AdminAnalytics() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    setSchedules(getStoredSchedules());
  }, []);

  // ── KPIs ──
  const uniqueRooms = useMemo(() => new Set(schedules.map(s => s.room)), [schedules]);
  const uniqueInstructors = useMemo(() => new Set(schedules.map(s => s.instructor)), [schedules]);
  const totalAvailableHours = uniqueRooms.size * 6 * 5;

  const totalBookedHours = useMemo(() => {
    return schedules.reduce((sum, s) => {
      const dur = (timeToMinutes(s.timeSlot.end) - timeToMinutes(s.timeSlot.start)) / 60;
      return sum + dur;
    }, 0);
  }, [schedules]);

  const roomUtilization = totalAvailableHours > 0
    ? Math.round((totalBookedHours / totalAvailableHours) * 100)
    : 0;

  // ── Heatmap data: day × time slot → count ──
  const heatmapData = useMemo(() => {
    const grid: Record<string, Record<string, number>> = {};
    DAYS.forEach(day => {
      grid[day] = {};
      TIME_LABELS.forEach(time => {
        grid[day][time] = 0;
      });
    });
    schedules.forEach(s => {
      if (grid[s.day] && grid[s.day][s.timeSlot.start] !== undefined) {
        grid[s.day][s.timeSlot.start]++;
      }
    });
    return grid;
  }, [schedules]);

  const maxHeatValue = useMemo(() => {
    let max = 1;
    DAYS.forEach(day => {
      TIME_LABELS.forEach(time => {
        if (heatmapData[day]?.[time] > max) max = heatmapData[day][time];
      });
    });
    return max;
  }, [heatmapData]);

  // ── Room utilization per room ──
  const roomData = useMemo(() => {
    const map = new Map<string, number>();
    schedules.forEach(s => {
      const dur = (timeToMinutes(s.timeSlot.end) - timeToMinutes(s.timeSlot.start)) / 60;
      map.set(s.room, (map.get(s.room) || 0) + dur);
    });
    return Array.from(map.entries())
      .map(([room, hours]) => ({
        name: room.replace('Room ', 'R').replace('Computer Lab ', 'CL').replace('Lab ', 'L'),
        hours: Math.round(hours * 10) / 10,
        utilization: Math.round((hours / 30) * 100),
      }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 10);
  }, [schedules]);

  // ── Lecturer load ──
  const lecturerData = useMemo(() => {
    const map = new Map<string, number>();
    schedules.forEach(s => {
      const dur = (timeToMinutes(s.timeSlot.end) - timeToMinutes(s.timeSlot.start)) / 60;
      map.set(s.instructor, (map.get(s.instructor) || 0) + dur);
    });
    return Array.from(map.entries())
      .map(([name, hours]) => ({
        name: name.split(' ').slice(-1)[0],
        fullName: name,
        hours: Math.round(hours * 10) / 10,
        load: Math.round((hours / 20) * 100),
      }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 10);
  }, [schedules]);

  // ── Schedule distribution by status ──
  const statusData = useMemo(() => {
    const counts = { draft: 0, pending: 0, approved: 0, locked: 0 };
    schedules.forEach(s => { counts[s.status]++; });
    return [
      { name: 'Draft', value: counts.draft },
      { name: 'Pending', value: counts.pending },
      { name: 'Approved', value: counts.approved },
      { name: 'Locked', value: counts.locked },
    ].filter(d => d.value > 0);
  }, [schedules]);

  // ── Day distribution ──
  const dayData = useMemo(() => {
    return DAYS.map(day => ({
      name: day.slice(0, 3),
      classes: schedules.filter(s => s.day === day).length,
    }));
  }, [schedules]);

  // ── Year distribution ──
  const yearData = useMemo(() => {
    return [1, 2, 3, 4, 5].map(y => ({
      name: `Year ${y}`,
      classes: schedules.filter(s => s.year === y).length,
    }));
  }, [schedules]);

  // ── Peak hours ──
  const peakHour = useMemo(() => {
    const hourCounts: Record<string, number> = {};
    schedules.forEach(s => {
      hourCounts[s.timeSlot.start] = (hourCounts[s.timeSlot.start] || 0) + 1;
    });
    const peak = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
    return peak ? `${peak[0]} (${peak[1]} classes)` : 'N/A';
  }, [schedules]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="luxury-card p-3 text-xs shadow-lg border border-border/50">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="flex justify-between gap-4">
            <span>{p.name}:</span>
            <span className="font-medium">{p.value}</span>
          </p>
        ))}
      </div>
    );
  };

  const getHeatColor = (value: number) => {
    if (value === 0) return 'bg-muted/30';
    const intensity = value / maxHeatValue;
    if (intensity <= 0.25) return 'bg-primary/15 text-primary';
    if (intensity <= 0.5) return 'bg-primary/30 text-primary';
    if (intensity <= 0.75) return 'bg-primary/50 text-primary-foreground';
    return 'bg-primary/80 text-primary-foreground';
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold text-foreground tracking-tight">Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Resource utilization, workload distribution, and scheduling insights
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span>Peak: {peakHour}</span>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <motion.div
          variants={staggerContainerVariants}
          initial="initial"
          animate="enter"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div variants={staggerItemVariants}>
            <StatsCard title="Room Utilization" value={`${roomUtilization}%`} icon={DoorOpen} description={`${uniqueRooms.size} rooms tracked`} variant="primary" />
          </motion.div>
          <motion.div variants={staggerItemVariants}>
            <StatsCard title="Active Instructors" value={uniqueInstructors.size} icon={Users} description="Teaching this term" variant="success" />
          </motion.div>
          <motion.div variants={staggerItemVariants}>
            <StatsCard title="Total Classes" value={schedules.length} icon={CalendarDays} description="Across all years" variant="default" />
          </motion.div>
          <motion.div variants={staggerItemVariants}>
            <StatsCard title="Booked Hours" value={Math.round(totalBookedHours)} icon={Clock} description="Weekly total" variant="warning" />
          </motion.div>
        </motion.div>

        {/* Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="luxury-card p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Grid3X3 className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Room Density Heatmap</h2>
            <span className="text-xs text-muted-foreground ml-auto">Classes per time slot across all rooms</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-1">
              <thead>
                <tr>
                  <th className="text-xs font-medium text-muted-foreground text-left p-2 w-20" />
                  {DAYS.map(day => (
                    <th key={day} className="text-xs font-medium text-muted-foreground text-center p-2">
                      {day.slice(0, 3)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_LABELS.map(time => (
                  <tr key={time}>
                    <td className="text-xs font-mono text-muted-foreground p-2">{time}</td>
                    {DAYS.map(day => {
                      const val = heatmapData[day]?.[time] || 0;
                      return (
                        <td key={`${day}-${time}`} className="p-1">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.02 * (DAYS.indexOf(day) + TIME_LABELS.indexOf(time)) }}
                            className={cn(
                              'w-full aspect-square rounded-lg flex items-center justify-center text-xs font-semibold transition-all min-w-[48px]',
                              getHeatColor(val)
                            )}
                          >
                            {val > 0 ? val : ''}
                          </motion.div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/30">
            <span className="text-xs text-muted-foreground">Density:</span>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={cn(
                  'w-5 h-5 rounded',
                  i === 0 ? 'bg-muted/30' : i === 1 ? 'bg-primary/20' : i === 2 ? 'bg-primary/45' : 'bg-primary/80'
                )} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">Low → High</span>
          </div>
        </motion.div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Room Utilization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="luxury-card p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold text-foreground">Room Utilization</h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={roomData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} unit="h" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="hours" name="Hours" fill="hsl(36, 50%, 42%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Lecturer Load */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="luxury-card p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Activity className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold text-foreground">Lecturer Workload</h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={lecturerData} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} unit="h" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="hours" name="Hours" fill="hsl(160, 55%, 40%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="luxury-card p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <PieIcon className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold text-foreground">Status Mix</h2>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Day Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="luxury-card p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <CalendarDays className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold text-foreground">Day Spread</h2>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="classes" name="Classes" fill="hsl(220, 55%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Year Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="luxury-card p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold text-foreground">By Year</h2>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={yearData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="classes" name="Classes" fill="hsl(16, 60%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}

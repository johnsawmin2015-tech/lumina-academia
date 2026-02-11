import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  Activity, Users, DoorOpen, Clock, TrendingUp, 
  BarChart3, PieChart as PieIcon, CalendarDays 
} from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatsCard } from '@/components/admin/StatsCard';
import { Schedule, Day } from '@/types';
import { getStoredSchedules } from '@/data/mockData';
import { staggerContainerVariants, staggerItemVariants } from '@/components/layout/PageTransition';
import { cn } from '@/lib/utils';

const DAYS: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const CHART_COLORS = [
  'hsl(36, 50%, 42%)',   // primary gold
  'hsl(160, 55%, 40%)',  // emerald
  'hsl(220, 55%, 50%)',  // royal blue
  'hsl(280, 45%, 50%)',  // amethyst
  'hsl(16, 60%, 50%)',   // copper
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
  const totalAvailableHours = uniqueRooms.size * 6 * 5; // 6h/day × 5 days per room

  const totalBookedHours = useMemo(() => {
    return schedules.reduce((sum, s) => {
      const dur = (timeToMinutes(s.timeSlot.end) - timeToMinutes(s.timeSlot.start)) / 60;
      return sum + dur;
    }, 0);
  }, [schedules]);

  const roomUtilization = totalAvailableHours > 0
    ? Math.round((totalBookedHours / totalAvailableHours) * 100)
    : 0;

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
        name: name.split(' ').slice(-1)[0], // last name only for chart
        fullName: name,
        hours: Math.round(hours * 10) / 10,
        load: Math.round((hours / 20) * 100), // 20h max
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

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-4xl font-bold text-foreground tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Resource utilization, workload distribution, and scheduling insights
          </p>
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

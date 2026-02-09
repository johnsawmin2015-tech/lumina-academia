import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, GraduationCap, User, Calendar, Home, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface HeaderProps {
  variant?: 'admin' | 'student' | 'public';
}

export function Header({ variant = 'public' }: HeaderProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const isStudentRoute = (path: string) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border/30 glass"
    >
      <div className="container flex h-18 items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          <div className="relative w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            <GraduationCap className="h-6 w-6 text-primary relative z-10" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-semibold text-lg leading-tight text-foreground tracking-tight">
              Academic Suite
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary/80 font-medium">UCS Mandalay · 2026</span>
          </div>
        </Link>

        {/* Student Navigation */}
        {user?.role === 'student' && (
          <nav className="flex items-center gap-1">
            <Link
              to="/student/timetable"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isStudentRoute('/student/timetable')
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Timetable</span>
            </Link>
            <Link
              to="/student/resources"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isStudentRoute('/student/resources')
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Resources</span>
            </Link>
            <Link
              to="/student/profile"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isStudentRoute('/student/profile')
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          </nav>
        )}

        {/* Navigation & Actions */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/50">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-medium text-foreground">{user.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
              </div>
            </div>
          )}

          <ThemeToggle />

          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          )}

          {!user && variant === 'public' && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/student/login">Student Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/admin/login">Admin Portal</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}

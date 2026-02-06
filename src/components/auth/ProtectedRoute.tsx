import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: UserRole;
  redirectTo?: string;
}

export function ProtectedRoute({ children, allowedRole, redirectTo }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show nothing while loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to appropriate login
  if (!isAuthenticated || !user) {
    const loginPath = allowedRole === 'admin' ? '/admin/login' : '/student/login';
    return <Navigate to={redirectTo || loginPath} state={{ from: location }} replace />;
  }

  // Wrong role - redirect to their correct dashboard
  if (user.role !== allowedRole) {
    const correctPath = user.role === 'admin' ? '/admin/dashboard' : '/student/timetable';
    return <Navigate to={correctPath} replace />;
  }

  return <>{children}</>;
}

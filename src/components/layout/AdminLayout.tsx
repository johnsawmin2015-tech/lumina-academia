import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Header } from './Header';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Calendar, label: 'Schedules', path: '/admin/schedules' },
  { icon: CheckSquare, label: 'Approvals', path: '/admin/approvals' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Header variant="admin" />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-72 flex-col border-r border-border/40 bg-sidebar min-h-[calc(100vh-4.5rem)]">
          <nav className="flex-1 p-5 space-y-1.5">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "group flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-gold" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300",
                    isActive 
                      ? "bg-primary-foreground/15" 
                      : "bg-sidebar-accent group-hover:bg-primary/10"
                  )}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-5 border-t border-sidebar-border/50">
            <div className="px-4 py-4 rounded-xl bg-gradient-to-br from-sidebar-accent/80 to-sidebar-accent/40 border border-sidebar-border/30">
              <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60 mb-1">Admin Portal</p>
              <p className="text-sm font-display font-semibold text-sidebar-foreground">Full Access</p>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-border/40 z-50">
          <nav className="flex justify-around py-3">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center gap-1.5 px-5 py-2 rounded-xl transition-all duration-300",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive && "scale-110")} />
                  <span className="text-[10px] font-medium uppercase tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 pb-24 md:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

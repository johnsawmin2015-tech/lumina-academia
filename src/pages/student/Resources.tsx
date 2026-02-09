import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Lock, Unlock, Clock, BookOpen, AlertCircle } from 'lucide-react';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { useAuth } from '@/contexts/AuthContext';
import { isResourceAccessAllowed, getAccessStatusLabel } from '@/lib/timeAccessControl';
import { Button } from '@/components/ui/button';
import { YEAR_LABELS } from '@/lib/constants';
import { staggerContainerVariants, staggerItemVariants } from '@/components/layout/PageTransition';

interface Resource {
  id: string;
  title: string;
  subject: string;
  type: 'pdf' | 'slide' | 'document';
  size: string;
  uploadedAt: string;
  year: number;
  section: string;
}

// Mock resources
const MOCK_RESOURCES: Resource[] = [
  { id: '1', title: 'Data Structures Lecture Notes', subject: 'Data Structures', type: 'pdf', size: '2.4 MB', uploadedAt: '2026-02-01', year: 2, section: 'A' },
  { id: '2', title: 'Linear Algebra Chapter 5', subject: 'Linear Algebra', type: 'pdf', size: '1.8 MB', uploadedAt: '2026-02-03', year: 2, section: 'A' },
  { id: '3', title: 'OOP Design Patterns', subject: 'Object-Oriented Programming', type: 'slide', size: '5.1 MB', uploadedAt: '2026-02-05', year: 2, section: 'A' },
  { id: '4', title: 'Database Normalization Guide', subject: 'Database Systems', type: 'document', size: '890 KB', uploadedAt: '2026-02-07', year: 2, section: 'A' },
  { id: '5', title: 'Statistics Formulas Reference', subject: 'Statistics', type: 'pdf', size: '1.2 MB', uploadedAt: '2026-02-08', year: 2, section: 'A' },
];

export default function StudentResources() {
  const { user } = useAuth();
  const [accessStatus, setAccessStatus] = useState(isResourceAccessAllowed());
  const [statusLabel, setStatusLabel] = useState(getAccessStatusLabel());

  useEffect(() => {
    const interval = setInterval(() => {
      setAccessStatus(isResourceAccessAllowed());
      setStatusLabel(getAccessStatusLabel());
    }, 60000); // check every minute
    return () => clearInterval(interval);
  }, []);

  const myResources = MOCK_RESOURCES.filter(
    (r) => r.year === (user?.year || 2) && r.section === (user?.classSection || 'A')
  );

  return (
    <StudentLayout>
      <motion.div
        variants={staggerContainerVariants}
        initial="initial"
        animate="enter"
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={staggerItemVariants}>
          <h1 className="font-display text-3xl font-bold text-foreground">Learning Resources</h1>
          <p className="text-muted-foreground mt-1">
            {user?.year ? YEAR_LABELS[user.year] : ''} • Class {user?.classSection || 'A'}
          </p>
        </motion.div>

        {/* Access Status Banner */}
        <motion.div
          variants={staggerItemVariants}
          className={`flex items-center gap-4 p-4 rounded-xl border ${
            accessStatus.allowed
              ? 'bg-status-approved/10 border-status-approved/20'
              : 'bg-destructive/10 border-destructive/20'
          }`}
        >
          {accessStatus.allowed ? (
            <Unlock className="h-5 w-5 text-status-approved flex-shrink-0" />
          ) : (
            <Lock className="h-5 w-5 text-destructive flex-shrink-0" />
          )}
          <div className="flex-1">
            <p className={`text-sm font-medium ${accessStatus.allowed ? 'text-status-approved' : 'text-destructive'}`}>
              {statusLabel.label}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{accessStatus.reason}</p>
          </div>
          {!accessStatus.allowed && accessStatus.nextAvailable && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{accessStatus.nextAvailable}</span>
            </div>
          )}
        </motion.div>

        {/* Resources List */}
        <motion.div variants={staggerItemVariants} className="space-y-3">
          {myResources.length === 0 ? (
            <div className="luxury-card p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No resources available for your class yet.</p>
            </div>
          ) : (
            myResources.map((resource) => (
              <motion.div
                key={resource.id}
                whileHover={{ scale: accessStatus.allowed ? 1.01 : 1 }}
                className={`luxury-card p-5 flex items-center gap-4 ${!accessStatus.allowed ? 'opacity-60' : ''}`}
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{resource.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{resource.subject} · {resource.size}</p>
                </div>
                <Button
                  size="sm"
                  variant={accessStatus.allowed ? 'default' : 'ghost'}
                  disabled={!accessStatus.allowed}
                  className="gap-2 flex-shrink-0"
                >
                  {accessStatus.allowed ? (
                    <>
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5" />
                      Locked
                    </>
                  )}
                </Button>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Info */}
        <motion.div variants={staggerItemVariants} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border border-border/30">
          <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Access Schedule:</strong> Weekdays 16:00–09:00 (next day). Weekends: 24h access.</p>
            <p>Resources are locked during class hours to encourage lecture attendance.</p>
          </div>
        </motion.div>
      </motion.div>
    </StudentLayout>
  );
}

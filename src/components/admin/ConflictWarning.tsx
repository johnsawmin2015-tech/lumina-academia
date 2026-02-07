import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, MapPin, User, Users, X } from 'lucide-react';
import { ScheduleConflict, ConflictType, groupConflictsByType } from '@/lib/conflictDetection';
import { cn } from '@/lib/utils';

interface ConflictWarningProps {
  conflicts: ScheduleConflict[];
  onDismiss?: () => void;
}

const conflictIcons: Record<ConflictType, React.ElementType> = {
  room: MapPin,
  instructor: User,
  class: Users,
};

const conflictLabels: Record<ConflictType, string> = {
  room: 'Room Conflict',
  instructor: 'Instructor Conflict',
  class: 'Class Conflict',
};

export function ConflictWarning({ conflicts, onDismiss }: ConflictWarningProps) {
  if (conflicts.length === 0) return null;

  const groupedConflicts = groupConflictsByType(conflicts);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="rounded-lg border border-destructive/50 bg-destructive/10 overflow-hidden"
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-destructive">
                  {conflicts.length} Scheduling Conflict{conflicts.length > 1 ? 's' : ''} Detected
                </h4>
                {onDismiss && (
                  <button
                    onClick={onDismiss}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                Please resolve these conflicts before saving the schedule.
              </p>

              <div className="space-y-3">
                {Object.entries(groupedConflicts).map(([type, typeConflicts]) => {
                  if (typeConflicts.length === 0) return null;
                  
                  const ConflictIcon = conflictIcons[type as ConflictType];
                  
                  return (
                    <motion.div
                      key={type}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-background/50 rounded-md p-3"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <ConflictIcon className="h-4 w-4 text-destructive" />
                        <span className="text-xs font-medium text-foreground">
                          {conflictLabels[type as ConflictType]}
                        </span>
                      </div>
                      
                      <ul className="space-y-1.5">
                        {typeConflicts.map((conflict, index) => (
                          <li
                            key={`${conflict.conflictingSchedule.id}-${index}`}
                            className="text-xs text-muted-foreground pl-6 relative before:absolute before:left-2 before:top-1.5 before:w-1 before:h-1 before:rounded-full before:bg-destructive/50"
                          >
                            {conflict.message}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

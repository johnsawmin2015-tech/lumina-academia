import React from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Lock } from 'lucide-react';

interface LunchBlockProps {
  compact?: boolean;
}

export function LunchBlock({ compact = false }: LunchBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`lunch-block rounded-lg ${compact ? 'py-4' : 'py-6'}`}
    >
      <div className="flex flex-col items-center gap-1 text-muted-foreground">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
          <span className={`font-medium ${compact ? 'text-xs' : 'text-sm'}`}>
            Lunch Break
          </span>
          <Lock className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
        </div>
        <span className="text-xs opacity-70">12:00 - 13:00</span>
      </div>
    </motion.div>
  );
}

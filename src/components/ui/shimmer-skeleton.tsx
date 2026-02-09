import React from 'react';
import { cn } from '@/lib/utils';

interface ShimmerSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'card' | 'circle' | 'button';
  width?: string;
  height?: string;
}

export function ShimmerSkeleton({ className, variant = 'text', width, height, ...props }: ShimmerSkeletonProps) {
  const variants = {
    text: 'h-4 rounded-md',
    card: 'h-32 rounded-xl',
    circle: 'rounded-full',
    button: 'h-10 rounded-lg',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-muted/60',
        variants[variant],
        className
      )}
      style={{ width, height }}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-background/60 to-transparent" />
    </div>
  );
}

export function TimetableSkeletonLoader() {
  return (
    <div className="luxury-card overflow-hidden p-1">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border/30">
        <ShimmerSkeleton variant="text" className="w-20 h-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <ShimmerSkeleton key={i} variant="text" className="flex-1 h-4" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: 6 }).map((_, row) => (
        <div key={row} className="flex items-center gap-4 p-4 border-b border-border/10">
          <ShimmerSkeleton variant="text" className="w-20 h-4" />
          {Array.from({ length: 5 }).map((_, col) => (
            <ShimmerSkeleton key={col} variant="card" className="flex-1 h-16 rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeletonLoader() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <ShimmerSkeleton variant="text" className="w-48 h-8" />
          <ShimmerSkeleton variant="text" className="w-64 h-4" />
        </div>
        <ShimmerSkeleton variant="button" className="w-36" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ShimmerSkeleton key={i} variant="card" className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ShimmerSkeleton variant="card" className="lg:col-span-2 h-64 rounded-2xl" />
        <ShimmerSkeleton variant="card" className="h-64 rounded-2xl" />
      </div>
    </div>
  );
}

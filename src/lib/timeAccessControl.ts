/**
 * Time-Based Access Control for Learning Resources
 * 
 * Rules:
 * - Weekdays: Access allowed 16:00 – 09:00 (next day). Blocked 09:00 – 16:00.
 * - Weekends: 24-hour unrestricted access.
 */

export function isResourceAccessAllowed(now: Date = new Date()): { allowed: boolean; reason: string; nextAvailable?: string } {
  const dayOfWeek = now.getDay(); // 0=Sunday, 6=Saturday
  const hours = now.getHours();

  // Weekend: full access
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return { allowed: true, reason: 'Weekend — unrestricted access' };
  }

  // Weekday
  if (hours >= 16 || hours < 9) {
    return { allowed: true, reason: 'After-hours access (16:00–09:00)' };
  }

  // Blocked window: 09:00–16:00 weekday
  return {
    allowed: false,
    reason: 'Resources are locked during class hours (09:00–16:00)',
    nextAvailable: 'Today at 16:00',
  };
}

export function getAccessStatusLabel(now: Date = new Date()): { label: string; variant: 'open' | 'closed' } {
  const { allowed } = isResourceAccessAllowed(now);
  return allowed
    ? { label: 'Resources Available', variant: 'open' }
    : { label: 'Access Restricted', variant: 'closed' };
}

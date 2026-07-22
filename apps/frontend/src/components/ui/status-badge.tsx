/**
 * RIOS — Status Badge
 *
 * One component for every status label across the product. Combines the shared
 * status→variant mapping with enum humanization so a backend value like
 * `IN_REVIEW` renders as a correctly-toned "In review" badge everywhere —
 * instead of the raw, all-caps, underscore-laden enum that list and detail
 * views were previously printing inline.
 */

import { Badge } from '@/components/ui/badge';
import { humanizeStatus, statusVariant } from '@/lib/status';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string | undefined | null;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  if (!status) return null;
  return (
    <Badge variant={statusVariant(status)} className={cn('shrink-0', className)}>
      {humanizeStatus(status)}
    </Badge>
  );
}

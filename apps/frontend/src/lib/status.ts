/**
 * RIOS — Status → Badge Variant Mapping
 *
 * Shared mapping from backend status strings to design-system badge variants,
 * so every workspace (publications, projects, grants, patents, datasets…)
 * renders statuses consistently. Unknown statuses fall back to a neutral tone.
 */

import type { BadgeProps } from '@/components/ui/badge';

type BadgeVariant = NonNullable<BadgeProps['variant']>;

const STATUS_VARIANTS: Record<string, BadgeVariant> = {
  // Positive / published / active
  PUBLISHED: 'soft-success',
  ACTIVE: 'soft-success',
  COMPLETED: 'soft-success',
  GRANTED: 'soft-success',
  APPROVED: 'soft-success',
  ACCEPTED: 'soft-success',
  RELEASED: 'soft-success',

  // In-progress / pending
  DRAFT: 'soft-secondary',
  IN_PROGRESS: 'soft-primary',
  IN_REVIEW: 'soft-warning',
  UNDER_REVIEW: 'soft-warning',
  SUBMITTED: 'soft-warning',
  PENDING: 'soft-warning',
  FILED: 'soft-warning',

  // Negative / terminal
  REJECTED: 'soft-destructive',
  WITHDRAWN: 'soft-destructive',
  EXPIRED: 'soft-destructive',
  ARCHIVED: 'soft-secondary',
  CANCELLED: 'soft-destructive',
};

/** Map a backend status string to a badge variant. */
export function statusVariant(status: string | undefined | null): BadgeVariant {
  if (!status) return 'soft-secondary';
  return STATUS_VARIANTS[status.toUpperCase().replace(/[\s-]/g, '_')] ?? 'soft-secondary';
}

/** Humanize an ENUM_STATUS into "Enum status" for display. */
export function humanizeStatus(status: string | undefined | null): string {
  if (!status) return '—';
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
}

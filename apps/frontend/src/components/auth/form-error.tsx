'use client';

/**
 * RIOS — Form Error
 *
 * Inline, accessible error banner for auth/form submission failures. Announced
 * to assistive tech via role="alert". Friendly, non-technical copy only.
 */

import { AlertCircle } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Accepts either a `message` prop or children — both call styles are used across
 * the auth screens. Renders nothing when there is no content to show.
 */
export function FormError({
  message,
  children,
  className,
}: {
  message?: string;
  children?: ReactNode;
  className?: string;
}) {
  const content = message ?? children;
  if (!content) return null;

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive',
        className,
      )}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{content}</span>
    </div>
  );
}

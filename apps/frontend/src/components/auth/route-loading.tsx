'use client';

/**
 * RIOS — Route Loading
 *
 * Full-screen, centered loading indicator shown during session restoration and
 * guard transitions. Respects reduced-motion via the shared design system.
 */

import { Loader2 } from 'lucide-react';

export function RouteLoading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

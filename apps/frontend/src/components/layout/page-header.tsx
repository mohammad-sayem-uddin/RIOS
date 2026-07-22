'use client';

/**
 * RIOS — Page Header Component
 *
 * Reusable header for every page with title, description, and optional toolbar.
 */

import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Optional small uppercase label above the title for section context. */
  eyebrow?: string;
  children?: ReactNode; // toolbar/actions
}

export function PageHeader({ title, description, eyebrow, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 space-y-1">
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  );
}

'use client';

/**
 * RIOS — Status Screen
 *
 * Reusable full-screen state for errors and system statuses (403, 404, 500,
 * session expired, account locked, maintenance). Keeps every status page
 * visually consistent and on-brand. Purely presentational — callers supply the
 * icon, copy, and actions.
 */

import Link from 'next/link';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface StatusScreenAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
}

interface StatusScreenProps {
  icon: ReactNode;
  /** Short code shown above the title, e.g. "403". Optional. */
  code?: string;
  title: string;
  description: ReactNode;
  actions?: StatusScreenAction[];
  /** Optional small footnote text at the bottom (e.g. error digest). */
  footNote?: string;
  /** Accent tone for the icon badge. */
  tone?: 'muted' | 'destructive' | 'warning';
  className?: string;
}

const TONE_CLASS: Record<NonNullable<StatusScreenProps['tone']>, string> = {
  muted: 'bg-muted text-muted-foreground',
  destructive: 'bg-destructive/10 text-destructive',
  warning: 'bg-warning/10 text-warning',
};

export function StatusScreen({
  icon,
  code,
  title,
  description,
  actions,
  footNote,
  tone = 'muted',
  className,
}: StatusScreenProps) {
  return (
    <main
      className={cn(
        'flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10 text-center',
        className,
      )}
    >
      <div className="w-full max-w-md">
        <div
          className={cn(
            'mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl [&_svg]:h-7 [&_svg]:w-7',
            TONE_CLASS[tone],
          )}
        >
          {icon}
        </div>

        {code && (
          <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {code}
          </p>
        )}
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <div className="mt-2 text-sm text-muted-foreground">{description}</div>

        {actions && actions.length > 0 && (
          <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
            {actions.map((action) =>
              action.href ? (
                <Button
                  key={action.label}
                  asChild
                  variant={action.variant ?? 'default'}
                  className="w-full sm:w-auto"
                >
                  <Link href={action.href}>{action.label}</Link>
                </Button>
              ) : (
                <Button
                  key={action.label}
                  variant={action.variant ?? 'default'}
                  onClick={action.onClick}
                  className="w-full sm:w-auto"
                >
                  {action.label}
                </Button>
              ),
            )}
          </div>
        )}

        {footNote && <p className="mt-6 text-xs text-muted-foreground">{footNote}</p>}
      </div>
    </main>
  );
}

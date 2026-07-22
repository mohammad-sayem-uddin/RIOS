'use client';

/**
 * RIOS — Auth Shell
 *
 * Shared centered layout for every authentication screen: brand mark, a titled
 * card for the form, and an optional footer slot. Keeps all auth screens
 * visually consistent and responsive without each one re-declaring the frame.
 */

import Link from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface AuthShellProps {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  /** Rendered below the card (e.g. "Don't have an account? Sign up"). */
  footer?: ReactNode;
  className?: string;
}

export function AuthShell({ title, description, children, footer, className }: AuthShellProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <Link href="/" className="flex items-center gap-2" aria-label="RIOS Home">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
              R
            </div>
            <span className="text-lg font-semibold tracking-tight">RIOS</span>
          </Link>
        </div>

        <div className={cn('rounded-xl border bg-card p-6 shadow-sm sm:p-8', className)}>
          <div className="mb-6 flex flex-col gap-1.5 text-center">
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          {children}
        </div>

        {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </main>
  );
}

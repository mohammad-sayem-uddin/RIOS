'use client';

/**
 * RIOS — Data State Components
 *
 * Reusable presentational states for every data-backed view: loading, error,
 * and empty. Centralizing these keeps loading skeletons, error recovery, and
 * empty-state guidance consistent across all workspaces (publications, projects,
 * assets, recognition, intelligence, etc.).
 */

import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/** Full-width loading skeleton for list/table views. */
export function ListLoading({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-3', className)} role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
          <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Grid of card skeletons. */
export function CardGridLoading({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div
      className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-lg border p-5">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="mt-2 h-8 w-24" />
        </div>
      ))}
    </div>
  );
}

/** Error state with retry. Never surfaces raw backend detail. */
export function ErrorState({
  title = 'Something went wrong',
  message = "We couldn't load this content. Please try again.",
  onRetry,
  className,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-destructive/[0.03] px-6 py-16 text-center',
        className,
      )}
      role="alert"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-1 ring-destructive/20">
        <AlertCircle className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      )}
    </div>
  );
}

/** Empty state with optional primary action. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-muted/20 px-6 py-16 text-center',
        className,
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-muted to-muted/40 text-muted-foreground ring-1 ring-border/60">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold">{title}</h3>
        {description && (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}

interface DataStateProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  onRetry?: () => void;
  loading?: ReactNode;
  error?: ReactNode;
  empty: ReactNode;
  children: ReactNode;
}

/**
 * Declarative wrapper that renders the right state for a query result.
 * Order: loading → error → empty → content. Keeps every data view consistent.
 */
export function DataState({
  isLoading,
  isError,
  isEmpty,
  onRetry,
  loading,
  error,
  empty,
  children,
}: DataStateProps) {
  if (isLoading) return <>{loading ?? <ListLoading />}</>;
  if (isError) return <>{error ?? <ErrorState onRetry={onRetry} />}</>;
  if (isEmpty) return <>{empty}</>;
  return <>{children}</>;
}

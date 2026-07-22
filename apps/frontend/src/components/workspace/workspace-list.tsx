'use client';

/**
 * RIOS — Workspace List
 *
 * Reusable scaffold for every list-style workspace (publications, projects,
 * datasets, awards, grants, patents, activities, collaborations, etc.). Handles
 * the header, optional search box, and the loading/error/empty/content states in
 * one place so each workspace page is a thin configuration of this component.
 */

import { Search } from 'lucide-react';
import { type ReactNode } from 'react';

import { DataState, ListLoading, ErrorState, EmptyState } from '@/components/feedback/data-states';
import { PageHeader } from '@/components/layout/page-header';
import { FadeIn } from '@/components/motion/motion-primitives';
import { Input } from '@/components/ui/input';

interface WorkspaceListProps {
  title: string;
  description?: string;
  /** Toolbar actions (e.g. "New" button) rendered in the page header. */
  actions?: ReactNode;
  /** Controlled search value; omit to hide the search box. */
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  onRetry?: () => void;

  /** Empty-state configuration. */
  emptyIcon?: ReactNode;
  emptyTitle: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;

  children: ReactNode;
}

export function WorkspaceList({
  title,
  description,
  actions,
  search,
  onSearchChange,
  searchPlaceholder = 'Search…',
  isLoading,
  isError,
  isEmpty,
  onRetry,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyAction,
  children,
}: WorkspaceListProps) {
  const showSearch = onSearchChange !== undefined;

  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description}>
        {actions}
      </PageHeader>

      {showSearch && (
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search ?? ''}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
            aria-label={searchPlaceholder}
          />
        </div>
      )}

      <DataState
        isLoading={isLoading}
        isError={isError}
        isEmpty={isEmpty}
        onRetry={onRetry}
        loading={<ListLoading rows={6} />}
        error={<ErrorState onRetry={onRetry} />}
        empty={
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
          />
        }
      >
        <FadeIn>{children}</FadeIn>
      </DataState>
    </div>
  );
}

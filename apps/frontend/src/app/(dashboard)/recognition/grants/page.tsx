'use client';

/**
 * RIOS — Grants Workspace
 *
 * Lists research grants and funding. Backed by GET /api/v1/grants (✅ verified).
 */

import { HandCoins, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { WorkspaceList } from '@/components/workspace/workspace-list';
import { useGrants } from '@/hooks/use-domain-queries';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Grant } from '@/types/api';

export default function GrantsPage() {
  const [search, setSearch] = useState('');
  const query = useGrants({ query: search || undefined, limit: 50 });

  return (
    <WorkspaceList
      title="Grants & Funding"
      description="Research funding you've secured."
      actions={
        <Link href="/recognition/grants/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Grant
          </Button>
        </Link>
      }
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search grants…"
      isLoading={query.isLoading}
      isError={query.isError}
      isEmpty={query.items.length === 0}
      onRetry={() => void query.refetch()}
      emptyIcon={<HandCoins className="h-6 w-6" />}
      emptyTitle={search ? 'No matching grants' : 'No grants yet'}
      emptyDescription={
        search ? 'Try a different search term.' : 'Track the research funding you have received.'
      }
      emptyAction={
        !search && (
          <Link href="/recognition/grants/new">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
              Add Grant
            </Button>
          </Link>
        )
      }
    >
      <div className="flex flex-col gap-3">
        {query.items.map((grant: Grant) => (
          <Card key={grant.id}>
            <CardContent className="flex items-start justify-between gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-medium">{grant.title}</h3>
                  {grant.status && <StatusBadge status={grant.status} />}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {grant.funder}
                  {grant.startDate ? ` · ${formatDate(grant.startDate)}` : ''}
                </p>
              </div>
              {grant.amount !== null && grant.amount !== undefined && (
                <span className="shrink-0 text-sm font-medium">
                  {formatCurrency(grant.amount, grant.currency)}
                </span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </WorkspaceList>
  );
}

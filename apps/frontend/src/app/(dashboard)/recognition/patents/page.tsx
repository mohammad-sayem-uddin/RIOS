'use client';

/**
 * RIOS — Patents Workspace
 *
 * Lists patents. Backed by GET /api/v1/patents (✅ verified).
 */

import { ScrollText, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { WorkspaceList } from '@/components/workspace/workspace-list';
import { usePatents } from '@/hooks/use-domain-queries';
import { formatDate } from '@/lib/utils';
import type { Patent } from '@/types/api';

export default function PatentsPage() {
  const [search, setSearch] = useState('');
  const query = usePatents({ query: search || undefined, limit: 50 });

  return (
    <WorkspaceList
      title="Patents"
      description="Track your patents and intellectual property."
      actions={
        <Link href="/recognition/patents/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Patent
          </Button>
        </Link>
      }
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search patents…"
      isLoading={query.isLoading}
      isError={query.isError}
      isEmpty={query.items.length === 0}
      onRetry={() => void query.refetch()}
      emptyIcon={<ScrollText className="h-6 w-6" />}
      emptyTitle={search ? 'No matching patents' : 'No patents yet'}
      emptyDescription={
        search ? 'Try a different search term.' : 'Record your first patent to track your IP.'
      }
      emptyAction={
        !search && (
          <Link href="/recognition/patents/new">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
              Add Patent
            </Button>
          </Link>
        )
      }
    >
      <div className="flex flex-col gap-3">
        {query.items.map((patent: Patent) => (
          <Card key={patent.id}>
            <CardContent className="flex items-start justify-between gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-medium">{patent.title}</h3>
                  {patent.status && <StatusBadge status={patent.status} />}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {patent.patentNumber ? `${patent.patentNumber} · ` : ''}
                  Filed {formatDate(patent.filingDate)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </WorkspaceList>
  );
}

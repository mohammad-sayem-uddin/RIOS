'use client';

/**
 * RIOS — Awards Workspace
 *
 * Lists academic awards and honors. Backed by GET /api/v1/awards (✅ verified).
 */

import { Award as AwardIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WorkspaceList } from '@/components/workspace/workspace-list';
import { useAwards } from '@/hooks/use-domain-queries';
import type { Award } from '@/types/api';

export default function AwardsPage() {
  const [search, setSearch] = useState('');
  const query = useAwards({ query: search || undefined, limit: 50 });

  return (
    <WorkspaceList
      title="Awards & Honors"
      description="Recognition you've received for your research contributions."
      actions={
        <Link href="/recognition/awards/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Award
          </Button>
        </Link>
      }
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search awards…"
      isLoading={query.isLoading}
      isError={query.isError}
      isEmpty={query.items.length === 0}
      onRetry={() => void query.refetch()}
      emptyIcon={<AwardIcon className="h-6 w-6" />}
      emptyTitle={search ? 'No matching awards' : 'No awards yet'}
      emptyDescription={
        search ? 'Try a different search term.' : 'Record the awards and honors you have received.'
      }
      emptyAction={
        !search && (
          <Link href="/recognition/awards/new">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
              Add Award
            </Button>
          </Link>
        )
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {query.items.map((award: Award) => (
          <Card key={award.id}>
            <CardContent className="flex flex-col gap-2 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <AwardIcon className="h-5 w-5" />
              </div>
              <h3 className="font-medium leading-snug">{award.title}</h3>
              <p className="text-sm text-muted-foreground">{award.organization}</p>
              {award.year && <p className="text-xs text-muted-foreground">{award.year}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </WorkspaceList>
  );
}

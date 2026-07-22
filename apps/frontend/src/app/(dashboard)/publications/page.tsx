'use client';

/**
 * RIOS — Publications Workspace
 *
 * Lists the researcher's publications with search and status badges.
 * Backed by GET /api/v1/publications (✅ verified).
 */

import { BookOpen, Plus, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { WorkspaceList } from '@/components/workspace/workspace-list';
import { usePublications } from '@/hooks/use-domain-queries';
import type { Publication } from '@/types/api';

export default function PublicationsPage() {
  const [search, setSearch] = useState('');
  const query = usePublications({ query: search || undefined, limit: 50 });

  return (
    <WorkspaceList
      title="Publications"
      description="Manage your research publications, papers, and articles."
      actions={
        <Link href="/publications/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Publication
          </Button>
        </Link>
      }
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search publications…"
      isLoading={query.isLoading}
      isError={query.isError}
      isEmpty={query.items.length === 0}
      onRetry={() => void query.refetch()}
      emptyIcon={<BookOpen className="h-6 w-6" />}
      emptyTitle={search ? 'No matching publications' : 'No publications yet'}
      emptyDescription={
        search
          ? 'Try a different search term.'
          : 'Add your first publication to start building your research record.'
      }
      emptyAction={
        !search && (
          <Link href="/publications/new">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
              Add Publication
            </Button>
          </Link>
        )
      }
    >
      <div className="flex flex-col gap-3">
        {query.items.map((pub: Publication) => (
          <Link key={pub.id} href={`/publications/${pub.id}`}>
            <Card interactive>
              <CardContent className="flex items-start justify-between gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-medium">{pub.title}</h3>
                    {pub.status && <StatusBadge status={pub.status} />}
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {pub.authors?.map((a) => a.name).join(', ') || 'No authors listed'}
                    {pub.venue?.name ? ` · ${pub.venue.name}` : ''}
                    {pub.year ? ` · ${pub.year}` : ''}
                  </p>
                </div>
                {pub.doi && (
                  <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                    <ExternalLink className="h-3 w-3" />
                    DOI
                  </span>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </WorkspaceList>
  );
}

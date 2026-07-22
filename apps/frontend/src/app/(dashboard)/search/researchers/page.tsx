'use client';

/**
 * RIOS — Researcher Directory
 *
 * Browse/search researchers. Backed by GET /api/v1/search/researchers
 * (✅ verified).
 */

import { GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { WorkspaceList } from '@/components/workspace/workspace-list';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useSearch } from '@/hooks/use-domain-queries';
import type { SearchResultItem } from '@/lib/services';
import { getInitials } from '@/lib/utils';

export default function ResearchersPage() {
  const [search, setSearch] = useState('');
  const debounced = useDebouncedValue(search, 300);
  const query = useSearch('researchers', debounced);
  const researchers = query.items as SearchResultItem[];

  return (
    <WorkspaceList
      title="Researchers"
      description="Discover researchers and explore their public profiles."
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search researchers by name or field…"
      isLoading={query.isLoading && debounced.length > 0}
      isError={query.isError}
      isEmpty={researchers.length === 0}
      onRetry={() => void query.refetch()}
      emptyIcon={<GraduationCap className="h-6 w-6" />}
      emptyTitle={debounced ? 'No researchers found' : 'Search for researchers'}
      emptyDescription={
        debounced
          ? 'Try a different name or research area.'
          : 'Enter a name or field to find researchers.'
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {researchers.map((r) => {
          const name = r.name ?? r.title ?? 'Researcher';
          const card = (
            <Card interactive className="h-full">
              <CardContent className="flex items-center gap-3 p-4">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium">{name}</p>
                  {r.description && (
                    <p className="truncate text-xs text-muted-foreground">{r.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
          return r.slug ? (
            <Link key={r.id} href={`/r/${r.slug}`}>
              {card}
            </Link>
          ) : (
            <div key={r.id}>{card}</div>
          );
        })}
      </div>
    </WorkspaceList>
  );
}

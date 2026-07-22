'use client';

/**
 * RIOS — Global Research Discovery / Universal Search
 *
 * Backed by GET /api/v1/search and its typed variants (✅ verified). Search is
 * debounced and tabbed by entity type. Results link to their detail views where
 * a slug/id is available.
 */

import {
  Search as SearchIcon,
  FileText,
  FolderKanban,
  Database,
  GraduationCap,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { DataState } from '@/components/feedback/data-states';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useSearch } from '@/hooks/use-domain-queries';
import type { SearchResultItem } from '@/lib/services';
import { cn } from '@/lib/utils';

type SearchKind = 'all' | 'publications' | 'projects' | 'datasets' | 'researchers';

const TABS: Array<{ key: SearchKind; label: string; icon: React.ReactNode }> = [
  { key: 'all', label: 'All', icon: <SearchIcon className="h-4 w-4" /> },
  { key: 'publications', label: 'Publications', icon: <FileText className="h-4 w-4" /> },
  { key: 'projects', label: 'Projects', icon: <FolderKanban className="h-4 w-4" /> },
  { key: 'datasets', label: 'Datasets', icon: <Database className="h-4 w-4" /> },
  { key: 'researchers', label: 'Researchers', icon: <GraduationCap className="h-4 w-4" /> },
];

export default function SearchPage() {
  const [term, setTerm] = useState('');
  const [kind, setKind] = useState<SearchKind>('all');
  const debounced = useDebouncedValue(term, 300);
  const query = useSearch(kind, debounced);

  const results = query.items as SearchResultItem[];
  const hasQuery = debounced.trim().length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discover Research"
        description="Search publications, projects, datasets, and researchers across RIOS."
      />

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search across RIOS…"
          className="h-12 pl-11 text-base"
          aria-label="Search"
          autoFocus
        />
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Result types">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={kind === tab.key}
            onClick={() => setKind(tab.key)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
              kind === tab.key
                ? 'border-primary bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent',
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {!hasQuery ? (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <SearchIcon className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">Start typing to search</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Find publications, projects, datasets, and researchers.
          </p>
        </div>
      ) : (
        <DataState
          isLoading={query.isLoading}
          isError={query.isError}
          isEmpty={results.length === 0}
          onRetry={() => void query.refetch()}
          empty={
            <div className="rounded-lg border border-dashed py-16 text-center">
              <p className="text-sm font-medium">No results for “{debounced}”</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try different keywords or another category.
              </p>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            {results.map((item) => (
              <ResultRow key={item.id} item={item} />
            ))}
          </div>
        </DataState>
      )}
    </div>
  );
}

function ResultRow({ item }: { item: SearchResultItem }) {
  const title = item.title ?? item.name ?? 'Untitled';
  const href = item.slug ? `/r/${item.slug}` : undefined;
  const body = (
    <Card interactive>
      <CardContent className="flex items-start justify-between gap-4 p-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium">{title}</h3>
          {item.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
          )}
        </div>
        {item.type && (
          <Badge variant="secondary" className="shrink-0">
            {item.type}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

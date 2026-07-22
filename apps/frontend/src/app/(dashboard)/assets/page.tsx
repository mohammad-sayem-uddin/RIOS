'use client';

/**
 * RIOS — Research Assets Workspace
 *
 * Datasets and code repositories. Backed by GET /api/v1/datasets and
 * GET /api/v1/repositories (✅ verified). A tab switcher (always visible)
 * toggles between the two asset kinds; each has its own search + states.
 */

import { Database, GitBranch, Plus, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { DataState, ListLoading, ErrorState, EmptyState } from '@/components/feedback/data-states';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { useDatasets, useRepositories } from '@/hooks/use-domain-queries';
import { cn, formatBytes } from '@/lib/utils';
import type { Dataset, Repository } from '@/types/api';

type Tab = 'datasets' | 'repositories';

export default function AssetsPage() {
  const [tab, setTab] = useState<Tab>('datasets');
  const [search, setSearch] = useState('');

  const datasets = useDatasets({ query: search || undefined, limit: 50 });
  const repositories = useRepositories({ query: search || undefined, limit: 50 });
  const active = tab === 'datasets' ? datasets : repositories;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Research Assets"
        description="Datasets, code repositories, and other research outputs."
      >
        <Link href="/assets/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Asset
          </Button>
        </Link>
      </PageHeader>

      {/* Tab switcher — always visible so users can switch even from an empty tab. */}
      <div
        className="inline-flex rounded-lg border bg-muted/50 p-1"
        role="tablist"
        aria-label="Asset type"
      >
        <TabButton
          active={tab === 'datasets'}
          onClick={() => setTab('datasets')}
          count={datasets.total}
        >
          Datasets
        </TabButton>
        <TabButton
          active={tab === 'repositories'}
          onClick={() => setTab('repositories')}
          count={repositories.total}
        >
          Repositories
        </TabButton>
      </div>

      <div className="relative max-w-md">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${tab}…`}
          aria-label={`Search ${tab}`}
        />
      </div>

      <DataState
        isLoading={active.isLoading}
        isError={active.isError}
        isEmpty={active.items.length === 0}
        onRetry={() => void active.refetch()}
        loading={<ListLoading rows={4} />}
        error={<ErrorState onRetry={() => void active.refetch()} />}
        empty={
          <EmptyState
            icon={
              tab === 'datasets' ? (
                <Database className="h-6 w-6" />
              ) : (
                <GitBranch className="h-6 w-6" />
              )
            }
            title={`No ${tab} yet`}
            description={`Add your first ${
              tab === 'datasets' ? 'dataset' : 'repository'
            } to build your research repository.`}
          />
        }
      >
        {tab === 'datasets' ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {datasets.items.map((ds: Dataset) => (
              <Card key={ds.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium">{ds.title}</h3>
                    {ds.status && <StatusBadge status={ds.status} />}
                  </div>
                  {ds.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {ds.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    {ds.format && <span>{ds.format}</span>}
                    {ds.size ? <span>{formatBytes(ds.size)}</span> : null}
                    {ds.license && <span>{ds.license}</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {repositories.items.map((repo: Repository) => (
              <Card key={repo.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium">{repo.name}</h3>
                    {repo.language && <Badge variant="outline">{repo.language}</Badge>}
                  </div>
                  {repo.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {repo.description}
                    </p>
                  )}
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    View repository
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DataState>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
        active ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
      <span className="text-xs text-muted-foreground">{count}</span>
    </button>
  );
}

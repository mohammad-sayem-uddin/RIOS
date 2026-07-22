'use client';

/**
 * RIOS — Professional Activities Workspace
 *
 * Lists professional/service activities. Backed by
 * GET /api/v1/professional-activities (✅ verified).
 */

import { Briefcase, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WorkspaceList } from '@/components/workspace/workspace-list';
import { useActivities } from '@/hooks/use-domain-queries';
import { formatDate } from '@/lib/utils';
import type { ProfessionalActivity } from '@/types/api';

export default function ProfessionalActivitiesPage() {
  const [search, setSearch] = useState('');
  const query = useActivities({ query: search || undefined, limit: 50 });

  return (
    <WorkspaceList
      title="Professional Activities"
      description="Service, reviewing, committees, and other professional contributions."
      actions={
        <Link href="/recognition/activities/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Activity
          </Button>
        </Link>
      }
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search activities…"
      isLoading={query.isLoading}
      isError={query.isError}
      isEmpty={query.items.length === 0}
      onRetry={() => void query.refetch()}
      emptyIcon={<Briefcase className="h-6 w-6" />}
      emptyTitle={search ? 'No matching activities' : 'No activities yet'}
      emptyDescription={
        search
          ? 'Try a different search term.'
          : 'Record professional service and activities to enrich your profile.'
      }
      emptyAction={
        !search && (
          <Link href="/recognition/activities/new">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
              Add Activity
            </Button>
          </Link>
        )
      }
    >
      <div className="flex flex-col gap-3">
        {query.items.map((activity: ProfessionalActivity) => (
          <Card key={activity.id}>
            <CardContent className="flex items-start justify-between gap-4 p-4">
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium">{activity.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {activity.role}
                  {activity.organization ? ` · ${activity.organization}` : ''}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatDate(activity.startDate)}
                {activity.endDate ? ` – ${formatDate(activity.endDate)}` : ''}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </WorkspaceList>
  );
}

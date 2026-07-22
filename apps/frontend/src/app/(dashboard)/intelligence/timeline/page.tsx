'use client';

/**
 * RIOS — Research Timeline
 *
 * Chronological view of research events. Backed by GET /api/v1/timeline
 * (✅ verified).
 */

import { Clock, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { WorkspaceList } from '@/components/workspace/workspace-list';
import { useTimeline } from '@/hooks/use-domain-queries';
import { formatDate } from '@/lib/utils';

export default function TimelinePage() {
  const query = useTimeline({ limit: 100 });
  const events = query.items
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <WorkspaceList
      title="Research Timeline"
      description="A chronological record of your research milestones and events."
      actions={
        <Button variant="outline">
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      }
      isLoading={query.isLoading}
      isError={query.isError}
      isEmpty={events.length === 0}
      onRetry={() => void query.refetch()}
      emptyIcon={<Clock className="h-6 w-6" />}
      emptyTitle="No timeline events yet"
      emptyDescription="Timeline events populate as you record research milestones and activity."
    >
      <ol className="relative border-l pl-6">
        {events.map((event) => (
          <li key={event.id} className="mb-6 last:mb-0">
            <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
            <time className="text-xs font-medium text-muted-foreground">
              {formatDate(event.date)}
            </time>
            <h3 className="mt-0.5 font-medium">{event.title}</h3>
            {event.description && (
              <p className="mt-0.5 text-sm text-muted-foreground">{event.description}</p>
            )}
          </li>
        ))}
      </ol>
    </WorkspaceList>
  );
}

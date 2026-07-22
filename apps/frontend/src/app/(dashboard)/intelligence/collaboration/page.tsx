'use client';

/**
 * RIOS — Collaboration Network
 *
 * Lists research collaborators. Backed by GET /api/v1/collaborations (✅ verified).
 */

import { Users } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { WorkspaceList } from '@/components/workspace/workspace-list';
import { useCollaborations } from '@/hooks/use-domain-queries';
import { getInitials } from '@/lib/utils';

export default function CollaborationPage() {
  const query = useCollaborations({ limit: 100 });
  const collaborators = query.items;

  return (
    <WorkspaceList
      title="Collaboration Network"
      description="Researchers you have collaborated with across projects and publications."
      isLoading={query.isLoading}
      isError={query.isError}
      isEmpty={collaborators.length === 0}
      onRetry={() => void query.refetch()}
      emptyIcon={<Users className="h-6 w-6" />}
      emptyTitle="No collaborators yet"
      emptyDescription="Your collaboration network builds automatically as you co-author work."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collaborators.map((c) => {
          const name = c.name ?? c.collaboratorName ?? 'Collaborator';
          const count = c.collaborationCount ?? c.jointPublicationCount;
          return (
            <Card key={c.id}>
              <CardContent className="flex items-center gap-3 p-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-sm text-primary">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{name}</p>
                  {c.institution && (
                    <p className="truncate text-xs text-muted-foreground">{c.institution}</p>
                  )}
                </div>
                {typeof count === 'number' && <Badge variant="secondary">{count}</Badge>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </WorkspaceList>
  );
}

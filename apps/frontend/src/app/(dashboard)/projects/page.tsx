'use client';

/**
 * RIOS — Research Projects Workspace
 *
 * Lists the researcher's projects. Backed by
 * GET /api/v1/research-profiles/:profileId/research-projects (✅ verified),
 * so it resolves the current profile first.
 */

import { FolderKanban, Plus, Users } from 'lucide-react';
import Link from 'next/link';

import { EmptyState } from '@/components/feedback/data-states';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { WorkspaceList } from '@/components/workspace/workspace-list';
import { useMyProfile, useProjects } from '@/hooks/use-domain-queries';
import { formatDate } from '@/lib/utils';
import type { ResearchProject } from '@/types/api';

export default function ProjectsPage() {
  const profile = useMyProfile();
  const profileId = profile.data?.id;
  const query = useProjects(profileId);

  // No profile yet → guide the user to onboarding rather than showing an error.
  if (!profile.isLoading && !profileId) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={<FolderKanban className="h-6 w-6" />}
          title="Create your research profile first"
          description="Projects are attached to your research profile. Set one up to get started."
          action={
            <Link href="/onboarding">
              <Button variant="outline" size="sm">
                Set up profile
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <WorkspaceList
      title="Research Projects"
      description="Track your active and completed research projects."
      actions={
        <Link href="/projects/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      }
      isLoading={profile.isLoading || query.isLoading}
      isError={query.isError}
      isEmpty={query.items.length === 0}
      onRetry={() => void query.refetch()}
      emptyIcon={<FolderKanban className="h-6 w-6" />}
      emptyTitle="No projects yet"
      emptyDescription="Create your first research project to track its lifecycle."
      emptyAction={
        <Link href="/projects/new">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {query.items.map((project: ResearchProject) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card interactive className="h-full">
              <CardContent className="flex h-full flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium leading-snug">{project.title}</h3>
                  {project.status && <StatusBadge status={project.status} />}
                </div>
                {project.description && (
                  <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(project.startDate)}</span>
                  {project.members?.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {project.members.length}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </WorkspaceList>
  );
}

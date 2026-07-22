'use client';

/**
 * RIOS — Research Project Detail
 *
 * Full record for a single project. Backed by GET /api/v1/research-projects/:id
 * (✅ verified). Supports complete/delete via verified mutation endpoints.
 */

import { ArrowLeft, Trash2, CheckCircle2, Users, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { toast } from 'sonner';

import { ListLoading, ErrorState, EmptyState } from '@/components/feedback/data-states';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { useProject } from '@/hooks/use-domain-queries';
import { mapAuthError } from '@/lib/auth-errors';
import { projectsService } from '@/lib/services';
import { humanizeStatus } from '@/lib/status';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const query = useProject(id);
  const [busy, setBusy] = useState(false);

  if (query.isLoading) return <ListLoading rows={4} />;
  if (query.isError || !query.data) {
    return (
      <ErrorState
        title="Project not found"
        message="We couldn't load this project. It may have been removed."
        onRetry={() => void query.refetch()}
      />
    );
  }

  const project = query.data;

  const handleComplete = async () => {
    setBusy(true);
    try {
      await projectsService.complete(id);
      toast.success('Project marked complete');
      void query.refetch();
    } catch (error) {
      toast.error(mapAuthError(error));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await projectsService.remove(id);
      toast.success('Project deleted');
      router.replace('/projects');
    } catch (error) {
      toast.error(mapAuthError(error));
      setBusy(false);
    }
  };

  const isCompleted = project.status?.toUpperCase() === 'COMPLETED';

  return (
    <div className="space-y-6">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to projects
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {project.status && <StatusBadge status={project.status} />}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!isCompleted && (
            <Button
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => void handleComplete()}
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark complete
            </Button>
          )}
          <Button variant="outline" size="sm" disabled={busy} onClick={() => void handleDelete()}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {project.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              Timeline & Funding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Start date" value={formatDate(project.startDate)} />
            <Row
              label="End date"
              value={project.endDate ? formatDate(project.endDate) : 'Ongoing'}
            />
            <Row label="Funding agency" value={project.fundingAgency} />
            <Row label="Grant identifier" value={project.grantIdentifier} />
            <Row
              label="Budget"
              value={project.budget ? formatCurrency(project.budget) : undefined}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Team ({project.members?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {project.members?.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {project.members.map((member: { id: string; name: string; role: string }) => (
                  <li key={member.id} className="flex items-center justify-between gap-2">
                    <span className="font-medium">{member.name}</span>
                    <Badge variant="secondary">{humanizeStatus(member.role)}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No team members"
                description="Add collaborators to this project."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value ?? '—'}</span>
    </div>
  );
}

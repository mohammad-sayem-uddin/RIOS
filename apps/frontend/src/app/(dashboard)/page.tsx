'use client';

/**
 * RIOS — Research Command Center (Dashboard)
 *
 * The primary workspace. Aggregates live data from the verified domain APIs
 * (profile, publications, projects, recognition, assets, analytics) into a
 * unified overview with per-widget loading / empty / error states.
 */

import {
  BookOpen,
  FolderKanban,
  Award,
  Database,
  Plus,
  ArrowUpRight,
  Sparkles,
  FileText,
  HandCoins,
  Quote,
  Hash,
} from 'lucide-react';
import Link from 'next/link';

import { EmptyState, ErrorState } from '@/components/feedback/data-states';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  useMyProfile,
  usePublications,
  useProjects,
  useAwards,
  useGrants,
  useDatasets,
  useAnalytics,
} from '@/hooks/use-domain-queries';
import { formatRelativeTime } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import type { Publication, ResearchProject } from '@/types/api';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/** Metric card with a live value + loading state. */
function MetricCard({
  label,
  value,
  isLoading,
  icon,
  href,
}: {
  label: string;
  value: number | string;
  isLoading: boolean;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card interactive className="group cursor-pointer">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            {isLoading ? (
              <Skeleton className="mt-1 h-7 w-12" />
            ) : (
              <p className="text-2xl font-bold tracking-tight">{value}</p>
            )}
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </CardContent>
      </Card>
    </Link>
  );
}

function QuickAction({
  label,
  icon,
  href,
}: {
  label: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link href={href}>
      <Button
        variant="outline"
        className="h-auto w-full flex-col gap-2 px-6 py-4 transition-all hover:border-primary/50 hover:bg-primary/5"
      >
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </Button>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const profile = useMyProfile();
  const profileId = profile.data?.id;

  const publications = usePublications({ limit: 5 });
  const projects = useProjects(profileId);
  const awards = useAwards({ limit: 100 });
  const grants = useGrants({ limit: 100 });
  const datasets = useDatasets({ limit: 100 });
  const analytics = useAnalytics();

  const displayName = user?.displayName ?? 'Researcher';

  const activeProjects = projects.items.filter(
    (p: ResearchProject) => p.status?.toUpperCase() !== 'COMPLETED',
  );

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="space-y-1">
        <PageHeader
          title={`${getGreeting()}, ${displayName}`}
          description="Here is your research overview for today."
        />
        <p className="text-xs text-muted-foreground">
          {new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(new Date())}
        </p>
      </div>

      {/* Metrics */}
      <section aria-label="Research metrics">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Publications"
            value={publications.total}
            isLoading={publications.isLoading}
            icon={<BookOpen className="h-5 w-5" />}
            href="/publications"
          />
          <MetricCard
            label="Projects"
            value={projects.total}
            isLoading={profile.isLoading || projects.isLoading}
            icon={<FolderKanban className="h-5 w-5" />}
            href="/projects"
          />
          <MetricCard
            label="Awards"
            value={awards.total}
            isLoading={awards.isLoading}
            icon={<Award className="h-5 w-5" />}
            href="/recognition/awards"
          />
          <MetricCard
            label="Datasets"
            value={datasets.total}
            isLoading={datasets.isLoading}
            icon={<Database className="h-5 w-5" />}
            href="/assets"
          />
        </div>
      </section>

      {/* Analytics snapshot */}
      <section aria-label="Impact snapshot">
        <div className="grid gap-4 sm:grid-cols-3">
          <ImpactStat
            label="Citations"
            value={analytics.data?.totalCitations}
            isLoading={analytics.isLoading}
            icon={<Quote className="h-4 w-4" />}
          />
          <ImpactStat
            label="h-index"
            value={analytics.data?.hIndex}
            isLoading={analytics.isLoading}
            icon={<Hash className="h-4 w-4" />}
          />
          <ImpactStat
            label="Grants"
            value={grants.total}
            isLoading={grants.isLoading}
            icon={<HandCoins className="h-4 w-4" />}
          />
        </div>
      </section>

      {/* Quick actions */}
      <section aria-label="Quick actions">
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Quick actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <QuickAction
            label="New Publication"
            icon={<BookOpen className="h-5 w-5 text-primary" />}
            href="/publications/new"
          />
          <QuickAction
            label="New Project"
            icon={<FolderKanban className="h-5 w-5 text-primary" />}
            href="/projects/new"
          />
          <QuickAction
            label="Upload Dataset"
            icon={<Database className="h-5 w-5 text-primary" />}
            href="/assets/new"
          />
          <QuickAction
            label="Add Award"
            icon={<Award className="h-5 w-5 text-primary" />}
            href="/recognition/awards/new"
          />
          <QuickAction
            label="Edit Profile"
            icon={<FileText className="h-5 w-5 text-primary" />}
            href="/profile/edit"
          />
          <QuickAction
            label="AI Assistant"
            icon={<Sparkles className="h-5 w-5 text-primary" />}
            href="/ai/recommendations"
          />
        </div>
      </section>

      {/* Content grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent publications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Recent Publications</CardTitle>
              <CardDescription>Your latest research output</CardDescription>
            </div>
            <Link href="/publications">
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {publications.isLoading ? (
              <WidgetLoading />
            ) : publications.isError ? (
              <ErrorState onRetry={() => void publications.refetch()} />
            ) : publications.items.length === 0 ? (
              <EmptyState
                icon={<BookOpen className="h-5 w-5" />}
                title="No publications yet"
                description="Add your first publication to start tracking your research output."
                action={
                  <Link href="/publications/new">
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4" />
                      Add publication
                    </Button>
                  </Link>
                }
              />
            ) : (
              <ul className="divide-y">
                {publications.items.slice(0, 5).map((pub: Publication) => (
                  <li key={pub.id} className="py-2.5">
                    <Link
                      href={`/publications/${pub.id}`}
                      className="group flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium group-hover:text-primary">
                          {pub.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {pub.year ?? '—'} · {pub.venue?.name ?? pub.type}
                        </p>
                      </div>
                      <StatusBadge status={pub.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Active projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Active Projects</CardTitle>
              <CardDescription>Currently running research</CardDescription>
            </div>
            <Link href="/projects">
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {!profileId && profile.isLoading ? (
              <WidgetLoading />
            ) : projects.isError ? (
              <ErrorState onRetry={() => void projects.refetch()} />
            ) : activeProjects.length === 0 ? (
              <EmptyState
                icon={<FolderKanban className="h-5 w-5" />}
                title="No active projects"
                description="Create a research project to track its lifecycle and members."
                action={
                  <Link href="/projects/new">
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4" />
                      Create project
                    </Button>
                  </Link>
                }
              />
            ) : (
              <ul className="divide-y">
                {activeProjects.slice(0, 5).map((project: ResearchProject) => (
                  <li key={project.id} className="py-2.5">
                    <Link
                      href={`/projects/${project.id}`}
                      className="group flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium group-hover:text-primary">
                          {project.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Updated {formatRelativeTime(project.updatedAt)}
                        </p>
                      </div>
                      <StatusBadge status={project.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ImpactStat({
  label,
  value,
  isLoading,
  icon,
}: {
  label: string;
  value: number | undefined;
  isLoading: boolean;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          {icon}
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          {isLoading ? (
            <Skeleton className="mt-1 h-6 w-10" />
          ) : (
            <p className="text-lg font-semibold">{value ?? '—'}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function WidgetLoading() {
  return (
    <div className="flex flex-col gap-3 py-2" role="status" aria-label="Loading">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-3">
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

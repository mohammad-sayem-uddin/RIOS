'use client';

/**
 * RIOS — Research Analytics
 *
 * Impact metrics dashboard. Backed by GET /api/v1/analytics and
 * GET /api/v1/analytics/impact (✅ verified). Metrics that the backend does not
 * return simply render an em-dash — no fabricated numbers.
 */

import { BarChart3, Quote, Hash, TrendingUp, FileText } from 'lucide-react';

import { ErrorState } from '@/components/feedback/data-states';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnalytics, useResearchImpact } from '@/hooks/use-domain-queries';
import { type AnalyticsOverview, type ImpactOverview } from '@/lib/services';
import { formatCompactNumber } from '@/lib/utils';

function MetricTile({
  label,
  value,
  icon,
  isLoading,
}: {
  label: string;
  value: number | undefined;
  icon: React.ReactNode;
  isLoading: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          {isLoading ? (
            <Skeleton className="mt-1 h-7 w-16" />
          ) : (
            <p className="text-2xl font-bold tracking-tight">
              {value === undefined ? '—' : formatCompactNumber(value)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const analytics = useAnalytics();
  const impact = useResearchImpact();

  const isLoading = analytics.isLoading || impact.isLoading;
  const data: AnalyticsOverview & ImpactOverview = { ...analytics.data, ...impact.data };

  if (analytics.isError && impact.isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Research Analytics"
          description="Your research impact and citation metrics."
        />
        <ErrorState
          onRetry={() => {
            void analytics.refetch();
            void impact.refetch();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Research Analytics"
        description="Your research impact, citations, and productivity metrics."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricTile
          label="Total Citations"
          value={data.totalCitations}
          icon={<Quote className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <MetricTile
          label="h-index"
          value={data.hIndex}
          icon={<Hash className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <MetricTile
          label="i10-index"
          value={data.i10Index}
          icon={<TrendingUp className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <MetricTile
          label="Publications"
          value={data.publicationCount}
          icon={<FileText className="h-5 w-5" />}
          isLoading={isLoading}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4" />
            Impact overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Detailed citation trends and per-publication breakdowns appear here as the backend
            analytics pipeline populates them. Metrics reflect data returned by the analytics
            service and are never estimated on the client.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

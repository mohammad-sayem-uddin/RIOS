'use client';

/**
 * RIOS — Publication Detail
 *
 * Full record for a single publication. Backed by GET /api/v1/publications/:id
 * (✅ verified). Supports publish/submit/delete via the verified mutation endpoints.
 */

import { ArrowLeft, ExternalLink, Trash2, Send, Globe } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { toast } from 'sonner';

import { ListLoading, ErrorState } from '@/components/feedback/data-states';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { usePublication } from '@/hooks/use-domain-queries';
import { mapAuthError } from '@/lib/auth-errors';
import { publicationsService } from '@/lib/services';
import { humanizeStatus } from '@/lib/status';

export default function PublicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const query = usePublication(id);
  const [busy, setBusy] = useState(false);

  if (query.isLoading) return <ListLoading rows={4} />;
  if (query.isError || !query.data) {
    return (
      <ErrorState
        title="Publication not found"
        message="We couldn't load this publication. It may have been removed."
        onRetry={() => void query.refetch()}
      />
    );
  }

  const pub = query.data;

  const runAction = async (fn: () => Promise<unknown>, successMessage: string) => {
    setBusy(true);
    try {
      await fn();
      toast.success(successMessage);
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
      await publicationsService.remove(id);
      toast.success('Publication deleted');
      router.replace('/publications');
    } catch (error) {
      toast.error(mapAuthError(error));
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/publications"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to publications
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {pub.type && <Badge variant="secondary">{humanizeStatus(pub.type)}</Badge>}
            {pub.status && <StatusBadge status={pub.status} />}
            {pub.year && <span className="text-sm text-muted-foreground">{pub.year}</span>}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{pub.title}</h1>
          {pub.authors?.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {pub.authors.map((a: { name: string }) => a.name).join(', ')}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {pub.status?.toUpperCase() === 'DRAFT' && (
            <Button
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() =>
                void runAction(() => publicationsService.submit(id), 'Submitted for review')
              }
            >
              <Send className="h-4 w-4" />
              Submit
            </Button>
          )}
          {pub.status?.toUpperCase() !== 'PUBLISHED' && (
            <Button
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() =>
                void runAction(() => publicationsService.publish(id), 'Publication published')
              }
            >
              <Globe className="h-4 w-4" />
              Publish
            </Button>
          )}
          <Button variant="outline" size="sm" disabled={busy} onClick={() => void handleDelete()}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {pub.abstract && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Abstract</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{pub.abstract}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <DetailRow label="Venue" value={pub.venue?.name} />
            <DetailRow label="Publisher" value={pub.publisher?.name} />
            <DetailRow label="Language" value={pub.language} />
            <DetailRow
              label="DOI"
              value={
                pub.doi ? (
                  <a
                    href={`https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    {pub.doi}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : undefined
              }
            />
          </CardContent>
        </Card>

        {pub.keywords?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {pub.keywords.map((kw: string) => (
                  <Badge key={kw} variant="outline">
                    {kw}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value ?? '—'}</span>
    </div>
  );
}

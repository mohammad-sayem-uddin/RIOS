'use client';

/**
 * RIOS — Public Research Portfolio
 *
 * Public-facing researcher showcase at /r/[slug]. Backed by
 * GET /api/v1/profiles/:slug (✅ verified) — a public endpoint (no auth guard),
 * so this route lives outside the dashboard shell and renders standalone.
 */

import { ExternalLink, Link2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

import { ListLoading, ErrorState } from '@/components/feedback/data-states';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePublicProfile } from '@/hooks/use-domain-queries';
import { getInitials } from '@/lib/utils';

export default function PublicPortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const query = usePublicProfile(slug);

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Public top bar */}
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2" aria-label="RIOS Home">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              R
            </div>
            <span className="text-sm font-semibold tracking-tight">RIOS</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {query.isLoading ? (
          <ListLoading rows={4} />
        ) : query.isError || !query.data ? (
          <ErrorState
            title="Profile not available"
            message="This researcher profile doesn't exist or hasn't been published."
            onRetry={() => void query.refetch()}
          />
        ) : (
          <PortfolioBody profile={query.data} />
        )}

        <div className="mt-10 text-center">
          <Link
            href="/search/researchers"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Browse more researchers
          </Link>
        </div>
      </main>
    </div>
  );
}

function PortfolioBody({
  profile,
}: {
  profile: {
    slug: string;
    displayName?: string;
    title?: string;
    headline?: string;
    biography?: string;
    researchInterests?: Array<{ id?: string; name: string }>;
    externalProfiles?: Array<{ id?: string; provider: string; url: string }>;
  };
}) {
  const name = profile.displayName ?? profile.title ?? 'Researcher';

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-8 text-center">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="bg-primary/10 text-2xl text-primary">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
          {profile.title && <p className="text-muted-foreground">{profile.title}</p>}
          {profile.headline && <p className="mt-2 max-w-xl text-sm">{profile.headline}</p>}
        </div>
        {profile.externalProfiles && profile.externalProfiles.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {profile.externalProfiles.map((ext, i) => (
              <a
                key={ext.id ?? i}
                href={ext.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium hover:bg-accent"
              >
                <Link2 className="h-3 w-3" />
                {ext.provider.replace(/_/g, ' ')}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        )}
      </div>

      {profile.biography && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {profile.biography}
            </p>
          </CardContent>
        </Card>
      )}

      {profile.researchInterests && profile.researchInterests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Research Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.researchInterests.map((interest, i) => (
                <Badge key={interest.id ?? i} variant="secondary">
                  {interest.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

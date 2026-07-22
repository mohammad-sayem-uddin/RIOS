/**
 * RIOS — Public Portfolio Layout
 *
 * Generates per-researcher metadata (title, description, Open Graph, Twitter)
 * for the public portfolio route so shared links and search engines show the
 * researcher's name and headline instead of a generic RIOS card.
 *
 * This is a dynamic route, so `generateMetadata` runs per-request on the server
 * (never at build time) — a backend outage can't break `next build`. Any fetch
 * failure falls back to the generic static metadata, so the worst case is
 * exactly the previous behavior.
 */

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

/** Backend origin for server-side fetches; mirrors the dev rewrite target. */
const BACKEND_ORIGIN =
  process.env.BACKEND_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:3000';

const FALLBACK_TITLE = 'Researcher Portfolio — RIOS';
const FALLBACK_DESCRIPTION =
  'Public research portfolio powered by RIOS — the Research Identity Operating System.';

const fallbackMetadata: Metadata = {
  title: FALLBACK_TITLE,
  description: FALLBACK_DESCRIPTION,
  openGraph: { title: FALLBACK_TITLE, description: FALLBACK_DESCRIPTION, type: 'profile' },
  twitter: { card: 'summary' },
};

interface PublicProfile {
  displayName?: string;
  title?: string;
  headline?: string;
  biography?: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(`${BACKEND_ORIGIN}/api/v1/profiles/${encodeURIComponent(slug)}`, {
      // Cache briefly so repeated shares/crawls don't hammer the backend, while
      // still reflecting profile edits within a minute.
      next: { revalidate: 60 },
    });
    if (!res.ok) return fallbackMetadata;

    const json = (await res.json()) as { success?: boolean; data?: PublicProfile };
    const profile = json.data;
    if (!json.success || !profile) return fallbackMetadata;

    const name = profile.displayName ?? profile.title ?? 'Researcher';
    const title = `${name} — Research Portfolio`;
    const description =
      profile.headline ??
      profile.biography?.slice(0, 160) ??
      `${name}'s research portfolio on RIOS — publications, projects, and academic output.`;

    return {
      title,
      description,
      openGraph: { title, description, type: 'profile', url: `/r/${slug}` },
      twitter: { card: 'summary', title, description },
    };
  } catch {
    return fallbackMetadata;
  }
}

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

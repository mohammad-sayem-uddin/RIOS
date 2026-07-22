'use client';

/**
 * RIOS — Breadcrumb
 *
 * Derives breadcrumb segments from the current pathname and renders an
 * accessible trail. Labels are humanized from the URL segment and, where a
 * matching navigation item exists, use its canonical label instead.
 */

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { flattenNav, BREADCRUMB_LABELS } from '@/lib/navigation';

interface Crumb {
  label: string;
  href: string;
}

/** Convert a URL segment like "knowledge-graph" into "Knowledge Graph". */
function humanize(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function buildCrumbs(pathname: string): Crumb[] {
  const navLabelByHref = new Map(flattenNav().map((item) => [item.href, item.label]));
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: Crumb[] = [{ label: 'Home', href: '/' }];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    crumbs.push({
      label: navLabelByHref.get(currentPath) ?? BREADCRUMB_LABELS[segment] ?? humanize(segment),
      href: currentPath,
    });
  }

  return crumbs;
}

export function Breadcrumb() {
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname);

  return (
    <nav aria-label="Breadcrumb" className="hidden sm:block">
      <ol className="flex items-center gap-1 text-sm">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
              )}
              {isLast ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

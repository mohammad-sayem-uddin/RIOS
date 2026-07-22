'use client';

/**
 * RIOS — Route Guards
 *
 * Client-side route protection. The backend remains the true authority (every
 * protected API enforces auth server-side); these guards only shape the SPA
 * experience — redirecting unauthenticated users to login, keeping authenticated
 * users out of the auth screens, and gating role-restricted areas.
 *
 * Guards render a full-screen loading state while the session is being restored
 * so protected content never flashes before the auth check resolves.
 */

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { RouteLoading } from '@/components/auth/route-loading';
import { useAuth } from '@/providers/auth-provider';

/** Requires an authenticated session. Redirects to /login (preserving return path). */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const returnTo = encodeURIComponent(pathname);
      router.replace(`/login?returnTo=${returnTo}`);
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) return <RouteLoading label="Restoring your session…" />;
  if (!isAuthenticated) return <RouteLoading label="Redirecting to sign in…" />;

  return <>{children}</>;
}

/** For public auth screens. Redirects already-authenticated users away. */
export function GuestGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const returnTo = searchParams.get('returnTo');
      router.replace(returnTo ? decodeURIComponent(returnTo) : '/');
    }
  }, [isLoading, isAuthenticated, searchParams, router]);

  if (isLoading) return <RouteLoading label="Loading…" />;
  if (isAuthenticated) return <RouteLoading label="Taking you to your workspace…" />;

  return <>{children}</>;
}

/**
 * Requires the user to hold at least one of the given roles. Renders the
 * unauthorized fallback (403) otherwise. Assumes AuthGuard runs above it.
 */
export function RoleGuard({
  roles,
  children,
  fallback,
}: {
  roles: string[];
  children: ReactNode;
  fallback: ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <RouteLoading label="Checking permissions…" />;

  const hasRole = user?.roles.some((role) => roles.includes(role)) ?? false;
  if (!hasRole) return <>{fallback}</>;

  return <>{children}</>;
}

import { Suspense, type ReactNode } from 'react';

import { GuestGuard } from '@/components/auth/route-guard';
import { RouteLoading } from '@/components/auth/route-loading';

/**
 * Layout for the public authentication routes (login, register, password reset,
 * verification). Wrapped in a GuestGuard so already-authenticated users are
 * redirected to their workspace instead of seeing the auth screens.
 *
 * Each screen renders its own <AuthShell title=…> so titles and descriptions
 * stay screen-specific.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<RouteLoading label="Loading…" />}>
      <GuestGuard>{children}</GuestGuard>
    </Suspense>
  );
}

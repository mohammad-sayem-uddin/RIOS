import { AuthGuard } from '@/components/auth/route-guard';
import { AppLayout } from '@/components/layout/app-layout';

/**
 * Layout for all authenticated workspace routes. Wrapped in an AuthGuard so
 * unauthenticated users are redirected to /login (preserving their return path)
 * and protected content never flashes before the session check resolves.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppLayout>{children}</AppLayout>
    </AuthGuard>
  );
}

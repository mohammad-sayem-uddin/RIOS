/**
 * RIOS — 403 Unauthorized
 *
 * Shown when an authenticated user lacks the role/permission for an area.
 * Used as the RoleGuard fallback and reachable directly at /unauthorized.
 */

import { ShieldX } from 'lucide-react';

import { StatusScreen } from '@/components/feedback/status-screen';

export default function UnauthorizedPage() {
  return (
    <StatusScreen
      tone="warning"
      icon={<ShieldX />}
      code="403"
      title="Access denied"
      description="You don't have permission to view this page. If you believe this is a mistake, contact your administrator."
      actions={[
        { label: 'Go to dashboard', href: '/' },
        { label: 'Contact support', href: '/support', variant: 'outline' },
      ]}
    />
  );
}

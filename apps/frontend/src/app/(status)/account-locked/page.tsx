/**
 * RIOS — Account Locked
 *
 * Shown when the backend reports a locked account (e.g. too many failed
 * attempts). Directs the user to recovery / support.
 */

import { Lock } from 'lucide-react';

import { StatusScreen } from '@/components/feedback/status-screen';

export default function AccountLockedPage() {
  return (
    <StatusScreen
      tone="destructive"
      icon={<Lock />}
      title="Account temporarily locked"
      description="Your account has been locked after multiple unsuccessful sign-in attempts. Try again later or reset your password."
      actions={[
        { label: 'Reset password', href: '/forgot-password' },
        { label: 'Contact support', href: '/support', variant: 'outline' },
      ]}
    />
  );
}

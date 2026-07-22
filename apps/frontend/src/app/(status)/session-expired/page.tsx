'use client';

/**
 * RIOS — Session Expired
 *
 * Shown after a forced logout (expired refresh token / revoked session).
 * Clears any residual tokens and offers a path back to sign in.
 */

import { Clock } from 'lucide-react';
import { useEffect } from 'react';

import { StatusScreen } from '@/components/feedback/status-screen';
import { clearTokens } from '@/lib/api-client';

export default function SessionExpiredPage() {
  useEffect(() => {
    clearTokens();
  }, []);

  return (
    <StatusScreen
      tone="warning"
      icon={<Clock />}
      title="Your session expired"
      description="For your security, you've been signed out due to inactivity. Please sign in again to continue."
      actions={[{ label: 'Sign in again', href: '/login' }]}
    />
  );
}

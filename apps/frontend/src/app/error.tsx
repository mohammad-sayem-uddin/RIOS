'use client';

/**
 * RIOS — Global Error Boundary (500 / unexpected)
 *
 * App Router special file. Catches render/runtime errors in the route tree.
 * Must be a client component and accepts a `reset` to retry the segment.
 * Backend detail is never surfaced — only the digest for support reference.
 */

import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

import { StatusScreen } from '@/components/feedback/status-screen';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for observability; never shown to the user.
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <StatusScreen
      icon={<AlertTriangle />}
      code="500"
      title="Something went wrong"
      description="An unexpected error occurred. You can try again, or head back to your dashboard."
      actions={[
        { label: 'Try again', onClick: reset },
        { label: 'Go to dashboard', href: '/', variant: 'outline' },
      ]}
      footNote={error.digest ? `Reference: ${error.digest}` : undefined}
    />
  );
}

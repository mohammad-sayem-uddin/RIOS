'use client';

/**
 * RIOS — Email Verification Screen
 *
 * @unverified backend contracts: POST /api/v1/auth/verify-email and
 * POST /api/v1/auth/resend-verification (see auth-service).
 *
 * Two modes:
 *   • token in URL  → verify automatically, show success / expired / error
 *   • no token      → "check your inbox" pending state with a resend action
 */

import { MailCheck, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';

import { AuthShell } from '@/components/auth/auth-shell';
import { FormError } from '@/components/auth/form-error';
import { Button } from '@/components/ui/button';
import { mapAuthError } from '@/lib/auth-errors';
import { authService } from '@/lib/auth-service';

type VerifyState = 'verifying' | 'verified' | 'error';

const RESEND_COOLDOWN_SECONDS = 30;

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <AuthShell title="Loading…" description="Loading email verification…">
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          </div>
        </AuthShell>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  return token ? <VerifyWithToken token={token} /> : <VerifyPending email={email} />;
}

/** Token present: verify automatically on mount. */
function VerifyWithToken({ token }: { token: string }) {
  const [state, setState] = useState<VerifyState>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Guard against double-invocation in React StrictMode dev.
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    void (async () => {
      try {
        await authService.verifyEmail({ token });
        setState('verified');
      } catch (error) {
        setErrorMessage(mapAuthError(error));
        setState('error');
      }
    })();
  }, [token]);

  if (state === 'verifying') {
    return (
      <AuthShell title="Verifying your email" description="This will only take a moment.">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          <p className="text-sm text-muted-foreground" role="status">
            Confirming your email address…
          </p>
        </div>
      </AuthShell>
    );
  }

  if (state === 'verified') {
    return (
      <AuthShell title="Email verified" description="Your email address has been confirmed.">
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <Link href="/login" className="w-full">
            <Button className="w-full">Continue to sign in</Button>
          </Link>
        </div>
      </AuthShell>
    );
  }

  // error / expired link
  return (
    <AuthShell
      title="Verification failed"
      description="This verification link is invalid or has expired."
      footer={
        <Link href="/verify-email" className="font-medium text-primary hover:underline">
          Request a new verification email
        </Link>
      }
    >
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <XCircle className="h-6 w-6" />
        </div>
        {errorMessage && <FormError message={errorMessage} />}
      </div>
    </AuthShell>
  );
}

/** No token: show the pending "check your inbox" state with resend. */
function VerifyPending({ email }: { email: string | null }) {
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [sentOnce, setSentOnce] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = useCallback(async () => {
    if (!email || cooldown > 0 || sending) return;
    setSending(true);
    setError(null);
    try {
      await authService.resendVerification({ email });
      setSentOnce(true);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setSending(false);
    }
  }, [email, cooldown, sending]);

  return (
    <AuthShell
      title="Verify your email"
      description={
        email ? (
          <>
            We sent a verification link to{' '}
            <span className="font-medium text-foreground">{email}</span>.
          </>
        ) : (
          'Check your inbox for a verification link to activate your account.'
        )
      }
      footer={
        <Link href="/login" className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="h-6 w-6" />
        </div>

        <p className="text-sm text-muted-foreground">
          Click the link in the email to finish setting up your account. If you don&apos;t see it,
          check your spam folder.
        </p>

        {sentOnce && cooldown > 0 && (
          <p className="text-xs text-success" role="status">
            Verification email sent.
          </p>
        )}

        {error && <FormError message={error} />}

        {email ? (
          <Button
            variant="outline"
            onClick={() => void handleResend()}
            disabled={sending || cooldown > 0}
            className="w-full"
          >
            {sending
              ? 'Sending…'
              : cooldown > 0
                ? `Resend available in ${cooldown}s`
                : 'Resend verification email'}
          </Button>
        ) : (
          <p className="text-xs text-muted-foreground">
            Return to{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              registration
            </Link>{' '}
            to request a new link.
          </p>
        )}
      </div>
    </AuthShell>
  );
}

'use client';

/**
 * RIOS — Reset Password Screen
 *
 * @unverified backend contract: POST /api/v1/auth/reset-password (see auth-service).
 * Reads the reset `token` from the URL, lets the user set a new password with a
 * strength meter, and handles missing/invalid/expired token states.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';

import { AuthShell } from '@/components/auth/auth-shell';
import { FormError } from '@/components/auth/form-error';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { PasswordInput } from '@/components/ui/password-input';
import { mapAuthError } from '@/lib/auth-errors';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/lib/auth-schemas';
import { authService } from '@/lib/auth-service';

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthShell title="Loading…" description="Preparing password reset…">
          <div className="py-8 text-center" />
        </AuthShell>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [succeeded, setSucceeded] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const passwordValue = watch('password') ?? '';

  const onSubmit = handleSubmit(async (values) => {
    if (!token) return;
    setFormError(null);
    try {
      await authService.resetPassword({ token, password: values.password });
      setSucceeded(true);
    } catch (error) {
      setFormError(mapAuthError(error));
    }
  });

  // Missing token — link is malformed or was opened directly.
  if (!token) {
    return (
      <AuthShell
        title="Invalid reset link"
        description="This password reset link is missing or malformed."
        footer={
          <Link href="/forgot-password" className="font-medium text-primary hover:underline">
            Request a new link
          </Link>
        }
      >
        <div className="py-2 text-center text-sm text-muted-foreground">
          Password reset links expire for your security. Please request a fresh one.
        </div>
      </AuthShell>
    );
  }

  if (succeeded) {
    return (
      <AuthShell
        title="Password updated"
        description="Your password has been changed successfully."
      >
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <Button onClick={() => router.replace('/login')} className="w-full">
            Continue to sign in
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create a new password"
      description="Choose a strong password you haven't used before"
      footer={
        <Link
          href="/login"
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      }
    >
      <form
        onSubmit={(e) => {
          void onSubmit(e);
        }}
        className="flex flex-col gap-4"
        noValidate
      >
        <FormField label="New password" error={errors.password?.message}>
          {(field) => (
            <PasswordInput
              {...field}
              {...register('password')}
              value={passwordValue}
              autoComplete="new-password"
              placeholder="Create a new password"
              showStrength
              autoFocus
            />
          )}
        </FormField>

        <FormField label="Confirm new password" error={errors.confirmPassword?.message}>
          {(field) => (
            <PasswordInput
              {...field}
              {...register('confirmPassword')}
              autoComplete="new-password"
              placeholder="Re-enter your new password"
            />
          )}
        </FormField>

        {formError && <FormError message={formError} />}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Updating password…' : 'Update password'}
        </Button>
      </form>
    </AuthShell>
  );
}

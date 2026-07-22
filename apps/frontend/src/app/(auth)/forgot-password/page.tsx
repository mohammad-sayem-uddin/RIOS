'use client';

/**
 * RIOS — Forgot Password Screen
 *
 * @unverified backend contract: POST /api/v1/auth/forgot-password (see auth-service).
 * Requests a reset link. To avoid account enumeration, the success state is
 * shown regardless of whether the email is registered.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { MailCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { AuthShell } from '@/components/auth/auth-shell';
import { FormError } from '@/components/auth/form-error';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { mapAuthError } from '@/lib/auth-errors';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/auth-schemas';
import { authService } from '@/lib/auth-service';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sentTo, setSentTo] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await authService.forgotPassword(values);
      setSentTo(values.email);
      setSubmitted(true);
    } catch (error) {
      setFormError(mapAuthError(error));
    }
  });

  if (submitted) {
    return (
      <AuthShell
        title="Check your email"
        description={
          <>
            If an account exists for <span className="font-medium text-foreground">{sentTo}</span>,
            we&apos;ve sent a link to reset your password.
          </>
        }
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
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
            <MailCheck className="h-6 w-6" />
          </div>
          <p className="text-sm text-muted-foreground">
            The link expires shortly for your security. Didn&apos;t get it? Check your spam folder
            or{' '}
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="font-medium text-primary hover:underline"
            >
              try another email
            </button>
            .
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset your password"
      description="Enter your email and we'll send you a reset link"
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
        <FormField label="Email" error={errors.email?.message}>
          {(field) => (
            <Input
              {...field}
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="you@university.edu"
              autoFocus
            />
          )}
        </FormField>

        {formError && <FormError message={formError} />}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Sending link…' : 'Send reset link'}
        </Button>
      </form>
    </AuthShell>
  );
}

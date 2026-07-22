'use client';

/**
 * RIOS — Login
 *
 * Wired to the verified backend contract: POST /api/v1/auth/login.
 * Minimal, fast, accessible. Handles loading, validation, and normalized API
 * errors without exposing backend internals.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { AuthShell } from '@/components/auth/auth-shell';
import { FormError } from '@/components/auth/form-error';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { ApiError } from '@/lib/api-client';
import { loginSchema, type LoginFormValues } from '@/lib/auth-schemas';
import { useAuth } from '@/providers/auth-provider';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      await login({ email: values.email, password: values.password });
      const returnTo = searchParams.get('returnTo');
      router.replace(returnTo ? decodeURIComponent(returnTo) : '/');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setFormError('The email or password you entered is incorrect.');
      } else if (error instanceof ApiError && error.status === 0) {
        setFormError('Unable to reach the server. Check your connection and try again.');
      } else {
        setFormError('Something went wrong while signing in. Please try again.');
      }
    }
  };

  return (
    <AuthShell
      title="Sign in to RIOS"
      description="Welcome back. Enter your credentials to continue."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
        className="flex flex-col gap-4"
        noValidate
      >
        {formError && <FormError>{formError}</FormError>}

        <FormField label="Email" error={errors.email?.message}>
          {(field) => (
            <Input
              {...field}
              {...register('email')}
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@university.edu"
            />
          )}
        </FormField>

        <FormField
          label="Password"
          error={errors.password?.message}
          labelAccessory={
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Forgot password?
            </Link>
          }
        >
          {(field) => (
            <PasswordInput
              {...field}
              {...register('password')}
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          )}
        </FormField>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            {...register('rememberMe')}
            className="h-4 w-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          Keep me signed in
        </label>

        <Button type="submit" size="lg" disabled={isSubmitting} className="mt-1">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthShell>
  );
}

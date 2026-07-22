'use client';

/**
 * RIOS — Registration Screen
 *
 * @unverified backend contract: POST /api/v1/auth/register (see auth-service).
 * Collects only required fields (name, email, password, terms). Additional
 * researcher details are gathered later during onboarding. On success, either
 * auto-logs-in (if tokens returned) or routes to email verification.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { AuthShell } from '@/components/auth/auth-shell';
import { FormError } from '@/components/auth/form-error';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { mapAuthError } from '@/lib/auth-errors';
import { registerSchema, type RegisterFormValues } from '@/lib/auth-schemas';
import { useAuth } from '@/providers/auth-provider';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false as unknown as true,
    },
  });

  const passwordValue = watch('password') ?? '';

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const result = await registerUser({
        displayName: values.displayName,
        email: values.email,
        password: values.password,
        acceptedTerms: values.acceptTerms,
      });

      // Auto-login path (backend returned tokens) → dashboard.
      if (result.tokens && result.user) {
        router.replace('/onboarding');
        return;
      }
      // Otherwise route to verification, carrying the email for resend.
      router.replace(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      setFormError(mapAuthError(error));
    }
  });

  return (
    <AuthShell
      title="Create your RIOS account"
      description="Start building your research identity"
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          void onSubmit(e);
        }}
        className="flex flex-col gap-4"
        noValidate
      >
        <FormField label="Full name" error={errors.displayName?.message}>
          {(field) => (
            <Input
              {...field}
              {...register('displayName')}
              autoComplete="name"
              placeholder="Ada Lovelace"
              autoFocus
            />
          )}
        </FormField>

        <FormField label="Email" error={errors.email?.message}>
          {(field) => (
            <Input
              {...field}
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="you@university.edu"
            />
          )}
        </FormField>

        <FormField label="Password" error={errors.password?.message}>
          {(field) => (
            <PasswordInput
              {...field}
              {...register('password')}
              value={passwordValue}
              autoComplete="new-password"
              placeholder="Create a password"
              showStrength
            />
          )}
        </FormField>

        <FormField label="Confirm password" error={errors.confirmPassword?.message}>
          {(field) => (
            <PasswordInput
              {...field}
              {...register('confirmPassword')}
              autoComplete="new-password"
              placeholder="Re-enter your password"
            />
          )}
        </FormField>

        <div className="flex items-start gap-2">
          <input
            id="acceptTerms"
            type="checkbox"
            {...register('acceptTerms')}
            className="mt-0.5 h-4 w-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-invalid={Boolean(errors.acceptTerms)}
          />
          <Label htmlFor="acceptTerms" className="text-sm font-normal text-muted-foreground">
            I agree to the{' '}
            <Link href="/terms" className="font-medium text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-medium text-primary hover:underline">
              Privacy Policy
            </Link>
          </Label>
        </div>
        {errors.acceptTerms?.message && (
          <p role="alert" className="-mt-2 text-xs font-medium text-destructive">
            {errors.acceptTerms.message}
          </p>
        )}

        {formError && <FormError message={formError} />}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </AuthShell>
  );
}

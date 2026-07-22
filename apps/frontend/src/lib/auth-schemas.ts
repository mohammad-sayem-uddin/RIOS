/**
 * RIOS — Authentication Validation Schemas
 *
 * Zod schemas for every auth form. These mirror the backend's minimal
 * requirements (email + non-empty password for login) and add client-side UX
 * validation for the assumed registration/reset flows. Client validation NEVER
 * replaces backend validation — the backend remains the source of truth; these
 * only improve the user experience before a request is sent.
 */

import { z } from 'zod';

/** Shared password policy used by registration and password reset. */
export const PASSWORD_MIN_LENGTH = 8;

const passwordField = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  .regex(/[a-z]/, 'Include at least one lowercase letter')
  .regex(/[A-Z]/, 'Include at least one uppercase letter')
  .regex(/[0-9]/, 'Include at least one number');

const emailField = z.string().min(1, 'Email is required').email('Enter a valid email address');

/** Login — matches the verified backend contract (email + password required). */
export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/** Registration — collects only required fields; extras belong in onboarding. */
export const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(1, 'Full name is required')
      .min(2, 'Name is too short')
      .max(120, 'Name is too long'),
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms to continue' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

/** Forgot password — request a reset link. */
export const forgotPasswordSchema = z.object({
  email: emailField,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

/** Reset password — set a new password using a token from the email link. */
export const resetPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

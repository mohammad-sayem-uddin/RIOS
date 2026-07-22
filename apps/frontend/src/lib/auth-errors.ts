/**
 * RIOS — Auth Error Mapping
 *
 * Translates backend/network errors into friendly, user-facing messages.
 * NEVER exposes raw backend detail. Falls back to a safe generic message for
 * anything unrecognized. Keyed off the normalized `ApiError.code` emitted by
 * the api-client, plus network/offline detection.
 */

import { ApiError } from '@/lib/api-client';

/** Friendly copy for known backend error codes. */
const CODE_MESSAGES: Record<string, string> = {
  AUTH_INVALID_CREDENTIALS: 'The email or password you entered is incorrect.',
  AUTH_INVALID_REFRESH_TOKEN: 'Your session has expired. Please sign in again.',
  VALIDATION_FAILED: 'Please check the information you entered and try again.',
  AUTH_ACCOUNT_LOCKED: 'This account is temporarily locked. Please try again later.',
  AUTH_EMAIL_NOT_VERIFIED: 'Please verify your email address before signing in.',
  AUTH_EMAIL_IN_USE: 'An account with this email already exists.',
  RATE_LIMITED: 'Too many attempts. Please wait a moment and try again.',
  NOT_FOUND: 'We could not find what you were looking for.',
};

/** Map any thrown error into a safe, friendly message for display. */
export function mapAuthError(error: unknown): string {
  if (error instanceof ApiError) {
    // 429 rate limiting may arrive with varying codes.
    if (error.status === 429) return CODE_MESSAGES.RATE_LIMITED;
    return CODE_MESSAGES[error.code] ?? 'Something went wrong. Please try again.';
  }

  // Network / offline — fetch throws a TypeError when the request cannot be made.
  if (error instanceof TypeError) {
    return 'We could not reach the server. Check your connection and try again.';
  }

  return 'Something went wrong. Please try again.';
}

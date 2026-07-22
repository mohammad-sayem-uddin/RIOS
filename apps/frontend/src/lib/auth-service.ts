/**
 * RIOS — Authentication Service
 *
 * The single boundary between the frontend and the backend IAM endpoints.
 * All auth network calls flow through here so contract corrections happen in
 * exactly one file.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * CONTRACT STATUS
 *
 * ✅ VERIFIED — these endpoints exist in the presentation layer and are wired to
 *    their exact request/response shapes
 *      POST /api/v1/auth/login      { email, password }            → { user, session, tokens }
 *      POST /api/v1/auth/refresh    { refreshToken }               → { tokens }
 *      POST /api/v1/auth/logout     { sessionId? }                 → success
 *      GET  /api/v1/auth/me                                        → { user, authenticated }
 *
 * ⚠️  UNVERIFIED — the backend does NOT currently expose these endpoints. The
 *    frontend UX for registration, credential recovery, and email verification
 *    is built against the assumed contracts below. Each is marked `@unverified`.
 *    When the backend adds them (or uses different paths/shapes), correct the
 *    constants and mappers HERE — no screen or component needs to change.
 *
 *    Missing application-layer commands DO exist (create-user, change-password)
 *    but are not routed through the presentation layer, so they are not callable
 *    over HTTP yet. See the Part 2 report "Missing Backend Contracts".
 * ────────────────────────────────────────────────────────────────────────────
 */

import { apiClient, setTokens, clearTokens } from '@/lib/api-client';
import type {
  LoginRequest,
  LoginResponse,
  CurrentUserResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
} from '@/types/auth';

/** Endpoint paths, centralized so an unverified path is corrected in one place. */
export const AUTH_ENDPOINTS = {
  /** ✅ verified */
  login: '/api/v1/auth/login',
  /** ✅ verified */
  refresh: '/api/v1/auth/refresh',
  /** ✅ verified */
  logout: '/api/v1/auth/logout',
  /** ✅ verified */
  me: '/api/v1/auth/me',
  /** @unverified — assumed contract, backend endpoint not yet present */
  register: '/api/v1/auth/register',
  /** @unverified */
  forgotPassword: '/api/v1/auth/forgot-password',
  /** @unverified */
  resetPassword: '/api/v1/auth/reset-password',
  /** @unverified */
  verifyEmail: '/api/v1/auth/verify-email',
  /** @unverified */
  resendVerification: '/api/v1/auth/resend-verification',
} as const;

export const authService = {
  /** ✅ Authenticate with email/password. Persists tokens on success. */
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const data = await apiClient.post<LoginResponse>(AUTH_ENDPOINTS.login, payload, {
      skipAuth: true,
    });
    setTokens(data.tokens.accessToken, data.tokens.refreshToken);
    return data;
  },

  /** ✅ Fetch the currently authenticated user. */
  async getCurrentUser(): Promise<CurrentUserResponse> {
    return apiClient.get<CurrentUserResponse>(AUTH_ENDPOINTS.me);
  },

  /** ✅ Revoke the active session and clear local tokens. */
  async logout(sessionId?: string): Promise<void> {
    try {
      await apiClient.post(AUTH_ENDPOINTS.logout, sessionId ? { sessionId } : {});
    } finally {
      clearTokens();
    }
  },

  /**
   * @unverified Create a new account.
   *
   * Optimistic implementation per product decision. If the backend returns
   * tokens (auto-login), they are persisted; otherwise the caller routes the
   * user to email verification.
   */
  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    const data = await apiClient.post<RegisterResponse>(AUTH_ENDPOINTS.register, payload, {
      skipAuth: true,
    });
    if (data.tokens) {
      setTokens(data.tokens.accessToken, data.tokens.refreshToken);
    }
    return data;
  },

  /** @unverified Request a password-reset email. Always resolves (no account enumeration). */
  async forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.forgotPassword, payload, { skipAuth: true });
  },

  /** @unverified Complete a password reset using a token from the email link. */
  async resetPassword(payload: ResetPasswordRequest): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.resetPassword, payload, { skipAuth: true });
  },

  /** @unverified Verify an email address using a token from the email link. */
  async verifyEmail(payload: VerifyEmailRequest): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.verifyEmail, payload, { skipAuth: true });
  },

  /** @unverified Resend the verification email. */
  async resendVerification(payload: ResendVerificationRequest): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.resendVerification, payload, { skipAuth: true });
  },
};

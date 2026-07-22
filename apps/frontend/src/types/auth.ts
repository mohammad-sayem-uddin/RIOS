/**
 * RIOS — Authentication Types
 *
 * Mirrors backend DTOs from @rios/presentation/dto/auth-dtos.ts
 */

export interface User {
  id: string;
  email: string;
  displayName: string;
  status: string;
  roles: string[];
  permissions: string[];
  createdAt: string;
  lastLoginAt: string | null;
}

export interface Session {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  lastActivityAt: string;
  revoked: boolean;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  session: Session;
  tokens: Tokens;
}

export interface RefreshTokenResponse {
  tokens: Tokens;
}

export interface CurrentUserResponse {
  user: User;
  authenticated: boolean;
}

/* ──────────────────────────────────────────────────────────────────────────
 * UNVERIFIED contracts — see lib/auth-service.ts. The backend does not yet
 * expose registration, password-reset, or email-verification endpoints. These
 * shapes are the frontend's assumed contract and are the single place to adjust
 * when the backend lands.
 * ────────────────────────────────────────────────────────────────────────── */

/** @unverified */
export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
  /** Optional profile hints collected at sign-up; safe to omit. */
  institution?: string;
  acceptedTerms: boolean;
}

/**
 * @unverified Registration may either auto-login (returning tokens/user) or
 * require email verification first (returning neither). Both are supported.
 */
export interface RegisterResponse {
  user?: User;
  session?: Session;
  tokens?: Tokens;
  /** True when the backend requires email verification before login. */
  requiresEmailVerification?: boolean;
}

/** @unverified */
export interface ForgotPasswordRequest {
  email: string;
}

/** @unverified */
export interface ResetPasswordRequest {
  token: string;
  password: string;
}

/** @unverified */
export interface VerifyEmailRequest {
  token: string;
}

/** @unverified */
export interface ResendVerificationRequest {
  email: string;
}

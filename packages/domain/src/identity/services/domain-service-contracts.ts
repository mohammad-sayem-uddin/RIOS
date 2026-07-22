/**
 * Identity Domain Service Contracts
 *
 * Interface abstractions for cryptographic, authentication, and authorization services.
 * Architecture Reference: Volume I – Identity / Chapter 4 §37
 */

import { Result } from '@rios/shared';

import { User } from '../aggregates/user.js';
import { Session } from '../entities/session.js';
import {
  AccessToken,
  PasswordHash,
  RefreshToken,
} from '../value-objects/identity-value-objects.js';

export interface PasswordHashResult {
  hash: PasswordHash;
}

export interface IPasswordHasher {
  hash(plainTextPassword: string): Promise<Result<PasswordHash>>;
  verify(plainTextPassword: string, hash: PasswordHash): Promise<Result<boolean>>;
}

export interface TokenClaims {
  userId: string;
  sessionId: string;
  email: string;
  roles: string[];
  permissions: string[];
  issuedAt: Date;
  expiresAt: Date;
}

export interface IssuedTokens {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}

export interface ITokenProvider {
  generateTokens(user: User, session: Session): Promise<Result<IssuedTokens>>;
  validateAccessToken(token: AccessToken): Promise<Result<TokenClaims>>;
  verifyRefreshToken(token: RefreshToken): Promise<Result<boolean>>;
}

export interface IAuthorizationService {
  hasPermission(user: User, permissionName: string): boolean;
  hasRole(user: User, roleName: string): boolean;
  getEffectivePermissions(user: User): string[];
}

export interface AuthenticationResult {
  user: User;
  session: Session;
  tokens: IssuedTokens;
}

export interface IAuthenticationService {
  authenticate(emailStr: string, passwordStr: string): Promise<Result<AuthenticationResult>>;
  refreshTokens(refreshTokenStr: string): Promise<Result<IssuedTokens>>;
  logout(sessionIdStr: string): Promise<Result<void>>;
}

/** A freshly minted opaque token: the raw value (emailed) and its stored hash. */
export interface GeneratedToken {
  /** Raw token — placed in the email link, never persisted. */
  rawToken: string;
  /** SHA-256 hash of the raw token — the only value persisted. */
  tokenHash: string;
}

/**
 * Generates cryptographically-random single-use tokens and hashes raw tokens
 * for constant-time lookup. Used by email-verification and password-reset flows.
 */
export interface IVerificationTokenGenerator {
  generate(): GeneratedToken;
  hash(rawToken: string): string;
}

export type AccountEmailKind = 'EMAIL_VERIFICATION' | 'PASSWORD_RESET';

/**
 * Sends transactional account emails. In development the implementation may log
 * the link instead of dispatching a real message.
 */
export interface IAccountEmailNotifier {
  sendEmailVerification(toEmail: string, rawToken: string): Promise<Result<void>>;
  sendPasswordReset(toEmail: string, rawToken: string): Promise<Result<void>>;
}

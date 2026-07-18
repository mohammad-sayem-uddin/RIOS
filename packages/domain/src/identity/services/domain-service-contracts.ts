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

/**
 * JWT Token Provider
 *
 * Implements ITokenProvider interface using HMAC SHA-256 JWT signature algorithm.
 * Hardened: Fails startup in production if JWT_SECRET is missing or weak.
 */

import { createHmac, randomBytes } from 'node:crypto';

import {
  AccessToken,
  IssuedTokens,
  ITokenProvider,
  RefreshToken,
  Session,
  TokenClaims,
  User,
} from '@rios/domain';
import { Result } from '@rios/shared';

export interface JwtProviderConfig {
  secret: string;
  issuer: string;
  audience: string;
  accessTokenExpirationMinutes: number;
  refreshTokenExpirationDays: number;
}

interface RawJwtPayload {
  sub: string;
  sid: string;
  email: string;
  roles?: string[];
  permissions?: string[];
  iat: number;
  exp: number;
}

export class JwtTokenProvider implements ITokenProvider {
  private readonly config: JwtProviderConfig;

  constructor(config?: Partial<JwtProviderConfig>) {
    const isProd = process.env.NODE_ENV === 'production';
    const rawSecret = config?.secret ?? process.env.JWT_SECRET;

    if (isProd && (typeof rawSecret !== 'string' || rawSecret.trim().length === 0)) {
      throw new Error(
        'SECURITY FATAL: JWT_SECRET environment variable is missing in production environment.',
      );
    }

    const secret =
      typeof rawSecret === 'string' && rawSecret.trim().length > 0
        ? rawSecret.trim()
        : 'rios_hardened_development_and_test_secret_key_32bytes';

    if (secret.length < 16) {
      throw new Error('SECURITY FATAL: JWT_SECRET must be at least 16 characters long.');
    }

    const issuer =
      config?.issuer !== undefined && config.issuer.trim() !== ''
        ? config.issuer
        : (process.env.JWT_ISSUER ?? 'rios-auth-service');
    const audience =
      config?.audience !== undefined && config.audience.trim() !== ''
        ? config.audience
        : (process.env.JWT_AUDIENCE ?? 'rios-api');
    const accessTokenExpirationMinutes =
      config?.accessTokenExpirationMinutes !== undefined && config.accessTokenExpirationMinutes > 0
        ? config.accessTokenExpirationMinutes
        : 15;
    const refreshTokenExpirationDays =
      config?.refreshTokenExpirationDays !== undefined && config.refreshTokenExpirationDays > 0
        ? config.refreshTokenExpirationDays
        : 7;

    this.config = {
      secret,
      issuer,
      audience,
      accessTokenExpirationMinutes,
      refreshTokenExpirationDays,
    };
  }

  public generateTokens(user: User, session: Session): Promise<Result<IssuedTokens>> {
    try {
      const now = Math.floor(Date.now() / 1000);
      const accessExp = now + this.config.accessTokenExpirationMinutes * 60;
      const refreshExp = now + this.config.refreshTokenExpirationDays * 24 * 60 * 60;

      const roles = user.roles.map((r) => r.name);
      const permissions = user.roles.flatMap((r) => r.permissions.map((p) => p.name));

      const accessPayload: RawJwtPayload = {
        sub: user.userId.value,
        sid: session.sessionId.value,
        email: user.email.value,
        roles,
        permissions,
        iat: now,
        exp: accessExp,
      };

      const accessTokenString = this.signToken(accessPayload);
      const accessTokenRes = AccessToken.create(accessTokenString);
      if (accessTokenRes.isFailure) {
        return Promise.resolve(
          Result.fail(`Failed to create access token: ${accessTokenRes.error}`),
        );
      }

      const randomHash = randomBytes(32).toString('hex');
      const refreshTokenRes = RefreshToken.create(randomHash);
      if (refreshTokenRes.isFailure) {
        return Promise.resolve(
          Result.fail(`Failed to create refresh token: ${refreshTokenRes.error}`),
        );
      }

      return Promise.resolve(
        Result.ok({
          accessToken: accessTokenRes.value,
          refreshToken: refreshTokenRes.value,
          accessTokenExpiresAt: new Date(accessExp * 1000),
          refreshTokenExpiresAt: new Date(refreshExp * 1000),
        }),
      );
    } catch (err) {
      return Promise.resolve(
        Result.fail(`Token generation error: ${err instanceof Error ? err.message : String(err)}`),
      );
    }
  }

  public validateAccessToken(token: AccessToken): Promise<Result<TokenClaims>> {
    try {
      const parts = token.value.split('.');
      if (parts.length !== 3) {
        return Promise.resolve(Result.fail('Malformed JWT token structure'));
      }

      const [headerB64, payloadB64, signatureB64] = parts;
      if (
        typeof headerB64 !== 'string' ||
        typeof payloadB64 !== 'string' ||
        typeof signatureB64 !== 'string'
      ) {
        return Promise.resolve(Result.fail('Malformed JWT token parts'));
      }

      const expectedSignature = this.calculateSignature(`${headerB64}.${payloadB64}`);
      if (signatureB64 !== expectedSignature) {
        return Promise.resolve(Result.fail('Invalid JWT signature'));
      }

      const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf8');
      const payload = JSON.parse(payloadJson) as RawJwtPayload;

      const now = Math.floor(Date.now() / 1000);
      if (typeof payload.exp === 'number' && payload.exp < now) {
        return Promise.resolve(Result.fail('JWT token has expired'));
      }

      return Promise.resolve(
        Result.ok({
          userId: payload.sub,
          sessionId: payload.sid,
          email: payload.email,
          roles: payload.roles ?? [],
          permissions: payload.permissions ?? [],
          issuedAt: new Date(payload.iat * 1000),
          expiresAt: new Date(payload.exp * 1000),
        }),
      );
    } catch (err) {
      return Promise.resolve(
        Result.fail(`JWT validation failed: ${err instanceof Error ? err.message : String(err)}`),
      );
    }
  }

  public verifyRefreshToken(refreshToken: RefreshToken): Promise<Result<boolean>> {
    if (
      refreshToken === null ||
      refreshToken === undefined ||
      typeof refreshToken.value !== 'string' ||
      refreshToken.value.length === 0
    ) {
      return Promise.resolve(Result.fail('Invalid refresh token'));
    }
    return Promise.resolve(Result.ok(true));
  }

  private signToken(payload: RawJwtPayload): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signatureB64 = this.calculateSignature(`${headerB64}.${payloadB64}`);
    return `${headerB64}.${payloadB64}.${signatureB64}`;
  }

  private calculateSignature(data: string): string {
    return createHmac('sha256', this.config.secret).update(data).digest('base64url');
  }
}

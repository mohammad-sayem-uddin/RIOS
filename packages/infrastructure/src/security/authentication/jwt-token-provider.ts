/**
 * JWT Token Provider
 *
 * Implements ITokenProvider interface using HMAC SHA-256 JWT signature algorithm.
 * Architecture Reference: Volume I – Identity / Chapter 6 §60
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
    const secret =
      config?.secret !== undefined && config.secret.trim() !== ''
        ? config.secret
        : (process.env.JWT_SECRET ?? 'rios_default_jwt_secret_key_change_in_production_32bytes');
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
        : 30;

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
      const now = new Date();
      const accessTokenExpiresAt = new Date(
        now.getTime() + this.config.accessTokenExpirationMinutes * 60 * 1000,
      );
      const refreshTokenExpiresAt = new Date(
        now.getTime() + this.config.refreshTokenExpirationDays * 24 * 60 * 60 * 1000,
      );

      const header = { alg: 'HS256', typ: 'JWT' };
      const payload: TokenClaims = {
        userId: user.userId.value,
        sessionId: session.sessionId.value,
        email: user.email.value,
        roles: user.roles.map((r) => r.name),
        permissions: user.getEffectivePermissions(),
        issuedAt: now,
        expiresAt: accessTokenExpiresAt,
      };

      const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
      const encodedPayload = this.base64UrlEncode(
        JSON.stringify({
          sub: payload.userId,
          sid: payload.sessionId,
          email: payload.email,
          roles: payload.roles,
          permissions: payload.permissions,
          iss: this.config.issuer,
          aud: this.config.audience,
          iat: Math.floor(now.getTime() / 1000),
          exp: Math.floor(accessTokenExpiresAt.getTime() / 1000),
        }),
      );

      const signature = this.sign(`${encodedHeader}.${encodedPayload}`);
      const jwtString = `${encodedHeader}.${encodedPayload}.${signature}`;

      const rawRefreshToken = randomBytes(32).toString('hex');

      const accessTokenRes = AccessToken.create(jwtString);
      const refreshTokenRes = RefreshToken.create(rawRefreshToken);

      if (accessTokenRes.isFailure) return Promise.resolve(Result.fail(accessTokenRes.error));
      if (refreshTokenRes.isFailure) return Promise.resolve(Result.fail(refreshTokenRes.error));

      return Promise.resolve(
        Result.ok({
          accessToken: accessTokenRes.value,
          refreshToken: refreshTokenRes.value,
          accessTokenExpiresAt,
          refreshTokenExpiresAt,
        }),
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return Promise.resolve(Result.fail(`JWT generation failed: ${message}`));
    }
  }

  public validateAccessToken(token: AccessToken): Promise<Result<TokenClaims>> {
    try {
      if (token.value.trim() === '') {
        return Promise.resolve(Result.fail('Token is required'));
      }

      const parts = token.value.split('.');
      if (parts.length !== 3) {
        return Promise.resolve(Result.fail('Malformed JWT token structure'));
      }

      const [encodedHeader, encodedPayload, signature] = parts;
      if (
        encodedHeader === undefined ||
        encodedHeader.trim() === '' ||
        encodedPayload === undefined ||
        encodedPayload.trim() === '' ||
        signature === undefined ||
        signature.trim() === ''
      ) {
        return Promise.resolve(Result.fail('Malformed JWT token parts'));
      }

      const expectedSignature = this.sign(`${encodedHeader}.${encodedPayload}`);

      if (signature !== expectedSignature) {
        return Promise.resolve(Result.fail('Invalid JWT token signature'));
      }

      const payloadJson = this.base64UrlDecode(encodedPayload);
      const rawPayload = JSON.parse(payloadJson) as RawJwtPayload;

      const nowSeconds = Math.floor(Date.now() / 1000);
      if (rawPayload.exp < nowSeconds) {
        return Promise.resolve(Result.fail('JWT access token has expired'));
      }

      const claims: TokenClaims = {
        userId: rawPayload.sub,
        sessionId: rawPayload.sid,
        email: rawPayload.email,
        roles: rawPayload.roles ?? [],
        permissions: rawPayload.permissions ?? [],
        issuedAt: new Date(rawPayload.iat * 1000),
        expiresAt: new Date(rawPayload.exp * 1000),
      };

      return Promise.resolve(Result.ok(claims));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return Promise.resolve(Result.fail(`Invalid access token: ${message}`));
    }
  }

  public verifyRefreshToken(token: RefreshToken): Promise<Result<boolean>> {
    if (token.value.trim().length === 0) {
      return Promise.resolve(Result.ok(false));
    }
    return Promise.resolve(Result.ok(token.value.length === 64));
  }

  private sign(input: string): string {
    const hmac = createHmac('sha256', this.config.secret);
    hmac.update(input);
    return hmac.digest('base64url');
  }

  private base64UrlEncode(str: string): string {
    return Buffer.from(str, 'utf-8').toString('base64url');
  }

  private base64UrlDecode(str: string): string {
    return Buffer.from(str, 'base64url').toString('utf-8');
  }
}

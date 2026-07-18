/**
 * Identity Application Services
 *
 * Coordinates domain repositories, domain services, token providers, and security rules.
 * Architecture Reference: Volume I – Identity / Chapter 5 §48
 */

import {
  AccessToken,
  Email,
  IAuthorizationService,
  IPasswordHasher,
  ISessionRepository,
  ITokenProvider,
  IUserRepository,
  RefreshToken,
  Session,
  SessionId,
  User,
  UserId,
} from '@rios/domain';
import { Result } from '@rios/shared';

import {
  AuthenticationResponseDto,
  RefreshTokenResponseDto,
  SessionDto,
} from '../dto/identity-application-dtos.js';
import { IdentityDtoMapper } from '../mappers/identity-dto-mapper.js';

export class AuthenticationApplicationService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: ISessionRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenProvider: ITokenProvider,
  ) {}

  public async authenticate(
    emailStr: string,
    passwordStr: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Result<AuthenticationResponseDto>> {
    const emailRes = Email.create(emailStr);
    if (emailRes.isFailure) {
      return Result.fail('Invalid email or password');
    }

    const userRes = await this.userRepository.findByEmail(emailRes.value);
    if (userRes.isFailure || !userRes.value) {
      return Result.fail('Invalid email or password');
    }

    const user = userRes.value;
    if (!user.canAuthenticate()) {
      return Result.fail('Account is disabled or locked');
    }

    const verifyRes = await this.passwordHasher.verify(passwordStr, user.credential.passwordHash);
    if (verifyRes.isFailure || !verifyRes.value) {
      return Result.fail('Invalid email or password');
    }

    // 15-minute access token, 30-day session
    const sessionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const sessionRes = Session.create({
      userId: user.userId,
      expiresAt: sessionExpiresAt,
      ipAddress,
      userAgent,
    });

    if (sessionRes.isFailure) {
      return Result.fail(`Failed to create session: ${sessionRes.error}`);
    }

    const session = sessionRes.value;
    const saveSessionRes = await this.sessionRepository.save(session);
    if (saveSessionRes.isFailure) {
      return Result.fail(`Failed to save session: ${saveSessionRes.error}`);
    }

    user.recordLogin();
    await this.userRepository.save(user);

    const tokensRes = await this.tokenProvider.generateTokens(user, session);
    if (tokensRes.isFailure) {
      return Result.fail(`Failed to generate authentication tokens: ${tokensRes.error}`);
    }

    return Result.ok(IdentityDtoMapper.toAuthenticationResponseDto(user, session, tokensRes.value));
  }

  public async refreshTokens(refreshTokenStr: string): Promise<Result<RefreshTokenResponseDto>> {
    if (refreshTokenStr.trim() === '') {
      return Result.fail('Refresh token is required');
    }

    const refreshTokenRes = RefreshToken.create(refreshTokenStr);
    if (refreshTokenRes.isFailure) {
      return Result.fail(`Invalid refresh token format: ${refreshTokenRes.error}`);
    }

    const verifyTokenRes = await this.tokenProvider.verifyRefreshToken(refreshTokenRes.value);
    if (verifyTokenRes.isFailure || !verifyTokenRes.value) {
      return Result.fail('Invalid or expired refresh token');
    }

    const accessTokenRes = AccessToken.create(refreshTokenStr);
    if (accessTokenRes.isFailure) {
      return Result.fail('Invalid token signature');
    }

    const validateRes = await this.tokenProvider.validateAccessToken(accessTokenRes.value);
    if (validateRes.isFailure) {
      return Result.fail('Invalid refresh token signature');
    }

    const claims = validateRes.value;
    const sessionRes = await this.sessionRepository.findById(SessionId.from(claims.sessionId));
    if (sessionRes.isFailure || sessionRes.value === null) {
      return Result.fail('Session not found or revoked');
    }

    const session = sessionRes.value;
    if (!session.isActive()) {
      return Result.fail('Session has expired or been revoked');
    }

    const userRes = await this.userRepository.findById(UserId.from(claims.userId));
    if (userRes.isFailure || userRes.value === null || !userRes.value.canAuthenticate()) {
      return Result.fail('User account unavailable');
    }

    const user = userRes.value;
    session.touch();
    await this.sessionRepository.save(session);

    const tokensRes = await this.tokenProvider.generateTokens(user, session);
    if (tokensRes.isFailure) {
      return Result.fail('Failed to rotate refresh tokens');
    }

    return Result.ok({ tokens: IdentityDtoMapper.toTokenResultDto(tokensRes.value) });
  }

  public async logout(sessionIdStr: string): Promise<Result<void>> {
    if (sessionIdStr.trim() === '') {
      return Result.fail('SessionId is required');
    }

    const sessionRes = await this.sessionRepository.findById(SessionId.from(sessionIdStr));
    if (sessionRes.isFailure || sessionRes.value === null) {
      return Result.ok(undefined); // Idempotent logout
    }

    const session = sessionRes.value;
    session.revoke();
    await this.sessionRepository.save(session);
    return Result.ok(undefined);
  }
}

export class AuthorizationApplicationService implements IAuthorizationService {
  public hasPermission(user: User, permissionName: string): boolean {
    return user.hasPermission(permissionName);
  }

  public hasRole(user: User, roleName: string): boolean {
    return user.hasRole(roleName);
  }

  public getEffectivePermissions(user: User): string[] {
    return user.getEffectivePermissions();
  }
}

export class SessionApplicationService {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  public async getActiveSessions(userIdStr: string): Promise<Result<SessionDto[]>> {
    const sessionsRes = await this.sessionRepository.findByUserId(UserId.from(userIdStr));
    if (sessionsRes.isFailure) {
      return Result.fail(sessionsRes.error);
    }

    const activeSessions = sessionsRes.value.filter((s: Session) => s.isActive());
    return Result.ok(activeSessions.map((s: Session) => IdentityDtoMapper.toSessionDto(s)));
  }

  public async revokeSession(sessionIdStr: string): Promise<Result<void>> {
    return this.sessionRepository.revoke(SessionId.from(sessionIdStr));
  }
}

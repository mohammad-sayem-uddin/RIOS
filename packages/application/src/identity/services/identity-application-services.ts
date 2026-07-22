/**
 * Identity Application Services
 *
 * Coordinates domain repositories, domain services, token providers, and security rules.
 * Architecture Reference: Volume I – Identity / Chapter 5 §48
 */

import {
  AccessToken,
  Credential,
  Email,
  IAccountEmailNotifier,
  IAuthorizationService,
  IEmailVerificationTokenRepository,
  IPasswordHasher,
  IPasswordResetTokenRepository,
  ISessionRepository,
  ITokenProvider,
  IUserRepository,
  IVerificationTokenGenerator,
  IRoleRepository,
  RefreshToken,
  Role,
  Session,
  SessionId,
  User,
  UserId,
  VerificationToken,
} from '@rios/domain';
import { Result } from '@rios/shared';

import {
  AuthenticationResponseDto,
  RefreshTokenResponseDto,
  RegisterResponseDto,
  SessionDto,
} from '../dto/identity-application-dtos.js';
import { IdentityDtoMapper } from '../mappers/identity-dto-mapper.js';

export class AuthenticationApplicationService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: ISessionRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenProvider: ITokenProvider,
    private readonly roleRepository?: IRoleRepository,
    private readonly emailVerificationTokenRepository?: IEmailVerificationTokenRepository,
    private readonly passwordResetTokenRepository?: IPasswordResetTokenRepository,
    private readonly verificationTokenGenerator?: IVerificationTokenGenerator,
    private readonly emailNotifier?: IAccountEmailNotifier,
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

    if (!user.emailVerified) {
      return Result.fail('AUTH_EMAIL_NOT_VERIFIED');
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

  /**
   * Register a new user account. Creates the user with PENDING status and
   * sends an email-verification link. Returns requiresEmailVerification: true
   * so the frontend routes to the verify-email screen.
   */
  public async register(
    emailStr: string,
    passwordStr: string,
    displayName?: string,
  ): Promise<Result<RegisterResponseDto>> {
    const emailRes = Email.create(emailStr);
    if (emailRes.isFailure) {
      return Result.fail(emailRes.error);
    }

    const existsRes = await this.userRepository.exists(emailRes.value);
    if (existsRes.isFailure) {
      return Result.fail(existsRes.error);
    }
    if (existsRes.value) {
      return Result.fail('AUTH_EMAIL_IN_USE');
    }

    if (!passwordStr || passwordStr.length < 8) {
      return Result.fail('Password must be at least 8 characters long');
    }
    if (!/[a-z]/.test(passwordStr) || !/[A-Z]/.test(passwordStr) || !/[0-9]/.test(passwordStr)) {
      return Result.fail('Password must contain uppercase, lowercase, and a number');
    }

    const hashRes = await this.passwordHasher.hash(passwordStr);
    if (hashRes.isFailure) {
      return Result.fail(hashRes.error);
    }

    const credentialRes = Credential.create({ passwordHash: hashRes.value });
    if (credentialRes.isFailure) {
      return Result.fail(credentialRes.error);
    }

    // Resolve default role
    let role: Role | undefined;
    if (this.roleRepository) {
      const roleRes = await this.roleRepository.findByName('researcher');
      if (roleRes.isSuccess && roleRes.value) {
        role = roleRes.value;
      }
    }
    if (!role) {
      const fallbackRes = Role.create({
        name: 'researcher',
        description: 'Default Researcher Role',
      });
      if (fallbackRes.isFailure) return Result.fail(fallbackRes.error);
      role = fallbackRes.value;
    }

    const userRes = User.create({
      email: emailRes.value,
      credential: credentialRes.value,
      roles: [role],
      displayName,
      emailVerified: false,
    });
    if (userRes.isFailure) return Result.fail(userRes.error);

    const user = userRes.value;
    const saveRes = await this.userRepository.save(user);
    if (saveRes.isFailure) return Result.fail(saveRes.error);

    // Issue and persist email-verification token
    if (this.verificationTokenGenerator && this.emailVerificationTokenRepository) {
      const generated = this.verificationTokenGenerator.generate();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 h
      const tokenRes = VerificationToken.create({
        userId: user.userId,
        tokenHash: generated.tokenHash,
        expiresAt,
      });
      if (tokenRes.isSuccess) {
        await this.emailVerificationTokenRepository.save(tokenRes.value);
        if (this.emailNotifier) {
          await this.emailNotifier.sendEmailVerification(emailStr, generated.rawToken);
        }
      }
    }

    return Result.ok({
      user: IdentityDtoMapper.toUserDto(user),
      requiresEmailVerification: true,
    });
  }

  /**
   * Initiate a password-reset flow. Always returns success to prevent account
   * enumeration — if the email is unknown the response is identical.
   */
  public async forgotPassword(emailStr: string): Promise<Result<void>> {
    const emailRes = Email.create(emailStr);
    if (emailRes.isFailure) {
      return Result.ok(undefined); // no enumeration
    }

    const userRes = await this.userRepository.findByEmail(emailRes.value);
    if (userRes.isFailure || !userRes.value) {
      return Result.ok(undefined); // no enumeration
    }

    const user = userRes.value;

    if (this.verificationTokenGenerator && this.passwordResetTokenRepository) {
      const generated = this.verificationTokenGenerator.generate();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 h
      const tokenRes = VerificationToken.create({
        userId: user.userId,
        tokenHash: generated.tokenHash,
        expiresAt,
      });
      if (tokenRes.isSuccess) {
        await this.passwordResetTokenRepository.invalidateAllForUser(user.userId);
        await this.passwordResetTokenRepository.save(tokenRes.value);
        if (this.emailNotifier) {
          await this.emailNotifier.sendPasswordReset(emailStr, generated.rawToken);
        }
      }
    }

    return Result.ok(undefined);
  }

  /** Complete a password reset using the token from the email link. */
  public async resetPassword(rawToken: string, newPasswordStr: string): Promise<Result<void>> {
    if (!rawToken || rawToken.trim() === '') {
      return Result.fail('Reset token is required');
    }
    if (!newPasswordStr || newPasswordStr.length < 8) {
      return Result.fail('Password must be at least 8 characters long');
    }
    if (
      !/[a-z]/.test(newPasswordStr) ||
      !/[A-Z]/.test(newPasswordStr) ||
      !/[0-9]/.test(newPasswordStr)
    ) {
      return Result.fail('Password must contain uppercase, lowercase, and a number');
    }

    if (!this.verificationTokenGenerator || !this.passwordResetTokenRepository) {
      return Result.fail('Password reset is not configured');
    }

    const tokenHash = this.verificationTokenGenerator.hash(rawToken.trim());
    const tokenRes = await this.passwordResetTokenRepository.findByTokenHash(tokenHash);
    if (tokenRes.isFailure || !tokenRes.value) {
      return Result.fail('Invalid or expired reset token');
    }

    const token = tokenRes.value;
    if (!token.isUsable()) {
      return Result.fail('Invalid or expired reset token');
    }

    const userRes = await this.userRepository.findById(token.userId);
    if (userRes.isFailure || !userRes.value) {
      return Result.fail('User not found');
    }

    const user = userRes.value;
    const hashRes = await this.passwordHasher.hash(newPasswordStr);
    if (hashRes.isFailure) return Result.fail(hashRes.error);

    const changeRes = user.changePassword(hashRes.value);
    if (changeRes.isFailure) return Result.fail(changeRes.error);

    token.consume();
    await this.passwordResetTokenRepository.save(token);
    await this.userRepository.save(user);
    await this.sessionRepository.revokeAllForUser(user.userId);

    return Result.ok(undefined);
  }

  /** Verify an email address using the token from the verification link. */
  public async verifyEmail(rawToken: string): Promise<Result<void>> {
    if (!rawToken || rawToken.trim() === '') {
      return Result.fail('Verification token is required');
    }

    if (!this.verificationTokenGenerator || !this.emailVerificationTokenRepository) {
      return Result.fail('Email verification is not configured');
    }

    const tokenHash = this.verificationTokenGenerator.hash(rawToken.trim());
    const tokenRes = await this.emailVerificationTokenRepository.findByTokenHash(tokenHash);
    if (tokenRes.isFailure || !tokenRes.value) {
      return Result.fail('Invalid or expired verification token');
    }

    const token = tokenRes.value;
    if (!token.isUsable()) {
      return Result.fail('Invalid or expired verification token');
    }

    const userRes = await this.userRepository.findById(token.userId);
    if (userRes.isFailure || !userRes.value) {
      return Result.fail('User not found');
    }

    const user = userRes.value;
    user.verifyEmail();
    token.consume();

    await this.emailVerificationTokenRepository.save(token);
    await this.userRepository.save(user);

    return Result.ok(undefined);
  }

  /** Resend the email-verification link. Rate-limiting is enforced at the HTTP layer. */
  public async resendVerification(emailStr: string): Promise<Result<void>> {
    const emailRes = Email.create(emailStr);
    if (emailRes.isFailure) {
      return Result.ok(undefined); // no enumeration
    }

    const userRes = await this.userRepository.findByEmail(emailRes.value);
    if (userRes.isFailure || !userRes.value) {
      return Result.ok(undefined); // no enumeration
    }

    const user = userRes.value;
    if (user.emailVerified) {
      return Result.ok(undefined); // already verified — silent success
    }

    if (this.verificationTokenGenerator && this.emailVerificationTokenRepository) {
      const generated = this.verificationTokenGenerator.generate();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const tokenRes = VerificationToken.create({
        userId: user.userId,
        tokenHash: generated.tokenHash,
        expiresAt,
      });
      if (tokenRes.isSuccess) {
        await this.emailVerificationTokenRepository.invalidateAllForUser(user.userId);
        await this.emailVerificationTokenRepository.save(tokenRes.value);
        if (this.emailNotifier) {
          await this.emailNotifier.sendEmailVerification(emailStr, generated.rawToken);
        }
      }
    }

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

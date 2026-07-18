import {
  AccessToken,
  Credential,
  Email,
  IPasswordHasher,
  ISessionRepository,
  ITokenProvider,
  IUserRepository,
  PasswordHash,
  RefreshToken,
  Role,
  Session,
  SessionId,
  TokenClaims,
  TokenPairResult,
  User,
  UserId,
} from '@rios/domain';
import { Result } from '@rios/shared';
import { describe, expect, it } from 'vitest';

import {
  AuthenticateUserCommand,
  AuthenticateUserHandler,
  AuthenticationApplicationService,
  ChangePasswordCommand,
  ChangePasswordHandler,
} from '../index.js';

class MockUserRepository implements IUserRepository {
  public users = new Map<string, User>();

  findById(id: UserId): Promise<Result<User | null>> {
    return Promise.resolve(Result.ok(this.users.get(id.value) ?? null));
  }
  findByEmail(email: Email): Promise<Result<User | null>> {
    for (const u of this.users.values()) {
      if (u.email.value === email.value) return Promise.resolve(Result.ok(u));
    }
    return Promise.resolve(Result.ok(null));
  }
  save(user: User): Promise<Result<void>> {
    this.users.set(user.userId.value, user);
    return Promise.resolve(Result.ok(undefined));
  }
  async exists(email: Email): Promise<Result<boolean>> {
    const u = await this.findByEmail(email);
    return Result.ok(u.value !== null);
  }
  delete(id: UserId): Promise<Result<void>> {
    this.users.delete(id.value);
    return Promise.resolve(Result.ok(undefined));
  }
}

class MockSessionRepository implements ISessionRepository {
  public sessions = new Map<string, Session>();

  findById(id: SessionId): Promise<Result<Session | null>> {
    return Promise.resolve(Result.ok(this.sessions.get(id.value) ?? null));
  }
  findByUserId(userId: UserId): Promise<Result<Session[]>> {
    const list = Array.from(this.sessions.values()).filter((s) => s.userId.value === userId.value);
    return Promise.resolve(Result.ok(list));
  }
  save(session: Session): Promise<Result<void>> {
    this.sessions.set(session.sessionId.value, session);
    return Promise.resolve(Result.ok(undefined));
  }
  revoke(id: SessionId): Promise<Result<void>> {
    const s = this.sessions.get(id.value);
    if (s !== undefined) s.revoke();
    return Promise.resolve(Result.ok(undefined));
  }
  revokeAllForUser(userId: UserId): Promise<Result<void>> {
    for (const s of this.sessions.values()) {
      if (s.userId.value === userId.value) s.revoke();
    }
    return Promise.resolve(Result.ok(undefined));
  }
  deleteExpired(): Promise<Result<number>> {
    return Promise.resolve(Result.ok(0));
  }
}

class MockPasswordHasher implements IPasswordHasher {
  hash(plainText: string): Promise<Result<PasswordHash>> {
    return Promise.resolve(PasswordHash.create(`hashed_${plainText}`));
  }
  verify(plainText: string, hash: PasswordHash): Promise<Result<boolean>> {
    return Promise.resolve(Result.ok(hash.value === `hashed_${plainText}`));
  }
}

class MockTokenProvider implements ITokenProvider {
  generateTokens(user: User, session: Session): Promise<Result<TokenPairResult>> {
    return Promise.resolve(
      Result.ok({
        accessToken: AccessToken.create(
          `mock_access_${user.userId.value}_${session.sessionId.value}`,
        ).value,
        refreshToken: RefreshToken.create(
          '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        ).value,
        accessTokenExpiresAt: new Date(Date.now() + 900000),
        refreshTokenExpiresAt: new Date(Date.now() + 2592000000),
      }),
    );
  }
  validateAccessToken(token: AccessToken): Promise<Result<TokenClaims>> {
    if (token.value.startsWith('mock_access_')) {
      const parts = token.value.split('_');
      const userIdStr = parts[2] ?? 'u-100';
      const sessionIdStr = parts[3] ?? 's-100';
      return Promise.resolve(
        Result.ok({
          userId: userIdStr,
          sessionId: sessionIdStr,
          email: 'user@rios.org',
          roles: ['researcher'],
          permissions: ['identity.login'],
          issuedAt: new Date(),
          expiresAt: new Date(Date.now() + 900000),
        }),
      );
    }
    return Promise.resolve(Result.fail('Invalid mock token'));
  }
  verifyRefreshToken(token: RefreshToken): Promise<Result<boolean>> {
    return Promise.resolve(Result.ok(token.value.length === 64));
  }
}

describe('Identity Application Layer Use Case Tests', () => {
  it('should authenticate user and generate session & tokens', async () => {
    const userRepo = new MockUserRepository();
    const sessionRepo = new MockSessionRepository();
    const passwordHasher = new MockPasswordHasher();
    const tokenProvider = new MockTokenProvider();

    const email = Email.create('test@rios.org').value;
    const hash = PasswordHash.create('hashed_Password123!').value;
    const cred = Credential.create({ passwordHash: hash }).value;
    const role = Role.create({ name: 'researcher', description: 'Researcher' }).value;
    const user = User.create({ email, credential: cred, roles: [role] }, 'usr_1').value;

    await userRepo.save(user);

    const authService = new AuthenticationApplicationService(
      userRepo,
      sessionRepo,
      passwordHasher,
      tokenProvider,
    );
    const handler = new AuthenticateUserHandler(authService);

    const cmd = new AuthenticateUserCommand({
      email: 'test@rios.org',
      passwordStr: 'Password123!',
    });

    const res = await handler.handle(cmd);
    expect(res.isSuccess).toBe(true);
    expect(res.value?.user.email).toBe('test@rios.org');
    expect(sessionRepo.sessions.size).toBe(1);
  });

  it('should change password and revoke active sessions', async () => {
    const userRepo = new MockUserRepository();
    const sessionRepo = new MockSessionRepository();
    const passwordHasher = new MockPasswordHasher();

    const email = Email.create('test@rios.org').value;
    const hash = PasswordHash.create('hashed_OldPassword123!').value;
    const cred = Credential.create({ passwordHash: hash }).value;
    const role = Role.create({ name: 'researcher', description: 'Researcher' }).value;
    const user = User.create({ email, credential: cred, roles: [role] }, 'usr_1').value;

    await userRepo.save(user);

    const session = Session.create(
      { userId: user.userId, expiresAt: new Date(Date.now() + 10000) },
      'sess_1',
    ).value;
    await sessionRepo.save(session);

    const handler = new ChangePasswordHandler(userRepo, sessionRepo, passwordHasher);
    const cmd = new ChangePasswordCommand({
      userId: 'usr_1',
      currentPasswordStr: 'OldPassword123!',
      newPasswordStr: 'NewPassword123!',
    });

    const res = await handler.handle(cmd);
    expect(res.isSuccess).toBe(true);
    expect(session.isRevoked).toBe(true);
  });
});

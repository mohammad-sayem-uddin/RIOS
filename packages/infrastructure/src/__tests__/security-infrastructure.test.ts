import { Credential, Email, PasswordHash, Permission, Role, Session, User } from '@rios/domain';
import { describe, expect, it } from 'vitest';

import {
  BCryptPasswordHasher,
  InMemoryRoleRepository,
  InMemorySessionRepository,
  InMemoryUserRepository,
  JwtTokenProvider,
  StructuredAuditLogger,
} from '../index.js';

describe('Security Infrastructure Unit Tests', () => {
  describe('BCryptPasswordHasher', () => {
    it('should hash and verify passwords using constant-time PBKDF2', async () => {
      const hasher = new BCryptPasswordHasher();
      const hashRes = await hasher.hash('SecretPassword123!');
      expect(hashRes.isSuccess).toBe(true);

      const hash = hashRes.value;
      expect(hash.value).toContain('$rios$pbkdf2$');

      const matchRes = await hasher.verify('SecretPassword123!', hash);
      expect(matchRes.isSuccess).toBe(true);
      expect(matchRes.value).toBe(true);

      const wrongMatchRes = await hasher.verify('WrongPassword', hash);
      expect(wrongMatchRes.value).toBe(false);
    });
  });

  describe('JwtTokenProvider', () => {
    it('should generate and validate signed JWT access tokens', async () => {
      const tokenProvider = new JwtTokenProvider({ secret: 'test_jwt_secret_key_32_bytes_long!' });

      const email = Email.create('alice@rios.org').value;
      const passHash = PasswordHash.create('$hash').value;
      const credential = Credential.create({ passwordHash: passHash }).value;
      const perm = Permission.create({ name: 'users.read', description: 'R' }).value;
      const role = Role.create({ name: 'researcher', description: 'R', permissions: [perm] }).value;
      const user = User.create({ email, credential, roles: [role] }).value;

      const session = Session.create({
        userId: user.userId,
        expiresAt: new Date(Date.now() + 3600000),
      }).value;

      const tokensRes = await tokenProvider.generateTokens(user, session);
      expect(tokensRes.isSuccess).toBe(true);

      const { accessToken, refreshToken } = tokensRes.value;
      expect(accessToken.value.split('.').length).toBe(3);

      const claimsRes = await tokenProvider.validateAccessToken(accessToken);
      expect(claimsRes.isSuccess).toBe(true);
      expect(claimsRes.value.userId).toBe(user.userId.value);
      expect(claimsRes.value.email).toBe('alice@rios.org');
      expect(claimsRes.value.roles).toContain('researcher');
      expect(claimsRes.value.permissions).toContain('users.read');

      const verifyRefreshRes = await tokenProvider.verifyRefreshToken(refreshToken);
      expect(verifyRefreshRes.value).toBe(true);
    });
  });

  describe('InMemory Repositories', () => {
    it('should persist and retrieve Users, Sessions, and Roles', async () => {
      const userRepo = new InMemoryUserRepository();
      const sessionRepo = new InMemorySessionRepository();
      const roleRepo = new InMemoryRoleRepository();

      const roleRes = await roleRepo.findByName('researcher');
      expect(roleRes.isSuccess).toBe(true);
      expect(roleRes.value).toBeDefined();

      const email = Email.create('bob@rios.org').value;
      const passHash = PasswordHash.create('$hash').value;
      const credential = Credential.create({ passwordHash: passHash }).value;
      const user = User.create({ email, credential, roles: [roleRes.value!] }).value;

      await userRepo.save(user);
      const foundUser = await userRepo.findByEmail(email);
      expect(foundUser.value?.userId.value).toBe(user.userId.value);

      const session = Session.create({
        userId: user.userId,
        expiresAt: new Date(Date.now() + 60000),
      }).value;
      await sessionRepo.save(session);

      const foundSession = await sessionRepo.findById(session.sessionId);
      expect(foundSession.value?.sessionId.value).toBe(session.sessionId.value);
    });
  });

  describe('StructuredAuditLogger', () => {
    it('should format and emit security audit events', () => {
      const logger = new StructuredAuditLogger();
      expect(() => {
        logger.logAuditEvent({
          action: 'LOGIN',
          userId: 'user_123',
          sessionId: 'session_456',
          status: 'SUCCESS',
        });
      }).not.toThrow();
    });
  });
});

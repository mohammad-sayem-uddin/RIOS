import { describe, expect, it } from 'vitest';

import {
  AuditLogEntry,
  AuditOutcome,
  Credential,
  Email,
  PasswordHash,
  Permission,
  RefreshTokenRecord,
  Role,
  Session,
  User,
  UserId,
  UserStatus,
} from '../index.js';

describe('Identity Bounded Context Domain Unit Tests', () => {
  describe('Email Value Object', () => {
    it('should normalize and validate email addresses', () => {
      const validRes = Email.create('  USER@Domain.COM  ');
      expect(validRes.isSuccess).toBe(true);
      expect(validRes.value.value).toBe('user@domain.com');

      const invalidRes = Email.create('invalid-email-string');
      expect(invalidRes.isFailure).toBe(true);
    });
  });

  describe('PasswordHash Value Object', () => {
    it('should encapsulate password hashes safely', () => {
      const hashRes = PasswordHash.create('$pbkdf2$hash_value');
      expect(hashRes.isSuccess).toBe(true);
      expect(hashRes.value.value).toBe('$pbkdf2$hash_value');
      expect(hashRes.value.toString()).toBe('[PROTECTED_PASSWORD_HASH]');
    });
  });

  describe('Role and Permission Entities', () => {
    it('should manage permissions within roles', () => {
      const perm1 = Permission.create({ name: 'users.read', description: 'Read users' }).value;
      const perm2 = Permission.create({ name: 'users.write', description: 'Write users' }).value;
      const role = Role.create({
        name: 'researcher',
        description: 'Researcher',
        permissions: [perm1],
      }).value;

      expect(role.hasPermission('users.read')).toBe(true);
      expect(role.hasPermission('users.write')).toBe(false);

      role.addPermission(perm2);
      expect(role.hasPermission('users.write')).toBe(true);
    });
  });

  describe('Session Entity', () => {
    it('should track session lifecycle states correctly', () => {
      const userId = UserId.create();
      const expiresAt = new Date(Date.now() + 60000);
      const session = Session.create({ userId, expiresAt }).value;

      expect(session.isActive()).toBe(true);
      expect(session.isRevoked).toBe(false);

      session.revoke();
      expect(session.isRevoked).toBe(true);
      expect(session.isActive()).toBe(false);
    });

    describe('RefreshTokenRecord Entity', () => {
      it('should enforce refresh token lifecycle invariants', () => {
        const userId = UserId.create();
        const session = Session.create({
          userId,
          expiresAt: new Date(Date.now() + 60_000),
        }).value;

        const token = RefreshTokenRecord.create({
          userId,
          sessionId: session.sessionId,
          tokenHash: 'hashed_refresh_token',
          expiresAt: new Date(Date.now() + 120_000),
        }).value;

        expect(token.isActive()).toBe(true);
        expect(token.isRevoked).toBe(false);

        token.revoke();
        expect(token.isRevoked).toBe(true);
        expect(token.isActive()).toBe(false);
      });
    });

    describe('AuditLogEntry Entity', () => {
      it('should create immutable audit records for security events', () => {
        const userId = UserId.create();
        const entry = AuditLogEntry.create({
          userId,
          action: 'auth.login',
          outcome: AuditOutcome.SUCCESS,
          details: {
            source: 'unit-test',
            attempts: 1,
          },
        }).value;

        expect(entry.action).toBe('auth.login');
        expect(entry.outcome).toBe(AuditOutcome.SUCCESS);
        expect(entry.userId?.value).toBe(userId.value);
        expect(entry.details.source).toBe('unit-test');
      });
    });
  });

  describe('User Aggregate Root', () => {
    it('should enforce user aggregate invariants', () => {
      const email = Email.create('researcher@rios.org').value;
      const passHash = PasswordHash.create('$hashed_pass').value;
      const credential = Credential.create({ passwordHash: passHash }).value;
      const perm = Permission.create({ name: 'identity.login', description: 'Login' }).value;
      const role = Role.create({
        name: 'researcher',
        description: 'Researcher',
        permissions: [perm],
      }).value;

      const user = User.create({ email, credential, roles: [role], displayName: 'Alice' }).value;

      expect(user.isActive()).toBe(true);
      expect(user.hasRole('researcher')).toBe(true);
      expect(user.hasPermission('identity.login')).toBe(true);
      expect(user.getEffectivePermissions()).toContain('identity.login');

      user.deactivate();
      expect(user.status).toBe(UserStatus.DISABLED);
      expect(user.canAuthenticate()).toBe(false);
    });
  });
});

/**
 * Sprint 6 Persistence Mappers Unit Tests
 *
 * Architecture Reference: Volume I – Persistence Infrastructure & Quality Assurance (Sprint 6 Chapter 12 §217).
 */

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
  SessionId,
} from '@rios/domain';
import { describe, expect, it } from 'vitest';

import {
  AuditLogPersistenceMapper,
  PermissionPersistenceMapper,
  RefreshTokenPersistenceMapper,
  RolePersistenceMapper,
  SessionPersistenceMapper,
  UserPersistenceMapper,
} from '../index.js';

describe('Sprint 6 — Persistence Mappers Unit Test Suite', () => {
  it('PermissionPersistenceMapper converts bidirectionally without loss', () => {
    const permission = Permission.create(
      { name: 'user.read', description: 'Read users' },
      'p-123',
    ).value;
    const record = PermissionPersistenceMapper.toPersistence(permission);

    expect(record.id).toBe('p-123');
    expect(record.name).toBe('user.read');

    const domain = PermissionPersistenceMapper.toDomain(record).value;
    expect(domain.permissionId.value).toBe('p-123');
    expect(domain.name).toBe('user.read');
  });

  it('RolePersistenceMapper converts bidirectionally with nested permissions', () => {
    const perm = Permission.create(
      { name: 'role.assign', description: 'Assign roles' },
      'p-999',
    ).value;
    const role = Role.create(
      { name: 'admin', description: 'Admin role', permissions: [perm] },
      'r-456',
    ).value;

    const record = RolePersistenceMapper.toPersistence(role);
    expect(record.id).toBe('r-456');
    expect(record.permissions).toHaveLength(1);

    const domain = RolePersistenceMapper.toDomain(record).value;
    expect(domain.roleId.value).toBe('r-456');
    expect(domain.hasPermission('role.assign')).toBe(true);
  });

  it('SessionPersistenceMapper converts bidirectionally', () => {
    const userId = UserId.create('usr-100');
    const expiresAt = new Date(Date.now() + 3600000);
    const session = Session.create({ userId, expiresAt, ipAddress: '127.0.0.1' }, 'sess-1').value;

    const record = SessionPersistenceMapper.toPersistence(session);
    expect(record.id).toBe('sess-1');
    expect(record.userId).toBe('usr-100');
    expect(record.deviceIp).toBe('127.0.0.1');

    const domain = SessionPersistenceMapper.toDomain(record).value;
    expect(domain.sessionId.value).toBe('sess-1');
    expect(domain.userId.value).toBe('usr-100');
    expect(domain.ipAddress).toBe('127.0.0.1');
  });

  it('RefreshTokenPersistenceMapper converts bidirectionally', () => {
    const userId = UserId.create('usr-100');
    const sessionId = SessionId.create('sess-1');
    const expiresAt = new Date(Date.now() + 7200000);
    const token = RefreshTokenRecord.create(
      { userId, sessionId, tokenHash: 'hash-abc', expiresAt },
      'tok-123',
    ).value;

    const record = RefreshTokenPersistenceMapper.toPersistence(token);
    expect(record.id).toBe('tok-123');
    expect(record.tokenHash).toBe('hash-abc');

    const domain = RefreshTokenPersistenceMapper.toDomain(record).value;
    expect(domain.refreshTokenId).toBe('tok-123');
    expect(domain.tokenHash).toBe('hash-abc');
  });

  it('AuditLogPersistenceMapper converts bidirectionally with JSON details', () => {
    const userId = UserId.create('usr-100');
    const entry = AuditLogEntry.create(
      { userId, action: 'user.login', outcome: AuditOutcome.SUCCESS, details: { attempt: 1 } },
      'aud-1',
    ).value;

    const record = AuditLogPersistenceMapper.toPersistence(entry);
    expect(record.id).toBe('aud-1');
    expect(record.action).toBe('user.login');

    const domain = AuditLogPersistenceMapper.toDomain(record).value;
    expect(domain.auditLogId).toBe('aud-1');
    expect(domain.action).toBe('user.login');
    expect(domain.details.attempt).toBe(1);
  });

  it('UserPersistenceMapper reconstructs complete User aggregate with roles', () => {
    const email = Email.create('john@rios.org').value;
    const passwordHash = PasswordHash.create('argon2hash123').value;
    const credential = Credential.create({ passwordHash }).value;
    const perm = Permission.create({ name: 'user.read', description: 'Read' }).value;
    const role = Role.create({
      name: 'researcher',
      description: 'Researcher',
      permissions: [perm],
    }).value;

    const user = User.create(
      { email, credential, roles: [role], displayName: 'John Doe' },
      'usr-99',
    ).value;

    const record = UserPersistenceMapper.toPersistence(user);
    expect(record.id).toBe('usr-99');
    expect(record.email).toBe('john@rios.org');

    const domain = UserPersistenceMapper.toDomain(record).value;
    expect(domain.userId.value).toBe('usr-99');
    expect(domain.email.value).toBe('john@rios.org');
    expect(domain.hasRole('researcher')).toBe(true);
    expect(domain.hasPermission('user.read')).toBe(true);
  });
});

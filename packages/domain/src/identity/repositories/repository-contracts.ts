/**
 * Identity Repository Contracts
 *
 * Domain-level interfaces for persistence of identity aggregates & entities.
 * Architecture Reference: Volume I – Identity / Chapter 4 §36
 */

import { Result } from '@rios/shared';

import { User } from '../aggregates/user.js';
import { AuditLogEntry } from '../entities/audit-log-entry.js';
import { Permission } from '../entities/permission.js';
import { RefreshTokenRecord } from '../entities/refresh-token-record.js';
import { Role } from '../entities/role.js';
import { Session } from '../entities/session.js';
import {
  Email,
  PermissionId,
  RoleId,
  SessionId,
  UserId,
} from '../value-objects/identity-value-objects.js';

export interface IUserRepository {
  findById(id: UserId): Promise<Result<User | null>>;
  findByEmail(email: Email): Promise<Result<User | null>>;
  save(user: User): Promise<Result<void>>;
  exists(email: Email): Promise<Result<boolean>>;
  delete(id: UserId): Promise<Result<void>>;
}

export interface ISessionRepository {
  findById(id: SessionId): Promise<Result<Session | null>>;
  findByUserId(userId: UserId): Promise<Result<Session[]>>;
  save(session: Session): Promise<Result<void>>;
  revoke(id: SessionId): Promise<Result<void>>;
  revokeAllForUser(userId: UserId): Promise<Result<void>>;
  deleteExpired(): Promise<Result<number>>;
}

export interface IRoleRepository {
  findById(id: RoleId): Promise<Result<Role | null>>;
  findByName(name: string): Promise<Result<Role | null>>;
  findAll(): Promise<Result<Role[]>>;
  save(role: Role): Promise<Result<void>>;
}

export interface IPermissionRepository {
  findById(id: PermissionId): Promise<Result<Permission | null>>;
  findByName(name: string): Promise<Result<Permission | null>>;
  findAll(): Promise<Result<Permission[]>>;
  save(permission: Permission): Promise<Result<void>>;
}

export interface IRefreshTokenRepository {
  findById(id: string): Promise<Result<RefreshTokenRecord | null>>;
  findByTokenHash(tokenHash: string): Promise<Result<RefreshTokenRecord | null>>;
  findActiveByUserId(userId: UserId): Promise<Result<RefreshTokenRecord[]>>;
  save(token: RefreshTokenRecord): Promise<Result<void>>;
  revoke(id: string): Promise<Result<void>>;
  revokeAllForUser(userId: UserId): Promise<Result<void>>;
  deleteExpired(): Promise<Result<number>>;
  exists(tokenHash: string): Promise<Result<boolean>>;
}

export interface IAuditLogRepository {
  append(entry: AuditLogEntry): Promise<Result<void>>;
  findByUserId(userId: UserId, limit?: number, offset?: number): Promise<Result<AuditLogEntry[]>>;
  findByAction(action: string, limit?: number, offset?: number): Promise<Result<AuditLogEntry[]>>;
  countByUserId(userId: UserId): Promise<Result<number>>;
}

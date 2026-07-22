/**
 * User Persistence Mapper
 *
 * Converts between Domain User Aggregate and Prisma User Record (including roles and permissions).
 * Architecture Reference: Infrastructure Layer — Aggregate Reconstruction (Sprint 6 Chapter 8 §134).
 */

import { Credential, Email, PasswordHash, Role, User, UserStatus } from '@rios/domain';
import { Result } from '@rios/shared';

import type { PrismaRoleWithPermissions } from './role-persistence-mapper.js';
import { RolePersistenceMapper } from './role-persistence-mapper.js';

export interface PrismaUserWithRoles {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string | null;
  status: string;
  emailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  roles?: Array<{
    role: PrismaRoleWithPermissions;
  }>;
}

export class UserPersistenceMapper {
  static toDomain(record: PrismaUserWithRoles): Result<User> {
    const emailRes = Email.create(record.email);
    if (emailRes.isFailure) {
      return Result.fail(
        `Invalid email in User persistence record [${record.id}]: ${emailRes.error}`,
      );
    }

    const passwordHashRes = PasswordHash.create(record.passwordHash);
    if (passwordHashRes.isFailure) {
      return Result.fail(
        `Invalid passwordHash in User record [${record.id}]: ${passwordHashRes.error}`,
      );
    }

    const credentialRes = Credential.create({
      passwordHash: passwordHashRes.value,
      updatedAt: record.updatedAt,
    });
    if (credentialRes.isFailure) {
      return Result.fail(
        `Failed creating Credential for User [${record.id}]: ${credentialRes.error}`,
      );
    }

    const roles: Role[] = [];
    if (record.roles && Array.isArray(record.roles)) {
      for (const item of record.roles) {
        const roleRes = RolePersistenceMapper.toDomain(item.role);
        if (roleRes.isFailure) {
          return Result.fail(`Failed mapping Role for User [${record.id}]: ${roleRes.error}`);
        }
        roles.push(roleRes.value);
      }
    }

    if (roles.length === 0) {
      // Provide default fallback role if unassigned
      const defaultRole = Role.create({ name: 'user', description: 'Default user role' }).value;
      roles.push(defaultRole);
    }

    let status: (typeof UserStatus)[keyof typeof UserStatus] = UserStatus.ACTIVE;
    if (record.status === 'INACTIVE') status = UserStatus.INACTIVE;
    if (record.status === 'LOCKED') status = UserStatus.LOCKED;
    if (record.status === 'DISABLED') status = UserStatus.DISABLED;

    return User.create(
      {
        email: emailRes.value,
        credential: credentialRes.value,
        roles,
        displayName: record.displayName ?? record.email.split('@')[0],
        status,
        emailVerified: record.emailVerified ?? true,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
      record.id,
    );
  }

  static toPersistence(user: User): PrismaUserWithRoles {
    return {
      id: user.userId.value,
      email: user.email.value,
      passwordHash: user.credential.passwordHash.value,
      displayName: user.displayName,
      status: user.status,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: null,
      roles: user.roles.map((r) => ({
        role: RolePersistenceMapper.toPersistence(r),
      })),
    };
  }
}

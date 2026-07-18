/**
 * Role Persistence Mapper
 *
 * Converts between Domain Role Entity and Prisma Role Record with nested RolePermissions.
 * Architecture Reference: Infrastructure Layer — Persistence Mapping.
 */

import { Permission, Role } from '@rios/domain';
import { Result } from '@rios/shared';

import type { PrismaPermissionRecord } from './permission-persistence-mapper.js';
import { PermissionPersistenceMapper } from './permission-persistence-mapper.js';

export interface PrismaRoleWithPermissions {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
  permissions?: Array<{
    permission: PrismaPermissionRecord;
  }>;
}

export class RolePersistenceMapper {
  static toDomain(record: PrismaRoleWithPermissions): Result<Role> {
    const permissions: Permission[] = [];
    if (record.permissions && Array.isArray(record.permissions)) {
      for (const item of record.permissions) {
        const permRes = PermissionPersistenceMapper.toDomain(item.permission);
        if (permRes.isFailure) {
          return Result.fail(
            `Failed mapping permission inside role [${record.name}]: ${permRes.error}`,
          );
        }
        permissions.push(permRes.value);
      }
    }

    return Role.create(
      {
        name: record.name,
        description: record.description ?? '',
        permissions,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
      record.id,
    );
  }

  static toPersistence(role: Role): PrismaRoleWithPermissions {
    return {
      id: role.roleId.value,
      name: role.name,
      description: role.description,
      isSystem: false,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      permissions: role.permissions.map((p) => ({
        permission: PermissionPersistenceMapper.toPersistence(p),
      })),
    };
  }
}

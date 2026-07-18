/**
 * Permission Persistence Mapper
 *
 * Converts between Domain Permission Entity and Prisma Permission Record.
 * Architecture Reference: Infrastructure Layer — Persistence Mapping.
 */

import { Permission } from '@rios/domain';
import { Result } from '@rios/shared';

export interface PrismaPermissionRecord {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PermissionPersistenceMapper {
  static toDomain(record: PrismaPermissionRecord): Result<Permission> {
    return Permission.create(
      {
        name: record.name,
        description: record.description ?? '',
        createdAt: record.createdAt,
      },
      record.id,
    );
  }

  static toPersistence(permission: Permission): PrismaPermissionRecord {
    return {
      id: permission.permissionId.value,
      name: permission.name,
      description: permission.description,
      createdAt: permission.createdAt,
      updatedAt: permission.createdAt,
    };
  }
}

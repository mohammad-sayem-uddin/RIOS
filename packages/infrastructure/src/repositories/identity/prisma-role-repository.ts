/**
 * Prisma Role Repository
 *
 * Production implementation of IRoleRepository.
 * Manages Role entity persistence and permission associations.
 * Architecture Reference: Infrastructure Layer — Repository Implementation (Sprint 6 Chapter 11).
 */

import { IRoleRepository, Role, RoleId } from '@rios/domain';
import { Result } from '@rios/shared';

import type { DatabaseProvider } from '../../database/database-provider.js';
import { PrismaErrorTranslator } from '../../errors/prisma-error-translator.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';

import { RolePersistenceMapper } from './mappers/role-persistence-mapper.js';

interface PrismaRoleDelegate {
  findUnique(args: Record<string, unknown>): Promise<unknown>;
  findFirst(args: Record<string, unknown>): Promise<unknown>;
  findMany(args: Record<string, unknown>): Promise<unknown[]>;
  upsert(args: Record<string, unknown>): Promise<unknown>;
}

export class PrismaRoleRepository implements IRoleRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(context?: TransactionContext): { role: PrismaRoleDelegate } {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as { role: PrismaRoleDelegate };
    }
    return this.databaseProvider.getClient() as { role: PrismaRoleDelegate };
  }

  public async findById(id: RoleId, context?: TransactionContext): Promise<Result<Role | null>> {
    try {
      const client = this.getClient(context);
      const record = (await client.role.findUnique({
        where: { id: id.value },
        include: { permissions: { include: { permission: true } } },
      })) as Parameters<typeof RolePersistenceMapper.toDomain>[0] | null;

      if (!record) return Result.ok(null);
      return RolePersistenceMapper.toDomain(record);
    } catch (error) {
      return PrismaErrorTranslator.toResult<Role | null>(error, 'PrismaRoleRepository.findById');
    }
  }

  public async findByName(
    name: string,
    context?: TransactionContext,
  ): Promise<Result<Role | null>> {
    try {
      const client = this.getClient(context);
      const record = (await client.role.findFirst({
        where: { name: name.trim().toLowerCase() },
        include: { permissions: { include: { permission: true } } },
      })) as Parameters<typeof RolePersistenceMapper.toDomain>[0] | null;

      if (!record) return Result.ok(null);
      return RolePersistenceMapper.toDomain(record);
    } catch (error) {
      return PrismaErrorTranslator.toResult<Role | null>(error, 'PrismaRoleRepository.findByName');
    }
  }

  public async findAll(context?: TransactionContext): Promise<Result<Role[]>> {
    try {
      const client = this.getClient(context);
      const records = (await client.role.findMany({
        include: { permissions: { include: { permission: true } } },
      })) as Parameters<typeof RolePersistenceMapper.toDomain>[0][];

      const roles: Role[] = [];
      for (const rec of records) {
        const domainRes = RolePersistenceMapper.toDomain(rec);
        if (domainRes.isFailure) return Result.fail(domainRes.error);
        roles.push(domainRes.value);
      }

      return Result.ok(roles);
    } catch (error) {
      return PrismaErrorTranslator.toResult<Role[]>(error, 'PrismaRoleRepository.findAll');
    }
  }

  public async save(role: Role, context?: TransactionContext): Promise<Result<void>> {
    try {
      const client = this.getClient(context);
      const record = RolePersistenceMapper.toPersistence(role);

      await client.role.upsert({
        where: { id: record.id },
        create: {
          id: record.id,
          name: record.name,
          description: record.description,
          isSystem: record.isSystem,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
        },
        update: {
          name: record.name,
          description: record.description,
          updatedAt: record.updatedAt,
        },
      });

      return Result.ok(undefined);
    } catch (error) {
      return PrismaErrorTranslator.toResult<void>(error, 'PrismaRoleRepository.save');
    }
  }
}

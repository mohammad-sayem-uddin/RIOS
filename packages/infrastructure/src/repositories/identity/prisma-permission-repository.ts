/**
 * Prisma Permission Repository
 *
 * Production implementation of IPermissionRepository.
 * Manages granular Permission entity persistence.
 * Architecture Reference: Infrastructure Layer — Repository Implementation (Sprint 6 Chapter 11).
 */

import { IPermissionRepository, Permission, PermissionId } from '@rios/domain';
import { Result } from '@rios/shared';

import type { DatabaseProvider } from '../../database/database-provider.js';
import { PrismaErrorTranslator } from '../../errors/prisma-error-translator.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';

import { PermissionPersistenceMapper } from './mappers/permission-persistence-mapper.js';

interface PrismaPermissionDelegate {
  findUnique(args: Record<string, unknown>): Promise<unknown>;
  findFirst(args: Record<string, unknown>): Promise<unknown>;
  findMany(args: Record<string, unknown>): Promise<unknown[]>;
  upsert(args: Record<string, unknown>): Promise<unknown>;
}

export class PrismaPermissionRepository implements IPermissionRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(context?: TransactionContext): { permission: PrismaPermissionDelegate } {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as { permission: PrismaPermissionDelegate };
    }
    return this.databaseProvider.getClient() as { permission: PrismaPermissionDelegate };
  }

  public async findById(
    id: PermissionId,
    context?: TransactionContext,
  ): Promise<Result<Permission | null>> {
    try {
      const client = this.getClient(context);
      const record = (await client.permission.findUnique({ where: { id: id.value } })) as
        Parameters<typeof PermissionPersistenceMapper.toDomain>[0] | null;

      if (!record) return Result.ok(null);
      return PermissionPersistenceMapper.toDomain(record);
    } catch (error) {
      return PrismaErrorTranslator.toResult<Permission | null>(
        error,
        'PrismaPermissionRepository.findById',
      );
    }
  }

  public async findByName(
    name: string,
    context?: TransactionContext,
  ): Promise<Result<Permission | null>> {
    try {
      const client = this.getClient(context);
      const record = (await client.permission.findFirst({
        where: { name: name.trim().toLowerCase() },
      })) as Parameters<typeof PermissionPersistenceMapper.toDomain>[0] | null;

      if (!record) return Result.ok(null);
      return PermissionPersistenceMapper.toDomain(record);
    } catch (error) {
      return PrismaErrorTranslator.toResult<Permission | null>(
        error,
        'PrismaPermissionRepository.findByName',
      );
    }
  }

  public async findAll(context?: TransactionContext): Promise<Result<Permission[]>> {
    try {
      const client = this.getClient(context);
      const records = (await client.permission.findMany({})) as Parameters<
        typeof PermissionPersistenceMapper.toDomain
      >[0][];

      const permissions: Permission[] = [];
      for (const rec of records) {
        const domainRes = PermissionPersistenceMapper.toDomain(rec);
        if (domainRes.isFailure) return Result.fail(domainRes.error);
        permissions.push(domainRes.value);
      }

      return Result.ok(permissions);
    } catch (error) {
      return PrismaErrorTranslator.toResult<Permission[]>(
        error,
        'PrismaPermissionRepository.findAll',
      );
    }
  }

  public async save(permission: Permission, context?: TransactionContext): Promise<Result<void>> {
    try {
      const client = this.getClient(context);
      const record = PermissionPersistenceMapper.toPersistence(permission);

      await client.permission.upsert({
        where: { id: record.id },
        create: {
          id: record.id,
          name: record.name,
          description: record.description,
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
      return PrismaErrorTranslator.toResult<void>(error, 'PrismaPermissionRepository.save');
    }
  }
}

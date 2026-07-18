/**
 * Prisma User Repository
 *
 * Production implementation of IUserRepository.
 * Manages User aggregate persistence, eager relationship loading, and aggregate reconstruction.
 * Architecture Reference: Infrastructure Layer — Repository Implementation (Sprint 6 Chapter 11 §193).
 */

import { Email, IUserRepository, User, UserId } from '@rios/domain';
import { Result } from '@rios/shared';

import type { DatabaseProvider } from '../../database/database-provider.js';
import { PrismaErrorTranslator } from '../../errors/prisma-error-translator.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';

import { UserPersistenceMapper } from './mappers/user-persistence-mapper.js';

interface PrismaUserDelegate {
  findUnique(args: Record<string, unknown>): Promise<unknown>;
  findFirst(args: Record<string, unknown>): Promise<unknown>;
  upsert(args: Record<string, unknown>): Promise<unknown>;
  delete(args: Record<string, unknown>): Promise<unknown>;
}

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(context?: TransactionContext): { user: PrismaUserDelegate } {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as { user: PrismaUserDelegate };
    }
    return this.databaseProvider.getClient() as { user: PrismaUserDelegate };
  }

  public async findById(id: UserId, context?: TransactionContext): Promise<Result<User | null>> {
    try {
      const client = this.getClient(context);
      const record = (await client.user.findUnique({
        where: { id: id.value },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: { permission: true },
                  },
                },
              },
            },
          },
        },
      })) as Parameters<typeof UserPersistenceMapper.toDomain>[0] | null;

      if (!record) {
        return Result.ok(null);
      }

      return UserPersistenceMapper.toDomain(record);
    } catch (error) {
      return PrismaErrorTranslator.toResult<User | null>(error, 'PrismaUserRepository.findById');
    }
  }

  public async findByEmail(
    email: Email,
    context?: TransactionContext,
  ): Promise<Result<User | null>> {
    try {
      const client = this.getClient(context);
      const record = (await client.user.findFirst({
        where: { email: email.value.toLowerCase() },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: { permission: true },
                  },
                },
              },
            },
          },
        },
      })) as Parameters<typeof UserPersistenceMapper.toDomain>[0] | null;

      if (!record) {
        return Result.ok(null);
      }

      return UserPersistenceMapper.toDomain(record);
    } catch (error) {
      return PrismaErrorTranslator.toResult<User | null>(error, 'PrismaUserRepository.findByEmail');
    }
  }

  public async save(user: User, context?: TransactionContext): Promise<Result<void>> {
    try {
      const client = this.getClient(context);
      const persistenceModel = UserPersistenceMapper.toPersistence(user);

      await client.user.upsert({
        where: { id: persistenceModel.id },
        create: {
          id: persistenceModel.id,
          email: persistenceModel.email,
          passwordHash: persistenceModel.passwordHash,
          displayName: persistenceModel.displayName,
          status: persistenceModel.status,
          createdAt: persistenceModel.createdAt,
          updatedAt: persistenceModel.updatedAt,
        },
        update: {
          email: persistenceModel.email,
          passwordHash: persistenceModel.passwordHash,
          displayName: persistenceModel.displayName,
          status: persistenceModel.status,
          updatedAt: persistenceModel.updatedAt,
        },
      });

      return Result.ok(undefined);
    } catch (error) {
      return PrismaErrorTranslator.toResult<void>(error, 'PrismaUserRepository.save');
    }
  }

  public async exists(email: Email, context?: TransactionContext): Promise<Result<boolean>> {
    const findRes = await this.findByEmail(email, context);
    if (findRes.isFailure) return Result.fail(findRes.error);
    return Result.ok(findRes.value !== null);
  }

  public async delete(id: UserId, context?: TransactionContext): Promise<Result<void>> {
    try {
      const client = this.getClient(context);
      await client.user.delete({ where: { id: id.value } });
      return Result.ok(undefined);
    } catch (error) {
      return PrismaErrorTranslator.toResult<void>(error, 'PrismaUserRepository.delete');
    }
  }
}

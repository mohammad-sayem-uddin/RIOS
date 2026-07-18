/**
 * Prisma Refresh Token Repository
 *
 * Production implementation of IRefreshTokenRepository.
 * Manages hashed RefreshTokenRecord persistence and revocation.
 * Architecture Reference: Infrastructure Layer — Repository Implementation (Sprint 6 Chapter 11).
 */

import { IRefreshTokenRepository, RefreshTokenRecord, UserId } from '@rios/domain';
import { Result } from '@rios/shared';

import type { DatabaseProvider } from '../../database/database-provider.js';
import { PrismaErrorTranslator } from '../../errors/prisma-error-translator.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';

import { RefreshTokenPersistenceMapper } from './mappers/refresh-token-persistence-mapper.js';

interface PrismaRefreshTokenDelegate {
  findUnique(args: Record<string, unknown>): Promise<unknown>;
  findFirst(args: Record<string, unknown>): Promise<unknown>;
  findMany(args: Record<string, unknown>): Promise<unknown[]>;
  upsert(args: Record<string, unknown>): Promise<unknown>;
  update(args: Record<string, unknown>): Promise<unknown>;
  updateMany(args: Record<string, unknown>): Promise<{ count: number }>;
  deleteMany(args: Record<string, unknown>): Promise<{ count: number }>;
}

export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(context?: TransactionContext): { refreshToken: PrismaRefreshTokenDelegate } {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as { refreshToken: PrismaRefreshTokenDelegate };
    }
    return this.databaseProvider.getClient() as { refreshToken: PrismaRefreshTokenDelegate };
  }

  public async findById(
    id: string,
    context?: TransactionContext,
  ): Promise<Result<RefreshTokenRecord | null>> {
    try {
      const client = this.getClient(context);
      const record = (await client.refreshToken.findUnique({ where: { id } })) as
        Parameters<typeof RefreshTokenPersistenceMapper.toDomain>[0] | null;

      if (!record) return Result.ok(null);
      return RefreshTokenPersistenceMapper.toDomain(record);
    } catch (error) {
      return PrismaErrorTranslator.toResult<RefreshTokenRecord | null>(
        error,
        'PrismaRefreshTokenRepository.findById',
      );
    }
  }

  public async findByTokenHash(
    tokenHash: string,
    context?: TransactionContext,
  ): Promise<Result<RefreshTokenRecord | null>> {
    try {
      const client = this.getClient(context);
      const record = (await client.refreshToken.findFirst({
        where: { tokenHash: tokenHash.trim() },
      })) as Parameters<typeof RefreshTokenPersistenceMapper.toDomain>[0] | null;

      if (!record) return Result.ok(null);
      return RefreshTokenPersistenceMapper.toDomain(record);
    } catch (error) {
      return PrismaErrorTranslator.toResult<RefreshTokenRecord | null>(
        error,
        'PrismaRefreshTokenRepository.findByTokenHash',
      );
    }
  }

  public async findActiveByUserId(
    userId: UserId,
    context?: TransactionContext,
  ): Promise<Result<RefreshTokenRecord[]>> {
    try {
      const client = this.getClient(context);
      const records = (await client.refreshToken.findMany({
        where: {
          userId: userId.value,
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
      })) as Parameters<typeof RefreshTokenPersistenceMapper.toDomain>[0][];

      const tokens: RefreshTokenRecord[] = [];
      for (const rec of records) {
        const domainRes = RefreshTokenPersistenceMapper.toDomain(rec);
        if (domainRes.isFailure) return Result.fail(domainRes.error);
        tokens.push(domainRes.value);
      }

      return Result.ok(tokens);
    } catch (error) {
      return PrismaErrorTranslator.toResult<RefreshTokenRecord[]>(
        error,
        'PrismaRefreshTokenRepository.findActiveByUserId',
      );
    }
  }

  public async save(
    token: RefreshTokenRecord,
    context?: TransactionContext,
  ): Promise<Result<void>> {
    try {
      const client = this.getClient(context);
      const record = RefreshTokenPersistenceMapper.toPersistence(token);

      await client.refreshToken.upsert({
        where: { id: record.id },
        create: {
          id: record.id,
          userId: record.userId,
          tokenHash: record.tokenHash,
          expiresAt: record.expiresAt,
          revokedAt: record.revokedAt,
          replacedByTokenId: record.replacedByTokenId,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
        },
        update: {
          revokedAt: record.revokedAt,
          replacedByTokenId: record.replacedByTokenId,
          updatedAt: record.updatedAt,
        },
      });

      return Result.ok(undefined);
    } catch (error) {
      return PrismaErrorTranslator.toResult<void>(error, 'PrismaRefreshTokenRepository.save');
    }
  }

  public async revoke(id: string, context?: TransactionContext): Promise<Result<void>> {
    try {
      const client = this.getClient(context);
      await client.refreshToken.update({
        where: { id },
        data: { revokedAt: new Date() },
      });
      return Result.ok(undefined);
    } catch (error) {
      return PrismaErrorTranslator.toResult<void>(error, 'PrismaRefreshTokenRepository.revoke');
    }
  }

  public async revokeAllForUser(
    userId: UserId,
    context?: TransactionContext,
  ): Promise<Result<void>> {
    try {
      const client = this.getClient(context);
      await client.refreshToken.updateMany({
        where: { userId: userId.value, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      return Result.ok(undefined);
    } catch (error) {
      return PrismaErrorTranslator.toResult<void>(
        error,
        'PrismaRefreshTokenRepository.revokeAllForUser',
      );
    }
  }

  public async deleteExpired(context?: TransactionContext): Promise<Result<number>> {
    try {
      const client = this.getClient(context);
      const res = await client.refreshToken.deleteMany({
        where: { expiresAt: { lt: new Date() } },
      });
      return Result.ok(res.count);
    } catch (error) {
      return PrismaErrorTranslator.toResult<number>(
        error,
        'PrismaRefreshTokenRepository.deleteExpired',
      );
    }
  }

  public async exists(tokenHash: string, context?: TransactionContext): Promise<Result<boolean>> {
    const res = await this.findByTokenHash(tokenHash, context);
    if (res.isFailure) return Result.fail(res.error);
    return Result.ok(res.value !== null);
  }
}

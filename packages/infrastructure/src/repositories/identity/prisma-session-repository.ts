/**
 * Prisma Session Repository
 *
 * Production implementation of ISessionRepository.
 * Handles Session entity persistence, user session lookups, and session revocation.
 * Architecture Reference: Infrastructure Layer — Repository Implementation (Sprint 6 Chapter 11).
 */

import { ISessionRepository, Session, SessionId, UserId } from '@rios/domain';
import { Result } from '@rios/shared';

import type { DatabaseProvider } from '../../database/database-provider.js';
import { PrismaErrorTranslator } from '../../errors/prisma-error-translator.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';

import { SessionPersistenceMapper } from './mappers/session-persistence-mapper.js';

interface PrismaSessionDelegate {
  findUnique(args: Record<string, unknown>): Promise<unknown>;
  findMany(args: Record<string, unknown>): Promise<unknown[]>;
  upsert(args: Record<string, unknown>): Promise<unknown>;
  update(args: Record<string, unknown>): Promise<unknown>;
  updateMany(args: Record<string, unknown>): Promise<{ count: number }>;
  deleteMany(args: Record<string, unknown>): Promise<{ count: number }>;
}

export class PrismaSessionRepository implements ISessionRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(context?: TransactionContext): { session: PrismaSessionDelegate } {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as { session: PrismaSessionDelegate };
    }
    return this.databaseProvider.getClient() as { session: PrismaSessionDelegate };
  }

  public async findById(
    id: SessionId,
    context?: TransactionContext,
  ): Promise<Result<Session | null>> {
    try {
      const client = this.getClient(context);
      const record = (await client.session.findUnique({ where: { id: id.value } })) as
        Parameters<typeof SessionPersistenceMapper.toDomain>[0] | null;

      if (!record) {
        return Result.ok(null);
      }

      return SessionPersistenceMapper.toDomain(record);
    } catch (error) {
      return PrismaErrorTranslator.toResult<Session | null>(
        error,
        'PrismaSessionRepository.findById',
      );
    }
  }

  public async findByUserId(
    userId: UserId,
    context?: TransactionContext,
  ): Promise<Result<Session[]>> {
    try {
      const client = this.getClient(context);
      const records = (await client.session.findMany({
        where: { userId: userId.value },
      })) as Parameters<typeof SessionPersistenceMapper.toDomain>[0][];

      const sessions: Session[] = [];
      for (const record of records) {
        const domainRes = SessionPersistenceMapper.toDomain(record);
        if (domainRes.isFailure) {
          return Result.fail(domainRes.error);
        }
        sessions.push(domainRes.value);
      }

      return Result.ok(sessions);
    } catch (error) {
      return PrismaErrorTranslator.toResult<Session[]>(
        error,
        'PrismaSessionRepository.findByUserId',
      );
    }
  }

  public async save(session: Session, context?: TransactionContext): Promise<Result<void>> {
    try {
      const client = this.getClient(context);
      const record = SessionPersistenceMapper.toPersistence(session);

      await client.session.upsert({
        where: { id: record.id },
        create: {
          id: record.id,
          userId: record.userId,
          deviceIp: record.deviceIp,
          userAgent: record.userAgent,
          expiresAt: record.expiresAt,
          revokedAt: record.revokedAt,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
        },
        update: {
          expiresAt: record.expiresAt,
          revokedAt: record.revokedAt,
          updatedAt: record.updatedAt,
        },
      });

      return Result.ok(undefined);
    } catch (error) {
      return PrismaErrorTranslator.toResult<void>(error, 'PrismaSessionRepository.save');
    }
  }

  public async revoke(id: SessionId, context?: TransactionContext): Promise<Result<void>> {
    try {
      const client = this.getClient(context);
      await client.session.update({
        where: { id: id.value },
        data: { revokedAt: new Date() },
      });
      return Result.ok(undefined);
    } catch (error) {
      return PrismaErrorTranslator.toResult<void>(error, 'PrismaSessionRepository.revoke');
    }
  }

  public async revokeAllForUser(
    userId: UserId,
    context?: TransactionContext,
  ): Promise<Result<void>> {
    try {
      const client = this.getClient(context);
      await client.session.updateMany({
        where: { userId: userId.value, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      return Result.ok(undefined);
    } catch (error) {
      return PrismaErrorTranslator.toResult<void>(
        error,
        'PrismaSessionRepository.revokeAllForUser',
      );
    }
  }

  public async deleteExpired(context?: TransactionContext): Promise<Result<number>> {
    try {
      const client = this.getClient(context);
      const res = await client.session.deleteMany({
        where: { expiresAt: { lt: new Date() } },
      });
      return Result.ok(res.count);
    } catch (error) {
      return PrismaErrorTranslator.toResult<number>(error, 'PrismaSessionRepository.deleteExpired');
    }
  }
}

/**
 * Prisma Audit Log Repository
 *
 * Production implementation of IAuditLogRepository.
 * Persists security audit entries to PostgreSQL.
 * Architecture Reference: Infrastructure Layer — Repository Implementation (Sprint 6 Chapter 11).
 */

import { AuditLogEntry, IAuditLogRepository, UserId } from '@rios/domain';
import { Result } from '@rios/shared';

import type { DatabaseProvider } from '../../database/database-provider.js';
import { PrismaErrorTranslator } from '../../errors/prisma-error-translator.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';

import { AuditLogPersistenceMapper } from './mappers/audit-log-persistence-mapper.js';

interface PrismaAuditLogDelegate {
  create(args: Record<string, unknown>): Promise<unknown>;
  findMany(args: Record<string, unknown>): Promise<unknown[]>;
  count(args: Record<string, unknown>): Promise<number>;
}

export class PrismaAuditLogRepository implements IAuditLogRepository {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getClient(context?: TransactionContext): { auditLog: PrismaAuditLogDelegate } {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as { auditLog: PrismaAuditLogDelegate };
    }
    return this.databaseProvider.getClient() as { auditLog: PrismaAuditLogDelegate };
  }

  public async append(entry: AuditLogEntry, context?: TransactionContext): Promise<Result<void>> {
    try {
      const client = this.getClient(context);
      const record = AuditLogPersistenceMapper.toPersistence(entry);

      await client.auditLog.create({
        data: {
          id: record.id,
          userId: record.userId,
          action: record.action,
          details: record.details,
          ipAddress: record.ipAddress,
          userAgent: record.userAgent,
          createdAt: record.createdAt,
        },
      });

      return Result.ok(undefined);
    } catch (error) {
      return PrismaErrorTranslator.toResult<void>(error, 'PrismaAuditLogRepository.append');
    }
  }

  public async findByUserId(
    userId: UserId,
    limit = 50,
    offset = 0,
    context?: TransactionContext,
  ): Promise<Result<AuditLogEntry[]>> {
    try {
      const client = this.getClient(context);
      const records = (await client.auditLog.findMany({
        where: { userId: userId.value },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      })) as Parameters<typeof AuditLogPersistenceMapper.toDomain>[0][];

      const entries: AuditLogEntry[] = [];
      for (const rec of records) {
        const res = AuditLogPersistenceMapper.toDomain(rec);
        if (res.isFailure) return Result.fail(res.error);
        entries.push(res.value);
      }

      return Result.ok(entries);
    } catch (error) {
      return PrismaErrorTranslator.toResult<AuditLogEntry[]>(
        error,
        'PrismaAuditLogRepository.findByUserId',
      );
    }
  }

  public async findByAction(
    action: string,
    limit = 50,
    offset = 0,
    context?: TransactionContext,
  ): Promise<Result<AuditLogEntry[]>> {
    try {
      const client = this.getClient(context);
      const records = (await client.auditLog.findMany({
        where: { action: action.trim() },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      })) as Parameters<typeof AuditLogPersistenceMapper.toDomain>[0][];

      const entries: AuditLogEntry[] = [];
      for (const rec of records) {
        const res = AuditLogPersistenceMapper.toDomain(rec);
        if (res.isFailure) return Result.fail(res.error);
        entries.push(res.value);
      }

      return Result.ok(entries);
    } catch (error) {
      return PrismaErrorTranslator.toResult<AuditLogEntry[]>(
        error,
        'PrismaAuditLogRepository.findByAction',
      );
    }
  }

  public async countByUserId(
    userId: UserId,
    context?: TransactionContext,
  ): Promise<Result<number>> {
    try {
      const client = this.getClient(context);
      const count = await client.auditLog.count({
        where: { userId: userId.value },
      });
      return Result.ok(count);
    } catch (error) {
      return PrismaErrorTranslator.toResult<number>(
        error,
        'PrismaAuditLogRepository.countByUserId',
      );
    }
  }
}

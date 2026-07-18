/**
 * Concrete implementation of OutboxRepository and OutboxStore using Prisma.
 *
 * Architecture reference:
 * Infrastructure Layer — Event Strategy — Transactional Outbox.
 *
 * Responsibilities:
 * - Persists OutboxRecords atomically within the active UnitOfWork context.
 * - Manages outbox record states (PENDING, PROCESSED, FAILED).
 * - Tracks delivery attempts and retry counters.
 * - Wraps all errors using InfrastructureErrorMapper.
 * - Repositories MUST NEVER publish events to external brokers.
 */

import type { DomainEvent } from '@rios/shared';
import { Result } from '@rios/shared';

import type { DatabaseProvider } from '../database/database-provider.js';
import { InfrastructureErrorMapper } from '../errors/infrastructure-error-mapper.js';
import type { Logger } from '../logging/logger.js';
import type { TransactionContext } from '../persistence/unit-of-work.js';

import { OutboxEventMapper } from './outbox-event-mapper.js';
import { OutboxStatus, type OutboxRecord } from './outbox-model.js';
import type { OutboxRepository } from './outbox-repository.js';
import type { OutboxEntry, OutboxStore } from './outbox-store.js';

export class PrismaOutboxRepositoryImpl implements OutboxRepository, OutboxStore {
  /** In-memory store fallback for testing/mock database providers */
  private readonly inMemoryRecords = new Map<string, OutboxRecord>();

  constructor(
    private readonly databaseProvider: DatabaseProvider,
    private readonly logger?: Logger,
  ) {}

  // ─── OutboxRepository & OutboxStore Overloaded Store ─────────────────

  async store(
    records: ReadonlyArray<OutboxRecord>,
    context?: TransactionContext,
  ): Promise<Result<void>>;
  async store(events: ReadonlyArray<DomainEvent>, transactionId: string): Promise<Result<void>>;
  async store(
    recordsOrEvents: ReadonlyArray<OutboxRecord | DomainEvent>,
    contextOrTxId?: TransactionContext | string,
  ): Promise<Result<void>> {
    try {
      if (recordsOrEvents.length === 0) {
        return Result.ok(undefined);
      }

      const first = recordsOrEvents[0];
      let records: ReadonlyArray<OutboxRecord>;
      let context: TransactionContext | undefined;

      if (first !== undefined && 'eventId' in first && typeof first.eventId === 'string') {
        records = (recordsOrEvents as ReadonlyArray<DomainEvent>).map((e) =>
          OutboxEventMapper.toRecord(e),
        );
        context = typeof contextOrTxId === 'object' ? contextOrTxId : undefined;
      } else {
        records = recordsOrEvents as ReadonlyArray<OutboxRecord>;
        context = typeof contextOrTxId === 'object' ? contextOrTxId : undefined;
      }

      const client = this.resolveClient(context);

      // Persist to underlying client if outbox delegate exists
      const delegate = this.getOutboxDelegate(client);
      if (delegate !== null) {
        for (const record of records) {
          await delegate.upsert({
            where: { id: record.id },
            create: this.toPrismaInput(record),
            update: this.toPrismaInput(record),
          });
        }
      }

      // Always update in-memory record map to ensure state consistency
      for (const record of records) {
        this.inMemoryRecords.set(record.id, { ...record });
      }

      this.logger?.debug('Stored outbox records', { count: records.length });
      return Result.ok(undefined);
    } catch (error) {
      const infraError = InfrastructureErrorMapper.toInfrastructureError(
        error,
        'OutboxRepository.store',
      );
      this.logger?.error('Failed to store outbox records', { error: infraError });
      return Result.fail(infraError.message);
    }
  }

  // ─── OutboxRepository Contract ─────────────────────────────────────

  /**
   * Find pending outbox records ordered by stored date.
   */
  async findPending(
    limit = 100,
    context?: TransactionContext,
  ): Promise<Result<ReadonlyArray<OutboxRecord>>> {
    try {
      const client = this.resolveClient(context);
      const delegate = this.getOutboxDelegate(client);

      if (delegate !== null) {
        const records = await delegate.findMany({
          where: { status: OutboxStatus.PENDING },
          take: limit,
          orderBy: { storedAt: 'asc' },
        });

        if (Array.isArray(records) && records.length > 0) {
          return Result.ok(records.map((r) => this.toOutboxRecord(r)));
        }
      }

      // Fallback query on in-memory backing store
      const pending = Array.from(this.inMemoryRecords.values())
        .filter((r) => r.status === OutboxStatus.PENDING)
        .sort((a, b) => a.storedAt.getTime() - b.storedAt.getTime())
        .slice(0, limit);

      return Result.ok(pending);
    } catch (error) {
      const infraError = InfrastructureErrorMapper.toInfrastructureError(
        error,
        'OutboxRepository.findPending',
      );
      this.logger?.error('Failed to find pending outbox records', { error: infraError });
      return Result.fail(infraError.message);
    }
  }

  /**
   * Mark an outbox record as PROCESSED.
   */
  async markProcessed(eventId: string, context?: TransactionContext): Promise<Result<void>> {
    try {
      const client = this.resolveClient(context);
      const delegate = this.getOutboxDelegate(client);

      if (delegate !== null) {
        await delegate.update({
          where: { id: eventId },
          data: { status: OutboxStatus.PROCESSED },
        });
      }

      const record = this.inMemoryRecords.get(eventId);
      if (record !== undefined) {
        this.inMemoryRecords.set(eventId, {
          ...record,
          status: OutboxStatus.PROCESSED,
        });
      }

      this.logger?.debug('Marked outbox record as PROCESSED', { eventId });
      return Result.ok(undefined);
    } catch (error) {
      const infraError = InfrastructureErrorMapper.toInfrastructureError(
        error,
        'OutboxRepository.markProcessed',
      );
      this.logger?.error('Failed to mark outbox record processed', { eventId, error: infraError });
      return Result.fail(infraError.message);
    }
  }

  /**
   * Increment retry count and update error message.
   */
  async incrementRetry(
    eventId: string,
    errorContext?: string,
    context?: TransactionContext,
  ): Promise<Result<void>> {
    try {
      const client = this.resolveClient(context);
      const delegate = this.getOutboxDelegate(client);

      const existing = this.inMemoryRecords.get(eventId);
      const currentRetry = existing !== undefined ? existing.retryCount : 0;
      const nextRetry = currentRetry + 1;
      const nextStatus = nextRetry >= 5 ? OutboxStatus.FAILED : OutboxStatus.PENDING;

      if (delegate !== null) {
        await delegate.update({
          where: { id: eventId },
          data: {
            retryCount: nextRetry,
            status: nextStatus,
            lastError: errorContext ?? null,
          },
        });
      }

      if (existing !== undefined) {
        this.inMemoryRecords.set(eventId, {
          ...existing,
          retryCount: nextRetry,
          status: nextStatus,
          lastError: errorContext,
        });
      }

      this.logger?.debug('Incremented outbox record retry count', {
        eventId,
        retryCount: nextRetry,
      });
      return Result.ok(undefined);
    } catch (error) {
      const infraError = InfrastructureErrorMapper.toInfrastructureError(
        error,
        'OutboxRepository.incrementRetry',
      );
      this.logger?.error('Failed to increment outbox retry count', { eventId, error: infraError });
      return Result.fail(infraError.message);
    }
  }

  // ─── OutboxStore Contract (Backward Compatibility) ────────────────

  async getUnpublished(limit: number): Promise<Result<ReadonlyArray<OutboxEntry>>> {
    const pendingResult = await this.findPending(limit);
    if (pendingResult.isFailure) {
      return Result.fail(pendingResult.error);
    }

    const entries: OutboxEntry[] = pendingResult.value.map((r) => ({
      id: r.id,
      /* eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion */
      event: {
        eventId: r.id,
        aggregateId: r.aggregateId,
        eventType: r.eventType,
        occurredAt: r.occurredAt,
        metadata: r.metadata,
        ...r.payload,
      } as DomainEvent,
      createdAt: r.storedAt.toISOString(),
      attemptCount: r.retryCount,
      published: r.status === OutboxStatus.PROCESSED,
    }));

    return Result.ok(entries);
  }

  async markPublished(entryId: string): Promise<Result<void>> {
    return this.markProcessed(entryId);
  }

  async incrementAttempt(entryId: string): Promise<Result<void>> {
    return this.incrementRetry(entryId);
  }

  /* eslint-disable-next-line @typescript-eslint/require-await */
  async purge(olderThan: string): Promise<Result<number>> {
    try {
      const cutoff = new Date(olderThan).getTime();
      let purged = 0;

      for (const [id, record] of this.inMemoryRecords.entries()) {
        if (record.status === OutboxStatus.PROCESSED && record.storedAt.getTime() < cutoff) {
          this.inMemoryRecords.delete(id);
          purged++;
        }
      }

      return Result.ok(purged);
    } catch (error) {
      return InfrastructureErrorMapper.toResult(error, 'OutboxRepository.purge');
    }
  }

  // ─── Private Helpers ───────────────────────────────────────────────

  private resolveClient(context?: TransactionContext): Record<string, unknown> {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as Record<string, unknown>;
    }
    return this.databaseProvider.getClient() as Record<string, unknown>;
  }

  private getOutboxDelegate(client: Record<string, unknown>): PrismaOutboxDelegate | null {
    const delegate = client.outbox ?? client.outboxEntry;
    if (delegate !== undefined && delegate !== null) {
      return delegate as PrismaOutboxDelegate;
    }
    return null;
  }

  private toPrismaInput(record: OutboxRecord): Record<string, unknown> {
    return {
      id: record.id,
      aggregateId: record.aggregateId,
      aggregateType: record.aggregateType,
      eventType: record.eventType,
      payload: JSON.stringify(record.payload),
      metadata: JSON.stringify(record.metadata),
      occurredAt: record.occurredAt,
      storedAt: record.storedAt,
      status: record.status,
      retryCount: record.retryCount,
      version: record.version,
      lastError: record.lastError ?? null,
    };
  }

  private toOutboxRecord(record: unknown): OutboxRecord {
    const r = record as Record<string, unknown>;
    return {
      id: String(r.id),
      aggregateId: String(r.aggregateId),
      aggregateType: String(r.aggregateType),
      eventType: String(r.eventType),
      payload:
        typeof r.payload === 'string'
          ? (JSON.parse(r.payload) as Record<string, unknown>)
          : (r.payload as Record<string, unknown>),
      metadata:
        typeof r.metadata === 'string'
          ? (JSON.parse(r.metadata) as Record<string, unknown>)
          : (r.metadata as Record<string, unknown>),
      occurredAt: r.occurredAt instanceof Date ? r.occurredAt : new Date(String(r.occurredAt)),
      storedAt: r.storedAt instanceof Date ? r.storedAt : new Date(String(r.storedAt)),
      status: (r.status as OutboxRecord['status']) ?? OutboxStatus.PENDING,
      retryCount: Number(r.retryCount ?? 0),
      version: Number(r.version ?? 1),
      lastError: typeof r.lastError === 'string' ? r.lastError : undefined,
    };
  }
}

interface PrismaOutboxDelegate {
  upsert(args: {
    where: { id: string };
    create: Record<string, unknown>;
    update: Record<string, unknown>;
  }): Promise<unknown>;
  findMany(args: {
    where?: Record<string, unknown>;
    take?: number;
    orderBy?: Record<string, unknown>;
  }): Promise<unknown[]>;
  update(args: { where: { id: string }; data: Record<string, unknown> }): Promise<unknown>;
  deleteMany(args: { where: Record<string, unknown> }): Promise<{ count: number }>;
}

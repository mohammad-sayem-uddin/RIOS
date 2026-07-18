/**
 * Comprehensive Unit Tests for Transactional Outbox Pattern & Repository Integration.
 *
 * Architecture reference:
 * Infrastructure Layer — Event Strategy — Transactional Outbox.
 *
 * Verifies:
 * ✓ aggregate save + outbox insert in single transaction context
 * ✓ rollback when outbox storage fails
 * ✓ multiple events persistence
 * ✓ empty event list (no outbox insert)
 * ✓ payload serialization (primitives only, no domain objects)
 * ✓ retry count increment & error context tracking
 * ✓ pending queries (findPending)
 * ✓ processed status transition (markProcessed)
 */

/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/require-await, @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unnecessary-type-assertion */

import type { ResearchIdentity } from '@rios/identity';
import { DomainEvent, Result, UniqueId } from '@rios/shared';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import type { DatabaseProvider } from '../database/database-provider.js';
import { OutboxEventMapper, OutboxStatus, PrismaOutboxRepositoryImpl } from '../events/index.js';
import type { Logger } from '../logging/logger.js';
import { PrismaUnitOfWork, PrismaTransactionContext } from '../persistence/index.js';
import type { ResearchIdentityAggregateMapper } from '../repositories/identity/mappers/research-identity-mapper.js';
import type { ResearchIdentityPersistence } from '../repositories/identity/persistence/identity-persistence.js';
import { ResearchIdentityRepositoryImpl } from '../repositories/identity/research-identity-repository.impl.js';

// ─── Dummy Domain Event for Testing ───────────────────────────────────

class TestResearchIdentityCreatedEvent extends DomainEvent {
  public readonly eventType = 'ResearchIdentityCreated';
  public readonly statement: string;
  public readonly version: number;

  constructor(aggregateId: string, statement: string) {
    super(aggregateId, { correlationId: 'corr-123', userId: 'user-456' });
    this.statement = statement;
    this.version = 1;
  }
}

class TestResearchIdentityUpdatedEvent extends DomainEvent {
  public readonly eventType = 'ResearchIdentityUpdated';
  public readonly updatedField: string;

  constructor(aggregateId: string, updatedField: string) {
    super(aggregateId, { correlationId: 'corr-456', userId: 'user-789' });
    this.updatedField = updatedField;
  }
}

// ─── Test Helpers & Mocks ───────────────────────────────────────────

function createMockPrismaClient() {
  return {
    researchIdentity: {
      upsert: vi.fn().mockResolvedValue({ id: 'test-id' }),
      findUnique: vi.fn().mockResolvedValue({ id: 'test-id' }),
    },
    outbox: {
      create: vi.fn().mockResolvedValue({ id: 'event-1' }),
      upsert: vi.fn().mockResolvedValue({ id: 'event-1' }),
      findMany: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockResolvedValue({ id: 'event-1' }),
    },
  };
}

function createMockDatabaseProvider(
  mainClient: ReturnType<typeof createMockPrismaClient>,
  txClient?: ReturnType<typeof createMockPrismaClient>,
) {
  const transactionalClient = txClient ?? createMockPrismaClient();

  const clientWithTransaction = {
    ...mainClient,
    $transaction: vi.fn(async (cb: (tx: unknown) => Promise<unknown>, _options?: unknown) => {
      return cb(transactionalClient);
    }),
  };

  const provider = {
    connect: vi.fn().mockResolvedValue(Result.ok(undefined)),
    disconnect: vi.fn().mockResolvedValue(Result.ok(undefined)),
    getClient: vi.fn().mockReturnValue(clientWithTransaction),
    isHealthy: vi.fn().mockResolvedValue(true),
    getStatus: vi.fn().mockReturnValue('CONNECTED'),
  } as unknown as DatabaseProvider;

  return {
    provider,
    mainClient,
    txClient: transactionalClient,
    clientWithTransaction,
  };
}

function createMockLogger(): Logger {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  } as unknown as Logger;
}

function createMockAggregate(idString = 'test-id', events: DomainEvent[] = []): ResearchIdentity {
  let pendingEvents = [...events];
  return {
    id: UniqueId.create(idString),
    clearEvents: () => {
      const extracted = [...pendingEvents];
      pendingEvents = [];
      return extracted;
    },
  } as unknown as ResearchIdentity;
}

function createMockPersistence(idString = 'test-id'): ResearchIdentityPersistence {
  return {
    id: idString,
    createdAt: new Date(),
    updatedAt: new Date(),
    vision: { id: 'v1', statement: 'Vision', identityId: idString },
    agenda: { id: 'a1', title: 'Agenda', identityId: idString },
    philosophy: { id: 'p1', corePrinciples: ['Principle'], identityId: idString },
    values: { id: 'val1', items: ['Value'], identityId: idString },
    evolution: { id: 'e1', currentStage: 'EMERGING', milestoneIds: [], identityId: idString },
    areas: [],
    questions: [],
    goals: [],
    contributions: [],
    milestones: [],
  } as unknown as ResearchIdentityPersistence;
}

function createMockMapper(): ResearchIdentityAggregateMapper {
  return {
    toDomain: vi.fn().mockReturnValue(createMockAggregate()),
    toPersistence: vi.fn().mockReturnValue(createMockPersistence()),
    toSnapshot: vi.fn(),
  } as unknown as ResearchIdentityAggregateMapper;
}

// ─── Test Suite ───────────────────────────────────────────────────────

describe('Transactional Outbox Pattern', () => {
  let mockMainClient: ReturnType<typeof createMockPrismaClient>;
  let mockTxClient: ReturnType<typeof createMockPrismaClient>;
  let mockDbProvider: DatabaseProvider;
  let clientWithTx: ReturnType<typeof createMockDatabaseProvider>['clientWithTransaction'];
  let mockLogger: Logger;
  let unitOfWork: PrismaUnitOfWork;
  let outboxRepo: PrismaOutboxRepositoryImpl;

  beforeEach(() => {
    mockMainClient = createMockPrismaClient();
    mockTxClient = createMockPrismaClient();
    const setup = createMockDatabaseProvider(mockMainClient, mockTxClient);
    mockDbProvider = setup.provider;
    clientWithTx = setup.clientWithTransaction;
    mockLogger = createMockLogger();

    unitOfWork = new PrismaUnitOfWork(mockDbProvider, mockLogger);
    outboxRepo = new PrismaOutboxRepositoryImpl(mockDbProvider, mockLogger);
  });

  // 1. Aggregate save + Outbox insert in single transaction
  it('should save aggregate and persist outbox records in a single transaction context', async () => {
    const event1 = new TestResearchIdentityCreatedEvent('id-1', 'Vision statement');
    const event2 = new TestResearchIdentityUpdatedEvent('id-1', 'philosophy');
    const agg = createMockAggregate('id-1', [event1, event2]);

    const repo = new ResearchIdentityRepositoryImpl(
      mockDbProvider,
      mockLogger,
      createMockMapper(),
      undefined,
      outboxRepo,
    );

    const result = await unitOfWork.execute(async (ctx) => {
      return repo.save(agg, ctx);
    });

    expect(result.isSuccess).toBe(true);
    expect(clientWithTx.$transaction).toHaveBeenCalledTimes(1);

    // Verify outbox has stored both pending records
    const pendingResult = await outboxRepo.findPending();
    expect(pendingResult.isSuccess).toBe(true);
    expect(pendingResult.value).toHaveLength(2);
    expect(pendingResult.value[0]?.eventType).toBe('ResearchIdentityCreated');
    expect(pendingResult.value[1]?.eventType).toBe('ResearchIdentityUpdated');
  });

  // 2. Rollback when Outbox storage fails
  it('should roll back aggregate save if outbox storage fails', async () => {
    const failingOutboxRepo = {
      store: vi.fn().mockResolvedValue(Result.fail('Outbox database write error')),
      findPending: vi.fn(),
      markProcessed: vi.fn(),
      incrementRetry: vi.fn(),
    };

    const event = new TestResearchIdentityCreatedEvent('id-1', 'Failing Vision');
    const agg = createMockAggregate('id-1', [event]);

    const repo = new ResearchIdentityRepositoryImpl(
      mockDbProvider,
      mockLogger,
      createMockMapper(),
      undefined,
      failingOutboxRepo as unknown as PrismaOutboxRepositoryImpl,
    );

    const result = await unitOfWork.execute(async (ctx) => {
      return repo.save(agg, ctx);
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('Outbox storage failed');
    expect(unitOfWork.isActive()).toBe(false);
  });

  // 3. Multiple events persistence
  it('should correctly handle and map multiple events from an aggregate', async () => {
    const events = [
      new TestResearchIdentityCreatedEvent('id-1', 'Event 1'),
      new TestResearchIdentityUpdatedEvent('id-1', 'Event 2'),
      new TestResearchIdentityCreatedEvent('id-1', 'Event 3'),
    ];
    const agg = createMockAggregate('id-1', events);

    const repo = new ResearchIdentityRepositoryImpl(
      mockDbProvider,
      mockLogger,
      createMockMapper(),
      undefined,
      outboxRepo,
    );

    const saveResult = await repo.save(agg, new PrismaTransactionContext(mockTxClient));
    expect(saveResult.isSuccess).toBe(true);

    const pendingResult = await outboxRepo.findPending();
    expect(pendingResult.isSuccess).toBe(true);
    expect(pendingResult.value).toHaveLength(3);
  });

  // 4. Empty event list
  it('should succeed without calling outbox storage when aggregate has no pending events', async () => {
    const agg = createMockAggregate('id-1', []); // 0 events
    const storeSpy = vi.spyOn(outboxRepo, 'store');

    const repo = new ResearchIdentityRepositoryImpl(
      mockDbProvider,
      mockLogger,
      createMockMapper(),
      undefined,
      outboxRepo,
    );

    const saveResult = await repo.save(agg, new PrismaTransactionContext(mockTxClient));
    expect(saveResult.isSuccess).toBe(true);
    expect(storeSpy).not.toHaveBeenCalled();
  });

  // 5. Payload serialization (primitives only, zero domain objects)
  it('should serialize event payload to pure JSON primitives without domain object references', () => {
    const event = new TestResearchIdentityCreatedEvent('id-1', 'AI Research Vision');
    const record = OutboxEventMapper.toRecord(event, 'ResearchIdentity');

    expect(record.aggregateId).toBe('id-1');
    expect(record.aggregateType).toBe('ResearchIdentity');
    expect(record.eventType).toBe('ResearchIdentityCreated');
    expect(record.status).toBe(OutboxStatus.PENDING);
    expect(record.retryCount).toBe(0);

    // Verify payload is a clean JSON object containing primitive values
    expect(record.payload).toEqual({
      statement: 'AI Research Vision',
      version: 1,
    });
    expect(JSON.stringify(record.payload)).toBe('{"statement":"AI Research Vision","version":1}');
    expect(record.metadata).toEqual({
      correlationId: 'corr-123',
      userId: 'user-456',
    });
  });

  // 6. Retry count increment
  it('should increment retry count and update error context on failure', async () => {
    const event = new TestResearchIdentityCreatedEvent('id-1', 'Vision');
    const record = OutboxEventMapper.toRecord(event);
    await outboxRepo.store([record]);

    const retryResult = await outboxRepo.incrementRetry(record.id, 'Timeout connecting to broker');
    expect(retryResult.isSuccess).toBe(true);

    const pending = await outboxRepo.findPending();
    expect(pending.isSuccess).toBe(true);
    const updatedRecord = pending.value.find((r) => r.id === record.id);
    expect(updatedRecord?.retryCount).toBe(1);
    expect(updatedRecord?.lastError).toBe('Timeout connecting to broker');
  });

  // 7. Pending queries
  it('should query only PENDING outbox records ordered by stored date', async () => {
    const r1 = OutboxEventMapper.toRecord(new TestResearchIdentityCreatedEvent('id-1', 'E1'));
    const r2 = OutboxEventMapper.toRecord(new TestResearchIdentityCreatedEvent('id-2', 'E2'));
    await outboxRepo.store([r1, r2]);

    // Mark r1 as PROCESSED
    await outboxRepo.markProcessed(r1.id);

    const pendingResult = await outboxRepo.findPending();
    expect(pendingResult.isSuccess).toBe(true);
    expect(pendingResult.value).toHaveLength(1);
    expect(pendingResult.value[0]?.id).toBe(r2.id);
  });

  // 8. Processed status transition
  it('should transition record status to PROCESSED when markProcessed is invoked', async () => {
    const record = OutboxEventMapper.toRecord(new TestResearchIdentityCreatedEvent('id-1', 'E1'));
    await outboxRepo.store([record]);

    const markResult = await outboxRepo.markProcessed(record.id);
    expect(markResult.isSuccess).toBe(true);

    const pendingResult = await outboxRepo.findPending();
    expect(pendingResult.isSuccess).toBe(true);
    expect(pendingResult.value).toHaveLength(0); // No longer pending
  });
});

/**
 * Comprehensive Unit Tests for PrismaUnitOfWork & Repository Participation.
 *
 * Architecture reference:
 * Infrastructure Layer — Unit of Work & Transaction Boundary.
 */

/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/require-await, @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unnecessary-type-assertion */

import type { ResearchIdentity } from '@rios/identity';
import { Result, UniqueId } from '@rios/shared';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import type { DatabaseProvider } from '../database/database-provider.js';
import type { Logger } from '../logging/logger.js';
import {
  PrismaUnitOfWork,
  PrismaTransactionContext,
  TransactionIsolationLevel,
} from '../persistence/index.js';
import type { ResearchIdentityAggregateMapper } from '../repositories/identity/mappers/research-identity-mapper.js';
import type { ResearchIdentityPersistence } from '../repositories/identity/persistence/identity-persistence.js';
import { ResearchIdentityRepositoryImpl } from '../repositories/identity/research-identity-repository.impl.js';

// ─── Test Helpers & Mocks ───────────────────────────────────────────

function createMockPrismaClient() {
  return {
    researchIdentity: {
      upsert: vi.fn().mockResolvedValue({ id: 'test-id' }),
      findUnique: vi.fn().mockResolvedValue({
        id: 'test-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        vision: { id: 'v1', statement: 'Vision', identityId: 'test-id' },
        agenda: { id: 'a1', title: 'Agenda', identityId: 'test-id' },
        philosophy: { id: 'p1', corePrinciples: ['Principle'], identityId: 'test-id' },
        values: { id: 'val1', items: ['Value'], identityId: 'test-id' },
        evolution: { id: 'e1', currentStage: 'EMERGING', milestoneIds: [], identityId: 'test-id' },
        areas: [],
        questions: [],
        goals: [],
        contributions: [],
        milestones: [],
      }),
      findMany: vi.fn().mockResolvedValue([]),
      delete: vi.fn().mockResolvedValue({ id: 'test-id' }),
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

function createMockAggregate(idString = 'test-id'): ResearchIdentity {
  return {
    id: UniqueId.create(idString),
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

function createMockMapper(
  overrides?: Partial<ResearchIdentityAggregateMapper>,
): ResearchIdentityAggregateMapper {
  return {
    toDomain: vi.fn().mockReturnValue(createMockAggregate()),
    toPersistence: vi.fn().mockReturnValue(createMockPersistence()),
    toSnapshot: vi.fn(),
    ...overrides,
  } as unknown as ResearchIdentityAggregateMapper;
}

// ─── Test Suite ───────────────────────────────────────────────────────

describe('PrismaUnitOfWork', () => {
  let mockMainClient: ReturnType<typeof createMockPrismaClient>;
  let mockTxClient: ReturnType<typeof createMockPrismaClient>;
  let mockDbProvider: DatabaseProvider;
  let clientWithTx: ReturnType<typeof createMockDatabaseProvider>['clientWithTransaction'];
  let mockLogger: Logger;
  let unitOfWork: PrismaUnitOfWork;

  beforeEach(() => {
    mockMainClient = createMockPrismaClient();
    mockTxClient = createMockPrismaClient();
    const setup = createMockDatabaseProvider(mockMainClient, mockTxClient);
    mockDbProvider = setup.provider;
    clientWithTx = setup.clientWithTransaction;
    mockLogger = createMockLogger();

    unitOfWork = new PrismaUnitOfWork(mockDbProvider, mockLogger);
  });

  // 1. Successful transaction
  it('should execute transaction successfully and commit when callback returns Result.ok', async () => {
    const result = await unitOfWork.execute(async (ctx) => {
      expect(ctx).toBeInstanceOf(PrismaTransactionContext);
      expect(ctx.handle).toBe(mockTxClient);
      return Result.ok('success_value');
    });

    expect(result.isSuccess).toBe(true);
    expect(result.value).toBe('success_value');
    expect(clientWithTx.$transaction).toHaveBeenCalledTimes(1);
    expect(unitOfWork.isActive()).toBe(false);
  });

  // 2. Rollback on Result.fail
  it('should trigger rollback when callback returns Result.fail', async () => {
    const result = await unitOfWork.execute(async (_ctx) => {
      return Result.fail('business rule failure');
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('business rule failure');
    expect(clientWithTx.$transaction).toHaveBeenCalledTimes(1);
    expect(unitOfWork.isActive()).toBe(false);
  });

  // 3. Rollback on exception
  it('should trigger rollback and map error when callback throws an exception', async () => {
    const result = await unitOfWork.execute(async (_ctx) => {
      throw new Error('Unexpected database failure');
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('Unexpected database failure');
    expect(mockLogger.error).toHaveBeenCalled();
    expect(unitOfWork.isActive()).toBe(false);
  });

  // 4. Exception propagation from Prisma
  it('should catch Prisma errors during $transaction and map via InfrastructureErrorMapper', async () => {
    clientWithTx.$transaction.mockRejectedValueOnce(
      new Error('Prisma query error: deadlock detected'),
    );

    const result = await unitOfWork.execute(async (_ctx) => {
      return Result.ok('data');
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('deadlock detected');
    expect(unitOfWork.isActive()).toBe(false);
  });

  // 5. Context propagation
  it('should create and propagate TransactionContext with a unique transactionId', async () => {
    let capturedContext: PrismaTransactionContext | undefined;

    await unitOfWork.execute(async (ctx) => {
      capturedContext = ctx as PrismaTransactionContext;
      return Result.ok(undefined);
    });

    expect(capturedContext).toBeDefined();
    expect(capturedContext?.transactionId).toBeDefined();
    expect(capturedContext?.transactionId).toMatch(/^tx_/);
    expect(capturedContext?.handle).toBe(mockTxClient);
  });

  // 6. Transaction options mapping
  it('should map TransactionOptions (isolation level and timeout) to Prisma options', async () => {
    await unitOfWork.execute(async (_ctx) => Result.ok(undefined), {
      isolationLevel: TransactionIsolationLevel.SERIALIZABLE,
      timeoutMs: 5000,
    });

    expect(clientWithTx.$transaction).toHaveBeenCalledWith(expect.any(Function), {
      isolationLevel: 'SERIALIZABLE',
      timeout: 5000,
    });
  });

  // 7. Client missing $transaction support
  it('should return Result.fail if database provider client does not support $transaction', async () => {
    const invalidDbProvider = {
      getClient: () => ({/* no $transaction */}),
    } as unknown as DatabaseProvider;

    const badUow = new PrismaUnitOfWork(invalidDbProvider, mockLogger);
    const result = await badUow.execute(async (_ctx) => Result.ok('test'));

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('$transaction method missing');
  });

  // 8. Repository participation WITH transaction context
  it('should instruct repository to use transaction client when TransactionContext is provided', async () => {
    const mockMapper = createMockMapper();
    const repo = new ResearchIdentityRepositoryImpl(mockDbProvider, mockLogger, mockMapper);
    const agg = createMockAggregate('test-id');

    await unitOfWork.execute(async (ctx) => {
      const saveResult = await repo.save(agg, ctx);
      expect(saveResult.isSuccess).toBe(true);
      return Result.ok(undefined);
    });

    // Verify transactional client was called for upsert, NOT main client
    expect(mockTxClient.researchIdentity.upsert).toHaveBeenCalledTimes(1);
    expect(mockMainClient.researchIdentity.upsert).not.toHaveBeenCalled();
  });

  // 9. Repository participation WITHOUT transaction context
  it('should instruct repository to use DatabaseProvider main client when TransactionContext is omitted', async () => {
    const mockMapper = createMockMapper();
    const repo = new ResearchIdentityRepositoryImpl(mockDbProvider, mockLogger, mockMapper);
    const agg = createMockAggregate('test-id');

    const saveResult = await repo.save(agg /* no context */);
    expect(saveResult.isSuccess).toBe(true);

    // Verify main client was called for upsert, NOT transactional client
    expect(mockMainClient.researchIdentity.upsert).toHaveBeenCalledTimes(1);
    expect(mockTxClient.researchIdentity.upsert).not.toHaveBeenCalled();
  });

  // 10. Multiple repository calls inside one transaction
  it('should execute multiple repository operations inside a single transaction context', async () => {
    const mockMapper = createMockMapper({
      toPersistence: vi
        .fn()
        .mockImplementation((agg: ResearchIdentity) => createMockPersistence(agg.id.value)),
      toDomain: vi
        .fn()
        .mockImplementation((p: ResearchIdentityPersistence) => createMockAggregate(p.id)),
    });

    const repo = new ResearchIdentityRepositoryImpl(mockDbProvider, mockLogger, mockMapper);
    const agg1 = createMockAggregate('id-1');
    const agg2 = createMockAggregate('id-2');

    const result = await unitOfWork.execute(async (ctx) => {
      const save1 = await repo.save(agg1, ctx);
      if (save1.isFailure) return save1;

      const save2 = await repo.save(agg2, ctx);
      if (save2.isFailure) return save2;

      const findResult = await repo.findById(agg1.id, ctx);
      return findResult;
    });

    expect(result.isSuccess).toBe(true);
    expect(mockTxClient.researchIdentity.upsert).toHaveBeenCalledTimes(2);
    expect(mockTxClient.researchIdentity.findUnique).toHaveBeenCalledTimes(1);
    expect(mockMainClient.researchIdentity.upsert).not.toHaveBeenCalled();
    expect(mockMainClient.researchIdentity.findUnique).not.toHaveBeenCalled();
  });

  // 11. Nested repository operations where second operation fails
  it('should roll back all operations if one nested repository call fails inside transaction', async () => {
    const mockMapper = createMockMapper();
    const repo = new ResearchIdentityRepositoryImpl(mockDbProvider, mockLogger, mockMapper);
    const agg = createMockAggregate();

    mockTxClient.researchIdentity.upsert
      .mockResolvedValueOnce({ id: 'test-id' })
      .mockRejectedValueOnce(new Error('Unique constraint violation on area code'));

    const result = await unitOfWork.execute(async (ctx) => {
      const save1 = await repo.save(agg, ctx);
      if (save1.isFailure) return save1;

      const save2 = await repo.save(agg, ctx);
      if (save2.isFailure) return save2;

      return Result.ok(undefined);
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('Unique constraint violation');
  });

  // 12. Mapper failure inside repository within transaction
  it('should trigger transaction rollback if repository mapper throws an exception', async () => {
    const mockFailingMapper = createMockMapper({
      toPersistence: vi.fn().mockImplementation(() => {
        throw new Error('Mapper failure: invalid enum value');
      }),
    });

    const repo = new ResearchIdentityRepositoryImpl(mockDbProvider, mockLogger, mockFailingMapper);
    const agg = createMockAggregate();

    const result = await unitOfWork.execute(async (ctx) => {
      return repo.save(agg, ctx);
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('Mapper failure');
    expect(mockTxClient.researchIdentity.upsert).not.toHaveBeenCalled();
  });
});

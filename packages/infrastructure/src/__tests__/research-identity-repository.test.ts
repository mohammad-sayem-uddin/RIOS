/**
 * ResearchIdentityRepositoryImpl — Unit Tests.
 *
 * Tests the repository implementation with mocked database, mapper,
 * specification translator, error mapper, and logger dependencies.
 *
 * Coverage:
 * - save: success, failure, mapping, error handling
 * - findById: found, not found, error
 * - findAll: success, empty, error
 * - findMatching: specification translation, in-memory filtering, error
 * - exists: true, false, error
 * - delete: success, not found, error
 * - Transaction context support
 * - Result<T> contract compliance
 */

import type { ResearchIdentity } from '@rios/identity';
import { UniqueId } from '@rios/shared';
/* eslint-disable @typescript-eslint/unbound-method -- Standard false positive with mock method assertions in tests */
import { describe, it, expect, beforeEach, vi } from 'vitest';

import type { DatabaseProvider } from '../database/database-provider.js';
import type { Logger } from '../logging/logger.js';
import type { ResearchIdentityAggregateMapper } from '../repositories/identity/mappers/research-identity-mapper.js';
import type { ResearchIdentityPersistence } from '../repositories/identity/persistence/identity-persistence.js';
import { ResearchIdentityRepositoryImpl } from '../repositories/identity/research-identity-repository.impl.js';
import type { ResearchIdentitySpecificationTranslator } from '../repositories/identity/specification/identity-specification-translator.js';

// ─── Mock Factories ─────────────────────────────────────────────────────

function createMockDatabaseProvider(): DatabaseProvider {
  return {
    getClient: vi.fn().mockReturnValue({
      researchIdentity: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        upsert: vi.fn(),
        delete: vi.fn(),
      },
    }),
    isHealthy: vi.fn().mockResolvedValue(true),
    shutdown: vi.fn().mockResolvedValue(undefined),
  } as unknown as DatabaseProvider;
}

function createMockLogger(): Logger {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    child: vi.fn().mockReturnThis(),
  } as unknown as Logger;
}

function createMockMapper(): ResearchIdentityAggregateMapper {
  return {
    toDomain: vi.fn(),
    toPersistence: vi.fn(),
    toSnapshot: vi.fn(),
  } as unknown as ResearchIdentityAggregateMapper;
}

function createMockTranslator(): ResearchIdentitySpecificationTranslator {
  return {
    translate: vi.fn().mockReturnValue({
      where: {},
      include: {},
      orderBy: { createdAt: 'desc' },
    }),
    getFullAggregateInclude: vi.fn().mockReturnValue({
      vision: true,
      agenda: true,
      philosophy: true,
      values: true,
      evolution: true,
      areas: true,
      questions: true,
      goals: true,
      contributions: true,
      milestones: true,
    }),
  } as unknown as ResearchIdentitySpecificationTranslator;
}

function createMockAggregate(id: string): ResearchIdentity {
  return {
    id: UniqueId.from(id).value,
    toSnapshot: vi.fn().mockReturnValue({
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  } as unknown as ResearchIdentity;
}

function createMockPersistence(id: string): ResearchIdentityPersistence {
  const now = new Date().toISOString();
  return {
    id,
    createdAt: now,
    updatedAt: now,
    vision: {
      id: `${id}-vision`,
      visionStatement: 'Test vision',
      timeHorizon: '5 years',
      lastRefinedAt: now,
      createdAt: now,
    },
    agenda: {
      id: `${id}-agenda`,
      focus: 'Test focus',
      status: 'Active',
      areaIds: [],
      themes: ['AI', 'ML'],
      createdAt: now,
      updatedAt: now,
    },
    philosophy: {
      id: `${id}-philosophy`,
      statement: 'Test philosophy',
      principles: ['principle-1'],
      createdAt: now,
      updatedAt: now,
    },
    values: {
      id: `${id}-values`,
      statement: 'Test values',
      values: ['integrity', 'innovation'],
      createdAt: now,
      updatedAt: now,
    },
    evolution: {
      id: `${id}-evolution`,
      description: 'Test evolution',
      status: 'active',
      confidence: 0.8,
      milestoneIds: [],
      recordedAt: now,
      createdAt: now,
    },
    areas: [],
    questions: [],
    goals: [],
    contributions: [],
    milestones: [],
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createMockSpecification() {
  return {
    isSatisfiedBy: vi.fn().mockReturnValue(true),
    and: vi.fn(),
    or: vi.fn(),
    not: vi.fn(),
  };
}

// ─── Tests ──────────────────────────────────────────────────────────────

describe('ResearchIdentityRepositoryImpl', () => {
  let repository: ResearchIdentityRepositoryImpl;
  let mockDbProvider: DatabaseProvider;
  let mockLogger: Logger;
  let mockMapper: ResearchIdentityAggregateMapper;
  let mockTranslator: ResearchIdentitySpecificationTranslator;

  beforeEach(() => {
    mockDbProvider = createMockDatabaseProvider();
    mockLogger = createMockLogger();
    mockMapper = createMockMapper();
    mockTranslator = createMockTranslator();

    repository = new ResearchIdentityRepositoryImpl(
      mockDbProvider,
      mockLogger,
      mockMapper,
      mockTranslator,
    );
  });

  // ─── save() ─────────────────────────────────────────────────────────

  describe('save', () => {
    it('should save a new aggregate successfully', async () => {
      const aggregate = createMockAggregate('test-id-1');
      const persistence = createMockPersistence('test-id-1');

      (mockMapper.toPersistence as ReturnType<typeof vi.fn>).mockReturnValue(persistence);

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.upsert.mockResolvedValue({});

      const result = await repository.save(aggregate);

      expect(result.isSuccess).toBe(true);
      expect(mockMapper.toPersistence).toHaveBeenCalledWith(aggregate);
      expect(mockClient.researchIdentity.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'test-id-1' },
        }),
      );
    });

    it('should use transaction context when provided', async () => {
      const aggregate = createMockAggregate('test-id-1');
      const persistence = createMockPersistence('test-id-1');
      const mockTxClient = {
        researchIdentity: {
          findUnique: vi.fn(),
          findMany: vi.fn(),
          upsert: vi.fn().mockResolvedValue({}),
          delete: vi.fn(),
        },
      };
      const context = { transactionId: 'tx-1', handle: mockTxClient };

      (mockMapper.toPersistence as ReturnType<typeof vi.fn>).mockReturnValue(persistence);

      const result = await repository.save(aggregate, context);

      expect(result.isSuccess).toBe(true);
      expect(mockTxClient.researchIdentity.upsert).toHaveBeenCalled();
      expect(mockDbProvider.getClient).not.toHaveBeenCalled();
    });

    it('should return Result.fail on database error', async () => {
      const aggregate = createMockAggregate('test-id-1');
      const persistence = createMockPersistence('test-id-1');
      const dbError = new Error('Unique constraint violation');

      (mockMapper.toPersistence as ReturnType<typeof vi.fn>).mockReturnValue(persistence);

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.upsert.mockRejectedValue(dbError);

      const result = await repository.save(aggregate);

      expect(result.isFailure).toBe(true);
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should map aggregate to persistence before saving', async () => {
      const aggregate = createMockAggregate('test-id-1');
      const persistence = createMockPersistence('test-id-1');

      (mockMapper.toPersistence as ReturnType<typeof vi.fn>).mockReturnValue(persistence);

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.upsert.mockResolvedValue({});

      await repository.save(aggregate);

      expect(mockMapper.toPersistence).toHaveBeenCalledWith(aggregate);
      expect(mockClient.researchIdentity.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'test-id-1' },
        }),
      );
    });
  });

  // ─── findById() ─────────────────────────────────────────────────────

  describe('findById', () => {
    it('should return an aggregate when found', async () => {
      const id = UniqueId.from('test-id-1');
      const persistence = createMockPersistence('test-id-1');
      const aggregate = createMockAggregate('test-id-1');

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.findUnique.mockResolvedValue(persistence);
      (mockMapper.toDomain as ReturnType<typeof vi.fn>).mockReturnValue(aggregate);

      const result = await repository.findById(id);

      expect(result.isSuccess).toBe(true);
      expect(result.value).toBe(aggregate);
      expect(mockMapper.toDomain).toHaveBeenCalledWith(persistence);
    });

    it('should return Result.fail when not found', async () => {
      const id = UniqueId.from('nonexistent-id');

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.findUnique.mockResolvedValue(null);

      const result = await repository.findById(id);

      expect(result.isFailure).toBe(true);
    });

    it('should return Result.fail on database error', async () => {
      const id = UniqueId.from('test-id-1');
      const dbError = new Error('Connection lost');

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.findUnique.mockRejectedValue(dbError);

      const result = await repository.findById(id);

      expect(result.isFailure).toBe(true);
    });
  });

  // ─── findAll() ──────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should return all aggregates', async () => {
      const persistence1 = createMockPersistence('id-1');
      const persistence2 = createMockPersistence('id-2');
      const aggregate1 = createMockAggregate('id-1');
      const aggregate2 = createMockAggregate('id-2');

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.findMany.mockResolvedValue([persistence1, persistence2]);
      (mockMapper.toDomain as ReturnType<typeof vi.fn>)
        .mockReturnValueOnce(aggregate1)
        .mockReturnValueOnce(aggregate2);

      const result = await repository.findAll();

      expect(result.isSuccess).toBe(true);
      expect(result.value).toHaveLength(2);
      expect(result.value[0]).toBe(aggregate1);
      expect(result.value[1]).toBe(aggregate2);
    });

    it('should return empty array when no records exist', async () => {
      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.findMany.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result.isSuccess).toBe(true);
      expect(result.value).toHaveLength(0);
    });

    it('should return Result.fail on database error', async () => {
      const dbError = new Error('Table not found');

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.findMany.mockRejectedValue(dbError);

      const result = await repository.findAll();

      expect(result.isFailure).toBe(true);
    });
  });

  // ─── findMatching() ─────────────────────────────────────────────────

  describe('findMatching', () => {
    it('should translate specification and return matching aggregates', async () => {
      const spec = createMockSpecification();
      const persistence1 = createMockPersistence('id-1');
      const aggregate1 = createMockAggregate('id-1');

      (mockTranslator.translate as ReturnType<typeof vi.fn>).mockReturnValue({
        where: { areas: { some: { name: 'AI' } } },
        include: {},
        orderBy: {},
      });

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.findMany.mockResolvedValue([persistence1]);
      (mockMapper.toDomain as ReturnType<typeof vi.fn>).mockReturnValue(aggregate1);

      const result = await repository.findMatching(spec);

      expect(result.isSuccess).toBe(true);
      expect(result.value).toHaveLength(1);
      expect(mockTranslator.translate).toHaveBeenCalledWith(spec);
      expect(spec.isSatisfiedBy).toHaveBeenCalledWith(aggregate1);
    });

    it('should filter out aggregates that do not satisfy specification in-memory', async () => {
      const spec = createMockSpecification();
      const persistence1 = createMockPersistence('id-1');
      const persistence2 = createMockPersistence('id-2');
      const aggregate1 = createMockAggregate('id-1');
      const aggregate2 = createMockAggregate('id-2');

      spec.isSatisfiedBy.mockReturnValueOnce(true).mockReturnValueOnce(false);

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.findMany.mockResolvedValue([persistence1, persistence2]);
      (mockMapper.toDomain as ReturnType<typeof vi.fn>)
        .mockReturnValueOnce(aggregate1)
        .mockReturnValueOnce(aggregate2);

      const result = await repository.findMatching(spec);

      expect(result.isSuccess).toBe(true);
      expect(result.value).toHaveLength(1);
      expect(result.value[0]).toBe(aggregate1);
    });

    it('should return Result.fail on database error', async () => {
      const spec = createMockSpecification();
      const dbError = new Error('Query timeout');

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.findMany.mockRejectedValue(dbError);

      const result = await repository.findMatching(spec);

      expect(result.isFailure).toBe(true);
    });
  });

  // ─── exists() ───────────────────────────────────────────────────────

  describe('exists', () => {
    it('should return true when aggregate exists', async () => {
      const id = UniqueId.from('test-id-1');

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.findUnique.mockResolvedValue({ id: 'test-id-1' });

      const result = await repository.exists(id);

      expect(result.isSuccess).toBe(true);
      expect(result.value).toBe(true);
    });

    it('should return false when aggregate does not exist', async () => {
      const id = UniqueId.from('nonexistent-id');

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.findUnique.mockResolvedValue(null);

      const result = await repository.exists(id);

      expect(result.isSuccess).toBe(true);
      expect(result.value).toBe(false);
    });

    it('should return Result.fail on database error', async () => {
      const id = UniqueId.from('test-id-1');
      const dbError = new Error('Connection lost');

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.findUnique.mockRejectedValue(dbError);

      const result = await repository.exists(id);

      expect(result.isFailure).toBe(true);
    });
  });

  // ─── delete() ──────────────────────────────────────────────────────

  describe('delete', () => {
    it('should delete aggregate successfully', async () => {
      const id = UniqueId.from('test-id-1');

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.findUnique.mockResolvedValue({ id: 'test-id-1' });
      mockClient.researchIdentity.delete.mockResolvedValue({});

      const result = await repository.delete(id);

      expect(result.isSuccess).toBe(true);
      expect(mockClient.researchIdentity.delete).toHaveBeenCalledWith({
        where: { id: 'test-id-1' },
      });
    });

    it('should return Result.fail when aggregate not found', async () => {
      const id = UniqueId.from('nonexistent-id');

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.findUnique.mockResolvedValue(null);

      const result = await repository.delete(id);

      expect(result.isFailure).toBe(true);
      expect(mockClient.researchIdentity.delete).not.toHaveBeenCalled();
    });

    it('should return Result.fail on database error', async () => {
      const id = UniqueId.from('test-id-1');
      const dbError = new Error('FK constraint violation');

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.findUnique.mockResolvedValue({ id: 'test-id-1' });
      mockClient.researchIdentity.delete.mockRejectedValue(dbError);

      const result = await repository.delete(id);

      expect(result.isFailure).toBe(true);
    });
  });

  // ─── InfrastructureRepository contract ──────────────────────────────

  describe('healthCheck', () => {
    it('should delegate to database provider', async () => {
      const result = await repository.healthCheck();

      expect(result.isHealthy).toBe(true);
      expect(result.latencyMs).toBe(0);
      expect(result.message).toBe('Database connection healthy');
      expect(mockDbProvider.isHealthy).toHaveBeenCalled();
    });
  });

  // ─── Result<T> behavior ─────────────────────────────────────────────

  describe('Result<T> contract', () => {
    it('save returns Result.ok on success', async () => {
      const aggregate = createMockAggregate('test-id-1');
      const persistence = createMockPersistence('test-id-1');

      (mockMapper.toPersistence as ReturnType<typeof vi.fn>).mockReturnValue(persistence);

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.upsert.mockResolvedValue({});

      const result = await repository.save(aggregate);

      expect(result).toHaveProperty('isSuccess', true);
      expect(result).toHaveProperty('isFailure', false);
      expect(result).toHaveProperty('value');
    });

    it('findById returns Result.fail on error, never throws', async () => {
      const id = UniqueId.from('test-id-1');
      const dbError = new Error('Connection lost');

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.findUnique.mockRejectedValue(dbError);

      const result = await repository.findById(id);

      expect(result).toHaveProperty('isSuccess', false);
      expect(result).toHaveProperty('isFailure', true);
      expect(result).toHaveProperty('error');
    });

    it('findAll returns Result.fail on error, never throws', async () => {
      const dbError = new Error('Table missing');

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.findMany.mockRejectedValue(dbError);

      const result = await repository.findAll();

      expect(result).toHaveProperty('isSuccess', false);
      expect(result).toHaveProperty('isFailure', true);
    });

    it('findMatching returns Result.fail on error, never throws', async () => {
      const spec = createMockSpecification();
      const dbError = new Error('Query failed');

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.findMany.mockRejectedValue(dbError);

      const result = await repository.findMatching(spec);

      expect(result).toHaveProperty('isSuccess', false);
      expect(result).toHaveProperty('isFailure', true);
    });

    it('exists returns Result.fail on error, never throws', async () => {
      const id = UniqueId.from('test-id-1');
      const dbError = new Error('Network error');

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.findUnique.mockRejectedValue(dbError);

      const result = await repository.exists(id);

      expect(result).toHaveProperty('isSuccess', false);
      expect(result).toHaveProperty('isFailure', true);
    });

    it('delete returns Result.fail on error, never throws', async () => {
      const id = UniqueId.from('test-id-1');
      const dbError = new Error('Timeout');

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.findUnique.mockResolvedValue({ id: 'test-id-1' });
      mockClient.researchIdentity.delete.mockRejectedValue(dbError);

      const result = await repository.delete(id);

      expect(result).toHaveProperty('isSuccess', false);
      expect(result).toHaveProperty('isFailure', true);
    });
  });

  // ─── Error mapping ──────────────────────────────────────────────────

  describe('Error mapping', () => {
    it('should catch Prisma errors and return Result.fail', async () => {
      const aggregate = createMockAggregate('test-id-1');
      const persistence = createMockPersistence('test-id-1');
      const prismaError = new Error('P2002: Unique constraint failed');

      (mockMapper.toPersistence as ReturnType<typeof vi.fn>).mockReturnValue(persistence);

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.upsert.mockRejectedValue(prismaError);

      const result = await repository.save(aggregate);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('P2002');
    });

    it('should log errors with structured context', async () => {
      const aggregate = createMockAggregate('test-id-1');
      const persistence = createMockPersistence('test-id-1');
      const dbError = new Error('Database error');

      (mockMapper.toPersistence as ReturnType<typeof vi.fn>).mockReturnValue(persistence);

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.upsert.mockRejectedValue(dbError);

      await repository.save(aggregate);

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to save ResearchIdentity',
        expect.objectContaining({ error: expect.anything() as unknown }),
      );
    });
  });

  // ─── Transaction support ────────────────────────────────────────────

  describe('Transaction support', () => {
    it('should use transaction client when context is provided for findById', async () => {
      const id = UniqueId.from('test-id-1');
      const persistence = createMockPersistence('test-id-1');
      const aggregate = createMockAggregate('test-id-1');
      const mockTxClient = {
        researchIdentity: {
          findUnique: vi.fn().mockResolvedValue(persistence),
          findMany: vi.fn(),
          upsert: vi.fn(),
          delete: vi.fn(),
        },
      };
      const context = { transactionId: 'tx-findById', handle: mockTxClient };

      (mockMapper.toDomain as ReturnType<typeof vi.fn>).mockReturnValue(aggregate);

      const result = await repository.findById(id, context);

      expect(result.isSuccess).toBe(true);
      expect(mockTxClient.researchIdentity.findUnique).toHaveBeenCalled();
      expect(mockDbProvider.getClient).not.toHaveBeenCalled();
    });

    it('should use transaction client when context is provided for findAll', async () => {
      const mockTxClient = {
        researchIdentity: {
          findUnique: vi.fn(),
          findMany: vi.fn().mockResolvedValue([]),
          upsert: vi.fn(),
          delete: vi.fn(),
        },
      };
      const context = { transactionId: 'tx-findAll', handle: mockTxClient };

      const result = await repository.findAll(context);

      expect(result.isSuccess).toBe(true);
      expect(mockTxClient.researchIdentity.findMany).toHaveBeenCalled();
      expect(mockDbProvider.getClient).not.toHaveBeenCalled();
    });

    it('should use transaction client when context is provided for exists', async () => {
      const id = UniqueId.from('test-id-1');
      const mockTxClient = {
        researchIdentity: {
          findUnique: vi.fn().mockResolvedValue({ id: 'test-id-1' }),
          findMany: vi.fn(),
          upsert: vi.fn(),
          delete: vi.fn(),
        },
      };
      const context = { transactionId: 'tx-exists', handle: mockTxClient };

      const result = await repository.exists(id, context);

      expect(result.isSuccess).toBe(true);
      expect(result.value).toBe(true);
      expect(mockTxClient.researchIdentity.findUnique).toHaveBeenCalled();
      expect(mockDbProvider.getClient).not.toHaveBeenCalled();
    });

    it('should use transaction client when context is provided for delete', async () => {
      const id = UniqueId.from('test-id-1');
      const mockTxClient = {
        researchIdentity: {
          findUnique: vi.fn().mockResolvedValue({ id: 'test-id-1' }),
          findMany: vi.fn(),
          upsert: vi.fn(),
          delete: vi.fn().mockResolvedValue({}),
        },
      };
      const context = { transactionId: 'tx-delete', handle: mockTxClient };

      const result = await repository.delete(id, context);

      expect(result.isSuccess).toBe(true);
      expect(mockTxClient.researchIdentity.delete).toHaveBeenCalled();
      expect(mockDbProvider.getClient).not.toHaveBeenCalled();
    });
  });

  // ─── Mapping correctness ────────────────────────────────────────────

  describe('Mapping correctness', () => {
    it('should use mapper.toDomain when loading aggregates', async () => {
      const id = UniqueId.from('test-id-1');
      const persistence = createMockPersistence('test-id-1');
      const aggregate = createMockAggregate('test-id-1');

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.findUnique.mockResolvedValue(persistence);
      (mockMapper.toDomain as ReturnType<typeof vi.fn>).mockReturnValue(aggregate);

      await repository.findById(id);

      expect(mockMapper.toDomain).toHaveBeenCalledWith(persistence);
    });

    it('should use mapper.toPersistence when saving aggregates', async () => {
      const aggregate = createMockAggregate('test-id-1');
      const persistence = createMockPersistence('test-id-1');

      (mockMapper.toPersistence as ReturnType<typeof vi.fn>).mockReturnValue(persistence);

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.upsert.mockResolvedValue({});

      await repository.save(aggregate);

      expect(mockMapper.toPersistence).toHaveBeenCalledWith(aggregate);
    });

    it('should propagate mapper failures as Result.fail', async () => {
      const id = UniqueId.from('test-id-1');
      const persistence = createMockPersistence('test-id-1');

      const mockClient = (mockDbProvider.getClient as ReturnType<typeof vi.fn>)() as Record<
        string,
        Record<string, ReturnType<typeof vi.fn>>
      >;
      mockClient.researchIdentity.findUnique.mockResolvedValue(persistence);
      (mockMapper.toDomain as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Mapping error');
      });

      const result = await repository.findById(id);

      expect(result.isFailure).toBe(true);
    });
  });
});

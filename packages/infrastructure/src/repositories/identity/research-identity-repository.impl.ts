/**
 * ResearchIdentity Repository — Concrete Implementation.
 *
 * Implements the domain ResearchIdentityRepository contract using
 * the Infrastructure abstractions: DatabaseProvider, AggregateMapper,
 * SpecificationTranslator, and InfrastructureErrorMapper.
 *
 * Architecture reference:
 * - Clean Architecture: Infrastructure Layer implements domain contracts.
 * - Repository Pattern: Encapsulates data access logic.
 * - Unit of Work: Participates in external transaction contexts.
 *
 * Mapping flow (save):
 *   Domain Aggregate → Snapshot → Persistence Entity → Prisma Model → Database
 *
 * Mapping flow (load):
 *   Database → Prisma Model → Persistence Entity → Snapshot → Domain Aggregate
 *
 * Error flow:
 *   Prisma Error → InfrastructureError → Result<T>
 *
 * Transaction support:
 *   Repository receives a TransactionContext from UnitOfWork.
 *   If no context exists, uses DatabaseProvider directly.
 *   Repository NEVER creates transactions.
 */

import type { ResearchIdentity, ResearchIdentityRepository, Specification } from '@rios/identity';
import { Result } from '@rios/shared';
import type { UniqueId } from '@rios/shared';

import type {
  InfrastructureRepository,
  PersistenceHealthStatus,
} from '../../contracts/repository.contract.js';
import type { DatabaseProvider } from '../../database/database-provider.js';
import { InfrastructureErrorMapper } from '../../errors/infrastructure-error-mapper.js';
import { OutboxEventMapper } from '../../events/outbox-event-mapper.js';
import type { OutboxRepository } from '../../events/outbox-repository.js';
import type { Logger } from '../../logging/logger.js';
import type { TransactionContext } from '../../persistence/unit-of-work.js';

import { ResearchIdentityAggregateMapper } from './mappers/research-identity-mapper.js';
import type { ResearchIdentityPersistence } from './persistence/identity-persistence.js';
import { ResearchIdentitySpecificationTranslator } from './specification/identity-specification-translator.js';
import type { PrismaClientLike } from './types/database-client.js';

/**
 * ResearchIdentityRepositoryImpl — concrete repository.
 *
 * Dependencies:
 * - DatabaseProvider: Connection management, client access.
 * - ResearchIdentityAggregateMapper: Domain ↔ Persistence conversion.
 * - ResearchIdentitySpecificationTranslator: Specification → Prisma query conversion.
 * - InfrastructureErrorMapper: Prisma error → InfrastructureError conversion.
 * - Logger: Structured logging.
 * - OutboxRepository: Transactional outbox event persistence.
 */
export class ResearchIdentityRepositoryImpl
  implements ResearchIdentityRepository, InfrastructureRepository
{
  private readonly mapper: ResearchIdentityAggregateMapper;
  private readonly translator: ResearchIdentitySpecificationTranslator;

  constructor(
    private readonly databaseProvider: DatabaseProvider,
    private readonly logger: Logger,
    mapper?: ResearchIdentityAggregateMapper,
    translator?: ResearchIdentitySpecificationTranslator,
    private readonly outboxRepository?: OutboxRepository,
  ) {
    this.mapper = mapper ?? new ResearchIdentityAggregateMapper();
    this.translator = translator ?? new ResearchIdentitySpecificationTranslator();
  }

  // ─── ResearchIdentityRepository Contract ────────────────────────────

  /**
   * Save (upsert) a ResearchIdentity aggregate.
   *
   * Persistence flow:
   * 1. Aggregate → Persistence Entity (via mapper.toPersistence)
   * 2. Persistence Entity → Prisma upsert (via client)
   * 3. Pending Domain Events → OutboxRecords → OutboxRepository.store (transactional)
   * 4. Returns Result.ok on success, Result.fail on error
   *
   * @param aggregate - The ResearchIdentity to save.
   * @param context - Optional transaction context from UnitOfWork.
   * @returns Result<void> indicating success or failure.
   */
  async save(aggregate: ResearchIdentity, context?: TransactionContext): Promise<Result<void>> {
    try {
      const persistence = this.mapper.toPersistence(aggregate);
      const client = this.resolveClient(context);

      await client.researchIdentity.upsert({
        where: { id: persistence.id },
        create: this.toCreateInput(persistence),
        update: this.toUpdateInput(persistence),
      });

      if (this.outboxRepository !== undefined) {
        const pendingEvents = aggregate.clearEvents();
        if (pendingEvents.length > 0) {
          const outboxRecords = pendingEvents.map((e) =>
            OutboxEventMapper.toRecord(e, 'ResearchIdentity'),
          );
          const outboxResult = await this.outboxRepository.store(outboxRecords, context);
          if (outboxResult.isFailure) {
            this.logger.error('Failed to store domain events in outbox during save', {
              id: persistence.id,
              error: outboxResult.error,
            });
            return Result.fail(`Outbox storage failed: ${outboxResult.error}`);
          }
        }
      }

      this.logger.debug('ResearchIdentity saved', { id: persistence.id });
      return Result.ok(undefined);
    } catch (error) {
      const infraError = InfrastructureErrorMapper.toInfrastructureError(error, 'save');
      this.logger.error('Failed to save ResearchIdentity', { error: infraError });
      return Result.fail(infraError.message);
    }
  }

  /**
   * Find a ResearchIdentity by its unique identifier.
   *
   * Load flow:
   * 1. Query database with id filter and full aggregate include
   * 2. Prisma model → Persistence Entity (row shape matches directly)
   * 3. Persistence Entity → Aggregate (via mapper.toDomain)
   *
   * @param id - The UniqueId of the ResearchIdentity.
   * @param context - Optional transaction context from UnitOfWork.
   * @returns Result<ResearchIdentity> or Result.fail if not found or error.
   */
  async findById(id: UniqueId, context?: TransactionContext): Promise<Result<ResearchIdentity>> {
    try {
      const client = this.resolveClient(context);

      const record = await client.researchIdentity.findUnique({
        where: { id: id.value },
        include: this.translator.getFullAggregateInclude(),
      });

      if (record === null || record === undefined) {
        return Result.fail(`ResearchIdentity not found: ${id.value}`);
      }

      const persistence = record as unknown as ResearchIdentityPersistence;
      const aggregate = this.mapper.toDomain(persistence);
      return Result.ok(aggregate);
    } catch (error) {
      const infraError = InfrastructureErrorMapper.toInfrastructureError(error, 'findById');
      this.logger.error('Failed to find ResearchIdentity by id', {
        id: id.value,
        error: infraError,
      });
      return Result.fail(infraError.message);
    }
  }

  /**
   * Find all ResearchIdentity aggregates.
   *
   * Uses the specification translator to produce a "find all" query,
   * then maps each row back to the domain aggregate.
   *
   * @param context - Optional transaction context from UnitOfWork.
   * @returns Result<ResearchIdentity[]> of all identities.
   */
  async findAll(context?: TransactionContext): Promise<Result<ResearchIdentity[]>> {
    try {
      const client = this.resolveClient(context);

      const records = await client.researchIdentity.findMany({
        where: {},
        include: this.translator.getFullAggregateInclude(),
        orderBy: { createdAt: 'desc' as const },
      });

      return this.mapRecordsToAggregates(records as unknown as ResearchIdentityPersistence[]);
    } catch (error) {
      const infraError = InfrastructureErrorMapper.toInfrastructureError(error, 'findAll');
      this.logger.error('Failed to find all ResearchIdentities', { error: infraError });
      return Result.fail(infraError.message);
    }
  }

  /**
   * Find ResearchIdentity aggregates matching a domain specification.
   *
   * Specification flow:
   * 1. SpecificationTranslator.translate(spec) → Prisma query params
   * 2. Execute translated query
   * 3. Map results back to domain aggregates
   * 4. For specifications not fully translatable, in-memory filter via isSatisfiedBy
   *
   * @param specification - The domain specification to match.
   * @param context - Optional transaction context from UnitOfWork.
   * @returns Result<ResearchIdentity[]> of matching identities.
   */
  async findMatching(
    specification: Specification<ResearchIdentity>,
    context?: TransactionContext,
  ): Promise<Result<ResearchIdentity[]>> {
    try {
      const client = this.resolveClient(context);
      const queryParams = this.translator.translate(specification);

      const records = await client.researchIdentity.findMany({
        where: queryParams.where,
        include: queryParams.include ?? this.translator.getFullAggregateInclude(),
        orderBy: queryParams.orderBy,
      });

      const aggregatesResult = this.mapRecordsToAggregates(
        records as unknown as ResearchIdentityPersistence[],
      );

      if (aggregatesResult.isFailure) {
        return aggregatesResult;
      }

      // In-memory filtering for specifications not fully translatable to SQL
      const filtered = aggregatesResult.value.filter((agg) => specification.isSatisfiedBy(agg));

      return Result.ok(filtered);
    } catch (error) {
      const infraError = InfrastructureErrorMapper.toInfrastructureError(error, 'findMatching');
      this.logger.error('Failed to find matching ResearchIdentities', { error: infraError });
      return Result.fail(infraError.message);
    }
  }

  /**
   * Check whether a ResearchIdentity exists for the given id.
   *
   * Lightweight existence check — does not materialize the full aggregate.
   * Useful for pre-condition validation in application services.
   *
   * @param id - The UniqueId to check for existence.
   * @param context - Optional transaction context from UnitOfWork.
   * @returns Result<boolean> — true if exists, false if not.
   */
  async exists(id: UniqueId, context?: TransactionContext): Promise<Result<boolean>> {
    try {
      const client = this.resolveClient(context);

      const record = await client.researchIdentity.findUnique({
        where: { id: id.value },
      });

      return Result.ok(record !== null);
    } catch (error) {
      const infraError = InfrastructureErrorMapper.toInfrastructureError(error, 'exists');
      this.logger.error('Failed to check ResearchIdentity existence', {
        id: id.value,
        error: infraError,
      });
      return Result.fail(infraError.message);
    }
  }

  /**
   * Remove a ResearchIdentity aggregate from the collection.
   *
   * Per DDD principles, deletion should be rare and carefully considered.
   * The aggregate and all its owned entities are removed via cascade.
   *
   * @param id - The UniqueId of the ResearchIdentity to delete.
   * @param context - Optional transaction context from UnitOfWork.
   * @returns Result<void> — failure if no aggregate exists with the given id.
   */
  async delete(id: UniqueId, context?: TransactionContext): Promise<Result<void>> {
    try {
      const client = this.resolveClient(context);

      const record = await client.researchIdentity.findUnique({
        where: { id: id.value },
      });

      if (record === null || record === undefined) {
        return Result.fail(`ResearchIdentity not found: ${id.value}`);
      }

      await client.researchIdentity.delete({
        where: { id: id.value },
      });

      this.logger.debug('ResearchIdentity deleted', { id: id.value });
      return Result.ok(undefined);
    } catch (error) {
      const infraError = InfrastructureErrorMapper.toInfrastructureError(error, 'delete');
      this.logger.error('Failed to delete ResearchIdentity', {
        id: id.value,
        error: infraError,
      });
      return Result.fail(infraError.message);
    }
  }

  // ─── InfrastructureRepository Contract ─────────────────────────────

  /**
   * Health check — verifies database connectivity.
   */
  async healthCheck(): Promise<PersistenceHealthStatus> {
    const healthy = await this.databaseProvider.isHealthy();
    return {
      isHealthy: healthy,
      latencyMs: healthy ? 0 : -1,
      message: healthy ? 'Database connection healthy' : 'Database connection unavailable',
    };
  }

  // ─── Private Helpers ───────────────────────────────────────────────

  /**
   * Resolve the database client.
   * If a transaction context exists, use its client.
   * Otherwise, use DatabaseProvider's client.
   */
  private resolveClient(context?: TransactionContext): PrismaClientLike {
    if (context !== undefined && context.handle !== undefined && context.handle !== null) {
      return context.handle as PrismaClientLike;
    }
    return this.databaseProvider.getClient() as PrismaClientLike;
  }

  /**
   * Map an array of persistence records to domain aggregates.
   * Collects individual mapping failures into a single Result.fail.
   */
  private mapRecordsToAggregates(
    records: ResearchIdentityPersistence[],
  ): Result<ResearchIdentity[]> {
    const aggregates: ResearchIdentity[] = [];

    for (const record of records) {
      try {
        const aggregate = this.mapper.toDomain(record);
        aggregates.push(aggregate);
      } catch (error) {
        return Result.fail(
          `Failed to map ResearchIdentity record ${record.id}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    return Result.ok(aggregates);
  }

  /**
   * Convert persistence entity to Prisma create input.
   * Flattens nested relations into Prisma's nested write format.
   */
  private toCreateInput(p: ResearchIdentityPersistence): Record<string, unknown> {
    return {
      id: p.id,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      vision: { create: p.vision },
      agenda: { create: p.agenda },
      philosophy: { create: p.philosophy },
      values: { create: p.values },
      evolution: {
        create: {
          ...p.evolution,
          milestoneIds: p.evolution.milestoneIds,
        },
      },
      areas: { create: p.areas },
      questions: { create: p.questions },
      goals: { create: p.goals },
      contributions: { create: p.contributions },
      milestones: { create: p.milestones },
    };
  }

  /**
   * Convert persistence entity to Prisma update input.
   * Uses upsert for nested relations to handle creates and updates uniformly.
   */
  private toUpdateInput(p: ResearchIdentityPersistence): Record<string, unknown> {
    return {
      updatedAt: p.updatedAt,
      vision: {
        upsert: {
          create: p.vision,
          update: p.vision,
        },
      },
      agenda: {
        upsert: {
          create: p.agenda,
          update: p.agenda,
        },
      },
      philosophy: {
        upsert: {
          create: p.philosophy,
          update: p.philosophy,
        },
      },
      values: {
        upsert: {
          create: p.values,
          update: p.values,
        },
      },
      evolution: {
        upsert: {
          create: {
            ...p.evolution,
            milestoneIds: p.evolution.milestoneIds,
          },
          update: {
            ...p.evolution,
            milestoneIds: p.evolution.milestoneIds,
          },
        },
      },
      areas: {
        deleteMany: {},
        create: p.areas,
      },
      questions: {
        deleteMany: {},
        create: p.questions,
      },
      goals: {
        deleteMany: {},
        create: p.goals,
      },
      contributions: {
        deleteMany: {},
        create: p.contributions,
      },
      milestones: {
        deleteMany: {},
        create: p.milestones,
      },
    };
  }
}

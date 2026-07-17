/**
 * Purpose:
 * Domain repository contract for the ResearchIdentity Aggregate Root.
 *
 * Architecture reference:
 * Domain Model Specification Layers 7-9; Volume I Chapter 8 structural integrity;
 * Volume I Chapter 9 foundational, structural, relationship, and evolution constraints.
 *
 * ADR reference:
 * ADR-101, ADR-102.
 *
 * Lifecycle:
 * Repository is a pure domain contract. It defines the persistence interface
 * for the ResearchIdentity Aggregate Root without any implementation details.
 *
 * Responsibilities:
 * Define the persistence contract for ResearchIdentity.
 * Express domain-intent operations (save, findById, exists, delete).
 * Ensure all fallible operations return Result.
 * Never expose infrastructure, ORM, SQL, or persistence details.
 *
 * Ownership:
 * Identity Domain. Only the Aggregate Root receives a repository.
 * Entities and Value Objects are accessed exclusively through the Aggregate Root.
 *
 * Invariants:
 * All operations return Result — never throw, never return null/undefined.
 * Absence is represented explicitly through Result failure with domain errors.
 * Repository depends only on Domain abstractions (Aggregate, UniqueId, Result, Errors).
 */

import { Result, UniqueId } from '@rios/shared';

import { ResearchIdentity } from '../aggregate/research-identity.js';

/**
 * ResearchIdentityRepository — the domain contract for persisting and
 * retrieving ResearchIdentity aggregates.
 *
 * This interface lives in the Domain layer. It represents a collection
 * of ResearchIdentity aggregates. Infrastructure implementations (Prisma,
 * PostgreSQL, MongoDB, etc.) must satisfy this contract but are never
 * referenced by it.
 *
 * Only the Aggregate Root has a repository. Entities and Value Objects
 * are accessed through the Aggregate Root's own behavior methods.
 *
 * Design rationale:
 * - save(): Persists the entire aggregate as a single consistency boundary.
 * - findById(): Retrieves a complete aggregate by its unique identifier.
 *   Returns Result failure with ResearchIdentityNotFoundError if not found.
 * - exists(): Checks aggregate existence without materializing the full object.
 * - delete(): Removes the aggregate. Returns Result failure if not found.
 */
export interface ResearchIdentityRepository {
  /**
   * Persist a ResearchIdentity aggregate.
   *
   * For new aggregates, this creates the record. For existing aggregates
   * (identified by id), this updates the record.
   *
   * The entire aggregate is saved as a single unit to preserve
   * consistency boundary integrity.
   *
   * @param identity - The ResearchIdentity aggregate root to persist.
   * @returns Result<void> — failure if save violates domain constraints.
   */
  save(identity: ResearchIdentity): Promise<Result<void>>;

  /**
   * Retrieve a ResearchIdentity aggregate by its unique identifier.
   *
   * Returns the complete aggregate with all owned entities, ready for
   * domain behavior operations.
   *
   * @param id - The UniqueId of the ResearchIdentity to find.
   * @returns Result<ResearchIdentity> — failure with ResearchIdentityNotFoundError
   *          if no aggregate exists with the given id.
   */
  findById(id: UniqueId): Promise<Result<ResearchIdentity>>;

  /**
   * Check whether a ResearchIdentity aggregate exists for the given id.
   *
   * This is a lightweight existence check that avoids materializing
   * the full aggregate. Useful for pre-condition validation in
   * application services.
   *
   * @param id - The UniqueId to check for existence.
   * @returns Result<boolean> — true if exists, false if not.
   */
  exists(id: UniqueId): Promise<Result<boolean>>;

  /**
   * Remove a ResearchIdentity aggregate from the collection.
   *
   * Per DDD principles, deletion should be rare and carefully considered.
   * The aggregate and all its owned entities are removed.
   *
   * @param id - The UniqueId of the ResearchIdentity to delete.
   * @returns Result<void> — failure with ResearchIdentityNotFoundError
   *          if no aggregate exists with the given id.
   */
  delete(id: UniqueId): Promise<Result<void>>;
}

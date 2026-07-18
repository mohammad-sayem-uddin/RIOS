/**
 * Purpose:
 * Defines the Unit of Work pattern contract for transaction management.
 *
 * Architecture reference:
 * Infrastructure Layer — Transaction Strategy.
 *
 * The Unit of Work:
 * - Groups multiple repository operations into a single atomic transaction.
 * - Commits all changes on success.
 * - Rolls back all changes on failure.
 * - Provides a transaction context for repository implementations.
 *
 * Ownership:
 * Infrastructure Layer. Application Layer invokes the Unit of Work
 * through repository implementations. Domain never sees transactions.
 *
 * Transaction boundary:
 * One Unit of Work = one Application Service method call.
 * The Application Service owns the business use case.
 * The Unit of Work ensures atomicity.
 *
 * Invariants:
 * All changes within a Unit of Work are atomic.
 * Partial commits are never visible to other operations.
 * Rollback restores the system to the pre-operation state.
 */

import type { Result } from '@rios/shared';

/**
 * Transaction isolation levels.
 * Maps to database-specific isolation levels.
 */
export const TransactionIsolationLevel = {
  /** Lowest isolation. Allows dirty reads. */
  READ_UNCOMMITTED: 'READ_UNCOMMITTED',
  /** Prevents dirty reads. Allows non-repeatable reads. */
  READ_COMMITTED: 'READ_COMMITTED',
  /** Prevents dirty and non-repeatable reads. Allows phantom reads. */
  REPEATABLE_READ: 'REPEATABLE_READ',
  /** Highest isolation. Prevents all anomalies. */
  SERIALIZABLE: 'SERIALIZABLE',
} as const;

export type TransactionIsolationLevelType =
  (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

/**
 * Options for starting a transaction.
 */
export interface TransactionOptions {
  /** Transaction isolation level. Defaults to READ_COMMITTED. */
  readonly isolationLevel?: TransactionIsolationLevelType;
  /** Transaction timeout in milliseconds. */
  readonly timeoutMs?: number;
}

/**
 * UnitOfWork — orchestrates atomic operations across repositories.
 *
 * Usage pattern:
 * ```
 * const result = await unitOfWork.execute(async (ctx) => {
 *   await identityRepo.save(aggregate, ctx);
 *   await outboxRepo.store(events, ctx);
 *   // Both succeed → commit. Either fails → rollback.
 * });
 * ```
 *
 * The transaction context (ctx) is passed to repository implementations
 * so they execute within the same transaction boundary.
 */
export interface UnitOfWork {
  /**
   * Execute a function within a transaction boundary.
   *
   * The callback receives a transaction context that must be passed
   * to repository operations. All operations share the same transaction.
   *
   * If the callback returns Result.ok, the transaction is committed.
   * If the callback returns Result.fail or throws, the transaction is rolled back.
   *
   * @param fn - The function to execute within the transaction.
   * @param options - Optional transaction configuration.
   * @returns The result of the callback function.
   */
  execute<T>(
    fn: (context: TransactionContext) => Promise<Result<T>>,
    options?: TransactionOptions,
  ): Promise<Result<T>>;

  /**
   * Check if a transaction is currently active.
   */
  isActive(): boolean;
}

/**
 * TransactionContext — opaque handle passed to repository implementations
 * during a Unit of Work execution.
 *
 * Implementations wrap the database-specific transaction handle
 * (e.g., Prisma transaction client, Knex transaction, TypeORM query runner).
 */
export interface TransactionContext {
  /** Unique identifier for this transaction. */
  readonly transactionId: string;
  /** The underlying database transaction handle. Type is implementation-specific. */
  readonly handle: unknown;
}

/**
 * Purpose:
 * Defines the OutboxRepository contract for storing and managing domain events in the outbox.
 *
 * Architecture reference:
 * Infrastructure Layer — Event Strategy — Transactional Outbox.
 *
 * Responsibilities:
 * - Persists OutboxRecord entries atomically within a transaction.
 * - Retrieves pending (unpublished) outbox records.
 * - Marks processed entries.
 * - Increments retry count on failed publication attempts.
 * - Repositories MUST NOT publish events to external brokers. Storage only.
 */

import type { Result } from '@rios/shared';

import type { TransactionContext } from '../persistence/unit-of-work.js';

import type { OutboxRecord } from './outbox-model.js';

export interface OutboxRepository {
  /**
   * Store OutboxRecord entries in the outbox table.
   * Participates in the UnitOfWork transaction boundary when `context` is provided.
   *
   * @param records - OutboxRecords to store.
   * @param context - Optional transaction context from UnitOfWork.
   * @returns Result indicating success or failure.
   */
  store(records: ReadonlyArray<OutboxRecord>, context?: TransactionContext): Promise<Result<void>>;

  /**
   * Find pending (unprocessed) outbox records ordered by creation date.
   *
   * @param limit - Maximum number of records to retrieve (default: 100).
   * @param context - Optional transaction context.
   * @returns Result containing array of pending OutboxRecord entries.
   */
  findPending(
    limit?: number,
    context?: TransactionContext,
  ): Promise<Result<ReadonlyArray<OutboxRecord>>>;

  /**
   * Mark an outbox record as successfully processed.
   *
   * @param eventId - The event identifier to mark processed.
   * @param context - Optional transaction context.
   * @returns Result indicating success or failure.
   */
  markProcessed(eventId: string, context?: TransactionContext): Promise<Result<void>>;

  /**
   * Increment the retry count for an outbox record after a failed attempt.
   *
   * @param eventId - The event identifier.
   * @param errorContext - Optional error message detailing the failure.
   * @param context - Optional transaction context.
   * @returns Result indicating success or failure.
   */
  incrementRetry(
    eventId: string,
    errorContext?: string,
    context?: TransactionContext,
  ): Promise<Result<void>>;
}

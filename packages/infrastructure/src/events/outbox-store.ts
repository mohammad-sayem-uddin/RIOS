/**
 * Purpose:
 * Defines the outbox store contract for reliable event publishing.
 *
 * Architecture reference:
 * Infrastructure Layer — Event Strategy — Outbox Pattern.
 *
 * The OutboxStore:
 * - Stores domain events in a durable store (database table) as part
 *   of the same transaction as the aggregate state change.
 * - Guarantees at-least-once delivery by decoupling storage from publication.
 * - A separate process (relay) reads unpublished events and publishes them.
 * - Marks events as published after successful delivery.
 *
 * Why Outbox?
 * Without outbox, publishing events after committing state changes creates
 * a dual-write problem: if the DB commit succeeds but publishing fails,
 * events are lost. The outbox pattern solves this by making event storage
 * atomic with state changes.
 *
 * Dependency rule:
 * Infrastructure → Shared (DomainEvent, Result). Never reverse.
 */

import type { DomainEvent, Result } from '@rios/shared';

/**
 * Stored outbox entry with metadata.
 */
export interface OutboxEntry {
  /** Unique identifier for this outbox entry. */
  readonly id: string;
  /** The domain event serialized as JSON. */
  readonly event: DomainEvent;
  /** When the event was stored in the outbox. */
  readonly createdAt: string;
  /** Number of delivery attempts. */
  readonly attemptCount: number;
  /** Whether the event has been successfully published. */
  readonly published: boolean;
}

/**
 * OutboxStore — stores and retrieves domain events for reliable publishing.
 *
 * Usage:
 * ```
 * // Inside Unit of Work:
 * await outboxStore.store(events, transactionContext);
 *
 * // Relay process:
 * const unpublished = await outboxStore.getUnpublished(100);
 * for (const entry of unpublished) {
 *   await publisher.publish(entry.event);
 *   await outboxStore.markPublished(entry.id);
 * }
 * ```
 */
export interface OutboxStore {
  /**
   * Store domain events in the outbox.
   * Must be called within the same transaction as the aggregate save.
   *
   * @param events - The domain events to store.
   * @param transactionId - The transaction identifier for atomicity.
   * @returns Result indicating success or failure.
   */
  store(events: ReadonlyArray<DomainEvent>, transactionId: string): Promise<Result<void>>;

  /**
   * Retrieve unpublished events ordered by creation time.
   *
   * @param limit - Maximum number of events to retrieve.
   * @returns Result containing unpublished outbox entries.
   */
  getUnpublished(limit: number): Promise<Result<ReadonlyArray<OutboxEntry>>>;

  /**
   * Mark an event as successfully published.
   *
   * @param entryId - The outbox entry identifier.
   * @returns Result indicating success or failure.
   */
  markPublished(entryId: string): Promise<Result<void>>;

  /**
   * Increment the attempt count for a failed delivery.
   *
   * @param entryId - The outbox entry identifier.
   * @returns Result indicating success or failure.
   */
  incrementAttempt(entryId: string): Promise<Result<void>>;

  /**
   * Purge published events older than the given timestamp.
   *
   * @param olderThan - ISO 8601 timestamp. Events published before this are deleted.
   * @returns Result indicating number of purged entries.
   */
  purge(olderThan: string): Promise<Result<number>>;
}

/**
 * Outbox Model — Persistence representation of a domain event in the outbox.
 *
 * Architecture reference:
 * Infrastructure Layer — Event Strategy — Outbox Pattern.
 *
 * Features:
 * - Decouples domain event generation from external message publication.
 * - Stores all details required for reliable asynchronous processing.
 * - Serializable primitive JSON payload — no domain objects inside payload.
 */

export const OutboxStatus = {
  PENDING: 'PENDING',
  PROCESSED: 'PROCESSED',
  FAILED: 'FAILED',
} as const;

export type OutboxStatusType = (typeof OutboxStatus)[keyof typeof OutboxStatus];

/**
 * OutboxRecord — Durable representation of a domain event queued for publishing.
 */
export interface OutboxRecord {
  /** Unique event identifier (maps to DomainEvent.eventId). */
  readonly id: string;
  /** Unique identifier of the originating aggregate root. */
  readonly aggregateId: string;
  /** Name of the aggregate type (e.g., 'ResearchIdentity'). */
  readonly aggregateType: string;
  /** Name of the event type (e.g., 'ResearchIdentityCreated'). */
  readonly eventType: string;
  /** Primitive serializable payload containing event state. */
  readonly payload: Record<string, unknown>;
  /** Traceability metadata (correlationId, causationId, userId). */
  readonly metadata: Record<string, unknown>;
  /** Timestamp when the domain event occurred. */
  readonly occurredAt: Date;
  /** Timestamp when the event record was persisted in the outbox. */
  readonly storedAt: Date;
  /** Current processing status in the outbox lifecycle. */
  readonly status: OutboxStatusType;
  /** Number of failed delivery/processing attempts. */
  readonly retryCount: number;
  /** Event schema version. Defaults to 1. */
  readonly version: number;
  /** Optional error message from the last delivery attempt. */
  readonly lastError?: string;
}

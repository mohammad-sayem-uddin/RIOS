/**
 * Domain Event — records something that happened in the domain.
 * Immutable, timestamped, carries metadata for event sourcing.
 * Domain-Driven Design building block.
 */

import { EventMetadata } from './event-metadata.js';

export abstract class DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date;
  public readonly aggregateId: string;
  public readonly metadata: EventMetadata;

  constructor(aggregateId: string, metadata?: Partial<EventMetadata>) {
    this.eventId = crypto.randomUUID();
    this.occurredAt = new Date();
    this.aggregateId = aggregateId;
    this.metadata = {
      correlationId: metadata?.correlationId,
      causationId: metadata?.causationId,
      userId: metadata?.userId,
    };
  }

  /**
   * The event type name — used for serialization and deserialization.
   */
  public abstract readonly eventType: string;
}

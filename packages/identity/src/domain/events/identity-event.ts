/**
 * Identity Event — base class for all Identity Domain events.
 *
 * Extends the shared DomainEvent with Identity-specific concerns:
 * - Version tracking for schema evolution
 * - Event name for serialization/deserialization
 * - toPrimitives() for infrastructure-independent serialization
 *
 * Architecture reference:
 * Volume I Chapter 10 Section 10.5 — Identity Domain Events.
 * Domain Events ADR.
 */

import { DomainEvent, EventMetadata } from '@rios/shared';

export abstract class IdentityEvent extends DomainEvent {
  public readonly version: number;

  constructor(aggregateId: string, version: number, metadata?: Partial<EventMetadata>) {
    super(aggregateId, metadata);
    this.version = version;
  }

  /**
   * The event type name — used for serialization, deserialization, and routing.
   * Concrete events MUST implement this as a public readonly field.
   */
  public abstract readonly eventName: string;

  /**
   * Implements the abstract eventType from DomainEvent.
   * Delegates to eventName for Identity events.
   */
  public get eventType(): string {
    return this.eventName;
  }

  /**
   * Serialize the event payload to a plain object.
   * No infrastructure dependencies. Infrastructure-independent.
   * Concrete events MUST implement this.
   */
  public abstract toPrimitives(): Record<string, unknown>;
}

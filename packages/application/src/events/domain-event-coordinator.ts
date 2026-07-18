/**
 * Purpose:
 * Reusable coordinator for domain events within the Application Layer.
 *
 * Architecture reference:
 * Application Layer — Domain Event Coordination.
 *
 * This class:
 * - Extracts pending domain events from aggregates after successful operations.
 * - Stores events for Infrastructure to retrieve and publish later.
 * - Provides a defensive copy of collected events.
 * - Allows clearing of stored events after successful coordination.
 *
 * This class does NOT:
 * - Publish events (Infrastructure responsibility).
 * - Implement an Event Bus.
 * - Know about message brokers, databases, or infrastructure.
 * - Contain business logic.
 *
 * Dependency rule:
 * Application → Domain → Shared. Never reverse.
 *
 * Usage:
 * 1. After a successful aggregate operation, call collectFrom(aggregate).
 * 2. Infrastructure retrieves events via getPendingEvents().
 * 3. Infrastructure clears events via clearPendingEvents() after successful publication.
 * 4. Repeat for each operation.
 *
 * This supports future extension to:
 * - Outbox Pattern (by extracting events for transactional outbox writes).
 * - Message Brokers (by providing events to broker-specific publishers).
 * - Event Sourcing (by providing a clear audit trail of domain events).
 */

import type { DomainEvent } from '@rios/shared';

/**
 * Minimal contract for any object that produces domain events.
 *
 * This interface allows the coordinator to work with any aggregate
 * or entity that maintains its own pending domain events — without
 * coupling to AggregateRoot, specific event types, or infrastructure.
 */
export interface DomainEventSource {
  pullDomainEvents(): ReadonlyArray<DomainEvent>;
  clearDomainEvents(): void;
}

export class DomainEventCoordinator {
  /**
   * Internal storage for pending domain events.
   * Events are appended in the order they are collected from aggregates.
   */
  private pendingEvents: DomainEvent[] = [];

  /**
   * Collect pending domain events from an aggregate.
   *
   * This method:
   * 1. Extracts all pending events from the aggregate (pullDomainEvents).
   * 2. Clears the aggregate's internal event list (clearDomainEvents).
   * 3. Appends the extracted events to the coordinator's internal storage.
   *
   * Call this after a successful aggregate operation and before returning
   * control to Infrastructure.
   *
   * @param aggregate - The aggregate root from which to extract events.
   */
  collectFrom(source: DomainEventSource): void {
    const events = source.pullDomainEvents();
    this.pendingEvents.push(...events);
    source.clearDomainEvents();
  }

  /**
   * Get a defensive copy of all pending domain events.
   *
   * Returns a new array to prevent external mutation of internal state.
   * Infrastructure should call this after successful coordination to
   * retrieve events for publication.
   *
   * @returns A defensive copy of pending domain events.
   */
  getPendingEvents(): DomainEvent[] {
    return [...this.pendingEvents];
  }

  /**
   * Clear all pending domain events.
   *
   * Infrastructure should call this after successfully publishing
   * events (e.g., after committing to an outbox table or sending
   * to a message broker).
   *
   * This ensures events are not published multiple times.
   */
  clearPendingEvents(): void {
    this.pendingEvents = [];
  }
}

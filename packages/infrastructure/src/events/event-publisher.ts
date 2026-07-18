/**
 * Purpose:
 * Defines the event publishing contract for Infrastructure.
 *
 * Architecture reference:
 * Infrastructure Layer — Event Strategy.
 *
 * The EventPublisher:
 * - Receives domain events from the DomainEventCoordinator.
 * - Publishes them to external systems (message broker, event bus, etc.).
 * - Handles serialization and delivery guarantees.
 *
 * Connection to Application Layer:
 * The DomainEventCoordinator (Application) collects pending events
 * from aggregates and passes them to the EventPublisher (Infrastructure).
 *
 * This interface does NOT:
 * - Collect events from aggregates (Application's job).
 * - Know about domain event types specifically.
 * - Contain business logic.
 *
 * Dependency rule:
 * Infrastructure → Shared (DomainEvent). Never reverse.
 */

import type { DomainEvent, Result } from '@rios/shared';

/**
 * EventPublisher — publishes domain events to external systems.
 *
 * Usage:
 * ```
 * const events = aggregate.pullDomainEvents();
 * const result = await publisher.publishAll(events);
 * if (result.isFailure) {
 *   // Handle publication failure (outbox pattern, retry, etc.)
 * }
 * ```
 */
export interface EventPublisher {
  /**
   * Publish a single domain event.
   *
   * @param event - The domain event to publish.
   * @returns Result indicating success or failure.
   */
  publish(event: DomainEvent): Promise<Result<void>>;

  /**
   * Publish multiple domain events atomically.
   *
   * All events are published together. If any fails,
   * the entire batch is considered failed.
   *
   * @param events - The domain events to publish.
   * @returns Result indicating success or failure.
   */
  publishAll(events: ReadonlyArray<DomainEvent>): Promise<Result<void>>;
}

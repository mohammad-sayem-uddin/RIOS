/**
 * Outbox Event Mapper — Translates DomainEvents to OutboxRecords.
 *
 * Architecture reference:
 * Infrastructure Layer — Event Strategy — Outbox Pattern.
 *
 * Invariants:
 * - Payload MUST be 100% JSON-serializable.
 * - Payload MUST NOT contain any domain objects, class instances, or functions.
 * - Metadata (correlationId, causationId, userId) is extracted cleanly.
 */

import type { DomainEvent } from '@rios/shared';

import { OutboxStatus, type OutboxRecord } from './outbox-model.js';

export class OutboxEventMapper {
  /**
   * Translate a DomainEvent instance into an OutboxRecord.
   *
   * @param event - The DomainEvent to translate.
   * @param aggregateType - Optional name of the aggregate type.
   * @returns A fresh OutboxRecord ready for outbox storage.
   */
  static toRecord(event: DomainEvent, aggregateType?: string): OutboxRecord {
    const rawPayload = OutboxEventMapper.extractPayload(event);

    // Ensure strict JSON primitive serialization (no domain objects or classes inside)
    const payload = JSON.parse(JSON.stringify(rawPayload)) as Record<string, unknown>;

    const metadata: Record<string, unknown> = {};
    if (event.metadata.correlationId !== undefined) {
      metadata.correlationId = event.metadata.correlationId;
    }
    if (event.metadata.causationId !== undefined) {
      metadata.causationId = event.metadata.causationId;
    }
    if (event.metadata.userId !== undefined) {
      metadata.userId = event.metadata.userId;
    }

    return {
      id: event.eventId,
      aggregateId: event.aggregateId,
      aggregateType: aggregateType ?? OutboxEventMapper.deriveAggregateType(event),
      eventType: event.eventType,
      payload,
      metadata,
      occurredAt: event.occurredAt,
      storedAt: new Date(),
      status: OutboxStatus.PENDING,
      retryCount: 0,
      version: 1,
    };
  }

  /**
   * Extract custom properties from the event object for the payload.
   */
  private static extractPayload(event: DomainEvent): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    const baseKeys = new Set(['eventId', 'occurredAt', 'aggregateId', 'metadata', 'eventType']);

    const keys = Object.keys(event);
    for (const key of keys) {
      if (baseKeys.has(key)) {
        continue;
      }
      const val = (event as unknown as Record<string, unknown>)[key];
      if (val !== undefined) {
        payload[key] = val;
      }
    }

    return payload;
  }

  /**
   * Derive aggregate type name from event type if not provided explicitly.
   */
  private static deriveAggregateType(event: DomainEvent): string {
    const typeName = event.eventType;
    if (typeName.startsWith('ResearchIdentity')) {
      return 'ResearchIdentity';
    }
    return 'Aggregate';
  }
}

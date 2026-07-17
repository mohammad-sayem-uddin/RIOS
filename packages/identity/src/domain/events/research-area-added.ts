/**
 * Research Area Added — records the addition of a new Research Area.
 *
 * Architecture reference:
 * Volume I Chapter 10 Section 10.5 — "Research Area Added"
 */

import { EventMetadata } from '@rios/shared';

import { IdentityEvent } from './identity-event.js';

export interface ResearchAreaAddedPrimitives {
  readonly [key: string]: unknown;
  readonly eventId: string;
  readonly aggregateId: string;
  readonly eventName: string;
  readonly occurredAt: string;
  readonly version: number;
  readonly areaId: string;
  readonly areaName: string;
}

export class ResearchAreaAdded extends IdentityEvent {
  public readonly eventName = 'ResearchAreaAdded';
  public readonly areaId: string;
  public readonly areaName: string;

  constructor(
    aggregateId: string,
    payload: { areaId: string; areaName: string },
    metadata?: Partial<EventMetadata>,
  ) {
    super(aggregateId, 1, metadata);
    this.areaId = payload.areaId;
    this.areaName = payload.areaName;
  }

  public toPrimitives(): ResearchAreaAddedPrimitives {
    return {
      eventId: this.eventId,
      aggregateId: this.aggregateId,
      eventName: this.eventName,
      occurredAt: this.occurredAt.toISOString(),
      version: this.version,
      areaId: this.areaId,
      areaName: this.areaName,
    };
  }
}

/**
 * Evolution Updated — records an update to Research Evolution.
 *
 * Architecture reference:
 * Volume I Chapter 10 Section 10.5 — "Evolution Updated"
 */

import { EventMetadata } from '@rios/shared';

import { IdentityEvent } from './identity-event.js';

export interface EvolutionUpdatedPrimitives {
  readonly [key: string]: unknown;
  readonly eventId: string;
  readonly aggregateId: string;
  readonly eventName: string;
  readonly occurredAt: string;
  readonly version: number;
  readonly milestoneId: string;
  readonly milestoneTitle: string;
}

export class EvolutionUpdated extends IdentityEvent {
  public readonly eventName = 'EvolutionUpdated';
  public readonly milestoneId: string;
  public readonly milestoneTitle: string;

  constructor(
    aggregateId: string,
    payload: { milestoneId: string; milestoneTitle: string },
    metadata?: Partial<EventMetadata>,
  ) {
    super(aggregateId, 1, metadata);
    this.milestoneId = payload.milestoneId;
    this.milestoneTitle = payload.milestoneTitle;
  }

  public toPrimitives(): EvolutionUpdatedPrimitives {
    return {
      eventId: this.eventId,
      aggregateId: this.aggregateId,
      eventName: this.eventName,
      occurredAt: this.occurredAt.toISOString(),
      version: this.version,
      milestoneId: this.milestoneId,
      milestoneTitle: this.milestoneTitle,
    };
  }
}

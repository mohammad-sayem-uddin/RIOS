/**
 * Philosophy Revised — records a revision to Research Philosophy.
 *
 * Architecture reference:
 * Volume I Chapter 10 Section 10.5 — "Philosophy Revised"
 */

import { EventMetadata } from '@rios/shared';

import { IdentityEvent } from './identity-event.js';

export interface PhilosophyRevisedPrimitives {
  readonly [key: string]: unknown;
  readonly eventId: string;
  readonly aggregateId: string;
  readonly eventName: string;
  readonly occurredAt: string;
  readonly version: number;
  readonly summary: string;
}

export class PhilosophyRevised extends IdentityEvent {
  public readonly eventName = 'PhilosophyRevised';
  public readonly summary: string;

  constructor(
    aggregateId: string,
    payload: { summary: string },
    metadata?: Partial<EventMetadata>,
  ) {
    super(aggregateId, 1, metadata);
    this.summary = payload.summary;
  }

  public toPrimitives(): PhilosophyRevisedPrimitives {
    return {
      eventId: this.eventId,
      aggregateId: this.aggregateId,
      eventName: this.eventName,
      occurredAt: this.occurredAt.toISOString(),
      version: this.version,
      summary: this.summary,
    };
  }
}

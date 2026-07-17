/**
 * Research Question Added — records the addition of a new Research Question.
 *
 * Architecture reference:
 * Volume I Chapter 10 Section 10.5 — "Research Question Added"
 */

import { EventMetadata } from '@rios/shared';

import { IdentityEvent } from './identity-event.js';

export interface ResearchQuestionAddedPrimitives {
  readonly [key: string]: unknown;
  readonly eventId: string;
  readonly aggregateId: string;
  readonly eventName: string;
  readonly occurredAt: string;
  readonly version: number;
  readonly questionId: string;
  readonly questionTitle: string;
}

export class ResearchQuestionAdded extends IdentityEvent {
  public readonly eventName = 'ResearchQuestionAdded';
  public readonly questionId: string;
  public readonly questionTitle: string;

  constructor(
    aggregateId: string,
    payload: { questionId: string; questionTitle: string },
    metadata?: Partial<EventMetadata>,
  ) {
    super(aggregateId, 1, metadata);
    this.questionId = payload.questionId;
    this.questionTitle = payload.questionTitle;
  }

  public toPrimitives(): ResearchQuestionAddedPrimitives {
    return {
      eventId: this.eventId,
      aggregateId: this.aggregateId,
      eventName: this.eventName,
      occurredAt: this.occurredAt.toISOString(),
      version: this.version,
      questionId: this.questionId,
      questionTitle: this.questionTitle,
    };
  }
}

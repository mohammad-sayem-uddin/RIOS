/**
 * Goal Achieved — records the completion of a Research Goal.
 *
 * Architecture reference:
 * Volume I Chapter 10 Section 10.5 — "Goal Achieved"
 */

import { EventMetadata } from '@rios/shared';

import { IdentityEvent } from './identity-event.js';

export interface GoalAchievedPrimitives {
  readonly [key: string]: unknown;
  readonly eventId: string;
  readonly aggregateId: string;
  readonly eventName: string;
  readonly occurredAt: string;
  readonly version: number;
  readonly goalId: string;
  readonly goalTitle: string;
}

export class GoalAchieved extends IdentityEvent {
  public readonly eventName = 'GoalAchieved';
  public readonly goalId: string;
  public readonly goalTitle: string;

  constructor(
    aggregateId: string,
    payload: { goalId: string; goalTitle: string },
    metadata?: Partial<EventMetadata>,
  ) {
    super(aggregateId, 1, metadata);
    this.goalId = payload.goalId;
    this.goalTitle = payload.goalTitle;
  }

  public toPrimitives(): GoalAchievedPrimitives {
    return {
      eventId: this.eventId,
      aggregateId: this.aggregateId,
      eventName: this.eventName,
      occurredAt: this.occurredAt.toISOString(),
      version: this.version,
      goalId: this.goalId,
      goalTitle: this.goalTitle,
    };
  }
}

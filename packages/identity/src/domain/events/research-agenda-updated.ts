/**
 * Research Agenda Updated — records a change to the Research Agenda.
 *
 * Architecture reference:
 * Volume I Chapter 10 Section 10.5 — "Research Agenda Updated"
 */

import { EventMetadata } from '@rios/shared';

import { IdentityEvent } from './identity-event.js';

export interface ResearchAgendaUpdatedPrimitives {
  readonly [key: string]: unknown;
  readonly eventId: string;
  readonly aggregateId: string;
  readonly eventName: string;
  readonly occurredAt: string;
  readonly version: number;
  readonly previousTitle: string;
  readonly newTitle: string;
}

export class ResearchAgendaUpdated extends IdentityEvent {
  public readonly eventName = 'ResearchAgendaUpdated';
  public readonly previousTitle: string;
  public readonly newTitle: string;

  constructor(
    aggregateId: string,
    payload: { previousTitle: string; newTitle: string },
    metadata?: Partial<EventMetadata>,
  ) {
    super(aggregateId, 1, metadata);
    this.previousTitle = payload.previousTitle;
    this.newTitle = payload.newTitle;
  }

  public toPrimitives(): ResearchAgendaUpdatedPrimitives {
    return {
      eventId: this.eventId,
      aggregateId: this.aggregateId,
      eventName: this.eventName,
      occurredAt: this.occurredAt.toISOString(),
      version: this.version,
      previousTitle: this.previousTitle,
      newTitle: this.newTitle,
    };
  }
}

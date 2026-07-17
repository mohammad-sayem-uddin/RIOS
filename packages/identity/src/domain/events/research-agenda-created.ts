/**
 * Research Agenda Created — records the initial establishment of a Research Agenda.
 *
 * Architecture reference:
 * Volume I Chapter 10 Section 10.5 — "Research Agenda Created"
 */

import { EventMetadata } from '@rios/shared';

import { IdentityEvent } from './identity-event.js';

export interface ResearchAgendaCreatedPrimitives {
  readonly [key: string]: unknown;
  readonly eventId: string;
  readonly aggregateId: string;
  readonly eventName: string;
  readonly occurredAt: string;
  readonly version: number;
  readonly agendaTitle: string;
}

export class ResearchAgendaCreated extends IdentityEvent {
  public readonly eventName = 'ResearchAgendaCreated';
  public readonly agendaTitle: string;

  constructor(
    aggregateId: string,
    payload: { agendaTitle: string },
    metadata?: Partial<EventMetadata>,
  ) {
    super(aggregateId, 1, metadata);
    this.agendaTitle = payload.agendaTitle;
  }

  public toPrimitives(): ResearchAgendaCreatedPrimitives {
    return {
      eventId: this.eventId,
      aggregateId: this.aggregateId,
      eventName: this.eventName,
      occurredAt: this.occurredAt.toISOString(),
      version: this.version,
      agendaTitle: this.agendaTitle,
    };
  }
}

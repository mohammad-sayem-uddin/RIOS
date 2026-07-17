/**
 * Purpose:
 * Command to update the researcher's operational research agenda.
 *
 * Architecture reference:
 * Application Layer — CQRS Command Side.
 *
 * Invariants:
 * Immutable. Data only. No validation. No business logic.
 */

import { Command } from '@rios/shared';

export class UpdateResearchAgendaCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;
  public readonly identityId: string;
  public readonly agendaFocus: string;
  public readonly agendaStatus: string;

  constructor(params: {
    commandId: string;
    timestamp: Date;
    identityId: string;
    agendaFocus: string;
    agendaStatus: string;
  }) {
    this.commandId = params.commandId;
    this.timestamp = params.timestamp;
    this.identityId = params.identityId;
    this.agendaFocus = params.agendaFocus;
    this.agendaStatus = params.agendaStatus;
    Object.freeze(this);
  }
}

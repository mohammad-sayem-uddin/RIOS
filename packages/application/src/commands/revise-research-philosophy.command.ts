/**
 * Purpose:
 * Command to revise the researcher's philosophical foundation.
 *
 * Architecture reference:
 * Application Layer — CQRS Command Side.
 *
 * Invariants:
 * Immutable. Data only. No validation. No business logic.
 */

import { Command } from '@rios/shared';

export class ReviseResearchPhilosophyCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;
  public readonly identityId: string;
  public readonly philosophicalStance: string;
  public readonly epistemologicalView: string;
  public readonly methodologicalPreference: string;
  public readonly revisionReason: string;

  constructor(params: {
    commandId: string;
    timestamp: Date;
    identityId: string;
    philosophicalStance: string;
    epistemologicalView: string;
    methodologicalPreference: string;
    revisionReason: string;
  }) {
    this.commandId = params.commandId;
    this.timestamp = params.timestamp;
    this.identityId = params.identityId;
    this.philosophicalStance = params.philosophicalStance;
    this.epistemologicalView = params.epistemologicalView;
    this.methodologicalPreference = params.methodologicalPreference;
    this.revisionReason = params.revisionReason;
    Object.freeze(this);
  }
}

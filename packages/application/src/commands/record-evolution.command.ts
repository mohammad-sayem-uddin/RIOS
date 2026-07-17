/**
 * Purpose:
 * Command to record evolution of the researcher's identity.
 *
 * Architecture reference:
 * Application Layer — CQRS Command Side.
 *
 * Invariants:
 * Immutable. Data only. No validation. No business logic.
 */

import { Command } from '@rios/shared';

export class RecordEvolutionCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;
  public readonly identityId: string;
  public readonly evolutionDescription: string;
  public readonly evolutionType: string;
  public readonly evolutionTrigger: string;
  public readonly evolutionImpact: string;

  constructor(params: {
    commandId: string;
    timestamp: Date;
    identityId: string;
    evolutionDescription: string;
    evolutionType: string;
    evolutionTrigger: string;
    evolutionImpact: string;
  }) {
    this.commandId = params.commandId;
    this.timestamp = params.timestamp;
    this.identityId = params.identityId;
    this.evolutionDescription = params.evolutionDescription;
    this.evolutionType = params.evolutionType;
    this.evolutionTrigger = params.evolutionTrigger;
    this.evolutionImpact = params.evolutionImpact;
    Object.freeze(this);
  }
}

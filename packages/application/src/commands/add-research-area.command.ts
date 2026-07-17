/**
 * Purpose:
 * Command to add a research area to the Identity aggregate.
 *
 * Architecture reference:
 * Application Layer — CQRS Command Side.
 *
 * Invariants:
 * Immutable. Data only. No validation. No business logic.
 */

import { Command } from '@rios/shared';

export class AddResearchAreaCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;
  public readonly identityId: string;
  public readonly areaName: string;
  public readonly areaDescription: string;
  public readonly areaStatus: string;
  public readonly areaStage: string;

  constructor(params: {
    commandId: string;
    timestamp: Date;
    identityId: string;
    areaName: string;
    areaDescription: string;
    areaStatus: string;
    areaStage: string;
  }) {
    this.commandId = params.commandId;
    this.timestamp = params.timestamp;
    this.identityId = params.identityId;
    this.areaName = params.areaName;
    this.areaDescription = params.areaDescription;
    this.areaStatus = params.areaStatus;
    this.areaStage = params.areaStage;
    Object.freeze(this);
  }
}

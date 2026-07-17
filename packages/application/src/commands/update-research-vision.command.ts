/**
 * Purpose:
 * Command to update the researcher's long-term aspirational vision.
 *
 * Architecture reference:
 * Application Layer — CQRS Command Side.
 *
 * Invariants:
 * Immutable. Data only. No validation. No business logic.
 */

import { Command } from '@rios/shared';

export class UpdateResearchVisionCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;
  public readonly identityId: string;
  public readonly visionStatement: string;
  public readonly timeHorizon: string;

  constructor(params: {
    commandId: string;
    timestamp: Date;
    identityId: string;
    visionStatement: string;
    timeHorizon: string;
  }) {
    this.commandId = params.commandId;
    this.timestamp = params.timestamp;
    this.identityId = params.identityId;
    this.visionStatement = params.visionStatement;
    this.timeHorizon = params.timeHorizon;
    Object.freeze(this);
  }
}

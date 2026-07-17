/**
 * Purpose:
 * Command to add a research goal to the Identity aggregate.
 *
 * Architecture reference:
 * Application Layer — CQRS Command Side.
 *
 * Invariants:
 * Immutable. Data only. No validation. No business logic.
 */

import { Command } from '@rios/shared';

export class AddResearchGoalCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;
  public readonly identityId: string;
  public readonly goalTitle: string;
  public readonly goalDescription: string;
  public readonly goalTargetDate: string;
  public readonly goalStatus: string;
  public readonly goalPriority: string;

  constructor(params: {
    commandId: string;
    timestamp: Date;
    identityId: string;
    goalTitle: string;
    goalDescription: string;
    goalTargetDate: string;
    goalStatus: string;
    goalPriority: string;
  }) {
    this.commandId = params.commandId;
    this.timestamp = params.timestamp;
    this.identityId = params.identityId;
    this.goalTitle = params.goalTitle;
    this.goalDescription = params.goalDescription;
    this.goalTargetDate = params.goalTargetDate;
    this.goalStatus = params.goalStatus;
    this.goalPriority = params.goalPriority;
    Object.freeze(this);
  }
}

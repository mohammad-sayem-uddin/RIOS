/**
 * Purpose:
 * Command to remove a research goal from the Identity aggregate.
 *
 * Architecture reference:
 * Application Layer — CQRS Command Side.
 *
 * Invariants:
 * Immutable. Data only. No validation. No business logic.
 */

import { Command } from '@rios/shared';

export class RemoveResearchGoalCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;
  public readonly identityId: string;
  public readonly goalId: string;

  constructor(params: { commandId: string; timestamp: Date; identityId: string; goalId: string }) {
    this.commandId = params.commandId;
    this.timestamp = params.timestamp;
    this.identityId = params.identityId;
    this.goalId = params.goalId;
    Object.freeze(this);
  }
}

/**
 * Purpose:
 * Command to remove a research area from the Identity aggregate.
 *
 * Architecture reference:
 * Application Layer — CQRS Command Side.
 *
 * Invariants:
 * Immutable. Data only. No validation. No business logic.
 */

import { Command } from '@rios/shared';

export class RemoveResearchAreaCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;
  public readonly identityId: string;
  public readonly areaId: string;

  constructor(params: { commandId: string; timestamp: Date; identityId: string; areaId: string }) {
    this.commandId = params.commandId;
    this.timestamp = params.timestamp;
    this.identityId = params.identityId;
    this.areaId = params.areaId;
    Object.freeze(this);
  }
}

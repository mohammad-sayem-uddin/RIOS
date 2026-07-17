/**
 * Purpose:
 * Command to record a research contribution in the Identity aggregate.
 *
 * Architecture reference:
 * Application Layer — CQRS Command Side.
 *
 * Invariants:
 * Immutable. Data only. No validation. No business logic.
 */

import { Command } from '@rios/shared';

export class RecordContributionCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;
  public readonly identityId: string;
  public readonly contributionTitle: string;
  public readonly contributionDescription: string;
  public readonly contributionType: string;
  public readonly contributionDate: string;
  public readonly contributionStatus: string;

  constructor(params: {
    commandId: string;
    timestamp: Date;
    identityId: string;
    contributionTitle: string;
    contributionDescription: string;
    contributionType: string;
    contributionDate: string;
    contributionStatus: string;
  }) {
    this.commandId = params.commandId;
    this.timestamp = params.timestamp;
    this.identityId = params.identityId;
    this.contributionTitle = params.contributionTitle;
    this.contributionDescription = params.contributionDescription;
    this.contributionType = params.contributionType;
    this.contributionDate = params.contributionDate;
    this.contributionStatus = params.contributionStatus;
    Object.freeze(this);
  }
}

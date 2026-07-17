/**
 * Purpose:
 * Command to add a research question to the Identity aggregate.
 *
 * Architecture reference:
 * Application Layer — CQRS Command Side.
 *
 * Invariants:
 * Immutable. Data only. No validation. No business logic.
 */

import { Command } from '@rios/shared';

export class AddResearchQuestionCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;
  public readonly identityId: string;
  public readonly questionText: string;
  public readonly questionAreaId: string;
  public readonly questionPriority: string;

  constructor(params: {
    commandId: string;
    timestamp: Date;
    identityId: string;
    questionText: string;
    questionAreaId: string;
    questionPriority: string;
  }) {
    this.commandId = params.commandId;
    this.timestamp = params.timestamp;
    this.identityId = params.identityId;
    this.questionText = params.questionText;
    this.questionAreaId = params.questionAreaId;
    this.questionPriority = params.questionPriority;
    Object.freeze(this);
  }
}

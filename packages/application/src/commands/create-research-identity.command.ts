/**
 * Purpose:
 * Command to create a new Research Identity aggregate.
 * Represents user intent to establish a new research identity.
 *
 * Architecture reference:
 * Application Layer — CQRS Command Side.
 *
 * ADR reference:
 * ADR-101, ADR-102, ADR-103.
 *
 * Ownership:
 * Application Layer.
 *
 * Invariants:
 * Immutable. Data only. No validation. No business logic.
 * All properties carry primitive values.
 * Application service translates primitives into domain types.
 */

import { Command } from '@rios/shared';

/**
 * CreateResearchIdentityCommand.
 *
 * Carries the primitive data required to construct a new Research Identity
 * aggregate. The application service is responsible for:
 * 1. Creating domain Value Objects from primitives
 * 2. Using domain Factories to construct entities
 * 3. Assembling the aggregate through its create() factory
 * 4. Persisting via the repository contract
 */
export class CreateResearchIdentityCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;

  // Vision
  public readonly visionStatement: string;
  public readonly timeHorizon: string;

  // Agenda
  public readonly agendaFocus: string;
  public readonly agendaStatus: string;

  // Philosophy
  public readonly philosophyStatement: string;
  public readonly philosophyApproach: string;

  // Values
  public readonly valuesStatement: string;

  // Evolution
  public readonly evolutionDescription: string;
  public readonly evolutionStatus: string;

  constructor(params: {
    commandId: string;
    timestamp: Date;
    visionStatement: string;
    timeHorizon: string;
    agendaFocus: string;
    agendaStatus: string;
    philosophyStatement: string;
    philosophyApproach: string;
    valuesStatement: string;
    evolutionDescription: string;
    evolutionStatus: string;
  }) {
    this.commandId = params.commandId;
    this.timestamp = params.timestamp;
    this.visionStatement = params.visionStatement;
    this.timeHorizon = params.timeHorizon;
    this.agendaFocus = params.agendaFocus;
    this.agendaStatus = params.agendaStatus;
    this.philosophyStatement = params.philosophyStatement;
    this.philosophyApproach = params.philosophyApproach;
    this.valuesStatement = params.valuesStatement;
    this.evolutionDescription = params.evolutionDescription;
    this.evolutionStatus = params.evolutionStatus;
    Object.freeze(this);
  }
}

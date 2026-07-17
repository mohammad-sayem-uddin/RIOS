/**
 * Purpose:
 * Factory for creating valid ResearchIdentity aggregate roots.
 * Encapsulates the construction complexity of coordinating Value Objects
 * and Entities into a valid ResearchIdentity aggregate.
 *
 * Architecture reference:
 * Volume I – Identity; Domain Factory ADR.
 *
 * Responsibilities:
 * Accept primitive inputs and construct validated Value Objects.
 * Coordinate VO creation → Entity creation → Aggregate creation.
 * Apply architecture-defined defaults.
 *
 * Does NOT:
 * Save objects, load objects, publish events, call repositories.
 */

import { Result, UniqueId } from '@rios/shared';

import { ResearchIdentity } from '../aggregate/research-identity.js';
import { ResearchAgenda } from '../entities/research-agenda.js';
import { ResearchEvolution } from '../entities/research-evolution.js';
import { ResearchPhilosophy } from '../entities/research-philosophy.js';
import { ResearchValues } from '../entities/research-values.js';
import { ResearchVision } from '../entities/research-vision.js';
import {
  IdentityCreationInvariantError,
  InvalidResearchFocusError,
  InvalidResearchStatusError,
} from '../errors/identity-errors.js';
import {
  ConfidenceLevel,
  ResearchFocus,
  ResearchStatus,
  ResearchVisionStatement,
  TimeHorizon,
} from '../value-objects/identity-value-objects.js';

/**
 * ResearchIdentityFactory — creates valid ResearchIdentity aggregate roots
 * from primitive inputs.
 *
 * Construction strategy:
 * 1. Accept raw strings/primitives for all sub-components
 * 2. Create validated Value Objects for each sub-component
 * 3. Create validated Entities (ResearchVision, ResearchAgenda,
 *    ResearchPhilosophy, ResearchValues, ResearchEvolution) from VOs
 * 4. Delegate to ResearchIdentity.create() for aggregate-level invariant enforcement
 * 5. Return Result<ResearchIdentity>
 *
 * Default initialization strategy:
 * - Aggregate initializes with empty mandatory collections (areas, questions,
 *   goals, contributions, milestones)
 * - Each sub-entity initializes with its own defaults (empty principles, themes, etc.)
 * - Timestamps are automatically managed
 */
export class ResearchIdentityFactory {
  // ─── Construction ───────────────────────────────────────────────────

  /**
   * Create a valid ResearchIdentity aggregate from primitive inputs.
   *
   * Coordinates creation of all 5 required sub-entities from raw values,
   * then assembles them into the aggregate.
   *
   * @param visionStatement - The research vision statement (1-2000 chars)
   * @param timeHorizon - The time horizon for the vision
   * @param agendaFocus - The research agenda focus (1-200 chars)
   * @param agendaStatus - The research agenda status
   * @param philosophyStatement - The philosophy statement
   * @param valuesStatement - The values statement
   * @param values - At least one value
   * @param evolutionDescription - The evolution description
   * @param evolutionStatus - The evolution status
   * @param evolutionConfidence - The confidence level
   * @param id - Optional UniqueId; auto-generated if not provided
   * @returns Result<ResearchIdentity>
   */
  static create(params: {
    visionStatement: string;
    timeHorizon: string;
    agendaFocus: string;
    agendaStatus: string;
    philosophyStatement: string;
    valuesStatement: string;
    values: string[];
    evolutionDescription: string;
    evolutionStatus: string;
    evolutionConfidence: number;
    id?: UniqueId;
  }): Result<ResearchIdentity> {
    const now = new Date().toISOString();

    // ── Step 1: Create Value Objects ──────────────────────────────────
    const visionStatementResult = ResearchVisionStatement.create(params.visionStatement);
    if (visionStatementResult.isFailure) {
      return Result.fail<ResearchIdentity>(visionStatementResult.error);
    }

    const timeHorizonResult = TimeHorizon.create(params.timeHorizon);
    if (timeHorizonResult.isFailure) {
      return Result.fail<ResearchIdentity>(timeHorizonResult.error);
    }

    const agendaFocusResult = ResearchFocus.create(params.agendaFocus);
    if (agendaFocusResult.isFailure) {
      return Result.fail<ResearchIdentity>(
        new InvalidResearchFocusError(agendaFocusResult.error).message,
      );
    }

    const agendaStatusResult = ResearchStatus.create(params.agendaStatus);
    if (agendaStatusResult.isFailure) {
      return Result.fail<ResearchIdentity>(
        new InvalidResearchStatusError(agendaStatusResult.error).message,
      );
    }

    const philosophyStatementResult = ResearchVisionStatement.create(params.philosophyStatement);
    if (philosophyStatementResult.isFailure) {
      return Result.fail<ResearchIdentity>(philosophyStatementResult.error);
    }

    const valuesStatementResult = ResearchVisionStatement.create(params.valuesStatement);
    if (valuesStatementResult.isFailure) {
      return Result.fail<ResearchIdentity>(valuesStatementResult.error);
    }

    const evolutionDescriptionResult = ResearchFocus.create(params.evolutionDescription);
    if (evolutionDescriptionResult.isFailure) {
      return Result.fail<ResearchIdentity>(
        new InvalidResearchFocusError(evolutionDescriptionResult.error).message,
      );
    }

    const evolutionStatusResult = ResearchStatus.create(params.evolutionStatus);
    if (evolutionStatusResult.isFailure) {
      return Result.fail<ResearchIdentity>(
        new InvalidResearchStatusError(evolutionStatusResult.error).message,
      );
    }

    const evolutionConfidenceResult = ConfidenceLevel.create(params.evolutionConfidence);
    if (evolutionConfidenceResult.isFailure) {
      return Result.fail<ResearchIdentity>(evolutionConfidenceResult.error);
    }

    // ── Step 2: Create Entities from Value Objects ────────────────────
    const visionResult = ResearchVision.create({
      vision: visionStatementResult.value,
      timeHorizon: timeHorizonResult.value,
      createdAt: now,
    });
    if (visionResult.isFailure) {
      return Result.fail<ResearchIdentity>(
        new IdentityCreationInvariantError(visionResult.error).message,
      );
    }

    const agendaResult = ResearchAgenda.create({
      focus: agendaFocusResult.value,
      status: agendaStatusResult.value,
      createdAt: now,
    });
    if (agendaResult.isFailure) {
      return Result.fail<ResearchIdentity>(
        new IdentityCreationInvariantError(agendaResult.error).message,
      );
    }

    const philosophyResult = ResearchPhilosophy.create({
      statement: philosophyStatementResult.value,
      createdAt: now,
    });
    if (philosophyResult.isFailure) {
      return Result.fail<ResearchIdentity>(
        new IdentityCreationInvariantError(philosophyResult.error).message,
      );
    }

    const valuesResult = ResearchValues.create({
      statement: valuesStatementResult.value,
      values: params.values,
      createdAt: now,
    });
    if (valuesResult.isFailure) {
      return Result.fail<ResearchIdentity>(
        new IdentityCreationInvariantError(valuesResult.error).message,
      );
    }

    const evolutionResult = ResearchEvolution.create({
      description: evolutionDescriptionResult.value,
      status: evolutionStatusResult.value,
      confidence: evolutionConfidenceResult.value,
      recordedAt: now,
    });
    if (evolutionResult.isFailure) {
      return Result.fail<ResearchIdentity>(
        new IdentityCreationInvariantError(evolutionResult.error).message,
      );
    }

    // ── Step 3: Assemble Aggregate ────────────────────────────────────
    return ResearchIdentity.create({
      vision: visionResult.value,
      agenda: agendaResult.value,
      philosophy: philosophyResult.value,
      values: valuesResult.value,
      evolution: evolutionResult.value,
      createdAt: now,
    });
  }
}

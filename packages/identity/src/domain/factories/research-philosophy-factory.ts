/**
 * Purpose:
 * Factory for creating valid ResearchPhilosophy entities.
 * Encapsulates the construction complexity of coordinating Value Objects
 * into a valid ResearchPhilosophy entity.
 *
 * Architecture reference:
 * Volume I – Identity; Domain Factory ADR.
 *
 * Responsibilities:
 * Accept primitive inputs and construct validated Value Objects.
 * Coordinate VO creation → Entity creation.
 *
 * Does NOT:
 * Save objects, load objects, publish events, call repositories.
 */

import { Result } from '@rios/shared';

import { ResearchPhilosophy } from '../entities/research-philosophy.js';
import { InvalidResearchVisionError } from '../errors/identity-errors.js';
import { ResearchVisionStatement } from '../value-objects/identity-value-objects.js';

/**
 * ResearchPhilosophyFactory — creates valid ResearchPhilosophy entities from primitive inputs.
 *
 * Construction strategy:
 * 1. Accept raw statement string
 * 2. Create validated ResearchVisionStatement Value Object
 * 3. Delegate to ResearchPhilosophy.create() for invariant enforcement
 * 4. Return Result<ResearchPhilosophy>
 */
export class ResearchPhilosophyFactory {
  // ─── Construction ───────────────────────────────────────────────────

  /**
   * Create a valid ResearchPhilosophy from primitive inputs.
   *
   * @param statement - The philosophical statement (1-2000 chars)
   * @returns Result<ResearchPhilosophy>
   */
  static create(params: { statement: string }): Result<ResearchPhilosophy> {
    const statementResult = ResearchVisionStatement.create(params.statement);
    if (statementResult.isFailure) {
      return Result.fail<ResearchPhilosophy>(
        new InvalidResearchVisionError(statementResult.error).message,
      );
    }

    return ResearchPhilosophy.create({
      statement: statementResult.value,
      createdAt: new Date().toISOString(),
    });
  }
}

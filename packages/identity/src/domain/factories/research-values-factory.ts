/**
 * Purpose:
 * Factory for creating valid ResearchValues entities.
 * Encapsulates the construction complexity of coordinating Value Objects
 * into a valid ResearchValues entity.
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

import { ResearchValues } from '../entities/research-values.js';
import { InvalidResearchVisionError } from '../errors/identity-errors.js';
import { ResearchVisionStatement } from '../value-objects/identity-value-objects.js';

/**
 * ResearchValuesFactory — creates valid ResearchValues entities from primitive inputs.
 *
 * Construction strategy:
 * 1. Accept raw statement string and array of values
 * 2. Create validated ResearchVisionStatement Value Object
 * 3. Delegate to ResearchValues.create() for invariant enforcement
 * 4. Return Result<ResearchValues>
 *
 * Note: At least one value must be provided.
 */
export class ResearchValuesFactory {
  // ─── Construction ───────────────────────────────────────────────────

  /**
   * Create a valid ResearchValues from primitive inputs.
   *
   * @param statement - The values statement (1-2000 chars)
   * @param values - Array of individual value strings (at least one required)
   * @returns Result<ResearchValues>
   */
  static create(params: { statement: string; values: string[] }): Result<ResearchValues> {
    const statementResult = ResearchVisionStatement.create(params.statement);
    if (statementResult.isFailure) {
      return Result.fail<ResearchValues>(
        new InvalidResearchVisionError(statementResult.error).message,
      );
    }

    return ResearchValues.create({
      statement: statementResult.value,
      values: params.values,
      createdAt: new Date().toISOString(),
    });
  }
}

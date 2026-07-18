/**
 * Purpose:
 * Factory for creating valid ResearchVision entities.
 * Encapsulates the construction complexity of coordinating Value Objects
 * into a valid ResearchVision entity.
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

import { ResearchVision } from '../entities/research-vision.js';
import { InvalidResearchVisionError, InvalidTimeHorizonError } from '../errors/identity-errors.js';
import { ResearchVisionStatement, TimeHorizon } from '../value-objects/identity-value-objects.js';

/**
 * ResearchVisionFactory — creates valid ResearchVision entities from primitive inputs.
 *
 * Construction strategy:
 * 1. Accept raw statement and timeHorizon strings
 * 2. Create validated ResearchVisionStatement and TimeHorizon Value Objects
 * 3. Delegate to ResearchVision.create() for invariant enforcement
 * 4. Return Result<ResearchVision>
 */
export class ResearchVisionFactory {
  // ─── Construction ───────────────────────────────────────────────────

  /**
   * Create a valid ResearchVision from primitive inputs.
   *
   * @param statement - The vision statement (1-2000 chars)
   * @param timeHorizon - The time horizon string (e.g., '10-20 years')
   * @returns Result<ResearchVision>
   */
  static create(params: { statement: string; timeHorizon: string }): Result<ResearchVision> {
    const statementResult = ResearchVisionStatement.create(params.statement);
    if (statementResult.isFailure) {
      return Result.fail<ResearchVision>(
        new InvalidResearchVisionError(statementResult.error).message,
      );
    }

    const timeHorizonResult = TimeHorizon.create(params.timeHorizon);
    if (timeHorizonResult.isFailure) {
      return Result.fail<ResearchVision>(new InvalidTimeHorizonError(params.timeHorizon).message);
    }

    return ResearchVision.create({
      vision: statementResult.value,
      timeHorizon: timeHorizonResult.value,
      createdAt: new Date().toISOString(),
    });
  }
}

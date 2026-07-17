/**
 * Purpose:
 * Factory for creating valid ResearchContribution entities.
 * Encapsulates the construction complexity of coordinating Value Objects
 * into a valid ResearchContribution entity.
 *
 * Architecture reference:
 * Volume I – Identity; Domain Factory ADR.
 *
 * Responsibilities:
 * Accept primitive inputs and construct validated Value Objects.
 * Coordinate VO creation → Entity creation.
 * Apply architecture-defined defaults.
 *
 * Does NOT:
 * Save objects, load objects, publish events, call repositories.
 */

import { Result } from '@rios/shared';

import { ResearchContribution } from '../entities/research-contribution.js';
import {
  InvalidConfidenceLevelError,
  InvalidResearchFocusError,
} from '../errors/identity-errors.js';
import { ConfidenceLevel, ResearchFocus } from '../value-objects/identity-value-objects.js';

/**
 * ResearchContributionFactory — creates valid ResearchContribution entities
 * from primitive inputs.
 *
 * Construction strategy:
 * 1. Accept raw description, significance, and contributedAt strings
 * 2. Create validated ResearchFocus and ConfidenceLevel Value Objects
 * 3. Delegate to ResearchContribution.create() for invariant enforcement
 * 4. Return Result<ResearchContribution>
 *
 * Default initialization strategy:
 * - Significance defaults to 3 (Moderate) when not provided
 * - contributedAt defaults to the current ISO date when not provided
 * - Timestamps are automatically managed by the entity
 */
export class ResearchContributionFactory {
  /** Default significance level for new contributions. */
  private static readonly DEFAULT_SIGNIFICANCE = 3;

  // ─── Construction ───────────────────────────────────────────────────

  /**
   * Create a valid ResearchContribution from primitive inputs.
   *
   * @param description - The contribution description (1-200 chars, non-empty)
   * @param significance - Optional significance level (1-5); defaults to 3
   * @param contributedAt - Optional ISO date string; defaults to today
   * @returns Result<ResearchContribution>
   */
  static create(params: {
    description: string;
    significance?: number;
    contributedAt?: string;
  }): Result<ResearchContribution> {
    const descriptionResult = ResearchFocus.create(params.description);
    if (descriptionResult.isFailure) {
      return Result.fail<ResearchContribution>(
        new InvalidResearchFocusError(descriptionResult.error).message,
      );
    }

    const significanceLevel =
      params.significance ?? ResearchContributionFactory.DEFAULT_SIGNIFICANCE;
    const significanceResult = ConfidenceLevel.create(significanceLevel);
    if (significanceResult.isFailure) {
      return Result.fail<ResearchContribution>(
        new InvalidConfidenceLevelError(significanceLevel).message,
      );
    }

    const contributedAt = params.contributedAt ?? new Date().toISOString();

    return ResearchContribution.create({
      description: descriptionResult.value,
      significance: significanceResult.value,
      contributedAt,
    });
  }
}

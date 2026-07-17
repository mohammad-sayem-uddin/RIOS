/**
 * Purpose:
 * Factory for creating valid ResearchEvolution entities.
 * Encapsulates the construction complexity of coordinating Value Objects
 * into a valid ResearchEvolution entity.
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

import { ResearchEvolution } from '../entities/research-evolution.js';
import {
  InvalidConfidenceLevelError,
  InvalidResearchFocusError,
  InvalidResearchStatusError,
} from '../errors/identity-errors.js';
import {
  ConfidenceLevel,
  ResearchFocus,
  ResearchStatus,
} from '../value-objects/identity-value-objects.js';

/**
 * ResearchEvolutionFactory — creates valid ResearchEvolution entities
 * from primitive inputs.
 *
 * Construction strategy:
 * 1. Accept raw description, optional status, confidence, and recordedAt
 * 2. Create validated ResearchFocus, ResearchStatus, and ConfidenceLevel VOs
 * 3. Delegate to ResearchEvolution.create() for invariant enforcement
 * 4. Return Result<ResearchEvolution>
 *
 * Default initialization strategy:
 * - Status defaults to "Active" when not provided
 * - Confidence defaults to 3 (Moderate) when not provided
 * - RecordedAt defaults to current ISO timestamp when not provided
 * - Milestones are initialized as empty by the entity
 */
export class ResearchEvolutionFactory {
  /** Default confidence level for new evolution records. */
  private static readonly DEFAULT_CONFIDENCE = 3;

  /** Default status for new evolution records. */
  private static readonly DEFAULT_STATUS = 'Active' as const;

  // ─── Construction ───────────────────────────────────────────────────

  /**
   * Create a valid ResearchEvolution from primitive inputs.
   *
   * @param description - The evolution description (1-200 chars, non-empty)
   * @param status - Optional status string; defaults to "Active"
   * @param confidence - Optional confidence level (1-5); defaults to 3
   * @param recordedAt - Optional ISO timestamp; defaults to now
   * @returns Result<ResearchEvolution>
   */
  static create(params: {
    description: string;
    status?: string;
    confidence?: number;
    recordedAt?: string;
  }): Result<ResearchEvolution> {
    const descriptionResult = ResearchFocus.create(params.description);
    if (descriptionResult.isFailure) {
      return Result.fail<ResearchEvolution>(
        new InvalidResearchFocusError(descriptionResult.error).message,
      );
    }

    const statusValue = params.status ?? ResearchEvolutionFactory.DEFAULT_STATUS;
    const statusResult = ResearchStatus.create(statusValue);
    if (statusResult.isFailure) {
      return Result.fail<ResearchEvolution>(
        new InvalidResearchStatusError(statusResult.error).message,
      );
    }

    const confidenceValue = params.confidence ?? ResearchEvolutionFactory.DEFAULT_CONFIDENCE;
    const confidenceResult = ConfidenceLevel.create(confidenceValue);
    if (confidenceResult.isFailure) {
      return Result.fail<ResearchEvolution>(
        new InvalidConfidenceLevelError(confidenceValue).message,
      );
    }

    const recordedAt = params.recordedAt ?? new Date().toISOString();

    return ResearchEvolution.create({
      description: descriptionResult.value,
      status: statusResult.value,
      confidence: confidenceResult.value,
      recordedAt,
    });
  }
}

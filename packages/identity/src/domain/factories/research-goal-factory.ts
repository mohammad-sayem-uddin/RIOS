/**
 * Purpose:
 * Factory for creating valid ResearchGoal entities.
 * Encapsulates the construction complexity of coordinating Value Objects
 * into a valid ResearchGoal entity.
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

import { ResearchGoal } from '../entities/research-goal.js';
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
 * ResearchGoalFactory — creates valid ResearchGoal entities from primitive inputs.
 *
 * Construction strategy:
 * 1. Accept raw description string, optional status, confidence, deadlineAt
 * 2. Create validated ResearchFocus, ResearchStatus, and ConfidenceLevel VOs
 * 3. Delegate to ResearchGoal.create() for invariant enforcement
 * 4. Return Result<ResearchGoal>
 *
 * Default initialization strategy:
 * - Status defaults to "Active" when not provided
 * - Confidence defaults to 3 (Moderate) when not provided
 * - DeadlineAt defaults to one year from now when not provided
 * - Timestamps are automatically managed by the entity
 */
export class ResearchGoalFactory {
  /** Default confidence level for new research goals. */
  private static readonly DEFAULT_CONFIDENCE = 3;

  /** Default status for new research goals. */
  private static readonly DEFAULT_STATUS = 'Active';

  // ─── Construction ───────────────────────────────────────────────────

  /**
   * Create a valid ResearchGoal from primitive inputs.
   *
   * @param description - The goal description (1-200 chars, non-empty)
   * @param status - Optional status string; defaults to "Active"
   * @param confidence - Optional confidence level (1-5); defaults to 3
   * @param deadlineAt - Optional ISO date string for deadline; defaults to one year from now
   * @returns Result<ResearchGoal>
   */
  static create(params: {
    description: string;
    status?: string;
    confidence?: number;
    deadlineAt?: string;
  }): Result<ResearchGoal> {
    const descriptionResult = ResearchFocus.create(params.description);
    if (descriptionResult.isFailure) {
      return Result.fail<ResearchGoal>(
        new InvalidResearchFocusError(descriptionResult.error).message,
      );
    }

    const statusValue = params.status ?? ResearchGoalFactory.DEFAULT_STATUS;
    const statusResult = ResearchStatus.create(statusValue);
    if (statusResult.isFailure) {
      return Result.fail<ResearchGoal>(new InvalidResearchStatusError(statusResult.error).message);
    }

    const confidenceLevel = params.confidence ?? ResearchGoalFactory.DEFAULT_CONFIDENCE;
    const confidenceResult = ConfidenceLevel.create(confidenceLevel);
    if (confidenceResult.isFailure) {
      return Result.fail<ResearchGoal>(new InvalidConfidenceLevelError(confidenceLevel).message);
    }

    const deadlineAt = params.deadlineAt ?? ResearchGoalFactory.getDefaultDeadline();

    const now = new Date().toISOString();

    return ResearchGoal.create({
      description: descriptionResult.value,
      status: statusResult.value,
      confidence: confidenceResult.value,
      deadlineAt,
      createdAt: now,
    });
  }

  /**
   * Compute default deadline: one year from now.
   */
  private static getDefaultDeadline(): string {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString();
  }
}

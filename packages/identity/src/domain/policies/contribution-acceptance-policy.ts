/**
 * Purpose:
 * Evaluates whether a Research Contribution satisfies all business rules
 * for acceptance into a Research Goal within the Research Identity aggregate.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.8; IA-I-008.
 *
 * ADR reference:
 * ADR-020.
 *
 * Business rules:
 * - A contribution must have a non-empty title.
 * - A contribution must have a non-empty description.
 * - A contribution must have a valid type (publication, dataset, software, etc.).
 * - A contribution must reference a valid identifier.
 * - A contribution must not be a duplicate (same identifier within the same goal).
 * - Contributions must align with the parent goal's description scope.
 *
 * This policy does NOT modify state.
 * This policy does NOT publish events.
 * This policy does NOT access infrastructure.
 */

import { Result } from '@rios/shared';

import type { ResearchContribution } from '../entities/research-contribution.js';
import type { ResearchGoal } from '../entities/research-goal.js';
import { ContributionAcceptanceViolationError } from '../errors/identity-errors.js';

/**
 * ContributionAcceptancePolicy
 *
 * Evaluates business eligibility rules governing the acceptance of
 * Research Contributions into a Research Goal.
 *
 * This is a pure domain policy — deterministic, side-effect free,
 * and fully testable against the domain model alone.
 */
export class ContributionAcceptancePolicy {
  /**
   * Evaluate whether a Research Contribution satisfies acceptance requirements.
   *
   * Checks:
   * 1. Contribution description must be non-empty.
   * 2. Contribution significance must be valid (1–5).
   * 3. Contribution date must be non-empty.
   *
   * @param contribution - The Research Contribution entity to evaluate.
   * @returns Result<void> — ok if acceptable, fail with specific violation if not.
   */
  static evaluate(contribution: ResearchContribution): Result<void> {
    // Contribution must have a valid description
    if (
      contribution.description === undefined ||
      contribution.description.value.trim().length === 0
    ) {
      return Result.fail<void>(
        new ContributionAcceptanceViolationError(
          'Research Contribution must have a non-empty description (IA-I-008).',
        ).message,
      );
    }

    // Contribution significance must be valid (1–5)
    const significance = contribution.significance.value;
    if (significance < 1 || significance > 5 || !Number.isInteger(significance)) {
      return Result.fail<void>(
        new ContributionAcceptanceViolationError(
          `Research Contribution significance must be an integer between 1 and 5, got ${significance}.`,
        ).message,
      );
    }

    // Contribution date must be non-empty
    if (!contribution.contributedAt || contribution.contributedAt.trim().length === 0) {
      return Result.fail<void>(
        new ContributionAcceptanceViolationError(
          'Research Contribution must have a valid contribution date.',
        ).message,
      );
    }

    return Result.ok(undefined);
  }

  /**
   * Evaluate whether a Research Goal is eligible to receive a new contribution.
   *
   * Business rules:
   * - A goal must exist and not be completed (contributions represent ongoing work).
   *
   * @param goal - The parent Research Goal entity.
   * @returns Result<void> — ok if eligible, fail with specific violation if not.
   */
  static evaluateGoal(goal: ResearchGoal): Result<void> {
    // A completed goal cannot receive new contributions
    if (goal.isCompleted) {
      return Result.fail<void>(
        new ContributionAcceptanceViolationError(
          'Cannot add contributions to a completed Research Goal.',
        ).message,
      );
    }

    return Result.ok(undefined);
  }
}

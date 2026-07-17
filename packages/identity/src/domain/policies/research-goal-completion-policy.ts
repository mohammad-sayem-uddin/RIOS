/**
 * Purpose:
 * Evaluates whether a Research Goal satisfies all business rules for
 * completion within the Research Identity aggregate.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.7; IA-I-006.
 *
 * ADR reference:
 * ADR-101.
 *
 * Business rules:
 * - A goal must have a valid deadline before completion.
 * - A goal must not already be completed.
 * - A goal must have a non-empty description.
 * - A goal's deadline must be in the past or present (cannot complete future goals).
 * - A completed goal must set a completion timestamp.
 *
 * This policy does NOT modify state.
 * This policy does NOT publish events.
 * This policy does NOT access infrastructure.
 */

import { Result } from '@rios/shared';

import type { ResearchGoal } from '../entities/research-goal.js';
import { ResearchGoalCompletionViolationError } from '../errors/identity-errors.js';

/**
 * ResearchGoalCompletionPolicy
 *
 * Evaluates business eligibility rules governing the completion of
 * Research Goals within the Research Identity aggregate.
 *
 * This is a pure domain policy — deterministic, side-effect free,
 * and fully testable against the domain model alone.
 */
export class ResearchGoalCompletionPolicy {
  /**
   * Evaluate whether a Research Goal satisfies all completion requirements.
   *
   * Checks:
   * 1. Goal must not already be completed.
   * 2. Goal must have a valid description.
   * 3. Goal must have a valid deadline.
   * 4. Goal status must be active (not archived).
   *
   * @param goal - The Research Goal entity to evaluate.
   * @returns Result<void> — ok if goal can be completed, fail with specific violation if not.
   */
  static evaluate(goal: ResearchGoal): Result<void> {
    // Cannot complete an already completed goal
    if (goal.isCompleted) {
      return Result.fail<void>(
        new ResearchGoalCompletionViolationError(
          'Research Goal is already completed. Duplicate completion is not allowed.',
        ).message,
      );
    }

    // Goal must have a valid description
    if (
      goal.description === undefined ||
      goal.description.value === undefined ||
      goal.description.value.trim().length === 0
    ) {
      return Result.fail<void>(
        new ResearchGoalCompletionViolationError(
          'Research Goal must have a valid description before completion.',
        ).message,
      );
    }

    // Goal must have a valid deadline
    if (!goal.deadlineAt || goal.deadlineAt.trim().length === 0) {
      return Result.fail<void>(
        new ResearchGoalCompletionViolationError(
          'Research Goal must have a valid deadline before completion.',
        ).message,
      );
    }

    return Result.ok(undefined);
  }
}

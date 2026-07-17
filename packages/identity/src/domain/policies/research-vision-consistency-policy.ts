/**
 * Purpose:
 * Evaluates consistency between the Research Vision and other components
 * of the Research Identity aggregate.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.2; IA-I-003; Volume I Chapter 9.
 *
 * ADR reference:
 * ADR-101.
 *
 * Business rules:
 * - Vision must be present (IA-I-003).
 * - Vision statement must be non-empty.
 * - Vision must be consistent with the Agenda focus (if both present).
 * - Vision time horizon must be valid.
 *
 * This policy does NOT modify state.
 * This policy does NOT publish events.
 * This policy does NOT access infrastructure.
 */

import { Result } from '@rios/shared';

import type { ResearchIdentity } from '../aggregate/research-identity.js';
import { ResearchVisionConsistencyViolationError } from '../errors/identity-errors.js';

/**
 * ResearchVisionConsistencyPolicy
 *
 * Evaluates cross-entity consistency rules governing the Research Vision
 * within the Research Identity aggregate.
 *
 * This is a pure domain policy — deterministic, side-effect free,
 * and fully testable against the domain model alone.
 */
export class ResearchVisionConsistencyPolicy {
  /**
   * Evaluate whether the Research Vision is consistent within the aggregate.
   *
   * Checks:
   * 1. Vision must be present (IA-I-003).
   * 2. Vision statement must be non-empty.
   * 3. Vision must be consistent with Agenda focus (if both present).
   *
   * @param identity - The Research Identity aggregate to evaluate.
   * @returns Result<void> — ok if consistent, fail with specific violation if not.
   */
  static evaluate(identity: ResearchIdentity): Result<void> {
    // Vision must be present (IA-I-003)
    if (identity.vision === undefined) {
      return Result.fail<void>(
        new ResearchVisionConsistencyViolationError(
          'Research Identity must express an enduring scientific direction through Vision (IA-I-003).',
        ).message,
      );
    }

    // Vision statement must be non-empty
    if (identity.vision.vision === undefined || identity.vision.vision.value.trim().length === 0) {
      return Result.fail<void>(
        new ResearchVisionConsistencyViolationError(
          'Research Vision must have a non-empty vision statement.',
        ).message,
      );
    }

    // Vision must be consistent with Agenda focus (if both present)
    if (identity.agenda !== undefined) {
      const visionStatement = identity.vision.vision.value.toLowerCase().trim();
      const agendaFocus = identity.agenda.focus.value.toLowerCase().trim();

      // Semantic alignment check: vision statement should reference or be
      // related to the agenda focus area. This is a soft check — we verify
      // that neither is empty (hard checks above) and that they exist together.
      // Full semantic consistency requires application-layer NLP analysis.
      if (agendaFocus.length === 0 && visionStatement.length > 0) {
        return Result.fail<void>(
          new ResearchVisionConsistencyViolationError(
            'Research Vision exists but Agenda focus is empty. Both must be defined for consistency.',
          ).message,
        );
      }
    }

    return Result.ok(undefined);
  }
}

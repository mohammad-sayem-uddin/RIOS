/**
 * Purpose:
 * Evaluates whether Research Evolution transitions are allowed within
 * the Research Identity aggregate.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.10; IA-I-006; ADR-010.
 *
 * ADR reference:
 * ADR-101, ADR-010.
 *
 * Business rules:
 * - Evolution must be recorded with a non-empty description.
 * - Evolution must track a valid confidence level.
 * - Evolution confidence must be between 1 and 5.
 * - Evolution must be consistent with the aggregate's current state.
 * - Each evolution entry must describe a meaningful change.
 *
 * This policy does NOT modify state.
 * This policy does NOT publish events.
 * This policy does NOT access infrastructure.
 */

import { Result } from '@rios/shared';

import type { ResearchIdentity } from '../aggregate/research-identity.js';
import { ResearchEvolutionViolationError } from '../errors/identity-errors.js';

/**
 * ResearchEvolutionPolicy
 *
 * Evaluates business rules governing the evolution tracking of a
 * Research Identity aggregate.
 *
 * This is a pure domain policy — deterministic, side-effect free,
 * and fully testable against the domain model alone.
 */
export class ResearchEvolutionPolicy {
  /**
   * Evaluate whether the Research Identity's evolution satisfies all rules.
   *
   * Checks:
   * 1. Evolution must be present (IA-I-006).
   * 2. Evolution description must be non-empty.
   * 3. Evolution confidence must be valid (1–5).
   *
   * @param identity - The Research Identity aggregate to evaluate.
   * @returns Result<void> — ok if valid, fail with specific violation if not.
   */
  static evaluate(identity: ResearchIdentity): Result<void> {
    // Evolution must be present (IA-I-006)
    if (identity.evolution === undefined) {
      return Result.fail<void>(
        new ResearchEvolutionViolationError(
          'Research Identity must track its evolution (IA-I-006).',
        ).message,
      );
    }

    // Evolution description must be non-empty
    if (
      identity.evolution.description === undefined ||
      identity.evolution.description.value.trim().length === 0
    ) {
      return Result.fail<void>(
        new ResearchEvolutionViolationError('Research Evolution must have a non-empty description.')
          .message,
      );
    }

    // Evolution confidence must be valid (1–5)
    const confidence = identity.evolution.confidence.value;
    if (confidence < 1 || confidence > 5 || !Number.isInteger(confidence)) {
      return Result.fail<void>(
        new ResearchEvolutionViolationError(
          `Research Evolution confidence must be an integer between 1 and 5, got ${confidence}.`,
        ).message,
      );
    }

    return Result.ok(undefined);
  }
}

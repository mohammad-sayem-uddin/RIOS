/**
 * Purpose:
 * Evaluates whether the Research Identity aggregate is complete with
 * all mandatory foundational components.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.8; Volume I Chapter 9 foundational constraints;
 * IA-I-001 through IA-I-006.
 *
 * ADR reference:
 * ADR-101, ADR-102.
 *
 * Business rules:
 * - A Research Identity MUST define a Vision (IA-I-003).
 * - A Research Identity MUST define exactly one primary Research Agenda (IA-I-001).
 * - A Research Identity MUST hold a Philosophy (IA-I-004).
 * - A Research Identity MUST embody Values (IA-I-005).
 * - A Research Identity MUST track Evolution (IA-I-006).
 * - A Research Identity MUST have a non-empty identity summary area collection
 *   OR be a newly created identity (areas are optional at creation).
 *
 * This policy does NOT modify state.
 * This policy does NOT publish events.
 * This policy does NOT access infrastructure.
 */

import { Result } from '@rios/shared';

import type { ResearchIdentity } from '../aggregate/research-identity.js';
import { IdentityCompletenessViolationError } from '../errors/identity-errors.js';

/**
 * IdentityCompletenessPolicy
 *
 * Evaluates whether the Research Identity aggregate satisfies all
 * foundational completeness constraints defined by the architecture.
 *
 * This is a pure domain policy — deterministic, side-effect free,
 * and fully testable against the domain model alone.
 */
export class IdentityCompletenessPolicy {
  /**
   * Evaluate whether the given Research Identity is complete.
   *
   * Checks all mandatory components:
   * 1. Vision must be present and valid.
   * 2. Agenda must be present and valid.
   * 3. Philosophy must be present and valid.
   * 4. Values must be present and valid.
   * 5. Evolution must be present and valid.
   *
   * @param identity - The Research Identity aggregate to evaluate.
   * @returns Result<void> — ok if complete, fail with specific violation if not.
   */
  static evaluate(identity: ResearchIdentity): Result<void> {
    // Check Vision (IA-I-003)
    if (identity.vision === undefined) {
      return Result.fail<void>(
        new IdentityCompletenessViolationError(
          'Vision is required. Research Identity must express an enduring scientific direction (IA-I-003).',
        ).message,
      );
    }

    // Check Agenda (IA-I-001)
    if (identity.agenda === undefined) {
      return Result.fail<void>(
        new IdentityCompletenessViolationError(
          'Agenda is required. Research Identity must define exactly one primary Research Agenda (IA-I-001).',
        ).message,
      );
    }

    // Check Philosophy (IA-I-004)
    if (identity.philosophy === undefined) {
      return Result.fail<void>(
        new IdentityCompletenessViolationError(
          'Philosophy is required. Research Identity must articulate a philosophical approach (IA-I-004).',
        ).message,
      );
    }

    // Check Values (IA-I-005)
    if (identity.values === undefined) {
      return Result.fail<void>(
        new IdentityCompletenessViolationError(
          'Values are required. Research Identity must embody guiding values (IA-I-005).',
        ).message,
      );
    }

    // Check Evolution (IA-I-006)
    if (identity.evolution === undefined) {
      return Result.fail<void>(
        new IdentityCompletenessViolationError(
          'Evolution is required. Research Identity must track its evolution (IA-I-006).',
        ).message,
      );
    }

    return Result.ok(undefined);
  }
}

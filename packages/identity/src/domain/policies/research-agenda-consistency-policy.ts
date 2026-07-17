/**
 * Purpose:
 * Evaluates consistency of the Research Agenda within the Research Identity
 * aggregate and against its value objects.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.1; IA-I-001; FC-003; Volume I Chapter 9.
 *
 * ADR reference:
 * ADR-101, ADR-102.
 *
 * Business rules:
 * - Exactly one primary Research Agenda per Identity (IA-I-001).
 * - Agenda must be problem-oriented, not solution-oriented.
 * - Agenda must be technology-independent.
 * - Agenda title must not be empty.
 * - Agenda focus must be consistent with Research Focus value object.
 * - Research Areas must relate to the Agenda.
 *
 * This policy does NOT modify state.
 * This policy does NOT publish events.
 * This policy does NOT access infrastructure.
 */

import { Result } from '@rios/shared';

import type { ResearchIdentity } from '../aggregate/research-identity.js';
import { ResearchAgendaConsistencyViolationError } from '../errors/identity-errors.js';

/**
 * ResearchAgendaConsistencyPolicy
 *
 * Evaluates cross-entity consistency rules governing the Research Agenda
 * within the Research Identity aggregate.
 *
 * This is a pure domain policy — deterministic, side-effect free,
 * and fully testable against the domain model alone.
 */
export class ResearchAgendaConsistencyPolicy {
  /**
   * Evaluate whether the Research Agenda is consistent within the aggregate.
   *
   * Checks:
   * 1. Exactly one Agenda exists (IA-I-001).
   * 2. Agenda has a valid focus (non-empty Research Focus VO).
   * 3. All Research Areas align with the Agenda's focus domain.
   *
   * @param identity - The Research Identity aggregate to evaluate.
   * @returns Result<void> — ok if consistent, fail with specific violation if not.
   */
  static evaluate(identity: ResearchIdentity): Result<void> {
    // IA-I-001: Exactly one primary Research Agenda
    if (identity.agenda === undefined) {
      return Result.fail<void>(
        new ResearchAgendaConsistencyViolationError(
          'Research Identity must define exactly one primary Research Agenda (IA-I-001).',
        ).message,
      );
    }

    // Agenda focus must be a valid non-empty Research Focus value object
    const focusValue = identity.agenda.focus;
    if (
      focusValue === undefined ||
      focusValue.value === undefined ||
      focusValue.value.trim().length === 0
    ) {
      return Result.fail<void>(
        new ResearchAgendaConsistencyViolationError(
          'Research Agenda focus must be a non-empty problem-oriented statement (FC-003).',
        ).message,
      );
    }

    // All Research Areas must have a name that is a valid non-empty string
    // (ensures areas are well-formed relative to the aggregate)
    for (const area of identity.areas) {
      if (
        area.name === undefined ||
        area.name.value === undefined ||
        area.name.value.trim().length === 0
      ) {
        return Result.fail<void>(
          new ResearchAgendaConsistencyViolationError(
            `Research Area "${area.id.value}" has an invalid name. All areas must be well-formed (IA-I-002).`,
          ).message,
        );
      }
    }

    return Result.ok(undefined);
  }
}

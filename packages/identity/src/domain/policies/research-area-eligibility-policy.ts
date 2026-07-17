/**
 * Purpose:
 * Evaluates whether a Research Area is eligible for inclusion in the
 * Research Identity aggregate.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.4; IA-I-002; SC-004; ADR-106.
 *
 * ADR reference:
 * ADR-101, ADR-106.
 *
 * Business rules:
 * - Research Areas must represent scientific domains (not implementation technologies).
 * - Each area must contribute to the Research Agenda.
 * - Area name must be a well-formed Research Focus value object.
 * - Area must have a valid confidence level.
 * - Duplicate area names within an identity are not permitted.
 *
 * This policy does NOT modify state.
 * This policy does NOT publish events.
 * This policy does NOT access infrastructure.
 */

import { Result } from '@rios/shared';

import type { ResearchIdentity } from '../aggregate/research-identity.js';
import type { ResearchArea } from '../entities/research-area.js';
import { ResearchAreaEligibilityViolationError } from '../errors/identity-errors.js';

/**
 * ResearchAreaEligibilityPolicy
 *
 * Evaluates cross-entity eligibility rules governing the addition of
 * Research Areas to the Research Identity aggregate.
 *
 * This is a pure domain policy — deterministic, side-effect free,
 * and fully testable against the domain model alone.
 */
export class ResearchAreaEligibilityPolicy {
  /**
   * Evaluate whether a candidate Research Area is eligible for inclusion.
   *
   * Checks:
   * 1. Area name must be non-empty and well-formed.
   * 2. Area must not duplicate an existing area name within the identity.
   * 3. Area confidence must be within valid range (1–5).
   *
   * @param identity - The Research Identity aggregate to evaluate against.
   * @param candidateArea - The candidate Research Area to evaluate.
   * @returns Result<void> — ok if eligible, fail with specific violation if not.
   */
  static evaluate(identity: ResearchIdentity, candidateArea: ResearchArea): Result<void> {
    // Area name must be well-formed
    if (
      candidateArea.name === undefined ||
      candidateArea.name.value === undefined ||
      candidateArea.name.value.trim().length === 0
    ) {
      return Result.fail<void>(
        new ResearchAreaEligibilityViolationError(
          'Research Area must have a non-empty, well-formed name (IA-I-002).',
        ).message,
      );
    }

    // Area description must be well-formed
    if (
      candidateArea.description === undefined ||
      candidateArea.description.value === undefined ||
      candidateArea.description.value.trim().length === 0
    ) {
      return Result.fail<void>(
        new ResearchAreaEligibilityViolationError(
          'Research Area must have a non-empty description.',
        ).message,
      );
    }

    // Duplicate area name check (SC-004: no duplicate scientific domains)
    const candidateName = candidateArea.name.value.toLowerCase().trim();
    for (const existingArea of identity.areas) {
      if (existingArea.name.value.toLowerCase().trim() === candidateName) {
        return Result.fail<void>(
          new ResearchAreaEligibilityViolationError(
            `Research Area with name "${candidateArea.name.value}" already exists within this identity (SC-004).`,
          ).message,
        );
      }
    }

    // Confidence level must be valid (1–5)
    const confidence = candidateArea.confidence.value;
    if (confidence < 1 || confidence > 5 || !Number.isInteger(confidence)) {
      return Result.fail<void>(
        new ResearchAreaEligibilityViolationError(
          `Research Area confidence level must be an integer between 1 and 5, got ${confidence}.`,
        ).message,
      );
    }

    return Result.ok(undefined);
  }
}

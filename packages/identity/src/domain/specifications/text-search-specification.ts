/**
 * Purpose:
 * Concrete specification that matches ResearchIdentity aggregates
 * whose textual fields contain a given search term.
 * Used by the exploreResearchIdentities() query.
 *
 * Architecture reference:
 * Domain Specification Pattern; Application Layer CQRS Query Side.
 *
 * ADR reference:
 * ADR-006.
 *
 * Lifecycle:
 * Immutable after construction. Stateful (holds search term).
 *
 * Responsibilities:
 * Represent the business intent "find research identities related to
 * a textual description" as a domain specification.
 * Evaluates case-insensitive containment across identity value objects.
 *
 * Invariants:
 * No infrastructure dependencies.
 * Search term is trimmed and compared case-insensitively.
 * Immutable after construction.
 */

import { ResearchIdentity } from '../aggregate/research-identity.js';

import { ResearchIdentitySpecification } from './research-identity-specification.js';

/**
 * TextSearchSpecification — matches ResearchIdentity aggregates whose
 * textual fields contain the specified search term.
 *
 * Evaluates against:
 * - Vision: vision statement, timeHorizon
 * - Agenda: focus, themes
 * - Areas: name, description
 * - Questions: question text
 * - Philosophy: statement, principles
 * - Values: statement, individual values
 * - Goals: description
 *
 * All comparisons are case-insensitive, trimmed, and locale-independent.
 *
 * Usage:
 * ```typescript
 * const spec = new TextSearchSpecification('machine learning');
 * const result = spec.isSatisfiedBy(identity); // boolean
 * ```
 */
export class TextSearchSpecification extends ResearchIdentitySpecification {
  private readonly normalizedTerm: string;

  constructor(searchTerm: string) {
    super();
    this.normalizedTerm = searchTerm.trim().toLowerCase();
  }

  /**
   * Evaluate whether the given ResearchIdentity contains the search
   * term in any of its textual value object fields.
   *
   * @param identity - The ResearchIdentity aggregate to evaluate.
   * @returns `true` if any text field contains the search term.
   */
  isSatisfiedBy(identity: ResearchIdentity): boolean {
    if (this.normalizedTerm.length === 0) {
      return true;
    }

    // Vision
    if (this.matches(identity.vision.vision.value)) {
      return true;
    }
    if (this.matches(identity.vision.timeHorizon.value)) {
      return true;
    }

    // Agenda
    if (this.matches(identity.agenda.focus.value)) {
      return true;
    }
    for (const theme of identity.agenda.themes) {
      if (this.matches(theme)) {
        return true;
      }
    }

    // Areas
    for (const area of identity.areas) {
      if (this.matches(area.name.value)) {
        return true;
      }
      if (this.matches(area.description.value)) {
        return true;
      }
    }

    // Questions
    for (const question of identity.questions) {
      if (this.matches(question.question.value)) {
        return true;
      }
    }

    // Philosophy
    if (this.matches(identity.philosophy.statement.value)) {
      return true;
    }
    for (const principle of identity.philosophy.principles) {
      if (this.matches(principle)) {
        return true;
      }
    }

    // Values
    if (this.matches(identity.values.statement.value)) {
      return true;
    }
    for (const value of identity.values.values) {
      if (this.matches(value)) {
        return true;
      }
    }

    // Goals
    for (const goal of identity.goals) {
      if (this.matches(goal.description.value)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if a text value contains the normalized search term.
   */
  private matches(text: string): boolean {
    return text.trim().toLowerCase().includes(this.normalizedTerm);
  }
}

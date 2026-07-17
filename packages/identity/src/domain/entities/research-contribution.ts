/**
 * Purpose:
 * Represents a contribution to the scientific body of knowledge.
 * Contributions track what the researcher has produced and its significance.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.9.
 *
 * ADR reference:
 * ADR-101.
 *
 * Lifecycle:
 * Contributions are created and recorded. They are historical facts.
 * They cannot be deleted, only reassessed for significance.
 *
 * Responsibilities:
 * Record contributions to scientific knowledge.
 * Track significance and impact.
 * Support traceability from Vision to Output.
 *
 * Relationships:
 * Research Identity produces → Research Contributions.
 * Research Contributions advance → Research Goals.
 *
 * Owned invariants:
 * Contributions must be recorded with a date and description.
 * Contributions represent actual outcomes, not planned work.
 * Significance can be reassessed over time.
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { ConfidenceLevel, ResearchFocus } from '../value-objects/identity-value-objects.js';

interface ResearchContributionProps {
  /** Description of the contribution. */
  description: ResearchFocus;
  /** The significance of this contribution. */
  significance: ConfidenceLevel;
  /** ISO date string representing when the contribution was made. */
  contributedAt: string;
  /** ISO timestamp of creation. */
  createdAt: string;
  /** ISO timestamp of last update. */
  updatedAt: string;
}

/**
 * ResearchContribution Entity.
 *
 * Represents a contribution to the scientific body of knowledge.
 * Contributions are historical facts that cannot be deleted, only reassessed
 * for their significance over time.
 *
 * The Contribution entity encapsulates:
 * - A validated description (Value Object)
 * - Significance level (Value Object)
 * - The date the contribution was made
 * - Lifecycle timestamps
 *
 * Behavior:
 * - Factory creation with invariant enforcement
 * - Reassessing significance over time
 * - Updating description (for clarity)
 * - Identity-based equality (Entity semantics)
 */
export class ResearchContribution extends Entity<ResearchContributionProps> {
  // ─── Construction ───────────────────────────────────────────────────

  private constructor(props: ResearchContributionProps, id?: UniqueId) {
    super(props, id);
  }

  /**
   * Named factory method: creates a valid ResearchContribution.
   *
   * Invariants enforced:
   * - Description must be a validated ResearchFocus VO
   * - Significance must be a validated ConfidenceLevel VO
   * - contributedAt must be a non-empty ISO date string
   */
  static create(params: {
    description: ResearchFocus;
    significance: ConfidenceLevel;
    contributedAt: string;
  }): Result<ResearchContribution> {
    if (!params.contributedAt || params.contributedAt.trim().length === 0) {
      return Result.fail<ResearchContribution>('contributedAt must be a non-empty ISO date string');
    }

    const now = new Date().toISOString();
    return Result.ok(
      new ResearchContribution({
        description: params.description,
        significance: params.significance,
        contributedAt: params.contributedAt,
        createdAt: now,
        updatedAt: now,
      }),
    );
  }

  /**
   * Named factory method: reconstitutes a ResearchContribution from persistence.
   */
  static reconstitute(params: {
    id: UniqueId;
    description: ResearchFocus;
    significance: ConfidenceLevel;
    contributedAt: string;
    createdAt: string;
    updatedAt: string;
  }): ResearchContribution {
    return new ResearchContribution(
      {
        description: params.description,
        significance: params.significance,
        contributedAt: params.contributedAt,
        createdAt: params.createdAt,
        updatedAt: params.updatedAt,
      },
      params.id,
    );
  }

  // ─── Read-Only Accessors ────────────────────────────────────────────

  /** Description of this contribution. */
  get description(): ResearchFocus {
    return this.props.description;
  }

  /** Significance of this contribution. */
  get significance(): ConfidenceLevel {
    return this.props.significance;
  }

  /** ISO date when the contribution was made. */
  get contributedAt(): string {
    return this.props.contributedAt;
  }

  /** ISO timestamp of creation. */
  get createdAt(): string {
    return this.props.createdAt;
  }

  /** ISO timestamp of last update. */
  get updatedAt(): string {
    return this.props.updatedAt;
  }

  // ─── Behavior ───────────────────────────────────────────────────────

  /**
   * Update the description of this contribution for clarity.
   */
  updateDescription(newDescription: ResearchFocus, updatedAt: string): void {
    this.props.description = newDescription;
    this.props.updatedAt = updatedAt;
  }

  /**
   * Reassess the significance of this contribution over time.
   * Contributions are historical facts, but their perceived significance
   * can change as the research program evolves.
   */
  reassessSignificance(newSignificance: ConfidenceLevel, updatedAt: string): void {
    this.props.significance = newSignificance;
    this.props.updatedAt = updatedAt;
  }
}

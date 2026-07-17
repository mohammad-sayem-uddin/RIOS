/**
 * Purpose:
 * Represents a significant transition in the researcher's identity.
 * Milestones mark important moments but shall not dominate the presentation of identity.
 *
 * Architecture reference:
 * Volume I Chapter 4 section 4.7.
 *
 * ADR reference:
 * ADR-101.
 *
 * Lifecycle:
 * Immutable once recorded. Milestones represent historical facts.
 *
 * Responsibilities:
 * Mark significant transitions in the research journey.
 * Provide historical reference points.
 * Support traceability of evolution.
 *
 * Relationships:
 * Research Evolution traces → Research Milestones.
 * Research Milestones mark → Research Identity transitions.
 *
 * Owned invariants:
 * Milestones represent significant transitions.
 * Milestones shall be recorded but shall not dominate the presentation of identity.
 * A milestone must have a description and a date.
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { ConfidenceLevel, ResearchFocus } from '../value-objects/identity-value-objects.js';

interface ResearchMilestoneProps {
  /** Description of the milestone. */
  description: ResearchFocus;
  /** Confidence level at the time of the milestone. */
  confidence: ConfidenceLevel;
  /** ISO date string representing when the milestone occurred. */
  occurredAt: string;
  /** ISO timestamp of creation. */
  createdAt: string;
}

/**
 * ResearchMilestone Entity.
 *
 * Represents a significant transition in the researcher's identity journey.
 * Milestones are immutable once recorded — they represent historical facts.
 * They provide reference points for understanding how the identity evolved.
 *
 * The Milestone entity encapsulates:
 * - A validated description (Value Object)
 * - Confidence at the time (Value Object)
 * - The date the milestone occurred
 * - Lifecycle timestamps
 *
 * Behavior:
 * - Factory creation with invariant enforcement
 * - Updating confidence (reflection on past)
 * - Identity-based equality (Entity semantics)
 */
export class ResearchMilestone extends Entity<ResearchMilestoneProps> {
  // ─── Construction ───────────────────────────────────────────────────

  private constructor(props: ResearchMilestoneProps, id?: UniqueId) {
    super(props, id);
  }

  /**
   * Named factory method: creates a valid ResearchMilestone.
   *
   * Invariants enforced:
   * - Description must be a validated ResearchFocus VO
   * - Confidence must be a validated ConfidenceLevel VO
   * - occurredAt must be a non-empty ISO date string
   */
  static create(params: {
    description: ResearchFocus;
    confidence: ConfidenceLevel;
    occurredAt: string;
  }): Result<ResearchMilestone> {
    if (!params.occurredAt || params.occurredAt.trim().length === 0) {
      return Result.fail<ResearchMilestone>('occurredAt must be a non-empty ISO date string');
    }

    return Result.ok(
      new ResearchMilestone({
        description: params.description,
        confidence: params.confidence,
        occurredAt: params.occurredAt,
        createdAt: new Date().toISOString(),
      }),
    );
  }

  /**
   * Named factory method: reconstitutes a ResearchMilestone from persistence.
   */
  static reconstitute(params: {
    id: UniqueId;
    description: ResearchFocus;
    confidence: ConfidenceLevel;
    occurredAt: string;
    createdAt: string;
  }): ResearchMilestone {
    return new ResearchMilestone(
      {
        description: params.description,
        confidence: params.confidence,
        occurredAt: params.occurredAt,
        createdAt: params.createdAt,
      },
      params.id,
    );
  }

  // ─── Read-Only Accessors ────────────────────────────────────────────

  /** Description of this milestone. */
  get description(): ResearchFocus {
    return this.props.description;
  }

  /** Confidence level at the time of this milestone. */
  get confidence(): ConfidenceLevel {
    return this.props.confidence;
  }

  /** ISO date when this milestone occurred. */
  get occurredAt(): string {
    return this.props.occurredAt;
  }

  /** ISO timestamp of creation. */
  get createdAt(): string {
    return this.props.createdAt;
  }

  // ─── Behavior ───────────────────────────────────────────────────────

  /**
   * Re-evaluate confidence in the milestone's significance.
   * This does not change the historical fact, only the current reflection.
   */
  reassessConfidence(newConfidence: ConfidenceLevel): void {
    this.props.confidence = newConfidence;
  }
}

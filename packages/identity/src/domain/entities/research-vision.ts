/**
 * Purpose:
 * Represents the long-term destination of a researcher's scientific program.
 * Vision answers: "What kind of knowledge should exist twenty years from now
 * because this researcher pursued it?"
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.6; Volume I Chapter 8 Component A.
 *
 * ADR reference:
 * ADR-101, ADR-103.
 *
 * Lifecycle:
 * Extremely High stability. Vision is aspirational. Changes rarely.
 * Vision must extend beyond current projects (IA-I-005).
 *
 * Responsibilities:
 * Own long-term scientific direction.
 * Distinguish itself from Research Agenda (Vision is aspirational, Agenda is operational).
 * Maintain time horizon consistency (10-20 years).
 *
 * Relationships:
 * Research Identity aspires toward → Research Vision.
 * Research Vision guides → Research Agenda.
 * Research Goals translate → Research Vision into measurable milestones.
 *
 * Owned invariants:
 * IA-I-005: Research Vision SHALL extend beyond current projects.
 * Vision must be non-empty and represent genuine long-term scientific aspiration.
 * Time horizon must reflect long-term scope (minimum 1 year).
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { ResearchVisionStatement, TimeHorizon } from '../value-objects/identity-value-objects.js';

interface ResearchVisionProps {
  /** The immutable vision statement as a Value Object. */
  vision: ResearchVisionStatement;
  /** The time horizon for this vision (e.g., '10-20 years'). */
  timeHorizon: TimeHorizon;
  /** ISO timestamp of when this vision was last refined. */
  lastRefinedAt: string;
  /** ISO timestamp of creation. */
  createdAt: string;
}

/**
 * ResearchVision Entity.
 *
 * Represents the long-term aspirational destination of the research program.
 * Unlike Research Agenda (which is operational), Vision is aspirational.
 * Vision is the highest-stability component in the Identity Architecture Blueprint.
 *
 * The Vision entity encapsulates:
 * - A validated vision statement (Value Object)
 * - A time horizon indicating the scope of the vision
 * - Lifecycle timestamps for tracking refinement
 *
 * Behavior:
 * - Factory creation with invariant enforcement
 * - Vision refinement (with timestamp update)
 * - Identity-based equality (Entity semantics)
 * - Immutable read-only access to internal state
 */
export class ResearchVision extends Entity<ResearchVisionProps> {
  // ─── Construction ───────────────────────────────────────────────────

  private constructor(props: ResearchVisionProps, id?: UniqueId) {
    super(props, id);
  }

  /**
   * Named factory method: creates a valid ResearchVision.
   *
   * Invariants enforced:
   * - Vision statement must be a validated ResearchVision VO (non-empty, 1-2000 chars)
   * - Time horizon must be a validated TimeHorizon VO
   * - createdAt must be a non-empty ISO timestamp
   */
  static create(params: {
    vision: ResearchVisionStatement;
    timeHorizon: TimeHorizon;
    createdAt: string;
  }): Result<ResearchVision> {
    if (!params.createdAt || params.createdAt.trim().length === 0) {
      return Result.fail<ResearchVision>('createdAt must be a non-empty ISO timestamp');
    }

    return Result.ok(
      new ResearchVision({
        vision: params.vision,
        timeHorizon: params.timeHorizon,
        lastRefinedAt: params.createdAt,
        createdAt: params.createdAt,
      }),
    );
  }

  /**
   * Named factory method: reconstitutes a ResearchVision from persistence.
   * Used by repositories/infrastructure to restore entity state.
   */
  static reconstitute(params: {
    id: UniqueId;
    vision: ResearchVisionStatement;
    timeHorizon: TimeHorizon;
    lastRefinedAt: string;
    createdAt: string;
  }): ResearchVision {
    return new ResearchVision(
      {
        vision: params.vision,
        timeHorizon: params.timeHorizon,
        lastRefinedAt: params.lastRefinedAt,
        createdAt: params.createdAt,
      },
      params.id,
    );
  }

  // ─── Read-Only Accessors ────────────────────────────────────────────

  /** The vision statement. */
  get vision(): ResearchVisionStatement {
    return this.props.vision;
  }

  /** The time horizon for this vision. */
  get timeHorizon(): TimeHorizon {
    return this.props.timeHorizon;
  }

  /** ISO timestamp of when this vision was last refined. */
  get lastRefinedAt(): string {
    return this.props.lastRefinedAt;
  }

  /** ISO timestamp of entity creation. */
  get createdAt(): string {
    return this.props.createdAt;
  }

  // ─── Behavior ───────────────────────────────────────────────────────

  /**
   * Refine the vision statement.
   *
   * Invariants preserved:
   * - New vision must be a validated ResearchVision VO
   * - Time horizon must remain consistent (Vision changes rarely)
   * - lastRefinedAt is updated to the provided timestamp
   *
   * @param refinedVision - The new validated vision statement
   * @param refinedAt - ISO timestamp of refinement
   */
  refine(refinedVision: ResearchVisionStatement, refinedAt: string): void {
    this.props.vision = refinedVision;
    this.props.lastRefinedAt = refinedAt;
  }

  /**
   * Update the time horizon for this vision.
   *
   * @param newTimeHorizon - The new validated time horizon
   */
  updateTimeHorizon(newTimeHorizon: TimeHorizon): void {
    this.props.timeHorizon = newTimeHorizon;
  }
}

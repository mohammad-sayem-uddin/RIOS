/**
 * Purpose:
 * Represents a record of how the researcher's focus has evolved over time.
 * Research Evolution preserves historical continuity and traceability.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.8; Volume I Chapter 4 evolution rules.
 *
 * ADR reference:
 * ADR-101.
 *
 * Lifecycle:
 * Append-only. Evolution preserves historical continuity and traceability.
 * No historical identity shall be deleted. Evolution must be additive.
 *
 * Responsibilities:
 * Record how identity evolves.
 * Preserve historical traceability.
 * Maintain continuity across transitions.
 *
 * Relationships:
 * Research Identity records → Research Evolution.
 * Research Evolution traces → Research Milestones.
 *
 * Owned invariants:
 * Evolution must preserve historical continuity and traceability.
 * No historical identity shall be deleted.
 * Evolution must be additive.
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { DuplicateEntityItemError, EntityItemNotFoundError } from '../errors/identity-errors.js';
import {
  ConfidenceLevel,
  ResearchFocus,
  ResearchStatus,
} from '../value-objects/identity-value-objects.js';

interface ResearchEvolutionProps {
  /** Description of the evolution entry. */
  description: ResearchFocus;
  /** Status at the time of this evolution entry. */
  status: ResearchStatus;
  /** Confidence in the new direction. */
  confidence: ConfidenceLevel;
  /** Ordered list of milestone IDs associated with this evolution entry. */
  readonly _milestoneIds: UniqueId[];
  /** ISO timestamp when this evolution was recorded. */
  recordedAt: string;
  /** ISO timestamp of creation. */
  createdAt: string;
}

/**
 * ResearchEvolution Entity.
 *
 * Records a single evolution point in the researcher's identity journey.
 * Evolution entries are append-only — they preserve historical continuity.
 * Historical entries cannot be deleted or modified, only extended.
 *
 * The Evolution entity encapsulates:
 * - A validated description of the evolution (Value Object)
 * - Status and confidence at the time (Value Objects)
 * - A collection of milestone IDs (relationships)
 * - Lifecycle timestamps
 *
 * Behavior:
 * - Factory creation with invariant enforcement
 * - Adding milestones (with duplicate prevention)
 * - Updating description and confidence (not historical status)
 * - Identity-based equality (Entity semantics)
 */
export class ResearchEvolution extends Entity<ResearchEvolutionProps> {
  // ─── Construction ───────────────────────────────────────────────────

  private constructor(props: ResearchEvolutionProps, id?: UniqueId) {
    super(props, id);
  }

  /**
   * Named factory method: creates a valid ResearchEvolution entry.
   *
   * Invariants enforced:
   * - Description must be a validated ResearchFocus VO
   * - Status must be a validated ResearchStatus VO
   * - Confidence must be a validated ConfidenceLevel VO
   * - recordedAt must be a non-empty ISO timestamp
   */
  static create(params: {
    description: ResearchFocus;
    status: ResearchStatus;
    confidence: ConfidenceLevel;
    recordedAt: string;
  }): Result<ResearchEvolution> {
    if (!params.recordedAt || params.recordedAt.trim().length === 0) {
      return Result.fail<ResearchEvolution>('recordedAt must be a non-empty ISO timestamp');
    }

    return Result.ok(
      new ResearchEvolution({
        description: params.description,
        status: params.status,
        confidence: params.confidence,
        _milestoneIds: [],
        recordedAt: params.recordedAt,
        createdAt: params.recordedAt,
      }),
    );
  }

  /**
   * Named factory method: reconstitutes a ResearchEvolution from persistence.
   */
  static reconstitute(params: {
    id: UniqueId;
    description: ResearchFocus;
    status: ResearchStatus;
    confidence: ConfidenceLevel;
    milestoneIds: UniqueId[];
    recordedAt: string;
    createdAt: string;
  }): ResearchEvolution {
    return new ResearchEvolution(
      {
        description: params.description,
        status: params.status,
        confidence: params.confidence,
        _milestoneIds: [...params.milestoneIds],
        recordedAt: params.recordedAt,
        createdAt: params.createdAt,
      },
      params.id,
    );
  }

  // ─── Read-Only Accessors ────────────────────────────────────────────

  /** Description of this evolution entry. */
  get description(): ResearchFocus {
    return this.props.description;
  }

  /** Status at the time of this evolution entry. */
  get status(): ResearchStatus {
    return this.props.status;
  }

  /** Confidence in this direction. */
  get confidence(): ConfidenceLevel {
    return this.props.confidence;
  }

  /** Read-only view of milestone IDs. */
  get milestoneIds(): readonly UniqueId[] {
    return Object.freeze([...this.props._milestoneIds]);
  }

  /** ISO timestamp when this evolution was recorded. */
  get recordedAt(): string {
    return this.props.recordedAt;
  }

  /** ISO timestamp of creation. */
  get createdAt(): string {
    return this.props.createdAt;
  }

  // ─── Behavior ───────────────────────────────────────────────────────

  /**
   * Update the description of this evolution entry.
   */
  updateDescription(newDescription: ResearchFocus, _updatedAt: string): void {
    this.props.description = newDescription;
  }

  /**
   * Update the confidence level.
   */
  updateConfidence(newConfidence: ConfidenceLevel): void {
    this.props.confidence = newConfidence;
  }

  /**
   * Add a milestone to this evolution entry.
   *
   * Invariant: Prevents duplicate milestone IDs.
   */
  addMilestone(milestoneId: UniqueId): Result<void> {
    if (this.props._milestoneIds.some((id) => id.equals(milestoneId))) {
      return Result.fail<void>(
        new DuplicateEntityItemError(`Milestone with ID ${milestoneId.value}`).message,
      );
    }
    this.props._milestoneIds.push(milestoneId);
    return Result.ok(undefined);
  }

  /**
   * Remove a milestone from this evolution entry.
   */
  removeMilestone(milestoneId: UniqueId): Result<void> {
    const index = this.props._milestoneIds.findIndex((id) => id.equals(milestoneId));
    if (index === -1) {
      return Result.fail<void>(
        new EntityItemNotFoundError(`Milestone with ID ${milestoneId.value}`).message,
      );
    }
    this.props._milestoneIds.splice(index, 1);
    return Result.ok(undefined);
  }

  /**
   * Check if this evolution entry has a specific milestone.
   */
  hasMilestone(milestoneId: UniqueId): boolean {
    return this.props._milestoneIds.some((id) => id.equals(milestoneId));
  }
}

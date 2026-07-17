/**
 * Purpose:
 * Represents a measurable, time-bound objective that translates the research vision.
 * Goals decompose Vision into achievable objectives with clear completion criteria.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.7.
 *
 * ADR reference:
 * ADR-101.
 *
 * Lifecycle:
 * Goals are created, pursued, and completed.
 * Goals translate Vision into measurable milestones.
 *
 * Responsibilities:
 * Define measurable objectives.
 * Translate Vision into achievable milestones.
 * Track progress toward Vision.
 *
 * Relationships:
 * Research Goals translate → Research Vision into measurable milestones.
 * Research Goals are organized by → Research Areas.
 *
 * Owned invariants:
 * Goals must be measurable and time-bound.
 * Goals must translate Vision into achievable objectives.
 * A goal must have a description and a deadline.
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import {
  ConfidenceLevel,
  ResearchFocus,
  ResearchStatus,
} from '../value-objects/identity-value-objects.js';

interface ResearchGoalProps {
  /** Description of the goal. */
  description: ResearchFocus;
  /** Current status of the goal. */
  status: ResearchStatus;
  /** Confidence in achieving this goal. */
  confidence: ConfidenceLevel;
  /** ISO date string for the deadline. */
  deadlineAt: string;
  /** ISO timestamp of completion (null if not yet completed). */
  completedAt: string | null;
  /** ISO timestamp of creation. */
  createdAt: string;
  /** ISO timestamp of last update. */
  updatedAt: string;
}

/**
 * ResearchGoal Entity.
 *
 * Represents a measurable, time-bound objective that translates the Vision
 * into achievable milestones. Goals have a clear deadline and completion criteria.
 *
 * The Goal entity encapsulates:
 * - A validated description (Value Object)
 * - Current status and confidence (Value Objects)
 * - Deadline and completion timestamps
 * - Lifecycle timestamps
 *
 * Behavior:
 * - Factory creation with invariant enforcement
 * - Marking as completed (with timestamp)
 * - Updating description, status, confidence, deadline
 * - Identity-based equality (Entity semantics)
 */
export class ResearchGoal extends Entity<ResearchGoalProps> {
  // ─── Construction ───────────────────────────────────────────────────

  private constructor(props: ResearchGoalProps, id?: UniqueId) {
    super(props, id);
  }

  /**
   * Named factory method: creates a valid ResearchGoal.
   *
   * Invariants enforced:
   * - Description must be a validated ResearchFocus VO
   * - Status must be a validated ResearchStatus VO
   * - Confidence must be a validated ConfidenceLevel VO
   * - deadlineAt must be a non-empty ISO date string
   */
  static create(params: {
    description: ResearchFocus;
    status: ResearchStatus;
    confidence: ConfidenceLevel;
    deadlineAt: string;
    createdAt: string;
  }): Result<ResearchGoal> {
    if (!params.deadlineAt || params.deadlineAt.trim().length === 0) {
      return Result.fail<ResearchGoal>('deadlineAt must be a non-empty ISO date string');
    }

    if (!params.createdAt || params.createdAt.trim().length === 0) {
      return Result.fail<ResearchGoal>('createdAt must be a non-empty ISO timestamp');
    }

    return Result.ok(
      new ResearchGoal({
        description: params.description,
        status: params.status,
        confidence: params.confidence,
        deadlineAt: params.deadlineAt,
        completedAt: null,
        createdAt: params.createdAt,
        updatedAt: params.createdAt,
      }),
    );
  }

  /**
   * Named factory method: reconstitutes a ResearchGoal from persistence.
   */
  static reconstitute(params: {
    id: UniqueId;
    description: ResearchFocus;
    status: ResearchStatus;
    confidence: ConfidenceLevel;
    deadlineAt: string;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
  }): ResearchGoal {
    return new ResearchGoal(
      {
        description: params.description,
        status: params.status,
        confidence: params.confidence,
        deadlineAt: params.deadlineAt,
        completedAt: params.completedAt,
        createdAt: params.createdAt,
        updatedAt: params.updatedAt,
      },
      params.id,
    );
  }

  // ─── Read-Only Accessors ────────────────────────────────────────────

  /** Description of this goal. */
  get description(): ResearchFocus {
    return this.props.description;
  }

  /** Current status. */
  get status(): ResearchStatus {
    return this.props.status;
  }

  /** Confidence in achieving this goal. */
  get confidence(): ConfidenceLevel {
    return this.props.confidence;
  }

  /** ISO date of the deadline. */
  get deadlineAt(): string {
    return this.props.deadlineAt;
  }

  /** ISO timestamp of completion, or null if not yet completed. */
  get completedAt(): string | null {
    return this.props.completedAt;
  }

  /** Whether this goal has been completed. */
  get isCompleted(): boolean {
    return this.props.completedAt !== null;
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
   * Update the goal description.
   *
   * Invariant: Cannot update a completed goal.
   */
  updateDescription(newDescription: ResearchFocus, updatedAt: string): Result<void> {
    if (this.isCompleted) {
      return Result.fail<void>('Cannot update a completed goal');
    }
    this.props.description = newDescription;
    this.props.updatedAt = updatedAt;
    return Result.ok(undefined);
  }

  /**
   * Update the goal status.
   */
  updateStatus(newStatus: ResearchStatus, updatedAt: string): void {
    this.props.status = newStatus;
    this.props.updatedAt = updatedAt;
  }

  /**
   * Update the confidence level.
   */
  updateConfidence(newConfidence: ConfidenceLevel, updatedAt: string): void {
    this.props.confidence = newConfidence;
    this.props.updatedAt = updatedAt;
  }

  /**
   * Update the deadline.
   *
   * Invariant: Cannot update a completed goal's deadline.
   */
  updateDeadline(newDeadline: string, updatedAt: string): Result<void> {
    if (this.isCompleted) {
      return Result.fail<void>('Cannot update deadline of a completed goal');
    }
    if (!newDeadline || newDeadline.trim().length === 0) {
      return Result.fail<void>('deadlineAt must be a non-empty ISO date string');
    }
    this.props.deadlineAt = newDeadline;
    this.props.updatedAt = updatedAt;
    return Result.ok(undefined);
  }

  /**
   * Mark the goal as completed.
   *
   * Invariant: Cannot complete an already completed goal.
   */
  markCompleted(completedAt: string): Result<void> {
    if (this.isCompleted) {
      return Result.fail<void>('Goal is already completed');
    }
    this.props.completedAt = completedAt;
    this.props.updatedAt = completedAt;
    return Result.ok(undefined);
  }
}

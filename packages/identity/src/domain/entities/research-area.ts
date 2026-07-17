/**
 * Purpose:
 * Represents a persistent scientific domain that organizes investigations.
 * Research Areas organize investigations. They SHALL NOT represent implementation technologies.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.4; Volume I Chapter 8 Component C.
 *
 * ADR reference:
 * ADR-101, ADR-106.
 *
 * Lifecycle:
 * Medium stability. 3-10 year time horizon.
 *
 * Responsibilities:
 * Group scientific domains.
 * Maintain intellectual organization.
 * Preserve semantic hierarchy.
 *
 * Relationships:
 * Research Agenda organizes → Research Areas.
 * Research Areas generate → Research Questions.
 * IA-I-002: Every Research Area SHALL contribute to the Research Agenda.
 *
 * Owned invariants:
 * Research Area must represent a persistent scientific domain, not an implementation technology.
 * Research Area must contribute to the Research Agenda.
 * Research Area must have a non-empty name.
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { DuplicateEntityItemError, EntityItemNotFoundError } from '../errors/identity-errors.js';
import {
  ConfidenceLevel,
  ResearchFocus,
  ResearchStatus,
} from '../value-objects/identity-value-objects.js';

interface ResearchAreaProps {
  /** Name of the scientific domain (e.g., "Computer Vision"). */
  name: ResearchFocus;
  /** Description of the research area. */
  description: ResearchFocus;
  /** Current status of this area (Active, Exploratory, Archived). */
  status: ResearchStatus;
  /** Confidence level in this research direction. */
  confidence: ConfidenceLevel;
  /** Ordered list of research question IDs within this area. */
  readonly _questionIds: UniqueId[];
  /** ISO timestamp of creation. */
  createdAt: string;
  /** ISO timestamp of last update. */
  updatedAt: string;
}

/**
 * ResearchArea Entity.
 *
 * Represents a persistent scientific domain (e.g., Computer Vision, Robotics).
 * Research Areas organize investigations and maintain intellectual organization.
 * They must NOT represent implementation technologies (IA semantic constraint).
 *
 * The Area entity encapsulates:
 * - A validated name (Value Object)
 * - A validated description (Value Object)
 * - Current status and confidence level (Value Objects)
 * - A collection of Research Question IDs (relationships)
 * - Lifecycle timestamps
 *
 * Behavior:
 * - Factory creation with invariant enforcement
 * - Adding/removing research questions (with duplicate prevention)
 * - Updating name, description, status, confidence
 * - Identity-based equality (Entity semantics)
 */
export class ResearchArea extends Entity<ResearchAreaProps> {
  // ─── Construction ───────────────────────────────────────────────────

  private constructor(props: ResearchAreaProps, id?: UniqueId) {
    super(props, id);
  }

  /**
   * Named factory method: creates a valid ResearchArea.
   *
   * Invariants enforced:
   * - Name must be a validated ResearchFocus VO
   * - Description must be a validated ResearchFocus VO
   * - Status must be a validated ResearchStatus VO
   * - Confidence must be a validated ConfidenceLevel VO
   */
  static create(params: {
    name: ResearchFocus;
    description: ResearchFocus;
    status: ResearchStatus;
    confidence: ConfidenceLevel;
    createdAt: string;
  }): Result<ResearchArea> {
    if (!params.createdAt || params.createdAt.trim().length === 0) {
      return Result.fail<ResearchArea>('createdAt must be a non-empty ISO timestamp');
    }

    return Result.ok(
      new ResearchArea({
        name: params.name,
        description: params.description,
        status: params.status,
        confidence: params.confidence,
        _questionIds: [],
        createdAt: params.createdAt,
        updatedAt: params.createdAt,
      }),
    );
  }

  /**
   * Named factory method: reconstitutes a ResearchArea from persistence.
   */
  static reconstitute(params: {
    id: UniqueId;
    name: ResearchFocus;
    description: ResearchFocus;
    status: ResearchStatus;
    confidence: ConfidenceLevel;
    questionIds: UniqueId[];
    createdAt: string;
    updatedAt: string;
  }): ResearchArea {
    return new ResearchArea(
      {
        name: params.name,
        description: params.description,
        status: params.status,
        confidence: params.confidence,
        _questionIds: [...params.questionIds],
        createdAt: params.createdAt,
        updatedAt: params.updatedAt,
      },
      params.id,
    );
  }

  // ─── Read-Only Accessors ────────────────────────────────────────────

  /** The name of this scientific domain. */
  get name(): ResearchFocus {
    return this.props.name;
  }

  /** Description of this research area. */
  get description(): ResearchFocus {
    return this.props.description;
  }

  /** Current status. */
  get status(): ResearchStatus {
    return this.props.status;
  }

  /** Confidence level in this direction. */
  get confidence(): ConfidenceLevel {
    return this.props.confidence;
  }

  /** Read-only view of research question IDs. */
  get questionIds(): readonly UniqueId[] {
    return Object.freeze([...this.props._questionIds]);
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
   * Update the area name.
   */
  updateName(newName: ResearchFocus, updatedAt: string): void {
    this.props.name = newName;
    this.props.updatedAt = updatedAt;
  }

  /**
   * Update the area description.
   */
  updateDescription(newDescription: ResearchFocus, updatedAt: string): void {
    this.props.description = newDescription;
    this.props.updatedAt = updatedAt;
  }

  /**
   * Update the area status.
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
   * Add a research question to this area.
   *
   * Invariant: Prevents duplicate question IDs.
   */
  addQuestion(questionId: UniqueId, updatedAt: string): Result<void> {
    if (this.props._questionIds.some((id) => id.equals(questionId))) {
      return Result.fail<void>(
        new DuplicateEntityItemError(`Research Question with ID ${questionId.value}`).message,
      );
    }
    this.props._questionIds.push(questionId);
    this.props.updatedAt = updatedAt;
    return Result.ok(undefined);
  }

  /**
   * Remove a research question from this area.
   */
  removeQuestion(questionId: UniqueId, updatedAt: string): Result<void> {
    const index = this.props._questionIds.findIndex((id) => id.equals(questionId));
    if (index === -1) {
      return Result.fail<void>(
        new EntityItemNotFoundError(`Research Question with ID ${questionId.value}`).message,
      );
    }
    this.props._questionIds.splice(index, 1);
    this.props.updatedAt = updatedAt;
    return Result.ok(undefined);
  }

  /**
   * Check if this area contains a specific question.
   */
  hasQuestion(questionId: UniqueId): boolean {
    return this.props._questionIds.some((id) => id.equals(questionId));
  }
}

/**
 * Purpose:
 * Represents a permanent architectural entity within the research ontology.
 * Research Questions exist before Projects and outlive them.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.4; Volume I Chapter 8 Component D.
 *
 * ADR reference:
 * ADR-101.
 *
 * Lifecycle:
 * Permanent architectural entity. Questions exist before Projects.
 *
 * Responsibilities:
 * Define what the researcher is trying to understand.
 * Organize the scientific inquiry structure.
 * Maintain semantic integrity of the question ontology.
 *
 * Relationships:
 * Research Questions exist before → Projects.
 * Research Areas generate → Research Questions.
 * IA-I-003: Research Questions SHALL NOT be resolved by architectural decision.
 *
 * Owned invariants:
 * Research Questions must be non-empty and well-formed.
 * Research Questions are permanent; they cannot be "resolved" by a single decision.
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import {
  ConfidenceLevel,
  ResearchFocus,
  ResearchStatus,
} from '../value-objects/identity-value-objects.js';

interface ResearchQuestionProps {
  /** The question statement as a validated Value Object. */
  question: ResearchFocus;
  /** Why this question matters — the scientific motivation. */
  motivation: ResearchFocus;
  /** Current research status for this question. */
  status: ResearchStatus;
  /** Confidence level in the current direction of investigation. */
  confidence: ConfidenceLevel;
  /** ISO timestamp of creation. */
  createdAt: string;
  /** ISO timestamp of last update. */
  updatedAt: string;
}

/**
 * ResearchQuestion Entity.
 *
 * A permanent architectural entity representing a scientific question.
 * Questions exist before Projects and outlive them. They define what the
 * researcher is trying to understand.
 *
 * The Question entity encapsulates:
 * - A validated question statement (Value Object)
 * - A validated motivation statement (Value Object)
 * - Current status and confidence level (Value Objects)
 * - Lifecycle timestamps
 *
 * Behavior:
 * - Factory creation with invariant enforcement
 * - Updating question, motivation, status, confidence
 * - Identity-based equality (Entity semantics)
 */
export class ResearchQuestion extends Entity<ResearchQuestionProps> {
  // ─── Construction ───────────────────────────────────────────────────

  private constructor(props: ResearchQuestionProps, id?: UniqueId) {
    super(props, id);
  }

  /**
   * Named factory method: creates a valid ResearchQuestion.
   *
   * Invariants enforced:
   * - Question must be a validated ResearchFocus VO
   * - Motivation must be a validated ResearchFocus VO
   * - Status must be a validated ResearchStatus VO
   * - Confidence must be a validated ConfidenceLevel VO
   */
  static create(params: {
    question: ResearchFocus;
    motivation: ResearchFocus;
    status: ResearchStatus;
    confidence: ConfidenceLevel;
    createdAt: string;
  }): Result<ResearchQuestion> {
    if (!params.createdAt || params.createdAt.trim().length === 0) {
      return Result.fail<ResearchQuestion>('createdAt must be a non-empty ISO timestamp');
    }

    return Result.ok(
      new ResearchQuestion({
        question: params.question,
        motivation: params.motivation,
        status: params.status,
        confidence: params.confidence,
        createdAt: params.createdAt,
        updatedAt: params.createdAt,
      }),
    );
  }

  /**
   * Named factory method: reconstitutes a ResearchQuestion from persistence.
   */
  static reconstitute(params: {
    id: UniqueId;
    question: ResearchFocus;
    motivation: ResearchFocus;
    status: ResearchStatus;
    confidence: ConfidenceLevel;
    createdAt: string;
    updatedAt: string;
  }): ResearchQuestion {
    return new ResearchQuestion(
      {
        question: params.question,
        motivation: params.motivation,
        status: params.status,
        confidence: params.confidence,
        createdAt: params.createdAt,
        updatedAt: params.updatedAt,
      },
      params.id,
    );
  }

  // ─── Read-Only Accessors ────────────────────────────────────────────

  /** The question statement. */
  get question(): ResearchFocus {
    return this.props.question;
  }

  /** Scientific motivation for this question. */
  get motivation(): ResearchFocus {
    return this.props.motivation;
  }

  /** Current status. */
  get status(): ResearchStatus {
    return this.props.status;
  }

  /** Confidence level. */
  get confidence(): ConfidenceLevel {
    return this.props.confidence;
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
   * Refine the question statement.
   */
  refineQuestion(newQuestion: ResearchFocus, updatedAt: string): void {
    this.props.question = newQuestion;
    this.props.updatedAt = updatedAt;
  }

  /**
   * Update the motivation.
   */
  updateMotivation(newMotivation: ResearchFocus, updatedAt: string): void {
    this.props.motivation = newMotivation;
    this.props.updatedAt = updatedAt;
  }

  /**
   * Update the status.
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
}

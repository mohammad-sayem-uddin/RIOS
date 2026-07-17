/**
 * Purpose:
 * Represents the researcher's fundamental approach to scientific inquiry.
 * Research Philosophy explains WHY the researcher approaches problems the way they do.
 * Research Philosophy remains independent of specific technologies.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.2; Volume I Chapter 8 Component E.
 *
 * ADR reference:
 * ADR-005, ADR-101.
 *
 * Lifecycle:
 * High stability. Changes rarely.
 *
 * Responsibilities:
 * Articulate the researcher's scientific worldview.
 * Guide methodological choices.
 * Provide philosophical grounding for research decisions.
 *
 * Relationships:
 * Research Identity expresses → Research Philosophy.
 * Research Philosophy informs → Research Methods.
 *
 * Owned invariants:
 * Research Philosophy must remain independent of specific technologies.
 * Research Philosophy explains WHY the researcher approaches problems.
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { ResearchVisionStatement } from '../value-objects/identity-value-objects.js';

interface ResearchPhilosophyProps {
  /** The philosophical statement as a validated Value Object. */
  statement: ResearchVisionStatement;
  /** Key principles derived from this philosophy. */
  readonly _principles: string[];
  /** ISO timestamp of creation. */
  createdAt: string;
  /** ISO timestamp of last update. */
  updatedAt: string;
}

/**
 * ResearchPhilosophy Entity.
 *
 * Represents the researcher's fundamental approach to scientific inquiry.
 * Philosophy explains WHY the researcher approaches problems the way they do.
 * It must remain technology-independent (no tool or framework references).
 *
 * The Philosophy entity encapsulates:
 * - A validated philosophical statement (Value Object)
 * - A collection of key principles (domain vocabulary)
 * - Lifecycle timestamps
 *
 * Behavior:
 * - Factory creation with invariant enforcement
 * - Adding/removing principles (with duplicate prevention)
 * - Refining the philosophical statement
 * - Identity-based equality (Entity semantics)
 */
export class ResearchPhilosophy extends Entity<ResearchPhilosophyProps> {
  // ─── Construction ───────────────────────────────────────────────────

  private constructor(props: ResearchPhilosophyProps, id?: UniqueId) {
    super(props, id);
  }

  /**
   * Named factory method: creates a valid ResearchPhilosophy.
   *
   * Invariants enforced:
   * - Statement must be a validated ResearchVision VO (non-empty, 1-2000 chars)
   * - createdAt must be a non-empty ISO timestamp
   */
  static create(params: {
    statement: ResearchVisionStatement;
    createdAt: string;
  }): Result<ResearchPhilosophy> {
    if (!params.createdAt || params.createdAt.trim().length === 0) {
      return Result.fail<ResearchPhilosophy>('createdAt must be a non-empty ISO timestamp');
    }

    return Result.ok(
      new ResearchPhilosophy({
        statement: params.statement,
        _principles: [],
        createdAt: params.createdAt,
        updatedAt: params.createdAt,
      }),
    );
  }

  /**
   * Named factory method: reconstitutes a ResearchPhilosophy from persistence.
   */
  static reconstitute(params: {
    id: UniqueId;
    statement: ResearchVisionStatement;
    principles: string[];
    createdAt: string;
    updatedAt: string;
  }): ResearchPhilosophy {
    return new ResearchPhilosophy(
      {
        statement: params.statement,
        _principles: [...params.principles],
        createdAt: params.createdAt,
        updatedAt: params.updatedAt,
      },
      params.id,
    );
  }

  // ─── Read-Only Accessors ────────────────────────────────────────────

  /** The philosophical statement. */
  get statement(): ResearchVisionStatement {
    return this.props.statement;
  }

  /** Read-only view of key principles. */
  get principles(): readonly string[] {
    return Object.freeze([...this.props._principles]);
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
   * Refine the philosophical statement.
   */
  refineStatement(newStatement: ResearchVisionStatement, updatedAt: string): void {
    this.props.statement = newStatement;
    this.props.updatedAt = updatedAt;
  }

  /**
   * Add a principle to the philosophy.
   *
   * Invariant: Prevents duplicate principles (case-insensitive).
   */
  addPrinciple(principle: string, updatedAt: string): Result<void> {
    const normalized = principle.trim();
    if (normalized.length === 0) {
      return Result.fail<void>('Principle must be a non-empty string');
    }
    if (this.props._principles.some((p) => p.toLowerCase() === normalized.toLowerCase())) {
      return Result.fail<void>(`Duplicate principle: "${normalized}"`);
    }
    this.props._principles.push(normalized);
    this.props.updatedAt = updatedAt;
    return Result.ok(undefined);
  }

  /**
   * Remove a principle from the philosophy.
   */
  removePrinciple(principle: string, updatedAt: string): Result<void> {
    const index = this.props._principles.findIndex(
      (p) => p.toLowerCase() === principle.trim().toLowerCase(),
    );
    if (index === -1) {
      return Result.fail<void>(`Principle not found: "${principle}"`);
    }
    this.props._principles.splice(index, 1);
    this.props.updatedAt = updatedAt;
    return Result.ok(undefined);
  }

  /**
   * Check if the philosophy has a specific principle.
   */
  hasPrinciple(principle: string): boolean {
    return this.props._principles.some((p) => p.toLowerCase() === principle.trim().toLowerCase());
  }
}

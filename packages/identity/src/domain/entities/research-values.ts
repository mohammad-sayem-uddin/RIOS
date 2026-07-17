/**
 * Purpose:
 * Represents the researcher's non-technical principles that influence decisions.
 * Research Values define principles, not achievements.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.3.
 *
 * ADR reference:
 * ADR-101.
 *
 * Lifecycle:
 * High stability. Values are deeply held principles.
 *
 * Responsibilities:
 * Define non-technical guiding principles.
 * Influence research decisions and priorities.
 * Distinguish from achievements (Values are principles, not outcomes).
 *
 * Relationships:
 * Research Identity expresses → Research Values.
 * Research Values influence → Research Decisions.
 *
 * Owned invariants:
 * Research Values must be non-technical principles.
 * Values influence decisions; they are not achievements.
 * At least one value must be defined.
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { DuplicateEntityItemError, EntityItemNotFoundError } from '../errors/identity-errors.js';
import { ResearchVisionStatement } from '../value-objects/identity-value-objects.js';

interface ResearchValuesProps {
  /** Core statement defining the value system. */
  statement: ResearchVisionStatement;
  /** Individual values expressed as validated text. */
  readonly _values: string[];
  /** ISO timestamp of creation. */
  createdAt: string;
  /** ISO timestamp of last update. */
  updatedAt: string;
}

/**
 * ResearchValues Entity.
 *
 * Represents the researcher's non-technical principles that guide decisions.
 * Values are deeply held beliefs about how research should be conducted.
 * They must remain non-technical (no tool, framework, or methodology references).
 *
 * The Values entity encapsulates:
 * - A validated statement describing the value system (Value Object)
 * - A collection of individual values (domain vocabulary)
 * - Lifecycle timestamps
 *
 * Behavior:
 * - Factory creation with invariant enforcement
 * - Adding/removing individual values (with duplicate prevention)
 * - Refining the value system statement
 * - Identity-based equality (Entity semantics)
 */
export class ResearchValues extends Entity<ResearchValuesProps> {
  // ─── Construction ───────────────────────────────────────────────────

  private constructor(props: ResearchValuesProps, id?: UniqueId) {
    super(props, id);
  }

  /**
   * Named factory method: creates a valid ResearchValues.
   *
   * Invariants enforced:
   * - Statement must be a validated ResearchVision VO
   * - At least one value must be provided
   * - Each value must be non-empty
   */
  static create(params: {
    statement: ResearchVisionStatement;
    values: string[];
    createdAt: string;
  }): Result<ResearchValues> {
    if (!params.createdAt || params.createdAt.trim().length === 0) {
      return Result.fail<ResearchValues>('createdAt must be a non-empty ISO timestamp');
    }

    if (params.values.length === 0) {
      return Result.fail<ResearchValues>('At least one value must be defined');
    }

    const normalizedValues: string[] = [];
    for (const value of params.values) {
      const trimmed = value.trim();
      if (trimmed.length === 0) {
        return Result.fail<ResearchValues>('Each value must be a non-empty string');
      }
      normalizedValues.push(trimmed);
    }

    return Result.ok(
      new ResearchValues({
        statement: params.statement,
        _values: normalizedValues,
        createdAt: params.createdAt,
        updatedAt: params.createdAt,
      }),
    );
  }

  /**
   * Named factory method: reconstitutes ResearchValues from persistence.
   */
  static reconstitute(params: {
    id: UniqueId;
    statement: ResearchVisionStatement;
    values: string[];
    createdAt: string;
    updatedAt: string;
  }): ResearchValues {
    return new ResearchValues(
      {
        statement: params.statement,
        _values: [...params.values],
        createdAt: params.createdAt,
        updatedAt: params.updatedAt,
      },
      params.id,
    );
  }

  // ─── Read-Only Accessors ────────────────────────────────────────────

  /** The core value system statement. */
  get statement(): ResearchVisionStatement {
    return this.props.statement;
  }

  /** Read-only view of individual values. */
  get values(): readonly string[] {
    return Object.freeze([...this.props._values]);
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
   * Refine the value system statement.
   */
  refineStatement(newStatement: ResearchVisionStatement, updatedAt: string): void {
    this.props.statement = newStatement;
    this.props.updatedAt = updatedAt;
  }

  /**
   * Add a value to the value system.
   *
   * Invariant: Prevents duplicate values (case-insensitive).
   */
  addValue(value: string, updatedAt: string): Result<void> {
    const normalized = value.trim();
    if (normalized.length === 0) {
      return Result.fail<void>('Value must be a non-empty string');
    }
    if (this.props._values.some((v) => v.toLowerCase() === normalized.toLowerCase())) {
      return Result.fail<void>(new DuplicateEntityItemError(`Value "${normalized}"`).message);
    }
    this.props._values.push(normalized);
    this.props.updatedAt = updatedAt;
    return Result.ok(undefined);
  }

  /**
   * Remove a value from the value system.
   *
   * Invariant: Cannot remove the last value (at least one must remain).
   */
  removeValue(value: string, updatedAt: string): Result<void> {
    if (this.props._values.length <= 1) {
      return Result.fail<void>('Cannot remove the last value; at least one value must remain');
    }
    const index = this.props._values.findIndex(
      (v) => v.toLowerCase() === value.trim().toLowerCase(),
    );
    if (index === -1) {
      return Result.fail<void>(new EntityItemNotFoundError(`Value "${value}"`).message);
    }
    this.props._values.splice(index, 1);
    this.props.updatedAt = updatedAt;
    return Result.ok(undefined);
  }

  /**
   * Check if the value system includes a specific value.
   */
  hasValue(value: string): boolean {
    return this.props._values.some((v) => v.toLowerCase() === value.trim().toLowerCase());
  }
}

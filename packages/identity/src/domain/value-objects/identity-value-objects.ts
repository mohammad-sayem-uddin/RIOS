import { ValueObject, Result } from '@rios/shared';

import {
  InvalidResearchStageError,
  InvalidResearchFocusError,
  InvalidCollaborationTypeError,
  InvalidResearchStatusError,
  InvalidConfidenceLevelError,
} from '../errors/identity-errors.js';

// ─────────────────────────────────────────────────────────────────────────────
// Canonical enumerations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Canonical set of Research Stages as defined by the architecture.
 *
 * Architecture reference:
 * Volume I Chapter 2 value object table; Volume I Chapter 4 canonical lifecycle.
 */
const VALID_RESEARCH_STAGES = ['Undergraduate', 'Masters', 'PhD', 'Research Scientist'] as const;

export type ResearchStageValue = (typeof VALID_RESEARCH_STAGES)[number];

/**
 * Canonical set of Collaboration Types as defined by the architecture.
 *
 * Architecture reference:
 * Volume I Chapter 2 value object table; Volume I Chapter 5 Professional
 * Trust; Volume I Chapter 7 Identity Context Interface.
 */
const VALID_COLLABORATION_TYPES = ['Individual', 'Academic', 'Industry'] as const;

export type CollaborationTypeValue = (typeof VALID_COLLABORATION_TYPES)[number];

/**
 * Canonical set of Research Statuses as defined by the architecture.
 *
 * Architecture reference:
 * Volume I Chapter 2 value object table; Volume I Chapter 4 lifecycle model;
 * Volume I Chapter 9 evolution constraints.
 */
const VALID_RESEARCH_STATUSES = ['Active', 'Exploratory', 'Archived'] as const;

export type ResearchStatusValue = (typeof VALID_RESEARCH_STATUSES)[number];

// ─────────────────────────────────────────────────────────────────────────────
// Research Focus constraints
// ─────────────────────────────────────────────────────────────────────────────

const RESEARCH_FOCUS_MIN_LENGTH = 1;
const RESEARCH_FOCUS_MAX_LENGTH = 200;

// ─────────────────────────────────────────────────────────────────────────────
// Confidence Level constraints
// ─────────────────────────────────────────────────────────────────────────────

const CONFIDENCE_LEVEL_MIN = 1;
const CONFIDENCE_LEVEL_MAX = 5;

// ─────────────────────────────────────────────────────────────────────────────
// ResearchStage Value Object
// ─────────────────────────────────────────────────────────────────────────────

interface ResearchStageProps {
  readonly value: ResearchStageValue;
}

/**
 * Purpose:
 * Immutable descriptor of academic or research maturity stage.
 *
 * Architecture reference:
 * Domain Model Specification Layer 6; Volume I Chapter 2 value object table;
 * Volume I Chapter 4 canonical lifecycle.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * - Must be one of: Undergraduate, Masters, PhD, Research Scientist.
 * - Research Stage describes maturity and must not replace evidence-based identity.
 * - Immutable after creation.
 *
 * Future responsibilities:
 * Represent lifecycle phases and career-stage transitions without embedding
 * workflow behavior.
 */
export class ResearchStage extends ValueObject<ResearchStageProps> {
  /**
   * Enforce private construction — callers must use ResearchStage.create().
   */
  private constructor(props: ResearchStageProps) {
    super(props);
  }

  /**
   * Canonical factory method.
   *
   * Returns a Result containing the ResearchStage on success, or a
   * descriptive error string on failure.
   */
  public static create(value: string): Result<ResearchStage> {
    const trimmed = value.trim();

    if (!VALID_RESEARCH_STAGES.includes(trimmed as ResearchStageValue)) {
      return Result.fail(new InvalidResearchStageError(trimmed).message);
    }

    return Result.ok(new ResearchStage({ value: trimmed as ResearchStageValue }));
  }

  /** The canonical Research Stage value. */
  public get value(): ResearchStageValue {
    return this.props.value;
  }

  /** Serialisation support. Returns the canonical string value. */
  public override toString(): string {
    return this.props.value;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ResearchFocus Value Object
// ─────────────────────────────────────────────────────────────────────────────

interface ResearchFocusProps {
  readonly value: string;
}

/**
 * Purpose:
 * Immutable descriptor of current intellectual emphasis.
 *
 * Architecture reference:
 * Volume I Chapter 2 value object table; Volume I Chapter 5 Observation and
 * Interpretation stages.
 *
 * ADR reference:
 * ADR-101, ADR-105.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * - Must be a non-empty, trimmed string of 1–200 characters.
 * - Must not consist solely of whitespace.
 * - Research Focus must remain subordinate to Research Agenda and Research Vision.
 * - Immutable after creation.
 *
 * Future responsibilities:
 * Summarize current emphasis while preserving semantic consistency across
 * representations.
 */
export class ResearchFocus extends ValueObject<ResearchFocusProps> {
  private constructor(props: ResearchFocusProps) {
    super(props);
  }

  /**
   * Canonical factory method.
   *
   * Normalises whitespace during creation. Returns a Result containing the
   * ResearchFocus on success, or a descriptive error string on failure.
   */
  public static create(raw: string): Result<ResearchFocus> {
    if (raw === null || raw === undefined) {
      return Result.fail(
        new InvalidResearchFocusError('value must not be null or undefined.').message,
      );
    }

    const trimmed = raw.trim();

    if (trimmed.length < RESEARCH_FOCUS_MIN_LENGTH) {
      return Result.fail(
        new InvalidResearchFocusError('value must not be empty or whitespace.').message,
      );
    }

    if (trimmed.length > RESEARCH_FOCUS_MAX_LENGTH) {
      return Result.fail(
        new InvalidResearchFocusError(
          `value exceeds maximum length of ${RESEARCH_FOCUS_MAX_LENGTH} characters.`,
        ).message,
      );
    }

    return Result.ok(new ResearchFocus({ value: trimmed }));
  }

  /** The canonical Research Focus value. */
  public get value(): string {
    return this.props.value;
  }

  /** Serialisation support. */
  public override toString(): string {
    return this.props.value;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CollaborationType Value Object
// ─────────────────────────────────────────────────────────────────────────────

interface CollaborationTypeProps {
  readonly value: CollaborationTypeValue;
}

/**
 * Purpose:
 * Immutable descriptor of collaboration context.
 *
 * Architecture reference:
 * Volume I Chapter 2 value object table; Volume I Chapter 5 Professional
 * Trust; Volume I Chapter 7 Identity Context Interface.
 *
 * ADR reference:
 * ADR-101, ADR-104.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * - Must be one of: Individual, Academic, Industry.
 * - Collaboration Type contextualises identity but does not define Research Identity.
 * - Immutable after creation.
 *
 * Future responsibilities:
 * Distinguish individual, academic, and industry collaboration contexts.
 */
export class CollaborationType extends ValueObject<CollaborationTypeProps> {
  private constructor(props: CollaborationTypeProps) {
    super(props);
  }

  /**
   * Canonical factory method.
   *
   * Returns a Result containing the CollaborationType on success, or a
   * descriptive error string on failure.
   */
  public static create(value: string): Result<CollaborationType> {
    const trimmed = value.trim();

    if (!VALID_COLLABORATION_TYPES.includes(trimmed as CollaborationTypeValue)) {
      return Result.fail(new InvalidCollaborationTypeError(trimmed).message);
    }

    return Result.ok(
      new CollaborationType({
        value: trimmed as CollaborationTypeValue,
      }),
    );
  }

  /** The canonical Collaboration Type value. */
  public get value(): CollaborationTypeValue {
    return this.props.value;
  }

  /** Serialisation support. */
  public override toString(): string {
    return this.props.value;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ResearchStatus Value Object
// ─────────────────────────────────────────────────────────────────────────────

interface ResearchStatusProps {
  readonly value: ResearchStatusValue;
}

/**
 * Purpose:
 * Immutable descriptor of whether an identity element is active, exploratory,
 * or archived.
 *
 * Architecture reference:
 * Volume I Chapter 2 value object table; Volume I Chapter 4 lifecycle model;
 * Volume I Chapter 9 evolution constraints.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * - Must be one of: Active, Exploratory, Archived.
 * - Archived status must preserve historical visibility and must not delete
 *   prior identity.
 * - Immutable after creation.
 *
 * Future responsibilities:
 * Support identity history, active direction, and exploratory emphasis without
 * encoding transition rules yet.
 */
export class ResearchStatus extends ValueObject<ResearchStatusProps> {
  private constructor(props: ResearchStatusProps) {
    super(props);
  }

  /**
   * Canonical factory method.
   *
   * Returns a Result containing the ResearchStatus on success, or a
   * descriptive error string on failure.
   */
  public static create(value: string): Result<ResearchStatus> {
    const trimmed = value.trim();

    if (!VALID_RESEARCH_STATUSES.includes(trimmed as ResearchStatusValue)) {
      return Result.fail(new InvalidResearchStatusError(trimmed).message);
    }

    return Result.ok(
      new ResearchStatus({
        value: trimmed as ResearchStatusValue,
      }),
    );
  }

  /** The canonical Research Status value. */
  public get value(): ResearchStatusValue {
    return this.props.value;
  }

  /** Convenience: returns true when status is 'Active'. */
  public get isActive(): boolean {
    return this.props.value === 'Active';
  }

  /** Convenience: returns true when status is 'Exploratory'. */
  public get isExploratory(): boolean {
    return this.props.value === 'Exploratory';
  }

  /** Convenience: returns true when status is 'Archived'. */
  public get isArchived(): boolean {
    return this.props.value === 'Archived';
  }

  /** Serialisation support. */
  public override toString(): string {
    return this.props.value;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ConfidenceLevel Value Object
// ─────────────────────────────────────────────────────────────────────────────

interface ConfidenceLevelProps {
  readonly value: number;
}

/**
 * Purpose:
 * Immutable descriptor of confidence associated with long-term direction.
 *
 * Architecture reference:
 * Domain Model Specification Layer 6; Volume I Chapter 2 value object table;
 * Volume I Chapter 5 Trust Architecture.
 *
 * ADR reference:
 * ADR-104.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * - Must be an integer between 1 and 5 inclusive.
 * - Confidence Level must remain evidence-based and must not reduce trust to a
 *   popularity metric.
 * - Immutable after creation.
 *
 * Future responsibilities:
 * Express confidence in identity direction once evidence associations are
 * implemented.
 */
export class ConfidenceLevel extends ValueObject<ConfidenceLevelProps> {
  private constructor(props: ConfidenceLevelProps) {
    super(props);
  }

  /**
   * Canonical factory method.
   *
   * Returns a Result containing the ConfidenceLevel on success, or a
   * descriptive error string on failure.
   */
  public static create(value: number): Result<ConfidenceLevel> {
    if (!Number.isInteger(value)) {
      return Result.fail(new InvalidConfidenceLevelError(value).message);
    }

    if (value < CONFIDENCE_LEVEL_MIN || value > CONFIDENCE_LEVEL_MAX) {
      return Result.fail(new InvalidConfidenceLevelError(value).message);
    }

    return Result.ok(new ConfidenceLevel({ value }));
  }

  /** The canonical Confidence Level value (1–5 integer). */
  public get value(): number {
    return this.props.value;
  }

  /** Serialisation support. */
  public override toString(): string {
    return String(this.props.value);
  }
}

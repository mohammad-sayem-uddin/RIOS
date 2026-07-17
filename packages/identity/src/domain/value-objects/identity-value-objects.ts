import { ValueObject, Result } from '@rios/shared';

import {
  InvalidResearchStageError,
  InvalidResearchFocusError,
  InvalidCollaborationTypeError,
  InvalidResearchStatusError,
  InvalidConfidenceLevelError,
  InvalidResearchVisionError,
  InvalidResearchIdentitySummaryError,
  InvalidTimeHorizonError,
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
// Constants — length and boundary constraints
// ─────────────────────────────────────────────────────────────────────────────

const RESEARCH_FOCUS_MIN_LENGTH = 1;
const RESEARCH_FOCUS_MAX_LENGTH = 200;

const CONFIDENCE_LEVEL_MIN = 1;
const CONFIDENCE_LEVEL_MAX = 5;

const RESEARCH_VISION_MIN_LENGTH = 1;
const RESEARCH_VISION_MAX_LENGTH = 2000;

const RESEARCH_IDENTITY_SUMMARY_MIN_LENGTH = 1;
const RESEARCH_IDENTITY_SUMMARY_MAX_LENGTH = 500;

const TIME_HORIZON_MIN_LENGTH = 1;
const TIME_HORIZON_MAX_LENGTH = 100;

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
    Object.freeze(this);
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

  /**
   * Serialisation support for persistence or transport.
   * Returns a plain object suitable for JSON serialisation.
   */
  public toJSON(): { value: ResearchStageValue } {
    return { value: this.props.value };
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
    Object.freeze(this);
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

  /**
   * Serialisation support for persistence or transport.
   * Returns a plain object suitable for JSON serialisation.
   */
  public toJSON(): { value: string } {
    return { value: this.props.value };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TimeHorizon Value Object
// ─────────────────────────────────────────────────────────────────────────────

interface TimeHorizonProps {
  readonly value: string;
}

/**
 * Purpose:
 * Immutable descriptor of the time horizon for a research vision or goal.
 *
 * Architecture reference:
 * Volume I Chapter 2; Volume I Chapter 5.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * - Must be a non-empty, trimmed string of 1–100 characters.
 * - Must not consist solely of whitespace.
 * - Immutable after creation.
 *
 * Future responsibilities:
 * Express the temporal scope of a research vision or goal.
 */
export class TimeHorizon extends ValueObject<TimeHorizonProps> {
  private constructor(props: TimeHorizonProps) {
    super(props);
    Object.freeze(this);
  }

  /**
   * Canonical factory method.
   */
  public static create(raw: string): Result<TimeHorizon> {
    if (raw === null || raw === undefined) {
      return Result.fail(
        new InvalidTimeHorizonError('value must not be null or undefined.').message,
      );
    }

    const trimmed = raw.trim();

    if (trimmed.length < TIME_HORIZON_MIN_LENGTH) {
      return Result.fail(
        new InvalidTimeHorizonError('value must not be empty or whitespace.').message,
      );
    }

    if (trimmed.length > TIME_HORIZON_MAX_LENGTH) {
      return Result.fail(
        new InvalidTimeHorizonError(
          `value exceeds maximum length of ${TIME_HORIZON_MAX_LENGTH} characters.`,
        ).message,
      );
    }

    return Result.ok(new TimeHorizon({ value: trimmed }));
  }

  /** The canonical Time Horizon value. */
  public get value(): string {
    return this.props.value;
  }

  /** Serialisation support. */
  public override toString(): string {
    return this.props.value;
  }

  /**
   * Serialisation support for persistence or transport.
   */
  public toJSON(): { value: string } {
    return { value: this.props.value };
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
    Object.freeze(this);
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

  /** Convenience: returns true when type is 'Individual'. */
  public get isIndividual(): boolean {
    return this.props.value === 'Individual';
  }

  /** Convenience: returns true when type is 'Academic'. */
  public get isAcademic(): boolean {
    return this.props.value === 'Academic';
  }

  /** Convenience: returns true when type is 'Industry'. */
  public get isIndustry(): boolean {
    return this.props.value === 'Industry';
  }

  /** Serialisation support. */
  public override toString(): string {
    return this.props.value;
  }

  /**
   * Serialisation support for persistence or transport.
   * Returns a plain object suitable for JSON serialisation.
   */
  public toJSON(): { value: CollaborationTypeValue } {
    return { value: this.props.value };
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
    Object.freeze(this);
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

  /**
   * Serialisation support for persistence or transport.
   * Returns a plain object suitable for JSON serialisation.
   */
  public toJSON(): { value: ResearchStatusValue } {
    return { value: this.props.value };
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
    Object.freeze(this);
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

  /**
   * Serialisation support for persistence or transport.
   * Returns a plain object suitable for JSON serialisation.
   */
  public toJSON(): { value: number } {
    return { value: this.props.value };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ResearchVision Value Object
// ─────────────────────────────────────────────────────────────────────────────

interface ResearchVisionStatementProps {
  readonly value: string;
}

/**
 * Purpose:
 * Immutable representation of long-term scientific direction.
 *
 * Architecture reference:
 * ADR-103; Volume I Chapter 2 value object table; Volume I Chapter 5
 * Observation and Interpretation stages; Volume I Chapter 3 semantic layers.
 *
 * ADR reference:
 * ADR-103.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * - Must be a non-empty, trimmed string of 1–2000 characters.
 * - Must not consist solely of whitespace.
 * - Research Vision expresses the enduring scientific direction.
 * - Immutable after creation.
 *
 * Future responsibilities:
 * Represent the researcher's long-term intellectual trajectory independent of
 * current projects or publications.
 */
export class ResearchVisionStatement extends ValueObject<ResearchVisionStatementProps> {
  private constructor(props: ResearchVisionStatementProps) {
    super(props);
    Object.freeze(this);
  }

  /**
   * Canonical factory method.
   *
   * Normalises whitespace during creation. Returns a Result containing the
   * ResearchVision on success, or a descriptive error string on failure.
   */
  public static create(raw: string): Result<ResearchVisionStatement> {
    if (raw === null || raw === undefined) {
      return Result.fail(
        new InvalidResearchVisionError('value must not be null or undefined.').message,
      );
    }

    const trimmed = raw.trim();

    if (trimmed.length < RESEARCH_VISION_MIN_LENGTH) {
      return Result.fail(
        new InvalidResearchVisionError('value must not be empty or whitespace.').message,
      );
    }

    if (trimmed.length > RESEARCH_VISION_MAX_LENGTH) {
      return Result.fail(
        new InvalidResearchVisionError(
          `value exceeds maximum length of ${RESEARCH_VISION_MAX_LENGTH} characters.`,
        ).message,
      );
    }

    return Result.ok(new ResearchVisionStatement({ value: trimmed }));
  }

  /** The canonical Research Vision value. */
  public get value(): string {
    return this.props.value;
  }

  /** Serialisation support. */
  public override toString(): string {
    return this.props.value;
  }

  /**
   * Serialisation support for persistence or transport.
   * Returns a plain object suitable for JSON serialisation.
   */
  public toJSON(): { value: string } {
    return { value: this.props.value };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ResearchIdentitySummary Value Object
// ─────────────────────────────────────────────────────────────────────────────

interface ResearchIdentitySummaryProps {
  readonly value: string;
}

/**
 * Purpose:
 * Immutable, concise representation of a researcher's Research Identity.
 *
 * Architecture reference:
 * ADR-101; Volume I Chapter 2 value object table; Volume I Chapter 7 Interface
 * 1 — Identity Summary Interface.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * - Must be a non-empty, trimmed string of 1–500 characters.
 * - Must not consist solely of whitespace.
 * - Summary must provide concise representation of Research Identity.
 * - Immutable after creation.
 *
 * Future responsibilities:
 * Provide canonical summary output for the Identity Summary Interface without
 * embedding presentation or formatting logic.
 */
export class ResearchIdentitySummary extends ValueObject<ResearchIdentitySummaryProps> {
  private constructor(props: ResearchIdentitySummaryProps) {
    super(props);
    Object.freeze(this);
  }

  /**
   * Canonical factory method.
   *
   * Normalises whitespace during creation. Returns a Result containing the
   * ResearchIdentitySummary on success, or a descriptive error string on
   * failure.
   */
  public static create(raw: string): Result<ResearchIdentitySummary> {
    if (raw === null || raw === undefined) {
      return Result.fail(
        new InvalidResearchIdentitySummaryError('value must not be null or undefined.').message,
      );
    }

    const trimmed = raw.trim();

    if (trimmed.length < RESEARCH_IDENTITY_SUMMARY_MIN_LENGTH) {
      return Result.fail(
        new InvalidResearchIdentitySummaryError('value must not be empty or whitespace.').message,
      );
    }

    if (trimmed.length > RESEARCH_IDENTITY_SUMMARY_MAX_LENGTH) {
      return Result.fail(
        new InvalidResearchIdentitySummaryError(
          `value exceeds maximum length of ${RESEARCH_IDENTITY_SUMMARY_MAX_LENGTH} characters.`,
        ).message,
      );
    }

    return Result.ok(new ResearchIdentitySummary({ value: trimmed }));
  }

  /** The canonical Research Identity Summary value. */
  public get value(): string {
    return this.props.value;
  }

  /** Serialisation support. */
  public override toString(): string {
    return this.props.value;
  }

  /**
   * Serialisation support for persistence or transport.
   * Returns a plain object suitable for JSON serialisation.
   */
  public toJSON(): { value: string } {
    return { value: this.props.value };
  }
}

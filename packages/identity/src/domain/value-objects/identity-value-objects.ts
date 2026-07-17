import { ValueObject } from '@rios/shared';

interface IdentityValueObjectProps {
  readonly architecturePlaceholder?: never;
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
 * Research Stage describes maturity and must not replace evidence-based
 * identity.
 *
 * Future responsibilities:
 * Represent lifecycle phases and career-stage transitions without embedding
 * workflow behavior.
 */
export abstract class ResearchStage extends ValueObject<IdentityValueObjectProps> {}

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
 * Research Focus must remain subordinate to Research Agenda and Research
 * Vision.
 *
 * Future responsibilities:
 * Summarize current emphasis while preserving semantic consistency across
 * representations.
 */
export abstract class ResearchFocus extends ValueObject<IdentityValueObjectProps> {}

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
 * Collaboration Type contextualizes identity but does not define Research
 * Identity.
 *
 * Future responsibilities:
 * Distinguish individual, academic, and industry collaboration contexts.
 */
export abstract class CollaborationType extends ValueObject<IdentityValueObjectProps> {}

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
 * Archived status must preserve historical visibility and must not delete
 * prior identity.
 *
 * Future responsibilities:
 * Support identity history, active direction, and exploratory emphasis without
 * encoding transition rules yet.
 */
export abstract class ResearchStatus extends ValueObject<IdentityValueObjectProps> {}

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
 * Confidence Level must remain evidence-based and must not reduce trust to a
 * popularity metric.
 *
 * Future responsibilities:
 * Express confidence in identity direction once evidence associations are
 * implemented.
 */
export abstract class ConfidenceLevel extends ValueObject<IdentityValueObjectProps> {}

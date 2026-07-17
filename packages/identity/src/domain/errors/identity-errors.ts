import { DomainError } from '@rios/shared';

/**
 * Purpose:
 * Base error for Identity Domain semantic failures.
 *
 * Architecture reference:
 * Domain Model Specification Layer 9; Volume I Chapter 9 constraints.
 *
 * ADR reference:
 * ADR-004.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Domain errors represent architectural non-conformance, not infrastructure or
 * API concerns.
 */
export abstract class IdentityDomainError extends DomainError {}

/**
 * Purpose:
 * Error for violated Identity invariants.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.8; Volume I Chapter 9 foundational,
 * structural, relationship, and evolution constraints.
 *
 * ADR reference:
 * ADR-101, ADR-102.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Identity invariants include primary agenda uniqueness, representation
 * independence, historical continuity, and evidence-based assertions.
 */
export abstract class IdentityInvariantViolationError extends IdentityDomainError {}

/**
 * Purpose:
 * Error for semantic non-conformance in Identity terminology,
 * relationships, or ontology.
 *
 * Architecture reference:
 * Canonical Terminology Dictionary; Volume I Chapter 3 ontology; Volume I
 * Chapter 12 semantic verification.
 *
 * ADR reference:
 * ADR-003, ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Canonical terminology and ontology must remain semantically consistent.
 */
export abstract class IdentitySemanticNonConformanceError extends IdentityDomainError {}

/**
 * Purpose:
 * Error for Identity ownership boundary violations.
 *
 * Architecture reference:
 * Domain Ownership Matrix; Volume I Chapter 7 interface constraints.
 *
 * ADR reference:
 * ADR-001, ADR-004.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Consumers retrieve Identity through published interfaces and never redefine
 * Identity concepts.
 */
export abstract class IdentityOwnershipViolationError extends IdentityDomainError {}

/**
 * Purpose:
 * Error for circular or reversed Identity dependency violations.
 *
 * Architecture reference:
 * Domain Dependency Matrix DDM-001 and DDM-002; Volume I Chapter 9 RC-003.
 *
 * ADR reference:
 * ADR-010, ADR-102.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Identity depends on no downstream domains, and semantic dependencies remain
 * acyclic.
 */
export abstract class IdentityDependencyViolationError extends IdentityDomainError {}

// ─────────────────────────────────────────────────────────────────────────────
// Concrete Identity Value Object Errors
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose:
 * Raised when a Research Stage value is not one of the canonical stages
 * defined by the architecture.
 *
 * Architecture reference:
 * Volume I Chapter 2 value object table; Volume I Chapter 4 canonical lifecycle.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Research Stage must be one of: Undergraduate, Masters, PhD, Research Scientist.
 */
export class InvalidResearchStageError extends IdentityInvariantViolationError {
  constructor(value: string) {
    super(
      `Invalid Research Stage: "${value}". Must be one of: Undergraduate, Masters, PhD, Research Scientist.`,
      'IDENTITY_INVALID_RESEARCH_STAGE',
      400,
    );
    this.name = 'InvalidResearchStageError';
  }
}

/**
 * Purpose:
 * Raised when a Research Focus value violates length or content constraints.
 *
 * Architecture reference:
 * Volume I Chapter 2 value object table; Volume I Chapter 5.
 *
 * ADR reference:
 * ADR-101, ADR-105.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Research Focus must be a non-empty trimmed string of 1–200 characters.
 * Research Focus must remain subordinate to Research Agenda and Research Vision.
 */
export class InvalidResearchFocusError extends IdentityInvariantViolationError {
  constructor(reason: string) {
    super(`Invalid Research Focus: ${reason}`, 'IDENTITY_INVALID_RESEARCH_FOCUS', 400);
    this.name = 'InvalidResearchFocusError';
  }
}

/**
 * Purpose:
 * Raised when a Collaboration Type value is not one of the canonical types
 * defined by the architecture.
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
 * Collaboration Type must be one of: Individual, Academic, Industry.
 */
export class InvalidCollaborationTypeError extends IdentityInvariantViolationError {
  constructor(value: string) {
    super(
      `Invalid Collaboration Type: "${value}". Must be one of: Individual, Academic, Industry.`,
      'IDENTITY_INVALID_COLLABORATION_TYPE',
      400,
    );
    this.name = 'InvalidCollaborationTypeError';
  }
}

/**
 * Purpose:
 * Raised when a Research Status value is not one of the canonical statuses
 * defined by the architecture.
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
 * Research Status must be one of: Active, Exploratory, Archived.
 * Archived status must preserve historical visibility and must not delete
 * prior identity.
 */
export class InvalidResearchStatusError extends IdentityInvariantViolationError {
  constructor(value: string) {
    super(
      `Invalid Research Status: "${value}". Must be one of: Active, Exploratory, Archived.`,
      'IDENTITY_INVALID_RESEARCH_STATUS',
      400,
    );
    this.name = 'InvalidResearchStatusError';
  }
}

/**
 * Purpose:
 * Raised when a Confidence Level value is outside the allowed range.
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
 * Confidence Level must be an integer between 1 and 5 inclusive.
 * Confidence Level must remain evidence-based and must not reduce trust to a
 * popularity metric.
 */
export class InvalidConfidenceLevelError extends IdentityInvariantViolationError {
  constructor(value: number) {
    super(
      `Invalid Confidence Level: ${value}. Must be an integer between 1 and 5 inclusive.`,
      'IDENTITY_INVALID_CONFIDENCE_LEVEL',
      400,
    );
    this.name = 'InvalidConfidenceLevelError';
  }
}

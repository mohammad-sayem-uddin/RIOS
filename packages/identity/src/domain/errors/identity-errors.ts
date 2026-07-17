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

/**
 * Purpose:
 * Raised when a Research Vision value violates length or content constraints.
 *
 * Architecture reference:
 * ADR-103; Volume I Chapter 2 value object table; Volume I Chapter 5.
 *
 * ADR reference:
 * ADR-103.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Research Vision must be a non-empty trimmed string of 1–2000 characters.
 * Research Vision must represent long-term scientific direction.
 */
export class InvalidResearchVisionError extends IdentityInvariantViolationError {
  constructor(reason: string) {
    super(`Invalid Research Vision: ${reason}`, 'IDENTITY_INVALID_RESEARCH_VISION', 400);
    this.name = 'InvalidResearchVisionError';
  }
}

/**
 * Purpose:
 * Raised when a Research Identity Summary value violates length or content constraints.
 *
 * Architecture reference:
 * ADR-101; Volume I Chapter 2 value object table; Volume I Chapter 7 Interface 1.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Research Identity Summary must be a non-empty trimmed string of 1–500 characters.
 * Summary must provide concise representation of Research Identity.
 */
export class InvalidResearchIdentitySummaryError extends IdentityInvariantViolationError {
  constructor(reason: string) {
    super(
      `Invalid Research Identity Summary: ${reason}`,
      'IDENTITY_INVALID_RESEARCH_IDENTITY_SUMMARY',
      400,
    );
    this.name = 'InvalidResearchIdentitySummaryError';
  }
}

/**
 * Purpose:
 * Raised when a Time Horizon value violates length or content constraints.
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
 * Time Horizon must be a non-empty trimmed string of 1–100 characters.
 */
export class InvalidTimeHorizonError extends IdentityInvariantViolationError {
  constructor(reason: string) {
    super(`Invalid Time Horizon: ${reason}`, 'IDENTITY_INVALID_TIME_HORIZON', 400);
    this.name = 'InvalidTimeHorizonError';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Concrete Identity Entity Errors
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose:
 * Raised when a Research Agenda entity violates invariants during creation
 * or mutation.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.1; Domain Model Specification Layer 9.
 *
 * ADR reference:
 * ADR-101, ADR-102.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Research Agenda must be non-empty, long-lived, problem-oriented, and
 * technology-independent.
 */
export class ResearchAgendaInvariantError extends IdentityInvariantViolationError {
  constructor(reason: string) {
    super(
      `Research Agenda invariant violated: ${reason}`,
      'IDENTITY_RESEARCH_AGENDA_INVARIANT',
      400,
    );
    this.name = 'ResearchAgendaInvariantError';
  }
}

/**
 * Purpose:
 * Raised when a Research Area entity violates invariants.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.4; Volume I Chapter 8 Component C.
 *
 * ADR reference:
 * ADR-101, ADR-106.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Research Area must represent a persistent scientific domain, not an
 * implementation technology. Must contribute to Research Agenda.
 */
export class ResearchAreaInvariantError extends IdentityInvariantViolationError {
  constructor(reason: string) {
    super(`Research Area invariant violated: ${reason}`, 'IDENTITY_RESEARCH_AREA_INVARIANT', 400);
    this.name = 'ResearchAreaInvariantError';
  }
}

/**
 * Purpose:
 * Raised when a Research Question entity violates invariants.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.4; Volume I Chapter 8 Component D.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Research Questions are permanent architectural entities. Questions exist
 * before Projects. Research Questions must be non-empty and well-formed.
 */
export class ResearchQuestionInvariantError extends IdentityInvariantViolationError {
  constructor(reason: string) {
    super(
      `Research Question invariant violated: ${reason}`,
      'IDENTITY_RESEARCH_QUESTION_INVARIANT',
      400,
    );
    this.name = 'ResearchQuestionInvariantError';
  }
}

/**
 * Purpose:
 * Raised when a Research Philosophy entity violates invariants.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.2; Volume I Chapter 8 Component E.
 *
 * ADR reference:
 * ADR-005, ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Research Philosophy must remain independent of specific technologies.
 * Research Philosophy explains WHY the researcher approaches problems.
 */
export class ResearchPhilosophyInvariantError extends IdentityInvariantViolationError {
  constructor(reason: string) {
    super(
      `Research Philosophy invariant violated: ${reason}`,
      'IDENTITY_RESEARCH_PHILOSOPHY_INVARIANT',
      400,
    );
    this.name = 'ResearchPhilosophyInvariantError';
  }
}

/**
 * Purpose:
 * Raised when a Research Values entity violates invariants.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.3.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Research Values define non-technical principles. Values influence decisions.
 * They are not achievements.
 */
export class ResearchValuesInvariantError extends IdentityInvariantViolationError {
  constructor(reason: string) {
    super(
      `Research Values invariant violated: ${reason}`,
      'IDENTITY_RESEARCH_VALUES_INVARIANT',
      400,
    );
    this.name = 'ResearchValuesInvariantError';
  }
}

/**
 * Purpose:
 * Raised when a Research Evolution entity violates invariants.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.8; Volume I Chapter 4 evolution rules.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Evolution must preserve historical continuity and traceability.
 * No historical identity shall be deleted. Evolution must be additive.
 */
export class ResearchEvolutionInvariantError extends IdentityInvariantViolationError {
  constructor(reason: string) {
    super(
      `Research Evolution invariant violated: ${reason}`,
      'IDENTITY_RESEARCH_EVOLUTION_INVARIANT',
      400,
    );
    this.name = 'ResearchEvolutionInvariantError';
  }
}

/**
 * Purpose:
 * Raised when a Research Milestone entity violates invariants.
 *
 * Architecture reference:
 * Volume I Chapter 4 section 4.7.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Milestones represent significant transitions. Milestones shall be recorded
 * but shall not dominate the presentation of identity.
 */
export class ResearchMilestoneInvariantError extends IdentityInvariantViolationError {
  constructor(reason: string) {
    super(
      `Research Milestone invariant violated: ${reason}`,
      'IDENTITY_RESEARCH_MILESTONE_INVARIANT',
      400,
    );
    this.name = 'ResearchMilestoneInvariantError';
  }
}

/**
 * Purpose:
 * Raised when a Research Goal entity violates invariants.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.7.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Goals translate Research Vision into measurable milestones.
 * Goals may evolve. Vision should remain comparatively stable.
 */
export class ResearchGoalInvariantError extends IdentityInvariantViolationError {
  constructor(reason: string) {
    super(`Research Goal invariant violated: ${reason}`, 'IDENTITY_RESEARCH_GOAL_INVARIANT', 400);
    this.name = 'ResearchGoalInvariantError';
  }
}

/**
 * Purpose:
 * Raised when a Research Contribution entity violates invariants.
 *
 * Architecture reference:
 * Volume I Chapter 3 section 3.5 semantic hierarchy.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Contributions represent original knowledge produced by the researcher.
 * Contributions generate impact.
 */
export class ResearchContributionInvariantError extends IdentityInvariantViolationError {
  constructor(reason: string) {
    super(
      `Research Contribution invariant violated: ${reason}`,
      'IDENTITY_RESEARCH_CONTRIBUTION_INVARIANT',
      400,
    );
    this.name = 'ResearchContributionInvariantError';
  }
}

/**
 * Purpose:
 * Raised when a duplicate item is added to a protected entity collection.
 *
 * Architecture reference:
 * Domain Model Specification Layer 8; Volume I Chapter 8 structural integrity.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Entity collections must prevent duplicates to maintain semantic integrity.
 */
export class DuplicateEntityItemError extends IdentityInvariantViolationError {
  constructor(itemDescription: string) {
    super(`Duplicate item detected: ${itemDescription}`, 'IDENTITY_DUPLICATE_ENTITY_ITEM', 400);
    this.name = 'DuplicateEntityItemError';
  }
}

/**
 * Purpose:
 * Raised when a requested item is not found within an entity collection.
 *
 * Architecture reference:
 * Volume I Chapter 8 structural integrity.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Removing or updating a non-existent item violates structural integrity.
 */
export class EntityItemNotFoundError extends IdentityInvariantViolationError {
  constructor(itemDescription: string) {
    super(`Item not found: ${itemDescription}`, 'IDENTITY_ENTITY_ITEM_NOT_FOUND', 404);
    this.name = 'EntityItemNotFoundError';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Concrete Aggregate-Level Errors
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose:
 * Raised when a Research Identity cannot be found by its identifier.
 *
 * Architecture reference:
 * Domain Model Specification Layer 9; Volume I Chapter 8 structural integrity.
 *
 * ADR reference:
 * ADR-101, ADR-102.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Every repository lookup must resolve to a valid aggregate.
 */
export class ResearchIdentityNotFoundError extends IdentityDomainError {
  constructor(identifier: string) {
    super(`Research Identity not found: ${identifier}`, 'IDENTITY_NOT_FOUND', 404);
    this.name = 'ResearchIdentityNotFoundError';
  }
}

/**
 * Purpose:
 * Raised when attempting to create a Research Identity that already exists.
 *
 * Architecture reference:
 * Domain Model Specification Layer 9; Volume I Chapter 9 foundational constraints.
 *
 * ADR reference:
 * ADR-101, ADR-102.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Each Research Identity must be unique. Duplicate identities violate
 * foundational constraints.
 */
export class DuplicateResearchIdentityError extends IdentityDomainError {
  constructor(identifier: string) {
    super(`Duplicate Research Identity detected: ${identifier}`, 'IDENTITY_DUPLICATE', 409);
    this.name = 'DuplicateResearchIdentityError';
  }
}

/**
 * Purpose:
 * Raised when a domain type or entity type is not supported within
 * the Identity domain.
 *
 * Architecture reference:
 * Domain Model Specification Layer 9; Volume I Chapter 3 ontology.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Only architecturally defined domain types are permitted.
 */
export class UnsupportedDomainTypeError extends IdentityDomainError {
  constructor(typeName: string) {
    super(`Unsupported domain type: ${typeName}`, 'IDENTITY_UNSUPPORTED_DOMAIN_TYPE', 400);
    this.name = 'UnsupportedDomainTypeError';
  }
}

/**
 * Purpose:
 * Raised when aggregate creation fails due to invariant violations.
 *
 * Architecture reference:
 * Domain Model Specification Layer 9; Volume I Chapter 9 constraints.
 *
 * ADR reference:
 * ADR-101, ADR-102.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Aggregate must be created in a valid initial state.
 */
export class IdentityCreationInvariantError extends IdentityInvariantViolationError {
  constructor(detail: string) {
    super(`Identity creation invariant violated: ${detail}`, 'IDENTITY_CREATION_INVARIANT', 400);
    this.name = 'IdentityCreationInvariantError';
  }
}

/**
 * Purpose:
 * Raised when an aggregate-wide invariant is violated during mutation.
 *
 * Architecture reference:
 * Domain Model Specification Layer 9; Volume I Chapter 9 constraints.
 *
 * ADR reference:
 * ADR-101, ADR-102.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Aggregate-wide consistency must be maintained across all mutations.
 */
export class AggregateInvariantViolationError extends IdentityInvariantViolationError {
  constructor(detail: string) {
    super(`Aggregate invariant violated: ${detail}`, 'AGGREGATE_INVARIANT_VIOLATION', 400);
    this.name = 'AggregateInvariantViolationError';
  }
}

/**
 * Purpose:
 * Raised when attempting to operate on an entity that does not belong
 * to the aggregate or references an unknown entity.
 *
 * Architecture reference:
 * Volume I Chapter 8 structural integrity; Domain Ownership Matrix.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * All entity references within the aggregate must be valid.
 */
export class InvalidEntityReferenceError extends IdentityInvariantViolationError {
  constructor(detail: string) {
    super(`Invalid entity reference: ${detail}`, 'INVALID_ENTITY_REFERENCE', 400);
    this.name = 'InvalidEntityReferenceError';
  }
}

/**
 * All identity domain errors re-exported for convenient access.
 */
export const IdentityErrors = {
  ResearchIdentityNotFoundError,
  DuplicateResearchIdentityError,
  EntityItemNotFoundError,
  DuplicateEntityItemError,
  UnsupportedDomainTypeError,
  IdentityCreationInvariantError,
  AggregateInvariantViolationError,
  InvalidEntityReferenceError,
} as const;

import { DomainError } from '@rios/shared';

/**
 * Purpose:
 * Base error placeholder for Identity Domain semantic failures.
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
 *
 * Future responsibilities:
 * Provide the canonical parent for concrete Identity Domain errors.
 */
export abstract class IdentityDomainError extends DomainError {}

/**
 * Purpose:
 * Error placeholder for violated Identity invariants.
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
 *
 * Future responsibilities:
 * Represent invariant failures once validation behavior is introduced.
 */
export abstract class IdentityInvariantViolationError extends IdentityDomainError {}

/**
 * Purpose:
 * Error placeholder for semantic non-conformance in Identity terminology,
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
 *
 * Future responsibilities:
 * Represent terminology and ontology violations detected by compliance checks.
 */
export abstract class IdentitySemanticNonConformanceError extends IdentityDomainError {}

/**
 * Purpose:
 * Error placeholder for Identity ownership boundary violations.
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
 *
 * Future responsibilities:
 * Represent cross-domain ownership violations when boundary checks are added.
 */
export abstract class IdentityOwnershipViolationError extends IdentityDomainError {}

/**
 * Purpose:
 * Error placeholder for circular or reversed Identity dependency violations.
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
 *
 * Future responsibilities:
 * Represent dependency violations detected by architecture tests.
 */
export abstract class IdentityDependencyViolationError extends IdentityDomainError {}

/**
 * Purpose:
 * Identity-specific specification abstraction extending the base Specification.
 * Represents query intent for ResearchIdentity aggregates.
 *
 * Architecture reference:
 * Domain Model Specification Layers 7-9; Volume I Chapter 8 structural integrity;
 * Volume I Chapter 9 foundational, structural, relationship, and evolution constraints.
 *
 * ADR reference:
 * ADR-101, ADR-102, ADR-103.
 *
 * Lifecycle:
 * This is an abstract base class for ResearchIdentity specifications.
 * Concrete specifications extend this class and define isSatisfiedBy().
 * Composition (and, or, not) is inherited from the base pattern.
 *
 * Responsibilities:
 * Specialise the generic Specification pattern for ResearchIdentity aggregates.
 * Provide a typed foundation for all identity-domain query rules.
 * Enable the repository to accept typed specifications without
 * knowing their concrete implementations.
 *
 * Invariants:
 * Depends only on ResearchIdentity aggregate and base Specification.
 * No infrastructure, ORM, SQL, or persistence dependencies.
 * All concrete specifications must be immutable.
 */

import { ResearchIdentity } from '../aggregate/research-identity.js';

import {
  AndSpecification,
  NotSpecification,
  OrSpecification,
  type Specification,
} from './specification.js';

/**
 * ResearchIdentitySpecification — abstract base for all ResearchIdentity
 * query specifications.
 *
 * Extends the generic Specification pattern, binding the type parameter
 * to ResearchIdentity. Concrete implementations define `isSatisfiedBy()`
 * to encapsulate specific business query rules.
 *
 * Composition operators (`and`, `or`, `not`) are inherited and return
 * generic Specification<ResearchIdentity> instances, allowing free mixing
 * of any identity specifications.
 *
 * Usage:
 * ```typescript
 * class HasAreasSpecification extends ResearchIdentitySpecification {
 *   isSatisfiedBy(identity: ResearchIdentity): boolean {
 *     return identity.areas.length > 0;
 *   }
 * }
 *
 * const spec = new HasAreasSpecification();
 * const result = spec.isSatisfiedBy(identity); // boolean
 *
 * // Compose specifications
 * const combined = spec.and(otherSpec);
 * const negated = spec.not();
 * ```
 */
export abstract class ResearchIdentitySpecification implements Specification<ResearchIdentity> {
  /**
   * Evaluate whether the given ResearchIdentity aggregate satisfies
   * this specification's business rule.
   *
   * @param identity - The ResearchIdentity aggregate to evaluate.
   * @returns `true` if the identity satisfies this specification, `false` otherwise.
   */
  abstract isSatisfiedBy(identity: ResearchIdentity): boolean;

  /**
   * Compose this specification with another using logical AND.
   * The resulting specification is satisfied only when both
   * operand specifications are satisfied.
   *
   * @param other - The specification to AND with.
   * @returns A new composite AND specification.
   */
  and(other: Specification<ResearchIdentity>): Specification<ResearchIdentity> {
    return new AndSpecification<ResearchIdentity>(this, other);
  }

  /**
   * Compose this specification with another using logical OR.
   * The resulting specification is satisfied when at least one
   * of the operand specifications is satisfied.
   *
   * @param other - The specification to OR with.
   * @returns A new composite OR specification.
   */
  or(other: Specification<ResearchIdentity>): Specification<ResearchIdentity> {
    return new OrSpecification<ResearchIdentity>(this, other);
  }

  /**
   * Negate this specification.
   * The resulting specification is satisfied when this specification
   * is NOT satisfied, and vice versa.
   *
   * @returns A new NOT specification.
   */
  not(): Specification<ResearchIdentity> {
    return new NotSpecification<ResearchIdentity>(this);
  }
}

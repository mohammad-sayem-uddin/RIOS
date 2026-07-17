/**
 * Specifications barrel — public API for the Specification Pattern.
 *
 * Exports the generic Specification interface, concrete composite
 * specifications (AND, OR, NOT), and the identity-specific
 * ResearchIdentitySpecification abstract base class.
 */

export type { Specification } from './specification.js';
export { AndSpecification, NotSpecification, OrSpecification } from './specification.js';
export { ResearchIdentitySpecification } from './research-identity-specification.js';

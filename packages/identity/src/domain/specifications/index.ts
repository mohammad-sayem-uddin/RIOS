/**
 * Specifications barrel — public API for the Specification Pattern.
 *
 * Exports the generic Specification interface, concrete composite
 * specifications (AND, OR, NOT), and the identity-specific
 * ResearchIdentitySpecification abstract base class.
 *
 * Note: AllResearchIdentitiesSpecification was removed as it was a
 * degenerate specification (always returning true) that emulated
 * findAll(). That operation is now a first-class repository method.
 */

export type { Specification } from './specification.js';
export { AndSpecification, NotSpecification, OrSpecification } from './specification.js';
export { ResearchIdentitySpecification } from './research-identity-specification.js';
export { TextSearchSpecification } from './text-search-specification.js';

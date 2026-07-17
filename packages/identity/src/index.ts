/**
 * @rios/identity
 *
 * Identity Domain Foundation — canonical Research Identity value objects and errors.
 * Exports immutable value objects that represent architectural Identity concepts.
 */

// Value Objects
export {
  ResearchStage,
  ResearchFocus,
  CollaborationType,
  ResearchStatus,
  ConfidenceLevel,
} from './domain/value-objects/identity-value-objects.js';

export type {
  ResearchStageValue,
  CollaborationTypeValue,
  ResearchStatusValue,
} from './domain/value-objects/identity-value-objects.js';

// Errors
export {
  IdentityDomainError,
  IdentityInvariantViolationError,
  IdentitySemanticNonConformanceError,
  IdentityOwnershipViolationError,
  IdentityDependencyViolationError,
  InvalidResearchStageError,
  InvalidResearchFocusError,
  InvalidCollaborationTypeError,
  InvalidResearchStatusError,
  InvalidConfidenceLevelError,
} from './domain/errors/identity-errors.js';

// Contracts
export type * from './domain/contracts/index.js';

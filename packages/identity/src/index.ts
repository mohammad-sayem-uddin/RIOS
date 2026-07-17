// ─── Identity Domain Package ───────────────────────────────────────────
// Architecture Reference: Volume I – Identity

// ─── Errors ────────────────────────────────────────────────────────────
export {
  IdentityDomainError,
  IdentityInvariantViolationError,
  DuplicateEntityItemError,
  EntityItemNotFoundError,
  InvalidTimeHorizonError,
  InvalidResearchStageError,
  InvalidResearchFocusError,
  InvalidCollaborationTypeError,
  InvalidResearchStatusError,
  InvalidConfidenceLevelError,
  InvalidResearchVisionError,
  InvalidResearchIdentitySummaryError,
  IdentityCreationInvariantError,
  AggregateInvariantViolationError,
  InvalidEntityReferenceError,
} from './domain/errors/identity-errors.js';

// ─── Value Objects ─────────────────────────────────────────────────────
export {
  ResearchStage,
  ResearchFocus,
  TimeHorizon,
  CollaborationType,
  ResearchStatus,
  ConfidenceLevel,
  ResearchVisionStatement,
  ResearchIdentitySummary,
} from './domain/value-objects/identity-value-objects.js';

// ─── Entities ──────────────────────────────────────────────────────────
export { ResearchVision } from './domain/entities/research-vision.js';
export { ResearchAgenda } from './domain/entities/research-agenda.js';
export { ResearchArea } from './domain/entities/research-area.js';
export { ResearchQuestion } from './domain/entities/research-question.js';
export { ResearchPhilosophy } from './domain/entities/research-philosophy.js';
export { ResearchValues } from './domain/entities/research-values.js';
export { ResearchEvolution } from './domain/entities/research-evolution.js';
export { ResearchMilestone } from './domain/entities/research-milestone.js';
export { ResearchGoal } from './domain/entities/research-goal.js';
export { ResearchContribution } from './domain/entities/research-contribution.js';

// ─── Aggregate Root ────────────────────────────────────────────────────
export {
  ResearchIdentity,
  type ReadonlyResearchIdentitySnapshot,
} from './domain/aggregate/research-identity.js';

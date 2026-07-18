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
  IdentityCompletenessViolationError,
  ResearchAgendaConsistencyViolationError,
  ResearchAreaEligibilityViolationError,
  ResearchGoalCompletionViolationError,
  ContributionAcceptanceViolationError,
  ResearchEvolutionViolationError,
  ResearchVisionConsistencyViolationError,
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

// ─── Domain Events ────────────────────────────────────────────────────
export {
  IdentityEvent,
  ResearchAgendaCreated,
  type ResearchAgendaCreatedPrimitives,
  ResearchAgendaUpdated,
  type ResearchAgendaUpdatedPrimitives,
  ResearchAreaAdded,
  type ResearchAreaAddedPrimitives,
  ResearchAreaArchived,
  type ResearchAreaArchivedPrimitives,
  ResearchQuestionAdded,
  type ResearchQuestionAddedPrimitives,
  GoalAchieved,
  type GoalAchievedPrimitives,
  PhilosophyRevised,
  type PhilosophyRevisedPrimitives,
  EvolutionUpdated,
  type EvolutionUpdatedPrimitives,
} from './domain/events/index.js';

// ─── Aggregate Root ────────────────────────────────────────────────────
export {
  ResearchIdentity,
  type ReadonlyResearchIdentitySnapshot,
} from './domain/aggregate/research-identity.js';

// ─── Domain Policies ─────────────────────────────────────────────────
export {
  IdentityCompletenessPolicy,
  ResearchAgendaConsistencyPolicy,
  ResearchAreaEligibilityPolicy,
  ResearchGoalCompletionPolicy,
  ContributionAcceptancePolicy,
  ResearchEvolutionPolicy,
  ResearchVisionConsistencyPolicy,
} from './domain/policies/index.js';

// ─── Domain Factories ─────────────────────────────────────────────────
export {
  ResearchIdentityFactory,
  ResearchAgendaFactory,
  ResearchAreaFactory,
  ResearchGoalFactory,
  ResearchContributionFactory,
  ResearchEvolutionFactory,
  ResearchVisionFactory,
  ResearchPhilosophyFactory,
  ResearchValuesFactory,
} from './domain/factories/index.js';

// ─── Domain Repositories ──────────────────────────────────────────────
export type { ResearchIdentityRepository } from './domain/repositories/index.js';

// ─── Domain Specifications ───────────────────────────────────────────
export type { Specification } from './domain/specifications/index.js';
export {
  AndSpecification,
  OrSpecification,
  NotSpecification,
  ResearchIdentitySpecification,
} from './domain/specifications/index.js';

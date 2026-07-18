// ─── Application Layer Package ──────────────────────────────────────────
// Architecture Reference: Clean Architecture — Application Layer
//
// Dependency Direction:
//   Application → Domain → Shared
//   Never reversed.

// ─── Research Identity (Sprint 1-4) ────────────────────────────────────
export {
  CreateResearchIdentityCommand,
  UpdateResearchVisionCommand,
  AddResearchAreaCommand,
  RemoveResearchAreaCommand,
  AddResearchQuestionCommand,
  AddResearchGoalCommand,
  RemoveResearchGoalCommand,
  RecordContributionCommand,
  UpdateResearchAgendaCommand,
  SetResearchPhilosophyCommand,
  ReviseResearchPhilosophyCommand,
  RecordEvolutionCommand,
} from './commands/index.js';

export {
  GetResearchIdentityQuery,
  FindResearchIdentitiesQuery,
  SearchResearchIdentityQuery,
} from './queries/index.js';

export type { ResearchIdentityApplicationService } from './services/index.js';
export { ResearchIdentityApplicationServiceImpl } from './services/index.js';

export {
  ResearchIdentityNotFoundError,
  ConcurrencyConflictError,
  ApplicationOperationError,
} from './errors/index.js';

export { DomainEventCoordinator, type DomainEventSource } from './events/index.js';

// ─── Identity IAM (Sprint 5) ───────────────────────────────────────────
export * from './identity/index.js';

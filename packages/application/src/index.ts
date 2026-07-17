// ─── Application Layer Package ──────────────────────────────────────────
// Architecture Reference: Clean Architecture — Application Layer
//
// This package exports the complete application surface for Research Identity:
//   - Commands (write intent models)
//   - Queries (read intent models)
//   - Service contracts (interface-only, no implementations)
//   - Errors (application-level failure types)
//
// Dependency Direction:
//   Application → Domain → Shared
//   Never reversed.

// ─── Commands ──────────────────────────────────────────────────────────
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

// ─── Queries ───────────────────────────────────────────────────────────
export {
  GetResearchIdentityQuery,
  FindResearchIdentitiesQuery,
  SearchResearchIdentityQuery,
} from './queries/index.js';

// ─── Service Contracts ─────────────────────────────────────────────────
export type { ResearchIdentityApplicationService } from './services/index.js';

// ─── Errors ────────────────────────────────────────────────────────────
export {
  ResearchIdentityNotFoundError,
  ConcurrencyConflictError,
  ApplicationOperationError,
} from './errors/index.js';

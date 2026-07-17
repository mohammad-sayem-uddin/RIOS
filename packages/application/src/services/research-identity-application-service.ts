/**
 * Purpose:
 * Application service contract for Research Identity orchestration.
 *
 * Architecture reference:
 * Application Layer — CQRS-aware service boundary.
 * This interface defines the complete application surface for Research Identity
 * write (command) and read (query) operations.
 *
 * Responsibilities:
 * - Orchestrate domain objects, repositories, factories, and policies.
 * - Translate commands into domain behavior invocations.
 * - Translate queries into repository reads.
 * - Return Result<T> for all operations — never throw.
 *
 * NOT responsible for:
 * - Business rules (Domain layer).
 * - Persistence (Infrastructure layer).
 * - HTTP/REST/GraphQL concerns (Presentation layer).
 *
 * Invariants:
 * - Interface only. No implementation.
 * - Depends ONLY on Domain, Repository, Specifications, and Shared.
 * - Zero infrastructure knowledge.
 * - All methods return Promise<Result<T>>.
 * - Business-language method names, not CRUD verbs.
 *
 * Dependency Direction:
 * Application → Domain → Shared
 * Never reversed.
 */

import type { ReadonlyResearchIdentitySnapshot } from '@rios/identity';
import type { Result, UniqueId } from '@rios/shared';

import type { AddResearchAreaCommand } from '../commands/add-research-area.command.js';
import type { AddResearchGoalCommand } from '../commands/add-research-goal.command.js';
import type { AddResearchQuestionCommand } from '../commands/add-research-question.command.js';
import type { CreateResearchIdentityCommand } from '../commands/create-research-identity.command.js';
import type { RecordContributionCommand } from '../commands/record-contribution.command.js';
import type { RecordEvolutionCommand } from '../commands/record-evolution.command.js';
import type { RemoveResearchAreaCommand } from '../commands/remove-research-area.command.js';
import type { RemoveResearchGoalCommand } from '../commands/remove-research-goal.command.js';
import type { ReviseResearchPhilosophyCommand } from '../commands/revise-research-philosophy.command.js';
import type { SetResearchPhilosophyCommand } from '../commands/set-research-philosophy.command.js';
import type { UpdateResearchAgendaCommand } from '../commands/update-research-agenda.command.js';
import type { UpdateResearchVisionCommand } from '../commands/update-research-vision.command.js';
import type { FindResearchIdentitiesQuery } from '../queries/find-research-identities.query.js';
import type { GetResearchIdentityQuery } from '../queries/get-research-identity.query.js';
import type { SearchResearchIdentityQuery } from '../queries/search-research-identity.query.js';

/**
 * ResearchIdentityApplicationService — the application boundary
 * for all Research Identity operations.
 *
 * This interface uses explicit business-language methods rather than
 * generic `execute(command)` / `execute(query)` overloads.
 *
 * Design rationale:
 * - Each method corresponds to a single, well-defined application use case.
 * - Explicit methods provide stronger type safety than generic dispatchers.
 * - Business-language names make the service's capabilities self-documenting.
 * - All fallible operations return Result<T> — the caller always handles failure.
 *
 * Future extension:
 * - If a CQRS bus (MediatR-style) is introduced later, each method becomes
 *   a handler registration target. The interface remains stable.
 * - If event publishing is added, domain events are collected from the aggregate
 *   after command execution and dispatched — not by the service directly.
 */
export interface ResearchIdentityApplicationService {
  // ─── Command Side (Write) ─────────────────────────────────────────────

  /**
   * Establish a new Research Identity.
   *
   * Orchestration:
   * 1. Use ResearchIdentityFactory to create the aggregate from command data.
   * 2. Persist via ResearchIdentityRepository.save().
   * 3. Return the new identity's UniqueId.
   *
   * @param command - The creation command containing initial identity data.
   * @returns Result<UniqueId> — the created identity's identifier, or failure.
   */
  establishResearchIdentity(command: CreateResearchIdentityCommand): Promise<Result<UniqueId>>;

  /**
   * Refine the research vision of an existing identity.
   *
   * Orchestration:
   * 1. Load aggregate via ResearchIdentityRepository.findById().
   * 2. Invoke aggregate.updateVision() domain behavior.
   * 3. Persist via ResearchIdentityRepository.save().
   *
   * @param command - The vision update command.
   * @returns Result<void> — success or failure.
   */
  refineResearchVision(command: UpdateResearchVisionCommand): Promise<Result<void>>;

  /**
   * Incorporate a new research area into an identity.
   *
   * Orchestration:
   * 1. Load aggregate.
   * 2. Invoke aggregate.addResearchArea() domain behavior.
   * 3. Persist.
   *
   * @param command - The add research area command.
   * @returns Result<void> — success or failure.
   */
  incorporateResearchArea(command: AddResearchAreaCommand): Promise<Result<void>>;

  /**
   * Archive a research area from an identity.
   *
   * Orchestration:
   * 1. Load aggregate.
   * 2. Invoke aggregate.removeResearchArea() domain behavior.
   * 3. Persist.
   *
   * @param command - The remove research area command.
   * @returns Result<void> — success or failure.
   */
  archiveResearchArea(command: RemoveResearchAreaCommand): Promise<Result<void>>;

  /**
   * Pose a new research question within an identity.
   *
   * Orchestration:
   * 1. Load aggregate.
   * 2. Invoke aggregate.addResearchQuestion() domain behavior.
   * 3. Persist.
   *
   * @param command - The add research question command.
   * @returns Result<void> — success or failure.
   */
  poseResearchQuestion(command: AddResearchQuestionCommand): Promise<Result<void>>;

  /**
   * Pursue a new research goal within an identity.
   *
   * Orchestration:
   * 1. Load aggregate.
   * 2. Invoke aggregate.addResearchGoal() domain behavior.
   * 3. Persist.
   *
   * @param command - The add research goal command.
   * @returns Result<void> — success or failure.
   */
  pursueResearchGoal(command: AddResearchGoalCommand): Promise<Result<void>>;

  /**
   * Retire a research goal from an identity.
   *
   * Orchestration:
   * 1. Load aggregate.
   * 2. Invoke aggregate.removeResearchGoal() domain behavior.
   * 3. Persist.
   *
   * @param command - The remove research goal command.
   * @returns Result<void> — success or failure.
   */
  retireResearchGoal(command: RemoveResearchGoalCommand): Promise<Result<void>>;

  /**
   * Document a research contribution within an identity.
   *
   * Orchestration:
   * 1. Load aggregate.
   * 2. Invoke aggregate.recordContribution() domain behavior.
   * 3. Persist.
   *
   * @param command - The record contribution command.
   * @returns Result<void> — success or failure.
   */
  documentContribution(command: RecordContributionCommand): Promise<Result<void>>;

  /**
   * Reshape the research agenda of an identity.
   *
   * Orchestration:
   * 1. Load aggregate.
   * 2. Invoke aggregate.updateAgenda() domain behavior.
   * 3. Persist.
   *
   * @param command - The update research agenda command.
   * @returns Result<void> — success or failure.
   */
  reshapeResearchAgenda(command: UpdateResearchAgendaCommand): Promise<Result<void>>;

  /**
   * Establish the philosophical foundation of an identity.
   *
   * Orchestration:
   * 1. Load aggregate.
   * 2. Invoke aggregate.setPhilosophy() domain behavior.
   * 3. Persist.
   *
   * @param command - The set research philosophy command.
   * @returns Result<void> — success or failure.
   */
  establishPhilosophy(command: SetResearchPhilosophyCommand): Promise<Result<void>>;

  /**
   * Evolve the philosophical foundation of an identity.
   *
   * Orchestration:
   * 1. Load aggregate.
   * 2. Invoke aggregate.revisePhilosophy() domain behavior.
   * 3. Persist.
   *
   * @param command - The revise research philosophy command.
   * @returns Result<void> — success or failure.
   */
  evolvePhilosophy(command: ReviseResearchPhilosophyCommand): Promise<Result<void>>;

  /**
   * Chronicle an evolution event within an identity.
   *
   * Orchestration:
   * 1. Load aggregate.
   * 2. Invoke aggregate.recordEvolution() domain behavior.
   * 3. Persist.
   *
   * @param command - The record evolution command.
   * @returns Result<void> — success or failure.
   */
  chronicleEvolution(command: RecordEvolutionCommand): Promise<Result<void>>;

  // ─── Query Side (Read) ────────────────────────────────────────────────

  /**
   * Retrieve a single Research Identity by its unique identifier.
   *
   * Returns an immutable snapshot of the aggregate state.
   * The snapshot is a read-only projection — it does not expose
   * domain behavior methods.
   *
   * @param query - The get-by-id query.
   * @returns Result<ReadonlyResearchIdentitySnapshot> — the identity snapshot, or failure.
   */
  retrieveResearchIdentity(
    query: GetResearchIdentityQuery,
  ): Promise<Result<ReadonlyResearchIdentitySnapshot>>;

  /**
   * Discover Research Identities with pagination.
   *
   * Uses the repository to retrieve matching identities.
   *
   * @param query - The find query with pagination parameters.
   * @returns Result<ReadonlyResearchIdentitySnapshot[]> — matching identities, or failure.
   */
  discoverResearchIdentities(
    query: FindResearchIdentitiesQuery,
  ): Promise<Result<ReadonlyResearchIdentitySnapshot[]>>;

  /**
   * Explore Research Identities by search criteria.
   *
   * Uses domain specifications to express query intent,
   * delegating to the repository's findMatching() operation.
   *
   * @param query - The search query with search term and pagination.
   * @returns Result<ReadonlyResearchIdentitySnapshot[]> — matching identities, or failure.
   */
  exploreResearchIdentities(
    query: SearchResearchIdentityQuery,
  ): Promise<Result<ReadonlyResearchIdentitySnapshot[]>>;
}

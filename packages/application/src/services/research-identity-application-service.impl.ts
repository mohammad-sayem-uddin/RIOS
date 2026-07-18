/**
 * Purpose:
 * Concrete implementation of the ResearchIdentityApplicationService interface.
 * Orchestrates command and query flows against the ResearchIdentity aggregate
 * through the ResearchIdentityRepository contract.
 *
 * Architecture reference:
 * Application Layer — CQRS Orchestration.
 *
 * This service:
 * - Loads aggregates from the repository.
 * - Delegates all business decisions to the Domain (Aggregate, Entities, Factories, Policies).
 * - Persists through the repository contract.
 * - Collects and clears Domain Events after successful coordination.
 * - Returns Result<T> for all operations.
 *
 * This service does NOT:
 * - Contain business rules.
 * - Validate domain invariants.
 * - Know SQL, Prisma, Mongo, REST, HTTP, Express, NestJS, or GraphQL.
 * - Implement an Event Bus.
 * - Publish events (Infrastructure will publish later).
 *
 * Dependency rule:
 * Application → Identity Domain → Shared. Never reverse.
 */

import {
  ResearchIdentity,
  ResearchIdentityRepository,
  ResearchAreaFactory,
  ResearchGoalFactory,
  ResearchContributionFactory,
  ResearchVisionFactory,
  ResearchAgendaFactory,
  ResearchPhilosophyFactory,
  ResearchValuesFactory,
  ResearchEvolutionFactory,
  TextSearchSpecification,
  IdentityEvent,
  type ReadonlyResearchIdentitySnapshot,
} from '@rios/identity';
import { Result, UniqueId } from '@rios/shared';

import {
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
} from '../commands/index.js';
import { ResearchIdentityNotFoundError, ApplicationOperationError } from '../errors/index.js';
import { DomainEventCoordinator } from '../events/domain-event-coordinator.js';
import {
  GetResearchIdentityQuery,
  FindResearchIdentitiesQuery,
  SearchResearchIdentityQuery,
} from '../queries/index.js';

import type { ResearchIdentityApplicationService } from './research-identity-application-service.js';

/**
 * ResearchIdentityApplicationServiceImpl — concrete application service.
 *
 * Orchestrates every command and query against the ResearchIdentity aggregate.
 * All business logic is delegated to the Domain layer. This service only
 * coordinates: load → invoke → persist → collect events → return result.
 *
 * Event coordination:
 * - After each successful command, the service collects pending domain events
 *   from the aggregate and clears them.
 * - The collected events are exposed through getPendingEvents().
 * - Infrastructure will publish these events later.
 * - The service does NOT implement an Event Bus.
 */
export class ResearchIdentityApplicationServiceImpl implements ResearchIdentityApplicationService {
  /**
   * Reusable coordinator for domain event lifecycle.
   *
   * Collects events from aggregates after successful commands,
   * stores them for Infrastructure to retrieve, and provides
   * clearing after successful publication.
   *
   * This eliminates duplicate event collection logic across
   * all command handlers.
   */
  private readonly eventCoordinator = new DomainEventCoordinator();

  constructor(private readonly repository: ResearchIdentityRepository) {}

  // ─── Command Handlers ─────────────────────────────────────────────────

  /**
   * Create a new ResearchIdentity aggregate.
   *
   * Orchestration:
   * 1. Create each domain entity via factories (Vision, Agenda, Philosophy, Values, Evolution).
   * 2. Use ResearchIdentity.create() to assemble the aggregate.
   * 3. Persist through the repository.
   * 4. Collect domain events.
   * 5. Return Result<UniqueId> — the created identity's identifier.
   */
  async establishResearchIdentity(
    command: CreateResearchIdentityCommand,
  ): Promise<Result<UniqueId>> {
    // Step 1: Create domain entities from command primitives via factories
    const visionResult = ResearchVisionFactory.create({
      statement: command.visionStatement,
      timeHorizon: command.timeHorizon,
    });
    if (visionResult.isFailure) {
      return Result.fail<UniqueId>(visionResult.error);
    }

    const agendaResult = ResearchAgendaFactory.create({
      focus: command.agendaFocus,
      status: command.agendaStatus,
    });
    if (agendaResult.isFailure) {
      return Result.fail<UniqueId>(agendaResult.error);
    }

    const philosophyResult = ResearchPhilosophyFactory.create({
      statement: command.philosophyStatement,
    });
    if (philosophyResult.isFailure) {
      return Result.fail<UniqueId>(philosophyResult.error);
    }

    const valuesResult = ResearchValuesFactory.create({
      statement: command.valuesStatement,
      values: [command.valuesStatement],
    });
    if (valuesResult.isFailure) {
      return Result.fail<UniqueId>(valuesResult.error);
    }

    const evolutionResult = ResearchEvolutionFactory.create({
      description: command.evolutionDescription,
    });
    if (evolutionResult.isFailure) {
      return Result.fail<UniqueId>(evolutionResult.error);
    }

    // Step 2: Assemble the aggregate through its domain factory
    const createResult = ResearchIdentity.create({
      vision: visionResult.value,
      agenda: agendaResult.value,
      philosophy: philosophyResult.value,
      values: valuesResult.value,
      evolution: evolutionResult.value,
    });

    if (createResult.isFailure) {
      return Result.fail<UniqueId>(createResult.error);
    }

    const identity = createResult.value;

    // Step 3: Persist through repository contract
    const saveResult = await this.repository.save(identity);
    if (saveResult.isFailure) {
      return Result.fail<UniqueId>(
        new ApplicationOperationError({
          operationName: 'establishResearchIdentity',
          message: saveResult.error,
        }).message,
      );
    }

    // Step 4: Collect domain events
    this.collectAndClearEvents(identity);

    // Step 5: Return the identity's UniqueId
    return Result.ok<UniqueId>(identity.id);
  }

  /**
   * Update the research vision on an existing ResearchIdentity.
   *
   * Orchestration:
   * 1. Load aggregate from repository.
   * 2. Use ResearchVisionFactory to create the vision entity.
   * 3. Invoke aggregate.updateVision() (domain decides).
   * 4. Persist through repository.
   * 5. Collect domain events.
   * 6. Return Result<void>.
   */
  async refineResearchVision(command: UpdateResearchVisionCommand): Promise<Result<void>> {
    const loadResult = await this.loadIdentity(command.identityId);
    if (loadResult.isFailure) {
      return Result.fail<void>(loadResult.error);
    }
    const identity = loadResult.value;

    const visionResult = ResearchVisionFactory.create({
      statement: command.visionStatement,
      timeHorizon: command.timeHorizon,
    });
    if (visionResult.isFailure) {
      return Result.fail<void>(visionResult.error);
    }

    identity.updateVision(visionResult.value);

    return this.persistAndCollect(identity, 'refineResearchVision');
  }

  /**
   * Add a research area to the ResearchIdentity.
   *
   * Orchestration:
   * 1. Load aggregate from repository.
   * 2. Use ResearchAreaFactory to create the entity from command primitives.
   * 3. Invoke aggregate.addResearchArea() (domain decides).
   * 4. Persist through repository.
   * 5. Collect domain events.
   * 6. Return Result<void>.
   */
  async incorporateResearchArea(command: AddResearchAreaCommand): Promise<Result<void>> {
    const loadResult = await this.loadIdentity(command.identityId);
    if (loadResult.isFailure) {
      return Result.fail<void>(loadResult.error);
    }
    const identity = loadResult.value;

    const areaResult = ResearchAreaFactory.create({
      name: command.areaName,
      description: command.areaDescription,
    });
    if (areaResult.isFailure) {
      return Result.fail<void>(areaResult.error);
    }

    const addResult = identity.addResearchArea(areaResult.value);
    if (addResult.isFailure) {
      return Result.fail<void>(addResult.error);
    }

    return this.persistAndCollect(identity, 'incorporateResearchArea');
  }

  /**
   * Archive a research area on the ResearchIdentity.
   *
   * Orchestration:
   * 1. Load aggregate from repository.
   * 2. Invoke aggregate.removeResearchArea() (domain decides).
   * 3. Persist through repository.
   * 4. Collect domain events.
   * 5. Return Result<void>.
   */
  async archiveResearchArea(command: RemoveResearchAreaCommand): Promise<Result<void>> {
    const loadResult = await this.loadIdentity(command.identityId);
    if (loadResult.isFailure) {
      return Result.fail<void>(loadResult.error);
    }
    const identity = loadResult.value;

    const areaId = UniqueId.from(command.areaId);
    const archiveResult = identity.removeResearchArea(areaId);
    if (archiveResult.isFailure) {
      return Result.fail<void>(archiveResult.error);
    }

    return this.persistAndCollect(identity, 'archiveResearchArea');
  }

  /**
   * Add a research question to the ResearchIdentity.
   *
   * Orchestration:
   * 1. Load aggregate from repository.
   * 2. Use ResearchAreaFactory.createQuestion to create the question entity.
   * 3. Invoke aggregate.addResearchQuestion() (domain decides).
   * 4. Persist through repository.
   * 5. Collect domain events.
   * 6. Return Result<void>.
   */
  async poseResearchQuestion(command: AddResearchQuestionCommand): Promise<Result<void>> {
    const loadResult = await this.loadIdentity(command.identityId);
    if (loadResult.isFailure) {
      return Result.fail<void>(loadResult.error);
    }
    const identity = loadResult.value;

    const questionResult = ResearchAreaFactory.createQuestion(
      command.questionText,
      command.questionAreaId,
    );
    if (questionResult.isFailure) {
      return Result.fail<void>(questionResult.error);
    }

    const addResult = identity.addResearchQuestion(questionResult.value);
    if (addResult.isFailure) {
      return Result.fail<void>(addResult.error);
    }

    return this.persistAndCollect(identity, 'poseResearchQuestion');
  }

  /**
   * Add a research goal to the ResearchIdentity.
   *
   * Orchestration:
   * 1. Load aggregate from repository.
   * 2. Use ResearchGoalFactory to create the entity from command primitives.
   * 3. Invoke aggregate.addGoal() (domain decides).
   * 4. Persist through repository.
   * 5. Collect domain events.
   * 6. Return Result<void>.
   */
  async pursueResearchGoal(command: AddResearchGoalCommand): Promise<Result<void>> {
    const loadResult = await this.loadIdentity(command.identityId);
    if (loadResult.isFailure) {
      return Result.fail<void>(loadResult.error);
    }
    const identity = loadResult.value;

    const goalResult = ResearchGoalFactory.create({
      description: command.goalDescription,
      status: command.goalStatus,
      deadlineAt: command.goalTargetDate,
    });
    if (goalResult.isFailure) {
      return Result.fail<void>(goalResult.error);
    }

    const addResult = identity.addGoal(goalResult.value);
    if (addResult.isFailure) {
      return Result.fail<void>(addResult.error);
    }

    return this.persistAndCollect(identity, 'pursueResearchGoal');
  }

  /**
   * Remove a research goal from the ResearchIdentity.
   *
   * Orchestration:
   * 1. Load aggregate from repository.
   * 2. Invoke aggregate.removeGoal() (domain decides).
   * 3. Persist through repository.
   * 4. Collect domain events.
   * 5. Return Result<void>.
   */
  async retireResearchGoal(command: RemoveResearchGoalCommand): Promise<Result<void>> {
    const loadResult = await this.loadIdentity(command.identityId);
    if (loadResult.isFailure) {
      return Result.fail<void>(loadResult.error);
    }
    const identity = loadResult.value;

    const goalId = UniqueId.from(command.goalId);
    const removeResult = identity.removeGoal(goalId);
    if (removeResult.isFailure) {
      return Result.fail<void>(removeResult.error);
    }

    return this.persistAndCollect(identity, 'retireResearchGoal');
  }

  /**
   * Record a contribution on the ResearchIdentity.
   *
   * Orchestration:
   * 1. Load aggregate from repository.
   * 2. Use ResearchContributionFactory to create the entity from command primitives.
   * 3. Invoke aggregate.recordContribution() (domain decides).
   * 4. Persist through repository.
   * 5. Collect domain events.
   * 6. Return Result<void>.
   */
  async documentContribution(command: RecordContributionCommand): Promise<Result<void>> {
    const loadResult = await this.loadIdentity(command.identityId);
    if (loadResult.isFailure) {
      return Result.fail<void>(loadResult.error);
    }
    const identity = loadResult.value;

    const contributionResult = ResearchContributionFactory.create({
      description: command.contributionDescription,
      contributedAt: command.contributionDate,
    });
    if (contributionResult.isFailure) {
      return Result.fail<void>(contributionResult.error);
    }

    const recordResult = identity.recordContribution(contributionResult.value);
    if (recordResult.isFailure) {
      return Result.fail<void>(recordResult.error);
    }

    return this.persistAndCollect(identity, 'documentContribution');
  }

  /**
   * Update the research agenda on the ResearchIdentity.
   *
   * Orchestration:
   * 1. Load aggregate from repository.
   * 2. Use ResearchAgendaFactory to create the agenda entity.
   * 3. Invoke aggregate.updateAgenda() (domain decides).
   * 4. Persist through repository.
   * 5. Collect domain events.
   * 6. Return Result<void>.
   */
  async reshapeResearchAgenda(command: UpdateResearchAgendaCommand): Promise<Result<void>> {
    const loadResult = await this.loadIdentity(command.identityId);
    if (loadResult.isFailure) {
      return Result.fail<void>(loadResult.error);
    }
    const identity = loadResult.value;

    const agendaResult = ResearchAgendaFactory.create({
      focus: command.agendaFocus,
      status: command.agendaStatus,
    });
    if (agendaResult.isFailure) {
      return Result.fail<void>(agendaResult.error);
    }

    identity.updateAgenda(agendaResult.value);

    return this.persistAndCollect(identity, 'reshapeResearchAgenda');
  }

  /**
   * Set the philosophy on the ResearchIdentity.
   *
   * Orchestration:
   * 1. Load aggregate from repository.
   * 2. Use ResearchPhilosophyFactory to create the philosophy entity.
   * 3. Invoke aggregate.updatePhilosophy() (domain decides).
   * 4. Persist through repository.
   * 5. Collect domain events.
   * 6. Return Result<void>.
   */
  async establishPhilosophy(command: SetResearchPhilosophyCommand): Promise<Result<void>> {
    const loadResult = await this.loadIdentity(command.identityId);
    if (loadResult.isFailure) {
      return Result.fail<void>(loadResult.error);
    }
    const identity = loadResult.value;

    const combinedStatement = [
      command.philosophicalStance,
      command.epistemologicalView,
      command.methodologicalPreference,
    ].join('. ');

    const philosophyResult = ResearchPhilosophyFactory.create({
      statement: combinedStatement,
    });
    if (philosophyResult.isFailure) {
      return Result.fail<void>(philosophyResult.error);
    }

    identity.updatePhilosophy(philosophyResult.value);

    return this.persistAndCollect(identity, 'establishPhilosophy');
  }

  /**
   * Revise the philosophy on the ResearchIdentity.
   *
   * Orchestration:
   * 1. Load aggregate from repository.
   * 2. Use ResearchPhilosophyFactory to create the revised philosophy entity.
   * 3. Invoke aggregate.updatePhilosophy() (domain decides).
   * 4. Persist through repository.
   * 5. Collect domain events.
   * 6. Return Result<void>.
   */
  async evolvePhilosophy(command: ReviseResearchPhilosophyCommand): Promise<Result<void>> {
    const loadResult = await this.loadIdentity(command.identityId);
    if (loadResult.isFailure) {
      return Result.fail<void>(loadResult.error);
    }
    const identity = loadResult.value;

    const combinedStatement = [
      command.philosophicalStance,
      command.epistemologicalView,
      command.methodologicalPreference,
    ].join('. ');

    const philosophyResult = ResearchPhilosophyFactory.create({
      statement: combinedStatement,
    });
    if (philosophyResult.isFailure) {
      return Result.fail<void>(philosophyResult.error);
    }

    identity.updatePhilosophy(philosophyResult.value);

    return this.persistAndCollect(identity, 'evolvePhilosophy');
  }

  /**
   * Record evolution on the ResearchIdentity.
   *
   * Orchestration:
   * 1. Load aggregate from repository.
   * 2. Use ResearchEvolutionFactory to create the evolution entity.
   * 3. Invoke aggregate.updateEvolution() (domain decides).
   * 4. Persist through repository.
   * 5. Collect domain events.
   * 6. Return Result<void>.
   */
  async chronicleEvolution(command: RecordEvolutionCommand): Promise<Result<void>> {
    const loadResult = await this.loadIdentity(command.identityId);
    if (loadResult.isFailure) {
      return Result.fail<void>(loadResult.error);
    }
    const identity = loadResult.value;

    const evolutionResult = ResearchEvolutionFactory.create({
      description: command.evolutionDescription,
    });
    if (evolutionResult.isFailure) {
      return Result.fail<void>(evolutionResult.error);
    }

    identity.updateEvolution(evolutionResult.value);

    return this.persistAndCollect(identity, 'chronicleEvolution');
  }

  // ─── Query Handlers ───────────────────────────────────────────────────

  /**
   * Get a ResearchIdentity by ID.
   *
   * Orchestration:
   * 1. Load aggregate from repository by ID.
   * 2. Convert to immutable snapshot.
   * 3. Return Result<ReadonlyResearchIdentitySnapshot>.
   */
  async retrieveResearchIdentity(
    query: GetResearchIdentityQuery,
  ): Promise<Result<ReadonlyResearchIdentitySnapshot>> {
    const loadResult = await this.loadIdentity(query.identityId);
    if (loadResult.isFailure) {
      return Result.fail<ReadonlyResearchIdentitySnapshot>(loadResult.error);
    }
    return Result.ok<ReadonlyResearchIdentitySnapshot>(loadResult.value.toSnapshot());
  }

  /**
   * Retrieve all ResearchIdentity aggregates.
   *
   * Orchestration:
   * 1. Delegate to repository.findAll() — a fundamental collection operation.
   * 2. Convert each aggregate to an immutable snapshot.
   * 3. Return Result<ReadonlyResearchIdentitySnapshot[]>.
   *
   * Pagination and access-scoping are infrastructure concerns handled by the
   * repository implementation. The domain expresses the business intent:
   * "retrieve all research identities from the collection."
   */
  async discoverResearchIdentities(
    _query: FindResearchIdentitiesQuery,
  ): Promise<Result<ReadonlyResearchIdentitySnapshot[]>> {
    const findResult = await this.repository.findAll();
    if (findResult.isFailure) {
      return Result.fail<ReadonlyResearchIdentitySnapshot[]>(
        new ApplicationOperationError({
          operationName: 'discoverResearchIdentities',
          message: findResult.error,
        }).message,
      );
    }

    const snapshots = findResult.value.map((identity) => identity.toSnapshot());
    return Result.ok<ReadonlyResearchIdentitySnapshot[]>(snapshots);
  }

  /**
   * Search ResearchIdentity aggregates by text search term.
   *
   * Orchestration:
   * 1. Create TextSearchSpecification from the query's search term.
   * 2. Delegate to repository.findMatching() — infrastructure applies
   *    pagination and text search execution.
   * 3. Convert each matching aggregate to an immutable snapshot.
   * 4. Return Result<ReadonlyResearchIdentitySnapshot[]>.
   *
   * The TextSearchSpecification is a domain specification that expresses
   * the business intent: "find research identities whose textual fields
   * contain the search term." How this is executed (SQL LIKE, full-text
   * search, Elasticsearch) is an infrastructure concern.
   */
  async exploreResearchIdentities(
    query: SearchResearchIdentityQuery,
  ): Promise<Result<ReadonlyResearchIdentitySnapshot[]>> {
    const specification = new TextSearchSpecification(query.searchTerm);

    const findResult = await this.repository.findMatching(specification);
    if (findResult.isFailure) {
      return Result.fail<ReadonlyResearchIdentitySnapshot[]>(
        new ApplicationOperationError({
          operationName: 'exploreResearchIdentities',
          message: findResult.error,
        }).message,
      );
    }

    const snapshots = findResult.value.map((identity) => identity.toSnapshot());
    return Result.ok<ReadonlyResearchIdentitySnapshot[]>(snapshots);
  }

  // ─── Event Coordination ───────────────────────────────────────────────

  /**
   * Get pending domain events collected from the aggregate after successful commands.
   *
   * These events are NOT published by the Application Layer.
   * Infrastructure will retrieve and publish them later.
   * This method exposes the collected events for that purpose.
   */
  getPendingEvents(): IdentityEvent[] {
    return this.eventCoordinator.getPendingEvents() as IdentityEvent[];
  }

  /**
   * Clear all pending domain events after successful coordination.
   *
   * Called after events have been collected and are ready for
   * Infrastructure to consume.
   */
  clearPendingEvents(): void {
    this.eventCoordinator.clearPendingEvents();
  }

  // ─── Private Helpers ──────────────────────────────────────────────────

  /**
   * Load a ResearchIdentity aggregate by ID.
   *
   * Returns ResearchIdentityNotFoundError if the aggregate does not exist.
   * Returns ApplicationOperationError if the repository operation fails.
   */
  private async loadIdentity(identityId: string): Promise<Result<ResearchIdentity>> {
    const id = UniqueId.from(identityId);
    const loadResult = await this.repository.findById(id);

    if (loadResult.isFailure) {
      return Result.fail<ResearchIdentity>(
        new ApplicationOperationError({
          operationName: 'loadIdentity',
          message: loadResult.error,
        }).message,
      );
    }

    if (loadResult.value === undefined || loadResult.value === null) {
      return Result.fail<ResearchIdentity>(new ResearchIdentityNotFoundError(identityId).message);
    }

    return Result.ok(loadResult.value);
  }

  /**
   * Persist the aggregate and collect domain events.
   * Combines the save + event collection into a single helper.
   */
  private async persistAndCollect(
    identity: ResearchIdentity,
    operationName: string,
  ): Promise<Result<void>> {
    const saveResult = await this.repository.save(identity);
    if (saveResult.isFailure) {
      return Result.fail<void>(
        new ApplicationOperationError({
          operationName,
          message: saveResult.error,
        }).message,
      );
    }

    this.collectAndClearEvents(identity);

    return Result.ok<void>();
  }

  /**
   * Collect pending domain events from the aggregate and clear them.
   *
   * Delegates to DomainEventCoordinator — the reusable coordination
   * mechanism that extracts, stores, and clears domain events after
   * successful aggregate operations.
   *
   * Domain events are raised by the aggregate during domain behavior.
   * After successful persistence, the coordinator collects them.
   * Infrastructure retrieves and publishes them later.
   */
  private collectAndClearEvents(identity: ResearchIdentity): void {
    this.eventCoordinator.collectFrom(identity);
  }
}

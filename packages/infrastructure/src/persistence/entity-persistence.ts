/**
 * Purpose:
 * Defines the persistence entity shapes for all Identity Domain aggregates.
 *
 * These shapes are Infrastructure-owned and represent the intermediate
 * form between database rows and domain aggregates.
 *
 * Mapping flow:
 *   Database Row → Persistence Entity → Domain Aggregate
 *   Domain Aggregate → Snapshot → Persistence Entity → Database Row
 *
 * Design decisions:
 * - All value objects are stored as primitives (string, number, boolean).
 * - Collections are stored as related entities (one-to-many) or embedded documents.
 * - IDs are stored as strings (UUID format).
 * - Timestamps are stored as ISO 8601 strings.
 * - Nullable fields represent optional domain concepts.
 *
 * These types are NOT exported from the package. They are internal
 * to Infrastructure and used only by mapper implementations.
 */

/**
 * Persistence shape for the ResearchIdentity aggregate root.
 * Corresponds to the main research_identities table/document.
 */
export interface ResearchIdentityPersistenceEntity {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Persistence shape for ResearchVision value object.
 * Stored as a separate row or embedded in the identity document.
 */
export interface ResearchVisionPersistenceEntity {
  readonly identityId: string;
  readonly statement: string;
  readonly timeHorizon: string;
  readonly ambitions: string;
}

/**
 * Persistence shape for ResearchAgenda entity.
 */
export interface ResearchAgendaPersistenceEntity {
  readonly identityId: string;
  readonly focus: string;
  readonly objectives: string;
}

/**
 * Persistence shape for ResearchArea entity.
 */
export interface ResearchAreaPersistenceEntity {
  readonly id: string;
  readonly identityId: string;
  readonly name: string;
  readonly description: string;
}

/**
 * Persistence shape for ResearchQuestion entity.
 */
export interface ResearchQuestionPersistenceEntity {
  readonly id: string;
  readonly identityId: string;
  readonly question: string;
  readonly areaId: string | null;
}

/**
 * Persistence shape for ResearchPhilosophy value object.
 */
export interface ResearchPhilosophyPersistenceEntity {
  readonly identityId: string;
  readonly statement: string;
}

/**
 * Persistence shape for ResearchValues value object.
 */
export interface ResearchValuesPersistenceEntity {
  readonly identityId: string;
  readonly principles: string;
}

/**
 * Persistence shape for ResearchEvolution entity.
 */
export interface ResearchEvolutionPersistenceEntity {
  readonly id: string;
  readonly identityId: string;
  readonly description: string;
  readonly occurredAt: string;
}

/**
 * Persistence shape for ResearchGoal entity.
 */
export interface ResearchGoalPersistenceEntity {
  readonly id: string;
  readonly identityId: string;
  readonly title: string;
  readonly description: string;
  readonly status: string;
}

/**
 * Persistence shape for ResearchContribution entity.
 */
export interface ResearchContributionPersistenceEntity {
  readonly id: string;
  readonly identityId: string;
  readonly title: string;
  readonly type: string;
  readonly occurredAt: string;
}

/**
 * Persistence shape for ResearchMilestone entity.
 */
export interface ResearchMilestonePersistenceEntity {
  readonly id: string;
  readonly identityId: string;
  readonly title: string;
  readonly achievedAt: string;
}

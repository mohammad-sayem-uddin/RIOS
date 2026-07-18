/**
 * Purpose:
 * Persistence entity types for the ResearchIdentity aggregate.
 * These types contain ONLY primitives — no domain types, no Value Objects.
 *
 * Architecture reference:
 * Mapping Strategy §4 Snapshot Strategy.
 *
 * Flow:
 * Domain Aggregate → Snapshot (domain types) → Persistence Entity (primitives) → DB Row
 * DB Row → Persistence Entity → Snapshot → Domain Aggregate
 *
 * Responsibilities:
 * Define the infrastructure-owned shape of aggregate data for persistence.
 * Decouple domain Value Objects from database column types.
 */

// ─── Persistence Entity (infrastructure-owned, primitives only) ──────────

/**
 * ResearchIdentity persistence entity.
 * Contains ONLY primitive values suitable for database storage.
 */
export interface ResearchIdentityPersistence {
  id: string;
  createdAt: string;
  updatedAt: string;
  vision: VisionPersistence;
  agenda: AgendaPersistence;
  philosophy: PhilosophyPersistence;
  values: ValuesPersistence;
  evolution: EvolutionPersistence;
  areas: AreaPersistence[];
  questions: QuestionPersistence[];
  goals: GoalPersistence[];
  contributions: ContributionPersistence[];
  milestones: MilestonePersistence[];
}

export interface VisionPersistence {
  id: string;
  visionStatement: string;
  timeHorizon: string;
  lastRefinedAt: string;
  createdAt: string;
}

export interface AgendaPersistence {
  id: string;
  focus: string;
  status: string;
  areaIds: string[];
  themes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PhilosophyPersistence {
  id: string;
  statement: string;
  principles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ValuesPersistence {
  id: string;
  statement: string;
  values: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EvolutionPersistence {
  id: string;
  description: string;
  status: string;
  confidence: number;
  milestoneIds: string[];
  recordedAt: string;
  createdAt: string;
}

export interface AreaPersistence {
  id: string;
  name: string;
  description: string;
  status: string;
  confidence: number;
  questionIds: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Question persistence — matches domain ResearchQuestion entity.
 * question/motivation are ResearchFocus VOs (stored as strings).
 * status is ResearchStatus VO, confidence is ConfidenceLevel VO.
 */
export interface QuestionPersistence {
  id: string;
  question: string;
  motivation: string;
  status: string;
  confidence: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Goal persistence — matches domain ResearchGoal entity.
 * description is ResearchFocus VO (stored as string).
 * status is ResearchStatus VO, confidence is ConfidenceLevel VO.
 * deadlineAt replaces the old targetDate.
 */
export interface GoalPersistence {
  id: string;
  description: string;
  status: string;
  confidence: number;
  deadlineAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Contribution persistence — matches domain ResearchContribution entity.
 * description is ResearchFocus VO (stored as string).
 * significance is ConfidenceLevel VO.
 * contributedAt is the date the contribution was made.
 */
export interface ContributionPersistence {
  id: string;
  description: string;
  significance: number;
  contributedAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Milestone persistence — matches domain ResearchMilestone entity.
 * description is ResearchFocus VO (stored as string).
 * confidence is ConfidenceLevel VO.
 */
export interface MilestonePersistence {
  id: string;
  description: string;
  confidence: number;
  occurredAt: string;
  createdAt: string;
}

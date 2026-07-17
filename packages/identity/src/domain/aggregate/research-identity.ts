import { AggregateRoot } from '@rios/shared';

import type {
  IntellectualTimeline,
  ProfessionalContext,
  ResearchAgenda,
  ResearchEvolution,
  ResearchGoals,
  ResearchPhilosophy,
  ResearchPurpose,
  ResearchValues,
  ResearchVision,
} from '../entities/index.js';

export interface ResearchIdentityProps {
  readonly professionalContext?: ProfessionalContext;
  readonly researchAgenda?: ResearchAgenda;
  readonly researchEvolution?: ResearchEvolution;
  readonly researchGoals?: ResearchGoals;
  readonly researchPhilosophy?: ResearchPhilosophy;
  readonly researchPurpose?: ResearchPurpose;
  readonly researchValues?: ResearchValues;
  readonly researchVision?: ResearchVision;
  readonly intellectualTimeline?: IntellectualTimeline;
}

/**
 * Purpose:
 * Canonical aggregate root placeholder for Research Identity, the emergent,
 * persistent representation of a researcher's intellectual direction.
 *
 * Architecture reference:
 * Volume I Chapter 2 sections 2.3, 2.4, 2.8; Volume I Chapter 9 ST-001;
 * Foundation Identity Volume section 3.1.
 *
 * ADR reference:
 * ADR-101, ADR-102, ADR-103, ADR-104, ADR-105, ADR-106.
 *
 * Ownership:
 * Identity Domain. Consumed by all domains through published interfaces only.
 *
 * Invariants:
 * Research Identity is the sole aggregate root; it owns exactly one primary
 * Research Agenda at a time; it persists across career and technology changes;
 * it remains representation-independent and evidence-based.
 *
 * Future responsibilities:
 * Deterministic replay from verifiable events, aggregate consistency protection,
 * identity version preservation, and publication of canonical domain events.
 */
export abstract class ResearchIdentity extends AggregateRoot<ResearchIdentityProps> {}

/**
 * Purpose:
 * Provides concise representation of Research Identity.
 *
 * Architecture reference:
 * Volume I Chapter 7 Interface 1; Volume I Chapter 2 interface table.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Exposes only canonical identity information and remains read-only for
 * consumers.
 *
 * Future responsibilities:
 * Output research direction, research stage, research vision, and identity
 * summary.
 */
export interface IdentitySummaryInterface {
  readonly identitySummaryInterface?: never;
}

/**
 * Purpose:
 * Exposes long-term scientific direction.
 *
 * Architecture reference:
 * Volume I Chapter 7 Interface 2; Volume I Chapter 10 IDN-CORE-006.
 *
 * ADR reference:
 * ADR-102.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Consumers may read but must not modify canonical Research Agenda.
 *
 * Future responsibilities:
 * Output research agenda, research priorities, and strategic themes.
 */
export interface ResearchAgendaInterface {
  readonly researchAgendaInterface?: never;
}

/**
 * Purpose:
 * Exposes scientific reasoning principles.
 *
 * Architecture reference:
 * Volume I Chapter 7 Interface 3; Volume I Chapter 10 IDN-CORE-004.
 *
 * ADR reference:
 * ADR-005.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Interface semantics remain implementation-independent and preserve Research
 * Philosophy meaning.
 *
 * Future responsibilities:
 * Output philosophy statements, methodological principles, and Research
 * Values.
 */
export interface ResearchPhilosophyInterface {
  readonly researchPhilosophyInterface?: never;
}

/**
 * Purpose:
 * Exposes canonical scientific domains.
 *
 * Architecture reference:
 * Volume I Chapter 7 Interface 4; Volume I Chapter 10 IDN-CORE-003.
 *
 * ADR reference:
 * ADR-106.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Consumers must not redefine Research Areas or their hierarchy.
 *
 * Future responsibilities:
 * Output Research Areas, relationships, and hierarchy.
 */
export interface ResearchAreasInterface {
  readonly researchAreasInterface?: never;
}

/**
 * Purpose:
 * Exposes longitudinal identity development.
 *
 * Architecture reference:
 * Volume I Chapter 7 Interface 5; Volume I Chapter 4 lifecycle model.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Identity Timeline preserves milestones, transitions, and historical
 * evolution.
 *
 * Future responsibilities:
 * Output milestones, transitions, and historical evolution.
 */
export interface IdentityTimelineInterface {
  readonly identityTimelineInterface?: never;
}

/**
 * Purpose:
 * Provides contextual identity information.
 *
 * Architecture reference:
 * Volume I Chapter 7 Interface 6; Volume I Chapter 2 Professional Context.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Context supports identity and never becomes the primary representation of
 * identity.
 *
 * Future responsibilities:
 * Output affiliations, positions, collaborations, and academic status.
 */
export interface IdentityContextInterface {
  readonly identityContextInterface?: never;
}

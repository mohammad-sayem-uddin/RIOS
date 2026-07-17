import { Entity } from '@rios/shared';

interface IdentityEntityProps {
  readonly architecturePlaceholder?: never;
}

/**
 * Purpose:
 * Captures the fundamental why behind the researcher's work as the semantic
 * anchor for identity components.
 *
 * Architecture reference:
 * ADR-103; Volume I Chapter 3 semantic hierarchy; Volume I Chapter 8 Vision
 * Engine responsibility.
 *
 * ADR reference:
 * ADR-103, ADR-105.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Research Purpose anchors Vision, Areas, and Questions; it must remain
 * traceable through identity evolution.
 *
 * Future responsibilities:
 * Versioned purpose articulation and traceability to every identity component.
 */
export abstract class ResearchPurpose extends Entity<IdentityEntityProps> {}

/**
 * Purpose:
 * Represents the long-term scientific direction that guides all research
 * activity.
 *
 * Architecture reference:
 * CTD TERM-002; Volume I Chapter 2 section 2.5.1; Volume I Chapter 10
 * IDN-CORE-002.
 *
 * ADR reference:
 * ADR-101, ADR-102.
 *
 * Ownership:
 * Identity Domain; consumed by Knowledge and Narrative.
 *
 * Invariants:
 * Exactly one primary Research Agenda exists at any given time; Research
 * Agenda remains independent of implementation technologies.
 *
 * Future responsibilities:
 * Primary and supporting agenda tracking, agenda evolution, and agenda
 * exposure through the Research Agenda Interface.
 */
export abstract class ResearchAgenda extends Entity<IdentityEntityProps> {}

/**
 * Purpose:
 * Preserves the principles governing how research problems are selected,
 * investigated, and evaluated.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.2; Volume I Chapter 10 IDN-CORE-004;
 * Volume I Chapter 8 Philosophy Layer.
 *
 * ADR reference:
 * ADR-005, ADR-101.
 *
 * Ownership:
 * Identity Domain; consumed by Narrative and Publication.
 *
 * Invariants:
 * Research Philosophy remains independent of specific technologies and changes
 * slowly across identity evolution.
 *
 * Future responsibilities:
 * Versioned philosophy refinement and exposure through the Research Philosophy
 * Interface.
 */
export abstract class ResearchPhilosophy extends Entity<IdentityEntityProps> {}

/**
 * Purpose:
 * Represents the non-technical principles guiding scientific work.
 *
 * Architecture reference:
 * CTD TERM-001 relationships; Volume I Chapter 2 section 2.5.3; Volume I
 * Chapter 8 Philosophy Layer.
 *
 * ADR reference:
 * ADR-005, ADR-101.
 *
 * Ownership:
 * Identity Domain; consumed by Publication.
 *
 * Invariants:
 * Research Values are stable identity foundations and must not be treated as
 * achievements or reputation signals.
 *
 * Future responsibilities:
 * Preservation of ethical, reproducibility, transparency, and engineering
 * discipline values across representations.
 */
export abstract class ResearchValues extends Entity<IdentityEntityProps> {}

/**
 * Purpose:
 * Represents persistent scientific domains that organize investigations within
 * Research Identity.
 *
 * Architecture reference:
 * CTD TERM-003; Volume I Chapter 2 section 2.5.4; Volume I Chapter 10
 * IDN-CORE-003.
 *
 * ADR reference:
 * ADR-102, ADR-106.
 *
 * Ownership:
 * Identity Domain foundation; consumed by Knowledge and Visualization through
 * canonical interfaces.
 *
 * Invariants:
 * Research Areas contribute to Research Agenda, remain stable despite changing
 * technologies, and represent scientific domains rather than tools.
 *
 * Future responsibilities:
 * Hierarchical area organization, cross-area relationship modeling, and
 * Research Areas Interface exposure.
 */
export abstract class ResearchArea extends Entity<IdentityEntityProps> {}

/**
 * Purpose:
 * Represents a clearly articulated scientific uncertainty that motivates
 * investigation.
 *
 * Architecture reference:
 * CTD TERM-004; Volume I Chapter 3 semantic hierarchy; Volume I Chapter 9
 * ST-003 and SC-001.
 *
 * ADR reference:
 * ADR-010, ADR-102, ADR-106.
 *
 * Ownership:
 * Identity Domain foundation; consumed by Knowledge, Publication, and
 * Visualization.
 *
 * Invariants:
 * Research Questions precede Projects, possess globally unique identifiers,
 * and remain connected across identity transitions.
 *
 * Future responsibilities:
 * Question evolution, area linkage, knowledge initiation, and traceability to
 * evidence and publications.
 */
export abstract class ResearchQuestion extends Entity<IdentityEntityProps> {}

/**
 * Purpose:
 * Records the evolution of scientific thinking rather than chronological
 * biography.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.5; Volume I Chapter 4 sections 4.4, 4.7,
 * 4.8; Volume I Chapter 7 Identity Timeline Interface.
 *
 * ADR reference:
 * ADR-101, ADR-102.
 *
 * Ownership:
 * Identity Domain; consumed by Evolution and Visualization.
 *
 * Invariants:
 * Intellectual Timeline emphasizes questions, conceptual shifts,
 * methodological evolution, and significant insights rather than employment
 * chronology.
 *
 * Future responsibilities:
 * Milestone recording, transition ordering, and historical continuity
 * preservation.
 */
export abstract class IntellectualTimeline extends Entity<IdentityEntityProps> {}

/**
 * Purpose:
 * Describes the long-term destination of the research program.
 *
 * Architecture reference:
 * Foundation Identity Volume ontology; Volume I Chapter 2 section 2.5.6;
 * Volume I Chapter 9 EC-004.
 *
 * ADR reference:
 * ADR-105.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Research Vision extends beyond current projects, derives from Research
 * Purpose, encompasses Research Areas, and remains recognizable despite
 * growth.
 *
 * Future responsibilities:
 * Versioned vision evolution and Vision Engine coordination.
 */
export abstract class ResearchVision extends Entity<IdentityEntityProps> {}

/**
 * Purpose:
 * Translates Research Vision into measurable milestones while remaining
 * distinct from the Vision itself.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.7; Volume I Chapter 4 Identity Milestones.
 *
 * ADR reference:
 * ADR-101, ADR-105.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Research Goals support Vision and may evolve without replacing the Vision.
 *
 * Future responsibilities:
 * Milestone alignment and goal evolution traceability.
 */
export abstract class ResearchGoals extends Entity<IdentityEntityProps> {}

/**
 * Purpose:
 * Records how intellectual direction changes over time.
 *
 * Architecture reference:
 * CTD TERM-001 relationships; Volume I Chapter 2 section 2.5.8; Volume I
 * Chapter 4 lifecycle rules.
 *
 * ADR reference:
 * ADR-101, ADR-104.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Research Evolution is additive; historical identity is never rewritten or
 * deleted; every transition requires evidence.
 *
 * Future responsibilities:
 * Transition reasoning, version history, and preservation of previous identity
 * states.
 */
export abstract class ResearchEvolution extends Entity<IdentityEntityProps> {}

/**
 * Purpose:
 * Provides environmental information that helps interpret the research journey.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.5.9; Volume I Chapter 7 Identity Context
 * Interface; Volume I Chapter 9 IC-006.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Professional Context supports identity but never becomes the primary
 * representation of identity.
 *
 * Future responsibilities:
 * Contextual affiliations, collaborations, teaching roles, and academic status
 * exposed without redefining Research Identity.
 */
export abstract class ProfessionalContext extends Entity<IdentityEntityProps> {}

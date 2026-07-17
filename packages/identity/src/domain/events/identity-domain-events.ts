import { DomainEvent } from '@rios/shared';

/**
 * Purpose:
 * Placeholder for the event that records creation of a Research Agenda.
 *
 * Architecture reference:
 * Volume I Chapter 10 section 10.5; DMS Layer 10.
 *
 * ADR reference:
 * ADR-101, ADR-102.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Events preserve historical traceability and are immutable once recorded.
 *
 * Future responsibilities:
 * Carry agenda creation context after event schema governance is defined.
 */
export abstract class ResearchAgendaCreated extends DomainEvent {
  public abstract override readonly eventType: 'ResearchAgendaCreated';
}

/**
 * Purpose:
 * Placeholder for the event that records an updated Research Agenda.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.9; Volume I Chapter 10 section 10.5.
 *
 * ADR reference:
 * ADR-101, ADR-102.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Agenda updates preserve the one-primary-agenda rule and historical
 * traceability.
 *
 * Future responsibilities:
 * Carry changed agenda context and evidence links when behavior is introduced.
 */
export abstract class ResearchAgendaUpdated extends DomainEvent {
  public abstract override readonly eventType: 'ResearchAgendaUpdated';
}

/**
 * Purpose:
 * Placeholder for the event that records addition of a Research Area.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.9; Volume I Chapter 10 section 10.5.
 *
 * ADR reference:
 * ADR-106.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Added Research Areas contribute to the Research Agenda and represent
 * scientific domains rather than tools.
 *
 * Future responsibilities:
 * Carry area hierarchy and agenda relationship context.
 */
export abstract class ResearchAreaAdded extends DomainEvent {
  public abstract override readonly eventType: 'ResearchAreaAdded';
}

/**
 * Purpose:
 * Placeholder for the event that records archival of a Research Area.
 *
 * Architecture reference:
 * Volume I Chapter 10 section 10.5; Volume I Chapter 9 EC-001.
 *
 * ADR reference:
 * ADR-101, ADR-106.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Archival must preserve historical identity and never delete prior context.
 *
 * Future responsibilities:
 * Carry archival rationale, timestamp, evidence, and affected relationships.
 */
export abstract class ResearchAreaArchived extends DomainEvent {
  public abstract override readonly eventType: 'ResearchAreaArchived';
}

/**
 * Purpose:
 * Placeholder for the event that records a revised Research Philosophy.
 *
 * Architecture reference:
 * Volume I Chapter 10 section 10.5; Volume I Chapter 8 Philosophy Layer.
 *
 * ADR reference:
 * ADR-005, ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Philosophy revisions remain independent of implementation technologies.
 *
 * Future responsibilities:
 * Carry revised methodological principles and evolution rationale.
 */
export abstract class PhilosophyRevised extends DomainEvent {
  public abstract override readonly eventType: 'PhilosophyRevised';
}

/**
 * Purpose:
 * Placeholder for the event that records a refined Research Philosophy.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.9; Volume I Chapter 4 section 4.8.
 *
 * ADR reference:
 * ADR-005, ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Refinement preserves continuity of reasoning and historical traceability.
 *
 * Future responsibilities:
 * Carry refinement rationale and evidence once event schemas are introduced.
 */
export abstract class ResearchPhilosophyRefined extends DomainEvent {
  public abstract override readonly eventType: 'ResearchPhilosophyRefined';
}

/**
 * Purpose:
 * Placeholder for the event that records an identity milestone.
 *
 * Architecture reference:
 * Volume I Chapter 4 section 4.7; Volume I Chapter 10 section 10.5.
 *
 * ADR reference:
 * ADR-101, ADR-104.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Milestones support identity but must not dominate the representation of
 * identity.
 *
 * Future responsibilities:
 * Carry milestone context, affected entities, and supporting evidence.
 */
export abstract class IdentityMilestoneRecorded extends DomainEvent {
  public abstract override readonly eventType: 'IdentityMilestoneRecorded';
}

/**
 * Purpose:
 * Placeholder for the event that records career stage transition.
 *
 * Architecture reference:
 * Volume I Chapter 10 section 10.5; Volume I Chapter 4 canonical lifecycle.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Career stage transitions do not automatically redefine Research Identity
 * without evidence.
 *
 * Future responsibilities:
 * Carry transition rationale and evidence-supported stage context.
 */
export abstract class CareerStageTransition extends DomainEvent {
  public abstract override readonly eventType: 'CareerStageTransition';
}

/**
 * Purpose:
 * Placeholder for the event that records advancement of career stage.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.9; Volume I Chapter 4 lifecycle model.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Advancement reflects intellectual maturity rather than title or affiliation
 * alone.
 *
 * Future responsibilities:
 * Carry lifecycle phase evidence after behavior is approved.
 */
export abstract class CareerStageAdvanced extends DomainEvent {
  public abstract override readonly eventType: 'CareerStageAdvanced';
}

/**
 * Purpose:
 * Placeholder for the event that records publication of an identity version.
 *
 * Architecture reference:
 * Volume I Chapter 10 section 10.5; Volume I Chapter 9 EC-003.
 *
 * ADR reference:
 * ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Previous identity versions remain inspectable after a new version is
 * published.
 *
 * Future responsibilities:
 * Carry version metadata once event persistence is introduced.
 */
export abstract class IdentityVersionPublished extends DomainEvent {
  public abstract override readonly eventType: 'IdentityVersionPublished';
}

/**
 * Purpose:
 * Placeholder for the event that records a major research transition.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.9; Volume I Chapter 4 section 4.8.
 *
 * ADR reference:
 * ADR-101, ADR-104.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Major transitions preserve previous context and require supporting evidence.
 *
 * Future responsibilities:
 * Carry transition reasoning, affected entities, and evidence references.
 */
export abstract class MajorResearchTransition extends DomainEvent {
  public abstract override readonly eventType: 'MajorResearchTransition';
}

/**
 * Purpose:
 * Placeholder for the event that records Research Vision expansion.
 *
 * Architecture reference:
 * Volume I Chapter 2 section 2.9; Volume I Chapter 9 EC-004.
 *
 * ADR reference:
 * ADR-105.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Vision expansion preserves a recognizable Research Vision despite growth.
 *
 * Future responsibilities:
 * Carry vision versioning context and area relationships.
 */
export abstract class ResearchVisionExpanded extends DomainEvent {
  public abstract override readonly eventType: 'ResearchVisionExpanded';
}

/**
 * Purpose:
 * Placeholder for the event that records a changed research direction.
 *
 * Architecture reference:
 * Volume I Chapter 4 section 4.8; Volume I Chapter 9 EC-002.
 *
 * ADR reference:
 * ADR-101, ADR-104.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Direction changes require meaningful accumulated evidence and preserve
 * continuity.
 *
 * Future responsibilities:
 * Carry direction-change rationale and affected semantic relationships.
 */
export abstract class ResearchDirectionChanged extends DomainEvent {
  public abstract override readonly eventType: 'ResearchDirectionChanged';
}

/**
 * Purpose:
 * Placeholder for the event that records adoption of a new Research Area.
 *
 * Architecture reference:
 * Volume I Chapter 4 section 4.8; Volume I Chapter 8 Area Manager.
 *
 * ADR reference:
 * ADR-106.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Adopted Research Areas remain connected to Vision and Agenda.
 *
 * Future responsibilities:
 * Carry new area scope, hierarchy, and cross-area relationship context.
 */
export abstract class NewResearchAreaAdopted extends DomainEvent {
  public abstract override readonly eventType: 'NewResearchAreaAdopted';
}

/**
 * Purpose:
 * Placeholder for the event that records a major methodological shift.
 *
 * Architecture reference:
 * Volume I Chapter 4 section 4.8; Volume I Chapter 8 Philosophy Layer.
 *
 * ADR reference:
 * ADR-005, ADR-101.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Methodological shifts preserve traceability and do not erase previous
 * reasoning.
 *
 * Future responsibilities:
 * Carry methodological rationale and supporting evidence.
 */
export abstract class MajorMethodologicalShift extends DomainEvent {
  public abstract override readonly eventType: 'MajorMethodologicalShift';
}

/**
 * Purpose:
 * Placeholder for the event that records cross-disciplinary expansion.
 *
 * Architecture reference:
 * Volume I Chapter 4 section 4.8; Foundation Identity Volume Polymathic
 * Agendas decision.
 *
 * ADR reference:
 * ADR-102, ADR-106.
 *
 * Ownership:
 * Identity Domain.
 *
 * Invariants:
 * Expansion must preserve a coherent primary Research Agenda and explicit
 * cross-area relationships.
 *
 * Future responsibilities:
 * Carry secondary agenda and area relationship context.
 */
export abstract class CrossDisciplinaryExpansion extends DomainEvent {
  public abstract override readonly eventType: 'CrossDisciplinaryExpansion';
}

/**
 * Purpose:
 * Placeholder for the event that records a foundational publication release as
 * identity evidence.
 *
 * Architecture reference:
 * Volume I Chapter 4 section 4.8; Volume I Chapter 9 IC-004.
 *
 * ADR reference:
 * ADR-101, ADR-104.
 *
 * Ownership:
 * Identity Domain consumes publication evidence without owning Publication
 * Domain internals.
 *
 * Invariants:
 * Publications support identity but do not define identity.
 *
 * Future responsibilities:
 * Carry evidence references through semantic contracts, not direct publication
 * infrastructure.
 */
export abstract class FoundationalPublicationReleased extends DomainEvent {
  public abstract override readonly eventType: 'FoundationalPublicationReleased';
}

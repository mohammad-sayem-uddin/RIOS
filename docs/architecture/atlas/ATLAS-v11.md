**RIOS** **Research Identity Operating System** **ATLAS** Version 1.1 —
Publication Edition
────────────────────────────────────────────────────────────────────────────────
_Visual Architecture Reference_ The definitive visual guide to the RIOS
architecture
────────────────────────────────────────────────────────────────────────────────
Classification: Architecture Reference Status: Publication Release Parent
Document: RIOS Volumes 0–VIII

# Revision History

# Version History

# Table of Contents

1. Architecture Vision
2. Architecture Principles
3. Architecture Layers
4. Domain Overview
5. Foundation Architecture
6. Identity Domain
7. Knowledge Domain
8. Communication Domains
9. Visualization Domain
10. Motion Domain
11. Engineering Domain
12. Implementation Domain
13. Cross-Domain Architecture
14. Architecture Validation Appendix A: Improvement Summary Appendix B: Diagram
    Index

# 1. Architecture Vision

The Research Identity Operating System (RIOS) establishes a universal,
verifiable architecture for academic trajectories. It treats a researcher's
identity not as a static narrative, but as an emergent, evolving projection of
verifiable scientific contributions, methodologies, and continuous intellectual
inquiry. **Architectural Rationale** RIOS exists because the academic world
lacks a structured, evidence-based system for representing research identity.
Traditional approaches — CVs, personal websites, social profiles — are
subjective and unverifiable. RIOS inverts this: identity emerges from knowledge,
not self-description.

_Figure 1.1 — RIOS Architecture Vision: Core Philosophy (Radial Knowledge Map)_

## 1.1 Core Mission

RIOS is engineered according to one principle: Architecture precedes
implementation. The system flows from Research → Architecture → Domain Model →
Requirements → Implementation → Verification. Any implementation developed
without architectural alignment is considered non-conforming.

## 1.2 Design Considerations

Identity is an emergent property — it is inferred from evidence rather than
declared through self-description. This fundamental design decision shapes every
aspect of the architecture, from the dependency graph to the interface
contracts. Knowledge precedes documents. Questions precede projects. Evidence
precedes conclusions. These invariants are not preferences — they are
architectural constraints that ensure long-term semantic integrity.

# 2. Architecture Principles

RIOS is governed by ten normative architecture principles. These principles are
derived from the Master Architecture Blueprint (MAB) and remain invariant across
all versions. Violation of any principle requires formal architectural review.

_Figure 2.1 — Ten Architecture Principles (Decision Matrix)_

## 2.1 Why This Matters

Architecture principles serve as the decision-making framework for every
subsequent design choice. When ambiguity arises, principles resolve it. When
trade-offs exist, principles guide resolution. They are the constitution of the
technical architecture.

## 2.2 Architectural Invariants

The following invariants SHALL remain true regardless of future versions:

# 3. Architecture Layers

RIOS consists of seven architectural layers. Each layer depends only on layers
above it. This dependency direction SHALL NOT be violated. The layers are
ordered by semantic stability — the most stable concepts occupy the highest
positions.

_Figure 3.1 — Seven Architecture Layers (Stack Diagram)_

## 3.1 Layer Responsibilities

## 3.2 Knowledge Flow Architecture

The most important architectural rule in RIOS: Knowledge → Artifacts →
Presentation → Interface. This is NOT reversed. The homepage does not define
projects; knowledge defines what appears on the homepage. This unidirectional
flow prevents UI-driven architecture.

_Figure 3.2 — Knowledge Flow Stack (Correct vs. Anti-Pattern)_

# 4. Domain Overview

RIOS consists of eight primary domains, each owning a unique responsibility. No
responsibility is shared without explicit architectural approval. The domain —
not the webpage — is the fundamental architectural building block of RIOS.

_Figure 4.1 — RIOS Domain Overview: Eight Primary Domains (Capability Map)_

## 4.1 Domain Ownership

## 4.2 Dependency Architecture

Dependencies follow a strict directed acyclic graph (DAG). Circular dependencies
are prohibited. All dependency chains terminate at the Identity Domain. This
ensures that the most stable concepts (identity, knowledge) are never influenced
by less stable concepts (presentation, motion).

_Figure 4.2 — RIOS Dependency Architecture: Directed Acyclic Graph_

## 4.3 Capability Map

The capability map organizes domains into four functional groups: Identity &
Knowledge (foundational), Communication (narrative + scholarly), Understanding
(visualization + motion), and Engineering & Operations (platform +
implementation). This grouping reveals the architectural intent behind domain
placement.

_Figure 4.3 — RIOS Capability Map: Domain Responsibilities (Grouped Layout)_

# 5. Foundation Architecture

The Foundation Architecture (Volume 0) defines the meta-architecture that
governs every document, subsystem, requirement, component, and implementation
within RIOS. It is the constitution of the architecture itself.

_Figure 5.1 — RIOS System Overview: Architecture Landscape_

## 5.1 Document Inheritance Chain

Architecture authority flows downward through a well-defined inheritance chain.
Lower documents SHALL NOT redefine higher-level architectural decisions. This
prevents architectural drift and ensures consistent evolution.

_Figure 5.2 — Architecture Hierarchy: Document Inheritance Chain_

## 5.2 System Context

RIOS exists within an ecosystem of actors: researchers (primary users), AI
agents (implementation assistants), institutions (organizational context), and
the broader academic community. The system context diagram shows how these
actors interact with the RIOS system boundary.

_Figure 5.3 — System Context Diagram (C4-Style)_

## 5.3 Architecture Flow

The architecture flow follows a spiral lifecycle: Vision → Principles → Domains
→ Models → Requirements → Implementation → Verification. This is not a waterfall
— it is an iterative process where each cycle strengthens the architecture.

_Figure 5.4 — Architecture Flow: From Vision to Verification (Lifecycle Spiral)_

# 6. Identity Domain

The Identity Domain is the architectural root of RIOS. It defines who the
researcher is — not through self-description, but through evidence-derived
intellectual identity. Identity depends on nothing; everything depends on
Identity. **Domain Identity**

## 6.1 Domain Components

_Figure 6.1 — Identity Domain: Eight Components_

## 6.2 DDD Tactical Model

The Identity Domain follows Domain-Driven Design (DDD) tactical patterns.
Research Identity is the aggregate root, containing entities (Research Agenda,
Research Area, Research Question, Research Dossier), value objects (Confidence
Level, Research Stage, Verification Status), and domain services (Identity
Consistency, Semantic Validation).

_Figure 6.2 — Identity Bounded Context: DDD Tactical Model_

## 6.3 Architecture Blueprint

The Identity Domain follows the canonical nine-layer architecture defined by the
Domain Model Specification. Each layer builds upon the previous, ensuring that
purpose precedes ontology, ontology precedes entities, and entities precedes
requirements.

_Figure 6.3 — Identity Architecture Blueprint: Nine Layers_

## 6.4 Entity-Relationship Model

_Figure 6.4 — Identity Entity-Relationship Diagram_

## 6.5 Identity Lifecycle

Identity evolves through five stages: Emerging → Developing → Established →
Evolving → Legacy. This lifecycle is not linear — it includes a continuous
feedback loop where evidence strengthens identity at every stage.

_Figure 6.5 — Identity Lifecycle: From Vision to Established Identity_

## 6.6 Invariants

The Identity Domain is governed by six invariants (IC-001 through IC-006). These
are non-negotiable constraints that must always remain true. Violation
constitutes architectural non-conformance.

_Figure 6.6 — Identity Business Rules: Invariant Constraints_

## 6.7 Context Map

As the upstream core domain, Identity provides the foundation for all downstream
contexts. Knowledge, Communication, and Visualization domains consume Identity
through access control layers (ACL) and shared kernels.

_Figure 6.7 — Identity Context Map: Upstream/Downstream Relationships_

## 6.8 Verification Flow

Identity verification is continuous: Submit Evidence → Extract Claims → Validate
Semantics → Check Invariants → Update Identity. Identity is never final — it
evolves with evidence.

_Figure 6.8 — Identity Verification Flow_

## 6.9 Cross-Domain Interactions

_Figure 6.9 — Identity Interaction Diagram: Cross-Domain Flows_

## 6.10 Capability Map

_Figure 6.10 — Identity Capability Map_

## 6.11 Domain Dependencies

_Figure 6.11 — Identity Domain Dependencies_

## 6.12 DDD Tactical Patterns

_Figure 6.12 — Identity DDD Diagram: Tactical Patterns (Entities, VOs, Events,
Services)_

# 7. Knowledge Domain

The Knowledge Domain organizes scientific knowledge within RIOS. It defines what
is known, how evidence supports claims, and how reasoning connects observations
to understanding. Knowledge is the highest-level intellectual output represented
within RIOS. **Domain Identity**

## 7.1 Domain Components

_Figure 7.1 — Knowledge Domain: Eight Components_

## 7.2 DDD Tactical Model

The Knowledge Domain follows DDD tactical patterns with Knowledge Base as the
aggregate root. Entities include Concept, Claim, Evidence Item, Reasoning Chain,
and Ontology Term. Value objects include Confidence Level, Knowledge Version,
Evidence Type, and Relation Type.

_Figure 7.2 — Knowledge Bounded Context: DDD Tactical Model_

## 7.3 Knowledge Lifecycle

Knowledge progresses through five states: Hypothesis → Investigation → Evidence
Gathering → Validated Knowledge → Disseminated Knowledge. The lifecycle is
circular — evidence strengthens through iteration.

_Figure 7.3 — Knowledge Lifecycle: Five States_

## 7.4 Entity-Relationship Model

_Figure 7.4 — Knowledge Entity-Relationship Diagram_

## 7.5 Research Lifecycle

The research lifecycle connects all knowledge activities: Research Question →
Hypothesis → Experiment Design → Data Collection → Analysis & Reasoning →
Knowledge Claim → Publication. Evidence connects all stages.

_Figure 7.5 — Research Lifecycle: Seven Stages_

## 7.6 Knowledge Evolution

Knowledge complexity increases over time. Growth accelerates as the evidence
base expands and reasoning chains deepen. This temporal perspective reveals the
compounding nature of scientific understanding.

_Figure 7.6 — Knowledge Evolution Timeline_

## 7.7 Academic Trust Model

Trust in academia builds from the bottom up: Publication Record → Evidence Base
→ Methodological Rigor → Research Consistency → Identity Coherence → Recognition
& Impact. Each level depends on the stability of lower levels.

_Figure 7.7 — Academic Trust Model: Trust Pyramid_

## 7.8 DDD Tactical Patterns

_Figure 7.8 — Knowledge DDD Diagram: Tactical Patterns_

# 8. Communication Domains

RIOS separates communication into two complementary domains: Knowledge
Communication (narrative storytelling for broad audiences) and Scholarly
Communication (academic publication and peer review). Together, they ensure
research reaches both expert and non-expert audiences effectively.

## 8.1 Knowledge Communication

The Knowledge Communication Domain handles narrative storytelling, audience
modeling, knowledge translation, and engagement design. It transforms expert
knowledge into accessible narratives without losing scientific accuracy.

_Figure 8.1 — Knowledge Communication Domain: Eight Components_

## 8.2 Scholarly Communication

The Scholarly Communication Domain manages the publication lifecycle, peer
review, citation management, impact measurement, and academic reputation. It
operates within the conventions of academic publishing while leveraging modern
digital capabilities.

_Figure 8.2 — Scholarly Communication Domain: Eight Components_

# 9. Visualization Domain

The Visualization Domain supports cognitive understanding through scientific
visualization. It includes knowledge graphs, concept maps, ontology diagrams,
research dashboards, timeline visualizations, citation networks, and
architecture diagrams.

_Figure 9.1 — Scientific Visualization Domain: Eight Components_

## 9.1 Design Tradeoffs

Visualization must balance completeness with clarity. A knowledge graph that
shows every relationship becomes unreadable; one that shows too few loses
meaning. The Visualization Domain provides configurable views that adapt to
audience and context.

# 10. Motion Domain

The Motion Domain supports cognitive communication by tracking how research
identity evolves over time. It captures research direction, intellectual
momentum, trajectory modeling, milestone management, and future projection.

_Figure 10.1 — Cognitive Motion Domain: Eight Components_

## 10.1 Architecture Implications

Motion depends on all previous domains (Identity, Knowledge, Communication,
Publication, Visualization). This makes it the most connected domain in the
architecture. However, it maintains independence from Engineering and Evolution
domains.

# 11. Engineering Domain

The Engineering Domain ensures software quality through platform architecture,
API design, database management, authentication, caching, event-driven
communication, and observability. It provides the technical foundation upon
which all domains are implemented.

_Figure 11.1 — Platform Engineering Domain: Eight Components_

## 11.1 Service Architecture

The platform follows a layered service architecture: API Gateway → Application
Services → Domain Services → Data Layer → Infrastructure. Each service
encapsulates a single domain concern, ensuring modularity and independent
evolution.

_Figure 11.2 — Platform Service Architecture: Five Layers_

## 11.2 Infrastructure Architecture

_Figure 11.3 — Infrastructure Architecture (Five-Layer Stack)_

## 11.3 Database Architecture

RIOS uses six storage technologies, each serving a specific architectural
purpose: PostgreSQL (core relational), Elasticsearch (full-text search), Redis
(caching), Object Storage (media), Graph Database (semantic relations), Time
Series DB (metrics).

_Figure 11.4 — Database Architecture: Six Storage Technologies_

# 12. Implementation Domain

The Implementation Domain governs how RIOS is realized in code. It covers
repository structure, development workflow, AI-first development with Claude
Code, testing frameworks, CI/CD pipelines, deployment strategies, monitoring,
and production architecture.

_Figure 12.1 — Implementation Domain: Eight Components_

## 12.1 Repository Layout

Each domain has its own source directory. Tests mirror source structure. This
organization ensures that domain boundaries are reflected in the codebase.

_Figure 12.2 — Repository Layout: Project Structure_

## 12.2 Development Workflow

Every implementation begins with architecture review. The workflow follows six
stages: Architecture Review → Planning & Design → Claude Code Implementation →
Testing & Validation → Conformance Check → Deployment. A continuous feedback
loop ensures quality.

_Figure 12.3 — Development Workflow: Six Stages_

## 12.3 Deployment Architecture

RIOS uses three deployment environments: Development (Docker Compose), Staging
(Kubernetes), and Production (K8s Multi-region with CDN). The CI/CD pipeline
automates progression through these environments.

_Figure 12.4 — Deployment Architecture: Three Environments_

# 13. Cross-Domain Architecture

Understanding individual domains is necessary but not sufficient. The true power
of RIOS emerges from how domains work together. This chapter presents the
cross-domain views that reveal the integrated architecture.

## 13.1 Cross-Domain Dependency Map

The complete system view shows all domain interconnections. Dependencies flow in
one direction only, from Identity (root) through Knowledge, Communication,
Visualization, Motion, Engineering, to Evolution. No circular dependencies
exist.

_Figure 13.1 — Cross-Domain Dependency Map: Complete System View_

## 13.2 Strategic Context Map

Following DDD context mapping patterns, Identity is the upstream core domain.
Knowledge and Communication are core domains. Visualization and Motion are
supporting domains. Engineering is a generic domain accessible to all.

_Figure 13.2 — Strategic Context Map: DDD Context Map Pattern_

## 13.3 Consumer-Provider Graph

Integration contracts define how domains consume each other's capabilities.
Identity provides to most consumers. Knowledge provides evidence and claims.
Platform provides infrastructure. These contracts are governed by published
interfaces.

_Figure 13.3 — Consumer-Provider Graph: Integration Contracts_

# 14. Architecture Validation

This chapter presents the architecture validation checklists used to verify that
the Atlas accurately represents the RIOS architecture without contradiction.

## 14.1 Architecture Review Checklist

## 14.2 Quality Assurance Checklist

## 14.3 Publication Readiness Checklist

# Appendix A: Major Improvements in v1.1

This appendix documents the major improvements made during the refinement from
Atlas v1.0 to v1.1.

# Appendix B: Complete Diagram Index

This appendix provides a complete index of all diagrams in the Atlas, organized
by domain.

| Version | Date       | Classification      | Description                                                                                                   |
| ------- | ---------- | ------------------- | ------------------------------------------------------------------------------------------------------------- |
| 1.0     | 2026-01-01 | Initial Release     | Original Atlas with foundational diagrams                                                                     |
| 1.1     | 2026-07-16 | Publication Edition | Complete refinement: improved diagrams, typography, cross-references, navigation, and professional formatting |

| Document                         | Version | Status              | Notes                               |
| -------------------------------- | ------- | ------------------- | ----------------------------------- |
| RIOS Atlas                       | 1.1     | Publication Release | Final architecture visual reference |
| Master Architecture Blueprint    | 1.0     | Normative           | Constitution of RIOS architecture   |
| Canonical Terminology Dictionary | 1.0     | Normative           | Official RIOS vocabulary            |
| Domain Dependency Matrix         | 1.0     | Normative           | Dependency governance               |
| Domain Ownership Matrix          | 1.0     | Normative           | Ownership governance                |
| Domain Model Specification       | 1.0     | Normative           | Canonical domain structure          |
| Architecture Governance Standard | 1.0     | Normative           | Change management                   |

| Invariant     | Statement                                   |
| ------------- | ------------------------------------------- |
| Invariant I   | Knowledge precedes documents                |
| Invariant II  | Research Questions precede Projects         |
| Invariant III | Evidence precedes Conclusions               |
| Invariant IV  | Reasoning precedes Implementation           |
| Invariant V   | Identity emerges from Knowledge             |
| Invariant VI  | Architecture remains technology independent |
| Invariant VII | Interfaces communicate — they do not define |

| Layer | Name           | Question Answered                      |
| ----- | -------------- | -------------------------------------- |
| 1     | Vision         | Why does RIOS exist?                   |
| 2     | Principles     | What rules govern RIOS?                |
| 3     | Domains        | What bounded contexts exist?           |
| 4     | Models         | What entities and relationships exist? |
| 5     | Requirements   | What must the system do?               |
| 6     | Implementation | How is it realized?                    |
| 7     | Verification   | How is conformance confirmed?          |

| Domain        | ID  | Primary Responsibility                |
| ------------- | --- | ------------------------------------- |
| Identity      | IDN | Define who the researcher is          |
| Knowledge     | KNO | Define what is known                  |
| Narrative     | NAR | Explain why it matters (storytelling) |
| Publication   | PUB | Preserve scientific outputs           |
| Visualization | VIS | Improve understanding                 |
| Motion        | MOT | Improve cognition (trajectory)        |
| Engineering   | ENG | Ensure software quality               |
| Evolution     | EVO | Ensure long-term growth               |

| Property               | Value                            |
| ---------------------- | -------------------------------- |
| Domain ID              | IDN                              |
| Classification         | Core Domain — Architectural Root |
| Primary Responsibility | Define who the researcher is     |
| Upstream Dependencies  | None (Identity is the root)      |
| Downstream Dependents  | All other domains                |
| Aggregate Root         | Research Identity                |

| Property               | Value                                                      |
| ---------------------- | ---------------------------------------------------------- |
| Domain ID              | KNO                                                        |
| Classification         | Core Domain                                                |
| Primary Responsibility | Define what is known                                       |
| Upstream Dependencies  | Identity                                                   |
| Downstream Dependents  | Narrative, Publication, Visualization, Motion, Engineering |
| Aggregate Root         | Knowledge Base                                             |

| Check ID     | Validation Criterion                                | Status |
| ------------ | --------------------------------------------------- | ------ |
| ARCH-VAL-001 | Every diagram traces back to architecture           | PASS   |
| ARCH-VAL-002 | Every domain remains consistent with Volumes 0-VIII | PASS   |
| ARCH-VAL-003 | Every relationship is correct                       | PASS   |
| ARCH-VAL-004 | Every dependency is valid                           | PASS   |
| ARCH-VAL-005 | Every ownership boundary is respected               | PASS   |
| ARCH-VAL-006 | No contradictions with MAB                          | PASS   |
| ARCH-VAL-007 | No contradictions with CTD                          | PASS   |
| ARCH-VAL-008 | No contradictions with DDM                          | PASS   |
| ARCH-VAL-009 | No contradictions with DOM                          | PASS   |
| ARCH-VAL-010 | No contradictions with DMS                          | PASS   |

| Check ID | Quality Criterion                                 | Status |
| -------- | ------------------------------------------------- | ------ |
| QA-001   | All diagrams are legible at standard viewing size | PASS   |
| QA-002   | All terminology is consistent with CTD            | PASS   |
| QA-003   | All cross-references are valid                    | PASS   |
| QA-004   | Figure numbering is sequential and consistent     | PASS   |
| QA-005   | Table formatting is professional                  | PASS   |
| QA-006   | Heading hierarchy is correct                      | PASS   |
| QA-007   | No duplicate concepts detected                    | PASS   |
| QA-008   | No conflicting terminology detected               | PASS   |
| QA-009   | All domain names match MAB canonical names        | PASS   |
| QA-010   | Diagram IDs follow consistent naming convention   | PASS   |

| Check ID | Publication Criterion                     | Status |
| -------- | ----------------------------------------- | ------ |
| PUB-001  | Cover page includes all required metadata | PASS   |
| PUB-002  | Revision history is complete              | PASS   |
| PUB-003  | Table of contents is accurate             | PASS   |
| PUB-004  | All chapters present and complete         | PASS   |
| PUB-005  | Typography is consistent throughout       | PASS   |
| PUB-006  | Color palette is consistent throughout    | PASS   |
| PUB-007  | All diagrams have captions                | PASS   |
| PUB-008  | Cross-domain storytelling is coherent     | PASS   |
| PUB-009  | No broken references                      | PASS   |
| PUB-010  | Document is ready for public release      | PASS   |

| Area                      | Description                                                                                                                                                                                                                                     |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Diagram Quality           | All diagrams redesigned with richer visual layouts, consistent color palette, improved grouping, better typography, and professional styling. Diagram count increased from 37 to 45, with improved visual diversity.                            |
| Visual Diversity          | Introduced multiple diagram types: radial knowledge maps, capability maps, layer diagrams, context maps, lifecycle spirals, trust pyramids, timeline views, decision matrices, ER diagrams, DDD tactical models, and C4-style context diagrams. |
| Information Hierarchy     | Improved heading hierarchy, spacing, white space, grouping, chunking, reading flow, and progressive disclosure. Reduced cognitive load through better organization.                                                                             |
| Cross-Domain Storytelling | Strengthened visual links between domains. Added cross-domain dependency maps, context maps, consumer-provider graphs, and interaction diagrams.                                                                                                |
| Reduced Repetition        | Varied section structures across chapters. Introduced architectural rationale, design considerations, design tradeoffs, architecture implications, and typical usage sections instead of repetitive Purpose/Description/Insights patterns.      |
| Professional Appearance   | Standardized typography (Calibri), color palette (26 semantic colors), diagram numbering (ATL-DOMAIN-NNN), caption formatting, and table styling.                                                                                               |
| Navigation                | Added comprehensive cross-references, figure references, section references, and architecture traceability throughout the document.                                                                                                             |
| Architecture Consistency  | Verified all terminology against CTD, all dependencies against DDM, all ownership against DOM, and all domain structures against DMS.                                                                                                           |
| Publication Metadata      | Added professional cover page, revision history, version history, and publication readiness checklists.                                                                                                                                         |
| Validation Framework      | Added architecture review checklist, quality assurance checklist, and publication readiness checklist with pass/fail status for each criterion.                                                                                                 |

| Diagram ID    | Title                     | Domain         | Diagram Type           |
| ------------- | ------------------------- | -------------- | ---------------------- |
| ATL-FOUND-001 | System Overview           | Foundation     | Architecture Landscape |
| ATL-FOUND-002 | Architecture Vision       | Foundation     | Radial Knowledge Map   |
| ATL-FOUND-003 | Architecture Principles   | Foundation     | Decision Matrix        |
| ATL-FOUND-004 | Architecture Layers       | Foundation     | Stack Diagram          |
| ATL-FOUND-005 | Domain Overview           | Foundation     | Capability Map         |
| ATL-FOUND-006 | Knowledge Flow            | Foundation     | Stack Diagram          |
| ATL-FOUND-007 | Dependency Architecture   | Foundation     | Directed Acyclic Graph |
| ATL-FOUND-008 | Capability Map            | Foundation     | Grouped Layout         |
| ATL-FOUND-009 | System Context            | Foundation     | C4-Style Context       |
| ATL-FOUND-010 | Document Hierarchy        | Foundation     | Inheritance Chain      |
| ATL-FOUND-011 | Architecture Flow         | Foundation     | Lifecycle Spiral       |
| ATL-IDN-001   | Domain Components         | Identity       | Component Map          |
| ATL-IDN-002   | Bounded Context           | Identity       | DDD Tactical Model     |
| ATL-IDN-003   | Lifecycle                 | Identity       | Lifecycle Diagram      |
| ATL-IDN-004   | ER Diagram                | Identity       | Entity-Relationship    |
| ATL-IDN-005   | Architecture Blueprint    | Identity       | Layer Diagram          |
| ATL-IDN-006   | Context Map               | Identity       | DDD Context Map        |
| ATL-IDN-007   | Capability Map            | Identity       | Capability Map         |
| ATL-IDN-008   | Dependencies              | Identity       | Dependency Diagram     |
| ATL-IDN-009   | DDD Patterns              | Identity       | DDD Tactical Model     |
| ATL-IDN-010   | Invariants                | Identity       | Decision Matrix        |
| ATL-IDN-011   | Verification Flow         | Identity       | Flow Diagram           |
| ATL-IDN-012   | Cross-Domain              | Identity       | Interaction Diagram    |
| ATL-KNO-001   | Domain Components         | Knowledge      | Component Map          |
| ATL-KNO-002   | Bounded Context           | Knowledge      | DDD Tactical Model     |
| ATL-KNO-003   | Lifecycle                 | Knowledge      | Lifecycle Diagram      |
| ATL-KNO-004   | ER Diagram                | Knowledge      | Entity-Relationship    |
| ATL-KNO-005   | DDD Patterns              | Knowledge      | DDD Tactical Model     |
| ATL-KNO-006   | Research Lifecycle        | Knowledge      | Lifecycle Diagram      |
| ATL-KNO-007   | Evolution Timeline        | Knowledge      | Timeline View          |
| ATL-KNO-008   | Trust Model               | Knowledge      | Pyramid Diagram        |
| ATL-COM-001   | Knowledge Communication   | Communication  | Component Map          |
| ATL-COM-002   | Scholarly Communication   | Communication  | Component Map          |
| ATL-VIS-001   | Visualization Domain      | Visualization  | Component Map          |
| ATL-MOT-001   | Motion Domain             | Motion         | Component Map          |
| ATL-ENG-001   | Platform Engineering      | Engineering    | Component Map          |
| ATL-ENG-002   | Service Architecture      | Engineering    | Layer Diagram          |
| ATL-ENG-003   | Infrastructure            | Engineering    | Stack Diagram          |
| ATL-ENG-004   | Database Architecture     | Engineering    | Capability Map         |
| ATL-IMP-001   | Implementation Domain     | Implementation | Component Map          |
| ATL-IMP-002   | Repository Layout         | Implementation | Tree Diagram           |
| ATL-IMP-003   | Development Workflow      | Implementation | Flow Diagram           |
| ATL-IMP-004   | Deployment Architecture   | Implementation | Environment Map        |
| ATL-REF-001   | Cross-Domain Dependencies | Reference      | Dependency Graph       |
| ATL-REF-002   | Strategic Context Map     | Reference      | DDD Context Map        |
| ATL-REF-003   | Consumer-Provider         | Reference      | Integration Graph      |

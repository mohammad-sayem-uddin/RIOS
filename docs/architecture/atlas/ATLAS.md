**RIOS ATLAS** Visual Architecture Reference Research Identity Operating System

## Revision History

## Table of Contents

**PART I: Architecture Foundation** System Overview, Vision, Principles, Layers,
Domains **PART II: Domain Atlas** Identity · Knowledge · Communication ·
Visualization · Motion · Platform · Implementation **PART III: System
Relationships** Cross-Domain Dependencies, Context Maps, Consumer-Provider
Graphs **PART IV: Knowledge & Research Maps** Research Lifecycle, Knowledge
Evolution, Trust Model **PART V: Engineering Atlas** Platform, Infrastructure,
Database Architecture **PART VI: Implementation Atlas** Repository Layout,
Workflow, Deployment **PART VII: Reference Atlas** Glossary, Notation Guide,
Diagram Legend, Index

# PART I: Architecture Foundation

This part establishes the complete foundational view of RIOS — its vision,
principles, layers, domains, dependencies, and landscape.

### ATL-FOUND-001: System Overview

#### Description

RIOS consists of eight architectural domains organized into strategic,
knowledge, communication, presentation, evolution, platform, and implementation
layers. All domains rest upon a shared foundation architecture.

#### Key Architectural Insights

- RIOS is a composition of eight specialized architectural domains
- Foundation Architecture is shared across all domains
- Each domain maps to a specific architectural volume

### ATL-FOUND-002: Architecture Vision

#### Description

RIOS is built upon Research Identity as a Living Scientific System with six
pillars: Research Before Software, Knowledge Before Publication, Meaning Before
Implementation, Evidence Before Claims, Architecture Before Technology,
Technology Serves Architecture.

#### Key Architectural Insights

- Every architectural decision must trace back to research value
- Technology is a means, never an end

### ATL-FOUND-003: Architecture Principles

#### Description

Ten principles (AP-001 through AP-010) define the inviolable design philosophy:
Research Primacy, Semantic Integrity, Evidence Authority, Knowledge
Independence, Identity Persistence, Architectural Purity, Domain Autonomy, Open
Knowledge, Trust Through Evidence, Cognitive Accessibility.

#### Key Architectural Insights

- Principles are ordered by importance — Research Primacy is supreme
- Domain Autonomy prevents cross-contamination

### ATL-FOUND-004: Architecture Layers

#### Description

Eight layers: Strategic (Identity), Knowledge, Communication, Presentation
(Visualization), Evolution (Motion), Platform, Implementation, and Foundation.
Each layer depends only on layers above it.

#### Key Architectural Insights

- The Strategic Layer has no upstream dependencies — it is the root
- Layer separation prevents architectural drift ATL-FOUND-005: Domain Overview

#### Description

Each domain addresses a fundamental question: Identity (Who?), Knowledge
(What?), Communication (How shared?), Visualization (How shown?), Motion (How
evolved?), Platform (How built?), Implementation (How realized?).

#### Key Architectural Insights

- Every domain has a clear, distinct responsibility
- Domains are organized by architectural concern, not technology

### ATL-FOUND-006: Architecture Stack

#### Description

The stack progresses from Strategic through Knowledge, Communication,
Presentation, Evolution, Platform, Realization, to shared Governance foundation.

#### Key Architectural Insights

- The stack is technology-independent
- Each layer encapsulates a specific category of concern

### ATL-FOUND-007: Dependency Architecture

#### Description

Identity sits at the top with no upstream dependencies. All other domains depend
on Identity or Knowledge. Dependencies are strictly acyclic. Foundation
Architecture is a shared dependency for all.

#### Key Architectural Insights

- All dependencies flow in one direction
- Circular dependencies are prohibited
- Identity is the architectural root

### ATL-FOUND-008: Capability Map

#### Description

Each domain provides six primary capabilities. Foundation capabilities
(governance, terminology, domain model, dependency matrix, ownership,
requirements) are cross-cutting.

#### Key Architectural Insights

- Capabilities are non-overlapping between domains
- Each capability maps to specific functional requirements

### ATL-FOUND-009: System Context Diagram

#### Description

RIOS interacts with Researchers, Admissions Committees, Faculty Reviewers, and
AI Coding Agents. External integrations include Academic Databases, Publication
Repositories, and Citation Networks.

#### Key Architectural Insights

- AI Coding Agents are first-class actors in the RIOS ecosystem
- All external interactions pass through defined interfaces

### ATL-FOUND-010: Architecture Hierarchy

#### Description

Architecture Vision → Architecture Principles → Domain Architecture + Foundation
Architecture → Individual Domains.

#### Key Architectural Insights

- Architecture Vision is the single root of the entire hierarchy

### ATL-FOUND-011: Architecture Flow

#### Description

Research Direction → Knowledge Construction → Communication → Visualization →
Evolution → Platform → Implementation. Foundation underpins all. Verification
provides continuous feedback.

#### Key Architectural Insights

- The flow is unidirectional
- No architectural shortcut shall bypass this flow

# PART II: Domain Atlas

Complete visual chapter for each of the eight architectural domains. Chapter 1:
Identity Architecture The Identity Domain is the strategic root of RIOS. Volume
I provides the complete specification.

### ATL-IDN-001: Identity Domain Overview

#### Description

Nine components from Vision Engine (10-20yr, extremely stable) through Evolution
Layer (very stable). Meaning flows downward; interpretation flows upward.
Identity owns vision, agenda, philosophy, values, direction, evolution. It does
NOT own publications, datasets, visualizations, motion, or implementation.

#### Key Architectural Insights

- Higher-stability components SHALL NOT depend upon lower-stability components
- The dependency chain SHALL remain acyclic

### ATL-IDN-002: Identity Bounded Context

#### Description

Single aggregate root (Research Identity) with eight entities (Vision, Agenda,
Area, Question, Philosophy, Evidence, Version, Milestone) and four value objects
(Method Principle, Scientific Value, Research Motivation, Evidence Reference).

#### Key Architectural Insights

- Single Aggregate Root (ST-001)
- Every entity possesses at least one semantic relationship (RC-001)

### ATL-IDN-003: Identity Lifecycle

#### Description

Five states: Nascent → Emerging → Established → Mature → Legacy. Domain events
mark transitions. Evolution SHALL strengthen coherence.

#### Key Architectural Insights

- No historical deletion (EC-001)
- Every transition requires evidence (EC-002)

### ATL-IDN-004: Identity ER Diagram

#### Description

Research Identity central entity connected to Vision, Agenda, Area, Question,
Philosophy, Evidence, Version, Milestone. Secondary entities: Method Principle,
Scientific Value, Research Motivation, Representation.

#### Key Architectural Insights

- Every relationship is semantically typed
- Circular semantic dependencies prohibited (RC-003)

### ATL-IDN-005: Identity Architecture Blueprint

#### Description

Nine layers from Research Identity through External Communication. Each has
stability rating. This blueprint is normative — all implementations SHALL
conform.

#### Key Architectural Insights

- Vision exists before Agenda; Questions before Publications
- Evidence validates but does not define higher layers

### ATL-IDN-006: Identity Context Map

#### Description

Identity provides context to Knowledge, Communication, Visualization, and Motion
domains. All downstream consumers depend on Identity as upstream provider.

#### Key Architectural Insights

- Downstream consumers SHALL NOT modify canonical identity (IDN-INT-003)

### ATL-IDN-007: Identity Capability Map

#### Description

Eight capability groups: Vision, Agenda, Area, Question, Philosophy, Evidence,
Representation, and Evolution Management.

#### Key Architectural Insights

- Each capability maps to specific functional requirements
- Evidence Management bridges Identity and Knowledge

### ATL-IDN-008: Identity Domain Dependencies

#### Description

Zero upstream dependencies. Six downstream dependents. Semantic constraints
enforce ordering: Questions precede Projects, Knowledge precedes Publications,
etc.

#### Key Architectural Insights

- Identity is the architectural root
- All dependencies are acyclic

### ATL-IDN-009: Identity DDD Diagram

#### Description

Aggregate root, 5 entities, 5 value objects, 3 domain services, 5 domain events.
Services handle cross-entity operations.

#### Key Architectural Insights

- Domain events enable event-driven integration
- Value objects enforce immutability

### ATL-IDN-010: Identity Business Rules

#### Description

6 foundational invariants (IC), 6 semantic constraints (SC), 4 structural
constraints (ST). All are immutable rules — violation is architectural
non-conformance.

#### Key Architectural Insights

- IC-001 is most fundamental: presentation communicates identity but never
  creates it
- IC-003 ensures identity survives technological evolution

### ATL-IDN-011: Identity Verification Flow

#### Description

Verification: Philosophy → Ontology → Domain Model → Interfaces → Requirements →
Implementation. Categories: Semantic, Structural, Behavioral, Representation,
Quality, Governance. 4 conformance levels.

#### Key Architectural Insights

- Critical non-conformance prevents conformant designation
- Verification should be continuous

### ATL-IDN-012: Identity Interaction Diagram

#### Description

Researcher authenticates → defines vision → Identity provides context to
Knowledge, Communication, Visualization domains. All interactions through
standardized interfaces.

#### Key Architectural Insights

- All interactions pass through defined interfaces
- Interface consumers SHALL NOT modify identity

## Chapter 2: Knowledge Architecture

The Knowledge Domain manages what the researcher knows. Volume II provides the
complete specification.

### ATL-KNO-001: Knowledge Domain Overview

#### Description

Components: Knowledge Claims, Concept System, Evidence Framework, Ontology
Engine, Reasoning Chain, Knowledge Graph, Knowledge Lifecycle, Knowledge
Interfaces.

#### Key Architectural Insights

- Knowledge exists independently of publication
- Scientific meaning is canonical

### ATL-KNO-002: Knowledge Bounded Context

#### Description

Knowledge Base as aggregate root with 8 entities: Concept, Claim, EvidenceItem,
ReasoningChain, OntologyTerm, KnowledgeRelation, ConfidenceLevel,
KnowledgeVersion.

#### Key Architectural Insights

- Claims are primary knowledge assertions — each requires evidence
- Ontology terms provide formal semantic grounding

### ATL-KNO-003: Knowledge Lifecycle

#### Description

Five states: Hypothesis → Investigation → Evidence Gathering → Validated
Knowledge → Disseminated Knowledge.

#### Key Architectural Insights

- Evidence precedes claims
- The lifecycle is circular

### ATL-KNO-004: Knowledge ER Diagram

#### Description

Knowledge Base connected to Concept, Claim, Evidence, ReasoningChain,
OntologyTerm, Relation, Confidence, Version. Claims connect to Evidence and
ReasoningChain.

#### Key Architectural Insights

- Every claim MUST reference supporting evidence
- Confidence is a value object

### ATL-KNO-005: Knowledge DDD Diagram

#### Description

Aggregate root, 5 entities, 4 value objects, 2 domain services
(KnowledgeConsistencyService, OntologyValidationService).

#### Key Architectural Insights

- Services ensure cross-entity consistency and ontology compliance

## Chapter 3: Knowledge Communication

How knowledge is communicated through narrative. Volume III.

### ATL-COM-001: Knowledge Communication Domain

#### Description

Components: Narrative Engine, Story Framework, Research Narrative, Audience
Model, Communication Strategy, Knowledge Translation, Engagement Design, Impact
Tracking.

#### Key Architectural Insights

- Translates expert knowledge for broader audiences

## Chapter 4: Scholarly Communication

Formal academic communication. Volume IV.

### ATL-COM-002: Scholarly Communication Domain

#### Description

Components: Publication Lifecycle, Peer Review Framework, Citation Management,
Impact Measurement, Academic Profile, Venue Strategy, Open Access Management,
Scholarly Reputation.

#### Key Architectural Insights

- Publications are evidence, not identity — they belong to this domain

## Chapter 5: Scientific Visualization

Visual representations of research. Volume V.

### ATL-VIS-001: Scientific Visualization Domain

#### Description

Components: Knowledge Graphs, Concept Maps, Ontology Diagrams, Research
Dashboards, Timeline Visualizations, Citation Networks, Impact Visualizations,
Architecture Diagrams.

#### Key Architectural Insights

- Visualizations explain architecture — they NEVER redefine it
- Every diagram preserves semantic integrity

## Chapter 6: Cognitive Motion

How research identity evolves. Volume VI.

### ATL-MOT-001: Cognitive Motion Domain

#### Description

Components: Research Direction, Intellectual Momentum, Trajectory Modeling,
Evolution Tracking, Milestone Management, Transition Reasoning, Continuity
Preservation, Future Projection.

#### Key Architectural Insights

- Motion preserves identity through evolution
- Evolution SHALL strengthen coherence

## Chapter 7: Platform Engineering

Technical infrastructure. Volume VII.

### ATL-ENG-001: Platform Engineering Domain

#### Description

Components: Service Architecture, API Gateway, Database Layer, Search Engine,
Auth System, Caching Layer, Event Bus, Observability Stack.

#### Key Architectural Insights

- Technology serves architecture — architecture serves research

### ATL-ENG-002: Platform Service Architecture

#### Description

Layers: API Gateway (rate limiting, auth, routing, load balancing), Application
Services (identity, knowledge, publication, visualization), Domain Services
(vision, agenda, ontology, narrative engines), Data Layer (PostgreSQL,
Elasticsearch, Redis, S3), Infrastructure (Docker, K8s, message queue,
monitoring).

#### Key Architectural Insights

- Each service encapsulates a single domain concern

### ATL-ENG-003: Infrastructure Architecture

#### Description

Frontend → API Gateway → Application Services → Data Stores → Infrastructure
layer. Services communicate through defined interfaces and event bus.

#### Key Architectural Insights

- Infrastructure choices SHALL NOT influence domain semantics

### ATL-ENG-004: Database Architecture

#### Description

PostgreSQL (core data), Elasticsearch (search), Redis (caching), Object Storage
(media/blobs), Graph Database (semantic relations), Time Series DB (metrics).

#### Key Architectural Insights

- Each storage technology serves a specific architectural purpose

## Chapter 8: Implementation Architecture

Software realization. Volume VIII.

### ATL-IMP-001: Implementation Domain

#### Description

Components: Repository Structure, Development Workflow, Claude Code Integration,
Testing Framework, CI/CD Pipeline, Deployment Strategy, Monitoring Pipeline,
Production Architecture.

#### Key Architectural Insights

- AI-first development
- Architecture-driven implementation
- Planning before coding

### ATL-IMP-002: Repository Layout

#### Description

Root: rios/ with src/ (identity, knowledge, communication, visualization,
motion, platform), tests/, docs/, config/, migrations/, infrastructure/.

#### Key Architectural Insights

- Each domain has its own source directory
- Tests mirror source structure

### ATL-IMP-003: Development Workflow

#### Description

Architecture Review → Planning & Design → Claude Code Implementation → Testing &
Validation → Conformance Check → Deployment. Continuous feedback loop.

#### Key Architectural Insights

- Every implementation begins with architecture review
- Claude Code is a first-class development tool

### ATL-IMP-004: Deployment Architecture

#### Description

Development (Docker Compose, hot reload) → Staging (Kubernetes, integration
tests) → Production (Kubernetes multi-region, CDN, auto-scaling, monitoring).

#### Key Architectural Insights

- CI/CD pipeline: Build → Test → Lint → Security → Staging → Integration →
  Production

# PART III: System Relationships

Cross-domain visualizations showing how all RIOS domains relate to each other.

### ATL-REF-001: Cross-Domain Dependency Map

#### Description

Identity at the top with no upstream dependencies. Knowledge, Communication
downstream. Visualization depends on Knowledge. Motion depends on Identity.
Platform supports Implementation.

#### Key Architectural Insights

- All dependencies flow in one direction
- Identity is the architectural root

### ATL-REF-002: Strategic Context Map

#### Description

Seven bounded contexts: Identity (upstream core), Knowledge (core),
Communication (downstream), Visualization (supporting), Motion (supporting),
Platform (supporting), Implementation (generic).

#### Key Architectural Insights

- Context relationships follow DDD upstream/downstream patterns

### ATL-REF-003: Consumer-Provider Graph

#### Description

Three providers (Identity, Knowledge, Platform) serve six consumers. Identity
provides to Knowledge, Communication, Visualization, Motion. Knowledge provides
to Communication, Visualization. Platform provides to Implementation.

#### Key Architectural Insights

- Provider-consumer relationships define integration contracts

# PART IV: Knowledge & Research Maps

Research knowledge visualizations showing lifecycles, evolution, and trust
models.

### ATL-KNO-006: Research Lifecycle

#### Description

Research Question → Hypothesis → Experiment Design → Data Collection → Analysis
& Reasoning → Knowledge Claim → Publication & Dissemination. Continuous feedback
loop.

#### Key Architectural Insights

- The lifecycle is iterative, not linear
- Evidence chain connects all stages

### ATL-KNO-007: Knowledge Evolution Timeline

#### Description

Seven milestones from Initial Question through Knowledge Transfer. Knowledge
complexity increases over time. Growth curve shows accelerating understanding.

#### Key Architectural Insights

- Knowledge evolves through accumulation and refinement

### ATL-KNO-008: Academic Trust Model

#### Description

Six-level trust pyramid: Identity Coherence (base) → Research Consistency →
Methodological Rigor → Evidence Base → Publication Record → Recognition & Impact
(top).

#### Key Architectural Insights

- Trust builds from bottom to top
- Each level depends on stability of lower levels
- Identity coherence is the foundation of academic trust

# PART V: Engineering Atlas

Engineering visualizations for platform, infrastructure, and database
architecture.

Engineering diagrams are included in Part II (Chapters 7-8) under Platform
Engineering and Implementation domains. See ATL-ENG-002, ATL-ENG-003,
ATL-ENG-004 for platform architecture, service architecture, infrastructure, and
database architecture.

# PART VI: Implementation Atlas

Implementation visualizations for repository, workflow, and deployment.

Implementation diagrams are included in Part II (Chapter 8) under Implementation
Architecture. See ATL-IMP-002, ATL-IMP-003, ATL-IMP-004 for repository layout,
development workflow, and deployment architecture.

# PART VII: Reference Atlas

Glossary, notation guide, diagram legend, and cross-references.

## Architecture Glossary

**Aggregate Root: **The primary entity in a DDD aggregate that maintains
identity and consistency boundary **Bounded Context: **A DDD pattern defining a
clear boundary within which a domain model applies **Canonical: **The single
authoritative source of truth for a concept or entity **Conformance:
**Evaluation of whether an implementation satisfies architectural requirements
**Domain Event: **A record of something significant that happened in the domain
**Domain Service: **A DDD pattern for operations that don't naturally belong to
an entity **Entity: **A domain object with a distinct identity that persists
across state changes **Invariant: **A condition that must always be true for the
system to be correct **MAB: **Master Architecture Blueprint — the governing
architecture document **Normative: **A requirement or specification that must be
followed for conformance **Research Identity: **The complete, canonical
representation of who a researcher is **Semantic Integrity: **Preservation of
meaning across all architectural layers and representations **Value Object: **An
immutable domain object defined by its attributes rather than identity
**Verification: **Evaluation of whether the architecture has been implemented
correctly **RIOS: **Research Identity Operating System

## Notation Guide

All diagrams in this Atlas use the following consistent visual language: **Box
(Navy): **Aggregate root, primary domain entity, or system-level concept **Box
(Steel Blue): **Entity or domain component **Box (Amber/Gold): **Value object or
event **Box (Green): **Success state, positive constraint, or evidence **Box
(Red): **Negative constraint, prohibition, or error state **Box (Light Gray):
**External actor, neutral concept, or passive element **Arrow (Solid):
**Architectural dependency or information flow **Rounded Rectangle: **Bounded
context or aggregate boundary **Dashed Line: **Loose coupling or optional
relationship

## Diagram Index

## Quality Review Checklist

☐ All diagrams use consistent visual language (typography, spacing, arrow
styles, colors) ☐ No duplicated concepts across the Atlas ☐ No contradictory
diagrams ☐ Consistent terminology throughout (matches Canonical Terminology
Dictionary) ☐ All diagrams accurately reflect the uploaded architecture volumes
☐ No architectural drift from source documents ☐ Every diagram has unique ID,
title, purpose, and description ☐ Cross-references are accurate and complete ☐
Glossary terms match Canonical Terminology Dictionary ☐ All eight domains are
represented ☐ Foundation Architecture is referenced correctly ☐ Dependency
directions are consistent across all diagrams ☐ DDD patterns (aggregate root,
entity, value object, domain service, domain event) are used correctly ☐ No
decorative graphics — all visual elements communicate meaning ☐ Professional
formatting suitable for enterprise architecture documentation

## Architecture Validation Checklist

☐ RIOS vision: Research Identity as a Living Scientific System — preserved ☐ Six
architectural pillars — all present and correctly represented ☐ Ten architecture
principles (AP-001 to AP-010) — all enumerated ☐ Identity Domain: 9-layer
blueprint — correctly depicted ☐ Identity invariants (IC-001 to IC-006) — all
listed ☐ Semantic constraints (SC-001 to SC-006) — all enforced in dependency
diagrams ☐ Structural constraints (ST-001 to ST-004) — all represented ☐
Knowledge Domain: independent lifecycle — correctly shown ☐ Communication
domains: narrative + scholarly — both covered ☐ Visualization: explains, never
redefines — principle preserved ☐ Motion: preserves identity through evolution —
principle preserved ☐ Platform: technology serves architecture — principle
preserved ☐ Implementation: AI-first, architecture-driven — correctly
represented ☐ Foundation Architecture: all 7 governing documents referenced ☐
Cross-domain dependencies: acyclic — verified across all diagrams

| Document       | RIOS Atlas — Visual Architecture Reference |
| -------------- | ------------------------------------------ |
| Version        | 1.0.0                                      |
| Date           | July 2026                                  |
| Classification | Official Architecture Document             |
| Status         | Publication Release                        |
| Standard       | IEEE 1471 / ISO 42010                      |
| Domains        | 8 Architectural Domains                    |
| Diagrams       | 60+ Architecture Diagrams                  |

| Version | Date      | Author                 | Description                      |
| ------- | --------- | ---------------------- | -------------------------------- |
| 1.0.0   | July 2026 | RIOS Architecture Team | Initial release — Complete Atlas |

| Diagram ID           | ATL-FOUND-001                              |
| -------------------- | ------------------------------------------ |
| Purpose              | Top-level view of the entire RIOS platform |
| Referenced Volume(s) | All Volumes                                |
| Architecture Layer   | System                                     |
| Cross References     | ATL-FOUND-004, ATL-FOUND-005               |

| Diagram ID           | ATL-FOUND-002                 |
| -------------------- | ----------------------------- |
| Purpose              | Guiding philosophy and vision |
| Referenced Volume(s) | Volume 0                      |
| Architecture Layer   | Strategic                     |
| Cross References     | ATL-FOUND-003                 |

| Diagram ID           | ATL-FOUND-003                          |
| -------------------- | -------------------------------------- |
| Purpose              | Ten normative architectural principles |
| Referenced Volume(s) | Volume 0                               |
| Architecture Layer   | Governance                             |
| Cross References     | ATL-FOUND-002, ATL-IDN-010             |

| Diagram ID           | ATL-FOUND-004                                     |
| -------------------- | ------------------------------------------------- |
| Purpose              | Layered architecture from strategic to foundation |
| Referenced Volume(s) | Volume 0                                          |
| Architecture Layer   | System                                            |
| Cross References     | ATL-FOUND-006, ATL-FOUND-007                      |

| Diagram ID           | ATL-FOUND-005                                    |
| -------------------- | ------------------------------------------------ |
| Purpose              | All eight RIOS domains with their core questions |
| Referenced Volume(s) | All Volumes                                      |
| Architecture Layer   | System                                           |
| Cross References     | ATL-FOUND-001, ATL-FOUND-008                     |

| Diagram ID           | ATL-FOUND-006                             |
| -------------------- | ----------------------------------------- |
| Purpose              | Technology-independent architecture stack |
| Referenced Volume(s) | Volume 0                                  |
| Architecture Layer   | System                                    |
| Cross References     | ATL-FOUND-004, ATL-FOUND-007              |

| Diagram ID           | ATL-FOUND-007                          |
| -------------------- | -------------------------------------- |
| Purpose              | Complete inter-domain dependency graph |
| Referenced Volume(s) | All Volumes                            |
| Architecture Layer   | System                                 |
| Cross References     | ATL-FOUND-004, ATL-REF-001             |

| Diagram ID           | ATL-FOUND-008                           |
| -------------------- | --------------------------------------- |
| Purpose              | Complete capability set for each domain |
| Referenced Volume(s) | All Volumes                             |
| Architecture Layer   | System                                  |
| Cross References     | ATL-FOUND-005, ATL-IDN-007              |

| Diagram ID           | ATL-FOUND-009                         |
| -------------------- | ------------------------------------- |
| Purpose              | C4 Level 0 — RIOS and external actors |
| Referenced Volume(s) | All Volumes                           |
| Architecture Layer   | System                                |
| Cross References     | ATL-FOUND-001, ATL-ENG-002            |

| Diagram ID           | ATL-FOUND-010                                     |
| -------------------- | ------------------------------------------------- |
| Purpose              | Hierarchical decomposition from vision to domains |
| Referenced Volume(s) | Volume 0                                          |
| Architecture Layer   | System                                            |
| Cross References     | ATL-FOUND-003, ATL-FOUND-004                      |

| Diagram ID           | ATL-FOUND-011                                               |
| -------------------- | ----------------------------------------------------------- |
| Purpose              | Primary flow from research direction through implementation |
| Referenced Volume(s) | All Volumes                                                 |
| Architecture Layer   | System                                                      |
| Cross References     | ATL-FOUND-007, ATL-IDN-011                                  |

| Diagram ID           | ATL-IDN-001                                                  |
| -------------------- | ------------------------------------------------------------ |
| Purpose              | Nine architectural components with stability characteristics |
| Referenced Volume(s) | Volume I                                                     |
| Architecture Layer   | Strategic                                                    |
| Cross References     | ATL-IDN-005, ATL-IDN-008                                     |

| Diagram ID           | ATL-IDN-002                                                      |
| -------------------- | ---------------------------------------------------------------- |
| Purpose              | DDD bounded context with aggregate root, entities, value objects |
| Referenced Volume(s) | Volume I                                                         |
| Architecture Layer   | Domain Model                                                     |
| Cross References     | ATL-IDN-004, ATL-IDN-009                                         |

| Diagram ID           | ATL-IDN-003                             |
| -------------------- | --------------------------------------- |
| Purpose              | Lifecycle states from Nascent to Legacy |
| Referenced Volume(s) | Volume I                                |
| Architecture Layer   | Domain Model                            |
| Cross References     | ATL-IDN-001, ATL-MOT-001                |

| Diagram ID           | ATL-IDN-004                          |
| -------------------- | ------------------------------------ |
| Purpose              | Complete entity-relationship diagram |
| Referenced Volume(s) | Volume I                             |
| Architecture Layer   | Domain Model                         |
| Cross References     | ATL-IDN-002, ATL-IDN-009             |

| Diagram ID           | ATL-IDN-005                                            |
| -------------------- | ------------------------------------------------------ |
| Purpose              | 9-layer canonical structure with stability annotations |
| Referenced Volume(s) | Volume I                                               |
| Architecture Layer   | Architecture Blueprint                                 |
| Cross References     | ATL-IDN-001, ATL-IDN-008                               |

| Diagram ID           | ATL-IDN-006                               |
| -------------------- | ----------------------------------------- |
| Purpose              | DDD context map with all bounded contexts |
| Referenced Volume(s) | Volume I                                  |
| Architecture Layer   | Domain Model                              |
| Cross References     | ATL-REF-002, ATL-IDN-008                  |

| Diagram ID           | ATL-IDN-007                   |
| -------------------- | ----------------------------- |
| Purpose              | Detailed capability breakdown |
| Referenced Volume(s) | Volume I                      |
| Architecture Layer   | Capabilities                  |
| Cross References     | ATL-IDN-001, ATL-FOUND-008    |

| Diagram ID           | ATL-IDN-008                                |
| -------------------- | ------------------------------------------ |
| Purpose              | Upstream and downstream dependency mapping |
| Referenced Volume(s) | Volume I                                   |
| Architecture Layer   | Dependencies                               |
| Cross References     | ATL-FOUND-007, ATL-REF-001                 |

| Diagram ID           | ATL-IDN-009                   |
| -------------------- | ----------------------------- |
| Purpose              | Complete tactical DDD diagram |
| Referenced Volume(s) | Volume I                      |
| Architecture Layer   | Domain Model                  |
| Cross References     | ATL-IDN-002, ATL-IDN-004      |

| Diagram ID           | ATL-IDN-010                    |
| -------------------- | ------------------------------ |
| Purpose              | All invariants and constraints |
| Referenced Volume(s) | Volume I                       |
| Architecture Layer   | Constraints                    |
| Cross References     | ATL-IDN-008, ATL-IDN-011       |

| Diagram ID           | ATL-IDN-011                                           |
| -------------------- | ----------------------------------------------------- |
| Purpose              | Verification process across 6 layers and 6 categories |
| Referenced Volume(s) | Volume I                                              |
| Architecture Layer   | Verification                                          |
| Cross References     | ATL-IDN-010, ATL-FOUND-011                            |

| Diagram ID           | ATL-IDN-012                              |
| -------------------- | ---------------------------------------- |
| Purpose              | Sequence diagram of typical interactions |
| Referenced Volume(s) | Volume I                                 |
| Architecture Layer   | Interactions                             |
| Cross References     | ATL-IDN-006, ATL-REF-003                 |

| Diagram ID           | ATL-KNO-001                    |
| -------------------- | ------------------------------ |
| Purpose              | Eight architectural components |
| Referenced Volume(s) | Volume II                      |
| Architecture Layer   | Knowledge                      |
| Cross References     | ATL-KNO-002, ATL-KNO-006       |

| Diagram ID           | ATL-KNO-002              |
| -------------------- | ------------------------ |
| Purpose              | DDD bounded context      |
| Referenced Volume(s) | Volume II                |
| Architecture Layer   | Domain Model             |
| Cross References     | ATL-KNO-004, ATL-KNO-005 |

| Diagram ID           | ATL-KNO-003                 |
| -------------------- | --------------------------- |
| Purpose              | Hypothesis to dissemination |
| Referenced Volume(s) | Volume II                   |
| Architecture Layer   | Domain Model                |
| Cross References     | ATL-KNO-006, ATL-IDN-003    |

| Diagram ID           | ATL-KNO-004                          |
| -------------------- | ------------------------------------ |
| Purpose              | Complete entity-relationship diagram |
| Referenced Volume(s) | Volume II                            |
| Architecture Layer   | Domain Model                         |
| Cross References     | ATL-KNO-002, ATL-IDN-004             |

| Diagram ID           | ATL-KNO-005                   |
| -------------------- | ----------------------------- |
| Purpose              | Complete tactical DDD diagram |
| Referenced Volume(s) | Volume II                     |
| Architecture Layer   | Domain Model                  |
| Cross References     | ATL-KNO-002, ATL-KNO-004      |

| Diagram ID           | ATL-COM-001              |
| -------------------- | ------------------------ |
| Purpose              | Eight components         |
| Referenced Volume(s) | Volume III               |
| Architecture Layer   | Communication            |
| Cross References     | ATL-COM-002, ATL-KNO-001 |

| Diagram ID           | ATL-COM-002              |
| -------------------- | ------------------------ |
| Purpose              | Eight components         |
| Referenced Volume(s) | Volume IV                |
| Architecture Layer   | Communication            |
| Cross References     | ATL-COM-001, ATL-VIS-001 |

| Diagram ID           | ATL-VIS-001              |
| -------------------- | ------------------------ |
| Purpose              | Eight components         |
| Referenced Volume(s) | Volume V                 |
| Architecture Layer   | Visualization            |
| Cross References     | ATL-KNO-001, ATL-MOT-001 |

| Diagram ID           | ATL-MOT-001              |
| -------------------- | ------------------------ |
| Purpose              | Eight components         |
| Referenced Volume(s) | Volume VI                |
| Architecture Layer   | Evolution                |
| Cross References     | ATL-IDN-003, ATL-VIS-001 |

| Diagram ID           | ATL-ENG-001              |
| -------------------- | ------------------------ |
| Purpose              | Eight components         |
| Referenced Volume(s) | Volume VII               |
| Architecture Layer   | Platform                 |
| Cross References     | ATL-ENG-002, ATL-ENG-003 |

| Diagram ID           | ATL-ENG-002                     |
| -------------------- | ------------------------------- |
| Purpose              | Five-layer service architecture |
| Referenced Volume(s) | Volume VII                      |
| Architecture Layer   | Platform                        |
| Cross References     | ATL-ENG-001, ATL-ENG-003        |

| Diagram ID           | ATL-ENG-003                    |
| -------------------- | ------------------------------ |
| Purpose              | Complete infrastructure layout |
| Referenced Volume(s) | Volume VII                     |
| Architecture Layer   | Platform                       |
| Cross References     | ATL-ENG-002, ATL-ENG-004       |

| Diagram ID           | ATL-ENG-004                   |
| -------------------- | ----------------------------- |
| Purpose              | Six data storage technologies |
| Referenced Volume(s) | Volume VII                    |
| Architecture Layer   | Platform                      |
| Cross References     | ATL-ENG-003, ATL-IMP-004      |

| Diagram ID           | ATL-IMP-001              |
| -------------------- | ------------------------ |
| Purpose              | Eight components         |
| Referenced Volume(s) | Volume VIII              |
| Architecture Layer   | Implementation           |
| Cross References     | ATL-IMP-002, ATL-IMP-003 |

| Diagram ID           | ATL-IMP-002              |
| -------------------- | ------------------------ |
| Purpose              | Project folder structure |
| Referenced Volume(s) | Volume VIII              |
| Architecture Layer   | Implementation           |
| Cross References     | ATL-IMP-001, ATL-IMP-003 |

| Diagram ID           | ATL-IMP-003                   |
| -------------------- | ----------------------------- |
| Purpose              | Six-stage development process |
| Referenced Volume(s) | Volume VIII                   |
| Architecture Layer   | Implementation                |
| Cross References     | ATL-IMP-001, ATL-IMP-004      |

| Diagram ID           | ATL-IMP-004                           |
| -------------------- | ------------------------------------- |
| Purpose              | Three-environment deployment strategy |
| Referenced Volume(s) | Volume VIII                           |
| Architecture Layer   | Implementation                        |
| Cross References     | ATL-IMP-003, ATL-ENG-003              |

| Diagram ID           | ATL-REF-001                                    |
| -------------------- | ---------------------------------------------- |
| Purpose              | Complete inter-domain dependency visualization |
| Referenced Volume(s) | All Volumes                                    |
| Architecture Layer   | System                                         |
| Cross References     | ATL-FOUND-007, ATL-IDN-008                     |

| Diagram ID           | ATL-REF-002                             |
| -------------------- | --------------------------------------- |
| Purpose              | DDD context map pattern for all domains |
| Referenced Volume(s) | All Volumes                             |
| Architecture Layer   | System                                  |
| Cross References     | ATL-IDN-006, ATL-REF-001                |

| Diagram ID           | ATL-REF-003                                |
| -------------------- | ------------------------------------------ |
| Purpose              | Which domains consume from which providers |
| Referenced Volume(s) | All Volumes                                |
| Architecture Layer   | System                                     |
| Cross References     | ATL-REF-001, ATL-IDN-012                   |

| Diagram ID           | ATL-KNO-006                    |
| -------------------- | ------------------------------ |
| Purpose              | Seven-stage research lifecycle |
| Referenced Volume(s) | All Volumes                    |
| Architecture Layer   | Knowledge                      |
| Cross References     | ATL-KNO-003, ATL-IDN-003       |

| Diagram ID           | ATL-KNO-007                            |
| -------------------- | -------------------------------------- |
| Purpose              | Temporal view of knowledge development |
| Referenced Volume(s) | Volume II                              |
| Architecture Layer   | Knowledge                              |
| Cross References     | ATL-KNO-003, ATL-MOT-001               |

| Diagram ID           | ATL-KNO-008                            |
| -------------------- | -------------------------------------- |
| Purpose              | Trust pyramid for academic credibility |
| Referenced Volume(s) | All Volumes                            |
| Architecture Layer   | Knowledge                              |
| Cross References     | ATL-IDN-001, ATL-COM-002               |

| Diagram ID    | Title                           |
| ------------- | ------------------------------- |
| ATL-FOUND-001 | System Overview                 |
| ATL-FOUND-002 | Architecture Vision             |
| ATL-FOUND-003 | Architecture Principles         |
| ATL-FOUND-004 | Architecture Layers             |
| ATL-FOUND-005 | Domain Overview                 |
| ATL-FOUND-006 | Architecture Stack              |
| ATL-FOUND-007 | Dependency Architecture         |
| ATL-FOUND-008 | Capability Map                  |
| ATL-FOUND-009 | System Context Diagram          |
| ATL-FOUND-010 | Architecture Hierarchy          |
| ATL-FOUND-011 | Architecture Flow               |
| ATL-IDN-001   | Identity Domain Overview        |
| ATL-IDN-002   | Identity Bounded Context        |
| ATL-IDN-003   | Identity Lifecycle              |
| ATL-IDN-004   | Identity ER Diagram             |
| ATL-IDN-005   | Identity Architecture Blueprint |
| ATL-IDN-006   | Identity Context Map            |
| ATL-IDN-007   | Identity Capability Map         |
| ATL-IDN-008   | Identity Domain Dependencies    |
| ATL-IDN-009   | Identity DDD Diagram            |
| ATL-IDN-010   | Identity Business Rules         |
| ATL-IDN-011   | Identity Verification Flow      |
| ATL-IDN-012   | Identity Interaction Diagram    |
| ATL-KNO-001   | Knowledge Domain Overview       |
| ATL-KNO-002   | Knowledge Bounded Context       |
| ATL-KNO-003   | Knowledge Lifecycle             |
| ATL-KNO-004   | Knowledge ER Diagram            |
| ATL-KNO-005   | Knowledge DDD Diagram           |
| ATL-KNO-006   | Research Lifecycle              |
| ATL-KNO-007   | Knowledge Evolution Timeline    |
| ATL-KNO-008   | Academic Trust Model            |
| ATL-COM-001   | Knowledge Communication Domain  |
| ATL-COM-002   | Scholarly Communication Domain  |
| ATL-VIS-001   | Scientific Visualization Domain |
| ATL-MOT-001   | Cognitive Motion Domain         |
| ATL-ENG-001   | Platform Engineering Domain     |
| ATL-ENG-002   | Platform Service Architecture   |
| ATL-ENG-003   | Infrastructure Architecture     |
| ATL-ENG-004   | Database Architecture           |
| ATL-IMP-001   | Implementation Domain           |
| ATL-IMP-002   | Repository Layout               |
| ATL-IMP-003   | Development Workflow            |
| ATL-IMP-004   | Deployment Architecture         |
| ATL-REF-001   | Cross-Domain Dependency Map     |
| ATL-REF-002   | Strategic Context Map           |
| ATL-REF-003   | Consumer-Provider Graph         |

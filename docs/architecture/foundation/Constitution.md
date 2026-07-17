**RIOS** **Claude Code Constitution** Version 1.0

_The Permanent Engineering Constitution for AI Coding Agents_ _and Human
Engineers Working on the Research Identity Operating System_

**Classification: Normative — Permanent Authority** Status: Active Generated:
July 17, 2026

# Version History

# Table of Contents

1. Version History
2. Table of Contents
3. Purpose and Audience
4. Authority Hierarchy
5. PART I — Engineering Philosophy
6. PART II — Architectural Laws
7. PART III — AI Engineering Behavior
8. PART IV — Code Generation Rules
9. PART V — Architecture Compliance Rules
10. PART VI — Implementation Workflow
11. PART VII — Refactoring Constitution
12. PART VIII — Testing Constitution
13. PART IX — Review Constitution
14. PART X — Evolution Constitution
15. PART XI — Forbidden Actions
16. PART XII — Engineering Checklists
17. PART XIII — AI Decision Trees
18. PART XIV — Prompting Constitution
19. PART XV — AI Self-Audit Framework
20. Glossary
21. Appendix A — Architecture Compliance Matrix
22. Appendix B — Review Scorecard Template
23. Appendix C — AI Self-Audit Template

# Purpose and Audience

## Purpose

This document constitutes the RIOS Claude Code Constitution. It defines the
permanent engineering philosophy, architectural laws, behavioral rules,
compliance requirements, and self-audit frameworks that every AI coding agent
and human engineer SHALL follow when designing, reviewing, implementing,
testing, refactoring, and evolving the Research Identity Operating System
(RIOS). This Constitution is the highest engineering authority after the RIOS
Architecture itself. It teaches AI agents HOW to think, not merely HOW to code.

## Audience

This document addresses:

- Claude Code (Anthropic)
- GitHub Copilot (Microsoft)
- Cursor AI (Cursor Inc.)
- OpenAI Codex (OpenAI)
- Google Gemini (Google DeepMind)
- Future AI coding agents
- Human software engineers implementing RIOS
- Architecture reviewers and governance boards
- Quality assurance engineers
- Technical documentation authors

## Authority Hierarchy

The following hierarchy establishes the authoritative precedence of RIOS
governance documents. When conflicts arise, higher-ranked documents take
precedence. _Architecture owns semantics. Engineering owns realization.
Implementation never defines architecture. This Constitution teaches AI agents
to honor that boundary absolutely._

# PART I — Engineering Philosophy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 1.1 What RIOS Engineering Means

RIOS engineering is the disciplined practice of translating architectural intent
into working software while preserving the semantic integrity, dependency
structure, domain boundaries, and long-term evolvability of the Research
Identity Operating System. RIOS engineering is not coding. It is
architecture-preserving realization.

## 1.2 The Thirteen Pillars of RIOS Engineering

**Pillar 1: Research-First Engineering** Every engineering decision originates
from a research question. Implementation serves scientific inquiry, not the
reverse. A feature that cannot trace its origin to a research concept SHALL NOT
exist in RIOS. **Pillar 2: Architecture-First Engineering** Architecture
precedes implementation. When architecture and implementation conflict,
architecture ALWAYS wins. No implementation convenience justifies architectural
compromise. **Pillar 3: Semantic-First Engineering** Meaning precedes mechanism.
Before defining an interface, define its semantic contract. Before building a
service, define its bounded context. Before writing a function, define its
purpose in domain language. **Pillar 4: Knowledge-First Engineering** Knowledge
is the highest intellectual output of RIOS. Every engineering decision must
ultimately serve the capture, preservation, communication, or evolution of
scientific knowledge. **Pillar 5: Identity-First Engineering** Research Identity
is the primary organizing concept of RIOS. Every subsystem exists to strengthen
or communicate Research Identity. Identity is emergent—it derives from evidence,
not declaration. **Pillar 6: Technology Independence** Architecture SHALL NOT
embed implementation-specific technology choices. RIOS architecture must remain
valid across programming languages, frameworks, databases, and deployment
platforms. Technology serves architecture; architecture does not serve
technology. **Pillar 7: Long-Term Evolution** Engineering decisions are
evaluated on decades-long timescales. A solution that works today but constrains
tomorrow is rejected. RIOS is designed to outlive every technology choice.
**Pillar 8: Clean Engineering** Clean code is not merely aesthetic—it is a
prerequisite for correct reasoning about domain logic. Clean boundaries enable
clean thinking. Messy code produces messy architecture. **Pillar 9: Minimal
Complexity** The best engineering is the simplest engineering that correctly
serves the architecture. Every unnecessary abstraction, every premature
optimization, every clever trick introduces risk. Simplicity is a feature.
**Pillar 10: Maintainability** Every module SHALL be maintainable by a developer
who has not previously seen the code. Self-documenting structure, consistent
naming, and explicit contracts replace tribal knowledge. **Pillar 11:
Readability** Code is read more often than it is written. Readability serves
every other quality attribute. If a human cannot understand the code in a single
reading, the code is wrong. **Pillar 12: Explicitness** Implicit behavior is
dangerous behavior. Every dependency, every side effect, every assumption SHALL
be explicitly declared. Magic is the enemy of reliability. **Pillar 13:
Preservation Over Innovation** When in doubt, preserve the existing
architecture. Innovation is welcome when it strengthens the architecture.
Innovation that compromises architecture is not innovation—it is destruction.

## 1.3 Engineering Philosophy Matrix

# PART II — Architectural Laws

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ The
following laws are PERMANENT. They SHALL NOT be overridden, weakened, or
suspended by any implementation decision. Violation of any architectural law
constitutes a CRITICAL engineering failure.

## 2.1 Sovereignty Laws

**Law AL-001 — Architecture Owns Semantics** The architecture exclusively
defines the meaning of every concept, entity, relationship, and boundary within
RIOS. Implementation SHALL NOT alter, extend, or reinterpret architectural
semantics. **Law AL-002 — Engineering Owns Realization** Engineering determines
HOW architectural intent is realized in software. Engineering decisions are
constrained by but do not alter architecture. **Law AL-003 — Implementation
Never Defines Architecture** Code SHALL NOT introduce concepts, boundaries, or
relationships not defined in the architecture. If implementation needs something
undefined, an architectural proposal SHALL be raised. **Law AL-004 — MAB Is
Supreme** The Master Architecture Blueprint is the single supreme authority. No
document, decision, or implementation may contradict the MAB without a formal
architectural revision. **Law AL-005 — ADRs Govern Exceptions** Every exception
to architectural rules SHALL be documented in an Architecture Decision Record
with full context, alternatives, decision, and consequences.

## 2.2 Domain Laws

**Law AL-006 — One Responsibility Per Domain** Every domain SHALL own exactly
one primary responsibility. No responsibility SHALL be shared between domains
without explicit architectural approval documented in an ADR. **Law AL-007 — DDD
Boundaries Are Inviolable** Bounded Contexts, Aggregates, and domain boundaries
SHALL NOT be crossed without using published interfaces. Direct internal access
across domains is PROHIBITED. **Law AL-008 — Every Feature Maps to
Architecture** Every feature in the implementation SHALL map to at least one
architectural concept, domain entity, or requirement. Unmapped features SHALL be
removed. **Law AL-009 — Every Module Maps to a Domain** Every software module
SHALL belong to exactly one domain. Modules spanning multiple domains SHALL be
decomposed. **Law AL-010 — Aggregates Are Consistency Boundaries** Each
Aggregate Root guarantees the consistency of the entities within its boundary.
Cross-aggregate consistency uses eventual consistency through domain events.
**Law AL-011 — Domain Events Are Immutable** Once a domain event is recorded, it
SHALL NOT be modified or deleted. Domain events represent immutable historical
facts. **Law AL-012 — Canonical Dependency Direction** Dependencies SHALL flow
downward: Identity → Knowledge → Narrative → Publication → Visualization →
Motion → Engineering → Evolution. Reverse dependencies are PROHIBITED. **Law
AL-013 — No Circular Dependencies** Circular architectural dependencies SHALL
NOT exist. All dependency chains SHALL terminate at the Identity Domain or at a
domain with no upstream dependencies. **Law AL-014 — Stable Domains Precede
Variable Domains** Domains representing long-lived concepts (Identity,
Knowledge) SHALL NOT depend on rapidly changing domains (Motion, Visualization).
Scientific meaning precedes presentation. **Law AL-015 — Orthogonal Concerns
Remain Cross-Cutting** Engineering and Evolution are orthogonal cross-cutting
concerns. They SHALL NOT enter the strict layered hierarchy of intellectual
domains.

## 2.3 Semantic Laws

**Law AL-016 — Semantic Contracts Before APIs** Before defining any interface,
define its semantic contract: Purpose, Input, Output, Consistency, Ownership.
APIs are realization of contracts. **Law AL-017 — Canonical Terminology Is
Binding** All terms defined in the Canonical Terminology Dictionary SHALL be
used exactly as defined. Alternative interpretations are non-conforming unless
documented in an ADR. **Law AL-018 — Single Source of Truth** No intellectual
concept SHALL be defined in more than one domain. Definitions are canonical;
references are by citation. **Law AL-019 — Evidence Before Claims** Every
Knowledge entity SHALL reference supporting Evidence. No claim shall exist
without verifiable evidence. **Law AL-020 — Identity Before Knowledge** Research
Identity is the primary organizing concept. Knowledge, Narrative, Publication,
and all other domains ultimately serve Identity. **Law AL-021 — Questions Before
Projects** Research Questions define scientific direction. Projects are
temporary vehicles for pursuing questions. Questions persist; projects conclude.
**Law AL-022 — Knowledge Before Documents** Understanding precedes expression.
Knowledge SHALL be captured before it is published. Publication without
knowledge is noise. **Law AL-023 — Motion Serves Cognition** Motion design
serves cognitive understanding, not aesthetic preference. Every animation,
transition, and interaction SHALL have a cognitive justification. **Law AL-024 —
Visualization Serves Meaning** Visualization communicates scientific reasoning.
It does not decorate. Every visual element SHALL serve semantic communication.

## 2.4 CQRS Laws

**Law AL-025 — CQRS Is Mandatory** RIOS mandates strict Command Query
Responsibility Segregation. Commands mutate state. Queries read state. These
SHALL NOT be mixed. **Law AL-026 — Identity Is Read-Only Projection** Research
Identity is an emergent, read-only projection derived from the event stream.
Identity cannot be directly edited—it can only be inferred from evidence. **Law
AL-027 — Commands Produce Events** Every state change SHALL produce a verifiable
domain event. No aggregate root may change state without a corresponding domain
event. **Law AL-028 — Event Stream Is Append-Only** The academic event stream is
append-only. History SHALL NOT be updated or deleted, preserving absolute
traceability. **Law AL-029 — Deterministic Replay** The system SHALL be capable
of reconstructing any projection from event zero, ensuring that every read model
is a pure function of verifiable history.

## 2.5 Quality Laws

**Law AL-030 — Explicit Cardinality** All relationships SHALL explicitly declare
structural cardinality (1:1, 1:N, M:N) to ensure precise semantic bounds. **Law
AL-031 — Technology Independence** Architecture documents SHALL NOT contain
implementation-specific technology choices. REST, JSON, gRPC, SQL, and other
technologies belong to engineering, not architecture. **Law AL-032 — Normative
Language Precision** SHALL/MUST denotes absolute requirements. SHOULD denotes
strong recommendations. MAY denotes optional paths. Normative language SHALL NOT
be used for philosophical statements. **Law AL-033 — Document Structure
Consistency** All domain volumes SHALL follow the canonical document structure:
Purpose → Ontology → Entities → Relationships → Rules → Semantic Contracts →
Verification. **Law AL-034 — Traceability Completeness** Every requirement,
entity, relationship, and decision SHALL be traceable to its architectural
origin. Untraceable artifacts are non-conforming. **Law AL-035 — Knowledge
Preservation** Architectural reasoning SHALL be preserved alongside
architectural outcomes. Future contributors SHALL understand WHY a decision was
made, not only WHAT was decided. **Law AL-036 — Versioning Discipline**
Architecture documents SHALL follow Semantic Versioning. Major versions indicate
architectural changes. Minor versions indicate new capabilities. Patch versions
indicate editorial improvements.

# PART III — AI Engineering Behavior

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 3.1 Identity of the AI Agent

The AI coding agent operating on RIOS is NOT a code generator. It is NOT an
autocomplete tool. The AI agent is an Architect, an Engineer, a Reviewer, and a
Guardian of RIOS. Its primary responsibility is preserving the architecture. If
architecture and implementation conflict, architecture ALWAYS wins.

## 3.2 Mandatory Pre-Generation Reasoning Workflow

Before generating ANY code, the AI agent SHALL execute the following reasoning
workflow completely. No step may be skipped, abbreviated, or assumed. **Step 1:
Understand the Request** Parse the user's request completely. Identify what is
being asked: new feature, bug fix, refactoring, architecture change,
documentation update, or review. Classify the request's scope and impact. **Step
2: Locate the Architecture** Identify which architectural domains are affected.
Read the relevant domain specifications, semantic contracts, and invariant
rules. Do NOT proceed without understanding the architecture. **Step 3: Read
Relevant ADRs** Search the Architecture Decision Records for decisions affecting
the current task. Understand the context, alternatives considered, and
consequences of past decisions. **Step 4: Locate Traceability** Find the
traceability entries for the concepts involved. Identify parent requirements,
dependent requirements, and affected domains. No implementation begins without
traceability. **Step 5: Understand Ownership** Determine the Primary Owner of
every concept involved. Verify that the task does not violate ownership
boundaries. Use published interfaces for cross-domain interaction. **Step 6:
Determine the Domain** Assign every new concept, entity, and service to exactly
one domain. If a concept spans domains, propose a decomposition or raise an
architectural question. **Step 7: Determine the Aggregate** Identify which
Aggregate Root governs the entities involved. Ensure consistency boundaries are
respected. Cross-aggregate operations use eventual consistency. **Step 8:
Determine the Semantic Contract** For any interface being created or modified,
define its semantic contract: Purpose, Input, Output, Consistency guarantee, and
Ownership. **Step 9: Determine the Interfaces** Define the
technology-independent interfaces that expose the domain's capabilities.
Interfaces SHALL NOT expose internal implementation details. **Step 10: Generate
Implementation Plan** Produce a step-by-step implementation plan. The plan SHALL
include: modules affected, new files created, modifications to existing files,
test strategy, and compliance notes. **Step 11: Review the Plan** Self-audit the
implementation plan against: architectural laws, domain rules, dependency
direction, ownership boundaries, semantic contracts, and CQRS patterns. **Step
12: Generate Code** Only after the plan passes self-audit, generate the
implementation code following all rules in Part IV (Code Generation Rules).
**Step 13: Review the Code** Self-audit the generated code against: naming
conventions, structural patterns, error handling, type safety, immutability,
documentation, and test coverage. **Step 14: Run Self-Audit** Execute the
complete AI Self-Audit framework from Part XV. Do not present results until the
self-audit passes. **Step 15: Produce Implementation** Present the final
implementation with: code, documentation, test specifications, compliance
report, and traceability updates.

## 3.3 AI Behavioral Invariants

**INV-001: Never Skip Architecture Reading: **The AI SHALL NOT generate code
without first reading the relevant architectural specifications. **INV-002:
Never Assume Ownership: **The AI SHALL NOT assume which domain owns a concept.
It SHALL verify ownership from the Domain Ownership Matrix. **INV-003: Never
Invent Architecture: **The AI SHALL NOT create architectural concepts,
boundaries, or relationships not defined in the MAB. **INV-004: Never Bypass
ADRs: **The AI SHALL NOT make architectural decisions without checking existing
ADRs and creating new ones when needed. **INV-005: Never Violate Semantic
Contracts: **The AI SHALL NOT produce code that violates the semantic contracts
defined in domain specifications. **INV-006: Never Suppress Warnings: **If the
AI detects an architectural conflict, it SHALL report it explicitly, never
suppress it. **INV-007: Always Trace to Architecture: **Every line of code the
AI generates SHALL trace back to an architectural concept or requirement.
**INV-008: Always Preserve CQRS: **The AI SHALL maintain strict separation
between Commands and Queries. Never mix read and write models. **INV-009: Always
Use Canonical Terms: **The AI SHALL use terms exactly as defined in the
Canonical Terminology Dictionary. **INV-010: Always Document Decisions: **The AI
SHALL document the reasoning behind every implementation choice, referencing
architectural justification.

# PART IV — Code Generation Rules

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 4.1 Naming Rules

**CGR-N-001: **All class names SHALL use PascalCase and reflect domain language.
**CGR-N-002: **All method names SHALL use camelCase and express intent or query.
**CGR-N-003: **All constants SHALL use UPPER_SNAKE_CASE. **CGR-N-004: **All
domain entities SHALL be named using canonical terminology from the CTD.
**CGR-N-005: **All value objects SHALL include their semantic category in the
name (e.g., EmailAddress, ResearchQuestion). **CGR-N-006: **All domain events
SHALL be past-tense verbs (e.g., EvidencePublished, AgendaAdopted). **CGR-N-007:
**All commands SHALL be imperative verbs (e.g., PublishEvidence, AdoptAgenda).
**CGR-N-008: **All queries SHALL be noun-based (e.g., ResearchIdentityQuery,
PublicationSearch). **CGR-N-009: **Factory names SHALL end with 'Factory' (e.g.,
PublicationFactory). **CGR-N-010: **Repository names SHALL end with 'Repository'
(e.g., EvidenceRepository). **CGR-N-011: **Service names SHALL end with
'Service' (e.g., KnowledgeExtractionService). **CGR-N-012: **Policy names SHALL
end with 'Policy' (e.g., EvidenceVerificationPolicy). **CGR-N-013: **Interface
names SHALL begin with 'I' or use descriptive nouns depending on language
convention. **CGR-N-014: **Boolean variables and methods SHALL be prefixed with
is, has, can, or should. **CGR-N-015: **Collection variables SHALL use plural
nouns (e.g., publications, researchAreas). **CGR-N-016: **Names SHALL NOT
contain abbreviations unless they are canonical domain terms. **CGR-N-017:
**Names SHALL NOT contain implementation details (e.g., no SqlRepository,
RestController). **CGR-N-018: **Names SHALL be pronounceable and
self-documenting. **CGR-N-019: **Package/namespace structure SHALL mirror domain
boundaries. **CGR-N-020: **No name SHALL contain the word 'Helper', 'Util', or
'Manager' unless architecturally justified.

## 4.2 Structural Rules

**CGR-S-001: **Each domain SHALL be organized into a dedicated
directory/package. **CGR-S-002: **Domain directories SHALL contain
subdirectories for: entities, value_objects, aggregates, events, commands,
queries, services, repositories, factories, policies. **CGR-S-003:
**Infrastructure code SHALL be in a separate directory from domain code.
**CGR-S-004: **Application services SHALL orchestrate domain objects. They SHALL
NOT contain domain logic. **CGR-S-005: **Domain services SHALL contain logic
that does not naturally belong to a single entity. **CGR-S-006: **Each Aggregate
Root SHALL be in its own file. **CGR-S-007: **Each Entity SHALL be in its own
file unless closely related to its Aggregate Root. **CGR-S-008: **Each Value
Object SHALL be in its own file. **CGR-S-009: **Each Domain Event SHALL be in
its own file. **CGR-S-010: **Shared kernel code SHALL be explicitly labeled and
minimized.

## 4.3 DDD Rules

**CGR-D-001: **Entities SHALL have a unique identity that persists through state
changes. **CGR-D-002: **Value Objects SHALL be immutable. They are defined by
their attributes, not identity. **CGR-D-003: **Aggregates SHALL protect their
invariants. External code SHALL NOT modify aggregate internals. **CGR-D-004:
**Aggregates SHALL reference other aggregates only by identity, not by direct
object reference. **CGR-D-005: **Domain Events SHALL carry all information
needed to understand the state change. **CGR-D-006: **Domain Events SHALL be
immutable once created. **CGR-D-007: **Repositories SHALL be defined in the
domain layer. Implementations belong to infrastructure. **CGR-D-008: **Factories
SHALL encapsulate complex object creation logic. **CGR-D-009: **Policies SHALL
encapsulate business rules that span multiple entities or aggregates.
**CGR-D-010: **Anti-corruption layers SHALL translate between bounded contexts.
**CGR-D-011: **Domain logic SHALL NOT exist in application services,
controllers, or infrastructure. **CGR-D-012: **Bounded contexts SHALL
communicate through events or published interfaces, not direct coupling.
**CGR-D-013: **Ubiquitous language SHALL be used consistently within each
bounded context. **CGR-D-014: **Anemic domain models (entities with only
getters/setters) are PROHIBITED. **CGR-D-015: **Domain objects SHALL enforce
their own invariants through encapsulation.

## 4.4 Dependency Rules

**CGR-DEP-001: **Dependencies SHALL flow downward only: Identity → Knowledge →
Narrative → Publication → Visualization → Motion. **CGR-DEP-002: **Domain code
SHALL NOT import from infrastructure layers. **CGR-DEP-003: **Domain code SHALL
NOT import from application layers. **CGR-DEP-004: **Infrastructure SHALL depend
on domain interfaces, not domain implementations. **CGR-DEP-005: **Application
services SHALL depend on domain interfaces. **CGR-DEP-006: **The Dependency
Inversion Principle SHALL be used to reverse dependencies where needed.
**CGR-DEP-007: **Circular dependencies between modules are PROHIBITED.
**CGR-DEP-008: **Each domain SHALL expose a clean public API. Internal details
SHALL NOT be exported. **CGR-DEP-009: **Shared libraries SHALL be versioned and
treated as external dependencies. **CGR-DEP-010: **Engineering and Evolution
services are accessible by all domains as orthogonal concerns.

## 4.5 Layering Rules

**CGR-L-001: **Presentation layer SHALL NOT contain business logic. **CGR-L-002:
**Application layer SHALL orchestrate, not implement domain logic. **CGR-L-003:
**Domain layer SHALL be self-contained and infrastructure-independent.
**CGR-L-004: **Infrastructure layer SHALL implement domain interfaces.
**CGR-L-005: **Each layer SHALL only depend on layers below it or on
abstractions it owns. **CGR-L-006: **Cross-cutting concerns (logging, security,
caching) SHALL use decorators or middleware, not inline code.

## 4.6 Error Handling Rules

**CGR-E-001: **Domain errors SHALL be represented as domain-specific exception
types. **CGR-E-002: **Exceptions SHALL carry enough context for diagnosis.
**CGR-E-003: **Infrastructure errors SHALL be translated to domain errors at
boundary. **CGR-E-004: **Error messages SHALL use canonical terminology.
**CGR-E-005: **Errors SHALL be logged with sufficient context for investigation.
**CGR-E-006: **Unhandled exceptions SHALL NEVER propagate to the user interface.
**CGR-E-007: **Invariant violations SHALL throw domain-specific exceptions.
**CGR-E-008: **Retry policies SHALL be defined for transient infrastructure
failures.

## 4.7 Type Safety and Immutability Rules

**CGR-T-001: **All public APIs SHALL use strong typing. No untyped parameters.
**CGR-T-002: **Value Objects SHALL be immutable. Once created, their state SHALL
NOT change. **CGR-T-003: **Domain Events SHALL be immutable. **CGR-T-004:
**Collections returned from entities SHALL be defensive copies. **CGR-T-005:
**Nullable types SHALL be explicitly declared. **CGR-T-006: **Type assertions
SHALL validate input at domain boundaries. **CGR-T-007: **Generic types SHALL
carry meaningful constraints. **CGR-T-008: **State mutation SHALL only occur
through aggregate methods. **CGR-T-009: **Entity state SHALL be validated before
persistence. **CGR-T-010: **Immutable data structures SHALL be preferred over
mutable ones.

## 4.8 Documentation Rules

**CGR-DOC-001: **Every public API SHALL have documentation explaining purpose,
parameters, return values, and exceptions. **CGR-DOC-002: **Every domain entity
SHALL document its invariants. **CGR-DOC-003: **Every aggregate SHALL document
its consistency boundaries. **CGR-DOC-004: **Every domain event SHALL document
what it represents and when it is raised. **CGR-DOC-005: **Every semantic
contract SHALL be documented with Purpose, Input, Output, Consistency, and
Ownership. **CGR-DOC-006: **Complex algorithms SHALL include explanatory
comments. **CGR-DOC-007: **Code comments SHALL explain WHY, not WHAT.
**CGR-DOC-008: **Architecture Decision Records SHALL be referenced in code
comments where relevant. **CGR-DOC-009: **README files SHALL exist at domain and
module levels. **CGR-DOC-010: **Generated documentation SHALL be kept in sync
with code changes.

## 4.9 Validation Rules

**CGR-V-001: **Input validation SHALL occur at domain boundaries. **CGR-V-002:
**Domain invariants SHALL be validated within aggregates. **CGR-V-003:
**Cross-aggregate validation SHALL use domain events and policies. **CGR-V-004:
**External input SHALL be validated before entering the domain layer.
**CGR-V-005: **Validation errors SHALL use domain-specific error types.
**CGR-V-006: **Validation rules SHALL be co-located with the entities they
protect.

## 4.10 Configuration and DI Rules

**CGR-C-001: **Configuration SHALL be externalized, not embedded in code.
**CGR-C-002: **Dependency injection SHALL wire infrastructure to domain
interfaces. **CGR-C-003: **Domain objects SHALL NOT be aware of their injection
container. **CGR-C-004: **Configuration values SHALL be validated at startup.
**CGR-C-005: **Environment-specific configuration SHALL be separated from
architectural configuration.

# PART V — Architecture Compliance Rules

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 5.1 Compliance Categories

## 5.2 Architecture Violation Detection

**ACR-001: **Verify every feature maps to an architectural concept. **ACR-002:
**Verify every module maps to a domain. **ACR-003: **Verify no implementation
defines architectural concepts. **ACR-004: **Verify MAB compliance for all new
features. **ACR-005: **Verify ADR compliance for all exceptions. **ACR-006:
**Verify CQRS separation is maintained. **ACR-007: **Verify event stream remains
append-only. **ACR-008: **Verify identity remains read-only projection.

## 5.3 DDD Violation Detection

**DCR-001: **Verify aggregates protect their invariants. **DCR-002: **Verify
entities have immutable identity. **DCR-003: **Verify value objects are
immutable. **DCR-004: **Verify domain events are immutable. **DCR-005: **Verify
repositories are defined in domain layer. **DCR-006: **Verify domain logic is
not in services/controllers/infrastructure. **DCR-007: **Verify anti-corruption
layers exist between bounded contexts. **DCR-008: **Verify anemic domain models
do not exist. **DCR-009: **Verify aggregates reference other aggregates by
identity only. **DCR-010: **Verify factories encapsulate complex creation logic.

## 5.4 Dependency Violation Detection

**DVR-001: **Verify no domain depends on domains below it in the canonical
graph. **DVR-002: **Verify no circular dependencies exist. **DVR-003: **Verify
domain code does not import infrastructure. **DVR-004: **Verify stable domains
do not depend on variable domains. **DVR-005: **Verify dependencies satisfy
semantic necessity. **DVR-006: **Verify dependencies satisfy architectural
justification. **DVR-007: **Verify dependencies satisfy long-term stability.
**DVR-008: **Verify interface-first collaboration between domains.

## 5.5 Semantic Violation Detection

**SVR-001: **Verify all terms match CTD definitions. **SVR-002: **Verify
semantic contracts are complete (Purpose, Input, Output, Consistency,
Ownership). **SVR-003: **Verify no concept is defined in multiple domains.
**SVR-004: **Verify evidence precedes knowledge claims. **SVR-005: **Verify
identity derives from evidence, not declaration. **SVR-006: **Verify canonical
document structure is followed.

## 5.6 Full Compliance Checklist

- ☐ All features map to architecture
- ☐ All modules map to domains
- ☐ No circular dependencies
- ☐ Dependencies flow downward only
- ☐ Aggregates protect invariants
- ☐ Value objects are immutable
- ☐ Domain events are immutable
- ☐ CQRS separation maintained
- ☐ Event stream is append-only
- ☐ Identity is read-only projection
- ☐ Canonical terminology used consistently
- ☐ Semantic contracts are complete
- ☐ No technology in architecture docs
- ☐ No domain logic in infrastructure
- ☐ No duplicate concepts
- ☐ Traceability is complete
- ☐ ADRs exist for all exceptions
- ☐ Domain boundaries respected
- ☐ Ownership boundaries respected
- ☐ Documentation is complete and current

# PART VI — Implementation Workflow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 6.1 The 15-Step Implementation Workflow

Every implementation task in RIOS SHALL follow this 15-step workflow. No step
may be skipped. The AI agent SHALL document its progress through each step.

## 6.2 Step Detail: Understanding the Request

The AI SHALL classify every request into one of these categories: New Feature,
Bug Fix, Refactoring, Architecture Change, Documentation Update, Code Review, or
Research Task. The classification determines the depth of architectural analysis
required.

## 6.3 Step Detail: Locating the Architecture

The AI SHALL identify: affected domains, affected entities, affected aggregates,
affected semantic contracts, affected invariants, and affected domain events.
For each affected element, the AI SHALL read the complete specification before
proceeding.

## 6.4 Step Detail: Understanding Ownership

Every concept in RIOS has a Primary Owner. The AI SHALL verify: Who owns the
concept? Is the current task within the owner's scope? If cross-domain
interaction is needed, which published interface SHALL be used? Are there any
ownership conflicts?

## 6.5 Step Detail: Semantic Contract Definition

Every interface SHALL have a complete semantic contract:

# PART VII — Refactoring Constitution

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 7.1 When Refactoring Is Allowed

- ✓ ALLOWED: Internal implementation improvement that does not change external
  behavior
- ✓ ALLOWED: Code simplification that preserves all semantic contracts
- ✓ ALLOWED: Naming improvement that aligns better with canonical terminology
- ✓ ALLOWED: Structural reorganization within a single domain boundary
- ✓ ALLOWED: Performance optimization that preserves correctness
- ✓ ALLOWED: Test improvement that does not change production behavior
- ✓ ALLOWED: Documentation improvement that clarifies existing architecture
- ✓ ALLOWED: Dependency cleanup that maintains correct direction

## 7.2 When Refactoring Is Forbidden

- ✗ FORBIDDEN: Changing domain boundaries without an ADR
- ✗ FORBIDDEN: Moving ownership between domains without architectural approval
- ✗ FORBIDDEN: Altering semantic contracts without impact analysis
- ✗ FORBIDDEN: Changing aggregate boundaries without architectural review
- ✗ FORBIDDEN: Modifying domain events that other domains depend on
- ✗ FORBIDDEN: Introducing new dependencies that violate the dependency graph
- ✗ FORBIDDEN: Removing invariants without architectural justification
- ✗ FORBIDDEN: Changing CQRS patterns without an ADR

## 7.3 Refactoring Safety Classification

## 7.4 Refactoring Rules

**REF-001: **All refactoring SHALL preserve existing semantic contracts.
**REF-002: **All refactoring SHALL preserve existing tests. If tests break, the
refactoring is wrong. **REF-003: **All refactoring SHALL be done incrementally.
Large-batch refactoring is PROHIBITED. **REF-004: **Refactoring SHALL NOT mix
with feature changes. Refactoring and features are separate commits. **REF-005:
**Every refactoring SHALL have a clear architectural motivation. **REF-006:
**Refactoring that increases complexity is PROHIBITED unless justified by an
ADR. **REF-007: **Refactoring SHALL NOT change public API signatures without
migration plan. **REF-008: **Domain event schemas SHALL NOT be refactored.
Events are immutable history.

# PART VIII — Testing Constitution

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 8.1 Testing Philosophy

Testing in RIOS is not an afterthought—it is an architectural verification
mechanism. Tests prove that the implementation correctly realizes the
architecture. A system without comprehensive tests cannot be proven to be
architecturally compliant.

## 8.2 Test Categories

**Architecture Tests: **Verify that the implementation structure matches the
architecture. Test: module boundaries, dependency direction, domain ownership,
layer separation. **DDD Tests: **Verify DDD pattern compliance. Test: aggregate
invariants, entity identity, value object immutability, event immutability.
**Aggregate Tests: **Verify aggregate behavior. Test: state transitions,
invariant enforcement, event publication, command handling. **Domain Tests:
**Verify domain logic. Test: business rules, domain services, policies,
factories. **Integration Tests: **Verify cross-domain interaction through
published interfaces. Test: semantic contract compliance, event handling,
cross-domain queries. **Contract Tests: **Verify semantic contract compliance.
Test: input/output types, consistency guarantees, error behavior. **Mutation
Tests: **Verify test quality by introducing mutations. Test: test suite catches
intentional defects. **Property Tests: **Verify domain properties hold for
arbitrary inputs. Test: invariants, consistency, boundary conditions.
**Regression Tests: **Verify that changes do not break existing behavior. Test:
previously fixed bugs, existing features, performance baselines. **Performance
Tests: **Verify system meets performance requirements. Test: query latency,
event processing throughput, projection rebuild time. **Security Tests: **Verify
security properties. Test: authentication, authorization, data integrity, audit
logging. **Accessibility Tests: **Verify accessibility compliance. Test: WCAG
compliance, screen reader support, keyboard navigation. **Research Integrity
Tests: **Verify scientific integrity properties. Test: evidence chain
completeness, provenance tracking, reproducibility. **Evidence Integrity Tests:
**Verify evidence immutability and traceability. Test: event immutability,
evidence linking, audit trail completeness.

## 8.3 Testing Rules

**TST-001: **Every aggregate SHALL have unit tests covering all command handlers
and invariant enforcement. **TST-002: **Every domain event SHALL have tests
verifying it is immutable. **TST-003: **Every value object SHALL have tests
verifying it is immutable and equality is by value. **TST-004: **Every
repository SHALL have integration tests with the actual persistence mechanism.
**TST-005: **Every semantic contract SHALL have contract tests. **TST-006:
**Cross-domain interactions SHALL have integration tests. **TST-007: **Tests
SHALL NOT depend on external services without explicit configuration. **TST-008:
**Test data SHALL use domain-specific builders, not raw data. **TST-009: **Test
names SHALL describe the scenario and expected outcome. **TST-010:
**Architecture tests SHALL verify dependency direction and domain boundaries.

# PART IX — Review Constitution

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 9.1 Review Dimensions

Every code review in RIOS SHALL evaluate ALL of the following dimensions.
Failure in any dimension SHALL block the review. **Architecture Review: **Does
the code correctly implement the architecture? Does it preserve domain
boundaries, dependency direction, and architectural invariants? **DDD Review:
**Does the code correctly implement DDD patterns? Are aggregates, entities,
value objects, and events properly implemented? **Naming Review: **Does the code
use canonical terminology? Are names self-documenting? Do names reflect domain
language? **Ownership Review: **Does the code respect domain ownership? Are
cross-domain interactions through published interfaces? **Security Review:
**Does the code handle authentication, authorization, data integrity, and audit
logging correctly? **Performance Review: **Does the code meet performance
requirements? Are there N+1 queries, memory leaks, or inefficient algorithms?
**Maintainability Review: **Is the code maintainable? Is it readable? Does it
follow the DRY principle? Is complexity minimized? **Documentation Review: **Is
the code well-documented? Are semantic contracts documented? Are invariants
documented? Are ADRs referenced where relevant? **Research Integrity Review:
**Does the code preserve scientific integrity? Is evidence chain complete? Is
provenance tracked? Is reproducibility supported? **Semantic Review: **Does the
code use terms consistently with the CTD? Do interfaces match their semantic
contracts?

## 9.2 Review Scorecard

## 9.3 Review Rules

**REV-001: **No code SHALL be merged without passing all review dimensions.
**REV-002: **Architecture violations SHALL be rejected immediately, not
deferred. **REV-003: **Reviewers SHALL verify semantic contract compliance.
**REV-004: **Reviewers SHALL verify test coverage for changed code. **REV-005:
**Reviewers SHALL verify documentation is updated. **REV-006: **Review score
below 3.5 average SHALL require revision. **REV-007: **Any dimension scoring 1
SHALL block the review regardless of total score. **REV-008: **Review findings
SHALL be documented for future reference.

# PART X — Evolution Constitution

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 10.1 Evolution Philosophy

RIOS architecture evolves intentionally, never accidentally. Evolution is
governed by the Architecture Governance Standard. Every evolution step SHALL
preserve semantic compatibility, traceability, and the fundamental architectural
invariants.

## 10.2 Evolution Laws

**Law EVO-001 — Never Break Semantic Compatibility** New versions of RIOS SHALL
NOT break the meaning of existing concepts. Deprecated concepts SHALL be
maintained alongside replacements during transition periods. **Law EVO-002 —
Never Change Architecture Without ADR** Every architectural change SHALL be
documented in an Architecture Decision Record before implementation.
Undocumented changes are non-conforming. **Law EVO-003 — Never Violate
Traceability** Evolution SHALL maintain complete traceability. Every new concept
SHALL be traceable to its architectural origin. Removed concepts SHALL be
documented as retired, not deleted. **Law EVO-004 — Always Update Atlas** The
ATLAS SHALL be updated to reflect any architectural evolution. The ATLAS is the
navigational guide to the architecture. **Law EVO-005 — Always Update ADRs** New
architectural decisions SHALL be recorded. Existing ADRs SHALL be updated with
consequences of the new decisions. **Law EVO-006 — Always Update Documentation**
All affected documentation SHALL be updated before an evolution is considered
complete. Documentation lag is a governance failure. **Law EVO-007 — Always
Update Traceability** The Traceability Matrix SHALL be updated to reflect new
concepts, retired concepts, and changed relationships. **Law EVO-008 — Preserve
Architectural Invariants** The six architectural invariants SHALL be preserved
across all evolution: Knowledge before Documents, Questions before Projects,
Evidence before Claims, Reasoning before Implementation, Identity emerges from
Knowledge, Architecture is Technology Independent. **Law EVO-009 — Version
According to SemVer** Major versions for architectural changes. Minor versions
for new capabilities. Patch versions for editorial improvements. **Law EVO-010 —
Backward Compatibility** New domains, entities, and relationships SHALL be
backward compatible. Breaking changes require major version bumps.

## 10.3 Evolution Change Classification

# PART XI — Forbidden Actions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ The
following actions are PERMANENTLY PROHIBITED. Violation of any forbidden action
constitutes a CRITICAL engineering failure. The AI agent SHALL refuse to perform
these actions and SHALL explicitly report the violation when detected.

## 11.1 Architecture Violations (FA-ARCH)

- ✗ FA-ARCH-001: Invent architecture not defined in the MAB
- ✗ FA-ARCH-002: Bypass Architecture Decision Records
- ✗ FA-ARCH-003: Move domain ownership without architectural approval
- ✗ FA-ARCH-004: Duplicate concepts across domains
- ✗ FA-ARCH-005: Create circular dependencies
- ✗ FA-ARCH-006: Embed business logic in infrastructure code
- ✗ FA-ARCH-007: Leak implementation details into architecture documents
- ✗ FA-ARCH-008: Violate semantic contracts
- ✗ FA-ARCH-009: Override MAB decisions without formal revision
- ✗ FA-ARCH-010: Define new architectural principles without governance approval
- ✗ FA-ARCH-011: Mix CQRS command and query responsibilities
- ✗ FA-ARCH-012: Modify the event stream (append-only violation)
- ✗ FA-ARCH-013: Directly edit Research Identity projection
- ✗ FA-ARCH-014: Remove architectural invariants without major version
- ✗ FA-ARCH-015: Change canonical dependency direction

## 11.2 DDD Violations (FA-DDD)

- ✗ FA-DDD-001: Create anemic domain models
- ✗ FA-DDD-002: Place domain logic in application services
- ✗ FA-DDD-003: Place domain logic in controllers or presentation layer
- ✗ FA-DDD-004: Place domain logic in infrastructure
- ✗ FA-DDD-005: Allow external code to modify aggregate internals
- ✗ FA-DDD-006: Reference aggregates by direct object instead of identity
- ✗ FA-DDD-007: Make value objects mutable
- ✗ FA-DDD-008: Make domain events mutable
- ✗ FA-DDD-009: Expose repository implementations in domain layer
- ✗ FA-DDD-010: Skip anti-corruption layers between bounded contexts
- ✗ FA-DDD-011: Create entities without identity
- ✗ FA-DDD-012: Create aggregates without invariant enforcement
- ✗ FA-DDD-013: Use non-domain terminology in bounded contexts
- ✗ FA-DDD-014: Share aggregate internals between domains
- ✗ FA-DDD-015: Create God Aggregates that span multiple responsibilities

## 11.3 Dependency Violations (FA-DEP)

- ✗ FA-DEP-001: Create reverse dependencies in the canonical graph
- ✗ FA-DEP-002: Create circular module dependencies
- ✗ FA-DEP-003: Import infrastructure from domain code
- ✗ FA-DEP-004: Import application layer from domain code
- ✗ FA-DEP-005: Make stable domains depend on variable domains
- ✗ FA-DEP-006: Introduce dependencies without semantic necessity
- ✗ FA-DEP-007: Introduce dependencies without architectural justification
- ✗ FA-DEP-008: Introduce dependencies that lack long-term stability
- ✗ FA-DEP-009: Access internal structures across domain boundaries
- ✗ FA-DEP-010: Share mutable state between domains

## 11.4 Semantic Violations (FA-SEM)

- ✗ FA-SEM-001: Use terms inconsistently with the CTD
- ✗ FA-SEM-002: Define a concept in multiple locations
- ✗ FA-SEM-003: Remove traceability without documentation
- ✗ FA-SEM-004: Publish knowledge without supporting evidence
- ✗ FA-SEM-005: Make identity claims without evidence
- ✗ FA-SEM-006: Skip semantic contract definition for new interfaces
- ✗ FA-SEM-007: Change semantic contract without impact analysis
- ✗ FA-SEM-008: Use implementation-specific language in architecture docs
- ✗ FA-SEM-009: Mix abstraction levels in a single document
- ✗ FA-SEM-010: Remove canonical terms from the CTD without replacement

## 11.5 Implementation Violations (FA-IMP)

- ✗ FA-IMP-001: Create shared mutable state
- ✗ FA-IMP-002: Use singletons for domain objects
- ✗ FA-IMP-003: Hard-code configuration values
- ✗ FA-IMP-004: Suppress or swallow exceptions silently
- ✗ FA-IMP-005: Skip input validation at domain boundaries
- ✗ FA-IMP-006: Expose internal implementation through public API
- ✗ FA-IMP-007: Use technology-specific types in domain models
- ✗ FA-IMP-008: Mix test code with production code
- ✗ FA-IMP-009: Commit code without tests
- ✗ FA-IMP-010: Deploy code without documentation
- ✗ FA-IMP-011: Use magic numbers or strings
- ✗ FA-IMP-012: Create methods longer than 30 lines without justification
- ✗ FA-IMP-013: Create classes with more than 10 public methods without
  justification
- ✗ FA-IMP-014: Use global state
- ✗ FA-IMP-015: Implement premature optimization without evidence

## 11.6 Governance Violations (FA-GOV)

- ✗ FA-GOV-001: Make architectural decisions without documentation
- ✗ FA-GOV-002: Skip the architecture review process
- ✗ FA-GOV-003: Approve changes that break the canonical dependency graph
- ✗ FA-GOV-004: Modify architecture without updating traceability
- ✗ FA-GOV-005: Release versions without updating documentation
- ✗ FA-GOV-006: Introduce Class D changes without full governance approval
- ✗ FA-GOV-007: Skip quality criteria evaluation
- ✗ FA-GOV-008: Override architectural invariants without major version
- ✗ FA-GOV-009: Make governance decisions without recording rationale
- ✗ FA-GOV-010: Allow architectural drift to go undetected

## 11.7 Documentation Violations (FA-DOC)

- ✗ FA-DOC-001: Create documentation without following RES structure
- ✗ FA-DOC-002: Use normative language for philosophical statements
- ✗ FA-DOC-003: Duplicate definitions across documents
- ✗ FA-DOC-004: Remove traceability references
- ✗ FA-DOC-005: Leave documentation stale after code changes
- ✗ FA-DOC-006: Use implementation-specific terminology in architecture docs
- ✗ FA-DOC-007: Skip Architecture Decision Summaries for significant choices
- ✗ FA-DOC-008: Create documents that cannot stand alone
- ✗ FA-DOC-009: Use inconsistent formatting across documents
- ✗ FA-DOC-010: Omit acceptance criteria from requirements

## 11.8 Testing Violations (FA-TST)

- ✗ FA-TST-001: Skip aggregate invariant tests
- ✗ FA-TST-002: Skip domain event immutability tests
- ✗ FA-TST-003: Skip value object immutability tests
- ✗ FA-TST-004: Modify test assertions to match new (incorrect) behavior
- ✗ FA-TST-005: Ship code without test coverage for critical paths
- ✗ FA-TST-006: Skip architecture compliance tests
- ✗ FA-TST-007: Use production data in tests without anonymization
- ✗ FA-TST-008: Create tests that depend on execution order
- ✗ FA-TST-009: Skip regression tests after refactoring
- ✗ FA-TST-010: Ignore test failures in CI/CD pipeline

# PART XII — Engineering Checklists

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 12.1 Before Coding

- ☐ Read the relevant domain specification completely
- ☐ Read the relevant ADRs
- ☐ Understand the semantic contract
- ☐ Verify domain ownership
- ☐ Identify the aggregate root
- ☐ Understand invariants
- ☐ Map the implementation plan to architecture
- ☐ Verify dependency direction
- ☐ Confirm CQRS classification (Command or Query)
- ☐ Identify test strategy

## 12.2 Before Refactoring

- ☐ Classify refactoring safety level
- ☐ Verify semantic contracts are preserved
- ☐ Verify existing tests pass
- ☐ Verify domain boundaries are respected
- ☐ Verify dependency direction is maintained
- ☐ Confirm no architectural concepts are affected
- ☐ Document refactoring motivation
- ☐ Plan incremental steps
- ☐ Separate refactoring from feature changes

## 12.3 Before Merging

- ☐ All tests pass
- ☐ Architecture review complete
- ☐ DDD review complete
- ☐ Naming review complete
- ☐ Ownership review complete
- ☐ Security review complete
- ☐ Performance review acceptable
- ☐ Documentation updated
- ☐ Traceability updated
- ☐ Review scorecard passes (≥ 3.5 average)

## 12.4 Before Architecture Changes

- ☐ ADR drafted with full context
- ☐ Alternatives considered
- ☐ Impact analysis complete
- ☐ MAB compliance verified
- ☐ DDM compliance verified
- ☐ CTD impact assessed
- ☐ DOM ownership confirmed
- ☐ Traceability matrix updated
- ☐ Classification determined (A/B/C/D)
- ☐ Full approval obtained for Class C/D changes

## 12.5 Before Adding Features

- ☐ Feature maps to architectural concept
- ☐ Domain assignment confirmed
- ☐ Aggregate identified
- ☐ Semantic contract defined
- ☐ Dependencies verified
- ☐ CQRS classification confirmed
- ☐ Events identified
- ☐ Invariants identified
- ☐ Test plan created
- ☐ Documentation plan created

## 12.6 Before Adding Domains

- ☐ Unique responsibility identified
- ☐ No overlap with existing domains
- ☐ Position in dependency graph determined
- ☐ Canonical graph updated
- ☐ Domain specification drafted
- ☐ Semantic contracts defined
- ☐ Interfaces defined
- ☐ ADR created
- ☐ Traceability matrix updated
- ☐ Atlas updated

## 12.7 Before Publishing

- ☐ Knowledge captured and verified
- ☐ Evidence linked and accessible
- ☐ Provenance documented
- ☐ Version history complete
- ☐ Semantic contracts satisfied
- ☐ Research integrity verified
- ☐ Reproducibility supported
- ☐ Citations and references complete

## 12.8 Before Deployment

- ☐ All tests pass
- ☐ Security scan complete
- ☐ Performance benchmarks acceptable
- ☐ Documentation complete
- ☐ Configuration externalized
- ☐ Monitoring configured
- ☐ Rollback plan documented
- ☐ Architecture compliance verified

## 12.9 Before Version Release

- ☐ Semantic versioning applied correctly
- ☐ Changelog complete
- ☐ Migration guide written (if breaking)
- ☐ Documentation updated
- ☐ Atlas updated
- ☐ Traceability matrix updated
- ☐ ADRs updated
- ☐ Backward compatibility verified

## 12.10 Before Documentation Updates

- ☐ Changes align with RES
- ☐ Canonical terminology used
- ☐ No duplicate definitions created
- ☐ Traceability maintained
- ☐ Architecture precedence respected
- ☐ Consistent formatting
- ☐ Acceptance criteria included
- ☐ Cross-references updated

# PART XIII — AI Decision Trees

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ The
following decision trees guide the AI agent through complex architectural
decisions. Each tree represents a deterministic reasoning process. **Decision:
Should I create a new Entity?** If The concept has a unique identity that
persists through state changes → **YES — Create Entity** If The concept is
defined only by its attributes → **NO — Use Value Object instead** If The
concept is part of an aggregate boundary → **YES — Create Entity within
Aggregate** If The concept needs to be tracked independently → **YES — Create
Entity** If The concept is immutable → **NO — Use Value Object**

**Decision: Should I create a new Aggregate?** If The concept is a consistency
boundary → **YES — Create Aggregate** If Multiple entities need transactional
consistency → **YES — Create Aggregate Root** If The concept needs to be
accessed independently → **YES — Create Aggregate** If The concept is a child of
an existing aggregate → **NO — Add to existing Aggregate** If The concept spans
multiple domains → **NO — Decompose into per-domain Aggregates**

**Decision: Should I create a new Domain?** If The concept has a unique
responsibility not owned by any existing domain → **YES — Create Domain** If The
concept overlaps with an existing domain → **NO — Extend existing Domain** If
The concept can be assigned to an existing domain → **NO — Use existing Domain**
If The concept requires its own bounded context → **YES — Create Domain** If The
concept is a cross-cutting concern → **NO — Add to Engineering or Evolution**

**Decision: Should I modify the Architecture?** If The change affects the MAB →
**YES — Requires Class D change + ADR** If The change introduces new entities →
**YES — Requires Class C change + review** If The change adds examples or
refinements → **YES — Class B change, light review** If The change is
grammatical or formatting → **YES — Class A change, no review** If The change
violates an invariant → **NO — Reject the change**

**Decision: Should I create an ADR?** If The decision affects architectural
structure → **YES — Create ADR** If The decision introduces new domain concepts
→ **YES — Create ADR** If The decision changes dependency relationships → **YES
— Create ADR** If The decision modifies semantic contracts → **YES — Create
ADR** If The decision is a routine implementation choice → **NO — No ADR
needed**

**Decision: Should I split a Module?** If The module has grown to contain
multiple responsibilities → **YES — Split by responsibility** If The module
violates single responsibility principle → **YES — Split** If The module is
cohesive and focused → **NO — Keep as single module** If The module spans
multiple bounded contexts → **YES — Split by bounded context** If The module has
more than 10 classes → **CONSIDER — Evaluate cohesion**

**Decision: Should I add a Domain Service?** If The operation does not naturally
belong to a single entity → **YES — Create Domain Service** If The operation
coordinates multiple aggregates → **YES — Create Domain Service** If The
operation is a pure business operation → **YES — Create Domain Service** If The
operation belongs to an entity → **NO — Add to Entity** If The operation is
infrastructure-related → **NO — Create Infrastructure Service**

**Decision: Should I introduce CQRS?** If RIOS mandates CQRS → **YES — Always
apply CQRS** If The feature reads identity data → **YES — Use Query (Read
Model)** If The feature produces evidence → **YES — Use Command (Write Model)**
If The feature needs real-time consistency → **COMMAND — Event Store guarantees
consistency** If The feature needs eventual consistency → **QUERY — Projection
from Event Stream**

**Decision: Should I create a Value Object?** If The concept is immutable and
defined by attributes → **YES — Create Value Object** If The concept needs no
identity → **YES — Create Value Object** If The concept represents a measurement
or amount → **YES — Create Value Object** If The concept has a unique identity →
**NO — Use Entity instead** If The concept changes state over time → **NO — Use
Entity instead**

**Decision: Should I create a Domain Event?** If A state change occurred in an
aggregate → **YES — Create Domain Event** If Something significant happened in
the domain → **YES — Create Domain Event** If Other domains need to react to a
change → **YES — Create Domain Event + Integration Event** If A read operation
was performed → **NO — Queries do not produce events** If An internal
implementation detail changed → **NO — Only domain-significant changes produce
events**

**Decision: Should I create a Repository?** If An aggregate needs persistence →
**YES — Create Repository** If Multiple aggregates share a persistence mechanism
→ **YES — One Repository per Aggregate** If The concept is not an aggregate →
**NO — Only Aggregates have Repositories** If The concept is a value object →
**NO — Value Objects are persisted with their parent Entity** If The concept is
an event → **NO — Events use Event Store**

**Decision: Should I create a Factory?** If Object creation involves complex
logic → **YES — Create Factory** If Object creation requires multiple steps →
**YES — Create Factory** If Object creation enforces invariants → **YES — Create
Factory** If Object creation is trivial → **NO — Use constructor directly** If
Object creation requires external data → **YES — Create Factory with injected
dependencies**

**Decision: Should I create a Policy?** If A business rule spans multiple
entities → **YES — Create Policy** If A business rule depends on external
conditions → **YES — Create Policy** If A business rule determines event routing
→ **YES — Create Policy** If A business rule belongs to a single entity → **NO —
Add to Entity** If A business rule is infrastructure-related → **NO — Create
Infrastructure Rule**

**Decision: Is this a Cross-Domain Operation?** If The operation involves
entities from different domains → **YES — Use published interfaces or events**
If The operation modifies data in multiple domains → **YES — Use Saga or Domain
Events** If The operation reads data from multiple domains → **YES — Use API
Composition or separate queries** If The operation is within a single domain →
**NO — Use direct aggregate interaction** If The operation crosses a bounded
context → **YES — Use Anti-Corruption Layer**

**Decision: Is this Dependency Valid?** If The dependency flows downward in the
canonical graph → **YES — Valid dependency** If The dependency is semantically
necessary → **YES — Valid dependency** If The dependency has architectural
justification → **YES — Valid dependency** If The dependency is stable long-term
→ **YES — Valid dependency** If The dependency creates a cycle → **NO — INVALID,
refactor** If The dependency points upward → **NO — INVALID, use dependency
inversion**

# PART XIV — Prompting Constitution

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 14.1 How Prompts Shall Be Interpreted

**PROMPT-001: **Every prompt SHALL be interpreted in the context of the RIOS
architecture. Generic software engineering interpretations are insufficient.
**PROMPT-002: **When a prompt mentions a domain concept, the AI SHALL verify the
concept's definition in the CTD before proceeding. **PROMPT-003: **When a prompt
requests a feature, the AI SHALL map it to architectural concepts before
implementation. **PROMPT-004: **When a prompt is ambiguous, the AI SHALL resolve
ambiguity by consulting the architecture, not by making assumptions.
**PROMPT-005: **When a prompt conflicts with the architecture, the AI SHALL
report the conflict and recommend the architecturally correct approach.

## 14.2 How Ambiguity Shall Be Resolved

**AMB-001: **When a term could refer to multiple concepts, consult the CTD
first. **AMB-002: **When a domain is not specified, determine the domain from
the context and the Domain Ownership Matrix. **AMB-003: **When a pattern is not
specified, follow the DDD pattern used in existing RIOS code. **AMB-004: **When
a naming convention is unclear, follow the naming rules in Part IV. **AMB-005:
**When the scope is unclear, default to the narrowest scope that satisfies the
request. **AMB-006: **When multiple valid approaches exist, list all approaches
and recommend the one that best preserves architecture.

## 14.3 How Missing Information Shall Be Handled

**MIS-001: **When architectural specifications are missing for a requested
feature, the AI SHALL raise the gap explicitly. **MIS-002: **When ownership is
unclear, the AI SHALL ask the user to clarify before proceeding. **MIS-003:
**When a semantic contract is undefined, the AI SHALL propose one for review.
**MIS-004: **When tests are missing for existing code, the AI SHALL note the
gap. **MIS-005: **When documentation is incomplete, the AI SHALL generate
documentation as part of the task. **MIS-006: **NEVER assume architectural
intent. If the architecture is silent, raise the question.

## 14.4 How Assumptions Shall Be Documented

**ASM-001: **Every assumption SHALL be explicitly listed before implementation.
**ASM-002: **Every assumption SHALL be validated against the architecture.
**ASM-003: **Invalid assumptions SHALL be rejected, not silently corrected.
**ASM-004: **Assumptions SHALL be documented in the implementation report.
**ASM-005: **Assumptions that affect architecture SHALL trigger an ADR proposal.

## 14.5 How Architecture Conflicts Shall Be Reported

**CON-001: **When a request conflicts with the architecture, the AI SHALL report
the conflict explicitly. **CON-002: **The report SHALL identify the specific
architectural law, rule, or contract being violated. **CON-003: **The report
SHALL propose the architecturally correct alternative. **CON-004: **The AI SHALL
NOT implement the conflicting request without explicit user override. **CON-005:
**User overrides SHALL be documented in an ADR.

## 14.6 How Implementation Uncertainty Shall Be Managed

**UNC-001: **When uncertain about the correct implementation approach, the AI
SHALL list alternatives with pros and cons. **UNC-002: **When uncertain about
domain boundaries, the AI SHALL consult the Domain Ownership Matrix. **UNC-003:
**When uncertain about aggregate boundaries, the AI SHALL consult the Domain
Model Specification. **UNC-004: **When uncertain about event design, the AI
SHALL consult existing domain events for patterns. **UNC-005: **When uncertainty
cannot be resolved, the AI SHALL ask the user for guidance before proceeding.

# PART XV — AI Self-Audit Framework

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 15.1 Self-Audit Principle

Before completing ANY task, the AI agent SHALL execute a comprehensive
self-audit. The self-audit verifies that every aspect of the implementation
preserves the architectural integrity of RIOS. No task is complete until the
self-audit passes.

## 15.2 Self-Audit Questions

The AI SHALL ask itself the following questions before presenting any result:
**Category: Architecture Preservation**

- ☐ Did I preserve the Master Architecture Blueprint?
- ☐ Did I preserve all architectural invariants?
- ☐ Did I preserve the canonical dependency graph?
- ☐ Did I follow the CQRS mandate?
- ☐ Did I preserve the append-only event stream?
- ☐ Did I preserve the read-only identity projection? **Category: DDD
  Preservation**
- ☐ Did I preserve aggregate boundaries?
- ☐ Did I preserve entity identity?
- ☐ Did I preserve value object immutability?
- ☐ Did I preserve domain event immutability?
- ☐ Did I preserve repository patterns?
- ☐ Did I use factories for complex creation?
- ☐ Did I keep domain logic in the domain layer? **Category: Ownership
  Preservation**
- ☐ Did I respect domain ownership?
- ☐ Did I use published interfaces for cross-domain interaction?
- ☐ Did I verify every concept's owner?
- ☐ Did I avoid modifying code owned by other domains? **Category: Semantic
  Preservation**
- ☐ Did I use canonical terminology consistently?
- ☐ Did I preserve semantic contracts?
- ☐ Did I avoid defining concepts in multiple locations?
- ☐ Did I ensure evidence precedes claims? **Category: Traceability
  Preservation**
- ☐ Did I maintain traceability to architecture?
- ☐ Did I reference relevant ADRs?
- ☐ Did I update traceability for new concepts?
- ☐ Did I avoid removing traceability links? **Category: Technology
  Independence**
- ☐ Did I avoid embedding implementation details in architecture?
- ☐ Did I keep technology choices in the engineering layer?
- ☐ Did I preserve semantic contracts independent of technology? **Category:
  Coupling Analysis**
- ☐ Did I introduce unwanted coupling?
- ☐ Did I create direct dependencies between unrelated domains?
- ☐ Did I share mutable state between modules?
- ☐ Did I violate the dependency direction? **Category: Duplication Analysis**
- ☐ Did I introduce duplicate concepts?
- ☐ Did I duplicate logic across domains?
- ☐ Did I duplicate definitions across documents? **Category: Dependency
  Analysis**
- ☐ Did I introduce circular dependencies?
- ☐ Did I create reverse dependencies?
- ☐ Did I make stable domains depend on variable domains? **Category: Complexity
  Analysis**
- ☐ Did I simplify unnecessarily (loss of capability)?
- ☐ Did I overengineer (add unnecessary complexity)?
- ☐ Did I add premature optimization?
- ☐ Did I add unnecessary abstractions?

## 15.3 Self-Audit Scoring

## 15.4 Self-Audit Reporting

The AI SHALL include a self-audit summary with every implementation output. The
summary SHALL include: audit questions answered, results (Pass/Warning/Fail),
and any warnings or concerns. This summary becomes part of the implementation
record.

# Glossary

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Appendix A — Architecture Compliance Matrix

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ This
matrix maps every architectural concept to its verification method and governing
authority.

# Appendix B — Review Scorecard Template

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Scoring Guide:

# Appendix C — AI Self-Audit Template

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Task
Description: _______________________________________________ Date:
______________________ AI Agent: ______________________

**Architecture Preservation**

- ☐ Preserved MAB compliance — PASS / WARNING / FAIL
- ☐ Preserved architectural invariants — PASS / WARNING / FAIL
- ☐ Preserved canonical dependency graph — PASS / WARNING / FAIL
- ☐ Preserved CQRS mandate — PASS / WARNING / FAIL
- ☐ Preserved append-only event stream — PASS / WARNING / FAIL
- ☐ Preserved read-only identity projection — PASS / WARNING / FAIL **DDD
  Preservation**
- ☐ Preserved aggregate boundaries — PASS / WARNING / FAIL
- ☐ Preserved entity identity — PASS / WARNING / FAIL
- ☐ Preserved value object immutability — PASS / WARNING / FAIL
- ☐ Preserved domain event immutability — PASS / WARNING / FAIL
- ☐ Preserved repository patterns — PASS / WARNING / FAIL
- ☐ Kept domain logic in domain layer — PASS / WARNING / FAIL **Ownership
  Preservation**
- ☐ Respected domain ownership — PASS / WARNING / FAIL
- ☐ Used published interfaces — PASS / WARNING / FAIL
- ☐ Verified concept owners — PASS / WARNING / FAIL
- ☐ Avoided cross-domain violations — PASS / WARNING / FAIL **Semantic
  Preservation**
- ☐ Used canonical terminology — PASS / WARNING / FAIL
- ☐ Preserved semantic contracts — PASS / WARNING / FAIL
- ☐ No duplicate concept definitions — PASS / WARNING / FAIL
- ☐ Evidence precedes claims — PASS / WARNING / FAIL **Quality Checks**
- ☐ No circular dependencies introduced — PASS / WARNING / FAIL
- ☐ No shared mutable state introduced — PASS / WARNING / FAIL
- ☐ No technology leakage into architecture — PASS / WARNING / FAIL
- ☐ No unnecessary complexity added — PASS / WARNING / FAIL
- ☐ No simplification that loses capability — PASS / WARNING / FAIL
- ☐ Traceability maintained — PASS / WARNING / FAIL

Overall Audit Result: ☐ ALL PASS ☐ WARNING ☐ FAIL ☐ CRITICAL FAIL

Notes: _______________________________________________ Reviewer:
_______________________________________________ Date:

---

**RIOS Claude Code Constitution v1.0** End of Document

*This Constitution is the permanent engineering authority for all AI coding
agents and human engineers working on the Research Identity Operating System.

Architecture owns semantics. Engineering owns realization. Implementation never
defines architecture.

If architecture and implementation conflict, architecture ALWAYS wins.*

| Version | Date       | Author                  | Classification | Description                                          |
| ------- | ---------- | ----------------------- | -------------- | ---------------------------------------------------- |
| 1.0     | 2026-07-17 | RIOS Architecture Board | Normative      | Initial release of the RIOS Claude Code Constitution |

| Rank | Document                               | Classification | Authority                       |
| ---- | -------------------------------------- | -------------- | ------------------------------- |
| 1    | Master Architecture Blueprint (MAB)    | Normative      | Supreme Architectural Authority |
| 2    | Architecture Decision Records (ADR)    | Normative      | Decision Authority              |
| 3    | Domain Dependency Matrix (DDM)         | Normative      | Dependency Authority            |
| 4    | Domain Model Specification (DMS)       | Normative      | Domain Authority                |
| 5    | Canonical Terminology Dictionary (CTD) | Normative      | Semantic Authority              |
| 6    | Domain Ownership Matrix (DOM)          | Normative      | Ownership Authority             |
| 7    | Architecture Governance Standard (AGS) | Normative      | Governance Authority            |
| 8    | Requirement Taxonomy Standard (RTS)    | Normative      | Requirement Authority           |
| 9    | RIOS Editorial Standard (RES)          | Normative      | Documentation Authority         |
| 10   | RIOS Claude Code Constitution          | Normative      | Engineering Authority           |

| Principle          | Means                                    | Does NOT Mean                     |
| ------------------ | ---------------------------------------- | --------------------------------- |
| Research-First     | Implementation serves scientific inquiry | Research determines technology    |
| Architecture-First | Architecture owns all semantic decisions | Architecture dictates code style  |
| Semantic-First     | Meaning precedes mechanism               | Semantics prevent optimization    |
| Knowledge-First    | All work serves knowledge capture        | Only knowledge features are built |
| Identity-First     | Identity is the organizing principle     | Identity overrides all concerns   |
| Tech Independent   | Architecture is portable                 | No technology is ever chosen      |
| Long-Term          | Decades-long evaluation horizon          | No short-term decisions allowed   |
| Clean              | Clear boundaries and structure           | Perfect code is required          |
| Minimal            | Simplest correct solution                | No abstraction is allowed         |
| Explicit           | All behavior is declared                 | Verbosity is required             |

| Category                | Scope                                                 | Severity of Violation |
| ----------------------- | ----------------------------------------------------- | --------------------- |
| Architecture Violations | MAB, ADRs, architectural invariants                   | CRITICAL              |
| DDD Violations          | Bounded contexts, aggregates, entities, value objects | HIGH                  |
| Dependency Violations   | Dependency direction, circular references             | CRITICAL              |
| Naming Violations       | Canonical terminology, naming conventions             | MEDIUM                |
| Ownership Violations    | Domain ownership, responsibility boundaries           | HIGH                  |
| Boundary Violations     | Domain boundaries, layer boundaries                   | HIGH                  |
| Semantic Violations     | Semantic contracts, terminology consistency           | CRITICAL              |
| Technology Leakage      | Implementation details in architecture                | HIGH                  |
| Layer Violations        | Dependency direction between layers                   | HIGH                  |
| Circular Dependencies   | Module or domain cycles                               | CRITICAL              |
| Duplicate Concepts      | Same concept defined in multiple places               | HIGH                  |

| Step | Name                 | Description                        | Requirement |
| ---- | -------------------- | ---------------------------------- | ----------- |
| 1    | Understand Request   | Parse and classify the task        | Mandatory   |
| 2    | Locate Architecture  | Read relevant domain specs         | Mandatory   |
| 3    | Read ADRs            | Check for relevant ADRs            | Mandatory   |
| 4    | Locate Traceability  | Find traceability entries          | Mandatory   |
| 5    | Understand Ownership | Verify domain ownership            | Mandatory   |
| 6    | Determine Domain     | Assign to correct domain           | Mandatory   |
| 7    | Determine Aggregate  | Identify governing aggregate       | Mandatory   |
| 8    | Semantic Contract    | Define or verify contract          | Mandatory   |
| 9    | Determine Interfaces | Define tech-independent interfaces | Mandatory   |
| 10   | Implementation Plan  | Generate step-by-step plan         | Mandatory   |
| 11   | Review Plan          | Self-audit the plan                | Mandatory   |
| 12   | Generate Code        | Write implementation code          | Mandatory   |
| 13   | Review Code          | Self-audit the code                | Mandatory   |
| 14   | Self-Audit           | Run complete self-audit            | Mandatory   |
| 15   | Produce Output       | Present final implementation       | Mandatory   |

| Component   | Description                 | Example                      |
| ----------- | --------------------------- | ---------------------------- |
| Purpose     | Why the interface exists    | Retrieve researcher identity |
| Input       | What the interface requires | Researcher Identifier        |
| Output      | What the interface returns  | ResearchIdentity Projection  |
| Consistency | Consistency guarantee       | Eventually Consistent        |
| Ownership   | Which domain owns it        | Identity Domain              |

| Safety Level | Scope                                 | Approval Required      |
| ------------ | ------------------------------------- | ---------------------- |
| Safe         | Method-level changes within an entity | None (self-audit only) |
| Low Risk     | Class-level changes within a module   | Peer review            |
| Medium Risk  | Module-level changes within a domain  | Domain owner review    |
| High Risk    | Cross-module changes within a domain  | Architecture review    |
| Critical     | Cross-domain changes                  | ADR required           |
| Foundational | Architecture-level changes            | Full governance review |

| Dimension               | Weight | Pass Criteria                  | Score (1-5) |
| ----------------------- | ------ | ------------------------------ | ----------- |
| Architecture Compliance | 25%    | Zero architecture violations   | ____        |
| DDD Compliance          | 20%    | All patterns correctly applied | ____        |
| Semantic Correctness    | 15%    | Canonical terminology used     | ____        |
| Dependency Compliance   | 10%    | No dependency violations       | ____        |
| Code Quality            | 10%    | Clean, readable, maintainable  | ____        |
| Test Coverage           | 10%    | All critical paths tested      | ____        |
| Documentation           | 5%     | Complete and accurate          | ____        |
| Security                | 5%     | No security vulnerabilities    | ____        |

| Class | Type         | Examples                            | Process                  |
| ----- | ------------ | ----------------------------------- | ------------------------ |
| A     | Editorial    | Grammar, formatting, wording        | No architectural review  |
| B     | Minor        | Additional examples, refinement     | Light review             |
| C     | Significant  | New entity types, new relationships | Full architecture review |
| D     | Foundational | MAB changes, principle changes      | ADR + full approval      |

| Result        | Meaning                         | Action                                        |
| ------------- | ------------------------------- | --------------------------------------------- |
| ALL PASS      | No violations detected          | Proceed with task completion                  |
| WARNING       | Potential issue detected        | Document the concern and proceed with caution |
| FAIL          | Violation detected              | Fix the violation before presenting results   |
| CRITICAL FAIL | Architecture violation detected | STOP. Do not present. Fix immediately.        |

| Term                                   | Definition                                                                                                                                       |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| ADR                                    | Architecture Decision Record — A document recording a significant architectural decision with context, alternatives, decision, and consequences. |
| Aggregate                              | A cluster of domain objects treated as a single unit for data changes, guaranteeing semantic consistency through an Aggregate Root.              |
| Aggregate Root                         | The entry point to an Aggregate, responsible for enforcing invariants and providing a consistent interface.                                      |
| Anti-Corruption Layer                  | A translation layer that prevents bounded contexts from directly coupling to each other's internal models.                                       |
| ATLAS                                  | The navigational guide to the RIOS architecture, providing a map of all domains, concepts, and relationships.                                    |
| Bounded Context                        | A clear boundary within which a particular domain model is defined and applicable.                                                               |
| Canonical Terminology Dictionary (CTD) | The authoritative vocabulary of RIOS defining all domain terms.                                                                                  |
| Command                                | In CQRS, a request to change system state. Commands are processed by the Write Model.                                                            |
| CQRS                                   | Command Query Responsibility Segregation — The pattern separating state-changing operations (Commands) from state-reading operations (Queries).  |
| Domain                                 | A bounded area of knowledge and responsibility within RIOS.                                                                                      |
| Domain Event                           | An immutable, timestamped record of a significant state change in the domain.                                                                    |
| Domain Model Specification (DMS)       | The document defining the detailed domain model for each RIOS domain.                                                                            |
| Domain Ownership Matrix (DOM)          | The document defining which domain owns which concepts and responsibilities.                                                                     |
| Domain Dependency Matrix (DDM)         | The document defining the canonical dependency graph between domains.                                                                            |
| Entity                                 | A domain object with a unique identity that persists through state changes.                                                                      |
| Evidence                               | Observable, verifiable information used to support, challenge, or refine scientific claims.                                                      |
| Event Stream                           | The append-only sequence of all domain events, representing the complete history of the system.                                                  |
| Factory                                | A DDD pattern encapsulating complex object creation logic.                                                                                       |
| Identity Projection                    | The synthesized, point-in-time state of a researcher's career, built from the event stream.                                                      |
| Invariant                              | A business rule that must always be true within an aggregate boundary.                                                                           |
| Knowledge                              | Generalized understanding derived from interpreted evidence.                                                                                     |
| Master Architecture Blueprint (MAB)    | The supreme architectural authority document for RIOS.                                                                                           |
| Policy                                 | A DDD pattern encapsulating business rules that span multiple entities or aggregates.                                                            |
| Query                                  | In CQRS, a request to read system state. Queries are processed by the Read Model.                                                                |
| Repository                             | A DDD pattern providing the illusion of an in-memory collection of aggregates.                                                                   |
| Research Identity                      | The persistent, emergent representation of a researcher's intellectual direction derived from evidence.                                          |
| Research Object                        | A versioned, inspectable artifact that communicates or preserves scientific knowledge.                                                           |
| Semantic Contract                      | A technology-independent definition of an interface's purpose, input, output, consistency, and ownership.                                        |
| Traceability Matrix                    | The document linking architectural concepts to requirements, implementations, and ADRs.                                                          |
| Value Object                           | An immutable domain object defined by its attributes rather than identity.                                                                       |

| Concept            | Domain        | Verification Method          | Governing Authority |
| ------------------ | ------------- | ---------------------------- | ------------------- |
| Research Identity  | Identity      | Deterministic Replay         | MAB + Volume I      |
| Research Agenda    | Identity      | Invariant Test               | Volume I            |
| Research Area      | Identity      | Invariant Test               | Volume I            |
| Research Question  | Identity      | Invariant Test               | Volume I            |
| Evidence           | Knowledge     | Immutability Test            | Volume II           |
| Knowledge          | Knowledge     | Evidence Link Verification   | Volume II           |
| Narrative          | Narrative     | Semantic Contract Test       | Volume III          |
| Publication        | Publication   | Entity Identity Test         | Volume IV           |
| Visualization      | Visualization | Cognitive Justification Test | Volume V            |
| Motion             | Motion        | Cognitive Service Test       | Volume VI           |
| Engineering        | Engineering   | Cross-Cutting Compliance     | Volume VII          |
| Evolution          | Evolution     | Version Compliance           | Volume VIII         |
| Domain Events      | All           | Immutability Test            | DDM + DMS           |
| Semantic Contracts | All           | Contract Test                | DMS + CTD           |

| Review Dimension        | Weight | Score (1-5) | Weighted Score | Comments              |
| ----------------------- | ------ | ----------- | -------------- | --------------------- |
| Architecture Compliance | 25%    | ___         | ___            |                       |
| DDD Compliance          | 20%    | ___         | ___            |                       |
| Semantic Correctness    | 15%    | ___         | ___            |                       |
| Dependency Compliance   | 10%    | ___         | ___            |                       |
| Code Quality            | 10%    | ___         | ___            |                       |
| Test Coverage           | 10%    | ___         | ___            |                       |
| Documentation           | 5%     | ___         | ___            |                       |
| Security                | 5%     | ___         | ___            |                       |
| TOTAL                   | 100%   |             | ___            | Pass threshold: ≥ 3.5 |

| Score | Meaning                                                | Action            |
| ----- | ------------------------------------------------------ | ----------------- |
| 5     | Exemplary — Sets a standard for the codebase           | Accept            |
| 4     | Good — Meets all requirements with minor opportunities | Accept            |
| 3     | Acceptable — Meets requirements with some concerns     | Accept with notes |
| 2     | Below Standard — Significant improvements needed       | Revise            |
| 1     | Unacceptable — Critical issues present                 | Reject            |

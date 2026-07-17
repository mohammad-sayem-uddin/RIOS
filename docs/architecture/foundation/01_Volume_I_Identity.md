# Volume I: Identity Architecture (v2.0)

## 1. Purpose

The Identity Domain defines the formal representation of a researcher's academic
portfolio and intellectual trajectory. Its purpose is to aggregate the
historical sequence of scientific outputs, structural positions, and theoretical
directions into a single, queryable projection of academic trust.

## 2. Ontology

The ontology establishes the semantic language for the Identity Domain. Concepts
precede implementation.

- **Research Vision:** A non-verifiable, long-term (10-20 year) aspirational
  goal that grounds the researcher's intellectual pursuit.
- **Research Agenda:** A 3-7 year actionable scientific plan designed to advance
  the Vision.
- **Research Area:** A specific methodological or thematic boundary within an
  Agenda.
- **Research Question:** An atomic, verifiable scientific query that an
  experiment seeks to answer.
- **Identity (The Projection):** The synthesized summary of the researcher,
  inferred entirely from verifiable academic outputs.

## 3. Entities & Concepts (Domain Model)

### 3.1 Aggregate Root: `ResearchIdentity`

The `ResearchIdentity` is the central read model. It represents the emergent
state of a researcher's career. It does not accept commands directly; it evolves
strictly by listening to the stream of verifiable academic events.

### 3.2 Core Concepts

- **`VisionStatement`:** The articulation of the long-term goal.
- **`AgendaFocus`:** The prioritization of a specific scientific plan.
- **`EvidenceClaim`:** A cryptographically or institutionally verifiable
  assertion that anchors a change in the researcher's trajectory.

## 4. Relationships & Cardinality

> **Architecture Decision: Polymathic Agendas** **Decision:** The Identity
> aggregate allows a `1:N` cardinality for Research Agendas. **Reason:**
> World-class researchers frequently operate across multiple disciplines or
> pivot their methodologies. Forcing a researcher into a single, strict
> hierarchical agenda stifles the reality of polymathic inquiry. **Alternatives
> Considered:** A strict `1:1` primary agenda constraint. **Decision:**
> Rejected. It fails to accurately model cross-disciplinary research.
> **Impact:** Allows a researcher to maintain one Primary Agenda and multiple
> concurrent Secondary Agendas, preserving precise academic context.

- **Identity -> Vision:** `1:1` (Every identity has exactly one current Vision).
- **Identity -> Agenda:** `1:N` (A researcher MUST have `1` Primary Agenda, and
  MAY have `N` Secondary Agendas).
- **Agenda -> Area:** `1:N` (An Agenda requires at least one defined Research
  Area).
- **Area -> Question:** `1:N` (Areas decompose into specific, actionable
  questions).

## 5. Rules & Constraints

### 5.1 Evolutionary Constraints

- **IDN-RULE-001 (Immutable Identity Evolution):** Historical identity states
  SHALL NOT be deleted. Changes in research direction are recorded via
  compensating domain events, preserving the complete longitudinal history of
  the researcher.
- **IDN-RULE-002 (Evidence-Driven Advancement):** A Research Agenda or Question
  cannot transition to a "Resolved" or "Proven" state without an explicit,
  attached `EvidenceClaim`.

### 5.2 Structural Constraints

- **IDN-RULE-003 (Sequential Advancement):** A Research Question cannot be
  instantiated without a parent Research Area, ensuring all atomic inquiries map
  back to a broader scientific purpose.

## 6. Semantic Domain Contracts

This section defines the semantic boundaries for how external domains interact
with the Identity Domain. Implementation details (e.g., REST, GraphQL, gRPC) are
explicitly excluded to preserve technology independence.

### 6.1 Identity Query Contract

- **Purpose:** Retrieve the current, emergent state of a researcher's
  intellectual trajectory.
- **Input:** Researcher Identifier.
- **Output:** The `ResearchIdentity` Projection (including Vision, current
  Agendas, and active Areas).
- **Consistency:** Eventually Consistent (derived from the Event Stream).
- **Ownership:** Identity Domain.
- **Dependencies:** Projection Engine.

### 6.2 Trajectory Evolution Contract

- **Purpose:** Record a verifiable change in the researcher's intellectual
  direction.
- **Input:** A strongly typed Domain Event (e.g., `AgendaAdopted`,
  `EvidencePublished`) containing the required semantic context and evidence.
- **Output:** Acknowledgement of event persistence.
- **Consistency:** Strictly Consistent (at the event log level).
- **Ownership:** Identity Domain (Write side).
- **Dependencies:** Immutable Event Store.

## 7. Verification Requirements

Before the Identity Architecture can be considered implemented, the engineering
team must satisfy the following architectural capabilities:

1.  **Immutable Storage:** The underlying storage mechanism must mathematically
    guarantee an append-only event history.
2.  **Deterministic Replay:** The system must be capable of reconstructing the
    `ResearchIdentity` projection from event zero, ensuring that the identity is
    always a pure function of verifiable history.

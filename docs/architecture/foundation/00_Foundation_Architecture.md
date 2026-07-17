# Foundation Architecture (RIOS v2.0)

## 1. Master Architecture Blueprint

### 1.1 Core Mission

The Research Identity Operating System (RIOS) establishes a universal,
verifiable architecture for academic trajectories. It treats a researcher's
identity not as a static narrative, but as an emergent, evolving projection of
verifiable scientific contributions, methodologies, and continuous intellectual
inquiry. RIOS ensures that identity derives strictly from evidence, fostering a
trustable ecosystem of academic knowledge.

### 1.2 Architectural Viewpoints (ISO 42010 Aligned)

RIOS defines three primary architectural viewpoints:

1.  **Event View (The Academic Record):** Models the immutable timeline of
    actions taken by a researcher (e.g., publishing evidence, adopting a
    research agenda).
2.  **Identity View (The Emergent Profile):** Models the synthesized
    representation of a researcher's intellectual evolution.
3.  **Engineering View (The System Capability):** Models the cross-cutting
    system infrastructure required to support rigorous academic verification and
    longevity.

### 1.3 Command Query Responsibility Segregation (CQRS)

> **Architecture Decision: CQRS for Identity Verification** **Decision:** RIOS
> mandates a strict Command Query Responsibility Segregation (CQRS)
> architecture. **Reason:** In academia, a researcher's identity is an emergent
> outcome of their verifiable work. A researcher cannot directly "edit" their
> identity; they can only produce evidence (Commands/Events). The Identity is a
> read-only projection built from that evidence. **Alternatives Considered:**
> Traditional CRUD (Create, Read, Update, Delete) aggregates. **Decision:**
> Rejected. CRUD allows subjective narrative to override verifiable facts,
> destroying trust. **Impact:** Separates the assertion of evidence (Write
> Model) from the synthesis of identity (Read Model), guaranteeing verifiable
> academic history.

---

## 2. Canonical Terminology Dictionary (CTD)

This section contains the sole canonical definitions for RIOS primitives.

- **Aggregate Root:** A cluster of domain objects treated as a single unit for
  data changes, guaranteeing semantic consistency.
- **Domain Event:** An immutable, timestamped historical record of intellectual
  evolution (e.g., `ResearchAreaPivoted`).
- **Evidence:** A verifiable academic artifact (e.g., Publication, Dataset) that
  justifies a state change in the researcher's trajectory.
- **Identity Projection:** The synthesized, point-in-time state of a
  researcher's career, built deterministically from the evidence stream.
- **Primary Agenda:** The current leading intellectual focus of a researcher.
- **Secondary Agenda:** Concurrent, parallel research focuses (cardinality 0:N).

---

## 3. Domain Dependency & Ownership (Revised DDM/DOM)

### 3.1 The Canonical Dependency Graph

RIOS utilizes a directed acyclic graph (DAG) to bound context. A domain may only
depend on domains positioned explicitly below it or orthogonal to it. The flow
of trust moves strictly upward from atomic evidence to identity.

1.  **Identity (Top):** The emergent synthesis.
2.  **Narrative:** The contextual framing of facts.
3.  **Knowledge:** The extracted scientific assertions.
4.  **Publication (Bottom):** The atomic, verifiable artifacts.

### 3.2 Orthogonal Cross-Cutting Concerns

`Engineering` and `Evolution` are removed from the strict layered hierarchy.
They are architectural capabilities accessible by all domains, ensuring system
longevity without polluting the intellectual models.

- **Engineering Ownership:** Interface primitives, accessibility standards,
  operational telemetry.
- **Evolution Ownership:** Immutable archiving, data migrations, semantic
  versioning.

---

## 4. Universal Architectural Constraints

- **ARCH-001 (Single Source of Truth):** No intellectual concept shall be
  defined in more than one Domain.
- **ARCH-002 (Immutable History):** The academic event stream is append-only.
  History shall never be updated or deleted, preserving absolute traceability.
- **ARCH-003 (Event-Driven State):** No Aggregate Root may change state without
  a verifiable Domain Event.
- **ARCH-004 (Explicit Cardinality):** All relationships must explicitly declare
  structural cardinality (1:1, 1:N, M:N) to ensure precise semantic bounds.

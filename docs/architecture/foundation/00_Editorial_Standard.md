# Editorial Standards (RIOS v2.0)

## 1. Purpose

The RIOS Editorial Standard establishes the mandatory voice, structure, and
abstraction level for all architectural documentation. Its primary goal is to
ensure the specification reads as a timeless, research-first architecture
standard (comparable to ISO or IEEE) while maintaining absolute conceptual
precision for downstream implementation.

## 2. Voice & Tone

- **Declarative Precision:** Sentences must state facts, rules, or semantic
  boundaries. Eliminate inspirational narrative that lacks architectural weight.
- **Abstraction Discipline:** The architecture must remain exactly one level
  above implementation. Explicit transport protocols (REST, JSON, gRPC) must not
  pollute the domain definitions.
- **Deduplication:** A concept, constraint, or entity is defined exactly once.
  All other locations must cross-reference the canonical definition.

## 3. Normative Language (RFC 2119 Revised)

RIOS adopts a strict interpretation of RFC 2119. Normative terms must ONLY be
used for machine-verifiable engineering or protocol constraints.

- **SHALL / MUST:** An absolute, testable requirement of the specification
  (e.g., "History SHALL NOT be mutated").
- **SHALL NOT / MUST NOT:** An absolute prohibition.
- **MAY:** An optional implementation path.

> [!WARNING] Normative language (`SHALL`) is explicitly prohibited for
> philosophical maxims or human behaviors. (e.g., "Architecture SHALL evolve
> intentionally" is banned. Use "Architecture evolves intentionally").

## 4. Document Structure (The MAB Standard)

All RIOS Domain Volumes (e.g., Volume I, Volume II) must adhere to the following
sequence to guarantee uniformity across the ecosystem:

1.  **Purpose:** One paragraph defining the domain's intellectual bounded
    context.
2.  **Ontology:** High-level conceptual definitions mapping to academic
    realities.
3.  **Entities & Concepts (Domain Model):** Concrete domain primitives and
    aggregate roots.
4.  **Relationships:** Explicit structural cardinality (1:1, 1:N).
5.  **Rules & Constraints:** Immutable invariants governing scientific
    integrity.
6.  **Semantic Domain Contracts:** Technology-independent boundaries defining
    Purpose, Input, Output, Consistency, and Ownership.
7.  **Verification Requirements:** How the engineering team proves the
    architecture was conceptually fulfilled.

## 5. Architectural Decision Summaries (ADS)

Whenever a significant architectural choice is made that shapes the intellectual
model (e.g., adopting CQRS, allowing Polymathic Agendas), the document MUST
include an Architecture Decision Summary.

- **Format:** Decision, Reason, Alternatives Considered, Decision, Impact.
- **Length:** Strictly under 150 words.

## 6. Visual Standards

- **Data Models:** Must use Interface Definition Specifications or Semantic
  Contracts. Explicit transport schemas (e.g., JSON schemas) are prohibited at
  this level of architecture.
- **Diagrams:** Architecture must rely on strict graph models (DAGs). Circular
  dependencies in intellectual flow result in immediate architectural failure.

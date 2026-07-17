**MASTER ARCHITECTURE BLUEPRINT (MAB)** **Volume 0** **Before RIOS v1.0**
**Version:** 1.0 **Status:** Authoritative Blueprint **Classification:**
Normative **Purpose:** Meta-Architecture Specification

**1. Purpose** The Master Architecture Blueprint (MAB) defines the architectural
structure governing every document, subsystem, requirement, component, and
implementation within the Research Identity Operating System (RIOS). MAB is
**not** a software requirements specification. It is the architectural
specification **of the specification**. Its purpose is to ensure that RIOS
remains internally consistent, extensible, traceable, and maintainable over
decades. No subsequent document may contradict the structures established by
MAB.

**2. Philosophy** RIOS is engineered according to one principle: **Architecture
precedes implementation.** Therefore: Research ↓ Architecture ↓ Domain Model ↓
Requirements ↓ Implementation ↓ Verification Any implementation developed
without architectural alignment SHALL be considered non-conforming.

**3. Architectural Layers** RIOS consists of seven architectural layers. Each
layer depends only on layers above it. Layer 1

Vision

↓

Layer 2

Principles

↓

Layer 3

Domains

↓

Layer 4

Models

↓

Layer 5

Requirements

↓

Layer 6

Implementation

↓

Layer 7

Verification This dependency direction SHALL NOT be violated.

**4. System Architecture** RIOS consists of eight primary domains. Research
Identity Operating System

│

├── Identity Domain

├── Knowledge Domain

├── Publication Domain

├── Narrative Domain

├── Visualization Domain

├── Motion Domain

├── Engineering Domain

└── Evolution Domain No additional primary domains may be introduced without
architectural review.

**5. Domain Ownership** Every architectural concern belongs to exactly one
domain. This prevents duplicated responsibility.

**6. Domain Dependencies** Dependencies SHALL follow this order. Identity

↓

Knowledge

↓

Narrative

↓

Publication

↓

Visualization

↓

Motion

↓

Engineering

↓

Deployment Later domains may reference earlier domains. Earlier domains SHALL
NOT depend upon later domains.

**7. Domain Hierarchy** Every domain consists of exactly six architectural
levels. Purpose

↓

Ontology

↓

Entities

↓

Relationships

↓

Rules

↓

Interfaces Requirements appear **after** Interfaces. This is the most important
architectural rule in RIOS.

**8. Architectural Views** RIOS SHALL be described through multiple architecture
views. Each view answers a different engineering question. No single view shall
attempt to describe the entire architecture.

**9. Entity Taxonomy** RIOS recognizes four classes of entities. **Conceptual
Entities** Examples: Research Question Knowledge Hypothesis

**Structural Entities** Examples: Research Area Research Agenda Research Theme

**Artifact Entities** Examples: Publication Dataset Software Technical Report

**Presentation Entities** Examples: Research Dossier Homepage Knowledge Graph
Visualization This separation prevents architecture from becoming page-centric.

**10. Architectural Rule** This is the most important rule of the entire system.
Knowledge

↓

Artifacts

↓

Presentation

↓

Interface NOT Homepage

↓

Projects

↓

Publications Everything in RIOS flows downward from knowledge. Never upward from
UI.

**11. Architectural Invariants** The following SHALL remain true regardless of
future versions. **Invariant I** Knowledge precedes documents.

**Invariant II** Research Questions precede Projects.

**Invariant III** Evidence precedes Conclusions.

**Invariant IV** Reasoning precedes Implementation.

**Invariant V** Identity emerges from Knowledge.

**Invariant VI** Architecture remains technology independent.

**Invariant VII** Interfaces communicate. They do not define.

**12. Traceability Model** Every architectural element SHALL possess
traceability. Example Homepage

↓

Identity

↓

Knowledge

↓

Research Question

↓

Evidence

↓

Publication Nothing may exist without traceability.

**13. Requirement Hierarchy** Requirements SHALL be introduced only after the
Domain Model has been fully defined. Domain

↓

Ontology

↓

Entities

↓

Relationships

↓

Invariants

↓

Interfaces

↓

Requirements

↓

Components

↓

Pages Notice: **Pages are almost last.** This is intentional.

**14. Documentation Hierarchy** The documentation SHALL be written in the
following order. Volume 0

Master Architecture Blueprint

↓

Volume I

Identity

↓

Volume II

Knowledge

↓

Volume III

Narrative

↓

Volume IV

Publication

↓

Volume V

Visualization

↓

Volume VI

Motion

↓

Volume VII

Engineering

↓

Volume VIII

Implementation Every later volume depends on earlier volumes.

**15. Conformance Rule** Every future document SHALL satisfy three questions.
**Question 1** Does this strengthen Research Identity?

**Question 2** Does this improve scientific communication?

**Question 3** Does this preserve long-term architectural integrity? If any
answer is **No**, the proposal SHALL be rejected.

**Architect's Note (Informative)** This document is intentionally short. Its
purpose is not to explain RIOS. Its purpose is to **govern** RIOS. It is the
constitution of the architecture itself. Every future specification, subsystem,
component, page, and implementation inherits from the rules defined here.

| Domain        | Responsibility           |
| ------------- | ------------------------ |
| Identity      | Researcher               |
| Knowledge     | Scientific Knowledge     |
| Publication   | Research Objects         |
| Narrative     | Storytelling             |
| Visualization | Scientific Communication |
| Motion        | Cognitive Communication  |
| Engineering   | Software Quality         |
| Evolution     | Long-Term Growth         |

| View               | Question                       |
| ------------------ | ------------------------------ |
| Vision View        | Why does RIOS exist?           |
| Identity View      | Who is represented?            |
| Knowledge View     | What knowledge exists?         |
| Publication View   | How is knowledge published?    |
| Narrative View     | How is knowledge communicated? |
| Visualization View | How is knowledge understood?   |
| Motion View        | How is cognition supported?    |
| Engineering View   | How is quality maintained?     |
| Evolution View     | How does the system grow?      |

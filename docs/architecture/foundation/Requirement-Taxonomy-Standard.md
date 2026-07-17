**Requirement Taxonomy Standard (RTS)** **Version:** 1.0 **Status:** Normative
**Parent:** Master Architecture Blueprint (MAB) **Classification:** Architecture
Specification Standard

**1. Purpose** The Requirement Taxonomy Standard (RTS) establishes the canonical
classification system for all requirements defined within the Research Identity
Operating System (RIOS). Its purpose is to ensure that every requirement
possesses: a unique identity; a clear architectural scope; a defined level of
abstraction; measurable verification criteria; traceability across the entire
architecture. Every future requirement SHALL conform to the taxonomy defined
herein.

**2. Philosophy** Requirements are not merely implementation tasks. They are
architectural commitments. A well-defined taxonomy transforms a large
specification from a collection of paragraphs into an organized engineering
system. Accordingly, every requirement SHALL belong to exactly one architectural
family and one architectural level.

**3. Requirement Hierarchy** Requirements SHALL be organized into five
hierarchical levels. Vision ↓ Architecture ↓ Domain ↓ Component ↓ Implementation
Higher-level requirements constrain lower-level requirements. Lower-level
requirements SHALL NOT redefine higher-level intent.

**4. Requirement Families** RIOS recognizes the following requirement families.
Each family SHALL maintain independent numbering.

**5. Requirement Identifier Format** Every requirement SHALL follow the
canonical identifier structure. <Family>-<Level>-<Number> Examples: ARC-CORE-001
IDN-DOM-004 KNO-CMP-012 PUB-IMP-008 ENG-QA-003 Identifiers SHALL remain
immutable after publication. Deprecated requirements SHALL NOT be renumbered.

**6. Requirement Levels** Every requirement SHALL declare one architectural
level. This separation prevents implementation details from leaking into
architectural specifications.

**7. Requirement Template** Every requirement SHALL use the following structure.

**Identifier** Unique canonical identifier.

**Title** Concise architectural name.

**Purpose** Why the requirement exists.

**Statement** The normative requirement. Normative language SHALL use: SHALL
SHALL NOT SHOULD MAY

**Rationale** Explains the reasoning behind the requirement. Rationale is
informative. It does not change conformance.

**Dependencies** Lists architectural dependencies.

**Verification** Explains how compliance is evaluated.

**Acceptance Criteria** Defines measurable success conditions.

**Traceability** Identifies related domains, documents, and ADRs.

**8. Requirement States** Each requirement SHALL declare one lifecycle state.
Historical requirements SHALL remain documented even after retirement.

**9. Requirement Priority** Priority SHALL reflect architectural significance.
Priority SHALL NOT be confused with implementation order.

**10. Requirement Quality Criteria** Every requirement SHALL satisfy the
following attributes. Unambiguous Testable Traceable Technology-independent
(unless implementation-specific) Necessary Non-duplicative Internally consistent
Failure to satisfy any attribute SHALL require revision before approval.

**11. Traceability Rules** Every requirement SHALL reference: its parent
document; its architectural family; dependent requirements; affected domains;
related ADRs. No requirement SHALL exist in isolation.

**12. Verification Categories** Verification SHALL occur using one or more of
the following methods. Architectural Review Documentation Inspection Design
Review Static Analysis Implementation Testing User Validation Expert Evaluation
The selected method SHALL match the abstraction level of the requirement.

**13. Change Policy** Once approved: identifiers SHALL remain permanent;
semantics SHALL remain stable; editorial corrections MAY occur without changing
identifiers; architectural modifications SHALL require an ADR.

**14. Acceptance Criteria** The Requirement Taxonomy Standard SHALL be
considered conformant when: every requirement belongs to exactly one family;
every requirement has a unique identifier; every requirement declares its level;
every requirement is verifiable; traceability is complete.

**15. Future Evolution** Additional requirement families MAY be introduced if
new architectural domains are created. Existing identifiers SHALL remain
backward compatible.

**Architect's Commentary (Informative)** The RTS is the indexing system of RIOS.
Its purpose is not to define architecture. Its purpose is to ensure that
architecture remains understandable after thousands of requirements have been
written. A well-designed taxonomy reduces ambiguity, improves maintainability,
and enables automated validation in future tooling.

| Prefix | Family        | Purpose                              |
| ------ | ------------- | ------------------------------------ |
| ARC    | Architecture  | System-wide architectural rules      |
| IDN    | Identity      | Research identity requirements       |
| KNO    | Knowledge     | Knowledge architecture               |
| NAR    | Narrative     | Storytelling and communication       |
| PUB    | Publication   | Publications and research outputs    |
| VIS    | Visualization | Scientific visualization             |
| MOT    | Motion        | Motion psychology and interaction    |
| CMP    | Components    | Reusable interface components        |
| ENG    | Engineering   | Performance, security, accessibility |
| EVO    | Evolution     | Versioning and long-term growth      |
| GOV    | Governance    | Architecture governance              |
| QA     | Quality       | Validation and quality gates         |

| Level | Purpose                          |
| ----- | -------------------------------- |
| CORE  | Foundational architectural rules |
| DOM   | Domain behavior                  |
| CMP   | Component behavior               |
| IMP   | Implementation guidance          |
| QA    | Verification and testing         |

| State       | Meaning                      |
| ----------- | ---------------------------- |
| Proposed    | Under discussion             |
| Approved    | Normative                    |
| Implemented | Realized in software         |
| Deprecated  | No longer recommended        |
| Retired     | Removed from future versions |

| Priority | Description                                 |
| -------- | ------------------------------------------- |
| Critical | System cannot function correctly without it |
| High     | Strong impact on architecture               |
| Medium   | Important but replaceable                   |
| Low      | Optional enhancement                        |

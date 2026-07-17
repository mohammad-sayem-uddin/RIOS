**Canonical Terminology Dictionary (CTD)** Version 1.0 Status Normative Parent
Document Master Architecture Blueprint

**Purpose** The Canonical Terminology Dictionary defines the official vocabulary
of the Research Identity Operating System (RIOS). Every subsequent
specification, implementation, interface, component, and future extension SHALL
use these definitions consistently. Alternative interpretations SHALL be
considered non-conforming unless explicitly documented. The purpose of this
document is semantic consistency rather than linguistic completeness.

**Structure** Every term follows the same template. Term

Definition

Purpose

Relationships

Examples

Non-Examples

Usage Rules

Notes Every definition must be implementation-independent.

**TERM-001** **Research Identity** **Definition** The persistent representation
of a researcher's intellectual direction, scientific reasoning, methodological
discipline, engineering practice, and contribution to knowledge. Research
Identity is an emergent property. It is inferred from evidence rather than
declared through self-description.

**Purpose** Research Identity serves as the primary organizing concept of RIOS.
Every subsystem ultimately exists to strengthen or communicate Research
Identity.

**Relationships** Contains Research Agenda Research Areas Research Philosophy
Research Evolution Supported By Knowledge Evidence Publications Deployments

**Examples** ✓ Research trajectory across multiple years ✓ Evolution from
undergraduate projects to doctoral research ✓ Consistent scientific direction

**Non-Examples** ✗ Biography ✗ Resume ✗ Personal branding ✗ Skills list ✗ Social
profile

**Usage Rules** The term "Research Identity" SHALL always refer to the entire
intellectual system. It SHALL NEVER refer to an individual page.

**TERM-002** **Research Agenda** **Definition** The long-term scientific mission
guiding all research activities. The Research Agenda defines what problems the
researcher intends to solve over many years. Unlike projects, the agenda remains
relatively stable.

**Purpose** Provides intellectual continuity. Supports long-term evaluation.
Communicates research taste.

**Relationships** Parent Of Research Areas Child Of Research Identity Supported
By Research Questions

**Examples** Trustworthy Computer Vision Intelligent Infrastructure
Human-Centered Robotics

**Non-Examples** ✗ Thesis title ✗ Semester project ✗ Publication

**Usage Rules** A researcher SHOULD maintain one primary Research Agenda.
Multiple secondary agendas MAY exist.

**TERM-003** **Research Area** **Definition** A persistent scientific domain
contributing to the Research Agenda. Research Areas group related
investigations. They do not represent individual implementations.

**Purpose** Organizes scientific work. Supports knowledge retrieval. Provides
navigation.

**Relationships** Child Of Research Agenda Parent Of Research Questions

**Examples** Computer Vision Robotics Edge AI Machine Learning Systems

**Non-Examples** YOLO OpenCV FastAPI Next.js Python Technologies are not
Research Areas.

**Usage Rules** Research Areas SHALL remain stable despite changing
technologies.

**TERM-004** **Research Question** **Definition** A clearly articulated
scientific uncertainty that motivates investigation. Research Questions are the
smallest stable unit of scientific inquiry. Projects are temporary. Research
Questions persist until sufficiently answered or superseded.

**Purpose** Organize investigations. Guide experimentation. Define scientific
direction.

**Relationships** Belongs To Research Area Generates Hypotheses Produces
Knowledge

**Examples** "How can multi-camera synchronization improve helmet detection
accuracy under occlusion?"

**Non-Examples** "Build a dashboard." "Train YOLO." These are implementation
tasks. Not Research Questions.

**Usage Rules** Every major Research Object SHALL reference one or more Research
Questions.

**TERM-005** **Research Object** **Definition** A versioned, inspectable
artifact that communicates or preserves scientific knowledge. Research Objects
are the primary units of scholarly communication. They exist to make knowledge
reproducible, reviewable, and reusable.

**Purpose** Encapsulates scientific contributions. Supports citation. Supports
reproducibility.

**Relationships** Represents Knowledge Contains Artifacts Supports Research
Identity

**Examples** Journal paper Conference paper Preprint Dataset Trained model
Technical report Open-source repository Supplementary material

**Non-Examples** Homepage Biography Navigation These are presentation entities.

**Usage Rules** Every Research Object SHALL have: metadata; provenance; version
history; relationships; evidence links.

**TERM-006** **Evidence** **Definition** Observable information used to support,
challenge, refine, or reject scientific claims. Evidence is not synonymous with
conclusions. It precedes knowledge.

**Purpose** Provides scientific justification. Enables reproducibility. Supports
intellectual honesty.

**Relationships** Generated By Experiments Supports Knowledge Referenced By
Research Objects

**Examples** Benchmark results Experimental observations Deployment logs User
studies Validation metrics

**Non-Examples** Opinions Marketing claims Personal beliefs

**Usage Rules** Every Knowledge entity SHALL reference supporting Evidence.
Evidence SHALL remain accessible wherever practical.

**TERM-007** **Knowledge** **Definition** Generalized understanding derived from
interpreted evidence. Knowledge is the highest-level intellectual output
represented within RIOS. Unlike evidence, knowledge explains rather than merely
observes.

**Purpose** Captures enduring scientific understanding. Forms the basis for
future investigations. Supports Research Identity.

**Relationships** Derived From Evidence Communicated Through Research Objects
Generates Future Directions

**Examples** "A hybrid vision pipeline improves robustness under partial
occlusion."

**Non-Examples** Accuracy values. Confusion matrices. Raw datasets. These are
evidence. Not knowledge.

**Usage Rules** Knowledge SHALL communicate: confidence; limitations; scope;
applicability.

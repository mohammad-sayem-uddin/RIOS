**Volume 0 — RIOS System Overview & Architecture Guide** This would become the
**front door** of RIOS. Think of it like: Kubernetes Architecture Overview React
Documentation Introduction Linux Kernel Documentation ISO Overview Documents It
explains **how to read the architecture**, not the architecture itself.

**Recommended Structure** **Document Metadata** Document ID: VOL-0

Title: RIOS System Overview & Architecture Guide

Version: 2.0

Classification: Normative

Status: Approved

**Chapter 1** **Introduction** Explain: Why RIOS exists. Why traditional
research websites are insufficient. What problem RIOS solves. Why Research
Identity deserves its own architecture. One page. Nothing more.

**Chapter 2** **Vision** One sentence. RIOS is a domain-driven architecture that
models a researcher's intellectual identity, scientific knowledge, scholarly
communication, visualization, and implementation as one integrated system. Then
explain: Mission Vision Long-term goals

**Chapter 3** **Core Philosophy** This should contain the principles that never
change. For example: Research before software. Knowledge before publication.
Meaning before implementation. Evidence before claims. Communication without
distortion. Technology serves architecture. Architecture serves research. This
becomes the philosophical constitution of RIOS.

**Chapter 4** **Architecture Overview** One diagram. Identity

↓

Knowledge

↓

Knowledge Communication

↓

Scholarly Communication

↓

Scientific Visualization

↓

Cognitive Motion

↓

Platform Engineering

↓

Implementation Then explain every domain in one paragraph. No more.

**Chapter 5** **Domain Responsibility Matrix** This is probably the most useful
table in the whole specification.

**Chapter 6** **Dependency Map** Explain Who consumes whom. Identity

↓

Knowledge

↓

Communication

↓

Publication

↓

Visualization

↓

Motion

↓

Engineering

↓

Implementation Explain why the dependencies only flow downward.

**Chapter 7** **Reading Guide** Different readers should read different volumes.
Researcher Read: 0 1 2 3 4

Software Engineer Read: 0 7 8

Designer Read: 0 3 5 6

Professor Read: 0 1 2 3 4

Claude Code Read: ALL Especially 7 8

**Chapter 8** **Terminology Quick Reference** One page. Research Identity
Knowledge Asset Scientific Claim Research Agenda Evidence Narrative Publication
Visualization Motion Semantic Contract Platform Service One sentence each.

**Chapter 9** **Architecture Decisions** Explain Why DDD. Why CQRS. Why Event
Sourcing. Why Semantic Contracts. Why Knowledge before Publications. Why Motion
as Cognition. Very short. One paragraph each.

**Chapter 10** **Future Evolution** Explain how future versions should evolve.
Version 2 ↓ Version 3 ↓ Version 4 Without breaking Identity Knowledge
Communication This tells future contributors how to extend the architecture
safely.

| Volume         | Owns                 | Does Not Own       |
| -------------- | -------------------- | ------------------ |
| Identity       | Researcher           | Publications       |
| Knowledge      | Scientific Knowledge | Identity           |
| Communication  | Understanding        | Knowledge          |
| Publication    | Scholarly Outputs    | Knowledge          |
| Visualization  | Visual Meaning       | Scientific Meaning |
| Motion         | Cognitive Guidance   | Visual Design      |
| Engineering    | Platform             | Research           |
| Implementation | Software             | Architecture       |

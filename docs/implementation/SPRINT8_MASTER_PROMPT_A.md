# RIOS Sprint 8 — Publications & Research Projects Domain

Role: Principal Software Architect, Domain-Driven Design Expert, Enterprise
Backend Engineer.

Project: Research Identity Operating System (RIOS)

Current Status: Sprint 7.5 is complete.

The repository already contains:

• Clean Architecture • Domain-Driven Design • CQRS • SOLID • Repository Pattern
• Prisma Persistence • PostgreSQL • JWT Authentication • ResearchProfile
Aggregate • Enterprise Testing Infrastructure

Your task is to implement Sprint 8.

IMPORTANT

This sprint introduces the Publications bounded context.

DO NOT redesign existing architecture.

DO NOT break package boundaries.

DO NOT modify completed Identity or ResearchProfile domains unless absolutely
necessary.

Maintain strict dependency direction.

Presentation ↓

Application ↓

Domain ↑

Infrastructure

---

SPRINT OBJECTIVE
------------------------------------------

Implement the complete Publications & Research Projects bounded context.

The design must support:

• Journal Articles • Conference Papers • Books • Book Chapters • Theses •
Technical Reports • Preprints • Under Review manuscripts • Accepted papers •
Published papers

The implementation must also support Research Projects.

The design should be extensible for future:

• Citation Graph • Google Scholar Sync • ORCID Sync • Crossref Integration •
Semantic Scholar Integration • OpenAlex • DOI resolution

without redesign.

---

PHASE 1 Domain Design
------------------------------------------

Design rich domain models.

Aggregate Roots:

Publication

ResearchProject

Entities:

Author

Venue

Publisher

Funding

ProjectMember

AffiliationSnapshot

Value Objects:

PublicationId

ProjectId

DOI

ISBN

ISSN

ORCID

PublicationTitle

Abstract

Keywords

PublicationYear

CitationCount

FundingIdentifier

ProjectRole

PublicationStatus

PublicationType

ResearchField

ResearchArea

Language

URL

Domain Events:

PublicationCreated

PublicationUpdated

PublicationPublished

PublicationSubmitted

ProjectCreated

ProjectCompleted

ProjectMemberAdded

ProjectMemberRemoved

---

PHASE 2 Business Rules
------------------------------------------

Examples:

A DOI must be unique.

A publication cannot be both Published and Under Review.

Accepted date must occur before Published date.

A publication without title is invalid.

Research projects require a Principal Investigator.

Duplicate authors cannot exist.

Duplicate ORCID identifiers are forbidden.

Publication type determines required metadata.

Books require ISBN.

Journal Articles require Journal.

Conference Papers require Conference.

---

PHASE 3 Repository Contracts
------------------------------------------

Create repository interfaces for:

PublicationRepository

ResearchProjectRepository

VenueRepository

Support:

save()

findById()

findByDOI()

findByAuthor()

findByResearchProfile()

search()

delete()

---

PHASE 4 Application Layer
------------------------------------------

Implement CQRS.

Commands:

CreatePublication

UpdatePublication

PublishPublication

SubmitPublication

DeletePublication

CreateResearchProject

UpdateResearchProject

CompleteResearchProject

Queries:

GetPublication

SearchPublications

GetResearchProjects

GetPublicationStatistics

Return immutable DTOs.

---

PHASE 5 Infrastructure
------------------------------------------

Extend Prisma.

Create normalized relational schema.

Include proper:

UUID PKs

Foreign Keys

Indexes

Unique Constraints

Cascade Rules

Repository implementations.

Persistence mappers.

Unit of Work integration.

---

PHASE 6 Presentation
------------------------------------------

Implement REST APIs.

Examples:

POST /publications

GET /publications

GET /publications/:id

PATCH /publications/:id

DELETE /publications/:id

POST /research-projects

GET /research-projects

PATCH /research-projects/:id

DELETE /research-projects/:id

Validate all requests.

Return consistent API responses.

---

PHASE 7 Testing
------------------------------------------

Create comprehensive tests.

Domain

Application

Infrastructure

Presentation

Cover:

Aggregate invariants

Repository persistence

Mapper correctness

CQRS handlers

HTTP endpoints

---

QUALITY REQUIREMENTS
------------------------------------------

Maintain:

• Clean Architecture • DDD • SOLID • CQRS

No framework leakage into Domain.

No Prisma imports in Domain.

No Express imports outside Presentation.

No infrastructure dependencies inside Application.

Strict TypeScript.

Zero any.

No eslint-disable.

No circular dependencies.

---

QUALITY GATES
------------------------------------------

Before completion execute:

pnpm prisma generate

pnpm lint

pnpm typecheck

pnpm test

pnpm build

Verify Husky:

git add .

git commit -m "Sprint 8: Publications & Research Projects"

must succeed.

---

FINAL REPORT
------------------------------------------

Provide:

1. Executive Summary

2. Domain Model Overview

3. Aggregate Roots

4. Entities

5. Value Objects

6. Domain Events

7. Business Rules Implemented

8. Prisma Schema Changes

9. Repository Implementations

10. CQRS Commands

11. CQRS Queries

12. REST Endpoints

13. Tests Added

14. Build Results

15. Lint Results

16. Typecheck Results

17. Husky Verification

18. Remaining Technical Debt

19. Sprint 9 Preparation

FINAL CERTIFICATION

End with exactly one of:

❌ Sprint 8 Incomplete

or

✅ Sprint 8 Complete

Only certify completion if all quality gates pass and the Git commit succeeds.

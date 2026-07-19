# RIOS Sprint 10 — Academic Recognition, Funding & Professional Activities

Role: Principal Software Architect, Domain-Driven Design Expert, Enterprise
Backend Engineer.

Project: Research Identity Operating System (RIOS)

Current Status: Sprint 9 (Research Assets & Scholarly Resources) has been
completed.

The repository already contains:

• Clean Architecture • Domain-Driven Design • CQRS • SOLID • Repository Pattern
• PostgreSQL • Prisma • JWT Authentication • ResearchProfile Aggregate •
Publications • Research Projects • Research Assets • Enterprise Testing
Infrastructure

Your task is to implement Sprint 10.

IMPORTANT

This sprint introduces the Academic Recognition bounded context.

Do NOT redesign previous bounded contexts.

Maintain strict dependency direction.

Presentation ↓

Application ↓

Domain ↑

Infrastructure

---

SPRINT OBJECTIVE
--------------------------------------------------

Implement the complete Academic Recognition ecosystem.

The system must support:

• Awards • Honors • Scholarships • Fellowships • Grants • Funding • Patents •
Certifications • Professional Memberships • Editorial Board Membership •
Reviewer Activities • Conference Participation • Workshops • Seminars • Invited
Talks • Keynote Talks • Professional Service

Design everything for future interoperability with:

• ORCID • Crossref • OpenAlex • Google Scholar • Scopus • Web of Science • IEEE
• ACM

without redesign.

---

PHASE 1 Domain Design
--------------------------------------------------

Aggregate Roots

Award

Grant

Patent

ProfessionalActivity

Entities

FundingAgency

Sponsor

PatentInventor

PatentOrganization

ConferenceParticipation

WorkshopParticipation

EditorialMembership

ReviewerAssignment

ProfessionalMembership

Certification

Keynote

Seminar

InvitedTalk

Value Objects

AwardId

GrantId

PatentId

ActivityId

AwardTitle

GrantNumber

PatentNumber

PatentStatus

PatentType

FundingAmount

Currency

OrganizationName

ConferenceName

AwardCategory

ProfessionalRole

ActivityDate

ResearchField

ResearchArea

Country

Domain Events

AwardReceived

GrantAwarded

GrantCompleted

PatentFiled

PatentGranted

ProfessionalMembershipAdded

EditorialRoleAccepted

ReviewerAssignmentAccepted

ConferenceParticipationAdded

---

PHASE 2 Business Rules
--------------------------------------------------

Examples

Grant numbers must be unique.

Patent numbers must be unique.

Funding amount cannot be negative.

Award date cannot precede researcher creation.

Grant end date must occur after start date.

Patent status transitions must be valid.

Duplicate professional memberships are forbidden.

A keynote requires a conference.

Editorial memberships require an organization.

---

PHASE 3 Repository Contracts
--------------------------------------------------

Implement

AwardRepository

GrantRepository

PatentRepository

ProfessionalActivityRepository

Support

save()

findById()

findByResearchProfile()

search()

delete()

---

PHASE 4 Application Layer
--------------------------------------------------

Implement CQRS.

Commands

CreateAward

UpdateAward

CreateGrant

CompleteGrant

CreatePatent

UpdatePatent

CreateProfessionalActivity

DeleteProfessionalActivity

Queries

GetAward

SearchAwards

GetGrant

SearchGrants

GetPatent

SearchProfessionalActivities

Return immutable DTOs.

---

PHASE 5 Infrastructure
--------------------------------------------------

Extend Prisma.

Implement:

Normalized schema

UUID PKs

Foreign Keys

Indexes

Unique Constraints

Cascade Rules

Persistence Mappers

Repository Implementations

Unit of Work Integration

---

PHASE 6 Presentation
--------------------------------------------------

Create REST APIs.

Examples

POST /awards

GET /awards

POST /grants

GET /grants

POST /patents

GET /patents

POST /professional-activities

GET /professional-activities

PATCH endpoints

DELETE endpoints

Use consistent validation.

---

PHASE 7 Testing
--------------------------------------------------

Create comprehensive tests.

Domain

Application

Infrastructure

Presentation

Repository persistence

Aggregate invariants

CQRS

REST endpoints

Mapper correctness

---

QUALITY REQUIREMENTS
--------------------------------------------------

Maintain:

• Clean Architecture • DDD • SOLID • CQRS

No framework leakage.

No Prisma inside Domain.

Strict TypeScript.

Zero any.

No eslint-disable.

No circular dependencies.

---

QUALITY GATES
--------------------------------------------------

Before completion execute:

pnpm prisma generate

pnpm lint

pnpm typecheck

pnpm test

pnpm build

Verify:

git add .

git commit -m "Sprint 10: Academic Recognition"

must succeed.

---

FINAL REPORT
--------------------------------------------------

Provide:

1. Executive Summary

2. Domain Model Overview

3. Aggregate Roots

4. Entities

5. Value Objects

6. Domain Events

7. Business Rules

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

19. Sprint 11 Preparation

FINAL CERTIFICATION

End with exactly one of:

❌ Sprint 10 Incomplete

or

✅ Sprint 10 Complete

Only certify completion if:

• All quality gates pass

• Git commit succeeds

• Husky succeeds

• No architectural violations exist

• Clean Architecture remains intact

• DDD boundaries remain intact

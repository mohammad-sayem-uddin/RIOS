# RIOS Sprint 12 — Research Discovery, Public Profiles & Search Platform

Role: Principal Software Architect, Domain-Driven Design Expert, Enterprise
Backend Engineer.

Project: Research Identity Operating System (RIOS)

Current Status: Sprint 11 (Research Intelligence, Collaboration & Academic
Timeline) has been completed.

The repository already contains:

• Clean Architecture • Domain-Driven Design • CQRS • SOLID • PostgreSQL • Prisma
• JWT Authentication • Research Profile • Publications • Research Projects •
Research Assets • Awards • Grants • Patents • Professional Activities • Research
Intelligence • Academic Timeline • Collaboration Network

Your task is to implement Sprint 12.

IMPORTANT

This sprint introduces the Discovery & Search bounded context.

DO NOT redesign previous bounded contexts.

Maintain strict dependency direction.

Presentation ↓

Application ↓

Domain ↑

Infrastructure

---

SPRINT OBJECTIVE
--------------------------------------------------

Build the complete Research Discovery Platform.

The system must support:

• Public Research Profiles

• Global Research Search

• Publication Search

• Project Search

• Dataset Search

• Researcher Search

• Institution Search

• Keyword Search

• Advanced Filtering

• Public Profile Pages

• Research Portfolio Pages

• Research Statistics Pages

Design for future integration with:

• Elasticsearch

• OpenSearch

• Meilisearch

• Algolia

• OpenAlex

• ORCID

• Google Scholar

without redesign.

---

PHASE 1 Domain Design
--------------------------------------------------

Aggregate Roots

PublicResearchProfile

SearchIndex

DiscoveryCatalog

Entities

SearchDocument

SearchResult

SearchFacet

InstitutionProfile

KeywordCluster

ResearchCategory

ResearchPortfolio

TrendingResearch

Value Objects

SearchId

IndexId

ProfileSlug

SearchQuery

SearchKeyword

SearchFilter

SortOption

RankingScore

VisibilityLevel

PortfolioId

Domain Events

ProfilePublished

ProfileVisibilityChanged

SearchIndexUpdated

ResearchIndexed

PortfolioCreated

---

PHASE 2 Business Rules
--------------------------------------------------

Examples

Profile slug must be unique.

Only public profiles appear in search.

Hidden publications remain private.

Deleted profiles disappear from search.

Search ranking must be deterministic.

Duplicate search documents forbidden.

Institution names normalized.

Keyword indexing deduplicated.

---

PHASE 3 Repository Contracts
--------------------------------------------------

Implement

PublicProfileRepository

SearchRepository

DiscoveryRepository

Support

save()

findById()

findBySlug()

search()

searchResearchers()

searchPublications()

searchProjects()

searchDatasets()

delete()

---

PHASE 4 Application Layer
--------------------------------------------------

Implement CQRS.

Commands

PublishProfile

UnpublishProfile

UpdateSearchIndex

CreatePortfolio

Queries

GlobalSearch

SearchResearchers

SearchPublications

SearchProjects

SearchDatasets

SearchInstitutions

GetPublicProfile

GetPortfolio

Return immutable DTOs.

---

PHASE 5 Infrastructure
--------------------------------------------------

Extend Prisma.

Create normalized schema.

Implement:

Repository implementations

Persistence mappers

Index builders

Search adapters

Pagination

Filtering

Sorting

Future abstraction for:

Elasticsearch

OpenSearch

Meilisearch

without coupling Domain.

---

PHASE 6 Presentation
--------------------------------------------------

REST APIs

Examples

GET /search

GET /search/publications

GET /search/projects

GET /search/datasets

GET /search/researchers

GET /profiles/:slug

GET /portfolio/:slug

GET /institutions

Support

pagination

sorting

filtering

keyword search

---

PHASE 7 Testing
--------------------------------------------------

Create tests for

Domain

Application

Infrastructure

Presentation

Search ranking

Filtering

Pagination

Repository persistence

CQRS

REST endpoints

---

QUALITY REQUIREMENTS
--------------------------------------------------

Maintain

• Clean Architecture

• DDD

• SOLID

• CQRS

Strict TypeScript.

Zero any.

No eslint-disable.

No framework leakage.

No circular dependencies.

---

QUALITY GATES
--------------------------------------------------

Execute

pnpm prisma generate

pnpm lint

pnpm typecheck

pnpm test

pnpm build

Verify

git add .

git commit -m "Sprint 12: Research Discovery Platform"

must succeed.

---

FINAL REPORT
--------------------------------------------------

Provide

1. Executive Summary

2. Domain Model

3. Aggregate Roots

4. Entities

5. Value Objects

6. Domain Events

7. Business Rules

8. Search Architecture

9. Repository Implementations

10. CQRS Commands

11. CQRS Queries

12. REST APIs

13. Tests Added

14. Build Results

15. Lint Results

16. Typecheck Results

17. Husky Verification

18. Performance Considerations

19. Sprint 13 Preparation

FINAL CERTIFICATION

End with exactly one of:

❌ Sprint 12 Incomplete

or

✅ Sprint 12 Complete

Only certify completion if:

• All quality gates pass

• Git commit succeeds

• Husky succeeds

• Search architecture remains extensible

• Clean Architecture is preserved

• DDD boundaries remain intact

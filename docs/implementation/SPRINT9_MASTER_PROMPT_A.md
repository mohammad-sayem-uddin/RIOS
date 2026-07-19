# RIOS Sprint 9 — Research Assets & Scholarly Resources Domain

Role: Principal Software Architect, Domain-Driven Design Expert, Enterprise
Backend Engineer.

Project: Research Identity Operating System (RIOS)

Current Status: Sprint 8 (Publications & Research Projects) has been completed.

The repository already contains:

• Clean Architecture • Domain-Driven Design • CQRS • SOLID • Repository Pattern
• PostgreSQL • Prisma • JWT Authentication • ResearchProfile Aggregate •
Publications Aggregate • Research Projects Aggregate • Enterprise Testing
Infrastructure

Your task is to implement Sprint 9.

IMPORTANT

This sprint introduces the Research Assets bounded context.

DO NOT redesign previous bounded contexts.

DO NOT modify existing aggregates unless absolutely necessary.

Maintain strict dependency direction.

Presentation ↓

Application ↓

Domain ↑

Infrastructure

---

SPRINT OBJECTIVE
------------------------------------------

Implement a complete Research Assets ecosystem.

This sprint manages every scholarly resource that supports research beyond
publications.

The system must support:

• Research Datasets • Source Code Repositories • Software Packages • Models •
Benchmarks • Experiments • Supplementary Materials • Presentations • Posters •
Demonstrations • Research Videos • Documentation • External Links

Design everything for future interoperability with:

• GitHub • GitLab • Hugging Face • Kaggle • Zenodo • Figshare • Dryad • OSF •
Google Drive • S3 • DOI providers

without future redesign.

---

PHASE 1 Domain Design
------------------------------------------

Create aggregate roots:

ResearchDataset

SoftwareArtifact

ResearchAsset

Entities:

DatasetVersion

Repository

Release

Experiment

Benchmark

ModelArtifact

PresentationMaterial

Poster

Demo

Video

Documentation

SupplementaryFile

ExternalResource

Value Objects:

DatasetId

AssetId

RepositoryId

ExperimentId

Version

SemanticVersion

RepositoryURL

DatasetURL

GitCommitHash

DOI

License

Checksum

ProgrammingLanguage

Framework

StorageProvider

FileSize

MediaType

ResearchField

ResearchArea

Visibility

AccessLevel

Domain Events:

DatasetCreated

DatasetPublished

DatasetVersionReleased

RepositoryLinked

RepositoryUnlinked

ExperimentCreated

BenchmarkAdded

ModelReleased

ResearchAssetUploaded

ResearchAssetDeleted

---

PHASE 2 Business Rules
------------------------------------------

Examples:

Dataset DOI must be unique.

Repository URL must be unique.

GitHub repository cannot be linked twice.

Dataset version numbers must increase.

Semantic versioning must be valid.

File checksum cannot duplicate within the same dataset version.

Software release requires a repository.

Experiment must belong to exactly one project.

Supplementary materials belong to one publication.

Public assets must contain license information.

---

PHASE 3 Repository Contracts
------------------------------------------

Implement repository interfaces:

ResearchDatasetRepository

SoftwareArtifactRepository

ResearchAssetRepository

ExperimentRepository

RepositoryRepository

Support:

save()

findById()

findByDOI()

findByRepository()

findByResearchProfile()

findByPublication()

search()

delete()

---

PHASE 4 Application Layer
------------------------------------------

Implement CQRS.

Commands:

CreateDataset

PublishDataset

CreateRepository

LinkRepository

ReleaseSoftware

CreateExperiment

UploadResearchAsset

DeleteResearchAsset

Queries:

GetDataset

SearchDatasets

GetRepository

SearchRepositories

GetResearchAssets

GetExperiment

Return immutable DTOs.

---

PHASE 5 Infrastructure
------------------------------------------

Extend Prisma schema.

Create normalized relational models.

Include:

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
------------------------------------------

Create REST APIs.

Examples:

POST /datasets

GET /datasets

PATCH /datasets/:id

DELETE /datasets/:id

POST /repositories

GET /repositories

POST /software

POST /experiments

POST /research-assets

GET /research-assets

DELETE /research-assets/:id

Validate every request.

Return consistent API responses.

---

PHASE 7 Testing
------------------------------------------

Create tests for:

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

NON-FUNCTIONAL REQUIREMENTS
------------------------------------------

Maintain:

• Clean Architecture

• DDD

• SOLID

• CQRS

No framework leakage.

No Prisma inside Domain.

No Express inside Domain/Application.

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

Verify:

git add .

git commit -m "Sprint 9: Research Assets & Scholarly Resources"

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

19. Sprint 10 Preparation

FINAL CERTIFICATION

End with exactly one of:

❌ Sprint 9 Incomplete

or

✅ Sprint 9 Complete

Only certify completion if:

• All quality gates pass

• Git commit succeeds

• Husky succeeds

• No architectural violations exist

• Clean Architecture remains intact

• DDD boundaries remain intact

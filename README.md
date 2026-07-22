<div align="center">

# RIOS

### Research Identity Operating System

**A domain-driven platform for modeling, managing, and publishing a researcher's
complete scholarly identity — from publications and projects to datasets,
grants, collaboration networks, and AI-generated insights.**

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-000000.svg?style=flat-square)](#license)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A522-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10-F69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.x-EF4444?style=flat-square&logo=turborepo&logoColor=white)](https://turbo.build/)

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vitest](https://img.shields.io/badge/Vitest-3-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)
[![CI](https://img.shields.io/github/actions/workflow/status/your-org/rios/ci.yml?style=flat-square&label=CI)](#continuous-integration)

<br />

[Overview](#overview) · [Features](#key-features) ·
[Architecture](#system-architecture) · [Getting Started](#getting-started) ·
[API](#api-documentation) · [Contributing](#contributing)

</div>

---

<!--
  HERO IMAGE PLACEHOLDER
  Drop a product screenshot or architecture render here once available.
  Recommended: 1600×900, dark-mode dashboard, exported to docs/assets/hero.png

  <p align="center">
    <img src="docs/assets/hero.png" alt="RIOS dashboard" width="100%" />
  </p>
-->

## Overview

**RIOS** is a research identity platform: a single system of record for
everything that constitutes a scholar's professional footprint. A researcher's
work is normally scattered across ORCID, Google Scholar, institutional pages,
GitHub, dataset repositories, and grant databases. RIOS unifies that footprint
into one coherent, queryable domain model and renders it as a private workspace
and a public portfolio.

The codebase is a **pnpm + Turborepo monorepo** built as a deliberate exercise
in **Clean Architecture** and **Domain-Driven Design**. Business rules live in a
framework-agnostic domain layer; frameworks (Express, Prisma, Next.js) sit at
the edges and are swappable. Errors are modeled explicitly with a `Result` type
rather than thrown, dependencies flow in one direction only, and every bounded
context is isolated behind its own aggregates and repositories.

**Who it's for**

- **Researchers & academics** — maintain a structured identity and a shareable
  portfolio.
- **Institutions** — model departments, affiliations, and researcher
  directories.
- **Engineers** — a reference implementation of layered TypeScript architecture
  at scale (~83k LOC, 9 bounded contexts, 75 persistence models).

> [!NOTE] RIOS is an architecture-first project. Some subsystems are fully wired
> end-to-end (identity, persistence, HTTP, frontend); others are modeled and
> provisioned but not yet connected at runtime. The [Roadmap](#roadmap) states
> exactly where each stands.

---

## Key Features

<table>
<tr>
<td width="50%" valign="top">

#### 🔐 Identity & Access

- Email/password registration with verification tokens
- Access + refresh JWTs with **refresh-token rotation**
- Session management with device/IP tracking
- Role-Based Access Control (roles, permissions, assignments)
- Password reset flow and audit logging

#### 🧬 Research Identity & Profile

- Structured research profile (bio, mission, vision, statement)
- Education, professional experience, skills, interests
- External profiles (ORCID, Google Scholar) and portfolio assets

#### 📄 Publications

- Publications with authors, venues, publishers, and funding
- Typed lifecycle (`DRAFT → SUBMITTED → … → PUBLISHED`)
- DOI/ISBN, citation counts, affiliation snapshots

#### 🧪 Projects & Research Assets

- Research projects with members, grants, and budgets
- Datasets (with versioning), software artifacts, repositories, experiments
- Visibility and access-level controls per asset

</td>
<td width="50%" valign="top">

#### 🏆 Academic Recognition

- Awards, grants, patents, and professional activities
- Funding agencies, monetary amounts, and timelines

#### 📊 Research Intelligence

- Academic timelines and career milestones
- Collaboration networks and co-author graphs
- Publication/citation statistics and research trends

#### 🔎 Discovery & Public Profiles

- Public, slug-based researcher profiles (`/r/[slug]`)
- Portfolios, search indices, and discovery catalogs

#### 🤖 AI Intelligence

- Research embeddings and vector metadata
- Knowledge graph (nodes/edges), recommendations
- Expertise profiles and research-gap modeling

#### 🏢 Enterprise

- Notifications, background jobs, webhooks
- Feature flags, configuration items, system metrics

</td>
</tr>
</table>

**Platform-wide**

| Area                     | What ships today                                                              |
| ------------------------ | ----------------------------------------------------------------------------- |
| **API**                  | Versioned REST under `/api/v1`, OpenAPI 3.0.3 spec, Swagger UI at `/docs`     |
| **Security**             | PBKDF2 hashing, JWT, Helmet headers, CORS, correlation IDs, RBAC, audit logs  |
| **Frontend**             | Next.js 15 App Router, typed data layer, dark mode, command palette (⌘K)      |
| **Accessibility**        | Radix primitives, focus rings, ARIA, `prefers-reduced-motion` support         |
| **Developer Experience** | Turborepo caching, strict TS, ESLint + Prettier, Husky hooks, CI quality gate |

---

## System Architecture

RIOS follows Clean Architecture: dependencies point **inward**. The domain knows
nothing about Express, Prisma, or Next.js — those are details wired in at the
edges by a composition root.

```mermaid
graph TD
    subgraph Client
        FE["apps/frontend<br/>Next.js 15 · React 19 · TanStack Query"]
    end

    subgraph API["apps/api — composition root"]
        MAIN["main.ts<br/>DI wiring · lifecycle"]
    end

    subgraph Presentation["@rios/presentation — Express"]
        MW["Middleware<br/>auth · RBAC · security headers · correlation-id"]
        CTRL["11 Controllers<br/>+ OpenAPI / Swagger"]
    end

    subgraph Application["@rios/application — CQRS"]
        UC["Commands · Queries · App Services · DTOs"]
    end

    subgraph Domain["Domain Layer"]
        DOM["@rios/domain<br/>9 bounded contexts"]
        ID["@rios/identity<br/>IAM aggregate"]
    end

    subgraph Infra["@rios/infrastructure"]
        REPO["Prisma repositories · mappers"]
        SEC["Security: PBKDF2 · JWT"]
        OUT["Transactional outbox"]
    end

    subgraph Shared["@rios/shared — Shared Kernel"]
        KERN["AggregateRoot · Entity · ValueObject · Result · CQRS"]
    end

    subgraph Data["Data & Infra Services"]
        PG[("PostgreSQL 16<br/>Prisma · 75 models")]
        EXT[["Provisioned locally:<br/>Redis · Qdrant · EventStoreDB"]]
    end

    FE -->|"HTTP /api/v1"| MW --> CTRL --> UC
    MAIN -.wires.-> Presentation & Application & Infra
    UC --> DOM & ID
    UC --> REPO
    REPO --> PG
    OUT --> PG
    DOM & ID -.depends on.-> KERN
    Infra -.depends on.-> KERN
    REPO -.-> EXT
```

**Layer responsibilities**

| Layer              | Package                          | Responsibility                                                       | Depends on       |
| ------------------ | -------------------------------- | -------------------------------------------------------------------- | ---------------- |
| **Shared Kernel**  | `@rios/shared`                   | DDD primitives, CQRS contracts, `Result`/`Either`, domain events     | —                |
| **Domain**         | `@rios/domain`, `@rios/identity` | Aggregates, value objects, domain events, repository interfaces      | Shared           |
| **Application**    | `@rios/application`              | Use cases as commands/queries, application services, DTOs, mappers   | Domain, Shared   |
| **Infrastructure** | `@rios/infrastructure`           | Prisma repositories, security, DI container, outbox, health, logging | Application ↓    |
| **Presentation**   | `@rios/presentation`             | Express server, controllers, middleware, validation, OpenAPI         | Application ↓    |
| **Apps**           | `apps/api`, `apps/frontend`      | Composition root (API) and the Next.js client                        | All of the above |

---

## Request Flow

An authenticated write request travels through every layer, with the domain
producing events that are persisted via a transactional outbox alongside the
state change.

```mermaid
sequenceDiagram
    participant B as Browser (React)
    participant C as api-client (fetch)
    participant E as Express + Middleware
    participant Ctrl as Controller
    participant App as App Service / Command
    participant Dom as Domain Aggregate
    participant Repo as Prisma Repository
    participant DB as PostgreSQL

    B->>C: mutate() via typed service
    C->>E: POST /api/v1/... (Bearer access token)
    E->>E: correlation-id · auth · RBAC · validation
    E->>Ctrl: dispatch
    Ctrl->>App: execute(command)
    App->>Dom: enforce invariants → emit domain event
    App->>Repo: persist(aggregate)
    Repo->>DB: state change + outbox row (one transaction)
    DB-->>Repo: ok
    App-->>Ctrl: Result.ok(dto)
    Ctrl-->>C: { success, data, meta }
    C-->>B: typed payload
```

<details>
<summary><b>Automatic token refresh</b></summary>

<br />

When the API returns `401`, the client transparently exchanges the refresh token
and replays the original request. If the refresh fails, a `rios:session-expired`
event is broadcast and the app redirects to the session-expired screen.

```mermaid
sequenceDiagram
    participant C as api-client
    participant API as /api/v1

    C->>API: GET /resource (expired access token)
    API-->>C: 401 Unauthorized
    C->>API: POST /auth/refresh { refreshToken }
    alt refresh succeeds
        API-->>C: { tokens } → store & retry original request
    else refresh fails
        API-->>C: 401 → broadcast rios:session-expired
    end
```

</details>

---

## Folder Structure

```text
RIOS/
├── apps/
│   ├── api/                      # Composition root — wires DI + Express, boots the server
│   │   └── src/main.ts           #   Prisma client → CompositionRoot → HTTP server → shutdown
│   └── frontend/                 # Next.js 15 App Router client (port 3001)
│       └── src/
│           ├── app/              #   Route groups: (auth) (dashboard) (onboarding) (status) r/[slug]
│           ├── components/       #   ui · auth · feedback · layout · motion · workspace
│           ├── hooks/            #   use-domain-queries · use-global-shortcuts · use-sidebar · …
│           ├── lib/              #   api-client · services · navigation · zod schemas
│           └── providers/        #   auth · query · theme · ui
├── packages/
│   ├── shared/                   # Shared kernel — DDD primitives, CQRS, Result/Either, events
│   ├── domain/                   # 9 bounded contexts (aggregates, VOs, events, repo interfaces)
│   ├── identity/                 # IAM bounded context (aggregate, policies, specifications)
│   ├── application/              # Use cases: commands, queries, services, DTOs, mappers
│   ├── infrastructure/           # Prisma repositories, security, DI, outbox, health, logging
│   │   └── prisma/schema.prisma  #   75 models + seed.ts
│   ├── presentation/             # Express server, controllers, middleware, validation, Swagger
│   └── typescript-config/        # Shared tsconfig presets
├── docs/                         # architecture · engineering · implementation
├── infrastructure/               # Infrastructure-as-code
├── scripts/quality-gate.sh       # Lint → format → typecheck → test → build
├── docker-compose.yml            # PostgreSQL · EventStoreDB · Redis · Qdrant
├── turbo.json                    # Task graph & caching
└── pnpm-workspace.yaml           # Workspace definition
```

---

## Technology Stack

| Category               | Technology                                                              |
| ---------------------- | ----------------------------------------------------------------------- |
| **Language**           | TypeScript 5.6 (strict)                                                 |
| **Runtime**            | Node.js ≥ 22                                                            |
| **Package Manager**    | pnpm 10 (workspaces)                                                    |
| **Build Orchestrator** | Turborepo 2                                                             |
| **Frontend**           | Next.js 15 (App Router) · React 19                                      |
| **UI**                 | Radix UI · class-variance-authority · Tailwind utilities · lucide-react |
| **Client State/Data**  | TanStack Query 5 · react-hook-form 7 · Zod 3                            |
| **Motion & Theming**   | Framer Motion · next-themes · Sonner                                    |
| **Backend**            | Express 4 · Helmet · CORS · compression                                 |
| **Architecture**       | Clean Architecture · DDD · CQRS · Repository · hand-rolled DI           |
| **ORM / Database**     | Prisma 6 · PostgreSQL 16                                                |
| **Auth / Crypto**      | Custom JWT (HMAC-SHA256) · PBKDF2/HMAC-SHA512 hashing (Node `crypto`)   |
| **API Docs**           | OpenAPI 3.0.3 (generated) · Swagger UI                                  |
| **Testing**            | Vitest 3 · V8 coverage                                                  |
| **Linting/Formatting** | ESLint 8 · Prettier 3 · eslint-plugin-perfectionist                     |
| **Git Hooks**          | Husky · lint-staged                                                     |
| **CI/CD**              | GitHub Actions                                                          |
| **Local Infra**        | Docker Compose (PostgreSQL, EventStoreDB, Redis, Qdrant)                |

---

## Architecture

RIOS is built around a small set of enforced principles.

**Clean Architecture & DDD.** The domain layer contains aggregates, value
objects, and domain events with zero framework imports. Each bounded context
(`identity`, `research-identity`, `publications`, `research-assets`,
`academic-recognition`, `research-intelligence`, `research-discovery`,
`ai-intelligence`, `enterprise`) owns its aggregates and repository interfaces
and is never merged with another.

**CQRS.** The application layer separates writes (`commands/`) from reads
(`queries/`), each with dedicated handlers built on the shared `Command` /
`Query` contracts.

**Repository pattern.** Domain code depends on repository _interfaces_; concrete
Prisma implementations live in infrastructure and are bound at the composition
root.

**Dependency Injection.** A hand-rolled container (`CompositionRoot`,
`container.ts`, `DITokens`) wires the object graph — no runtime reflection, no
decorators.

**The Result pattern.** Domain and application code return `Result<T>` /
`Either` instead of throwing. Failures are values, so error handling is explicit
and type-checked all the way to the HTTP boundary, where a `result-http-mapper`
translates them into responses.

**Enforced boundaries.** ESLint (`import/no-cycle`,
`eslint-plugin-perfectionist`) and per-package `tsconfig` project references
keep dependencies flowing in one direction. Domain ownership is codified in
`.github/CODEOWNERS`.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 22
- **pnpm** ≥ 10
- **Docker** & Docker Compose (for local infrastructure)

### 1 · Install & configure

```bash
git clone https://github.com/your-org/rios.git
cd rios

pnpm install          # install all workspace dependencies
cp .env.example .env  # copy environment defaults
```

### 2 · Start infrastructure

```bash
make infra            # start PostgreSQL, EventStoreDB, Redis, Qdrant (docker compose up -d)
make infra-health     # show container status
```

> [!TIP] `make setup` runs `install` + `infra` in one step. Run `make help` to
> list every target.

### 3 · Prepare the database

```bash
# Generate the Prisma client, apply schema, and seed
pnpm --filter @rios/infrastructure exec prisma generate
pnpm --filter @rios/infrastructure exec prisma migrate dev
pnpm --filter @rios/infrastructure exec prisma db seed
```

### 4 · Build & run

```bash
pnpm turbo build                       # build all packages (dependency-ordered, cached)

pnpm turbo dev --filter=@rios/api      # API on http://localhost:3000
pnpm turbo dev --filter=@rios/frontend # Frontend on http://localhost:3001
```

The frontend proxies `/api/*`, `/health/*`, and `/docs/*` to the API in
development, so you only need to open **http://localhost:3001**.

### 5 · Verify

```bash
pnpm turbo lint          # ESLint across all packages
pnpm turbo typecheck     # TypeScript, no emit
pnpm turbo test          # Vitest
bash scripts/quality-gate.sh   # full gate: lint → format → typecheck → test → build
```

> [!NOTE] The root `pnpm db:migrate` / `pnpm db:seed` scripts map to Turbo
> `migrate`/`seed` tasks that are not yet defined in the infrastructure package.
> Use the explicit `pnpm --filter @rios/infrastructure exec prisma …` commands
> above until they are wired.

---

## Environment Variables

Defined in `.env.example`. Copy to `.env` for local development.

| Variable                                                          | Description                           | Required | Default (dev)                                         |
| ----------------------------------------------------------------- | ------------------------------------- | :------: | ----------------------------------------------------- |
| `DATABASE_URL`                                                    | PostgreSQL connection string (Prisma) |    ✅    | `postgresql://rios:rios_password@localhost:5432/rios` |
| `POSTGRES_HOST` / `POSTGRES_PORT`                                 | PostgreSQL host / port                |    ✅    | `localhost` / `5432`                                  |
| `POSTGRES_USER` / `POSTGRES_PASSWORD`                             | PostgreSQL credentials                |    ✅    | `rios` / `rios_password`                              |
| `POSTGRES_DB`                                                     | Database name                         |    ✅    | `rios`                                                |
| `JWT_SECRET`                                                      | Secret for signing JWTs               |    ✅    | `dev-jwt-secret-change-in-production`                 |
| `JWT_EXPIRY`                                                      | Access-token lifetime                 |    —     | `15m`                                                 |
| `JWT_REFRESH_EXPIRY`                                              | Refresh-token lifetime                |    —     | `7d`                                                  |
| `API_HOST` / `API_PORT`                                           | API bind host / port                  |    —     | `0.0.0.0` / `3000`                                    |
| `NODE_ENV`                                                        | Runtime environment                   |    —     | `development`                                         |
| `LOG_LEVEL`                                                       | Logger verbosity                      |    —     | `debug`                                               |
| `CORS_ORIGIN`                                                     | Allowed CORS origin                   |    —     | `http://localhost:3001`                               |
| `REDIS_URL` / `REDIS_HOST` / `REDIS_PORT`                         | Redis connection (provisioned)        |    —     | `redis://localhost:6379`                              |
| `QDRANT_URL` / `QDRANT_HTTP_PORT` / `QDRANT_GRPC_PORT`            | Qdrant vector DB (provisioned)        |    —     | `http://localhost:6333`                               |
| `EVENTSTORE_URL` / `EVENTSTORE_HTTP_PORT` / `EVENTSTORE_TCP_PORT` | EventStoreDB (provisioned)            |    —     | `http://localhost:2113`                               |

> [!WARNING] Always set a strong, unique `JWT_SECRET` outside of local
> development. The JWT provider is hardened to refuse to start in production
> with a missing or weak secret.

---

## API Documentation

- **Base URL** — `http://localhost:3000`
- **API prefix** — all resources are versioned under **`/api/v1`**
- **Interactive docs** — Swagger UI at **`/docs`**
- **OpenAPI spec** — machine-readable JSON at **`/docs/json`** (OpenAPI 3.0.3)
- **Health probes** — `/health`, `/health/live`, `/health/ready`
- **Auth** — Bearer access token in the `Authorization` header

**Response envelope**

```jsonc
{
  "success": true,
  "data": {/* payload */},
  "error": { "code": "string", "message": "string" }, // present on failure
  "meta": { "correlationId": "uuid", "timestamp": "ISO-8601" },
}
```

**Authentication endpoints** (`/api/v1/auth`)

| Method | Path                   | Description                    | Auth |
| ------ | ---------------------- | ------------------------------ | :--: |
| `POST` | `/register`            | Create an account              |  —   |
| `POST` | `/login`               | Obtain access + refresh tokens |  —   |
| `POST` | `/refresh`             | Rotate tokens                  |  —   |
| `POST` | `/verify-email`        | Verify email with token        |  —   |
| `POST` | `/resend-verification` | Re-issue a verification email  |  —   |
| `POST` | `/forgot-password`     | Begin password reset           |  —   |
| `POST` | `/reset-password`      | Complete password reset        |  —   |
| `POST` | `/logout`              | Revoke the current session     |  ✅  |
| `GET`  | `/me`                  | Current authenticated user     |  ✅  |

Resource routers (publications, projects, research assets, recognition,
intelligence, discovery, AI, enterprise, research identities) are mounted under
`/api/v1` and served by 11 dedicated controllers.

---

## Database

Persistence is modeled with **Prisma 6** against **PostgreSQL**, with **75
models** grouped by bounded context. Every model uses UUID primary keys,
`snake_case` column mapping, `timestamptz` timestamps, and targeted indexes;
soft deletes and audit columns are used where relevant.

| Domain group              | Representative models                                                                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Identity & Access**     | `User`, `Role`, `Permission`, `UserRole`, `RolePermission`, `Session`, `RefreshToken`, `AuditLog`, `EmailVerificationToken`, `PasswordResetToken`             |
| **Research Identity**     | `ResearchProfile`, `Education`, `ProfessionalExperience`, `Skill`, `ResearchInterest`, `ExternalProfile`, `PortfolioAsset`                                    |
| **Publications**          | `Publication`, `Author`, `Venue`, `Publisher`, `Funding`, `AffiliationSnapshot`                                                                               |
| **Projects**              | `ResearchProject`, `ProjectMember`                                                                                                                            |
| **Research Assets**       | `ResearchDataset`, `DatasetVersion`, `SoftwareArtifact`, `Repository`, `SoftwareRelease`, `Experiment`, `ResearchAsset`                                       |
| **Academic Recognition**  | `AcademicAward`, `AcademicGrant`, `AcademicPatent`, `ProfessionalActivity`                                                                                    |
| **Research Intelligence** | `AcademicTimelineModel`, `CollaborationNetworkModel`, `ResearchAnalyticsModel` (+ events, milestones, statistics, trends)                                     |
| **Discovery & Search**    | `PublicResearchProfileModel`, `ResearchPortfolioModel`, `SearchIndexModel`, `SearchDocumentModel`, `DiscoveryCatalogModel`                                    |
| **AI Intelligence**       | `ResearchEmbeddingModel`, `KnowledgeGraphModel`, `ResearchNodeModel`, `ResearchEdgeModel`, `RecommendationModel`, `ExpertiseProfileModel`, `ResearchGapModel` |
| **Enterprise**            | `NotificationModel`, `BackgroundJobModel`, `WebhookModel`, `FeatureFlagModel`, `ConfigurationItemModel`, `SystemMetricModel`                                  |

Most research entities hang off `ResearchProfile` via cascading relations,
giving each researcher a single aggregate root for their scholarly record.

**Migrations** are managed by Prisma Migrate; the schema and `seed.ts` live in
`packages/infrastructure/prisma/`.

---

## Authentication

RIOS ships a complete, self-contained auth stack built on Node's native `crypto`
module — no external auth or crypto dependencies.

- **Password hashing** — PBKDF2 with HMAC-SHA512, 100,000 iterations, a 64-byte
  derived key, per-password random salt, and constant-time comparison
  (`timingSafeEqual`). Hashes are stored in a self-describing
  `$rios$pbkdf2$<iterations>$<salt>$<hash>` format.
- **Tokens** — JWTs signed with HMAC-SHA256. Short-lived **access tokens** carry
  user, session, roles, and permissions; long-lived **refresh tokens** are
  hashed at rest and support **rotation** (each refresh records the token that
  replaced it).
- **Sessions** — tracked with device IP and user agent; revocable and expiring.
- **Authorization** — RBAC via roles → permissions, enforced by authentication,
  authorization, and resource-ownership middleware.
- **Auditing** — authentication and sensitive actions are recorded in
  `AuditLog`.
- **Client** — the frontend stores tokens in `localStorage` and transparently
  refreshes them on `401`, broadcasting a session-expired event when refresh is
  no longer possible.

> [!NOTE] The hasher class is named `BCryptPasswordHasher` for historical
> reasons but its implementation is **PBKDF2/HMAC-SHA512**, not bcrypt. The
> behavior above reflects the actual code.

---

## Frontend

The client is a **Next.js 15 App Router** application (React 19) organized by
route groups.

| Route group    | Purpose                                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| `(auth)`       | `login`, `register`, `forgot-password`, `reset-password`, `verify-email`                                              |
| `(dashboard)`  | `profile`, `projects`, `publications`, `assets`, `recognition`, `intelligence`, `ai`, `search`, `settings`, `support` |
| `(onboarding)` | Guided first-run onboarding                                                                                           |
| `(status)`     | `account-locked`, `maintenance`, `session-expired`, `unauthorized`                                                    |
| `r/[slug]`     | Public, shareable researcher profiles                                                                                 |

**Data layer.** A single typed `api-client` (fetch-based, `/api/v1`, auth
headers, auto-refresh, error normalization) sits under typed domain
**services**, consumed through **TanStack Query** hooks (`use-domain-queries`)
with centralized query keys. Components never call `fetch` directly.

**Design system.** UI primitives (`components/ui`) are built on **Radix UI**
with **class-variance-authority** for variants and `tailwind-merge`/`clsx` for
composition. Forms use **react-hook-form** with **Zod** schemas (`auth-schemas`,
`domain-schemas`) via `@hookform/resolvers`.

**UX.** Dark/light theming (`next-themes`), motion with `framer-motion`, toasts
with `sonner`, a global command palette and keyboard shortcuts
(`use-global-shortcuts`, ⌘K), a single navigation source driving sidebar +
breadcrumbs, and dedicated empty/error/ loading states.

**Providers.** `auth`, `query`, `theme`, and `ui` providers compose at the root
layout.

---

## Backend

The backend is a layered Express application assembled at a composition root.

- **Composition root** (`apps/api/src/main.ts`) creates the Prisma client,
  builds the DI container via `CompositionRoot`, connects the database, resolves
  services, boots the HTTP server, and installs graceful `SIGTERM`/`SIGINT`
  shutdown.
- **Controllers** (11) translate HTTP into application commands/queries and
  back.
- **Application services** orchestrate use cases as CQRS commands and queries
  over the domain, returning `Result<T>`.
- **Domain** enforces invariants inside aggregates and emits domain events.
- **Repositories** (Prisma) persist aggregates via mappers; a **transactional
  outbox** (`prisma-outbox-repository`) records domain events in the same
  transaction as the state change.
- **Middleware pipeline** — request-id, correlation-id, request-context,
  logging, security headers, compression, body parsing, timeouts,
  authentication, authorization, ownership, and a terminal exception handler.
- **Error handling** — a `result-http-mapper` converts domain/application
  failures into consistent HTTP responses; nothing is thrown across the
  boundary.

---

## Security

| Control              | Implementation                                                          |
| -------------------- | ----------------------------------------------------------------------- |
| **Password storage** | PBKDF2/HMAC-SHA512, 100k iterations, random salt, constant-time compare |
| **Tokens**           | HMAC-SHA256 JWTs; refresh-token rotation; refresh tokens hashed at rest |
| **Authorization**    | RBAC (roles → permissions) + resource-ownership middleware              |
| **Input validation** | Schema validation middleware on the API; Zod schemas on the client      |
| **HTTP hardening**   | Helmet security headers, configurable CORS, request timeouts            |
| **Traceability**     | Correlation IDs and request IDs on every request; audit logging         |
| **Secret hygiene**   | JWT provider refuses to start in production with a missing/weak secret  |

> [!WARNING] Rate limiting and CSRF protection are **not** currently
> implemented. Add them (and a hardened token-storage strategy) before any
> production deployment. See the [Roadmap](#roadmap).

---

## Testing

Testing uses **Vitest 3** with V8 coverage. There are **67 test files** across
the domain, application, infrastructure, and presentation packages, plus
frontend unit tests (e.g. `navigation.test.ts`, `password-strength.test.ts`).

```bash
pnpm turbo test                     # run all tests
pnpm --filter @rios/domain test     # a single package
pnpm --filter @rios/frontend test:watch
```

> [!NOTE] A dedicated end-to-end suite is not yet wired (no Playwright
> dependency; one infrastructure integration test exists). E2E coverage is on
> the roadmap.

---

## Performance

- **Turborepo** task graph with caching and dependency-ordered builds.
- **Code splitting** via the Next.js App Router (per-route bundles, streaming).
- **Client caching** through TanStack Query (query keys, background refetch).
- **HTTP compression** middleware on API responses.
- **Database indexes** on high-cardinality lookup columns across all 75 models.
- **Debounced inputs** (`use-debounced-value`) for search and typeahead.
- **Console stripping** in production frontend builds (keeps `error`/`warn`).

---

## Accessibility

- **Radix UI** primitives provide accessible, WAI-ARIA-compliant behavior out of
  the box.
- Visible **focus rings**, semantic HTML, and ARIA attributes throughout the UI
  kit.
- **`prefers-reduced-motion`** awareness for all Framer Motion animations.
- Full **keyboard navigation** and a command palette (⌘K) via global shortcuts.
- Dedicated **status screens** for locked accounts, expired sessions,
  unauthorized access, and maintenance.

---

## Screenshots

> Placeholders — replace with real captures in `docs/assets/`.

| View                 | Preview                              |
| -------------------- | ------------------------------------ |
| Dashboard            | `docs/assets/dashboard.png`          |
| Authentication       | `docs/assets/auth.png`               |
| Projects             | `docs/assets/projects.png`           |
| Public Profile       | `docs/assets/public-profile.png`     |
| AI / Knowledge Graph | `docs/assets/ai-knowledge-graph.png` |
| Settings             | `docs/assets/settings.png`           |

---

## Roadmap

**Now — shipped**

- ✅ Clean Architecture monorepo with 9 bounded contexts
- ✅ Identity & Access: registration, login, JWT rotation, RBAC, sessions, audit
- ✅ Prisma persistence (75 models) with transactional outbox
- ✅ Versioned REST API, OpenAPI 3.0.3, Swagger UI
- ✅ Next.js 15 frontend with typed data layer and design system
- ✅ CI quality gate (lint, typecheck, build, test, format)

**Next**

- 🔜 Wire Redis (caching), Qdrant (vector search), and EventStoreDB into the
  runtime — currently provisioned in Docker but not connected in `main.ts`
- 🔜 Rate limiting, CSRF protection, and hardened client token storage
- 🔜 End-to-end test suite and coverage thresholds
- 🔜 Define the `migrate` / `seed` Turbo tasks for the root `pnpm db:*` scripts
- 🔜 Add a `LICENSE` file to match the stated license

**Future**

- 🧭 Live AI recommendations and knowledge-graph generation
- 🧭 External identity sync (ORCID, Google Scholar, GitHub)
- 🧭 Institutional dashboards and multi-tenant enterprise features

---

## Contributing

Contributions are welcome. Please read **[CONTRIBUTING.md](CONTRIBUTING.md)**
for the full workflow. In short:

1. Fork, clone, and `pnpm install`.
2. Branch with a conventional prefix: `feature/*`, `fix/*`, `refactor/*`,
   `docs/*`, `chore/*`.
3. Keep changes within layer and domain boundaries (see `.github/CODEOWNERS`).
4. Ensure the quality gate passes before opening a PR:

   ```bash
   bash scripts/quality-gate.sh
   ```

5. Fill out the PR template and request review from a code owner.

**Architecture rules** (enforced): respect layer boundaries, keep commands and
queries separate, never merge domains, and use the `Result` pattern instead of
throwing in domain/application code.

---

## Code Style

- **Formatting** — Prettier 3 (single quotes, semicolons, 100-char width; 80 for
  Markdown).
- **Linting** — ESLint 8 with `@typescript-eslint`, `import` (incl. `no-cycle`),
  `unused-imports`, and `perfectionist` for deterministic ordering.
- **Commits** — [Conventional Commits](https://www.conventionalcommits.org/)
  (`type(scope): description`), e.g. `feat(identity): add User aggregate root`.
- **Hooks** — Husky + lint-staged run ESLint and Prettier on staged files
  pre-commit.

### Continuous Integration

GitHub Actions (`.github/workflows/ci.yml`) runs five jobs on every push and PR
to `main`, on Node 22 with a frozen pnpm lockfile:

| Job              | Command                   |
| ---------------- | ------------------------- |
| **Lint**         | `pnpm turbo lint`         |
| **Typecheck**    | `pnpm turbo typecheck`    |
| **Build**        | `pnpm turbo build`        |
| **Test**         | `pnpm turbo test`         |
| **Format Check** | `pnpm prettier --check .` |

`build` and `test` depend on `lint` and `typecheck`; in-progress runs are
cancelled when new commits land on the same ref.

---

## License

Released under the **MIT License**.

> [!NOTE] An SPDX-compliant `LICENSE` file should be added to the repository
> root to match this declaration.

---

## Acknowledgements

Built on the work of the open-source community:

[Next.js](https://nextjs.org/) · [React](https://react.dev/) ·
[Express](https://expressjs.com/) · [Prisma](https://www.prisma.io/) ·
[PostgreSQL](https://www.postgresql.org/) ·
[TanStack Query](https://tanstack.com/query) ·
[Radix UI](https://www.radix-ui.com/) · [Tailwind CSS](https://tailwindcss.com/)
· [Zod](https://zod.dev/) · [react-hook-form](https://react-hook-form.com/) ·
[Framer Motion](https://www.framer.com/motion/) ·
[Turborepo](https://turbo.build/) · [Vitest](https://vitest.dev/) ·
[TypeScript](https://www.typescriptlang.org/)

<div align="center">
<br />
<sub>Designed and engineered with a focus on architecture, correctness, and developer experience.</sub>
</div>

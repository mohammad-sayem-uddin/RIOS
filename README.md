# RIOS — Research Identity Operating System

> Enterprise-grade, domain-driven monorepo for the Research Identity platform.

## Overview

RIOS is a comprehensive platform built with Domain-Driven Design, CQRS, and
Event Sourcing. This monorepo contains all application code, shared packages,
infrastructure configuration, and documentation.

## Technology Stack

| Layer                  | Technology               |
| ---------------------- | ------------------------ |
| **Runtime**            | Node.js 22 LTS           |
| **Language**           | TypeScript 5.8+          |
| **Package Manager**    | pnpm 10                  |
| **Build Orchestrator** | Turborepo                |
| **Frontend**           | React 19 + Next.js 15    |
| **Backend**            | Express (DDD/CQRS)       |
| **Database**           | PostgreSQL 17 + pgvector |
| **Event Store**        | EventStoreDB             |
| **Cache**              | Redis 7                  |
| **Vector Search**      | Qdrant                   |
| **UI Library**         | Radix UI + Tailwind CSS  |
| **State Management**   | TanStack Query           |
| **Testing**            | Vitest + Playwright      |
| **Linting**            | ESLint 9 + Prettier 3    |
| **CI/CD**              | GitHub Actions           |

## Architecture

RIOS follows **Clean Architecture** with **Domain-Driven Design** principles:

```
┌─────────────────────────────────────────────────┐
│  Frontend (Next.js 15 / React 19)               │
│  apps/frontend                                  │
├─────────────────────────────────────────────────┤
│  Presentation Layer                             │
│  packages/presentation (Express routes, DTOs)   │
├─────────────────────────────────────────────────┤
│  Application Layer                              │
│  packages/application (Commands, Queries, CQRS) │
├─────────────────────────────────────────────────┤
│  Domain Layer                                   │
│  packages/domain (Aggregates, Value Objects)     │
│  packages/identity (IAM bounded context)        │
├─────────────────────────────────────────────────┤
│  Infrastructure Layer                           │
│  packages/infrastructure (Persistence, Events)  │
├─────────────────────────────────────────────────┤
│  Shared Kernel                                  │
│  packages/shared (DDD primitives, CQRS, errors) │
└─────────────────────────────────────────────────┘
```

## Repository Structure

```
RIOS/
├── apps/
│   ├── api/                         # NestJS API server entry point
│   └── frontend/                    # React + Next.js 15 frontend (Vite)
├── packages/
│   ├── shared/                      # DDD building blocks, CQRS primitives, errors
│   ├── domain/                      # Domain aggregates across bounded contexts
│   ├── identity/                    # Identity & Access Management bounded context
│   ├── application/                 # Application services, commands, queries
│   ├── infrastructure/              # Persistence, event store, external integrations
│   ├── presentation/                # HTTP controllers, DTOs, routing, Swagger
│   └── typescript-config/           # Shared TS configurations
├── infrastructure/                  # Infrastructure-as-Code
├── docs/
│   ├── architecture/                # Architecture documentation
│   └── engineering/                 # Engineering playbook
├── scripts/                         # Build, quality gate, deployment scripts
├── tools/                           # Repository tooling
├── docker-compose.yml               # Local infrastructure
├── turbo.json                       # Turborepo configuration
├── pnpm-workspace.yaml              # pnpm workspace definition
└── vitest.config.ts                 # Vitest configuration
```

## Frontend Architecture

The frontend is a **Next.js 15 App Router** application with:

- **Design System**: HSL-based CSS custom properties with light/dark themes,
  elevation ramp, motion tokens
- **Component Library**: Radix UI primitives + class-variance-authority (CVA)
  for variant management
- **Data Layer**: TanStack Query with centralized query keys and typed domain
  services
- **Authentication**: JWT with automatic token refresh, session expiry
  broadcast, and route guards
- **Navigation**: Single-source nav config driving sidebar, command palette
  (⌘K), and breadcrumbs
- **Accessibility**: WCAG AA compliant with focus rings, ARIA, reduced-motion
  support
- **Motion**: Framer Motion with `prefers-reduced-motion` awareness

### Key Frontend Patterns

| Pattern         | Implementation                                                 |
| --------------- | -------------------------------------------------------------- |
| Workspace pages | `WorkspaceList` → `DataState` → `EmptyState` / `ErrorState`    |
| Form pages      | `FormShell` → `FormField` + `react-hook-form` + `zod`          |
| API layer       | `apiClient` → typed `services` → `useQuery` hooks              |
| Status pages    | `StatusScreen` for 403, 404, 500, session-expired, maintenance |

## Quick Start

### Prerequisites

- Node.js ≥ 22
- pnpm ≥ 10
- Docker & Docker Compose

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start infrastructure (PostgreSQL, EventStoreDB, Redis, Qdrant)
make infra-up

# Verify infrastructure health
make infra-health

# Build all packages
pnpm turbo build

# Run tests
pnpm turbo test

# Run quality gate
bash scripts/quality-gate.sh
```

### Development

```bash
# Start API server in development mode
pnpm turbo dev --filter=@rios/api

# Start frontend in development mode
pnpm turbo dev --filter=@rios/frontend

# Run linting
pnpm turbo lint

# Typecheck all packages
pnpm turbo typecheck
```

### Infrastructure

```bash
make infra-up          # Start all infrastructure services
make infra-down        # Stop all infrastructure services
make infra-health      # Run health checks
make infra-logs        # View logs
make infra-clean       # Remove volumes and containers
```

## Documentation

| Document                                                                                       | Description                   |
| ---------------------------------------------------------------------------------------------- | ----------------------------- |
| [Master Architecture Blueprint](docs/architecture/foundation/MASTER-ARCHITECTURE-BLUEPRINT.md) | System-wide architecture      |
| [Constitution](docs/architecture/foundation/Constitution.md)                                   | Project governance rules      |
| [ATLAS v11](docs/architecture/atlas/ATLAS-v11.md)                                              | Domain architecture atlas     |
| [Engineering Playbook](docs/engineering/00-Engineering-Vision.md)                              | Implementation guidance       |
| [ADR](docs/architecture/adr/ADR.md)                                                            | Architecture decision records |
| [CONTRIBUTING](CONTRIBUTING.md)                                                                | Contribution guidelines       |

## Sprint Status

| Sprint    | Status      | Description                                                |
| --------- | ----------- | ---------------------------------------------------------- |
| Sprint 0  | ✅ Complete | Repository bootstrap, infrastructure, shared foundations   |
| Sprint 1  | ✅ Complete | Identity Domain — aggregates, value objects, events        |
| Sprint 2  | ✅ Complete | Architecture consistency, production readiness audit       |
| Sprint 3  | ✅ Complete | Infrastructure layer — persistence, event store            |
| Sprint 4  | ✅ Complete | Presentation layer — controllers, routing, Swagger         |
| Sprint 5  | ✅ Complete | Identity & Access Management — auth, sessions, JWT         |
| Sprint 6  | ✅ Complete | Research Identity — vision, areas, goals, contributions    |
| Sprint 7  | ✅ Complete | Publications domain — manuscripts, venues, authors         |
| Sprint 8  | ✅ Complete | Research Projects — lifecycle, members, grants             |
| Sprint 9  | ✅ Complete | Research Assets — datasets, repositories                   |
| Sprint 10 | ✅ Complete | Academic Recognition — awards, grants, patents             |
| Sprint 11 | ✅ Complete | Research Intelligence — analytics, timeline, collaboration |
| Sprint 12 | ✅ Complete | Research Discovery — search, public profiles               |
| Sprint 13 | ✅ Complete | AI Intelligence — recommendations, knowledge graph         |
| Sprint 14 | ✅ Complete | Enterprise features — institutions, departments            |
| Sprint 15 | ✅ Complete | Production elevation, frontend polish, certification       |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

Proprietary — All rights reserved.

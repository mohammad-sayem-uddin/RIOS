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
| **Frontend**           | React 19                 |
| **Backend**            | NestJS 11                |
| **Database**           | PostgreSQL 17 + pgvector |
| **Event Store**        | EventStoreDB             |
| **Cache**              | Redis 7                  |
| **Vector Search**      | Qdrant                   |
| **Testing**            | Vitest + Playwright      |
| **Linting**            | ESLint 9 + Prettier 3    |
| **CI/CD**              | GitHub Actions           |

## Repository Structure

```
RIOS/
├── apps/
│   ├── api/                         # NestJS API server
│   └── frontend/                    # React frontend (Vite)
├── packages/
│   ├── shared/                      # DDD building blocks, CQRS primitives, errors
│   ├── domain/                      # Domain layer (future)
│   ├── application/                 # Application layer (future)
│   ├── infrastructure/              # Infrastructure layer (future)
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

| Sprint   | Status      | Description                                              |
| -------- | ----------- | -------------------------------------------------------- |
| Sprint 0 | ✅ Complete | Repository bootstrap, infrastructure, shared foundations |
| Sprint 1 | 🔲 Planned  | Identity Domain implementation                           |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

Proprietary — All rights reserved.

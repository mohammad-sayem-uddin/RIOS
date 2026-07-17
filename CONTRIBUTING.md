# Contributing to RIOS

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies: `pnpm install`
4. Copy environment variables: `cp .env.example .env`
5. Start infrastructure: `make infra-up`
6. Create a feature branch: `git checkout -b feature/your-feature`

## Development Workflow

### Branch Naming

- `feature/*` — New features
- `fix/*` — Bug fixes
- `refactor/*` — Code refactoring
- `docs/*` — Documentation changes
- `chore/*` — Maintenance tasks

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`

**Scopes:** `shared`, `domain`, `application`, `infrastructure`, `api`,
`frontend`, `docker`, `ci`

**Examples:**

```
feat(identity): add User aggregate root
fix(shared): correct Result.fromPromise error handling
docs(architecture): update Volume I Chapter 3
test(shared): add ValueObject equality tests
```

### Code Quality

Before submitting a PR, ensure:

```bash
# Linting passes
pnpm turbo lint

# Formatting passes
pnpm prettier --check .

# TypeScript compiles
pnpm turbo typecheck

# Tests pass
pnpm turbo test

# Full quality gate
bash scripts/quality-gate.sh
```

### Architecture Rules

- **Never** merge domains
- **Never** violate CQRS (commands write, queries read)
- **Never** violate Event Sourcing (immutable events, replayable)
- **Never** change ADR decisions without a new ADR
- **Never** introduce technology outside the approved stack
- **Always** respect layer boundaries (Shared → Domain → Application →
  Infrastructure)
- **Always** use the Result pattern for error handling (no thrown exceptions in
  domain/application)

### Pull Request Process

1. Ensure all quality gates pass
2. Update documentation if needed
3. Fill out the PR template
4. Request review from a code owner
5. Squash merge into `main`

### Testing

- Write unit tests for all domain logic
- Write integration tests for infrastructure adapters
- Write E2E tests for critical user flows
- Aim for meaningful coverage, not arbitrary percentages

## Architecture References

- [Master Architecture Blueprint](docs/architecture/foundation/MASTER-ARCHITECTURE-BLUEPRINT.md)
- [Constitution](docs/architecture/foundation/Constitution.md)
- [Engineering Playbook](docs/engineering/00-Engineering-Vision.md)
- [ATLAS v11](docs/architecture/atlas/ATLAS-v11.md)
- [ADR](docs/architecture/adr/ADR.md)

# 15 — Engineering Standards

**Version:** 1.0  
**Status:** Normative  
**Parent:** RIOS Master Architecture Blueprint (MAB)  
**Cross-References:** Volume VII (Engineering), Editorial Standard, DMS,
Constitution

---

## 1. Purpose

This document defines the universal engineering standards for RIOS. Every line
of code, every API, every configuration file, and every documentation artifact
must conform to these standards. Standards enable consistency, maintainability,
and deterministic AI-assisted development.

---

## 2. Coding Standards

### 2.1 Language Configuration

| Setting       | Value                    |
| ------------- | ------------------------ |
| Language      | TypeScript 5.x           |
| Strict mode   | Enabled (`strict: true`) |
| Target        | ES2022                   |
| Module system | ESM (`"type": "module"`) |
| JSX           | React 18                 |

### 2.2 TypeScript Rules

| ID     | Rule                                                     |
| ------ | -------------------------------------------------------- |
| TS-001 | `strict: true` in all tsconfig files                     |
| TS-002 | No `any` type (use `unknown` + type guards)              |
| TS-003 | No type assertions (`as`) without documented reason      |
| TS-004 | Return types explicitly declared on public methods       |
| TS-005 | Parameters typed (no implicit `any`)                     |
| TS-006 | Interfaces preferred over type aliases for object shapes |
| TS-007 | Enums replaced with const objects + union types          |
| TS-008 | Discriminated unions for variant types                   |

### 2.3 Code Style

| Setting         | Value          | Tool               |
| --------------- | -------------- | ------------------ |
| Formatter       | Prettier       | `.prettierrc`      |
| Linter          | ESLint         | `eslint.config.js` |
| Indentation     | 2 spaces       | Prettier           |
| Line width      | 100 characters | Prettier           |
| Quotes          | Single quotes  | Prettier           |
| Semicolons      | Always         | Prettier           |
| Trailing commas | All            | Prettier           |

### 2.4 Prettier Configuration

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always",
  "bracketSpacing": true,
  "endOfLine": "lf"
}
```

### 2.5 ESLint Rules (Key)

| Category   | Rule                                   | Level |
| ---------- | -------------------------------------- | ----- |
| Naming     | `@typescript-eslint/naming-convention` | Error |
| Unused     | `@typescript-eslint/no-unused-vars`    | Error |
| Imports    | `import/order` (sorted, grouped)       | Error |
| Complexity | `complexity` (max 10)                  | Warn  |
| Depth      | `max-depth` (max 3)                    | Warn  |
| Lines      | `max-lines-per-function` (max 50)      | Warn  |
| Parameters | `max-params` (max 4)                   | Warn  |

---

## 3. Naming Conventions

### 3.1 Code Naming

| Element               | Convention                     | Example                    |
| --------------------- | ------------------------------ | -------------------------- |
| Classes               | PascalCase                     | `ResearcherAggregate`      |
| Interfaces            | PascalCase (I prefix optional) | `IResearcherRepository`    |
| Types                 | PascalCase                     | `DomainEvent`              |
| Enums                 | PascalCase                     | `MaturityLevel`            |
| Functions             | camelCase                      | `createResearcher()`       |
| Variables             | camelCase                      | `researcherId`             |
| Constants             | SCREAMING_SNAKE_CASE           | `MAX_RETRY_COUNT`          |
| Files (components)    | PascalCase                     | `ResearcherCard.tsx`       |
| Files (utilities)     | camelCase                      | `formatDate.ts`            |
| Files (tests)         | kebab-case + `.test.ts`        | `researcher.test.ts`       |
| Directories           | kebab-case                     | `intellectual-direction/`  |
| Database tables       | snake_case (plural)            | `researchers`              |
| Database columns      | snake_case                     | `created_at`               |
| API routes            | kebab-case                     | `/api/v1/research-agendas` |
| Environment variables | SCREAMING_SNAKE_CASE           | `DB_HOST`                  |
| CSS classes           | BEM or kebab-case              | `.researcher-card__name`   |

### 3.2 Domain Naming

| Element         | Convention               | Example                        |
| --------------- | ------------------------ | ------------------------------ |
| Aggregates      | Domain noun              | `Researcher`, `ResearchAgenda` |
| Value Objects   | Descriptive noun         | `ResearcherName`, `Email`      |
| Domain Services | Verb + noun              | `IdentitySynthesizer`          |
| Commands        | Verb + noun (imperative) | `SynthesizeIdentityCommand`    |
| Domain Events   | Noun + verb (past)       | `IdentitySynthesizedEvent`     |
| Query           | Noun + verb (noun form)  | `GetIdentityOverviewQuery`     |
| Repositories    | Entity + Repository      | `ResearcherRepository`         |
| Factories       | Entity + Factory         | `ResearcherFactory`            |

### 3.3 Naming Rules

| ID       | Rule                                                     |
| -------- | -------------------------------------------------------- |
| NAME-001 | Names are descriptive and unambiguous                    |
| NAME-002 | Abbreviations avoided except well-known (API, URL, ID)   |
| NAME-003 | Boolean variables prefixed: `is`, `has`, `can`, `should` |
| NAME-004 | Collections use plural nouns: `researchers`, `events`    |
| NAME-005 | Domain language matches ubiquitous language              |

---

## 4. Documentation Standards

### 4.1 Code Documentation

| Element            | Requirement                                     |
| ------------------ | ----------------------------------------------- |
| Public classes     | JSDoc with purpose, usage, examples             |
| Public methods     | JSDoc with params, returns, throws              |
| Complex algorithms | Inline comments explaining "why"                |
| Magic numbers      | Named constants with explanation                |
| TODO comments      | Format: `// TODO(author): description — ticket` |

### 4.2 JSDoc Template

````typescript
/**
 * Synthesizes a researcher's identity from knowledge evidence.
 *
 * This service analyzes the researcher's research agenda, evidence chains,
 * and intellectual direction to produce a synthesized identity representation.
 *
 * @param command - The synthesis command containing researcher context
 * @returns The synthesized identity with confidence scores
 * @throws {ResearcherNotFoundError} If researcher does not exist
 * @throws {InsufficientEvidenceError} If knowledge evidence is insufficient
 *
 * @example
 * ```typescript
 * const identity = await synthesizer.synthesize({
 *   researcherId: 'uuid-123',
 * });
 * ```
 */
async synthesize(command: SynthesizeIdentityCommand): Promise<IdentitySynthesis> {
  // Implementation
}
````

### 4.3 Documentation Rules

| ID      | Rule                                                    |
| ------- | ------------------------------------------------------- |
| DOC-001 | All public APIs documented with JSDoc                   |
| DOC-002 | README.md in every package root                         |
| DOC-003 | Architecture Decision Records for significant decisions |
| DOC-004 | Runbooks for operational procedures                     |
| DOC-005 | Changelog maintained for every package                  |
| DOC-006 | Code comments explain "why", not "what"                 |

---

## 5. API Standards

### 5.1 REST API Design

| Aspect       | Standard                                 |
| ------------ | ---------------------------------------- |
| Style        | RESTful                                  |
| Versioning   | URL path: `/api/v1/`                     |
| Content type | `application/json`                       |
| Date format  | ISO 8601 (`2025-01-15T10:30:00Z`)        |
| ID format    | UUID v4                                  |
| Pagination   | Cursor-based                             |
| Sorting      | Query parameter: `?sort=created_at:desc` |
| Filtering    | Query parameter: `?filter[field]=value`  |
| Error format | RFC 7807 Problem Details                 |

### 5.2 API Response Format

```typescript
// Success response
interface ApiResponse<T> {
  data: T;
  meta?: {
    cursor?: string;
    hasMore?: boolean;
    total?: number;
  };
}

// Error response (RFC 7807)
interface ApiError {
  type: string; // URI reference
  title: string; // Human-readable summary
  status: number; // HTTP status code
  detail: string; // Human-readable explanation
  instance: string; // URI reference to specific occurrence
  errors?: Record<string, string[]>; // Field-level errors
}
```

### 5.3 HTTP Status Codes

| Code | Usage                                          |
| ---- | ---------------------------------------------- |
| 200  | Successful read/update                         |
| 201  | Successful creation                            |
| 204  | Successful deletion (no content)               |
| 400  | Validation error                               |
| 401  | Authentication required                        |
| 403  | Authorization denied                           |
| 404  | Resource not found                             |
| 409  | Conflict (duplicate, version mismatch)         |
| 422  | Unprocessable entity (business rule violation) |
| 429  | Rate limit exceeded                            |
| 500  | Internal server error                          |

### 5.4 API Rules

| ID      | Rule                                                  |
| ------- | ----------------------------------------------------- |
| API-001 | All endpoints under `/api/v1/`                        |
| API-002 | Resource names are plural nouns                       |
| API-003 | Nested resources limited to 2 levels                  |
| API-004 | Request/response validated with Zod                   |
| API-005 | OpenAPI 3.1 specification maintained                  |
| API-006 | API backward compatibility maintained within versions |
| API-007 | Breaking changes require new API version              |

---

## 6. Error Handling Standards

### 6.1 Error Hierarchy

```typescript
// packages/shared/src/errors/

abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(
    message: string,
    readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

class ResearcherNotFoundError extends DomainError {
  readonly code = 'RESEARCHER_NOT_FOUND';
  readonly statusCode = 404;
}

class InsufficientEvidenceError extends DomainError {
  readonly code = 'INSUFFICIENT_EVIDENCE';
  readonly statusCode = 422;
}

class ConcurrentModificationError extends DomainError {
  readonly code = 'CONCURRENT_MODIFICATION';
  readonly statusCode = 409;
}
```

### 6.2 Error Handling Rules

| ID      | Rule                                                      |
| ------- | --------------------------------------------------------- |
| ERR-001 | Domain errors extend `DomainError` base class             |
| ERR-002 | Infrastructure errors wrapped, never leaked to API        |
| ERR-003 | Error messages are human-readable                         |
| ERR-004 | Internal details never exposed in production errors       |
| ERR-005 | All errors logged with context before returning           |
| ERR-006 | Async errors caught and handled (no unhandled rejections) |
| ERR-007 | Error codes are stable strings (not numeric)              |

---

## 7. Logging Standards

### 7.1 Logging Rules

| ID          | Rule                                              |
| ----------- | ------------------------------------------------- |
| LOG-STD-001 | Use structured JSON logging (pino)                |
| LOG-STD-002 | Include correlation ID in every log entry         |
| LOG-STD-003 | Log levels: debug < info < warn < error < fatal   |
| LOG-STD-004 | Default level: info (dev), warn (production)      |
| LOG-STD-005 | NEVER log sensitive data (passwords, tokens, PII) |
| LOG-STD-006 | Error logs include stack trace                    |
| LOG-STD-007 | Request/response logged at debug level            |

---

## 8. Configuration Standards

### 8.1 Configuration Rules

| ID       | Rule                                                |
| -------- | --------------------------------------------------- |
| CONF-001 | All configuration validated at startup (Zod)        |
| CONF-002 | No configuration values hardcoded in source         |
| CONF-003 | Environment variables for all runtime configuration |
| CONF-004 | Defaults defined for all non-sensitive values       |
| CONF-005 | Configuration errors fail fast (don't start)        |
| CONF-006 | `.env.example` documents all variables              |

---

## 9. Import Standards

### 9.1 Import Order

```typescript
// 1. Node.js built-in modules
import { randomUUID } from 'node:crypto';
import path from 'node:path';

// 2. External packages
import { Injectable } from '@nestjs/common';
import { z } from 'zod';

// 3. Shared packages
import { DomainEvent } from '@rios/shared';

// 4. Domain imports
import { Researcher } from '../domain/Researcher';
import { ResearcherName } from '../domain/value-objects/ResearcherName';

// 5. Relative imports
import { CreateResearcherCommand } from './commands/CreateResearcherCommand';
```

### 9.2 Import Rules

| ID      | Rule                                           |
| ------- | ---------------------------------------------- |
| IMP-001 | Imports sorted by category (see above)         |
| IMP-002 | No circular dependencies                       |
| IMP-003 | Package aliases used: `@rios/domains/identity` |
| IMP-004 | No barrel file re-exports from other barrels   |
| IMP-005 | Type-only imports use `import type`            |

---

## 10. File Organization Standards

### 10.1 File Size Limits

| Metric                  | Maximum  |
| ----------------------- | -------- |
| Lines per file          | 300      |
| Lines per function      | 50       |
| Functions per file      | 10       |
| Parameters per function | 4        |
| Nesting depth           | 3 levels |
| Cyclomatic complexity   | 10       |

### 10.2 File Organization Rules

| ID       | Rule                                                             |
| -------- | ---------------------------------------------------------------- |
| FILE-001 | One class/interface per file (exceptions: closely related types) |
| FILE-002 | Test file co-located with source: `__tests__/` directory         |
| FILE-003 | Index files used only for re-exports                             |
| FILE-004 | Constants in dedicated files (`constants.ts`)                    |
| FILE-005 | Types in dedicated files (`types.ts`)                            |

---

_This document is part of the RIOS Engineering Blueprint. It is subordinate to
the Master Architecture Blueprint, Architecture Governance Standard, and all
normative architecture documents._

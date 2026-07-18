# Research Identity — Aggregate Mapping Strategy

## 1. Domain Persistence Inventory

### Aggregate Root

| Domain Object        | Type                             | Persisted | Storage Strategy                             |
| -------------------- | -------------------------------- | --------- | -------------------------------------------- |
| ResearchIdentity     | Aggregate Root                   | Yes       | Primary table `research_identities`          |
| ResearchVision       | Entity (child, 1:1, immutable)   | Yes       | Embedded columns in aggregate row            |
| ResearchAgenda       | Entity (child, 1:1)              | Yes       | Separate table `research_agendas`            |
| ResearchPhilosophy   | Entity (child, 1:1, optional)    | Yes       | Separate table `research_philosophies`       |
| ResearchValues       | Entity (child, 1:1, optional)    | Yes       | Separate table `research_values_collections` |
| ResearchArea         | Entity (child, 1:N collection)   | Yes       | Separate table `research_areas`              |
| ResearchQuestion     | Entity (child, 1:N collection)   | Yes       | Separate table `research_questions`          |
| ResearchGoal         | Entity (child, 1:N collection)   | Yes       | Separate table `research_goals`              |
| ResearchContribution | Entity (child, 1:N collection)   | Yes       | Separate table `research_contributions`      |
| ResearchEvolution    | Entity (child, 1:N, append-only) | Yes       | Separate table `research_evolutions`         |
| ResearchMilestone    | Entity (child, 1:N collection)   | Yes       | Separate table `research_milestones`         |

### Value Objects — Persistence Strategy

| Value Object            | Strategy                       | Justification                                         |
| ----------------------- | ------------------------------ | ----------------------------------------------------- |
| ResearchVisionStatement | Flatten to TEXT column         | Single validated string, no internal structure        |
| ResearchFocus           | Flatten to VARCHAR(500) column | Single validated string                               |
| ConfidenceLevel         | Flatten to INTEGER column      | Numeric range 0-100, used in calculations             |
| ResearchStatus          | Database ENUM type             | Bounded set: active, archived, emerging, completed    |
| PriorityLevel           | Database ENUM type             | Bounded set: critical, high, medium, low              |
| MaturityLevel           | Database ENUM type             | Bounded set: nascent, developing, mature, established |
| CompletenessScore       | Flatten to INTEGER column      | Numeric range 0-100, used in calculations             |

### Collection Value Objects — Persistence Strategy

| Collection                | Strategy           | Justification                                                      |
| ------------------------- | ------------------ | ------------------------------------------------------------------ |
| principles (string[])     | JSONB array column | Ordered list, bounded to Philosophy entity, no individual querying |
| priorities (string[])     | JSONB array column | Ordered list, bounded to Agenda entity, no individual querying     |
| values (string[])         | JSONB array column | Ordered list, bounded to Values entity, no individual querying     |
| milestoneIds (UniqueId[]) | JSONB UUID array   | FK references within same aggregate boundary                       |

### Domain Events

| Event                 | Persisted      | Strategy                     |
| --------------------- | -------------- | ---------------------------- |
| ResearchAgendaCreated | Transient only | Published via Outbox pattern |
| ResearchAgendaUpdated | Transient only | Published via Outbox pattern |
| ResearchAreaAdded     | Transient only | Published via Outbox pattern |
| ResearchAreaArchived  | Transient only | Published via Outbox pattern |
| ResearchQuestionAdded | Transient only | Published via Outbox pattern |
| PhilosophyRevised     | Transient only | Published via Outbox pattern |
| EvolutionUpdated      | Transient only | Published via Outbox pattern |
| GoalAchieved          | Transient only | Published via Outbox pattern |

### Specifications, Policies, Factories, Errors

| Type               | Persisted | Strategy                                               |
| ------------------ | --------- | ------------------------------------------------------ |
| All specifications | No        | Translated to query params via SpecificationTranslator |
| All policies       | No        | Pure behavior, stateless                               |
| All factories      | No        | Pure creation logic                                    |
| All errors         | No        | Runtime only                                           |

---

## 2. Aggregate Mapping Table

```
ResearchIdentity (Aggregate Root)
│
├── research_identities TABLE (primary)
│   ├── id: UUID PK
│   ├── profile_id: VARCHAR(255) UNIQUE
│   ├── vision_statement: TEXT (from ResearchVision.statement)
│   ├── vision_focus: VARCHAR(500) (from ResearchVision.focus)
│   ├── vision_status: research_status ENUM (from ResearchVision.status)
│   ├── vision_confidence: INTEGER (from ResearchVision.confidence)
│   ├── version: INTEGER DEFAULT 0
│   ├── created_at: TIMESTAMPTZ
│   └── updated_at: TIMESTAMPTZ
│
├── research_agendas TABLE
│   ├── id: UUID PK
│   ├── identity_id: UUID FK → research_identities.id CASCADE
│   ├── statement: TEXT
│   ├── priorities: JSONB (string[])
│   ├── version: INTEGER DEFAULT 0
│   ├── created_at: TIMESTAMPTZ
│   └── updated_at: TIMESTAMPTZ
│
├── research_philosophies TABLE
│   ├── id: UUID PK
│   ├── identity_id: UUID FK → research_identities.id CASCADE
│   ├── statement: TEXT
│   ├── principles: JSONB (string[])
│   ├── version: INTEGER DEFAULT 0
│   ├── created_at: TIMESTAMPTZ
│   └── updated_at: TIMESTAMPTZ
│
├── research_values_collections TABLE
│   ├── id: UUID PK
│   ├── identity_id: UUID FK → research_identities.id CASCADE
│   ├── statement: TEXT
│   ├── values: JSONB (string[])
│   ├── version: INTEGER DEFAULT 0
│   ├── created_at: TIMESTAMPTZ
│   └── updated_at: TIMESTAMPTZ
│
├── research_areas TABLE
│   ├── id: UUID PK
│   ├── identity_id: UUID FK → research_identities.id CASCADE
│   ├── name: VARCHAR(500)
│   ├── description: TEXT
│   ├── category: VARCHAR(255)
│   ├── priority: priority_level ENUM
│   ├── status: research_status ENUM
│   ├── maturity: maturity_level ENUM
│   ├── version: INTEGER DEFAULT 0
│   ├── created_at: TIMESTAMPTZ
│   ├── updated_at: TIMESTAMPTZ
│   └── archived_at: TIMESTAMPTZ NULLABLE
│
├── research_questions TABLE
│   ├── id: UUID PK
│   ├── identity_id: UUID FK → research_identities.id CASCADE
│   ├── question: VARCHAR(500)
│   ├── rationale: TEXT
│   ├── priority: priority_level ENUM
│   ├── status: research_status ENUM
│   ├── version: INTEGER DEFAULT 0
│   ├── created_at: TIMESTAMPTZ
│   └── updated_at: TIMESTAMPTZ
│
├── research_goals TABLE
│   ├── id: UUID PK
│   ├── identity_id: UUID FK → research_identities.id CASCADE
│   ├── title: TEXT
│   ├── description: TEXT
│   ├── priority: priority_level ENUM
│   ├── status: research_status ENUM
│   ├── confidence: INTEGER
│   ├── version: INTEGER DEFAULT 0
│   ├── created_at: TIMESTAMPTZ
│   ├── updated_at: TIMESTAMPTZ
│   └── completed_at: TIMESTAMPTZ NULLABLE
│
├── research_contributions TABLE
│   ├── id: UUID PK
│   ├── identity_id: UUID FK → research_identities.id CASCADE
│   ├── title: TEXT
│   ├── description: TEXT
│   ├── type: VARCHAR(255)
│   ├── date: VARCHAR(50)
│   ├── impact: TEXT
│   ├── version: INTEGER DEFAULT 0
│   └── created_at: TIMESTAMPTZ
│
├── research_evolutions TABLE
│   ├── id: UUID PK
│   ├── identity_id: UUID FK → research_identities.id CASCADE
│   ├── description: VARCHAR(500)
│   ├── status: research_status ENUM
│   ├── confidence: INTEGER
│   ├── milestone_ids: JSONB (UUID[])
│   ├── recorded_at: TIMESTAMPTZ
│   ├── version: INTEGER DEFAULT 0
│   └── created_at: TIMESTAMPTZ
│
└── research_milestones TABLE
    ├── id: UUID PK
    ├── identity_id: UUID FK → research_identities.id CASCADE
    ├── description: VARCHAR(500)
    ├── confidence: INTEGER
    ├── occurred_at: DATE
    ├── version: INTEGER DEFAULT 0
    └── created_at: TIMESTAMPTZ
```

### Database ENUMs

```sql
CREATE TYPE research_status AS ENUM ('active', 'archived', 'emerging', 'completed');
CREATE TYPE priority_level AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE maturity_level AS ENUM ('nascent', 'developing', 'mature', 'established');
```

---

## 3. Value Object Mapping Strategy

### Primitive Value Objects

| Value Object            | Domain Type        | DB Column Type | Direction                                        |
| ----------------------- | ------------------ | -------------- | ------------------------------------------------ |
| ResearchVisionStatement | VO wrapping string | TEXT           | toPersistence: `.value`; toDomain: `new VO(raw)` |
| ResearchFocus           | VO wrapping string | VARCHAR(500)   | toPersistence: `.value`; toDomain: `new VO(raw)` |
| ConfidenceLevel         | VO wrapping number | INTEGER        | toPersistence: `.value`; toDomain: `new VO(raw)` |
| CompletenessScore       | VO wrapping number | INTEGER        | toPersistence: `.value`; toDomain: `new VO(raw)` |

### Enum Value Objects

| Value Object   | Domain Type       | DB Column Type       | Direction                                    |
| -------------- | ----------------- | -------------------- | -------------------------------------------- |
| ResearchStatus | String union enum | ENUM research_status | toPersistence: `.value`; toDomain: enum cast |
| PriorityLevel  | String union enum | ENUM priority_level  | toPersistence: `.value`; toDomain: enum cast |
| MaturityLevel  | String union enum | ENUM maturity_level  | toPersistence: `.value`; toDomain: enum cast |

### Collection Value Objects

| Value Object | Domain Type | DB Column Type | Direction                                                                         |
| ------------ | ----------- | -------------- | --------------------------------------------------------------------------------- |
| principles   | string[]    | JSONB          | toPersistence: spread; toDomain: spread + freeze                                  |
| priorities   | string[]    | JSONB          | toPersistence: spread; toDomain: spread + freeze                                  |
| values       | string[]    | JSONB          | toPersistence: spread; toDomain: spread + freeze                                  |
| milestoneIds | UniqueId[]  | JSONB UUID[]   | toPersistence: `.map(id => id.value)`; toDomain: `.map(raw => new UniqueId(raw))` |

---

## 4. Snapshot Strategy

### Flow

```
Domain Aggregate
    ↓ toSnapshot()
Domain Snapshot (domain-owned DTO, uses domain types)
    ↓ AggregateMapper.toPersistence()
Persistence Entity (infrastructure-owned, uses primitives)
    ↓ RowMapper.toRow()
Database Row (technology-specific)
```

### Reverse Flow

```
Database Row
    ↓ RowMapper.fromRow()
Persistence Entity
    ↓ AggregateMapper.toDomain()
Domain Aggregate (reconstituted via factory)
```

### Design Decisions

- **Snapshot** is the domain's output contract. It contains domain types
  (UniqueId, VOs).
- **Persistence Entity** is infrastructure's input contract. It contains only
  primitives (string, number, boolean).
- **Snapshot and Persistence Entity are NOT duplicates.** They serve different
  architectural layers with different type systems.
- **Snapshot is used for save path.** Domain calls `toSnapshot()`, mapper
  converts.
- **Persistence Entity is used for load path.** Mapper constructs, calls
  `reconstitute()`.

---

## 5. Enum Strategy

| Enum              | Values                                   | DB Type       | Justification                                                             |
| ----------------- | ---------------------------------------- | ------------- | ------------------------------------------------------------------------- |
| ResearchStatus    | active, archived, emerging, completed    | Database ENUM | Bounded, stable, used in WHERE clauses, benefits from DB-level constraint |
| PriorityLevel     | critical, high, medium, low              | Database ENUM | Bounded, stable, used in sorting/filtering                                |
| MaturityLevel     | nascent, developing, mature, established | Database ENUM | Bounded, stable, used in queries                                          |
| ConfidenceLevel   | 0-100 integer                            | INTEGER       | Not an enum; numeric range used in calculations                           |
| CompletenessScore | 0-100 integer                            | INTEGER       | Not an enum; numeric range used in calculations                           |

**Enum Value Mapping (Domain → DB):**

- All enum values are lowercase snake_case strings
- Domain enum values already use lowercase (e.g., `'active'`, `'critical'`,
  `'nascent'`)
- Direct string mapping, no transformation needed

---

## 6. Identifier Strategy

| Identifier          | Domain Type | DB Type | Format  | Generation                               |
| ------------------- | ----------- | ------- | ------- | ---------------------------------------- |
| All entity IDs      | UniqueId    | UUID    | UUID v4 | Domain-generated via `UniqueId.create()` |
| FK references       | UniqueId    | UUID    | UUID v4 | Copied from parent aggregate ID          |
| ResearchIdentity.id | UniqueId    | UUID PK | UUID v4 | Domain-generated                         |

**Decisions:**

- ALL identifiers are UUID v4
- Generated at domain creation time, NEVER by the database
- Foreign keys are UUID type matching the referenced PK
- No composite keys anywhere
- `UniqueId.value` (string) maps to UUID column in database
- UniqueId equality via `.equals()` (value-based comparison)

---

## 7. Versioning Strategy

### Optimistic Locking

- Every table includes a `version` column (INTEGER, DEFAULT 0)
- Incremented on every write operation
- Checked on every update: `WHERE version = <expected>`
- Conflict throws `ConcurrencyConflictError`
- Version is managed by the repository implementation, not the domain

### Audit Fields

| Field        | Tables              | Type                 | Behavior                             |
| ------------ | ------------------- | -------------------- | ------------------------------------ |
| created_at   | ALL                 | TIMESTAMPTZ          | Set once on creation, immutable      |
| updated_at   | All mutable tables  | TIMESTAMPTZ          | Set on every update                  |
| archived_at  | research_areas only | TIMESTAMPTZ NULLABLE | Set when area is archived            |
| completed_at | research_goals only | TIMESTAMPTZ NULLABLE | Set when goal is completed           |
| recorded_at  | research_evolutions | TIMESTAMPTZ          | Set on creation (append-only entity) |

### Soft Delete

- NOT implemented. No `deleted_at` column.
- Archives use status field (`status = 'archived'`) + `archived_at` timestamp.
- Deletion is cascade-delete from aggregate root.

### Future Migration Support

- All timestamps as TIMESTAMPTZ (timezone-aware)
- UUID PKs (merge-safe, no sequential conflicts)
- JSONB for array data (schema-flexible)
- Version field supports future schema evolution

---

## 8. AggregateMapper Assessment

### Current Contract

```typescript
interface AggregateMapper<TPersistence, TDomain> {
  toDomain(persistenceEntity: TPersistence): TDomain;
  toPersistence(aggregate: TDomain): TPersistence;
}

interface RowMapper<TPersistence, TRow> {
  fromRow(row: TRow): TPersistence;
  toRow(entity: TPersistence): TRow;
}

interface SpecificationTranslator<TSpecification, TQueryParams> {
  translate(specification: TSpecification): TQueryParams;
}
```

### Assessment: SUFFICIENT

The existing contracts are architecturally complete. They correctly separate:

1. **AggregateMapper** — domain ↔ persistence entity (VO reconstruction, entity
   assembly)
2. **RowMapper** — persistence entity ↔ database row (primitive serialization)
3. **SpecificationTranslator** — domain spec → query params

### Required Mapper Implementations

| Mapper                     | toDomain                                 | toPersistence                          | Key Concerns                                  |
| -------------------------- | ---------------------------------------- | -------------------------------------- | --------------------------------------------- |
| ResearchIdentityMapper     | Reconstitute aggregate with all children | Flatten VOs, extract child collections | Orchestrates child mappers                    |
| ResearchAgendaMapper       | Reconstitute VO from JSONB               | Spread VO to JSONB                     | priorities array handling                     |
| ResearchPhilosophyMapper   | Reconstitute VO from JSONB               | Spread VO to JSONB                     | principles array handling                     |
| ResearchValuesMapper       | Reconstitute VO from JSONB               | Spread VO to JSONB                     | values array handling                         |
| ResearchAreaMapper         | Reconstitute VOs from primitives         | Flatten all VOs                        | Multiple enum/VO fields                       |
| ResearchQuestionMapper     | Reconstitute VOs from primitives         | Flatten all VOs                        | Multiple enum/VO fields                       |
| ResearchGoalMapper         | Reconstitute VOs from primitives         | Flatten all VOs                        | Multiple enum/VO fields, nullable completedAt |
| ResearchContributionMapper | Reconstitute from primitives             | Flatten to primitives                  | Simplest mapper                               |
| ResearchEvolutionMapper    | Reconstruct UniqueId[] from JSONB        | Serialize UniqueId[] to JSONB          | milestoneIds cross-reference                  |
| ResearchMilestoneMapper    | Reconstitute VOs from primitives         | Flatten VOs                            | Immutable entity                              |

### Method Responsibilities

| Method                        | Responsibility                                                                                              |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `toDomain(persistenceEntity)` | Reconstruct Value Objects from primitives, rebuild entity collections, call `Entity.reconstitute()` factory |
| `toPersistence(aggregate)`    | Extract VO values to primitives, flatten collections, preserve all data for storage                         |
| `RowMapper.fromRow(row)`      | Type coercion from DB types (string→number for confidence, JSON string→array, date parsing)                 |
| `RowMapper.toRow(entity)`     | Serialize to DB-compatible primitives (number→integer, array→JSON string, date→ISO string)                  |

**No contract modifications needed.**

---

## 9. Prisma Readiness Assessment

| Prisma Requirement   | Status     | Notes                                      |
| -------------------- | ---------- | ------------------------------------------ |
| Model definitions    | Ready      | 11 tables with complete column definitions |
| Relations (1:1, 1:N) | Ready      | Clear FK relationships with cascade rules  |
| Enum definitions     | Ready      | 3 database enums defined                   |
| JSON fields          | Ready      | 4 JSONB fields for string/UUID arrays      |
| Unique constraints   | Ready      | All PKs are UUID, profile_id is unique     |
| Indexes              | Identified | All identity_id FK columns need indexes    |
| Cascade rules        | Ready      | DELETE cascade from aggregate to children  |
| Default values       | Ready      | version=0, timestamps                      |
| Optional relations   | Ready      | Philosophy and Values are optional 1:1     |

**No missing information. The mapping strategy is sufficient to produce a
complete Prisma schema.**

---

## 10. Risks

| Risk                                                                         | Severity | Mitigation                                                                            |
| ---------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------- |
| JSONB arrays (principles, priorities, values) cannot be individually queried | Low      | Current domain usage is list/append/remove within aggregate boundary only             |
| Evolution milestoneIds as JSONB UUIDs cross-reference within aggregate       | Low      | If querying milestones from evolution perspective becomes common, consider join table |
| Vision embedded in aggregate row may need extraction if it grows             | Low      | Current 4-field structure is appropriate for embedding                                |
| Database ENUMs require migration to add new values                           | Medium   | If domain enums expand frequently, consider VARCHAR + CHECK constraints instead       |

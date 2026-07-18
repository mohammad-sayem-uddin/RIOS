/**
 * Purpose:
 * Defines the mapping strategy between persistence entities and domain aggregates.
 *
 * Architecture reference:
 * Infrastructure Layer — Mapping Strategy.
 *
 * Mapping flow:
 *   Database Row/Document
 *         ↓
 *   Persistence Entity (Infrastructure-owned shape)
 *         ↓
 *   Domain Aggregate (via reconstitute())
 *
 * Reverse flow:
 *   Domain Aggregate
 *         ↓
 *   Snapshot (via toSnapshot())
 *         ↓
 *   Persistence Entity
 *         ↓
 *   Database Row/Document
 *
 * This interface:
 * - Defines the contract for all aggregate mappers.
 * - Ensures type-safe bidirectional mapping.
 * - Keeps persistence shapes internal to Infrastructure.
 * - Domain never sees persistence entities.
 *
 * This interface does NOT:
 * - Contain business logic.
 * - Know about specific ORM or database technology.
 * - Leak persistence types to Domain or Application.
 *
 * Dependency rule:
 * Infrastructure → Identity (domain types). Never reverse.
 */

/**
 * AggregateMapper — bidirectional mapper between persistence entities
 * and domain aggregates.
 *
 * Type parameter TPersistence is the infrastructure-owned persistence shape.
 * Type parameter TDomain is the domain aggregate type.
 *
 * Implementations will:
 * 1. Convert persistence rows/documents into domain aggregates via reconstitute().
 * 2. Convert domain snapshots back into persistence-ready shapes.
 * 3. Handle value object reconstruction from primitive storage.
 * 4. Handle entity collection reconstruction from flattened/joined rows.
 *
 * Usage:
 * ```
 * const persistenceEntity = rowMapper.fromDatabaseRow(row);
 * const aggregate = mapper.toDomain(persistenceEntity);
 * const persistenceData = mapper.toPersistence(aggregate.toSnapshot());
 * const row = rowMapper.toDatabaseRow(persistenceData);
 * ```
 */
export interface AggregateMapper<TPersistence, TDomain> {
  /**
   * Convert a persistence entity into a domain aggregate.
   *
   * Uses the domain's reconstitute() factory — does NOT validate
   * creation invariants since the aggregate was already valid
   * when originally persisted.
   *
   * @param persistenceEntity - The infrastructure-owned persistence shape.
   * @returns The fully reconstructed domain aggregate.
   */
  toDomain(persistenceEntity: TPersistence): TDomain;

  /**
   * Convert a domain aggregate's snapshot into a persistence-ready shape.
   *
   * The returned shape is infrastructure-owned and will be further
   * converted by a RowMapper for the specific database technology.
   *
   * @param aggregate - The domain aggregate to persist.
   * @returns The persistence entity ready for database mapping.
   */
  toPersistence(aggregate: TDomain): TPersistence;
}

/**
 * RowMapper — converts between persistence entities and database-level rows.
 *
 * This is the lowest-level mapping layer. Implementations handle
 * the specific database technology (SQL columns, document fields, etc.).
 *
 * Type parameter TPersistence is the infrastructure-owned persistence shape.
 * Type parameter TRow is the database-specific row/document type.
 */
export interface RowMapper<TPersistence, TRow> {
  /**
   * Convert a database row into a persistence entity.
   *
   * @param row - The raw database row/document.
   * @returns The persistence entity.
   */
  fromRow(row: TRow): TPersistence;

  /**
   * Convert a persistence entity into a database row/document.
   *
   * @param entity - The persistence entity.
   * @returns The database row/document.
   */
  toRow(entity: TPersistence): TRow;
}

/**
 * SpecificationTranslator — converts domain specifications into
 * database-specific query parameters.
 *
 * Domain specifications express business intent (e.g., "search by text").
 * Infrastructure translates these into executable queries (e.g., SQL WHERE,
 * Elasticsearch query DSL, MongoDB filter).
 *
 * Type parameter TSpecification is the domain specification type.
 * Type parameter TQueryParams is the database-specific query parameter type.
 */
export interface SpecificationTranslator<TSpecification, TQueryParams> {
  /**
   * Translate a domain specification into database query parameters.
   *
   * @param specification - The domain specification to translate.
   * @returns Database-specific query parameters.
   */
  translate(specification: TSpecification): TQueryParams;
}

/**
 * Purpose:
 * Infrastructure repository contract — defines what every concrete
 * repository implementation must provide beyond the domain interface.
 *
 * Architecture reference:
 * Infrastructure Layer — Repository Implementation Strategy.
 *
 * This interface extends the domain's repository contract with
 * infrastructure-specific concerns:
 * - Connection management
 * - Error mapping from persistence errors to domain Result<T>
 * - Specification-to-query translation
 *
 * Responsibilities:
 * Define the infrastructure-side contract for repository implementations.
 * Ensure implementations satisfy the domain repository interface.
 * Provide lifecycle hooks for connection health.
 *
 * Ownership:
 * Infrastructure Layer. Only concrete implementations reference this.
 * Domain and Application never see this contract.
 *
 * Invariants:
 * All implementations must satisfy the domain repository interface.
 * All fallible operations return Result — never throw infrastructure errors.
 * Infrastructure errors are caught and mapped to Result failures.
 */

/**
 * Persistence health status.
 * Infrastructure implementations report connection health
 * for monitoring and readiness probes.
 */
export interface PersistenceHealthStatus {
  /** Whether the persistence layer is reachable. */
  readonly isHealthy: boolean;
  /** Latency in milliseconds, or -1 if unreachable. */
  readonly latencyMs: number;
  /** Human-readable status description. */
  readonly message: string;
}

/**
 * InfrastructureRepository — the infrastructure-side contract that every
 * concrete repository implementation must satisfy.
 *
 * This contract adds infrastructure concerns on top of the domain's
 * repository interface. Domain never sees this — it only interacts
 * with the domain repository contract.
 */
export interface InfrastructureRepository {
  /**
   * Check persistence layer health.
   *
   * Used by readiness probes and monitoring. Returns connection
   * status, latency, and human-readable message.
   */
  healthCheck(): Promise<PersistenceHealthStatus>;
}

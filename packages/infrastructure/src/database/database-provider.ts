/**
 * Purpose:
 * Defines the database provider contract for Infrastructure.
 *
 * Architecture reference:
 * Infrastructure Layer — Database Strategy.
 *
 * The DatabaseProvider:
 * - Manages database connection lifecycle.
 * - Provides access to the underlying database client.
 * - Handles connection pooling.
 * - Supports health checks.
 *
 * This interface:
 * - Decouples Infrastructure from specific database technologies.
 * - Allows swapping PostgreSQL, MySQL, SQLite, MongoDB, etc.
 * - Provides a unified lifecycle management contract.
 *
 * This interface does NOT:
 * - Execute queries (that is the repository's job).
 * - Know about domain concepts.
 * - Contain business logic.
 *
 * Dependency rule:
 * Infrastructure → Shared (Result). Never reverse.
 */

import type { Result } from '@rios/shared';

/**
 * DatabaseProvider — manages database connection lifecycle.
 *
 * Usage:
 * ```
 * const provider = new PostgresDatabaseProvider(config);
 * const connectResult = await provider.connect();
 * if (connectResult.isFailure) {
 *   // Handle connection failure
 * }
 * const client = provider.getClient();
 * // ... use client for queries
 * await provider.disconnect();
 * ```
 */
export interface DatabaseProvider {
  /**
   * Establish connection to the database.
   * Returns Result.fail if connection cannot be established.
   */
  connect(): Promise<Result<void>>;

  /**
   * Gracefully disconnect from the database.
   * Waits for pending operations to complete.
   */
  disconnect(): Promise<Result<void>>;

  /**
   * Get the underlying database client.
   * Type is implementation-specific (PrismaClient, Pool, etc.).
   */
  getClient(): unknown;

  /**
   * Check if the database connection is healthy.
   * Returns true if the connection is active and responsive.
   */
  isHealthy(): Promise<boolean>;

  /**
   * Get the current connection status.
   */
  getStatus(): DatabaseConnectionStatusType;
}

/**
 * Database connection status.
 */
export const DatabaseConnectionStatus = {
  DISCONNECTED: 'DISCONNECTED',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  DISCONNECTING: 'DISCONNECTING',
  ERROR: 'ERROR',
} as const;

export type DatabaseConnectionStatusType =
  (typeof DatabaseConnectionStatus)[keyof typeof DatabaseConnectionStatus];

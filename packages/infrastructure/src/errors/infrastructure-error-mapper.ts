/**
 * Purpose:
 * Maps infrastructure-level errors to domain Result<T> failures.
 *
 * Architecture reference:
 * Infrastructure Layer — Error Mapping Strategy.
 *
 * This mapper:
 * - Catches raw persistence, network, and external service errors.
 * - Translates them into Result.fail() with meaningful domain-oriented messages.
 * - Preserves the original error as a cause for logging/debugging.
 * - Prevents infrastructure errors from leaking into Domain or Application layers.
 *
 * This mapper does NOT:
 * - Throw errors (always returns Result).
 * - Know about domain-specific error types.
 * - Contain business logic.
 *
 * Dependency rule:
 * Infrastructure → Shared (Result, InfrastructureError). Never reverse.
 */

import { Result, InfrastructureError } from '@rios/shared';

/**
 * Standard error codes for infrastructure failures.
 *
 * These codes are infrastructure-level — they describe what failed
 * at the persistence/external-service level, not what domain rule
 * was violated.
 */
export const InfrastructureErrorCode = {
  /** Database connection failed or timed out. */
  CONNECTION_FAILED: 'INFRA_CONNECTION_FAILED',
  /** Query execution failed (syntax, constraint violation). */
  QUERY_FAILED: 'INFRA_QUERY_FAILED',
  /** Transaction could not be started or committed. */
  TRANSACTION_FAILED: 'INFRA_TRANSACTION_FAILED',
  /** Entity not found in persistence layer. */
  NOT_FOUND: 'INFRA_NOT_FOUND',
  /** Unique constraint violation (duplicate key). */
  UNIQUE_VIOLATION: 'INFRA_UNIQUE_VIOLATION',
  /** Serialization/deserialization failure. */
  SERIALIZATION_FAILED: 'INFRA_SERIALIZATION_FAILED',
  /** External service unavailable. */
  EXTERNAL_SERVICE_UNAVAILABLE: 'INFRA_EXTERNAL_SERVICE_UNAVAILABLE',
  /** Configuration missing or invalid. */
  CONFIGURATION_ERROR: 'INFRA_CONFIGURATION_ERROR',
  /** Event publication failed. */
  EVENT_PUBLICATION_FAILED: 'INFRA_EVENT_PUBLICATION_FAILED',
  /** Unknown/unclassified infrastructure error. */
  UNKNOWN: 'INFRA_UNKNOWN',
} as const;

export type InfrastructureErrorCodeType =
  (typeof InfrastructureErrorCode)[keyof typeof InfrastructureErrorCode];

/**
 * InfrastructureErrorMapper — translates raw infrastructure exceptions
 * into Result.fail() with structured InfrastructureError.
 *
 * Usage:
 * ```
 * try {
 *   const row = await db.query('...');
 *   return Result.ok(mapper.toDomain(row));
 * } catch (error) {
 *   return InfrastructureErrorMapper.toResult(error);
 * }
 * ```
 */
export class InfrastructureErrorMapper {
  /**
   * Convert a caught error into a Result.failure with InfrastructureError.
   *
   * @param error - The raw error from persistence/network/external service.
   * @param context - Optional context string describing the operation that failed.
   * @returns Result.fail with a structured error message.
   */
  static toResult<T>(error: unknown, context?: string): Result<T> {
    const infraError = InfrastructureErrorMapper.toInfrastructureError(error, context);
    return Result.fail<T>(infraError.message);
  }

  /**
   * Convert a caught error into an InfrastructureError instance.
   *
   * @param error - The raw error from persistence/network/external service.
   * @param context - Optional context string describing the operation that failed.
   * @returns InfrastructureError with structured code and message.
   */
  static toInfrastructureError(error: unknown, context?: string): InfrastructureError {
    if (error instanceof InfrastructureError) {
      return error;
    }

    const rawMessage = error instanceof Error ? error.message : String(error);
    const contextPrefix = context !== undefined && context !== '' ? `[${context}] ` : '';
    const code = InfrastructureErrorMapper.classifyError(error);

    return new InfrastructureError(`${contextPrefix}${rawMessage}`, code);
  }

  /**
   * Classify a raw error into an infrastructure error code.
   *
   * Subclasses or strategy implementations can override this
   * for ORM-specific classification (e.g., Prisma error codes).
   */
  static classifyError(error: unknown): InfrastructureErrorCodeType {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (
        message.includes('connect') ||
        message.includes('econnrefused') ||
        message.includes('timeout')
      ) {
        return InfrastructureErrorCode.CONNECTION_FAILED;
      }
      if (message.includes('unique') || message.includes('duplicate')) {
        return InfrastructureErrorCode.UNIQUE_VIOLATION;
      }
      if (message.includes('not found') || message.includes('no rows')) {
        return InfrastructureErrorCode.NOT_FOUND;
      }
      if (message.includes('transaction') || message.includes('deadlock')) {
        return InfrastructureErrorCode.TRANSACTION_FAILED;
      }
      if (message.includes('syntax') || message.includes('constraint')) {
        return InfrastructureErrorCode.QUERY_FAILED;
      }
      if (
        message.includes('serialize') ||
        message.includes('deserialize') ||
        message.includes('parse')
      ) {
        return InfrastructureErrorCode.SERIALIZATION_FAILED;
      }
      if (message.includes('econnreset') || message.includes('fetch failed')) {
        return InfrastructureErrorCode.EXTERNAL_SERVICE_UNAVAILABLE;
      }
    }

    return InfrastructureErrorCode.UNKNOWN;
  }
}

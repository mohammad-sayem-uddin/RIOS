/**
 * Purpose:
 * Application-layer error types for Research Identity operations.
 *
 * Architecture reference:
 * These errors represent application-level failures, NOT domain invariants.
 * Domain invariants are enforced by the domain layer via DomainError.
 * Application errors handle orchestration failures such as:
 *   - Identity not found during command/query execution
 *   - Concurrent modification conflicts
 *   - Unexpected orchestration failures
 *
 * Invariants:
 * Extend ApplicationError from @rios/shared.
 * Pure data. No business logic.
 */

import { ApplicationError } from '@rios/shared';

/**
 * Thrown when a Research Identity cannot be found for a given identifier.
 */
export class ResearchIdentityNotFoundError extends ApplicationError {
  public readonly identityId: string;

  constructor(identityId: string) {
    super(`Research Identity not found: ${identityId}`, 'APPLICATION.IDENTITY_NOT_FOUND');
    this.name = 'ResearchIdentityNotFoundError';
    this.identityId = identityId;
    Object.setPrototypeOf(this, ResearchIdentityNotFoundError.prototype);
  }
}

/**
 * Thrown when a command attempts to operate on an identity
 * that has been modified since the command was issued.
 */
export class ConcurrencyConflictError extends ApplicationError {
  public readonly identityId: string;
  public readonly expectedVersion: number;
  public readonly actualVersion: number;

  constructor(params: { identityId: string; expectedVersion: number; actualVersion: number }) {
    super(
      `Concurrency conflict on Research Identity ${params.identityId}: ` +
        `expected version ${params.expectedVersion}, found ${params.actualVersion}`,
      'APPLICATION.CONCURRENCY_CONFLICT',
    );
    this.name = 'ConcurrencyConflictError';
    this.identityId = params.identityId;
    this.expectedVersion = params.expectedVersion;
    this.actualVersion = params.actualVersion;
    Object.setPrototypeOf(this, ConcurrencyConflictError.prototype);
  }
}

/**
 * Thrown when an application operation fails unexpectedly
 * (e.g., infrastructure unavailable, unknown error).
 */
export class ApplicationOperationError extends ApplicationError {
  public readonly operationName: string;
  public override readonly cause?: Error;

  constructor(params: { operationName: string; message: string; cause?: Error }) {
    super(
      `Application operation '${params.operationName}' failed: ${params.message}`,
      'APPLICATION.OPERATION_FAILED',
    );
    this.name = 'ApplicationOperationError';
    this.operationName = params.operationName;
    this.cause = params.cause;
    Object.setPrototypeOf(this, ApplicationOperationError.prototype);
  }
}

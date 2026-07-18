/**
 * Concrete UnitOfWork and TransactionContext implementation using Prisma.
 *
 * Architecture reference:
 * Infrastructure Layer — Transaction Boundary.
 *
 * Responsibilities:
 * - Owns transaction lifecycle (begin, commit, rollback).
 * - Creates and propagates TransactionContext.
 * - Repositories participate in transactions via TransactionContext.
 * - Repositories MUST NEVER create, commit, or roll back transactions.
 */

import { Result } from '@rios/shared';

import type { DatabaseProvider } from '../database/database-provider.js';
import { InfrastructureErrorMapper } from '../errors/infrastructure-error-mapper.js';
import type { Logger } from '../logging/logger.js';

import type { TransactionContext, TransactionOptions, UnitOfWork } from './unit-of-work.js';

/**
 * PrismaTransactionContext — Concrete implementation of TransactionContext for Prisma.
 *
 * Contains only infrastructure concerns: transactionId and the Prisma transaction handle.
 * Repositories receive this context but MUST NEVER instantiate it directly.
 */
export class PrismaTransactionContext implements TransactionContext {
  readonly transactionId: string;
  readonly handle: unknown;

  constructor(handle: unknown, transactionId?: string) {
    this.transactionId =
      transactionId ?? `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    this.handle = handle;
  }
}

/**
 * Internal exception used to signal Prisma's $transaction runner to rollback
 * when a callback function returns Result.fail.
 */
class TransactionRollbackException extends Error {
  constructor(public readonly failureResult: Result<unknown>) {
    super('Transaction rolled back due to Result.fail');
    this.name = 'TransactionRollbackException';
  }
}

/**
 * Shape of a database client that supports Prisma-style interactive $transaction.
 */
export interface PrismaClientWithTransaction {
  $transaction<R>(
    fn: (tx: unknown) => Promise<R>,
    options?: {
      isolationLevel?: string;
      timeout?: number;
      maxWait?: number;
    },
  ): Promise<R>;
}

/**
 * PrismaUnitOfWork — Concrete implementation of UnitOfWork pattern using Prisma.
 *
 * Lifecycle & Flow:
 * 1. `execute()` starts a Prisma transaction boundary (`prisma.$transaction`).
 * 2. Instantiates `PrismaTransactionContext` wrapping the transactional client `tx`.
 * 3. Passes context to user callback `fn(txContext)`.
 * 4. If `fn` returns `Result.ok(val)`, transaction commits automatically.
 * 5. If `fn` returns `Result.fail(err)` or throws an exception, transaction rolls back automatically.
 * 6. Errors are converted via `InfrastructureErrorMapper`.
 */
export class PrismaUnitOfWork implements UnitOfWork {
  private activeCount = 0;

  constructor(
    private readonly databaseProvider: DatabaseProvider,
    private readonly logger?: Logger,
  ) {}

  /**
   * Check if a transaction is currently active within this UnitOfWork instance.
   */
  isActive(): boolean {
    return this.activeCount > 0;
  }

  /**
   * Execute a function within a transaction boundary.
   *
   * @param fn - Function receiving TransactionContext, returning Result<T>.
   * @param options - Optional transaction options (isolationLevel, timeoutMs).
   * @returns Promise<Result<T>> of the transaction execution.
   */
  async execute<T>(
    fn: (context: TransactionContext) => Promise<Result<T>>,
    options?: TransactionOptions,
  ): Promise<Result<T>> {
    const rawClient = this.databaseProvider.getClient() as PrismaClientWithTransaction | null;

    if (
      rawClient === null ||
      rawClient === undefined ||
      typeof rawClient.$transaction !== 'function'
    ) {
      const errorMsg =
        'Database provider client does not support transactions ($transaction method missing)';
      this.logger?.error(errorMsg);
      return Result.fail<T>(errorMsg);
    }

    const prismaOptions = this.mapOptions(options);

    this.activeCount++;
    try {
      const result = await rawClient.$transaction(async (tx: unknown) => {
        const txContext = new PrismaTransactionContext(tx);
        const res = await fn(txContext);

        if (res.isFailure) {
          throw new TransactionRollbackException(res);
        }

        return res;
      }, prismaOptions);

      this.logger?.debug('Transaction committed successfully');
      return result;
    } catch (error: unknown) {
      if (error instanceof TransactionRollbackException) {
        this.logger?.debug('Transaction rolled back due to Result.fail return', {
          error: error.failureResult.error,
        });
        return error.failureResult as Result<T>;
      }

      const infraError = InfrastructureErrorMapper.toInfrastructureError(
        error,
        'UnitOfWork.execute',
      );
      this.logger?.error('Transaction failed and rolled back due to exception', {
        error: infraError,
      });
      return Result.fail<T>(infraError.message);
    } finally {
      this.activeCount--;
    }
  }

  /**
   * Map domain TransactionOptions to Prisma $transaction options.
   */
  private mapOptions(options?: TransactionOptions):
    | {
        isolationLevel?: string;
        timeout?: number;
      }
    | undefined {
    if (options === undefined) {
      return undefined;
    }

    const result: { isolationLevel?: string; timeout?: number } = {};

    if (options.isolationLevel !== undefined) {
      result.isolationLevel = options.isolationLevel;
    }

    if (options.timeoutMs !== undefined) {
      result.timeout = options.timeoutMs;
    }

    return result;
  }
}

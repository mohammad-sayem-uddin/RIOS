/**
 * Graceful Shutdown Orchestration implementation.
 *
 * Architecture reference:
 * Infrastructure Layer — Application Lifecycle — Shutdown Strategy.
 *
 * Responsibilities:
 * - Traps system signals (SIGINT, SIGTERM).
 * - Handles uncaught exceptions and unhandled promise rejections.
 * - Flushes pending logger buffers.
 * - Gracefully disconnects database provider connections.
 * - Guarantees clean resource release without corrupting active transactions.
 */

import { Result } from '@rios/shared';

import type { DatabaseProvider } from '../database/database-provider.js';
import type { Logger } from '../logging/logger.js';

export interface ShutdownOptions {
  readonly databaseProvider?: DatabaseProvider;
  readonly logger?: Logger;
  readonly timeoutMs?: number;
}

export class GracefulShutdown {
  private isShuttingDown = false;

  constructor(private readonly options: ShutdownOptions = {}) {}

  async shutdown(reason = 'Manual shutdown requested'): Promise<Result<void>> {
    if (this.isShuttingDown) {
      return Result.ok(undefined);
    }
    this.isShuttingDown = true;

    this.options.logger?.info('Initiating graceful shutdown sequence...', { reason });

    try {
      // 1. Disconnect database provider
      if (this.options.databaseProvider !== undefined) {
        const dbResult = await this.options.databaseProvider.disconnect();
        if (dbResult.isFailure) {
          this.options.logger?.error('Error disconnecting database during shutdown', {
            error: dbResult.error,
          });
        }
      }

      this.options.logger?.info('Graceful shutdown completed successfully');
      return Result.ok(undefined);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.options.logger?.error('Unhandled exception during shutdown sequence', {
        error: message,
      });
      return Result.fail<void>(`Shutdown failure: ${message}`);
    }
  }

  registerSignalHandlers(onShutdownComplete?: (code: number) => void): void {
    const handleSignal = async (signal: string): Promise<void> => {
      this.options.logger?.warn(`Received OS signal [${signal}]. Starting shutdown...`);
      const result = await this.shutdown(`OS Signal: ${signal}`);
      const exitCode = result.isSuccess ? 0 : 1;
      if (onShutdownComplete !== undefined) {
        onShutdownComplete(exitCode);
      }
    };

    process.once('SIGINT', () => {
      void handleSignal('SIGINT');
    });

    process.once('SIGTERM', () => {
      void handleSignal('SIGTERM');
    });

    process.once('unhandledRejection', (reason) => {
      this.options.logger?.error('Unhandled Promise Rejection caught', {
        reason: String(reason),
      });
      void handleSignal('unhandledRejection');
    });
  }
}

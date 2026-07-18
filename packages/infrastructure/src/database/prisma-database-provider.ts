/**
 * Concrete DatabaseProvider implementation using PrismaClient.
 *
 * Architecture reference:
 * Infrastructure Layer — Database Strategy.
 *
 * Responsibilities:
 * - Manages Prisma database connection lifecycle (connect, disconnect).
 * - Exposes underlying PrismaClient handle via `getClient()`.
 * - Tracks connection status (`DISCONNECTED`, `CONNECTING`, `CONNECTED`, `DISCONNECTING`, `ERROR`).
 * - Provides active health checking via raw ping query `$queryRaw`.
 */

import { Result } from '@rios/shared';

import type { AppConfig } from '../configuration/app-config.js';
import type { Logger } from '../logging/logger.js';

import type { DatabaseProvider, DatabaseConnectionStatusType } from './database-provider.js';
import { DatabaseConnectionStatus } from './database-provider.js';

export interface PrismaClientInterface {
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
  $queryRaw<T = unknown>(query: TemplateStringsArray, ...values: unknown[]): Promise<T>;
}

export class PrismaDatabaseProvider implements DatabaseProvider {
  private status: DatabaseConnectionStatusType = DatabaseConnectionStatus.DISCONNECTED;

  constructor(
    private readonly client: PrismaClientInterface,
    private readonly config?: AppConfig['database'],
    private readonly logger?: Logger,
  ) {}

  async connect(): Promise<Result<void>> {
    if (this.status === DatabaseConnectionStatus.CONNECTED) {
      return Result.ok(undefined);
    }

    this.status = DatabaseConnectionStatus.CONNECTING;
    this.logger?.info('Connecting to database via Prisma client...', {
      host: this.config?.host,
      database: this.config?.database,
    });

    try {
      await this.client.$connect();
      this.status = DatabaseConnectionStatus.CONNECTED;
      this.logger?.info('Database connection established successfully');
      return Result.ok(undefined);
    } catch (error: unknown) {
      this.status = DatabaseConnectionStatus.ERROR;
      const message = error instanceof Error ? error.message : String(error);
      this.logger?.error('Failed to establish database connection', { error: message });
      return Result.fail<void>(`Database connection failure: ${message}`);
    }
  }

  async disconnect(): Promise<Result<void>> {
    if (this.status === DatabaseConnectionStatus.DISCONNECTED) {
      return Result.ok(undefined);
    }

    this.status = DatabaseConnectionStatus.DISCONNECTING;
    this.logger?.info('Disconnecting database provider...');

    try {
      await this.client.$disconnect();
      this.status = DatabaseConnectionStatus.DISCONNECTED;
      this.logger?.info('Database connection closed cleanly');
      return Result.ok(undefined);
    } catch (error: unknown) {
      this.status = DatabaseConnectionStatus.ERROR;
      const message = error instanceof Error ? error.message : String(error);
      this.logger?.error('Error during database disconnect', { error: message });
      return Result.fail<void>(`Database disconnect failure: ${message}`);
    }
  }

  getClient(): unknown {
    return this.client;
  }

  async isHealthy(): Promise<boolean> {
    if (this.status !== DatabaseConnectionStatus.CONNECTED) {
      return false;
    }

    try {
      await this.client.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  getStatus(): DatabaseConnectionStatusType {
    return this.status;
  }
}

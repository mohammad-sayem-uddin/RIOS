import { Result } from '@rios/shared';
import { describe, it, expect } from 'vitest';

import type { AppConfig } from '../configuration/app-config.js';
import type {
  InfrastructureRepository,
  PersistenceHealthStatus,
} from '../contracts/repository.contract.js';
import { DatabaseConnectionStatus } from '../database/database-provider.js';
import type { DatabaseProvider } from '../database/database-provider.js';
import type { OutboxRepository } from '../events/outbox-repository.js';
import { InfrastructureHealthCheckService } from '../health/health-check-service.js';

describe('InfrastructureHealthCheckService', () => {
  it('should return UP when all components are healthy', async (): Promise<void> => {
    const mockDbProvider: DatabaseProvider = {
      connect: (): Promise<Result<void>> => Promise.resolve(Result.ok(undefined)),
      disconnect: (): Promise<Result<void>> => Promise.resolve(Result.ok(undefined)),
      getClient: (): unknown => ({}),
      isHealthy: (): Promise<boolean> => Promise.resolve(true),
      getStatus: () => DatabaseConnectionStatus.CONNECTED,
    };

    const mockRepo: InfrastructureRepository = {
      healthCheck: (): Promise<PersistenceHealthStatus> =>
        Promise.resolve({
          isHealthy: true,
          latencyMs: 5,
          message: 'Healthy',
        }),
    };

    const mockOutbox = {
      store: (): Promise<Result<void>> => Promise.resolve(Result.ok(undefined)),
      findPending: (): Promise<Result<[]>> => Promise.resolve(Result.ok([])),
      markProcessed: (): Promise<Result<void>> => Promise.resolve(Result.ok(undefined)),
      incrementRetry: (): Promise<Result<void>> => Promise.resolve(Result.ok(undefined)),
    } as unknown as OutboxRepository;

    const mockConfig: AppConfig = {
      env: 'test',
      database: {
        host: 'localhost',
        port: 5432,
        database: 'db',
        username: 'u',
        password: 'p',
        ssl: false,
        poolSize: 5,
        connectionTimeoutMs: 1000,
      },
      eventBroker: { host: 'h', port: 5672, username: 'u', password: 'p', vhost: '/' },
      server: { host: '0.0.0.0', port: 3000, corsOrigins: ['*'] },
      logging: { level: 'INFO', format: 'json', destination: 'stdout' },
    };

    const service = new InfrastructureHealthCheckService({
      databaseProvider: mockDbProvider,
      config: mockConfig,
      repositories: [{ name: 'ResearchIdentityRepo', repo: mockRepo }],
      outboxRepository: mockOutbox,
    });

    const result = await service.check();

    expect(result.status).toBe('UP');
    expect(result.components.database.status).toBe('UP');
    expect(result.components.config.status).toBe('UP');
    expect(result.components.repositories.status).toBe('UP');
    expect(result.components.outbox.status).toBe('UP');
  });

  it('should return DOWN when database is unhealthy', async (): Promise<void> => {
    const mockDbProvider: DatabaseProvider = {
      connect: (): Promise<Result<void>> => Promise.resolve(Result.ok(undefined)),
      disconnect: (): Promise<Result<void>> => Promise.resolve(Result.ok(undefined)),
      getClient: (): unknown => ({}),
      isHealthy: (): Promise<boolean> => Promise.resolve(false),
      getStatus: () => DatabaseConnectionStatus.ERROR,
    };

    const service = new InfrastructureHealthCheckService({
      databaseProvider: mockDbProvider,
    });

    const result = await service.check();

    expect(result.status).toBe('DOWN');
    expect(result.components.database.status).toBe('DOWN');
  });
});

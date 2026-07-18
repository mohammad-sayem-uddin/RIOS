/**
 * Infrastructure Health Check Service Implementation.
 *
 * Architecture reference:
 * Infrastructure Layer — Health Monitoring Strategy.
 *
 * Features:
 * - Aggregates health status across Database, Repositories, Outbox, and Configuration.
 * - Computes overall application status (UP, DOWN, DEGRADED).
 * - Provides structured component-level status for readiness probes.
 */

import type { AppConfig } from '../configuration/app-config.js';
import type {
  InfrastructureRepository,
  PersistenceHealthStatus,
} from '../contracts/repository.contract.js';
import type { DatabaseProvider } from '../database/database-provider.js';
import type { OutboxRepository } from '../events/outbox-repository.js';

export type OverallHealthStatus = 'UP' | 'DOWN' | 'DEGRADED';

export interface ComponentHealthStatus {
  readonly status: 'UP' | 'DOWN' | 'DEGRADED';
  readonly details: Record<string, unknown>;
  readonly message?: string;
}

export interface ApplicationHealthResult {
  readonly status: OverallHealthStatus;
  readonly timestamp: string;
  readonly components: {
    readonly database: ComponentHealthStatus;
    readonly config: ComponentHealthStatus;
    readonly repositories: ComponentHealthStatus;
    readonly outbox: ComponentHealthStatus;
  };
}

export interface HealthCheckOptions {
  readonly databaseProvider: DatabaseProvider;
  readonly config?: AppConfig;
  readonly repositories?: ReadonlyArray<{ name: string; repo: InfrastructureRepository }>;
  readonly outboxRepository?: OutboxRepository;
}

export class InfrastructureHealthCheckService {
  constructor(private readonly options: HealthCheckOptions) {}

  async check(): Promise<ApplicationHealthResult> {
    const timestamp = new Date().toISOString();

    // 1. Database Health Check
    const dbStatus = this.options.databaseProvider.getStatus();
    const dbHealthy = await this.options.databaseProvider.isHealthy();
    const databaseHealth: ComponentHealthStatus = {
      status: dbHealthy ? 'UP' : 'DOWN',
      details: {
        connectionStatus: dbStatus,
        isHealthy: dbHealthy,
      },
      message: dbHealthy ? 'Database is connected and responsive' : 'Database ping failed',
    };

    // 2. Configuration Health Check
    const configHealth: ComponentHealthStatus = {
      status: this.options.config !== undefined ? 'UP' : 'DOWN',
      details: {
        env: this.options.config?.env ?? 'UNKNOWN',
        configured: this.options.config !== undefined,
      },
      message: this.options.config !== undefined ? 'Configuration loaded' : 'Missing configuration',
    };

    // 3. Repository Readiness Check
    let repositoriesHealth: ComponentHealthStatus;
    if (!this.options.repositories || this.options.repositories.length === 0) {
      repositoriesHealth = {
        status: 'UP',
        details: { count: 0 },
        message: 'No repositories registered for health checking',
      };
    } else {
      const repoStatuses: Record<string, PersistenceHealthStatus> = {};
      let allHealthy = true;
      let hasDegraded = false;

      for (const { name, repo } of this.options.repositories) {
        try {
          const status = await repo.healthCheck();
          repoStatuses[name] = status;
          if (!status.isHealthy) {
            allHealthy = false;
            hasDegraded = true;
          }
        } catch (err) {
          allHealthy = false;
          repoStatuses[name] = {
            isHealthy: false,
            latencyMs: -1,
            message: err instanceof Error ? err.message : String(err),
          };
        }
      }

      repositoriesHealth = {
        status: allHealthy ? 'UP' : hasDegraded ? 'DEGRADED' : 'DOWN',
        details: repoStatuses,
        message: allHealthy
          ? 'All repositories healthy'
          : 'One or more repositories reporting issues',
      };
    }

    // 4. Outbox Queue Readiness Check
    let outboxHealth: ComponentHealthStatus;
    if (!this.options.outboxRepository) {
      outboxHealth = {
        status: 'UP',
        details: { status: 'NOT_REGISTERED' },
        message: 'Outbox repository not registered',
      };
    } else {
      try {
        const pendingResult = await this.options.outboxRepository.findPending(1);
        if (pendingResult.isSuccess) {
          outboxHealth = {
            status: 'UP',
            details: { pendingCount: pendingResult.value.length },
            message: 'Outbox store accessible and healthy',
          };
        } else {
          outboxHealth = {
            status: 'DEGRADED',
            details: { error: pendingResult.error },
            message: 'Outbox store returned failure on pending check',
          };
        }
      } catch (err) {
        outboxHealth = {
          status: 'DOWN',
          details: { error: err instanceof Error ? err.message : String(err) },
          message: 'Outbox store exception during check',
        };
      }
    }

    // Calculate overall status
    let overall: OverallHealthStatus = 'UP';
    if (databaseHealth.status === 'DOWN' || configHealth.status === 'DOWN') {
      overall = 'DOWN';
    } else if (
      repositoriesHealth.status === 'DOWN' ||
      repositoriesHealth.status === 'DEGRADED' ||
      outboxHealth.status === 'DEGRADED'
    ) {
      overall = 'DEGRADED';
    }

    return {
      status: overall,
      timestamp,
      components: {
        database: databaseHealth,
        config: configHealth,
        repositories: repositoriesHealth,
        outbox: outboxHealth,
      },
    };
  }
}

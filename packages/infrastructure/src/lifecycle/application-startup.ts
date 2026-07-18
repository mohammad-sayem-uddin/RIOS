/**
 * Application Startup Orchestration implementation.
 *
 * Architecture reference:
 * Infrastructure Layer — Application Lifecycle — Startup Strategy.
 *
 * Responsibilities:
 * 1. Loads and validates application configuration.
 * 2. Initializes logging infrastructure.
 * 3. Connects to database provider.
 * 4. Assembles composition root and validates dependency graph.
 * 5. Runs health checks and fails startup if critical dependencies are DOWN.
 * 6. Returns initialized container and services via Result<T>.
 */

import type { ResearchIdentityApplicationService } from '@rios/application';
import { Result } from '@rios/shared';

import type { AppConfig } from '../configuration/app-config.js';
import { EnvConfigurationLoader } from '../configuration/env-configuration-loader.js';
import type { DatabaseProvider } from '../database/database-provider.js';
import type { PrismaClientInterface } from '../database/prisma-database-provider.js';
import { CompositionRoot } from '../di/composition-root.js';
import type { Container } from '../di/container.js';
import { DITokens } from '../di/tokens.js';
import type {
  ApplicationHealthResult,
  InfrastructureHealthCheckService,
} from '../health/health-check-service.js';
import type { Logger, LogLevelType } from '../logging/logger.js';
import { DefaultLoggerFactory } from '../logging/structured-logger.js';

export interface StartupOptions {
  readonly envVars?: Record<string, string | undefined>;
  readonly customPrismaClient?: PrismaClientInterface;
  readonly skipHealthCheck?: boolean;
}

export interface SystemInstance {
  readonly config: AppConfig;
  readonly logger: Logger;
  readonly databaseProvider: DatabaseProvider;
  readonly container: Container;
  readonly compositionRoot: CompositionRoot;
  readonly healthService: InfrastructureHealthCheckService;
  readonly identityApplicationService: ResearchIdentityApplicationService;
}

export class ApplicationStartup {
  static async start(options: StartupOptions = {}): Promise<Result<SystemInstance>> {
    // 1. Load Configuration
    const configLoader = new EnvConfigurationLoader(options.envVars);
    const configResult = await configLoader.load();
    if (configResult.isFailure) {
      return Result.fail<SystemInstance>(
        `Startup aborted — Configuration error: ${configResult.error}`,
      );
    }
    const config = configResult.value;

    // 2. Initialize Logging
    const logLevel = config.logging.level as LogLevelType;
    const loggerFactory = new DefaultLoggerFactory(logLevel);
    const logger = loggerFactory.create('ApplicationStartup');
    logger.info('Starting RIOS Enterprise Engine...', { env: config.env });

    // 3. Assemble Composition Root
    const compositionRoot = new CompositionRoot({
      envVars: options.envVars,
      appConfig: config,
      prismaClient: options.customPrismaClient,
    });

    const container = compositionRoot.getContainer();

    // 4. Validate Dependency Graph
    const graphResult = compositionRoot.validateGraph();
    if (graphResult.isFailure) {
      logger.fatal('Startup failed — DI graph validation failure', { error: graphResult.error });
      return Result.fail<SystemInstance>(graphResult.error);
    }

    // 5. Connect Database Provider
    const databaseProvider = container.resolve<DatabaseProvider>(DITokens.DatabaseProvider);
    const dbConnectResult = await databaseProvider.connect();
    if (dbConnectResult.isFailure) {
      logger.fatal('Startup failed — Database connection error', { error: dbConnectResult.error });
      return Result.fail<SystemInstance>(dbConnectResult.error);
    }

    // 6. Run Health Checks
    const healthService = container.resolve<InfrastructureHealthCheckService>(
      DITokens.HealthCheckService,
    );
    if (options.skipHealthCheck !== true) {
      const health: ApplicationHealthResult = await healthService.check();
      if (health.status === 'DOWN') {
        logger.fatal('Startup failed — Infrastructure health check DOWN', { health });
        await databaseProvider.disconnect();
        return Result.fail<SystemInstance>(
          `Startup aborted — Critical health check DOWN. Details: DB message: ${health.components.database.message}`,
        );
      }
      logger.info('Infrastructure health check PASSED', { status: health.status });
    }

    // 7. Resolve Application Services
    const identityApplicationService = container.resolve<ResearchIdentityApplicationService>(
      DITokens.ResearchIdentityApplicationService,
    );

    logger.info('RIOS Infrastructure & Application startup COMPLETE');

    return Result.ok<SystemInstance>({
      config,
      logger,
      databaseProvider,
      container,
      compositionRoot,
      healthService,
      identityApplicationService,
    });
  }
}

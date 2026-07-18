/**
 * Environment Configuration Loader implementation.
 *
 * Architecture reference:
 * Infrastructure Layer — Configuration Strategy.
 *
 * Features:
 * - Loads and parses environment variables.
 * - Validates typed configuration values (fail-fast).
 * - Enforces default values where safe.
 * - Provides typed feature flag access.
 * - Guarantees Result.fail with actionable details if configuration is invalid.
 */

import { Result } from '@rios/shared';

import type { AppConfig, ConfigurationLoader } from './app-config.js';

export interface FeatureFlags {
  readonly outboxWorkerEnabled: boolean;
  readonly metricsEnabled: boolean;
  readonly strictValidation: boolean;
}

export interface ExtendedAppConfig extends AppConfig {
  readonly featureFlags: FeatureFlags;
}

export class EnvConfigurationLoader implements ConfigurationLoader {
  constructor(private readonly envVars: Record<string, string | undefined> = process.env) {}

  load(): Promise<Result<AppConfig>> {
    const errors: string[] = [];

    const env = this.envVars.NODE_ENV ?? 'development';

    // Database configuration parsing & validation
    const dbHost = this.envVars.DB_HOST ?? 'localhost';
    const dbPortStr = this.envVars.DB_PORT ?? '5432';
    const dbPort = parseInt(dbPortStr, 10);
    if (isNaN(dbPort) || dbPort <= 0 || dbPort > 65535) {
      errors.push(
        `Invalid DB_PORT: must be an integer between 1 and 65535, received "${dbPortStr}"`,
      );
    }

    const dbName = this.envVars.DB_NAME ?? 'rios_db';
    const dbUser = this.envVars.DB_USER ?? 'rios_user';
    const dbPassword = this.envVars.DB_PASSWORD ?? 'rios_password';
    const dbSsl = this.envVars.DB_SSL === 'true';

    const dbPoolSizeStr = this.envVars.DB_POOL_SIZE ?? '10';
    const dbPoolSize = parseInt(dbPoolSizeStr, 10);
    if (isNaN(dbPoolSize) || dbPoolSize <= 0) {
      errors.push(`Invalid DB_POOL_SIZE: must be a positive integer, received "${dbPoolSizeStr}"`);
    }

    const dbTimeoutStr = this.envVars.DB_TIMEOUT_MS ?? '5000';
    const dbConnectionTimeoutMs = parseInt(dbTimeoutStr, 10);
    if (isNaN(dbConnectionTimeoutMs) || dbConnectionTimeoutMs <= 0) {
      errors.push(`Invalid DB_TIMEOUT_MS: must be a positive integer, received "${dbTimeoutStr}"`);
    }

    // Event broker configuration parsing & validation
    const ebHost = this.envVars.EVENT_BROKER_HOST ?? 'localhost';
    const ebPortStr = this.envVars.EVENT_BROKER_PORT ?? '5672';
    const ebPort = parseInt(ebPortStr, 10);
    if (isNaN(ebPort) || ebPort <= 0 || ebPort > 65535) {
      errors.push(
        `Invalid EVENT_BROKER_PORT: must be an integer between 1 and 65535, received "${ebPortStr}"`,
      );
    }
    const ebUser = this.envVars.EVENT_BROKER_USER ?? 'guest';
    const ebPassword = this.envVars.EVENT_BROKER_PASSWORD ?? 'guest';
    const ebVhost = this.envVars.EVENT_BROKER_VHOST ?? '/';

    // Server configuration parsing & validation
    const serverHost = this.envVars.SERVER_HOST ?? '0.0.0.0';
    const serverPortStr = this.envVars.SERVER_PORT ?? '3000';
    const serverPort = parseInt(serverPortStr, 10);
    if (isNaN(serverPort) || serverPort <= 0 || serverPort > 65535) {
      errors.push(
        `Invalid SERVER_PORT: must be an integer between 1 and 65535, received "${serverPortStr}"`,
      );
    }
    const corsOrigins = (this.envVars.CORS_ORIGINS ?? '*')
      .split(',')
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0);

    // Logging configuration parsing & validation
    const logLevel = (this.envVars.LOG_LEVEL ?? 'INFO').toUpperCase();
    const validLevels = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];
    if (!validLevels.includes(logLevel)) {
      errors.push(
        `Invalid LOG_LEVEL: must be one of [${validLevels.join(', ')}], received "${logLevel}"`,
      );
    }
    const logFormat = this.envVars.LOG_FORMAT ?? 'json';
    const logDestination = this.envVars.LOG_DESTINATION ?? 'stdout';

    // Feature flags
    const featureFlags: FeatureFlags = {
      outboxWorkerEnabled: this.envVars.FEATURE_OUTBOX_WORKER === 'true',
      metricsEnabled:
        this.envVars.FEATURE_METRICS === 'true' || this.envVars.FEATURE_METRICS === undefined,
      strictValidation: this.envVars.FEATURE_STRICT_VALIDATION === 'true' || env === 'production',
    };

    if (errors.length > 0) {
      return Promise.resolve(
        Result.fail<AppConfig>(`Configuration validation failed:\n - ${errors.join('\n - ')}`),
      );
    }

    const config: ExtendedAppConfig = {
      env,
      database: {
        host: dbHost,
        port: dbPort,
        database: dbName,
        username: dbUser,
        password: dbPassword,
        ssl: dbSsl,
        poolSize: dbPoolSize,
        connectionTimeoutMs: dbConnectionTimeoutMs,
      },
      eventBroker: {
        host: ebHost,
        port: ebPort,
        username: ebUser,
        password: ebPassword,
        vhost: ebVhost,
      },
      server: {
        host: serverHost,
        port: serverPort,
        corsOrigins,
      },
      logging: {
        level: logLevel,
        format: logFormat,
        destination: logDestination,
      },
      featureFlags,
    };

    return Promise.resolve(Result.ok<AppConfig>(config));
  }
}

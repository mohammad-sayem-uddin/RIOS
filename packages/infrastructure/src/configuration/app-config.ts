/**
 * Purpose:
 * Defines the application configuration contract for Infrastructure.
 *
 * Architecture reference:
 * Infrastructure Layer — Configuration Strategy.
 *
 * The AppConfig:
 * - Centralizes all environment-dependent configuration.
 * - Provides type-safe access to configuration values.
 * - Decouples infrastructure from environment variable access patterns.
 * - Supports validation at startup (fail-fast).
 *
 * This interface does NOT:
 * - Read environment variables directly (implementations do).
 * - Contain default values (implementations define them).
 * - Expose raw environment variable names.
 *
 * Dependency rule:
 * Infrastructure owns configuration. No external dependencies.
 */

/**
 * Database configuration.
 */
export interface DatabaseConfig {
  readonly host: string;
  readonly port: number;
  readonly database: string;
  readonly username: string;
  readonly password: string;
  readonly ssl: boolean;
  readonly poolSize: number;
  readonly connectionTimeoutMs: number;
}

/**
 * Event broker configuration.
 */
export interface EventBrokerConfig {
  readonly host: string;
  readonly port: number;
  readonly username: string;
  readonly password: string;
  readonly vhost: string;
}

/**
 * Server configuration.
 */
export interface ServerConfig {
  readonly host: string;
  readonly port: number;
  readonly corsOrigins: ReadonlyArray<string>;
}

/**
 * Logging configuration.
 */
export interface LoggingConfig {
  readonly level: string;
  readonly format: string;
  readonly destination: string;
}

/**
 * AppConfig — centralized application configuration.
 */
export interface AppConfig {
  readonly env: string;
  readonly database: DatabaseConfig;
  readonly eventBroker: EventBrokerConfig;
  readonly server: ServerConfig;
  readonly logging: LoggingConfig;
}

/**
 * Configuration loader — reads and validates configuration from environment.
 *
 * Usage:
 * ```
 * const config = await configLoader.load();
 * if (config.isFailure) {
 *   console.error('Configuration validation failed:', config.error);
 *   process.exit(1);
 * }
 * ```
 */
export interface ConfigurationLoader {
  /**
   * Load and validate application configuration.
   *
   * Returns Result.fail if required values are missing
   * or validation fails.
   */
  load(): Promise<import('@rios/shared').Result<AppConfig>>;
}

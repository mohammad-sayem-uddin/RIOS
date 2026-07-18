/**
 * Purpose:
 * Defines the logging contract for Infrastructure.
 *
 * Architecture reference:
 * Infrastructure Layer — Logging Strategy.
 *
 * The Logger:
 * - Provides structured, leveled logging.
 * - Decouples application/domain code from logging implementations.
 * - Supports context injection (correlation IDs, user IDs, etc.).
 * - Enables log aggregation and observability.
 *
 * Log levels follow standard severity:
 * TRACE → DEBUG → INFO → WARN → ERROR → FATAL
 *
 * This interface does NOT:
 * - Know about specific logging libraries (winston, pino, etc.).
 * - Contain formatting logic (implementations do).
 * - Store logs (implementations choose destination).
 *
 * Dependency rule:
 * Infrastructure owns logging. No external dependencies.
 */

/**
 * Log levels ordered by severity.
 */
export const LogLevel = {
  TRACE: 'TRACE',
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  FATAL: 'FATAL',
} as const;

export type LogLevelType = (typeof LogLevel)[keyof typeof LogLevel];

/**
 * Structured log entry context.
 */
export interface LogContext {
  readonly [key: string]: unknown;
}

/**
 * Logger — structured, leveled logging contract.
 *
 * Usage:
 * ```
 * logger.info('User authenticated', { userId: '123', method: 'oauth' });
 * logger.error('Database connection failed', { host: 'localhost', error });
 * ```
 */
export interface Logger {
  /**
   * Log a trace-level message. Most verbose, for development only.
   */
  trace(message: string, context?: LogContext): void;

  /**
   * Log a debug-level message. Detailed diagnostic information.
   */
  debug(message: string, context?: LogContext): void;

  /**
   * Log an info-level message. General operational messages.
   */
  info(message: string, context?: LogContext): void;

  /**
   * Log a warn-level message. Potentially harmful situations.
   */
  warn(message: string, context?: LogContext): void;

  /**
   * Log an error-level message. Error events that might still allow
   * the application to continue running.
   */
  error(message: string, context?: LogContext): void;

  /**
   * Log a fatal-level message. Severe errors that cause premature termination.
   */
  fatal(message: string, context?: LogContext): void;

  /**
   * Create a child logger with additional context.
   * The child logger inherits the parent's configuration
   * and adds the provided context to all log entries.
   *
   * @param context - Additional context for the child logger.
   */
  child(context: LogContext): Logger;
}

/**
 * Logger factory — creates logger instances.
 *
 * Usage:
 * ```
 * const logger = loggerFactory.create('ResearchIdentityRepository');
 * logger.info('Repository initialized');
 * ```
 */
export interface LoggerFactory {
  /**
   * Create a logger for a specific component.
   *
   * @param component - The component name (e.g., class name, module name).
   */
  create(component: string): Logger;
}

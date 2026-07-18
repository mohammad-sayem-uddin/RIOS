/**
 * Structured Logger & LoggerFactory Implementation.
 *
 * Architecture reference:
 * Infrastructure Layer — Logging Strategy.
 *
 * Features:
 * - Implements Logger & LoggerFactory interfaces.
 * - Supports log level severity ordering (TRACE, DEBUG, INFO, WARN, ERROR, FATAL).
 * - Context inheritance via child loggers.
 * - Structured formatting with timestamp, component, correlationId, and transactionId.
 * - Pluggable output sink and metrics hooks for observability.
 */

import type { Logger, LoggerFactory, LogContext, LogLevelType } from './logger.js';
import { LogLevel } from './logger.js';

const LOG_LEVEL_SEVERITY: Record<LogLevelType, number> = {
  TRACE: 10,
  DEBUG: 20,
  INFO: 30,
  WARN: 40,
  ERROR: 50,
  FATAL: 60,
};

export interface MetricsHook {
  recordLog(level: LogLevelType, component?: string): void;
  recordOperation(operation: string, durationMs: number, success: boolean): void;
}

export type LogSink = (formattedMessage: string, entry: Record<string, unknown>) => void;

export interface StructuredLoggerOptions {
  readonly component?: string;
  readonly minLevel?: LogLevelType;
  readonly context?: LogContext;
  readonly sink?: LogSink;
  readonly metricsHook?: MetricsHook;
}

export class StructuredLogger implements Logger {
  private readonly component: string;
  private readonly minLevel: LogLevelType;
  private readonly minLevelSeverity: number;
  private readonly context: LogContext;
  private readonly sink: LogSink;
  private readonly metricsHook?: MetricsHook;

  private static readonly defaultSink: LogSink = (formattedMessage: string): void => {
    process.stdout.write(`${formattedMessage}\n`);
  };

  constructor(options: StructuredLoggerOptions = {}) {
    this.component = options.component ?? 'Application';
    this.minLevel = options.minLevel ?? LogLevel.INFO;
    this.minLevelSeverity = LOG_LEVEL_SEVERITY[this.minLevel] ?? LOG_LEVEL_SEVERITY.INFO;
    this.context = options.context ?? {};
    this.sink = options.sink ?? StructuredLogger.defaultSink;
    this.metricsHook = options.metricsHook;
  }

  private shouldLog(level: LogLevelType): boolean {
    const levelSeverity = LOG_LEVEL_SEVERITY[level] ?? LOG_LEVEL_SEVERITY.INFO;
    return levelSeverity >= this.minLevelSeverity;
  }

  private writeLog(level: LogLevelType, message: string, callContext?: LogContext): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const mergedContext = { ...this.context, ...callContext };
    const timestamp = new Date().toISOString();

    const entry: Record<string, unknown> = {
      timestamp,
      level,
      component: this.component,
      message,
      ...mergedContext,
    };

    const formatted = JSON.stringify(entry);
    this.sink(formatted, entry);
    this.metricsHook?.recordLog(level, this.component);
  }

  trace(message: string, context?: LogContext): void {
    this.writeLog(LogLevel.TRACE, message, context);
  }

  debug(message: string, context?: LogContext): void {
    this.writeLog(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: LogContext): void {
    this.writeLog(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.writeLog(LogLevel.WARN, message, context);
  }

  error(message: string, context?: LogContext): void {
    this.writeLog(LogLevel.ERROR, message, context);
  }

  fatal(message: string, context?: LogContext): void {
    this.writeLog(LogLevel.FATAL, message, context);
  }

  child(additionalContext: LogContext): Logger {
    return new StructuredLogger({
      component:
        typeof additionalContext.component === 'string'
          ? additionalContext.component
          : this.component,
      minLevel: this.minLevel,
      context: { ...this.context, ...additionalContext },
      sink: this.sink,
      metricsHook: this.metricsHook,
    });
  }
}

export class DefaultLoggerFactory implements LoggerFactory {
  constructor(
    private readonly minLevel: LogLevelType = LogLevel.INFO,
    private readonly sink?: LogSink,
    private readonly metricsHook?: MetricsHook,
  ) {}

  create(component: string): Logger {
    return new StructuredLogger({
      component,
      minLevel: this.minLevel,
      sink: this.sink,
      metricsHook: this.metricsHook,
    });
  }
}

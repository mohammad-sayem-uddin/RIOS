import { describe, it, expect, vi } from 'vitest';

import { LogLevel } from '../logging/logger.js';
import { StructuredLogger, DefaultLoggerFactory } from '../logging/structured-logger.js';

describe('StructuredLogger & DefaultLoggerFactory', () => {
  it('should filter logs below minimum severity level', (): void => {
    const logs: Array<{ message: string; level: string }> = [];
    const sink = (_formatted: string, entry: Record<string, unknown>): void => {
      logs.push({ message: entry.message as string, level: entry.level as string });
    };

    const logger = new StructuredLogger({
      minLevel: LogLevel.WARN,
      sink,
    });

    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warn message');
    logger.error('Error message');

    expect(logs).toHaveLength(2);
    expect(logs[0]).toEqual({ message: 'Warn message', level: 'WARN' });
    expect(logs[1]).toEqual({ message: 'Error message', level: 'ERROR' });
  });

  it('should pass component name and merged context to child loggers', (): void => {
    const logs: Array<Record<string, unknown>> = [];
    const sink = (_formatted: string, entry: Record<string, unknown>): void => {
      logs.push(entry);
    };

    const parent = new StructuredLogger({
      component: 'ParentComponent',
      context: { correlationId: 'corr-123' },
      sink,
    });

    const child = parent.child({
      component: 'ChildComponent',
      transactionId: 'tx-456',
    });

    child.info('Child log message');

    expect(logs).toHaveLength(1);
    expect(logs[0].component).toBe('ChildComponent');
    expect(logs[0].correlationId).toBe('corr-123');
    expect(logs[0].transactionId).toBe('tx-456');
    expect(logs[0].message).toBe('Child log message');
  });

  it('should record log metrics via metrics hook', (): void => {
    const recordLogSpy = vi.fn();
    const metricsHook = {
      recordLog: recordLogSpy,
      recordOperation: vi.fn(),
    };

    const logger = new StructuredLogger({
      component: 'TestComponent',
      metricsHook,
      sink: (): void => {},
    });

    logger.info('Test log');

    expect(recordLogSpy).toHaveBeenCalledWith('INFO', 'TestComponent');
  });

  it('should create logger using DefaultLoggerFactory', (): void => {
    const factory = new DefaultLoggerFactory(LogLevel.DEBUG, (): void => {});
    const logger = factory.create('LoggerFactoryComponent');

    expect(logger).toBeDefined();
  });
});

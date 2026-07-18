/**
 * Infrastructure Layer — Smoke Test.
 *
 * Validates that all infrastructure contracts and types
 * are properly defined and exportable.
 *
 * This test does NOT implement any contract.
 * It only verifies the structural foundation exists.
 */
import { describe, it, expect } from 'vitest';

import {
  InfrastructureErrorCode,
  InfrastructureErrorMapper,
  TransactionIsolationLevel,
  DatabaseConnectionStatus,
  LogLevel,
} from '../index.js';
import type {
  InfrastructureRepository,
  PersistenceHealthStatus,
  AggregateMapper,
  UnitOfWork,
  EventPublisher,
  Logger,
  DateTimeProvider,
} from '../index.js';

describe('Infrastructure Layer — Smoke Tests', () => {
  describe('Error Codes', () => {
    it('should define all expected infrastructure error codes', () => {
      expect(InfrastructureErrorCode.CONNECTION_FAILED).toBe('INFRA_CONNECTION_FAILED');
      expect(InfrastructureErrorCode.QUERY_FAILED).toBe('INFRA_QUERY_FAILED');
      expect(InfrastructureErrorCode.TRANSACTION_FAILED).toBe('INFRA_TRANSACTION_FAILED');
      expect(InfrastructureErrorCode.NOT_FOUND).toBe('INFRA_NOT_FOUND');
      expect(InfrastructureErrorCode.UNIQUE_VIOLATION).toBe('INFRA_UNIQUE_VIOLATION');
      expect(InfrastructureErrorCode.SERIALIZATION_FAILED).toBe('INFRA_SERIALIZATION_FAILED');
      expect(InfrastructureErrorCode.EXTERNAL_SERVICE_UNAVAILABLE).toBe(
        'INFRA_EXTERNAL_SERVICE_UNAVAILABLE',
      );
      expect(InfrastructureErrorCode.CONFIGURATION_ERROR).toBe('INFRA_CONFIGURATION_ERROR');
      expect(InfrastructureErrorCode.EVENT_PUBLICATION_FAILED).toBe(
        'INFRA_EVENT_PUBLICATION_FAILED',
      );
      expect(InfrastructureErrorCode.UNKNOWN).toBe('INFRA_UNKNOWN');
    });

    it('should provide the InfrastructureErrorMapper as a value', () => {
      expect(InfrastructureErrorMapper).toBeDefined();
      expect(typeof InfrastructureErrorMapper).toBe('function');
    });
  });

  describe('Persistence Contracts', () => {
    it('should define TransactionIsolationLevel enum', () => {
      expect(TransactionIsolationLevel.READ_UNCOMMITTED).toBe('READ_UNCOMMITTED');
      expect(TransactionIsolationLevel.READ_COMMITTED).toBe('READ_COMMITTED');
      expect(TransactionIsolationLevel.REPEATABLE_READ).toBe('REPEATABLE_READ');
      expect(TransactionIsolationLevel.SERIALIZABLE).toBe('SERIALIZABLE');
    });
  });

  describe('Database Contracts', () => {
    it('should define DatabaseConnectionStatus enum', () => {
      expect(DatabaseConnectionStatus.CONNECTED).toBe('CONNECTED');
      expect(DatabaseConnectionStatus.DISCONNECTED).toBe('DISCONNECTED');
      expect(DatabaseConnectionStatus.CONNECTING).toBe('CONNECTING');
      expect(DatabaseConnectionStatus.ERROR).toBe('ERROR');
    });
  });

  describe('Logging Contracts', () => {
    it('should define LogLevel enum', () => {
      expect(LogLevel.DEBUG).toBe('DEBUG');
      expect(LogLevel.INFO).toBe('INFO');
      expect(LogLevel.WARN).toBe('WARN');
      expect(LogLevel.ERROR).toBe('ERROR');
      expect(LogLevel.FATAL).toBe('FATAL');
    });
  });

  describe('Type-only exports compile', () => {
    it('should allow type annotations for all infrastructure contracts', () => {
      // These are compile-time checks. If the types don't exist,
      // TypeScript will fail to compile this test file.

      // Repository contract
      const repo: InfrastructureRepository | undefined = undefined;
      expect(repo).toBeUndefined();

      // Health check
      const health: PersistenceHealthStatus = {
        isHealthy: true,
        latencyMs: 0,
        message: 'ok',
      };
      expect(health.isHealthy).toBe(true);

      // Mapper types (compile-time only)
      const mapper: AggregateMapper<unknown, unknown> | undefined = undefined;
      expect(mapper).toBeUndefined();

      // UnitOfWork type
      const uow: UnitOfWork | undefined = undefined;
      expect(uow).toBeUndefined();

      // EventPublisher type
      const publisher: EventPublisher | undefined = undefined;
      expect(publisher).toBeUndefined();

      // Logger type
      const logger: Logger | undefined = undefined;
      expect(logger).toBeUndefined();

      // DateTimeProvider type
      const dateTimeProvider: DateTimeProvider | undefined = undefined;
      expect(dateTimeProvider).toBeUndefined();
    });
  });
});

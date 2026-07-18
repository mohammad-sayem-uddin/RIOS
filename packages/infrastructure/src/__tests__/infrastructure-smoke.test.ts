/**
 * Infrastructure Layer — Smoke Test.
 *
 * Validates that all infrastructure contracts and types
 * are properly defined and exportable.
 *
 * This test does NOT implement any contract.
 * It only verifies the structural foundation exists.
 */
import { describe, expect, it } from 'vitest';

import {
  DatabaseConnectionStatus,
  InfrastructureErrorCode,
  InfrastructureErrorMapper,
  LogLevel,
  TransactionIsolationLevel,
} from '../index.js';
import type {
  AggregateMapper,
  InfrastructureRepository,
  Logger,
  PersistenceHealthStatus,
  UnitOfWork,
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
    });

    it('should map domain-equivalent error messages properly', () => {
      const connErr = InfrastructureErrorMapper.toInfrastructureError(new Error('Timeout'));
      expect(connErr.code).toBe(InfrastructureErrorCode.CONNECTION_FAILED);
      expect(connErr.message).toContain('Timeout');

      const notFoundErr = InfrastructureErrorMapper.toInfrastructureError(
        new Error('Entity not found'),
      );
      expect(notFoundErr.code).toBe(InfrastructureErrorCode.NOT_FOUND);
      expect(notFoundErr.message).toContain('not found');
    });
  });

  describe('Enums and Constants', () => {
    it('should export TransactionIsolationLevel values', () => {
      expect(TransactionIsolationLevel.READ_COMMITTED).toBe('READ_COMMITTED');
      expect(TransactionIsolationLevel.REPEATABLE_READ).toBe('REPEATABLE_READ');
      expect(TransactionIsolationLevel.SERIALIZABLE).toBe('SERIALIZABLE');
    });

    it('should export DatabaseConnectionStatus values', () => {
      expect(DatabaseConnectionStatus.DISCONNECTED).toBe('DISCONNECTED');
      expect(DatabaseConnectionStatus.CONNECTED).toBe('CONNECTED');
      expect(DatabaseConnectionStatus.ERROR).toBe('ERROR');
    });

    it('should export LogLevel values', () => {
      expect(LogLevel.DEBUG).toBe('DEBUG');
      expect(LogLevel.INFO).toBe('INFO');
      expect(LogLevel.WARN).toBe('WARN');
      expect(LogLevel.ERROR).toBe('ERROR');
      expect(LogLevel.FATAL).toBe('FATAL');
    });
  });

  describe('Contract Type Check', () => {
    it('should allow compiling dummy structures matching types', () => {
      // Mock Repository reference (compile-time type assertion)
      const repoRef: InfrastructureRepository | undefined = undefined;
      expect(repoRef).toBeUndefined();

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

      // Logger type
      const logger: Logger | undefined = undefined;
      expect(logger).toBeUndefined();
    });
  });
});

/**
 * @rios/shared — Smoke Test
 * Verifies all foundational building blocks are exported correctly.
 */

import { describe, it, expect } from 'vitest';

import {
  ValueObject,
  Entity,
  UniqueId,
  AggregateRoot,
  DomainEvent,
  DomainError,
  ApplicationError,
  InfrastructureError,
  Left,
  Right,
  left,
  right,
  SystemClock,
  FixedClock,
} from '../index.js';

describe('@rios/shared smoke tests', () => {
  describe('DDD Primitives', () => {
    it('should export ValueObject', () => {
      expect(ValueObject).toBeDefined();
      expect(typeof ValueObject).toBe('function');
    });

    it('should export Entity', () => {
      expect(Entity).toBeDefined();
      expect(typeof Entity).toBe('function');
    });

    it('should export UniqueId', () => {
      expect(UniqueId).toBeDefined();
      expect(typeof UniqueId).toBe('function');
    });

    it('should export AggregateRoot', () => {
      expect(AggregateRoot).toBeDefined();
      expect(typeof AggregateRoot).toBe('function');
    });

    it('should export DomainEvent', () => {
      expect(DomainEvent).toBeDefined();
      expect(typeof DomainEvent).toBe('function');
    });
  });

  describe('UniqueId', () => {
    it('should create a unique id with auto-generated UUID', () => {
      const id = UniqueId.create();
      expect(id.value).toBeDefined();
      expect(typeof id.value).toBe('string');
      expect(id.value.length).toBe(36);
    });

    it('should create a unique id from an existing string', () => {
      const id = UniqueId.from('test-id-123');
      expect(id.value).toBe('test-id-123');
    });

    it('should produce equal ids for same value', () => {
      const id1 = UniqueId.from('same-id');
      const id2 = UniqueId.from('same-id');
      expect(id1.equals(id2)).toBe(true);
    });

    it('should produce different ids for different values', () => {
      const id1 = UniqueId.create();
      const id2 = UniqueId.create();
      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe('Error Types', () => {
    it('should export DomainError', () => {
      expect(DomainError).toBeDefined();
    });

    it('should export ApplicationError', () => {
      expect(ApplicationError).toBeDefined();
    });

    it('should export InfrastructureError', () => {
      expect(InfrastructureError).toBeDefined();
    });
  });

  describe('Either Monad', () => {
    it('should create Left values', () => {
      const result = left('error');
      expect(result).toBeInstanceOf(Left);
      expect(result.isLeft()).toBe(true);
      expect(result.isRight()).toBe(false);
    });

    it('should create Right values', () => {
      const result = right('success');
      expect(result).toBeInstanceOf(Right);
      expect(result.isRight()).toBe(true);
      expect(result.isLeft()).toBe(false);
    });
  });

  describe('Utilities', () => {
    it('should export SystemClock', () => {
      const clock = new SystemClock();
      const now = clock.now();
      expect(now).toBeInstanceOf(Date);
    });

    it('should export FixedClock', () => {
      const fixed = new Date('2025-01-01T00:00:00Z');
      const clock = new FixedClock(fixed);
      expect(clock.now().toISOString()).toBe('2025-01-01T00:00:00.000Z');
    });
  });
});

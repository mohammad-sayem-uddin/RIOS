import { Result } from '@rios/shared';
import { describe, expect, it } from 'vitest';

import { DatabaseConnectionStatus } from '../database/database-provider.js';
import type { DatabaseProvider } from '../database/database-provider.js';
import {
  InMemoryCacheProvider,
  InMemoryJobQueueProvider,
  InMemoryMetricsProvider,
  InMemoryNotificationProvider,
  LocalObjectStorageProvider,
  MockEmailProvider,
  PrismaAuditRepository,
  PrismaConfigurationRepository,
  PrismaJobRepository,
  PrismaNotificationRepository,
} from '../enterprise/index.js';

describe('Enterprise Platform Infrastructure Layer (Sprint 14)', () => {
  describe('Provider Implementations', () => {
    it('should send notifications via InMemoryNotificationProvider', async () => {
      const provider = new InMemoryNotificationProvider();
      const success = await provider.send('user_1', 'EMAIL', 'Hello World', 'Subject');
      expect(success).toBe(true);
      expect(provider.sentNotifications.length).toBe(1);
    });

    it('should dispatch emails via MockEmailProvider', async () => {
      const provider = new MockEmailProvider();
      const success = await provider.sendEmail('test@example.com', 'Welcome', 'Body text');
      expect(success).toBe(true);
      expect(provider.sentEmails.length).toBe(1);
    });

    it('should handle caching via InMemoryCacheProvider', async () => {
      const cache = new InMemoryCacheProvider();
      await cache.set('key_1', { data: 'test' });
      const item = await cache.get<{ data: string }>('key_1');
      expect(item).toEqual({ data: 'test' });

      await cache.delete('key_1');
      const deleted = await cache.get('key_1');
      expect(deleted).toBeNull();
    });

    it('should manage job queue via InMemoryJobQueueProvider', async () => {
      const queue = new InMemoryJobQueueProvider();
      const jobId = await queue.enqueue('SEND_EMAIL', { to: 'a@b.com' });
      expect(jobId).toBeDefined();
      expect(queue.queue.length).toBe(1);
    });

    it('should handle object storage via LocalObjectStorageProvider', async () => {
      const storage = new LocalObjectStorageProvider();
      const buf = Buffer.from('hello world');
      const uri = await storage.upload('test.txt', buf, 'text/plain');
      expect(uri).toContain('local://storage/test.txt');

      const downloaded = await storage.download('test.txt');
      expect(downloaded?.toString()).toBe('hello world');
    });

    it('should record metrics via InMemoryMetricsProvider', () => {
      const metrics = new InMemoryMetricsProvider();
      metrics.incrementCounter('http_requests_total');
      metrics.recordGauge('active_sessions', 42);

      expect(metrics.counters.get('http_requests_total')).toBe(1);
      expect(metrics.gauges.get('active_sessions')).toBe(42);
    });
  });

  describe('Prisma Repositories (Fallback & Memory handling)', () => {
    const mockDbProvider: DatabaseProvider = {
      connect: (): Promise<Result<void>> => Promise.resolve(Result.ok(undefined)),
      disconnect: (): Promise<Result<void>> => Promise.resolve(Result.ok(undefined)),
      getClient: (): unknown => ({}),
      isHealthy: (): Promise<boolean> => Promise.resolve(true),
      getStatus: () => DatabaseConnectionStatus.CONNECTED,
    };

    it('should initialize Prisma repositories without error', () => {
      const notifRepo = new PrismaNotificationRepository(mockDbProvider);
      const auditRepo = new PrismaAuditRepository(mockDbProvider);
      const jobRepo = new PrismaJobRepository(mockDbProvider);
      const configRepo = new PrismaConfigurationRepository(mockDbProvider);

      expect(notifRepo).toBeDefined();
      expect(auditRepo).toBeDefined();
      expect(jobRepo).toBeDefined();
      expect(configRepo).toBeDefined();
    });
  });
});

import { describe, expect, it } from 'vitest';

import {
  AuditId,
  AuditLog,
  BackgroundJob,
  ConfigurationKey,
  FeatureFlag,
  FeatureFlagName,
  JobId,
  Notification,
  NotificationId,
  NotificationMessage,
} from '../enterprise/index.js';

describe('Enterprise Platform Domain Layer (Sprint 14)', () => {
  describe('Value Objects', () => {
    it('should create and validate NotificationId, JobId, AuditId', () => {
      const notifId = NotificationId.create();
      expect(notifId.value).toBeDefined();

      const jobId = JobId.create();
      expect(jobId.value).toBeDefined();

      const auditId = AuditId.create();
      expect(auditId.value).toBeDefined();
    });

    it('should create and validate FeatureFlagName and ConfigurationKey', () => {
      const flagNameRes = FeatureFlagName.create('enable_ai_search');
      expect(flagNameRes.isSuccess).toBe(true);
      expect(flagNameRes.value.value).toBe('enable_ai_search');

      const configKeyRes = ConfigurationKey.create('max_connections');
      expect(configKeyRes.isSuccess).toBe(true);
      expect(configKeyRes.value.value).toBe('MAX_CONNECTIONS');
    });
  });

  describe('Entities & Aggregates', () => {
    it('should create and manage Notification aggregate state', () => {
      const msgRes = NotificationMessage.create({
        recipientId: 'user_123',
        type: 'SYSTEM_ALERT',
        channel: 'EMAIL',
        subject: 'Maintenance Notice',
        message: 'System upgrade scheduled',
      });
      expect(msgRes.isSuccess).toBe(true);

      const notifRes = Notification.create(msgRes.value);
      expect(notifRes.isSuccess).toBe(true);

      const notif = notifRes.value;
      expect(notif.status).toBe('QUEUED');
      expect(notif.canRetry()).toBe(true);

      notif.markSending();
      expect(notif.status).toBe('SENDING');

      notif.markSent();
      expect(notif.status).toBe('SENT');
      expect(notif.sentAt).toBeDefined();
      expect(notif.domainEvents.length).toBeGreaterThan(0);
    });

    it('should create immutable AuditLog entry', () => {
      const auditRes = AuditLog.create({
        userId: 'user_admin',
        action: 'UPDATE_FEATURE_FLAG',
        details: 'Enabled AI search flag',
        ipAddress: '127.0.0.1',
      });
      expect(auditRes.isSuccess).toBe(true);

      const audit = auditRes.value;
      expect(audit.action).toBe('UPDATE_FEATURE_FLAG');
      expect(audit.domainEvents.length).toBe(1);
    });

    it('should create and transition BackgroundJob lifecycle', () => {
      const jobRes = BackgroundJob.create('INDEX_REBUILD', { target: 'all' });
      expect(jobRes.isSuccess).toBe(true);

      const job = jobRes.value;
      expect(job.status).toBe('SCHEDULED');

      job.startExecution();
      expect(job.status).toBe('RUNNING');

      job.completeExecution(120);
      expect(job.status).toBe('COMPLETED');
      expect(job.executions.length).toBe(1);
      expect(job.executions[0].status).toBe('SUCCESS');
    });

    it('should create and toggle FeatureFlag entity', () => {
      const flagNameRes = FeatureFlagName.create('beta_ui');
      const flagRes = FeatureFlag.create({
        name: flagNameRes.value,
        isEnabled: false,
        description: 'Beta user interface',
      });
      expect(flagRes.isSuccess).toBe(true);

      const flag = flagRes.value;
      expect(flag.isEnabled).toBe(false);

      flag.enable();
      expect(flag.isEnabled).toBe(true);

      flag.toggle();
      expect(flag.isEnabled).toBe(false);
    });
  });
});

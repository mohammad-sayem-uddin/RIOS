import type { EnterpriseApplicationService } from '@rios/application';
import { Result } from '@rios/shared';
import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import { EnterpriseController } from '../controllers/enterprise.controller.js';
import { createEnterpriseRouter } from '../routes/enterprise.routes.js';

interface TestResponseBody {
  success: boolean;
  data: unknown;
}

describe('Enterprise Platform Presentation Tests (Sprint 14)', () => {
  const mockService: EnterpriseApplicationService = {
    getHealthStatus: vi.fn().mockResolvedValue(
      Result.ok({
        status: 'HEALTHY',
        version: '1.0.0',
        uptimeSeconds: 100,
        timestamp: new Date().toISOString(),
        components: [],
      }),
    ),
    getSystemMetrics: vi.fn().mockResolvedValue(
      Result.ok([
        {
          metricName: 'cpu_usage',
          metricType: 'GAUGE',
          value: 12.5,
          recordedAt: new Date().toISOString(),
        },
      ]),
    ),
    getAuditLogs: vi.fn().mockResolvedValue(Result.ok([])),
    createAuditEntry: vi.fn().mockResolvedValue(Result.ok({ id: 'audit_1', action: 'TEST' })),
    getJobStatus: vi.fn().mockResolvedValue(Result.ok({ id: 'job_1', status: 'COMPLETED' })),
    scheduleBackgroundJob: vi
      .fn()
      .mockResolvedValue(Result.ok({ id: 'job_1', status: 'SCHEDULED' })),
    retryJob: vi.fn().mockResolvedValue(Result.ok({ id: 'job_1', status: 'RUNNING' })),
    queueNotification: vi.fn().mockResolvedValue(Result.ok({ id: 'notif_1', status: 'QUEUED' })),
    sendEmail: vi.fn().mockResolvedValue(Result.ok({ id: 'notif_email_1', status: 'SENT' })),
    triggerWebhook: vi.fn().mockResolvedValue(Result.ok({ id: 'wh_1', name: 'hook_1' })),
    getFeatureFlags: vi.fn().mockResolvedValue(Result.ok([])),
    updateFeatureFlag: vi.fn().mockResolvedValue(Result.ok({ name: 'flag_1', isEnabled: true })),
  };

  const controller = new EnterpriseController(mockService);
  const router = createEnterpriseRouter({ controller });
  const app = express();
  app.use(express.json());
  app.use(router);

  it('should return 200 for GET /health', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    const body = response.body as TestResponseBody;
    expect(body.success).toBe(true);
  });

  it('should return 200 for GET /metrics', async () => {
    const response = await request(app).get('/metrics');
    expect(response.status).toBe(200);
    const body = response.body as TestResponseBody;
    expect(body.success).toBe(true);
  });

  it('should return 202 for POST /jobs', async () => {
    const response = await request(app)
      .post('/jobs')
      .send({ jobType: 'DATA_SYNC', payload: { all: true } });
    expect(response.status).toBe(202);
    const body = response.body as TestResponseBody;
    expect(body.success).toBe(true);
  });

  it('should return 201 for POST /notifications', async () => {
    const response = await request(app)
      .post('/notifications')
      .send({ recipientId: 'u1', type: 'ALERT', channel: 'EMAIL', message: 'Hello' });
    expect(response.status).toBe(201);
    const body = response.body as TestResponseBody;
    expect(body.success).toBe(true);
  });
});

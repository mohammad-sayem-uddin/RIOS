/**
 * @rios/presentation — Enterprise Platform Express Routes (Sprint 14)
 */

import { Router } from 'express';
import type { RequestHandler } from 'express';

import type { EnterpriseController } from '../controllers/enterprise.controller.js';

export interface EnterpriseRouterOptions {
  controller: EnterpriseController;
  authMiddleware?: RequestHandler;
}

export function createEnterpriseRouter(options: EnterpriseRouterOptions): Router {
  const router = Router();
  const { controller, authMiddleware } = options;

  const auth: RequestHandler = authMiddleware ?? ((_req, _res, next): void => next());

  // Public Monitoring & Health
  router.get('/health', controller.getHealth);
  router.get('/metrics', controller.getMetrics);

  // Audit Logging
  router.get('/audit', auth, controller.getAuditLogs);
  router.post('/audit', auth, controller.createAuditLog);

  // Background Jobs
  router.get('/jobs', auth, controller.getJobs);
  router.post('/jobs', auth, controller.scheduleJob);
  router.post('/jobs/retry', auth, controller.retryJob);

  // Notifications & Webhooks
  router.post('/notifications', auth, controller.postNotification);
  router.post('/webhooks', auth, controller.triggerWebhook);

  // Feature Flags & Configuration
  router.get('/feature-flags', auth, controller.getFeatureFlags);
  router.patch('/feature-flags', auth, controller.updateFeatureFlag);
  router.post('/feature-flags', auth, controller.updateFeatureFlag);

  return router;
}

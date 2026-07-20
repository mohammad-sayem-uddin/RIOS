/**
 * Research Intelligence API Routes (Sprint 11)
 */

import { Router, type RequestHandler } from 'express';

import { ResearchIntelligenceController } from '../controllers/research-intelligence.controller.js';

export interface ResearchIntelligenceRouterOptions {
  controller: ResearchIntelligenceController;
  authMiddleware?: RequestHandler;
}

export function createResearchIntelligenceRouter(
  options: ResearchIntelligenceRouterOptions,
): Router {
  const router = Router();
  const authGuard = options.authMiddleware ?? (((_req, _res, next) => next()) as RequestHandler);
  const ctrl = options.controller;

  // Timeline
  router.get('/timeline', ctrl.getTimeline);
  router.post('/timeline', authGuard, ctrl.createTimelineEvent);
  router.patch('/timeline', authGuard, ctrl.updateTimeline);

  // Collaborations
  router.get('/collaborations', ctrl.getCollaborations);
  router.post('/collaborations', authGuard, ctrl.createCollaboration);
  router.delete('/collaborations/:id', authGuard, ctrl.removeCollaboration);
  router.delete('/collaborations', authGuard, ctrl.removeCollaboration);

  // Analytics & Citations
  router.get('/analytics', ctrl.getAnalytics);
  router.post('/analytics/calculate', authGuard, ctrl.calculateMetrics);
  router.get('/citations', ctrl.getCitations);
  router.get('/analytics/impact', ctrl.getResearchImpact);

  return router;
}

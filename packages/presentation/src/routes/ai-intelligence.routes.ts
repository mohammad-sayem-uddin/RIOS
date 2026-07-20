/**
 * @rios/presentation — AI Research Intelligence & Knowledge Graph Express Routes (Sprint 13)
 */

import { Router } from 'express';
import type { RequestHandler } from 'express';

import type { AiIntelligenceController } from '../controllers/ai-intelligence.controller.js';

export interface AiIntelligenceRouterOptions {
  controller: AiIntelligenceController;
  authMiddleware?: RequestHandler;
}

export function createAiIntelligenceRouter(options: AiIntelligenceRouterOptions): Router {
  const router = Router();
  const { controller, authMiddleware } = options;

  const auth: RequestHandler = authMiddleware ?? ((_req, _res, next): void => next());

  // AI Embeddings & Recommendations (POST)
  router.post('/ai/embeddings', auth, controller.generateEmbeddings);
  router.post('/ai/recommendations', auth, controller.generateRecommendations);

  // AI Research Intelligence Queries (GET)
  router.get('/ai/recommendations', auth, controller.getRecommendations);
  router.get('/ai/similar-researchers', auth, controller.getSimilarResearchers);
  router.get('/ai/research-trends', auth, controller.getResearchTrends);
  router.get('/ai/research-gaps', auth, controller.getResearchGaps);

  // Knowledge Graph (GET)
  router.get('/knowledge-graph', auth, controller.getKnowledgeGraph);

  return router;
}

/**
 * Research Discovery API Routes (Sprint 12)
 */

import { Router, type RequestHandler } from 'express';

import { ResearchDiscoveryController } from '../controllers/research-discovery.controller.js';

export interface ResearchDiscoveryRouterOptions {
  controller: ResearchDiscoveryController;
  authMiddleware?: RequestHandler;
}

export function createResearchDiscoveryRouter(options: ResearchDiscoveryRouterOptions): Router {
  const router = Router();
  const authGuard = options.authMiddleware ?? (((_req, _res, next) => next()) as RequestHandler);
  const ctrl = options.controller;

  // Search Endpoints
  router.get('/search', ctrl.globalSearch);
  router.get('/search/publications', ctrl.searchPublications);
  router.get('/search/projects', ctrl.searchProjects);
  router.get('/search/datasets', ctrl.searchDatasets);
  router.get('/search/researchers', ctrl.searchResearchers);
  router.post('/search/index', authGuard, ctrl.updateSearchIndex);

  // Profiles & Portfolios & Institutions
  router.get('/profiles/:slug', ctrl.getPublicProfile);
  router.post('/profiles/publish', authGuard, ctrl.publishProfile);
  router.post('/profiles/unpublish', authGuard, ctrl.unpublishProfile);

  router.get('/portfolio/:slug', ctrl.getPortfolio);
  router.post('/portfolios', authGuard, ctrl.createPortfolio);

  router.get('/institutions', ctrl.searchInstitutions);

  return router;
}

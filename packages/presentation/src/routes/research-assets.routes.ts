/**
 * Research Assets API Routes (Sprint 9)
 */

import { Router, type RequestHandler } from 'express';

import { ResearchAssetsController } from '../controllers/research-assets.controller.js';

export interface ResearchAssetsRouterOptions {
  controller: ResearchAssetsController;
  authMiddleware?: RequestHandler;
}

export function createResearchAssetsRouter(options: ResearchAssetsRouterOptions): Router {
  const router = Router();
  const authGuard = options.authMiddleware ?? (((_req, _res, next) => next()) as RequestHandler);
  const ctrl = options.controller;

  // Datasets
  router.post('/datasets', authGuard, ctrl.createDataset);
  router.get('/datasets', ctrl.searchDatasets);
  router.get('/datasets/:id', ctrl.getDatasetById);
  router.post('/datasets/:id/publish', authGuard, ctrl.publishDataset);
  router.delete('/datasets/:id', authGuard, ctrl.deleteDataset);

  // Repositories
  router.post('/repositories', authGuard, ctrl.createRepository);
  router.get('/repositories', ctrl.searchRepositories);
  router.get('/repositories/:id', ctrl.getRepositoryById);

  // Software
  router.post('/software', authGuard, ctrl.createSoftwareArtifact);
  router.post('/software/release', authGuard, ctrl.releaseSoftware);

  // Experiments
  router.post('/experiments', authGuard, ctrl.createExperiment);
  router.get('/experiments/:id', ctrl.getExperimentById);

  // General Research Assets
  router.post('/research-assets', authGuard, ctrl.uploadResearchAsset);
  router.get('/research-assets', ctrl.getResearchAssets);
  router.delete('/research-assets/:id', authGuard, ctrl.deleteResearchAsset);

  return router;
}

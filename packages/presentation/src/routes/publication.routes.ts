/**
 * Publications & Research Projects API Routes (Sprint 8)
 */

import { Router, type RequestHandler } from 'express';

import { PublicationController } from '../controllers/publication.controller.js';
import { ResearchProjectController } from '../controllers/research-project.controller.js';

export interface PublicationRouterOptions {
  publicationController: PublicationController;
  projectController: ResearchProjectController;
  authMiddleware?: RequestHandler;
}

export function createPublicationRouter(options: PublicationRouterOptions): Router {
  const router = Router();
  const authGuard = options.authMiddleware ?? (((_req, _res, next) => next()) as RequestHandler);
  const pubCtrl = options.publicationController;
  const projCtrl = options.projectController;

  // Publication Endpoints
  router.post('/publications', authGuard, pubCtrl.createPublication);
  router.get('/publications', pubCtrl.searchPublications);
  router.get('/publications/stats', pubCtrl.getStatistics);
  router.get('/publications/:id', pubCtrl.getPublicationById);
  router.get('/research-profiles/:profileId/publications', pubCtrl.getPublicationsByProfileId);
  router.patch('/publications/:id', authGuard, pubCtrl.updatePublication);
  router.post('/publications/:id/publish', authGuard, pubCtrl.publishPublication);
  router.post('/publications/:id/submit', authGuard, pubCtrl.submitPublication);
  router.delete('/publications/:id', authGuard, pubCtrl.deletePublication);

  // Research Project Endpoints
  router.post('/research-projects', authGuard, projCtrl.createProject);
  router.get('/research-projects/:id', projCtrl.getProjectById);
  router.get('/research-profiles/:profileId/research-projects', projCtrl.getProjectsByProfileId);
  router.patch('/research-projects/:id', authGuard, projCtrl.updateProject);
  router.post('/research-projects/:id/complete', authGuard, projCtrl.completeProject);
  router.delete('/research-projects/:id', authGuard, projCtrl.deleteProject);
  router.post('/research-projects/:id/members', authGuard, projCtrl.addMember);
  router.delete('/research-projects/:id/members/:memberId', authGuard, projCtrl.removeMember);

  return router;
}

/**
 * Academic Recognition API Routes (Sprint 10)
 */

import { Router, type RequestHandler } from 'express';

import { AcademicRecognitionController } from '../controllers/academic-recognition.controller.js';

export interface AcademicRecognitionRouterOptions {
  controller: AcademicRecognitionController;
  authMiddleware?: RequestHandler;
}

export function createAcademicRecognitionRouter(options: AcademicRecognitionRouterOptions): Router {
  const router = Router();
  const authGuard = options.authMiddleware ?? (((_req, _res, next) => next()) as RequestHandler);
  const ctrl = options.controller;

  // Awards
  router.post('/awards', authGuard, ctrl.createAward);
  router.get('/awards', ctrl.searchAwards);
  router.get('/awards/:id', ctrl.getAwardById);
  router.delete('/awards/:id', authGuard, ctrl.deleteAward);

  // Grants
  router.post('/grants', authGuard, ctrl.createGrant);
  router.get('/grants', ctrl.searchGrants);
  router.get('/grants/:id', ctrl.getGrantById);
  router.post('/grants/:id/complete', authGuard, ctrl.completeGrant);
  router.delete('/grants/:id', authGuard, ctrl.deleteGrant);

  // Patents
  router.post('/patents', authGuard, ctrl.createPatent);
  router.get('/patents', ctrl.searchPatents);
  router.get('/patents/:id', ctrl.getPatentById);
  router.patch('/patents/:id/status', authGuard, ctrl.updatePatentStatus);
  router.delete('/patents/:id', authGuard, ctrl.deletePatent);

  // Professional Activities
  router.post('/professional-activities', authGuard, ctrl.createProfessionalActivity);
  router.get('/professional-activities', ctrl.searchProfessionalActivities);
  router.get('/professional-activities/:id', ctrl.getProfessionalActivityById);
  router.delete('/professional-activities/:id', authGuard, ctrl.deleteProfessionalActivity);

  return router;
}

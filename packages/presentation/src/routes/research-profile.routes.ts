/**
 * Research Profile API Routes (Sprint 7 & 7.5 Hardened)
 */

import { Router, type RequestHandler } from 'express';

import { ResearchProfileController } from '../controllers/research-profile.controller.js';

export interface ResearchProfileRouterOptions {
  controller: ResearchProfileController;
  ownershipGuard?: RequestHandler;
}

export function createResearchProfileRouter(
  optionsOrController: ResearchProfileController | ResearchProfileRouterOptions,
): Router {
  const router = Router();
  const controller =
    'controller' in optionsOrController ? optionsOrController.controller : optionsOrController;
  const ownershipGuard =
    'ownershipGuard' in optionsOrController && optionsOrController.ownershipGuard
      ? optionsOrController.ownershipGuard
      : (((_req, _res, next) => next()) as RequestHandler);

  // Profile lifecycle
  router.post('/research-profiles', controller.createProfile);
  router.get('/research-profiles/:id', controller.getProfileById);
  router.get('/users/:userId/research-profile', controller.getProfileByUserId);

  // Biography
  router.put('/research-profiles/:id/biography', ownershipGuard, controller.updateBiography);

  // Education
  router.post('/research-profiles/:id/education', ownershipGuard, controller.addEducation);
  router.delete(
    '/research-profiles/:id/education/:educationId',
    ownershipGuard,
    controller.removeEducation,
  );

  // Professional Experience
  router.post('/research-profiles/:id/experience', ownershipGuard, controller.addExperience);
  router.delete(
    '/research-profiles/:id/experience/:experienceId',
    ownershipGuard,
    controller.removeExperience,
  );

  // Research Interests
  router.post(
    '/research-profiles/:id/research-interests',
    ownershipGuard,
    controller.addResearchInterest,
  );
  router.delete(
    '/research-profiles/:id/research-interests/:interestId',
    ownershipGuard,
    controller.removeResearchInterest,
  );

  // Skills
  router.post('/research-profiles/:id/skills', ownershipGuard, controller.addSkill);
  router.delete('/research-profiles/:id/skills/:skillId', ownershipGuard, controller.removeSkill);

  // External Profiles
  router.post(
    '/research-profiles/:id/external-profiles',
    ownershipGuard,
    controller.addExternalProfile,
  );
  router.delete(
    '/research-profiles/:id/external-profiles/:externalProfileId',
    ownershipGuard,
    controller.removeExternalProfile,
  );

  // Portfolio Assets
  router.post(
    '/research-profiles/:id/portfolio-assets',
    ownershipGuard,
    controller.uploadPortfolioAsset,
  );
  router.delete(
    '/research-profiles/:id/portfolio-assets/:assetId',
    ownershipGuard,
    controller.removePortfolioAsset,
  );

  return router;
}

/**
 * API Router — Presentation Layer.
 *
 * Configures and mounts HTTP endpoints for Research Identity, Health, and Swagger.
 * Operates purely as a route mapping registry connecting URLs to Controllers.
 */

import { Router } from 'express';

import type { ResearchIdentityController } from '../controllers/research-identity.controller.js';
import type { HealthController } from '../health/health.controller.js';
import { SwaggerGenerator } from '../swagger/swagger.generator.js';
import { SchemaValidator } from '../validation/schema-validator.js';
import { createValidationMiddleware } from '../validation/validation.middleware.js';

export class ApiRouter {
  public static create(
    identityController: ResearchIdentityController,
    healthController: HealthController,
    versionPrefix = '/api/v1',
  ): Router {
    const router = Router();

    // ——— Health Probe Endpoints ———
    router.get('/health', healthController.getHealth);
    router.get('/health/live', healthController.getLiveness);
    router.get('/health/ready', healthController.getReadiness);

    // ——— Swagger Documentation Endpoints ———
    const spec = SwaggerGenerator.generateSpec();
    const html = SwaggerGenerator.generateHtml(spec);

    router.get('/docs/json', (_req, res) => res.status(200).json(spec));
    router.get('/docs', (_req, res) => res.status(200).type('text/html').send(html));

    // ——— Research Identity Endpoint Schema Validators ———
    const createValidator = new SchemaValidator({
      primaryFocus: [
        SchemaValidator.required('primaryFocus'),
        SchemaValidator.string('primaryFocus'),
      ],
      stage: [SchemaValidator.required('stage'), SchemaValidator.string('stage')],
      visionStatement: [
        SchemaValidator.required('visionStatement'),
        SchemaValidator.string('visionStatement'),
      ],
      timeHorizon: [SchemaValidator.required('timeHorizon'), SchemaValidator.string('timeHorizon')],
    });

    const updateVisionValidator = new SchemaValidator({
      visionStatement: [
        SchemaValidator.required('visionStatement'),
        SchemaValidator.string('visionStatement'),
      ],
      timeHorizon: [SchemaValidator.required('timeHorizon'), SchemaValidator.string('timeHorizon')],
    });

    const addAreaValidator = new SchemaValidator({
      name: [SchemaValidator.required('name'), SchemaValidator.string('name')],
      description: [SchemaValidator.required('description'), SchemaValidator.string('description')],
    });

    const addQuestionValidator = new SchemaValidator({
      questionText: [
        SchemaValidator.required('questionText'),
        SchemaValidator.string('questionText'),
      ],
      significance: [
        SchemaValidator.required('significance'),
        SchemaValidator.string('significance'),
      ],
    });

    const addGoalValidator = new SchemaValidator({
      areaId: [SchemaValidator.required('areaId'), SchemaValidator.string('areaId')],
      description: [SchemaValidator.required('description'), SchemaValidator.string('description')],
      targetHorizon: [
        SchemaValidator.required('targetHorizon'),
        SchemaValidator.string('targetHorizon'),
      ],
    });

    const recordContributionValidator = new SchemaValidator({
      title: [SchemaValidator.required('title'), SchemaValidator.string('title')],
      contributionType: [
        SchemaValidator.required('contributionType'),
        SchemaValidator.string('contributionType'),
      ],
      summary: [SchemaValidator.required('summary'), SchemaValidator.string('summary')],
    });

    const updateAgendaValidator = new SchemaValidator({
      focusAreas: [SchemaValidator.required('focusAreas'), SchemaValidator.array('focusAreas')],
      strategicPillars: [
        SchemaValidator.required('strategicPillars'),
        SchemaValidator.array('strategicPillars'),
      ],
    });

    const setPhilosophyValidator = new SchemaValidator({
      corePrinciples: [
        SchemaValidator.required('corePrinciples'),
        SchemaValidator.array('corePrinciples'),
      ],
      methodologicalPreferences: [
        SchemaValidator.required('methodologicalPreferences'),
        SchemaValidator.array('methodologicalPreferences'),
      ],
      ethicalCommitments: [
        SchemaValidator.required('ethicalCommitments'),
        SchemaValidator.array('ethicalCommitments'),
      ],
    });

    const revisePhilosophyValidator = new SchemaValidator({
      corePrinciples: [
        SchemaValidator.required('corePrinciples'),
        SchemaValidator.array('corePrinciples'),
      ],
      methodologicalPreferences: [
        SchemaValidator.required('methodologicalPreferences'),
        SchemaValidator.array('methodologicalPreferences'),
      ],
      ethicalCommitments: [
        SchemaValidator.required('ethicalCommitments'),
        SchemaValidator.array('ethicalCommitments'),
      ],
      revisionReason: [
        SchemaValidator.required('revisionReason'),
        SchemaValidator.string('revisionReason'),
      ],
    });

    const recordEvolutionValidator = new SchemaValidator({
      phaseName: [SchemaValidator.required('phaseName'), SchemaValidator.string('phaseName')],
      description: [SchemaValidator.required('description'), SchemaValidator.string('description')],
    });

    // ——— Mounted REST Sub-Router ———
    const identityRouter = Router();

    identityRouter.post(
      '/',
      createValidationMiddleware(createValidator),
      identityController.create,
    );
    identityRouter.get('/', identityController.find);
    identityRouter.get('/search', identityController.search);
    identityRouter.get('/:id', identityController.getById);

    identityRouter.put(
      '/:id/vision',
      createValidationMiddleware(updateVisionValidator),
      identityController.updateVision,
    );
    identityRouter.post(
      '/:id/areas',
      createValidationMiddleware(addAreaValidator),
      identityController.addArea,
    );
    identityRouter.delete('/:id/areas/:areaId', identityController.removeArea);

    identityRouter.post(
      '/:id/questions',
      createValidationMiddleware(addQuestionValidator),
      identityController.addQuestion,
    );
    identityRouter.post(
      '/:id/goals',
      createValidationMiddleware(addGoalValidator),
      identityController.addGoal,
    );
    identityRouter.delete('/:id/goals/:goalId', identityController.removeGoal);

    identityRouter.post(
      '/:id/contributions',
      createValidationMiddleware(recordContributionValidator),
      identityController.recordContribution,
    );
    identityRouter.put(
      '/:id/agenda',
      createValidationMiddleware(updateAgendaValidator),
      identityController.updateAgenda,
    );
    identityRouter.put(
      '/:id/philosophy',
      createValidationMiddleware(setPhilosophyValidator),
      identityController.setPhilosophy,
    );
    identityRouter.post(
      '/:id/philosophy/revisions',
      createValidationMiddleware(revisePhilosophyValidator),
      identityController.revisePhilosophy,
    );
    identityRouter.post(
      '/:id/evolutions',
      createValidationMiddleware(recordEvolutionValidator),
      identityController.recordEvolution,
    );

    router.use(`${versionPrefix}/research-identities`, identityRouter);

    return router;
  }
}

/**
 * Bootstrap Presentation Server.
 *
 * Orchestrates DI resolution, Express app setup, middleware pipeline registration,
 * route mounting, and returns a production-ready PresentationHttpServer.
 */

import {
  ResearchProfileApplicationService,
  ResearchIntelligenceApplicationServiceImpl,
  ResearchDiscoveryApplicationServiceImpl,
  AiIntelligenceApplicationServiceImpl,
} from '@rios/application';
import type {
  AcademicRecognitionApplicationService,
  AuthenticationApplicationService,
  GetCurrentUserHandler,
  PublicationApplicationService,
  ResearchAssetsApplicationService,
  ResearchIdentityApplicationService,
} from '@rios/application';
import type { ISessionRepository, ITokenProvider } from '@rios/domain';
import type { Container, InfrastructureHealthCheckService, Logger } from '@rios/infrastructure';
import {
  CompositionRoot,
  DITokens,
  PrismaResearchProfileRepository,
  PrismaAcademicTimelineRepository,
  PrismaCollaborationRepository,
  PrismaResearchAnalyticsRepository,
  PrismaPublicProfileRepository,
  PrismaSearchRepository,
  PrismaDiscoveryRepository,
  PrismaEmbeddingRepository,
  PrismaKnowledgeGraphRepository,
  PrismaRecommendationRepository,
} from '@rios/infrastructure';
import express from 'express';

import { AuthenticationController } from '../authentication/authentication.controller.js';
import { PresentationConfigurationLoader } from '../configuration/presentation-config-loader.js';
import type { PresentationConfig } from '../configuration/presentation-config.js';
import { AcademicRecognitionController } from '../controllers/academic-recognition.controller.js';
import { AiIntelligenceController } from '../controllers/ai-intelligence.controller.js';
import { PublicationController } from '../controllers/publication.controller.js';
import { ResearchAssetsController } from '../controllers/research-assets.controller.js';
import { ResearchDiscoveryController } from '../controllers/research-discovery.controller.js';
import { ResearchIdentityController } from '../controllers/research-identity.controller.js';
import { ResearchIntelligenceController } from '../controllers/research-intelligence.controller.js';
import { ResearchProfileController } from '../controllers/research-profile.controller.js';
import { ResearchProjectController } from '../controllers/research-project.controller.js';
import { HealthController } from '../health/health.controller.js';
import { createAuthenticationMiddleware } from '../middleware/authentication.middleware.js';
import { createBodyParserMiddleware } from '../middleware/body-parser.middleware.js';
import { createCompressionMiddleware } from '../middleware/compression.middleware.js';
import { createCorrelationIdMiddleware } from '../middleware/correlation-id.middleware.js';
import { createExceptionMiddleware } from '../middleware/exception.middleware.js';
import { createLoggingMiddleware } from '../middleware/logging.middleware.js';
import { createRequestContextMiddleware } from '../middleware/request-context.middleware.js';
import { createRequestIdMiddleware } from '../middleware/request-id.middleware.js';
import { createSecurityHeadersMiddleware } from '../middleware/security-headers.middleware.js';
import { createTimeoutMiddleware } from '../middleware/timeout.middleware.js';
import { createAcademicRecognitionRouter } from '../routes/academic-recognition.routes.js';
import { createAiIntelligenceRouter } from '../routes/ai-intelligence.routes.js';
import { ApiRouter } from '../routes/api-router.js';
import { createPublicationRouter } from '../routes/publication.routes.js';
import { createResearchAssetsRouter } from '../routes/research-assets.routes.js';
import { createResearchDiscoveryRouter } from '../routes/research-discovery.routes.js';
import { createResearchIntelligenceRouter } from '../routes/research-intelligence.routes.js';
import { createResearchProfileRouter } from '../routes/research-profile.routes.js';

import { PresentationHttpServer } from './presentation-http-server.js';

export interface BootstrapPresentationOptions {
  readonly config?: Partial<PresentationConfig>;
  readonly container?: Container;
  readonly applicationService?: ResearchIdentityApplicationService;
  readonly authApplicationService?: AuthenticationApplicationService;
  readonly getCurrentUserHandler?: GetCurrentUserHandler;
  readonly healthService?: InfrastructureHealthCheckService;
  readonly logger?: Logger;
}

export function bootstrapPresentationServer(
  options: BootstrapPresentationOptions = {},
): PresentationHttpServer {
  const config = PresentationConfigurationLoader.load(options.config);

  // Resolve Container or CompositionRoot if not supplied
  const container = options.container ?? new CompositionRoot().getContainer();

  const logger: Logger | undefined =
    options.logger ??
    (container.has(DITokens.Logger) ? container.resolve<Logger>(DITokens.Logger) : undefined);

  const applicationService: ResearchIdentityApplicationService =
    options.applicationService ??
    container.resolve<ResearchIdentityApplicationService>(
      DITokens.ResearchIdentityApplicationService,
    );

  const authApplicationService: AuthenticationApplicationService =
    options.authApplicationService ??
    container.resolve<AuthenticationApplicationService>(DITokens.AuthenticationApplicationService);

  const tokenProvider: ITokenProvider = container.resolve<ITokenProvider>(
    DITokens.JwtTokenProvider,
  );
  const sessionRepository: ISessionRepository = container.resolve<ISessionRepository>(
    DITokens.SessionRepository,
  );

  const healthService: InfrastructureHealthCheckService | undefined =
    options.healthService ??
    (container.has(DITokens.HealthCheckService)
      ? container.resolve<InfrastructureHealthCheckService>(DITokens.HealthCheckService)
      : undefined);

  // Instantiate Express App
  const app = express();

  // Disable default Express header
  app.disable('x-powered-by');

  // Register Global Middleware Pipeline in strict architectural order
  app.use(createRequestIdMiddleware());
  app.use(createCorrelationIdMiddleware());
  app.use(createRequestContextMiddleware());

  if (logger) {
    app.use(createLoggingMiddleware(logger));
  }

  app.use(createSecurityHeadersMiddleware());
  app.use(createCompressionMiddleware(config.compressionEnabled));
  app.use(createBodyParserMiddleware(config.bodySizeLimit));
  app.use(createTimeoutMiddleware(config.requestTimeoutMs));

  // Instantiate Security Middleware
  const authMiddleware = createAuthenticationMiddleware({
    tokenProvider,
    sessionRepository,
  });

  // Instantiate Controllers
  const identityController = new ResearchIdentityController(applicationService);
  const healthController = new HealthController(healthService);
  const authController = new AuthenticationController(
    authApplicationService,
    options.getCurrentUserHandler,
  );

  // Mount ApiRouter (health, docs, auth, research-identities)
  const router = ApiRouter.create(
    identityController,
    healthController,
    config.versionPrefix,
    authController,
    authMiddleware,
  );
  app.use('/', router);

  // ——— Domain Sub-Routers ———
  // The domain feature-set (publications, profiles, assets, recognition,
  // intelligence, discovery, AI) is implemented end-to-end but was not mounted
  // by ApiRouter.create. Wire it here so the HTTP surface matches the frontend
  // contract. Registered application services are resolved from the container;
  // the remainder are composed from their repositories over the same database
  // provider the rest of the system uses.
  const dbProvider = container.resolve<
    ConstructorParameters<typeof PrismaResearchProfileRepository>[0]
  >(DITokens.DatabaseProvider);
  const prisma = (dbProvider as { getClient(): unknown }).getClient() as ConstructorParameters<
    typeof PrismaSearchRepository
  >[0];

  // Publications & Research Projects (registered service)
  const publicationService = container.resolve<PublicationApplicationService>(
    DITokens.PublicationApplicationService,
  );
  const publicationController = new PublicationController(publicationService);
  const researchProjectController = new ResearchProjectController(publicationService);
  app.use(
    config.versionPrefix,
    createPublicationRouter({
      publicationController,
      projectController: researchProjectController,
      authMiddleware,
    }),
  );

  // Research Profile
  const researchProfileService = new ResearchProfileApplicationService(
    new PrismaResearchProfileRepository(dbProvider),
  );
  const researchProfileController = new ResearchProfileController(researchProfileService);
  app.use(
    config.versionPrefix,
    createResearchProfileRouter({
      controller: researchProfileController,
      ownershipGuard: authMiddleware,
    }),
  );

  // Research Assets (registered service)
  const researchAssetsService = container.resolve<ResearchAssetsApplicationService>(
    DITokens.ResearchAssetsApplicationService,
  );
  app.use(
    config.versionPrefix,
    createResearchAssetsRouter({
      controller: new ResearchAssetsController(researchAssetsService),
      authMiddleware,
    }),
  );

  // Academic Recognition (registered service)
  const recognitionService = container.resolve<AcademicRecognitionApplicationService>(
    DITokens.AcademicRecognitionApplicationService,
  );
  app.use(
    config.versionPrefix,
    createAcademicRecognitionRouter({
      controller: new AcademicRecognitionController(recognitionService),
      authMiddleware,
    }),
  );

  // Research Intelligence
  const intelligenceService = new ResearchIntelligenceApplicationServiceImpl(
    new PrismaAcademicTimelineRepository(dbProvider),
    new PrismaCollaborationRepository(dbProvider),
    new PrismaResearchAnalyticsRepository(dbProvider),
  );
  app.use(
    config.versionPrefix,
    createResearchIntelligenceRouter({
      controller: new ResearchIntelligenceController(intelligenceService),
      authMiddleware,
    }),
  );

  // Research Discovery
  const discoveryService = new ResearchDiscoveryApplicationServiceImpl(
    new PrismaPublicProfileRepository(prisma),
    new PrismaSearchRepository(prisma),
    new PrismaDiscoveryRepository(prisma),
  );
  app.use(
    config.versionPrefix,
    createResearchDiscoveryRouter({
      controller: new ResearchDiscoveryController(discoveryService),
      authMiddleware,
    }),
  );

  // AI Intelligence
  const aiService = new AiIntelligenceApplicationServiceImpl(
    new PrismaEmbeddingRepository(prisma),
    new PrismaKnowledgeGraphRepository(prisma),
    new PrismaRecommendationRepository(prisma),
  );
  app.use(
    config.versionPrefix,
    createAiIntelligenceRouter({
      controller: new AiIntelligenceController(aiService),
      authMiddleware,
    }),
  );

  // Mount Global Exception Handler
  app.use(createExceptionMiddleware(logger));

  return new PresentationHttpServer(app, config.port, config.host, logger);
}

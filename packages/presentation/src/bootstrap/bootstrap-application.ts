/**
 * Bootstrap Presentation Server.
 *
 * Orchestrates DI resolution, Express app setup, middleware pipeline registration,
 * route mounting, and returns a production-ready PresentationHttpServer.
 */

import type {
  AuthenticationApplicationService,
  GetCurrentUserHandler,
  ResearchIdentityApplicationService,
} from '@rios/application';
import type { ISessionRepository, ITokenProvider } from '@rios/domain';
import type { Container, InfrastructureHealthCheckService, Logger } from '@rios/infrastructure';
import { CompositionRoot, DITokens } from '@rios/infrastructure';
import express from 'express';

import { AuthenticationController } from '../authentication/authentication.controller.js';
import { PresentationConfigurationLoader } from '../configuration/presentation-config-loader.js';
import type { PresentationConfig } from '../configuration/presentation-config.js';
import { ResearchIdentityController } from '../controllers/research-identity.controller.js';
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
import { ApiRouter } from '../routes/api-router.js';

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

  // Mount ApiRouter
  const router = ApiRouter.create(
    identityController,
    healthController,
    config.versionPrefix,
    authController,
    authMiddleware,
  );
  app.use('/', router);

  // Mount Global Exception Handler
  app.use(createExceptionMiddleware(logger));

  return new PresentationHttpServer(app, config.port, config.host, logger);
}

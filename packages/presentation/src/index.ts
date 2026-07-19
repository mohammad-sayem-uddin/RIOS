/**
 * @rios/presentation
 *
 * Presentation Layer — HTTP API pipeline, controllers, middleware, request context, DTOs, Swagger.
 */

// Configuration
export type { PresentationConfig } from './configuration/presentation-config.js';
export { DEFAULT_PRESENTATION_CONFIG } from './configuration/presentation-config.js';
export { PresentationConfigurationLoader } from './configuration/presentation-config-loader.js';

// Common & Context
export type { RequestContext } from './common/request-context.js';
export { createRequestContext } from './common/request-context.js';
export type { SecurityContext } from './common/security-context.js';
export { createSecurityContext } from './common/security-context.js';
import './common/express-types.js';

// DTOs & Responders
export { ApiResponseFactory } from './dto/api-response.dto.js';
export type { ApiResponseDto } from './dto/api-response.dto.js';
export type {
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
  LogoutRequestDto,
  CurrentUserResponseDto,
} from './dto/auth-dtos.js';
export * from './dto/publication-dtos.js';
export { ResultHttpMapper } from './responders/result-http-mapper.js';

// Controllers (Sprint 1-4 & Sprint 5 & Sprint 7/8/9)
export { ResearchIdentityController } from './controllers/research-identity.controller.js';
export { ResearchProfileController } from './controllers/research-profile.controller.js';
export { PublicationController } from './controllers/publication.controller.js';
export { ResearchProjectController } from './controllers/research-project.controller.js';
export { ResearchAssetsController } from './controllers/research-assets.controller.js';
export { HealthController } from './health/health.controller.js';
export { AuthenticationController } from './authentication/authentication.controller.js';

// Middleware
export { createRequestIdMiddleware } from './middleware/request-id.middleware.js';
export { createCorrelationIdMiddleware } from './middleware/correlation-id.middleware.js';
export { createSecurityHeadersMiddleware } from './middleware/security-headers.middleware.js';
export { createRequestContextMiddleware } from './middleware/request-context.middleware.js';
export { createLoggingMiddleware } from './middleware/logging.middleware.js';
export { createExceptionMiddleware } from './middleware/exception.middleware.js';
export { createAuthenticationMiddleware } from './middleware/authentication.middleware.js';
export { requireRole, requirePermission } from './authorization/authorization.middleware.js';

// Routes
export { ApiRouter } from './routes/api-router.js';
export { createAuthenticationRouter } from './authentication/authentication.routes.js';
export { createResearchProfileRouter } from './routes/research-profile.routes.js';
export { createPublicationRouter } from './routes/publication.routes.js';
export { createResearchAssetsRouter } from './routes/research-assets.routes.js';

// Bootstrap & Server
export { bootstrapPresentationServer } from './bootstrap/bootstrap-application.js';
export { PresentationHttpServer } from './bootstrap/presentation-http-server.js';

// Swagger & Versioning
export { SwaggerGenerator } from './swagger/swagger.generator.js';

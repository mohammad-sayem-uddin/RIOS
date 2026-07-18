/**
 * @rios/presentation — Presentation Layer.
 *
 * Exposes the Application Layer through an HTTP REST API adapter.
 * Preserves Clean Architecture dependency rules: Presentation depends only on
 * Application, Domain/Identity, Infrastructure (Composition Root), and Shared.
 */

// ——— Bootstrap ———
export {
  PresentationHttpServer,
  bootstrapPresentationServer,
  type BootstrapPresentationOptions,
} from './bootstrap/index.js';

// ——— Configuration ———
export {
  PresentationConfigurationLoader,
  DEFAULT_PRESENTATION_CONFIG,
  type PresentationConfig,
} from './configuration/index.js';

// ——— Controllers ———
export { ResearchIdentityController, HealthController } from './controllers/index.js';

// ——— DTOs ———
export type {
  ApiErrorDto,
  ApiMetaDto,
  ApiResponseDto,
  ComponentHealthDto,
  HealthResponseDto,
  CreateResearchIdentityRequestDto,
  UpdateResearchVisionRequestDto,
  AddResearchAreaRequestDto,
  RemoveResearchAreaRequestDto,
  AddResearchQuestionRequestDto,
  AddResearchGoalRequestDto,
  RemoveResearchGoalRequestDto,
  RecordContributionRequestDto,
  UpdateResearchAgendaRequestDto,
  SetResearchPhilosophyRequestDto,
  ReviseResearchPhilosophyRequestDto,
  RecordEvolutionRequestDto,
  FindResearchIdentitiesQueryDto,
  SearchResearchIdentityQueryDto,
  ResearchIdentityIdResponseDto,
  ResearchIdentityResponseDto,
} from './dto/index.js';
export { ApiResponseFactory } from './dto/index.js';

// ——— Middleware ———
export {
  createRequestIdMiddleware,
  createCorrelationIdMiddleware,
  createRequestContextMiddleware,
  createLoggingMiddleware,
  createBodyParserMiddleware,
  createCompressionMiddleware,
  createSecurityHeadersMiddleware,
  createTimeoutMiddleware,
  createExceptionMiddleware,
  REQUEST_ID_HEADER,
  CORRELATION_ID_HEADER,
} from './middleware/index.js';

// ——— Mappers ———
export { RequestMapper } from './mappers/index.js';

// ——— Responders ———
export { ResultHttpMapper } from './responders/index.js';

// ——— Routes ———
export { ApiRouter } from './routes/index.js';

// ——— Swagger ———
export { SwaggerGenerator, type OpenApiSpec } from './swagger/index.js';

// ——— Validation ———
export {
  SchemaValidator,
  ValidationException,
  createValidationMiddleware,
} from './validation/index.js';
export type {
  ValidationErrorDetail,
  ValidationResult,
  SchemaRules,
  FieldRule,
} from './validation/index.js';

// ——— Versioning ———
export { ApiVersionManager } from './versioning/index.js';

// ——— Common ———
export type { RequestContext } from './common/index.js';
export { createRequestContext } from './common/index.js';

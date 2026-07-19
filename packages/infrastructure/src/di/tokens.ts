/**
 * Dependency Injection Tokens & Symbols.
 *
 * Defines strongly typed tokens used to resolve dependencies in the Composition Root.
 */

export const DITokens = {
  // Infrastructure Core
  AppConfig: Symbol.for('AppConfig'),
  ConfigurationLoader: Symbol.for('ConfigurationLoader'),
  Logger: Symbol.for('Logger'),
  LoggerFactory: Symbol.for('LoggerFactory'),
  DatabaseProvider: Symbol.for('DatabaseProvider'),

  // Persistence & Strategy
  UnitOfWork: Symbol.for('UnitOfWork'),
  OutboxRepository: Symbol.for('OutboxRepository'),

  // Identity Repositories & Mappers
  ResearchIdentityRepository: Symbol.for('ResearchIdentityRepository'),
  ResearchIdentityAggregateMapper: Symbol.for('ResearchIdentityAggregateMapper'),
  ResearchIdentitySpecificationTranslator: Symbol.for('ResearchIdentitySpecificationTranslator'),

  // Application Layer Services
  ResearchIdentityApplicationService: Symbol.for('ResearchIdentityApplicationService'),

  // Monitoring & Health
  HealthCheckService: Symbol.for('HealthCheckService'),

  // Sprint 5 & 6 Identity IAM Tokens
  UserRepository: Symbol.for('UserRepository'),
  SessionRepository: Symbol.for('SessionRepository'),
  RoleRepository: Symbol.for('RoleRepository'),
  PermissionRepository: Symbol.for('PermissionRepository'),
  RefreshTokenRepository: Symbol.for('RefreshTokenRepository'),
  AuditLogRepository: Symbol.for('AuditLogRepository'),

  JwtTokenProvider: Symbol.for('JwtTokenProvider'),
  PasswordHasher: Symbol.for('PasswordHasher'),
  SecureRandomGenerator: Symbol.for('SecureRandomGenerator'),
  IdentitySystemClock: Symbol.for('IdentitySystemClock'),
  GuidGenerator: Symbol.for('GuidGenerator'),
  AuditLogger: Symbol.for('AuditLogger'),

  AuthenticationApplicationService: Symbol.for('AuthenticationApplicationService'),
  AuthorizationApplicationService: Symbol.for('AuthorizationApplicationService'),
  SessionApplicationService: Symbol.for('SessionApplicationService'),

  // Sprint 8 Publications & Research Projects Tokens
  PublicationRepository: Symbol.for('PublicationRepository'),
  ResearchProjectRepository: Symbol.for('ResearchProjectRepository'),
  VenueRepository: Symbol.for('VenueRepository'),
  PublicationApplicationService: Symbol.for('PublicationApplicationService'),

  // Sprint 9 Research Assets & Scholarly Resources Tokens
  ResearchDatasetRepository: Symbol.for('ResearchDatasetRepository'),
  SoftwareArtifactRepository: Symbol.for('SoftwareArtifactRepository'),
  ResearchAssetRepository: Symbol.for('ResearchAssetRepository'),
  ExperimentRepository: Symbol.for('ExperimentRepository'),
  RepositoryRepository: Symbol.for('RepositoryRepository'),
  ResearchAssetsApplicationService: Symbol.for('ResearchAssetsApplicationService'),

  // Sprint 10 Academic Recognition Tokens
  AwardRepository: Symbol.for('AwardRepository'),
  GrantRepository: Symbol.for('GrantRepository'),
  PatentRepository: Symbol.for('PatentRepository'),
  ProfessionalActivityRepository: Symbol.for('ProfessionalActivityRepository'),
  AcademicRecognitionApplicationService: Symbol.for('AcademicRecognitionApplicationService'),
} as const;

export type DIToken = (typeof DITokens)[keyof typeof DITokens] | string;

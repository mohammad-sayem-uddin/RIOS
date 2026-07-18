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
} as const;

export type DIToken = (typeof DITokens)[keyof typeof DITokens] | string;

/**
 * @rios/infrastructure — Infrastructure Layer.
 *
 * This package provides infrastructure contracts and abstractions
 * for the Research Identity Operating System (RIOS).
 *
 * Architecture:
 * Infrastructure depends on Application, Identity, and Shared.
 * Never the reverse.
 */

// ——— Contracts ———
export type { InfrastructureRepository, PersistenceHealthStatus } from './contracts/index.js';

// ——— Errors ———
export {
  InfrastructureErrorMapper,
  InfrastructureErrorCode,
  type InfrastructureErrorCodeType,
} from './errors/index.js';

// ——— Mappers ———
export type { AggregateMapper, RowMapper, SpecificationTranslator } from './mappers/index.js';

// ——— Persistence ———
export {
  TransactionIsolationLevel,
  PrismaUnitOfWork,
  PrismaTransactionContext,
} from './persistence/index.js';
export type {
  UnitOfWork,
  TransactionContext,
  TransactionOptions,
  TransactionIsolationLevelType,
  PrismaClientWithTransaction,
} from './persistence/index.js';

// ——— Database ———
export { DatabaseConnectionStatus, PrismaDatabaseProvider } from './database/index.js';
export type {
  DatabaseProvider,
  DatabaseConnectionStatusType,
  PrismaClientInterface,
} from './database/index.js';

// ——— Events ———
export { OutboxStatus, OutboxEventMapper, PrismaOutboxRepositoryImpl } from './events/index.js';
export type {
  EventPublisher,
  OutboxStore,
  OutboxEntry,
  OutboxRecord,
  OutboxStatusType,
  OutboxRepository,
} from './events/index.js';

// ——— Configuration ———
export { EnvConfigurationLoader } from './configuration/index.js';
export type {
  AppConfig,
  DatabaseConfig,
  EventBrokerConfig,
  ServerConfig,
  LoggingConfig,
  ConfigurationLoader,
  FeatureFlags,
  ExtendedAppConfig,
} from './configuration/index.js';

// ——— Logging ———
export { LogLevel, StructuredLogger, DefaultLoggerFactory } from './logging/index.js';
export type {
  Logger,
  LoggerFactory,
  LogContext,
  LogLevelType,
  MetricsHook,
  LogSink,
} from './logging/index.js';

// ——— Health Checks ———
export { InfrastructureHealthCheckService } from './health/index.js';
export type {
  OverallHealthStatus,
  ComponentHealthStatus,
  ApplicationHealthResult,
  HealthCheckOptions,
} from './health/index.js';

// ——— Dependency Injection ———
export { DITokens, Container, Lifetime, CompositionRoot } from './di/index.js';
export type {
  DIToken,
  LifetimeType,
  FactoryFunction,
  Registration,
  CompositionRootOptions,
} from './di/index.js';

// ——— Application Lifecycle ———
export { ApplicationStartup, GracefulShutdown } from './lifecycle/index.js';
export type { StartupOptions, SystemInstance, ShutdownOptions } from './lifecycle/index.js';

// ——— Bootstrap ———
export { bootstrapRiosSystem } from './bootstrap.js';

// ——— Shared ———
export type { DateTimeProvider } from './shared/index.js';

// ——— Repositories ———
export { ResearchIdentityRepositoryImpl } from './repositories/identity/research-identity-repository.impl.js';
export type { PrismaClientLike } from './repositories/identity/types/database-client.js';

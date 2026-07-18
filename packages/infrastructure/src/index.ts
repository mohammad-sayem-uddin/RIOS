/**
 * @rios/infrastructure — Infrastructure Layer.
 *
 * This package provides infrastructure contracts and abstractions
 * for the Research Identity Operating System (RIOS).
 *
 * Architecture:
 * Infrastructure depends on Application, Identity, and Shared.
 * Never the reverse.
 *
 * Contents:
 * - contracts: Repository contract wrapper (extends domain contract with Result<T>).
 * - errors: InfrastructureError and error mapper.
 * - mappers: AggregateMapper for Domain ↔ Persistence ↔ Database conversion.
 * - persistence: UnitOfWork and EntityPersistence contracts.
 * - database: DatabaseProvider contract (connection, transactions, raw queries).
 * - events: EventPublisher and OutboxStore contracts.
 * - configuration: AppConfig and ConfigurationLoader contracts.
 * - logging: Logger, LoggerFactory, and LogLevel contracts.
 * - shared: DateTimeProvider contract.
 * - repositories: Placeholder for future concrete repository implementations.
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
export { DatabaseConnectionStatus } from './database/index.js';
export type { DatabaseProvider, DatabaseConnectionStatusType } from './database/index.js';

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
export type {
  AppConfig,
  DatabaseConfig,
  EventBrokerConfig,
  ServerConfig,
  LoggingConfig,
  ConfigurationLoader,
} from './configuration/index.js';

// ——— Logging ———
export { LogLevel } from './logging/index.js';
export type { Logger, LoggerFactory, LogContext, LogLevelType } from './logging/index.js';

// ——— Shared ———
export type { DateTimeProvider } from './shared/index.js';

// ——— Repositories ———
export { ResearchIdentityRepositoryImpl } from './repositories/identity/research-identity-repository.impl.js';
export type { PrismaClientLike } from './repositories/identity/types/database-client.js';

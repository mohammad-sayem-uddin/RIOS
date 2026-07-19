/**
 * @rios/infrastructure
 *
 * Infrastructure Layer — persistence implementations, ORM mapping, DI container, lifecycle, security.
 */

// Configuration
export type { AppConfig } from './configuration/app-config.js';
export { EnvConfigurationLoader } from './configuration/env-configuration-loader.js';

// Database & Health
export { PrismaDatabaseProvider } from './database/prisma-database-provider.js';
export type {
  DatabaseProvider,
  DatabaseConnectionStatusType,
} from './database/database-provider.js';
export { DatabaseConnectionStatus } from './database/database-provider.js';
export { InfrastructureHealthCheckService } from './health/health-check-service.js';

// Logging
export { StructuredLogger, DefaultLoggerFactory } from './logging/structured-logger.js';
export type { Logger, LoggerFactory, LogLevelType } from './logging/logger.js';
export { LogLevel } from './logging/logger.js';
export {
  StructuredAuditLogger,
  type IAuditLogger,
  type AuditEventData,
} from './logging/structured-audit-logger.js';

// Errors & Contracts
export { InfrastructureErrorCode, InfrastructureErrorMapper } from './errors/index.js';
export { PrismaErrorTranslator } from './errors/prisma-error-translator.js';
export type { InfrastructureRepository, PersistenceHealthStatus } from './contracts/index.js';
export type { AggregateMapper } from './mappers/aggregate-mapper.js';

// Persistence & Events
export { TransactionIsolationLevel, PrismaUnitOfWork } from './persistence/index.js';
export type { UnitOfWork, TransactionContext, TransactionOptions } from './persistence/index.js';
export { PrismaOutboxRepositoryImpl } from './events/prisma-outbox-repository.impl.js';
export { ResearchIdentityRepositoryImpl } from './repositories/identity/research-identity-repository.impl.js';
export { ResearchIdentityAggregateMapper } from './repositories/identity/mappers/research-identity-mapper.js';
export { ResearchIdentitySpecificationTranslator } from './repositories/identity/specification/identity-specification-translator.js';

// Persistence Mappers (Sprint 6)
export { UserPersistenceMapper } from './repositories/identity/mappers/user-persistence-mapper.js';
export { SessionPersistenceMapper } from './repositories/identity/mappers/session-persistence-mapper.js';
export { RolePersistenceMapper } from './repositories/identity/mappers/role-persistence-mapper.js';
export { PermissionPersistenceMapper } from './repositories/identity/mappers/permission-persistence-mapper.js';
export { RefreshTokenPersistenceMapper } from './repositories/identity/mappers/refresh-token-persistence-mapper.js';
export { AuditLogPersistenceMapper } from './repositories/identity/mappers/audit-log-persistence-mapper.js';

// Production Prisma Repositories (Sprint 6)
export { PrismaUserRepository } from './repositories/identity/prisma-user-repository.js';
export { PrismaSessionRepository } from './repositories/identity/prisma-session-repository.js';
export { PrismaRoleRepository } from './repositories/identity/prisma-role-repository.js';
export { PrismaPermissionRepository } from './repositories/identity/prisma-permission-repository.js';
export { PrismaRefreshTokenRepository } from './repositories/identity/prisma-refresh-token-repository.js';
export { PrismaAuditLogRepository } from './repositories/identity/prisma-audit-log-repository.js';

// IAM Security Implementations (Sprint 5)
export {
  JwtTokenProvider,
  type JwtProviderConfig,
} from './security/authentication/jwt-token-provider.js';
export { BCryptPasswordHasher } from './security/hashing/bcrypt-password-hasher.js';
export {
  SecureRandomGenerator,
  type ISecureRandomGenerator,
} from './security/crypto/secure-random-generator.js';
export { IdentitySystemClock } from './security/crypto/system-clock.js';
export { GuidGenerator, type IGuidGenerator } from './security/crypto/guid-generator.js';

// Legacy In-Memory Repositories (Sprint 5)
export { InMemoryUserRepository } from './repositories/identity/in-memory-user-repository.js';
export { InMemorySessionRepository } from './repositories/identity/in-memory-session-repository.js';
export {
  InMemoryRoleRepository,
  InMemoryPermissionRepository,
} from './repositories/identity/in-memory-role-repository.js';

// Research Identity Infrastructure (Sprint 7)
export * from './research-identity/index.js';

// Publications Infrastructure (Sprint 8)
export * from './publications/index.js';

// DI Container & Composition Root
export { Container, Lifetime } from './di/container.js';
export { CompositionRoot, createInMemoryPrismaClient } from './di/composition-root.js';
export { DITokens } from './di/tokens.js';

// Bootstrap & Lifecycle
export { bootstrapRiosSystem } from './bootstrap.js';

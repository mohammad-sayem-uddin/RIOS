/**
 * Composition Root for RIOS Infrastructure and Application layers.
 *
 * Architecture reference:
 * Infrastructure Layer — Composition Root Pattern.
 */

import {
  AuthenticationApplicationService,
  AuthorizationApplicationService,
  PublicationApplicationServiceImpl,
  ResearchIdentityApplicationServiceImpl,
  SessionApplicationService,
} from '@rios/application';
import { Result } from '@rios/shared';

import type { AppConfig } from '../configuration/app-config.js';
import { EnvConfigurationLoader } from '../configuration/env-configuration-loader.js';
import type { PrismaClientInterface } from '../database/prisma-database-provider.js';
import { PrismaDatabaseProvider } from '../database/prisma-database-provider.js';
import { PrismaOutboxRepositoryImpl } from '../events/prisma-outbox-repository.impl.js';
import { InfrastructureHealthCheckService } from '../health/health-check-service.js';
import type { LogLevelType } from '../logging/logger.js';
import { StructuredAuditLogger } from '../logging/structured-audit-logger.js';
import { DefaultLoggerFactory, StructuredLogger } from '../logging/structured-logger.js';
import { PrismaUnitOfWork } from '../persistence/prisma-unit-of-work.js';
import { PrismaPublicationRepository } from '../publications/repositories/prisma-publication.repository.js';
import { PrismaResearchProjectRepository } from '../publications/repositories/prisma-research-project.repository.js';
import { PrismaVenueRepository } from '../publications/repositories/prisma-venue.repository.js';
import { ResearchIdentityAggregateMapper } from '../repositories/identity/mappers/research-identity-mapper.js';
import { PrismaAuditLogRepository } from '../repositories/identity/prisma-audit-log-repository.js';
import { PrismaPermissionRepository } from '../repositories/identity/prisma-permission-repository.js';
import { PrismaRefreshTokenRepository } from '../repositories/identity/prisma-refresh-token-repository.js';
import { PrismaRoleRepository } from '../repositories/identity/prisma-role-repository.js';
import { PrismaSessionRepository } from '../repositories/identity/prisma-session-repository.js';
import { PrismaUserRepository } from '../repositories/identity/prisma-user-repository.js';
import { ResearchIdentityRepositoryImpl } from '../repositories/identity/research-identity-repository.impl.js';
import { ResearchIdentitySpecificationTranslator } from '../repositories/identity/specification/identity-specification-translator.js';
import { JwtTokenProvider } from '../security/authentication/jwt-token-provider.js';
import { GuidGenerator } from '../security/crypto/guid-generator.js';
import { SecureRandomGenerator } from '../security/crypto/secure-random-generator.js';
import { IdentitySystemClock } from '../security/crypto/system-clock.js';
import { BCryptPasswordHasher } from '../security/hashing/bcrypt-password-hasher.js';

import { Container, Lifetime } from './container.js';
import { DITokens } from './tokens.js';

export interface CompositionRootOptions {
  readonly appConfig?: AppConfig;
  readonly prismaClient?: PrismaClientInterface;
  readonly envVars?: Record<string, string | undefined>;
  readonly customContainer?: Container;
}

function normalizePrismaInput(input: unknown): unknown {
  if (input === null || input === undefined || typeof input !== 'object') {
    return input;
  }
  if (Array.isArray(input)) {
    return input.map(normalizePrismaInput);
  }
  const obj = input as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val !== null && val !== undefined && typeof val === 'object') {
      const nestedObj = val as Record<string, unknown>;
      if ('create' in nestedObj) {
        result[key] = normalizePrismaInput(nestedObj.create);
      } else if ('upsert' in nestedObj) {
        const upsertObj = nestedObj.upsert as Record<string, unknown>;
        result[key] = normalizePrismaInput(upsertObj.create ?? upsertObj.update);
      } else {
        result[key] = normalizePrismaInput(val);
      }
    } else {
      result[key] = val;
    }
  }
  return result;
}

export function createInMemoryPrismaClient(): PrismaClientInterface {
  const store = new Map<string, Record<string, unknown>>();
  const outboxStore = new Map<string, Record<string, unknown>>();

  const client = {
    $connect: (): Promise<void> => Promise.resolve(),
    $disconnect: (): Promise<void> => Promise.resolve(),
    $queryRaw: <T = unknown>(): Promise<T> => Promise.resolve([{ 1: 1 }] as T),
    $transaction: <R>(fn: (tx: unknown) => Promise<R>): Promise<R> => fn(client),
    researchIdentity: {
      findUnique: (args: { where: { id: string } }): Promise<Record<string, unknown> | null> => {
        return Promise.resolve(store.get(args.where.id) ?? null);
      },
      findMany: (args?: {
        where?: { id?: string };
        take?: number;
      }): Promise<Array<Record<string, unknown>>> => {
        let results = Array.from(store.values());
        if (args?.where?.id !== undefined) {
          results = results.filter((r) => r.id === args.where?.id);
        }
        if (args?.take !== undefined && args.take > 0) {
          results = results.slice(0, args.take);
        }
        return Promise.resolve(results);
      },
      upsert: (args: {
        where: { id: string };
        create: Record<string, unknown>;
        update: Record<string, unknown>;
      }): Promise<Record<string, unknown>> => {
        const existing = store.get(args.where.id);
        const inputToNormalize = existing !== undefined ? args.update : args.create;
        const normalized = normalizePrismaInput(inputToNormalize) as Record<string, unknown>;
        const record =
          existing !== undefined
            ? { ...existing, ...normalized }
            : { id: args.where.id, ...normalized };
        store.set(args.where.id, record);
        return Promise.resolve(record);
      },
      delete: (args: { where: { id: string } }): Promise<Record<string, unknown>> => {
        const record = store.get(args.where.id) ?? { id: args.where.id };
        store.delete(args.where.id);
        return Promise.resolve(record);
      },
    },
    outbox: {
      create: (args: { data: Record<string, unknown> }): Promise<Record<string, unknown>> => {
        const rawId = args.data.id;
        const id = typeof rawId === 'string' ? rawId : `outbox_${Date.now()}`;
        outboxStore.set(id, args.data);
        return Promise.resolve(args.data);
      },
      createMany: (args: { data: Array<Record<string, unknown>> }): Promise<{ count: number }> => {
        for (const item of args.data) {
          const rawId = item.id;
          const id = typeof rawId === 'string' ? rawId : `outbox_${Date.now()}_${Math.random()}`;
          outboxStore.set(id, item);
        }
        return Promise.resolve({ count: args.data.length });
      },
      findMany: (args?: {
        where?: { status?: string };
        take?: number;
      }): Promise<Array<Record<string, unknown>>> => {
        let results = Array.from(outboxStore.values());
        if (args?.where?.status !== undefined) {
          results = results.filter((r) => r.status === args.where?.status);
        }
        if (args?.take !== undefined && args.take > 0) {
          results = results.slice(0, args.take);
        }
        return Promise.resolve(results);
      },
      update: (args: {
        where: { id: string };
        data: Record<string, unknown>;
      }): Promise<Record<string, unknown> | null> => {
        const existing = outboxStore.get(args.where.id);
        if (existing !== undefined) {
          const updated = { ...existing, ...args.data };
          outboxStore.set(args.where.id, updated);
          return Promise.resolve(updated);
        }
        return Promise.resolve(null);
      },
    },
  };

  return client;
}

export class CompositionRoot {
  private readonly container: Container;

  constructor(options: CompositionRootOptions = {}) {
    this.container = options.customContainer ?? new Container();
    this.configure(options);
  }

  getContainer(): Container {
    return this.container;
  }

  private configure(options: CompositionRootOptions): void {
    // 1. Configuration & ConfigurationLoader
    this.container.registerFactory(
      DITokens.ConfigurationLoader,
      () => new EnvConfigurationLoader(options.envVars),
      Lifetime.SINGLETON,
    );

    this.container.registerFactory<AppConfig>(
      DITokens.AppConfig,
      () => {
        if (options.appConfig !== undefined) {
          return options.appConfig;
        }
        return {
          env: options.envVars?.NODE_ENV ?? 'development',
          database: {
            host: options.envVars?.DB_HOST ?? 'localhost',
            port: parseInt(options.envVars?.DB_PORT ?? '5432', 10) || 5432,
            database: 'rios_db',
            username: 'rios_user',
            password: 'rios_password',
            ssl: false,
            poolSize: 10,
            connectionTimeoutMs: 5000,
          },
          eventBroker: {
            host: 'localhost',
            port: 5672,
            username: 'guest',
            password: 'guest',
            vhost: '/',
          },
          server: {
            host: '0.0.0.0',
            port: 3000,
            corsOrigins: ['*'],
          },
          logging: {
            level: options.envVars?.LOG_LEVEL ?? 'INFO',
            format: 'json',
            destination: 'stdout',
          },
        };
      },
      Lifetime.SINGLETON,
    );

    // 2. Logging & LoggerFactory
    this.container.registerFactory(
      DITokens.LoggerFactory,
      (c) => {
        const config = c.resolve<AppConfig>(DITokens.AppConfig);
        return new DefaultLoggerFactory(config.logging.level as LogLevelType);
      },
      Lifetime.SINGLETON,
    );

    this.container.registerFactory(
      DITokens.Logger,
      (c) => {
        const loggerFactory = c.resolve<DefaultLoggerFactory>(DITokens.LoggerFactory);
        return loggerFactory.create('RIOS');
      },
      Lifetime.SINGLETON,
    );

    // 3. Security Infrastructure Utilities
    this.container.registerFactory(
      DITokens.JwtTokenProvider,
      () => new JwtTokenProvider(),
      Lifetime.SINGLETON,
    );
    this.container.registerFactory(
      DITokens.PasswordHasher,
      () => new BCryptPasswordHasher(),
      Lifetime.SINGLETON,
    );
    this.container.registerFactory(
      DITokens.SecureRandomGenerator,
      () => new SecureRandomGenerator(),
      Lifetime.SINGLETON,
    );
    this.container.registerFactory(
      DITokens.IdentitySystemClock,
      () => new IdentitySystemClock(),
      Lifetime.SINGLETON,
    );
    this.container.registerFactory(
      DITokens.GuidGenerator,
      () => new GuidGenerator(),
      Lifetime.SINGLETON,
    );
    this.container.registerFactory(
      DITokens.AuditLogger,
      (c) => new StructuredAuditLogger(c.resolve<StructuredLogger>(DITokens.Logger)),
      Lifetime.SINGLETON,
    );

    // 4. Identity Repositories (Prisma Production Implementations)
    this.container.registerFactory(
      DITokens.UserRepository,
      (c) => new PrismaUserRepository(c.resolve(DITokens.DatabaseProvider)),
      Lifetime.SINGLETON,
    );
    this.container.registerFactory(
      DITokens.SessionRepository,
      (c) => new PrismaSessionRepository(c.resolve(DITokens.DatabaseProvider)),
      Lifetime.SINGLETON,
    );
    this.container.registerFactory(
      DITokens.RoleRepository,
      (c) => new PrismaRoleRepository(c.resolve(DITokens.DatabaseProvider)),
      Lifetime.SINGLETON,
    );
    this.container.registerFactory(
      DITokens.PermissionRepository,
      (c) => new PrismaPermissionRepository(c.resolve(DITokens.DatabaseProvider)),
      Lifetime.SINGLETON,
    );
    this.container.registerFactory(
      DITokens.RefreshTokenRepository,
      (c) => new PrismaRefreshTokenRepository(c.resolve(DITokens.DatabaseProvider)),
      Lifetime.SINGLETON,
    );
    this.container.registerFactory(
      DITokens.AuditLogRepository,
      (c) => new PrismaAuditLogRepository(c.resolve(DITokens.DatabaseProvider)),
      Lifetime.SINGLETON,
    );

    // 5. Database Provider
    this.container.registerFactory(
      DITokens.DatabaseProvider,
      (c) => {
        const logger = c.resolve<StructuredLogger>(DITokens.Logger);
        const config = c.resolve<AppConfig>(DITokens.AppConfig);
        const prismaClient = options.prismaClient ?? createInMemoryPrismaClient();
        return new PrismaDatabaseProvider(prismaClient, config.database, logger);
      },
      Lifetime.SINGLETON,
    );

    // 6. Outbox Repository & Unit of Work
    this.container.registerFactory(
      DITokens.OutboxRepository,
      (c) => {
        const dbProvider = c.resolve<PrismaDatabaseProvider>(DITokens.DatabaseProvider);
        const logger = c.resolve<StructuredLogger>(DITokens.Logger);
        return new PrismaOutboxRepositoryImpl(dbProvider, logger);
      },
      Lifetime.SINGLETON,
    );

    this.container.registerFactory(
      DITokens.UnitOfWork,
      (c) => {
        const dbProvider = c.resolve<PrismaDatabaseProvider>(DITokens.DatabaseProvider);
        const logger = c.resolve<StructuredLogger>(DITokens.Logger);
        return new PrismaUnitOfWork(dbProvider, logger);
      },
      Lifetime.SINGLETON,
    );

    // 7. Identity Repository Dependencies (Sprint 1-4)
    this.container.registerFactory(
      DITokens.ResearchIdentityAggregateMapper,
      () => new ResearchIdentityAggregateMapper(),
      Lifetime.SINGLETON,
    );

    this.container.registerFactory(
      DITokens.ResearchIdentitySpecificationTranslator,
      () => new ResearchIdentitySpecificationTranslator(),
      Lifetime.SINGLETON,
    );

    this.container.registerFactory(
      DITokens.ResearchIdentityRepository,
      (c) => {
        const dbProvider = c.resolve<PrismaDatabaseProvider>(DITokens.DatabaseProvider);
        const logger = c.resolve<StructuredLogger>(DITokens.Logger);
        const mapper = c.resolve<ResearchIdentityAggregateMapper>(
          DITokens.ResearchIdentityAggregateMapper,
        );
        const translator = c.resolve<ResearchIdentitySpecificationTranslator>(
          DITokens.ResearchIdentitySpecificationTranslator,
        );
        const outboxRepo = c.resolve<PrismaOutboxRepositoryImpl>(DITokens.OutboxRepository);

        return new ResearchIdentityRepositoryImpl(
          dbProvider,
          logger,
          mapper,
          translator,
          outboxRepo,
        );
      },
      Lifetime.SINGLETON,
    );

    // 8. Application Services (IAM & Research Identity)
    this.container.registerFactory(
      DITokens.ResearchIdentityApplicationService,
      (c) => {
        const repo = c.resolve<ResearchIdentityRepositoryImpl>(DITokens.ResearchIdentityRepository);
        return new ResearchIdentityApplicationServiceImpl(repo);
      },
      Lifetime.SINGLETON,
    );

    this.container.registerFactory(
      DITokens.AuthenticationApplicationService,
      (c) =>
        new AuthenticationApplicationService(
          c.resolve(DITokens.UserRepository),
          c.resolve(DITokens.SessionRepository),
          c.resolve(DITokens.PasswordHasher),
          c.resolve(DITokens.JwtTokenProvider),
        ),
      Lifetime.SINGLETON,
    );

    this.container.registerFactory(
      DITokens.AuthorizationApplicationService,
      () => new AuthorizationApplicationService(),
      Lifetime.SINGLETON,
    );

    this.container.registerFactory(
      DITokens.SessionApplicationService,
      (c) => new SessionApplicationService(c.resolve(DITokens.SessionRepository)),
      Lifetime.SINGLETON,
    );

    // Sprint 8 Publications & Research Projects Repositories & Services
    this.container.registerFactory(
      DITokens.PublicationRepository,
      (c) => new PrismaPublicationRepository(c.resolve(DITokens.DatabaseProvider)),
      Lifetime.SINGLETON,
    );

    this.container.registerFactory(
      DITokens.ResearchProjectRepository,
      (c) => new PrismaResearchProjectRepository(c.resolve(DITokens.DatabaseProvider)),
      Lifetime.SINGLETON,
    );

    this.container.registerFactory(
      DITokens.VenueRepository,
      (c) => new PrismaVenueRepository(c.resolve(DITokens.DatabaseProvider)),
      Lifetime.SINGLETON,
    );

    this.container.registerFactory(
      DITokens.PublicationApplicationService,
      (c) =>
        new PublicationApplicationServiceImpl(
          c.resolve(DITokens.PublicationRepository),
          c.resolve(DITokens.ResearchProjectRepository),
          c.resolve(DITokens.VenueRepository),
        ),
      Lifetime.SINGLETON,
    );

    // 9. Health Check Service
    this.container.registerFactory(
      DITokens.HealthCheckService,
      (c) => {
        const dbProvider = c.resolve<PrismaDatabaseProvider>(DITokens.DatabaseProvider);
        const config = c.resolve<AppConfig>(DITokens.AppConfig);
        const repo = c.resolve<ResearchIdentityRepositoryImpl>(DITokens.ResearchIdentityRepository);
        const outboxRepo = c.resolve<PrismaOutboxRepositoryImpl>(DITokens.OutboxRepository);

        return new InfrastructureHealthCheckService({
          databaseProvider: dbProvider,
          config,
          repositories: [{ name: 'ResearchIdentityRepository', repo }],
          outboxRepository: outboxRepo,
        });
      },
      Lifetime.SINGLETON,
    );
  }

  validateGraph(): Result<void> {
    const requiredTokens = [
      DITokens.ConfigurationLoader,
      DITokens.AppConfig,
      DITokens.LoggerFactory,
      DITokens.Logger,
      DITokens.DatabaseProvider,
      DITokens.OutboxRepository,
      DITokens.UnitOfWork,
      DITokens.JwtTokenProvider,
      DITokens.PasswordHasher,
      DITokens.UserRepository,
      DITokens.SessionRepository,
      DITokens.RoleRepository,
      DITokens.PermissionRepository,
      DITokens.RefreshTokenRepository,
      DITokens.AuditLogRepository,
      DITokens.AuthenticationApplicationService,
      DITokens.AuthorizationApplicationService,
      DITokens.SessionApplicationService,
      DITokens.ResearchIdentityAggregateMapper,
      DITokens.ResearchIdentitySpecificationTranslator,
      DITokens.ResearchIdentityRepository,
      DITokens.ResearchIdentityApplicationService,
      DITokens.HealthCheckService,
    ];

    for (const token of requiredTokens) {
      const result = this.container.tryResolve(token);
      if (result.isFailure) {
        return Result.fail<void>(`CompositionRoot graph validation failed: ${result.error}`);
      }
    }

    return Result.ok(undefined);
  }
}

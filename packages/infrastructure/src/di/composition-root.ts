/**
 * Composition Root for RIOS Infrastructure and Application layers.
 *
 * Architecture reference:
 * Infrastructure Layer — Composition Root Pattern.
 */

import {
  AcademicRecognitionApplicationServiceImpl,
  AuthenticationApplicationService,
  AuthorizationApplicationService,
  PublicationApplicationServiceImpl,
  ResearchAssetsApplicationServiceImpl,
  ResearchIdentityApplicationServiceImpl,
  SessionApplicationService,
} from '@rios/application';
import { Result } from '@rios/shared';

import {
  PrismaAwardRepository,
  PrismaGrantRepository,
  PrismaPatentRepository,
  PrismaProfessionalActivityRepository,
} from '../academic-recognition/index.js';
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
import {
  PrismaExperimentRepository,
  PrismaRepositoryRepository,
  PrismaResearchAssetRepository,
  PrismaResearchDatasetRepository,
  PrismaSoftwareArtifactRepository,
} from '../research-assets/index.js';
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
  const stores = new Map<string, Map<string, Record<string, unknown>>>();

  const getStore = (modelName: string) => {
    if (!stores.has(modelName)) {
      stores.set(modelName, new Map());
    }
    return stores.get(modelName)!;
  };

  const createModelHandler = (modelName: string): Record<string, unknown> => {
    const s = getStore(modelName);
    return {
      findUnique: (args: {
        where: { id?: string; doi?: string; url?: string };
      }): Promise<Record<string, unknown> | null> => {
        if (args.where.id !== undefined && args.where.id !== '')
          return Promise.resolve(s.get(args.where.id) ?? null);
        for (const item of s.values()) {
          if (args.where.doi !== undefined && args.where.doi !== '' && item.doi === args.where.doi)
            return Promise.resolve(item);
          if (args.where.url !== undefined && args.where.url !== '' && item.url === args.where.url)
            return Promise.resolve(item);
        }
        return Promise.resolve(null);
      },
      findFirst: (): Promise<Record<string, unknown> | null> => {
        return Promise.resolve(Array.from(s.values())[0] ?? null);
      },
      findMany: (args?: {
        where?: { profileId?: string; publicationId?: string; projectId?: string; OR?: unknown[] };
      }): Promise<Array<Record<string, unknown>>> => {
        let list = Array.from(s.values());
        if (args?.where?.profileId !== undefined && args.where.profileId !== '')
          list = list.filter((i) => i.profileId === args.where?.profileId);
        if (args?.where?.publicationId !== undefined && args.where.publicationId !== '')
          list = list.filter((i) => i.publicationId === args.where?.publicationId);
        if (args?.where?.projectId !== undefined && args.where.projectId !== '')
          list = list.filter((i) => i.projectId === args.where?.projectId);
        return Promise.resolve(list);
      },
      upsert: (args: {
        where: { id: string };
        create: Record<string, unknown>;
        update: Record<string, unknown>;
      }): Promise<Record<string, unknown>> => {
        const id = args.where.id ?? (args.create?.id as string);
        const existing = s.get(id);
        const inputToNormalize = existing ? args.update : args.create;
        const normalized = normalizePrismaInput(inputToNormalize) as Record<string, unknown>;
        const record = existing ? { ...existing, ...normalized } : { id, ...normalized };
        s.set(id, record);
        return Promise.resolve(record);
      },
      create: (args: { data: Record<string, unknown> }): Promise<Record<string, unknown>> => {
        const normalized = normalizePrismaInput(args.data) as Record<string, unknown>;
        const id = (normalized.id as string) ?? crypto.randomUUID();
        const record = { id, ...normalized };
        s.set(id, record);
        return Promise.resolve(record);
      },
      delete: (args: { where: { id: string } }): Promise<Record<string, unknown>> => {
        const record = s.get(args.where.id) ?? { id: args.where.id };
        s.delete(args.where.id);
        return Promise.resolve(record);
      },
    };
  };

  const client: Record<string, unknown> = {
    $connect: (): Promise<void> => Promise.resolve(),
    $disconnect: (): Promise<void> => Promise.resolve(),
    $queryRaw: <T = unknown>(): Promise<T> => Promise.resolve([{ 1: 1 }] as T),
    $transaction: <R>(fn: (tx: unknown) => Promise<R>): Promise<R> => fn(client),
  };

  const clientHandler: ProxyHandler<Record<string, unknown>> = {
    get(target: Record<string, unknown>, prop: string) {
      if (prop in target) {
        return target[prop];
      }
      if (typeof prop === 'string' && !prop.startsWith('$')) {
        target[prop] = createModelHandler(prop);
        return target[prop];
      }
      return undefined;
    },
  };

  return new Proxy(client, clientHandler) as unknown as PrismaClientInterface;
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

    // Sprint 9 Research Assets Repositories & Service
    this.container.registerFactory(
      DITokens.ResearchDatasetRepository,
      (c) => new PrismaResearchDatasetRepository(c.resolve(DITokens.DatabaseProvider)),
      Lifetime.SINGLETON,
    );

    this.container.registerFactory(
      DITokens.SoftwareArtifactRepository,
      (c) => new PrismaSoftwareArtifactRepository(c.resolve(DITokens.DatabaseProvider)),
      Lifetime.SINGLETON,
    );

    this.container.registerFactory(
      DITokens.ResearchAssetRepository,
      (c) => new PrismaResearchAssetRepository(c.resolve(DITokens.DatabaseProvider)),
      Lifetime.SINGLETON,
    );

    this.container.registerFactory(
      DITokens.ExperimentRepository,
      (c) => new PrismaExperimentRepository(c.resolve(DITokens.DatabaseProvider)),
      Lifetime.SINGLETON,
    );

    this.container.registerFactory(
      DITokens.RepositoryRepository,
      (c) => new PrismaRepositoryRepository(c.resolve(DITokens.DatabaseProvider)),
      Lifetime.SINGLETON,
    );

    this.container.registerFactory(
      DITokens.ResearchAssetsApplicationService,
      (c) =>
        new ResearchAssetsApplicationServiceImpl(
          c.resolve(DITokens.ResearchDatasetRepository),
          c.resolve(DITokens.SoftwareArtifactRepository),
          c.resolve(DITokens.ResearchAssetRepository),
          c.resolve(DITokens.ExperimentRepository),
          c.resolve(DITokens.RepositoryRepository),
        ),
      Lifetime.SINGLETON,
    );

    // Sprint 10 Academic Recognition Repositories & Service
    this.container.registerFactory(
      DITokens.AwardRepository,
      (c) => new PrismaAwardRepository(c.resolve(DITokens.DatabaseProvider)),
      Lifetime.SINGLETON,
    );

    this.container.registerFactory(
      DITokens.GrantRepository,
      (c) => new PrismaGrantRepository(c.resolve(DITokens.DatabaseProvider)),
      Lifetime.SINGLETON,
    );

    this.container.registerFactory(
      DITokens.PatentRepository,
      (c) => new PrismaPatentRepository(c.resolve(DITokens.DatabaseProvider)),
      Lifetime.SINGLETON,
    );

    this.container.registerFactory(
      DITokens.ProfessionalActivityRepository,
      (c) => new PrismaProfessionalActivityRepository(c.resolve(DITokens.DatabaseProvider)),
      Lifetime.SINGLETON,
    );

    this.container.registerFactory(
      DITokens.AcademicRecognitionApplicationService,
      (c) =>
        new AcademicRecognitionApplicationServiceImpl(
          c.resolve(DITokens.AwardRepository),
          c.resolve(DITokens.GrantRepository),
          c.resolve(DITokens.PatentRepository),
          c.resolve(DITokens.ProfessionalActivityRepository),
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

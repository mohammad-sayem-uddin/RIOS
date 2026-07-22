/**
 * RIOS API Entry Point
 *
 * Bootstraps the full infrastructure stack (real Prisma DB connection, DI
 * composition root, health checks) then hands the wired container to the
 * presentation layer so every HTTP handler runs against a live database.
 */

import type { AuthenticationApplicationService } from '@rios/application';
import { CompositionRoot, DITokens, createPrismaClient } from '@rios/infrastructure';
import type {
  DatabaseProvider,
  InfrastructureHealthCheckService,
  Logger,
} from '@rios/infrastructure';
import { bootstrapPresentationServer } from '@rios/presentation';

const PORT = parseInt(process.env['PORT'] ?? '3000', 10);
const HOST = process.env['HOST'] ?? '0.0.0.0';

if (!process.env['DATABASE_URL']) {
  process.env['DATABASE_URL'] = 'postgresql://rios:rios_password@localhost:5432/rios';
}
if (!process.env['JWT_SECRET']) {
  process.env['JWT_SECRET'] = 'dev-jwt-secret-change-in-production';
}

async function main(): Promise<void> {
  // 1. Build composition root with a real PrismaClient
  const prismaClient = createPrismaClient();
  const compositionRoot = new CompositionRoot({ prismaClient });
  const container = compositionRoot.getContainer();

  // 2. Connect to the database
  const databaseProvider = container.resolve<DatabaseProvider>(DITokens.DatabaseProvider);
  const connectResult = await databaseProvider.connect();
  if (connectResult.isFailure) {
    console.error('[RIOS] Database connection failed:', connectResult.error);
    process.exit(1);
  }
  console.log('[RIOS] Database connected');

  // 3. Resolve services for the presentation layer
  const logger = container.has(DITokens.Logger)
    ? container.resolve<Logger>(DITokens.Logger)
    : undefined;

  const authApplicationService = container.resolve<AuthenticationApplicationService>(
    DITokens.AuthenticationApplicationService,
  );

  const healthService = container.has(DITokens.HealthCheckService)
    ? container.resolve<InfrastructureHealthCheckService>(DITokens.HealthCheckService)
    : undefined;

  // 4. Bootstrap the HTTP server
  const server = bootstrapPresentationServer({
    config: { port: PORT, host: HOST },
    container,
    authApplicationService,
    healthService,
    logger,
  });

  await server.start();

  // 5. Graceful shutdown
  const shutdown = async (signal: string): Promise<void> => {
    console.log(`[RIOS] ${signal} received — shutting down`);
    await server.stop();
    await databaseProvider.disconnect();
    process.exit(0);
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

main().catch((err: unknown) => {
  console.error('[RIOS] Fatal startup error:', err);
  process.exit(1);
});

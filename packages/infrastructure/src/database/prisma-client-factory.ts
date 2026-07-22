/**
 * Prisma Client Factory
 *
 * Instantiates a real PrismaClient for production/runtime use. Kept isolated so
 * the rest of the infrastructure depends only on the PrismaClientInterface
 * abstraction and the in-memory fake remains available for tests.
 */

import { PrismaClient } from '@prisma/client';

import type { PrismaClientInterface } from './prisma-database-provider.js';

/**
 * Create a real PrismaClient bound to DATABASE_URL. Returns it typed as the
 * infrastructure PrismaClientInterface so it can be injected via the
 * composition root / ApplicationStartup.
 */
export function createPrismaClient(): PrismaClientInterface {
  return new PrismaClient();
}

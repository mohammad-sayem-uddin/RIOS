/**
 * Idempotent Database Seed Script
 *
 * Architecture Reference: Infrastructure Layer — Seed Infrastructure (Sprint 6 Chapter 6 §86 & Chapter 10 §178).
 * Populates default Roles and Permissions in PostgreSQL for production runtime.
 */

import { PrismaClient } from '@prisma/client';

import { StructuredLogger } from '../src/logging/structured-logger.js';

interface SeedPermission {
  id: string;
  name: string;
  description: string;
}

interface SeedRole {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
}

const prisma: PrismaClient = new PrismaClient();
const logger: StructuredLogger = new StructuredLogger({ component: 'DatabaseSeed' });

async function main(): Promise<void> {
  logger.info('🌱 Seeding production database foundation...');

  // 1. Seed Permissions
  const permissions: SeedPermission[] = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'user.read',
      description: 'Read user profile information',
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'user.write',
      description: 'Create and update user profiles',
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'role.assign',
      description: 'Assign roles to users',
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      name: 'research.create',
      description: 'Create research identities',
    },
    {
      id: '55555555-5555-5555-5555-555555555555',
      name: 'audit.read',
      description: 'Read system audit logs',
    },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      create: perm,
      update: { description: perm.description },
    });
  }
  logger.info(`✅ Seeded ${permissions.length} default permissions.`);

  // 2. Seed Default Roles
  const roles: SeedRole[] = [
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      name: 'user',
      description: 'Standard user role',
      isSystem: true,
    },
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      name: 'admin',
      description: 'System administrator role',
      isSystem: true,
    },
    {
      id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      name: 'researcher',
      description: 'Academic researcher role',
      isSystem: true,
    },
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { name: r.name },
      create: r,
      update: { description: r.description },
    });
  }
  logger.info(`✅ Seeded ${roles.length} default system roles.`);

  logger.info('✨ Seed execution completed successfully.');
}

main()
  .catch((e: unknown) => {
    const errorMsg = e instanceof Error ? e.message : String(e);
    logger.error(`❌ Seed execution failed: ${errorMsg}`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

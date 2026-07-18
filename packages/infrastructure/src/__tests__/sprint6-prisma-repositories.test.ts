/**
 * Sprint 6 Production Prisma Repositories Integration Tests
 *
 * Architecture Reference: Volume I – Persistence Infrastructure & Quality Assurance (Sprint 6 Chapter 12 §216).
 */

import {
  AuditLogEntry,
  AuditOutcome,
  Credential,
  Email,
  PasswordHash,
  Permission,
  Role,
  Session,
  SessionId,
  User,
  UserId,
} from '@rios/domain';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  CompositionRoot,
  PrismaAuditLogRepository,
  PrismaPermissionRepository,
  PrismaRoleRepository,
  PrismaSessionRepository,
  PrismaUserRepository,
} from '../index.js';

interface MockPrismaClient {
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
  $queryRaw: () => Promise<Array<Record<string, number>>>;
  $transaction: <R>(fn: (tx: unknown) => Promise<R>) => Promise<R>;
  user: {
    findUnique: ({ where }: { where: { id: string } }) => Promise<Record<string, unknown> | null>;
    findFirst: ({
      where,
    }: {
      where: { email?: string };
    }) => Promise<Record<string, unknown> | null>;
    upsert: ({
      where,
      create,
      update,
    }: {
      where: { id: string };
      create: Record<string, unknown>;
      update: Record<string, unknown>;
    }) => Promise<Record<string, unknown>>;
    delete: ({ where }: { where: { id: string } }) => Promise<Record<string, unknown> | null>;
  };
  role: {
    findUnique: ({ where }: { where: { id: string } }) => Promise<Record<string, unknown> | null>;
    findFirst: ({ where }: { where: { name?: string } }) => Promise<Record<string, unknown> | null>;
    findMany: () => Promise<Array<Record<string, unknown>>>;
    upsert: ({
      where,
      create,
      update,
    }: {
      where: { id: string };
      create: Record<string, unknown>;
      update: Record<string, unknown>;
    }) => Promise<Record<string, unknown>>;
  };
  permission: {
    findUnique: ({ where }: { where: { id: string } }) => Promise<Record<string, unknown> | null>;
    findFirst: ({ where }: { where: { name?: string } }) => Promise<Record<string, unknown> | null>;
    findMany: () => Promise<Array<Record<string, unknown>>>;
    upsert: ({
      where,
      create,
      update,
    }: {
      where: { id: string };
      create: Record<string, unknown>;
      update: Record<string, unknown>;
    }) => Promise<Record<string, unknown>>;
  };
  session: {
    findUnique: ({ where }: { where: { id: string } }) => Promise<Record<string, unknown> | null>;
    findMany: ({
      where,
    }: {
      where: { userId?: string };
    }) => Promise<Array<Record<string, unknown>>>;
    upsert: ({
      where,
      create,
      update,
    }: {
      where: { id: string };
      create: Record<string, unknown>;
      update: Record<string, unknown>;
    }) => Promise<Record<string, unknown>>;
    update: ({
      where,
      data,
    }: {
      where: { id: string };
      data: Record<string, unknown>;
    }) => Promise<Record<string, unknown> | null>;
    updateMany: ({
      where,
      data,
    }: {
      where: { userId?: string };
      data: Record<string, unknown>;
    }) => Promise<{ count: number }>;
    deleteMany: () => Promise<{ count: number }>;
  };
  refreshToken: {
    findUnique: ({ where }: { where: { id: string } }) => Promise<Record<string, unknown> | null>;
    findFirst: ({
      where,
    }: {
      where: { tokenHash?: string };
    }) => Promise<Record<string, unknown> | null>;
    findMany: ({
      where,
    }: {
      where: { userId?: string };
    }) => Promise<Array<Record<string, unknown>>>;
    upsert: ({
      where,
      create,
      update,
    }: {
      where: { id: string };
      create: Record<string, unknown>;
      update: Record<string, unknown>;
    }) => Promise<Record<string, unknown>>;
    update: ({
      where,
      data,
    }: {
      where: { id: string };
      data: Record<string, unknown>;
    }) => Promise<Record<string, unknown> | null>;
    updateMany: () => Promise<{ count: number }>;
    deleteMany: () => Promise<{ count: number }>;
  };
  auditLog: {
    create: ({ data }: { data: Record<string, unknown> }) => Promise<Record<string, unknown>>;
    findMany: ({
      where,
    }: {
      where?: { userId?: string; action?: string };
    }) => Promise<Array<Record<string, unknown>>>;
    count: ({ where }: { where?: { userId?: string } }) => Promise<number>;
  };
}

function createMockPrismaClient(): MockPrismaClient {
  const users = new Map<string, Record<string, unknown>>();
  const roles = new Map<string, Record<string, unknown>>();
  const permissions = new Map<string, Record<string, unknown>>();
  const sessions = new Map<string, Record<string, unknown>>();
  const refreshTokens = new Map<string, Record<string, unknown>>();
  const auditLogs = new Map<string, Record<string, unknown>>();

  const client: MockPrismaClient = {
    $connect: (): Promise<void> => Promise.resolve(),
    $disconnect: (): Promise<void> => Promise.resolve(),
    $queryRaw: (): Promise<Array<Record<string, number>>> => Promise.resolve([{ 1: 1 }]),
    $transaction: <R>(fn: (tx: unknown) => Promise<R>): Promise<R> => fn(client),

    user: {
      findUnique: ({ where }: { where: { id: string } }): Promise<Record<string, unknown> | null> =>
        Promise.resolve(users.get(where.id) ?? null),
      findFirst: ({
        where,
      }: {
        where: { email?: string };
      }): Promise<Record<string, unknown> | null> => {
        for (const u of users.values()) {
          if (where.email !== undefined && u.email === where.email) return Promise.resolve(u);
        }
        return Promise.resolve(null);
      },
      upsert: ({
        where,
        create,
        update,
      }: {
        where: { id: string };
        create: Record<string, unknown>;
        update: Record<string, unknown>;
      }): Promise<Record<string, unknown>> => {
        const existing = users.get(where.id);
        const record = existing !== undefined ? { ...existing, ...update } : create;
        users.set(where.id, record);
        return Promise.resolve(record);
      },
      delete: ({ where }: { where: { id: string } }): Promise<Record<string, unknown> | null> => {
        const rec = users.get(where.id) ?? null;
        users.delete(where.id);
        return Promise.resolve(rec);
      },
    },

    role: {
      findUnique: ({ where }: { where: { id: string } }): Promise<Record<string, unknown> | null> =>
        Promise.resolve(roles.get(where.id) ?? null),
      findFirst: ({
        where,
      }: {
        where: { name?: string };
      }): Promise<Record<string, unknown> | null> => {
        for (const r of roles.values()) {
          if (where.name !== undefined && r.name === where.name) return Promise.resolve(r);
        }
        return Promise.resolve(null);
      },
      findMany: (): Promise<Array<Record<string, unknown>>> =>
        Promise.resolve(Array.from(roles.values())),
      upsert: ({
        where,
        create,
        update,
      }: {
        where: { id: string };
        create: Record<string, unknown>;
        update: Record<string, unknown>;
      }): Promise<Record<string, unknown>> => {
        const existing = roles.get(where.id);
        const record = existing !== undefined ? { ...existing, ...update } : create;
        roles.set(where.id, record);
        return Promise.resolve(record);
      },
    },

    permission: {
      findUnique: ({ where }: { where: { id: string } }): Promise<Record<string, unknown> | null> =>
        Promise.resolve(permissions.get(where.id) ?? null),
      findFirst: ({
        where,
      }: {
        where: { name?: string };
      }): Promise<Record<string, unknown> | null> => {
        for (const p of permissions.values()) {
          if (where.name !== undefined && p.name === where.name) return Promise.resolve(p);
        }
        return Promise.resolve(null);
      },
      findMany: (): Promise<Array<Record<string, unknown>>> =>
        Promise.resolve(Array.from(permissions.values())),
      upsert: ({
        where,
        create,
        update,
      }: {
        where: { id: string };
        create: Record<string, unknown>;
        update: Record<string, unknown>;
      }): Promise<Record<string, unknown>> => {
        const existing = permissions.get(where.id);
        const record = existing !== undefined ? { ...existing, ...update } : create;
        permissions.set(where.id, record);
        return Promise.resolve(record);
      },
    },

    session: {
      findUnique: ({ where }: { where: { id: string } }): Promise<Record<string, unknown> | null> =>
        Promise.resolve(sessions.get(where.id) ?? null),
      findMany: ({
        where,
      }: {
        where: { userId?: string };
      }): Promise<Array<Record<string, unknown>>> => {
        const results = Array.from(sessions.values()).filter(
          (s) => where.userId === undefined || s.userId === where.userId,
        );
        return Promise.resolve(results);
      },
      upsert: ({
        where,
        create,
        update,
      }: {
        where: { id: string };
        create: Record<string, unknown>;
        update: Record<string, unknown>;
      }): Promise<Record<string, unknown>> => {
        const existing = sessions.get(where.id);
        const record = existing !== undefined ? { ...existing, ...update } : create;
        sessions.set(where.id, record);
        return Promise.resolve(record);
      },
      update: ({
        where,
        data,
      }: {
        where: { id: string };
        data: Record<string, unknown>;
      }): Promise<Record<string, unknown> | null> => {
        const existing = sessions.get(where.id);
        if (existing !== undefined) {
          const updated = { ...existing, ...data };
          sessions.set(where.id, updated);
          return Promise.resolve(updated);
        }
        return Promise.resolve(null);
      },
      updateMany: ({
        where,
        data,
      }: {
        where: { userId?: string };
        data: Record<string, unknown>;
      }): Promise<{ count: number }> => {
        let count = 0;
        for (const [id, s] of sessions.entries()) {
          if (where.userId === undefined || s.userId === where.userId) {
            sessions.set(id, { ...s, ...data });
            count++;
          }
        }
        return Promise.resolve({ count });
      },
      deleteMany: (): Promise<{ count: number }> => {
        const count = sessions.size;
        sessions.clear();
        return Promise.resolve({ count });
      },
    },

    refreshToken: {
      findUnique: ({ where }: { where: { id: string } }): Promise<Record<string, unknown> | null> =>
        Promise.resolve(refreshTokens.get(where.id) ?? null),
      findFirst: ({
        where,
      }: {
        where: { tokenHash?: string };
      }): Promise<Record<string, unknown> | null> => {
        for (const t of refreshTokens.values()) {
          if (where.tokenHash !== undefined && t.tokenHash === where.tokenHash)
            return Promise.resolve(t);
        }
        return Promise.resolve(null);
      },
      findMany: ({
        where,
      }: {
        where: { userId?: string };
      }): Promise<Array<Record<string, unknown>>> => {
        const results = Array.from(refreshTokens.values()).filter(
          (t) => where.userId === undefined || t.userId === where.userId,
        );
        return Promise.resolve(results);
      },
      upsert: ({
        where,
        create,
        update,
      }: {
        where: { id: string };
        create: Record<string, unknown>;
        update: Record<string, unknown>;
      }): Promise<Record<string, unknown>> => {
        const existing = refreshTokens.get(where.id);
        const record = existing !== undefined ? { ...existing, ...update } : create;
        refreshTokens.set(where.id, record);
        return Promise.resolve(record);
      },
      update: ({
        where,
        data,
      }: {
        where: { id: string };
        data: Record<string, unknown>;
      }): Promise<Record<string, unknown> | null> => {
        const existing = refreshTokens.get(where.id);
        if (existing !== undefined) {
          const updated = { ...existing, ...data };
          refreshTokens.set(where.id, updated);
          return Promise.resolve(updated);
        }
        return Promise.resolve(null);
      },
      updateMany: (): Promise<{ count: number }> => Promise.resolve({ count: 1 }),
      deleteMany: (): Promise<{ count: number }> => Promise.resolve({ count: 0 }),
    },

    auditLog: {
      create: ({ data }: { data: Record<string, unknown> }): Promise<Record<string, unknown>> => {
        const id = typeof data.id === 'string' ? data.id : `aud_${Date.now()}`;
        auditLogs.set(id, data);
        return Promise.resolve(data);
      },
      findMany: ({ where }: { where?: { userId?: string; action?: string } } = {}): Promise<
        Array<Record<string, unknown>>
      > => {
        let results = Array.from(auditLogs.values());
        if (where?.userId !== undefined) results = results.filter((a) => a.userId === where.userId);
        if (where?.action !== undefined) results = results.filter((a) => a.action === where.action);
        return Promise.resolve(results);
      },
      count: ({ where }: { where?: { userId?: string } } = {}): Promise<number> => {
        const count = Array.from(auditLogs.values()).filter(
          (a) => where?.userId === undefined || a.userId === where.userId,
        ).length;
        return Promise.resolve(count);
      },
    },
  };

  return client;
}

describe('Sprint 6 — Production Prisma Repositories Suite', () => {
  let compositionRoot: CompositionRoot;

  beforeEach(() => {
    const mockPrisma = createMockPrismaClient();
    compositionRoot = new CompositionRoot({ prismaClient: mockPrisma });
  });

  it('CompositionRoot resolves all production Prisma repositories and validates graph', () => {
    const graphRes = compositionRoot.validateGraph();
    expect(graphRes.isSuccess).toBe(true);
  });

  it('PrismaUserRepository handles save, findById, findByEmail, exists, delete', async () => {
    const container = compositionRoot.getContainer();
    const userRepo = container.resolve<PrismaUserRepository>(Symbol.for('UserRepository'));

    const email = Email.create('user@rios.org').value;
    const passwordHash = PasswordHash.create('hashedpass123').value;
    const credential = Credential.create({ passwordHash }).value;
    const role = Role.create({ name: 'user', description: 'Default' }).value;
    const user = User.create({ email, credential, roles: [role] }, 'u-100').value;

    // Save
    const saveRes = await userRepo.save(user);
    expect(saveRes.isSuccess).toBe(true);

    // Exists
    const existsRes = await userRepo.exists(email);
    expect(existsRes.isSuccess).toBe(true);
    expect(existsRes.value).toBe(true);

    // findById
    const findRes = await userRepo.findById(UserId.create('u-100'));
    expect(findRes.isSuccess).toBe(true);
    expect(findRes.value?.email.value).toBe('user@rios.org');

    // findByEmail
    const findEmailRes = await userRepo.findByEmail(email);
    expect(findEmailRes.isSuccess).toBe(true);
    expect(findEmailRes.value?.userId.value).toBe('u-100');

    // Delete
    const delRes = await userRepo.delete(UserId.create('u-100'));
    expect(delRes.isSuccess).toBe(true);
  });

  it('PrismaSessionRepository handles session lifecycle', async () => {
    const container = compositionRoot.getContainer();
    const sessionRepo = container.resolve<PrismaSessionRepository>(Symbol.for('SessionRepository'));

    const userId = UserId.create('u-100');
    const expiresAt = new Date(Date.now() + 3600000);
    const session = Session.create({ userId, expiresAt }, 's-100').value;

    await sessionRepo.save(session);
    const findRes = await sessionRepo.findById(SessionId.create('s-100'));
    expect(findRes.isSuccess).toBe(true);
    expect(findRes.value?.sessionId.value).toBe('s-100');

    const revokeRes = await sessionRepo.revoke(SessionId.create('s-100'));
    expect(revokeRes.isSuccess).toBe(true);
  });

  it('PrismaRoleRepository and PrismaPermissionRepository persist RBAC entities', async () => {
    const container = compositionRoot.getContainer();
    const roleRepo = container.resolve<PrismaRoleRepository>(Symbol.for('RoleRepository'));
    const permRepo = container.resolve<PrismaPermissionRepository>(
      Symbol.for('PermissionRepository'),
    );

    const perm = Permission.create({ name: 'admin.read', description: 'Read admin' }, 'p-1').value;
    await permRepo.save(perm);

    const role = Role.create(
      { name: 'admin', description: 'Admin', permissions: [perm] },
      'r-1',
    ).value;
    await roleRepo.save(role);

    const findPerm = await permRepo.findByName('admin.read');
    expect(findPerm.isSuccess).toBe(true);
    expect(findPerm.value?.permissionId.value).toBe('p-1');

    const findRole = await roleRepo.findByName('admin');
    expect(findRole.isSuccess).toBe(true);
    expect(findRole.value?.roleId.value).toBe('r-1');
  });

  it('PrismaAuditLogRepository records security audit entries', async () => {
    const container = compositionRoot.getContainer();
    const auditRepo = container.resolve<PrismaAuditLogRepository>(Symbol.for('AuditLogRepository'));

    const userId = UserId.create('u-100');
    const entry = AuditLogEntry.create(
      { userId, action: 'user.login', outcome: AuditOutcome.SUCCESS, details: { ip: '127.0.0.1' } },
      'a-100',
    ).value;

    const appendRes = await auditRepo.append(entry);
    expect(appendRes.isSuccess).toBe(true);

    const findRes = await auditRepo.findByUserId(userId);
    expect(findRes.isSuccess).toBe(true);
    expect(findRes.value).toHaveLength(1);
    expect(findRes.value[0].action).toBe('user.login');
  });
});

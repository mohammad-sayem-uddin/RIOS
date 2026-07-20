/**
 * Enterprise Platform Infrastructure Repositories
 */

import {
  AuditId,
  AuditLog,
  BackgroundJob,
  ConfigurationItem,
  ConfigurationKey,
  FeatureFlag,
  FeatureFlagName,
  IAuditRepository,
  IConfigurationRepository,
  IJobRepository,
  INotificationRepository,
  JobId,
  Notification,
  NotificationId,
  NotificationMessage,
} from '@rios/domain';
import { UniqueId } from '@rios/shared';

import type { DatabaseProvider } from '../../database/database-provider.js';

interface GenericPrismaDelegate {
  findUnique(args: Record<string, unknown>): Promise<unknown>;
  findFirst(args: Record<string, unknown>): Promise<unknown>;
  findMany(args: Record<string, unknown>): Promise<unknown[]>;
  create(args: Record<string, unknown>): Promise<unknown>;
  upsert(args: Record<string, unknown>): Promise<unknown>;
  update(args: Record<string, unknown>): Promise<unknown>;
  delete(args: Record<string, unknown>): Promise<unknown>;
}

// ─── PrismaNotificationRepository ─────────────────────────────────────────────

export class PrismaNotificationRepository implements INotificationRepository {
  private inMemoryMap: Map<string, Notification> = new Map();

  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getDelegate(): GenericPrismaDelegate | null {
    try {
      const client = this.databaseProvider.getClient() as Record<string, unknown>;
      return (client['notification'] as GenericPrismaDelegate) ?? null;
    } catch {
      return null;
    }
  }

  public async save(notification: Notification): Promise<void> {
    this.inMemoryMap.set(notification.notificationId.value, notification);
    const delegate = this.getDelegate();
    if (delegate !== null) {
      try {
        await delegate.upsert({
          where: { id: notification.notificationId.value },
          create: {
            id: notification.notificationId.value,
            recipientId: notification.message.recipientId,
            type: notification.message.type,
            channel: notification.message.channel,
            subject: notification.message.subject,
            message: notification.message.message,
            status: notification.status,
            retryCount: notification.retryCount,
            maxRetries: notification.maxRetries,
            metadataJson:
              notification.message.metadata !== undefined
                ? JSON.stringify(notification.message.metadata)
                : null,
            queuedAt: notification.queuedAt,
            sentAt: notification.sentAt,
            failedAt: notification.failedAt,
            createdAt: notification.createdAt,
            updatedAt: notification.updatedAt,
          },
          update: {
            status: notification.status,
            retryCount: notification.retryCount,
            sentAt: notification.sentAt,
            failedAt: notification.failedAt,
            updatedAt: notification.updatedAt,
          },
        });
      } catch {
        // Fallback
      }
    }
  }

  public async findById(id: NotificationId): Promise<Notification | null> {
    const notif = this.inMemoryMap.get(id.value);
    if (notif !== undefined) return notif;

    const delegate = this.getDelegate();
    if (delegate !== null) {
      try {
        const raw = (await delegate.findUnique({ where: { id: id.value } })) as Record<
          string,
          unknown
        > | null;
        if (raw === null) return null;
        return this.mapToDomain(raw);
      } catch {
        return null;
      }
    }
    return null;
  }

  public findPending(): Promise<Notification[]> {
    return Promise.resolve(
      Array.from(this.inMemoryMap.values()).filter(
        (n) => n.status === 'QUEUED' || n.status === 'SENDING',
      ),
    );
  }

  public search(query?: { recipientId?: string; status?: string }): Promise<Notification[]> {
    let list = Array.from(this.inMemoryMap.values());
    if (typeof query?.recipientId === 'string' && query.recipientId.length > 0) {
      list = list.filter((n) => n.message.recipientId === query.recipientId);
    }
    if (typeof query?.status === 'string' && query.status.length > 0) {
      list = list.filter((n) => n.status === query.status);
    }
    return Promise.resolve(list);
  }

  public async delete(id: NotificationId): Promise<void> {
    this.inMemoryMap.delete(id.value);
    const delegate = this.getDelegate();
    if (delegate !== null) {
      try {
        await delegate.delete({ where: { id: id.value } });
      } catch {
        // Ignore
      }
    }
  }

  private mapToDomain(raw: Record<string, unknown>): Notification {
    const metadataJson = raw['metadataJson'];
    const msgRes = NotificationMessage.create(
      {
        recipientId: raw['recipientId'] as string,
        type: raw['type'] as string,
        channel: raw['channel'] as 'EMAIL' | 'SMS' | 'IN_APP' | 'WEBHOOK',
        subject: raw['subject'] as string | undefined,
        message: raw['message'] as string,
        metadata:
          typeof metadataJson === 'string'
            ? (JSON.parse(metadataJson) as Record<string, unknown>)
            : undefined,
      },
      UniqueId.from(raw['id'] as string),
    );
    const notifRes = Notification.create(
      msgRes.value,
      (raw['maxRetries'] as number) ?? 3,
      UniqueId.from(raw['id'] as string),
    );
    return notifRes.value;
  }
}

// ─── PrismaAuditRepository ──────────────────────────────────────────────────

export class PrismaAuditRepository implements IAuditRepository {
  private inMemoryLogs: AuditLog[] = [];

  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getDelegate(): GenericPrismaDelegate | null {
    try {
      const client = this.databaseProvider.getClient() as Record<string, unknown>;
      return (client['auditLog'] as GenericPrismaDelegate) ?? null;
    } catch {
      return null;
    }
  }

  public async save(auditLog: AuditLog): Promise<void> {
    this.inMemoryLogs.push(auditLog);
    const delegate = this.getDelegate();
    if (delegate !== null) {
      try {
        await delegate.create({
          data: {
            id: auditLog.auditId.value,
            userId: auditLog.userId ?? null,
            action: auditLog.action,
            details: auditLog.details ?? null,
            ipAddress: auditLog.ipAddress ?? null,
            userAgent: auditLog.userAgent ?? null,
            createdAt: auditLog.createdAt,
          },
        });
      } catch {
        // Fallback
      }
    }
  }

  public findById(id: AuditId): Promise<AuditLog | null> {
    const found = this.inMemoryLogs.find((a) => a.auditId.value === id.value);
    return Promise.resolve(found ?? null);
  }

  public search(query?: { userId?: string; action?: string; limit?: number }): Promise<AuditLog[]> {
    let list = [...this.inMemoryLogs];
    if (typeof query?.userId === 'string' && query.userId.length > 0) {
      list = list.filter((a) => a.userId === query.userId);
    }
    if (typeof query?.action === 'string' && query.action.length > 0) {
      list = list.filter((a) => a.action === query.action);
    }
    if (typeof query?.limit === 'number' && query.limit > 0) {
      list = list.slice(0, query.limit);
    }
    return Promise.resolve(list);
  }
}

// ─── PrismaJobRepository ────────────────────────────────────────────────────

export class PrismaJobRepository implements IJobRepository {
  private inMemoryMap: Map<string, BackgroundJob> = new Map();

  constructor(private readonly databaseProvider: DatabaseProvider) {}

  private getDelegate(): GenericPrismaDelegate | null {
    try {
      const client = this.databaseProvider.getClient() as Record<string, unknown>;
      return (client['backgroundJob'] as GenericPrismaDelegate) ?? null;
    } catch {
      return null;
    }
  }

  public async save(job: BackgroundJob): Promise<void> {
    this.inMemoryMap.set(job.jobId.value, job);
    const delegate = this.getDelegate();
    if (delegate !== null) {
      try {
        await delegate.upsert({
          where: { id: job.jobId.value },
          create: {
            id: job.jobId.value,
            jobType: job.jobType,
            payloadJson: JSON.stringify(job.payload),
            status: job.status,
            priority: job.priority,
            retryCount: job.retryCount,
            maxRetries: job.maxRetries,
            scheduledAt: job.scheduledAt,
            startedAt: job.startedAt,
            completedAt: job.completedAt,
            failedAt: job.failedAt,
            errorMessage: job.errorMessage,
            createdAt: job.createdAt,
            updatedAt: job.updatedAt,
          },
          update: {
            status: job.status,
            retryCount: job.retryCount,
            startedAt: job.startedAt,
            completedAt: job.completedAt,
            failedAt: job.failedAt,
            errorMessage: job.errorMessage,
            updatedAt: job.updatedAt,
          },
        });
      } catch {
        // Fallback
      }
    }
  }

  public findById(id: JobId): Promise<BackgroundJob | null> {
    const job = this.inMemoryMap.get(id.value);
    return Promise.resolve(job ?? null);
  }

  public findPending(): Promise<BackgroundJob[]> {
    return Promise.resolve(
      Array.from(this.inMemoryMap.values()).filter(
        (j) => j.status === 'SCHEDULED' || j.status === 'RUNNING',
      ),
    );
  }

  public search(query?: { status?: string; jobType?: string }): Promise<BackgroundJob[]> {
    let list = Array.from(this.inMemoryMap.values());
    if (typeof query?.status === 'string' && query.status.length > 0) {
      list = list.filter((j) => j.status === query.status);
    }
    if (typeof query?.jobType === 'string' && query.jobType.length > 0) {
      list = list.filter((j) => j.jobType === query.jobType);
    }
    return Promise.resolve(list);
  }

  public delete(id: JobId): Promise<void> {
    this.inMemoryMap.delete(id.value);
    return Promise.resolve();
  }
}

// ─── PrismaConfigurationRepository ──────────────────────────────────────────

export class PrismaConfigurationRepository implements IConfigurationRepository {
  private inMemoryConfigs: Map<string, ConfigurationItem> = new Map();
  private inMemoryFlags: Map<string, FeatureFlag> = new Map();

  constructor(private readonly databaseProvider: DatabaseProvider) {}

  public get provider(): DatabaseProvider {
    return this.databaseProvider;
  }

  public saveConfiguration(item: ConfigurationItem): Promise<void> {
    this.inMemoryConfigs.set(item.key.value, item);
    return Promise.resolve();
  }

  public findConfigurationByKey(key: ConfigurationKey): Promise<ConfigurationItem | null> {
    return Promise.resolve(this.inMemoryConfigs.get(key.value) ?? null);
  }

  public findAllConfigurations(): Promise<ConfigurationItem[]> {
    return Promise.resolve(Array.from(this.inMemoryConfigs.values()));
  }

  public deleteConfiguration(key: ConfigurationKey): Promise<void> {
    this.inMemoryConfigs.delete(key.value);
    return Promise.resolve();
  }

  public saveFeatureFlag(flag: FeatureFlag): Promise<void> {
    this.inMemoryFlags.set(flag.name.value, flag);
    return Promise.resolve();
  }

  public findFeatureFlagByName(name: FeatureFlagName): Promise<FeatureFlag | null> {
    return Promise.resolve(this.inMemoryFlags.get(name.value) ?? null);
  }

  public findAllFeatureFlags(): Promise<FeatureFlag[]> {
    return Promise.resolve(Array.from(this.inMemoryFlags.values()));
  }
}

import {
  AuditLog,
  BackgroundJob,
  IAuditRepository,
  IJobRepository,
  INotificationRepository,
  Notification,
} from '@rios/domain';
import { describe, expect, it } from 'vitest';

import {
  CreateAuditEntryCommandHandler,
  GetAuditLogsQueryHandler,
  GetHealthStatusQueryHandler,
  QueueNotificationCommandHandler,
  ScheduleBackgroundJobCommandHandler,
} from '../enterprise/index.js';

class MockNotificationRepository implements INotificationRepository {
  public saved: Notification[] = [];
  public save(notification: Notification): Promise<void> {
    this.saved.push(notification);
    return Promise.resolve();
  }
  public findById(): Promise<Notification | null> {
    return Promise.resolve(null);
  }
  public findPending(): Promise<Notification[]> {
    return Promise.resolve([]);
  }
  public search(): Promise<Notification[]> {
    return Promise.resolve([]);
  }
  public delete(): Promise<void> {
    return Promise.resolve();
  }
}

class MockAuditRepository implements IAuditRepository {
  public logs: AuditLog[] = [];
  public save(auditLog: AuditLog): Promise<void> {
    this.logs.push(auditLog);
    return Promise.resolve();
  }
  public findById(): Promise<AuditLog | null> {
    return Promise.resolve(null);
  }
  public search(query?: { userId?: string; action?: string; limit?: number }): Promise<AuditLog[]> {
    let res = [...this.logs];
    if (query?.userId !== undefined) res = res.filter((l) => l.userId === query.userId);
    return Promise.resolve(res);
  }
}

class MockJobRepository implements IJobRepository {
  public jobs: BackgroundJob[] = [];
  public save(job: BackgroundJob): Promise<void> {
    this.jobs.push(job);
    return Promise.resolve();
  }
  public findById(): Promise<BackgroundJob | null> {
    return Promise.resolve(null);
  }
  public findPending(): Promise<BackgroundJob[]> {
    return Promise.resolve([]);
  }
  public search(): Promise<BackgroundJob[]> {
    return Promise.resolve([]);
  }
  public delete(): Promise<void> {
    return Promise.resolve();
  }
}

describe('Enterprise Platform Application Layer (Sprint 14)', () => {
  it('should handle QueueNotificationCommand', async () => {
    const repo = new MockNotificationRepository();
    const handler = new QueueNotificationCommandHandler(repo);

    const res = await handler.execute({
      recipientId: 'usr_99',
      type: 'WELCOME',
      channel: 'EMAIL',
      message: 'Welcome to RIOS Enterprise',
    });

    expect(res.isSuccess).toBe(true);
    expect(res.value.recipientId).toBe('usr_99');
    expect(repo.saved.length).toBe(1);
  });

  it('should handle CreateAuditEntryCommand and GetAuditLogsQuery', async () => {
    const repo = new MockAuditRepository();
    const createHandler = new CreateAuditEntryCommandHandler(repo);
    const getHandler = new GetAuditLogsQueryHandler(repo);

    await createHandler.execute({
      userId: 'usr_admin',
      action: 'LOGIN',
      ipAddress: '192.168.1.1',
    });

    const logsRes = await getHandler.execute({ userId: 'usr_admin' });
    expect(logsRes.isSuccess).toBe(true);
    expect(logsRes.value.length).toBe(1);
    expect(logsRes.value[0].action).toBe('LOGIN');
  });

  it('should handle ScheduleBackgroundJobCommand', async () => {
    const repo = new MockJobRepository();
    const handler = new ScheduleBackgroundJobCommandHandler(repo);

    const res = await handler.execute({
      jobType: 'EXPORT_DATA',
      payload: { format: 'csv' },
    });

    expect(res.isSuccess).toBe(true);
    expect(res.value.jobType).toBe('EXPORT_DATA');
    expect(repo.jobs.length).toBe(1);
  });

  it('should return system health status via GetHealthStatusQueryHandler', async () => {
    const handler = new GetHealthStatusQueryHandler();
    const res = await handler.execute();

    expect(res.isSuccess).toBe(true);
    expect(res.value.status).toBe('HEALTHY');
    expect(res.value.components.length).toBeGreaterThan(0);
  });
});

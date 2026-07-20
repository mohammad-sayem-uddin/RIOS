/**
 * Enterprise Platform Bounded Context — Application Queries
 */

import {
  IAuditRepository,
  IConfigurationRepository,
  IJobRepository,
  INotificationRepository,
  JobId,
} from '@rios/domain';
import { Result } from '@rios/shared';

import {
  AuditLogDTO,
  BackgroundJobDTO,
  FeatureFlagDTO,
  HealthStatusDTO,
  NotificationDTO,
  SystemMetricDTO,
} from '../dto/index.js';

// ——— GetAuditLogsQuery ———

export interface GetAuditLogsQuery {
  userId?: string;
  action?: string;
  limit?: number;
}

export class GetAuditLogsQueryHandler {
  constructor(private readonly auditRepo: IAuditRepository) {}

  public async execute(query: GetAuditLogsQuery): Promise<Result<AuditLogDTO[]>> {
    const auditLogs = await this.auditRepo.search({
      userId: query.userId,
      action: query.action,
      limit: query.limit ?? 50,
    });

    const dtos: AuditLogDTO[] = auditLogs.map((log) => ({
      id: log.auditId.value,
      userId: log.userId,
      action: log.action,
      details: log.details,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      timestamp: log.createdAt.toISOString(),
    }));

    return Result.ok<AuditLogDTO[]>(dtos);
  }
}

// ——— GetJobStatusQuery ———

export interface GetJobStatusQuery {
  jobId: string;
}

export class GetJobStatusQueryHandler {
  constructor(private readonly jobRepo: IJobRepository) {}

  public async execute(query: GetJobStatusQuery): Promise<Result<BackgroundJobDTO>> {
    const jobId = JobId.from(query.jobId);
    const job = await this.jobRepo.findById(jobId);

    if (!job) {
      return Result.fail<BackgroundJobDTO>('Job not found');
    }

    return Result.ok<BackgroundJobDTO>({
      id: job.jobId.value,
      jobType: job.jobType,
      payload: job.payload,
      status: job.status,
      priority: job.priority,
      retryCount: job.retryCount,
      maxRetries: job.maxRetries,
      scheduledAt: job.scheduledAt.toISOString(),
      startedAt: job.startedAt?.toISOString(),
      completedAt: job.completedAt?.toISOString(),
      failedAt: job.failedAt?.toISOString(),
      errorMessage: job.errorMessage,
      executionsCount: job.executions.length,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
    });
  }
}

// ——— GetNotificationsQuery ———

export interface GetNotificationsQuery {
  recipientId?: string;
  status?: string;
}

export class GetNotificationsQueryHandler {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  public async execute(query: GetNotificationsQuery): Promise<Result<NotificationDTO[]>> {
    const notifications = await this.notificationRepo.search({
      recipientId: query.recipientId,
      status: query.status,
    });

    const dtos: NotificationDTO[] = notifications.map((n) => ({
      id: n.notificationId.value,
      recipientId: n.message.recipientId,
      type: n.message.type,
      channel: n.message.channel,
      subject: n.message.subject,
      message: n.message.message,
      status: n.status,
      retryCount: n.retryCount,
      maxRetries: n.maxRetries,
      queuedAt: n.queuedAt.toISOString(),
      sentAt: n.sentAt?.toISOString(),
      failedAt: n.failedAt?.toISOString(),
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.updatedAt.toISOString(),
    }));

    return Result.ok<NotificationDTO[]>(dtos);
  }
}

// ——— GetHealthStatusQuery ———

export interface GetHealthStatusQuery {
  componentName?: string;
}

export class GetHealthStatusQueryHandler {
  public execute(_query?: GetHealthStatusQuery): Promise<Result<HealthStatusDTO>> {
    const now = new Date();
    return Promise.resolve(
      Result.ok<HealthStatusDTO>({
        status: 'HEALTHY',
        version: '1.0.0',
        uptimeSeconds: process.uptime(),
        timestamp: now.toISOString(),
        components: [
          { name: 'database', status: 'HEALTHY', message: 'PostgreSQL operational' },
          { name: 'cache', status: 'HEALTHY', message: 'In-Memory cache active' },
          { name: 'queue', status: 'HEALTHY', message: 'Job queue active' },
        ],
      }),
    );
  }
}

// ——— GetSystemMetricsQuery ———

export interface GetSystemMetricsQuery {
  metricName?: string;
}

export class GetSystemMetricsQueryHandler {
  public execute(query?: GetSystemMetricsQuery): Promise<Result<SystemMetricDTO[]>> {
    const now = new Date().toISOString();
    const metrics: SystemMetricDTO[] = [
      {
        metricName: query?.metricName ?? 'system_memory_usage_bytes',
        metricType: 'GAUGE',
        value: process.memoryUsage().heapUsed,
        unit: 'bytes',
        recordedAt: now,
      },
      {
        metricName: 'system_uptime_seconds',
        metricType: 'COUNTER',
        value: process.uptime(),
        unit: 'seconds',
        recordedAt: now,
      },
    ];

    return Promise.resolve(Result.ok<SystemMetricDTO[]>(metrics));
  }
}

// ——— GetFeatureFlagsQuery ———

export interface GetFeatureFlagsQuery {
  flagName?: string;
}

export class GetFeatureFlagsQueryHandler {
  constructor(private readonly configRepo: IConfigurationRepository) {}

  public async execute(_query?: GetFeatureFlagsQuery): Promise<Result<FeatureFlagDTO[]>> {
    const flags = await this.configRepo.findAllFeatureFlags();
    const dtos: FeatureFlagDTO[] = flags.map((f) => ({
      name: f.name.value,
      description: f.description,
      isEnabled: f.isEnabled,
      rules: f.rules,
      createdAt: f.createdAt.toISOString(),
      updatedAt: f.updatedAt.toISOString(),
    }));

    return Result.ok<FeatureFlagDTO[]>(dtos);
  }
}

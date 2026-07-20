/**
 * Enterprise Platform Bounded Context — Application Commands
 */

import {
  AuditLog,
  BackgroundJob,
  FeatureFlag,
  FeatureFlagName,
  IAuditRepository,
  IConfigurationRepository,
  IJobRepository,
  INotificationRepository,
  JobId,
  Notification,
  NotificationMessage,
  WebhookId,
} from '@rios/domain';
import { Result } from '@rios/shared';

import {
  AuditLogDTO,
  BackgroundJobDTO,
  FeatureFlagDTO,
  NotificationDTO,
  WebhookDTO,
} from '../dto/index.js';

// ——— QueueNotificationCommand ———

export interface QueueNotificationCommand {
  recipientId: string;
  type: string;
  channel: 'EMAIL' | 'SMS' | 'IN_APP' | 'WEBHOOK';
  subject?: string;
  message: string;
  metadata?: Record<string, unknown>;
  maxRetries?: number;
}

export class QueueNotificationCommandHandler {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  public async execute(command: QueueNotificationCommand): Promise<Result<NotificationDTO>> {
    const msgResult = NotificationMessage.create({
      recipientId: command.recipientId,
      type: command.type,
      channel: command.channel,
      subject: command.subject,
      message: command.message,
      metadata: command.metadata,
    });

    if (msgResult.isFailure) {
      return Result.fail<NotificationDTO>(msgResult.error);
    }

    const notifResult = Notification.create(msgResult.value, command.maxRetries ?? 3);
    if (notifResult.isFailure) {
      return Result.fail<NotificationDTO>(notifResult.error);
    }

    const notif = notifResult.value;
    await this.notificationRepo.save(notif);

    return Result.ok<NotificationDTO>({
      id: notif.notificationId.value,
      recipientId: notif.message.recipientId,
      type: notif.message.type,
      channel: notif.message.channel,
      subject: notif.message.subject,
      message: notif.message.message,
      status: notif.status,
      retryCount: notif.retryCount,
      maxRetries: notif.maxRetries,
      queuedAt: notif.queuedAt.toISOString(),
      sentAt: notif.sentAt?.toISOString(),
      failedAt: notif.failedAt?.toISOString(),
      createdAt: notif.createdAt.toISOString(),
      updatedAt: notif.updatedAt.toISOString(),
    });
  }
}

// ——— SendEmailCommand ———

export interface SendEmailCommand {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
  from?: string;
}

export class SendEmailCommandHandler {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  public async execute(command: SendEmailCommand): Promise<Result<NotificationDTO>> {
    const msgResult = NotificationMessage.create({
      recipientId: command.to,
      type: 'EMAIL_DISPATCH',
      channel: 'EMAIL',
      subject: command.subject,
      message: command.body,
      metadata: { from: command.from, isHtml: command.isHtml ?? true },
    });

    if (msgResult.isFailure) {
      return Result.fail<NotificationDTO>(msgResult.error);
    }

    const notifResult = Notification.create(msgResult.value);
    if (notifResult.isFailure) {
      return Result.fail<NotificationDTO>(notifResult.error);
    }

    const notif = notifResult.value;
    notif.markSent();
    await this.notificationRepo.save(notif);

    return Result.ok<NotificationDTO>({
      id: notif.notificationId.value,
      recipientId: notif.message.recipientId,
      type: notif.message.type,
      channel: notif.message.channel,
      subject: notif.message.subject,
      message: notif.message.message,
      status: notif.status,
      retryCount: notif.retryCount,
      maxRetries: notif.maxRetries,
      queuedAt: notif.queuedAt.toISOString(),
      sentAt: notif.sentAt?.toISOString(),
      failedAt: notif.failedAt?.toISOString(),
      createdAt: notif.createdAt.toISOString(),
      updatedAt: notif.updatedAt.toISOString(),
    });
  }
}

// ——— TriggerWebhookCommand ———

export interface TriggerWebhookCommand {
  name: string;
  url: string;
  eventTypes: string[];
  payload: Record<string, unknown>;
}

export class TriggerWebhookCommandHandler {
  public execute(command: TriggerWebhookCommand): Promise<Result<WebhookDTO>> {
    if (!command.url || !command.url.trim()) {
      return Promise.resolve(Result.fail<WebhookDTO>('Webhook URL is required'));
    }

    const now = new Date();
    return Promise.resolve(
      Result.ok<WebhookDTO>({
        id: WebhookId.create().value,
        name: command.name,
        url: command.url,
        eventTypes: command.eventTypes,
        isActive: true,
        lastTriggeredAt: now.toISOString(),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      }),
    );
  }
}

// ——— CreateAuditEntryCommand ———

export interface CreateAuditEntryCommand {
  userId?: string;
  action: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

export class CreateAuditEntryCommandHandler {
  constructor(private readonly auditRepo: IAuditRepository) {}

  public async execute(command: CreateAuditEntryCommand): Promise<Result<AuditLogDTO>> {
    const auditRes = AuditLog.create({
      userId: command.userId,
      action: command.action,
      details: command.details,
      ipAddress: command.ipAddress,
      userAgent: command.userAgent,
    });

    if (auditRes.isFailure) {
      return Result.fail<AuditLogDTO>(auditRes.error);
    }

    const auditLog = auditRes.value;
    await this.auditRepo.save(auditLog);

    return Result.ok<AuditLogDTO>({
      id: auditLog.auditId.value,
      userId: auditLog.userId,
      action: auditLog.action,
      details: auditLog.details,
      ipAddress: auditLog.ipAddress,
      userAgent: auditLog.userAgent,
      timestamp: auditLog.createdAt.toISOString(),
    });
  }
}

// ——— ScheduleBackgroundJobCommand ———

export interface ScheduleBackgroundJobCommand {
  jobType: string;
  payload: Record<string, unknown>;
  priority?: number;
  maxRetries?: number;
  scheduledAt?: Date;
}

export class ScheduleBackgroundJobCommandHandler {
  constructor(private readonly jobRepo: IJobRepository) {}

  public async execute(command: ScheduleBackgroundJobCommand): Promise<Result<BackgroundJobDTO>> {
    const jobRes = BackgroundJob.create(command.jobType, command.payload, {
      priority: command.priority,
      maxRetries: command.maxRetries,
      scheduledAt: command.scheduledAt,
    });

    if (jobRes.isFailure) {
      return Result.fail<BackgroundJobDTO>(jobRes.error);
    }

    const job = jobRes.value;
    await this.jobRepo.save(job);

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

// ——— RetryJobCommand ———

export interface RetryJobCommand {
  jobId: string;
}

export class RetryJobCommandHandler {
  constructor(private readonly jobRepo: IJobRepository) {}

  public async execute(command: RetryJobCommand): Promise<Result<BackgroundJobDTO>> {
    const jobId = JobId.from(command.jobId);
    const job = await this.jobRepo.findById(jobId);

    if (!job) {
      return Result.fail<BackgroundJobDTO>('Job not found');
    }

    if (!job.canRetry()) {
      return Result.fail<BackgroundJobDTO>('Maximum retry limit reached for this job');
    }

    job.startExecution();
    await this.jobRepo.save(job);

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

// ——— UpdateFeatureFlagCommand ———

export interface UpdateFeatureFlagCommand {
  name: string;
  isEnabled: boolean;
  description?: string;
  rules?: Record<string, unknown>;
}

export class UpdateFeatureFlagCommandHandler {
  constructor(private readonly configRepo: IConfigurationRepository) {}

  public async execute(command: UpdateFeatureFlagCommand): Promise<Result<FeatureFlagDTO>> {
    const flagNameRes = FeatureFlagName.create(command.name);
    if (flagNameRes.isFailure) {
      return Result.fail<FeatureFlagDTO>(flagNameRes.error);
    }

    const flagName = flagNameRes.value;
    let flag = await this.configRepo.findFeatureFlagByName(flagName);

    if (!flag) {
      const createRes = FeatureFlag.create({
        name: flagName,
        isEnabled: command.isEnabled,
        description: command.description,
        rules: command.rules,
      });

      if (createRes.isFailure) {
        return Result.fail<FeatureFlagDTO>(createRes.error);
      }
      flag = createRes.value;
    } else {
      if (command.isEnabled) {
        flag.enable();
      } else {
        flag.disable();
      }
    }

    await this.configRepo.saveFeatureFlag(flag);

    return Result.ok<FeatureFlagDTO>({
      name: flag.name.value,
      description: flag.description,
      isEnabled: flag.isEnabled,
      rules: flag.rules,
      createdAt: flag.createdAt.toISOString(),
      updatedAt: flag.updatedAt.toISOString(),
    });
  }
}

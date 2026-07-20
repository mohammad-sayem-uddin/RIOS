/**
 * Enterprise Platform Application Service
 */

import { Result } from '@rios/shared';

import {
  CreateAuditEntryCommand,
  CreateAuditEntryCommandHandler,
  QueueNotificationCommand,
  QueueNotificationCommandHandler,
  RetryJobCommand,
  RetryJobCommandHandler,
  ScheduleBackgroundJobCommand,
  ScheduleBackgroundJobCommandHandler,
  SendEmailCommand,
  SendEmailCommandHandler,
  TriggerWebhookCommand,
  TriggerWebhookCommandHandler,
  UpdateFeatureFlagCommand,
  UpdateFeatureFlagCommandHandler,
} from '../commands/index.js';
import {
  AuditLogDTO,
  BackgroundJobDTO,
  FeatureFlagDTO,
  HealthStatusDTO,
  NotificationDTO,
  SystemMetricDTO,
  WebhookDTO,
} from '../dto/index.js';
import {
  GetAuditLogsQuery,
  GetAuditLogsQueryHandler,
  GetFeatureFlagsQuery,
  GetFeatureFlagsQueryHandler,
  GetHealthStatusQuery,
  GetHealthStatusQueryHandler,
  GetJobStatusQuery,
  GetJobStatusQueryHandler,
  GetNotificationsQuery,
  GetNotificationsQueryHandler,
  GetSystemMetricsQuery,
  GetSystemMetricsQueryHandler,
} from '../queries/index.js';

export interface EnterpriseApplicationService {
  queueNotification(command: QueueNotificationCommand): Promise<Result<NotificationDTO>>;
  sendEmail(command: SendEmailCommand): Promise<Result<NotificationDTO>>;
  triggerWebhook(command: TriggerWebhookCommand): Promise<Result<WebhookDTO>>;
  createAuditEntry(command: CreateAuditEntryCommand): Promise<Result<AuditLogDTO>>;
  scheduleBackgroundJob(command: ScheduleBackgroundJobCommand): Promise<Result<BackgroundJobDTO>>;
  retryJob(command: RetryJobCommand): Promise<Result<BackgroundJobDTO>>;
  updateFeatureFlag(command: UpdateFeatureFlagCommand): Promise<Result<FeatureFlagDTO>>;

  getAuditLogs(query: GetAuditLogsQuery): Promise<Result<AuditLogDTO[]>>;
  getJobStatus(query: GetJobStatusQuery): Promise<Result<BackgroundJobDTO>>;
  getNotifications(query: GetNotificationsQuery): Promise<Result<NotificationDTO[]>>;
  getHealthStatus(query?: GetHealthStatusQuery): Promise<Result<HealthStatusDTO>>;
  getSystemMetrics(query?: GetSystemMetricsQuery): Promise<Result<SystemMetricDTO[]>>;
  getFeatureFlags(query?: GetFeatureFlagsQuery): Promise<Result<FeatureFlagDTO[]>>;
}

export class EnterpriseApplicationServiceImpl implements EnterpriseApplicationService {
  constructor(
    private readonly queueNotificationHandler: QueueNotificationCommandHandler,
    private readonly sendEmailHandler: SendEmailCommandHandler,
    private readonly triggerWebhookHandler: TriggerWebhookCommandHandler,
    private readonly createAuditEntryHandler: CreateAuditEntryCommandHandler,
    private readonly scheduleBackgroundJobHandler: ScheduleBackgroundJobCommandHandler,
    private readonly retryJobHandler: RetryJobCommandHandler,
    private readonly updateFeatureFlagHandler: UpdateFeatureFlagCommandHandler,
    private readonly getAuditLogsHandler: GetAuditLogsQueryHandler,
    private readonly getJobStatusHandler: GetJobStatusQueryHandler,
    private readonly getNotificationsHandler: GetNotificationsQueryHandler,
    private readonly getHealthStatusHandler: GetHealthStatusQueryHandler,
    private readonly getSystemMetricsHandler: GetSystemMetricsQueryHandler,
    private readonly getFeatureFlagsHandler: GetFeatureFlagsQueryHandler,
  ) {}

  public async queueNotification(
    command: QueueNotificationCommand,
  ): Promise<Result<NotificationDTO>> {
    return this.queueNotificationHandler.execute(command);
  }

  public async sendEmail(command: SendEmailCommand): Promise<Result<NotificationDTO>> {
    return this.sendEmailHandler.execute(command);
  }

  public async triggerWebhook(command: TriggerWebhookCommand): Promise<Result<WebhookDTO>> {
    return this.triggerWebhookHandler.execute(command);
  }

  public async createAuditEntry(command: CreateAuditEntryCommand): Promise<Result<AuditLogDTO>> {
    return this.createAuditEntryHandler.execute(command);
  }

  public async scheduleBackgroundJob(
    command: ScheduleBackgroundJobCommand,
  ): Promise<Result<BackgroundJobDTO>> {
    return this.scheduleBackgroundJobHandler.execute(command);
  }

  public async retryJob(command: RetryJobCommand): Promise<Result<BackgroundJobDTO>> {
    return this.retryJobHandler.execute(command);
  }

  public async updateFeatureFlag(
    command: UpdateFeatureFlagCommand,
  ): Promise<Result<FeatureFlagDTO>> {
    return this.updateFeatureFlagHandler.execute(command);
  }

  public async getAuditLogs(query: GetAuditLogsQuery): Promise<Result<AuditLogDTO[]>> {
    return this.getAuditLogsHandler.execute(query);
  }

  public async getJobStatus(query: GetJobStatusQuery): Promise<Result<BackgroundJobDTO>> {
    return this.getJobStatusHandler.execute(query);
  }

  public async getNotifications(query: GetNotificationsQuery): Promise<Result<NotificationDTO[]>> {
    return this.getNotificationsHandler.execute(query);
  }

  public async getHealthStatus(query?: GetHealthStatusQuery): Promise<Result<HealthStatusDTO>> {
    return this.getHealthStatusHandler.execute(query);
  }

  public async getSystemMetrics(query?: GetSystemMetricsQuery): Promise<Result<SystemMetricDTO[]>> {
    return this.getSystemMetricsHandler.execute(query);
  }

  public async getFeatureFlags(query?: GetFeatureFlagsQuery): Promise<Result<FeatureFlagDTO[]>> {
    return this.getFeatureFlagsHandler.execute(query);
  }
}

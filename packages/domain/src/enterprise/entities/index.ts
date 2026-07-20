/**
 * Enterprise Platform Bounded Context — Entities
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { WebhookId, MetricId, FeatureFlagName, ConfigurationKey } from '../value-objects/index.js';

export interface NotificationMessageProps {
  recipientId: string;
  type: string;
  channel: 'EMAIL' | 'SMS' | 'IN_APP' | 'WEBHOOK';
  subject?: string;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export class NotificationMessage extends Entity<NotificationMessageProps> {
  private constructor(props: NotificationMessageProps, id?: UniqueId) {
    super(props, id);
  }

  public get recipientId(): string {
    return this.props.recipientId;
  }

  public get type(): string {
    return this.props.type;
  }

  public get channel(): 'EMAIL' | 'SMS' | 'IN_APP' | 'WEBHOOK' {
    return this.props.channel;
  }

  public get subject(): string | undefined {
    return this.props.subject;
  }

  public get message(): string {
    return this.props.message;
  }

  public get metadata(): Record<string, unknown> | undefined {
    return this.props.metadata;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public static create(
    props: Omit<NotificationMessageProps, 'createdAt'>,
    id?: UniqueId,
  ): Result<NotificationMessage> {
    if (!props.recipientId || !props.recipientId.trim()) {
      return Result.fail<NotificationMessage>('Recipient ID is required');
    }
    if (!props.message || !props.message.trim()) {
      return Result.fail<NotificationMessage>('Message content is required');
    }
    return Result.ok<NotificationMessage>(
      new NotificationMessage({ ...props, createdAt: new Date() }, id),
    );
  }
}

export interface EmailMessageProps {
  to: string;
  from?: string;
  subject: string;
  body: string;
  isHtml?: boolean;
  cc?: string[];
  bcc?: string[];
  sentAt?: Date;
}

export class EmailMessage extends Entity<EmailMessageProps> {
  private constructor(props: EmailMessageProps, id?: UniqueId) {
    super(props, id);
  }

  public get to(): string {
    return this.props.to;
  }

  public get from(): string | undefined {
    return this.props.from;
  }

  public get subject(): string {
    return this.props.subject;
  }

  public get body(): string {
    return this.props.body;
  }

  public get isHtml(): boolean {
    return this.props.isHtml ?? true;
  }

  public get cc(): string[] | undefined {
    return this.props.cc;
  }

  public get bcc(): string[] | undefined {
    return this.props.bcc;
  }

  public get sentAt(): Date | undefined {
    return this.props.sentAt;
  }

  public static create(props: EmailMessageProps, id?: UniqueId): Result<EmailMessage> {
    if (!props.to || !props.to.trim()) {
      return Result.fail<EmailMessage>('Recipient email (to) is required');
    }
    if (!props.subject || !props.subject.trim()) {
      return Result.fail<EmailMessage>('Email subject is required');
    }
    return Result.ok<EmailMessage>(new EmailMessage(props, id));
  }
}

export interface WebhookProps {
  webhookId: WebhookId;
  name: string;
  url: string;
  secret: string;
  eventTypes: string[];
  isActive: boolean;
  lastTriggeredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Webhook extends Entity<WebhookProps> {
  private constructor(props: WebhookProps, id?: UniqueId) {
    super(props, id);
  }

  public get webhookId(): WebhookId {
    return this.props.webhookId;
  }

  public get name(): string {
    return this.props.name;
  }

  public get url(): string {
    return this.props.url;
  }

  public get secret(): string {
    return this.props.secret;
  }

  public get eventTypes(): string[] {
    return this.props.eventTypes;
  }

  public get isActive(): boolean {
    return this.props.isActive;
  }

  public get lastTriggeredAt(): Date | undefined {
    return this.props.lastTriggeredAt;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public markTriggered(at: Date = new Date()): void {
    this.props.lastTriggeredAt = at;
    this.props.updatedAt = at;
  }

  public deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  public activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  public static create(
    props: Omit<WebhookProps, 'webhookId' | 'createdAt' | 'updatedAt'>,
    id?: UniqueId,
  ): Result<Webhook> {
    if (!props.name || !props.name.trim()) {
      return Result.fail<Webhook>('Webhook name is required');
    }
    if (!props.url || !props.url.trim()) {
      return Result.fail<Webhook>('Webhook URL is required');
    }
    const now = new Date();
    const webhookId = WebhookId.create(id?.value);
    return Result.ok<Webhook>(
      new Webhook(
        {
          ...props,
          webhookId,
          createdAt: now,
          updatedAt: now,
        },
        id,
      ),
    );
  }
}

export interface AuditEntryProps {
  userId?: string;
  action: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export class AuditEntry extends Entity<AuditEntryProps> {
  private constructor(props: AuditEntryProps, id?: UniqueId) {
    super(props, id);
  }

  public get userId(): string | undefined {
    return this.props.userId;
  }

  public get action(): string {
    return this.props.action;
  }

  public get details(): string | undefined {
    return this.props.details;
  }

  public get ipAddress(): string | undefined {
    return this.props.ipAddress;
  }

  public get userAgent(): string | undefined {
    return this.props.userAgent;
  }

  public get timestamp(): Date {
    return this.props.timestamp;
  }

  public static create(
    props: Omit<AuditEntryProps, 'timestamp'>,
    id?: UniqueId,
  ): Result<AuditEntry> {
    if (!props.action || !props.action.trim()) {
      return Result.fail<AuditEntry>('Audit action is required');
    }
    return Result.ok<AuditEntry>(new AuditEntry({ ...props, timestamp: new Date() }, id));
  }
}

export interface ActivityLogProps {
  userId: string;
  activityType: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export class ActivityLog extends Entity<ActivityLogProps> {
  private constructor(props: ActivityLogProps, id?: UniqueId) {
    super(props, id);
  }

  public get userId(): string {
    return this.props.userId;
  }

  public get activityType(): string {
    return this.props.activityType;
  }

  public get description(): string {
    return this.props.description;
  }

  public get metadata(): Record<string, unknown> | undefined {
    return this.props.metadata;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public static create(
    props: Omit<ActivityLogProps, 'createdAt'>,
    id?: UniqueId,
  ): Result<ActivityLog> {
    if (!props.userId || !props.userId.trim()) {
      return Result.fail<ActivityLog>('User ID is required for activity log');
    }
    if (!props.activityType || !props.activityType.trim()) {
      return Result.fail<ActivityLog>('Activity type is required');
    }
    return Result.ok<ActivityLog>(new ActivityLog({ ...props, createdAt: new Date() }, id));
  }
}

export interface JobExecutionProps {
  jobId: string;
  status: 'SUCCESS' | 'FAILURE';
  durationMs: number;
  errorDetails?: string;
  executedAt: Date;
}

export class JobExecution extends Entity<JobExecutionProps> {
  private constructor(props: JobExecutionProps, id?: UniqueId) {
    super(props, id);
  }

  public get jobId(): string {
    return this.props.jobId;
  }

  public get status(): 'SUCCESS' | 'FAILURE' {
    return this.props.status;
  }

  public get durationMs(): number {
    return this.props.durationMs;
  }

  public get errorDetails(): string | undefined {
    return this.props.errorDetails;
  }

  public get executedAt(): Date {
    return this.props.executedAt;
  }

  public static create(props: JobExecutionProps, id?: UniqueId): Result<JobExecution> {
    if (!props.jobId || !props.jobId.trim()) {
      return Result.fail<JobExecution>('Job ID is required for execution log');
    }
    return Result.ok<JobExecution>(new JobExecution(props, id));
  }
}

export interface HealthStatusProps {
  componentName: string;
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  message?: string;
  checkedAt: Date;
  details?: Record<string, unknown>;
}

export class HealthStatus extends Entity<HealthStatusProps> {
  private constructor(props: HealthStatusProps, id?: UniqueId) {
    super(props, id);
  }

  public get componentName(): string {
    return this.props.componentName;
  }

  public get status(): 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' {
    return this.props.status;
  }

  public get message(): string | undefined {
    return this.props.message;
  }

  public get checkedAt(): Date {
    return this.props.checkedAt;
  }

  public get details(): Record<string, unknown> | undefined {
    return this.props.details;
  }

  public isHealthy(): boolean {
    return this.props.status === 'HEALTHY';
  }

  public isDegraded(): boolean {
    return this.props.status === 'DEGRADED';
  }

  public isUnhealthy(): boolean {
    return this.props.status === 'UNHEALTHY';
  }

  public static create(
    props: Omit<HealthStatusProps, 'checkedAt'>,
    id?: UniqueId,
  ): Result<HealthStatus> {
    if (!props.componentName || !props.componentName.trim()) {
      return Result.fail<HealthStatus>('Component name is required');
    }
    return Result.ok<HealthStatus>(new HealthStatus({ ...props, checkedAt: new Date() }, id));
  }
}

export interface SystemMetricProps {
  metricId: MetricId;
  metricName: string;
  metricType: 'COUNTER' | 'GAUGE' | 'HISTOGRAM';
  value: number;
  unit?: string;
  tags?: Record<string, string>;
  recordedAt: Date;
}

export class SystemMetric extends Entity<SystemMetricProps> {
  private constructor(props: SystemMetricProps, id?: UniqueId) {
    super(props, id);
  }

  public get metricId(): MetricId {
    return this.props.metricId;
  }

  public get metricName(): string {
    return this.props.metricName;
  }

  public get metricType(): 'COUNTER' | 'GAUGE' | 'HISTOGRAM' {
    return this.props.metricType;
  }

  public get value(): number {
    return this.props.value;
  }

  public get unit(): string | undefined {
    return this.props.unit;
  }

  public get tags(): Record<string, string> | undefined {
    return this.props.tags;
  }

  public get recordedAt(): Date {
    return this.props.recordedAt;
  }

  public static create(
    props: Omit<SystemMetricProps, 'metricId' | 'recordedAt'>,
    id?: UniqueId,
  ): Result<SystemMetric> {
    if (!props.metricName || !props.metricName.trim()) {
      return Result.fail<SystemMetric>('Metric name is required');
    }
    const metricId = MetricId.create(id?.value);
    return Result.ok<SystemMetric>(
      new SystemMetric({ ...props, metricId, recordedAt: new Date() }, id),
    );
  }
}

export interface FeatureFlagProps {
  name: FeatureFlagName;
  description?: string;
  isEnabled: boolean;
  rules?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export class FeatureFlag extends Entity<FeatureFlagProps> {
  private constructor(props: FeatureFlagProps, id?: UniqueId) {
    super(props, id);
  }

  public get name(): FeatureFlagName {
    return this.props.name;
  }

  public get description(): string | undefined {
    return this.props.description;
  }

  public get isEnabled(): boolean {
    return this.props.isEnabled;
  }

  public get rules(): Record<string, unknown> | undefined {
    return this.props.rules;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public enable(): void {
    this.props.isEnabled = true;
    this.props.updatedAt = new Date();
  }

  public disable(): void {
    this.props.isEnabled = false;
    this.props.updatedAt = new Date();
  }

  public toggle(): void {
    this.props.isEnabled = !this.props.isEnabled;
    this.props.updatedAt = new Date();
  }

  public static create(
    props: Omit<FeatureFlagProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueId,
  ): Result<FeatureFlag> {
    const now = new Date();
    return Result.ok<FeatureFlag>(
      new FeatureFlag({ ...props, createdAt: now, updatedAt: now }, id),
    );
  }
}

export interface ConfigurationItemProps {
  key: ConfigurationKey;
  value: string;
  scope: string;
  isEncrypted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ConfigurationItem extends Entity<ConfigurationItemProps> {
  private constructor(props: ConfigurationItemProps, id?: UniqueId) {
    super(props, id);
  }

  public get key(): ConfigurationKey {
    return this.props.key;
  }

  public get value(): string {
    return this.props.value;
  }

  public get scope(): string {
    return this.props.scope;
  }

  public get isEncrypted(): boolean {
    return this.props.isEncrypted;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public updateValue(newValue: string): Result<void> {
    if (!newValue && newValue !== '') {
      return Result.fail<void>('Configuration value cannot be undefined');
    }
    this.props.value = newValue;
    this.props.updatedAt = new Date();
    return Result.ok();
  }

  public static create(
    props: Omit<ConfigurationItemProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueId,
  ): Result<ConfigurationItem> {
    const now = new Date();
    return Result.ok<ConfigurationItem>(
      new ConfigurationItem({ ...props, createdAt: now, updatedAt: now }, id),
    );
  }
}

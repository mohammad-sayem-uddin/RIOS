/**
 * Enterprise Platform Bounded Context — Aggregate Roots
 */

import { AggregateRoot, Result, UniqueId } from '@rios/shared';

import { JobExecution, NotificationMessage } from '../entities/index.js';
import {
  AuditLoggedEvent,
  BackgroundJobCompletedEvent,
  BackgroundJobFailedEvent,
  BackgroundJobScheduledEvent,
  NotificationQueuedEvent,
  NotificationSentEvent,
} from '../events/index.js';
import { AuditId, JobId, NotificationId } from '../value-objects/index.js';

// ─── Notification Aggregate Root ──────────────────────────────────────────────

export type NotificationStatus = 'QUEUED' | 'SENDING' | 'SENT' | 'FAILED';

export interface NotificationProps {
  notificationId: NotificationId;
  message: NotificationMessage;
  status: NotificationStatus;
  retryCount: number;
  maxRetries: number;
  queuedAt: Date;
  sentAt?: Date;
  failedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Notification extends AggregateRoot<NotificationProps> {
  private constructor(props: NotificationProps, id?: UniqueId) {
    super(props, id);
  }

  public get notificationId(): NotificationId {
    return this.props.notificationId;
  }

  public get message(): NotificationMessage {
    return this.props.message;
  }

  public get status(): NotificationStatus {
    return this.props.status;
  }

  public get retryCount(): number {
    return this.props.retryCount;
  }

  public get maxRetries(): number {
    return this.props.maxRetries;
  }

  public get queuedAt(): Date {
    return this.props.queuedAt;
  }

  public get sentAt(): Date | undefined {
    return this.props.sentAt;
  }

  public get failedAt(): Date | undefined {
    return this.props.failedAt;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public markSending(): Result<void> {
    if (this.props.status === 'SENT') {
      return Result.fail<void>('Notification is already sent');
    }
    this.props.status = 'SENDING';
    this.props.updatedAt = new Date();
    return Result.ok();
  }

  public markSent(sentAt: Date = new Date()): Result<void> {
    this.props.status = 'SENT';
    this.props.sentAt = sentAt;
    this.props.updatedAt = sentAt;

    this.addDomainEvent(
      new NotificationSentEvent(
        this.props.notificationId.value,
        this.props.message.recipientId,
        sentAt,
      ),
    );

    return Result.ok();
  }

  public markFailed(): Result<void> {
    this.props.retryCount += 1;
    this.props.failedAt = new Date();
    this.props.status = 'FAILED';
    this.props.updatedAt = new Date();
    return Result.ok();
  }

  public canRetry(): boolean {
    return this.props.retryCount < this.props.maxRetries;
  }

  public static create(
    message: NotificationMessage,
    maxRetries: number = 3,
    id?: UniqueId,
  ): Result<Notification> {
    const now = new Date();
    const notificationId = NotificationId.create(id?.value);
    const notification = new Notification(
      {
        notificationId,
        message,
        status: 'QUEUED',
        retryCount: 0,
        maxRetries,
        queuedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      id,
    );

    notification.addDomainEvent(
      new NotificationQueuedEvent(
        notificationId.value,
        message.recipientId,
        message.type,
        message.channel,
      ),
    );

    return Result.ok<Notification>(notification);
  }
}

// ─── AuditLog Aggregate Root ──────────────────────────────────────────────────

export interface AuditLogProps {
  auditId: AuditId;
  userId?: string;
  action: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export class AuditLog extends AggregateRoot<AuditLogProps> {
  private constructor(props: AuditLogProps, id?: UniqueId) {
    super(props, id);
  }

  public get auditId(): AuditId {
    return this.props.auditId;
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

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public static create(
    props: Omit<AuditLogProps, 'auditId' | 'createdAt'>,
    id?: UniqueId,
  ): Result<AuditLog> {
    if (!props.action || !props.action.trim()) {
      return Result.fail<AuditLog>('Audit action is required');
    }
    const now = new Date();
    const auditId = AuditId.create(id?.value);
    const auditLog = new AuditLog(
      {
        ...props,
        auditId,
        createdAt: now,
      },
      id,
    );

    auditLog.addDomainEvent(new AuditLoggedEvent(auditId.value, props.userId, props.action));

    return Result.ok<AuditLog>(auditLog);
  }
}

// ─── BackgroundJob Aggregate Root ─────────────────────────────────────────────

export type JobStatus = 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface BackgroundJobProps {
  jobId: JobId;
  jobType: string;
  payload: Record<string, unknown>;
  status: JobStatus;
  priority: number;
  retryCount: number;
  maxRetries: number;
  scheduledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  errorMessage?: string;
  executions: JobExecution[];
  createdAt: Date;
  updatedAt: Date;
}

export class BackgroundJob extends AggregateRoot<BackgroundJobProps> {
  private constructor(props: BackgroundJobProps, id?: UniqueId) {
    super(props, id);
  }

  public get jobId(): JobId {
    return this.props.jobId;
  }

  public get jobType(): string {
    return this.props.jobType;
  }

  public get payload(): Record<string, unknown> {
    return { ...this.props.payload };
  }

  public get status(): JobStatus {
    return this.props.status;
  }

  public get priority(): number {
    return this.props.priority;
  }

  public get retryCount(): number {
    return this.props.retryCount;
  }

  public get maxRetries(): number {
    return this.props.maxRetries;
  }

  public get scheduledAt(): Date {
    return this.props.scheduledAt;
  }

  public get startedAt(): Date | undefined {
    return this.props.startedAt;
  }

  public get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  public get failedAt(): Date | undefined {
    return this.props.failedAt;
  }

  public get errorMessage(): string | undefined {
    return this.props.errorMessage;
  }

  public get executions(): JobExecution[] {
    return [...this.props.executions];
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public startExecution(at: Date = new Date()): Result<void> {
    if (this.props.status === 'RUNNING') {
      return Result.fail<void>('Job is already running');
    }
    this.props.status = 'RUNNING';
    this.props.startedAt = at;
    this.props.updatedAt = at;
    return Result.ok();
  }

  public completeExecution(durationMs: number, at: Date = new Date()): Result<void> {
    this.props.status = 'COMPLETED';
    this.props.completedAt = at;
    this.props.updatedAt = at;

    const executionOrError = JobExecution.create({
      jobId: this.props.jobId.value,
      status: 'SUCCESS',
      durationMs,
      executedAt: at,
    });
    if (executionOrError.isSuccess) {
      this.props.executions.push(executionOrError.value);
    }

    this.addDomainEvent(
      new BackgroundJobCompletedEvent(this.props.jobId.value, this.props.jobType, at, durationMs),
    );

    return Result.ok();
  }

  public failExecution(error: string, durationMs: number, at: Date = new Date()): Result<void> {
    this.props.retryCount += 1;
    this.props.status = 'FAILED';
    this.props.failedAt = at;
    this.props.errorMessage = error;
    this.props.updatedAt = at;

    const executionOrError = JobExecution.create({
      jobId: this.props.jobId.value,
      status: 'FAILURE',
      durationMs,
      errorDetails: error,
      executedAt: at,
    });
    if (executionOrError.isSuccess) {
      this.props.executions.push(executionOrError.value);
    }

    this.addDomainEvent(
      new BackgroundJobFailedEvent(
        this.props.jobId.value,
        this.props.jobType,
        error,
        this.props.retryCount,
      ),
    );

    return Result.ok();
  }

  public canRetry(): boolean {
    return this.props.retryCount < this.props.maxRetries;
  }

  public static create(
    jobType: string,
    payload: Record<string, unknown>,
    options?: { priority?: number; maxRetries?: number; scheduledAt?: Date },
    id?: UniqueId,
  ): Result<BackgroundJob> {
    if (!jobType || !jobType.trim()) {
      return Result.fail<BackgroundJob>('Job type is required');
    }

    const now = new Date();
    const jobId = JobId.create(id?.value);
    const scheduledAt = options?.scheduledAt ?? now;

    const job = new BackgroundJob(
      {
        jobId,
        jobType: jobType.trim(),
        payload,
        status: 'SCHEDULED',
        priority: options?.priority ?? 0,
        retryCount: 0,
        maxRetries: options?.maxRetries ?? 3,
        scheduledAt,
        executions: [],
        createdAt: now,
        updatedAt: now,
      },
      id,
    );

    job.addDomainEvent(new BackgroundJobScheduledEvent(jobId.value, job.jobType, scheduledAt));

    return Result.ok<BackgroundJob>(job);
  }
}

/**
 * Enterprise Platform Bounded Context — Domain Events
 */

import { DomainEvent } from '@rios/shared';

export class NotificationQueuedEvent extends DomainEvent {
  public readonly eventType = 'NotificationQueuedEvent';

  constructor(
    public readonly notificationId: string,
    public readonly recipientId: string,
    public readonly type: string,
    public readonly channel: string,
  ) {
    super(notificationId);
  }
}

export class NotificationSentEvent extends DomainEvent {
  public readonly eventType = 'NotificationSentEvent';

  constructor(
    public readonly notificationId: string,
    public readonly recipientId: string,
    public readonly sentAt: Date,
  ) {
    super(notificationId);
  }
}

export class WebhookTriggeredEvent extends DomainEvent {
  public readonly eventType = 'WebhookTriggeredEvent';

  constructor(
    public readonly webhookId: string,
    public readonly eventTypeTriggered: string,
    public readonly payload: Record<string, unknown>,
  ) {
    super(webhookId);
  }
}

export class AuditLoggedEvent extends DomainEvent {
  public readonly eventType = 'AuditLoggedEvent';

  constructor(
    public readonly auditId: string,
    public readonly userId: string | undefined,
    public readonly action: string,
  ) {
    super(auditId);
  }
}

export class BackgroundJobScheduledEvent extends DomainEvent {
  public readonly eventType = 'BackgroundJobScheduledEvent';

  constructor(
    public readonly jobId: string,
    public readonly jobType: string,
    public readonly scheduledAt: Date,
  ) {
    super(jobId);
  }
}

export class BackgroundJobCompletedEvent extends DomainEvent {
  public readonly eventType = 'BackgroundJobCompletedEvent';

  constructor(
    public readonly jobId: string,
    public readonly jobType: string,
    public readonly completedAt: Date,
    public readonly durationMs: number,
  ) {
    super(jobId);
  }
}

export class BackgroundJobFailedEvent extends DomainEvent {
  public readonly eventType = 'BackgroundJobFailedEvent';

  constructor(
    public readonly jobId: string,
    public readonly jobType: string,
    public readonly error: string,
    public readonly retryCount: number,
  ) {
    super(jobId);
  }
}

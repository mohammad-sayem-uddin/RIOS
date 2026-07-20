/**
 * Research Intelligence Domain Events (Sprint 11)
 */

import { DomainEvent } from '@rios/shared';

export class TimelineUpdatedEvent extends DomainEvent {
  public override readonly eventType = 'TimelineUpdatedEvent';

  constructor(
    public readonly timelineId: string,
    public readonly profileId: string,
    public readonly eventDate: Date,
  ) {
    super(timelineId);
  }
}

export class CollaborationCreatedEvent extends DomainEvent {
  public override readonly eventType = 'CollaborationCreatedEvent';

  constructor(
    public readonly collaborationId: string,
    public readonly profileId: string,
    public readonly collaboratorName: string,
    public readonly strength: string,
  ) {
    super(collaborationId);
  }
}

export class CollaborationRemovedEvent extends DomainEvent {
  public override readonly eventType = 'CollaborationRemovedEvent';

  constructor(
    public readonly collaborationId: string,
    public readonly profileId: string,
  ) {
    super(collaborationId);
  }
}

export class AnalyticsCalculatedEvent extends DomainEvent {
  public override readonly eventType = 'AnalyticsCalculatedEvent';

  constructor(
    public readonly analyticsId: string,
    public readonly profileId: string,
    public readonly hIndex: number,
    public readonly citationCount: number,
  ) {
    super(analyticsId);
  }
}

export class ResearchImpactUpdatedEvent extends DomainEvent {
  public override readonly eventType = 'ResearchImpactUpdatedEvent';

  constructor(
    public readonly analyticsId: string,
    public readonly profileId: string,
    public readonly impactScore: number,
  ) {
    super(analyticsId);
  }
}

export class InstitutionAddedEvent extends DomainEvent {
  public override readonly eventType = 'InstitutionAddedEvent';

  constructor(
    public readonly timelineId: string,
    public readonly institutionId: string,
    public readonly institutionName: string,
    public readonly startDate: Date,
  ) {
    super(timelineId);
  }
}

export class TimelineEventAddedEvent extends DomainEvent {
  public override readonly eventType = 'TimelineEventAddedEvent';

  constructor(
    public readonly timelineId: string,
    public readonly profileId: string,
    public readonly data: {
      readonly eventId: string;
      readonly eventType: string;
      readonly title: string;
      readonly eventDate: string;
    },
  ) {
    super(timelineId);
  }
}

export class CareerMilestoneAddedEvent extends DomainEvent {
  public override readonly eventType = 'CareerMilestoneAddedEvent';

  constructor(
    public readonly timelineId: string,
    public readonly profileId: string,
    public readonly data: {
      readonly milestoneId: string;
      readonly milestoneType: string;
      readonly title: string;
      readonly eventDate: string;
    },
  ) {
    super(timelineId);
  }
}

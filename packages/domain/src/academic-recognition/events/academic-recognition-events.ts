/**
 * Academic Recognition Domain Events
 */

import { DomainEvent } from '@rios/shared';

export class AwardReceivedEvent extends DomainEvent {
  public readonly eventType = 'AwardReceivedEvent';

  constructor(
    public readonly awardId: string,
    public readonly profileId: string,
    public readonly title: string,
    public readonly category: string,
  ) {
    super(awardId);
  }
}

export class GrantAwardedEvent extends DomainEvent {
  public readonly eventType = 'GrantAwardedEvent';

  constructor(
    public readonly grantId: string,
    public readonly profileId: string,
    public readonly grantNumber: string,
    public readonly amount: number,
    public readonly currency: string,
  ) {
    super(grantId);
  }
}

export class GrantCompletedEvent extends DomainEvent {
  public readonly eventType = 'GrantCompletedEvent';

  constructor(
    public readonly grantId: string,
    public readonly completedAt: Date,
  ) {
    super(grantId);
  }
}

export class PatentFiledEvent extends DomainEvent {
  public readonly eventType = 'PatentFiledEvent';

  constructor(
    public readonly patentId: string,
    public readonly profileId: string,
    public readonly patentNumber: string,
    public readonly title: string,
  ) {
    super(patentId);
  }
}

export class PatentGrantedEvent extends DomainEvent {
  public readonly eventType = 'PatentGrantedEvent';

  constructor(
    public readonly patentId: string,
    public readonly patentNumber: string,
    public readonly grantDate: Date,
  ) {
    super(patentId);
  }
}

export class ProfessionalMembershipAddedEvent extends DomainEvent {
  public readonly eventType = 'ProfessionalMembershipAddedEvent';

  constructor(
    public readonly activityId: string,
    public readonly profileId: string,
    public readonly organization: string,
    public readonly role: string,
  ) {
    super(activityId);
  }
}

export class EditorialRoleAcceptedEvent extends DomainEvent {
  public readonly eventType = 'EditorialRoleAcceptedEvent';

  constructor(
    public readonly activityId: string,
    public readonly profileId: string,
    public readonly journalOrOrganization: string,
    public readonly role: string,
  ) {
    super(activityId);
  }
}

export class ReviewerAssignmentAcceptedEvent extends DomainEvent {
  public readonly eventType = 'ReviewerAssignmentAcceptedEvent';

  constructor(
    public readonly activityId: string,
    public readonly profileId: string,
    public readonly venueOrJournal: string,
  ) {
    super(activityId);
  }
}

export class ConferenceParticipationAddedEvent extends DomainEvent {
  public readonly eventType = 'ConferenceParticipationAddedEvent';

  constructor(
    public readonly activityId: string,
    public readonly profileId: string,
    public readonly conferenceName: string,
    public readonly role: string,
  ) {
    super(activityId);
  }
}

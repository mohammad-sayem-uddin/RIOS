/**
 * Publications & Research Projects Domain Events
 */

import { DomainEvent } from '@rios/shared';

export class PublicationCreated extends DomainEvent {
  public readonly eventType = 'PublicationCreated';

  constructor(
    public readonly publicationId: string,
    public readonly profileId: string,
    public readonly title: string,
    public readonly publicationType: string,
  ) {
    super(publicationId);
  }
}

export class PublicationUpdated extends DomainEvent {
  public readonly eventType = 'PublicationUpdated';

  constructor(
    public readonly publicationId: string,
    public readonly title: string,
  ) {
    super(publicationId);
  }
}

export class PublicationPublished extends DomainEvent {
  public readonly eventType = 'PublicationPublished';

  constructor(
    public readonly publicationId: string,
    public readonly publishedDate: Date,
  ) {
    super(publicationId);
  }
}

export class PublicationSubmitted extends DomainEvent {
  public readonly eventType = 'PublicationSubmitted';

  constructor(
    public readonly publicationId: string,
    public readonly submittedDate: Date,
  ) {
    super(publicationId);
  }
}

export class ProjectCreated extends DomainEvent {
  public readonly eventType = 'ProjectCreated';

  constructor(
    public readonly projectId: string,
    public readonly profileId: string,
    public readonly title: string,
  ) {
    super(projectId);
  }
}

export class ProjectCompleted extends DomainEvent {
  public readonly eventType = 'ProjectCompleted';

  constructor(
    public readonly projectId: string,
    public readonly endDate: Date,
  ) {
    super(projectId);
  }
}

export class ProjectMemberAdded extends DomainEvent {
  public readonly eventType = 'ProjectMemberAdded';

  constructor(
    public readonly projectId: string,
    public readonly memberId: string,
    public readonly role: string,
  ) {
    super(projectId);
  }
}

export class ProjectMemberRemoved extends DomainEvent {
  public readonly eventType = 'ProjectMemberRemoved';

  constructor(
    public readonly projectId: string,
    public readonly memberId: string,
  ) {
    super(projectId);
  }
}

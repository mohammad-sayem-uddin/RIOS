/**
 * Discovery & Search Bounded Context — Domain Events
 */

import { DomainEvent } from '@rios/shared';

export class ProfilePublishedEvent extends DomainEvent {
  public readonly eventType = 'ProfilePublishedEvent';

  constructor(
    public readonly profileId: string,
    public readonly userId: string,
    public readonly slug: string,
    public readonly title: string,
  ) {
    super(profileId);
  }
}

export class ProfileVisibilityChangedEvent extends DomainEvent {
  public readonly eventType = 'ProfileVisibilityChangedEvent';

  constructor(
    public readonly profileId: string,
    public readonly previousVisibility: string,
    public readonly newVisibility: string,
  ) {
    super(profileId);
  }
}

export class SearchIndexUpdatedEvent extends DomainEvent {
  public readonly eventType = 'SearchIndexUpdatedEvent';

  constructor(
    public readonly indexId: string,
    public readonly documentCount: number,
    public readonly updatedDocuments: string[],
  ) {
    super(indexId);
  }
}

export class ResearchIndexedEvent extends DomainEvent {
  public readonly eventType = 'ResearchIndexedEvent';

  constructor(
    public readonly documentId: string,
    public readonly documentType: string,
    public readonly entityId: string,
    public readonly title: string,
  ) {
    super(documentId);
  }
}

export class PortfolioCreatedEvent extends DomainEvent {
  public readonly eventType = 'PortfolioCreatedEvent';

  constructor(
    public readonly portfolioId: string,
    public readonly profileId: string,
    public readonly slug: string,
    public readonly title: string,
  ) {
    super(portfolioId);
  }
}

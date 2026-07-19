/**
 * Research Assets Domain Events
 */

import { DomainEvent } from '@rios/shared';

export class DatasetCreatedEvent extends DomainEvent {
  public readonly eventType = 'DatasetCreatedEvent';

  constructor(
    public readonly datasetId: string,
    public readonly profileId: string,
    public readonly title: string,
    public readonly doi?: string,
  ) {
    super(datasetId);
  }
}

export class DatasetPublishedEvent extends DomainEvent {
  public readonly eventType = 'DatasetPublishedEvent';

  constructor(
    public readonly datasetId: string,
    public readonly doi: string,
    public readonly publishedAt: Date,
  ) {
    super(datasetId);
  }
}

export class DatasetVersionReleasedEvent extends DomainEvent {
  public readonly eventType = 'DatasetVersionReleasedEvent';

  constructor(
    public readonly datasetId: string,
    public readonly versionId: string,
    public readonly versionNumber: string,
  ) {
    super(datasetId);
  }
}

export class RepositoryLinkedEvent extends DomainEvent {
  public readonly eventType = 'RepositoryLinkedEvent';

  constructor(
    public readonly repositoryId: string,
    public readonly url: string,
    public readonly softwareArtifactId?: string,
  ) {
    super(repositoryId);
  }
}

export class RepositoryUnlinkedEvent extends DomainEvent {
  public readonly eventType = 'RepositoryUnlinkedEvent';

  constructor(
    public readonly repositoryId: string,
    public readonly softwareArtifactId: string,
  ) {
    super(repositoryId);
  }
}

export class ExperimentCreatedEvent extends DomainEvent {
  public readonly eventType = 'ExperimentCreatedEvent';

  constructor(
    public readonly experimentId: string,
    public readonly title: string,
    public readonly projectId?: string,
    public readonly profileId?: string,
  ) {
    super(experimentId);
  }
}

export class BenchmarkAddedEvent extends DomainEvent {
  public readonly eventType = 'BenchmarkAddedEvent';

  constructor(
    public readonly benchmarkId: string,
    public readonly name: string,
    public readonly experimentId: string,
  ) {
    super(benchmarkId);
  }
}

export class ModelReleasedEvent extends DomainEvent {
  public readonly eventType = 'ModelReleasedEvent';

  constructor(
    public readonly modelId: string,
    public readonly name: string,
    public readonly version: string,
  ) {
    super(modelId);
  }
}

export class ResearchAssetUploadedEvent extends DomainEvent {
  public readonly eventType = 'ResearchAssetUploadedEvent';

  constructor(
    public readonly assetId: string,
    public readonly title: string,
    public readonly category: string,
    public readonly fileUrl: string,
  ) {
    super(assetId);
  }
}

export class ResearchAssetDeletedEvent extends DomainEvent {
  public readonly eventType = 'ResearchAssetDeletedEvent';

  constructor(
    public readonly assetId: string,
    public readonly deletedAt: Date,
  ) {
    super(assetId);
  }
}

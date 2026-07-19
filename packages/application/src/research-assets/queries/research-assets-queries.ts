/**
 * Research Assets CQRS Queries
 */

import { Query } from '@rios/shared';

export class GetDatasetQuery implements Query {
  public readonly queryId: string;
  public readonly timestamp: Date;

  constructor(
    public readonly datasetId: string,
    queryId?: string,
    timestamp?: Date,
  ) {
    this.queryId = queryId ?? crypto.randomUUID();
    this.timestamp = timestamp ?? new Date();
    Object.freeze(this);
  }
}

export class SearchDatasetsQuery implements Query {
  public readonly queryId: string;
  public readonly timestamp: Date;

  constructor(
    public readonly query: string,
    public readonly profileId?: string,
    queryId?: string,
    timestamp?: Date,
  ) {
    this.queryId = queryId ?? crypto.randomUUID();
    this.timestamp = timestamp ?? new Date();
    Object.freeze(this);
  }
}

export class GetRepositoryQuery implements Query {
  public readonly queryId: string;
  public readonly timestamp: Date;

  constructor(
    public readonly repositoryId: string,
    queryId?: string,
    timestamp?: Date,
  ) {
    this.queryId = queryId ?? crypto.randomUUID();
    this.timestamp = timestamp ?? new Date();
    Object.freeze(this);
  }
}

export class SearchRepositoriesQuery implements Query {
  public readonly queryId: string;
  public readonly timestamp: Date;

  constructor(
    public readonly query: string,
    queryId?: string,
    timestamp?: Date,
  ) {
    this.queryId = queryId ?? crypto.randomUUID();
    this.timestamp = timestamp ?? new Date();
    Object.freeze(this);
  }
}

export class GetResearchAssetsQuery implements Query {
  public readonly queryId: string;
  public readonly timestamp: Date;

  constructor(
    public readonly profileId?: string,
    public readonly publicationId?: string,
    public readonly category?: string,
    queryId?: string,
    timestamp?: Date,
  ) {
    this.queryId = queryId ?? crypto.randomUUID();
    this.timestamp = timestamp ?? new Date();
    Object.freeze(this);
  }
}

export class GetExperimentQuery implements Query {
  public readonly queryId: string;
  public readonly timestamp: Date;

  constructor(
    public readonly experimentId: string,
    queryId?: string,
    timestamp?: Date,
  ) {
    this.queryId = queryId ?? crypto.randomUUID();
    this.timestamp = timestamp ?? new Date();
    Object.freeze(this);
  }
}

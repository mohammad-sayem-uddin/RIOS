/**
 * CQRS Queries for Research Intelligence (Sprint 11)
 */

import { Query } from '@rios/shared';

export class GetTimelineQuery implements Query {
  public readonly queryId: string;
  public readonly timestamp: Date;
  public readonly profileId: string;

  constructor(profileId: string, queryId = '', timestamp = new Date()) {
    this.queryId = queryId;
    this.timestamp = timestamp;
    this.profileId = profileId;
    Object.freeze(this);
  }
}

export class GetCollaborationNetworkQuery implements Query {
  public readonly queryId: string;
  public readonly timestamp: Date;
  public readonly profileId: string;

  constructor(profileId: string, queryId = '', timestamp = new Date()) {
    this.queryId = queryId;
    this.timestamp = timestamp;
    this.profileId = profileId;
    Object.freeze(this);
  }
}

export class GetResearchAnalyticsQuery implements Query {
  public readonly queryId: string;
  public readonly timestamp: Date;
  public readonly profileId: string;

  constructor(profileId: string, queryId = '', timestamp = new Date()) {
    this.queryId = queryId;
    this.timestamp = timestamp;
    this.profileId = profileId;
    Object.freeze(this);
  }
}

export class GetCitationStatisticsQuery implements Query {
  public readonly queryId: string;
  public readonly timestamp: Date;
  public readonly profileId: string;

  constructor(profileId: string, queryId = '', timestamp = new Date()) {
    this.queryId = queryId;
    this.timestamp = timestamp;
    this.profileId = profileId;
    Object.freeze(this);
  }
}

export class GetResearchImpactQuery implements Query {
  public readonly queryId: string;
  public readonly timestamp: Date;
  public readonly profileId: string;

  constructor(profileId: string, queryId = '', timestamp = new Date()) {
    this.queryId = queryId;
    this.timestamp = timestamp;
    this.profileId = profileId;
    Object.freeze(this);
  }
}

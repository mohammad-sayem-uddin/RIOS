/**
 * Purpose:
 * Query to find multiple Research Identities matching optional criteria.
 *
 * Architecture reference:
 * Application Layer — CQRS Query Side.
 *
 * Invariants:
 * Immutable. Data only. No business logic.
 */

import { Query } from '@rios/shared';

export class FindResearchIdentitiesQuery implements Query {
  public readonly queryId: string;
  public readonly timestamp: Date;
  public readonly limit: number;
  public readonly offset: number;

  constructor(params: { queryId: string; timestamp: Date; limit: number; offset: number }) {
    this.queryId = params.queryId;
    this.timestamp = params.timestamp;
    this.limit = params.limit;
    this.offset = params.offset;
    Object.freeze(this);
  }
}

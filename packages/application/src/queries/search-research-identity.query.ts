/**
 * Purpose:
 * Query to search Research Identities by text-based criteria.
 *
 * Architecture reference:
 * Application Layer — CQRS Query Side.
 *
 * Invariants:
 * Immutable. Data only. No business logic.
 */

import { Query } from '@rios/shared';

export class SearchResearchIdentityQuery implements Query {
  public readonly queryId: string;
  public readonly timestamp: Date;
  public readonly searchTerm: string;
  public readonly limit: number;
  public readonly offset: number;

  constructor(params: {
    queryId: string;
    timestamp: Date;
    searchTerm: string;
    limit: number;
    offset: number;
  }) {
    this.queryId = params.queryId;
    this.timestamp = params.timestamp;
    this.searchTerm = params.searchTerm;
    this.limit = params.limit;
    this.offset = params.offset;
    Object.freeze(this);
  }
}

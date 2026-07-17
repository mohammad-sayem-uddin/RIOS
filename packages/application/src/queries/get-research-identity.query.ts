/**
 * Purpose:
 * Query to retrieve a single Research Identity by its unique identifier.
 *
 * Architecture reference:
 * Application Layer — CQRS Query Side.
 *
 * Invariants:
 * Immutable. Data only. No business logic.
 */

import { Query } from '@rios/shared';

export class GetResearchIdentityQuery implements Query {
  public readonly queryId: string;
  public readonly timestamp: Date;
  public readonly identityId: string;

  constructor(params: { queryId: string; timestamp: Date; identityId: string }) {
    this.queryId = params.queryId;
    this.timestamp = params.timestamp;
    this.identityId = params.identityId;
    Object.freeze(this);
  }
}

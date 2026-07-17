/**
 * Query — represents a request for data without side effects.
 * CQRS building block.
 */

export interface Query {
  readonly queryId: string;
  readonly timestamp: Date;
}

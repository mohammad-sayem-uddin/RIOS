/**
 * QueryHandler — processes a query and returns a Result.
 * CQRS building block.
 */

import { Result } from '../errors/result.js';

import { Query } from './query.js';

export interface QueryHandler<TQuery extends Query, TResult> {
  handle(query: TQuery): Promise<Result<TResult>>;
}

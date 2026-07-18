/**
 * Infrastructure persistence — public API.
 */
export type {
  UnitOfWork,
  TransactionContext,
  TransactionOptions,
  TransactionIsolationLevelType,
} from './unit-of-work.js';

export { TransactionIsolationLevel } from './unit-of-work.js';

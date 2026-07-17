/**
 * Repository — abstract interface for aggregate persistence.
 * Domain-Driven Design building block.
 */

import { AggregateRoot } from '../primitives/aggregate-root.js';
import { UniqueId } from '../primitives/unique-id.js';

export interface Repository<T extends AggregateRoot<unknown>> {
  findById(id: UniqueId): Promise<T | null>;
  save(aggregate: T): Promise<void>;
  delete(id: UniqueId): Promise<void>;
}

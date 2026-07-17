/**
 * @rios/shared
 *
 * Shared Foundation Layer — DDD building blocks, CQRS primitives, error types, utilities.
 * Every other package depends on this package.
 */

// Primitives
export { ValueObject } from './primitives/value-object.js';
export { Entity } from './primitives/entity.js';
export { UniqueId } from './primitives/unique-id.js';
export { AggregateRoot } from './primitives/aggregate-root.js';

// Errors
export { Result } from './errors/result.js';
export type { Either } from './errors/either.js';
export { Left, Right, left, right } from './errors/either.js';
export { DomainError } from './errors/domain-error.js';
export { ApplicationError } from './errors/application-error.js';
export { InfrastructureError } from './errors/infrastructure-error.js';

// Events
export { DomainEvent } from './events/domain-event.js';
export type { EventMetadata } from './events/event-metadata.js';

// CQRS
export type { Command } from './cqrs/command.js';
export type { Query } from './cqrs/query.js';
export type { CommandHandler } from './cqrs/command-handler.js';
export type { QueryHandler } from './cqrs/query-handler.js';

// Repository
export type { Repository } from './repository/repository.js';

// Utilities
export type { Clock } from './utils/clock.js';
export { SystemClock, FixedClock } from './utils/clock.js';

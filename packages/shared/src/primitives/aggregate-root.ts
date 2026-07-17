/**
 * Aggregate Root — entry point for transactional consistency boundary.
 * Collects domain events during mutation; dispatches after persistence.
 * Domain-Driven Design building block.
 */

import { DomainEvent } from '../events/domain-event.js';

import { Entity } from './entity.js';
import { UniqueId } from './unique-id.js';

export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: DomainEvent[] = [];

  constructor(props: T, id?: UniqueId) {
    super(props, id);
  }

  public get domainEvents(): ReadonlyArray<DomainEvent> {
    return [...this._domainEvents];
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  public clearEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
}

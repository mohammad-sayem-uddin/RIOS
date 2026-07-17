/**
 * Entity — compared by identity (ID), mutable, tracked in aggregates.
 * Domain-Driven Design building block.
 */

import { UniqueId } from './unique-id.js';

export abstract class Entity<T> {
  protected readonly _id: UniqueId;
  protected props: T;

  constructor(props: T, id?: UniqueId) {
    this._id = id ?? UniqueId.create();
    this.props = props;
  }

  public get id(): UniqueId {
    return this._id;
  }

  public equals(other: Entity<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (this === other) {
      return true;
    }
    return this._id.equals(other._id);
  }
}

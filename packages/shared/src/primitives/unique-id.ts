/**
 * UniqueId — branded UUID value object for entity identification.
 * Domain-Driven Design building block.
 */

import { randomUUID } from 'node:crypto';

import { ValueObject } from './value-object.js';

interface UniqueIdProps {
  value: string;
}

export class UniqueId extends ValueObject<UniqueIdProps> {
  private constructor(props: UniqueIdProps) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  /**
   * Create a new UniqueId with a random UUID v4.
   */
  public static create(id?: string): UniqueId {
    return new UniqueId({ value: id ?? randomUUID() });
  }

  /**
   * Create a UniqueId from an existing string value.
   */
  public static from(id: string): UniqueId {
    return new UniqueId({ value: id });
  }

  public override toString(): string {
    return this.props.value;
  }
}

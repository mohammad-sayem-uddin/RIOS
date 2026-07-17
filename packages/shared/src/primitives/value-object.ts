/**
 * Value Object — immutable, compared by structural equality.
 * Domain-Driven Design building block.
 */

export abstract class ValueObject<T> {
  protected readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (other.constructor.name !== this.constructor.name) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }
}

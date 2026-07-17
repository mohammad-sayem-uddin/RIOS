/**
 * Either monad — represents a value that can be one of two types.
 * Left = failure, Right = success.
 */

export class Left<L> {
  public readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  public isLeft(): this is Left<L> {
    return true;
  }

  public isRight(): this is Right<never> {
    return false;
  }
}

export class Right<R> {
  public readonly value: R;

  constructor(value: R) {
    this.value = value;
  }

  public isLeft(): this is Left<never> {
    return false;
  }

  public isRight(): this is Right<R> {
    return true;
  }
}

export type Either<L, R> = Left<L> | Right<R>;

export const left = <L>(value: L): Either<L, never> => new Left(value);
export const right = <R>(value: R): Either<never, R> => new Right(value);

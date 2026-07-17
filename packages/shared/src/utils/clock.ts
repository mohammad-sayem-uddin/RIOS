/**
 * Clock — abstraction over time for testability.
 * Production code uses system clock; tests can inject a fixed clock.
 */

export interface Clock {
  now(): Date;
  timestamp(): number;
}

export class SystemClock implements Clock {
  public now(): Date {
    return new Date();
  }

  public timestamp(): number {
    return Date.now();
  }
}

export class FixedClock implements Clock {
  private readonly fixedDate: Date;

  constructor(fixedDate: Date) {
    this.fixedDate = new Date(fixedDate.getTime());
  }

  public now(): Date {
    return new Date(this.fixedDate.getTime());
  }

  public timestamp(): number {
    return this.fixedDate.getTime();
  }
}

/**
 * System Clock
 *
 * Implements System Clock for time abstraction across security operations.
 * Architecture Reference: Volume I – Identity / Chapter 6 §68
 */

import { Clock } from '@rios/shared';

export class IdentitySystemClock implements Clock {
  public now(): Date {
    return new Date();
  }

  public timestamp(): number {
    return Date.now();
  }
}

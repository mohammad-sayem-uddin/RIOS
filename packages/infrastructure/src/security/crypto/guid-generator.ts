/**
 * Guid Generator
 *
 * Provides identifier generation using random UUID v4.
 * Architecture Reference: Volume I – Identity / Chapter 6 §69
 */

import { randomUUID } from 'node:crypto';

export interface IGuidGenerator {
  generate(): string;
}

export class GuidGenerator implements IGuidGenerator {
  public generate(): string {
    return randomUUID();
  }
}

/**
 * Secure Random Generator
 *
 * Provides cryptographically secure random values using Node crypto.
 * Architecture Reference: Volume I – Identity / Chapter 6 §70
 */

import { randomBytes } from 'node:crypto';

export interface ISecureRandomGenerator {
  generateRandomHex(byteLength?: number): string;
  generateRandomBase64(byteLength?: number): string;
}

export class SecureRandomGenerator implements ISecureRandomGenerator {
  public generateRandomHex(byteLength = 32): string {
    return randomBytes(byteLength).toString('hex');
  }

  public generateRandomBase64(byteLength = 32): string {
    return randomBytes(byteLength).toString('base64url');
  }
}

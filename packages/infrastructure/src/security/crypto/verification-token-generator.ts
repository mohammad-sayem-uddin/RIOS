/**
 * Verification Token Generator
 *
 * Generates cryptographically-random single-use tokens for email-verification
 * and password-reset flows. Only the SHA-256 hash is ever persisted.
 */

import { createHash, randomBytes } from 'node:crypto';

import type { GeneratedToken, IVerificationTokenGenerator } from '@rios/domain';

export class VerificationTokenGenerator implements IVerificationTokenGenerator {
  generate(): GeneratedToken {
    const rawToken = randomBytes(32).toString('hex');
    return { rawToken, tokenHash: this.hash(rawToken) };
  }

  hash(rawToken: string): string {
    return createHash('sha256').update(rawToken.trim()).digest('hex');
  }
}

/**
 * Console Account Email Notifier
 *
 * Development/test implementation of IAccountEmailNotifier.
 * Logs verification and reset links to stdout instead of dispatching real email.
 * Replace with an SMTP/SES implementation for production.
 */

import type { IAccountEmailNotifier } from '@rios/domain';
import { Result } from '@rios/shared';

export class ConsoleAccountEmailNotifier implements IAccountEmailNotifier {
  private readonly frontendOrigin: string;

  constructor(frontendOrigin = 'http://localhost:3001') {
    this.frontendOrigin = frontendOrigin;
  }

  async sendEmailVerification(toEmail: string, rawToken: string): Promise<Result<void>> {
    const link = `${this.frontendOrigin}/verify-email?token=${encodeURIComponent(rawToken)}`;
    console.log(`[EMAIL] Verification link for ${toEmail}: ${link}`);
    await Promise.resolve();
    return Result.ok(undefined);
  }

  async sendPasswordReset(toEmail: string, rawToken: string): Promise<Result<void>> {
    const link = `${this.frontendOrigin}/reset-password?token=${encodeURIComponent(rawToken)}`;
    console.log(`[EMAIL] Password reset link for ${toEmail}: ${link}`);
    await Promise.resolve();
    return Result.ok(undefined);
  }
}

/**
 * Password Hasher Implementation
 *
 * Implements IPasswordHasher using salted PBKDF2 with HMAC-SHA512 & constant-time comparison.
 * Architecture Reference: Volume I – Identity / Chapter 6 §62
 */

import { pbkdf2, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

import { IPasswordHasher, PasswordHash } from '@rios/domain';
import { Result } from '@rios/shared';

const pbkdf2Async = promisify(pbkdf2);

export class BCryptPasswordHasher implements IPasswordHasher {
  private readonly iterations = 100000;
  private readonly keyLength = 64;
  private readonly digest = 'sha512';

  public async hash(plainTextPassword: string): Promise<Result<PasswordHash>> {
    try {
      if (plainTextPassword.trim().length === 0) {
        return Result.fail('Password cannot be empty');
      }

      const salt = randomBytes(16).toString('hex');
      const derivedKey = await pbkdf2Async(
        plainTextPassword,
        salt,
        this.iterations,
        this.keyLength,
        this.digest,
      );
      const hashStr = `$rios$pbkdf2$${this.iterations}$${salt}$${derivedKey.toString('hex')}`;

      const passwordHashRes = PasswordHash.create(hashStr);
      if (passwordHashRes.isFailure) {
        return Result.fail(passwordHashRes.error);
      }

      return Result.ok(passwordHashRes.value);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return Result.fail(`Password hashing failed: ${message}`);
    }
  }

  public async verify(plainTextPassword: string, hash: PasswordHash): Promise<Result<boolean>> {
    try {
      if (plainTextPassword.trim() === '' || hash.value.trim() === '') {
        return Result.ok(false);
      }

      const parts = hash.value.split('$');
      // Format: ["", "rios", "pbkdf2", iterations, salt, key]
      if (parts.length !== 6 || parts[2] !== 'pbkdf2') {
        return Result.ok(false);
      }

      const iterationsStr = parts[3];
      const salt = parts[4];
      const storedKeyHex = parts[5];

      if (
        iterationsStr === undefined ||
        iterationsStr.trim() === '' ||
        salt === undefined ||
        salt.trim() === '' ||
        storedKeyHex === undefined ||
        storedKeyHex.trim() === ''
      ) {
        return Result.ok(false);
      }

      const iterations = Number.parseInt(iterationsStr, 10);
      const derivedKey = await pbkdf2Async(
        plainTextPassword,
        salt,
        iterations,
        this.keyLength,
        this.digest,
      );
      const storedKey = Buffer.from(storedKeyHex, 'hex');

      if (derivedKey.length !== storedKey.length) {
        return Result.ok(false);
      }

      const isMatch = timingSafeEqual(derivedKey, storedKey);
      return Result.ok(isMatch);
    } catch {
      return Result.ok(false);
    }
  }
}

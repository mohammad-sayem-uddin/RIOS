/**
 * Identity Value Objects
 *
 * Immutable, self-validating value objects for the Identity Bounded Context.
 * Architecture Reference: Volume I – Identity / Chapter 4 §35
 */

import { Result, UniqueId, ValueObject } from '@rios/shared';

// ─── Identity Typed IDs ──────────────────────────────────────────────────

export class UserId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): UserId {
    return new UserId(id ?? UniqueId.create().value);
  }

  public static from(id: string): UserId {
    return new UserId(id);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class RoleId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): RoleId {
    return new RoleId(id ?? UniqueId.create().value);
  }

  public static from(id: string): RoleId {
    return new RoleId(id);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class PermissionId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): PermissionId {
    return new PermissionId(id ?? UniqueId.create().value);
  }

  public static from(id: string): PermissionId {
    return new PermissionId(id);
  }

  public override toString(): string {
    return this.props.value;
  }
}

export class SessionId extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): SessionId {
    return new SessionId(id ?? UniqueId.create().value);
  }

  public static from(id: string): SessionId {
    return new SessionId(id);
  }

  public override toString(): string {
    return this.props.value;
  }
}

// ─── Email ──────────────────────────────────────────────────────────────

export class Email extends ValueObject<{ value: string }> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(value: string) {
    super({ value: value.toLowerCase().trim() });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(rawEmail: string): Result<Email> {
    if (!rawEmail || rawEmail.trim().length === 0) {
      return Result.fail('Email address is required');
    }

    const normalized = rawEmail.toLowerCase().trim();
    if (!Email.EMAIL_REGEX.test(normalized)) {
      return Result.fail(`Invalid email format: ${rawEmail}`);
    }

    if (normalized.length > 255) {
      return Result.fail('Email length exceeds maximum 255 characters');
    }

    return Result.ok(new Email(normalized));
  }

  public override toString(): string {
    return this.props.value;
  }
}

// ─── PasswordHash ───────────────────────────────────────────────────────

export class PasswordHash extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(hashedValue: string): Result<PasswordHash> {
    if (!hashedValue || hashedValue.trim().length === 0) {
      return Result.fail('Password hash cannot be empty');
    }
    return Result.ok(new PasswordHash(hashedValue));
  }

  public override toString(): string {
    return '[PROTECTED_PASSWORD_HASH]';
  }
}

// ─── RefreshToken ───────────────────────────────────────────────────────

export class RefreshToken extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(token: string): Result<RefreshToken> {
    if (!token || token.trim().length === 0) {
      return Result.fail('Refresh token cannot be empty');
    }
    return Result.ok(new RefreshToken(token));
  }

  public override toString(): string {
    return '[PROTECTED_REFRESH_TOKEN]';
  }
}

// ─── AccessToken ────────────────────────────────────────────────────────

export class AccessToken extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(token: string): Result<AccessToken> {
    if (!token || token.trim().length === 0) {
      return Result.fail('Access token cannot be empty');
    }
    return Result.ok(new AccessToken(token));
  }

  public override toString(): string {
    return '[PROTECTED_ACCESS_TOKEN]';
  }
}

/**
 * Verification Token Entity
 *
 * Domain entity representing a single-use, expiring security token used by the
 * email-verification and password-reset flows. Only the SHA-256 hash of the raw
 * token is ever persisted; the raw value lives only in the email link.
 *
 * Architecture Reference: Volume I – Identity / Chapter 6 (Credential Recovery).
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { UserId } from '../value-objects/identity-value-objects.js';

export interface VerificationTokenProps {
  userId: UserId;
  tokenHash: string;
  expiresAt: Date;
  consumedAt: Date | null;
  createdAt: Date;
}

export class VerificationToken extends Entity<VerificationTokenProps> {
  private constructor(props: VerificationTokenProps, id: UniqueId) {
    super(props, id);
  }

  public get tokenId(): string {
    return this._id.value;
  }

  public get userId(): UserId {
    return this.props.userId;
  }

  public get tokenHash(): string {
    return this.props.tokenHash;
  }

  public get expiresAt(): Date {
    return this.props.expiresAt;
  }

  public get consumedAt(): Date | null {
    return this.props.consumedAt;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public isExpired(now: Date = new Date()): boolean {
    return now.getTime() >= this.props.expiresAt.getTime();
  }

  public isConsumed(): boolean {
    return this.props.consumedAt !== null;
  }

  /** A token is usable exactly once and only before it expires. */
  public isUsable(now: Date = new Date()): boolean {
    return !this.isConsumed() && !this.isExpired(now);
  }

  public consume(now: Date = new Date()): Result<void> {
    if (this.props.consumedAt !== null) {
      return Result.fail('Token has already been consumed');
    }
    this.props.consumedAt = now;
    return Result.ok(undefined);
  }

  public static create(
    props: {
      userId: UserId;
      tokenHash: string;
      expiresAt: Date;
      consumedAt?: Date | null;
      createdAt?: Date;
    },
    id?: string,
  ): Result<VerificationToken> {
    if (props.userId === undefined || props.userId === null) {
      return Result.fail('UserId is required for a verification token');
    }
    if (!props.tokenHash || props.tokenHash.trim().length === 0) {
      return Result.fail('Token hash is required');
    }
    if (props.expiresAt === undefined || props.expiresAt === null) {
      return Result.fail('Token expiration is required');
    }

    const token = new VerificationToken(
      {
        userId: props.userId,
        tokenHash: props.tokenHash.trim(),
        expiresAt: props.expiresAt,
        consumedAt: props.consumedAt ?? null,
        createdAt: props.createdAt ?? new Date(),
      },
      id !== undefined && id !== '' ? UniqueId.from(id) : UniqueId.create(),
    );

    return Result.ok(token);
  }
}

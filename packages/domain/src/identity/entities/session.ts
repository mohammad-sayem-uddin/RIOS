/**
 * Session Entity
 *
 * Domain Entity representing an authenticated user interaction/session.
 * Architecture Reference: Volume I – Identity / Chapter 4 §33
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { SessionId, UserId } from '../value-objects/identity-value-objects.js';

export interface SessionProps {
  userId: UserId;
  createdAt: Date;
  expiresAt: Date;
  lastActivityAt: Date;
  revoked: boolean;
  revokedAt: Date | null;
  ipAddress?: string;
  userAgent?: string;
}

export class Session extends Entity<SessionProps> {
  private constructor(props: SessionProps, id: UniqueId) {
    super(props, id);
  }

  public get sessionId(): SessionId {
    return SessionId.from(this._id.value);
  }

  public get userId(): UserId {
    return this.props.userId;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get expiresAt(): Date {
    return this.props.expiresAt;
  }

  public get lastActivityAt(): Date {
    return this.props.lastActivityAt;
  }

  public get isRevoked(): boolean {
    return this.props.revoked;
  }

  public get revokedAt(): Date | null {
    return this.props.revokedAt;
  }

  public get ipAddress(): string | undefined {
    return this.props.ipAddress;
  }

  public get userAgent(): string | undefined {
    return this.props.userAgent;
  }

  public isExpired(now: Date = new Date()): boolean {
    return now.getTime() >= this.props.expiresAt.getTime();
  }

  public isActive(now: Date = new Date()): boolean {
    return !this.props.revoked && !this.isExpired(now);
  }

  public revoke(now: Date = new Date()): Result<void> {
    if (this.props.revoked) {
      return Result.ok(undefined); // Idempotent
    }
    this.props.revoked = true;
    this.props.revokedAt = now;
    return Result.ok(undefined);
  }

  public touch(now: Date = new Date()): Result<void> {
    if (!this.isActive(now)) {
      return Result.fail('Cannot update activity on inactive or revoked session');
    }
    this.props.lastActivityAt = now;
    return Result.ok(undefined);
  }

  public static create(
    props: {
      userId: UserId;
      createdAt?: Date;
      expiresAt: Date;
      lastActivityAt?: Date;
      revoked?: boolean;
      revokedAt?: Date | null;
      ipAddress?: string;
      userAgent?: string;
    },
    id?: string,
  ): Result<Session> {
    if (props.userId === undefined || props.userId === null) {
      return Result.fail('UserId is required to create a Session');
    }
    if (props.expiresAt === undefined || props.expiresAt === null) {
      return Result.fail('Expiration date is required for Session');
    }

    const now = props.createdAt ?? new Date();
    const session = new Session(
      {
        userId: props.userId,
        createdAt: now,
        expiresAt: props.expiresAt,
        lastActivityAt: props.lastActivityAt ?? now,
        revoked: props.revoked === true,
        revokedAt: props.revokedAt ?? null,
        ipAddress: props.ipAddress,
        userAgent: props.userAgent,
      },
      id !== undefined && id !== '' ? UniqueId.from(id) : UniqueId.create(),
    );

    return Result.ok(session);
  }
}

/**
 * Refresh Token Record Entity
 *
 * Domain entity representing persisted refresh token state.
 * Stores hashed token material and rotation/revocation lifecycle metadata.
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { SessionId, UserId } from '../value-objects/identity-value-objects.js';

export interface RefreshTokenRecordProps {
  userId: UserId;
  sessionId: SessionId;
  tokenHash: string;
  createdAt: Date;
  expiresAt: Date;
  revoked: boolean;
  revokedAt: Date | null;
  replacedByTokenId: string | null;
}

export class RefreshTokenRecord extends Entity<RefreshTokenRecordProps> {
  private constructor(props: RefreshTokenRecordProps, id: UniqueId) {
    super(props, id);
  }

  public get refreshTokenId(): string {
    return this._id.value;
  }

  public get userId(): UserId {
    return this.props.userId;
  }

  public get sessionId(): SessionId {
    return this.props.sessionId;
  }

  public get tokenHash(): string {
    return this.props.tokenHash;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get expiresAt(): Date {
    return this.props.expiresAt;
  }

  public get isRevoked(): boolean {
    return this.props.revoked;
  }

  public get revokedAt(): Date | null {
    return this.props.revokedAt;
  }

  public get replacedByTokenId(): string | null {
    return this.props.replacedByTokenId;
  }

  public isExpired(now: Date = new Date()): boolean {
    return now.getTime() >= this.props.expiresAt.getTime();
  }

  public isActive(now: Date = new Date()): boolean {
    return !this.props.revoked && !this.isExpired(now);
  }

  public revoke(now: Date = new Date()): Result<void> {
    if (this.props.revoked) {
      return Result.ok(undefined);
    }

    this.props.revoked = true;
    this.props.revokedAt = now;
    return Result.ok(undefined);
  }

  public markRotated(replacedByTokenId: string): Result<void> {
    if (!replacedByTokenId || replacedByTokenId.trim().length === 0) {
      return Result.fail('Replacement refresh token id is required');
    }

    this.props.replacedByTokenId = replacedByTokenId;
    return Result.ok(undefined);
  }

  public static create(
    props: {
      userId: UserId;
      sessionId: SessionId;
      tokenHash: string;
      expiresAt: Date;
      createdAt?: Date;
      revoked?: boolean;
      revokedAt?: Date | null;
      replacedByTokenId?: string | null;
    },
    id?: string,
  ): Result<RefreshTokenRecord> {
    if (props.userId === undefined || props.userId === null) {
      return Result.fail('UserId is required');
    }

    if (props.sessionId === undefined || props.sessionId === null) {
      return Result.fail('SessionId is required');
    }

    if (!props.tokenHash || props.tokenHash.trim().length === 0) {
      return Result.fail('Refresh token hash is required');
    }

    if (props.expiresAt === undefined || props.expiresAt === null) {
      return Result.fail('Refresh token expiration is required');
    }

    const createdAt = props.createdAt ?? new Date();
    if (props.expiresAt.getTime() <= createdAt.getTime()) {
      return Result.fail('Refresh token expiration must be in the future');
    }

    const token = new RefreshTokenRecord(
      {
        userId: props.userId,
        sessionId: props.sessionId,
        tokenHash: props.tokenHash.trim(),
        createdAt,
        expiresAt: props.expiresAt,
        revoked: props.revoked ?? false,
        revokedAt: props.revokedAt ?? null,
        replacedByTokenId: props.replacedByTokenId ?? null,
      },
      id !== undefined && id !== '' ? UniqueId.from(id) : UniqueId.create(),
    );

    return Result.ok(token);
  }
}

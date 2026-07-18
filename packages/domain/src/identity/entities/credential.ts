/**
 * Credential Entity
 *
 * Domain Entity encapsulating user authentication credentials.
 * Architecture Reference: Volume I – Identity / Chapter 4 §34
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { PasswordHash } from '../value-objects/identity-value-objects.js';

export interface CredentialProps {
  passwordHash: PasswordHash;
  updatedAt: Date;
  passwordHistory?: PasswordHash[];
}

export class Credential extends Entity<CredentialProps> {
  private constructor(props: CredentialProps, id: UniqueId) {
    super(props, id);
  }

  public get passwordHash(): PasswordHash {
    return this.props.passwordHash;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public get passwordHistory(): readonly PasswordHash[] {
    return this.props.passwordHistory || [];
  }

  public updatePassword(newHash: PasswordHash, now: Date = new Date()): Result<void> {
    if (!this.props.passwordHistory) {
      this.props.passwordHistory = [];
    }
    this.props.passwordHistory.push(this.props.passwordHash);
    this.props.passwordHash = newHash;
    this.props.updatedAt = now;
    return Result.ok(undefined);
  }

  public static create(
    props: { passwordHash: PasswordHash; updatedAt?: Date; passwordHistory?: PasswordHash[] },
    id?: string,
  ): Result<Credential> {
    if (props.passwordHash === undefined || props.passwordHash === null) {
      return Result.fail('PasswordHash is required');
    }

    const credential = new Credential(
      {
        passwordHash: props.passwordHash,
        updatedAt: props.updatedAt ?? new Date(),
        passwordHistory: props.passwordHistory ?? [],
      },
      id !== undefined && id !== '' ? UniqueId.from(id) : UniqueId.create(),
    );

    return Result.ok(credential);
  }
}

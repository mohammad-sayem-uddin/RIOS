/**
 * User Aggregate Root
 *
 * Aggregate Root for the Identity Bounded Context.
 * Enforces security & account invariants.
 * Architecture Reference: Volume I – Identity / Chapter 4 §30
 */

import { AggregateRoot, Result, UniqueId } from '@rios/shared';

import { Credential } from '../entities/credential.js';
import { Role } from '../entities/role.js';
import {
  EmailVerified,
  PasswordChanged,
  RoleAssigned,
  RoleRemoved,
  UserActivated,
  UserDeactivated,
} from '../events/identity-events.js';
import { Email, PasswordHash, UserId } from '../value-objects/identity-value-objects.js';

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DISABLED: 'DISABLED',
  LOCKED: 'LOCKED',
} as const;

export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];

export interface UserProps {
  email: Email;
  credential: Credential;
  roles: Role[];
  status: UserStatusType;
  displayName: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id: UniqueId) {
    super(props, id);
  }

  public get userId(): UserId {
    return UserId.from(this._id.value);
  }

  public get email(): Email {
    return this.props.email;
  }

  public get credential(): Credential {
    return this.props.credential;
  }

  public get roles(): readonly Role[] {
    return this.props.roles;
  }

  public get status(): UserStatusType {
    return this.props.status;
  }

  public get displayName(): string {
    return this.props.displayName;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public get lastLoginAt(): Date | null {
    return this.props.lastLoginAt;
  }

  public get emailVerified(): boolean {
    return this.props.emailVerified;
  }

  public isActive(): boolean {
    return this.props.status === UserStatus.ACTIVE;
  }

  public isEmailVerified(): boolean {
    return this.props.emailVerified;
  }

  /**
   * Marks the account email as verified. Idempotent: re-verifying an
   * already-verified account is a no-op success (replay-safe at the aggregate
   * level; token single-use is additionally enforced by the token store).
   */
  public verifyEmail(now: Date = new Date()): Result<void> {
    if (this.props.emailVerified) {
      return Result.ok(undefined);
    }
    this.props.emailVerified = true;
    this.props.updatedAt = now;
    this.addDomainEvent(new EmailVerified(this.userId.value, this.props.email.value));
    return Result.ok(undefined);
  }

  public canAuthenticate(): boolean {
    return this.isActive();
  }

  public hasRole(roleName: string): boolean {
    const normalized = roleName.trim().toLowerCase();
    return this.props.roles.some((r) => r.name === normalized);
  }

  public hasPermission(permissionName: string): boolean {
    const normalized = permissionName.trim().toLowerCase();
    return this.props.roles.some((role) => role.hasPermission(normalized));
  }

  public getEffectivePermissions(): string[] {
    const permissionsSet = new Set<string>();
    for (const role of this.props.roles) {
      for (const permission of role.permissions) {
        permissionsSet.add(permission.name);
      }
    }
    return Array.from(permissionsSet);
  }

  public assignRole(role: Role, now: Date = new Date()): Result<void> {
    if (this.hasRole(role.name)) {
      return Result.ok(undefined);
    }
    this.props.roles.push(role);
    this.props.updatedAt = now;
    this.addDomainEvent(new RoleAssigned(this.userId.value, role.name));
    return Result.ok(undefined);
  }

  public removeRole(roleName: string, now: Date = new Date()): Result<void> {
    const normalized = roleName.trim().toLowerCase();
    const index = this.props.roles.findIndex((r) => r.name === normalized);
    if (index !== -1) {
      if (this.props.roles.length <= 1) {
        return Result.fail('User must retain at least one role');
      }
      this.props.roles.splice(index, 1);
      this.props.updatedAt = now;
      this.addDomainEvent(new RoleRemoved(this.userId.value, normalized));
    }
    return Result.ok(undefined);
  }

  public activate(now: Date = new Date()): Result<void> {
    if (this.props.status === UserStatus.ACTIVE) {
      return Result.ok(undefined);
    }
    this.props.status = UserStatus.ACTIVE;
    this.props.updatedAt = now;
    this.addDomainEvent(new UserActivated(this.userId.value));
    return Result.ok(undefined);
  }

  public deactivate(reason = 'User requested deactivation', now: Date = new Date()): Result<void> {
    if (this.props.status === UserStatus.DISABLED) {
      return Result.ok(undefined);
    }
    this.props.status = UserStatus.DISABLED;
    this.props.updatedAt = now;
    this.addDomainEvent(new UserDeactivated(this.userId.value, reason));
    return Result.ok(undefined);
  }

  public lock(now: Date = new Date()): Result<void> {
    this.props.status = UserStatus.LOCKED;
    this.props.updatedAt = now;
    return Result.ok(undefined);
  }

  public changePassword(newPasswordHash: PasswordHash, now: Date = new Date()): Result<void> {
    const updateRes = this.props.credential.updatePassword(newPasswordHash, now);
    if (updateRes.isFailure) {
      return updateRes;
    }
    this.props.updatedAt = now;
    this.addDomainEvent(new PasswordChanged(this.userId.value));
    return Result.ok(undefined);
  }

  public recordLogin(now: Date = new Date()): Result<void> {
    if (!this.canAuthenticate()) {
      return Result.fail('Inactive or disabled users cannot authenticate');
    }
    this.props.lastLoginAt = now;
    this.props.updatedAt = now;
    return Result.ok(undefined);
  }

  public static create(
    props: {
      email: Email;
      credential: Credential;
      roles: Role[];
      displayName?: string;
      status?: UserStatusType;
      emailVerified?: boolean;
      createdAt?: Date;
      updatedAt?: Date;
      lastLoginAt?: Date | null;
    },
    id?: string,
  ): Result<User> {
    if (props.email === undefined || props.email === null) {
      return Result.fail('Email is required for User');
    }
    if (props.credential === undefined || props.credential === null) {
      return Result.fail('Credential is required for User');
    }
    if (props.roles === undefined || props.roles === null || props.roles.length === 0) {
      return Result.fail('User must have at least one assigned role');
    }

    const now = props.createdAt ?? new Date();
    const fallbackName = props.email.value.split('@')[0] ?? 'User';
    const displayName =
      props.displayName !== undefined && props.displayName.trim() !== ''
        ? props.displayName
        : fallbackName;
    const user = new User(
      {
        email: props.email,
        credential: props.credential,
        roles: [...props.roles],
        displayName,
        status: props.status ?? UserStatus.ACTIVE,
        emailVerified: props.emailVerified ?? true,
        createdAt: now,
        updatedAt: props.updatedAt ?? now,
        lastLoginAt: props.lastLoginAt ?? null,
      },
      id !== undefined && id !== '' ? UniqueId.from(id) : UniqueId.create(),
    );

    return Result.ok(user);
  }
}

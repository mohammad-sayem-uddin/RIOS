/**
 * Role Entity
 *
 * Aggregate/Entity containing a set of permissions for RBAC.
 * Architecture Reference: Volume I – Identity / Chapter 4 §31
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { RoleId } from '../value-objects/identity-value-objects.js';

import { Permission } from './permission.js';

export interface RoleProps {
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export class Role extends Entity<RoleProps> {
  private constructor(props: RoleProps, id: UniqueId) {
    super(props, id);
  }

  public get roleId(): RoleId {
    return RoleId.from(this._id.value);
  }

  public get name(): string {
    return this.props.name;
  }

  public get description(): string {
    return this.props.description;
  }

  public get permissions(): readonly Permission[] {
    return this.props.permissions;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public hasPermission(permissionName: string): boolean {
    const normalized = permissionName.trim().toLowerCase();
    return this.props.permissions.some((p) => p.name === normalized);
  }

  public addPermission(permission: Permission): Result<void> {
    if (this.hasPermission(permission.name)) {
      return Result.ok(undefined); // Idempotent add
    }
    this.props.permissions.push(permission);
    this.props.updatedAt = new Date();
    return Result.ok(undefined);
  }

  public removePermission(permissionName: string): Result<void> {
    const normalized = permissionName.trim().toLowerCase();
    const index = this.props.permissions.findIndex((p) => p.name === normalized);
    if (index !== -1) {
      this.props.permissions.splice(index, 1);
      this.props.updatedAt = new Date();
    }
    return Result.ok(undefined);
  }

  public static create(
    props: {
      name: string;
      description: string;
      permissions?: Permission[];
      createdAt?: Date;
      updatedAt?: Date;
    },
    id?: string,
  ): Result<Role> {
    if (!props.name || props.name.trim().length === 0) {
      return Result.fail('Role name is required');
    }

    const role = new Role(
      {
        name: props.name.trim().toLowerCase(),
        description: props.description || '',
        permissions: props.permissions || [],
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id !== undefined && id !== '' ? UniqueId.from(id) : UniqueId.create(),
    );

    return Result.ok(role);
  }
}

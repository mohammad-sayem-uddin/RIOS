/**
 * Permission Entity
 *
 * Smallest granular unit of authorization in RIOS.
 * Architecture Reference: Volume I – Identity / Chapter 4 §32
 */

import { Entity, Result, UniqueId } from '@rios/shared';

import { PermissionId } from '../value-objects/identity-value-objects.js';

export interface PermissionProps {
  name: string;
  description: string;
  createdAt: Date;
}

export class Permission extends Entity<PermissionProps> {
  private constructor(props: PermissionProps, id: UniqueId) {
    super(props, id);
  }

  public get permissionId(): PermissionId {
    return PermissionId.from(this._id.value);
  }

  public get name(): string {
    return this.props.name;
  }

  public get description(): string {
    return this.props.description;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public static create(
    props: { name: string; description: string; createdAt?: Date },
    id?: string,
  ): Result<Permission> {
    if (!props.name || props.name.trim().length === 0) {
      return Result.fail('Permission name is required');
    }

    const permission = new Permission(
      {
        name: props.name.trim().toLowerCase(),
        description: props.description || '',
        createdAt: props.createdAt || new Date(),
      },
      id !== undefined && id !== '' ? UniqueId.from(id) : UniqueId.create(),
    );

    return Result.ok(permission);
  }
}

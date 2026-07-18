/**
 * In-Memory Role & Permission Repositories
 *
 * Implements IRoleRepository & IPermissionRepository for RBAC persistence.
 * Architecture Reference: Volume I – Identity / Chapter 6 §65 & Chapter 8
 */

import {
  IPermissionRepository,
  IRoleRepository,
  Permission,
  PermissionId,
  Role,
  RoleId,
} from '@rios/domain';
import { Result } from '@rios/shared';

export class InMemoryPermissionRepository implements IPermissionRepository {
  private readonly permissions: Map<string, Permission> = new Map();

  constructor() {
    this.seedDefaults();
  }

  public findById(id: PermissionId): Promise<Result<Permission | null>> {
    const perm = this.permissions.get(id.value);
    return Promise.resolve(Result.ok(perm ?? null));
  }

  public findByName(name: string): Promise<Result<Permission | null>> {
    const normalized = name.trim().toLowerCase();
    for (const perm of this.permissions.values()) {
      if (perm.name === normalized) {
        return Promise.resolve(Result.ok(perm));
      }
    }
    return Promise.resolve(Result.ok(null));
  }

  public findAll(): Promise<Result<Permission[]>> {
    return Promise.resolve(Result.ok(Array.from(this.permissions.values())));
  }

  public save(permission: Permission): Promise<Result<void>> {
    this.permissions.set(permission.permissionId.value, permission);
    return Promise.resolve(Result.ok(undefined));
  }

  private seedDefaults(): void {
    const p1 = Permission.create({ name: 'identity.login', description: 'Authenticate' }).value;
    const p2 = Permission.create({ name: 'users.read', description: 'Read user profiles' }).value;
    const p3 = Permission.create({ name: 'users.write', description: 'Modify users' }).value;
    const p4 = Permission.create({ name: 'admin.manage', description: 'Admin management' }).value;

    this.permissions.set(p1.permissionId.value, p1);
    this.permissions.set(p2.permissionId.value, p2);
    this.permissions.set(p3.permissionId.value, p3);
    this.permissions.set(p4.permissionId.value, p4);
  }
}

export class InMemoryRoleRepository implements IRoleRepository {
  private readonly roles: Map<string, Role> = new Map();

  constructor() {
    this.seedDefaults();
  }

  public findById(id: RoleId): Promise<Result<Role | null>> {
    const role = this.roles.get(id.value);
    return Promise.resolve(Result.ok(role ?? null));
  }

  public findByName(name: string): Promise<Result<Role | null>> {
    const normalized = name.trim().toLowerCase();
    for (const role of this.roles.values()) {
      if (role.name === normalized) {
        return Promise.resolve(Result.ok(role));
      }
    }
    return Promise.resolve(Result.ok(null));
  }

  public findAll(): Promise<Result<Role[]>> {
    return Promise.resolve(Result.ok(Array.from(this.roles.values())));
  }

  public save(role: Role): Promise<Result<void>> {
    this.roles.set(role.roleId.value, role);
    return Promise.resolve(Result.ok(undefined));
  }

  private seedDefaults(): void {
    const p1 = Permission.create({ name: 'identity.login', description: 'Authenticate' }).value;
    const p2 = Permission.create({ name: 'users.read', description: 'Read user profiles' }).value;
    const p3 = Permission.create({ name: 'users.write', description: 'Modify users' }).value;
    const p4 = Permission.create({ name: 'admin.manage', description: 'Admin management' }).value;

    const researcherRole = Role.create({
      name: 'researcher',
      description: 'Standard Researcher Role',
      permissions: [p1, p2],
    }).value;

    const adminRole = Role.create({
      name: 'admin',
      description: 'Administrator Role',
      permissions: [p1, p2, p3, p4],
    }).value;

    this.roles.set(researcherRole.roleId.value, researcherRole);
    this.roles.set(adminRole.roleId.value, adminRole);
  }
}

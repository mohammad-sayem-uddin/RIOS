/**
 * Inversion of Control (IoC) Dependency Injection Container.
 *
 * Architecture reference:
 * Infrastructure Layer — Composition Root & Dependency Injection.
 *
 * Features:
 * - Lifetime management: SINGLETON, SCOPED, TRANSIENT.
 * - Circular dependency graph detection during resolution.
 * - Constructor and factory injection (No service locator in Domain/Application/Repositories).
 * - Scoped child containers for transaction or request isolation.
 */

import { Result } from '@rios/shared';

import type { DIToken } from './tokens.js';

export const Lifetime = {
  SINGLETON: 'SINGLETON',
  SCOPED: 'SCOPED',
  TRANSIENT: 'TRANSIENT',
} as const;

export type LifetimeType = (typeof Lifetime)[keyof typeof Lifetime];

export type FactoryFunction<T> = (container: Container) => T;

export interface Registration<T = unknown> {
  token: DIToken;
  lifetime: LifetimeType;
  factory: FactoryFunction<T>;
}

export class Container {
  private readonly registrations = new Map<DIToken, Registration>();
  private readonly singletonCache = new Map<DIToken, unknown>();
  private readonly scopedCache = new Map<DIToken, unknown>();
  private readonly activeResolutions = new Set<DIToken>();

  constructor(private readonly parent?: Container) {}

  registerInstance<T>(token: DIToken, instance: T): this {
    this.registrations.set(token, {
      token,
      lifetime: Lifetime.SINGLETON,
      factory: () => instance,
    });
    this.singletonCache.set(token, instance);
    return this;
  }

  registerFactory<T>(
    token: DIToken,
    factory: FactoryFunction<T>,
    lifetime: LifetimeType = Lifetime.SINGLETON,
  ): this {
    this.registrations.set(token, {
      token,
      lifetime,
      factory: factory,
    });
    return this;
  }

  has(token: DIToken): boolean {
    return this.registrations.has(token) || (this.parent?.has(token) ?? false);
  }

  resolve<T>(token: DIToken): T {
    const tokenKey = String(token);

    if (this.isResolving(token)) {
      throw new Error(
        `Circular dependency detected: token [${tokenKey}] is already being resolved`,
      );
    }

    // Check caches
    if (this.singletonCache.has(token)) {
      return this.singletonCache.get(token) as T;
    }

    if (this.parent !== undefined && this.parent.singletonCache.has(token)) {
      return this.parent.singletonCache.get(token) as T;
    }

    if (this.scopedCache.has(token)) {
      return this.scopedCache.get(token) as T;
    }

    const registration =
      this.registrations.get(token) ??
      (this.parent !== undefined ? this.parent.findRegistration(token) : undefined);

    if (registration === undefined) {
      throw new Error(`No registration found for DI token: ${tokenKey}`);
    }

    this.activeResolutions.add(token);

    let instance: T;
    try {
      instance = registration.factory(this) as T;
    } finally {
      this.activeResolutions.delete(token);
    }

    if (registration.lifetime === Lifetime.SINGLETON) {
      const rootContainer = this.getRootContainer();
      rootContainer.singletonCache.set(token, instance);
    } else if (registration.lifetime === Lifetime.SCOPED) {
      this.scopedCache.set(token, instance);
    }

    return instance;
  }

  tryResolve<T>(token: DIToken): Result<T> {
    try {
      const instance = this.resolve<T>(token);
      return Result.ok(instance);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return Result.fail<T>(`DI Resolution failure for token [${String(token)}]: ${message}`);
    }
  }

  createScope(): Container {
    return new Container(this);
  }

  private isResolving(token: DIToken): boolean {
    if (this.activeResolutions.has(token)) {
      return true;
    }
    return this.parent !== undefined ? this.parent.isResolving(token) : false;
  }

  private findRegistration(token: DIToken): Registration | undefined {
    return this.registrations.get(token) ?? this.parent?.findRegistration(token);
  }

  private getRootContainer(): Container {
    return this.parent !== undefined ? this.parent.getRootContainer() : this;
  }
}
